import CryptoJS from 'crypto-js';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { ORDER_STATUS } from '../models/order.model.js';
import { PAYMENT_PREFERENCE } from '../models/preferences.model.js';
import { SUBSCRIPTION_STATUS } from '../models/subscriptions.js';
import { TABLE_STATUS } from '../models/table.model.js';
import { USER_ROLES } from '../models/user.model.js';
import customerRepo from '../repositories/customer.repository.js';
import hotelUserRelationRepo from '../repositories/hotelUserRelation.repository.js';
import orderRepo from '../repositories/order.repository.js';
import paymentGatewayEntitiesRepo from '../repositories/paymentGatewayEntities.repository.js';
import preferencesRepo from '../repositories/preferences.repository.js';
import subscriptionRepo from '../repositories/subscription.repository.js';
import tableRepo from '../repositories/table.repository.js';
import notificationService from '../services/notification.service.js';
import {
    CustomError,
    EMAIL_ACTIONS,
    NOTIFICATION_ACTIONS,
    PLANS,
    STATUS_CODE,
    calculateBill
} from '../utils/common.js';
import { createInvoicePdf } from '../utils/pdfGenerator.js';
import { sendEmail } from './email.service.js';
import orderService from './order.service.js';
import razorpayService from './razorpay.service.js';

const business = async (userId, payload) => {
    try {
        const accountDetails = {
            email: payload.email,
            phone: payload.phone,
            // eslint-disable-next-line camelcase
            legal_business_name: payload.legalBusinessName,
            // eslint-disable-next-line camelcase
            business_type: payload.businessType,
            type: 'route',
            // eslint-disable-next-line camelcase
            legal_info: {
                pan: payload.legalInfo.pan,
                gst: payload.legalInfo.gst
            }
        };

        const profile = {};
        profile.category = payload.profile.category ? payload.profile.category : undefined;
        profile.subcategory = payload.profile.subcategory ? payload.profile.subcategory : undefined;
        if (Object.values(profile).find((obj) => obj !== undefined)) {
            accountDetails.profile = { ...profile };
        }

        const addresses = {};
        addresses.street1 = payload.profile.addresses?.registered?.street1
            ? payload.profile.addresses?.registered?.street1
            : undefined;
        addresses.street2 = payload.profile.addresses?.registered?.street2
            ? payload.profile.addresses?.registered?.street2
            : undefined;
        addresses.city = payload.profile.addresses?.registered?.city
            ? payload.profile.addresses?.registered?.city
            : undefined;
        addresses.state = payload.profile.addresses?.registered?.state
            ? payload.profile.addresses?.registered?.state
            : undefined;
        // eslint-disable-next-line camelcase
        addresses.postal_code = payload.profile.addresses?.registered?.postalCode
            ? payload.profile.addresses?.registered?.postalCode
            : undefined;
        addresses.country = payload.profile.addresses?.registered?.country
            ? payload.profile.addresses?.registered?.country
            : undefined;
        if (Object.values(addresses).find((obj) => obj !== undefined)) {
            accountDetails.profile.addresses = { registered: { ...addresses } };
        }
        // eslint-enable camelcase

        logger('debug', 'Registering business to razorpay:', accountDetails);
        const account = await razorpayService.createLinkedAccount(accountDetails);

        const options = {
            id: uuidv4(),
            userId,
            accountId: account.id
        };
        const gatewayDetails = await paymentGatewayEntitiesRepo.save(options);
        logger('debug', 'Gateway details stored successfully', gatewayDetails);

        const preference = await preferencesRepo.update({ where: { userId } }, { payment: PAYMENT_PREFERENCE[1] });
        logger('debug', 'payment preference updated for user', { userId, preference });

        return { accountId: account.id };
    } catch (error) {
        logger('error', 'Error while storing business details', { error });
        throw CustomError(error.code, error.message);
    }
};

