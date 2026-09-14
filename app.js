(() => {
  const cfg = window.SITE_CONFIG || {};
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  let currentCategory = "all";
  let currentProduct = null;
  let deferredInstallPrompt = null;

  $$("[data-cfg]").forEach(el => {
    const key = el.dataset.cfg;
    if (cfg[key] !== undefined) el.textContent = cfg[key] ?? "";
  });

  $("#year").textContent = new Date().getFullYear();
  document.title = `${cfg.companyNameZh || "铜合金产品"} | 铜合金零部件制造商`;

  const phone = String(cfg.phone || "").replace(/[^\d+]/g, "");
  $$('[data-link="phone"]').forEach(a => a.href = `tel:${phone}`);
  $$('[data-link="email"]').forEach(a => a.href = `mailto:${cfg.email || ""}?subject=${encodeURIComponent("铜合金产品询价 / RFQ")}`);
  $$('[data-link="whatsapp"]').forEach(a => {
    a.href = `https://wa.me/${cfg.whatsappDigits || ""}?text=${encodeURIComponent("Hello, I would like to inquire about your copper alloy products.")}`;
  });

  const toast = $("#toast");
  let toastTimer;
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }
  async function copyText(text, msg="已复制"){
    try { await navigator.clipboard.writeText(text); }
    catch(e){
      const t = document.createElement("textarea");
      t.value = text; t.style.position="fixed"; t.style.opacity="0";
      document.body.appendChild(t); t.focus(); t.select(); document.execCommand("copy"); t.remove();
    }
    showToast(msg);
  }
  $$('[data-copy="wechat"]').forEach(btn => btn.addEventListener("click", e => {
    e.preventDefault(); copyText(cfg.wechat || "", "微信号已复制");
  }));

  const categoryStrip = $("#categoryStrip");
  const productGrid = $("#productGrid");

  function renderCategories(){
    categoryStrip.innerHTML = "";
    (cfg.categories || []).forEach(cat => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = cat.name;
      if(cat.id === currentCategory) b.classList.add("active");
      b.addEventListener("click", () => {
        currentCategory = cat.id; renderCategories(); renderProducts();
      });
      categoryStrip.appendChild(b);
    });
  }

  function renderProducts(){
    productGrid.innerHTML = "";
    const list = (cfg.products || []).filter(p => currentCategory === "all" || p.category === currentCategory);
    list.forEach((p, i) => {
      const card = document.createElement("button");
      card.type = "button"; card.className = "product-card";
      card.innerHTML = `
        <div class="product-image">
          <div class="product-ph">Cu<small>PRODUCT ${String(i+1).padStart(2,"0")}</small></div>
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-info">
          <span class="en">${p.en}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="price-line"><span>参考价格区间</span><strong>${p.price}</strong></div>
          <span class="tap-tip">点击整块查看详情</span>
        </div>`;
      const img = $("img", card);
      img.addEventListener("load", () => img.style.display = "block");
      img.addEventListener("error", () => img.style.display = "none");
      card.addEventListener("click", () => openProduct(p));
      productGrid.appendChild(card);
    });
  }

  renderCategories(); renderProducts();

  // 设备图片：不存在则保留占位块
  $$(".equipment-photo img").forEach(img => {
    img.addEventListener("load", () => img.style.display = "block");
    img.addEventListener("error", () => img.style.display = "none");
  });

  const productOverlay = $("#productOverlay");
  const contactOverlay = $("#contactOverlay");

  function openOverlay(el){
    el.classList.add("open"); el.setAttribute("aria-hidden","false"); document.body.classList.add("sheet-open");
  }
  function closeOverlay(el){
    el.classList.remove("open"); el.setAttribute("aria-hidden","true");
    if(!$(".overlay.open")) document.body.classList.remove("sheet-open");
  }

  function openProduct(p){
    currentProduct = p;
    $("#detailEn").textContent = p.en;
    $("#detailTitle").textContent = p.name;
    $("#detailDesc").textContent = p.desc;
    $("#detailPrice").textContent = p.price;
    $("#detailPriceNote").textContent = cfg.priceDisclaimer || "";
    $("#detailTags").innerHTML = (p.tags || []).map(x => `<span>${x}</span>`).join("");
    const img = $("#detailImage");
    img.style.display = "none"; img.alt = p.name; img.src = p.image;
    img.onload = () => img.style.display = "block";
    img.onerror = () => img.style.display = "none";
    openOverlay(productOverlay);
  }

  function openContact(){
    if(productOverlay.classList.contains("open")) closeOverlay(productOverlay);
    openOverlay(contactOverlay);
  }

  $$(".js-contact").forEach(b => b.addEventListener("click", openContact));
  $(".js-product-contact").addEventListener("click", openContact);
  $$(".sheet-close").forEach(b => b.addEventListener("click", () => closeOverlay(b.closest(".overlay"))));
  $$(".overlay").forEach(o => o.addEventListener("click", e => { if(e.target === o) closeOverlay(o); }));

  $("#copyAllBtn").addEventListener("click", () => {
    copyText([
      cfg.companyNameZh,
      `电话：${cfg.phone}`,
      `邮箱：${cfg.email}`,
      `微信：${cfg.wechat}`,
      `WhatsApp：${cfg.whatsapp}`,
      `地址：${cfg.address}`
    ].filter(Boolean).join("\n"), "全部联系方式已复制");
  });

  $("#shareBtn").addEventListener("click", async () => {
    const data = {title: cfg.companyNameZh || "铜合金产品", text: cfg.sloganZh || "", url: location.href};
    if(navigator.share){ try{ await navigator.share(data); }catch(e){} }
    else copyText(location.href, "网址已复制");
  });

  // PWA 安装
  const installBtn = $("#installBtn");
  const installCard = $("#installCard");
  const installCardBtn = $("#installCardBtn");
  const installClose = $("#installClose");
  const installText = $("#installText");
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

  function showInstall(){
    if(standalone) return;
    if(deferredInstallPrompt){
      installBtn.classList.remove("install-hidden");
      installCard.classList.add("show");
    }else if(isIos && !localStorage.getItem("copper_install_dismissed")){
      installText.textContent = "iPhone：Safari 中点“分享” → “添加到主屏幕”。";
      installCardBtn.textContent = "知道了";
      installCard.classList.add("show");
    }
  }

  addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); deferredInstallPrompt = e; showInstall();
  });

  async function installPwa(){
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      try{ await deferredInstallPrompt.userChoice; }catch(e){}
      deferredInstallPrompt = null; installCard.classList.remove("show"); installBtn.classList.add("install-hidden");
    }else if(isIos){
      showToast("Safari：分享 → 添加到主屏幕");
      installCard.classList.remove("show");
    }
  }
  installBtn.addEventListener("click", installPwa);
  installCardBtn.addEventListener("click", installPwa);
  installClose.addEventListener("click", () => {
    installCard.classList.remove("show");
    localStorage.setItem("copper_install_dismissed","1");
  });
  setTimeout(showInstall, 3500);

  // GitHub Pages 兼容：相对路径注册，仓库子目录也可以正常运行
  if("serviceWorker" in navigator){
    addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js", {scope:"./"}).catch(console.warn);
    });
  }
})();