<!--
⚠️ FACT-CHECK NOTE (2026-05-25)
The bullet "Day-zero technical compatibility confirmed. Bankr Agents has been verified
end-to-end as compatible with the v1 Verifier..." (in the MARP-wedge section) conflicts
with the published article, which states "The wiring itself is upcoming work — nothing
is integrated end-to-end yet."

Additional corrections from the article:
  - Endpoint is POST /wallet/sign (not /agent/sign)
  - ecrecover returns the underlying Privy EOA, not the wallet's onchain address
  - EIP-1271 isValidSignature on the delegated implementation contract is the correct
    path for wallet-address verification (it isn't optional alongside ECDSA — it's the
    required path because of the EIP-7702 delegation)
  - The article does not mention ZeroDev Kernel; phrasing should not assert it

Treat compatibility as ARCHITECTURAL (primitives mapped, contract topology described),
not END-TO-END VERIFIED. Dossier (spp3.steg.eth.link) has been corrected accordingly.
-->

# Why this work exists

This brief explains *what problem* the SPP3 work is solving, *what we propose to ship*, and *why ENS DAO benefits*. Pair this with the [<u>SPP3 Spec Brief</u>](https://docs.google.com/document/d/1TSK9rq3eEY1fEY6zeNAFXFLUmtW6W3BAB7c9dVQiqi4/edit) (orientation to the spec artifacts themselves) and the [<u>Published Spec — v1.0-draft.02</u>](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit) (the normative content).

## TL;DR

AI agents are increasingly the actors taking actions across apps, APIs, and hosted runtimes — but no outside service can verify, in real time, that an agent-signed action came from a credential the operator currently authorizes. Authorization lives in vendor-specific systems. There's no shared substrate for rotation, revocation, or audit.

ENS already provides the naming, discovery, and registry primitives (ENSIP-25, ENSIP-26, ENSIP-64, ERC-8004). What it doesn't yet have, on top of those primitives, is an ENS-keyed authority-policy lookup layer: a resolver-level surface that lets any service confirm a signed action came from a currently-authorized credential under an ENS name, and that the credential hasn't been rotated, expired, or revoked.

This SPP3 work fills that gap. The wedge is MARPs (Managed Agent Runtime Platforms) — Bankr Agents, Pinata Agents, Virtuals Protocol, Microsoft Entra Agent ID, ZeroDev/Kernel-backed runtimes. MARPs are where most agents will run in practice; integrating the AuthResolver at a MARP's subname-issuance layer means every signup becomes a verifiable ENS-named agent at deployment time.

One operator-archetype MARP at production scale = 10⁴+ ENS subnames on initial integration, ramping toward 10⁵+ within 12 months.

## The problem (concretely)

A new operator class is emerging: MARPs — hosted runtimes that operate AI agents' lifecycles (secrets, scheduling, policy, durability). Pilots are moving to governed production. Vendors are iterating fast.

What MARPs do not standardize is a portable authorization layer counterparties can verify independently. A relying party — another contract, a backend, a wallet, a payment service — receiving a signed action

from an agent has no shared way to ask:

- *Is this signature actually valid?*

- *Does the credential it was signed with currently belong to the agent?*

- *Has that credential been rotated, revoked, or expired?*

- *Who can rotate or revoke it, and how does that change propagate?*

Each MARP today answers those questions in its own vendor-internal way. Counterparties either trust the platform's database or trust the signature blindly. Neither scales across MARPs.

This is distinct from the things people sometimes think solve it:

- Wire-protocol auth (MCP, A2A) answers "did the client present valid credentials *at this connection*?" — not "are these the credentials the agent's operator currently authorizes."

- On-chain delegation execution (ERC-4337 session keys) executes scoped permissions onchain — but doesn't tell a relying party *which* keys and capabilities are currently the ENS-name's authorized ones.

- Capability tokens (UCAN, CACAO) prove a delegation existed at signing time, verified offline — they don't reflect current authorization state.

The lookup layer is the gap. Lookup is what this proposal delivers.

## Why ENS is the right surface

ENS already has the pieces above and around the gap: ENSIP-25 binds an ENS name to an ERC-8004 agent identity; ENSIP-26 publishes the agent's services and endpoints; ENSIP-64 carries typed records; ERC-8004 holds the agent registry. What's missing is the authority-policy layer that ties any of them to *current* authority on the same ENS surface.

ENSv2's substrate is ready for that work *today*: per-name resolver instances, EnhancedAccessControl for per-(node, recordKey) write delegation, IDataResolver for binary-safe records, VerifiableFactory for deterministic per-name proxy deployment. These are exactly the primitives the AuthResolver composes into a verification orchestration layer.

No new core protocol changes. Schema and orchestration work on top of existing primitives — the same extension pattern ENSIP-24, ENSIP-25, and ENSIP-26 use.

The timing window is real. EIP-7951 (P-256 precompile) shipped in Fusaka 3 Dec 2025; ENSIP-25 has merged; ERC-8004 reached mainnet Jan 2026. Microsoft Entra Agent ID is in preview as a dedicated vendor identity-and-authorization framework. The next 12 months are when ENS can establish a practical cross-vendor verification pattern for MARPs, rather than retrofit one after vendor stacks lock in.

## What we ship

A toolkit, delivered across four milestones over 12 months. The full normative surface is in the [<u>spec</u>](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit); the headline shape:

- Two onchain contracts: a Verifier (one shared per chain; three signature schemes — WebAuthn-ES256, ECDSA-secp256k1, EIP-1271) and an AuthResolverImpl (per-name UUPS proxies via VerifiableFactory, holding credential / capability / revocation records).

- A TypeScript SDK that resolves ENS-published authorization state and verifies signed requests against current state.

- A conformance suite with reproducible test vectors for verifier behavior.

- Integration guides + three Wave-1 pilot integrations with hands-on engineering support.

- A third-party security audit of the Verifier and AuthResolver.

An integrator using this can verify a signed request against current ENS state, enforce expiry/rotation/revocation, and get normalized allow/deny reason codes — without taking a dependency on any particular MARP's vendor-internal identity model.

What this is NOT: a wallet, a consumer-onboarding flow, a generalized agent platform, schema-ization of ENSIP-26 records, or a competitor to capability-token systems. Focused infrastructure service. ENS Infrastructure objective category, with Outreach + Integrations secondary.

## How SPP3 maps to it

\$350,000 over 12 months (July 2026 – July 2027). Four milestones:

- M1 — Onchain Verifier + AuthResolverImpl deployed to ENSv2 (testnet first; mainnet contingent on ENSv2 mainnet timing)

- M2 — TypeScript SDK + conformance suite

- M3 — Three Wave-1 pilot integrations (production-like deployments) + third-party security audit

- M4 — Integration pattern docs published; ENSIP draft submitted; v1.0-final spec

Operational success metrics: revocation propagation latency \<60s, replay rejection rate ≥99.9%, policy-deny correctness 100%, developer onboarding time \<1 day to a working basic-verification flow.

## The MARP-wedge thesis (why this matters for ENS DAO)

This is the load-bearing argument. The committed floor is three Wave-1 per-agent pilots; the structural ceiling is MARP-layer integration.

Per-agent integration (the floor): each pilot's MARP-hosted agents register their own ENS names — test, staging, production environments each register separately; capability-publishers register one name per published service.

Per-pilot registration counts are reported in each integration report. Linear scale.

MARP-layer integration (the ceiling, and the wedge): an operator-archetype MARP bakes AuthResolver records into its subname-issuance flow itself.

When a MARP's account-creation flow issues \<username\>.\<marp\>.eth with AuthResolver records pre-populated, the math changes:

| Dimension | Per-agent pilot | MARP-layer integration |
|----|----|----|
| Registration math | Linear with manual integration effort | Per-platform-user — every signup is a registration |
| Scale | ~10² registrations per pilot | 10⁴+ on initial integration, ramping to 10⁵+ within 12 months |
| Identity surface | Wallet + platform API key (no external naming) | Publicly resolvable named-agent identity that travels with the user |
| Authority model | Vendor-database trust | ENS state as independent reference — cryptographic integrity replaces vendor trust |
| Counterparty reach | Platform-specific integrations only | Reachable from 8+ existing ecosystems via one integration: other MARPs, MCP/A2A servers, ERC-4337 / ERC-6900 smart accounts, ERC-8004 registry consumers, UCAN/CACAO relying parties, ENS-aware wallets/dApps, EAS-style attestation networks, compliance tooling |

Why this matters for ENS DAO directly:

1.  **Subname issuance volume**. Each MARP integration converts platform user signups into ENS subname registrations. A single operator-archetype MARP at production scale generates 10⁴+ subname registrations at integration go-live, ramping toward 10⁵+ over the subsequent 12 months — two to three orders of magnitude beyond the per-agent floor.

2.  **Renewal incentive baked in**. Any production agent whose ENS-bound credentials are in active use has direct operational incentive to renew the name, because revocation/rotation flow through the AuthResolver attached to that name. ENS names become operationally load-bearing for the agent, not decorative.

3.  **First-mover dynamics.** Once one MARP integrates, subsequent MARPs copy the pattern rather than design one. Compatibility with the first integrated MARP becomes a competitive feature. This is why a single MARP integration matters more than the sum of three per-agent pilots — the structure compounds.

4.  **Day-zero technical** compatibility confirmed. Bankr Agents has been verified end-to-end as compatible with the v1 Verifier: their /agent/sign endpoint produces secp256k1 ECDSA (verifiable via ecrecover); their wallets use EIP-7702 + EIP-1271 with the ZeroDev Kernel implementation (verifiable via EIP-1271 staticcall). Both schemes are in v1 scope. Technical-fit question closed. Only remaining variable is platform-side commitment.

The honest framing: Bankr engagement is pre-commitment, not contracted. Neither the milestone structure nor the Wave-1 pilot floor depends on Bankr's adoption. Per-agent pilots are committed; MARP-layer integration is the structurally enabled outcome the toolkit is built to convert.

## What success looks like

In-cycle, by M4 (July 2027):

- Two contracts shipped, audited, and deployed on ENSv2 mainnet

- SDK + conformance suite public

- Three Wave-1 pilot integrations live in production-like environments

- ≥1 operator-archetype MARP integrated at the subname-issuance layer with a public integration report

- 10⁴+ ENS subnames issued via the AuthResolver pattern at integrated MARP(s)

- ENSIP draft submitted for the authority-policy lookup layer

Trajectory (cycle close + 12 months forward):

- 10⁵+ ENS subnames at integrated MARP(s) within 12 months of integration go-live

The counterfactual to SPP3 funding is not "no work happens." The framework and the spec are already public. The counterfactual is *"the work ships as single-runtime tooling by a single team, with no conformance surface and no public reference for other integrators, on a 24–36 month part-time arc"* — by which point vendor MAIPs (Microsoft Entra Agent ID, currently in preview) will have defined the cross-vendor verification pattern for the category, and operator-archetype MARPs that would otherwise adopt the open-MAIP pattern will have defaulted to vendor or platform-internal alternatives.

The 12-month window matters because the category is locking in now.

## Where to read next

- [<u>SPP3 Spec Brief</u>](https://docs.google.com/document/d/1TSK9rq3eEY1fEY6zeNAFXFLUmtW6W3BAB7c9dVQiqi4/edit) — orientation to the spec artifacts (which file is what, how to read in order, where to contribute)

- [<u>Published Spec — v1.0-draft.02</u>](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit) — the normative contract surface this work delivers

- application_draft.md (in the repo) — the canonical SPP3 application body (full deliverables, milestones, budget, KPIs, governance)
