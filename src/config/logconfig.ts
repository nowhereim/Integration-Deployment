import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as SlackHook from 'winston-slack-webhook-transport';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const logDir = 'logs';

const slackLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: 'warn',
  transports: [
    new SlackHook({
      webhookUrl: process.env.HOOK_URL,
      level: 'warn',
      formatter: (info) => ({
        text: info.message,
      }),
    }),
  ],
});

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
        winston.format.printf(
          ({ timestamp, level, stack, message, ...meta }) => {
            return JSON.stringify({
              timestamp,
              level,
              stack,
              message,
              ...meta,
            });
          },
        ),
      ),
    }),

    new winston.transports.DailyRotateFile({
      filename: `${logDir}/application-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};

const logger = winston.createLogger(winstonConfig);

const logToSlackOnly = (level: string, message: string) => {
  slackLogger.log({ level, message });
};

export { logger, logToSlackOnly };
