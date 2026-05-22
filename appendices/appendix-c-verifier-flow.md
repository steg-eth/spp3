# Appendix C — The Verifier in Practice: End-to-End Verification Flow

*Supporting material for §6 and §10 of [the application](../application.md). This appendix walks through how the Verifier contract operates in practice — its narrow role as a stateless crypto primitive, the end-to-end flow from credential publication to a counterparty's allow/deny decision, what the "WebAuthn / P-256 verifier" actually does beyond invoking the EIP-7951 precompile, and how the dispatch surface supports extension in future cycles without changing the integration contract.*

---

## The Verifier's role: a stateless crypto primitive

The Verifier is a **stateless crypto primitive**. Given `(method, publicKey, message, signature)` it returns a boolean. It holds no records, no policy, and no state. That narrow surface is deliberate — it is what keeps the new audit surface introduced by this proposal limited to the Verifier's dispatch logic and the AuthResolver's record schemas (§10).

The read-time trust evaluation — *is this signer currently authorized, with what capabilities, and has anything been revoked or rotated* — is **not** the Verifier's job. That evaluation is composed by the SDK reading AuthResolver record content (§6, §10). The Verifier participates in exactly one step of that composition: confirming the signature is cryptographically valid against a given public key.

---

## End-to-end verification flow

The flow below uses the running example from the companion forum post — an agent named `myagent.pinata.eth`, hosted on a MARP.

### Publish side (operator, write)

The operator publishes to the AuthResolver under `myagent.pinata.eth`:

- a **credential record** — the agent's current signing identity. For the Pinata pilot (matching the live `emilemarcelagustin.eth` reference deployment) this is a ZeroDev Kernel smart-account address, with the scheme tag indicating EIP-1271 dispatch
- **capability records** — what the agent is permitted to do
- an **expiry timestamp**, and a **revocation flag** (initially clear)

Writes are gated by ENSv2's `EnhancedAccessControl` per-`(node, recordKey)` delegation, so the operator can grant a single operational key the right to rotate just the credential record without surrendering broader name authority (§10).

### Act side

The MARP-hosted agent signs a request via its ZeroDev Kernel smart account — the bytes are an ECDSA secp256k1 signature from the smart-account's owner key, routed through the account's EIP-1271 `isValidSignature` validator — and sends the signed request to a counterparty.

### Verify side — where the Verifier comes in

The counterparty's SDK runs, in order:

1. **Resolve** the AuthResolver records for `myagent.pinata.eth` — public key, capabilities, expiry, revocation flag. One cheap `eth_call` for L1-resident AuthResolver records; or, for the Pinata pilot's offchain-gated `*.pinata.eth` subnames, a CCIP-Read (EIP-3668) flow (`eth_call` → `OffchainLookup` → gateway HTTPS round-trip → L1 re-validation), which the SDK handles transparently.
2. **Fail fast on state.** Revocation flag set? → `revoked`. Expiry passed? → `stale`. No cryptographic work is done yet. This is SDK logic over AuthResolver record content — not the Verifier.
3. **Call the Verifier** — only if the record is fresh. The SDK passes `(method = EIP-1271, smartAccountAddr, message, signature)`. The Verifier dispatches on method, performs an `IERC1271.isValidSignature` staticcall to the smart account, checks for the canonical `0x1626ba7e` magic-value return, and returns true/false. Typically an `eth_call`, so no gas.
4. **Check capability scope.** Does the requested action fall within the published capabilities? → `policy-denied` if not. SDK logic again.
5. **Emit a reason code** — `verified` / `stale` / `revoked` / `policy-denied` / `mismatch`.

The Verifier participates only in step 3. Steps 1, 2, 4, and 5 are the SDK's read-time trust evaluation over AuthResolver state.

### Why the ordering matters

State checks (step 2) run before signature verification (step 3) for two reasons. First, fail-fast efficiency: a revoked or stale credential is rejected without spending a verification call. Second, reason-code precedence: a revoked credential should surface as `revoked`, not as `verified`-then-overridden — evaluating state first makes the precedence deterministic.

---

## Inside the verifier branches

The Verifier is more than a thin set of wrappers around its underlying primitives. Each of the three v1 branches has one non-obvious piece of logic the integrator would otherwise reimplement — and get subtly wrong. Putting that logic in a single audited contract that any service can `eth_call`, including onchain relying parties, is the public-good argument for the on-chain Verifier.

**EIP-1271 branch (Pinata pilot's path).** The Verifier `staticcall`s `IERC1271.isValidSignature(hash, signature)` on the credential's address, and validates the return against the canonical magic value (`0x1626ba7e`). The non-obvious work: handling non-conforming validator implementations that return `bool` rather than the magic value, distinguishing reverts from `false` returns, and transparently supporting EIP-7702-routed EOAs (EOAs whose code slot has been delegated to a smart-account validator) — the staticcall semantics are identical, but the audit case differs and the SDK needs to surface that distinction in its reason codes.

**`ecrecover` branch (raw secp256k1).** Standard `ecrecover`, with the recovered address checked against the credential record. The non-obvious work is signature-malleability defense: rejecting high-`s` signatures (per EIP-2) so that two distinct signature encodings cannot both verify against the same message.

**P-256 / WebAuthn branch (Virtuals' ACP CLI path).** A WebAuthn assertion is not a raw signature over the caller's message — it is a signature over `authenticatorData ‖ sha256(clientDataJSON)`, with the verification challenge embedded inside `clientDataJSON`. The Verifier's non-obvious work is **envelope handling**: reconstructing the actually-signed bytes from the WebAuthn assertion structure, then feeding `(r, s, x, y, hash)` to the EIP-7951 precompile.

---

## The dispatch surface and extensibility

The `method` parameter in step 3 is the extension point. In this funding cycle the Verifier implements three branches: `P256/WebAuthn → EIP-7951` (passkey/WebAuthn-backed agents), `secp256k1 → ecrecover` (EOA-backed agents), and `EIP-1271 → staticcall` (smart-account and EIP-7702-routed signatures, including ZeroDev Kernel and Safe). The v1 scheme set is anchored in verified MARP support — see [Appendix D](./appendix-d-deliverables-operationalization.md). Future cycles add additional schemes (e.g. BLS) behind the same interface.

This is what "extensible signature verifier" means in [the application](../application.md): the v1 scheme set is fixed and deployed under this cycle's scope, but the integration contract — the function signature the SDK and relying parties call — is stable from M1. Adding a method in a future cycle does not change how existing integrators call the Verifier.
