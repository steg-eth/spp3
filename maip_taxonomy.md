# MAIP Architecture: A Taxonomy of Identity, Discovery, and Authority Primitives for Managed Agent Runtimes

**Author:** Steg (`estmcmxci.eth`)
**Version:** 0.1 — Draft
**Status:** Architectural reference
**Companion artifacts:** SPP3 application ([`application.md`](./application.md)); IEEE-style empirical paper (forthcoming, post-SPP3 cycle)

---

## 0. Purpose

This document is the architectural reference for the **Managed Agent Identity Platform (MAIP)** vision: ENS as the open, vendor-neutral identity substrate that **Managed Agent Runtime Platforms (MARPs)** and their counterparties resolve against.

It serves three functions:

1. **Name and structure the architectural surface.** MAIP comprises three tiers — Display, Discovery, Authority. Naming them lets primitives be debated and shipped per tier rather than as one monolithic identity stack.
2. **Position both committed and forward-looking primitives on a single map.** The SPP3-funded Authority work and the post-cycle selective-disclosure work both live here, in their proper architectural place.
3. **Serve as the durable architectural reference.** The SPP3 application, the forthcoming empirical paper, and any ENSIP follow-up cite this document for the broader vision.

This is not a specification. It is a map. Specifications are pursued per tier and per primitive: the Authority tier is the focus of the SPP3 cycle, Discovery tier extensions sit in a post-cycle backlog, and Display tier work continues in adjacent ENSIPs and standards venues.

---

## 1. Terminology

### 1.1 MARP — Managed Agent Runtime Platform

A MARP is a hosted runtime where AI agents operate, with the platform handling the agent's operational lifecycle on the operator's behalf. The defining function is taking responsibility for the "hard parts" of running an agent in production: secret and credential management, scheduling, policy enforcement, durability, scaling, and observability.

The category is established in ENS forum discourse and includes both crypto-native runtimes (Pinata Agents, Virtuals Protocol) and Web2-flavored runtimes (Anthropic Claude Managed Agents, vendor-hosted agent platforms). A platform qualifies as a MARP when it provides at least four of six runtime primitives: tool execution and endpoint routing, secret and credential management, scheduling, policy controls, observability, and an identity surface (agent address, NFT, registry entry, or platform-issued identity).

### 1.2 MAIP — Managed Agent Identity Platform

MAIP is the identity substrate that MARPs, their agents, and counterparties resolve against. Where MARP names the operator class running the agent, MAIP names the identity layer above the runtime. A MAIP is **open**, **vendor-neutral**, and **indexable**; counterparties can resolve agent identity, current authority, and selective service-discovery state by name without trusting any single MARP's internal systems.

This proposal positions ENS as the foundation for an open MAIP, in contrast to vendor-specific identity systems (Microsoft Entra Agent ID, AWS Bedrock Agents identity surfaces, and similar emerging frameworks) that lock identity to a particular runtime operator.

### 1.3 Relationship

MARPs run agents. MAIP gives those agents a portable identity.

A single agent runs on one MARP at a time (or migrates between MARPs over time); its MAIP identity persists across that movement, accumulating reputation, capability history, and ownership lineage that no individual MARP can unilaterally rewrite. This separation — runtime substrate vs. identity substrate — is what makes vendor-neutral agent ecosystems possible.

---

## 2. The Three-Tier Framework

A MAIP is decomposable into three architectural tiers:


| Tier          | Question it answers                     | Primary primitives                                                |
| ------------- | --------------------------------------- | ----------------------------------------------------------------- |
| **Display**   | What is this agent?                     | Identity binding, naming, profile metadata                        |
| **Discovery** | Where do I reach it and what can it do? | Service endpoints, capability descriptors, wallet pointers        |
| **Authority** | Is this action currently authorized?    | Real-time capability validity, revocation, signed-freshness state |


The tiers compose. Display alone is insufficient for any consequential interaction. Discovery without Authority opens an attack surface — a service endpoint resolved publicly can be invoked with stale or revoked credentials. Authority without Display has no name to attach to. Real MAIP interactions traverse all three tiers in sequence.

The tiers also **decay differently**, which motivates their architectural separation:

- **Display state** is mostly stable. An agent's `alias`, `avatar`, and identity binding change rarely. Indexers can cache aggressively.
- **Discovery state** changes per deployment. Endpoints rotate, capabilities extend, services come online and retire. Indexers need periodic refresh.
- **Authority state** is dynamic and adversarial. Revocations must propagate within seconds, not hours. Caching is hostile to correctness.

