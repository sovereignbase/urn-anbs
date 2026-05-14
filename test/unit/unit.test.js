import assert from 'node:assert/strict'
import test from 'node:test'
import { UrnAnbs, UrnAnbsError } from '../../dist/index.js'

const identifier =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
const urn = `urn:anbs:Thing.${identifier}`

test('is accepts canonical ANBS URNs', () => {
  assert.equal(UrnAnbs.is(urn), true)
})

test('is rejects non-canonical or invalid ANBS URNs', () => {
  assert.equal(UrnAnbs.is(`URN:ANBS:Thing.${identifier}`), false)
  assert.equal(UrnAnbs.is(`urn:anbs:Thing:${identifier}`), false)
  assert.equal(UrnAnbs.is(`urn:anbs:Thing.${identifier.slice(1)}`), false)
  assert.equal(UrnAnbs.is(`urn:anbs:Thing.${identifier}.extra`), false)
})

test('assert narrows valid ANBS URNs', () => {
  UrnAnbs.assert(urn)
})

test('assert throws typed errors for invalid ANBS URNs', () => {
  assert.throws(
    () => UrnAnbs.assert('not-a-urn'),
    (error) =>
      error instanceof UrnAnbsError &&
      error.code === 'URN_ANBS_INVALID_IDENTIFIER' &&
      error.message.includes('@sovereignbase/urn-anbs')
  )
})

test('error supports explicit messages', () => {
  const error = new UrnAnbsError('URN_ANBS_INVALID_IDENTIFIER', 'custom detail')

  assert.equal(error.code, 'URN_ANBS_INVALID_IDENTIFIER')
  assert.equal(error.message, '{@sovereignbase/urn-anbs} custom detail')
})

test('parse returns Schema.org type and opaque identifier', () => {
  assert.deepEqual(UrnAnbs.parse(urn), {
    type: 'Thing',
    id: identifier,
  })
})

test('generate returns a valid ANBS URN', () => {
  const generated = UrnAnbs.generate('Person')

  assert.equal(UrnAnbs.is(generated), true)
  assert.equal(UrnAnbs.parse(generated).type, 'Person')
})

test('derive returns stable ANBS URNs for the same source', async () => {
  const source = new Uint8Array([1, 2, 3, 4])
  const first = await UrnAnbs.derive('Action', source)
  const second = await UrnAnbs.derive('Action', source)

  assert.equal(first, second)
  assert.equal(UrnAnbs.is(first), true)
  assert.equal(UrnAnbs.parse(first).type, 'Action')
})
