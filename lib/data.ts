export type Locale = "en" | "zh";

type LocalizedText = {
  en: string;
  zh: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  turnaround: string;
  sizes: string[];
  materials: string[];
  popular?: boolean;
  accent: string;
  stats: string[];
};

type ProductSource = {
  slug: string;
  name: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  shortDescription: LocalizedText;
  basePrice: number;
  turnaround: LocalizedText;
  sizes: LocalizedText[];
  materials: LocalizedText[];
  popular?: boolean;
  accent: string;
  stats: LocalizedText[];
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const text = (en: string, zh: string): LocalizedText => ({ en, zh });

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  zh: "中文"
};

export const navLinks = (locale: Locale) => [
  { href: "/", label: locale === "zh" ? "首页" : "Home" },
  { href: "/catalog", label: locale === "zh" ? "产品" : "Products" },
  { href: "/pricing", label: locale === "zh" ? "价格" : "Pricing" },
  { href: "/about", label: locale === "zh" ? "关于我们" : "About" },
  { href: "/order", label: locale === "zh" ? "下单" : "Order" },
  { href: "/contact", label: locale === "zh" ? "联系" : "Contact" }
];

const productSources: ProductSource[] = [
  {
    slug: "business-cards",
    name: text("Business Cards", "名片"),
    category: text("Brand Essentials", "品牌基础物料"),
    description: text(
      "Premium business cards with sharp color, tactile finishes, and same-day proofing for brands that need to look polished from the first handshake.",
      "高端名片，色彩锐利、触感出众，并支持当日校样，帮助品牌从第一次见面开始就留下专业印象。"
    ),
    shortDescription: text(
      "Luxury finishes and crisp color for first impressions that stick.",
      "高级工艺与清晰色彩，让第一印象更有记忆点。"
    ),
    basePrice: 32,
    turnaround: text("Ready to ship in 24 hours", "24 小时内可发货"),
    sizes: [text("Standard 3.5 x 2", "标准 3.5 x 2"), text("Square 2.5 x 2.5", "方形 2.5 x 2.5"), text("Mini 3 x 1", "迷你 3 x 1")],
    materials: [text("Silk", "丝绸卡"), text("Matte", "哑膜"), text("Soft Touch", "柔感膜"), text("Recycled Cotton", "再生棉纸")],
    popular: true,
    accent: "from-cyan-400 via-sky-500 to-blue-600",
    stats: [text("350gsm premium stock", "350gsm 高级纸张"), text("Foil and spot UV options", "烫金与局部 UV"), text("Free file check", "免费文件检查")]
  },
  {
    slug: "stickers",
    name: text("Custom Stickers", "定制贴纸"),
    category: text("Packaging & Promotions", "包装与推广"),
    description: text(
      "Weather-resistant stickers and labels for packaging, events, and product drops, printed with rich color and die-cut precision.",
      "适用于包装、活动和新品发布的耐候贴纸与标签，颜色饱满，模切精准。"
    ),
    shortDescription: text(
      "Durable, vibrant stickers built for packaging and promos.",
      "耐用鲜艳，适合包装与推广场景。"
    ),
    basePrice: 24,
    turnaround: text("Ships next business day", "次工作日发货"),
    sizes: [text("2 x 2", "2 x 2"), text("3 x 3", "3 x 3"), text("4 x 6", "4 x 6")],
    materials: [text("Gloss Vinyl", "亮面 PVC"), text("Matte Vinyl", "哑面 PVC"), text("Clear Film", "透明膜"), text("Kraft Paper", "牛皮纸")],
    popular: true,
    accent: "from-orange-400 via-amber-400 to-yellow-300",
    stats: [text("Water-resistant inks", "防水油墨"), text("Custom die cut shapes", "支持异形模切"), text("Roll or sheet delivery", "卷装或片装交付")]
  },
  {
    slug: "flyers",
    name: text("Flyers", "宣传单"),
    category: text("Marketing Materials", "营销物料"),
    description: text(
      "High-impact flyers for menus, local campaigns, launches, and events with fast turnaround and bulk-friendly pricing.",
      "适用于菜单、线下推广、活动和新品发布的高转化宣传单，交付快，批量价格更友好。"
    ),
    shortDescription: text(
      "Bold marketing flyers for launches, menus, and promotions.",
      "适合发布、菜单和促销活动的高表现宣传单。"
    ),
    basePrice: 46,
    turnaround: text("Prints in 24 to 48 hours", "24 到 48 小时内印刷完成"),
    sizes: [text("A5", "A5"), text("A4", "A4"), text("US Letter", "美式 Letter")],
    materials: [text("Gloss 170gsm", "亮面 170gsm"), text("Matte 200gsm", "哑面 200gsm"), text("Silk 250gsm", "丝绸卡 250gsm")],
    popular: true,
    accent: "from-fuchsia-500 via-rose-500 to-orange-400",
    stats: [text("Double-sided printing", "支持双面印刷"), text("Bulk discounts built in", "自动批量优惠"), text("Color-accurate output", "高还原色彩输出")]
  },
  {
    slug: "posters",
    name: text("Posters", "海报"),
    category: text("Large Format", "大幅面印刷"),
    description: text(
      "Gallery-quality posters and event signage with vivid, high-density print and strong substrate options for indoor and outdoor use.",
      "高品质海报与活动展示物料，色彩鲜明、密度高，支持室内外多种材质。"
    ),
    shortDescription: text(
      "Large-format prints with vivid color and premium finish.",
      "大幅面输出，色彩鲜明，成品更高级。"
    ),
    basePrice: 18,
    turnaround: text("Same-day production available", "支持当天生产"),
    sizes: [text("12 x 18", "12 x 18"), text("18 x 24", "18 x 24"), text("24 x 36", "24 x 36")],
    materials: [text("Semi Gloss", "半光面"), text("Blueback", "蓝背纸"), text("Polypropylene", "PP 合成纸")],
    popular: true,
    accent: "from-emerald-400 via-teal-400 to-cyan-400",
    stats: [text("Indoor and outdoor options", "室内外材质可选"), text("High-density pigment printing", "高密度颜料印刷"), text("Rush service available", "支持加急")]
  },
  {
    slug: "packaging",
    name: text("Custom Packaging", "定制包装"),
    category: text("Retail & Ecommerce", "零售与电商"),
    description: text(
      "Branded boxes, sleeves, and inserts that elevate unboxing and keep every shipment feeling intentional.",
      "品牌包装盒、套筒与内衬，让开箱体验更高级，也让每一次发货都更有品牌感。"
    ),
    shortDescription: text(
      "Packaging that turns shipments into brand experiences.",
      "让发货过程变成品牌体验的一部分。"
    ),
    basePrice: 128,
    turnaround: text("Production starts within 48 hours", "48 小时内启动生产"),
    sizes: [text("Mailer Small", "小号邮寄盒"), text("Mailer Medium", "中号邮寄盒"), text("Foldable Carton", "折叠纸盒")],
    materials: [text("Corrugated Kraft", "瓦楞牛皮纸"), text("Premium Cardboard", "高级卡纸"), text("Soft Matte Laminate", "柔感哑膜")],
    popular: true,
    accent: "from-violet-500 via-indigo-500 to-sky-500",
    stats: [text("Structural design support", "支持结构设计"), text("Pantone matching", "潘通专色匹配"), text("Insert and sleeve options", "支持内衬与套筒")]
  },
  {
    slug: "menus",
    name: text("Menus", "菜单"),
    category: text("Restaurant Printing", "餐饮印刷"),
    description: text(
      "Restaurant-ready menus with spill-resistant finishes, folded formats, and fast restock options for busy service teams.",
      "适合餐饮门店的菜单印刷，支持防泼溅工艺、折页规格和快速补印。"
    ),
    shortDescription: text(
      "Menus designed to survive busy service and look sharp.",
      "兼顾耐用与美观，适合高频使用场景。"
    ),
    basePrice: 38,
    turnaround: text("Ships in 1 to 2 business days", "1 到 2 个工作日发货"),
    sizes: [text("Bi-Fold", "对折"), text("Tri-Fold", "三折"), text("Single Page", "单页")],
    materials: [text("Laminated Matte", "覆膜哑面"), text("Synthetic Tearproof", "防撕裂合成纸"), text("Silk 300gsm", "丝绸卡 300gsm")],
    accent: "from-lime-400 via-emerald-500 to-teal-500",
    stats: [text("Spill-resistant finishes", "耐污耐泼溅"), text("Folded and flat layouts", "支持折页与单页"), text("Restaurant-focused templates", "餐饮专用模板")]
  }
];