This decay differential is what makes the three-tier framework load-bearing: each tier can be specified, shipped, and standardized independently, with different freshness, indexability, and verifiability properties.

---

## 3. Display Tier

The Display tier is the most mature. ENSIP-25 (verifiable identity linkage), ENSIP-26 (agent-context and agent-endpoint records), and ENSIP-64 (typed text records) collectively provide the primitives. The Lighthouse Agent schema (issue #46 in `0xLighthouse/ens-metadata`) consolidates an emerging convention for agent profile fields: `class`, `schema`, `alias`, `description`, `avatar`, `agent-uri`, `registrations[*]`, `supported-trust[*]`.

Display tier records are **uniformly public by design**. Indexability against `TextChanged` events is the canonical discovery path; CCIP-Read gateways serve resolution for off-chain stored variants. ERC-8004 binds agents to on-chain registry entries that resolve back to the ENS name via the `registrations[*]` field; ENSIP-25 guarantees the bidirectional verifiability of that binding.

No new Display tier primitives are proposed in this document. The tier is referenced for completeness and to position the other two tiers relative to it.

---

## 4. Discovery Tier

The Discovery tier answers two related questions:

- *Where does a counterparty reach the agent?* — service endpoints, agent wallet pointers, gateway URLs
- *What can the agent do?* — capability descriptors, supported protocols, scope advertisements

Discovery records today live as text records under the same uniform-resolution model as Display. Two sub-primitives are worth distinguishing within Discovery:

### 4.1 Uniform discovery (current state)

A consumer resolves `services[mcp]`, `services[a2a]`, `agent-wallet`, or capability records and receives the same value any other consumer would receive. Indexers see every value. This is what ENSIP-26 and the Lighthouse Agent schema ship today.

Uniform discovery is correct for most public-good agents and for primary identity binding. It composes naturally with public indexing, third-party directories, and reputation aggregation. It is also unsuited to a meaningful class of MAIP use cases: compliance-scoped service endpoints, Sybil-resistant capability advertisements, monetized API surfaces, and tier-differentiated resolution.

### 4.2 Selective discovery (Phase 2)

A **selective discovery** primitive lets the same ENS name advertise that a record exists (preserving indexability and the public discovery surface) while gating the *value* of the record to authorized counterparties. The framing is **selective disclosure** — controlled revelation — rather than privacy, because the load-bearing use cases are:

- **Compliance-scoped disclosure** — a regulated agent reveals its endpoint only to counterparties whose wallet is associated with an approved organization (HIPAA scope, financial counterparty allowlists, IRB-approved trial participants).
- **Sybil-resistant discovery** — the agent publishes that it has an MCP service, but only reveals the URL to callers who prove they hold a Sybil-resistance credential (Gitcoin Passport, attested KYC, paid-tier proof).
- **Monetized API access** — same primitive as the Bloomberg Terminal model. The endpoint is gated by paid-subscription proof; revelation is the act of unlocking the service.
- **Service-tier differentiation** — free-tier wallets resolve to a rate-limited endpoint; paid-tier wallets resolve to a premium endpoint. Same resolver key, different values.

Three architectural paths exist for selective discovery on ENS resolution. Each has different trade-offs across confidentiality, unlinkability against the resolution path, indexability, and standard-client compatibility.

#### Path A — Encrypted records with off-chain access control

Ciphertext lives in the text record (or behind a pointer). A key-management layer — Lit Protocol, a threshold network, or a custodial KMS — gates decryption on access conditions (token-gating, signature verification, attestation presentation).


| Property                 | Notes                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------- |
| **Works today**          | Yes — composes with every standard resolver, indexer, and client library            |
| **Indexability**         | Existence is visible (ciphertext blob is public); content is not                    |
| **Trust shift**          | Decryption gatekeeper becomes a trusted party                                       |
| **Unlinkability**        | Preserved at the ENS resolution path (decryption happens off-chain post-resolution) |
| **Standardization cost** | Low — pure convention layer over existing ENS                                       |


#### Path B — Caller-bound CCIP-Read gateways

The CCIP-Read gateway, which already implements ENSIP-10 off-chain resolution, additionally accepts a caller-signed challenge — likely an EIP-712 typed message binding caller address + node + record key + nonce — and returns gated values only to authenticated callers.


| Property                      | Notes                                                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Works today**               | Partially — uses existing EIP-3668 plumbing, but requires extending standard client libraries (ethers `ccipReadFetchFunc`, viem `ccipRead` option) to inject auth and sign challenges |
| **Indexability**              | Public records remain indexable; gated records reveal only an offchain-lookup signal in `TextChanged` events                                                                          |
| **Trust shift**               | Gateway operator sees every read and who asked — no unlinkability against the gateway                                                                                                 |
| **Caller-conditional values** | Yes — different responses can be returned per caller                                                                                                                                  |
| **Standardization cost**      | Medium — needs an ENSIP defining the EIP-712 schema and client convention                                                                                                             |


#### Path C — Authenticated-resolution interface

A new resolver surface — conceptually `textAuth(node, key, proof)` — where the resolver itself enforces access, either by verifying a proof on-chain (zk attestation, signature) or by delegating to a CCIP-Read gateway with caller-bound semantics.


| Property                 | Notes                                                                         |
| ------------------------ | ----------------------------------------------------------------------------- |
| **Works today**          | No — requires new resolver interface, new client behavior, new wallet support |
| **Indexability**         | Public records remain indexable; gated records require authenticated calls    |
| **Policy expression**    | Most flexible — supports richer policies than "is this caller allowed"        |
| **Composability**        | Strongest when combined with on-chain verifiable proofs (zk, attestation)     |
| **Standardization cost** | High — new ENSIP, ecosystem-wide library updates                              |


**Selective discovery is the post-cycle Phase 2 work.** It is not in the SPP3 cycle scope. It is named, mapped, and reserved here because the Authority tier work that *is* in SPP3 scope establishes architectural patterns (signed CCIP-Read with caller-bound semantics, dispatch-based resolver extensions, EIP-712 typed-data signatures) that Phase 2 selective-discovery work composes with rather than competes against.

---

## 5. Authority Tier

The Authority tier answers a real-time question: given a signed action attributed to `agent.eth`, **is the signing key currently authorized to perform this action, and has that authorization been rotated or revoked?**

This is the missing tier — not because ENS v2 lacks Authority-tier *primitives* (it ships per-`(node, recordKey)` write delegation via `EnhancedAccessControl`, scoped binary storage via `IDataResolver`, and per-name resolver auto-clearing on ownership transfer), but because **no resolver-level surface composes those primitives into a standardized real-time authority-lookup any service can call**. ENSIP-25 binds identity. ENSIP-26 describes capability. ERC-8004 registers agents. v2 ships the storage and permission building blocks. None of these together tell a relying party whether a specific signed action it is about to honor is currently authorized. The Authority tier surfaces that lookup as a composed orchestration layer.

**Four primitives compose the Authority tier — two genuinely new (§5.2 signed-freshness lookup, §5.4 signed endpoint attestation), one new-with-significant-v2-composition (§5.1 capabilities manifest, leveraging `IDataResolver` + `EnhancedAccessControl` per-key role grants), and one pure composition with ENSv2 architecture (§5.3 ownership-transfer invalidation):**

### 5.1 Capabilities manifest

A schema for capability records under an ENS name, declaring what an agent is authorized to do — by capability ID, scope, expiry, and revocation pointer. The manifest is the read-side primitive; relying parties resolve it before honoring an agent action.

The SPP3-funded **AuthResolver** implements this manifest, inheriting ENSv2's `EnhancedAccessControl` for per-`(node, recordKey)` write delegation so operational keys can rotate capability state without surrendering broader name authority.

### 5.2 Real-time signed-freshness lookup

Resolution returns current authority state with a freshness signal the relying party can verify: block hash at issuance, signer attestation, EIP-712 typed-data signature over the response. This is the most novel piece of the Authority tier — it makes ENS resolution *time-sensitive* rather than slowly-eventually-consistent, which is the property real-time action verification requires.

The SPP3-funded **Verifier** contract handles the signature-verification half, initially WebAuthn / P-256 via the EIP-7951 precompile, with an extensible dispatch surface designed to extend to secp256k1, BLS, and EIP-1271 in future cycles.

### 5.3 Revocation composition (mid-ownership rotation and registry-NFT transfer)

Authority records need to invalidate under two distinct triggers, and ENSv2's architecture handles one of them natively:

- **ENS-name ownership transfer** — when an ENS name transfers, ENSv2's per-user resolver model means the new owner gets a fresh resolver instance and records appear "cleared" by default. The Authority tier inherits this behavior by composing with `EnhancedAccessControl` (the registry's `tokenVersionId` increments atomically on transfer and drops prior role grants in one step). This is a v2 architectural feature the AuthResolver depends on; it is *not* a new primitive the toolkit adds.
- **Mid-ownership credential rotation** — within an active ownership, the name owner needs to revoke a specific credential (key rotation, capability scope downgrade, API permission change) without transferring the name itself. This case is *not* handled by ownership-transfer invalidation; the AuthResolver provides explicit revocation record types (`auth.revocation[<id>]`) that the verification flow consults at action time. This is the actual revocation primitive the toolkit contributes.

