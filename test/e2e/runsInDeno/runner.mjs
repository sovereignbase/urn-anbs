import * as api from '../../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runUrnAnbsSuite,
} from '../shared/suite.mjs'

const results = await runUrnAnbsSuite(api, { label: 'deno esm' })
printResults(results)
ensurePassing(results)
