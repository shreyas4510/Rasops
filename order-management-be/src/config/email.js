import nodemailer from 'nodemailer';
import env from './env.js';

export const transporter = nodemailer.createTransport({
	service: env.email.service,
	host: env.email.host,
	port: env.email.port,
	secure: env.email.secure,
	auth: {
		user: env.email.user,
		pass: env.email.pass
	}
});
