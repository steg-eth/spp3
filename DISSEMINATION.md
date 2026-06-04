# Dissemination Checklist

Single-source-of-truth tracking for this repo's non-code content, per the team
**Single Source of Truth Workflow**.

The **canonical source is the GitHub markdown** (`application.md`). All substantive
content edits land here first, via branch → PR → review → merge. Every other format
is a **derived artifact**, propagated only _after_ merge. Presentation-only details
(site layout, styling, components) are not content and live in their artifact, not here.

## Change process

1. Edit the canonical markdown in a GitHub branch.
2. Open a PR.
3. Review and merge (per branch-protection requirements).
4. Bump the version, reset the derived-artifact checkboxes, and re-propagate to each channel.

## Version

Version: v1.0
Last updated: 2026-06-03

## Status

Whenever the canonical markdown changes, uncheck all derived artifacts and re-check
them as updates are propagated.

**Canonical source**

- [x] `application.md` (GitHub) — the SPP3 submission

**Derived artifacts**

- [x] IPFS — `application.md` pinned, contenthash for `application.steg.eth`
  - `ipfs://bafkreicdqnkt5befl4bbcorosgu2z7hz2xk7ktb27nzvprhlngyyojcwl4`
- [x] Website — spp3.steg.eth.link (`/site`)
- [x] IPFS — `/site` build pinned, contenthash for `spp3.steg.eth`
  - `ipfs://bafybeichiu4gpdiiiaefm7f62276e4t7srktlfkhlvzz32rgoes2hgwihm`
- [ ] Google Docs (the `application.md` Mirror / fallback link)
- [ ] Notion

> Propagated 2026-06-03: the post-reconciliation canonical `application.md` (now content-
> identical to `/site`) pinned to IPFS and wired to `application.steg.eth`; the `/site`
> dossier rebuilt from `main` and wired to `spp3.steg.eth`. Both verified live over the
> eth.link / eth.limo gateways. Google Docs and Notion not yet re-propagated for this version.
