# Appendix E — Substrate Inheritance

*This appendix excerpts substrate-inheritance detail that the body of the proposal (§10) summarizes. The canonical, normative source for these inheritance and deployment rules is the [prototype specification](../spec/prototype_spec.v1.0-draft.02.publish.md) (working copy: [Google Doc](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)), §4 (AuthResolverImpl). The summary below is for reviewers who want substrate detail without leaving the application bundle.*

---

## 1. Composition with ENSv2 access-control primitives

The AuthResolver is designed to inherit ENSv2's access-control substrate rather than introduce a parallel permission model. The substrate lives in the [`ensdomains/contracts-v2`](https://github.com/ensdomains/contracts-v2) repository (all file paths below are within that repo).

The AuthResolver specifically inherits:

- `EnhancedAccessControl` (EAC) — `contracts-v2/contracts/src/access-control/EnhancedAccessControl.sol`
- **Hidden Contract Accounts** (HCA) via `HCAContextUpgradeable` — `contracts-v2/contracts/src/hca/HCAContext.sol`, `HCAContextUpgradeable.sol`

This mirrors the canonical inheritance chain used by ENSv2's `PermissionedResolver` (`contracts-v2/contracts/src/resolver/PermissionedResolver.sol:94-113`).

Three properties carry directly into the AuthResolver:

**Per-`(node, recordKey)` write delegation.** EAC's resource derivation (`contracts-v2/contracts/src/resolver/libraries/PermissionedResolverLib.sol:66-75`) and bitmap layout (`contracts-v2/contracts/src/access-control/EnhancedAccessControl.sol:33-49`) let the name owner grant a specific operational key the right to publish or revoke a specific credential or capability record, without surrendering broader name authority. This is the operator-continuity primitive the M3 KPIs (revocation propagation, policy-deny correctness) depend on.

**Atomic role invalidation on name transfer.** EAC role grants live under the registry's `tokenVersionId` (`contracts-v2/contracts/src/registry/PermissionedRegistry.sol`); on name transfer the version increments and prior grants drop in one step. This sets a defensible default for the ownership-transfer question.

**Owner-model agnosticism for smart-account ENS names.** HCA's `_msgSender()` rewriting (`contracts-v2/contracts/src/hca/HCAEquivalence.sol:36-42`) lets a name owner operate the AuthResolver from a passkey-backed smart account without provisioning a separate EOA, preserving the substrate-inheritance properties summarized in §10. HCA is opt-in per proxy at deployment: passing `address(0)` for the factory makes it a no-op (no Rhinestone module dependency); when opted in, the production HCA factory is operated and externally audited by Rhinestone (per ENSv2 contracts docs).

EAC and HCA are write-side permissioning — they govern who can publish, rotate, or revoke records. They are not the read-time trust runtime itself: that evaluation happens at resolution time, when the SDK reads the AuthResolver's record content (expiry, revocation flags, capability scope) and calls the Verifier only for signature verification.

The Verifier contract's responsibility is deliberately narrow — signature verification and method dispatch — not policy evaluation. It also carries no access-control substrate of its own: EAC and HCA are inherited by the AuthResolver because they gate record *writes*, but the Verifier holds no records and no roles, so there is nothing to gate — it is permissionlessly callable by any counterparty or onchain contract by design, which is the property that makes it reusable as a public good.

Composing rather than reinventing these primitives keeps M1 inside ENSv2's audited substrate and reduces the new audit surface introduced by this proposal to the Verifier dispatch logic and the AuthResolver-specific record schemas.

---

## 2. Deployment model (per-name UUPS proxies via VerifiableFactory)

The Verifier is deployed as a single shared contract. The AuthResolver is shipped as:

- An `AuthResolverImpl` implementation contract deployed once per chain
- Per-name UUPS proxy deployment tooling that wraps the ENSv2 `VerifiableFactory.deployProxy()` factory

This is the same per-name instance pattern that `PermissionedResolver` itself follows: each MARP deploys their own AuthResolver proxy via factory deployment with proxy-local upgrade authority (`ROLE_UPGRADE`, the EAC upgrade-authority role). It is the same pattern ZeroDev Kernel uses to ship one Kernel implementation contract plus factory-deployed per-user wallets.

Deployment artifacts (`AuthResolverImpl` address, `VerifiableFactory` integration address, ABI, bytecode hashes) are published as public references at M1 (per §6's milestones table, M1 row).

---

## 3. Authoritative reference

The full normative inheritance, deployment, and conformance rules — including `IVerifier` interface signatures, `verifyAction` orchestration ordering, record schemas, and the deferred `getFreshSignedState` extension — live in the prototype specification:

- [Prototype specification](../spec/prototype_spec.v1.0-draft.02.publish.md) (working copy: [Google Doc](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing)) — §4 (AuthResolverImpl), §5 (`verifyAction` orchestration), §6 (record schemas)

Reviewers seeking the canonical detail should treat the specification as authoritative; this appendix is a reviewer-convenience excerpt.
