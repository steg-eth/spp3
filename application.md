# ENS Verification and Revocation Toolkit for Managed Agent Runtimes (MARPs)

_A practical, open-source ENS-native authorization and verification toolkit for managed agent runtimes: Verifier + AuthResolver contracts, a TypeScript SDK, a conformance suite, integration guides, and end-to-end operational validation flows establishing an open interoperability pattern for agent identity and authorization._

---

## 1. Application Summary

|                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Submitted by**       | Steg — `estmcmxci.eth` · `mouz.eth`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Requested funding**  | Tier 1: $265,000 core infrastructure scope; Tier 2: $175,000 expanded scope                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Term**               | July 2026 – July 2027                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Primary category**   | ENS Infrastructure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Secondary category** | Outreach and Integrations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

**Track Record.** **`estmcmxci.eth`** — merged upstream contributor to canonical ENS contracts ([PR #509](https://github.com/ensdomains/ens-contracts/pull/509), Jan 2026, shipped March 2026 in [v1.7.0](https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0) — EIP-7951 P-256 precompile integration in ENS's DNSSEC oracle, ~98% gas reduction). ENS Public Goods grantee ("ENS v2 Interop Research" Sep 2025, Stage 1 completed). Independent jury validation (2026): Synthesis Hackathon 1st Place, ENS Identity track (May); ETHGlobal HackMoney 2026 Finalist (Feb).

**`mouz.eth` (Mouz Delbourgo)** — production smart-contract systems across DeFi and NFT finance at Arcade.xyz ([NFT lending](https://github.com/arcadexyz/arcade-protocol/blob/main/contracts/rollover/CrossCurrencyRollover.sol), collateral/accounting, [LP staking](https://github.com/arcadexyz/dao-contracts), [governance contracts](https://github.com/arcadexyz/governance/blob/main/contracts/NFTBoostVault.sol)). Uniswap Foundation competition-winning [Uniswap v4 hook](https://github.com/Mouzayan/dex-profit-wars). Specializing in security and authorization-surface design.

---

## 2. Customer and Strategic Shape

**Probable customers are production-scale managed agent runtime platforms (MARPs) whose current signing models the v1 toolkit already covers:** Pinata Agents is the live hosting runtime for Steg's [reference agent](https://estmcmxci.co/agent/emilemarcelagustin.eth) on `emilemarcelagustin.eth`; Virtuals Protocol's ACP CLI generates P-256 signers natively (per §6); Bankr Agents' `/agent/sign` + EIP-7702/EIP-1271 wallet model has been end-to-end verified for day-zero compatibility with the v1 Verifier (per [Appendix D](./appendices/appendix-d-deliverables-operationalization.md)). x402 (Coinbase's open agentic payments protocol) is the currently-targeted capability-publisher pilot.

Steg is a participant in **Pinata Agents' Partner Templates program** (April 2026 onboarding; Drew Trombley, Pinata Sales & BD lead). Two reference templates in active development: **OpenClaw** (general-purpose agent template) and **Hermes** (target-specific template). These templates require verification of agent-signed actions against ENS-published authorization state — the core capability the v1 Verifier + AuthResolver ships as shared, forkable open-source infrastructure.

**The strategic bet is that managed agent runtimes represent an emerging operator category** ([full case in Steg's ENS forum post, May 2026](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)), and that this category will require shared verification, revocation, and authorization infrastructure as it matures. The goal of this proposal is to establish an ENS-native authority and interoperability layer before vendor-specific identity and authorization systems harden into fragmented silos. Concretely, the proposal ships a verification and revocation toolkit (Verifier + AuthResolver + SDK + conformance suite + integration guides) that MARP platforms can integrate into subname issuance and agent authorization flows.

The value proposition is infrastructure leverage: creating an open ENS-native verification and authorization pattern that future agent ecosystems can compose around rather than reimplement independently. If this operator category scales, ENS becomes the natural coordination surface for agent identity, authority, and revocation rather than fragmented vendor-local identity systems.

---

## 3. Abstract

No service today can verify, in real time, whether an action attributed to an ENS-named agent is currently authorized.

ENS lacks a standardized, resolver-native authorization and verification layer for dynamic permissions, credential validity, revocation, and portable agent identity.

The agent stack today has naming and discovery (ENSIP-25/26 — ENS standards for binding agent records to a name), registry (ERC-8004/8122 — onchain agent registry standards), wire-protocol authentication (MCP, A2A — client-to-server and agent-to-agent message protocols), on-chain delegated execution (ERC-4337 — account abstraction with session keys), and attestation (EAS — Ethereum Attestation Service) — but no layer above them ties those systems to _current_ authority under an ENS name.

This SPP fills that gap as a defined ENS-native interoperability and verification layer for teams building apps, APIs, relying services, and managed agent runtimes (MARPs). It ships an ENS-native authorization toolkit — a Verifier, AuthResolver, SDK, and conformance suite — composed on top of ENSv2 primitives:

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

Managed agent systems increasingly operate across apps, services, APIs, and hosted runtimes — but authorization for those actions remains fragmented across vendor-specific identity systems. Each counterparty must independently determine whether an action was authorized by the agent’s operator, with no shared coordination layer for revocation, rotation, lifecycle management, or auditability when authority changes.

An emerging operational category is forming around managed agent runtimes (MARPs): hosted systems providing agent lifecycle primitives such as execution routing, scheduling, credentials, policy controls, observability, and identity surfaces. These systems are increasingly moving from experimental deployments toward governed production environments with vendors iterating fast: Pinata Agents, Virtuals Protocol, and Bankr Agents are shipping production-grade MARPs today; Microsoft Entra Agent ID's preview marks enterprise-vendor entry; and Anthropic and Cloudflare's [Claude Managed Agents](https://github.com/cloudflare/claude-managed-agents) launched in May 2026 with self-hosted sandboxes, zero-trust policy injection, and custom egress proxies.

What MARPs do not standardize is a portable authorization layer counterparties can verify independently — there is no standardized cross-platform service for independently verifying in real time, that an agent-signed action came from a credential the operator currently authorizes. (Full operator-class case in [Steg's ENS forum post, May 2026](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121).)

ENS is the right surface for this work because the naming, discovery, and registry primitives are already in place — ENSIP-25 (identity binding), ENSIP-26 (discovery), ENSIP-64 (typed records), and ERC-8004 (agent registry). What the current stack does not provide on its own is the **ENS-keyed authority-policy lookup layer** above those primitives: a resolver-level surface that lets any service confirm, in real time, that a signed action came from a credential currently authorized for an ENS name and that the credential has not been rotated, expired, or revoked.

### **Why an ENS name**

**ENS names are the natural cross-platform coordination primitive for long-lived agent authority.**

The hard problem is not merely authentication, it is persistent authority coordination across heterogeneous systems. Agents move across runtimes, keys rotate, platforms change, permissions evolve, and execution environments upgrade over time.
Without a shared coordination surface, each platform builds its own identity graph, trust model, and authority registry. This creates fragmented vendor-local identity systems, non-portable authorization, incompatible trust assumptions, and increasing ecosystem lock-in.

ENS is uniquely positioned to solve this because it already provides:

- global naming
- ownership semantics
- delegation semantics
- resolvable state
- composability
- and Ethereum-native neutrality
- within an open, ecosystem-shared identity substrate.

**Why names matter more than addresses**
Wallet addresses are implementation-level credentials.

ENS names are persistent coordination identities.

Addresses rotate. Keys rotate. Smart accounts upgrade. Execution environments change.

But the identity surface persists.

Wallet addresses identify cryptographic endpoints. ENS names identify persistent operational entities that counterparties, services, runtimes, and users can continuously resolve and verify over time.

As managed agent infrastructure matures, the ecosystem needs identities that survive underlying infrastructure changes while remaining globally resolvable, portable, and vendor-neutral. ENS is uniquely positioned to provide that coordination surface.

ENSv2's specified primitives (in preview at [ensdomains/contracts-v2](https://github.com/ensdomains/contracts-v2), mainnet deployment forthcoming) provide persistent storage and revocable write permissions, but no native TTL or _selective_ per-record revocation primitive for record contents — records remain valid until the name owner rewrites or wholesale-wipes via `clearRecords()`. The AuthResolver fills this gap without modifying ENS core: it composes those v2 primitives into a verification orchestration surface carrying validity metadata (expiry timestamps, explicit revocation flags) and a Verifier contract that enforces them at lookup time. ENS Registry and existing resolver implementations are unchanged. This is schema and orchestration work on top of existing primitives — the same extension pattern ENSIP-24, ENSIP-25, and ENSIP-26 use to extend ENS into new domains without core modification.

This gap matters now because agent identity systems are being defined in parallel: [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id) is currently in preview as a dedicated identity-and-authorization framework for AI agents, and other vendor systems are taking shape alongside it. ENS-native agent standards are still early — ERC-8004 reached mainnet in January 2026 and relevant ENSIPs are fresh — which makes the next twelve months the window in which ENS can establish a practical cross-vendor verification pattern for MARPs rather than retrofit one later. The §6 toolkit is scoped to ship inside that window; the funding case for shipping it through SPP3 — and the cost of not — is in §9.

---

## 6. Proposed Service

This proposal funds a defined integration service for teams building apps, APIs, managed agent runtimes (MARPs), and relying services that need to verify whether an action attributed to an ENS-named agent is currently authorized. MARPs represent the initial operator class with strong need for a portable, ENS-bound verification and authorization layer — shared, forkable open-source infrastructure new operator classes adopt rather than each one reimplementing locally.

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

### Team

**A two-person senior team, plus the committee as a third seat.** Steg is led by two senior builders:

- **`estmcmxci.eth` — ENS architecture, the spec, and ecosystem integration.** Track record in §4: a merged contribution to canonical ENS contracts (PR #509 / v1.7.0); the ENS Public Goods grant whose research output — the **Universal Resolver Matrix** — reframed ENS as a trust-routing system and seeded this proposal (this SPP productionizes one of its cells); a live multi-chain reference implementation; and independent jury validation.
- **`mouz.eth` (Mouz Delbourgo) — protocol engineering, smart-contract delivery, and security.** She has built and hardened production-grade systems across DeFi and NFT finance, including NFT lending protocols, collateral and accounting systems, LP staking and reward-distribution mechanisms, governance contracts, and upgradeable architectures. At Arcade.xyz, she contributed across multiple generations of lending infrastructure and protocol hardening efforts. She was also one of the winning teams in a Uniswap Foundation supported hackathon, building a Uniswap v4 hook focused on onchain trading infrastructure. Her engineering focus centers on adversarial systems thinking: secure state transitions, permission management, and authentication/authorization surface design.

This proposal’s highest-risk surface is the authorization layer itself, the Verifier and per-name AuthResolver, whose job is to make authorization decisions that remain correct under adversarial conditions. That surface is hardened through formal specification discipline, conformance testing, and a funded third-party security audit (§6 / M6).

### Working model

The committee functions as a third seat in an oversight and capital-allocation capacity, closer to a board role than day-to-day project management. The working model reflects that structure through:

- quarterly status reporting (§6),
- milestone verification against public artifacts,
- open-source development (MIT licensed),
- public PRs,
- public demos,
- and independently verifiable deliverables.

The committee and the public evaluate the same evidence on the same cadence.

### Why this framing matters

This proposal is not only funding a software deliverable; it is funding an infrastructure thesis: that managed agent runtimes represent an emerging operator category, and that ENS has an opportunity to become the neutral authority and coordination layer for that category before vendor-specific identity systems harden into closed ecosystems (§2; [forum post](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)). The toolkit is the implementation surface of that thesis: an ENS-native verification and authorization layer designed to establish open interoperability patterns early in the formation of the category.

---

## 8. Budget Request

### Tier 1 — Core Infrastructure / Reference Architecture

**Core Public-Good Deliverable**

| Line item                                   | Amount   | Purpose                                                                                                                                                                                                                                                |
| ------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Onchain engineering and contract deployment | $140,000 | Contract implementation, integration with ENSv2 access-control substrate (`EnhancedAccessControl`, `HCAContextUpgradeable`), deployment, and reference deployment artifacts for the verification and resolver infrastructure (Verifier + AuthResolver) |
| SDK and verifier tooling                    | $55,000  | TypeScript SDK, developer tooling, reason-code taxonomy, conformance harness                                                                                                                                                                           |
| Documentation                               | $15,000  | Spec refinement, integration guides, public references                                                                                                                                                                                                 |
| Project management and reporting            | $15,000  | Quarterly status updates, milestone tracking, committee reporting                                                                                                                                                                                      |
| Core security review                        | $40,000  | Targeted third-party review, lifecycle/auth analysis, threat-model validation                                                                                                                                                                          |

**Tier 1 Total**: $265K

### Tier 2 — Ecosystem Validation / Integration Expansion

**Ecosystem Activation + Production Hardening**

| Line item                                         | Amount  | Purpose                                                                                                                                                                                                                    |
| ------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wave-1 ecosystem validation                       | $80,000 | Wave-1 ecosystem validation across early MARP environments, including reference integrations, interoperability testing, deployment support, and integration reports validating the architecture under operating conditions |
| Expanded production audit and ecosystem hardening | $65,000 | Broader production audit scope, interoperability review, deployment hardening, operational testing                                                                                                                         |
| Documentation                                     | $15,000 | Integration guides, public references                                                                                                                                                                                      |
| Project management and reporting                  | $15,000 | Quarterly status updates, milestone tracking, committee reporting                                                                                                                                                          |

**Tier 2 Total**: $175K

**Combined Full Expansion**: $440K

---

## 9. Why this fits SPP

The current agent stack still lacks one layer ENS is well positioned to provide (§5). This proposal is a **defined ecosystem service** — toolkit, SDK, conformance suite, and operational validation flows — that complements core ENS Labs work rather than competing with it. The substrate is ready (ENSv2 primitives in preview at `ensdomains/contracts-v2`; EIP-7951 shipped in Fusaka 3 Dec 2025; ENSIP-25 merged; ERC-8004 mainnet Jan 2026), MARPs are moving from pilots to governed production, and the team has shipped to ENS's canonical contracts already ([PR #509](https://github.com/ensdomains/ens-contracts/pull/509) / [v1.7.0](https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0), March 2026).

**Why SPP3 funding matters.** The ENS growth wedge at the operator layer is subname issuance by new operator classes that find new payload to publish under ENS. MARPs are the new operator class; the AuthResolver + Verifier toolkit is the new payload that lets them build managed agent identity platforms (MAIPs, per §10) — without it, ENS-bound agent identity remains vendor-local and non-portable across operator environments, and the per-platform-user subname-issuance pathway stays closed. The next 12–24 months likely represent the formative window in which cross-vendor agent identity patterns are established. Enterprise-managed agent platforms are beginning to operationalize identity and authorization layers (Microsoft Entra Agent ID preview; Anthropic + Cloudflare's Claude Managed Agents). If ENS doesn't ship the open MAIP substrate before the category locks in, the work ships as single-runtime tooling on a 24–36 month part-time arc, by which point enterprise platforms have shipped their own identity surfaces and ENS becomes a thin naming label over vendor-fragmented trust — Web2 SSO redux for the agent economy.

**Counterfactual.** *Would this work happen without SPP3 funding?* No. ENS Labs is staffed against core protocol delivery (ENSv2, agent ENSIPs) — not against the operator-layer substrate MARPs need to build Managed Agent Identity Platforms (MAIPs) on top of ENS. **This proposal does not build a MAIP; it ships the interoperable substrate (Verifier + AuthResolver + SDK + conformance suite) that lets MARPs build their own portable MAIPs against shared ENS-published authorization state.** Without it, each MARP re-implements identity locally and the cross-runtime portability ENS uniquely enables is foreclosed. Steg's prior shipping at exactly this operator-layer surface (per §4) is the demonstration that this is the team positioned to ship the substrate before the category locks in.

**Why interoperability infrastructure compounds.** The strategic value of this proposal is not tied to a single runtime or integration. The leverage comes from establishing an open ENS-native coordination and verification pattern before vendor-local identity systems harden into fragmented ecosystems.

Historical infrastructure layers such as OAuth, WalletConnect, and ERC standards became valuable not because they directly owned end users, but because ecosystems converged around shared coordination surfaces that reduced integration cost and increased composability.

Early signs of the same interoperability dynamic are already emerging around managed agent runtimes.
As agents move from experimental tools into persistent production systems, managed runtimes increasingly become the operational coordination layer between agents, wallets, APIs, users, and counterparties.

This proposal establishes an open ENS-native authority and verification layer before those patterns ossify. The architecture compounds through reuse: once relying parties integrate a shared verification pattern, additional runtimes can adopt the same model with lower integration cost, increasing incentives for ecosystem convergence around interoperable standards rather than proprietary identity silos.

The category is still emerging, but the underlying operator pattern is already visible across hosted agent runtimes, smart-account-backed agent systems, enterprise-managed agent infrastructure, and ERC-4337-based execution environments.

---

## 10. Technical Foundation

The technical foundation is the [WebAuthn-for-ENS specification](https://docs.steg.eth.link/specifications/webauthn-specification/) (§4) adapted to a two-contract scope: a shared **Verifier** consuming the EIP-7951 P-256 precompile, ecrecover, and EIP-1271 staticcall; and an **AuthResolverImpl** plus per-name UUPS proxies via `VerifiableFactory`. The AuthResolverImpl inherits ENSv2's access-control substrate (EAC + HCA) unchanged — preserving per-`(node, recordKey)` write delegation and atomic role invalidation on name transfer. New audit surface is bounded to Verifier dispatch logic and AuthResolver record schemas; ENS Registry and existing resolver implementations are unchanged. EIP-8121 cross-chain credential discovery remains optional and non-required for the core authorization flow (M1 default: inline Direct; opt-in: Hook).

**Previously deployed architectural precedent.** The orchestrator-plus-verifier topology this scope inherits is exercised by Steg's [TLD Oracle](https://dnssec.eketc.co/tld-oracle), a testnet system that fetches DNSSEC proofs offchain and verifies them onchain via a two-contract split: a `TLDMinter` orchestrator ([`0x4872…980F`](https://sepolia.etherscan.io/address/0x48729B7e0bA736123a57c4B6A492BDAbedAF980F)) handling timelocked claim processing, and a stateless `DnssecP256Verifier` ([`0x580F…766B`](https://sepolia.etherscan.io/address/0x580F2Db4Da8E6D5c654aa604182D0dFD17D5766B)) consuming the EIP-7951 P-256 precompile via the `P256SHA256Algorithm` contract integrated into ENS's canonical contracts by [PR #509](https://github.com/ensdomains/ens-contracts/pull/509). Deployed on Sepolia.

The proposed scope swaps the proof type (DNSSEC RRSIG → WebAuthn assertions, ecrecover, EIP-1271 staticcall) and adds per-name UUPS proxies via `VerifiableFactory`, but reuses the same orchestrator-plus-stateless-verifier separation already proven in deployment.

**Non-goals.** This proposal does not deliver wire-protocol authentication (MCP, A2A, which answer "did the client present valid credentials") or on-chain delegated execution (ERC-4337 session keys, which execute scoped permissions onchain). It does not replace capability-token presentation (UCAN, CACAO, which prove delegated authority at signing time). The toolkit composes with these at the relying-party layer (see [Appendix B](./appendices/appendix-b-capability-tokens.md)) and layers above naming and discovery (ENSIP-25/26/64) and registry (ERC-8004/8122).

**Full architectural map + normative detail** in the [prototype specification](./spec/prototype_spec.v1.0-draft.02.publish.md) (working copy: [Google Doc](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)) and the [MAIP taxonomy](./maip_taxonomy.md); substrate-inheritance excerpt in [Appendix E](./appendices/appendix-e-substrate-inheritance.md).

---

## 11. Conclusion

This proposal funds a defined ENS-native authority and verification infrastructure layer for apps, APIs, relying services, managed agent runtimes, and emerging operator environments that need to verify whether an action attributed to an ENS-named agent is currently authorized.

The proposal is structured in two tiers:

- **Tier 1 ($265k)** delivers the core infrastructure scope: the Verifier and AuthResolver contracts, SDK, conformance suite, integration guides, end-to-end operational validation flows, third-party security audit, and a mainnet-ready hardened release.
- **Tier 2 ($175k)** is an expanded ecosystem expansion scope focused on external interoperability validation, deployment support, and an early ecosystem integration across a potential operator environment.

Over a 12-month cycle, the work ships through quarterly milestones: initial deployment artifacts and SDK alpha; completed third-party audit and remediation alongside SDK v1.0 and conformance coverage; operational validation of the verification and authorization flows across supported signing models; and a Tier 2 scope for ecosystem expansion phase centered on external interoperability, integration and support.

The service operationalizes existing ENS standards (ENSIP-25, ENSIP-26, ENSIP-64, ERC-8004) and optionally composes with EIP-8121 as an extensible discovery mechanism for emerging agent environments. The proposal’s purpose is not to prove adoption across the MARP ecosystem, but to establish and validate:

- the architecture,
- the interoperability pattern,
- the verification flow,
- and the authorization semantics

required for portable ENS-native agent identity and authorization.

The proposal does not replace existing ENS primitives; it operationalizes ENS as an interoperable authority-policy lookup layer for persistent agent identity and authorization across heterogeneous systems.

---
