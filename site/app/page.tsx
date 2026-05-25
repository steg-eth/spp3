export default function Spp3DossierPage() {
  return (
    <article>
      <header>
        <h1>Application Dossier</h1>
        <p className="meta">
          Live application dossier for the ENS Service Provider Program (Term 3).
          Submission repo:{" "}
          <a href="https://github.com/steg-eth/spp3">github.com/steg-eth/spp3</a> ·
          Author: <a href="https://app.ens.domains/estmcmxci.eth">estmcmxci.eth</a>
        </p>
      </header>

      <nav className="toc" aria-label="Table of contents">
        <h2>Contents</h2>
        <ol>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#architecture">Architecture and scope</a></li>
          <li><a href="#wedge">Why MARPs are the wedge</a></li>
          <li>
            <a href="#proposal">Proposal</a>
            <ol>
              <li><a href="#proposal-ship">What we ship</a></li>
              <li><a href="#proposal-not">What this is NOT</a></li>
              <li><a href="#proposal-tiered">Tiered request</a></li>
            </ol>
          </li>
          <li>
            <a href="#roadmap">Live roadmap</a>
            <ol>
              <li><a href="#roadmap-status">Milestones</a></li>
              <li><a href="#roadmap-kpis">KPIs</a></li>
            </ol>
          </li>
          <li>
            <a href="#evidence">Evidence</a>
            <ol>
              <li><a href="#evidence-index">Index</a></li>
              <li><a href="#evidence-faq">FAQ / committee objections</a></li>
            </ol>
          </li>
          <li><a href="#changelog">Updates / changelog</a></li>
        </ol>
      </nav>

      <section id="overview">
        <h2>Overview</h2>
        <p>
          AI agents are increasingly taking actions across apps, APIs, and hosted runtimes — but no
          outside service can verify, in real time, that an agent-signed action came from a credential the
          operator currently authorizes. Authorization lives in vendor-specific systems. <strong>There's no shared
          substrate for rotation, revocation, or audit.</strong>
        </p>
        <p>
          ENS already provides the naming, discovery, and registry primitives. What it doesn't yet have, on top of those primitives, is an ENS-keyed authority-policy
          lookup layer: a resolver-level surface that lets any service confirm a signed action came from a
          currently-authorized credential under an ENS name, and that the credential hasn't been rotated,
          expired, or revoked.
        </p>
        <p>The work detailed in this dossier fills that gap.</p>

        <div className="callout">
          <div className="callout-label">Counterfactual</div>
          <p>
            The counterfactual to SPP3 funding is not "no work happens." The framework and the <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing">spec</a> are
            already public. The counterfactual is <em>the work ships as single-runtime tooling by a single
            team, with no conformance surface and no public reference for other integrators, on a 24–36 month
            part-time arc</em> — by which point vendor MAIPs (Microsoft Entra Agent ID, currently in preview)
            will have defined the cross-vendor verification pattern for the category, and operator-archetype
            MARPs that would otherwise adopt the open-MAIP pattern will have defaulted to vendor or
            platform-internal alternatives. The 12-month window matters because the category is locking in now.
          </p>
        </div>
      </section>

      <section id="architecture">
        <h2>Architecture and scope</h2>
        <p>
          A MAIP
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-maip"></label>
          <input type="checkbox" id="sn-maip" className="sidenote-toggle" />
          <span className="sidenote">
            <strong>MAIP — Managed Agent Identity Platform.</strong> The identity substrate that MARPs,
            their agents, and counterparties resolve against. Open, vendor-neutral, indexable — in
            contrast to vendor-specific identity systems (Microsoft Entra Agent ID, AWS Bedrock Agents)
            that lock identity to a particular runtime operator.
          </span>{" "}
          is the identity substrate that MARPs
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-marp"></label>
          <input type="checkbox" id="sn-marp" className="sidenote-toggle" />
          <span className="sidenote">
            <strong>MARP — Managed Agent Runtime Platform.</strong> A hosted runtime where AI agents
            operate, with the platform handling the operational lifecycle — secret and credential
            management, scheduling, policy enforcement, durability, scaling, observability, and an
            identity surface. Both crypto-native (Pinata, Virtuals) and Web2-flavored (Anthropic
            Managed Agents) runtimes qualify.
          </span>{" "}
          and their counterparties resolve against. Where MARP names the operator class running the
          agent, MAIP names the identity layer above the runtime.
        </p>

        <p>
          A MAIP decomposes into three tiers — Display, Discovery, Authority — each answering a
          different question and decaying at a different rate.{" "}
          <strong>SPP3 funds Phase 1 / Authority tier only.</strong>
        </p>

        <table className="kpi">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Question it answers</th>
              <th>Primitives</th>
              <th>Maturity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">Display</td>
              <td>What is this agent?</td>
              <td>Identity binding, naming, profile metadata (ENSIP-25, -26, -64)</td>
              <td><span className="status status-done">mature</span></td>
            </tr>
            <tr>
              <td className="dim-label">Discovery</td>
              <td>Where do I reach it and what can it do?</td>
              <td>Service endpoints, capability descriptors, wallet pointers</td>
              <td><span className="status status-progress">uniform shipped · selective is Phase 2</span></td>
            </tr>
            <tr>
              <td className="dim-label">Authority</td>
              <td>Is this action currently authorized?</td>
              <td>Real-time capability validity, revocation, signed-freshness state (Verifier + AuthResolver)</td>
              <td><span className="status status-pending">SPP3 scope</span></td>
            </tr>
          </tbody>
        </table>

        <p>The tiers also <em>decay differently</em>, which motivates their architectural separation:</p>
        <ul>
          <li>
            <strong>Display state</strong> is mostly stable. Aliases, avatars, and identity bindings
            change rarely. Indexers can cache aggressively.
          </li>
          <li>
            <strong>Discovery state</strong> changes per deployment. Endpoints rotate, capabilities
            extend, services come online and retire. Indexers need periodic refresh.
          </li>
          <li>
            <strong>Authority state</strong> is dynamic and adversarial. Revocations must propagate
            within seconds, not hours. Caching is hostile to correctness.
          </li>
        </ul>

        <h3>Phase roadmap (longer arc than SPP3)</h3>
        <table className="kpi">
          <thead>
            <tr><th>Phase</th><th>Scope</th><th>Window</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">Phase 1</td>
              <td>Authority tier — Verifier + AuthResolver, TypeScript SDK, conformance suite, three Wave-1 pilot integrations</td>
              <td>SPP3 cycle (July 2026 – July 2027)</td>
            </tr>
            <tr>
              <td className="dim-label">Phase 2</td>
              <td>Selective discovery — caller-bound CCIP-Read prototype across four use-case clusters (compliance, anti-abuse, monetization, tier differentiation)</td>
              <td>Post-SPP3 (contingent on Phase 1 outcomes)</td>
            </tr>
            <tr>
              <td className="dim-label">Phase 3</td>
              <td>MAIP consolidation — ENSIP standardization for Authority + selective Discovery, multi-MARP production adoption, possible NIST NCCoE cross-publication</td>
              <td>Longer horizon</td>
            </tr>
          </tbody>
        </table>

        <div className="callout">
          <div className="callout-label">Scope guardrail</div>
          <p>
            This application funds the Phase 1 base ask, with an optional Phase 2 prototype budget gated
            on Phase 1 milestone progress (see <a href="#proposal-tiered">Tiered request</a>). Phase 3 is
            named here for context only — its work cannot start until Phase 1 and Phase 2 have shipped
            and accumulated in-the-wild evidence. The three-tier framing is what lets Authority ship
            independently with a defined scope and conformance surface — rather than being conflated
            with primitives at adjacent tiers (MCP/A2A wire-protocol auth, ERC-4337 session keys,
            UCAN/CACAO capability tokens, etc.).
          </p>
        </div>
      </section>

      <section id="wedge">
        <h2>Why MARPs are the wedge</h2>
        <p>
          The wedge is MARPs (Managed Agent Runtime Platforms) — Bankr Agents, Pinata Agents, Virtuals
          Protocol, ZeroDev/Kernel-backed runtimes. MARPs are where most agents
          will run in practice; integrating the AuthResolver
          <label className="sidenote-toggle sidenote-number" htmlFor="sn-authresolver"></label>
          <input type="checkbox" id="sn-authresolver" className="sidenote-toggle" />
          <span className="sidenote">
            <strong>AuthResolver.</strong> Per-name UUPS proxy on top of ENSv2&apos;s PermissionedResolver,
            holding credential / capability / revocation records. Deployed via VerifiableFactory.
            Read-side of the Authority tier — relying parties resolve it to learn what an ENS name is
            currently authorized to do.
          </span>{" "}
          at a MARP&apos;s subname-issuance layer means every signup becomes a verifiable ENS-named agent
          at deployment time.
        </p>
        <p>
          The committed floor is three Wave-1 per-agent pilots. The structural ceiling is MARP-layer
          integration.
        </p>

        <table className="kpi">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Per-agent pilot</th>
              <th>MARP-layer integration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">Registration math</td>
              <td>Linear with manual integration effort</td>
              <td>Per-platform-user — every signup is a registration</td>
            </tr>
            <tr>
              <td className="dim-label">Scale</td>
              <td>~10² registrations per pilot</td>
              <td>10⁴+ on initial integration, ramping to 10⁵+ within 12 months</td>
            </tr>
            <tr>
              <td className="dim-label">Identity surface</td>
              <td>Wallet + platform API key (no external naming)</td>
              <td>Publicly resolvable named-agent identity that travels with the user</td>
            </tr>
            <tr>
              <td className="dim-label">Authority model</td>
              <td>Vendor-database trust</td>
              <td>ENS state as independent reference — cryptographic integrity replaces vendor trust</td>
            </tr>
            <tr>
              <td className="dim-label">Counterparty reach</td>
              <td>Platform-specific integrations only</td>
              <td>
                Reachable from 8+ existing ecosystems via one integration: other MARPs, MCP/A2A servers,
                ERC-4337 / ERC-6900 smart accounts, ERC-8004 registry consumers, UCAN/CACAO relying parties,
                ENS-aware wallets/dApps, EAS-style attestation networks, compliance tooling
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Why this matters for ENS DAO</h3>
        <ol>
          <li>
            <strong>Subname issuance volume.</strong> Each MARP integration converts platform user signups
            into ENS subname registrations. A single operator-archetype MARP at production scale generates
            10⁴+ subname registrations at integration go-live, ramping toward 10⁵+ over the subsequent
            12 months — two to three orders of magnitude beyond the per-agent floor.
          </li>
          <li>
            <strong>Renewal incentive baked in.</strong> Any production agent whose ENS-bound credentials are
            in active use has direct operational incentive to renew the name, because revocation/rotation
            flow through the AuthResolver attached to that name. ENS names become operationally load-bearing
            for the agent, not decorative.
          </li>
          <li>
            <strong>First-mover dynamics.</strong> Once one MARP integrates, subsequent MARPs copy the
            pattern rather than design one. Compatibility with the first integrated MARP becomes a
            competitive feature.
          </li>
          <li>
            <strong>Architectural compatibility confirmed; end-to-end wiring is upcoming work.</strong>{" "}
            Bankr&apos;s POST <code>/wallet/sign</code> endpoint produces standard secp256k1 ECDSA
            signatures, but because Bankr wallets are EIP-7702-delegated smart accounts,{" "}
            <code>ecrecover</code> returns the underlying Privy EOA — not the wallet&apos;s onchain
            address. For agent-identity bindings rooted at the wallet address, EIP-1271{" "}
            <code>isValidSignature</code> on the delegated implementation contract is the correct
            verification path. Both ECDSA-secp256k1 and EIP-1271 are in v1 Verifier
            <label className="sidenote-toggle sidenote-number" htmlFor="sn-verifier"></label>
            <input type="checkbox" id="sn-verifier" className="sidenote-toggle" />
            <span className="sidenote">
              <strong>Verifier.</strong> Stateless dispatch contract (one shared per chain) handling
              three signature schemes in v1: WebAuthn-ES256, ECDSA-secp256k1, EIP-1271. Called by{" "}
              <code>verifyAction</code> after AuthResolver returns the name&apos;s current authority
              state.
            </span>{" "}
            scope.
          </li>
        </ol>

        <div className="callout">
          <div className="callout-label">Honest framing</div>
          <p>
            Bankr engagement is pre-commitment, not contracted. Neither the milestone structure nor the
            Wave-1 pilot floor depends on Bankr's adoption. Per-agent pilots are committed; MARP-layer
            integration is the structurally enabled outcome the toolkit is built to convert.
          </p>
        </div>
      </section>

      <section id="proposal">
        <h2>Proposal</h2>
        <p>
          Base ask: <strong>$350,000 over 12 months (July 2026 – July 2027)</strong>. Optional expanded
          tier up to <strong>~$475,000</strong>, gated on Phase 1 milestone progress — see{" "}
          <a href="#proposal-tiered">Tiered request</a> below. A toolkit delivered across four milestones.
          Full text in{" "}
          <a href="https://github.com/steg-eth/spp3/blob/main/application.md">application.md</a>; this
          dossier links to specific artifacts rather than duplicating them.
        </p>

        <h3 id="proposal-ship">What we ship</h3>
        <ul>
          <li>
            Two onchain contracts: a Verifier (one shared per chain; three signature schemes —
            WebAuthn-ES256, ECDSA-secp256k1, EIP-1271) and an AuthResolverImpl (per-name UUPS proxies via
            VerifiableFactory, holding credential / capability / revocation records).
          </li>
          <li>
            A TypeScript SDK that resolves ENS-published authorization state and verifies signed requests
            against current state.
          </li>
          <li>A conformance suite with reproducible test vectors for verifier behavior.</li>
          <li>
            Integration guides + three Wave-1 pilot integrations with hands-on engineering support.
          </li>
          <li>A third-party security audit of the Verifier and AuthResolver.</li>
        </ul>

        <h3 id="proposal-not">What this is NOT</h3>
        <p>
          A wallet, a consumer-onboarding flow, a generalized agent platform, schema-ization of ENSIP-26
          records, or a competitor to capability-token systems. Focused infrastructure service.
          <em> ENS Infrastructure</em> objective category, with <em>Outreach + Integrations</em> secondary.
        </p>

        <h3 id="proposal-tiered">Tiered request</h3>
        <p>
          The ask is structured base vs. expanded. The base is the full, scoped Phase 1 deliverable
          set — committee can fund it with confidence that nothing inside the bundle is speculative.
          The expanded tier pulls the Phase 2 prototype forward into the cycle, with the additional
          budget released at month 9 contingent on Phase 1 <strong>M2 milestones being on-track</strong>
          (<strong>SDK + conformance suite shipped, pilots scheduled</strong>).
        </p>
        <table className="kpi">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Scope</th>
              <th>Budget</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dim-label">Base</td>
              <td>
                Phase 1 — Verifier + AuthResolver, TypeScript SDK, conformance suite, three Wave-1
                pilot integrations (Pinata / Virtuals / x402), third-party security audit, ENSIP
                draft. M1 – M4.
              </td>
              <td><strong>$350,000</strong></td>
              <td><span className="status status-progress">requested</span></td>
            </tr>
            <tr>
              <td className="dim-label">Expanded</td>
              <td>
                Base + Phase 2 prototype: selective-discovery (Path B — caller-bound CCIP-Read)
                architectural design and reference implementation, with empirical evaluation against
                one of the four use-case clusters (compliance / anti-abuse / monetization / tier
                differentiation). 
              </td>
              <td><strong>~$500,000</strong></td>
              <td><span className="status status-pending">contingent</span></td>
            </tr>
          </tbody>
        </table>
        <p>
        </p>
      </section>

      <section id="roadmap">
        <h2>Live roadmap</h2>

        <h3 id="roadmap-status">Milestones</h3>
        <table className="kpi">
          <thead>
            <tr><th>Milestone</th><th>Status</th><th>Proof</th><th>Target</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>M0 — Application submitted</td>
              <td><span className="status status-done">done</span></td>
              <td><a href="https://github.com/steg-eth/spp3">repo</a></td>
              <td>2026-05-23</td>
            </tr>
            <tr>
              <td>M0.5 — AuthResolver Phase A pilot</td>
              <td><span className="status status-done">done</span></td>
              <td><a href="#">authtest.bankrtest.eth</a></td>
              <td>2026-05-21</td>
            </tr>
            <tr>
              <td>M1 — Verifier + AuthResolverImpl deployed to ENSv2 (testnet first; mainnet contingent on ENSv2 mainnet timing)</td>
              <td><span className="status status-pending">pending</span></td>
              <td>—</td>
              <td>2026-10</td>
            </tr>
            <tr>
              <td>M2 — TypeScript SDK + conformance suite</td>
              <td><span className="status status-pending">pending</span></td>
              <td>—</td>
              <td>2027-01</td>
            </tr>
            <tr>
              <td>M3 — Three Wave-1 pilot integrations (production-like) + third-party security audit</td>
              <td><span className="status status-pending">pending</span></td>
              <td>—</td>
              <td>2027-04</td>
            </tr>
            <tr>
              <td>M4 — Integration pattern docs published; ENSIP draft submitted; v1.0-final spec</td>
              <td><span className="status status-pending">pending</span></td>
              <td>—</td>
              <td>2027-07</td>
            </tr>
          </tbody>
        </table>

        <h3 id="roadmap-kpis">KPIs</h3>
        <p>
          Operational success metrics (from the application) and trajectory KPIs (in-cycle + 12 months
          forward).
        </p>
        <table className="kpi">
          <thead>
            <tr><th>Metric</th><th>Current</th><th>Target</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Revocation propagation latency</td>
              <td>—</td>
              <td>&lt; 60s</td>
              <td>app spec</td>
            </tr>
            <tr>
              <td>Replay rejection rate</td>
              <td>—</td>
              <td>≥ 99.9%</td>
              <td>conformance suite</td>
            </tr>
            <tr>
              <td>Policy-deny correctness</td>
              <td>—</td>
              <td>100%</td>
              <td>conformance suite</td>
            </tr>
            <tr>
              <td>Developer onboarding time to working basic verification</td>
              <td>—</td>
              <td>&lt; 1 day</td>
              <td>SDK + docs</td>
            </tr>
            <tr>
              <td>Wave-1 pilot integrations live (production-like)</td>
              <td>0</td>
              <td>3</td>
              <td>M3</td>
            </tr>
            <tr>
              <td>Operator-archetype MARP integrated at subname-issuance layer</td>
              <td>0</td>
              <td>≥ 1</td>
              <td>M4 + 12mo</td>
            </tr>
            <tr>
              <td>ENS subnames issued via AuthResolver pattern (at M4)</td>
              <td>1</td>
              <td>10⁴+</td>
              <td>integrated MARP(s)</td>
            </tr>
            <tr>
              <td>ENS subnames issued (M4 + 12mo trajectory)</td>
              <td>—</td>
              <td>10⁵+</td>
              <td>integrated MARP(s)</td>
            </tr>
            <tr>
              <td>ENSIP draft submitted for authority-policy lookup layer</td>
              <td>no</td>
              <td>yes</td>
              <td>M4</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="evidence">
        <h2>Evidence</h2>

        <h3 id="evidence-index">Index</h3>
        <p>Catalog of artifacts the proposal references — code, transactions, posts, specs.</p>

        <h4>Spec + normative surface</h4>
        <ul>
          <li>
            Prototype Spec: Verifier + AuthResolverImpl —{" "}
            <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit">
              v1.0-draft.02
            </a>{" "}
            (frozen). 55 normative conformance criteria across §3.6 (16), §4.8 (26), §5.4 (13).
          </li>
          <li>
            Spec Brief —{" "}
            <a href="https://docs.google.com/document/d/1TSK9rq3eEY1fEY6zeNAFXFLUmtW6W3BAB7c9dVQiqi4/edit">
              Brief — Verifier + AuthResolverImpl
            </a>
          </li>
          <li>
            Context / Work Brief —{" "}
            <a href="https://docs.google.com/document/d/13Iu1qgCB9Qadaze2Z7Tetq0_F9v9mOR2pgSt8tGLnJ8/edit">
              Service Provider Program — Context
            </a>
          </li>
        </ul>

        <h4>Shipped artifacts</h4>
        <ul>
          <li>
            ERC-8004 Identity Registry (Base mainnet) —{" "}
            <a href="https://basescan.org/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432">
              0x8004A169…a432
            </a>
          </li>
          <li>
            Agent ID #19327 (Base) —{" "}
            <a href="https://basescan.org/tx/0x3ff8783a3bdb8742fa9cb300a616a43deeb57768f905c6ed7487fef67c0a23c3">
              registration tx
            </a>
          </li>
          <li>
            NameStone CCIP-Read resolver (Base) — <code>0xA87361C4E58B619c390f469B9E6F27d759715125</code>
          </li>
          <li>
            ENS x Bankr integration —{" "}
            <a href="https://github.com/BankrBot/skills/pull/189">BankrBot/skills PR #189</a>{" "}
            (<em>feat/ens-agent-identity</em>)
          </li>
        </ul>

        <h4>Timing-window proof (why now)</h4>
        <ul>
          <li>EIP-7951 (P-256 precompile) shipped in Fusaka, 2025-12-03</li>
          <li>ENSIP-25 merged</li>
          <li>ERC-8004 reached mainnet, 2026-01</li>
          <li>Microsoft Entra Agent ID in preview (vendor MAIP for the same category)</li>
        </ul>

        <h4>Bankr compatibility — primitives mapped (wiring is upcoming work)</h4>
        <ul>
          <li>
            POST <code>/wallet/sign</code> → standard secp256k1 ECDSA signatures. <code>ecrecover</code>{" "}
            returns the underlying Privy EOA, not the wallet&apos;s onchain address.
          </li>
          <li>
            Bankr wallets are EIP-7702-delegated smart accounts. Verifying against the wallet address
            itself requires EIP-1271 <code>isValidSignature</code> on the delegated implementation contract.
          </li>
          <li>
            Both ECDSA-secp256k1 and EIP-1271 are in v1 Verifier scope. End-to-end integration is
            upcoming work — primitives are mapped, contract topology is described, wiring is not yet shipped.
          </li>
        </ul>

        <h4>Context: thesis publications</h4>
        <ul>
          <li>
            <a href="https://discuss.ens.domains/t/the-next-operator-class-managed-agent-runtime-platforms/22121">
              ENS Forum — MARP thesis (operator-class framing)
            </a>
          <li>
            <a href="https://x.com/estmcmxci/status/2058930368892248102"> ENS's next growth wedge is here: Managed Agent Runtime Platforms
            </a>
          </li>
          </li>
        </ul>

        <h3 id="evidence-faq">FAQ — committee objections</h3>
        <p>Anticipated objections with the relevant evidence inline.</p>

        <div className="faq">
          <div className="faq-item">
            <h4>How is this different from MCP/A2A, ERC-4337 session keys, or capability tokens (UCAN/CACAO)?</h4>
            <p>
              Those answer different questions. Wire-protocol auth answers &quot;did the client present
              valid credentials at this connection?&quot;, not &quot;are these the credentials the
              operator currently authorizes.&quot; ERC-4337 session keys execute scoped permissions
              onchain but don&apos;t tell a relying party which keys are currently the ENS name&apos;s
              authorized ones. Capability tokens prove a delegation existed at signing time, verified
              offline — they don&apos;t reflect current state. The gap is <em>lookup</em>: an ENS-keyed
              authority-policy surface relying parties can call. That&apos;s what this proposal delivers.
            </p>
          </div>

          <div className="faq-item">
            <h4>What if Bankr doesn&apos;t adopt at the MARP-layer?</h4>
            <p>
              Neither the milestone structure nor the Wave-1 pilot floor depends on Bankr&apos;s
              adoption. Bankr engagement is pre-commitment, not contracted. Per-agent pilots are
              committed; MARP-layer integration is the structurally enabled outcome the toolkit is
              built to convert.
            </p>
          </div>

          <div className="faq-item">
            <h4>Why ENS, why now?</h4>
            <p>
              ENS already has the surrounding primitives (ENSIP-25 / -26 / -64, ERC-8004), and
              ENSv2&apos;s substrate is ready <em>today</em> (per-name resolver instances,
              EnhancedAccessControl, IDataResolver, VerifiableFactory). The 12-month window matters
              because the category is locking in now — Microsoft Entra Agent ID is already in preview
              as a vendor pattern; once that lands, the cross-vendor verification pattern defaults to
              a vendor stack rather than an open ENS one.
            </p>
          </div>

          <div className="faq-item">
            <h4>What&apos;s the proof you can ship?</h4>
            <p>
              AuthResolver Phase A pilot was built and validated end-to-end on 2026-05-21 against{" "}
              <code>authtest.bankrtest.eth</code> (publish, resolve, verify, clobber-prevention). The
              spec is frozen at v1.0-draft.02 with 55 normative conformance criteria. Prior shipped
              work includes the ENS x Bankr integration (PR #189) and ERC-8004 agent registration
              #19327 on Base mainnet.
            </p>
          </div>

          <div className="faq-item">
            <h4>How are you managing the risk of &quot;architectural beauty over proof&quot;?</h4>
            <p>
              The <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit?usp=sharing">spec</a> is composition of 12 existing standards, not new core protocol. Phase A is
              already shipped against a live test name. Each milestone has a concrete deliverable, not
              a research target. Conformance tables (§3.6, §4.8, §5.4) gate &quot;done&quot; with
              binary criteria.
            </p>
          </div>

          <div className="faq-item">
            <h4>Why is this SPP funding rather than a grant?</h4>
            <p>
              The counterfactual (above) — without SPP-funded conformance + reference work, the
              toolkit ships as single-team single-runtime tooling on a 24–36 month part-time arc, by
              which time vendor MAIPs define the cross-vendor pattern. SPP3 buys the window to publish
              a public reference and ENSIP before that locks in.
            </p>
          </div>
        </div>
      </section>

      <section id="changelog">
        <h2>Updates / changelog</h2>
        <ul>
          <li><strong>2026-05-25</strong> — Dossier site scaffolded at spp3.steg.eth.link.</li>
          <li>
            <strong>2026-05-23</strong> — Application repo{" "}
            <a href="https://github.com/steg-eth/spp3">steg-eth/spp3</a> published.
          </li>
          <li>
            <strong>2026-05-21</strong> — AuthResolver Phase A pilot built and validated end-to-end on{" "}
            <code>authtest.bankrtest.eth</code> (clobber-prevention proof passed).
          </li>
          <li>
            <strong>2026-05-18</strong> — <a href="https://docs.google.com/document/d/1L5Kj7oxT4dzlkYdYh0Sne2jx76XomT7K04P7Bu9zR-w/edit">Prototype Spec v1.0-draft.02</a> frozen and published.
          </li>
          <li>
            <strong>2026-02-24</strong> — ENS x Bankr Agent Identity integration submitted as{" "}
            <a href="https://github.com/BankrBot/skills/pull/189">BankrBot/skills PR #189</a>.
          </li>
          <li>
            <strong>2026-01-26</strong> —{" "}
            <a href="https://github.com/ensdomains/ens-contracts/pull/509">
              ens-contracts PR #509
            </a>{" "}
            merged: EIP-7951 P-256 precompile wired into ENS canonical contracts, replacing the
            software <code>EllipticCurve</code> implementation for DNSSEC Algorithm 13. Authored by
            estmcmxci.eth.
          </li>
          <li>
            <strong>2026-01</strong> — ERC-8004 reached mainnet.
          </li>
          <li>
            <strong>2025-12-03</strong> — EIP-7951 (P-256 precompile) shipped in Fusaka.
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