const stakeholder = async (userId, payload) => {
    try {
        const options = { where: { userId } };
        const paymentGatewayDetails = await paymentGatewayEntitiesRepo.find(options);
        logger('debug', `payment gateway details for user ${userId}`, paymentGatewayDetails);

        const stakeholderDetails = {
            name: payload.name,
            email: payload.email,
            kyc: {
                pan: payload.kyc.pan
            }
        };

        const addresses = {};
        addresses.street = payload.addresses?.residential?.street ? payload.addresses?.residential?.street : undefined;
        addresses.city = payload.addresses?.residential?.city ? payload.addresses?.residential?.city : undefined;
        addresses.state = payload.addresses?.residential?.state ? payload.addresses?.residential?.state : undefined;
        // eslint-disable-next-line camelcase
        addresses.postal_code = payload.addresses?.residential?.postalCode
            ? payload.addresses?.residential?.postalCode
            : undefined;
        addresses.country = payload.addresses?.residential?.country
            ? payload.addresses?.residential?.country
            : undefined;
        if (Object.values(addresses).find((obj) => obj !== undefined)) {
            stakeholderDetails.addresses = { residential: { ...addresses } };
        }

        logger('debug', 'Registering stakeholder to razorpay:', stakeholderDetails);
        const stakeholder = await razorpayService.createStakeholder(
            paymentGatewayDetails.accountId,
            stakeholderDetails
        );

        const gatewayDetails = await paymentGatewayEntitiesRepo.update(
            { where: { userId } },
            { stakeholderId: stakeholder.id }
        );
        logger('debug', 'Gateway details updated successfully', gatewayDetails);

        const preference = await preferencesRepo.update({ where: { userId } }, { payment: PAYMENT_PREFERENCE[2] });
        logger('debug', 'payment preference updated for user', { userId, preference });

        return { stakeholderId: stakeholder.id };
    } catch (error) {
        logger('error', 'Error while storing stakeholder details', { error });
        throw CustomError(error.code, error.message);
    }
};

const account = async (userId, token) => {
    try {
        const options = { where: { userId } };
        const paymentGatewayDetails = await paymentGatewayEntitiesRepo.find(options);
        logger('debug', `payment gateway details for user ${userId}`, paymentGatewayDetails);

        const payload = JSON.parse(CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8));
        logger('debug', 'bank details to attach to payment gateway', payload);

        const requestProductPayload = {
            // eslint-disable-next-line camelcase
            product_name: 'route',
            // eslint-disable-next-line camelcase
            tnc_accepted: true
        };

        const product = await razorpayService.requestProduct(paymentGatewayDetails.accountId, requestProductPayload);
        logger('debug', 'Product details requested', product);

        const updateProductPayload = {
            settlements: {
                // eslint-disable-next-line camelcase
                account_number: token.accountNumber,
                // eslint-disable-next-line camelcase
                ifsc_code: token.ifscCode,
                // eslint-disable-next-line camelcase
                beneficiary_name: token.beneficiaryName
            },
            // eslint-disable-next-line camelcase
            tnc_accepted: true
        };
        logger('debug', 'Payload to update product', updateProductPayload);
        await razorpayService.updateProduct(paymentGatewayDetails.accountId, product.id, updateProductPayload);

        const gatewayDetails = await paymentGatewayEntitiesRepo.update(
            { where: { userId } },
            { productId: product.id }
        );
        logger('debug', 'Gateway details updated successfully', gatewayDetails);

        const preference = await preferencesRepo.update({ where: { userId } }, { payment: PAYMENT_PREFERENCE[3] });
        logger('debug', 'payment preference updated for user', { userId, preference });

        return { productId: product.id };
    } catch (error) {
        logger('error', 'Error while storing bank details', { error });
        throw CustomError(error.code, error.message);
    }
};

const getPlanId = (planId) => {
    switch (planId) {
        case PLANS.STANDARD_MONTHLY:
            return env.plans.standaranMonthly;
        case PLANS.STANDARD_YEARLY:
            return env.plans.standardYearly;
        default:
            throw CustomError(STATUS_CODE.BAD_REQUEST, 'Invalid Plan id');
    }
};

