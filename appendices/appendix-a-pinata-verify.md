# Appendix A — Pinata `/verify` Integration Shape

This appendix specifies the concrete shape of the verification endpoint that the Wave-1 Pinata Agents pilot ships in M1. It is provided as an integration reference for committee review and as the working specification the team will implement against. The same shape generalizes to the Virtuals and x402 pilots in M3.

---

## A.1 Overview

A counterparty service (an app, API, or another agent) needs to confirm that an action attributed to an ENS-named agent was authorized by a credential currently bound to that ENS name. The toolkit ships a `/verify` endpoint pattern that any service can implement locally (via the TypeScript SDK) or call against a hosted reference verifier maintained by the team during the pilot phase.

The endpoint composes two onchain calls:

1. **Credential and authority resolution** — look up the agent's credential record and confirm it is currently authorized for the ENS name (via the `AuthResolver` contract, which holds credential, capability, and revocation records under any ENS name in a single resolver-level surface).
2. **Signature verification** — verify the signed request against the resolved credential (via the `Verifier` contract, which dispatches by scheme: EIP-1271 `staticcall` for smart-account-routed signatures, `ecrecover` for raw secp256k1, or the EIP-7951 precompile for P-256). The Pinata pilot exercises the EIP-1271 path against the agent's ZeroDev Kernel smart account.

The endpoint returns a normalized decision and a reason code drawn from the taxonomy in §A.4 below.

---

## A.2 Request schema

```json
{
  "ensName": "agent.example.eth",
  "message": "<utf-8 string or base64-encoded payload that was signed>",
  "signature": "<base64-encoded signature; for the Pinata pilot, a secp256k1 ECDSA signature from the smart-account owner key, verified via the smart account's EIP-1271 `isValidSignature` validator>",
  "credentialId": "<optional credential identifier (e.g., smart-account address or signer fingerprint), if the agent's controller record authorizes more than one credential>",
  "challenge": "<optional server-issued nonce, for replay protection>"
}
```

Required fields: `ensName`, `message`, `signature`. The `credentialId` field is required when the agent's controller record authorizes more than one credential. The `challenge` field is recommended for replay-sensitive flows.

---

## A.3 Response schema

```json
{
  "decision": "allow" | "deny",
  "reason": "verified" | "unverified" | "stale" | "revoked" | "mismatch" | "policy-denied" | "endpoint-unproven",
  "credentialId": "<the credential that verified, if applicable>",
  "verifiedAt": "<ISO-8601 timestamp>",
  "checks": {
    "signature": { "passed": true, "verifier": "<Verifier address>" },
    "credential": { "passed": true, "resolvedFrom": "<AuthResolver address>" },
    "authority": { "passed": true, "resolvedFrom": "<AuthResolver address>" },
    "freshness": { "passed": true, "issuedAt": "<ts>", "expiresAt": "<ts or null>" }
  }
}
```

The `checks` object is informational and lets a counterparty audit which underlying check failed if `decision = "deny"`.

---

## A.4 Reason code semantics

| Code | Meaning |
|---|---|
| `verified` | All four checks passed; the signed action is authorized. |
| `unverified` | Signature did not verify against the resolved credential. |
| `stale` | Credential record is older than the configured freshness window (default: implementation-defined per pilot; documented in the integration guide). |
| `revoked` | Credential has been explicitly revoked via the controller. |
| `mismatch` | The `credentialId` in the request does not match any credential currently authorized for the ENS name. |
| `policy-denied` | The action falls outside the policy attached to the credential (e.g., spend limit, action allowlist, time window). |
| `endpoint-unproven` | The endpoint that supplied the request cannot be cryptographically tied to the ENS-resolved authority (used for endpoint-control proofs; out of scope for the basic Pinata flow). |

---

## A.5 Integration sequence (Pinata lane)

The Pinata pilot exercises the following lifecycle:

1. **Onboarding.** The operator deploys a Pinata agent backed by a ZeroDev Kernel smart account (created via the Namera SDK, matching the live reference deployment on `emilemarcelagustin.eth`). The owner key (secp256k1) lives in the Pinata environment's encrypted secret store; the smart-account address is published as the credential record on the agent's `AuthResolver` under the agent's ENS name.
2. **Authority binding.** The operator authorizes the credential for the ENS name by writing to the `AuthResolver` contract (single resolver-level surface holding credential, capability, and revocation records).
3. **Signed action.** The agent signs a request (e.g., an outbound message or transaction) using the private key.
4. **Verification.** The counterparty calls the `/verify` endpoint with the request and the signature. The endpoint executes the three onchain checks and returns a normalized decision.
5. **Rotation / revocation.** If the operator rotates the credential (snapshot, key compromise, scheduled rotation), the new credential is published and the old credential is revoked via the `AuthResolver`. Counterparties calling `/verify` after that point receive `decision = "deny"` with `reason = "revoked"` (or `"stale"` if rotation is pending propagation).

---

## A.6 Implementation notes

- **Onchain gas cost.** For the Pinata pilot's smart-account-routed path, signature verification performs an `IERC1271.isValidSignature` staticcall to the agent's ZeroDev Kernel; cost is dominated by the Kernel's internal ECDSA validator (typically ~5–15k gas, of which ~3k is `ecrecover`). Pilots using raw secp256k1 EOA signing skip the staticcall and pay only `ecrecover` (~3,000 gas). The EIP-7951 P-256 precompile path (~3,000 gas) is reserved for passkey/WebAuthn-backed pilots such as Virtuals.
- **Resolution path.** The Pinata pilot's `*.pinata.eth` namespace uses an offchain (CCIP-Read / EIP-3668) subname pattern — AuthResolver lookups resolve through a Pinata-operated gateway with L1 re-validation, not direct L1 storage reads; the SDK handles the round-trip transparently.
- **Local vs hosted verifier.** The TypeScript SDK lets a counterparty execute the verification stack locally (preferred for high-volume use cases). The team will also operate a hosted reference verifier during the pilot phase for integrators that prefer a managed endpoint.
- **Caching.** Credential records are eligible for short-window caching by counterparties (with cache invalidation on receipt of `stale` or `revoked` from the verifier). Cache semantics are documented in the integration guide deliverable (§6 item 4).
- **Multi-credential authority.** A single ENS name may authorize multiple credentials simultaneously (e.g., a primary credential and a rotation-staging credential). The `credentialId` field disambiguates.

---

## A.7 Reference implementation pointer

The Pinata-side integration ships as part of M1 (§6). The reference implementation will be published as a public package in the synthesis repository, with an end-to-end demo running on the team's existing `emilemarcelagustin.eth` deployment. The contract addresses, ABI, and bytecode hashes are published as M1 deployment artifacts (§6 M1 Verification).

This appendix is a working specification, not a frozen interface. Final field names, the precise shape of the `checks` object, and reason-code definitions may be refined during M1 implementation in response to pilot feedback. Any refinements will be documented in the M1 integration report and reflected in the SDK and conformance suite.
