import { draftConditionTemplates, medicalSupplyConditions } from "@/data/conditions/mockConditions";
import { deliveryConfirmationEvidence, medicalSupplyEvidence } from "@/data/evidence/mockEvidence";
import type { Condition, ContractDetail, ContractSummary, Evidence } from "@/data/types";

const contractSummaries: ContractSummary[] = [
  {
    id: "medical-supply-agreement",
    name: "Medical Supply Agreement",
    description: "Cross-border supply agreement for temperature-sensitive medical inventory.",
    buyer: { name: "ACME Medical", identifier: "BR-ACM-204", verificationStatus: "verified" },
    seller: { name: "Global Pharma Ltd.", identifier: "UK-GPL-119", verificationStatus: "verified" },
    counterparty: "Global Pharma Ltd.",
    value: 40000,
    currency: "USD",
    reference: "MSA-2026-014",
    status: "pending",
    verifiedConditions: 7,
    totalConditions: 8,
    createdAt: "2026-09-08T08:00:00Z",
    updatedAt: "2026-09-11T12:30:00Z",
  },
  {
    id: "equipment-purchase",
    name: "Equipment Purchase",
    description: "Purchase agreement for hospital equipment delivery.",
    buyer: { name: "MedCo Ltd.", identifier: "US-MED-420", verificationStatus: "verified" },
    seller: { name: "Acme Industries", identifier: "DE-ACI-120", verificationStatus: "verified" },
    counterparty: "Acme Industries",
    value: 85000,
    currency: "USD",
    status: "ready",
    verifiedConditions: 7,
    totalConditions: 7,
    createdAt: "2026-09-05T10:00:00Z",
    updatedAt: "2026-09-10T15:00:00Z",
  },
  {
    id: "logistics-agreement",
    name: "Logistics Agreement",
    description: "Shipping operations agreement with verified final delivery.",
    buyer: { name: "Company A", identifier: "BR-CPA-510", verificationStatus: "verified" },
    seller: { name: "Global Freight", identifier: "SG-GFR-211", verificationStatus: "verified" },
    counterparty: "Global Freight",
    value: 22000,
    currency: "USD",
    status: "verified",
    verifiedConditions: 7,
    totalConditions: 7,
    createdAt: "2026-09-03T08:00:00Z",
    updatedAt: "2026-09-08T11:00:00Z",
  },
  {
    id: "customs-clearance-framework",
    name: "Customs Clearance Framework",
    description: "Framework agreement for customs release checkpoints.",
    buyer: { name: "Atlantic Imports", identifier: "PT-ATL-300", verificationStatus: "verified" },
    seller: { name: "ClearPort Services", identifier: "NL-CLR-200", verificationStatus: "verified" },
    counterparty: "ClearPort Services",
    value: 63000,
    currency: "EUR",
    status: "ready",
    verifiedConditions: 6,
    totalConditions: 6,
    createdAt: "2026-09-02T09:30:00Z",
    updatedAt: "2026-09-07T09:30:00Z",
  },
  {
    id: "sterile-packaging-supply",
    name: "Sterile Packaging Supply",
    description: "Packaging supply contract settled after inspection.",
    buyer: { name: "Nord Health", identifier: "SE-NDH-404", verificationStatus: "verified" },
    seller: { name: "SteriPack GmbH", identifier: "DE-STP-909", verificationStatus: "verified" },
    counterparty: "SteriPack GmbH",
    value: 18000,
    currency: "EUR",
    status: "settled",
    verifiedConditions: 5,
    totalConditions: 5,
    createdAt: "2026-08-28T09:00:00Z",
    updatedAt: "2026-09-06T13:00:00Z",
  },
  {
    id: "vaccine-distribution-lot-14",
    name: "Vaccine Distribution Lot 14",
    description: "Distribution contract for a regional vaccine shipment.",
    buyer: { name: "Regional Health Authority", identifier: "BR-RHA-871", verificationStatus: "verified" },
    seller: { name: "BioTransit", identifier: "CH-BTR-555", verificationStatus: "pending" },
    counterparty: "BioTransit",
    value: 124000,
    currency: "USD",
    status: "pending",
    verifiedConditions: 3,
    totalConditions: 6,
    createdAt: "2026-09-07T07:00:00Z",
    updatedAt: "2026-09-09T14:00:00Z",
  },
  {
    id: "agri-export-brazil",
    name: "Agri Export Brazil",
    description: "Agricultural export contract with verified customs milestone.",
    buyer: { name: "FoodChain Iberia", identifier: "ES-FCI-200", verificationStatus: "verified" },
    seller: { name: "AgriBrasil", identifier: "BR-AGB-778", verificationStatus: "verified" },
    counterparty: "AgriBrasil",
    value: 91000,
    currency: "USD",
    status: "verified",
    verifiedConditions: 5,
    totalConditions: 5,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-05T18:00:00Z",
  },
  {
    id: "industrial-parts-order",
    name: "Industrial Parts Order",
    description: "Parts procurement contract fully settled.",
    buyer: { name: "Machina Labs", identifier: "US-MCL-100", verificationStatus: "verified" },
    seller: { name: "Torque Systems", identifier: "JP-TRQ-621", verificationStatus: "verified" },
    counterparty: "Torque Systems",
    value: 54000,
    currency: "USD",
    status: "settled",
    verifiedConditions: 4,
    totalConditions: 4,
    createdAt: "2026-08-25T11:00:00Z",
    updatedAt: "2026-09-04T10:00:00Z",
  },
  {
    id: "diagnostics-shipment",
    name: "Diagnostics Shipment",
    description: "Diagnostics delivery contract awaiting final inspection.",
    buyer: { name: "City Labs", identifier: "MX-CTL-723", verificationStatus: "verified" },
    seller: { name: "DiagGlobal", identifier: "CA-DGG-111", verificationStatus: "verified" },
    counterparty: "DiagGlobal",
    value: 33000,
    currency: "USD",
    status: "pending",
    verifiedConditions: 4,
    totalConditions: 8,
    createdAt: "2026-09-04T09:00:00Z",
    updatedAt: "2026-09-03T16:00:00Z",
  },
  {
    id: "port-storage-release",
    name: "Port Storage Release",
    description: "Port release agreement with all conditions verified.",
    buyer: { name: "Oceanic Imports", identifier: "AE-OCI-141", verificationStatus: "verified" },
    seller: { name: "Harbor Services", identifier: "AE-HBS-999", verificationStatus: "verified" },
    counterparty: "Harbor Services",
    value: 12000,
    currency: "USD",
    status: "verified",
    verifiedConditions: 6,
    totalConditions: 6,
    createdAt: "2026-08-30T09:00:00Z",
    updatedAt: "2026-09-02T10:00:00Z",
  },
  {
    id: "raw-material-purchase",
    name: "Raw Material Purchase",
    description: "Raw material procurement settled after warehouse confirmation.",
    buyer: { name: "North Foundry", identifier: "US-NFD-888", verificationStatus: "verified" },
    seller: { name: "Mineral Trade Co.", identifier: "CL-MTC-100", verificationStatus: "verified" },
    counterparty: "Mineral Trade Co.",
    value: 47000,
    currency: "USD",
    status: "settled",
    verifiedConditions: 5,
    totalConditions: 5,
    createdAt: "2026-08-22T12:00:00Z",
    updatedAt: "2026-09-01T17:00:00Z",
  },
  {
    id: "humanitarian-relief-lot-9",
    name: "Humanitarian Relief Lot 9",
    description: "Relief logistics contract with verified handoff and cold chain.",
    buyer: { name: "Aid Network", identifier: "FR-AID-303", verificationStatus: "verified" },
    seller: { name: "Relief Cargo", identifier: "BE-RCG-670", verificationStatus: "verified" },
    counterparty: "Relief Cargo",
    value: 66000,
    currency: "USD",
    status: "verified",
    verifiedConditions: 6,
    totalConditions: 6,
    createdAt: "2026-08-26T10:00:00Z",
    updatedAt: "2026-08-31T15:00:00Z",
  },
];