A third related case is **registry-NFT ownership transfer** — when an external registry (e.g., ERC-8004) issues an agent NFT and that NFT transfers separately from the ENS name, ENSIP-25 attestation records on the ENS name can become misleading because the registry NFT no longer points back to the original owner. The AuthResolver can compose with registry `ownerOf` lookups during verification to surface registry-side ownership drift; this is forward-looking work for capability-token interop rather than a core M1 deliverable.

### 5.4 Signed endpoint attestation

For MARP-hosted agents, the MARP itself signs over the endpoints and capability advertisements published under the agent's name. A counterparty resolving the AuthResolver can verify not only "the agent claims to have an MCP endpoint" but "the MARP attested that this endpoint belongs to this agent in this runtime." This raises the cost of endpoint forgery from "compromise the agent's key" to "compromise the MARP's signer."

**These four primitives are jointly the SPP3 cycle scope.** They ship as: two contracts (Verifier + AuthResolver) deployed to ENSv2, a TypeScript SDK that resolves and verifies, a conformance suite, integration guides, and three Wave-1 pilot integrations across MARP archetypes. Full milestone, budget, and pilot structure is in [`application.md`](./application.md).

---

## 6. Cross-Tier Composition

A full MAIP interaction sequences the tiers:

```
1. Display     →  Counterparty resolves agent.eth
                  Confirms class, schema, alias, identity binding
                  (ENSIP-25 / ENSIP-26 / ERC-8004)

2. Discovery   →  Counterparty resolves service endpoints,
                  agent wallet, capability descriptors
                  Phase 1: uniform resolution (all callers see same value)
                  Phase 2: selective resolution (gated subset opt in)

3. Authority   →  Counterparty presents a signed action
                  AuthResolver returns current authority state
                  Verifier confirms signature against current state
                  Relying party enforces allow/deny with normalized reason codes
```