export const getProducts = (locale: Locale): Product[] =>
  productSources.map((product) => ({
    slug: product.slug,
    name: product.name[locale],
    category: product.category[locale],
    description: product.description[locale],
    shortDescription: product.shortDescription[locale],
    basePrice: product.basePrice,
    turnaround: product.turnaround[locale],
    sizes: product.sizes.map((item) => item[locale]),
    materials: product.materials.map((item) => item[locale]),
    popular: product.popular,
    accent: product.accent,
    stats: product.stats.map((item) => item[locale])
  }));

export const getProductBySlug = (locale: Locale, slug: string) => getProducts(locale).find((product) => product.slug === slug);

export const getTestimonials = (locale: Locale): Testimonial[] => [
  {
    quote:
      locale === "zh"
        ? "我们把所有新品发布物料都切到了这里。交付速度快，颜色稳定，在线下单流程也比我们用过的任何平台都更顺。"
        : "We switched all of our launch collateral here. Turnaround is fast, color is consistent, and the ordering flow is the easiest we have used.",
    name: "Maya Chen",
    role: locale === "zh" ? "Northline Studio 品牌负责人" : "Brand Lead, Northline Studio"
  },
  {
    quote:
      locale === "zh"
        ? "一场 600 人活动的加急海报提前送达，成品质感也非常好，感觉像随时拥有一支自己的印刷团队。"
        : "Rush posters for a 600-person event arrived early and looked exceptional. It felt like having an in-house print team on demand.",
    name: "Evan Brooks",
    role: locale === "zh" ? "Gatherly 活动经理" : "Events Manager, Gatherly"
  },
  {
    quote:
      locale === "zh"
        ? "包装质量让我们的首次订阅礼盒一开始就显得很高级，现在补单只需要几分钟。"
        : "The packaging quality made our first subscription drop look premium right away. Our reorder process now takes minutes instead of hours.",
    name: "Tiana Wells",
    role: locale === "zh" ? "Common Table 创始人" : "Founder, Common Table"
  }
];

