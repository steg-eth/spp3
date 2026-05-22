# Appendix D — Deliverables Mapped to What They Operationalize

*Supporting material for §6 and §8 of [the application](../application.md). This appendix maps each of the six deliverable categories to the specific function it operationalizes, so a reviewer can see that every funded artifact corresponds to a concrete role in the verification system — not to research time or runway. It also states the architectural through-line for the three core components (AuthResolver, Verifier, SDK).*

---

## The mapping

| Deliverable | Operationalizes | In one line |
|---|---|---|
| **AuthResolver** (contract) | **The record schema** — credential / capability / revocation records plus validity metadata, as deployed, write-permissioned onchain state under an ENS name | The schema made real: storage plus EAC-gated writes. "What is published." |
| **Verifier** (contract) | **Signature verification** — EIP-7951 P-256 (WebAuthn / passkey), `ecrecover` (secp256k1 EOA), and EIP-1271 staticcall (smart-account / EIP-7702), plus method dispatch | The crypto check. Stateless, permissionless. "Is this signature valid." |
| **TypeScript SDK** | **The read-time trust evaluation** — the composition logic | Resolves AuthResolver records → checks freshness / revocation → calls the Verifier for crypto → checks capability scope → emits a normalized reason code. "Is this action authorized, right now." |
| **Conformance suite** | **Verifiability** — reproducible test vectors | Lets any verifier implementation be audited against shared cases. "Does an implementation conform." |
| **Integration guides** | **Adoption** — wiring patterns for apps, APIs, and MARPs | Recommended patterns for expiry, rotation, revocation, policy enforcement. "How an integrator plugs in." |
| **Pilot integrations** | **Proof** — the pattern running in production-like environments | Three Wave-1 pilots plus public integration reports. "Does it actually work in the field." |
| **Security package** | **Production-readiness** — threat model, hardening checklist | Audit-ready pack (not a completed audit). "Is it safe to depend on." |

---

## How the v1 scheme set anchors in verified MARP support

The Verifier's v1 scheme set is not speculative — it is reverse-engineered against current signing models on named MARP platforms:

- **Virtuals Protocol's** ACP CLI tooling generates P-256 signers natively (`acp agent add-signer` stores a P-256 key in the OS keychain). Covered by the EIP-7951 precompile dispatch.
- **The reference deployment on `emilemarcelagustin.eth`** runs a ZeroDev Kernel smart account with ECDSA secp256k1 signers, created via the Namera SDK. Covered by `ecrecover` dispatch.
- **EIP-1271 staticcall** extends coverage to the broader smart-contract wallet population — any ZeroDev Kernel, Safe, or ERC-4337-with-EIP-1271 account that routes signatures through an `isValidSignature` validator.

Together, these three schemes span the passkey-backed, EOA-backed, and smart-account-routed signing models present across named MARPs from day zero.

**Bankr Agents verification (pre-submission).** Bankr Agents — a production-scale operator-archetype MARP — has been verified end-to-end for technical compatibility with the v1 Verifier. Bankr's `/agent/sign` endpoint produces secp256k1 ECDSA signatures (verifiable via `ecrecover`); Bankr's wallets use the EIP-7702 + EIP-1271 layered model with the canonical ZeroDev Kernel implementation (verifiable via EIP-1271 staticcall). Test methodology and on-chain findings are published as a public artifact prior to submission close. Pre-submission DevRel engagement with Bankr is procedural and pre-commitment — neither Wave-1 milestones nor pilots depend on Bankr's adoption.

---

## The through-line for the three core components

The two contracts each do one narrow thing; the SDK is where they become an answer.

- The **AuthResolver** publishes the state — it operationalizes the record schema as onchain, write-permissioned data under an ENS name. It holds records; it does not evaluate them.
- The **Verifier** confirms the crypto — it operationalizes signature verification and method dispatch. It is stateless and permissionlessly callable; it holds no records and no policy.
- The **SDK** is the only piece that produces a *decision*. It operationalizes the read-time trust evaluation: it composes the AuthResolver's published state and the Verifier's signature check with freshness, revocation, and capability-scope logic into a normalized allow / deny outcome with a reason code.

This is the same split stated in §10 ("Technical Foundation") and walked through end-to-end in [Appendix C](./appendix-c-verifier-flow.md): two contracts with deliberately narrow responsibilities, and an SDK that turns them into a usable authorization decision.

---

## Why the mapping matters

Each deliverable corresponds to a distinct, checkable function in the verification system. None of the six is funded as open-ended research or runway — they map one-to-one onto roles a reviewer can verify against public references within the cycle. This is the same discipline applied in §8, where each budget line item is tied to specific shipped artifacts rather than to research time; this appendix is the functional view of that same correspondence.
