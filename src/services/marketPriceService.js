const MARKET_DATA_URL = 'https://api.exchange.coinbase.com/products'

export const MARKET_PRICE_SOURCE = 'Coinbase Exchange'
export const SUPPORTED_MARKET_ASSETS = ['BTC', 'ETH', 'USDC']

export async function fetchMarketPrice(asset, { fetchImpl = fetch, signal } = {}) {
  const symbol = String(asset).toUpperCase()
  if (!SUPPORTED_MARKET_ASSETS.includes(symbol)) throw new Error(`Unsupported market asset: ${symbol}`)

  const response = await fetchImpl(`${MARKET_DATA_URL}/${symbol}-USD/ticker`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) throw new Error(`Market price request failed with status ${response.status}`)

  const payload = await response.json()
  const price = Number(payload.price)
  if (!Number.isFinite(price) || price <= 0) throw new Error(`Market price response was invalid for ${symbol}`)

  return { asset: symbol, price, fetchedAt: payload.time || new Date().toISOString() }
}

export async function fetchMarketPrices(assets = SUPPORTED_MARKET_ASSETS, options = {}) {
  const results = await Promise.allSettled(assets.map((asset) => fetchMarketPrice(asset, options)))
  const prices = {}
  const timestamps = {}

  results.forEach((result) => {
    if (result.status !== 'fulfilled') return
    prices[result.value.asset] = result.value.price
    timestamps[result.value.asset] = result.value.fetchedAt
  })

  if (!Object.keys(prices).length) throw new Error('Live market prices are currently unavailable')
  return { prices, timestamps, source: MARKET_PRICE_SOURCE }
}
