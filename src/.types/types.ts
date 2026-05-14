import type { OpaqueIdentifier } from '@sovereignbase/cryptosuite'
import type { SchemaOrgType } from '@sovereignbase/schema-crdt'

export type UrnAnbsString = `urn:anbs:${SchemaOrgType}.${OpaqueIdentifier}`
