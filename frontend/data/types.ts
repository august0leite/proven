export type WorkspaceStatus =
  | "pending"
  | "verified"
  | "failed"
  | "revoked"
  | "expired"
  | "disputed"
  | "ready"
  | "settled";

export type PartyVerificationStatus = "verified" | "pending";

export type Locale = "en" | "pt";

export interface UserWallet {
  address: string;
  connectedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  wallets: UserWallet[];
}

export interface ContractParty {
  name: string;
  identifier: string;
  verificationStatus: PartyVerificationStatus;
}

export interface Evidence {
  id: string;
  title: string;
  type: string;
  issuer: string;
  status: WorkspaceStatus;
  issuedAt: string;
  source: string;
  attestation: string;
  schema: string;
  proof: string;
  verification: string;
  verifiedAt?: string;
}

export interface Condition {
  id: string;
  title: string;
  description: string;
  status: WorkspaceStatus;
  requiredEvidence: string;
  authorizedIssuer: string;
  verificationMethod: string;
  verifiedAt?: string;
  evidenceId?: string;
}

export interface ContractSummary {
  id: string;
  name: string;
  description: string;
  buyer: ContractParty;
  seller: ContractParty;
  counterparty: string;
  value: number;
  currency: string;
  reference?: string;
  status: WorkspaceStatus;
  verifiedConditions: number;
  totalConditions: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContractDetail extends ContractSummary {
  conditions: Condition[];
  evidence: Evidence[];
}