const medicalSupplyContract: ContractDetail = {
  ...contractSummaries[0],
  conditions: medicalSupplyConditions,
  evidence: medicalSupplyEvidence,
};

function buildGenericConditions(summary: ContractSummary): Condition[] {
  return draftConditionTemplates.slice(0, 4).map((condition, index) => ({
    ...condition,
    id: `${summary.id}-${condition.id}`,
    status: index < summary.verifiedConditions ? "verified" : "pending",
    verifiedAt: index < summary.verifiedConditions ? summary.updatedAt : undefined,
  }));
}

function buildGenericEvidence(summary: ContractSummary): Evidence[] {
  return buildGenericConditions(summary)
    .filter((condition) => condition.status === "verified")
    .map((condition, index) => ({
      id: `${summary.id}-evidence-${index + 1}`,
      title: condition.title,
      type: condition.requiredEvidence,
      issuer: condition.authorizedIssuer,
      status: "verified",
      issuedAt: summary.updatedAt,
      source: condition.requiredEvidence,
      attestation: "Verified",
      schema: condition.verificationMethod.replace(/\s+/g, ""),
      proof: `0x${summary.id.slice(0, 4)}${index}...${summary.id.slice(-3)}`,
      verification: "Valid",
      verifiedAt: summary.updatedAt,
    }));
}

export const mockContracts = contractSummaries;

export const contractsNeedingAttention = mockContracts.filter(
  (contract) => contract.status === "pending" || contract.status === "ready",
);

export function getContractById(id: string): ContractDetail | null {
  if (id === medicalSupplyContract.id) {
    return medicalSupplyContract;
  }

  const summary = mockContracts.find((contract) => contract.id === id);

  if (!summary) {
    return null;
  }

  return {
    ...summary,
    conditions: buildGenericConditions(summary),
    evidence: buildGenericEvidence(summary),
  };
}

export function getMedicalSupplyReadyState(): ContractDetail {
  const upgradedConditions = medicalSupplyContract.conditions.map((condition) =>
    condition.id === "delivery-confirmed"
      ? {
          ...condition,
          status: "verified" as const,
          verifiedAt: deliveryConfirmationEvidence.verifiedAt,
          evidenceId: deliveryConfirmationEvidence.id,
        }
      : condition,
  );

  return {
    ...medicalSupplyContract,
    status: "ready",
    verifiedConditions: 8,
    updatedAt: deliveryConfirmationEvidence.verifiedAt ?? medicalSupplyContract.updatedAt,
    conditions: upgradedConditions,
    evidence: [...medicalSupplyContract.evidence, deliveryConfirmationEvidence],
  };
}
