import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProvenContractsModule = buildModule("ProvenContractsModule", (m) => {
  const provenContracts = m.contract("ProvenContracts");

  return { provenContracts };
});

export default ProvenContractsModule;
