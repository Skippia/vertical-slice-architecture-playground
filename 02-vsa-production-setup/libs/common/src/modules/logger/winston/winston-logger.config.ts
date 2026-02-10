/* eslint-disable @typescript-eslint/no-require-imports */
import { format, transports } from 'winston'
import colors = require('colors/safe')
// import LogstashTransport = require('winston-logstash/lib/winston-logstash-latest')

const customFormat = format.printf((args) => {
  const { service, level, timestamp, message, traceId } = args
  const logData = {
    level,
    source: colors.yellow(service as string),
    timestamp,
    message,
    traceId: colors.gray(traceId as string),
  }

  return JSON.stringify(logData)
})

export const defaultOptions: { level: string; format: any; transports: any[] } =
  {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.timestamp({ format: 'isoDateTime' }),
      format.json(),
      customFormat,
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({ format: 'isoDateTime' }),
          format.json(),
          format.colorize({ all: true }),
        ),
        handleExceptions: true,
      }),
      // new LogstashTransport({
      //   port: 5000,
      //   node_name: 'logstash',
      //   host: 'logstash',
      // }),
    ],
  }
