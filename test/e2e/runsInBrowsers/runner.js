import * as api from '/dist/index.js'
import { printResults, runUrnAnbsSuite } from '../shared/suite.mjs'

const results = await runUrnAnbsSuite(api, { label: 'browser esm' })
printResults(results)
window.__URN_ANBS_RESULTS__ = results
const status = document.getElementById('status')
if (status)
  status.textContent = results.ok ? 'ok' : 'failed: ' + results.errors.length
