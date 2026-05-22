# Appendix B — AuthResolver vs. Capability Tokens (UCAN, CACAO): Differentiation and Composition

*Supporting material for §5 and §10 of [the application](../application.md). This appendix expands on the architectural distinction between the AuthResolver and capability-token systems (UCAN, CACAO), the specific properties each provides that the other structurally cannot, and three concrete composition patterns relying parties can use to combine them.*

---

## The core architectural difference

Capability tokens and the AuthResolver answer related-but-distinct questions:

- **Capability tokens (UCAN, CACAO)** answer: *"Did this issuer, at some point, sign a delegation granting this capability?"* — a cryptographic proof of historical delegation, verified offline by walking a signature chain.
- **AuthResolver** answers: *"Is this signer currently authorized under this ENS name, with what capabilities, and has anything been revoked or rotated?"* — a lookup against canonical current state, by name.

"Carry your proof" versus "ask the source." Both are legitimate architectures. Real systems compose both — OAuth bearer tokens compose with token introspection; signed JWTs compose with revocation lists; X.509 certificates compose with OCSP. Capability tokens + AuthResolver is the same kind of composition, applied to decentralized identity.

---

## What AuthResolver does that capability tokens *structurally* cannot

Note the word *structurally*. These are not UX preferences or missing features — they are properties capability tokens cannot have given how their verification works.

**1. Current-state verification.** A UCAN signed at time T proves authorization existed at time T. The proof remains cryptographically valid until expiry, regardless of what has happened since. If a key is compromised, leaked, or replaced, the UCAN still verifies. AuthResolver returns authorization state as of *right now*. This is the single most important differentiator and the hardest to argue against.

**2. Revocation as a first-class operation.** Capability tokens can be "revoked" only through (a) short expiries with constant re-issuance, or (b) an external revocation list that relying parties must check — and option (b) is, structurally, the lookup model reintroduced. AuthResolver makes revocation a direct record write; every subsequent lookup reflects the new state. No expiry games, no separate revocation infrastructure.

**3. Operator-level policy with flow-through.** A MARP wants to set platform-wide policy (*"no agent under `pinata.eth` may transact above $X without operator co-sign"*) that applies across every hosted agent. UCAN delegation chains are per-agent and independent — to propagate a policy change, you re-issue every agent's chain. AuthResolver records under the parent ENS name (or with explicit inheritance) propagate one operator update across the entire population.

**4. Human-meaningful identity at verification.** Capability-token verification uses opaque public-key identifiers (`did:key`, `did:pkh`). To display *"this came from `myagent.pinata.eth`"* at verification time, the relying party needs a separate name-resolution step that capability-token verification does not provide. AuthResolver verification *is* that name-resolution step. Audit logs, dispute resolution, end-user trust signals, and recovery flows all benefit.

**5. No-presentation flows.** Capability tokens require the actor to present a token. Many real flows do not — direct contract calls, embedded operations, simple signed API requests, legacy integrations. AuthResolver works whenever a request carries a signature and a claimed name, with or without a presented token.

---

## How they compose — three concrete patterns

### Pattern A — capability token + freshness check

Actor presents a UCAN. Relying party verifies the chain offline *and* does an AuthResolver lookup on the issuer's ENS name to check current state: has the issuer's key been rotated? Has this delegation been revoked? Allow only if both pass.

This is the **OAuth-introspection pattern** applied to decentralized identity. OAuth has had this composition for years: bearer token for offline verification, introspection endpoint for "is this still valid right now." Capability tokens + AuthResolver is the same pattern.

### Pattern B — AuthResolver as canonical naming layer for capability-token issuers

The issuer's identity is an ENS name; the actual signing key behind the name can rotate without changing the identity. UCANs are signed by whichever key is currently authorized for the name; relying parties resolve the name to find the current key, then verify. Key rotation becomes silent infrastructure rather than identity churn.

Composing ENS names with capability-token issuer fields is technically possible today via existing DID methods that interoperate with Ethereum addresses, though the canonical integration mechanism is not formally standardized — exactly the kind of work a forward-looking extension to this proposal gestures at.

### Pattern C — AuthResolver as policy substrate capability tokens operate within

The operator publishes capability schema and constraints under their ENS name. Capability tokens are issued within that schema. Relying parties verify a presented token *and* check the capability claim against the current published schema. If the operator updates the schema, all existing tokens are constrained by the new policy without re-issuance.

This is the strongest form of complementarity because it makes AuthResolver the **policy substrate** that capability-token systems operate within, rather than a parallel auth mechanism.

---

## Why this is real and not rhetorical

The complementarity has operational pull, not just architectural symmetry:

- **Every capability-token system in production eventually faces the revocation problem.** Storacha, Ceramic, and Fission have all had to solve it via external state lookups of one shape or another. AuthResolver is a candidate for that external lookup — with the additional property of being ENS-anchored: decentralized, neutral, name-resolvable, not vendor-owned.
- **MARPs face an instant-revocation requirement.** When a hosted agent is compromised, the operator must kill it across all relying parties immediately. Capability tokens with short expiries are one answer; ENS-anchored current state is a better one because it does not require coordinating expiry windows across the ecosystem.
- **Capability-token relying parties need human-meaningful issuer identity for UX.** Opaque `did:key` issuers do not display to end users; they do not appear in audit logs humans can read; they cannot be recovered if the key is lost. ENS-resolved issuer identity provides all three.

The complementarity is therefore an architectural pattern — lookup-flow plus presentation-flow — with direct analogues in every mature auth ecosystem (OAuth, JWTs, X.509), mapping onto needs the capability-token communities themselves already feel.
