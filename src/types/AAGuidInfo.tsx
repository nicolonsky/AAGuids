import { UUID } from "crypto"

export type AAGuidInfo = {
  description: string,
  aaguid: UUID
  authenticatorVersion: number
  protocolFamily: string,
  authenticationAlgorithms: string[],
  keyProtection: string[],
  attachmentHint: string[]
}