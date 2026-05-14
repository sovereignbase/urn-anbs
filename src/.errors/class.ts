/**
 * Stable machine-readable error codes thrown by {@link UrnAnbsError}.
 */
export type UrnAnbsErrorCode = 'URN_ANBS_INVALID_IDENTIFIER'

/**
 * Error thrown when a `urn:anbs` operation receives invalid input.
 */
export class UrnAnbsError extends Error {
  /**
   * Stable machine-readable error code.
   */
  readonly code: UrnAnbsErrorCode

  /**
   * Creates a new `urn:anbs` package error.
   *
   * @param code - Stable machine-readable error code.
   * @param message - Optional human-readable detail. Defaults to the standard
   * message for `code`.
   */
  constructor(code: UrnAnbsErrorCode, message?: string) {
    const detail =
      message ??
      'The value must be a URN in the form "urn:anbs:<SchemaOrgType>.<OpaqueIdentifier>".'
    super(`{@sovereignbase/urn-anbs} ${detail}`)
    this.code = code
    this.name = 'UrnAnbsError'
  }
}