export const getStats = (locale: Locale) => [
  { value: "18k+", label: locale === "zh" ? "满意客户" : "happy clients" },
  { value: "24h", label: locale === "zh" ? "平均加急周期" : "average rush turnaround" },
  { value: "99.4%", label: locale === "zh" ? "准时交付率" : "on-time delivery rate" },
  { value: "4.9/5", label: locale === "zh" ? "平均评分" : "average customer rating" }
];

export const getPricingTiers = (locale: Locale) => [
  {
    name: locale === "zh" ? "基础版" : "Starter",
    price: "$29",
    description: locale === "zh" ? "适合快速小批量下单。" : "For quick one-off runs and small batches.",
    features:
      locale === "zh"
        ? ["即时报价", "免费文件检查", "标准交付周期", "邮件支持"]
        : ["Instant pricing", "Free file check", "Standard turnaround", "Email support"]
  },
  {
    name: locale === "zh" ? "成长版" : "Growth",
    price: "$99",
    description: locale === "zh" ? "适合有持续印刷需求的成长品牌。" : "For fast-moving brands with recurring print needs.",
    features:
      locale === "zh"
        ? ["优先生产", "批量折扣价格", "专属设计支持", "补单后台"]
        : ["Priority production", "Bulk discount pricing", "Dedicated design support", "Reorder dashboard"],
    featured: true
  },
  {
    name: locale === "zh" ? "企业版" : "Scale",
    price: locale === "zh" ? "定制" : "Custom",
    description: locale === "zh" ? "适合多门店品牌、代理公司和大批量需求。" : "For multi-location brands, agencies, and wholesale print volume.",
    features:
      locale === "zh"
        ? ["定制采购", "客户经理", "仓储协同", "企业账期"]
        : ["Custom sourcing", "Account manager", "Warehousing coordination", "Enterprise invoicing"]
  }
];

