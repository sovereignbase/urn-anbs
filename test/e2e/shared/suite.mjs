const TEST_TIMEOUT_MS = 5000

const identifier =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
const urn = `urn:anbs:Thing.${identifier}`

export async function runUrnAnbsSuite(api, options = {}) {
  const { label = 'runtime' } = options
  const results = { label, ok: true, errors: [], tests: [] }
  const { UrnAnbs, UrnAnbsError } = api

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'assertion failed')
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected)
      throw new Error(message || `expected ${actual} to equal ${expected}`)
  }

  function assertThrows(fn, validate) {
    let caught
    try {
      fn()
    } catch (error) {
      caught = error
    }

    if (!caught) throw new Error('expected function to throw')
    if (validate && !validate(caught)) throw caught
  }

  async function withTimeout(promise, ms, name) {
    let timer
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`timeout after ${ms}ms${name ? `: ${name}` : ''}`))
      }, ms)
    })
    return Promise.race([promise.finally(() => clearTimeout(timer)), timeout])
  }

  async function runTest(name, fn) {
    try {
      await withTimeout(Promise.resolve().then(fn), TEST_TIMEOUT_MS, name)
      results.tests.push({ name, ok: true })
    } catch (error) {
      results.ok = false
      results.tests.push({ name, ok: false })
      results.errors.push({ name, message: String(error) })
    }
  }

  await runTest('exports shape', () => {
    assert(typeof UrnAnbs === 'function', 'UrnAnbs export missing')
    assert(typeof UrnAnbsError === 'function', 'UrnAnbsError export missing')
    for (const fn of [
      UrnAnbs.generate,
      UrnAnbs.derive,
      UrnAnbs.is,
      UrnAnbs.assert,
      UrnAnbs.parse,
    ]) {
      assert(typeof fn === 'function', 'expected function export')
    }
  })

  await runTest('is validates canonical strings', () => {
    assertEqual(UrnAnbs.is(urn), true)
    assertEqual(UrnAnbs.is(`urn:anbs:Thing.${identifier.slice(1)}`), false)
  })

  await runTest('assert throws typed errors', () => {
    UrnAnbs.assert(urn)
    assertThrows(
      () => UrnAnbs.assert('not-a-urn'),
      (error) =>
        error instanceof UrnAnbsError &&
        error.code === 'URN_ANBS_INVALID_IDENTIFIER'
    )
  })

  await runTest('parse splits type and identifier', () => {
    const parsed = UrnAnbs.parse(urn)
    assertEqual(parsed.type, 'Thing')
    assertEqual(parsed.id, identifier)
  })

  await runTest('generate returns valid URNs', () => {
    const generated = UrnAnbs.generate('Person')
    assertEqual(UrnAnbs.is(generated), true)
    assertEqual(UrnAnbs.parse(generated).type, 'Person')
  })

  await runTest('derive is deterministic', async () => {
    const source = new Uint8Array([1, 2, 3, 4])
    const first = await UrnAnbs.derive('Action', source)
    const second = await UrnAnbs.derive('Action', source)
    assertEqual(first, second)
    assertEqual(UrnAnbs.is(first), true)
  })

  return results
}

export function printResults(results) {
  const passed = results.tests.filter((test) => test.ok).length
  console.log(`${results.label}: ${passed}/${results.tests.length} passed`)
  if (!results.ok) {
    for (const error of results.errors)
      console.error(`  - ${error.name}: ${error.message}`)
  }
}

export function ensurePassing(results) {
  if (results.ok) return
  throw new Error(
    `${results.label} failed with ${results.errors.length} failing tests`
  )
}
