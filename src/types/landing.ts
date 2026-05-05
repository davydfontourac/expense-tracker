export interface LandingCopy {
  nav: {
    features: string;
    how: string;
    docs: string;
    login: string;
    register: string;
    github: string;
    signin: string;
    cta: string;
    faq?: string;
  };
  hero: {
    badge: string;
    title?: string;
    titleAccent?: string;
    h1a: string;
    h1b: string;
    subtitle?: string;
    sub: string;
    btn: string;
    btn2: string;
    trust: string;
    cta: string;
    cta2: string;
  };
  mock: {
    balance: string;
    income: string;
    expense: string;
    months: string[];
    sidebar: {
      general: string;
      dashboard: string;
      transactions: string;
      categories: string;
      savings: string;
      analysis: string;
      reports: string;
      goals: string;
      insights: string;
      activeFilter: string;
      october: string;
    };
    header: {
      greeting: string;
      spent: string;
      ofRevenue: string;
      inApril: string;
      april2026: string;
      all: string;
      new: string;
      target: string;
      completed: string;
    };
    kpis: {
      available: string;
      balance: string;
      income: string;
      thisMonth: string;
      expenses: string;
      vsLastMonth: string;
    };
    charts: {
      monthlyTitle: string;
      monthlySub: string;
      janDez: string;
      income: string;
      expenses: string;
      distTitle: string;
      spent: string;
    };
    tabs: {
      transactions: any[];
      categories: any[];
      savings: any[];
    };
  };
  problems: {
    kicker: string;
    title: string;
    items: {
      t: string;
      d: string;
    }[];
  };
  features: {
    kicker: string;
    title: string;
    items: {
      tag: string;
      t: string;
      d: string;
    }[];
  };
  how: {
    kicker: string;
    title: string;
    steps: {
      n: string;
      t: string;
      d: string;
    }[];
  };
  cta: {
    title: string;
    sub: string;
    btn: string;
    btn2: string;
  };
  footer: {
    desc?: string;
    tag: string;
    product: string;
    company: string;
    resources: string;
    links: {
      product: string[][];
      company: string[][];
      resources: string[][];
    };
    bottom?: string;
    rights: string;
  };
  visuals?: any;
}