export const getOrderSteps = (locale: Locale) => [
  {
    title: locale === "zh" ? "选择产品" : "Choose your product",
    description: locale === "zh" ? "几秒钟内比较尺寸、材质和数量，并实时查看价格。" : "Compare sizes, materials, and quantities in seconds with live pricing."
  },
  {
    title: locale === "zh" ? "上传文件" : "Upload artwork",
    description: locale === "zh" ? "拖拽上传文件、申请设计支持，或直接使用历史订单快速补单。" : "Drag in files, request a design assist, or use a saved reorder from your history."
  },
  {
    title: locale === "zh" ? "确认并印刷" : "Approve and print",
    description: locale === "zh" ? "确认校样、选择交付速度，然后立即进入生产。" : "Review your proof, confirm delivery speed, and send it to production immediately."
  }
];

export const getFaqs = (locale: Locale) => [
  {
    question: locale === "zh" ? "最快多久可以印刷并发货？" : "How fast can you print and ship?",
    answer:
      locale === "zh"
        ? "像名片、海报、宣传单这类热门产品可当天进入生产，加急订单支持次日发货。"
        : "Popular products like business cards, posters, and flyers can enter production the same day, with next-day shipping available on rush orders."
  },
  {
    question: locale === "zh" ? "如果我的设计文件还没准备好怎么办？" : "Can you help if my artwork is not ready?",
    answer:
      locale === "zh"
        ? "可以。我们的设计支持团队可以根据你的品牌素材进行调整，或直接制作可印刷文件。"
        : "Yes. Our design support team can adapt your existing brand files or build press-ready layouts for you."
  },
  {
    question: locale === "zh" ? "有批量优惠吗？" : "Do you offer bulk pricing?",
    answer:
      locale === "zh"
        ? "有。网站会自动根据数量更新价格，大批量项目也可以申请专属报价。"
        : "Absolutely. Our quantity pricing updates instantly online, and high-volume projects can request a custom quote for better rates."
  }
];

