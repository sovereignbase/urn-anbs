export type UrnAnbsErrorCode = 'NOT_A_ANBS_URN'

export class UrnAnbsError extends Error {
  readonly code: UrnAnbsErrorCode

  constructor(code: UrnAnbsErrorCode, message?: string) {
    const detail = message ?? code
    super(`{@sovereignbase/urn-anbs} ${detail}`)
    this.code = code
    this.name = 'UrnAnbsError'
  }
}
