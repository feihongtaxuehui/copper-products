/**
 * ============================================================
 * 只改这个文件即可完成大部分日常更新
 * ============================================================
 */
window.SITE_CONFIG = {
  companyNameZh: "鸿元机械有限公司",
  companyNameEn: "HENGZHU COPPER ALLOY TECHNOLOGY CO., LTD.",
  brandShort: "HENGZHU COPPER",

  sloganZh: "铜套、蜗轮、滑板、轴瓦、铜螺母及非标铜件一站式制造。",

  phone: "13834361397",
  email: "sales@example.com",
  wechat: "138346361397",
  whatsapp: "13834361397",
  whatsappDigits: "138343613967",
  address: "中国 · 山西省 · 交城县",

  years: "20+",
  equipments: "50+",
  countries: "30+",

  priceDisclaimer: "参考价格按 kg 展示，仅用于采购初步了解；实际报价需结合材料牌号、成品重量、尺寸、数量和加工难度核算。",

  categories: [
    { id: "all", name: "全部" },
    { id: "bearing", name: "铜套轴瓦" },
    { id: "gear", name: "蜗轮齿轮" },
    { id: "wear", name: "滑板滑块" },
    { id: "nut", name: "铜螺母" },
    { id: "custom", name: "非标件" }
  ],

  products: [
    {
      id: "bushing",
      category: "bearing",
      name: "铜套 · 铜衬套",
      en: "BRONZE BUSHINGS",
      desc: "直筒、法兰、石墨、自润滑及大型铜套，适用于轴类支撑、耐磨和滑动工况。",
      price: "¥65 – ¥105 / kg",
      tags: ["按图定制", "锡青铜", "铝青铜", "CNC精加工"],
      image: "./assets/images/product-bushing.jpg"
    },
    {
      id: "bearing",
      category: "bearing",
      name: "铜轴瓦 · 滑动轴承",
      en: "BRONZE BEARINGS",
      desc: "适用于高负载、低速和冲击工况，可做剖分式、整体式和大型异形结构。",
      price: "¥68 – ¥110 / kg",
      tags: ["滑动轴承", "高负载", "大型件", "异形件"],
      image: "./assets/images/product-bearing.jpg"
    },
    {
      id: "wormgear",
      category: "gear",
      name: "铜蜗轮 · 铜齿轮",
      en: "BRONZE WORM GEARS",
      desc: "适用于减速机、升降设备及传动系统，可按模数、齿数、孔径和材质加工。",
      price: "¥72 – ¥118 / kg",
      tags: ["减速机", "齿轮加工", "锡青铜", "非标"],
      image: "./assets/images/product-gear.jpg"
    },
    {
      id: "wearplate",
      category: "wear",
      name: "铜滑板 · 铜滑块",
      en: "WEAR PLATES & BLOCKS",
      desc: "适用于重载导向、摩擦副和工程机械，可加工油槽、石墨孔及安装孔。",
      price: "¥70 – ¥115 / kg",
      tags: ["耐磨", "重载", "石墨孔", "CNC铣削"],
      image: "./assets/images/product-wearplate.jpg"
    },
    {
      id: "nut",
      category: "nut",
      name: "铜螺母 · 丝杆螺母",
      en: "BRONZE NUTS",
      desc: "梯形丝杆螺母、升降机螺母、机床传动螺母及各类非标螺纹件。",
      price: "¥75 – ¥125 / kg",
      tags: ["梯形螺纹", "丝杆", "机床", "按图加工"],
      image: "./assets/images/product-nut.jpg"
    },
    {
      id: "ring",
      category: "custom",
      name: "铜环 · 铜法兰",
      en: "BRONZE RINGS & FLANGES",
      desc: "适用于机械连接、轴向定位、密封和大型设备配套，可按尺寸与材质加工。",
      price: "¥68 – ¥112 / kg",
      tags: ["铜环", "法兰", "大型件", "按图"],
      image: "./assets/images/product-ring.jpg"
    },
    {
      id: "pump",
      category: "custom",
      name: "泵阀铜件",
      en: "PUMP & VALVE PARTS",
      desc: "叶轮、阀座、轴套、耐磨环等泵阀铜合金零件，可按工况选择材料。",
      price: "¥78 – ¥135 / kg",
      tags: ["泵阀", "叶轮", "阀座", "耐腐蚀"],
      image: "./assets/images/product-pump.jpg"
    },
    {
      id: "custom",
      category: "custom",
      name: "非标铜合金零件",
      en: "CUSTOM COPPER PARTS",
      desc: "支持来图、来样、小批量和大型异形件加工，适合机械设备配套和维修替换。",
      price: "¥65 – ¥150+ / kg",
      tags: ["来图定制", "来样加工", "小批量", "大型件"],
      image: "./assets/images/product-custom.jpg"
    }
  ]
};
