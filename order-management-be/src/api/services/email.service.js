import { readFileSync } from 'fs';
import path from 'path';
import Mustache from 'mustache';
import { transporter } from '../../config/email.js';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { EMAIL_ACTIONS, CustomError } from '../utils/common.js';

const getEmailData = (action, payload) => {
    let template = '';
    let url = '';
    let filePath = '';
    switch (action) {
        case EMAIL_ACTIONS.VERIFY_USER:
            filePath = path.join(process.cwd(), `src/api/templates/verifyEmail.html`);
            template = readFileSync(filePath, 'utf8');
            url = `${env.app.appUrl}/verify?token=${encodeURIComponent(payload.token)}`;

            return {
                subject: 'Re: Email Verification',
                template: Mustache.render(template, { appUrl: url })
            };
        case EMAIL_ACTIONS.FORGOT_PASSWORD:
            filePath = path.join(process.cwd(), `src/api/templates/forgotPassword.html`);
            template = readFileSync(filePath, 'utf8');
            url = `${env.app.appUrl}/reset?token=${encodeURIComponent(payload.token)}`;

            return {
                subject: 'Re: Recover Password',
                template: Mustache.render(template, { appUrl: url })
            };
        case EMAIL_ACTIONS.INVITE_MANAGER:
            filePath = path.join(process.cwd(), `src/api/templates/inviteManager.html`);
            template = readFileSync(filePath, 'utf8');
            url = `${env.app.appUrl}/signup?token=${encodeURIComponent(payload.token)}`;

            return {
                subject: 'Re: Invite Manager',
                template: Mustache.render(template, {
                    appUrl: url,
                    ownerName: payload.name
                })
            };
        case EMAIL_ACTIONS.CUSTOM_SUBSCRIPTION:
            filePath = path.join(process.cwd(), `src/api/templates/customSubscription.html`);
            template = readFileSync(filePath, 'utf8');

            return {
                subject: 'Re: Custom Subscription Request',
                template: Mustache.render(template, { ...payload })
            };
        case EMAIL_ACTIONS.INVOICE_EMAIL:
            filePath = path.join(process.cwd(), `src/api/templates/invoiceEmail.html`);
            template = readFileSync(filePath, 'utf8');

            return {
                subject: 'Re: Customer Invoice',
                template: Mustache.render(template, { ...payload })
            };
        default:
            break;
    }
};

export const sendEmail = async (payload, to, action, attachments = []) => {
    try {
        // create the email data
        const data = getEmailData(action, payload);

        logger('debug', `Email data prepared: ${JSON.stringify(data)}`);
        const options = {
            from: env.email.user,
            to,
            subject: data.subject,
            html: data.template,
            attachments
        };

        // send email to the user
        logger('info', `Sending email to: ${to}`);
        return await transporter.sendMail(options);
    } catch (error) {
        logger('error', `Error occurred while sending email: ${error}`);
        throw CustomError(error.code, error.message);
    }
};
