export interface OHLC {
  date: Date
  open: number
  close: number
  high: number
  low: number
  volume: number
  oi?: number
}

export interface Instrument {
  exchange: string
  exchange_token: number
  expiry: string
  instrument_token: number
  instrument_type: string
  last_price: number
  lot_size: number
  name: string
  segment: string
  strike: number
  tick_size: number
  tradingsymbol: string
}