const subscribe = async (payload) => {
    try {
        if (payload.plan === PLANS.CUSTOM) {
            const hotelOptions = {
                where: {
                    hotelId: payload.hotelId
                },
                attributes: ['userId', 'hotelId'],
                include: [
                    {
                        model: db.users,
                        where: { role: USER_ROLES[0] },
                        attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
                    },
                    {
                        model: db.hotel,
                        attributes: ['name']
                    }
                ]
            };

            const { rows } = await hotelUserRelationRepo.find(hotelOptions);
            const { user, hotel } = rows[0];
            const emailData = {
                name: `${user.firstName} ${user.lastName}`,
                phoneNumber: `${user.phoneNumber}`,
                hotelName: `${hotel.name}`,
                email: `${user.email}`
            };
            logger('debug', 'payload to send email to support', emailData);
            await sendEmail(emailData, env.supportEmail, EMAIL_ACTIONS.CUSTOM_SUBSCRIPTION);
            return {
                message:
                    'Thank you for contacting us! We have received your request for a custom plan. Our team will assist you shortly.'
            };
        }

        const planId = getPlanId(payload.plan);
        const hotelSubscription = await subscriptionRepo.findOne({
            where: { hotelId: payload.hotelId }
        });

        // eslint-disable-next-line camelcase
        const data = { plan_id: planId, total_count: 1 };
        logger('debug', `Request to create subscription data`, data);
        const subscription = await razorpayService.subscribe(data);

        if (!hotelSubscription) {
            const options = {
                id: uuidv4(),
                hotelId: payload.hotelId,
                subscriptionId: subscription.id,
                planId: subscription.plan_id,
                planName: payload.plan
            };
            logger('debug', `Options to store in table`, options);
            await subscriptionRepo.save(options);
        } else {
            const options = { where: { hotelId: payload.hotelId } };
            const data = {
                subscriptionId: subscription.id,
                planId: subscription.plan_id,
                planName: payload.plan
            };
            logger('debug', `Existing subscription updated`, { options, data });
            await subscriptionRepo.update(options, data);
        }

        return { id: subscription.id };
    } catch (error) {
        logger('error', 'Error while creating subscription', { error });
        throw CustomError(error.code, error.message);
    }
};

const success = async (userId, payload) => {
    try {
        const subscription = await razorpayService.fetch(payload.subscriptionId);
        logger('debug', `Subscription details`, subscription);

        const options = { where: { subscriptionId: payload.subscriptionId } };
        const data = {
            customerId: subscription.customer_id,
            paymentId: payload.paymentId,
            status: SUBSCRIPTION_STATUS[0],
            startDate: moment(subscription.current_start * 1000).toISOString(),
            endDate: moment(subscription.current_end * 1000).toISOString()
        };
        logger('debug', `Update subscription on success`, { options, data });
        await subscriptionRepo.update(options, data);

        await notificationService.sendNotification([userId], {
            title: 'Subscription Done',
            message: `You have successfully subscribed to plan - ${subscription.plan_id}`
        });
        return { message: 'Success' };
    } catch (error) {
        logger('error', 'Error in subscription success', { error });
        throw CustomError(error.code, error.message);
    }
};

