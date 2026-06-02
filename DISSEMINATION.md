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
3. Review and merge (required reviewer: @Mouzayan).
4. Bump the version, reset the derived-artifact checkboxes, and re-propagate to each channel.

## Canonical source

- `application.md` — the SPP3 submission (canonical)

## Current version

**v1.0** — 2026-06-02

## Dissemination status

Propagation of the current version to each downstream channel. Uncheck every derived
row whenever the canonical markdown changes; re-check each as it is re-propagated.

- [x] GitHub (canonical) — `application.md`
- [ ] Website — spp3.steg.eth.link (`/site`)
- [ ] IPFS — contenthash for `spp3.steg.eth`
- [ ] Google Docs
- [ ] Notion

> Derived artifacts are intentionally unchecked: the 2026-06 site rebuild was authored
> out-of-process (site-first) and the canonical markdown was reconciled afterward.
> Re-propagate from `application.md` once the promotion PR merges.
