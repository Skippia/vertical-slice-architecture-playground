export const EXCHANGE_NAME = {
  AMQP_EXCHANGE_CHECKOUT: 'ex.checkout',
} as const

export type EXCHANGE_NAME_KEYS = keyof typeof EXCHANGE_NAME
export type EXCHANGE_NAME_VALUES = (typeof EXCHANGE_NAME)[EXCHANGE_NAME_KEYS]

export const EXCHANGE_TYPE_BY_NAME: Record<
  EXCHANGE_NAME_VALUES,
  'topic' | 'direct' | 'fanout'
> = {
  'ex.checkout': 'direct',
} as const

export const EXCHANGES_CONFIG = Object.keys(EXCHANGE_NAME).map(
  (exchangeName) =>
    ({
      name: EXCHANGE_NAME[exchangeName],
      type: EXCHANGE_TYPE_BY_NAME[exchangeName],
    }) as const,
)
