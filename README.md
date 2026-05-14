[![npm version](https://img.shields.io/npm/v/@sovereignbase/urn-anbs)](https://www.npmjs.com/package/@sovereignbase/urn-anbs)
[![CI](https://github.com/sovereignbase/urn-anbs/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/urn-anbs/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/urn-anbs/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/urn-anbs)
[![license](https://img.shields.io/npm/l/@sovereignbase/urn-anbs)](LICENSE)

# urn-anbs

Typed helpers for ANBS URNs in the canonical form `urn:anbs:<SchemaOrgType>.<OpaqueIdentifier>`. The Schema.org type comes from `@sovereignbase/schema-crdt`, and the opaque identifier presentation is validated through `@sovereignbase/cryptosuite`.

## Compatibility

- Runtimes: Node >= 20; Browsers: modern browsers with WebCrypto; Workers/Edge: runtimes with WebCrypto.
- Module format: ESM and CJS.
- Required globals / APIs: `crypto`, `crypto.subtle`, `crypto.getRandomValues`.
- TypeScript: bundled types.

## Goals

- Canonical `urn:anbs` generation and deterministic derivation.
- Validation that delegates opaque identifier presentation to cryptosuite.
- Small API surface for parsing, assertion, and type narrowing.
- Stable typed errors for invalid ANBS URNs.
- Side-effect-free package entrypoint.

## Installation

```sh
npm install @sovereignbase/urn-anbs
# or
pnpm add @sovereignbase/urn-anbs
# or
yarn add @sovereignbase/urn-anbs
```

## Usage

```ts
import { UrnAnbs } from '@sovereignbase/urn-anbs'

const generated = UrnAnbs.generate('Person')
const derived = await UrnAnbs.derive('Thing', new Uint8Array([1, 2, 3]))

if (UrnAnbs.is(generated)) {
  const { type, id } = UrnAnbs.parse(generated)
  console.log(type, id)
}

UrnAnbs.assert(derived)
```

## Runtime behavior

### Node

Uses `@sovereignbase/cryptosuite` for opaque identifier generation, derivation, and validation. Node must provide WebCrypto.

### Browsers / Edge runtimes

Uses the same cryptosuite API surface and requires WebCrypto-compatible runtime globals.

### Validation & errors

`UrnAnbs.is(value)` first validates the ANBS URN lexical prefix and Schema.org type segment, then validates the opaque identifier with `Cryptographic.identifier.validate(...)`.

`UrnAnbs.assert(value)` throws `UrnAnbsError` with code `URN_ANBS_INVALID_IDENTIFIER` when validation fails.

## Specification

The compact ReSpec namespace document is in [`index.html`](index.html).

## Tests

Suite: unit + integration (Node), E2E runtime suite.
Matrix: Node ESM/CJS, Bun ESM/CJS, Deno ESM, Cloudflare Workers ESM, Edge Runtime ESM, Chromium / Firefox / WebKit + mobile emulation.
Coverage: c8 over built `dist/**/*.js`.

## Benchmarks

How it was run: `npm run bench`
Environment: Node runtime on the local machine.

| Benchmark   | Result             |
| ----------- | ------------------ |
| generate    | run `npm run bench` |
| derive      | run `npm run bench` |
| is valid    | run `npm run bench` |
| parse valid | run `npm run bench` |

Results vary by machine and runtime version.

## License

Apache-2.0
