# ENS Verification and Revocation Toolkit for Managed Agent Runtimes (MARPs)

ENS DAO **Service Provider Program (SPP3)** application by **Steg** (`estmcmxci.eth` · `mouz.eth`).

A defined ecosystem service: a Verifier + per-name AuthResolver, a TypeScript SDK, a conformance
suite, and integration guides that let any service confirm — in real time — whether an action
attributed to an ENS-named agent is currently authorized, and whether the credential behind it
has been rotated, expired, or revoked. Built on ENSv2 primitives; complements core ENS Labs work.

## Contents

| Path                                                                                             | What it is                                                            |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| [`application.md`](./application.md)                                                             | The SPP3 application                                                  |
| [`appendices/`](./appendices)                                                                    | Supporting appendices (A–E)                                           |
| [`maip_taxonomy.md`](./maip_taxonomy.md)                                                         | MAIP taxonomy referenced by the application                           |
| [`spec/prototype_spec.v1.0-draft.02.publish.md`](./spec/prototype_spec.v1.0-draft.02.publish.md) | Normative prototype spec (Verifier + AuthResolverImpl), published cut |

## Team

**Steg** is two senior builders:

- **`estmcmxci.eth`** — ENS architecture, the spec, and ecosystem integration. Merged upstream
  contributor to canonical ENS contracts ([PR #509](https://github.com/ensdomains/ens-contracts/pull/509),
  shipped in v1.7.0); independent jury validation (Synthesis Hackathon 1st place, ENS Identity;
  ETHGlobal HackMoney Finalist). ENS Public Goods grantee for the **Universal Resolver Matrix**
  ([URM](https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734)) —
  a design framework that maps resolver architectures across trust model, proof system, lifecycle, and
  verification path to find which verifier unlocks the most namespaces per unit of effort. This
  proposal productionizes the cell that analysis surfaced as highest-leverage: agent authority resolution.
- **`mouz.eth`** (Mouz Delbourgo) — production smart-contract systems across DeFi and NFT finance at Arcade.xyz ([NFT lending](https://github.com/arcadexyz/arcade-protocol/blob/main/contracts/rollover/CrossCurrencyRollover.sol), collateral/accounting, [LP staking](https://github.com/arcadexyz/dao-contracts), [governance contracts](https://github.com/arcadexyz/governance/blob/main/contracts/NFTBoostVault.sol)), and a Uniswap Foundation competition-winning [Uniswap v4 hook](https://github.com/Mouzayan/dex-profit-wars); specializing in security and authorization-surface design.

## Status & references

- **Read-only pilot (scaffold)** extending prior ENS agent-identity work, on a draft PR to the Bankr
  skills repo: [`BankrBot/skills#189`](https://github.com/BankrBot/skills/pull/189). The on-chain
  verification step is a marked stub pending the M1 contracts; the pilot proves the record-publishing
  and resolution path. Verified run log: [demo gist](https://gist.github.com/estmcmxci/3e8396cbad2faa66685bb423afc212b9).
- The reference implementation (Verifier + AuthResolverImpl, Solidity) is the M1 deliverable, not yet written.

## License

[MIT](./LICENSE). Deliverables produced under this proposal are MIT-licensed.
