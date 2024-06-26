import CryptoJS from 'crypto-js';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { PAYMENT_PREFERENCE } from '../models/preferences.model.js';
import { USER_ROLES } from '../models/user.model.js';
import hotelUserRelationRepo from '../repositories/hotelUserRelation.repository.js';
import paymentGatewayEntitiesRepo from '../repositories/paymentGatewayEntities.repository.js';
import preferencesRepo from '../repositories/preferences.repository.js';
import subscriptionRepo from '../repositories/subscription.repository.js';
import notificationService from '../services/notification.service.js';
import { CustomError, EMAIL_ACTIONS, PLANS, STATUS_CODE } from '../utils/common.js';
import { sendEmail } from './email.service.js';
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
        addresses.street1 = payload.addresses?.registered?.street1 ? payload.addresses?.registered?.street1 : undefined;
        addresses.street2 = payload.addresses?.registered?.street2 ? payload.addresses?.registered?.street2 : undefined;
        addresses.city = payload.addresses?.registered?.city ? payload.addresses?.registered?.city : undefined;
        addresses.state = payload.addresses?.registered?.state ? payload.addresses?.registered?.state : undefined;
        // eslint-disable-next-line camelcase
        addresses.postal_code = payload.addresses?.registered?.postalCode
            ? payload.addresses?.registered?.postalCode
            : undefined;
        addresses.country = payload.addresses?.registered?.country ? payload.addresses?.registered?.country : undefined;
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
            stakeholderDetails.profile.addresses = { residential: { ...addresses } };
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
        case PLANS.BASIC_MONTHLY:
            return {
                planId: env.plans.basicMonthly,
                tables: 50
            };
        case PLANS.BASIC_YEARLY:
            return {
                planId: env.plans.basicYearly,
                tables: 50
            };
        case PLANS.STANDARD_MONTHLY:
            return {
                planId: env.plans.standardMonthly,
                tables: 100
            };
        case PLANS.STANDARD_YEARLY:
            return {
                planId: env.plans.standardYearly,
                tables: 100
            };
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

        const { planId, tables } = getPlanId(payload.plan);

        // eslint-disable-next-line camelcase
        const data = { plan_id: planId, total_count: 1 };
        logger('debug', `Request to create subscription data`, data);
        const subscription = await razorpayService.subscribe(data);

        const options = {
            id: uuidv4(),
            hotelId: payload.hotelId,
            subscriptionId: subscription.id,
            planId: payload.plan,
            tables
        };
        logger('debug', `Options to store in table`, options);
        await subscriptionRepo.save(options);

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
            startDate: moment(subscription.current_start).toISOString(),
            endDate: moment(subscription.current_end).toISOString()
        };
        logger('debug', `Update subscription on success`, { options, data });
        await subscriptionRepo.update(options, data);

        await notificationService.sendNotification(userId, {
            title: 'Subscription Done',
            message: `You have successfully subscribed to plan - ${subscription.plan_id}`
        });
        return { message: 'Success' };
    } catch (error) {
        logger('error', 'Error in subscription success', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    business,
    stakeholder,
    account,
    subscribe,
    success
};