const payment = async ({ customerId, hotelId, manual }) => {
    try {
        const options = {
            where: {
                customerId,
                status: ORDER_STATUS[1]
            }
        };
        const { rows: orders } = await orderRepo.find(options);
        const { rows } = await customerRepo.find({
            where: { id: customerId },
            include: [{ model: db.tables }]
        });
        const customer = rows[0];
        logger('debug', 'Customer details', customer);

        const price = orders.reduce((cur, next) => {
            cur += next.price;
            return cur;
        }, 0);

        const { totalPrice } = calculateBill(price);
        logger('info', `total price for ${customerId} - ${totalPrice}`);
        if (manual) {
            const userIds = await orderService.getNotificationUserIds(hotelId);
            await notificationService.sendNotification(userIds, {
                title: 'Payment Request',
                message: `Payment request for Table-${customer.table.tableNumber} of amount ${totalPrice}. Please approve once the payment is done.`,
                path: 'orders',
                meta: {
                    action: NOTIFICATION_ACTIONS.PAYMENT_REQUEST,
                    tableId: customer.table.id,
                    customerId,
                    tableNumber: customer.table.tableNumber,
                    totalPrice
                }
            });
            return { message: 'Success' };
        } else {
            const payload = {
                amount: totalPrice * 100,
                currency: 'INR',
                receipt: `online payment receipt`
            };
            const order = await razorpayService.order(payload);
            return {
                email: customer.email,
                name: customer.name,
                phoneNumber: customer.phoneNumber,
                orderId: order.id,
                amount: payload.amount
            };
        }
    } catch (error) {
        logger('error', 'Error while order payment ', { error });
        throw CustomError(error.code, error.message);
    }
};

