export interface LandingCopy {
  nav: {
    features: string;
    how: string;
    docs: string;
    login: string;
    register: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    btn: string;
    btn2: string;
    trust: string;
  };
  mock: {
    balance: string;
    income: string;
    expense: string;
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
    desc: string;
    links: {
      title: string;
      items: {
        label: string;
        href: string;
      }[];
    }[];
    bottom: string;
  };
}
