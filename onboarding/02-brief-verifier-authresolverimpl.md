# Verifier + AuthResolverImpl Spec Brief

## The published spec (canonical)

📄 [<u>Prototype Spec: Verifier + AuthResolverImpl — v1.0-draft.02</u>](https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit)

This is the frozen, externally-shareable version of the spec — what you cite in committee material, what counterparties read.

## TL;DR

The spec defines two contracts — a Verifier (signature-verification dispatch) and an AuthResolverImpl (per-name UUPS proxy on top of ENSv2's PermissionedResolver) — that together let any ENS name serve as an authentication anchor for an AI agent. Counterparties can verify an agent's signed actions against the name's published credentials in one call (verifyAction).

This is the Authority tier of the broader MAIP architecture; the spec implements one of three tiers in the SPP3 application's scope.

## How the published spec is organized

Ten top-level sections in the published Google Doc. Read in order if you're new; skip to the sections you care about if you're returning.

1.  Scope & terminology (§1.1–§1.4) — what's in scope (§1.1), RFC 2119 conventions (§1.2), §1.3 Terminology (read this first; defines MARP, AuthResolver, controlling EOA, etc.), §1.4 Parties (actor roles).

2.  Composite of standards (§2) — the 12 existing standards we compose, not reinvent. Includes the three-layer framing (ENSIP-25 identity / ENSIP-26 attribution / AuthResolver authentication).

3.  Verifier (§3) — three signature schemes (WebAuthn-ES256, secp256k1, EIP-1271), stateless dispatch, §3.6 conformance table (16 requirements).

4.  AuthResolverImpl (§4) — per-name UUPS proxy, EAC role grants + §4.5.2 admin layer (the load-bearing finding from the source-truth hardening pass), HCA attribution, upgrade authority, §4.8 conformance table (26 requirements).

5.  verifyAction orchestration (§5) — the one call counterparties make. 7-step ordering at §5.2, lifecycle caveats at §5.3, §5.4 conformance table (13 requirements).

6.  Record schemas + ref impl (§6) — abstract record shapes (§6.1–§6.3); §6.4 deferred getFreshSignedState; §6.5 reference implementation pointer (TBD; org confirmed as [<u>github.com/steg-eth/</u>](http://github.com/steg-eth/)\<repo-name\>).

7.  End-to-end flow (§7) — sequence diagram of the canonical verify path (embedded PNG in the Doc; mermaid source in the local markdown).

8.  Security considerations (§8) — narrow in this revision; expanded threat model deferred.

9.  Deferred items (§9) — what's not in this revision and where it'll land.

10. References (§10) — split into Normative (§10.1; 14 documents conformance depends on) and Informative (§10.2; ENS contracts source pointers).

The normative body is §3, §4, §5. The conformance tables are §3.6, §4.8, §5.4. Everything else is context, deferred surface, or references.

## 

## What's frozen vs. what's open

Frozen (in v1.0-draft.02): all of §3, §4, §5, §6.1–§6.4, §7, §8; the conformance tables at §3.6, §4.8, §5.4; the §10 references split. Don't edit the published Doc or the local markdown in place — corrections ship as v1.0-draft.03.

Open (tracked in §9 as deferred): the getFreshSignedState method body; CBOR field-level layouts for the three record types; expanded threat model; concrete reference-impl pointer (org committed to github.com/steg-eth/\<repo-name\>, repo name + impl pending SPP funding); initial test vectors (land at M1 with the impl).

Out of scope entirely until v1.1+: ENSIP-10 wildcard resolution; full resolver-level aliasing semantics; capability scope structured-enumeration; ENSIP-25 binding enforcement inside verifyAction; cross-chain credential discovery via EIP-8121.

## Where your judgment would actually help

In rough order of leverage:

1.  Pressure-test §4.5.2 (admin role layer). This was the biggest finding in the source-truth pass — the ROLE_X_ADMIN = ROLE_X \<\< 128 mechanic. If you can find a deployment scenario where the current initialize(admin, roleBitmap) recommendation under-grants or over-grants, that's a v1.0-draft.03 item.

2.  Help scaffold the github.com/steg-eth/\<repo-name\> impl repo once SPP funds. Decide the repo name; scaffold the Solidity (AuthResolverImpl extending PermissionedResolver, Verifier with three handlers); set up Foundry test fixtures; write the test vectors deferred by §9.

3.  Draft the v1.0-draft.03 deltas-style document for the deferred items (signed-freshness body, CBOR field layouts, threat model). Use prototype_spec.v0.2-deltas.md as the template.

4.  Review the spec against Wave-1 MARP integration scenarios (Bankr Agents, Pinata, ZeroDev/Kernel). If a real integration would hit a question the spec doesn't answer, flag it inline in the Google Doc as a comment.

## How NOT to update the spec

The spec follows a strict revision discipline:

- Frozen snapshots are frozen. v1.0-draft.01 and v1.0-draft.02 are both frozen artifacts (markdown files + the Google Doc). Don't edit them in place.

- Substantive changes ship as v1.0-draft.0N. New markdown file (e.g., prototype_spec.v1.0-draft.03.md), copy from latest frozen, add changes, update §12 changelog row, update dissemination-plan.md promotion-path table. Then republish to a new Google Doc.

- Errata (typos, broken links, wrong line numbers) MAY be patched in place if the snapshot hasn't been externally socialized yet, with a clear "Errata YYYY-MM-DD" note in the §12 changelog row.

- Comments are fine on the Google Doc — that's the discussion surface. Comments don't violate the freeze; only document-body edits do.

- Reference implementation work is separate. It lives in github.com/steg-eth/\<repo-name\> (once scaffolded), not in the spec directory.

When in doubt about whether a change is "substantive addition" or "errata": ask first.

## 
