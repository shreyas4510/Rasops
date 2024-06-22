import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { PAYMENT_PREFERENCE } from '../models/preferences.model.js';
import paymentGatewayEntitiesRepo from '../repositories/paymentGatewayEntities.repository.js';
import preferencesRepo from '../repositories/preferences.repository.js';
import { CustomError } from '../utils/common.js';
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

export default {
    business,
    stakeholder,
    account
};
