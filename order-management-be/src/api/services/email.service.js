import { readFileSync } from 'fs';
import Mustache from 'mustache';
import { transporter } from '../../config/email.js';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { EMAIL_ACTIONS, CustomError } from '../utils/common.js';

const getEmailData = (action, payload) => {
    let path = '';
    let template = '';
    let url = '';
    switch (action) {
        case EMAIL_ACTIONS.VERIFY_USER:
            path = `${process.cwd()}/src/api/templates/verifyEmail.html`;
            template = readFileSync(path, 'utf8');
            url = `${env.app.appUrl}/verify?token=${encodeURIComponent(payload.token)}`;

            return {
                subject: 'Re: Email Verification',
                template: Mustache.render(template, { appUrl: url })
            };
        case EMAIL_ACTIONS.FORGOT_PASSWORD:
            path = `${process.cwd()}/src/api/templates/forgotPassword.html`;
            template = readFileSync(path, 'utf8');
            url = `${env.app.appUrl}/reset?token=${encodeURIComponent(payload.token)}`;

            return {
                subject: 'Re: Recover Password',
                template: Mustache.render(template, { appUrl: url })
            };
        case EMAIL_ACTIONS.INVITE_MANAGER:
            path = `${process.cwd()}/src/api/templates/inviteManager.html`;
            template = readFileSync(path, 'utf8');
            url = `${env.app.appUrl}/signup?token=${encodeURIComponent(payload.token)}`;

            return {
                subject: 'Re: Invite Manager',
                template: Mustache.render(template, {
                    appUrl: url,
                    ownerName: payload.name
                })
            };
        default:
            break;
    }
};

export const sendEmail = async (payload, to, action) => {
    try {
        // create the email data
        const data = getEmailData(action, payload);

        logger('debug', `Email data prepared: ${JSON.stringify(data)}`);
        const options = {
            from: env.email.user,
            to,
            subject: data.subject,
            html: data.template
        };

        // send email to the user
        logger('info', `Sending email to: ${to}`);
        return await transporter.sendMail(options);
    } catch (error) {
        logger('error', `Error occurred while sending email: ${error}`);
        throw CustomError(error.code, error.message);
    }
};
