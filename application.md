# ENS Verification and Revocation Toolkit for Managed Agent Runtimes (MARPs)

*A practical ENS verification and revocation toolkit for managed agent runtimes: two contracts (Verifier + AuthResolver), a TypeScript SDK, a conformance suite, integration guides, and three Wave-1 pilot integrations.*

---

## 1. Application Summary


|                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Submitted by**       | Steg — `estmcmxci.eth` · `mouzayan.eth`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Total ask**          | $350,000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Term**               | July 2026 – July 2027                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Primary category**   | ENS Infrastructure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Secondary category** | Outreach and Integrations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Team status**        | **Steg** is `estmcmxci.eth` + `mouzayan.eth`. **`estmcmxci.eth`:** **merged upstream contributor to canonical ENS contracts** ([PR #509](https://github.com/ensdomains/ens-contracts/pull/509), Jan 2026, shipped March 2026 in [v1.7.0](https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0) — EIP-7951 P-256 precompile integration in ENS's DNSSEC oracle, ~98% gas reduction); **Public Goods grantee** ("ENS v2 Interop Research" Sep 2025, Stage 1 completed); **independent jury validation (2026):** Synthesis Hackathon 1st Place, ENS Identity track (May), ETHGlobal HackMoney 2026 Finalist (Feb). **`mouzayan.eth` (Mouzayan Delbourgo):** production smart-contract systems across DeFi and NFT finance at Arcade.xyz (NFT-lending, collateral/accounting, LP staking, governance contracts) and a Uniswap Foundation competition–winning Uniswap v4 hook; specialism in security and authorization-surface design. |


---

## 2. Customer and Strategic Shape

**Probable customers are production-scale managed agent runtime platforms (MARPs) whose current signing models the v1 toolkit already covers:** Pinata Agents is the live hosting runtime for Steg's [reference agent](https://estmcmxci.co/agent/emilemarcelagustin.eth) on `emilemarcelagustin.eth`; Virtuals Protocol's ACP CLI generates P-256 signers natively (per §6); Bankr Agents' `/agent/sign` + EIP-7702/EIP-1271 wallet model has been end-to-end verified for day-zero compatibility with the v1 Verifier (per [Appendix D](./appendices/appendix-d-deliverables-operationalization.md)). x402 (Coinbase's open agentic payments protocol) is the currently-targeted capability-publisher pilot. **No LOIs yet — engagement is pre-submission DevRel.**

**The strategic bet: MARPs are the next operator class** ([full case in Steg's ENS forum post, May 2026](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)). The strategic shape of this proposal is to ship a toolkit (Verifier + AuthResolver + SDK + conformance suite + integration guides) any MARP can drop into its subname-issuance flow — every platform signup becomes a verifiably named, verifiably authorized agent at deployment time, with no per-agent integration work. Result: ENS becomes the naming and authority-policy substrate for the MARP-hosted agent layer.

---

## 3. Abstract

ENS lacks a standardized, resolver-native “agent trust runtime” for dynamic control, validity, permissions, and portable reputation.

The agent stack today has naming + discovery (ENSIP-25, ENSIP-26), registry (ERC-8004, ERC-8122), wire-protocol auth (MCP, A2A), on-chain delegation execution (ERC-4337), and attestation (EAS) — but no neutral, ENS-keyed, resolver-level surface that ties any of them to *current* authority. 

No service today can verify, in real time, whether an action attributed to an ENS-named agent is currently authorized.

This SPP fills that gap as a defined integration service for teams building apps, APIs, and managed agent runtimes (MARPs). It delivers a practical ENS verification and revocation toolkit deployed on ENSv2:

- **Verifier contract** — an extensible signature verifier shipping three schemes this cycle: WebAuthn / P-256 via the EIP-7951 precompile, ECDSA secp256k1 via ecrecover, and EIP-1271 via staticcall to the signing contract's `isValidSignature(bytes32,bytes)`. Covers EOA, smart-contract-account, and passkey-backed signing models; dispatch surface designed to extend to BLS in future cycles.
- **AuthResolver contract** — holds credential, capability, and revocation records under any ENS name; deployed per-name (not a singleton)
- **TypeScript SDK** — resolves ENS-published authorization state, verifies signed requests against current ENS state, returns normalized allow / deny reason codes.
- **Conformance tests and integration guides** for apps, APIs, and managed agent runtimes.
- **Hands-on support** for three Wave-1 pilot integrations.

Integrators can resolve ENS-published authorization state, verify signed requests against current ENS state, and enforce expiry, rotation, and revocation with normalized allow / deny reason codes.

Success is measured by shipped onchain contracts and tooling, three working pilot integrations deploying ENS-bound agent authority verification in production-like environments, a completed third-party security audit of the Verifier and AuthResolver, and operational metrics: revocation propagation latency, replay rejection rate, policy-deny correctness, and developer onboarding under one day for basic verification.

---

## 4. Prior Work

### **Public Goods grant — "ENS v2 Interop Research" (Sep 2025, 1 ETH, Stage 1 completed).**

Two committed deliverables, both completed. 

1. A research analysis of ENSv2  interop design questions — ENSIP-19 multichain primary names, CCIP-Read (EIP-3668), migration policies, event/API discoverability, security trade-offs — convened in partnership with Kernel and Nick Johnson (ENS Labs), shipped as the [Universal Resolver Matrix (URM)](https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734), a reference framework for heterogeneous resolver architecture across L2s, non-EVM chains, DNSSEC, WebAuthn, and offchain systems (published Dec 2025). URM reframes ENS as **"a trust-routing system and compiler that anchors heterogeneous namespaces to Ethereum as the root of trust,"** organizing resolver architectures into a matrix (trust model, proof system, lifecycle, verification path) under one governing question: *which verifier unlocks the most new namespaces per unit of engineering effort.* This proposal is the direct descendant of that framework — the build-out of the agent-authority / WebAuthn-verifier cell URM identified, not a new idea. The grant seeded the thesis: ENS as the verification substrate for an agent economy where *generation is abundant and verification is scarce.*
2. Authorship of the [WebAuthn-for-ENS specification](https://www.eketc.co/docs/specifications/webauthn-specification) — a productionizable design for that cell, which M1 of this proposal adapts to the AuthResolver + Verifier scope on ENSv2. Full grant disbursement (1 ETH) withdrawn on milestone completion. Grant record at [builder.ensgrants.xyz](https://builder.ensgrants.xyz) (grantee: `fundamentalia.eth`, submitter's prior ENS identity); [research thread](https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392).

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

ENSv2's specified primitives (in preview at [ensdomains/contracts-v2](https://github.com/ensdomains/contracts-v2), mainnet deployment forthcoming) provide persistent storage and revocable write permissions, but no native TTL or *selective* per-record revocation primitive for record contents — records remain valid until the name owner rewrites or wholesale-wipes via `clearRecords()`. The AuthResolver fills this gap without modifying ENS core: it composes those v2 primitives into a verification orchestration surface carrying validity metadata (expiry timestamps, explicit revocation flags) and a Verifier contract that enforces them at lookup time. ENS Registry and existing resolver implementations are unchanged. This is schema and orchestration work on top of existing primitives — the same extension pattern ENSIP-24, ENSIP-25, and ENSIP-26 use to extend ENS into new domains without core modification.

Capability-token presentation (UCAN, CACAO) is an adjacent, non-competing architecture — offline chain verification at signing time, rather than current-state resolution by name. The two compose at the relying-party layer; full positioning in §10, three composition patterns in [Appendix B](./appendices/appendix-b-capability-tokens.md).

This gap matters now because agent identity systems are being defined in parallel: [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id) is currently in preview as a dedicated identity-and-authorization framework for AI agents, and other vendor systems are taking shape alongside it. ENS-native agent standards are still early — ERC-8004 reached mainnet in January 2026 and relevant ENSIPs are fresh — which makes the next twelve months the window in which ENS can establish a practical cross-vendor verification pattern for MARPs rather than retrofit one later. If ENS doesn't fill that gap, each MARP will ship its own auth stack and ENS becomes a thin naming label over fragmented trust — Web2 SSO redux for the agent economy.

---

## 6. Proposed Service

This proposal funds a defined integration service for teams building apps, APIs, MARPs, and relying services that need to verify whether an action attributed to an ENS-named agent is currently authorized. MARPs are the wedge — the integration class with the most to gain from a portable, ENS-bound verification layer.

The service ships as a toolkit:

- **Onchain components** — a shared **Verifier** (EIP-7951 P-256, ecrecover, EIP-1271 staticcall) and a per-name **AuthResolver** (`AuthResolverImpl` + UUPS proxies via `VerifiableFactory`) composing ENSv2's EAC + HCA substrate into a verification orchestration layer for credential, capability, and revocation records. v1 scheme set anchored in verified MARP support (see [Appendix D](./appendices/appendix-d-deliverables-operationalization.md)); end-to-end verification flow in [Appendix C](./appendices/appendix-c-verifier-flow.md).
- **A TypeScript SDK** that resolves ENS-published authorization state, verifies signed requests, and returns normalized allow/deny outputs with reason codes (`verified` / `unverified` / `stale` / `revoked` / `mismatch` / `policy-denied` / `endpoint-unproven`). Includes per-name AuthResolver proxy deployment helpers.
- **A conformance suite** with reproducible test vectors — schema validity, record integrity, identity/authority binding, freshness/liveness, and adversarial mutation cases.
- **Integration guides** for apps, APIs, and managed agent runtimes — including recommended patterns for expiry, rotation, revocation, and policy enforcement.
- **Hands-on pilot support** for three Wave-1 integrations: engineering office hours, reference integration code, and pilot-side debugging.
- **Security package + completed third-party audit** of the Verifier and AuthResolver contracts — threat model, deterministic verifier checks, revocation precedence, replay protection, lifecycle semantics, and hardening checklist.

With the toolkit, an integrator can resolve an ENS-named agent's published authorization state, verify a signed request against that state in real time, and enforce expiry, rotation, and revocation with normalized allow/deny reason codes — across crypto-native and Web2 MARPs alike.

**By July 2027:** Verifier and AuthResolver deployed and **audited by a third party**; SDK 1.0 published; three Wave-1 pilots live against audited contracts (Pinata, Virtuals, x402); conformance suite with passing CI; operational KPIs verified per pilot (<60s revocation propagation, ≥99.9% replay rejection, 100% policy-deny correctness, <1 day developer onboarding).

### Milestones

Per SPP3 conventions, milestones are targets (not gates) with target dates, shipped artifacts, and verification criteria checkable against public references. Quarterly status reports summarize progress.


| #   | Deliverable                                                                                                                                                                                                              | Verification                                                                                                                                                                                                                      | Date               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1   | Verifier + AuthResolver deployed to **Sepolia**; TS SDK alpha; **third-party security audit firm engaged**                                                                                                               | Onchain deployment artifacts (`AuthResolverImpl` address, Verifier address, ABI, bytecode hashes); SDK on a package registry; audit kickoff document published (firm, scope, timeline)                                            | Oct 31, 2026 (M3)  |
| 2   | **Third-party audit completed + findings remediated**; TS SDK 1.0; conformance suite with adversarial mutation vectors; integration guides                                                                               | Audit report published by the auditing firm; remediation diff published; SDK with versioned releases; conformance suite with passing CI; integration guides published                                                             | Jan 31, 2027 (M6)  |
| 3   | All three Wave-1 pilots integrated against audited contracts (Pinata — concrete `/verify` shape in [Appendix A](./appendices/appendix-a-pinata-verify.md); Virtuals; x402); per-pilot integration reports; KPIs measured | Public integration reports at named URLs; live demos against all Wave-1 pilots; KPIs per pilot (revocation propagation latency, replay rejection rate, policy-deny correctness, developer onboarding time); KPI summary published | Apr 30, 2027 (M9)  |
| 4   | Threat model + hardening checklist; governance roadmap; final cycle report vs. M1–M3 KPIs                                                                                                                                | Threat model + hardening checklist published; governance roadmap published; final cycle report                                                                                                                                    | Jul 31, 2027 (M12) |


**Also out of scope:** ENSIP-26 schema-ization (Node Metadata Standard territory; [ENSIP-27 draft](https://github.com/ensdomains/ensips/pull/75), filed May 2026, defines the `/.well-known/agent.json` schema that ENSIP-26's endpoint records point to); record-content sanitization / prompt-injection defense (content-trust layer, adjacent SP).

---

## 7. Team & Working Model

**A two-person senior team, plus the committee as a third seat.** Steg is two senior builders:

- **`estmcmxci.eth` — ENS architecture, the spec, and ecosystem integration.** Track record in §4: a merged contribution to canonical ENS contracts (PR #509 / v1.7.0); the ENS Public Goods grant whose research output — the **Universal Resolver Matrix** — reframed ENS as a trust-routing system and seeded this proposal (this SPP productionizes one of its cells); a live multi-chain reference implementation; and independent jury validation.
- **`mouzayan.eth` (Mouzayan Delbourgo) — protocol engineering, smart-contract delivery, and security.** Ships production-grade contracts across DeFi and NFT finance: at Arcade.xyz, built and hardened successive generations of NFT-lending infrastructure (lending logic, collateral and accounting systems, LP staking and reward distribution, governance contracts), and authored a Uniswap v4 hook on a winning team in a Uniswap Foundation–supported competition. Edge: adversarial systems thinking — secure state and permission management, and authentication/authorization surface design.

`mouzayan.eth`'s specialism is precisely this proposal's highest-risk surface: the Verifier and per-name AuthResolver, whose entire job is to make an authorization decision that holds up against an adversary, hardened by a funded third-party audit (§6/M6).

**The committee is the third seat — board, not staff.** We treat the SPP committee as a board-like member of this effort: an oversight and capital-allocation role, not day-to-day steering. The working model makes that concrete — quarterly status reports (§6), milestone targets verifiable against public artifacts (§6), and every deliverable shipped in the open (MIT-licensed, public PRs, public demos). The committee sees the same evidence the public does, on a cadence, and can hold the work to its stated KPIs.

**Why this framing matters for the allocation decision.** Funding this SPP is not buying a deliverable — it is taking a position in a thesis: that managed agent runtimes are the next operator class, and that ENS should be their authority-policy substrate (§2; [forum post](https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121)). The toolkit is the instrument; the thesis is the asset. A board allocates capital to a thesis it believes in and holds the team accountable for executing it — exactly the relationship this section proposes. If the committee buys the MARP thesis, this proposal is the most direct ENS-native way to underwrite it.

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

The technical foundation is the WebAuthn-for-ENS specification (§4) adapted to a two-contract scope: a shared **Verifier** consuming the EIP-7951 P-256 precompile, ecrecover, and EIP-1271 staticcall; and an **AuthResolverImpl** plus per-name UUPS proxies via `VerifiableFactory`. The AuthResolverImpl inherits ENSv2's access-control substrate (EAC + HCA) unchanged — preserving per-`(node, recordKey)` write delegation and atomic role invalidation on name transfer. New audit surface is bounded to Verifier dispatch logic and AuthResolver record schemas; ENS Registry and existing resolver implementations are unchanged. EIP-8121 cross-chain credential discovery is an optional encoding (M1 default: inline Direct; opt-in: Hook).

**Positioning vs. adjacent layers.** The toolkit layers above naming and discovery (ENSIP-25/26/64) and registry (ERC-8004/8122); sits upstream of wire-protocol auth (MCP, A2A); serves as the discovery layer for on-chain delegation execution (ERC-4337); composes with capability-token presentation (UCAN, CACAO; see [Appendix B](./appendices/appendix-b-capability-tokens.md)) at the relying-party layer. **Full architectural map + normative detail in the [prototype specification](./spec/prototype_spec.v1.0-draft.02.publish.md) (working copy: [Google Doc](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)) and the [MAIP taxonomy](./maip_taxonomy.md)**; substrate-inheritance excerpt in [Appendix E](./appendices/appendix-e-substrate-inheritance.md).

---

## 11. Conclusion

This proposal funds a defined integration service for ENS-keyed authority-policy lookup, delivered to managed agent runtime platforms. Over 12 months and $350,000, the work ships in four quarterly milestones (§6): the Verifier and AuthResolver deployed with an SDK alpha and a third-party audit firm engaged; the audit completed and remediated alongside SDK 1.0, the conformance suite, and integration guides; all three Wave-1 pilots integrated against the audited contracts with KPIs measured; and a final threat-model, hardening, and governance-roadmap package for the ENS DAO.

The service operationalizes existing ENS standards (ENSIP-25, ENSIP-26, ENSIP-64, ERC-8004) and optionally consumes EIP-8121 for an emerging integration category, delivering a reusable, scheme-extensible verification pattern. Three Wave-1 pilots — currently targeted at Pinata Agents (operator), Virtuals Protocol (protocol-native), and x402 (capability publisher) — demonstrate the pattern across the MARP ecosystem; Bankr Agents, whose signing model is already verified day-zero-compatible with the v1 Verifier (§2; Appendix D), is the lead near-term integration target.

The proposal does not replace existing ENS primitives; it operationalizes ENS as the interoperable authority-policy lookup layer for managed agent runtime platforms.

---

