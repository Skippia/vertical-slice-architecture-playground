export const defaultOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    level: 'error',
    options: {
      colorize: true,
      levelFirst: true,
      colorizeObjects: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss Z',
    },
  },
}
