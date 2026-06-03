# ENS Verification and Revocation Toolkit for Agent Subname Issuance

 A practical, open-source ENS-native authorization and verification toolkit that lets managed
 agent runtime platforms (MARPs) issue agent identities as ENS subnames carrying scoped,
 revocable, currently verifiable authority — Verifier + AuthResolver contracts, a TypeScript
 SDK, a conformance suite, integration guides, and end-to-end operational validation flows
 establishing an open interoperability pattern for agent identity and authorization.

 Submission repo:
 github.com/steg-eth/spp3 (https://github.com/steg-eth/spp3) · Submitted by
 estmcmxci.eth (https://ens.app/estmcmxci.eth) ·
 mouz.eth (https://ens.app/mouz.eth)

## Contents

- Team Profile (#team)

- Abstract (#abstract)

-
 Problem (#problem)

- Adoption and Utility (#problem-adoption)

- Registrations and Revenue (#problem-revenue)

- Verifiable metric (#problem-metric)

-
 Approach (#approach)

- Scope (#approach-scope)

- Milestones (#approach-milestones)

- Budget (#approach-budget)

- Counterfactual (#approach-counterfactual)

- Delivery History (#delivery)

- Technical Foundation (#foundation)

- Conclusion (#conclusion)

- Compliance & Attestations (#compliance)

 Submitted by  |
 Steg.eth — estmcmxci.eth (https://ens.app/estmcmxci.eth) · mouz.eth (https://ens.app/mouz.eth)  |
 Requested funding  |
 $440,000 total requested (Tier 1: $265,000; Tier 2: $175,000)  |
 Term  |
 July 2026 – July 2027  |
 Primary category  |
 ENS Infrastructure  |
 Secondary category  |
 Outreach and Integrations  |
 Prior Delivery  |
 Merged contributor to canonical ENS contracts (
 PR #509 (https://github.com/ensdomains/ens-contracts/pull/509) /
 v1.7.0 (https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0)); Public
 Goods grantee —
 ENSv2 interoperability research (https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392/11?u=estmcmxci)
 ; 1st-place
 ENS-identity hackathon (https://synthesis.mandate.md/projects/trust-resolution-layer-b67a)
  |
## Team Profile

 estmcmxci.eth (https://ens.app/estmcmxci.eth)

ENS architecture · spec · ecosystem integration

 ENS core

 Merged contributor to canonical ENS contracts —
 PR #509 (https://github.com/ensdomains/ens-contracts/pull/509) /
 v1.7.0 (https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0)
 (EIP-7951 P-256 precompile, ~98% gas reduction).

 Research

 ENS Public Goods grantee —
 “ENS v2 Interop Research” (https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392/11?u=estmcmxci)
 ; output, the
 Universal Resolver Matrix (https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734?u=estmcmxci)
 , seeded the architecture (https://docs.steg.eth.link) this proposal
 productionizes.

 Awards

 Synthesis Hackathon 1st (https://synthesis.mandate.md/projects/trust-resolution-layer-b67a)
 (ENS Identity) ·
 ETHGlobal HackMoney 2026 Finalist (https://ethglobal.com/showcase/oikonomos-w6z57)
 .

 Talk

 Devcon SEA 2024 — “Universal ECCs” (https://www.youtube.com/watch?v=e_QBTQGMxPs)
 (Ethereum Foundation).

 mouz.eth (https://ens.app/mouz.eth)

Protocol engineering · smart-contract delivery · security

 Protocol

 Production smart-contract systems across DeFi & NFT finance at Arcade.xyz —
 NFT lending (https://github.com/arcadexyz/arcade-protocol/blob/main/contracts/rollover/CrossCurrencyRollover.sol)
 , collateral/accounting,
 LP staking (https://github.com/arcadexyz/dao-contracts),
 governance (https://github.com/arcadexyz/governance/blob/main/contracts/NFTBoostVault.sol)
 .

 Prize

 Uniswap Foundation prize at the
 UHI incubator (https://atrium.academy/uniswap) for a
 v4 hook (https://github.com/Mouzayan/dex-profit-wars) implementation.

 Focus

 Adversarial systems thinking — secure state transitions, permission management, and
 authentication/authorization surface design.

## 1. Abstract

 AI agents increasingly take actions across apps, APIs, and hosted runtimes — but outside
 services generally cannot portably verify, in real time across heterogeneous systems, that an
 agent-signed action is backed by credentials its operator currently authorizes.

 Authorization remains fragmented within vendor-specific silos, with no shared substrate for
 rotation, revocation, audit, or cross-platform verification.

 Agents need names so authority can be discovered and verified across heterogeneous systems. In
 this context, ‘using ENS’ means binding an agent to an ENS name that publishes its
 current authorization state, allowing any relying party to independently verify permissions in
 real time.

 ENS already provides the naming, discovery, and registry primitives. What it lacks is the layer
 above them: a standardized, resolver-native, neutral authorization-and-verification
 layer that turns an ENS name into a live authority-policy lookup that allows any
 service to independently verify, at use time, whether an agent remains authorized. This proposal ships
 that layer.

 Prototype spec (https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)
 — Verifier + AuthResolverImpl on ENSv2: authority record schemas (credential, capability,
 revocation), the verify-action flow across WebAuthn-P256 / ECDSA / EIP-1271, and the normative
 conformance criteria that define the layer this proposal ships.

 An ENS-native, vendor neutral authorization toolkit — Verifier, AuthResolver, SDK, and
 conformance suite built on ENSv2 — lets any integrator resolve ENS-published authority, verify a
 signed request against current state, and enforce expiry, rotation, and revocation through
 normalized allow/deny reason codes.

 The initial target integrator is the managed agent runtime platform (MARP): operator platforms
 offering agent-executable wallets across apps/APIs that need portable — for more, read our taxonomy document (https://docs.google.com/document/d/1zN0Dp9Tm7JCoLb-QYbigZuiB8O9vB7cEr6Pu96ewJRQ/edit?usp=sharing) in the appendix.

 MARP adoption follows an established ENS growth pattern: operator-issued subnames, validated in
 production by Coinbase’s cb.id deployment. The difference is that the payload now carries
 authority, not identity alone.

 Tier 1 delivers the core infrastructure (audited contracts, SDK, conformance suite, reference
 validation flows for independently verifying current authorization state); Tier 2 adds one
 external Wave-1 ecosystem integration, engineering and deployment support.

 Wave-1 integration partners are in early discussion — pre-commitment, not yet contracted. Steg
 is in the Pinata Agents Partner Templates program, and has an in-flight Bankr engagement
 (ENS-agent-identity
 PR #189 (https://github.com/BankrBot/skills/pull/189); AuthResolver Phase A validated
 on a live Bankr test name). Neither the milestone structure nor the Wave-1 floor depends on any
 single partner.

 By July 2027, Steg delivers production MARP integration issuing ENS agent subnames at measurable volume,
 with a public dashboard for subname issuance and active authority records, plus externally
 verifiable delivery artifacts: deployed contracts, a CI-passing conformance suite, and a
 completed third-party audit.

## 2. Problem

 Onchain actors are increasingly delegating authority to third-party agents — recreating, at
 machine speed, what researchers call the AI aligment problem in principal–agent transactions. Hadfield & Koh (2025) (https://www.jstor.org/stable/2634162)

 Once authorized, it’s difficult to ensure that an agent acts only within bounded authority,
 and the principal has no way to verify in real time that a given action remains within those
 bounds.

 Recent exploits leverage prompt injection to trick an agent into acting beyond its mandate.
 Because the key the agent holds is itself the permission credential, that manipulated intent can
 still produce a valid signature. The relying party, unable to distinguish “authorized”
 from merely “signed,” executes it.

 The Grok–Bankr exploit (Base, 2026). An attacker DMed @grok a
 Morse-code message; Grok “helpfully” decoded it into a plaintext transfer
 instruction tagging @bankrbot, which treated the public reply as an executable
 command and drained ~3B DRB tokens (~80–88% later recovered via negotiation) —
 SlowMist analysis (https://slowmist.medium.com/behind-the-grok-exploitation-an-analysis-of-ai-agent-permission-chain-abuse-4d832d1bfc73)
 . The incident is exactly the failure mode described in section 2: The execution layer could not independently verify whether the instruction remained authorized under the operator’s current policy, and executed it anyway.

 Our proposal supplies the missing authorization check the post-mortem calls for: before executing,
 a relying party verifies the request against the agent’s current ENS-published authority
 (Verifier + AuthResolver), where a plaintext reply is not an authorized credential and the requested action
 fails the published amount/recipient policy — it protects any MARP that performs the check at execution time, regardless of runtime implementation.

In the real world, delegated authority takes a familiar form: the Power of Attorney.

 Relying parties like banks check a public registry for the document’s current status,
 confirming the agent currently holds the authority to act on behalf of the principal.

In other words, the relying party trusts the registry, not the agent.

 If the principal revokes the Power of Attorney, the agent can no longer carry out its intent.

 In agentic finance, no such backstop exists: the key the agent holds is the permission
 credential — we need to decouple the two.

By storing the credentials within a subname’s text records, a relying party can run a
 freshness check against an authority registry before execution, confirming the action is
 currently authorized under the operator’s published authority state, including revocation,
 expiry, and policy updates.

 Because the authority state is published on a shared ENS namespace rather than inside a single
 runtime, any counterparty can independently resolve and verify it. Authorization becomes portable
 across runtimes instead of remaining vendor-local.

 And because operators issue those credentials as ENS subnames, the same act that makes agentic
 transactions safer also grows ENS.

### 2.1 Adoption and Utility

 Coinbase’s strategic integration of ENS (https://ens.domains/blog/post/coinbase-strategic-integration-of-ens)
 , analyzed in prior work by estmcmxci.eth, demonstrates a growth pattern that this proposal
 tracks to — with cb.id subname issuance as the canonical, in-production case. Operator-issued
 subnames have driven
 ENS growth since (https://x.com/ensdomains/status/2051331560767623537).

 This proposal applies that same pattern to the next operator class: managed agent runtime
 platforms (MARP) — similar to a wallet, but exposing an agent-executable interface.

 MARPs increasingly delegate signing authority via session-key primitives (EIP-7702, ERC-4337,
 ERC-7710/7715) that constrain what an agent can sign, but there is no standardized way for
 independently verifying, in real time, that an agent-signed action remains authorized under the
 operator’s current published authority state. (Full operator-class case in
 Steg’s ENS forum post, May 2026 (https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)
 .)

 Building on the format cb.id subname issuance established, the proposed payload carries authority
 rather than identity alone, creating utility that directly motivates operator adoption by reducing
 execution risk.

 However, ENS adoption depends on value-fit with the integrator: ENS has to demonstrably improve
 the integrator’s product or user experience.

 The blocker: agent runtimes require a more active, independently verifiable authorization model —
 one ENS is uniquely positioned to provide, but does not yet natively support.

 What the current stack does not provide on its own is the ENS-keyed authority-policy lookup
 layer: a resolver-level surface that lets any service independently confirm, in real time, that
 a signed action came from a credential currently authorized for an ENS name and that the
 credential has not been rotated, expired, or revoked.

 This proposal closes that gap by introducing an authority schema and resolver-native verification
 path that lets counterparties query current authorization state directly from ENS.

 This lets a MARP verify whether an agent’s action is currently authorized under the
 operator’s published authority state — increasing security guarantees for its users, and
 with it ENS’s value-fit for a prospective integrator. This gives the MARP a strong reason to
 issue identity under ENS rather than rolling its own or locking into a closed vendor.

 Latent demand for this authority-lookup layer is already materializing. Operator failures such as
 Bankr’s prompt injection exploit illustrate the cost of not having an independently
 verifiable authorization layer.

### 2.2 Registrations and Revenue

 The addressable base already exceeds 480K+ agents transacting across Coinbase’s x402
 protocol (Source:
 Coinbase, Agentic.Market, April 2026 (https://www.coinbase.com/developer-platform/discover/launches/agentic-market)
 ) and is rapidly increasing. Each agent is a candidate ENS-bound identity. It is an early market
 signal that demonstrates meaningful demand for agent-native infrastructure. Applying the cb.id
 subname-issuance growth pattern to it presents a compelling opportunity.

 Although subnames carry no registrar fee, the strategic bet is on widening ENS’s adoption
 surface rather than generating per-subname revenue. Direct DAO revenue accrues downstream: through
 the .eth names each MARP must register and renew to continue issuing subnames for its users, and
 through conversion when a share of those agents’ end users register their own .eth.

 Even modest conversion of the agent population into operator registrations and .eth
 adoption produces measurable registration and renewal demand under existing ENS economics. Against
 ENS’s ~$3.1M six-month registration-and-renewal base (
 Dune query 7549207 (https://dune.com/queries/7549207/11500922)), a conservative 3%
 conversion of the 480k-agent population implies approximately 14,400 registrations — roughly
 $400k–$580k in registration and renewal fees over five years at ENSv2 pricing.

 The impact is modest relative to ENS’s existing registration base, but real, attributable,
 and scalable with growth in the agent economy.

 Why interoperability infrastructure compounds: The leverage isn’t tied to any single
 runtime. An open ENS-native verification pattern becomes cheaper to adopt with each integration,
 pulling additional runtimes toward a shared authority layer rather than proprietary identity
 silos.

 Establishing that pattern now — while operator standards are still forming across hosted runtimes,
 smart-account agents, enterprise platforms, and ERC-4337 execution environments — reduces
 long-run fragmentation risk at the operator layer before it ossifies and strengthens
 ENS’s position as the shared authority layer for the emerging agent ecosystem.

### 2.3 Verifiable metric

Adoption is measured from onchain data, not self-reporting. Core metrics are:

- agent subnames issued under integrated operator names, and

- active authority records (excluding revoked records)

 Both are directly queryable from ENS resolution and resolver state. Wave-1 integration will ship a
 public dashboard with transparent methodology, including baseline and post-integration time
 windows, operator-level cohorts, and metric definitions. This enables independent reproduction of
 issuance and active-authority counts from raw chain data.

 Downstream .eth registration and renewal impact will be tracked as directional conversion metrics
 against ENS registrar data, with assumptions and attribution limits explicitly disclosed.
 Together, these measures make implementation quality and adoption impact externally verifiable
 from public onchain data, without relying on Steg’s internal reporting.

## 3. Approach

### 3.1 Scope

 Building on the authorization gap defined above, this proposal funds a defined integration service
 for apps, APIs, managed agent runtime platforms (MARPs), and relying services that need portable,
 real-time verification of whether an ENS-named agent is currently authorized for a specific
 action.

 Crucially, Steg is building shared, forkable open-source infrastructure that new operator classes
 can adopt rather than implement locally.

 The current
 specification draft (https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?tab=t.0)
 defines the architecture, verification flow, and conformance surface. This proposal funds the
 production implementation, interoperability tooling, validation, and deployment hardening required
 to operationalize it across Wave-1 MARP environments.

The service ships as a toolkit:

-
 Onchain infrastructure — a shared Verifier and per-name AuthResolver composing ENSv2’s
 access-control substrate into a verification and authorization layer for credential, capability,
 and revocation records.

-
 TypeScript SDK — resolves ENS-published authorization state, verifies signed requests, and
 returns normalized allow/deny outputs with machine readable reason codes.

-
 Conformance suite — reproducible test vectors covering schema validity, authority binding, freshness, revocation,
 rotation and adversarial mutation cases.

-
 Integration guides — recommended patterns for authorization checks, expiry, rotation,
 revocation, and policy enforcement across apps, APIs, and managed agent runtimes.

-
 Operational validation flows — end-to-end validation across supported signing schemes in
 production-like environments.

-
 Security package — third-party audit, threat model, verifier hardening, replay protection
 review, and deployment checklist.

 With the toolkit, integrators can resolve an ENS-named agent’s published authorization
 state, verify signed requests against current ENS state in real time, and enforce expiry,
 rotation, and revocation through normalized allow/deny reason codes across crypto-native and Web2
 agent environments alike.

By April 2027 the project delivers:

- audited Verifier and AuthResolver contracts,

- SDK v1.0 and integration tooling

- conformance suite operational validation flows

- published deployment guidance and interoperability findings

- and a production-ready release validated in production-like environments.

 An expanded Tier 2 scope extends the infrastructure through a Wave-1 ecosystem integration,
 interoperability validation, and deployment support for early operator environments.

 Every deliverable is verifiable against a public artifact — deployed contract addresses, a
 published third-party audit, CI-passing conformance vectors, and the onchain issuance /
 active-authority dashboard (§2.3) — per the verification columns in §3.2.

### 3.2 Milestones

#### Tier 1 (core infrastructure)

 #  |
 Deliverable  |
 Verification  |
 Date  |
 1  |
 Verifier + AuthResolver deployed to Sepolia; TS SDK alpha; initial conformance suite +
 interoperability vectors published; deferred specification workstreams initiated;
 third-party security review engaged
  |
 Onchain deployment artifacts (AuthResolverImpl, Verifier addresses, ABI, bytecode hashes);
 SDK package registry; audit kickoff published (firm, scope, timeline)
  |
 Oct 31, 2026 (M3)  |
 2  |
 Third-party audit completed + findings remediated; finalized v1.0 conformance specification
 and canonical CBOR layouts published; TS SDK v1.0; conformance suite completed; integration
 and deployment documentation published
  |
 Audit report published; remediation diff published; finalized v1.0 spec + canonical CBOR
 layouts published; SDK versioned release; CI-passing conformance suite; integration/deployment
 documentation published
  |
 Jan 31, 2027 (M6)  |
 3  |
 Reference validation flows completed across all supported signing models (WebAuthn/P-256,
 ECDSA, EIP-1271) in production-like environments; replay/freshness validation and lifecycle
 recovery testing completed; operational verification metrics finalized; mainnet-ready
 hardened release and deployment checklist published
  |
 Public validation reports; live end-to-end demos; replay/freshness validation results;
 revocation/rotation enforcement metrics; policy-deny correctness metrics; hardened release
 artifacts published; deployment readiness checklist completed
  |
 Apr 30, 2027 (M9)  |
#### Tier 2 (expanded scope)

 #  |
 Deliverable  |
 Verification  |
 Date  |
 4  |
 One external Wave-1 ecosystem integration; interoperability validation report; integration
 engineering support; deployment hardening and operational rollout support
  |
 Public integration deployment; interoperability findings published; integration and
 deployment documentation; operational interoperability validation report
  |
 Jul 31, 2027 (M12)  |
### 3.3 Budget

#### Tier 1 — Engineering and deployment

 The overall proposal spans a 12-month delivery cycle (Jul 2026 → Jul 2027). Tier 1’s $265k
 funds the core infrastructure phase through Milestone 9 (Jul 2026 → Apr 2027).

 From M1 to M9, the focus is a deliverable-heavy build phase: Approximately 12 person-months of
 senior engineering and project management at a blended $18,750/month across two co-leads:

-
 estmcmxci.eth (https://ens.app/estmcmxci.eth): ENS architecture, spec design, and
 ecosystem integration

-
 mouz.eth (https://ens.app/mouz.eth): protocol architecture, smart contract
 implementation and security engineering

 Line item  |
 Amount  |
 Purpose  |
 Onchain engineering and contract deployment  |
 $140,000  |
 Contract implementation, integration with ENSv2 access-control substrate
 (EnhancedAccessControl, HCAContextUpgradeable), deployment, and reference deployment
 artifacts for the verification and resolver infrastructure (Verifier + AuthResolver)
  |
 SDK and verifier tooling  |
 $55,000  |
 TypeScript SDK, developer tooling, reason-code taxonomy, conformance harness  |
 Documentation and developer relations  |
 $15,000  |
 Spec refinement, integration guides, public references  |
 Project management and reporting  |
 $15,000  |
 Quarterly status updates, milestone tracking, committee reporting  |
 Core security review  |
 $40,000  |
 Targeted third-party review, lifecycle/auth analysis, threat-model validation  |
Tier 1 Total: $265K

#### Tier 2 — Ecosystem Validation / Integration Expansion

 From M9 to M12, the focus shifts to ecosystem validation and operational support. The $175K Tier
 2 scope funds Wave-1 integration, deployment support, interoperability validation, documentation
 refinement, hotfix capacity, and quarterly committee reporting.

 Line item  |
 Amount  |
 Purpose  |
 Wave-1 ecosystem validation  |
 $65,000  |
 Wave-1 ecosystem validation across early MARP environments — reference integrations,
 interoperability testing, deployment support, and integration reports validating the
 architecture under operating conditions
  |
 Expanded production audit and ecosystem hardening  |
 $65,000  |
 Broader production audit scope, interoperability review, deployment hardening, operational
 testing
  |
 Developer outreach & partner onboarding  |
 $15,000  |
 Developer-facing enablement and partner activation for MARP adoption: integration tutorials
 and sample apps on top of the SDK; integrator office hours and onboarding support; partner
 activation via the Pinata Agents Partner Templates program (OpenClaw, Hermes); a public
 adoption dashboard (onchain agent-subname issuance + active-authority counts); and quarterly
 ENS Forum reporting of integration progress.
  |
 Documentation  |
 $15,000  |
 Integration guides, public references  |
 Project management and reporting  |
 $15,000  |
 Quarterly status updates, milestone tracking, committee reporting  |
Tier 2 Total: $175K

Combined Full Expansion: $440K

### 3.4 Counterfactual

 Agent authorization resolution is a real integration gap today. Without a standardized,
 resolver-native, neutral authorization-and-verification layer, ENS has a weaker value-fit for the
 next operator class — a class likely to mediate a growing share of agentic commerce.

 That gap is a standing opportunity cost, and it compounds as enterprise alternatives like
 Microsoft Entra Agent ID move into agent identity and authorization infrastructure.

 Microsoft Entra Agent ID (https://learn.microsoft.com/en-us/entra/agent-id). Introduced in preview at Microsoft Build 2025, it
 extends Entra (formerly Azure AD) — Microsoft’s enterprise identity platform — to AI
 agents, giving those built in Copilot Studio and Azure AI Foundry first-class directory
 identities with lifecycle management, access governance, and conditional-access policy. It
 answers the same identity-and-authorization question this proposal does, but inside a closed,
 tenant-bound vendor directory rather than a neutral, externally resolvable namespace — the
 proprietary control plane this section warns about.

 The question is not whether ENS must become trust infrastructure; closed vendor stacks can and
 will fill the gap. The strategic question is whether the authority layer for agentic commerce
 remains open, interoperable, and credibly neutral — or consolidates into proprietary control
 planes.

 The next 12–24 months are a formative period for cross-vendor agent-identity patterns. If ENS does
 not ship an open substrate in that window, adoption is more likely to fragment into
 runtime-specific implementations, with ENS retained primarily for naming while authority and trust
 functions consolidate elsewhere — effectively a Web2 SSO redux for the agent economy.

 The substrate to build it is already in place — EIP-7951 shipped in Fusaka, ENSIP-25/26 merged,
 ERC-8004 on mainnet, ENSv2 in preview — so the binding constraint is delivery, not readiness.

 The decision is asymmetrical: a bounded one-cycle cost ($440k) against both measurable and
 strategic upside. Even the narrow, conservative conversion model (~$400k–$580k in registration and
 renewal fees over five years, §2.2) reaches a scale comparable to the grant itself.

 And that likely understates the opportunity cost, which is strategic: the entire agent-identity
 category, a 480K+ agent population growing monthly, and ENS’s standing as the neutral
 authority layer for an expanding agent-operator surface — all ceded to closed vendors, with high
 switching costs, once the window closes.

 This outcome is unlikely to self-correct by default. ENS Labs is staffed against core protocol
 delivery (ENSv2, agent ENSIPs), while individual MARPs are structurally incentivized to build
 closed, vendor-local paths.

 Steg closes that coordination gap and has capacity to maintain the substrate beyond the initial
 cycle.

## 4. Delivery History

### Public Goods grant — “ENS v2 Interop Research” (Sep 2025, 1 ETH, Stage 1 completed)

Two committed deliverables, both completed.

-
 Analysis of ENSv2 interoperability design questions — ENSIP-19 multichain primary names,
 CCIP-Read (EIP-3668), migration policies, event/API discoverability, security trade-offs —
 convened in partnership with Kernel and Nick Johnson (ENS Labs), and shipped as the
 Universal Resolver Matrix (URM) (https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734)
 , a reference framework for heterogeneous resolver architectures across L2s, non-EVM chains,
 DNSSEC, WebAuthn, and offchain systems (published Dec 2025).

 Reframing ENS as a “trust-routing system that anchors heterogeneous namespaces to
 Ethereum as the root of trust,” URM identified the agent-authority / WebAuthn-verifier
 cell that this proposal implements: the verifier pathway that unlocks the most new namespaces
 per unit of engineering effort. This proposal is therefore a direct continuation of an
 already-completed research program, rather than a new research direction.
 The grant seeded the thesis of ENS as the verification substrate for an agent economy where
 generation is abundant and independent verification of authority is scarce.

-
 Authorship of the
 WebAuthn-for-ENS specification (https://docs.steg.eth.link/specifications/webauthn-specification/)
 (the passkey-signer resolution layer for ENS-bound agents) — a productionizable design for the
 agent-authority / WebAuthn-verifier cell identified by URM, which Milestone 1 of this proposal
 adapts to the AuthResolver + Verifier scope on ENSv2. The grant was completed and fully disbursed
 (1 ETH). Grant record at
 builder.ensgrants.xyz (https://builder.ensgrants.xyz) (grantee: fundamentalia.eth,
 submitter’s prior ENS identity);
 research thread (https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392)
 .

### Upstream contribution to canonical ENS contracts (Jan 2026, unfunded)

 Replaced software-implemented EllipticCurve verification with the EIP-7951 P-256 precompile in
 ENS’s DNSSEC oracle (Algorithm 13). Merged into ensdomains/ens-contracts as
 PR #509 (https://github.com/ensdomains/ens-contracts/pull/509) by Makoto Inoue (ENS
 Labs) on 26 January 2026; shipped to production in the
 v1.7.0 release (https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0) on 13
 March 2026.

 Adds P256Precompile.sol following the ModexpPrecompile pattern, switches P256SHA256Algorithm to
 call the precompile at 0x100, and removes the EllipticCurve dependency — ~98% gas reduction
 (~200k+ gas → ~3,500 gas per verification) for ENS-side DNSSEC validation.

 The V1 Verifier directly builds on this work, consuming the same EIP-7951 P-256 precompile
 introduced into ENS’s canonical contracts by this contribution.

Other prior work.

-
 Reference implementation of ENS-bound agent identity (https://discuss.ens.domains/t/reference-implementation-of-an-ens-bound-agent/22100)
 . An award-winning five-layer Trust Resolution Layer (TRL) composing ENSIP-25,
 ENSIP-26, and ERC-8004 —
 shipped as four MIT-licensed TypeScript packages (https://github.com/estmcmxci/synthesis)
 and
 a live ENS-bound agent deployment (https://estmcmxci.co/agent/emilemarcelagustin.eth)

-
 ENS as a Naming Layer for AI Agent Identity (https://nccoe.emilemarcelagustin.eth.link)
 . A position paper submitted to NIST NCCoE describing the ENS agent identity architecture: a
 7-layer stack showing what is production today (ENS, ENSIP-24/25, on.eth) and what is draft
 (ENSIP-26, NMS, AIP), for naming, discovery, verification, and evolution of AI agent identities.

-
 Public conference talk — Use Cases for the P256 Precompile (Devcon SEA, Nov 2024) (https://www.youtube.com/watch?v=e_QBTQGMxPs)
 . ~8 minute talk pitching universal ENS-as-login across Web2 surfaces with the L1 P-256
 precompile as the load-bearing technical unlock — the same problem space the WebAuthn-for-ENS
 specification formalizes and PR #509 makes real.

-
 Synthesis Hackathon, 1st Place, ENS Identity track (May 2026) (https://synthesis.mandate.md/tracks/ens-identity-i4jgf3)
 .
 Trust Resolution Layer (https://synthesis.mandate.md/projects/trust-resolution-layer-b67a)
 judged best-in-track on its ENS identity merits.

-
 ETHGlobal HackMoney 2026, Finalist + Integrate ENS bounty winner (February, 2026) (https://ethglobal.com/showcase/oikonomos-w6z57)
 . “Oikonomos,” a separate Steg-authored ENS integration, named Finalist
 (top-of-hackathon across all sponsor tracks) and won an ENS bounty.

## 5. Technical Foundation

#### Four-claim architecture.

 The authority payload has four properties, each mapped to concrete contracts and ENSv2 substrate
 primitives:

-
 Permissions live in AuthResolver record schemas (credential, capability,
 revocation) and Verifier dispatch logic.

-
 Freshness checks are enforced by the Verifier resolving current ENS state at
 lookup time.

-
 External resolution follows from implementing AuthResolver as a standard ENS
 resolver (UUPS proxies via VerifiableFactory), allowing any client to resolve authority state
 without intermediary infrastructure.

-
 Operator parent-name write authority is enforced by ENSv2’s existing EAC +
 HCA substrate, which scopes write permissions to the parent-name owner and atomically invalidates
 delegated roles on name transfer.

#### Architectural precedent.

The technical foundation builds on two prior artifacts:

-

 Verification semantics precedent (
 WebAuthn-for-ENS specification (https://docs.steg.eth.link/specifications/webauthn-specification/)
 , §4)

 — The specification defines the P-256/WebAuthn verification path this proposal inherits, and

-

 Deployed-topology precedent (
 Sepolia TLD Oracle (https://dnssec.eketc.co/tld-oracle))

 — TLDMinter + DnssecP256Verifier deployment demonstrating the orchestrator/stateless-verifier
 contract split.

 Accordingly, v1 includes a shared Verifier supporting three signing schemes: EIP-7951 P-256
 (WebAuthn/passkey), ecrecover (secp256k1 ECDSA), and EIP-1271 staticcall (smart-account
 signatures).

 Authority records are published through AuthResolverImpl with per-name UUPS proxies via
 VerifiableFactory.

 AuthResolverImpl inherits ENSv2’s access-control substrate (EAC + HCA) unchanged, preserving
 per-(node, recordKey) write delegation and atomic role invalidation on name transfer. The new
 audit surface is bound to Verifier dispatch logic and AuthResolver record schemas; ENS Registry and
 existing resolver implementations are unchanged.

 Because AuthResolver lookups are L1-native ENS resolutions, the verification path inherits
 ENS’s availability and censorship-resistance properties — no separate uptime SLA, no DNS
 dependency, no centralized API in the trust path between a counterparty and the authority state it
 reads.

 This preserves the proposal’s core property: any counterparty can independently verify
 current authorization state using standard ENS resolution alone.

 A counterparty’s authority-validity check therefore shares the same trust assumptions as
 standard ENS resolution.

 This scope reuses the orchestrator-plus-stateless-verifier topology already exercised by
 Steg’s TLD Oracle (https://dnssec.eketc.co/tld-oracle), a testnet system that
 fetches DNSSEC proofs offchain and verifies them onchain via a two-contract split: a TLDMinter
 orchestrator (
 0x4872…980F (https://sepolia.etherscan.io/address/0x48729B7e0bA736123a57c4B6A492BDAbedAF980F)
 ) handling timelocked claim processing, and a stateless DnssecP256Verifier (
 0x580F…766B (https://sepolia.etherscan.io/address/0x580F2Db4Da8E6D5c654aa604182D0dFD17D5766B)
 ) consuming the EIP-7951 P-256 precompile via the P256SHA256Algorithm contract integrated into
 ENS’s canonical contracts by
 PR #509 (https://github.com/ensdomains/ens-contracts/pull/509).

 The proposed scope swaps the proof/signature inputs (DNSSEC RRSIG → WebAuthn assertions, ecrecover,
 EIP-1271) and adds per-name UUPS proxies via VerifiableFactory, while preserving the same deployed
 contract separation.

#### Non-goals.

 This proposal does not deliver wire-protocol authentication (MCP, A2A, which answer “did the
 client present valid credentials”) or on-chain delegated execution (ERC-4337 session keys,
 which execute scoped permissions onchain). It does not replace capability-token systems (UCAN,
 CACAO, which prove delegated authority at signing time).

#### How it composes.

 The Verifier + AuthResolver layer sits above naming and discovery (ENSIP-25/26/64) and registry
 (ERC-8004), and compose with these non-goal layers at the relying-party boundary: a calling
 service resolves AuthResolver state to decide whether to honor an MCP/A2A request; a
 counterparty checks AuthResolver state before accepting an ERC-4337 or ERC-7710/7715-delegated
 session-key signature as currently authorized; capability-token presenters (UCAN, CACAO) are
 verified against current ENS-published authority rather than against frozen issuance-time
 state.

 The toolkit’s role is the authority-validity check the other layers don’t natively
 provide (
 see Appendix B (https://docs.google.com/document/d/1jbIRc5OGImfEI5TAb23FZy0wbDwTDiL2xmcAYtf9F98/edit?usp=sharing)
 ).

 Full architectural map + normative detail in the prototype specification (working copy:
 Prototype Spec (https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)
 ) and the
 MAIP taxonomy (https://docs.google.com/document/d/1zN0Dp9Tm7JCoLb-QYbigZuiB8O9vB7cEr6Pu96ewJRQ/edit?usp=sharing)
 ; substrate-inheritance excerpt in
 Appendix E (https://docs.google.com/document/d/1yWRHaizZyDx6RGK-WIH0qhQE4U4rUTP8p6GdKHgLpog/edit?usp=sharing)
 .

## 6. Conclusion

 This proposal delivers a defined, narrowly scoped service: ENS-native authority and verification
 infrastructure for apps, APIs, relying services, managed agent runtimes and other emerging operator
 environments that need to verify whether an ENS-named agent is currently authorized for a specific
 action.

 It is built on existing ENS standards and executed through verifiable milestones over a 12-month
 cycle. The proposal is additive to ENS Labs and does not replace existing ENS primitives. It
 operationalizes ENS as an interoperable authorization lookup surface for persistent agent authority
 across heterogeneous systems.

 It extends a proven ENS growth path (operator-issued subnames, as demonstrated by Coinbase’s
 cb.id integration) to the next operator class. Following that same adoption pattern, this proposal
 upgrades the payload from identity-only signaling to authority-bearing state, while keeping the
 trust path open: L1-native, resolvable, adoptable, and forkable, with no vendor in the middle.

 As agentic commerce scales, the authority tier will consolidate somewhere — either in open, neutral
 infrastructure or closed vendor control planes. This proposal builds the open substrate and
 validates its adoption in production.

## 7. Compliance & Attestations

-
 Licensing: All Recipient-Developed Materials shipped under this proposal will be
 licensed under the MIT License per Program Terms clause 8.1 (consistent with the
 repository’s existing LICENSE). Documentation, integration guides, and the prototype
 specification will be licensed under CC BY-SA 4.0 per clause 8.2. Steg anticipates no Mandated
 Copyleft Dependency at the date of application.

-
 Material relationships: Steg confirms no active conflict of interest with any
 ENS DAO member, ENS Labs employee, or other SPP3 applicant. All operational and vendor
 relationships material to the proposal are disclosed in the body (§2, §4).

-
 Approved Wallet: Upon issuance of the Award Notice and prior to disbursement,
 Steg will designate a project-dedicated Safe multisig with a 2-of-3 signer structure consisting
 of estmcmxci.eth, mouz.eth, and vault.steg.eth, a dedicated subname jointly governed by both
 co-leads, for signing redundancy — as the Approved Wallet under clause 5.8. Service Fees will be
 held in and disbursed from this wallet exclusively, with no commingling with personal or unrelated
 working capital.

-
 Reporting cadence: Steg commits to the dual quarterly reporting cadence under
 clause 6.3: a detailed private report to the Foundation within 30 days of each quarter’s
 end, and a public ENS Forum summary within the same window. This complements the milestone
 verification cadence already described in §3.2.

 Steg · steg.eth.link (https://steg.eth.link) ·
 docs (https://docs.steg.eth.link) ·
 github (https://github.com/steg-eth)
