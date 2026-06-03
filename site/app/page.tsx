import CopyPrompt from "./CopyPrompt"

export default function Spp3ApplicationPage() {
  return (
    <article>
      <header>
        <h1>ENS Verification and Revocation Toolkit for Agent Subname Issuance</h1>
        <p className="meta" style={{ fontStyle: "italic", fontSize: "1rem", marginBottom: "1.25rem" }}>
          A practical, open-source ENS-native authorization and verification toolkit that lets managed
          agent runtime platforms (MARPs) issue agent identities as ENS subnames carrying scoped,
          revocable, and independently verifiable authority — Verifier + AuthResolver contracts, a TypeScript
          SDK, a conformance suite, integration guides, and end-to-end operational validation flows
          establishing an open interoperability pattern for agent identity and authorization.
        </p>
        <p className="meta">
          Submission repo:{" "}
          <a href="https://github.com/steg-eth/spp3">github.com/steg-eth/spp3</a> · Submitted by{" "}
          <a href="https://ens.app/estmcmxci.eth">estmcmxci.eth</a> ·{" "}
          <a href="https://ens.app/mouz.eth">mouz.eth</a>
        </p>
      </header>

      <nav className="toc" aria-label="Table of contents">
        <h2>Contents</h2>
        <ol>
          <li><a href="#team">Team Profile</a></li>
          <li><a href="#abstract">Abstract</a></li>
          <li>
            <a href="#problem">Problem</a>
            <ol>
              <li><a href="#problem-adoption">Adoption and Utility</a></li>
              <li><a href="#problem-revenue">Registrations and Revenue</a></li>
              <li><a href="#problem-metric">Verifiable metric</a></li>
            </ol>
          </li>
          <li>
            <a href="#approach">Approach</a>
            <ol>
              <li><a href="#approach-scope">Scope</a></li>
              <li><a href="#approach-milestones">Milestones</a></li>
              <li><a href="#approach-budget">Budget</a></li>
              <li><a href="#approach-counterfactual">Counterfactual</a></li>
            </ol>
          </li>
          <li><a href="#delivery">Delivery History</a></li>
          <li><a href="#foundation">Technical Foundation</a></li>
          <li><a href="#conclusion">Conclusion</a></li>
          <li><a href="#compliance">Compliance &amp; Attestations</a></li>
        </ol>
      </nav>

      <section id="summary" aria-label="Proposal summary">
        <table className="kpi">
          <tbody>
            <tr>
              <td className="dim-label">Submitted by</td>
              <td>Steg.eth — <a href="https://ens.app/estmcmxci.eth">estmcmxci.eth</a> · <a href="https://ens.app/mouz.eth">mouz.eth</a></td>
            </tr>
            <tr>
              <td className="dim-label">Requested funding</td>
              <td>$440,000 total requested (Tier 1: $265,000; Tier 2: $175,000)</td>
            </tr>
            <tr>
              <td className="dim-label">Term</td>
              <td>July 2026 – July 2027</td>
            </tr>
            <tr>
              <td className="dim-label">Primary category</td>
              <td>ENS Infrastructure</td>
            </tr>
            <tr>
              <td className="dim-label">Secondary category</td>
              <td>Outreach and Integrations</td>
            </tr>
            <tr>
              <td className="dim-label">Prior Delivery</td>
              <td>
                Merged contributor to canonical ENS contracts (
                <a href="https://github.com/ensdomains/ens-contracts/pull/509">PR #509</a> /{" "}
                <a href="https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0">v1.7.0</a>); Public
                Goods grantee —{" "}
                <a href="https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392/11?u=estmcmxci">
                  ENSv2 interoperability research
                </a>
                ; 1st-place{" "}
                <a href="https://synthesis.mandate.md/projects/trust-resolution-layer-b67a">
                  ENS-identity hackathon
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="team">
        <h2>Team Profile</h2>
        <div className="team-grid">
          <div className="team-card">
            <span className="team-name">
              <svg
                className="team-mark"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ verticalAlign: "baseline", marginRight: "0.4em" }}
              >
                <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none">
                  <line x1="12" y1="3.2" x2="12" y2="20.8" />
                  <line x1="4.4" y1="7.6" x2="19.6" y2="16.4" />
                  <line x1="4.4" y1="16.4" x2="19.6" y2="7.6" />
                </g>
              </svg>
              <a href="https://ens.app/estmcmxci.eth">estmcmxci.eth</a>
            </span>
            <div className="team-role">ENS architecture · specification design · integration</div>
            <dl className="team-creds">
              <div className="cred">
                <dt>ENS core</dt>
                <dd>
                  Merged contributor to canonical ENS contracts —{" "}
                  <a href="https://github.com/ensdomains/ens-contracts/pull/509">PR #509</a> /{" "}
                  <a href="https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0">v1.7.0</a>{" "}
                  (EIP-7951 P-256 precompile, ~98% gas reduction).
                </dd>
              </div>
              <div className="cred">
                <dt>Research</dt>
                <dd>
                  ENS Public Goods grantee —{" "}
                  <a href="https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392/11?u=estmcmxci">
                    &ldquo;ENSv2 Interop Research&rdquo;
                  </a>
                  ; output, the{" "}
                  <a href="https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734?u=estmcmxci">
                    Universal Resolver Matrix
                  </a>
                  , seeded the <a href="https://docs.steg.eth.link">architecture</a> this proposal
                  productionizes.
                </dd>
              </div>
              <div className="cred">
                <dt>Awards</dt>
                <dd>
                  <a href="https://synthesis.mandate.md/projects/trust-resolution-layer-b67a">
                    Synthesis Hackathon 1st
                  </a>{" "}
                  (ENS Identity) ·{" "}
                  <a href="https://ethglobal.com/showcase/oikonomos-w6z57">
                    ETHGlobal HackMoney 2026 Finalist + ENS bounty
                  </a>
                  .
                </dd>
              </div>
              <div className="cred">
                <dt>Talk</dt>
                <dd>
                  <a href="https://www.youtube.com/watch?v=e_QBTQGMxPs">
                    Devcon SEA 2024 — &ldquo;Universal ECCs&rdquo;
                  </a>{" "}
                  (Ethereum Foundation).
                </dd>
              </div>
            </dl>
          </div>
          <div className="team-card">
            <span className="team-name">
              <svg
                className="team-mark"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ verticalAlign: "baseline", marginRight: "0.4em" }}
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <a href="https://ens.app/mouz.eth">mouz.eth</a>
            </span>
            <div className="team-role">Protocol engineering · smart-contract systems · security</div>
            <dl className="team-creds">
              <div className="cred">
                <dt>Protocol</dt>
                <dd>
                  Production smart-contract systems across DeFi &amp; NFT finance at Arcade.xyz —{" "}
                  <a href="https://github.com/arcadexyz/arcade-protocol/blob/main/contracts/rollover/CrossCurrencyRollover.sol">
                    NFT lending
                  </a>
                  , collateral/accounting,{" "}
                  <a href="https://github.com/arcadexyz/dao-contracts">LP staking</a>,{" "}
                  <a href="https://github.com/arcadexyz/governance/blob/main/contracts/NFTBoostVault.sol">
                    governance
                  </a>
                  .
                </dd>
              </div>
              <div className="cred">
                <dt>Prize</dt>
                <dd>
                  Uniswap Foundation prize at the{" "}
                  <a href="https://atrium.academy/uniswap">UHI incubator</a> for a{" "}
                  <a href="https://github.com/Mouzayan/dex-profit-wars">v4 hook</a> implementation.
                </dd>
              </div>
              <div className="cred">
                <dt>Focus</dt>
                <dd>
                  Focused on adversarial system design, including secure state transitions, permission
                  management, and authorization surfaces.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="agent-block">
        <CopyPrompt
          prompt={
            "Read https://application.steg.eth.link — Steg's ENS SPP3 application — and evaluate it against the SPP3 rubric at https://discuss.ens.domains/t/spp3-submission-timeline-and-artifacts/22124"
          }
        />
        <p className="agent-note">Reviewing with an agent? Point it at the machine-readable application.</p>
      </div>

      <section id="abstract">
        <h2>1. Abstract</h2>
        <p>
          AI agents increasingly take actions across apps, APIs, and hosted runtimes — but outside
          services generally cannot portably verify, in real time across heterogeneous systems, that an
          agent-signed action is authorized under the operator&rsquo;s current policy.
        </p>
        <p>
          Authorization remains fragmented within vendor-specific silos, with no shared substrate for
          rotation, revocation, audit, or cross-platform verification.
        </p>
        <p>
          Agents need names so authority can be discovered and verified across heterogeneous systems. In
          this context, &lsquo;using ENS&rsquo; means binding an agent to an ENS name that publishes its
          current authorization state, allowing any relying party to independently verify current authorization state in
          real time.
        </p>
        <p>
          ENS already provides the naming, discovery, and registry primitives. What it lacks is the layer
          above them: <i>a standardized, resolver-native, neutral authorization-and-verification
          layer</i> that turns an ENS name into a live authorization-state lookup (auth lookup layer) that allows any
          service to independently verify, at use time, whether an agent remains authorized. This proposal ships
          that layer.
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-spec"></label>
          <input type="checkbox" id="sn-spec" className="sidenote-toggle" />
          <span className="sidenote">
            <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing">
              <strong>Prototype spec</strong>
            </a>{" "}
            — defines the Verifier + AuthResolver architecture on ENSv2: authority record schemas (credential, capability,
            revocation), the verify-action flow across WebAuthn/P-256 / ECDSA / EIP-1271, and the normative
            conformance criteria that define the layer this proposal ships.
          </span>
        </p>
        <p>
          <strong>An ENS-native, vendor neutral authorization toolkit</strong> — Verifier, AuthResolver, SDK, and
          conformance suite built on ENSv2 — lets any integrator resolve ENS-published authority, verify a
          signed request against current state, and enforce expiry, rotation, and revocation through
          normalized allow/deny reason codes.
        </p>
        <p>
          The initial target integrator is the managed agent runtime platform (MARP): operator platforms
          offering agent-executable wallets across apps/APIs that need portable  — for more, read our <a href="https://docs.google.com/document/d/1zN0Dp9Tm7JCoLb-QYbigZuiB8O9vB7cEr6Pu96ewJRQ/edit?usp=sharing">taxonomy document</a> in the appendix.
        </p>
        <p>
          MARP adoption follows an established ENS growth pattern: operator-issued subnames, validated in
          production by Coinbase&rsquo;s cb.id deployment. The difference is that the payload now carries
          current authorization state, not identity alone.
        </p>
        <p>
          Tier 1 delivers the core infrastructure (audited contracts, SDK, conformance suite, reference
          validation flows for independently verifying current authorization state); Tier 2 adds one
          external Wave-1 ecosystem integration, engineering and deployment support.
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-wave1"></label>
          <input type="checkbox" id="sn-wave1" className="sidenote-toggle" />
          <span className="sidenote">
            Wave-1 integration partners are in early discussion — pre-commitment, not yet contracted. Steg
            is participating in the Pinata Agents Partner Templates program and has ongoing integration
            discussions with Bankr (ENS-agent-identity{" "}
            <a href="https://github.com/BankrBot/skills/pull/189">PR #189</a>), while AuthResolver Phase A has
            already been technically validated on a live Bankr test name. Neither the milestone structure nor
            the Wave-1 floor depends on any single partner.
          </span>
        </p>
        <p>
          By July 2027, Steg delivers production MARP integration issuing ENS agent subnames at measurable volume,
          with a public dashboard for subname issuance and active authority records, plus externally
          verifiable delivery artifacts: deployed contracts, a CI-passing conformance suite, and a
          completed third-party audit.
        </p>
      </section>

      <section id="problem">
        <h2>2. Problem</h2>
        <p>
          Onchain actors are increasingly delegating authority to third-party agents — recreating, at
          machine speed, what researchers call the AI aligment problem in principal–agent transactions. <a href="https://www.jstor.org/stable/2634162">Hadfield &amp; Koh (2025)</a>
        </p>
        <p>
          Once authorized, it&rsquo;s difficult to ensure that an agent acts only within bounded authority,
          and the principal has no way to verify in real time that a given action remains within those
          bounds.
        </p>
        <p>
          Recent exploits leverage prompt injection to trick an agent into acting beyond its mandate.
          Because the key the agent holds is itself the permission credential, that manipulated intent can
          still produce a valid signature. The relying party, unable to distinguish &ldquo;authorized&rdquo;
          from merely &ldquo;signed,&rdquo; executes it.
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-grok"></label>
          <input type="checkbox" id="sn-grok" className="sidenote-toggle" />
          <span className="sidenote">
            <strong>The Grok–Bankr exploit (Base, 2026).</strong> An attacker DMed <code>@grok</code> a
            Morse-code message; Grok &ldquo;helpfully&rdquo; decoded it into a plaintext transfer
            instruction tagging <code>@bankrbot</code>, which treated the public reply as an executable
            command and drained ~3B DRB tokens (~80–88% later recovered via negotiation) —{" "}
            <a href="https://slowmist.medium.com/behind-the-grok-exploitation-an-analysis-of-ai-agent-permission-chain-abuse-4d832d1bfc73">
              SlowMist analysis
            </a>
            . The incident is exactly the failure mode described in section 2: The execution layer could not independently verify whether the instruction remained authorized under the operator’s current policy, and executed it anyway.
            <span style={{ display: "block", marginTop: "0.5em" }}>
              Our proposal would not have stopped Grok from being prompt-injected — it touches nothing at the LLM
            layer — but it supplies the missing authorization check the post-mortem calls for: before executing, a
            relying party <strong>distinguishes &ldquo;signed&rdquo; from &ldquo;currently authorized&rdquo; by resolving the current authorization state from a trusted registry built on ENSv2</strong>.
            That state is mapped as a key-value pair within the agent&rsquo;s ENS text records, where the AuthResolver
            exposes the published authority and the Verifier checks the signed request against it — the requested
            3B-token transfer fails the published amount/recipient policy. Because authorization is checked against current
            ENS-published state — including revocation, expiry, and policy updates — rather than a key the agent holds,
            it protects any MARP that performs the check at execution time, regardless of runtime implementation.
            </span>
          </span>
        </p>
        <p>In the real world, delegated authority takes a familiar form: the Power of Attorney.</p>
        <p>
          Relying parties like banks check a public registry for the document&rsquo;s current status,
          confirming the agent currently holds the authority to act on behalf of the principal.
        </p>
        <p>In other words, <strong>the relying party trusts the registry, not the agent.</strong></p>
        <p>
          If the principal revokes the Power of Attorney, the agent can no longer carry out its intent.
        </p>
        <p>
          In agentic finance, no such backstop exists: the key the agent holds <em>is</em> the permission
          credential — we need to decouple the two.
        </p>
        <p>By publishing each agent&rsquo;s delegated authorization state as a key-value pair in its ENS text
          records — a credibly neutral, externally resolvable store of record — a relying party can run a
          freshness check against it before execution, confirming the action is currently authorized under the
          operator&rsquo;s published authorization state, including revocation, expiry, and policy updates.</p>
        <p>
          Because the authorization state is published on a shared ENS namespace rather than inside a single
          runtime, any counterparty can independently resolve and verify it. Authorization becomes portable
          across runtimes instead of remaining vendor-local, eliminating the need for each operator platform to maintain its own isolated authority registry.
        </p>
        <p>
          And because operators issue those credentials as ENS subnames, the same act that makes agentic
          transactions safer also grows ENS.
        </p>

        <h3 id="problem-adoption">2.1 Adoption and Utility</h3>
        <p>
          <a href="https://ens.domains/blog/post/coinbase-strategic-integration-of-ens">
            Coinbase&rsquo;s strategic integration of ENS
          </a>
          , analyzed in prior work by estmcmxci.eth, demonstrates a growth pattern that this proposal
          tracks to — with cb.id subname issuance as the canonical, in-production case. Operator-issued
          subnames have driven{" "}
          <a href="https://x.com/ensdomains/status/2051331560767623537">ENS growth since</a>.
        </p>
        <p>
          This proposal applies that same pattern to the next operator class: managed agent runtime
          platforms (MARP) — similar to a wallet, but exposing an agent-executable interface.
        </p>
        <p>
          MARPs increasingly delegate signing authority via session-key primitives (EIP-7702, ERC-4337,
          ERC-7710/7715) that constrain what an agent can sign, but there is no standardized way for
          independently verifying, in real time, that an agent-signed action remains authorized under the
          operator&rsquo;s current published authorization state. (Full operator-class case in{" "}
          <a href="https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121">
            Steg&rsquo;s ENS forum post, May 2026
          </a>
          .)
        </p>
        <p>
          Building on the subname-issuance pattern cb.id established, the proposed payload carries authority
          rather than identity alone, creating utility that directly motivates operator adoption by reducing
          execution risk.
        </p>
        <p>
          However, ENS adoption depends on value-fit with the integrator: ENS has to demonstrably improve
          the integrator&rsquo;s product or user experience.
        </p>
        <p>
          The blocker: agent runtimes require a more active, independently verifiable authorization model —
          one ENS is uniquely positioned to provide, but does not yet natively support.
        </p>
        <p>
          <strong>
            What the current stack does not provide on its own is the ENS-keyed authority-policy lookup
            layer: a resolver-level surface that lets any service independently confirm, in real time, that
            a signed action came from a credential currently authorized for an ENS name and that the
            credential has not been rotated, expired, or revoked.
          </strong>
        </p>
        <p>
          This proposal closes that gap by introducing an authority schema and resolver-native verification
          path that lets counterparties query current authorization state directly from ENS.
        </p>
        <p>
          This lets a MARP verify whether an agent&rsquo;s action is currently authorized under the
          operator&rsquo;s published authorization state — increasing security guarantees for its users, and
          with it ENS&rsquo;s value-fit for a prospective integrator. This gives the MARP a strong reason to
          issue identity under ENS rather than rolling its own or locking into a closed vendor.
        </p>
        <p>
          Latent demand for this authority-lookup layer is already materializing. Operator failures such as
          Bankr&rsquo;s prompt-injection exploit illustrate the cost of not having an independently
          verifiable authorization layer.
        </p>

        <h3 id="problem-revenue">2.2 Registrations and Revenue</h3>
        <p>
          The addressable base already exceeds 480K+ agents transacting across Coinbase&rsquo;s x402
          protocol (Source:{" "}
          <a href="https://www.coinbase.com/developer-platform/discover/launches/agentic-market">
            Coinbase, Agentic.Market, April 2026
          </a>
          ) and is rapidly increasing. Each agent is a candidate ENS subname that holds authorization state. It is an early market
          signal that demonstrates meaningful demand for agent-native infrastructure. Applying the cb.id
          subname-issuance growth pattern to it presents a compelling opportunity.
        </p>
        <p>
          Although subnames carry no registrar fee, the strategic bet is on widening ENS&rsquo;s adoption
          surface rather than generating per-subname revenue. Direct DAO revenue accrues downstream: through
          the .eth names each MARP must register and renew to continue issuing subnames for its users, and
          through conversion when a share of those agents&rsquo; end users register their own .eth.
        </p>
        <p>
          Even modest conversion of the agent population into operator registrations and .eth
          adoption produces measurable registration and renewal demand under existing ENS economics. Against
          ENS&rsquo;s ~$3.1M six-month registration-and-renewal base (
          <a href="https://dune.com/queries/7549207/11500922">Dune query 7549207</a>), a conservative 3%
          conversion of the 480k-agent population implies approximately 14,400 registrations — roughly
          $400k–$580k in registration and renewal fees over five years at ENSv2 pricing.
        </p>
        <p>
          The impact is modest relative to ENS&rsquo;s existing registration base, but real, attributable,
          and scalable with growth in the agent economy.
        </p>
        <p>
          Why interoperability infrastructure compounds: The leverage isn&rsquo;t tied to any single
          runtime. An open ENS-native verification pattern becomes cheaper to adopt with each integration,
          pulling additional runtimes toward a shared authority layer rather than proprietary identity
          silos.
        </p>
        <p>
          Establishing that pattern now — while operator standards are still forming across hosted runtimes,
          smart-account agents, enterprise platforms, and ERC-4337 execution environments — reduces
          long-run fragmentation risk at the operator layer before it ossifies <em>and</em> strengthens
          ENS&rsquo;s position as the shared authority layer for the emerging agent ecosystem.
        </p>

        <h3 id="problem-metric">2.3 Verifiable metric</h3>
        <p>Adoption is measured from onchain data, not self-reporting. Core metrics are:</p>
        <ol>
          <li>agent subnames issued under integrated operator names, and</li>
          <li>active authority records (excluding revoked records)</li>
        </ol>
        <p>
          Both are directly queryable from ENS resolution and resolver state. Wave-1 integration will ship a
          public dashboard with transparent methodology, including baseline and post-integration time
          windows, operator-level cohorts, and metric definitions. This enables independent reproduction of
          issuance and active-authority counts from raw chain data.
        </p>
        <p>
          Downstream .eth registration and renewal impact will be tracked as directional conversion metrics
          against ENS registrar data, with assumptions and attribution limits explicitly disclosed.
          Together, these measures make implementation quality and adoption impact externally verifiable
          from public onchain data, without relying on Steg&rsquo;s internal reporting.
        </p>
      </section>

      <section id="approach">
        <h2>3. Approach</h2>
        <p></p>
        <h3 id="approach-scope">3.1 Scope</h3>
        <p>
          Building on the authorization gap defined above, this proposal funds a defined integration service
          for apps, APIs, managed agent runtime platforms (MARPs), and relying services that need portable,
          real-time verification of whether an ENS-named agent is currently authorized for a specific
          action.
        </p>
        <p>
          Crucially, Steg is building shared, forkable open-source infrastructure that new operator classes
          can adopt rather than implement locally.
        </p>
        <p>
          The current{" "}
          <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?tab=t.0">
            specification draft
          </a>{" "}
          defines the architecture, verification flow, and conformance surface. This proposal funds the
          production implementation, interoperability tooling, validation, and deployment hardening required
          to operationalize it across Wave-1 MARP environments.
        </p>
        <p>The toolkit consists of:</p>
        <ul>
          <li>
            Onchain infrastructure — a shared Verifier and per-name AuthResolver composing ENSv2&rsquo;s
            access-control substrate into a verification and authorization layer for credential, capability,
            and revocation records.
          </li>
          <li>
            TypeScript SDK — resolves ENS-published authorization state, verifies signed requests, and
            returns normalized allow/deny outputs with machine readable reason codes. 
          </li>
          <li>
          Conformance suite — reproducible test vectors covering schema validity, authority binding, freshness, revocation,
            rotation and adversarial mutation cases.
          </li>
          <li>
            Integration guides — recommended patterns for authorization checks, expiry, rotation,
            revocation, and policy enforcement across apps, APIs, and managed agent runtimes.
          </li>
          <li>
            Operational validation flows — end-to-end validation across supported signing schemes in
            production-like environments.
          </li>
          <li>
            Security package — third-party audit, threat model, verifier hardening, replay protection
            review, and deployment checklist.
          </li>
        </ul>
        <p>
          With the toolkit, integrators can resolve an ENS-named agent&rsquo;s published authorization
          state, verify signed requests against current authorization state published through AuthResolver in real time, and enforce expiry,
          rotation, and revocation through normalized allow/deny reason codes across crypto-native and Web2
          agent environments alike.
        </p>
        <p>By April 2027 the project delivers:</p>
        <ul>
          <li>audited Verifier and AuthResolver contracts,</li>
          <li>SDK v1.0 and integration tooling,</li>
          <li>conformance suite and operational validation flows,</li>
          <li>published deployment guidance and interoperability findings,</li>
          <li>and a production-ready release validated in production-like environments.</li>
        </ul>
        <p>
          An expanded Tier 2 scope extends the infrastructure through a Wave-1 ecosystem integration,
          interoperability validation, and deployment support for early operator environments.
        </p>
        <p>
          Every deliverable maps to a public artifact — deployed contract addresses, a
          published third-party audit, CI-passing conformance suite results, and the onchain issuance /
          active-authority dashboard (<a href="#problem-metric">§2.3</a>) — per the verification columns in{" "}
          <a href="#approach-milestones">§3.2</a>.
        </p>

        <h3 id="approach-milestones">3.2 Milestones</h3>
        <h4>Tier 1 (core infrastructure)</h4>
        <table className="kpi kpi-milestones">
          <thead>
            <tr>
              <th>#</th>
              <th>Deliverable</th>
              <th>Verification</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">1</td>
              <td>
                Verifier + AuthResolver deployed to Sepolia; TS SDK alpha; initial conformance suite +
                interoperability vectors published; deferred specification workstreams initiated;
                third-party security review engaged
              </td>
              <td>
                Onchain deployment artifacts (AuthResolverImpl, Verifier addresses, ABI, bytecode hashes);
                SDK package registry; audit kickoff published (firm, scope, timeline)
              </td>
              <td>Oct 31, 2026 (M3)</td>
            </tr>
            <tr>
              <td className="dim-label">2</td>
              <td>
                Third-party audit completed + findings remediated; finalized v1.0 conformance specification
                and canonical CBOR layouts published; TS SDK v1.0; conformance suite completed; integration
                and deployment documentation published
              </td>
              <td>
                Audit report published; remediation diff published; finalized v1.0 spec + canonical CBOR
                layouts published; SDK versioned release; CI-passing conformance suite; integration/deployment
                documentation published
              </td>
              <td>Jan 31, 2027 (M6)</td>
            </tr>
            <tr>
              <td className="dim-label">3</td>
              <td>
                Reference validation flows completed across all supported signing models (WebAuthn/P-256,
                ECDSA, EIP-1271) in production-like environments; replay/freshness validation and lifecycle
                recovery testing completed; operational verification metrics for independent authorization-state validation finalized; mainnet-ready
                hardened release and deployment checklist published
              </td>
              <td>
                Public validation reports; live end-to-end demos; replay/freshness validation results;
                revocation/rotation enforcement metrics; policy-deny correctness metrics; hardened release
                artifacts published; deployment readiness checklist completed
              </td>
              <td>Apr 30, 2027 (M9)</td>
            </tr>
          </tbody>
        </table>

        <h4>Tier 2 (expanded scope)</h4>
        <table className="kpi kpi-milestones">
          <thead>
            <tr>
              <th>#</th>
              <th>Deliverable</th>
              <th>Verification</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">4</td>
              <td>
                One external Wave-1 ecosystem integration; interoperability validation report; integration
                engineering support; deployment hardening and operational rollout support
              </td>
              <td>
                Public integration deployment; interoperability findings published; integration and
                deployment documentation; operational interoperability validation report
              </td>
              <td>Jul 31, 2027 (M12)</td>
            </tr>
          </tbody>
        </table>

        <h3 id="approach-budget">3.3 Budget</h3>
        <h4>Tier 1 — Engineering and deployment</h4>
        <p>
          The overall proposal spans a 12-month delivery cycle (Jul 2026 → Jul 2027). Tier 1&rsquo;s $265k
          funds the core infrastructure phase through Milestone 9 (Jul 2026 → Apr 2027).
        </p>
        <p>
          From M1 to M9, the focus is a deliverable-heavy build phase: Approximately 12 person-months of
          senior engineering and project management at a blended $18,750/month across two co-leads:
        </p>
        <ul>
          <li>
            <a href="https://ens.app/estmcmxci.eth">estmcmxci.eth</a>: ENS architecture, spec design, and
            ecosystem integration
          </li>
          <li>
            <a href="https://ens.app/mouz.eth">mouz.eth</a>: protocol architecture, smart-contract
            implementation and security engineering
          </li>
        </ul>
        <table className="kpi">
          <thead>
            <tr>
              <th>Line item</th>
              <th>Amount</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">Onchain engineering and contract deployment</td>
              <td>$140,000</td>
              <td>
                Contract implementation, integration with ENSv2 access-control substrate
                (EnhancedAccessControl, HCAContextUpgradeable), deployment, and reference deployment
                artifacts for the verification and resolver infrastructure (Verifier + AuthResolver)
              </td>
            </tr>
            <tr>
              <td className="dim-label">SDK and verifier tooling</td>
              <td>$55,000</td>
              <td>TypeScript SDK, developer tooling, reason-code taxonomy, conformance harness</td>
            </tr>
            <tr>
              <td className="dim-label">Documentation and developer relations</td>
              <td>$15,000</td>
              <td>Spec refinement, integration guides, public references</td>
            </tr>
            <tr>
              <td className="dim-label">Project management and reporting</td>
              <td>$15,000</td>
              <td>Quarterly status updates, milestone tracking, committee reporting</td>
            </tr>
            <tr>
              <td className="dim-label">Core security review</td>
              <td>$40,000</td>
              <td>Targeted third-party review, lifecycle/auth analysis, threat-model validation</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="kpi-subtotal">
              <td className="dim-label">Tier 1 Total</td>
              <td>$265,000</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <h4>Tier 2 — Ecosystem Validation / Integration Expansion</h4>
        <p>
          From M9 to M12, the focus shifts to ecosystem validation and operational support. The $175K Tier
          2 scope funds Wave-1 integration, deployment support, interoperability validation, documentation
          refinement, hotfix capacity, and quarterly committee reporting.
        </p>
        <table className="kpi">
          <thead>
            <tr>
              <th>Line item</th>
              <th>Amount</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">Wave-1 ecosystem validation</td>
              <td>$65,000</td>
              <td>
                Wave-1 ecosystem validation across early MARP environments — reference integrations,
                interoperability testing, deployment support, and integration reports validating the
                architecture under operating conditions
              </td>
            </tr>
            <tr>
              <td className="dim-label">Expanded security review and operational hardening</td>
              <td>$65,000</td>
              <td>
                Broader production audit scope, interoperability review, deployment hardening, operational
                testing
              </td>
            </tr>
            <tr>
              <td className="dim-label">Developer outreach &amp; partner onboarding</td>
              <td>$15,000</td>
              <td>
                Developer-facing enablement and partner activation for MARP adoption: integration tutorials
                and sample apps on top of the SDK; integrator office hours and onboarding support; partner
                onboarding through the Pinata Agents Partner Templates program (OpenClaw, Hermes); a public
                adoption dashboard (onchain agent-subname issuance + active-authority counts); and quarterly
                ENS Forum reporting of integration progress.
              </td>
            </tr>
            <tr>
              <td className="dim-label">Documentation</td>
              <td>$15,000</td>
              <td>Integration guides, deployment documentation, public references</td>
            </tr>
            <tr>
              <td className="dim-label">Project management and reporting</td>
              <td>$15,000</td>
              <td>Quarterly status updates, milestone tracking, committee reporting</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="kpi-subtotal">
              <td className="dim-label">Tier 2 Total</td>
              <td>$175,000</td>
              <td></td>
            </tr>
            <tr className="kpi-total">
              <td className="dim-label">Combined Full Expansion</td>
              <td>$440,000</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <h3 id="approach-counterfactual">3.4 Counterfactual</h3>
        <p>
          Agent authorization resolution is a real integration gap today. Without a standardized,
          resolver-native, neutral authorization-and-verification layer, ENS has a weaker value-fit for the
          next operator class — a class likely to mediate a growing share of agentic commerce.
        </p>
        <p>
          That gap is a standing opportunity cost, and it compounds as enterprise alternatives like
          Microsoft Entra Agent ID move into agent identity and authorization infrastructure.
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-entra"></label>
          <input type="checkbox" id="sn-entra" className="sidenote-toggle" />
          <span className="sidenote">
            <strong><a href="https://learn.microsoft.com/en-us/entra/agent-id">Microsoft Entra Agent ID</a>.</strong> Introduced in preview at Microsoft Build 2025, it
            extends Entra (formerly Azure AD) — Microsoft&rsquo;s enterprise identity platform — to AI
            agents, giving AI agents first-class enterprise identities with lifecycle management, access
            governance, and conditional-access controls. It
            answers the same identity-and-authorization question this proposal does, but inside a closed,
            tenant-bound vendor directory rather than a neutral, externally resolvable namespace — the
            proprietary control plane this section warns about.
          </span>
        </p>
        <p>
          The question is not whether ENS must become trust infrastructure; closed vendor stacks can and
          will fill the gap. The strategic question is whether the authority layer for agentic commerce
          remains open, interoperable, and credibly neutral — or consolidates into proprietary control
          planes.
        </p>
        <p>
          The next 12–24 months are a formative period for cross-vendor agent-identity patterns. If ENS does
          not ship an open substrate in that window, adoption is more likely to fragment into
          runtime-specific implementations, with ENS retained primarily for naming while authority and trust
          functions consolidate elsewhere — effectively a Web2 SSO redux for the agent economy.
        </p>
        <p>
          The substrate to build it is already in place — EIP-7951 shipped in Fusaka, ENSIP-25/26 merged,
          ERC-8004 on mainnet, ENSv2 in preview — foundational primitives exist; the authorization layer does not, so the binding constraint is delivery, not readiness.
        </p>
        <p>
          The decision is asymmetrical: a bounded one-cycle cost ($440k) against both measurable and
          strategic upside. Even the narrow, conservative conversion model (~$400k–$580k in registration and
          renewal fees over five years, <a href="#problem-revenue">§2.2</a>) reaches a scale comparable to the grant itself.
        </p>
        <p>
          And that likely understates the opportunity cost, which is strategic: the entire agent-identity
          category, a 480K+ agent population growing monthly, and ENS&rsquo;s standing as the neutral
          authority layer for an expanding agent-operator surface — all ceded to closed vendors, with high
          switching costs, once the window closes.
        </p>
        <p>
          This outcome is unlikely to self-correct by default. ENS Labs is staffed against core protocol
          delivery (ENSv2, agent ENSIPs), while individual MARPs are structurally incentivized to build
          closed, vendor-local paths.
        </p>
        <p>
          Steg closes that coordination gap and is positioned to maintain and evolve the substrate beyond the initial delivery
          cycle.
        </p>
      </section>

      <section id="delivery">
        <h2>4. Delivery History</h2>

        <h3>Public Goods grant — &ldquo;ENSv2 Interop Research&rdquo; (Sep 2025, 1 ETH, Stage 1 completed)</h3>
        <p>Two committed deliverables, both completed.</p>
        <ol>
          <li>
            <strong>Analysis of ENSv2 interoperability design questions</strong> — ENSIP-19 multichain primary names,
            CCIP-Read (EIP-3668), migration policies, event/API discoverability, security trade-offs —
            convened in partnership with Kernel and Nick Johnson (ENS Labs), and shipped as the{" "}
            <a href="https://discuss.ens.domains/t/universal-resolver-matrix-a-design-framework-for-heterogeneous-resolver-architecture/21734">
              Universal Resolver Matrix (URM)
            </a>
            , a reference framework for heterogeneous resolver architectures across L2s, non-EVM chains,
            DNSSEC, WebAuthn, and offchain systems (published Dec 2025).
            <p>
              Reframing ENS as a &ldquo;trust-routing system that anchors heterogeneous namespaces to
              Ethereum as the root of trust,&rdquo; URM identified the agent-authority / WebAuthn-verifier
              cell that this proposal implements: the verifier pathway that unlocks the most new namespaces
              per unit of engineering effort. This proposal is therefore a direct continuation of an
              already-completed research program, rather than a new research direction.
              The grant seeded the thesis of ENS as the verification substrate for an agent economy where{" "}
              <em>generation is abundant and independent verification of authority is scarce.</em>
            </p>
            <p></p>
          </li>
          <li>
            <strong>Authorship of the{" "}
            <a href="https://docs.steg.eth.link/specifications/webauthn-specification/">
              WebAuthn-for-ENS specification
            </a></strong>{" "}
            (the passkey-signer resolution layer for ENS-bound agents) — a productionizable design for the
            agent-authority / WebAuthn-verifier cell identified by URM, which Milestone 1 of this proposal
            adapts to the AuthResolver + Verifier scope on ENSv2. The grant was completed and fully disbursed
            (1 ETH). Grant record at{" "}
            <a href="https://builder.ensgrants.xyz">builder.ensgrants.xyz</a> (grantee: fundamentalia.eth,
            submitter&rsquo;s prior ENS identity);{" "}
            <a href="https://discuss.ens.domains/t/ens-research-namechain-ensip-19-multichain-interop/21392">
              research thread
            </a>
            .
          </li>
        </ol>

        <h3>Upstream contribution to canonical ENS contracts (Jan 2026, unfunded)</h3>
        <p>
          Replaced software-implemented EllipticCurve verification with the EIP-7951 P-256 precompile in
          ENS&rsquo;s DNSSEC oracle (Algorithm 13). Merged into ensdomains/ens-contracts as{" "}
          <a href="https://github.com/ensdomains/ens-contracts/pull/509">PR #509</a> by Makoto Inoue (ENS
          Labs) on 26 January 2026; shipped to production in the{" "}
          <a href="https://github.com/ensdomains/ens-contracts/releases/tag/v1.7.0">v1.7.0 release</a> on 13
          March 2026.
        </p>
        <p>
          Adds P256Precompile.sol following the ModexpPrecompile pattern, switches P256SHA256Algorithm to
          call the precompile at 0x100, and removes the EllipticCurve dependency — ~98% gas reduction
          (~200k+ gas → ~3,500 gas per verification) for ENS-side DNSSEC validation.
        </p>
        <p>
          The V1 Verifier directly builds on this work, consuming the same EIP-7951 P-256 precompile
          introduced into ENS&rsquo;s canonical contracts by this contribution.
        </p>
        <p>Other prior work.</p>
        <ul>
          <li>
            <a href="https://discuss.ens.domains/t/reference-implementation-of-an-ens-bound-agent/22100">
              <strong>Reference implementation of ENS-bound agent identity</strong>
            </a>
            <strong>.</strong> An award-winning five-layer Trust Resolution Layer (TRL) composing ENSIP-25,
            ENSIP-26, and ERC-8004 —{" "}
            <a href="https://github.com/estmcmxci/synthesis">shipped as four MIT-licensed TypeScript packages</a>{" "}
            and{" "}
            <a href="https://estmcmxci.co/agent/emilemarcelagustin.eth">a live ENS-bound agent deployment</a>
          </li>
          <li>
            <a href="https://nccoe.emilemarcelagustin.eth.link">
              <strong>ENS as a Naming Layer for AI Agent Identity</strong>
            </a>
            . A position paper submitted to NIST NCCoE describing the ENS agent identity architecture: a
            7-layer stack showing what is production today (ENS, ENSIP-24/25, on.eth) and what is draft
            (ENSIP-26, NMS, AIP), for naming, discovery, verification, and evolution of AI agent identities.
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=e_QBTQGMxPs">
              <strong>Public conference talk — Use Cases for the P256 Precompile (Devcon SEA, Nov 2024)</strong>
            </a>
            . ~8 minute talk pitching universal ENS-as-login across Web2 surfaces with the L1 P-256
            precompile as the load-bearing technical unlock — the same problem space the WebAuthn-for-ENS
            specification formalizes and PR #509 makes real.
          </li>
          <li>
            <a href="https://synthesis.mandate.md/tracks/ens-identity-i4jgf3">
              <strong>Synthesis Hackathon, 1st Place, ENS Identity track (May 2026)</strong>
            </a>
            .{" "}
            <a href="https://synthesis.mandate.md/projects/trust-resolution-layer-b67a">
              Trust Resolution Layer
            </a>{" "}
            judged best-in-track on its ENS identity merits.
          </li>
          <li>
            <a href="https://ethglobal.com/showcase/oikonomos-w6z57">
              <strong>ETHGlobal HackMoney 2026, Finalist + Integrate ENS bounty winner (February, 2026)</strong>
            </a>
            . &ldquo;Oikonomos,&rdquo; a separate Steg-authored ENS integration, named Finalist
            (top-of-hackathon across all sponsor tracks) and won an ENS bounty.
          </li>
        </ul>
      </section>

      <section id="foundation">
        <h2>5. Technical Foundation</h2>

        <h4>Four-claim architecture.</h4>
        <p>
          The authority payload has four properties, each mapped to concrete contracts and ENSv2 substrate
          primitives:
        </p>
        <ol>
          <li>
            <strong>Permissions</strong> live in AuthResolver record schemas (credential, capability,
            revocation) and Verifier dispatch logic.
          </li>
          <li>
            <strong>Freshness checks</strong> are enforced by the Verifier resolving current authorization state published through AuthResolver at
            lookup time.
          </li>
          <li>
            <strong>External resolution</strong> follows from implementing AuthResolver as a standard ENS
            resolver (UUPS proxies via VerifiableFactory), allowing any client to resolve authorization state
            without intermediary infrastructure.
          </li>
          <li>
            <strong>Operator parent-name write authority</strong> is enforced by ENSv2&rsquo;s existing EAC +
            HCA substrate, which scopes write permissions to the parent-name owner and atomically invalidates
            delegated roles on name transfer.
          </li>
        </ol>

        <h4>Architectural precedent.</h4>
        <p>The technical foundation builds on two prior artifacts:</p>
        <ol>
          <li>
            <strong>
              Verification semantics precedent (
              <a href="https://docs.steg.eth.link/specifications/webauthn-specification/">
                WebAuthn-for-ENS specification
              </a>
              , <a href="#delivery">§4</a>)
            </strong>{" "}
            — The specification defines the WebAuthn/P-256 verification path this proposal inherits, and
          </li>
          <li>
            <strong>
              Deployed-topology precedent (
              <a href="https://dnssec.eketc.co/tld-oracle">Sepolia TLD Oracle</a>)
            </strong>{" "}
            — TLDMinter + DnssecP256Verifier deployment demonstrating the orchestrator/stateless-verifier
            contract split.
          </li>
        </ol>
        <p>
          Accordingly, v1 includes a shared Verifier supporting three signing schemes: EIP-7951 P-256
          (WebAuthn/passkey), ecrecover (secp256k1 ECDSA), and EIP-1271 staticcall (smart-account
          signatures).
        </p>
        <p>
          Authority records are published through AuthResolverImpl with per-name UUPS proxies via
          VerifiableFactory.
        </p>
        <p>
          AuthResolverImpl inherits ENSv2&rsquo;s access-control substrate (EAC + HCA) unchanged, preserving
          per-(node, recordKey) write delegation and atomic role invalidation on name transfer. The new
          audit surface is bound to Verifier dispatch logic and AuthResolver record schemas; ENS Registry and
          existing resolver implementations are unchanged.
        </p>
        <p>
          Because AuthResolver lookups are L1-native ENS resolutions, the verification path inherits
          ENS&rsquo;s availability and censorship-resistance properties — no separate uptime SLA, no DNS
          dependency, no centralized API in the trust path between a counterparty and the authorization state it
          reads.
        </p>
        <p>
          This preserves the proposal&rsquo;s core property: any counterparty can independently verify
          current authorization state using standard ENS resolution alone.
        </p>
        <p>
          A counterparty&rsquo;s authority-validity check therefore shares the same trust assumptions as
          standard ENS resolution. Counterparties do not need prior relationships, synchronized databases,
          or vendor-specific APIs; standard ENS resolution is sufficient.
        </p>
        <p>
          This scope reuses the orchestrator-plus-stateless-verifier topology already exercised by
          Steg&rsquo;s <a href="https://dnssec.eketc.co/tld-oracle">TLD Oracle</a>, a testnet system that
          fetches DNSSEC proofs offchain and verifies them onchain via a two-contract split: a TLDMinter
          orchestrator (
          <a href="https://sepolia.etherscan.io/address/0x48729B7e0bA736123a57c4B6A492BDAbedAF980F">
            0x4872…980F
          </a>
          ) handling timelocked claim processing, and a stateless DnssecP256Verifier (
          <a href="https://sepolia.etherscan.io/address/0x580F2Db4Da8E6D5c654aa604182D0dFD17D5766B">
            0x580F…766B
          </a>
          ) consuming the EIP-7951 P-256 precompile via the P256SHA256Algorithm contract integrated into
          ENS&rsquo;s canonical contracts by{" "}
          <a href="https://github.com/ensdomains/ens-contracts/pull/509">PR #509</a>.
        </p>
        <p>
          The proposed scope swaps the proof/signature inputs (DNSSEC RRSIG → WebAuthn assertions, ecrecover,
          EIP-1271) and adds per-name UUPS proxies via VerifiableFactory, while preserving the same deployed
          contract separation.
        </p>

        <h4>Non-goals.</h4>
        <p>
          This proposal does not deliver wire-protocol authentication (MCP, A2A, which answer &ldquo;did the
          client present valid credentials&rdquo;) or on-chain delegated execution (ERC-4337 session keys,
          which execute scoped permissions onchain). It does not replace capability-token systems (UCAN,
          CACAO, which prove delegated authority at signing time).
        </p>

        <h4>How it composes.</h4>
        <p>
          The Verifier + AuthResolver layer sits above naming and discovery (ENSIP-25/26/64) and registry
          (ERC-8004), and composes with these non-goal layers at the relying-party boundary: a calling
          service resolves AuthResolver state to decide <em>whether to honor</em> an MCP/A2A request; a
          counterparty checks AuthResolver state before accepting an ERC-4337 or ERC-7710/7715-delegated
          session-key signature as currently authorized; capability-token presenters (UCAN, CACAO) are
          verified <em>against current ENS-published authority</em> rather than against frozen issuance-time
          state.
        </p>
        <p>
          The toolkit&rsquo;s role is to provide the authority-validity check the other layers don&rsquo;t natively
          provide (
          <a href="https://docs.google.com/document/d/1jbIRc5OGImfEI5TAb23FZy0wbDwTDiL2xmcAYtf9F98/edit?usp=sharing">
            see Appendix B
          </a>
          ).
          <br />
          Full architectural map + normative detail in the prototype specification (working copy:{" "}
          <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing">
            Prototype Spec
          </a>
          ) and the{" "}
          <a href="https://docs.google.com/document/d/1zN0Dp9Tm7JCoLb-QYbigZuiB8O9vB7cEr6Pu96ewJRQ/edit?usp=sharing">
            MAIP taxonomy
          </a>
          ; substrate-inheritance excerpt in{" "}
          <a href="https://docs.google.com/document/d/1yWRHaizZyDx6RGK-WIH0qhQE4U4rUTP8p6GdKHgLpog/edit?usp=sharing">
            Appendix E
          </a>
          .
        </p>
      </section>

      <section id="conclusion">
        <h2>6. Conclusion</h2>
        <p>
          This proposal delivers a defined, narrowly scoped service: ENS-native authority and verification
          infrastructure for apps, APIs, relying services, managed agent runtimes and other emerging operator
          environments that need to verify whether an ENS-named agent is currently authorized for a specific
          action.
        </p>
        <p>
          It is built on existing ENS standards and executed through verifiable milestones over a 12-month
          cycle. The proposal is additive to ENS Labs and does not replace existing ENS primitives. It
          operationalizes ENS as an interoperable authorization lookup surface, allowing any counterparty to independently verify current authorization state
          across heterogeneous systems.
        </p>
        <p>
          It extends a proven ENS growth path (operator-issued subnames, as demonstrated by Coinbase&rsquo;s
          cb.id integration) to the next operator class. Following that same adoption pattern, this proposal
          upgrades the payload from identity-only signaling to authority-bearing state, while keeping the
          trust path open: L1-native, resolvable, adoptable, and forkable, with no vendor in the middle.
        </p>
        <p>
          As agentic commerce scales, the authority tier will consolidate somewhere — either in open, neutral
          infrastructure or closed vendor control planes. This proposal builds the open substrate and
          validates its adoption in production.
        </p>
      </section>

      <section id="compliance">
        <h2>7. Compliance &amp; Attestations</h2>
        <ul>
          <li>
            <strong>Licensing</strong>: All Recipient-Developed Materials shipped under this proposal will be
            licensed under the MIT License per Program Terms clause 8.1 (consistent with the
            repository&rsquo;s existing LICENSE). Documentation, integration guides, and the prototype
            specification will be licensed under CC BY-SA 4.0 per clause 8.2. Steg anticipates no Mandated
            Copyleft Dependency at the date of application.
          </li>
          <li>
            <strong>Material relationships:</strong> Steg confirms no active conflict of interest with any
            ENS DAO member, ENS Labs employee, or other SPP3 applicant. All operational and vendor
            relationships material to the proposal are disclosed in the body (<a href="#problem">§2</a>,{" "}
            <a href="#delivery">§4</a>).
          </li>
          <li>
            <strong>Approved Wallet</strong>: Upon issuance of the Award Notice and prior to disbursement,
            Steg will designate a project-dedicated Safe multisig with a 2-of-3 signer structure consisting
            of estmcmxci.eth, mouz.eth, and vault.steg.eth, a dedicated subname jointly governed by both
            co-leads, for signing redundancy — as the Approved Wallet under clause 5.8. Service Fees will be
            held in and disbursed from this wallet exclusively, with no commingling with personal or unrelated
            working capital.
          </li>
          <li>
            <strong>Reporting cadence</strong>: Steg commits to the dual quarterly reporting cadence under
            clause 6.3: a detailed private report to the Foundation within 30 days of each quarter&rsquo;s
            end, and a public ENS Forum summary within the same window. This complements the milestone
            verification cadence already described in <a href="#approach-milestones">§3.2</a>.
          </li>
        </ul>
      </section>

      <footer className="footer-nav">
        Steg · <a href="https://steg.eth.link">steg.eth.link</a> ·{" "}
        <a href="https://docs.steg.eth.link">docs</a> ·{" "}
        <a href="https://github.com/steg-eth">github</a>
      </footer>
    </article>
  )
}