const paymentConfirmation = async (payload) => {
    try {
        const { customerId } = payload;

        let { rows: customerDetails } = await customerRepo.find({
            where: { id: customerId },
            attributes: ['id', 'name', 'email'],
            include: [
                {
                    model: db.hotel,
                    attributes: ['id', 'name', 'careNumber']
                },
                {
                    model: db.orders,
                    attributes: ['quantity', 'price'],
                    include: [
                        {
                            model: db.menu,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: db.tables,
                    attributes: ['tableNumber']
                }
            ]
        });
        customerDetails = customerDetails[0];

        const orderOptions = {
            options: { where: { customerId } },
            data: {
                status: ORDER_STATUS[3]
            }
        };

        if (!payload.manual) {
            orderOptions.data.razorpayOrderId = payload.orderId;
            orderOptions.data.razorpayPaymentId = payload.paymentId;
        } else {
            orderOptions.data.razorpayOrderId = 'manual';
            orderOptions.data.razorpayPaymentId = 'manual';
        }

        const orderRes = await orderRepo.update(orderOptions.options, orderOptions.data);
        logger('debug', 'Order updated response', orderRes);

        const tableOptions = {
            options: { where: { customerId } },
            data: { status: TABLE_STATUS[0], customerId: null }
        };
        const tableRes = await tableRepo.update(tableOptions.options, tableOptions.data);
        logger('debug', 'Table details updated', tableRes);

        const invoicePdfData = [['Item', 'Quantity', 'Price']];
        let price = 0;
        customerDetails.orders.forEach((order) => {
            invoicePdfData.push([order.menu.name, String(order.quantity), String(order.price)]);
            price += order.price;
        });

        const { sgst, cgst, totalPrice } = calculateBill(price);
        [
            { label: 'SGST', value: sgst },
            { label: 'CGST', value: cgst },
            { label: 'Total', value: totalPrice }
        ].forEach((obj) => {
            invoicePdfData.push(['', obj.label, String(obj.value)]);
        });

        if (payload.manual) {
            await notificationService.sendNotification(
                undefined,
                {
                    title: 'Payment Confirmed',
                    message: `Payment successfully confirmed`,
                    meta: {
                        action: NOTIFICATION_ACTIONS.MANUAL_PAYMENT_CONFIRMED,
                        tableNumber: customerDetails.table.tableNumber
                    }
                },
                customerId
            );
        } else {
            const userIds = await orderService.getNotificationUserIds(customerDetails.hotel.id);
            await notificationService.sendNotification(userIds, {
                title: 'Payment Received',
                message: `Payment recieved successfully for Table Number-${customerDetails.table.tableNumber} of amount ${totalPrice}rs`,
                meta: {
                    tableNumber: customerDetails.table.tableNumber,
                    action: NOTIFICATION_ACTIONS.ONLINE_PAYMENT_CONFIRMED,
                    hotelId: customerDetails.hotel.id
                }
            });
        }

        // send mail to customer
        const pdfData = await createInvoicePdf({
            title: customerDetails.hotel.name,
            customerId: customerDetails.id,
            customerName: customerDetails.name,
            date: moment().format('DD-MMM-YYYY'),
            tableNumber: String(customerDetails.table.tableNumber),
            invoiceNumber: payload.orderId,
            totalAmount: String(totalPrice),
            tableData: invoicePdfData
        });

        const emailOptions = {
            hotelName: customerDetails.hotel.name,
            customerName: customerDetails.name,
            hotelContact: customerDetails.hotel.careNumber
        };
        await sendEmail(emailOptions, customerDetails.email, EMAIL_ACTIONS.INVOICE_EMAIL, [
            {
                filename: `invoice-${payload.orderId}.pdf`,
                content: pdfData,
                encoding: 'base64'
            }
        ]);

        return { message: 'Success' };
    } catch (error) {
        logger('error', 'Error while order payment confirmation', { error });
        throw CustomError(error.code, error.message);
    }
};

const calculateRefundAmount = (subscription, plan) => {
    try {
        const amount = plan.item.amount / 100;
        const totalDays = moment(subscription.endDate, 'YYYY-MM-DD hh:mm:ss')
            .startOf('day')
            .diff(moment(subscription.startDate, 'YYYY-MM-DD hh:mm:ss').startOf('day'), 'days');
        const remainingDays = moment(subscription.endDate, 'YYYY-MM-DD hh:mm:ss').startOf('day').diff(moment(), 'days');
        return Math.round(remainingDays * (amount / totalDays));
    } catch (error) {
        logger('error', 'Error while calculate refund amount', { error });
        throw CustomError(error.code, error.message);
    }
};

const cancel = async (payload) => {
    try {
        const { subscriptionId, cancelImmediately } = payload;
        logger('debug', `Payload for cancel subscription`, payload);

        const subscriptionOptions = {
            where: { subscriptionId },
            attributes: ['id', 'subscriptionId', 'planId', 'paymentId', 'startDate', 'endDate', 'status']
        };
        const subscription = await subscriptionRepo.findOne(subscriptionOptions);
        logger('debug', `Subscription details`, { subscription });

        if (!subscription) {
            throw CustomError(STATUS_CODE.NOT_FOUND, 'Subscription not found');
        }

        if (subscription.status === SUBSCRIPTION_STATUS[1]) {
            throw CustomError(
                STATUS_CODE.NOT_FOUND,
                'Subscription is already cancelled. Please allow 24 hours for the refund to reflect. If the issue persists, contact customer care.'
            );
        }

        try {
            await razorpayService.cancel(subscriptionId, cancelImmediately);
            logger('debug', `Subscription cancelled successfully`);
        } catch (error) {
            logger('error', `Failed to cancel subscription - ${subscriptionId} | error - ${error.message}`);
        }

        if (cancelImmediately) {
            const plan = await razorpayService.getPlan(subscription.planId);
            logger('debug', `Plan details on cancel subscription`, { plan });

            if (!plan) {
                throw CustomError(STATUS_CODE.NOT_FOUND, 'Invalid Plan');
            }

            const refundAmount = calculateRefundAmount(subscription, plan);
            logger('debug', `Refund amount`, { refundAmount });
            await razorpayService.refund(subscription.paymentId, refundAmount * 100);

            const options = { where: { id: subscription.id } };
            const data = {
                endDate: moment().endOf('day').toISOString(),
                status: SUBSCRIPTION_STATUS[1]
            };

            logger('debug', `Update subscription on cancel subscription`, { options, data });
            await subscriptionRepo.update(options, data);
        }

        return {
            message: cancelImmediately
                ? 'Subscription canceled immediately and refund processed.'
                : 'Subscription canceled at the end of the period.'
        };
    } catch (error) {
        logger('error', 'Error while canceling subscription', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    business,
    stakeholder,
    account,
    subscribe,
    success,
    payment,
    paymentConfirmation,
    cancel
};
