
(() => {
  const cfg = window.SITE_CONFIG || {};
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  let currentCategory = "all";
  let currentProduct = null;
  let deferredInstallPrompt = null;

  // ========== 1. 企业基础信息 ==========
  $$("[data-cfg]").forEach(el => {
    const key = el.dataset.cfg;
    if (cfg[key] !== undefined) el.textContent = cfg[key] ?? "";
  });

  $("#year").textContent = new Date().getFullYear();
  document.title = `${cfg.companyNameZh || "铜合金产品"} | 铜合金零部件制造商`;

  // ========== 2. 联系方式 ==========
  const phone = String(cfg.phone || "").replace(/[^\d+]/g, "");

  $$('[data-link="phone"]').forEach(a => {
    a.href = `tel:${phone}`;
  });

  $$('[data-link="email"]').forEach(a => {
    a.href = `mailto:${cfg.email || ""}?subject=${encodeURIComponent("铜合金产品询价 / RFQ")}`;
  });

  $$('[data-link="whatsapp"]').forEach(a => {
    a.href = `https://wa.me/${cfg.whatsappDigits || ""}?text=${encodeURIComponent("Hello, I would like to inquire about your copper alloy products.")}`;
  });

  // ========== 3. 提示消息与复制功能 ==========
  const toast = $("#toast");
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 1600);
  }

  async function copyText(text, msg="已复制") {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const t = document.createElement("textarea");
      t.value = text;
      t.style.position = "fixed";
      t.style.opacity = "0";

      document.body.appendChild(t);
      t.focus();
      t.select();
      document.execCommand("copy");
      t.remove();
    }

    showToast(msg);
  }

  $$('[data-copy="wechat"]').forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      copyText(cfg.wechat || "", "微信号已复制");
    });
  });

  // ========== 4. 产品分类 ==========
  const categoryStrip = $("#categoryStrip");
  const productGrid = $("#productGrid");

  function renderCategories() {
    categoryStrip.innerHTML = "";

    (cfg.categories || []).forEach(cat => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = cat.name;

      if (cat.id === currentCategory) {
        b.classList.add("active");
      }

      b.addEventListener("click", () => {
        currentCategory = cat.id;
        renderCategories();
        renderProducts();
      });

      categoryStrip.appendChild(b);
    });
  }

  // ========== 5. 图片加载显示修复 ==========
  /*
   * 修复手机端、PWA缓存下图片不显示的问题。
   *
   * 原因：
   * CSS默认将图片 display:none；
   * 图片可能在注册 load 监听之前完成加载。
   *
   * 解决：
   * 监听 load/error，
   * 同时检查 complete 和 naturalWidth。
   */
  function bindImageVisibility(img) {
    const refresh = () => {
      img.style.display =
        img.naturalWidth > 0 ? "block" : "none";
    };

    img.addEventListener("load", refresh);
    img.addEventListener("error", refresh);

    // 图片已经加载完成时，立即同步显示状态
    if (img.complete) {
      refresh();
    }
  }

  // ========== 6. 产品列表 ==========
  function renderProducts() {
    productGrid.innerHTML = "";

    const list = (cfg.products || []).filter(p =>
      currentCategory === "all" ||
      p.category === currentCategory
    );

    list.forEach((p, i) => {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          <div class="product-ph">
            Cu
            <small>PRODUCT ${String(i + 1).padStart(2, "0")}</small>
          </div>

          <img src="${p.image}" alt="${p.name}">
        </div>

        <div class="product-info">
          <span class="en">${p.en}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>

          <div class="price-line">
            <span>参考价格区间</span>
            <strong>${p.price}</strong>
          </div>

          <span class="tap-tip">点击整块查看详情</span>
        </div>
      `;

      // 修复产品图片显示
      const img = $("img", card);
      bindImageVisibility(img);

      // 整张产品卡片都可以点击
      card.addEventListener("click", () => {
        openProduct(p);
      });

      productGrid.appendChild(card);
    });
  }

  renderCategories();
  renderProducts();

  // ========== 7. CNC设备图片修复 ==========
  /*
   * 包括：
   * CNC加工中心
   * CNC数控车床
   * 蜗轮齿轮加工
   * 尺寸与质量检测
   */
  $$(".equipment-photo img").forEach(bindImageVisibility);

  // ========== 8. 弹窗管理 ==========
  const productOverlay = $("#productOverlay");
  const contactOverlay = $("#contactOverlay");

  function openOverlay(el) {
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("sheet-open");
  }

  function closeOverlay(el) {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");

    if (!$(".overlay.open")) {
      document.body.classList.remove("sheet-open");
    }
  }

  // ========== 9. 产品详情弹窗 ==========
  function openProduct(p) {
    currentProduct = p;

    $("#detailEn").textContent = p.en;
    $("#detailTitle").textContent = p.name;
    $("#detailDesc").textContent = p.desc;
    $("#detailPrice").textContent = p.price;
    $("#detailPriceNote").textContent =
      cfg.priceDisclaimer || "";

    $("#detailTags").innerHTML = (p.tags || [])
      .map(x => `<span>${x}</span>`)
      .join("");

    // 修复产品详情图片
    const img = $("#detailImage");

    img.alt = p.name;
    img.style.display = "none";

    // 先绑定事件，再设置图片地址
    img.onload = () => {
      img.style.display = "block";
    };

    img.onerror = () => {
      img.style.display = "none";
    };

    img.src = p.image;

    // 兼容图片已经在缓存中的情况
    if (img.complete) {
      img.style.display =
        img.naturalWidth > 0 ? "block" : "none";
    }

    openOverlay(productOverlay);
  }

  // ========== 10. 联系销售弹窗 ==========
  function openContact() {
    if (productOverlay.classList.contains("open")) {
      closeOverlay(productOverlay);
    }

    openOverlay(contactOverlay);
  }

  $$(".js-contact").forEach(b => {
    b.addEventListener("click", openContact);
  });

  $(".js-product-contact").addEventListener(
    "click",
    openContact
  );

  // 关闭按钮
  $$(".sheet-close").forEach(b => {
    b.addEventListener("click", () => {
      closeOverlay(b.closest(".overlay"));
    });
  });

  // 点击弹窗外部关闭
  $$(".overlay").forEach(o => {
    o.addEventListener("click", e => {
      if (e.target === o) {
        closeOverlay(o);
      }
    });
  });

  // ========== 11. 复制全部联系方式 ==========
  $("#copyAllBtn").addEventListener("click", () => {
    const content = [
      cfg.companyNameZh,
      `电话：${cfg.phone}`,
      `邮箱：${cfg.email}`,
      `微信：${cfg.wechat}`,
      `WhatsApp：${cfg.whatsapp}`,
      `地址：${cfg.address}`
    ]
      .filter(Boolean)
      .join("\n");

    copyText(content, "全部联系方式已复制");
  });

  // ========== 12. 分享网站 ==========
  $("#shareBtn").addEventListener("click", async () => {
    const data = {
      title: cfg.companyNameZh || "铜合金产品",
      text: cfg.sloganZh || "",
      url: location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (e) {
        // 用户主动取消分享时不处理
      }
    } else {
      copyText(location.href, "网址已复制");
    }
  });

  // ========== 13. PWA安装 ==========
  const installBtn = $("#installBtn");
  const installCard = $("#installCard");
  const installCardBtn = $("#installCardBtn");
  const installClose = $("#installClose");
  const installText = $("#installText");

  const isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  const standalone =
    matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;

  function showInstall() {
    if (standalone) return;

    if (deferredInstallPrompt) {
      installBtn.classList.remove("install-hidden");
      installCard.classList.add("show");
    } else if (
      isIos &&
      !localStorage.getItem("copper_install_dismissed")
    ) {
      installText.textContent =
        "iPhone：Safari 中点“分享” → “添加到主屏幕”。";

      installCardBtn.textContent = "知道了";
      installCard.classList.add("show");
    }
  }

  addEventListener("beforeinstallprompt", e => {
    e.preventDefault();

    deferredInstallPrompt = e;
    showInstall();
  });

  async function installPwa() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();

      try {
        await deferredInstallPrompt.userChoice;
      } catch (e) {}

      deferredInstallPrompt = null;
      installCard.classList.remove("show");
      installBtn.classList.add("install-hidden");

    } else if (isIos) {
      showToast("Safari：分享 → 添加到主屏幕");
      installCard.classList.remove("show");
    }
  }

  installBtn.addEventListener("click", installPwa);
  installCardBtn.addEventListener("click", installPwa);

  installClose.addEventListener("click", () => {
    installCard.classList.remove("show");

    localStorage.setItem(
      "copper_install_dismissed",
      "1"
    );
  });

  setTimeout(showInstall, 3500);

  // ========== 14. PWA Service Worker ==========
  /*
   * 保留GitHub Pages子路径兼容。
   * sw.js继续使用网络优先策略。
   */
  if ("serviceWorker" in navigator) {
    addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js", { scope: "./" })
        .catch(console.warn);
    });
  }

})();