The tiers are **independent in implementation** but **operationally interlocking**.

- A relying party that has Display but skips Authority is vulnerable to stale-credential attacks.
- A relying party that has Authority but lacks selective Discovery may have to expose service endpoints publicly that compliance, anti-abuse, or commercial constraints would prefer gated.
- A relying party that has selective Discovery but no Authority can rotate who sees endpoints, but cannot rotate who is currently authorized to act through them.

This is what the MAIP framing buys: a structured way to articulate "we have Display and partial Discovery today; we are shipping Authority this cycle; selective Discovery is the next-cycle priority" without conflating which primitives are operational and which are forward-looking.

---

## 7. Adjacent Architectures

The agent identity landscape has several initiatives in flight or shipped today. None of them deliver the full MAIP stack alone; each occupies a specific architectural position.


| Adjacent layer                                 | Role                                                         | Relationship to MAIP                                                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MCP / A2A wire-protocol auth**               | Did the connecting client present valid credentials?         | Upstream consumer of Authority tier. MCP/A2A enforces what AuthResolver publishes.                                                                                     |
| **ERC-4337 on-chain delegation**               | Execute scoped permissions on-chain                          | Authority tier is the discovery and validity layer for which 4337 delegations are live per ENS name.                                                                   |
| **UCAN / CACAO capability tokens**             | Prove a delegation existed at signing time, verified offline | Architecturally distinct from Authority tier (presentation flow vs. lookup flow); relying parties may compose both.                                                    |
| **EIP-8121 cross-chain hooks**                 | Encode "fetch data from contract X on chain Y" via CCIP-Read | Consumed by AuthResolver for the optional cross-chain credential-discovery path.                                                                                       |
| **Microsoft Entra Agent ID**                   | Vendor-specific agent identity-and-authorization framework   | Competitor at the MAIP layer. ENS-based MAIP is the open, vendor-neutral alternative.                                                                                  |
| **Lighthouse Agent schema (ENS metadata #46)** | Profile field convention for agent records                   | Display tier convention. MAIP composes with this; selective discovery (§4.2) extends to cover the `agent-wallet` and `services[*]` fields the Lighthouse schema names. |


The MAIP framing is what gives this positioning structure. Without the three-tier framework, the temptation is to debate whether MCP auth, capability tokens, or ERC-4337 delegations are "the answer" — when in fact each lives at a different architectural layer and solves a different problem. The tiers make the layers explicit.

---

## 8. Roadmap and Phasing

### Phase 1 — Authority tier (SPP3 cycle, July 2026 – July 2027)

Verifier + AuthResolver contracts deployed to ENSv2; TypeScript SDK; conformance suite; integration guides; three Wave-1 pilot integrations across MARP archetypes:

- **Operator archetype** — Pinata Agents (crypto-native hosted runtime with existing live operator experience)
- **Protocol-native archetype** — Virtuals Protocol (per-agent identity as a first-class protocol object)
- **Capability publisher archetype** — x402 (Coinbase's open agentic payments protocol, publishing capability records that the AuthResolver verifies)

A fourth archetype — **Web2-flavored MARP** (e.g., Anthropic Claude Managed Agents) — is under access research and may be added contingent on integration readiness. See [`application.md`](./application.md) for full milestone, KPI, and budget structure.

### Phase 2 — Selective discovery (post-SPP3, contingent on Phase 1 outcomes)

Architectural design and prototype for one of the three selective-discovery paths. **Path B (caller-bound CCIP-Read)** is the most plausible first delivery: it extends existing EIP-3668 plumbing, uses the EIP-712 signature surface already developed for the Authority tier, and requires only a modest client-library extension rather than a new resolver interface.

Empirical evaluation across the four selective-disclosure use case clusters (compliance, anti-abuse, monetization, tier differentiation), with at least one production-shaped pilot per cluster.

### Phase 3 — MAIP consolidation (longer horizon)

ENSIP standardization for both Authority and selective Discovery primitives. Cross-tier specification consolidation. Production deployment and adoption across multiple MARPs. Possible NIST NCCoE cross-publication for the enterprise/regulator audience.

### Parallel research artifact — IEEE-style empirical paper

Empirical evaluation of the Authority tier primitives across Pinata Agents and (pending access) Anthropic Claude Managed Agents deployments. Configuration matrix covering resolution latency, verifiability rate, revocation propagation, gateway failure modes, and threat-model analysis. Drafted concurrently with Phase 1 KPI capture; published post-SPP3 cycle as a durable research artifact independent of SPP3 outcome.

---

## 9. References

**ENS standards**

- ENSIP-10: Wildcard Resolution / Off-Chain Resolution
- ENSIP-25: Verifiable Agent Identity (merged May 2026)
- ENSIP-26: Agent-Context and Agent-Endpoint Records
- ENSIP-64: Typed Text Records

**EIPs / ERCs**

- EIP-3668: CCIP Read — Secure Off-chain Data Retrieval. [https://eips.ethereum.org/EIPS/eip-3668](https://eips.ethereum.org/EIPS/eip-3668)
- EIP-7951: P-256 Precompile
- EIP-8121: Cross-Chain Hook Format (draft, Dec 2025)
- ERC-8004: AI Agent Identity Registry. [https://eips.ethereum.org/EIPS/eip-8004](https://eips.ethereum.org/EIPS/eip-8004)
- ERC-8122: Minimal Agent Registry (merged Feb 2026)

**Forum and external posts**

- "The Next Operator Class: Managed Agent Runtime Platforms." Steg (estmcmxci.eth), ENS Forum, 2026. [https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)
- "Reference Implementation of an ENS-Bound Agent." Steg (estmcmxci.eth), ENS Forum, 2026. [https://discuss.ens.domains/t/reference-implementation-of-an-ens-bound-agent/22100](https://discuss.ens.domains/t/reference-implementation-of-an-ens-bound-agent/22100)
- "Use Case: AI Agents on ENS." 0xLighthouse, GitHub Issue. [https://github.com/0xLighthouse/ens-metadata/issues/46](https://github.com/0xLighthouse/ens-metadata/issues/46)

**Reference implementation and deployment**

- Synthesis repository (TypeScript Trust Resolution Layer): [https://github.com/estmcmxci/synthesis](https://github.com/estmcmxci/synthesis)
- Live reference deployment: [https://estmcmxci.co/agent/emilemarcelagustin.eth](https://estmcmxci.co/agent/emilemarcelagustin.eth)
- ERC-8004 reference agent #24994 on Base mainnet
- Test deployment: ERC-8004 agent #19327 at `alpha-go.bankrtest.eth`

**Companion artifacts**

- SPP3 application: [`application.md`](./application.md)
- Capability-token architectural patterns: [`appendix-b-capability-tokens.md`](./appendices/appendix-b-capability-tokens.md)
- Pinata `/verify` integration shape: [`appendix-a-pinata-verify.md`](./appendices/appendix-a-pinata-verify.md)
- Verifier flow walkthrough: [`appendix-c-verifier-flow.md`](./appendices/appendix-c-verifier-flow.md)
- IEEE-style empirical paper: forthcoming, post-SPP3 cycle

