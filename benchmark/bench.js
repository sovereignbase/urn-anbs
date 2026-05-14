import { performance } from 'node:perf_hooks'
import { UrnAnbs } from '../dist/index.js'

const identifier =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
const urn = `urn:anbs:Thing.${identifier}`

function formatResult(ops, ms) {
  const opsPerSecond = Math.round((ops / ms) * 1000).toLocaleString('en-US')
  return `${opsPerSecond} ops/s (${ms.toFixed(1)} ms)`
}

function bench(name, ops, fn) {
  const start = performance.now()
  for (let index = 0; index < ops; index++) fn(index)
  const ms = performance.now() - start
  return { name, result: formatResult(ops, ms) }
}

async function benchAsync(name, ops, fn) {
  const start = performance.now()
  for (let index = 0; index < ops; index++) await fn(index)
  const ms = performance.now() - start
  return { name, result: formatResult(ops, ms) }
}

const encoder = new TextEncoder()
const results = [
  bench('generate', 10_000, () => UrnAnbs.generate('Thing')),
  await benchAsync('derive', 1_000, (index) =>
    UrnAnbs.derive('Thing', encoder.encode(`source-${index}`))
  ),
  bench('is valid', 100_000, () => UrnAnbs.is(urn)),
  bench('parse valid', 100_000, () => UrnAnbs.parse(urn)),
]

console.log('| Benchmark | Result |')
console.log('| --- | ---: |')
for (const { name, result } of results) {
  console.log(`| ${name} | ${result} |`)
}
