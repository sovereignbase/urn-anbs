import {
  Cryptographic,
  type OpaqueIdentifier,
} from '@sovereignbase/cryptosuite'
import type { SchemaOrgType } from '@sovereignbase/schema-crdt'
import type { UrnAnbsString } from '../.types/types.js'
import { UrnAnbsError } from '../.errors/class.js'

/**
 * Creates, validates, and parses absolute `urn:anbs` identifiers.
 */
export class UrnAnbs {
  /**
   * Derives a deterministic `urn:anbs` identifier from source bytes.
   *
   * @param type - Schema.org type name used as the identifier subtype.
   * @param source - Source bytes used to derive the opaque identifier.
   * @returns A deterministic `urn:anbs` identifier.
   */
  static async derive(
    type: SchemaOrgType,
    source: Uint8Array
  ): Promise<UrnAnbsString> {
    const identifier = await Cryptographic.identifier.derive(source)

    return `urn:anbs:${type}.${identifier}`
  }

  /**
   * Generates a random `urn:anbs` identifier.
   *
   * @param type - Schema.org type name used as the identifier subtype.
   * @returns A random `urn:anbs` identifier.
   */
  static generate(type: SchemaOrgType): UrnAnbsString {
    return `urn:anbs:${type}.${Cryptographic.identifier.generate()}`
  }

  /**
   * Tests whether a string is a syntactically valid `urn:anbs` identifier.
   *
   * @param value - String to test.
   * @returns `true` if `value` is a `urn:anbs` identifier.
   */
  static is(value: string): value is UrnAnbsString {
    return /^urn:anbs:[A-Za-z][A-Za-z0-9]*\.[A-Za-z0-9_-]+$/.test(value)
  }

  /**
   * Asserts that a string is a syntactically valid `urn:anbs` identifier.
   *
   * @param value - String to validate.
   * @throws {@link UrnAnbsError} `URN_ANBS_INVALID_IDENTIFIER` if `value` is not
   * a `urn:anbs` identifier.
   */
  static assert(value: string): asserts value is UrnAnbsString {
    if (!UrnAnbs.is(value)) {
      throw new UrnAnbsError('URN_ANBS_INVALID_IDENTIFIER')
    }
  }

  /**
   * Parses a `urn:anbs` identifier into its Schema.org type and opaque
   * identifier components.
   *
   * @param identifier - `urn:anbs` identifier to parse.
   * @returns Parsed identifier components.
   * @throws {@link UrnAnbsError} `URN_ANBS_INVALID_IDENTIFIER` if `identifier`
   * is not a `urn:anbs` identifier.
   */
  static parse(identifier: string): {
    id: OpaqueIdentifier
    type: SchemaOrgType
  } {
    UrnAnbs.assert(identifier)
    const [, , nss] = identifier.split(':')
    const [type, id] = nss.split('.') as [SchemaOrgType, OpaqueIdentifier]
    return { id, type }
  }
}
