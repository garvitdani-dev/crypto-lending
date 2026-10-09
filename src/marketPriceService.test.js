import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchMarketPrice, fetchMarketPrices } from './services/marketPriceService.js'

test('parses a positive live ticker price', async () => {
  const result = await fetchMarketPrice('eth', {
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ price: '2494.48', time: '2026-10-09T10:35:02.719Z' }),
    }),
  })

  assert.deepEqual(result, {
    asset: 'ETH',
    price: 2494.48,
    fetchedAt: '2026-10-09T10:35:02.719Z',
  })
})

test('keeps successful asset prices when one market request fails', async () => {
  const result = await fetchMarketPrices(['BTC', 'ETH'], {
    fetchImpl: async (url) => {
      if (url.includes('ETH-USD')) return { ok: false, status: 503 }
      return { ok: true, json: async () => ({ price: '100000', time: '2026-10-09T10:35:02.719Z' }) }
    },
  })

  assert.deepEqual(result.prices, { BTC: 100000 })
})

test('rejects invalid market responses without producing a zero price', async () => {
  await assert.rejects(
    fetchMarketPrice('ETH', { fetchImpl: async () => ({ ok: true, json: async () => ({ price: '0' }) }) }),
    /invalid/,
  )
})
