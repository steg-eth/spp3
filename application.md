# ENS Verification and Revocation Toolkit for Managed Agent Runtimes (MARPs)

_A practical ENS-native authorization and verification toolkit for managed agent runtimes: Verifier + AuthResolver contracts, a TypeScript SDK, a conformance suite, integration guides, and end-to-end operational validation flows establishing an open interoperability pattern for agent identity and authorization._

---

## 1. Application Summary

|                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Submitted by**       | Steg — `estmcmxci.eth` · `mouz.eth`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Requested funding**  | Tier 1: $265,000 core infrastructure scope; Tier 2: $175 expanded scope,000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Term**               | July 2026 – July 2027                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Primary category**   | ENS Infrastructure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Secondary category** | Outreach and Integrations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Team status**        | **Steg** is `estmcmxci.eth` + `mouz.eth`. **`estmcmxci.eth`:** **merged upstream contributor to canonical ENS contracts** ([PR #509](https://github.com/ensdomains/ens-contracts/pull/509), Jan 2026, shipped March 2026 in [v1.7.0](https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0) — EIP-7951 P-256 precompile integration in ENS's DNSSEC oracle, ~98% gas reduction); **Public Goods grantee** ("ENS v2 Interop Research" Sep 2025, Stage 1 completed); **independent jury validation (2026):** Synthesis Hackathon 1st Place, ENS Identity track (May), ETHGlobal HackMoney 2026 Finalist (Feb). **`mouz.eth` (Mouz Delbourgo):** production smart-contract systems across DeFi and NFT finance at Arcade.xyz ([NFT lending](https://github.com/arcadexyz/arcade-protocol/blob/main/contracts/rollover/CrossCurrencyRollover.sol), collateral/accounting, [LP staking](https://github.com/arcadexyz/dao-contracts), [governance contracts](https://github.com/arcadexyz/governance/blob/main/contracts/NFTBoostVault.sol)), and a Uniswap Foundation competition-winning [Uniswap v4 hook](https://github.com/Mouzayan/dex-profit-wars); specializing in security and authorization-surface design. |

---

## 2. Customer and Strategic Shape

**Probable customers are production-scale managed agent runtime platforms (MARPs) whose current signing models the v1 toolkit already covers:** Pinata Agents is the live hosting runtime for Steg's [reference agent](https://estmcmxci.co/agent/emilemarcelagustin.eth) on `emilemarcelagustin.eth`; Virtuals Protocol's ACP CLI generates P-256 signers natively (per §6); Bankr Agents' `/agent/sign` + EIP-7702/EIP-1271 wallet model has been end-to-end verified for day-zero compatibility with the v1 Verifier (per [Appendix D](./appendices/appendix-d-deliverables-operationalization.md)). x402 (Coinbase's open agentic payments protocol) is the currently-targeted capability-publisher pilot. **No LOIs yet — engagement is pre-submission DevRel.**

**The strategic bet is that managed agent runtimes represent an emerging operator category** ([full case in Steg's ENS forum post, May 2026](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)), and that this category will require shared verification, revocation, and authorization infrastructure as it matures. The goal of this proposal is to establish an ENS-native authority and interoperability layer before vendor-specific identity and authorization systems harden into fragmented silos. Concretely, the proposal ships a verification and revocation toolkit (Verifier + AuthResolver + SDK + conformance suite + integration guides) that MARP platforms can integrate into subname issuance and agent authorization flows.

The value proposition is infrastructure leverage: creating an open ENS-native verification and authorization pattern that future agent ecosystems can compose around rather than reimplement independently. If this operator category scales, ENS becomes the natural coordination surface for agent identity, authority, and revocation rather than fragmented vendor-local identity systems.

---

## 3. Abstract

ENS lacks a standardized, resolver-native authorization and verification layer for dynamic permissions, credential validity, revocation, and portable agent identity.

The agent stack today has naming and discovery (ENSIP-25, ENSIP-26), registry (ERC-8004, ERC-8122), wire-protocol authentication (MCP, A2A), on-chain delegated execution (ERC-4337), and attestation (EAS) — but no neutral, ENS-keyed, resolver-level authority surface tying those systems to _current_ authorization state.

No service today can verify, in real time, whether an action attributed to an ENS-named agent is currently authorized.

This SPP fills that gap as a defined ENS-native interoperability and verification layer for teams building apps, APIs, relying services, and managed agent runtimes (MARPs). It delivers a practical ENS verification and revocation toolkit composed on top of ENSv2 primitives:

**Tier 1 (core infrastructure)**:

- Verifier
- AuthResolver
- SDK
- conformance suite
- reference validation flows
- documentation/spec work
- security review/audit
- production-like validation environments

**Success measured by**: shipped contracts/tooling, successful end-to-end validation, conformance coverage, audit completion, operational metrics.

**Tier (strategic upside)**:

- One external Wave-1 ecosystem integration
- integration engineering support
- interoperability report
- deployment support

**Success measured by**: successful external integration deployment, integration report, operational interoperability validation.

Integrators can resolve ENS-published authorization state, verify signed requests against current ENS state, and enforce expiry, rotation, and revocation through normalized allow/deny reason codes.

### **Success metrics**

#### **Tier 1 (core infrastructure) success is measured by:**

- shipped Verifier and AuthResolver contracts,
- released SDK and conformance tooling,
- successful end-to-end validation flows across all supported signing models,
- completed third-party security review/audit,
- successful revocation, rotation, expiry, and replay-protection validation in production-like environments,
- and operational correctness metrics around authorization and verification behavior.

#### **Tier 2 (ecosystem validation / strategic expansion) success is measured by:**

- one successful external Wave-1 integration deployment,
- interoperability validation across a real managed-agent environment,
- integration engineering and deployment support deliverables,
- and publication of ecosystem interoperability findings and integration guidance.

---

## 4. Prior Work

### **Public Goods grant — "ENS v2 Interop Research" (Sep 2025, 1 ETH, Stage 1 completed).**

Two committed deliverables, both completed.

1. A research analysis of ENSv2 interop design questions — ENSIP-19 multichain primary names, CCIP-Read (EIP-3668), migration policies, event/API discoverability, security trade-offs — convened in partnership with Kernel and Nick Johnson (ENS Labs), shipped as the [Universal Resolver Matrix (URM)](https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734), a reference framework for heterogeneous resolver architecture across L2s, non-EVM chains, DNSSEC, WebAuthn, and offchain systems (published Dec 2025). URM reframes ENS as **"a trust-routing system and compiler that anchors heterogeneous namespaces to Ethereum as the root of trust,"** organizing resolver architectures into a matrix (trust model, proof system, lifecycle, verification path) under one governing question: _which verifier unlocks the most new namespaces per unit of engineering effort._ This proposal is the direct descendant of that framework — the build-out of the agent-authority / WebAuthn-verifier cell URM identified, not a new idea. The grant seeded the thesis: ENS as the verification substrate for an agent economy where _generation is abundant and verification is scarce._
2. Authorship of the [WebAuthn-for-ENS specification](https://docs.steg.eth.link/specifications/webauthn-specification/) — a productionizable design for that cell, which M1 of this proposal adapts to the AuthResolver + Verifier scope on ENSv2. Full grant disbursement (1 ETH) withdrawn on milestone completion. Grant record at [builder.ensgrants.xyz](https://builder.ensgrants.xyz) (grantee: `fundamentalia.eth`, submitter's prior ENS identity); [research thread](https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392).

### **Upstream contribution to canonical ENS contracts (Jan 2026, unfunded).**

Replaced software-implemented `EllipticCurve` verification with the EIP-7951 P-256 precompile in ENS's DNSSEC oracle (Algorithm 13). Merged into `ensdomains/ens-contracts` as [PR #509](https://github.com/ensdomains/ens-contracts/pull/509) by Makoto Inoue (ENS Labs) on 26 January 2026; shipped to production in the [v1.7.0 release](https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0) on 13 March 2026. Adds `P256Precompile.sol` following the `ModexpPrecompile` pattern, switches `P256SHA256Algorithm` to call the precompile at `0x100`, and removes the `EllipticCurve` dependency — ~98% gas reduction (~200k+ gas → ~3,500 gas per verification) for ENS-side DNSSEC validation.

The same precompile this PR brings into ENS's canonical contracts is what this proposal's v1 Verifier consumes for WebAuthn-backed credential verification.

**Other prior work.**

- **Reference implementation of ENS-bound agent identity (unfunded, ongoing).** A working five-layer Trust Resolution Layer (TRL) composing ENSIP-25, ENSIP-26, and ERC-8004 — shipped as four MIT-licensed TypeScript packages, two live ENS-bound agent deployments (Ethereum mainnet + Base mainnet, ERC-8004 agents #24994 and #19327), a companion NCCoE position paper, and a [public ENS forum post](https://discuss.ens.domains/t/reference-implementation-of-an-ens-bound-agent/22100). [synthesis repo](https://github.com/estmcmxci/synthesis); [live agent](https://estmcmxci.co/agent/emilemarcelagustin.eth); [NCCoE paper](https://nccoe.emilemarcelagustin.eth.link).
- **Read-only authorization-layer pilot on a live MARP (public, May 2026).** A forward-declaring scaffold extending the agent-identity work above, on a draft PR to the [Bankr skills repo](https://github.com/BankrBot/skills/pull/189): a script that publishes credential / capability / revocation records onto an ENS name via NameStone (read-merge-write, non-clobbering) and a read-only counterparty verifier that resolves and reads them along the `verifyAction` ordering. Validated on a live throwaway subname (`authtest.bankrtest.eth`); [scrubbed demo log](https://gist.github.com/estmcmxci/3e8396cbad2faa66685bb423afc212b9). The on-chain `verifyAction` (signature verification + scheme dispatch) is a marked stub pending the M1 Verifier + AuthResolver — the pilot proves the record-publishing/resolution path works today against a real MARP's existing secp256k1 signing model with zero changes to its execution path.
- **Independent hackathon validation (2026).** **Synthesis Hackathon, 1st Place, ENS Identity track** (May 2026): TRL judged best-in-track on its ENS identity merits ([track](https://synthesis.mandate.md/tracks/ens-identity-i4jgf3); [project](https://synthesis.mandate.md/projects/trust-resolution-layer-b67a)). **ETHGlobal HackMoney 2026, Finalist + Integrate ENS bounty winner** (Jan 30 – Feb 11, 2026): "Oikonomos," a separate Steg-authored ENS integration, named Finalist (top-of-hackathon across all sponsor tracks) and won the ENS bounty ([showcase](https://ethglobal.com/showcase/oikonomos-w6z57)).
- **Public conference talk (Devcon SEA, Nov 2024, unfunded).** ~8 minute talk pitching universal ENS-as-login across Web2 surfaces with the L1 P-256 precompile as the load-bearing technical unlock — the same problem space the WebAuthn-for-ENS specification formalizes and PR #509 makes real. ["Universal ECCs: Use Cases for the P256 Precompile in Decentralized Internet Infrastructure"](https://www.youtube.com/watch?v=e_QBTQGMxPs) (Ethereum Foundation YouTube channel).

The synthesis stack (MIT-licensed, [github.com/estmcmxci/synthesis](https://github.com/estmcmxci/synthesis)) ships as four packages: `@synthesis/resolver` (TypeScript library), `@synthesis/cli` (**Ensemble CLI**, lifecycle: `issue → pin → publish → verify → rotate`), `@synthesis/conformance` (**Ensemble Conformance Suite**), and `@synthesis/site` (explorer at [estmcmxci.co](https://estmcmxci.co)). The live reference deployment at [estmcmxci.co/agent/emilemarcelagustin.eth](https://estmcmxci.co/agent/emilemarcelagustin.eth) is an ENS-bound agent with nine ENSIP-64 text records on Ethereum mainnet, an ERC-8004 binding on Base mainnet (agent #24994), and a hosted runtime on Pinata Agents. A parallel test deployment runs as ERC-8004 agent #19327 at `alpha-go.bankrtest.eth`.

---

## 5. Problem

AI agents increasingly take actions across apps, services, and hosted runtimes — but authorization for those actions lives in vendor-specific systems. Each counterparty needs its own way to confirm an action was authorized by the agent's operator, and there is no shared substrate for rotation, revocation, or audit when that authority changes.

A new operator class is emerging — managed agent runtime platforms (MARPs), hosted runtimes providing agent-lifecycle primitives (tool execution and endpoint routing; secrets and credentials; scheduling; policy controls; observability; identity surface). Pilots are moving to governed production with vendors iterating fast: Pinata Agents, Virtuals Protocol, and Bankr Agents are shipping production-grade MARPs today; Microsoft Entra Agent ID's preview marks enterprise-vendor entry; and Anthropic and Cloudflare's [Claude Managed Agents](https://github.com/cloudflare/claude-managed-agents) launched in May 2026 with self-hosted sandboxes, zero-trust policy injection, and custom egress proxies.

What MARPs do not standardize is a portable authorization layer counterparties can verify independently — no outside service can verify, in real time, that an agent-signed action came from a credential the operator currently authorizes. (Full operator-class case in [Steg's ENS forum post, May 2026](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121).)

ENS is the right surface for this work because the naming, discovery, and registry primitives are already in place — ENSIP-25 (identity binding), ENSIP-26 (discovery), ENSIP-64 (typed records), and ERC-8004 (agent registry). What the current stack does not provide on its own is the **ENS-keyed authority-policy lookup layer** above those primitives: a resolver-level surface that lets any service confirm, in real time, that a signed action came from a credential currently authorized for an ENS name and that the credential has not been rotated, expired, or revoked.

This layer is distinct from wire-protocol auth (MCP, A2A), which answers "did the client present valid credentials," and from on-chain delegation execution (ERC-4337 session keys), which executes scoped permissions onchain. Neither of those tells a relying party which keys and capabilities are currently the ENS-name's authorized ones. That lookup is the gap, and that lookup is what this proposal delivers.

### **Why an ENS name (vs. a wallet address or platform ID).**

A name is the right primary key for agent authority for three load-bearing reasons.

1. **Portability:** the same identity moves across runtimes and counterparties without re-onboarding — a platform ID dies at platform exit, and a raw wallet address carries no human-readable referent that survives key rotation.
2. **Audit trails:** counterparties, ops teams, and regulators can trace actions against a stable label rather than reconciling rotating addresses across runtimes.
3. **Ownership semantics:** name transfer atomically transfers authority (see §10, "Atomic role invalidation on name transfer") — the operator-continuity primitive a wallet-address-only model cannot provide. Naming is the substrate layer that turns the rest of the agent stack — registry, wire-protocol auth, capability tokens, account-abstraction execution — into a coherent identity any counterparty can resolve and verify.

ENSv2's specified primitives (in preview at [ensdomains/contracts-v2](https://github.com/ensdomains/contracts-v2), mainnet deployment forthcoming) provide persistent storage and revocable write permissions, but no native TTL or _selective_ per-record revocation primitive for record contents — records remain valid until the name owner rewrites or wholesale-wipes via `clearRecords()`. The AuthResolver fills this gap without modifying ENS core: it composes those v2 primitives into a verification orchestration surface carrying validity metadata (expiry timestamps, explicit revocation flags) and a Verifier contract that enforces them at lookup time. ENS Registry and existing resolver implementations are unchanged. This is schema and orchestration work on top of existing primitives — the same extension pattern ENSIP-24, ENSIP-25, and ENSIP-26 use to extend ENS into new domains without core modification.

Capability-token presentation (UCAN, CACAO) is an adjacent, non-competing architecture — offline chain verification at signing time, rather than current-state resolution by name. The two compose at the relying-party layer; full positioning in §10, three composition patterns in [Appendix B](./appendices/appendix-b-capability-tokens.md).

This gap matters now because agent identity systems are being defined in parallel: [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id) is currently in preview as a dedicated identity-and-authorization framework for AI agents, and other vendor systems are taking shape alongside it. ENS-native agent standards are still early — ERC-8004 reached mainnet in January 2026 and relevant ENSIPs are fresh — which makes the next twelve months the window in which ENS can establish a practical cross-vendor verification pattern for MARPs rather than retrofit one later. The §6 toolkit is scoped to ship inside that window; the funding case for shipping it through SPP3 — and the cost of not — is in §9.

---

## 6. Proposed Service

This proposal funds a defined integration service for teams building apps, APIs, managed agent runtimes (MARPs), and relying services that need to verify whether an action attributed to an ENS-named agent is currently authorized. MARPs represent the initial operator class with strong need for a portable, ENS-bound verification and authorization layer.

The service ships as a toolkit:

- **Onchain components** — a shared **Verifier** (EIP-7951 P-256, ecrecover, EIP-1271 staticcall) and a per-name **AuthResolver** (`AuthResolverImpl` + UUPS proxies via `VerifiableFactory`) composing ENSv2's EAC + HCA substrate into a verification orchestration layer for credential, capability, and revocation records. v1 scheme set selected to align with currently observable MARP signing environments (see [Appendix D](./appendices/appendix-d-deliverables-operationalization.md)); end-to-end verification flow in [Appendix C](./appendices/appendix-c-verifier-flow.md).
- **A TypeScript SDK** that resolves ENS-published authorization state, verifies signed requests, and returns normalized allow/deny outputs with reason codes (`verified` / `unverified` / `stale` / `revoked` / `mismatch` / `policy-denied` / `endpoint-unproven`). Includes per-name AuthResolver proxy deployment helpers.
- **A conformance suite** with reproducible test vectors — schema validity, record integrity, identity/authority binding, freshness/liveness, and adversarial mutation cases.
- **Integration guides** for apps, APIs, and managed agent runtimes — including recommended patterns for expiry, rotation, revocation, and policy enforcement.
- **Reference validation flows** across all supported signing models in production-like environments, including end-to-end authorization, rotation, revocation, and replay-protection testing.
- **Security package + completed third-party audit** of the Verifier and AuthResolver contracts — threat model, deterministic verifier checks, revocation precedence, replay protection, lifecycle semantics, and hardening checklist.

With the toolkit, integrators can resolve an ENS-named agent’s published authorization state, verify signed requests against current ENS state in real time, and enforce expiry, rotation, and revocation through normalized allow/deny reason codes across crypto-native and Web2 agent environments alike.

**By April 2027** the project delivers:

- audited Verifier and AuthResolver contracts,
- SDK v1.0,
- conformance suite and integration tooling,
- reference validation flows across all supported signing models,
- operational verification metrics,
- and a mainnet-ready hardened release validated in production-like environments.

An expanded scope extends the infrastructure into an external Wave-1 ecosystem integration, interoperability validation, and deployment support for early operator environments.

### Milestones

Per SPP3 conventions, milestones are targets (not gates) with target dates, shipped artifacts, and verification criteria checkable against public references. Quarterly status reports summarize progress.

### **Tier 1 (core infrastructure)**

| #   | Deliverable                                                                                                                                                                                                                            | Verification                                                                                                                                                                                                                            | Date              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | Verifier + AuthResolver deployed to Sepolia; TS SDK alpha; conformance suite scaffolding; third-party security review engaged                                                                                                          | Onchain deployment artifacts (`AuthResolverImpl`, Verifier addresses, ABI, bytecode hashes); SDK package registry; audit kickoff published (firm, scope, timeline)                                                                      | Oct 31, 2026 (M3) |
| 2   | Third-party audit completed + findings remediated; TS SDK v1.0; conformance suite completed; integration/spec documentation published                                                                                                  | Audit report published; remediation diff published; SDK versioned release; CI-passing conformance suite; documentation/spec references published                                                                                        | Jan 31, 2027 (M6) |
| 3   | Reference validation flows completed across all three supported signing models (WebAuthn/P-256, ECDSA, EIP-1271) in production-like environments; operational verification metrics finalized; mainnet-ready hardened release completed | Public validation reports; live end-to-end demos; replay rejection validation; revocation/rotation enforcement metrics; policy-deny correctness metrics; hardened release artifacts published; deployment readiness checklist completed | Apr 30, 2027 (M9) |

### **Tier 2 (expanded scope)**

| #   | Deliverable                                                                                                             | Verification                                                                                                                                             | Date               |
| --- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 4   | One external Wave-1 ecosystem integration; integration engineering support; interoperability report; deployment support | Public integration deployment; interoperability findings published; integration deployment documentation; operational interoperability validation report | Jul 31, 2027 (M12) |

---

## 7. Team & Working Model

**A two-person senior team, plus the committee as a third seat.** Steg is led by two senior builders:

- **`estmcmxci.eth` — ENS architecture, the spec, and ecosystem integration.** Track record in §4: a merged contribution to canonical ENS contracts (PR #509 / v1.7.0); the ENS Public Goods grant whose research output — the **Universal Resolver Matrix** — reframed ENS as a trust-routing system and seeded this proposal (this SPP productionizes one of its cells); a live multi-chain reference implementation; and independent jury validation.
- **`mouz.eth` (Mouz Delbourgo) — protocol engineering, smart-contract delivery, and security.** She has built and hardened production-grade systems across DeFi and NFT finance, including NFT lending protocols, collateral and accounting systems, LP staking and reward-distribution mechanisms, governance contracts, and upgradeable architectures. At Arcade.xyz, she contributed across multiple generations of lending infrastructure and protocol hardening efforts. She was also one of the winning teams in a Uniswap Foundation supported hackathon, building a Uniswap v4 hook focused on onchain trading infrastructure. Her engineering focus centers on adversarial systems thinking: secure state transitions, permission management, and authentication/authorization surface design.

This proposal’s highest-risk surface is the authorization layer itself, the Verifier and per-name AuthResolver, whose job is to make authorization decisions that remain correct under adversarial conditions. That surface is hardened through formal specification discipline, conformance testing, and a funded third-party security audit (§6 / M6).

**The committee is the third seat — board, not staff.** We treat the SPP committee as a board-like member of this effort: an oversight and capital-allocation role, not day-to-day steering. The working model makes that concrete — quarterly status reports (§6), milestone targets verifiable against public artifacts (§6), and every deliverable shipped in the open (MIT-licensed, public PRs, public demos). The committee sees the same evidence the public does, on a cadence, and can hold the work to its stated KPIs.

**Why this framing matters.** This proposal is not only funding a software deliverable; it is funding an infrastructure thesis: that managed agent runtimes represent an emerging operator category, and that ENS has an opportunity to become the neutral authority and coordination layer for that category before vendor-specific identity systems harden into closed ecosystems (§2; [forum post](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)). The toolkit is the implementation surface of that thesis: an ENS-native verification and authorization layer designed to establish open interoperability patterns early in the formation of the category.

---

## 8. Budget Request

**Line-item breakdown:**

| Line item                                        | Amount       | What it funds                                                                                                                                                                                                                                                                    |
| ------------------------------------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Onchain engineering and contract deployment      | $130,000     | Specification adaptation, contract implementation, integration with ENSv2 access-control substrate (`EnhancedAccessControl`, `HCAContextUpgradeable`), deployment, and reference deployment artifacts for the verification and resolver infrastructure (Verifier + AuthResolver) |
| SDK and verifier tooling                         | $55,000      | TypeScript SDK with versioned releases, reason-code taxonomy, developer-facing API, conformance-suite test harness                                                                                                                                                               |
| Reference integrations                           | $75,000      | Hands-on integration work for three Wave-1 pilots — engineering office hours, reference integration code, pilot-side debugging, per-pilot integration reports (~$25K per pilot)                                                                                                  |
| Third-party security audit and hardening package | $60,000      | Third-party security audit of the Verifier and AuthResolver contracts, threat model, deterministic verifier checks, revocation precedence rules, replay protection, lifecycle semantics, and the audit-ready hardening checklist                                                 |
| Documentation and integration support            | $15,000      | Integration guides, conformance suite documentation, public references                                                                                                                                                                                                           |
| Project management and reporting                 | $15,000      | Quarterly status updates, milestone tracking, committee reporting                                                                                                                                                                                                                |
| **Total**                                        | **$350,000** |                                                                                                                                                                                                                                                                                  |

---

## 9. Why this fits SPP

The current agent stack still lacks one layer ENS is well positioned to provide (§5). This proposal is a **defined ecosystem service** — toolkit, SDK, conformance suite, three pilot integrations — that complements core ENS Labs work rather than competing with it. The substrate is ready (ENSv2 primitives in preview at `ensdomains/contracts-v2`; EIP-7951 shipped in Fusaka 3 Dec 2025; ENSIP-25 merged; ERC-8004 mainnet Jan 2026), MARPs are moving from pilots to governed production, and the team has shipped to ENS's canonical contracts already ([PR #509](https://github.com/ensdomains/ens-contracts/pull/509) / [v1.7.0](https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0), March 2026).

**Why SPP3 funding matters.** The ENS growth wedge at the operator layer is subname issuance by new operator classes that find new payload to publish under ENS. MARPs are the new operator class; the AuthResolver + Verifier toolkit is the new payload that lets them build managed agent identity platforms (MAIPs, per §10) — without it, MARPs cannot issue ENS-bound agent identities at signup, and the per-platform-user subname-issuance pathway stays closed. The next twelve months are the window: enterprise-vendor MAIPs are crystallizing now (Microsoft Entra Agent ID preview; Anthropic + Cloudflare's Claude Managed Agents). If ENS doesn't ship the open MAIP substrate before the category locks in, the work ships as single-runtime tooling on a 24–36 month part-time arc, by which point enterprise platforms have shipped their own identity surfaces and ENS becomes a thin naming label over vendor-fragmented trust — Web2 SSO redux for the agent economy.

---

## 10. Technical Foundation

The technical foundation is the [WebAuthn-for-ENS specification](https://docs.steg.eth.link/specifications/webauthn-specification/) (§4) adapted to a two-contract scope: a shared **Verifier** consuming the EIP-7951 P-256 precompile, ecrecover, and EIP-1271 staticcall; and an **AuthResolverImpl** plus per-name UUPS proxies via `VerifiableFactory`. The AuthResolverImpl inherits ENSv2's access-control substrate (EAC + HCA) unchanged — preserving per-`(node, recordKey)` write delegation and atomic role invalidation on name transfer. New audit surface is bounded to Verifier dispatch logic and AuthResolver record schemas; ENS Registry and existing resolver implementations are unchanged. EIP-8121 cross-chain credential discovery is an optional encoding (M1 default: inline Direct; opt-in: Hook).

**Positioning vs. adjacent layers.** The toolkit layers above naming and discovery (ENSIP-25/26/64) and registry (ERC-8004/8122); sits upstream of wire-protocol auth (MCP, A2A); serves as the discovery layer for on-chain delegation execution (ERC-4337); composes with capability-token presentation (UCAN, CACAO; see [Appendix B](./appendices/appendix-b-capability-tokens.md)) at the relying-party layer.

**Full architectural map + normative detail in the [prototype specification](./spec/prototype_spec.v1.0-draft.02.publish.md) (working copy: [Google Doc](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)) and the [MAIP taxonomy**](./maip_taxonomy.md); substrate-inheritance excerpt in [Appendix E](./appendices/appendix-e-substrate-inheritance.md).

---

## 11. Conclusion

This proposal funds a defined integration service for ENS-keyed authority-policy lookup, delivered to managed agent runtime platforms. Over 12 months and $350,000, the work ships in four quarterly milestones (§6): the Verifier and AuthResolver deployed with an SDK alpha and a third-party audit firm engaged; the audit completed and remediated alongside SDK 1.0, the conformance suite, and integration guides; all three Wave-1 pilots integrated against the audited contracts with KPIs measured; and a final threat-model, hardening, and governance-roadmap package for the ENS DAO.

The service operationalizes existing ENS standards (ENSIP-25, ENSIP-26, ENSIP-64, ERC-8004) and optionally consumes EIP-8121 for an emerging integration category, delivering a reusable, scheme-extensible verification pattern. Three Wave-1 pilots — currently targeted at Pinata Agents (operator), Virtuals Protocol (protocol-native), and x402 (capability publisher) — demonstrate the pattern across the MARP ecosystem; Bankr Agents, whose signing model is already verified day-zero-compatible with the v1 Verifier (§2; Appendix D), is the lead near-term integration target.

The proposal does not replace existing ENS primitives; it operationalizes ENS as the interoperable authority-policy lookup layer for managed agent runtime platforms.

---
