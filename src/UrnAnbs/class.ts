import {
  Cryptographic,
  type OpaqueIdentifier,
} from '@sovereignbase/cryptosuite'
import type { SchemaOrgType } from '@sovereignbase/schema-crdt'
import type { UrnAnbsString } from '../.types/types.js'
import { UrnAnbsError } from '../.errors/class.js'

export class UrnAnbs {
  static async derive(
    type: SchemaOrgType,
    source: Uint8Array
  ): Promise<UrnAnbsString> {
    const identifier = await Cryptographic.identifier.derive(source)

    return `urn:anbs:${type}.${identifier}`
  }

  static generate(type: SchemaOrgType): UrnAnbsString {
    return `urn:anbs:${type}.${Cryptographic.identifier.generate()}`
  }

  static is(value: string): value is UrnAnbsString {
    return /^urn:anbs:[A-Za-z][A-Za-z0-9]*\.[A-Za-z0-9_-]+$/.test(value)
  }

  static assert(value: string): asserts value is UrnAnbsString {
    if (!UrnAnbs.is(value)) {
      throw new UrnAnbsError('NOT_A_ANBS_URN', 'Invalid urn:anbs identifier')
    }
  }

  static parse(identifier: string): {
    id: OpaqueIdentifier
    type: SchemaOrgType
  } {
    UrnAnbs.assert(identifier)
    const [scheme, nid, nss] = identifier.split(':')
    const [type, id] = nss.split('.') as [SchemaOrgType, OpaqueIdentifier]
    return { id, type }
  }
}
