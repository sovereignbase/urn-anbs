import type { OpaqueIdentifier } from '@sovereignbase/cryptosuite'
import type { SchemaOrgType } from '@sovereignbase/schema-crdt'

/**
 * Absolute `urn:anbs` identifier string.
 *
 * The namespace-specific string is composed from a Schema.org type followed by
 * a cryptographic opaque identifier.
 */
export type UrnAnbsString = `urn:anbs:${SchemaOrgType}.${OpaqueIdentifier}`
