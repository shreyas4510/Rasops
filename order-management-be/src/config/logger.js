import moment from 'moment';
import { format, createLogger, addColors, transports } from 'winston';

const { combine, colorize, simple } = format;
const { Console } = transports;

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan'
};

addColors(colors);

const log = createLogger({
    level: 'debug',
    format: combine(colorize({ all: true }), simple()),
    transports: [new Console()]
});

export const logger = (level, message, payload) => {
    if (!Object.keys(colors).includes(level)) {
        throw new Error('Incorrect value of level');
    }
    log[level](`${moment().toISOString()} - ${JSON.stringify(message)}`);
    if (payload) {
        log[level](JSON.stringify(payload));
    }
};

export default logger;