export const getDictionary = (locale: Locale) => ({
  metadata: {
    title: locale === "zh" ? "PrintForge | 高端在线印刷服务" : "PrintForge | Premium Online Printing",
    description:
      locale === "zh"
        ? "快速、高品质的在线印刷服务，涵盖名片、贴纸、海报、宣传单、包装与品牌周边。"
        : "Fast, premium online printing for business cards, stickers, posters, flyers, packaging, and branded merch."
  },
  common: {
    startPrinting: locale === "zh" ? "开始印刷" : "Start Printing",
    getQuote: locale === "zh" ? "获取即时报价" : "Get Instant Quote",
    orderNow: locale === "zh" ? "立即下单" : "Order Now",
    getStarted: locale === "zh" ? "立即开始" : "Get Started",
    uploadArtwork: locale === "zh" ? "上传文件" : "Upload Artwork",
    viewCatalog: locale === "zh" ? "查看产品目录" : "View catalog",
    browseCatalog: locale === "zh" ? "浏览完整目录" : "Browse full catalog",
    addToCart: locale === "zh" ? "加入购物车" : "Add to Cart",
    instantPriceCalculator: locale === "zh" ? "即时价格计算器" : "Instant price calculator",
    estimatedDeliverySoon: locale === "zh" ? "预计最早明天送达" : "Estimated delivery: as soon as tomorrow",
    estimatedDeliveryStandard: locale === "zh" ? "预计 2 到 4 个工作日送达" : "Estimated delivery: 2 to 4 business days",
    rushAvailable: locale === "zh" ? "当前配置支持加急生产。" : "Rush production is available for this configuration.",
    chooseSmallerQuantity: locale === "zh" ? "选择更小数量可支持次日生产。" : "Choose a smaller quantity for next-day production.",
    size: locale === "zh" ? "尺寸" : "Size",
    material: locale === "zh" ? "材质" : "Material",
    quantity: locale === "zh" ? "数量" : "Quantity",
    startingAt: locale === "zh" ? "起售价" : "Starting at",
    mostPopular: locale === "zh" ? "最受欢迎" : "Most Popular"
  },
  header: {
    pricing: locale === "zh" ? "价格" : "Pricing"
  },
  footer: {
    headline: locale === "zh" ? "让你的品牌在印刷品上同样出众。" : "Print that makes your brand impossible to ignore.",
    description:
      locale === "zh"
        ? "面向品牌、餐饮、活动和电商品牌的高品质快速印刷服务，专业输出，不拖流程。"
        : "Fast-turn printing for brands, restaurants, events, and ecommerce teams that need premium quality without the production headache.",
    note:
      locale === "zh"
        ? "部分产品支持当天生产。所有订单均附带质量保障。"
        : "Same-day production available on select products. Quality guarantee included with every order.",
    groups: {
      products: locale === "zh" ? "产品" : "Products",
      company: locale === "zh" ? "公司" : "Company",
      support: locale === "zh" ? "支持" : "Support",
      artworkHelp: locale === "zh" ? "文件帮助" : "Artwork Help",
      shipping: locale === "zh" ? "配送" : "Shipping",
      reorders: locale === "zh" ? "补单" : "Reorders",
      guarantee: locale === "zh" ? "保障" : "Guarantee"
    }
  },
  home: {
    featureEyebrow: locale === "zh" ? "为什么选择我们" : "Why us",
    popularEyebrow: locale === "zh" ? "热门产品" : "Popular products",
    popularTitle: locale === "zh" ? "专为高频印刷需求打造。" : "Built for the print jobs that move fastest.",
    popularDescription:
      locale === "zh"
        ? "名片、贴纸、宣传单、海报和包装，帮助小团队快速上线，同时保持高品质输出。"
        : "Business cards, stickers, flyers, posters, and packaging designed to help small teams launch quickly without sacrificing quality.",
    trustEyebrow: locale === "zh" ? "信任保障" : "Trust signals",
    trustTitle: locale === "zh" ? "专业到足以服务代理公司，简单到第一次下单也毫无压力。" : "Professional enough for agencies. Easy enough for a first order.",
    trustDescription:
      locale === "zh"
        ? "质量保障、交付保障，以及每一份文件进入印刷前的人工检查。"
        : "Quality guarantee, delivery guarantee, and a support team that checks every file before it hits the press.",
    howEyebrow: locale === "zh" ? "下单流程" : "How it works",
    howTitle: locale === "zh" ? "下单只需几分钟，不再反复邮件沟通。" : "Ordering takes minutes, not back-and-forth emails.",
    howDescription:
      locale === "zh"
        ? "一个以转化为目标的流程，让客户几乎无阻力地从报价走到校样和生产。"
        : "A conversion-focused flow that gets customers from quote to proof to production with almost no friction.",
    pricingEyebrow: locale === "zh" ? "价格" : "Pricing",
    pricingTitle: locale === "zh" ? "价格有竞争力，数量越大越划算。" : "Competitive pricing that scales with your order.",
    pricingDescription:
      locale === "zh"
        ? "适合一次性小单，也适合高频补单和成长型品牌的大批量需求。"
        : "Simple entry points for one-off jobs, plus volume-friendly pricing for repeat orders and growth teams.",
    reassuranceEyebrow: locale === "zh" ? "快速安心" : "Fast reassurance",
    reassuranceTitle: locale === "zh" ? "需要快？我们把整个网站都围绕“立刻下单”来设计。" : "Need it fast? We built the site around immediate action.",
    reassuranceDescription:
      locale === "zh"
        ? "即时价格、文件上传、历史补单和交付时间都被放在最关键的购买决策位置。"
        : "Instant price calculation, artwork upload, reorder history, and delivery estimates are surfaced right where people make buying decisions.",
    guaranteeDelivery: locale === "zh" ? "审核通过的订单均享受交付保障。" : "Delivery guarantee on every approved order.",
    guaranteeQuality: locale === "zh" ? "印刷前文件检查，确保质量稳定。" : "Print quality guarantee backed by file checks.",
    faqEyebrow: "FAQ",
    faqTitle: locale === "zh" ? "客户下单前最常问的问题。" : "Questions buyers ask right before they order.",
    faqDescription:
      locale === "zh"
        ? "用简洁答案打消顾虑，帮助客户更快完成下单。"
        : "Short answers that remove friction and build confidence before checkout."
  },
  catalog: {
    eyebrow: locale === "zh" ? "产品目录" : "Product catalog",
    title: locale === "zh" ? "品牌所需的一切印刷品。" : "Everything your brand needs in print.",
    description:
      locale === "zh"
        ? "浏览适用于活动、餐饮、电商包装和日常品牌物料的高品质印刷产品。"
        : "Explore premium print products for launches, restaurants, events, ecommerce packaging, and day-to-day brand materials."
  },
  pricing: {
    eyebrow: locale === "zh" ? "价格" : "Pricing",
    title: locale === "zh" ? "起印价格清晰透明，数量越多优惠越大。" : "Clear starting prices and better rates as quantity grows.",
    description:
      locale === "zh"
        ? "降低决策阶段的犹豫，客户可以快速对比入门价格，也能无缝切换到定制报价。"
        : "Designed to reduce hesitation at the decision stage. Buyers can compare quick entry pricing and move into custom volume quotes without leaving the flow.",
    guideTitle: locale === "zh" ? "快速报价参考" : "Quick estimate guide",
    guideDescription: locale === "zh" ? "最常见产品的典型在线价格。" : "Typical online pricing for our most frequently ordered products.",
    tableHeaders: locale === "zh" ? ["产品", "100 份", "500 份", "1000 份"] : ["Product", "100 units", "500 units", "1000 units"],
    custom: locale === "zh" ? "定制" : "Custom"
  },
  about: {
    eyebrow: locale === "zh" ? "关于 PrintForge" : "About PrintForge",
    title: locale === "zh" ? "为那些希望印刷效果和产品一样出色的品牌而打造。" : "Built for brands that need print to feel as good as their product.",
    description:
      locale === "zh"
        ? "我们创建 PrintForge，是为了让专业印刷下单变得更快、更稳、更轻松。从加急名片到整套包装系统，我们专注高质量生产与稳定执行。"
        : "We created PrintForge for businesses that want professional print ordering to feel fast, dependable, and surprisingly easy. From rush business cards to full packaging systems, we focus on production quality and zero-drama execution.",
    principles:
      locale === "zh"
        ? [
            "速度快，但不牺牲质量",
            "精选材料，真正提升品牌观感",
            "在线下单流程简单流畅",
            "需要时可获得设计支持"
          ]
        : [
            "Fast production without quality shortcuts",
            "Premium materials chosen for real-world brand impact",
            "Simple online ordering that removes friction",
            "Helpful design support when customers need backup"
          ],
    serveEyebrow: locale === "zh" ? "服务对象" : "Who we serve",
    serveTitle: locale === "zh" ? "小企业、餐饮、初创公司、活动团队、电商品牌和设计师。" : "Small businesses, restaurants, startups, event teams, ecommerce brands, and designers.",
    serveDescription:
      locale === "zh"
        ? "整个网站和文案都以转化为目标，强调清晰利益点、可见保障和快速下单入口。"
        : "The site and its messaging are intentionally conversion-first: clear benefits, visible guarantees, and fast access to product-specific ordering flows.",
    differentEyebrow: locale === "zh" ? "我们的不同之处" : "What makes us different",
    differentiators:
      locale === "zh"
        ? [
            "热门产品支持当天或次日生产",
            "价格有竞争力，同时保持高级品牌观感",
            "没有可印刷文件时可获得设计支持",
            "历史订单与一键补单，方便复购"
          ]
        : [
            "Same-day and next-day production on high-demand products",
            "Competitive pricing without a bargain-bin visual experience",
            "Design assistance for teams without print-ready files",
            "Order history and one-click reorders for repeat buyers"
          ]
  },
  order: {
    eyebrow: locale === "zh" ? "下单 / 上传文件" : "Order / upload artwork",
    title: locale === "zh" ? "几分钟内完成下单。" : "Place an order in minutes.",
    description:
      locale === "zh"
        ? "选择产品、上传文件、申请设计支持，然后直接进入校样与生产。"
        : "Choose your product, upload artwork, request design help, and move straight into proofing and production.",
    product: locale === "zh" ? "产品" : "Product",
    quantity: locale === "zh" ? "数量" : "Quantity",
    artwork: locale === "zh" ? "文件上传" : "Artwork upload",
    artworkDrop:
      locale === "zh" ? "将印刷文件拖拽到这里，或从设备中选择上传" : "Drag and drop print files here or browse from your device",
    needDesign: locale === "zh" ? "我需要设计支持" : "I need design support",
    saveReorder: locale === "zh" ? "保存当前配置，方便后续补单" : "Save this configuration for reorders",
    notes: locale === "zh" ? "订单备注" : "Order notes",
    notesPlaceholder:
      locale === "zh" ? "填写交付时间、工艺要求或包装说明。" : "Include delivery deadlines, finishing notes, or packaging details.",
    submit: locale === "zh" ? "提交并获取即时报价" : "Submit for Instant Quote",
    whyEyebrow: locale === "zh" ? "为什么这个页面更容易转化" : "Why this page converts",
    whyTitle: locale === "zh" ? "买家需要的一切，都在一个页面里。" : "Everything a buyer needs is on one screen.",
    whyDescription:
      locale === "zh"
        ? "产品选择、文件上传、设计支持和补单入口被组合成一个行动导向的表单，以减少流失。"
        : "Product choice, artwork upload, design help, and reorder enablement are grouped into a single action-focused form to reduce drop-off.",
    historyEyebrow: locale === "zh" ? "订单历史" : "Order history",
    historyTitle: locale === "zh" ? "一键补印历史订单。" : "Reorder previous prints instantly.",
    orders:
      locale === "zh"
        ? [
            { name: "Northline 名片", date: "4 月 2 日", status: "已送达", action: "再次下单" },
            { name: "Gatherly 活动海报", date: "4 月 1 日", status: "生产中", action: "查看进度" },
            { name: "Common Table 标签", date: "3 月 28 日", status: "已送达", action: "再次下单" }
          ]
        : [
            { name: "Northline business cards", date: "Apr 2", status: "Delivered", action: "Reorder" },
            { name: "Gatherly event posters", date: "Apr 1", status: "In production", action: "Track order" },
            { name: "Common Table labels", date: "Mar 28", status: "Delivered", action: "Reorder" }
          ]
  },
  contact: {
    eyebrow: locale === "zh" ? "联系" : "Contact",
    title: locale === "zh" ? "联系印刷顾问，今天就推动你的订单开始生产。" : "Talk to a print specialist who can get your order moving today.",
    description:
      locale === "zh"
        ? "你可以联系我们获取定制报价、设计支持、生产周期建议，或咨询合适的纸张与工艺。"
        : "Reach us for custom quotes, design help, production timelines, or recommendations on the right stock and finish.",
    formEyebrow: locale === "zh" ? "发送消息" : "Send a message",
    fields: locale === "zh" ? ["姓名", "邮箱", "公司", "你需要印什么？"] : ["Full name", "Email address", "Company", "What do you need printed?"],
    messagePlaceholder:
      locale === "zh" ? "告诉我们交付时间、数量和你是否需要设计支持。" : "Tell us about timing, quantity, and any design support you need.",
    button: locale === "zh" ? "联系支持团队" : "Contact Support"
  },
  productPage: {
    delivery: locale === "zh" ? "交付" : "Delivery",
    designSupport: locale === "zh" ? "设计支持" : "Design support",
    guarantee: locale === "zh" ? "保障" : "Guarantee",
    designSupportValue: locale === "zh" ? "可选文件整理与打样支持" : "Optional file setup and proofing",
    guaranteeValue: locale === "zh" ? "印刷前进行质量检查" : "Quality checked before production",
    examplesEyebrow: locale === "zh" ? "真实印刷示例" : "Real print examples",
    examples:
      locale === "zh"
        ? ["品牌发布套装", "餐饮促销批次", "活动加急补单", "零售包装内页"]
        : ["Brand launch set", "Restaurant promo batch", "Event rush reorder", "Retail packaging insert"],
    examplesDescription:
      locale === "zh" ? "色彩管理稳定，文件适合生产，印前完成校样确认。" : "Color-managed, production-ready, and proofed before press.",
    whyEyebrow: locale === "zh" ? "为什么这一页更容易成交" : "Why buyers convert here",
    whyTitle: locale === "zh" ? "价格清晰、交期可见、没有隐藏流程成本。" : "Clear pricing, visible delivery dates, no hidden production friction.",
    whyDescription:
      locale === "zh"
        ? "这一页把所有高意向决策信息都放在第一屏：尺寸、材质、数量、即时价格、预计交付，以及明确的加入购物车按钮。"
        : "This layout surfaces every high-intent detail up front: size, material, quantity, instant price, estimated delivery, and a direct add-to-cart action without overwhelming the customer.",
    whyList:
      locale === "zh"
        ? ["数量变化时价格实时更新", "材质选择清晰直观", "复购客户可快速补单", "上传文件直接进入下单流程"]
        : [
            "Live price updates as quantity changes",
            "Material choices explained visually and clearly",
            "Fast reorder path for repeat customers",
            "Artwork upload integrated into checkout"
          ],
    relatedEyebrow: locale === "zh" ? "相关产品" : "Related products",
    relatedTitle: locale === "zh" ? "让整套活动物料保持一致风格。" : "Keep your campaign visually consistent."
  },
  notFound: {
    eyebrow: locale === "zh" ? "页面未找到" : "Page not found",
    title: locale === "zh" ? "这个印刷任务已经下线了。" : "This print job is off the press.",
    description: locale === "zh" ? "返回首页或重新开始一个订单。" : "Head back to the catalog or start a new order.",
    button: locale === "zh" ? "返回首页" : "Return home"
  },
  hero: {
    badge: locale === "zh" ? "从创意到成品，最快 24 小时" : "From idea to print in 24 hours",
    titleTop: locale === "zh" ? "想印什么" : "Print anything.",
    titleBottom: locale === "zh" ? "都能快速送达。" : "Delivered fast.",
    description:
      locale === "zh"
        ? "专业印刷，不必麻烦。活动物料、菜单、包装与周边，统一用高级材质、快速交付和在线即时报价完成。"
        : "Professional printing without the hassle. Launch campaigns, menus, packaging, and merch with premium materials, rapid turnaround, and instant online pricing.",
    floatingCards:
      locale === "zh"
        ? [
            { title: "加急名片", eta: "明天送达", color: "from-cyan-400 to-sky-500", position: "top-8 left-6" },
            { title: "卷装标签贴", eta: "已解锁批量优惠", color: "from-amber-300 to-orange-500", position: "top-44 right-0" },
            { title: "活动海报", eta: "今天可安排生产", color: "from-emerald-400 to-cyan-400", position: "bottom-10 left-20" }
          ]
        : [
            { title: "Rush Business Cards", eta: "Delivers tomorrow", color: "from-cyan-400 to-sky-500", position: "top-8 left-6" },
            { title: "Sticker Roll Labels", eta: "Bulk pricing unlocked", color: "from-amber-300 to-orange-500", position: "top-44 right-0" },
            { title: "Event Posters", eta: "Same-day print slot", color: "from-emerald-400 to-cyan-400", position: "bottom-10 left-20" }
          ],
    topSeller: locale === "zh" ? "热销产品" : "Top Seller",
    cardProduct: locale === "zh" ? "名片" : "Business Cards",
    cardHeadline: locale === "zh" ? "让人一眼记住。" : "Impossible to ignore.",
    stock: locale === "zh" ? "纸张" : "Stock",
    stockValue: locale === "zh" ? "柔感膜" : "Soft Touch",
    finish: locale === "zh" ? "工艺" : "Finish",
    finishValue: locale === "zh" ? "烫金点缀" : "Foil Accent",
    quote: locale === "zh" ? "即时报价" : "Instant Quote",
    quoteDescription: locale === "zh" ? "500 张高级宣传单，200gsm 哑面纸" : "500 premium flyers, matte 200gsm",
    productionStatus: locale === "zh" ? "生产状态" : "Production Status",
    productionValue: locale === "zh" ? "文件已确认，今天开始印刷。" : "File approved. Printing today."
  }
});
