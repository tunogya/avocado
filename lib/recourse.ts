export type RecourseLocale = "en" | "zh";

export type RecourseResource = {
  type: string;
  title: string;
  description: string;
  readTime: string;
  href: string;
};

export type RecourseCopy = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    brand: string;
    ariaLabel: string;
    home: string;
    news: string;
    recourse: string;
    login: string;
    language: string;
    english: string;
    chinese: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    searchButton: string;
  };
  filters: string[];
  featured: {
    eyebrow: string;
    title: string;
    items: RecourseResource[];
  };
  library: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
    action: string;
  };
  resources: {
    eyebrow: string;
    title: string;
    items: RecourseResource[];
  };
  subscribe: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  };
  actions: {
    read: string;
  };
};

export const recourseContent: Record<RecourseLocale, RecourseCopy> = {
  en: {
    meta: {
      title: "Recourse | Carbon Ledger",
      description:
        "Practical guides, market briefings and procurement playbooks to help teams close clean-energy transactions faster."
    },
    nav: {
      brand: "Carbon Ledger",
      ariaLabel: "Main navigation",
      home: "Home",
      news: "News",
      recourse: "Recourse",
      login: "Log in",
      language: "Language",
      english: "EN",
      chinese: "中文"
    },
    hero: {
      eyebrow: "Resource Center",
      title: "Recourse Hub",
      description:
        "Reference materials inspired by modern energy marketplaces: market intelligence, transaction templates and implementation guides in one place.",
      searchPlaceholder: "Search by topic, market or document type",
      searchButton: "Search"
    },
    filters: [
      "All",
      "PPA Pricing",
      "Procurement Playbooks",
      "Market Reports",
      "Webinars",
      "Case Studies"
    ],
    featured: {
      eyebrow: "Featured",
      title: "Start with these high-impact resources",
      items: [
        {
          type: "Playbook",
          title: "Corporate PPA Evaluation Framework",
          description:
            "A practical framework to compare risk allocation, shaping costs and contract flexibility across shortlists.",
          readTime: "12 min read",
          href: "#"
        },
        {
          type: "Market Brief",
          title: "Q1 Renewable Pricing Pulse",
          description:
            "Snapshot of forward curves, basis risk signals and market liquidity across major procurement regions.",
          readTime: "8 min read",
          href: "#"
        }
      ]
    },
    library: {
      eyebrow: "Library",
      title: "Sourcing to signature, in one place",
      description:
        "Use reusable checklists, model assumptions and stakeholder templates to shorten every transaction cycle.",
      highlights: [
        "RFP scope templates",
        "Credit review checklist",
        "Term-sheet comparison deck",
        "Stakeholder update memo"
      ],
      action: "Browse Full Library"
    },
    resources: {
      eyebrow: "Latest",
      title: "Recent recourse updates",
      items: [
        {
          type: "Checklist",
          title: "Pre-LOI Diligence Checklist",
          description:
            "A ready-to-run checklist for technical, commercial and credit diligence before signing an LOI.",
          readTime: "10 min read",
          href: "#"
        },
        {
          type: "Guide",
          title: "How to Scope an RFP in 2 Weeks",
          description:
            "Scope definition templates and timelines to launch multi-market RFPs with clear evaluation criteria.",
          readTime: "9 min read",
          href: "#"
        },
        {
          type: "Template",
          title: "Bid Comparison Matrix",
          description:
            "A normalized matrix for comparing term sheets, commercial assumptions and optionality.",
          readTime: "6 min read",
          href: "#"
        },
        {
          type: "Webinar",
          title: "Negotiating Volume Flex and Shape",
          description:
            "Expert walkthrough on structuring flexibility clauses without losing bankability.",
          readTime: "45 min watch",
          href: "#"
        },
        {
          type: "Case Study",
          title: "Portfolio Procurement Across 4 Markets",
          description:
            "How one buyer standardized governance and reduced cycle time by 31% across a multi-market portfolio.",
          readTime: "7 min read",
          href: "#"
        },
        {
          type: "Report",
          title: "Bankability Trends for 2026",
          description:
            "A concise report on curtailment clauses, merchant tails and counterparty expectations in current deals.",
          readTime: "11 min read",
          href: "#"
        }
      ]
    },
    subscribe: {
      eyebrow: "Stay Current",
      title: "Get monthly recourse updates",
      description:
        "Receive one digest with the latest procurement insights, transaction templates and market briefs.",
      action: "Subscribe"
    },
    actions: {
      read: "Read"
    }
  },
  zh: {
    meta: {
      title: "资源中心 | Carbon Ledger",
      description:
        "聚合实操指南、市场简报与采购模板，帮助团队更快完成清洁能源交易。"
    },
    nav: {
      brand: "Carbon Ledger",
      ariaLabel: "主导航",
      home: "首页",
      news: "新闻",
      recourse: "资源",
      login: "登录",
      language: "语言",
      english: "EN",
      chinese: "中文"
    },
    hero: {
      eyebrow: "资源中心",
      title: "资源中心",
      description:
        "参考主流能源平台的内容结构，集中提供市场情报、交易模板与执行指南，支持团队快速落地交易。",
      searchPlaceholder: "按主题、市场或文档类型搜索",
      searchButton: "搜索"
    },
    filters: [
      "全部",
      "PPA 定价",
      "采购打法",
      "市场报告",
      "网络研讨会",
      "案例研究"
    ],
    featured: {
      eyebrow: "精选",
      title: "先看这些高价值内容",
      items: [
        {
          type: "实操手册",
          title: "企业 PPA 评估框架",
          description:
            "用于横向比较风险分配、曲线成本和合同灵活性的标准框架。",
          readTime: "阅读 12 分钟",
          href: "#"
        },
        {
          type: "市场简报",
          title: "一季度可再生能源定价脉搏",
          description:
            "快速掌握主要市场的远期曲线、基差风险信号与交易流动性。",
          readTime: "阅读 8 分钟",
          href: "#"
        }
      ]
    },
    library: {
      eyebrow: "资料库",
      title: "从寻源到签约的一站式资料库",
      description:
        "复用清单、模型假设和跨团队模板，持续缩短每一轮交易周期。",
      highlights: [
        "RFP 范围模板",
        "信用审查清单",
        "条款对比模板",
        "内部汇报模板"
      ],
      action: "浏览完整资源库"
    },
    resources: {
      eyebrow: "最新",
      title: "近期更新",
      items: [
        {
          type: "检查清单",
          title: "LOI 前尽调检查清单",
          description:
            "覆盖技术、商务与信用维度，帮助团队在签署 LOI 前完成关键核验。",
          readTime: "阅读 10 分钟",
          href: "#"
        },
        {
          type: "指南",
          title: "两周内定义 RFP 范围",
          description:
            "提供范围定义模板与时间表，支持跨市场 RFP 快速启动。",
          readTime: "阅读 9 分钟",
          href: "#"
        },
        {
          type: "模板",
          title: "报价对比矩阵",
          description:
            "标准化对比条款清单、商业假设与可选项，提升评审一致性。",
          readTime: "阅读 6 分钟",
          href: "#"
        },
        {
          type: "网络研讨会",
          title: "交易量与曲线条款谈判",
          description:
            "专家拆解如何在可融资性前提下设计灵活性条款。",
          readTime: "观看 45 分钟",
          href: "#"
        },
        {
          type: "案例",
          title: "覆盖四个市场的组合采购",
          description:
            "某买方如何统一治理机制，并将交易周期缩短 31%。",
          readTime: "阅读 7 分钟",
          href: "#"
        },
        {
          type: "报告",
          title: "2026 年可融资性趋势",
          description:
            "聚焦限电条款、商电尾部风险与交易对手方偏好变化。",
          readTime: "阅读 11 分钟",
          href: "#"
        }
      ]
    },
    subscribe: {
      eyebrow: "保持更新",
      title: "订阅每月资源更新",
      description:
        "每月一封，集中推送最新采购洞察、交易模板与市场简报。",
      action: "立即订阅"
    },
    actions: {
      read: "查看"
    }
  }
};
