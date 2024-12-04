import Razorpay from 'razorpay';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const razorpay = new Razorpay({
    // eslint-disable-next-line camelcase
    key_id: env.razorpay.keyId,

    // eslint-disable-next-line camelcase
    key_secret: env.razorpay.keySecret
});

const createLinkedAccount = async (payload) => {
    try {
        const linkedAccount = await razorpay.accounts.create(payload);
        return linkedAccount;
    } catch (error) {
        logger('error', 'Error while creating linked account', { error });
        throw CustomError(error.code, error.message);
    }
};

const createStakeholder = async (accountId, payload) => {
    try {
        const stakeholder = await razorpay.stakeholders.create(accountId, payload);
        return stakeholder;
    } catch (error) {
        logger('error', 'Error while creating stakeholder', { error });
        throw CustomError(error.code, error.message);
    }
};

const requestProduct = async (accountId, payload) => {
    try {
        const product = await razorpay.products.requestProductConfiguration(accountId, payload);
        return product;
    } catch (error) {
        logger('error', 'Error while requesting product', { error });
        throw CustomError(error.code, error.message);
    }
};

const updateProduct = async (accountId, productId, payload) => {
    try {
        const product = await razorpay.products.edit(accountId, productId, payload);
        return product;
    } catch (error) {
        logger('error', 'Error while updating product', { error });
        throw CustomError(error.code, error.message);
    }
};

const subscribe = async (payload) => {
    try {
        const subscription = await razorpay.subscriptions.create(payload);
        return subscription;
    } catch (error) {
        logger('error', 'Error while creating subscription product', { error });
        throw CustomError(error.code, error.message);
    }
};

const fetch = async (subscriptionId) => {
    try {
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        return subscription;
    } catch (error) {
        logger('error', 'Error while fetching subscription product', { error });
        throw CustomError(error.code, error.message);
    }
};

const order = async (data) => {
    try {
        const order = await razorpay.orders.create(data);
        return order;
    } catch (error) {
        logger('error', 'Error while creating order', { error });
        throw CustomError(error.code, error.message);
    }
};

const cancel = async (subscriptionId, cancelAtCycleEnd = false) => {
    try {
        const cancelResponse = await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
        return cancelResponse;
    } catch (error) {
        logger('error', 'Error while canceling subscription', { error });
        throw CustomError(error.code, error.message);
    }
};

const getPlan = async (planId) => {
    try {
        const data = await razorpay.plans.fetch(planId);
        return data;
    } catch (error) {
        logger('error', 'Error while fetching plan', { error });
        throw CustomError(error.code, error.message);
    }
};

const refund = async (paymentId, amount) => {
    try {
        const data = await razorpay.payments.refund(paymentId, { amount });
        return data;
    } catch (error) {
        logger('error', 'Error while fetching plan', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    createLinkedAccount,
    createStakeholder,
    requestProduct,
    updateProduct,
    subscribe,
    fetch,
    order,
    cancel,
    getPlan,
    refund
};
