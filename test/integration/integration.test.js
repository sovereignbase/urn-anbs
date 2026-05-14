import assert from 'node:assert/strict'
import test from 'node:test'
import { UrnAnbs } from '../../dist/index.js'

test('integration: generated identifier validates and parses', () => {
  const generated = UrnAnbs.generate('Thing')
  const parsed = UrnAnbs.parse(generated)

  assert.equal(UrnAnbs.is(generated), true)
  assert.equal(parsed.type, 'Thing')
  assert.equal(typeof parsed.id, 'string')
})

test('integration: derived identifier validates and parses', async () => {
  const derived = await UrnAnbs.derive('Person', new Uint8Array([5, 6, 7, 8]))
  const parsed = UrnAnbs.parse(derived)

  assert.equal(UrnAnbs.is(derived), true)
  assert.equal(parsed.type, 'Person')
  assert.equal(typeof parsed.id, 'string')
})
