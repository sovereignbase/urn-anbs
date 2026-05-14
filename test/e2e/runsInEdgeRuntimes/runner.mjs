import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { EdgeRuntime } from 'edge-runtime'
import { Cryptographic } from '@sovereignbase/cryptosuite'
import {
  ensurePassing,
  printResults,
  runUrnAnbsSuite,
} from '../shared/suite.mjs'

const root = process.cwd()
const esmDistPath = resolve(root, 'dist', 'index.js')

function toExecutableEdgeEsm(bundleCode) {
  const executableCode = bundleCode.replace(
    /import\s*\{\s*Cryptographic\s*\}\s*from\s*["']@sovereignbase\/cryptosuite["'];?/,
    'const { Cryptographic } = globalThis.__urnAnbsCryptosuite;'
  )

  if (/\bimport\s+[\s\S]+?\bfrom\b/.test(executableCode))
    throw new Error(
      'edge-runtime esm harness found an unsupported runtime import in dist/index.js'
    )

  const exportMatch = executableCode.match(
    /export\s*\{\s*([\s\S]*?)\s*\};\s*(\/\/# sourceMappingURL=.*)?\s*$/
  )
  if (!exportMatch)
    throw new Error('edge-runtime esm harness could not find bundle exports')

  const exportEntries = exportMatch[1]
    .split(',')
    .map((specifier) => specifier.trim())
    .filter(Boolean)
    .map((specifier) => {
      const [localName, exportedName] = specifier.split(/\s+as\s+/)
      return exportedName
        ? `${JSON.stringify(exportedName)}: ${localName}`
        : localName
    })
    .join(',\n  ')

  const sourceMapComment = exportMatch[2] ? `${exportMatch[2]}\n` : ''
  return (
    executableCode.slice(0, exportMatch.index) +
    `globalThis.__urnAnbsEsmExports = {\n  ${exportEntries}\n};\n` +
    sourceMapComment
  )
}

const runtime = new EdgeRuntime()
runtime.context.__urnAnbsCryptosuite = { Cryptographic }
const moduleCode = await readFile(esmDistPath, 'utf8')
runtime.evaluate(toExecutableEdgeEsm(moduleCode))

const results = await runUrnAnbsSuite(runtime.context.__urnAnbsEsmExports, {
  label: 'edge-runtime esm',
  runtimeGlobals: runtime.context,
})
printResults(results)
ensurePassing(results)
