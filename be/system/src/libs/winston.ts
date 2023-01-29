import winston from 'winston';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const winstonColor = winston.format.colorize({
  level: true,
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    http: 'cyan',
  },
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'ddd, DD/MM/YYYY hh:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${winstonColor.colorize(
          level,
          `LOGGER:: SYSTEM: [${level}: ${timestamp}]`
        )} ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export const morganLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'ddd, DD/MM/YYYY hh:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) =>
      winstonColor.colorize(
        level,
        `LOGGER:: API: [${level}: ${timestamp}] ${message}`
      )
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export const dbLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'ddd, DD/MM/YYYY hh:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${winstonColor.colorize(
          level,
          `LOGGER:: DB: [${level}: ${timestamp}]`
        )} ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export const kafkaLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'ddd, DD/MM/YYYY hh:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${winstonColor.colorize(
          level,
          `LOGGER:: KAFKA: [${level}: ${timestamp}]`
        )} ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export default logger;
