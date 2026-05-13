import FastUri from 'fast-uri'
import { UrnAnbsString } from '../.types/types.js'
import { Cryptographic } from '@sovereignbase/cryptosuite'
FastUri.parse('urn')

export class UrnAnbs {
  static generate(type: string): UrnAnbsString {
    return `urn:anbs:${type}.${Cryptographic.identifier.generate()}`
  }
  static async derive(
    type: string,
    source: Uint8Array
  ): Promise<UrnAnbsString> {
    return `urn:anbs:${type}.${await Cryptographic.identifier.derive(source)}`
  }
}
