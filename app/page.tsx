import Link from "next/link";

export default function Home() {
  const capabilities = [
    {
      title: "加速连接",
      description:
        "用双边市场连接买方、开发商、顾问与资金方，快速触达真实交易机会。",
    },
    {
      title: "加速决策",
      description:
        "基于实时市场数据和风险分析模型，帮助团队在投前和谈判阶段做出更稳健判断。",
    },
    {
      title: "加速成交",
      description:
        "通过标准化流程与协同工具，让 RFP、报价、尽调、签约全链路更高效。",
    },
  ];

  const buyers = [
    "横向比较多区域、多技术路线报价，不再依赖单一渠道。",
    "用统一风险视图评估价格、交付与信用条款，提升财务可解释性。",
    "将采购流程模板化，缩短内部评审和外部谈判周期。",
  ];

  const developers = [
    "集中展示项目，提高优质买方触达效率。",
    "持续接收市场反馈，优化定价和开发策略。",
    "降低销售与交易成本，把资源投入到项目推进。",
  ];

  const partners = [
    "Aether Grid",
    "NorthWind Capital",
    "BluePeak Utilities",
    "SunHarbor Renewables",
    "HelioWorks",
    "TerraFlux",
    "ArcLight Advisory",
    "VoltBridge",
    "Nexa Storage",
    "Skyline Energy",
  ];

  const faqs = [
    {
      q: "这个平台适合哪些团队？",
      a: "适用于企业买方、能源顾问、项目开发商以及参与清洁能源资产交易的投资机构。",
    },
    {
      q: "是否支持跨区域项目筛选？",
      a: "支持按国家、市场、技术路径和交易阶段多维过滤，方便快速缩小候选范围。",
    },
    {
      q: "如何控制敏感项目信息？",
      a: "支持分级权限和受邀查看机制，项目方可以决定何时、向谁披露关键资料。",
    },
  ];

  return (
    <div className="site-shell">
      <header className="top-nav">
        <div className="container nav-row">
          <Link className="brand" href="/">
            Carbon Ledger
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#">Solutions</a>
            <a href="#">Platform</a>
            <a href="#">Insights</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
          <a className="login-link" href="#">
            Log in
          </a>
        </div>
      </header>

      <main>
        <section className="hero section">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <p className="eyebrow">Transaction Infrastructure</p>
              <h1>驱动零碳能源交易的下一代基础设施</h1>
              <p className="hero-text">
                连接买方、开发商与顾问，在同一平台完成筛选、评估、协商与成交，帮助团队更快达成高质量可再生能源交易。
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#">
                  预约演示
                </a>
                <a className="btn btn-ghost" href="#">
                  浏览平台能力
                </a>
              </div>
            </div>
            <aside className="metrics-card reveal">
              <p className="card-title">Marketplace Snapshot</p>
              <ul className="metrics-list">
                <li>
                  <strong>4,800+</strong>
                  <span>可比对报价条目</span>
                </li>
                <li>
                  <strong>1,200+</strong>
                  <span>活跃项目与资产</span>
                </li>
                <li>
                  <strong>35</strong>
                  <span>覆盖市场（国家/区域）</span>
                </li>
                <li>
                  <strong>24h</strong>
                  <span>关键指标更新周期</span>
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p className="eyebrow">Core Capability</p>
            <h2>平台如何帮助你更快完成交易</h2>
            <div className="card-grid stagger">
              {capabilities.map((item) => (
                <article key={item.title} className="feature-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section trust-section">
          <div className="container">
            <p className="eyebrow">Trusted by Teams</p>
            <h2>被买方、开发商和顾问共同采用</h2>
            <div className="logo-wall stagger">
              {partners.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container audience-grid">
            <article className="audience-card">
              <p className="eyebrow">For Buyers & Advisors</p>
              <h3>面向买方与顾问</h3>
              <ul>
                {buyers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="audience-card">
              <p className="eyebrow">For Developers</p>
              <h3>面向项目开发商</h3>
              <ul>
                {developers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p className="eyebrow">Workflow</p>
            <h2>从需求到签约的标准流程</h2>
            <ol className="steps stagger">
              <li>
                <span>01</span>
                <h3>定义目标</h3>
                <p>确定采购容量、风险偏好与时间窗口。</p>
              </li>
              <li>
                <span>02</span>
                <h3>智能筛选</h3>
                <p>按市场、技术与条款快速筛选候选项目。</p>
              </li>
              <li>
                <span>03</span>
                <h3>并行尽调</h3>
                <p>在统一工作区管理报价、模型和谈判反馈。</p>
              </li>
              <li>
                <span>04</span>
                <h3>高效成交</h3>
                <p>沉淀标准化模板，缩短下一轮交易周期。</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section cta-section">
          <div className="container cta-box reveal">
            <p className="eyebrow">Act Now</p>
            <h2>让清洁能源交易更透明、更快、更可控</h2>
            <a className="btn btn-primary" href="#">
              联系销售团队
            </a>
          </div>
        </section>

        <section className="section faq-section">
          <div className="container">
            <p className="eyebrow">FAQ</p>
            <h2>常见问题</h2>
            <div className="faq-list">
              {faqs.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="brand">Carbon Ledger</p>
            <p>Build better clean-energy deals, faster.</p>
          </div>
          <div>
            <p className="footer-title">Solutions</p>
            <a href="#">Buyers</a>
            <a href="#">Developers</a>
            <a href="#">Advisors</a>
          </div>
          <div>
            <p className="footer-title">Platform</p>
            <a href="#">Marketplace</a>
            <a href="#">Analytics</a>
            <a href="#">RFP Automation</a>
          </div>
          <div>
            <p className="footer-title">Contact</p>
            <a href="mailto:hello@carbon-ledger.io">hello@carbon-ledger.io</a>
            <a href="tel:+18005551234">+1 (800) 555-1234</a>
            <span>Seattle · Madrid</span>
          </div>
        </div>
        <div className="container footer-meta">
          <small>© 2026 Carbon Ledger. All rights reserved.</small>
          <div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
