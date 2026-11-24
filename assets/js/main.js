(() => {
  "use strict";

  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const toast = document.getElementById("toast");
  const toastText = toast ? toast.querySelector("p") : null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  let toastTimer = 0;
  let lastFocused = null;

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* --------------------------------------------------------------- mobile nav */
  const focusableSelector = "a[href], button:not([disabled])";
  const menuLinks = mobileMenu ? [...mobileMenu.querySelectorAll(focusableSelector)] : [];
  const activeMobileLink = mobileMenu ? mobileMenu.querySelector(".mobile-link.is-active") : null;

  function setMenu(open, returnFocus = true) {
    body.classList.toggle("nav-open", open);
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    }
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!open));

    if (open) {
      lastFocused = document.activeElement;
      window.setTimeout(() => {
        if (menuLinks.length) (activeMobileLink || menuLinks[0]).focus({ preventScroll: true });
      }, 180);
    } else if (returnFocus && lastFocused instanceof HTMLElement) {
      lastFocused.focus({ preventScroll: true });
      lastFocused = null;
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      setMenu(!body.classList.contains("nav-open"));
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setMenu(false);
      return;
    }

    if (event.key !== "Tab" || !body.classList.contains("nav-open") || !mobileMenu) return;

    const items = [...mobileMenu.querySelectorAll(focusableSelector)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      if (!link.hasAttribute("data-coming")) setMenu(false, false);
    });
  }

  // Keep the desktop and mobile layouts consistent after a resize.
  const handleDesktopChange = (event) => {
    if (event.matches && body.classList.contains("nav-open")) setMenu(false, false);
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", handleDesktopChange);
  else desktopQuery.addListener(handleDesktopChange);

  /* -------------------------------------------------------------------- toast */
  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  document.querySelectorAll("[data-coming]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const section = link.getAttribute("data-coming") || "该板块";
      if (body.classList.contains("nav-open")) setMenu(false, false);
      showToast(section + "正在筹备中，敬请期待。");
    });
  });

  const brand = document.querySelector(".brand");
  if (brand) {
    brand.addEventListener("click", () => {
      if (body.classList.contains("nav-open")) setMenu(false, false);
    });
  }

  /* ------------------------------------------------------------------- header */
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------- parallax */
  const hero = document.querySelector(".hero");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let frame = 0;

  function resetParallax() {
    if (!hero) return;
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    hero.style.setProperty("--ghost-x", "0px");
    hero.style.setProperty("--ghost-y", "0px");
    hero.style.setProperty("--signal-x", "0px");
    hero.style.setProperty("--signal-y", "0px");
  }

  if (hero && finePointer.matches && !reduceMotion.matches) {
    hero.addEventListener("pointermove", (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const nx = x / Math.max(rect.width, 1);
        const ny = y / Math.max(rect.height, 1);

        hero.style.setProperty("--ghost-x", (-nx * 24).toFixed(1) + "px");
        hero.style.setProperty("--ghost-y", (-ny * 8).toFixed(1) + "px");
        hero.style.setProperty("--signal-x", (nx * 18).toFixed(1) + "px");
        hero.style.setProperty("--signal-y", (ny * 14).toFixed(1) + "px");
        frame = 0;
      });
    }, { passive: true });

    hero.addEventListener("pointerleave", resetParallax);
  }

  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) resetParallax();
    });
  }


  /* --------------------------------------------------------- poster carousel */
  const DEFAULT_POSTERS = [
    {
      id: "default-01",
      src: "assets/images/posters/poster-01.webp",
      alt: "FRLSports 2026 新赛季官方海报",
      name: "SEASON 2026",
      kind: "default"
    },
    {
      id: "default-02",
      src: "assets/images/posters/poster-02.webp",
      alt: "FRLSports Speed Is A Story 官方海报",
      name: "SPEED IS A STORY",
      kind: "default"
    },
    {
      id: "default-03",
      src: "assets/images/posters/poster-03.webp",
      alt: "FRLSports Poster Series 2026 官方海报",
      name: "POSTER SERIES",
      kind: "default"
    },
    {
      id: "default-04",
      src: "assets/images/posters/poster-04.webp",
      alt: "FRLSports News And Racing 官方海报",
      name: "NEWS AND RACING",
      kind: "default"
    }
  ];

  const POSTER_MAX = 12;
  const POSTER_AUTO_MS = 6200;
  const POSTER_DB_NAME = "frlsports-content";
  const POSTER_DB_STORE = "site";
  const POSTER_LOCAL_KEY = "frlsports-posters-v1";

  const posterSection = document.querySelector(".poster-section");
  const posterStage = document.getElementById("posterStage");
  const posterTrack = document.getElementById("posterTrack");
  const posterDots = document.getElementById("posterDots");
  const posterPrev = document.getElementById("posterPrev");
  const posterNext = document.getElementById("posterNext");
  const posterCurrent = document.getElementById("posterCurrent");
  const posterTotal = document.getElementById("posterTotal");
  const posterStatus = document.getElementById("posterStatus");
  const posterAutoplay = document.getElementById("posterAutoplay");
  const developerPage = document.getElementById("developerPage");
  const devAccessView = document.getElementById("devAccessView");
  const devConsoleView = document.getElementById("devConsoleView");
  const devWriteFile = document.getElementById("devWriteFile");
  let siteDirectoryHandle = null;
  let siteWriteTimer = 0;
  const devGateForm = document.getElementById("devGateForm");
  const devPassword = document.getElementById("devPassword");
  const devError = document.getElementById("devError");
  const devGrid = document.getElementById("devGrid");
  const devCount = document.getElementById("devCount");
  const devReset = document.getElementById("devReset");
  const devAdd = document.getElementById("devAdd");
  const devDropzone = document.getElementById("devDropzone");
  const devFileInput = document.getElementById("devFileInput");
  const posterWall = document.getElementById("posterWall");
  const wallEmpty = document.getElementById("wallEmpty");
  const newsGrid = document.getElementById("newsGrid");
  const newsEmpty = document.getElementById("newsEmpty");
  const sponsorList = document.getElementById("sponsorList");
  const newsForm = document.getElementById("newsForm");
  const newsTitle = document.getElementById("newsTitle");
  const newsText = document.getElementById("newsText");
  const newsAuthor = document.getElementById("newsAuthor");
  const newsImageInput = document.getElementById("newsImageInput");
  const newsImagePick = document.getElementById("newsImagePick");
  const newsImageClear = document.getElementById("newsImageClear");
  const newsImagePreview = document.getElementById("newsImagePreview");
  const newsError = document.getElementById("newsError");
  const newsCount = document.getElementById("newsCount");
  const newsAdminList = document.getElementById("newsAdminList");
  const galleryPick = document.getElementById("galleryPick");
  const galleryFileInput = document.getElementById("galleryFileInput");
  const galleryAdminGrid = document.getElementById("galleryAdminGrid");
  const galleryCount = document.getElementById("galleryCount");
  const sponsorForm = document.getElementById("sponsorForm");
  const sponsorName = document.getElementById("sponsorName");
  const sponsorUrl = document.getElementById("sponsorUrl");
  const sponsorImageInput = document.getElementById("sponsorImageInput");
  const sponsorImagePick = document.getElementById("sponsorImagePick");
  const sponsorImageClear = document.getElementById("sponsorImageClear");
  const sponsorImagePreview = document.getElementById("sponsorImagePreview");
  const sponsorError = document.getElementById("sponsorError");
  const sponsorCount = document.getElementById("sponsorCount");
  const sponsorAdminList = document.getElementById("sponsorAdminList");
  const sponsorCancelEdit = document.getElementById("sponsorCancelEdit");
  const teamForm = document.getElementById("teamForm");
  const teamName = document.getElementById("teamName");
  const teamNameZh = document.getElementById("teamNameZh");
  const teamIntro = document.getElementById("teamIntro");
  const teamQq = document.getElementById("teamQq");
  const teamLogoInput = document.getElementById("teamLogoInput");
  const teamLogoPick = document.getElementById("teamLogoPick");
  const teamLogoClear = document.getElementById("teamLogoClear");
  const teamLogoPreview = document.getElementById("teamLogoPreview");
  const teamError = document.getElementById("teamError");
  const teamCount = document.getElementById("teamCount");
  const teamAdminList = document.getElementById("teamAdminList");
  const teamCancelEdit = document.getElementById("teamCancelEdit");
  const teamGrid = document.getElementById("teamGrid");
  const teamEmpty = document.getElementById("teamEmpty");
  const productGrid = document.getElementById("productGrid");
  const productEmpty = document.getElementById("productEmpty");
  const productForm = document.getElementById("productForm");
  const productName = document.getElementById("productName");
  const productNameZh = document.getElementById("productNameZh");
  const productPrice = document.getElementById("productPrice");
  const productIntro = document.getElementById("productIntro");
  const productLogoInput = document.getElementById("productLogoInput");
  const productLogoPick = document.getElementById("productLogoPick");
  const productLogoClear = document.getElementById("productLogoClear");
  const productLogoPreview = document.getElementById("productLogoPreview");
  const productImagesInput = document.getElementById("productImagesInput");
  const productImagesPick = document.getElementById("productImagesPick");
  const productImagesClear = document.getElementById("productImagesClear");
  const productImagesPreview = document.getElementById("productImagesPreview");
  const productError = document.getElementById("productError");
  const productCount = document.getElementById("productCount");
  const productAdminList = document.getElementById("productAdminList");
  const productCancelEdit = document.getElementById("productCancelEdit");
  const eventGrid = document.getElementById("eventGrid");
  const eventEmpty = document.getElementById("eventEmpty");
  const eventImportPick = document.getElementById("eventImportPick");
  const eventArchiveInput = document.getElementById("eventArchiveInput");
  const eventCount = document.getElementById("eventCount");
  const eventAdminList = document.getElementById("eventAdminList");
  const detailModal = document.getElementById("detailModal");
  const detailBody = document.getElementById("detailBody");
  const detailClose = document.getElementById("detailClose");
  const devViews = Array.prototype.slice.call(document.querySelectorAll(".dev-view"));
  const devRailLinks = Array.prototype.slice.call(document.querySelectorAll(".dev-rail-link[data-dev-view]"));

  const siteState = {
    news: [],
    gallery: [],
    events: [],
    teams: [],
    products: [],
    sponsors: [],
    ready: false,
    activeView: "posters",
    newsDraftImage: "",
    sponsorDraftImage: "",
    teamDraftImage: "",
    productDraftImage: "",
    productDraftImages: [],
    newsBusy: false,
    galleryBusy: false,
    sponsorBusy: false,
    teamBusy: false,
    productBusy: false,
    teamEditingId: "",
    sponsorEditingId: "",
    productEditingId: ""
  };

  const posterState = {
    posters: DEFAULT_POSTERS.map(function (poster) {
      return Object.assign({}, poster);
    }),
    index: 0,
    autoPlaying: !reduceMotion.matches,
    hovering: false,
    focused: false,
    timer: 0,
    replaceId: null,
    suppressClick: false,
    dbPromise: null,
    storageReady: false,
    devLastFocus: null,
    devScrollY: 0,
    devAuthorized: false,
    resetArmed: false,
    resetTimer: 0
  };

  function padPosterNumber(value) {
    return String(value).padStart(2, "0");
  }

  function sanitizePosterList(value) {
    if (!Array.isArray(value)) return null;

    const seen = Object.create(null);
    const clean = [];

    value.forEach(function (item, index) {
      if (!item || typeof item !== "object") return;
      if (typeof item.src !== "string" || !/^(data:image\/|assets\/)/.test(item.src)) return;

      let id = typeof item.id === "string" && item.id ? item.id : "poster-" + index;
      if (seen[id]) id = id + "-" + index;
      seen[id] = true;

      clean.push({
        id: id,
        src: item.src,
        alt: typeof item.alt === "string" && item.alt ? item.alt : "FRLSports 海报 " + (index + 1),
        name: typeof item.name === "string" && item.name ? item.name : "海报 " + (index + 1),
        kind: item.kind === "default" ? "default" : "custom"
      });
    });

    return clean.length ? clean.slice(0, POSTER_MAX) : null;
  }

  function openPosterDB() {
    if (posterState.dbPromise) return posterState.dbPromise;

    posterState.dbPromise = new Promise(function (resolve, reject) {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB unavailable"));
        return;
      }

      const request = indexedDB.open(POSTER_DB_NAME, 1);

      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains(POSTER_DB_STORE)) {
          db.createObjectStore(POSTER_DB_STORE, { keyPath: "key" });
        }
      };
      request.onsuccess = function () {
        resolve(request.result);
      };
      request.onerror = function () {
        reject(request.error || new Error("IndexedDB open failed"));
      };
      request.onblocked = function () {
        reject(new Error("IndexedDB blocked"));
      };
    });

    return posterState.dbPromise;
  }

  function readLocalPosters() {
    try {
      const raw = window.localStorage.getItem(POSTER_LOCAL_KEY);
      if (!raw) return null;
      return sanitizePosterList(JSON.parse(raw));
    } catch (error) {
      return null;
    }
  }

  function writeLocalPosters(posters) {
    try {
      window.localStorage.setItem(POSTER_LOCAL_KEY, JSON.stringify(posters));
      return true;
    } catch (error) {
      return false;
    }
  }

  async function readPosterStorage() {
    let db = null;

    try {
      db = await openPosterDB();
      const record = await new Promise(function (resolve, reject) {
        const transaction = db.transaction(POSTER_DB_STORE, "readonly");
        const request = transaction.objectStore(POSTER_DB_STORE).get("posters");
        request.onsuccess = function () {
          resolve(request.result || null);
        };
        request.onerror = function () {
          reject(request.error || new Error("IndexedDB read failed"));
        };
      });

      if (record && record.value) {
        const stored = sanitizePosterList(record.value);
        if (stored) return stored;
      }
    } catch (error) {
      db = null;
    }

    const filePosters = window.FRL_SITE_DATA && Array.isArray(window.FRL_SITE_DATA.posters)
      ? sanitizePosterList(window.FRL_SITE_DATA.posters)
      : null;
    if (filePosters) return filePosters;

    return readLocalPosters();
  }

  async function writePosterStorage(posters) {
    const clean = sanitizePosterList(posters);
    if (!clean) return false;

    let db = null;
    try {
      db = await openPosterDB();
    } catch (error) {
      return writeLocalPosters(clean);
    }

    try {
      await new Promise(function (resolve, reject) {
        const transaction = db.transaction(POSTER_DB_STORE, "readwrite");
        transaction.objectStore(POSTER_DB_STORE).put({ key: "posters", value: clean });
        transaction.oncomplete = function () {
          resolve();
        };
        transaction.onerror = function () {
          reject(transaction.error || new Error("IndexedDB write failed"));
        };
        transaction.onabort = function () {
          reject(transaction.error || new Error("IndexedDB write aborted"));
        };
      });

      try {
        window.localStorage.removeItem(POSTER_LOCAL_KEY);
      } catch (error) {
        // The IndexedDB copy is authoritative.
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async function clearPosterStorage() {
    let cleared = true;

    try {
      const db = await openPosterDB();
      await new Promise(function (resolve, reject) {
        const transaction = db.transaction(POSTER_DB_STORE, "readwrite");
        transaction.objectStore(POSTER_DB_STORE).delete("posters");
        transaction.oncomplete = function () {
          resolve();
        };
        transaction.onerror = function () {
          reject(transaction.error || new Error("IndexedDB delete failed"));
        };
        transaction.onabort = function () {
          reject(transaction.error || new Error("IndexedDB delete aborted"));
        };
      });
    } catch (error) {
      // A missing or unavailable IndexedDB store has nothing to clear.
    }

    try {
      window.localStorage.removeItem(POSTER_LOCAL_KEY);
    } catch (error) {
      cleared = false;
    }

    return cleared;
  }

  function localSiteKey(key) {
    return "frlsports-" + key + "-v1";
  }

  function createSiteId(prefix) {
    return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  }

  function safeImageSource(value) {
    return typeof value === "string" && /^(data:image\/|assets\/)/.test(value) ? value : "";
  }

  function sanitizeNews(value) {
    if (!Array.isArray(value)) return null;

    const clean = [];
    const seen = Object.create(null);

    value.forEach(function (item, index) {
      if (!item || typeof item !== "object") return;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const text = typeof item.text === "string" ? item.text.trim() : "";
      if (!title || !text) return;

      let id = typeof item.id === "string" && item.id ? item.id : "news-" + index;
      if (seen[id]) id = id + "-" + index;
      seen[id] = true;

      const date = typeof item.date === "string" && !Number.isNaN(Date.parse(item.date))
        ? item.date
        : new Date().toISOString();

      clean.push({
        id: id,
        title: title.slice(0, 120),
        text: text.slice(0, 2000),
        author: typeof item.author === "string" && item.author.trim() ? item.author.trim().slice(0, 60) : "FRLSports",
        image: safeImageSource(item.image),
        date: date
      });
    });

    return clean.slice(0, 24);
  }

  function sanitizeGallery(value) {
    if (!Array.isArray(value)) return null;

    const clean = [];
    const seen = Object.create(null);

    value.forEach(function (item, index) {
      if (!item || typeof item !== "object") return;
      const src = safeImageSource(item.src);
      if (!src) return;
      const width = Number(item.width);
      const height = Number(item.height);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;

      let id = typeof item.id === "string" && item.id ? item.id : "wall-" + index;
      if (seen[id]) id = id + "-" + index;
      seen[id] = true;

      clean.push({
        id: id,
        src: src,
        alt: typeof item.alt === "string" && item.alt ? item.alt : "FRLSports 其他海报 " + (index + 1),
        width: Math.round(width),
        height: Math.round(height)
      });
    });

    return clean.slice(0, 36);
  }

  function sanitizeSponsors(value) {
    if (!Array.isArray(value)) return null;

    const clean = [];
    const seen = Object.create(null);

    value.forEach(function (item, index) {
      if (!item || typeof item !== "object") return;
      const name = typeof item.name === "string" ? item.name.trim() : "";
      if (!name) return;

      let id = typeof item.id === "string" && item.id ? item.id : "sponsor-" + index;
      if (seen[id]) id = id + "-" + index;
      seen[id] = true;

      let url = typeof item.url === "string" ? item.url.trim() : "";
      if (url) {
        try {
          const parsed = new URL(url);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") url = "";
        } catch (error) {
          url = "";
        }
      }

      clean.push({
        id: id,
        name: name.slice(0, 60),
        image: safeImageSource(item.image),
        url: url.slice(0, 300)
      });
    });

    return clean.slice(0, 12);
  }

  function sanitizeTeams(value) {
    if (!Array.isArray(value)) return null;

    const clean = [];
    const seen = Object.create(null);

    value.forEach(function (item, index) {
      if (!item || typeof item !== "object") return;
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const nameZh = typeof item.nameZh === "string" ? item.nameZh.trim() : "";
      const intro = typeof item.intro === "string" ? item.intro.trim() : "";
      if (!name || !nameZh || !intro) return;

      let id = typeof item.id === "string" && item.id ? item.id : "team-" + index;
      if (seen[id]) id = id + "-" + index;
      seen[id] = true;

      clean.push({
        id: id,
        name: name.slice(0, 80),
        nameZh: nameZh.slice(0, 40),
        intro: intro.slice(0, 600),
        qq: typeof item.qq === "string" ? item.qq.trim().slice(0, 40) : "",
        logo: safeImageSource(item.logo)
      });
    });

    return clean.slice(0, 32);
  }

  function sanitizeProducts(value) {
    if (!Array.isArray(value)) return null;
    const clean = [];
    const seen = Object.create(null);

    value.forEach(function (item, index) {
      if (!item || typeof item !== "object") return;
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const nameZh = typeof item.nameZh === "string" ? item.nameZh.trim() : "";
      const intro = typeof item.intro === "string" ? item.intro.trim() : "";
      if (!name || !nameZh || !intro) return;

      let id = typeof item.id === "string" && item.id ? item.id : "product-" + index;
      if (seen[id]) id = id + "-" + index;
      seen[id] = true;

      clean.push({
        id: id,
        name: name.slice(0, 80),
        nameZh: nameZh.slice(0, 40),
        price: typeof item.price === "string" ? item.price.trim().slice(0, 40) : "",
        intro: intro.slice(0, 600),
        logo: safeImageSource(item.logo),
        images: Array.isArray(item.images)
          ? item.images.map(safeImageSource).filter(Boolean).slice(0, 8)
          : []
      });
    });

    return clean.slice(0, 32);
  }

  const EVENT_CHART_COLORS = ["#ff4657", "#f5c451", "#58d6a9", "#57a7ff", "#c084fc", "#ff9f43", "#35d0d6", "#f472b6"];

  function eventTitle(event) {
    return event.cn_name || event.full_name || event.abbr || "未命名赛事";
  }

  function buildEventChartFallback(seasons, drivers) {
    const labels = [];
    const seriesMap = Object.create(null);
    drivers.forEach(function (driver, index) {
      seriesMap[driver.id] = {
        driver_id: driver.id,
        driver_name: driver.name,
        car_number: driver.number,
        group: driver.group,
        color: driver.group_color || EVENT_CHART_COLORS[index % EVENT_CHART_COLORS.length],
        values: []
      };
    });

    const cumulative = Object.create(null);
    Object.keys(seriesMap).forEach(function (id) { cumulative[id] = 0; });

    seasons.forEach(function (season) {
      (season.rounds || []).forEach(function (rnd, index) {
        labels.push("R" + padPosterNumber(index + 1) + " · " + (rnd.name || "未命名分站"));
        const pointsByDriver = Object.create(null);
        (rnd.results || []).forEach(function (result) {
          pointsByDriver[result.driver_id] = Number(result.points) || 0;
        });
        Object.keys(seriesMap).forEach(function (id) {
          cumulative[id] = (cumulative[id] || 0) + (pointsByDriver[id] || 0);
          seriesMap[id].values.push(Number(cumulative[id].toFixed(2)));
        });
      });
    });

    return { labels: labels, series: Object.keys(seriesMap).map(function (id) { return seriesMap[id]; }) };
  }

  function normalizeEventChart(raw, seasons, drivers) {
    if (!raw || !Array.isArray(raw.labels) || !Array.isArray(raw.series)) {
      return buildEventChartFallback(seasons, drivers);
    }
    const labels = raw.labels.map(function (label) { return String(label || ""); }).slice(0, 80);
    const series = [];
    raw.series.forEach(function (item, index) {
      if (!item || !Array.isArray(item.values)) return;
      series.push({
        driver_id: String(item.driver_id || ""),
        driver_name: String(item.driver_name || ""),
        car_number: String(item.car_number || ""),
        group: String(item.group || ""),
        color: /^#[0-9a-f]{6}$/i.test(String(item.color || "")) ? item.color : EVENT_CHART_COLORS[index % EVENT_CHART_COLORS.length],
        values: item.values.slice(0, labels.length).map(function (value) { return Number(value) || 0; })
      });
    });
    return { labels: labels, series: series };
  }

  function normalizeEventArchive(archive) {
    if (!archive || typeof archive !== "object") return null;
    const rawEvent = archive.event && typeof archive.event === "object" ? archive.event : archive;
    if (!rawEvent || typeof rawEvent !== "object") return null;

    const fullName = String(rawEvent.full_name || rawEvent.fullName || "").trim();
    const cnName = String(rawEvent.cn_name || rawEvent.cnName || "").trim();
    const abbr = String(rawEvent.abbr || "").trim();
    if (!fullName && !cnName && !abbr) return null;

    const groups = Array.isArray(rawEvent.groups) ? rawEvent.groups : (Array.isArray(archive.groups) ? archive.groups : []);
    const teamsRaw = Array.isArray(rawEvent.teams) ? rawEvent.teams : (Array.isArray(archive.teams) ? archive.teams : []);
    const teams = teamsRaw.map(function (team, index) {
      if (!team || typeof team !== "object") return null;
      return {
        id: String(team.id || "team-" + index),
        name: String(team.name || "未命名车队"),
        color: /^#[0-9a-f]{6}$/i.test(String(team.color || "")) ? team.color : EVENT_CHART_COLORS[index % EVENT_CHART_COLORS.length]
      };
    }).filter(Boolean);
    const teamMap = Object.create(null);
    teams.forEach(function (team) { teamMap[team.id] = team; });
    const groupMap = Object.create(null);
    groups.forEach(function (group) {
      if (group && group.id) groupMap[String(group.id)] = group;
    });
    const driversRaw = Array.isArray(archive.drivers) ? archive.drivers : [];
    const drivers = driversRaw.map(function (driver, index) {
      if (!driver || typeof driver !== "object") return null;
      return {
        id: String(driver.id || "driver-" + index),
        name: String(driver.name || "未命名车手"),
        number: String(driver.number || ""),
        group_id: String(driver.group_id || ""),
        group: String(driver.group || ""),
        group_color: String(driver.group_color || ""),
        team_id: String(driver.team_id || ""),
        team: String(driver.team || ""),
        team_color: String(driver.team_color || "")
      };
    }).filter(Boolean);
    drivers.forEach(function (driver) {
      const team = teamMap[driver.team_id];
      const group = groupMap[driver.group_id];
      if (team) {
        if (!driver.team) driver.team = String(team.name || "");
        if (!driver.team_color) driver.team_color = String(team.color || "");
      }
      if (group) {
        if (!driver.group) driver.group = String(group.name || "");
        if (!driver.group_color) driver.group_color = String(group.color || "");
      }
    });

    const seasonsRaw = Array.isArray(archive.seasons) ? archive.seasons : [];
    const seasons = seasonsRaw.map(function (season, seasonIndex) {
      if (!season || typeof season !== "object") return null;
      const rounds = [];
      (Array.isArray(season.rounds) ? season.rounds : []).forEach(function (rnd, roundIndex) {
        if (!rnd || typeof rnd !== "object") return;
        const results = [];
        (Array.isArray(rnd.results) ? rnd.results : []).forEach(function (result) {
          if (!result || typeof result !== "object") return;
          results.push({
            position: Number(result.position) || results.length + 1,
            driver_id: String(result.driver_id || ""),
            driver_name: String(result.driver_name || ""),
            car_number: String(result.car_number || ""),
            group: String(result.group || ""),
            points: Number(result.points) || 0,
            gap: String(result.gap || "")
          });
        });
        rounds.push({
          index: Number(rnd.index) || roundIndex + 1,
          id: String(rnd.id || "round-" + seasonIndex + "-" + roundIndex),
          name: String(rnd.name || "未命名分站"),
          date: String(rnd.date || ""),
          notes: String(rnd.notes || ""),
          results: results
        });
      });
      return {
        id: String(season.id || "season-" + seasonIndex),
        name: String(season.name || "未命名赛季"),
        year: String(season.year || ""),
        rounds: rounds
      };
    }).filter(Boolean);

    const standings = (Array.isArray(archive.standings) ? archive.standings : []).map(function (row, index) {
      if (!row || typeof row !== "object") return null;
      return {
        rank: Number(row.rank) || index + 1,
        driver_id: String(row.driver_id || ""),
        driver_name: String(row.driver_name || ""),
        car_number: String(row.car_number || ""),
        group: String(row.group || ""),
        points: Number(row.points) || 0,
        starts: Number(row.starts) || 0,
        wins: Number(row.wins) || 0,
        podiums: Number(row.podiums) || 0
      };
    }).filter(Boolean);

    const table = (Array.isArray(rawEvent.points_table) ? rawEvent.points_table : []).map(function (value) {
      return Number(value) || 0;
    }).slice(0, 20);
    while (table.length < 20) table.push(0);

    const id = String(rawEvent.id || createSiteId("event"));
    const logo = safeImageSource(rawEvent.logo_data || rawEvent.logo || "");
    return {
      id: id,
      abbr: abbr.slice(0, 20),
      full_name: fullName.slice(0, 120),
      cn_name: cnName.slice(0, 80),
      race_type: String(rawEvent.race_type || "").slice(0, 40),
      intro: String(rawEvent.intro || "").slice(0, 2000),
      logo: logo,
      points_enabled: Boolean(rawEvent.points_enabled),
      points_table: table,
      teams: teams,
      groups: groups.filter(function (group) { return group && typeof group === "object"; }).map(function (group, index) {
        return {
          id: String(group.id || "group-" + index),
          name: String(group.name || ""),
          color: /^#[0-9a-f]{6}$/i.test(String(group.color || "")) ? group.color : EVENT_CHART_COLORS[index % EVENT_CHART_COLORS.length]
        };
      }),
      drivers: drivers,
      seasons: seasons,
      standings: standings,
      points_chart: normalizeEventChart(archive.points_chart, seasons, drivers),
      imported_at: String(archive.exported_at || new Date().toISOString())
    };
  }

  function sanitizeEvents(value) {
    if (!Array.isArray(value)) return null;
    const clean = [];
    const seen = Object.create(null);
    value.forEach(function (item) {
      const event = normalizeEventArchive(item);
      if (!event) return;
      let id = event.id;
      if (seen[id]) id = id + "-" + clean.length;
      seen[id] = true;
      event.id = id;
      clean.push(event);
    });
    return clean.slice(0, 12);
  }

  async function readSiteCollection(key) {
    let db = null;

    try {
      db = await openPosterDB();
      const record = await new Promise(function (resolve, reject) {
        const transaction = db.transaction(POSTER_DB_STORE, "readonly");
        const request = transaction.objectStore(POSTER_DB_STORE).get(key);
        request.onsuccess = function () {
          resolve(request.result || null);
        };
        request.onerror = function () {
          reject(request.error || new Error("IndexedDB read failed"));
        };
      });

      if (record && record.value) return record.value;
    } catch (error) {
      db = null;
    }

    try {
      const raw = window.localStorage.getItem(localSiteKey(key));
      if (raw) return JSON.parse(raw);
    } catch (error) {
      // Fall through to the static content file.
    }

    if (window.FRL_SITE_DATA && Object.prototype.hasOwnProperty.call(window.FRL_SITE_DATA, key)) {
      const fileValue = window.FRL_SITE_DATA[key];
      if (Array.isArray(fileValue)) return fileValue;
    }

    return null;
  }

  async function writeSiteCollection(key, value) {
    let db = null;
    try {
      db = await openPosterDB();
    } catch (error) {
      try {
        window.localStorage.setItem(localSiteKey(key), JSON.stringify(value));
        return true;
      } catch (fallbackError) {
        return false;
      }
    }

    try {
      await new Promise(function (resolve, reject) {
        const transaction = db.transaction(POSTER_DB_STORE, "readwrite");
        transaction.objectStore(POSTER_DB_STORE).put({ key: key, value: value });
        transaction.oncomplete = function () {
          resolve();
        };
        transaction.onerror = function () {
          reject(transaction.error || new Error("IndexedDB write failed"));
        };
        transaction.onabort = function () {
          reject(transaction.error || new Error("IndexedDB write aborted"));
        };
      });

      try {
        window.localStorage.removeItem(localSiteKey(key));
      } catch (error) {
        // IndexedDB is authoritative when available.
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function posterOffset(index) {
    const total = posterState.posters.length;
    let offset = index - posterState.index;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  }

  function buildPosterSlides() {
    if (!posterTrack || !posterDots) return;

    posterTrack.innerHTML = "";
    posterDots.innerHTML = "";

    posterState.posters.forEach(function (poster, index) {
      const card = document.createElement("figure");
      card.className = "poster-card";
      card.dataset.index = String(index);
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slide");
      card.setAttribute("aria-label", "第 " + (index + 1) + " 张海报");

      const image = document.createElement("img");
      image.src = poster.src;
      image.alt = poster.alt || "FRLSports 海报 " + (index + 1);
      image.draggable = false;
      image.decoding = "async";
      if (index < 2) image.loading = "eager";
      else image.loading = "lazy";

      card.append(image);
      posterTrack.append(card);

      const dot = document.createElement("button");
      dot.className = "poster-dot";
      dot.type = "button";
      dot.dataset.index = String(index);
      dot.setAttribute("aria-label", "查看第 " + (index + 1) + " 张海报");
      posterDots.append(dot);
    });

    if (posterTotal) posterTotal.textContent = padPosterNumber(posterState.posters.length);
  }

  function updatePosterAutoplayButton() {
    if (!posterAutoplay) return;
    const paused = !posterState.autoPlaying;
    posterAutoplay.classList.toggle("is-paused", paused);
    posterAutoplay.setAttribute("aria-label", paused ? "开始自动播放" : "暂停自动播放");
  }

  function shouldAutoPlayPosters() {
    return posterState.autoPlaying &&
      posterState.posters.length > 1 &&
      !posterState.hovering &&
      (!posterState.focused || document.activeElement === posterAutoplay) &&
      !document.hidden &&
      !body.classList.contains("dev-mode") &&
      !body.classList.contains("nav-open");
  }

  function schedulePosterAuto() {
    window.clearTimeout(posterState.timer);
    if (!shouldAutoPlayPosters()) return;

    posterState.timer = window.setTimeout(function () {
      setPoster(posterState.index + 1, { user: false });
    }, POSTER_AUTO_MS);
  }

  function updatePosterCarousel(options) {
    if (!posterTrack) return;

    const total = posterState.posters.length;
    if (!total) return;

    const announce = Boolean(options && options.announce);
    posterState.index = ((posterState.index % total) + total) % total;

    const cards = Array.prototype.slice.call(posterTrack.children);
    cards.forEach(function (card, index) {
      const offset = posterOffset(index);
      let role = "hidden-prev";

      if (offset === 0) role = "active";
      else if (offset === -1) role = "prev";
      else if (offset === 1) role = "next";
      else if (offset < 0) role = "hidden-prev";
      else role = "hidden-next";

      card.dataset.role = role;
      card.setAttribute("aria-hidden", role === "active" ? "false" : "true");
    });

    const dots = posterDots ? Array.prototype.slice.call(posterDots.children) : [];
    dots.forEach(function (dot, index) {
      if (index === posterState.index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    if (posterCurrent) posterCurrent.textContent = padPosterNumber(posterState.index + 1);
    if (posterTotal) posterTotal.textContent = padPosterNumber(total);

    if (announce && posterStatus) {
      const current = posterState.posters[posterState.index];
      posterStatus.textContent = "第 " + (posterState.index + 1) + " 张，共 " + total + " 张。" +
        (current && current.alt ? current.alt : "");
    }

    updatePosterAutoplayButton();
    schedulePosterAuto();
  }

  function refreshPosterCarousel(preferredId) {
    if (!posterTrack || !posterState.posters.length) return;

    let nextIndex = posterState.index;
    if (preferredId) {
      const found = posterState.posters.findIndex(function (poster) {
        return poster.id === preferredId;
      });
      if (found >= 0) nextIndex = found;
    }

    posterState.index = nextIndex;
    buildPosterSlides();
    updatePosterCarousel({ announce: false });
  }

  function setPoster(index, options) {
    const total = posterState.posters.length;
    if (!total) return;

    const next = ((index % total) + total) % total;
    const user = !(options && options.user === false);

    if (next === posterState.index) {
      schedulePosterAuto();
      return;
    }

    posterState.index = next;
    updatePosterCarousel({ announce: user });
  }

  function initPosterCarousel() {
    if (!posterStage || !posterTrack) return;

    refreshPosterCarousel();

    if (posterPrev) {
      posterPrev.addEventListener("click", function () {
        setPoster(posterState.index - 1, { user: true });
      });
    }

    if (posterNext) {
      posterNext.addEventListener("click", function () {
        setPoster(posterState.index + 1, { user: true });
      });
    }

    if (posterDots) {
      posterDots.addEventListener("click", function (event) {
        const dot = event.target.closest(".poster-dot");
        if (!dot) return;
        setPoster(Number(dot.dataset.index), { user: true });
      });
    }

    posterTrack.addEventListener("click", function (event) {
      if (posterState.suppressClick) {
        posterState.suppressClick = false;
        return;
      }

      const card = event.target.closest(".poster-card");
      if (!card) return;
      const index = Number(card.dataset.index);
      if (card.dataset.role !== "active") {
        setPoster(index, { user: true });
        return;
      }
      const poster = posterState.posters[index] || posterState.posters[posterState.index];
      if (poster) openPosterLightbox(poster.src, poster.alt, poster.name, "官方海报 / " + padPosterNumber(index + 1));
    });

    posterStage.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPoster(posterState.index - 1, { user: true });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setPoster(posterState.index + 1, { user: true });
      } else if (event.key === "Home") {
        event.preventDefault();
        setPoster(0, { user: true });
      } else if (event.key === "End") {
        event.preventDefault();
        setPoster(posterState.posters.length - 1, { user: true });
      }
    });

    if (posterAutoplay) {
      posterAutoplay.addEventListener("click", function () {
        posterState.autoPlaying = !posterState.autoPlaying;
        updatePosterAutoplayButton();
        schedulePosterAuto();
      });
    }

    if (posterSection) {
      posterSection.addEventListener("mouseenter", function () {
        posterState.hovering = true;
        schedulePosterAuto();
      });

      posterSection.addEventListener("mouseleave", function () {
        posterState.hovering = false;
        schedulePosterAuto();
      });

      posterSection.addEventListener("focusin", function () {
        posterState.focused = true;
        schedulePosterAuto();
      });

      posterSection.addEventListener("focusout", function (event) {
        if (!posterSection.contains(event.relatedTarget)) {
          posterState.focused = false;
          schedulePosterAuto();
        }
      });
    }

    let dragStart = null;
    posterStage.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest("button")) return;
      dragStart = { x: event.clientX, y: event.clientY };
      posterState.suppressClick = false;
      window.clearTimeout(posterState.timer);
    });

    posterStage.addEventListener("pointermove", function (event) {
      if (!dragStart) return;
      const dx = Math.abs(event.clientX - dragStart.x);
      const dy = Math.abs(event.clientY - dragStart.y);
      if (dx > 8 && dx > dy) posterStage.classList.add("is-dragging");
    });

    window.addEventListener("pointerup", function (event) {
      if (!dragStart) return;

      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      dragStart = null;
      posterStage.classList.remove("is-dragging");

      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) {
        setPoster(posterState.index + (dx < 0 ? 1 : -1), { user: true });
        posterState.suppressClick = true;
        window.setTimeout(function () {
          posterState.suppressClick = false;
        }, 80);
      } else {
        schedulePosterAuto();
      }
    });

    posterStage.addEventListener("pointercancel", function () {
      dragStart = null;
      posterStage.classList.remove("is-dragging");
      schedulePosterAuto();
    });

    document.addEventListener("visibilitychange", function () {
      schedulePosterAuto();
    });

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", function (event) {
        if (event.matches) {
          posterState.autoPlaying = false;
          updatePosterAutoplayButton();
        }
        schedulePosterAuto();
      });
    }

    readPosterStorage().then(function (stored) {
      if (stored && stored.length) {
        const activeId = posterState.posters[posterState.index] ? posterState.posters[posterState.index].id : "";
        posterState.posters = stored;
        refreshPosterCarousel(activeId);
      }
      posterState.storageReady = true;
    }).catch(function () {
      posterState.storageReady = true;
    });
  }

  /* ------------------------------------------------------- developer mode */
  function isTypingTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  }

  function restoreDevFocus() {
    const target = posterState.devLastFocus;
    posterState.devLastFocus = null;

    if (target instanceof HTMLElement && document.contains(target) && target !== document.body) {
      window.setTimeout(function () {
        target.focus({ preventScroll: true });
      }, 40);
    } else if (posterStage) {
      window.setTimeout(function () {
        posterStage.focus({ preventScroll: true });
      }, 40);
    }
  }

  function disarmDevReset() {
    posterState.resetArmed = false;
    window.clearTimeout(posterState.resetTimer);
    if (devReset) {
      devReset.classList.remove("is-armed");
      devReset.textContent = "恢复默认";
    }
  }

  function showDevAccess() {
    if (!devAccessView || !devConsoleView) return;
    posterState.devAuthorized = false;
    devAccessView.hidden = false;
    devConsoleView.hidden = true;
    if (devWriteFile) devWriteFile.hidden = true;
    if (devDropzone) devDropzone.hidden = true;
    devGateForm.classList.remove("is-error");
    devError.textContent = "";
    devPassword.value = "";

    window.setTimeout(function () {
      devPassword.focus({ preventScroll: true });
    }, 70);
  }

  function showDevConsole() {
    if (!devAccessView || !devConsoleView) return;
    posterState.devAuthorized = true;
    devAccessView.hidden = true;
    devConsoleView.hidden = false;
    if (devWriteFile) devWriteFile.hidden = false;
    if (devDropzone) devDropzone.hidden = true;
    disarmDevReset();
    switchDevView("posters");
    renderDevGrid();

    window.setTimeout(function () {
      const target = devAdd || devGrid.querySelector("button, input, a[href]");
      if (target) target.focus({ preventScroll: true });
    }, 70);
  }

  function openDeveloperPage() {
    if (!developerPage || !developerPage.hidden) return;
    if (!posterState.storageReady || !siteState.ready) {
      showToast("内容数据加载中，请稍候。");
      return;
    }

    if (body.classList.contains("nav-open")) setMenu(false, false);

    posterState.devLastFocus = document.activeElement;
    posterState.devScrollY = window.scrollY;
    developerPage.hidden = false;
    body.classList.add("dev-mode");
    window.clearTimeout(posterState.timer);
    showDevAccess();
    window.scrollTo(0, 0);
  }

  function closeDeveloperPage() {
    if (!developerPage || developerPage.hidden) return;

    developerPage.hidden = true;
    body.classList.remove("dev-mode");
    posterState.devAuthorized = false;
    if (devDropzone) devDropzone.hidden = true;
    disarmDevReset();
    window.scrollTo(0, posterState.devScrollY || 0);
    schedulePosterAuto();
    restoreDevFocus();
  }

  function makeDevAction(label, action, extraClass, ariaLabel) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dev-action" + (extraClass ? " " + extraClass : "");
    button.dataset.action = action;
    button.textContent = label;
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    return button;
  }

  function renderDevGrid() {
    if (!devGrid) return;

    devGrid.innerHTML = "";
    if (devCount) devCount.textContent = posterState.posters.length + " / " + POSTER_MAX + " 张海报";

    posterState.posters.forEach(function (poster, index) {
      const card = document.createElement("article");
      card.className = "dev-card";
      card.dataset.id = poster.id;

      const thumb = document.createElement("div");
      thumb.className = "dev-thumb";

      const image = document.createElement("img");
      image.src = poster.src;
      image.alt = poster.alt || poster.name;
      image.loading = "lazy";
      thumb.append(image);

      const number = document.createElement("span");
      number.className = "dev-num";
      number.textContent = padPosterNumber(index + 1);
      thumb.append(number);

      const info = document.createElement("div");
      info.className = "dev-card__info";
      const title = document.createElement("strong");
      title.textContent = poster.name || "海报 " + (index + 1);
      const meta = document.createElement("span");
      meta.textContent = (poster.kind === "default" ? "默认海报" : "自定义") + " · 4:3";
      info.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "dev-card__actions";

      const replace = makeDevAction("替换", "replace", "", "替换这张海报");
      const remove = makeDevAction("删除", "delete", "dev-action--delete", "删除这张海报");
      const up = makeDevAction("↑", "up", "", "上移海报");
      const down = makeDevAction("↓", "down", "", "下移海报");

      up.disabled = index === 0;
      down.disabled = index === posterState.posters.length - 1;
      remove.disabled = posterState.posters.length <= 1;
      actions.append(replace, remove, up, down);

      card.append(thumb, info, actions);
      devGrid.append(card);
    });

    const add = document.createElement("button");
    add.type = "button";
    add.className = "dev-add-card dev-add-card--wide";
    add.dataset.action = "add";
    add.disabled = posterState.posters.length >= POSTER_MAX;

    const plus = document.createElement("span");
    plus.className = "dev-plus";
    plus.textContent = "+";
    const addTitle = document.createElement("strong");
    addTitle.textContent = add.disabled ? "已达上限" : "添加海报";
    const addHint = document.createElement("small");
    addHint.textContent = "JPG / PNG / WEBP · 4:3 · 支持拖入";

    add.title = "点击选择，或直接拖入多张图片";
    add.append(plus, addTitle, addHint);
    devGrid.append(add);

    if (devAdd) devAdd.disabled = posterState.posters.length >= POSTER_MAX;
  }

  function cleanPosterName(filename) {
    const name = String(filename || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();
    return name.slice(0, 36) || "自定义海报";
  }

  function processPosterImage(file, id) {
    return new Promise(function (resolve, reject) {
      const isImage = file && (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name));
      if (!isImage) {
        reject(new Error("Not an image"));
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = function () {
        try {
          const width = 1200;
          const height = 900;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas unavailable");

          context.fillStyle = "#050506";
          context.fillRect(0, 0, width, height);

          const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
          const drawWidth = image.naturalWidth * scale;
          const drawHeight = image.naturalHeight * scale;
          context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

          let src = canvas.toDataURL("image/webp", 0.9);
          if (!src.startsWith("data:image/webp")) {
            src = canvas.toDataURL("image/jpeg", 0.9);
          }

          URL.revokeObjectURL(objectUrl);
          const name = cleanPosterName(file.name);

          resolve({
            id: id || "poster-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
            src: src,
            alt: name + " 官方海报",
            name: name,
            kind: "custom"
          });
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };

      image.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Image decode failed"));
      };

      image.src = objectUrl;
    });
  }

  function isImageFile(file) {
    return Boolean(file && (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name)));
  }

  function decodeImageFile(file) {
    return new Promise(function (resolve, reject) {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Image decode failed"));
      };
      image.src = objectUrl;
    });
  }

  function canvasImageData(canvas) {
    let src = canvas.toDataURL("image/webp", 0.9);
    if (!src.startsWith("data:image/webp")) {
      src = canvas.toDataURL("image/png");
    }
    return src;
  }

  async function processNewsImage(file) {
    const image = await decodeImageFile(file);
    const width = 1280;
    const height = 720;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");

    context.fillStyle = "#050506";
    context.fillRect(0, 0, width, height);

    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

    return canvasImageData(canvas);
  }

  async function processGalleryImage(file) {
    const image = await decodeImageFile(file);
    const maxWidth = 1600;
    const maxHeight = 2000;
    const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(image, 0, 0, width, height);

    const name = cleanPosterName(file.name);
    return {
      id: createSiteId("wall"),
      src: canvasImageData(canvas),
      alt: name + " 其他海报",
      width: width,
      height: height
    };
  }

  async function processSponsorLogo(file) {
    const image = await decodeImageFile(file);
    const maxWidth = 600;
    const maxHeight = 240;
    const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(image, 0, 0, width, height);

    return canvasImageData(canvas);
  }

  async function processProductLogo(file) {
    return processTeamLogo(file);
  }

  async function processProductIntroImage(file) {
    const item = await processGalleryImage(file);
    return item.src;
  }

  async function processTeamLogo(file) {
    const image = await decodeImageFile(file);
    const maxWidth = 800;
    const maxHeight = 800;
    const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(image, 0, 0, width, height);

    return canvasImageData(canvas);
  }

  async function commitPosters(nextPosters, focusId) {
    const saved = await writePosterStorage(nextPosters);
    posterState.posters = nextPosters;
    refreshPosterCarousel(focusId);
    renderDevGrid();
    if (!saved) showToast("海报已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
  }

  async function handlePosterFiles(files, replaceId) {
    const list = Array.prototype.slice.call(files).filter(function (file) {
      return file && (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name));
    });

    if (!list.length) {
      showToast("请选择图片文件。");
      return;
    }

    if (replaceId) {
      const index = posterState.posters.findIndex(function (poster) {
        return poster.id === replaceId;
      });
      if (index < 0) return;

      showToast("正在处理海报…");
      try {
        const processed = await processPosterImage(list[0], replaceId);
        const next = posterState.posters.slice();
        next[index] = processed;
        await commitPosters(next, processed.id);
        showToast("海报已替换。");
      } catch (error) {
        showToast("图片处理失败，请换一张图片重试。");
      }
      return;
    }

    const remaining = POSTER_MAX - posterState.posters.length;
    if (remaining <= 0) {
      showToast("最多只能保留 " + POSTER_MAX + " 张海报。");
      return;
    }

    const accepted = list.slice(0, remaining);
    showToast("正在处理 " + accepted.length + " 张海报…");

    try {
      const created = [];
      for (const file of accepted) {
        created.push(await processPosterImage(file));
      }

      const next = posterState.posters.concat(created);
      await commitPosters(next, created[0].id);
      showToast(created.length + " 张海报已添加" + (list.length > accepted.length ? "，已达上限。" : "。"));
    } catch (error) {
      showToast("图片处理失败，请重试。");
    }
  }

  async function deletePoster(id) {
    if (posterState.posters.length <= 1) {
      showToast("至少需要保留一张海报。");
      return;
    }

    const index = posterState.posters.findIndex(function (poster) {
      return poster.id === id;
    });
    if (index < 0) return;

    const currentId = posterState.posters[posterState.index] ? posterState.posters[posterState.index].id : "";
    const next = posterState.posters.slice();
    next.splice(index, 1);
    const nextFocus = currentId === id ? next[Math.min(index, next.length - 1)].id : currentId;
    await commitPosters(next, nextFocus);
    showToast("海报已删除。");
  }

  async function movePoster(id, direction) {
    const index = posterState.posters.findIndex(function (poster) {
      return poster.id === id;
    });
    const target = index + direction;
    if (index < 0 || target < 0 || target >= posterState.posters.length) return;

    const currentId = posterState.posters[posterState.index] ? posterState.posters[posterState.index].id : "";
    const next = posterState.posters.slice();
    const moved = next.splice(index, 1)[0];
    next.splice(target, 0, moved);
    await commitPosters(next, currentId);
    showToast("海报顺序已更新。");
  }

  async function resetPosters() {
    const cleared = await clearPosterStorage();
    posterState.posters = DEFAULT_POSTERS.map(function (poster) {
      return Object.assign({}, poster);
    });
    refreshPosterCarousel(DEFAULT_POSTERS[0].id);
    renderDevGrid();
    disarmDevReset();
    showToast(cleared ? "已恢复默认海报。" : "已恢复默认海报，但旧缓存可能未完全清除。");
  }

  function openPosterFilePicker(replaceId) {
    if (!devFileInput) return;
    posterState.replaceId = replaceId;
    devFileInput.multiple = !replaceId;
    devFileInput.value = "";
    devFileInput.click();
  }

  function bindImageDrop(input, zone) {
    if (!input || !zone) return;
    const picker = zone.closest(".dev-image-picker") || zone;
    const setDrag = function (active) {
      zone.classList.toggle("is-dragover", active);
      picker.classList.toggle("is-dragover", active);
    };
    ["dragenter", "dragover"].forEach(function (name) {
      zone.addEventListener(name, function (event) {
        if (!event.dataTransfer) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
        setDrag(true);
      });
    });
    ["dragleave", "dragend"].forEach(function (name) {
      zone.addEventListener(name, function (event) {
        if (name === "dragleave" && event.relatedTarget && zone.contains(event.relatedTarget)) return;
        setDrag(false);
      });
    });
    zone.addEventListener("drop", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setDrag(false);
      const files = Array.prototype.slice.call((event.dataTransfer && event.dataTransfer.files) || []);
      const images = files.filter(isImageFile);
      if (!images.length) {
        showToast("请拖入图片文件。");
        return;
      }
      const transfer = new DataTransfer();
      images.forEach(function (file) { transfer.items.add(file); });
      input.files = transfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  function initImageDrops() {
    bindImageDrop(newsImageInput, newsImagePreview);
    bindImageDrop(teamLogoInput, teamLogoPreview);
    bindImageDrop(productLogoInput, productLogoPreview);
    bindImageDrop(productImagesInput, productImagesPreview);
    bindImageDrop(sponsorImageInput, sponsorImagePreview);
    bindImageDrop(galleryFileInput, document.querySelector('[data-dev-view="gallery"] .dev-gallery-grid'));
  }

  function initPosterDrop() {
    if (!developerPage || !devConsoleView || !devDropzone) return;

    function canDrop() {
      return !developerPage.hidden && !devConsoleView.hidden && siteState.activeView === "posters";
    }

    function isFileDrag(event) {
      const types = event.dataTransfer && event.dataTransfer.types;
      return Boolean(types && Array.prototype.indexOf.call(types, "Files") >= 0);
    }

    function showDropzone() {
      if (canDrop()) devDropzone.hidden = false;
    }

    function hideDropzone() {
      devDropzone.hidden = true;
    }

    developerPage.addEventListener("dragenter", function (event) {
      if (!canDrop() || !isFileDrag(event)) return;
      event.preventDefault();
      showDropzone();
    });

    developerPage.addEventListener("dragover", function (event) {
      if (!canDrop() || !isFileDrag(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      showDropzone();
    });

    developerPage.addEventListener("dragleave", function (event) {
      if (!event.relatedTarget || !developerPage.contains(event.relatedTarget)) {
        hideDropzone();
      }
    });

    developerPage.addEventListener("drop", function (event) {
      if (!canDrop() || !isFileDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      hideDropzone();
      const files = Array.prototype.slice.call(event.dataTransfer.files || []);
      if (files.length) handlePosterFiles(files, null);
    });

    document.addEventListener("dragover", function (event) {
      if (developerPage && !developerPage.hidden && isFileDrag(event)) event.preventDefault();
    });

    document.addEventListener("drop", function (event) {
      if (developerPage && !developerPage.hidden && isFileDrag(event)) event.preventDefault();
    });

    window.addEventListener("dragend", hideDropzone);
    window.addEventListener("blur", hideDropzone);
  }

  function initPosterDev() {
    if (!developerPage || !devGateForm || !devAccessView || !devConsoleView) return;

    document.addEventListener("keydown", function (event) {
      if (!event.altKey || !event.shiftKey) return;
      if (event.code !== "KeyC" && String(event.key).toLowerCase() !== "c") return;
      if (isTypingTarget(event.target)) return;
      if (!developerPage.hidden) return;
      event.preventDefault();
      openDeveloperPage();
    });

    document.querySelectorAll("[data-dev-back]").forEach(function (element) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        closeDeveloperPage();
      });
    });

    devGateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (devPassword.value === "zxcvbnm") {
        devError.textContent = "";
        devGateForm.classList.remove("is-error");
        devPassword.value = "";
        showDevConsole();
        return;
      }

      devError.textContent = "访问密码错误，请重试。";
      devGateForm.classList.remove("is-error");
      void devGateForm.offsetWidth;
      devGateForm.classList.add("is-error");
      devPassword.select();
    });

    if (devPassword) {
      devPassword.addEventListener("input", function () {
        devError.textContent = "";
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && developerPage && !developerPage.hidden) {
        closeDeveloperPage();
      }
    });

    if (devGrid) {
      devGrid.addEventListener("click", function (event) {
        const add = event.target.closest(".dev-add-card");
        if (add && !add.disabled) {
          openPosterFilePicker(null);
          return;
        }

        const button = event.target.closest(".dev-action");
        if (!button || button.disabled) return;

        const card = button.closest(".dev-card");
        if (!card) return;
        const id = card.dataset.id;
        const action = button.dataset.action;

        if (action === "replace") openPosterFilePicker(id);
        else if (action === "delete") deletePoster(id);
        else if (action === "up") movePoster(id, -1);
        else if (action === "down") movePoster(id, 1);
      });
    }

    if (devFileInput) {
      devFileInput.addEventListener("change", function () {
        const files = Array.prototype.slice.call(devFileInput.files || []);
        const replaceId = posterState.replaceId;
        posterState.replaceId = null;
        devFileInput.value = "";
        if (files.length) handlePosterFiles(files, replaceId);
      });
    }

    if (devAdd) {
      devAdd.addEventListener("click", function () {
        if (posterState.posters.length >= POSTER_MAX) {
          showToast("最多只能保留 " + POSTER_MAX + " 张海报。");
          return;
        }
        openPosterFilePicker(null);
      });
    }

    if (devReset) {
      devReset.addEventListener("click", function () {
        if (!posterState.resetArmed) {
          posterState.resetArmed = true;
          devReset.classList.add("is-armed");
          devReset.textContent = "再次点击确认";
          window.clearTimeout(posterState.resetTimer);
          posterState.resetTimer = window.setTimeout(disarmDevReset, 3000);
          return;
        }

        resetPosters();
      });
    }

    renderDevGrid();
  }

  function formatNewsDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.getFullYear() + "." +
      String(date.getMonth() + 1).padStart(2, "0") + "." +
      String(date.getDate()).padStart(2, "0");
  }

  function siteAdminEmpty(kicker, text) {
    const empty = document.createElement("div");
    empty.className = "dev-admin-empty";
    const label = document.createElement("span");
    label.textContent = kicker;
    const copy = document.createElement("p");
    copy.textContent = text;
    empty.append(label, copy);
    return empty;
  }

  function renderPosterWall() {
    if (!posterWall) return;

    posterWall.innerHTML = "";
    const items = siteState.gallery;
    const hasItems = items.length > 0;
    posterWall.hidden = !hasItems;
    if (wallEmpty) wallEmpty.hidden = hasItems;
    if (!hasItems) return;

    items.forEach(function (item, index) {
      const figure = document.createElement("figure");
      figure.className = "wall-item is-zoomable";
      figure.dataset.id = item.id;
      figure.dataset.wallOpen = item.id;
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", item.alt + "，查看大图");

      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      image.width = item.width;
      image.height = item.height;
      image.loading = index < 4 ? "eager" : "lazy";
      image.decoding = "async";

      figure.append(image);
      posterWall.append(figure);
    });
  }

  function renderNewsSection() {
    if (!newsGrid) return;

    newsGrid.innerHTML = "";
    const items = siteState.news;
    const hasItems = items.length > 0;
    newsGrid.hidden = !hasItems;
    if (newsEmpty) newsEmpty.hidden = hasItems;
    if (!hasItems) return;

    items.forEach(function (item, index) {
      const card = document.createElement("article");
      card.className = "news-card is-clickable";
      card.dataset.id = item.id;
      card.dataset.newsOpen = item.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", item.title + "，查看新闻详情");

      const media = document.createElement("div");
      media.className = "news-card__media";
      if (item.image) {
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.title;
        image.loading = index < 2 ? "eager" : "lazy";
        media.append(image);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "news-card__placeholder";
        const mark = document.createElement("strong");
        mark.textContent = "NAR";
        const label = document.createElement("span");
        label.textContent = "NEWS / NO IMAGE";
        placeholder.append(mark, label);
        media.append(placeholder);
      }

      const body = document.createElement("div");
      body.className = "news-card__body";

      const meta = document.createElement("div");
      meta.className = "news-meta";
      const indexLabel = document.createElement("span");
      indexLabel.textContent = "NEWS / " + padPosterNumber(index + 1);
      const dateLabel = document.createElement("span");
      dateLabel.textContent = formatNewsDate(item.date);
      meta.append(indexLabel, dateLabel);

      const title = document.createElement("h3");
      title.textContent = item.title;

      const text = document.createElement("p");
      text.className = "news-card__text";
      text.textContent = item.text;

      const author = document.createElement("div");
      author.className = "news-card__author";
      const signLabel = document.createElement("span");
      signLabel.textContent = "SIGNED /";
      const signName = document.createElement("b");
      signName.textContent = item.author;
      author.append(signLabel, signName);

      body.append(meta, title, text, author);
      card.append(media, body);
      newsGrid.append(card);
    });
  }

  function renderSponsorBar() {
    if (!sponsorList) return;

    sponsorList.innerHTML = "";
    siteState.sponsors.forEach(function (sponsor) {
      if (!sponsor.image) return;

      const tag = sponsor.url ? "a" : "div";
      const item = document.createElement(tag);
      item.className = "sponsor-item";
      if (sponsor.url) {
        item.href = sponsor.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
        item.title = sponsor.name;
      }

      const image = document.createElement("img");
      image.src = sponsor.image;
      image.alt = sponsor.name;
      image.loading = "lazy";
      item.append(image);
      sponsorList.append(item);
    });
  }

  function renderTeamsPage() {
    if (!teamGrid) return;

    teamGrid.innerHTML = "";
    const items = siteState.teams;
    const hasItems = items.length > 0;
    teamGrid.hidden = !hasItems;
    if (teamEmpty) teamEmpty.hidden = hasItems;
    if (!hasItems) return;

    items.forEach(function (team, index) {
      const card = document.createElement("article");
      card.className = "team-card is-clickable";
      card.dataset.id = team.id;
      card.dataset.teamOpen = team.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", team.name + "，查看车队详情");

      const logo = document.createElement("div");
      logo.className = "team-card__logo";
      if (team.logo) {
        const image = document.createElement("img");
        image.src = team.logo;
        image.alt = team.name + " Logo";
        image.loading = index < 4 ? "eager" : "lazy";
        logo.append(image);
      } else {
        const placeholder = document.createElement("span");
        placeholder.textContent = team.name.slice(0, 2).toUpperCase();
        logo.append(placeholder);
      }

      const body = document.createElement("div");
      body.className = "team-card__body";

      const top = document.createElement("div");
      top.className = "team-card__top";
      const number = document.createElement("span");
      number.textContent = "TEAM / " + padPosterNumber(index + 1);
      top.append(number);

      const name = document.createElement("h2");
      name.textContent = team.name;

      const nameZh = document.createElement("p");
      nameZh.className = "team-card__zh";
      nameZh.textContent = team.nameZh;

      const intro = document.createElement("p");
      intro.className = "team-card__intro";
      intro.textContent = team.intro;

      body.append(top, name, nameZh, intro);

      if (team.qq) {
        const qq = document.createElement("div");
        qq.className = "team-card__qq";
        const label = document.createElement("span");
        label.textContent = "QQ GROUP";
        const value = document.createElement("strong");
        value.textContent = team.qq;
        qq.append(label, value);
        body.append(qq);
      }

      card.append(logo, body);
      teamGrid.append(card);
    });
  }

  function renderEventsPage() {
    if (!eventGrid) return;

    eventGrid.innerHTML = "";
    const items = siteState.events;
    const hasItems = items.length > 0;
    eventGrid.hidden = !hasItems;
    if (eventEmpty) eventEmpty.hidden = hasItems;
    if (!hasItems) return;

    items.forEach(function (event) {
      const card = document.createElement("article");
      card.className = "event-card";
      card.dataset.eventOpen = event.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", eventTitle(event) + "，查看详情");

      const logo = document.createElement("div");
      logo.className = "event-card__logo";
      if (event.logo) {
        const image = document.createElement("img");
        image.src = event.logo;
        image.alt = eventTitle(event) + " Logo";
        image.loading = "lazy";
        logo.append(image);
      } else {
        const fallback = document.createElement("span");
        fallback.textContent = (event.abbr || "FRLS").slice(0, 4);
        logo.append(fallback);
      }

      const name = document.createElement("h2");
      name.textContent = eventTitle(event);

      card.append(logo, name);
      eventGrid.append(card);
    });
  }

  function renderProductsPage() {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    const items = siteState.products;
    const hasItems = items.length > 0;
    productGrid.hidden = !hasItems;
    if (productEmpty) productEmpty.hidden = hasItems;
    if (!hasItems) return;

    items.forEach(function (product, index) {
      const card = document.createElement("article");
      card.className = "product-card is-clickable";
      card.dataset.id = product.id;
      card.dataset.productOpen = product.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", product.name + "，查看产品详情");

      const logo = document.createElement("div");
      logo.className = "product-card__logo";
      if (product.logo) {
        const image = document.createElement("img");
        image.src = product.logo;
        image.alt = product.name + " Logo";
        image.loading = index < 4 ? "eager" : "lazy";
        logo.append(image);
      } else {
        logo.append(detailElement("span", "", product.name.slice(0, 2).toUpperCase()));
      }

      const body = detailElement("div", "product-card__body");
      const name = detailElement("h2", "", product.name);
      body.append(name);
      body.append(detailElement("p", "product-card__zh", product.nameZh));
      if (product.price) body.append(detailElement("strong", "product-card__price", product.price));

      card.append(logo, body);
      productGrid.append(card);
    });
  }

  function renderProductAdmin() {
    if (!productAdminList) return;
    if (productCount) productCount.textContent = siteState.products.length + " 个产品";
    productAdminList.innerHTML = "";

    if (!siteState.products.length) {
      productAdminList.append(siteAdminEmpty("NO PRODUCTS YET", "添加产品后会显示在官网产品页面。"));
      return;
    }

    siteState.products.forEach(function (product) {
      const row = document.createElement("article");
      row.className = "product-admin-row";
      row.dataset.id = product.id;

      const logo = detailElement("div", "product-admin-logo");
      if (product.logo) {
        const image = document.createElement("img");
        image.src = product.logo;
        image.alt = product.name + " Logo";
        image.loading = "lazy";
        logo.append(image);
      } else {
        logo.append(detailElement("span", "", "NO LOGO"));
      }

      const info = detailElement("div", "product-admin-info");
      info.append(detailElement("strong", "", product.name));
      info.append(detailElement("span", "", product.nameZh + (product.price ? " · " + product.price : "")));
      info.append(detailElement("p", "", product.intro));
      if (product.images && product.images.length) {
        info.append(detailElement("small", "", product.images.length + " 张介绍图"));
      }

      const actions = detailElement("div", "dev-row-actions");
      const edit = document.createElement("button");
      edit.className = "dev-action";
      edit.type = "button";
      edit.dataset.productEdit = product.id;
      edit.textContent = "编辑";
      const remove = document.createElement("button");
      remove.className = "dev-action dev-action--delete";
      remove.type = "button";
      remove.dataset.productDelete = product.id;
      remove.textContent = "删除";
      actions.append(edit, remove);

      row.append(logo, info, actions);
      productAdminList.append(row);
    });
  }

  function renderEventAdmin() {
    if (!eventAdminList) return;
    if (eventCount) eventCount.textContent = siteState.events.length + " 个赛事";
    eventAdminList.innerHTML = "";

    if (!siteState.events.length) {
      eventAdminList.append(siteAdminEmpty("NO EVENT ARCHIVES", "从 FRLS Race Manager 导出存档后，在这里导入。"));
      return;
    }

    siteState.events.forEach(function (event) {
      const row = document.createElement("article");
      row.className = "event-admin-row";
      row.dataset.id = event.id;

      const logo = document.createElement("div");
      logo.className = "event-admin-logo";
      if (event.logo) {
        const image = document.createElement("img");
        image.src = event.logo;
        image.alt = eventTitle(event) + " Logo";
        image.loading = "lazy";
        logo.append(image);
      } else {
        const fallback = document.createElement("span");
        fallback.textContent = "NO LOGO";
        logo.append(fallback);
      }

      const info = document.createElement("div");
      info.className = "event-admin-info";
      const name = document.createElement("strong");
      name.textContent = eventTitle(event);
      const meta = document.createElement("span");
      const roundCount = event.seasons.reduce(function (sum, season) { return sum + season.rounds.length; }, 0);
      meta.textContent = event.abbr + " · " + event.drivers.length + " 位车手 · " + roundCount + " 个分站";
      const intro = document.createElement("p");
      intro.textContent = event.intro || "无简介";
      info.append(name, meta, intro);

      const remove = document.createElement("button");
      remove.className = "dev-action dev-action--delete";
      remove.type = "button";
      remove.dataset.eventDelete = event.id;
      remove.textContent = "删除";

      row.append(logo, info, remove);
      eventAdminList.append(row);
    });
  }

  function renderTeamAdmin() {
    if (!teamAdminList) return;
    if (teamCount) teamCount.textContent = siteState.teams.length + " 支车队";
    teamAdminList.innerHTML = "";

    if (!siteState.teams.length) {
      teamAdminList.append(siteAdminEmpty("NO TEAMS YET", "添加车队后会显示在官网车队页面。"));
      return;
    }

    siteState.teams.forEach(function (team) {
      const row = document.createElement("article");
      row.className = "team-admin-row";
      row.dataset.id = team.id;

      const logo = document.createElement("div");
      logo.className = "team-admin-logo";
      if (team.logo) {
        const image = document.createElement("img");
        image.src = team.logo;
        image.alt = team.name + " Logo";
        image.loading = "lazy";
        logo.append(image);
      } else {
        const placeholder = document.createElement("span");
        placeholder.textContent = "NO LOGO";
        logo.append(placeholder);
      }

      const info = document.createElement("div");
      info.className = "team-admin-info";
      const name = document.createElement("strong");
      name.textContent = team.name;
      const nameZh = document.createElement("span");
      nameZh.textContent = team.nameZh;
      const intro = document.createElement("p");
      intro.textContent = team.intro;
      info.append(name, nameZh, intro);
      if (team.qq) {
        const qq = document.createElement("small");
        qq.textContent = "QQ 群：" + team.qq;
        info.append(qq);
      }

      const actions = detailElement("div", "dev-row-actions");
      const edit = document.createElement("button");
      edit.className = "dev-action";
      edit.type = "button";
      edit.dataset.teamEdit = team.id;
      edit.textContent = "编辑";
      const remove = document.createElement("button");
      remove.className = "dev-action dev-action--delete";
      remove.type = "button";
      remove.dataset.teamDelete = team.id;
      remove.textContent = "删除";
      actions.append(edit, remove);

      row.append(logo, info, actions);
      teamAdminList.append(row);
    });
  }

  function renderNewsAdmin() {
    if (!newsAdminList) return;
    if (newsCount) newsCount.textContent = siteState.news.length + " 条新闻";
    newsAdminList.innerHTML = "";

    if (!siteState.news.length) {
      newsAdminList.append(siteAdminEmpty("NO NEWS YET", "发布的新闻会显示在这里，并同步到官网新闻区。"));
      return;
    }

    siteState.news.forEach(function (item) {
      const article = document.createElement("article");
      article.className = "admin-news";
      article.dataset.id = item.id;

      const thumb = document.createElement("div");
      thumb.className = "admin-news__thumb";
      if (item.image) {
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.title;
        image.loading = "lazy";
        thumb.append(image);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "admin-news__placeholder";
        placeholder.textContent = "NAR";
        thumb.append(placeholder);
      }

      const info = document.createElement("div");
      info.className = "admin-news__info";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const meta = document.createElement("span");
      meta.textContent = formatNewsDate(item.date) + " · " + item.author;
      const text = document.createElement("p");
      text.textContent = item.text;
      info.append(title, meta, text);

      const remove = document.createElement("button");
      remove.className = "dev-action dev-action--delete";
      remove.type = "button";
      remove.dataset.newsDelete = item.id;
      remove.textContent = "删除";

      article.append(thumb, info, remove);
      newsAdminList.append(article);
    });
  }

  function renderGalleryAdmin() {
    if (!galleryAdminGrid) return;
    if (galleryCount) galleryCount.textContent = siteState.gallery.length + " 张海报";
    galleryAdminGrid.innerHTML = "";

    if (!siteState.gallery.length) {
      galleryAdminGrid.append(siteAdminEmpty("NO WALL POSTERS", "上传任意比例的图片，官网会自动排版。"));
      return;
    }

    siteState.gallery.forEach(function (item) {
      const card = document.createElement("article");
      card.className = "dev-gallery-card";
      card.dataset.id = item.id;

      const thumb = document.createElement("div");
      thumb.className = "dev-gallery-thumb";
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      image.loading = "lazy";
      thumb.append(image);

      const meta = document.createElement("div");
      meta.className = "dev-gallery-meta";
      const name = document.createElement("strong");
      name.textContent = item.alt.replace(/\s*其他海报\s*$/, "");
      const size = document.createElement("span");
      size.textContent = item.width + " × " + item.height;
      meta.append(name, size);

      const actions = document.createElement("div");
      actions.className = "dev-gallery-actions";
      const remove = document.createElement("button");
      remove.className = "dev-action dev-action--delete";
      remove.type = "button";
      remove.dataset.galleryDelete = item.id;
      remove.textContent = "删除";
      actions.append(remove);

      card.append(thumb, meta, actions);
      galleryAdminGrid.append(card);
    });
  }

  function renderSponsorAdmin() {
    if (!sponsorAdminList) return;
    if (sponsorCount) sponsorCount.textContent = siteState.sponsors.length + " 个赞助商";
    sponsorAdminList.innerHTML = "";

    if (!siteState.sponsors.length) {
      sponsorAdminList.append(siteAdminEmpty("NO SPONSORS YET", "添加赞助商后会显示在官网底部赞助商栏。"));
      return;
    }

    siteState.sponsors.forEach(function (sponsor) {
      const row = document.createElement("article");
      row.className = "sponsor-admin-row";
      row.dataset.id = sponsor.id;

      const logo = document.createElement("div");
      logo.className = "sponsor-admin-logo";
      if (sponsor.image) {
        const image = document.createElement("img");
        image.src = sponsor.image;
        image.alt = sponsor.name;
        image.loading = "lazy";
        logo.append(image);
      } else {
        const label = document.createElement("span");
        label.textContent = "NO LOGO";
        logo.append(label);
      }

      const info = document.createElement("div");
      info.className = "sponsor-admin-info";
      const name = document.createElement("strong");
      name.textContent = sponsor.name;
      info.append(name);
      if (sponsor.url) {
        const link = document.createElement("a");
        link.href = sponsor.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = sponsor.url;
        info.append(link);
      } else {
        const note = document.createElement("span");
        note.textContent = "无链接";
        info.append(note);
      }

      const actions = detailElement("div", "dev-row-actions");
      const edit = document.createElement("button");
      edit.className = "dev-action";
      edit.type = "button";
      edit.dataset.sponsorEdit = sponsor.id;
      edit.textContent = "编辑";
      const remove = document.createElement("button");
      remove.className = "dev-action dev-action--delete";
      remove.type = "button";
      remove.dataset.sponsorDelete = sponsor.id;
      remove.textContent = "删除";
      actions.append(edit, remove);

      row.append(logo, info, actions);
      sponsorAdminList.append(row);
    });
  }

  async function persistNews(next) {
    const saved = await writeSiteCollection("news", next);
    siteState.news = next;
    renderNewsSection();
    renderNewsAdmin();
    if (!saved) showToast("新闻已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
    return saved;
  }

  async function persistGallery(next) {
    const saved = await writeSiteCollection("gallery", next);
    siteState.gallery = next;
    renderPosterWall();
    renderGalleryAdmin();
    if (!saved) showToast("海报已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
    return saved;
  }

  async function persistSponsors(next) {
    const saved = await writeSiteCollection("sponsors", next);
    siteState.sponsors = next;
    renderSponsorBar();
    renderSponsorAdmin();
    if (!saved) showToast("赞助商已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
    return saved;
  }

  async function persistTeams(next) {
    const saved = await writeSiteCollection("teams", next);
    siteState.teams = next;
    renderTeamsPage();
    renderTeamAdmin();
    if (!saved) showToast("车队已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
    return saved;
  }

  async function persistEvents(next) {
    const saved = await writeSiteCollection("events", next);
    siteState.events = next;
    renderEventsPage();
    renderEventAdmin();
    if (!saved) showToast("赛事已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
    return saved;
  }

  async function importEventArchive(file) {
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch (error) {
      showToast("无法读取赛事存档，请选择有效的 JSON 文件。");
      return false;
    }

    if (parsed && parsed.archive_type && parsed.archive_type !== "frls-event") {
      showToast("这不是 FRLS 赛事存档。");
      return false;
    }

    const event = normalizeEventArchive(parsed);
    if (!event) {
      showToast("赛事存档缺少必要数据。");
      return false;
    }

    const next = siteState.events.filter(function (item) { return item.id !== event.id; }).concat(event);
    const saved = await persistEvents(next);
    if (saved) {
      showToast("赛事存档已导入：" + eventTitle(event));
    }
    return saved;
  }

  async function persistProducts(next) {
    const saved = await writeSiteCollection("products", next);
    siteState.products = next;
    renderProductsPage();
    renderProductAdmin();
    if (!saved) showToast("产品已更新，但无法保存到当前浏览器。");
    queueSiteFileWrite();
    return saved;
  }

  function buildSiteDataFile() {
    const payload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      posters: posterState.posters.map(function (poster) {
        return {
          id: poster.id,
          src: poster.src,
          alt: poster.alt,
          name: poster.name,
          kind: poster.kind
        };
      }),
      news: siteState.news,
      gallery: siteState.gallery,
      events: siteState.events,
      teams: siteState.teams,
      products: siteState.products,
      sponsors: siteState.sponsors
    };

    return "/* FRLSports static site content. Generated by the developer console. */\n" +
      "window.FRL_SITE_DATA = " + JSON.stringify(payload, null, 2) + ";\n";
  }

  function downloadSiteDataFile() {
    const blob = new Blob([buildSiteDataFile()], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "site-data.js";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  async function writeSiteDataFile(options) {
    const settings = options || {};
    if (!window.showDirectoryPicker) {
      if (!settings.auto) {
        downloadSiteDataFile();
        showToast("已下载 site-data.js，请替换 assets/js/site-data.js。");
      }
      return false;
    }

    if (!siteDirectoryHandle && settings.auto) return false;

    try {
      if (!siteDirectoryHandle) {
        siteDirectoryHandle = await window.showDirectoryPicker({
          mode: "readwrite",
          id: "frlsports-site"
        });
      }

      const assets = await siteDirectoryHandle.getDirectoryHandle("assets");
      const jsDir = await assets.getDirectoryHandle("js");
      const file = await jsDir.getFileHandle("site-data.js", { create: true });
      const writable = await file.createWritable();
      await writable.write(buildSiteDataFile());
      await writable.close();

      if (!settings.auto) showToast("已写入 assets/js/site-data.js。线上站点需重新部署。");
      return true;
    } catch (error) {
      if (error && error.name === "AbortError") return false;
      siteDirectoryHandle = null;
      if (!settings.auto) showToast("写入失败：请选择包含 index.html 的网站根目录。");
      return false;
    }
  }

  function queueSiteFileWrite() {
    if (!siteDirectoryHandle) return;
    window.clearTimeout(siteWriteTimer);
    siteWriteTimer = window.setTimeout(function () {
      writeSiteDataFile({ auto: true });
    }, 220);
  }

  function setNewsDraftImage(src) {
    if (!newsImagePreview) return;
    const image = newsImagePreview.querySelector("img");
    if (!image) return;
    if (src) {
      image.src = src;
      image.hidden = false;
      newsImagePreview.classList.add("has-image");
      if (newsImageClear) newsImageClear.hidden = false;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      newsImagePreview.classList.remove("has-image");
      if (newsImageClear) newsImageClear.hidden = true;
    }
  }

  function setTeamDraftImage(src) {
    if (!teamLogoPreview) return;
    const image = teamLogoPreview.querySelector("img");
    if (!image) return;
    if (src) {
      image.src = src;
      image.hidden = false;
      teamLogoPreview.classList.add("has-image");
      if (teamLogoClear) teamLogoClear.hidden = false;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      teamLogoPreview.classList.remove("has-image");
      if (teamLogoClear) teamLogoClear.hidden = true;
    }
  }

  function setProductDraftImage(src) {
    if (!productLogoPreview) return;
    const image = productLogoPreview.querySelector("img");
    if (!image) return;
    if (src) {
      image.src = src;
      image.hidden = false;
      productLogoPreview.classList.add("has-image");
      if (productLogoClear) productLogoClear.hidden = false;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      productLogoPreview.classList.remove("has-image");
      if (productLogoClear) productLogoClear.hidden = true;
    }
  }

  function setProductImagesPreview(images) {
    if (!productImagesPreview) return;
    productImagesPreview.innerHTML = "";
    (images || []).forEach(function (src) {
      const image = document.createElement("img");
      image.src = src;
      image.alt = "产品介绍图";
      image.loading = "lazy";
      productImagesPreview.append(image);
    });
    productImagesPreview.classList.toggle("has-images", Boolean(images && images.length));
    if (productImagesClear) productImagesClear.hidden = !(images && images.length);
  }

  function setSponsorDraftImage(src) {
    if (!sponsorImagePreview) return;
    const image = sponsorImagePreview.querySelector("img");
    if (!image) return;
    if (src) {
      image.src = src;
      image.hidden = false;
      sponsorImagePreview.classList.add("has-image");
      if (sponsorImageClear) sponsorImageClear.hidden = false;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      sponsorImagePreview.classList.remove("has-image");
      if (sponsorImageClear) sponsorImageClear.hidden = true;
    }
  }

  function resetNewsForm() {
    if (newsTitle) newsTitle.value = "";
    if (newsText) newsText.value = "";
    if (newsAuthor) newsAuthor.value = "";
    siteState.newsDraftImage = "";
    setNewsDraftImage("");
    if (newsImageInput) newsImageInput.value = "";
    if (newsError) newsError.textContent = "";
  }

  function setFormEditMode(form, cancelButton, editing, addLabel, addKicker, editKicker) {
    if (cancelButton) cancelButton.hidden = !editing;
    if (form) {
      const submit = form.querySelector('button[type="submit"]');
      if (submit) submit.textContent = editing ? "保存修改" : addLabel;
      const kicker = form.querySelector(".dev-kicker");
      if (kicker) kicker.textContent = editing ? editKicker : addKicker;
    }
  }

  function resetSponsorForm() {
    if (sponsorName) sponsorName.value = "";
    if (sponsorUrl) sponsorUrl.value = "";
    siteState.sponsorDraftImage = "";
    siteState.sponsorEditingId = "";
    setSponsorDraftImage("");
    setFormEditMode(sponsorForm, sponsorCancelEdit, false, "添加赞助商", "SPONSOR ENTRY / 新赞助商", "EDIT SPONSOR / 编辑赞助商");
    if (sponsorImageInput) sponsorImageInput.value = "";
    if (sponsorError) sponsorError.textContent = "";
  }

  function resetTeamForm() {
    if (teamName) teamName.value = "";
    if (teamNameZh) teamNameZh.value = "";
    if (teamIntro) teamIntro.value = "";
    if (teamQq) teamQq.value = "";
    siteState.teamDraftImage = "";
    siteState.teamEditingId = "";
    setTeamDraftImage("");
    setFormEditMode(teamForm, teamCancelEdit, false, "添加车队", "TEAM ENTRY / 新车队", "EDIT TEAM / 编辑车队");
    if (teamLogoInput) teamLogoInput.value = "";
    if (teamError) teamError.textContent = "";
  }

  function resetProductForm() {
    if (productName) productName.value = "";
    if (productNameZh) productNameZh.value = "";
    if (productPrice) productPrice.value = "";
    if (productIntro) productIntro.value = "";
    siteState.productDraftImage = "";
    siteState.productDraftImages = [];
    siteState.productEditingId = "";
    setProductDraftImage("");
    setProductImagesPreview([]);
    setFormEditMode(productForm, productCancelEdit, false, "添加产品", "PRODUCT ENTRY / 新产品", "EDIT PRODUCT / 编辑产品");
    if (productLogoInput) productLogoInput.value = "";
    if (productImagesInput) productImagesInput.value = "";
    if (productError) productError.textContent = "";
  }

  async function processGalleryUploads(files) {
    if (siteState.galleryBusy) return;
    const accepted = Array.prototype.slice.call(files).filter(isImageFile);
    if (!accepted.length) {
      showToast("请选择图片文件。");
      return;
    }

    const remaining = 36 - siteState.gallery.length;
    if (remaining <= 0) {
      showToast("其他海报最多保留 36 张。");
      return;
    }

    const take = accepted.slice(0, remaining);
    siteState.galleryBusy = true;
    showToast("正在处理 " + take.length + " 张海报…");
    try {
      const created = [];
      for (const file of take) {
        created.push(await processGalleryImage(file));
      }
      const saved = await persistGallery(siteState.gallery.concat(created));
      if (saved) showToast(created.length + " 张其他海报已上传" + (accepted.length > take.length ? "，已达上限。" : "。"));
    } catch (error) {
      showToast("图片处理失败，请重试。");
    } finally {
      siteState.galleryBusy = false;
    }
  }

  function switchDevView(name) {
    const valid = ["posters", "news", "events", "gallery", "teams", "products", "sponsors"].indexOf(name) >= 0 ? name : "posters";
    siteState.activeView = valid;

    devViews.forEach(function (view) {
      view.hidden = view.dataset.devView !== valid;
    });

    devRailLinks.forEach(function (link) {
      const active = link.dataset.devView === valid;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (devDropzone) devDropzone.hidden = true;
    if (valid === "posters") renderDevGrid();
    else if (valid === "news") renderNewsAdmin();
    else if (valid === "events") renderEventAdmin();
    else if (valid === "gallery") renderGalleryAdmin();
    else if (valid === "sponsors") renderSponsorAdmin();
  }

  function detailElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createPointsChart(event) {
    const wrapper = detailElement("div", "points-chart");
    const chart = event.points_chart;
    if (!chart || !chart.labels || !chart.labels.length || !chart.series || !chart.series.length) {
      wrapper.append(detailElement("p", "detail-note", "该赛事暂无可视化积分数据。"));
      return wrapper;
    }

    const labels = chart.labels;
    const series = chart.series.slice(0, 8);
    const width = 880;
    const height = 270;
    const pad = { left: 48, right: 18, top: 18, bottom: 42 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    let maxValue = 10;
    series.forEach(function (entry) {
      entry.values.forEach(function (value) { maxValue = Math.max(maxValue, Number(value) || 0); });
    });
    maxValue = Math.ceil(maxValue / 10) * 10;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", eventTitle(event) + " 累计积分曲线");

    const grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let i = 0; i <= 4; i += 1) {
      const y = pad.top + (plotH / 4) * i;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(pad.left));
      line.setAttribute("x2", String(width - pad.right));
      line.setAttribute("y1", String(y));
      line.setAttribute("y2", String(y));
      line.setAttribute("stroke", "rgba(255,255,255,0.09)");
      line.setAttribute("stroke-width", "1");
      grid.append(line);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(pad.left - 10));
      text.setAttribute("y", String(y + 3));
      text.setAttribute("text-anchor", "end");
      text.setAttribute("fill", "#727278");
      text.setAttribute("font-size", "9");
      text.textContent = String(Math.round(maxValue - (maxValue / 4) * i));
      grid.append(text);
    }
    svg.append(grid);

    const xAt = function (index) {
      return labels.length <= 1 ? pad.left + plotW / 2 : pad.left + (plotW * index) / (labels.length - 1);
    };
    const yAt = function (value) {
      return pad.top + plotH - (Math.max(0, Number(value) || 0) / maxValue) * plotH;
    };

    labels.forEach(function (label, index) {
      if (labels.length > 9 && index % 2 !== 0 && index !== labels.length - 1) return;
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(xAt(index)));
      text.setAttribute("y", String(height - 16));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#727278");
      text.setAttribute("font-size", "8");
      text.textContent = label.length > 18 ? label.slice(0, 17) + "…" : label;
      svg.append(text);
    });

    series.forEach(function (entry) {
      const points = entry.values.map(function (value, index) {
        return xAt(index) + "," + yAt(value);
      }).join(" ");
      const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      polyline.setAttribute("points", points);
      polyline.setAttribute("fill", "none");
      polyline.setAttribute("stroke", entry.color || "#ff4657");
      polyline.setAttribute("stroke-width", "2");
      polyline.setAttribute("stroke-linecap", "round");
      polyline.setAttribute("stroke-linejoin", "round");
      svg.append(polyline);

      entry.values.forEach(function (value, index) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(xAt(index)));
        circle.setAttribute("cy", String(yAt(value)));
        circle.setAttribute("r", "2.2");
        circle.setAttribute("fill", entry.color || "#ff4657");
        svg.append(circle);
      });
    });

    wrapper.append(svg);
    const legend = detailElement("div", "chart-legend");
    series.forEach(function (entry) {
      const item = detailElement("span", "chart-legend-item");
      const dot = detailElement("i");
      dot.style.background = entry.color || "#ff4657";
      item.append(dot, document.createTextNode(entry.car_number ? "#" + entry.car_number + " " + entry.driver_name : entry.driver_name));
      legend.append(item);
    });
    wrapper.append(legend);
    return wrapper;
  }

  function createDataTable(headers, rows) {
    const wrap = detailElement("div", "detail-table-wrap");
    const table = detailElement("table", "detail-table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    headers.forEach(function (label) { tr.append(detailElement("th", "", label)); });
    thead.append(tr);
    const tbody = document.createElement("tbody");
    rows.forEach(function (cells) {
      const row = document.createElement("tr");
      cells.forEach(function (value) { row.append(detailElement("td", "", String(value))); });
      tbody.append(row);
    });
    table.append(thead, tbody);
    wrap.append(table);
    return wrap;
  }

  function buildNewsDetail(item) {
    const frag = document.createDocumentFragment();
    frag.append(detailElement("p", "detail-kicker", "NEWSROOM / " + formatNewsDate(item.date)));
    const title = detailElement("h2", "detail-title", item.title);
    title.id = "detailTitle";
    frag.append(title);
    frag.append(detailElement("p", "detail-byline", "SIGNED / " + item.author));
    if (item.image) {
      const image = document.createElement("img");
      image.className = "detail-news-image";
      image.src = item.image;
      image.alt = item.title;
      frag.append(image);
    }
    frag.append(detailElement("p", "detail-copy", item.text));
    return frag;
  }

  function buildTeamDetail(team) {
    const frag = document.createDocumentFragment();
    const header = detailElement("div", "detail-identity");
    const logo = detailElement("div", "detail-logo");
    if (team.logo) {
      const image = document.createElement("img");
      image.src = team.logo;
      image.alt = team.name + " Logo";
      logo.append(image);
    } else {
      logo.append(detailElement("span", "", "FRLS"));
    }
    const copy = detailElement("div", "detail-identity-copy");
    copy.append(detailElement("p", "detail-kicker", "TEAM PROFILE / 车队"));
    const title = detailElement("h2", "detail-title", team.name);
    title.id = "detailTitle";
    copy.append(title, detailElement("p", "detail-subtitle", team.nameZh));
    header.append(logo, copy);
    frag.append(header);
    frag.append(detailElement("p", "detail-copy", team.intro));
    if (team.qq) {
      const qq = detailElement("div", "detail-qq");
      qq.append(detailElement("span", "", "QQ GROUP"), detailElement("strong", "", team.qq));
      frag.append(qq);
    }
    return frag;
  }

  function buildProductDetail(product) {
    const frag = document.createDocumentFragment();
    const header = detailElement("div", "detail-identity");
    const logo = detailElement("div", "detail-logo");
    if (product.logo) {
      const image = document.createElement("img");
      image.src = product.logo;
      image.alt = product.name + " Logo";
      logo.append(image);
    } else {
      logo.append(detailElement("span", "", product.name.slice(0, 2).toUpperCase()));
    }
    const copy = detailElement("div", "detail-identity-copy");
    copy.append(detailElement("p", "detail-kicker", "PRODUCT / 产品"));
    const title = detailElement("h2", "detail-title", product.name);
    title.id = "detailTitle";
    copy.append(title, detailElement("p", "detail-subtitle", product.nameZh));
    if (product.price) {
      const price = detailElement("strong", "detail-price", product.price);
      copy.append(price);
    }
    header.append(logo, copy);
    frag.append(header);
    frag.append(detailElement("p", "detail-copy", product.intro));

    if (product.images && product.images.length) {
      frag.append(detailElement("h3", "detail-heading", "产品介绍图 / PRODUCT IMAGES"));
      const gallery = detailElement("div", "detail-product-gallery");
      product.images.forEach(function (src, index) {
        const image = document.createElement("img");
        image.src = src;
        image.alt = product.name + " 产品介绍图 " + (index + 1);
        image.loading = "lazy";
        image.addEventListener("click", function () {
          openPosterLightbox(src, image.alt, product.name, "产品介绍图 / PRODUCT IMAGE");
        });
        gallery.append(image);
      });
      frag.append(gallery);
    }
    return frag;
  }

  function escEvent(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function eventRounds(event, seasonId) {
    const out = [];
    event.seasons.forEach(function (season) {
      if (seasonId && seasonId !== "all" && season.id !== seasonId) return;
      season.rounds.forEach(function (round, index) {
        out.push({ season: season, round: round, label: "R" + padPosterNumber(index + 1) });
      });
    });
    return out;
  }

  function eventDriverMap(event) {
    const map = Object.create(null);
    event.drivers.forEach(function (driver) { map[driver.id] = driver; });
    return map;
  }

  function eventTeamMap(event) {
    const map = Object.create(null);
    (event.teams || []).forEach(function (team) { map[team.id] = team; });
    return map;
  }

  function eventDriverStandings(event, seasonId, groupId) {
    const drivers = event.drivers.filter(function (driver) {
      return !groupId || groupId === "all" || driver.group_id === groupId;
    });
    const map = Object.create(null);
    drivers.forEach(function (driver) {
      map[driver.id] = {
        driver_id: driver.id,
        driver_name: driver.name,
        car_number: driver.number,
        group_id: driver.group_id,
        group: driver.group || "",
        team_id: driver.team_id || "",
        team: driver.team || "",
        points: 0, starts: 0, wins: 0, podiums: 0
      };
    });
    eventRounds(event, seasonId).forEach(function (item) {
      (item.round.results || []).forEach(function (result) {
        const row = map[result.driver_id];
        if (!row) return;
        const position = Number(result.position) || 0;
        row.points += Number(result.points) || 0;
        row.starts += 1;
        if (position === 1) row.wins += 1;
        if (position >= 1 && position <= 3) row.podiums += 1;
      });
    });
    const rows = Object.keys(map).map(function (key) { return map[key]; });
    rows.sort(function (a, b) {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return String(a.car_number).localeCompare(String(b.car_number), undefined, { numeric: true });
    });
    rows.forEach(function (row, index) { row.rank = index + 1; });
    return rows;
  }

  function eventTeamStandings(event, seasonId) {
    const members = Object.create(null);
    event.drivers.forEach(function (driver) {
      if (!driver.team_id) return;
      (members[driver.team_id] = members[driver.team_id] || []).push(driver.id);
    });
    const rows = (event.teams || []).map(function (team) {
      return {
        team_id: team.id, team_name: team.name, color: team.color,
        drivers: (members[team.id] || []).length, points: 0, starts: 0, wins: 0, podiums: 0
      };
    });
    const map = Object.create(null);
    rows.forEach(function (row) { map[row.team_id] = row; });
    eventRounds(event, seasonId).forEach(function (item) {
      (item.round.results || []).forEach(function (result) {
        const driver = event.drivers.find(function (entry) { return entry.id === result.driver_id; });
        if (!driver || !driver.team_id || !map[driver.team_id]) return;
        const row = map[driver.team_id];
        const position = Number(result.position) || 0;
        row.points += Number(result.points) || 0;
        row.starts += 1;
        if (position === 1) row.wins += 1;
        if (position >= 1 && position <= 3) row.podiums += 1;
      });
    });
    rows.sort(function (a, b) {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return String(a.team_name).localeCompare(String(b.team_name));
    });
    rows.forEach(function (row, index) { row.rank = index + 1; });
    return rows;
  }

  function eventDriverSeries(event, seasonId, groupId) {
    const rounds = eventRounds(event, seasonId);
    const drivers = event.drivers.filter(function (driver) {
      return !groupId || groupId === "all" || driver.group_id === groupId;
    });
    return {
      labels: rounds.map(function (item) { return item.label + " · " + item.round.name; }),
      series: drivers.map(function (driver, index) {
        let total = 0;
        return {
          id: driver.id,
          label: (driver.number ? "#" + driver.number + " " : "") + driver.name,
          color: driver.group_color || EVENT_CHART_COLORS[index % EVENT_CHART_COLORS.length],
          values: rounds.map(function (item) {
            const result = (item.round.results || []).find(function (entry) { return entry.driver_id === driver.id; });
            total += result ? Number(result.points) || 0 : 0;
            return total;
          })
        };
      })
    };
  }

  function eventTeamSeries(event, seasonId, teamId) {
    const rounds = eventRounds(event, seasonId);
    const teams = (event.teams || []).filter(function (team) { return !teamId || teamId === "all" || team.id === teamId; });
    return {
      labels: rounds.map(function (item) { return item.label + " · " + item.round.name; }),
      series: teams.map(function (team, index) {
        const memberIds = event.drivers.filter(function (driver) { return driver.team_id === team.id; }).map(function (driver) { return driver.id; });
        let total = 0;
        return {
          id: team.id,
          label: team.name,
          color: team.color || EVENT_CHART_COLORS[index % EVENT_CHART_COLORS.length],
          values: rounds.map(function (item) {
            (item.round.results || []).forEach(function (result) {
              if (memberIds.indexOf(result.driver_id) >= 0) total += Number(result.points) || 0;
            });
            return total;
          })
        };
      })
    };
  }

  function eventLineChart(labels, series, aria) {
    const wrapper = detailElement("div", "event-line-chart");
    if (!series.length || !labels.length) {
      wrapper.append(detailElement("p", "detail-note", "暂无可视化积分数据。"));
      return wrapper;
    }
    const width = 900, height = 270;
    const pad = { left: 42, right: 18, top: 18, bottom: 48 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    let maxValue = 10;
    series.forEach(function (entry) { entry.values.forEach(function (value) { maxValue = Math.max(maxValue, Number(value) || 0); }); });
    maxValue = Math.max(10, Math.ceil(maxValue / 10) * 10);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", aria);
    for (let i = 0; i <= 4; i += 1) {
      const y = pad.top + (plotH / 4) * i;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(pad.left)); line.setAttribute("x2", String(width - pad.right));
      line.setAttribute("y1", String(y)); line.setAttribute("y2", String(y));
      line.setAttribute("stroke", "rgba(255,255,255,0.08)"); svg.append(line);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(pad.left - 8)); text.setAttribute("y", String(y + 3));
      text.setAttribute("text-anchor", "end"); text.setAttribute("fill", "#727278"); text.setAttribute("font-size", "8");
      text.textContent = String(Math.round(maxValue - (maxValue / 4) * i)); svg.append(text);
    }
    const xAt = function (index) {
      return labels.length <= 1 ? pad.left + plotW / 2 : pad.left + (plotW * index) / (labels.length - 1);
    };
    const yAt = function (value) { return pad.top + plotH - (Math.max(0, Number(value) || 0) / maxValue) * plotH; };
    labels.forEach(function (label, index) {
      if (labels.length > 8 && index % Math.ceil(labels.length / 8) !== 0 && index !== labels.length - 1) return;
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(xAt(index))); text.setAttribute("y", String(height - 14));
      text.setAttribute("text-anchor", "middle"); text.setAttribute("fill", "#727278"); text.setAttribute("font-size", "8");
      text.textContent = "R" + padPosterNumber(index + 1); svg.append(text);
    });
    series.forEach(function (entry) {
      const points = entry.values.map(function (value, index) { return xAt(index) + "," + yAt(value); }).join(" ");
      const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      polyline.setAttribute("points", points); polyline.setAttribute("fill", "none");
      polyline.setAttribute("stroke", entry.color); polyline.setAttribute("stroke-width", "2");
      polyline.setAttribute("stroke-linecap", "round"); polyline.setAttribute("stroke-linejoin", "round"); svg.append(polyline);
      entry.values.forEach(function (value, index) {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", String(xAt(index))); dot.setAttribute("cy", String(yAt(value)));
        dot.setAttribute("r", "2.2"); dot.setAttribute("fill", entry.color); svg.append(dot);
      });
    });
    wrapper.append(svg);
    const legend = detailElement("div", "chart-legend");
    series.forEach(function (entry) {
      const item = detailElement("span", "chart-legend-item");
      const dot = detailElement("i"); dot.style.background = entry.color;
      item.append(dot, document.createTextNode(entry.label)); legend.append(item);
    });
    wrapper.append(legend);
    return wrapper;
  }

  function eventBarChart(labels, values, color) {
    const wrapper = detailElement("div", "event-bar-chart");
    if (!values.length) {
      wrapper.append(detailElement("p", "detail-note", "暂无分站积分数据。"));
      return wrapper;
    }
    const max = Math.max.apply(null, values.concat([1]));
    values.forEach(function (value, index) {
      const col = detailElement("div", "event-bar-col");
      col.append(detailElement("span", "event-bar-value", fmtEventNumber(value)));
      const track = detailElement("div", "event-bar-track");
      const fill = detailElement("div", "event-bar-fill");
      fill.style.height = Math.max(2, Math.round((Number(value) / max) * 100)) + "%";
      fill.style.background = color;
      track.append(fill); col.append(track);
      col.append(detailElement("span", "event-bar-label", "R" + padPosterNumber(index + 1)));
      col.title = (labels[index] || "") + " · " + fmtEventNumber(value) + " PTS";
      wrapper.append(col);
    });
    return wrapper;
  }

  function eventFilterSelect(name, label, options, value) {
    const field = detailElement("label", "event-filter-field");
    field.append(detailElement("span", "", label));
    const select = document.createElement("select");
    select.dataset.eventFilter = name;
    options.forEach(function (option) {
      const item = document.createElement("option");
      item.value = option[0]; item.textContent = option[1];
      if (option[0] === value) item.selected = true;
      select.append(item);
    });
    field.append(select);
    return field;
  }

  function eventPointsHTML(event) {
    const state = eventDetailState;
    const seasonOptions = [["all", "全部赛季"]].concat(event.seasons.map(function (season) { return [season.id, season.name]; }));
    const groupOptions = [["all", "全部组别"]].concat(event.groups.map(function (group) { return [group.id, group.name]; }));
    const teamOptions = [["all", "全部车队"]].concat((event.teams || []).map(function (team) { return [team.id, team.name]; }));
    const driverRows = eventDriverStandings(event, state.season, state.group);
    const teamRows = eventTeamStandings(event, state.season);
    const driverSeries = eventDriverSeries(event, state.season, state.group);
    const teamSeries = eventTeamSeries(event, state.season, state.team);
    const filters = '<div class="event-filter-bar" aria-label="积分筛选">' +
      '<span class="event-filter-title">筛选 / FILTER</span>' +
      eventFilterSelect("season", "赛季", seasonOptions, state.season).outerHTML +
      eventFilterSelect("group", "组别", groupOptions, state.group).outerHTML +
      eventFilterSelect("team", "车队", teamOptions, state.team).outerHTML +
      '</div>';
    const driverTable = createDataTable(
      ["#", "车手", "车队", "组别", "积分", "出赛", "胜场"],
      driverRows.map(function (row) {
        return [row.rank, row.driver_name, row.team || "—", row.group || "—", fmtEventNumber(row.points), row.starts, row.wins];
      })
    );
    const teamTable = createDataTable(
      ["#", "车队", "车手", "积分", "胜场", "领奖台"],
      teamRows.map(function (row) {
        return [row.rank, row.team_name, row.drivers, fmtEventNumber(row.points), row.wins, row.podiums];
      })
    );
    return filters +
      '<section class="event-detail-section"><h3 class="detail-heading">车手积分榜 / DRIVERS</h3>' +
      (driverRows.length ? driverTable.outerHTML : '<p class="detail-note">暂无车手积分数据。</p>') + '</section>' +
      '<section class="event-detail-section"><h3 class="detail-heading">车队积分榜 / TEAMS</h3>' +
      (teamRows.length ? teamTable.outerHTML : '<p class="detail-note">暂无车队积分数据。</p>') + '</section>' +
      '<section class="event-detail-section"><h3 class="detail-heading">全车手积分走势 / ALL DRIVERS</h3><div id="eventDriverChart"></div></section>' +
      '<section class="event-detail-section"><h3 class="detail-heading">全车队积分走势 / ALL TEAMS</h3><div id="eventTeamChart"></div></section>';
  }

  function eventInfoHTML(event) {
    const state = eventDetailState;
    const driverButtons = event.drivers.map(function (driver) {
      return '<button class="event-person-chip" type="button" data-event-driver="' + escEvent(driver.id) + '">' +
        escEvent((driver.number ? "#" + driver.number + " " : "") + driver.name) + '</button>';
    }).join("");
    const teamButtons = (event.teams || []).map(function (team) {
      return '<button class="event-person-chip" type="button" data-event-team="' + escEvent(team.id) + '">' + escEvent(team.name) + '</button>';
    }).join("");
    let profile = "";
    if (state.profile && state.profile.type === "driver") {
      const driver = event.drivers.find(function (entry) { return entry.id === state.profile.id; });
      if (driver) {
        const series = eventDriverSeries(event, "all", "all");
        const entry = series.series.find(function (item) { return item.id === driver.id; });
        const bars = eventRounds(event, "all").map(function (item) {
          const result = (item.round.results || []).find(function (row) { return row.driver_id === driver.id; });
          return result ? Number(result.points) || 0 : 0;
        });
        profile = '<div class="event-profile-card"><div class="event-profile-head"><span>DRIVER / 车手</span><strong>' +
          escEvent((driver.number ? "#" + driver.number + " " : "") + driver.name) + '</strong><small>' + escEvent(driver.group || "—") + ' · ' + escEvent(driver.team || "—") + '</small></div>' +
          eventLineChart(series.labels, entry ? [entry] : [], driver.name + " 累计积分走势").outerHTML +
          eventBarChart(series.labels, bars, driver.team_color || driver.group_color || "#ff4657").outerHTML + '</div>';
      }
    } else if (state.profile && state.profile.type === "team") {
      const team = (event.teams || []).find(function (entry) { return entry.id === state.profile.id; });
      if (team) {
        const series = eventTeamSeries(event, "all", team.id);
        const entry = series.series[0];
        const bars = eventRounds(event, "all").map(function (item) {
          let points = 0;
          const memberIds = event.drivers.filter(function (driver) { return driver.team_id === team.id; }).map(function (driver) { return driver.id; });
          (item.round.results || []).forEach(function (result) { if (memberIds.indexOf(result.driver_id) >= 0) points += Number(result.points) || 0; });
          return points;
        });
        profile = '<div class="event-profile-card"><div class="event-profile-head"><span>TEAM / 车队</span><strong>' + escEvent(team.name) + '</strong><small>' +
          event.drivers.filter(function (driver) { return driver.team_id === team.id; }).length + ' 位车手</small></div>' +
          eventLineChart(series.labels, entry ? [entry] : [], team.name + " 累计积分走势").outerHTML +
          eventBarChart(series.labels, bars, team.color).outerHTML + '</div>';
      }
    }
    const seasons = event.seasons.map(function (season) {
      const rounds = season.rounds.map(function (round, index) {
        const results = (round.results || []).slice().sort(function (a, b) { return (a.position || 999) - (b.position || 999); });
        return '<article class="event-info-round"><div class="event-info-round-head"><span>R' + padPosterNumber(index + 1) + '</span><strong>' + escEvent(round.name) + '</strong><small>' + escEvent(round.date || "日期待定") + '</small></div>' +
          (round.notes ? '<p class="event-info-note">' + escEvent(round.notes) + '</p>' : '') +
          (results.length ? results.map(function (result) {
            const driver = event.drivers.find(function (entry) { return entry.id === result.driver_id; });
            return '<div class="event-info-result"><span>' + result.position + '</span><strong>' + escEvent(result.driver_name || (driver && driver.name) || "—") + '</strong><small>' + escEvent(result.team || (driver && driver.team) || "—") + '</small><span>' + escEvent(result.gap || "—") + '</span><b>' + fmtEventNumber(result.points) + '</b></div>';
          }).join("") : '<p class="detail-note">成绩待录入。</p>') + '</article>';
      }).join("");
      return '<section class="event-info-season"><h3>' + escEvent((season.year ? season.year + " · " : "") + season.name) + '</h3>' + (rounds || '<p class="detail-note">暂无分站。</p>') + '</section>';
    }).join("");
    return '<section class="event-people"><h3 class="detail-heading">车手 / DRIVERS</h3><div class="event-person-grid">' + (driverButtons || '<span class="detail-note">暂无车手。</span>') + '</div>' +
      '<h3 class="detail-heading">车队 / TEAMS</h3><div class="event-person-grid">' + (teamButtons || '<span class="detail-note">暂无车队。</span>') + '</div></section>' +
      profile + '<section class="event-info-seasons"><h3 class="detail-heading">赛季与分站 / SEASONS</h3>' + (seasons || '<p class="detail-note">暂无赛季数据。</p>') + '</section>';
  }

  function renderEventDetailContent() {
    const host = document.getElementById("eventDetailContent");
    if (!host || !eventDetailState) return;
    const event = eventDetailState.event;
    host.innerHTML = eventDetailState.tab === "points" ? eventPointsHTML(event) : eventInfoHTML(event);
    document.querySelectorAll("[data-event-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.eventTab === eventDetailState.tab);
    });
    if (eventDetailState.tab === "points") {
      const driverHost = document.getElementById("eventDriverChart");
      const teamHost = document.getElementById("eventTeamChart");
      const drivers = eventDriverSeries(event, eventDetailState.season, eventDetailState.group);
      const teams = eventTeamSeries(event, eventDetailState.season, eventDetailState.team);
      if (driverHost) driverHost.append(eventLineChart(drivers.labels, drivers.series, "全车手积分走势"));
      if (teamHost) teamHost.append(eventLineChart(teams.labels, teams.series, "全车队积分走势"));
    }
  }

  function buildEventDetail(event) {
    const frag = document.createDocumentFragment();
    const header = detailElement("div", "detail-identity");
    const logo = detailElement("div", "detail-logo detail-logo--event");
    if (event.logo) {
      const image = document.createElement("img");
      image.src = event.logo; image.alt = eventTitle(event) + " Logo"; logo.append(image);
    } else {
      logo.append(detailElement("span", "", event.abbr || "FRLS"));
    }
    const copy = detailElement("div", "detail-identity-copy");
    copy.append(detailElement("p", "detail-kicker", "EVENT DOSSIER / " + (event.abbr || "EVENT")));
    const title = detailElement("h2", "detail-title", event.full_name || eventTitle(event));
    title.id = "detailTitle";
    copy.append(title);
    if (event.cn_name) copy.append(detailElement("p", "detail-subtitle", event.cn_name));
    const meta = detailElement("div", "detail-meta");
    if (event.race_type) meta.append(detailElement("span", "", event.race_type));
    meta.append(detailElement("span", "", event.points_enabled ? "AUTO POINTS" : "MANUAL POINTS"));
    copy.append(meta);
    header.append(logo, copy);
    frag.append(header);
    if (event.intro) frag.append(detailElement("p", "detail-copy", event.intro));
    const roundCount = event.seasons.reduce(function (sum, season) { return sum + season.rounds.length; }, 0);
    const stats = detailElement("div", "detail-stats");
    [[String(event.drivers.length), "车手"], [String(roundCount), "分站"], [String(event.seasons.length), "赛季"], [String((event.teams || []).length || 0), "车队"]].forEach(function (pair) {
      const item = detailElement("div"); item.append(detailElement("strong", "", pair[0]), detailElement("span", "", pair[1])); stats.append(item);
    });
    frag.append(stats);
    const tabs = detailElement("div", "event-detail-tabs");
    [["points", "积分栏"], ["info", "信息栏"]].forEach(function (pair) {
      const button = detailElement("button", "event-detail-tab" + (pair[0] === "points" ? " is-active" : ""), pair[1]);
      button.type = "button"; button.dataset.eventTab = pair[0]; tabs.append(button);
    });
    frag.append(tabs);
    const content = detailElement("div", "event-detail-content");
    content.id = "eventDetailContent";
    frag.append(content);
    eventDetailState = { event: event, tab: "points", season: "all", group: "all", team: "all", profile: null };
    tabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-event-tab]");
      if (!button) return;
      eventDetailState.tab = button.dataset.eventTab;
      renderEventDetailContent();
    });
    content.addEventListener("change", function (event) {
      const select = event.target.closest("[data-event-filter]");
      if (!select) return;
      eventDetailState[select.dataset.eventFilter] = select.value;
      if (select.dataset.eventFilter === "season") eventDetailState.profile = null;
      renderEventDetailContent();
    });
    content.addEventListener("click", function (event) {
      const driver = event.target.closest("[data-event-driver]");
      const team = event.target.closest("[data-event-team]");
      if (driver) {
        eventDetailState.profile = { type: "driver", id: driver.dataset.eventDriver };
        eventDetailState.tab = "info";
        renderEventDetailContent();
      } else if (team) {
        eventDetailState.profile = { type: "team", id: team.dataset.eventTeam };
        eventDetailState.tab = "info";
        renderEventDetailContent();
      }
    });
    renderEventDetailContent();
    return frag;
  }

  function fmtEventNumber(value) {
    const number = Number(value) || 0;
    return Math.abs(number - Math.round(number)) < 1e-9 ? String(Math.round(number)) : String(Number(number.toFixed(1)));
  }

  let detailLastFocus = null;
  let eventDetailState = null;

  function openDetail(type, id) {
    if (!detailModal || !detailBody) return;
    const item = type === "news" ? siteState.news.find(function (entry) { return entry.id === id; })
      : type === "team" ? siteState.teams.find(function (entry) { return entry.id === id; })
        : type === "product" ? siteState.products.find(function (entry) { return entry.id === id; })
          : siteState.events.find(function (entry) { return entry.id === id; });
    if (!item) return;

    detailBody.innerHTML = "";
    detailBody.append(type === "news" ? buildNewsDetail(item) : type === "team" ? buildTeamDetail(item) : type === "product" ? buildProductDetail(item) : buildEventDetail(item));
    if (type === "event") renderEventDetailContent();
    detailLastFocus = document.activeElement;
    detailModal.hidden = false;
    document.body.classList.add("detail-open");
    window.setTimeout(function () {
      if (detailClose) detailClose.focus({ preventScroll: true });
    }, 40);
  }

  function closeDetail() {
    if (!detailModal || detailModal.hidden) return;
    detailModal.hidden = true;
    document.body.classList.remove("detail-open");
    detailBody.innerHTML = "";
    eventDetailState = null;
    if (detailLastFocus instanceof HTMLElement) detailLastFocus.focus({ preventScroll: true });
    detailLastFocus = null;
  }

  function initDetails() {
    if (!detailModal) return;
    if (detailClose) detailClose.addEventListener("click", closeDetail);
    detailModal.addEventListener("click", function (event) {
      if (event.target === detailModal) closeDetail();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !detailModal.hidden) {
        event.preventDefault();
        closeDetail();
      }
    });

    const activate = function (event) {
      const trigger = event.target.closest("[data-news-open], [data-team-open], [data-product-open], [data-event-open]");
      if (!trigger) return;
      if (event.type === "keydown") {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
      } else if (event.target.closest("a, button")) {
        return;
      }
      if (trigger.dataset.newsOpen) openDetail("news", trigger.dataset.newsOpen);
      else if (trigger.dataset.teamOpen) openDetail("team", trigger.dataset.teamOpen);
      else if (trigger.dataset.productOpen) openDetail("product", trigger.dataset.productOpen);
      else openDetail("event", trigger.dataset.eventOpen);
    };

    [newsGrid, teamGrid, productGrid, eventGrid].forEach(function (grid) {
      if (!grid) return;
      grid.addEventListener("click", activate);
      grid.addEventListener("keydown", activate);
    });
  }

  let posterLightbox = null;
  let posterLightboxImage = null;
  let posterLightboxTitle = null;
  let posterLightboxMeta = null;
  let posterLightboxClose = null;
  let lightboxLastFocus = null;

  function ensurePosterLightbox() {
    if (posterLightbox) return;
    posterLightbox = detailElement("div", "poster-lightbox");
    posterLightbox.hidden = true;
    posterLightbox.setAttribute("role", "dialog");
    posterLightbox.setAttribute("aria-modal", "true");
    posterLightbox.setAttribute("aria-label", "海报大图");

    const close = detailElement("button", "lightbox-close", "关闭 ×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭大图");

    const figure = detailElement("figure", "lightbox-figure");
    posterLightboxImage = document.createElement("img");
    posterLightboxImage.alt = "";
    posterLightboxImage.draggable = false;
    const caption = detailElement("figcaption", "lightbox-caption");
    posterLightboxMeta = detailElement("span", "", "");
    posterLightboxTitle = detailElement("strong", "", "");
    caption.append(posterLightboxMeta, posterLightboxTitle);
    figure.append(posterLightboxImage, caption);
    posterLightbox.append(close, figure);

    posterLightboxClose = close;
    close.addEventListener("click", closePosterLightbox);
    posterLightbox.addEventListener("click", function (event) {
      if (event.target === posterLightbox) closePosterLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !posterLightbox.hidden) {
        event.preventDefault();
        closePosterLightbox();
      }
    });
    document.body.append(posterLightbox);
  }

  function openPosterLightbox(src, alt, title, meta) {
    if (!src) return;
    ensurePosterLightbox();
    posterLightboxImage.src = src;
    posterLightboxImage.alt = alt || title || "FRLSports 海报";
    posterLightboxMeta.textContent = meta || "FRLSPORTS / POSTER";
    posterLightboxTitle.textContent = title || alt || "FRLSports 海报";
    lightboxLastFocus = document.activeElement;
    posterLightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    window.setTimeout(function () { posterLightboxClose.focus({ preventScroll: true }); }, 40);
  }

  function closePosterLightbox() {
    if (!posterLightbox || posterLightbox.hidden) return;
    posterLightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lightboxLastFocus instanceof HTMLElement) lightboxLastFocus.focus({ preventScroll: true });
    lightboxLastFocus = null;
  }

  function initPosterLightbox() {
    if (!posterWall) return;
    const activate = function (event) {
      const item = event.target.closest("[data-wall-open]");
      if (!item) return;
      if (event.type === "keydown") {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
      }
      const data = siteState.gallery.find(function (entry) { return entry.id === item.dataset.wallOpen; });
      if (data) openPosterLightbox(data.src, data.alt, data.alt.replace(/\s*其他海报\s*$/, "") || data.alt, "其他海报 / POSTER WALL");
    };
    posterWall.addEventListener("click", activate);
    posterWall.addEventListener("keydown", activate);
  }

  function initDonation() {
    const openers = Array.prototype.slice.call(document.querySelectorAll("[data-donate-open]"));
    if (!openers.length) return;

    const backdrop = detailElement("div", "donate-backdrop");
    backdrop.hidden = true;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "donateTitle");

    const dialog = detailElement("div", "donate-dialog");
    const close = detailElement("button", "donate-close", "关闭 ×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭捐赠窗口");

    const head = detailElement("div", "donate-head");
    const icon = document.createElement("img");
    icon.className = "donate-app-icon";
    icon.src = "assets/images/frls_app_icon.png";
    icon.alt = "FRLS Race Manager";
    const copy = detailElement("div", "donate-copy");
    copy.append(detailElement("p", "donate-kicker", "SUPPORT THE PROJECT"));
    const title = detailElement("h2", "donate-title", "赞助支持 FRLS");
    title.id = "donateTitle";
    copy.append(title);
    copy.append(detailElement("p", "donate-intro", "如果 FRLS Race Manager 对你的赛事管理有帮助，欢迎扫码支持后续开发。"));
    head.append(icon, copy);

    const qr = detailElement("div", "donate-qr");
    const qrImage = document.createElement("img");
    qrImage.src = "assets/images/sponsor_qr.jpg";
    qrImage.alt = "赞助收款二维码";
    qr.append(qrImage);
    const scan = detailElement("p", "donate-scan", "扫码支持  /  SCAN TO SUPPORT");
    const done = detailElement("button", "donate-done", "关闭");
    done.type = "button";

    dialog.append(close, head, qr, scan, done);
    backdrop.append(dialog);
    document.body.append(backdrop);

    let lastFocus = null;
    function closeDonation() {
      if (backdrop.hidden) return;
      backdrop.hidden = true;
      document.body.classList.remove("donate-open");
      if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
      lastFocus = null;
    }
    function openDonation() {
      lastFocus = document.activeElement;
      backdrop.hidden = false;
      document.body.classList.add("donate-open");
      window.setTimeout(function () { close.focus({ preventScroll: true }); }, 40);
    }

    openers.forEach(function (button) { button.addEventListener("click", openDonation); });
    close.addEventListener("click", closeDonation);
    done.addEventListener("click", closeDonation);
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) closeDonation();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !backdrop.hidden) {
        event.preventDefault();
        closeDonation();
      }
    });
  }

  const I18N = {
    "zh-Hans": {
      nav: {
        home: ["首页", "HOME"], events: ["赛事", "EVENTS"], news: ["新闻", "NEWS"],
        posters: ["海报", "POSTERS"], teams: ["车队", "TEAMS"], products: ["产品", "PRODUCTS"], about: ["关于", "ABOUT"]
      },
      common: {
        status: "SITE ONLINE", donate: "捐赠", skip: "跳转到主要内容", menu: "MENU / 导航",
        footerCenter: "OFFICIAL WEBSITE / 官方网站", backTop: "BACK TO TOP"
      },
      pages: {
        events: { eyebrow: "EVENTS / 赛事", title: "赛事中心", copy: "FRLSports 赛事、赛历与比赛管理内容。" },
        news: { eyebrow: "NEWSROOM / 新闻", title: "最新新闻", copy: "来自 FRLSports 的官方公告、赛事动态与幕后故事。" },
        posters: { eyebrow: "POSTER WALL / 其他海报", title: "其他海报", copy: "由开发者上传的各种比例海报，保留原始构图并自动排版。" },
        teams: { eyebrow: "TEAMS / 车队", title: "车队档案", copy: "FRLSports 车队、车手与成员档案。" },
        products: { eyebrow: "PRODUCTS / 产品", title: "产品", copy: "FRLSports 官方产品、装备与周边展示。" }
      },
      donation: { title: "赞助支持 FRLS", intro: "如果 FRLS Race Manager 对你的赛事管理有帮助，欢迎扫码支持后续开发。", scan: "扫码支持  /  SCAN TO SUPPORT", close: "关闭" },
      empty: { events: "开发者尚未导入赛事存档。", news: "开发者尚未发布新闻。", wall: "开发者尚未上传其他海报。", teams: "开发者尚未添加车队。", products: "开发者尚未添加产品。" }
    },
    "zh-Hant": {
      nav: {
        home: ["首頁", "HOME"], events: ["賽事", "EVENTS"], news: ["新聞", "NEWS"],
        posters: ["海報", "POSTERS"], teams: ["車隊", "TEAMS"], products: ["產品", "PRODUCTS"], about: ["關於", "ABOUT"]
      },
      common: {
        status: "SITE ONLINE", donate: "捐贈", skip: "跳至主要內容", menu: "MENU / 導覽",
        footerCenter: "OFFICIAL WEBSITE / 官方網站", backTop: "BACK TO TOP"
      },
      pages: {
        events: { eyebrow: "EVENTS / 賽事", title: "賽事中心", copy: "FRLSports 賽事、賽曆與比賽管理內容。" },
        news: { eyebrow: "NEWSROOM / 新聞", title: "最新新聞", copy: "來自 FRLSports 的官方公告、賽事動態與幕後故事。" },
        posters: { eyebrow: "POSTER WALL / 其他海報", title: "其他海報", copy: "由開發者上傳的各種比例海報，保留原始構圖並自動排版。" },
        teams: { eyebrow: "TEAMS / 車隊", title: "車隊檔案", copy: "FRLSports 車隊、車手與成員檔案。" },
        products: { eyebrow: "PRODUCTS / 產品", title: "產品", copy: "FRLSports 官方產品、裝備與周邊展示。" }
      },
      donation: { title: "贊助支持 FRLS", intro: "如果 FRLS Race Manager 對你的賽事管理有幫助，歡迎掃碼支持後續開發。", scan: "掃碼支持  /  SCAN TO SUPPORT", close: "關閉" },
      empty: { events: "開發者尚未匯入賽事存檔。", news: "開發者尚未發布新聞。", wall: "開發者尚未上傳其他海報。", teams: "開發者尚未新增車隊。", products: "開發者尚未新增產品。" }
    },
    "en": {
      nav: {
        home: ["Home", "HOME"], events: ["Events", "EVENTS"], news: ["News", "NEWS"],
        posters: ["Posters", "POSTERS"], teams: ["Teams", "TEAMS"], products: ["Products", "PRODUCTS"], about: ["About", "ABOUT"]
      },
      common: {
        status: "SITE ONLINE", donate: "Donate", skip: "Skip to main content", menu: "MENU / NAVIGATION",
        footerCenter: "OFFICIAL WEBSITE", backTop: "BACK TO TOP"
      },
      pages: {
        events: { eyebrow: "EVENTS", title: "Event Hub", copy: "FRLSports events, calendars and race management." },
        news: { eyebrow: "NEWSROOM", title: "Latest News", copy: "Official announcements, race updates and stories from FRLSports." },
        posters: { eyebrow: "POSTER WALL", title: "Poster Wall", copy: "Developer-uploaded posters in any ratio, preserved and auto-arranged." },
        teams: { eyebrow: "TEAMS", title: "Team Files", copy: "FRLSports teams, drivers and member profiles." },
        products: { eyebrow: "PRODUCTS", title: "Products", copy: "Official FRLSports products, gear and merchandise." }
      },
      donation: { title: "Support FRLS", intro: "If FRLS Race Manager helps your race management, scan to support future development.", scan: "SCAN TO SUPPORT", close: "Close" },
      empty: { events: "The developer has not imported an event archive.", news: "The developer has not published any news.", wall: "The developer has not uploaded any posters.", teams: "The developer has not added any teams.", products: "The developer has not added any products." }
    },
    "ja": {
      nav: {
        home: ["ホーム", "HOME"], events: ["イベント", "EVENTS"], news: ["ニュース", "NEWS"],
        posters: ["ポスター", "POSTERS"], teams: ["チーム", "TEAMS"], products: ["製品", "PRODUCTS"], about: ["について", "ABOUT"]
      },
      common: {
        status: "SITE ONLINE", donate: "支援", skip: "メインコンテンツへ", menu: "MENU / ナビ",
        footerCenter: "OFFICIAL WEBSITE", backTop: "BACK TO TOP"
      },
      pages: {
        events: { eyebrow: "EVENTS / イベント", title: "イベント", copy: "FRLSports のイベント、カレンダー、レース管理。" },
        news: { eyebrow: "NEWSROOM / ニュース", title: "最新ニュース", copy: "FRLSports からの公式発表、レース情報、ストーリー。" },
        posters: { eyebrow: "POSTER WALL / ポスター", title: "ポスター", copy: "開発者がアップロードしたさまざまな比率のポスターを自動レイアウト。" },
        teams: { eyebrow: "TEAMS / チーム", title: "チーム", copy: "FRLSports のチーム、ドライバー、メンバー。" },
        products: { eyebrow: "PRODUCTS / 製品", title: "製品", copy: "FRLSports 公式製品、ギア、グッズ。" }
      },
      donation: { title: "FRLS を支援", intro: "FRLS Race Manager がレース管理の役に立つなら、今後の開発をスキャンで支援してください。", scan: "スキャンして支援 / SCAN TO SUPPORT", close: "閉じる" },
      empty: { events: "開発者はまだイベントアーカイブを読み込んでいません。", news: "開発者はまだニュースを公開していません。", wall: "開発者はまだポスターをアップロードしていません。", teams: "開発者はまだチームを追加していません。", products: "開発者はまだ製品を追加していません。" }
    }
  };

  I18N["zh-Hans"].titles = {
    index: "FRLSports | 官方网站", events: "赛事中心 | FRLSports", news: "最新新闻 | FRLSports",
    posters: "其他海报 | FRLSports", teams: "车队档案 | FRLSports", products: "产品 | FRLSports",
    about: "关于 FRLSports [NAR] | FRLSports"
  };
  I18N["zh-Hans"].home = {
    posterEyebrow: "FEATURED POSTERS / 官方海报",
    posterHeading: "FRLSports 官方海报",
    posterCaption: "使用方向键、点击两侧海报或滑动切换",
    prev: "上一张海报", next: "下一张海报", dots: "选择海报",
    wallEyebrow: "POSTER WALL / 其他海报", wallTitle: "其他海报",
    wallNote: "任意比例 · 保留原始构图 · 自动排版", wallLink: "独立页面",
    narLead: "FRLSports是为赛车游戏比赛管理者及车手们提供平台及便利的地方。",
    ownerLabel: "OWNER / 所有者",
    ownerName: "牢吉爆炸了！！！"
  };
  I18N["zh-Hant"].titles = {
    index: "FRLSports | 官方網站", events: "賽事中心 | FRLSports", news: "最新新聞 | FRLSports",
    posters: "其他海報 | FRLSports", teams: "車隊檔案 | FRLSports", products: "產品 | FRLSports",
    about: "關於 FRLSports [NAR] | FRLSports"
  };
  I18N["zh-Hant"].home = {
    posterEyebrow: "FEATURED POSTERS / 官方海報",
    posterHeading: "FRLSports 官方海報",
    posterCaption: "使用方向鍵、點擊兩側海報或滑動切換",
    prev: "上一張海報", next: "下一張海報", dots: "選擇海報",
    wallEyebrow: "POSTER WALL / 其他海報", wallTitle: "其他海報",
    wallNote: "任意比例 · 保留原始構圖 · 自動排版", wallLink: "獨立頁面",
    narLead: "FRLSports是為賽車遊戲比賽管理者及車手們提供平台及便利的地方。",
    ownerLabel: "OWNER / 擁有者",
    ownerName: "牢吉爆炸了！！！"
  };
  I18N.en.titles = {
    index: "FRLSports | Official Website", events: "Event Hub | FRLSports", news: "Latest News | FRLSports",
    posters: "Poster Wall | FRLSports", teams: "Team Files | FRLSports", products: "Products | FRLSports",
    about: "About FRLSports [NAR] | FRLSports"
  };
  I18N.en.home = {
    posterEyebrow: "FEATURED POSTERS",
    posterHeading: "FRLSports Official Posters",
    posterCaption: "Use arrow keys, side posters or swipe to switch",
    prev: "Previous poster", next: "Next poster", dots: "Choose poster",
    wallEyebrow: "POSTER WALL", wallTitle: "Poster Wall",
    wallNote: "Any aspect ratio · Original framing · Auto layout", wallLink: "Open page",
    narLead: "FRLSports is a platform and convenience for racing-game event organizers and drivers.",
    ownerLabel: "OWNER",
    ownerName: "Laoji Exploded!!!"
  };
  I18N.ja.titles = {
    index: "FRLSports | 公式サイト", events: "イベント | FRLSports", news: "最新ニュース | FRLSports",
    posters: "ポスター | FRLSports", teams: "チーム | FRLSports", products: "製品 | FRLSports",
    about: "FRLSports [NAR] について | FRLSports"
  };
  I18N.ja.home = {
    posterEyebrow: "FEATURED POSTERS / 公式ポスター",
    posterHeading: "FRLSports 公式ポスター",
    posterCaption: "矢印キー、左右のポスター、スワイプで切り替え",
    prev: "前のポスター", next: "次のポスター", dots: "ポスターを選択",
    wallEyebrow: "POSTER WALL / ポスター", wallTitle: "ポスター",
    wallNote: "任意の比率 · 元の構図を保持 · 自動レイアウト", wallLink: "単独ページ",
    narLead: "FRLSports は、レースゲームのイベント運営者とドライバーにプラットフォームと利便性を提供する場所です。",
    ownerLabel: "OWNER / オーナー",
    ownerName: "牢吉爆発！！！"
  };

  function navKey(href) {
    const raw = String(href || "");
    if (raw.includes("#posters")) return "posters";
    const clean = raw.split("#")[0].split("/").pop() || "index.html";
    if (!clean || clean === "index.html") return "home";
    return clean.replace(/\.html$/, "");
  }

  function currentPageKey() {
    const name = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    return (name || "index.html").replace(/\.html$/, "");
  }

  function applyLanguage(locale) {
    const data = I18N[locale] || I18N["zh-Hans"];
    const langMap = { "zh-Hans": "zh-CN", "zh-Hant": "zh-TW", en: "en", ja: "ja" };
    document.documentElement.lang = langMap[locale] || "zh-CN";

    document.querySelectorAll(".nav-link").forEach(function (link) {
      const item = data.nav[navKey(link.getAttribute("href"))];
      if (!item) return;
      const span = link.querySelector("span");
      const small = link.querySelector("small");
      if (span) span.textContent = item[0];
      if (small) small.textContent = item[1];
    });

    document.querySelectorAll(".mobile-link").forEach(function (link) {
      const item = data.nav[navKey(link.getAttribute("href"))];
      if (!item) return;
      const number = link.querySelector("span") ? link.querySelector("span").textContent : "";
      link.innerHTML = "<span>" + number + "</span>" + item[0] + "<small>" + item[1] + "</small>";
    });

    const status = document.querySelector(".site-status");
    if (status) status.innerHTML = "<i aria-hidden=\"true\"></i> " + data.common.status;
    document.querySelectorAll("[data-donate-open]").forEach(function (button) {
      button.textContent = data.common.donate;
    });
    const skip = document.querySelector(".skip-link");
    if (skip) skip.textContent = data.common.skip;
    const kicker = document.querySelector(".mobile-kicker");
    if (kicker) kicker.textContent = data.common.menu;
    const footerCenter = document.querySelector(".footer-center");
    if (footerCenter) footerCenter.textContent = data.common.footerCenter;
    const backTop = document.querySelector(".back-top");
    if (backTop) backTop.innerHTML = data.common.backTop + ' <span>↑</span>';

    const page = data.pages[currentPageKey()];
    if (page) {
      const eyebrow = document.querySelector(".inner-hero .eyebrow");
      const title = document.querySelector(".inner-hero h1");
      const copy = document.querySelector(".inner-hero-copy");
      if (eyebrow) eyebrow.innerHTML = "<span></span> " + page.eyebrow;
      if (title) title.textContent = page.title;
      if (copy) copy.textContent = page.copy;
    }

    const home = data.home;
    const posterEyebrow = document.querySelector(".poster-heading .eyebrow");
    if (posterEyebrow) posterEyebrow.innerHTML = "<span></span> " + home.posterEyebrow;
    const posterHeading = document.getElementById("posterHeading");
    if (posterHeading) posterHeading.textContent = home.posterHeading;
    const posterStage = document.getElementById("posterStage");
    if (posterStage) posterStage.setAttribute("aria-label", home.posterHeading);
    const posterCaption = document.querySelector(".poster-caption small");
    if (posterCaption) posterCaption.textContent = home.posterCaption;
    const posterPrev = document.getElementById("posterPrev");
    if (posterPrev) posterPrev.setAttribute("aria-label", home.prev);
    const posterNext = document.getElementById("posterNext");
    if (posterNext) posterNext.setAttribute("aria-label", home.next);
    const posterDots = document.getElementById("posterDots");
    if (posterDots) posterDots.setAttribute("aria-label", home.dots);
    const wallEyebrow = document.querySelector(".wall-section .section-head .eyebrow");
    if (wallEyebrow) wallEyebrow.innerHTML = "<span></span> " + home.wallEyebrow;
    const wallTitle = document.getElementById("wallTitle");
    if (wallTitle) wallTitle.textContent = home.wallTitle;
    const sectionNote = document.querySelector(".wall-section .section-note");
    if (sectionNote) sectionNote.innerHTML = home.wallNote + '<br><a href="posters.html">' + home.wallLink + " ↗</a>";
    const narLead = document.querySelector(".nar-lead");
    if (narLead) narLead.textContent = home.narLead;
    const ownerLabel = document.querySelector(".nar-owner > span");
    if (ownerLabel) ownerLabel.textContent = home.ownerLabel;
    const ownerName = document.querySelector(".nar-owner strong");
    if (ownerName) ownerName.textContent = home.ownerName;
    if (data.titles && data.titles[currentPageKey()]) document.title = data.titles[currentPageKey()];

    const emptyMap = { eventEmpty: "events", newsEmpty: "news", wallEmpty: "wall", teamEmpty: "teams", productEmpty: "products" };
    Object.keys(emptyMap).forEach(function (id) {
      const host = document.getElementById(id);
      if (!host) return;
      const paragraph = host.querySelector("p");
      if (paragraph) paragraph.textContent = data.empty[emptyMap[id]];
    });

    const donateTitle = document.querySelector(".donate-title");
    if (donateTitle) donateTitle.textContent = data.donation.title;
    const donateIntro = document.querySelector(".donate-intro");
    if (donateIntro) donateIntro.textContent = data.donation.intro;
    const donateScan = document.querySelector(".donate-scan");
    if (donateScan) donateScan.textContent = data.donation.scan;
    document.querySelectorAll(".donate-done").forEach(function (button) { button.textContent = data.donation.close; });

    const select = document.getElementById("languageSelect");
    if (select) select.value = locale;
  }

  function initLanguage() {
    const select = document.getElementById("languageSelect");
    if (!select) return;
    let saved = "zh-Hans";
    try {
      const stored = window.localStorage.getItem("frlsports-locale");
      if (stored && I18N[stored]) saved = stored;
    } catch (error) {}
    applyLanguage(saved);
    select.addEventListener("change", function () {
      const locale = I18N[select.value] ? select.value : "zh-Hans";
      applyLanguage(locale);
      try { window.localStorage.setItem("frlsports-locale", locale); } catch (error) {}
    });
  }

  function initContentDev() {
    if (devWriteFile) {
      devWriteFile.addEventListener("click", function () {
        writeSiteDataFile();
      });
    }

    if (devRailLinks.length) {
      devRailLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          switchDevView(link.dataset.devView);
        });
      });
    }

    if (newsImagePick && newsImageInput) {
      newsImagePick.addEventListener("click", function () {
        newsImageInput.click();
      });
    }

    if (newsImageInput) {
      newsImageInput.addEventListener("change", async function () {
        const file = newsImageInput.files && newsImageInput.files[0];
        newsImageInput.value = "";
        if (!file) return;
        if (!isImageFile(file)) {
          if (newsError) newsError.textContent = "请选择图片文件。";
          return;
        }
        try {
          showToast("正在处理新闻图片…");
          const src = await processNewsImage(file);
          siteState.newsDraftImage = src;
          setNewsDraftImage(src);
          if (newsError) newsError.textContent = "";
        } catch (error) {
          if (newsError) newsError.textContent = "图片处理失败，请换一张图片。";
        }
      });
    }

    if (newsImageClear) {
      newsImageClear.addEventListener("click", function () {
        siteState.newsDraftImage = "";
        setNewsDraftImage("");
        if (newsImageInput) newsImageInput.value = "";
      });
    }

    if (newsForm) {
      newsForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (siteState.newsBusy) return;

        const title = newsTitle ? newsTitle.value.trim() : "";
        const text = newsText ? newsText.value.trim() : "";
        const author = newsAuthor && newsAuthor.value.trim() ? newsAuthor.value.trim() : "FRLSports";

        if (!title || !text) {
          if (newsError) newsError.textContent = "标题和正文不能为空。";
          return;
        }

        siteState.newsBusy = true;
        const item = {
          id: createSiteId("news"),
          title: title.slice(0, 120),
          text: text.slice(0, 2000),
          author: author.slice(0, 60),
          image: siteState.newsDraftImage,
          date: new Date().toISOString()
        };

        try {
          const saved = await persistNews([item].concat(siteState.news));
          if (saved) {
            showToast("新闻已发布。");
            resetNewsForm();
          }
        } finally {
          siteState.newsBusy = false;
        }
      });
    }

    if (newsAdminList) {
      newsAdminList.addEventListener("click", async function (event) {
        const button = event.target.closest("[data-news-delete]");
        if (!button) return;
        if (!window.confirm("确认删除这条新闻？")) return;
        const next = siteState.news.filter(function (item) {
          return item.id !== button.dataset.newsDelete;
        });
        const saved = await persistNews(next);
        if (saved) showToast("新闻已删除。");
      });
    }

    if (eventImportPick && eventArchiveInput) {
      eventImportPick.addEventListener("click", function () {
        eventArchiveInput.click();
      });
    }

    if (eventArchiveInput) {
      eventArchiveInput.addEventListener("change", async function () {
        const file = eventArchiveInput.files && eventArchiveInput.files[0];
        eventArchiveInput.value = "";
        if (file) await importEventArchive(file);
      });
    }

    if (eventAdminList) {
      eventAdminList.addEventListener("click", async function (event) {
        const button = event.target.closest("[data-event-delete]");
        if (!button) return;
        if (!window.confirm("确认删除这个赛事存档？")) return;
        const next = siteState.events.filter(function (item) {
          return item.id !== button.dataset.eventDelete;
        });
        const saved = await persistEvents(next);
        if (saved) showToast("赛事存档已删除。");
      });
    }

    if (galleryPick && galleryFileInput) {
      galleryPick.addEventListener("click", function () {
        galleryFileInput.click();
      });
    }

    if (galleryFileInput) {
      galleryFileInput.addEventListener("change", function () {
        const files = Array.prototype.slice.call(galleryFileInput.files || []);
        galleryFileInput.value = "";
        if (files.length) processGalleryUploads(files);
      });
    }

    if (galleryAdminGrid) {
      galleryAdminGrid.addEventListener("click", async function (event) {
        const button = event.target.closest("[data-gallery-delete]");
        if (!button) return;
        if (!window.confirm("确认删除这张其他海报？")) return;
        const next = siteState.gallery.filter(function (item) {
          return item.id !== button.dataset.galleryDelete;
        });
        const saved = await persistGallery(next);
        if (saved) showToast("其他海报已删除。");
      });
    }

    if (sponsorImagePick && sponsorImageInput) {
      sponsorImagePick.addEventListener("click", function () {
        sponsorImageInput.click();
      });
    }

    if (sponsorImageInput) {
      sponsorImageInput.addEventListener("change", async function () {
        const file = sponsorImageInput.files && sponsorImageInput.files[0];
        sponsorImageInput.value = "";
        if (!file) return;
        if (!isImageFile(file)) {
          if (sponsorError) sponsorError.textContent = "请选择图片文件。";
          return;
        }
        try {
          showToast("正在处理赞助商 Logo…");
          const src = await processSponsorLogo(file);
          siteState.sponsorDraftImage = src;
          setSponsorDraftImage(src);
          if (sponsorError) sponsorError.textContent = "";
        } catch (error) {
          if (sponsorError) sponsorError.textContent = "图片处理失败，请换一张图片。";
        }
      });
    }

    if (sponsorImageClear) {
      sponsorImageClear.addEventListener("click", function () {
        siteState.sponsorDraftImage = "";
        setSponsorDraftImage("");
        if (sponsorImageInput) sponsorImageInput.value = "";
      });
    }

    if (sponsorForm) {
      sponsorForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (siteState.sponsorBusy) return;

        const name = sponsorName ? sponsorName.value.trim() : "";
        const rawUrl = sponsorUrl ? sponsorUrl.value.trim() : "";
        let url = "";
        if (!name) {
          if (sponsorError) sponsorError.textContent = "赞助商名称不能为空。";
          return;
        }
        if (!siteState.sponsorDraftImage) {
          if (sponsorError) sponsorError.textContent = "请上传赞助商 Logo。";
          return;
        }
        if (rawUrl) {
          try {
            const parsed = new URL(rawUrl);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("Invalid protocol");
            url = rawUrl;
          } catch (error) {
            if (sponsorError) sponsorError.textContent = "请输入有效的 http:// 或 https:// 链接。";
            return;
          }
        }

        siteState.sponsorBusy = true;
        const editingId = siteState.sponsorEditingId;
        const item = {
          id: editingId || createSiteId("sponsor"),
          name: name.slice(0, 60),
          url: url.slice(0, 300),
          image: siteState.sponsorDraftImage
        };
        const next = editingId
          ? siteState.sponsors.map(function (entry) { return entry.id === editingId ? item : entry; })
          : siteState.sponsors.concat(item);

        try {
          const saved = await persistSponsors(next);
          if (saved) {
            showToast(editingId ? "赞助商已更新。" : "赞助商已添加。");
            resetSponsorForm();
          }
        } finally {
          siteState.sponsorBusy = false;
        }
      });
    }

    if (sponsorAdminList) {
      sponsorAdminList.addEventListener("click", async function (event) {
        const editButton = event.target.closest("[data-sponsor-edit]");
        if (editButton) {
          const sponsor = siteState.sponsors.find(function (entry) { return entry.id === editButton.dataset.sponsorEdit; });
          if (!sponsor) return;
          siteState.sponsorEditingId = sponsor.id;
          if (sponsorName) sponsorName.value = sponsor.name;
          if (sponsorUrl) sponsorUrl.value = sponsor.url;
          siteState.sponsorDraftImage = sponsor.image;
          setSponsorDraftImage(sponsor.image);
          setFormEditMode(sponsorForm, sponsorCancelEdit, true, "添加赞助商", "SPONSOR ENTRY / 新赞助商", "EDIT SPONSOR / 编辑赞助商");
          if (sponsorError) sponsorError.textContent = "";
          sponsorForm?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const button = event.target.closest("[data-sponsor-delete]");
        if (!button) return;
        if (!window.confirm("确认删除这个赞助商？")) return;
        if (siteState.sponsorEditingId === button.dataset.sponsorDelete) resetSponsorForm();
        const next = siteState.sponsors.filter(function (item) {
          return item.id !== button.dataset.sponsorDelete;
        });
        const saved = await persistSponsors(next);
        if (saved) showToast("赞助商已删除。");
      });
    }
    if (sponsorCancelEdit) sponsorCancelEdit.addEventListener("click", resetSponsorForm);

    if (teamLogoPick && teamLogoInput) {
      teamLogoPick.addEventListener("click", function () {
        teamLogoInput.click();
      });
    }

    if (teamLogoInput) {
      teamLogoInput.addEventListener("change", async function () {
        const file = teamLogoInput.files && teamLogoInput.files[0];
        teamLogoInput.value = "";
        if (!file) return;
        if (!isImageFile(file)) {
          if (teamError) teamError.textContent = "请选择图片文件。";
          return;
        }
        try {
          showToast("正在处理车队 Logo…");
          const src = await processTeamLogo(file);
          siteState.teamDraftImage = src;
          setTeamDraftImage(src);
          if (teamError) teamError.textContent = "";
        } catch (error) {
          if (teamError) teamError.textContent = "图片处理失败，请换一张图片。";
        }
      });
    }

    if (teamLogoClear) {
      teamLogoClear.addEventListener("click", function () {
        siteState.teamDraftImage = "";
        setTeamDraftImage("");
        if (teamLogoInput) teamLogoInput.value = "";
      });
    }

    if (teamForm) {
      teamForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (siteState.teamBusy) return;

        const name = teamName ? teamName.value.trim() : "";
        const nameZh = teamNameZh ? teamNameZh.value.trim() : "";
        const intro = teamIntro ? teamIntro.value.trim() : "";
        const qq = teamQq ? teamQq.value.trim() : "";

        if (!name || !nameZh || !intro) {
          if (teamError) teamError.textContent = "名称、中文名称和简介不能为空。";
          return;
        }
        if (!siteState.teamDraftImage) {
          if (teamError) teamError.textContent = "请上传车队 Logo。";
          return;
        }

        siteState.teamBusy = true;
        const editingId = siteState.teamEditingId;
        const item = {
          id: editingId || createSiteId("team"),
          name: name.slice(0, 80),
          nameZh: nameZh.slice(0, 40),
          intro: intro.slice(0, 600),
          qq: qq.slice(0, 40),
          logo: siteState.teamDraftImage
        };
        const next = editingId
          ? siteState.teams.map(function (entry) { return entry.id === editingId ? item : entry; })
          : siteState.teams.concat(item);

        try {
          const saved = await persistTeams(next);
          if (saved) {
            showToast(editingId ? "车队已更新。" : "车队已添加。");
            resetTeamForm();
          }
        } finally {
          siteState.teamBusy = false;
        }
      });
    }

    if (teamAdminList) {
      teamAdminList.addEventListener("click", async function (event) {
        const editButton = event.target.closest("[data-team-edit]");
        if (editButton) {
          const team = siteState.teams.find(function (entry) { return entry.id === editButton.dataset.teamEdit; });
          if (!team) return;
          siteState.teamEditingId = team.id;
          if (teamName) teamName.value = team.name;
          if (teamNameZh) teamNameZh.value = team.nameZh;
          if (teamIntro) teamIntro.value = team.intro;
          if (teamQq) teamQq.value = team.qq;
          siteState.teamDraftImage = team.logo;
          setTeamDraftImage(team.logo);
          setFormEditMode(teamForm, teamCancelEdit, true, "添加车队", "TEAM ENTRY / 新车队", "EDIT TEAM / 编辑车队");
          if (teamError) teamError.textContent = "";
          teamForm?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const button = event.target.closest("[data-team-delete]");
        if (!button) return;
        if (!window.confirm("确认删除这支车队？")) return;
        if (siteState.teamEditingId === button.dataset.teamDelete) resetTeamForm();
        const next = siteState.teams.filter(function (item) {
          return item.id !== button.dataset.teamDelete;
        });
        const saved = await persistTeams(next);
        if (saved) showToast("车队已删除。");
      });
    }
    if (teamCancelEdit) teamCancelEdit.addEventListener("click", resetTeamForm);

    if (productLogoPick && productLogoInput) {
      productLogoPick.addEventListener("click", function () {
        productLogoInput.click();
      });
    }

    if (productLogoInput) {
      productLogoInput.addEventListener("change", async function () {
        const file = productLogoInput.files && productLogoInput.files[0];
        productLogoInput.value = "";
        if (!file) return;
        if (!isImageFile(file)) {
          if (productError) productError.textContent = "请选择图片文件。";
          return;
        }
        try {
          showToast("正在处理产品 Logo…");
          const src = await processProductLogo(file);
          siteState.productDraftImage = src;
          setProductDraftImage(src);
          if (productError) productError.textContent = "";
        } catch (error) {
          if (productError) productError.textContent = "图片处理失败，请换一张图片。";
        }
      });
    }

    if (productLogoClear) {
      productLogoClear.addEventListener("click", function () {
        siteState.productDraftImage = "";
        setProductDraftImage("");
        if (productLogoInput) productLogoInput.value = "";
      });
    }

    if (productImagesPick && productImagesInput) {
      productImagesPick.addEventListener("click", function () {
        productImagesInput.click();
      });
    }

    if (productImagesInput) {
      productImagesInput.addEventListener("change", async function () {
        const files = Array.prototype.slice.call(productImagesInput.files || []);
        productImagesInput.value = "";
        if (!files.length) return;
        const remaining = 8 - siteState.productDraftImages.length;
        if (remaining <= 0) {
          showToast("产品介绍图最多 8 张。");
          return;
        }
        const accepted = files.filter(isImageFile).slice(0, remaining);
        if (!accepted.length) {
          if (productError) productError.textContent = "请选择图片文件。";
          return;
        }
        try {
          showToast("正在处理产品介绍图…");
          for (const file of accepted) {
            const src = await processProductIntroImage(file);
            siteState.productDraftImages.push(src);
          }
          setProductImagesPreview(siteState.productDraftImages);
          if (productError) productError.textContent = "";
        } catch (error) {
          if (productError) productError.textContent = "图片处理失败，请重试。";
        }
      });
    }

    if (productImagesClear) {
      productImagesClear.addEventListener("click", function () {
        siteState.productDraftImages = [];
        setProductImagesPreview([]);
        if (productImagesInput) productImagesInput.value = "";
      });
    }

    if (productForm) {
      productForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (siteState.productBusy) return;

        const name = productName ? productName.value.trim() : "";
        const nameZh = productNameZh ? productNameZh.value.trim() : "";
        const price = productPrice ? productPrice.value.trim() : "";
        const intro = productIntro ? productIntro.value.trim() : "";

        if (!name || !nameZh || !intro) {
          if (productError) productError.textContent = "名称、中文名称和简介不能为空。";
          return;
        }
        if (!siteState.productDraftImage) {
          if (productError) productError.textContent = "请上传产品 Logo。";
          return;
        }

        siteState.productBusy = true;
        const editingId = siteState.productEditingId;
        const item = {
          id: editingId || createSiteId("product"),
          name: name.slice(0, 80),
          nameZh: nameZh.slice(0, 40),
          price: price.slice(0, 40),
          intro: intro.slice(0, 600),
          logo: siteState.productDraftImage,
          images: siteState.productDraftImages.slice()
        };
        const next = editingId
          ? siteState.products.map(function (entry) { return entry.id === editingId ? item : entry; })
          : siteState.products.concat(item);

        try {
          const saved = await persistProducts(next);
          if (saved) {
            showToast(editingId ? "产品已更新。" : "产品已添加。");
            resetProductForm();
          }
        } finally {
          siteState.productBusy = false;
        }
      });
    }

    if (productAdminList) {
      productAdminList.addEventListener("click", async function (event) {
        const editButton = event.target.closest("[data-product-edit]");
        if (editButton) {
          const product = siteState.products.find(function (entry) { return entry.id === editButton.dataset.productEdit; });
          if (!product) return;
          siteState.productEditingId = product.id;
          if (productName) productName.value = product.name;
          if (productNameZh) productNameZh.value = product.nameZh;
          if (productPrice) productPrice.value = product.price;
          if (productIntro) productIntro.value = product.intro;
          siteState.productDraftImage = product.logo;
          siteState.productDraftImages = (product.images || []).slice();
          setProductDraftImage(product.logo);
          setProductImagesPreview(siteState.productDraftImages);
          setFormEditMode(productForm, productCancelEdit, true, "添加产品", "PRODUCT ENTRY / 新产品", "EDIT PRODUCT / 编辑产品");
          if (productError) productError.textContent = "";
          productForm?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const button = event.target.closest("[data-product-delete]");
        if (!button) return;
        if (!window.confirm("确认删除这个产品？")) return;
        if (siteState.productEditingId === button.dataset.productDelete) resetProductForm();
        const next = siteState.products.filter(function (item) {
          return item.id !== button.dataset.productDelete;
        });
        const saved = await persistProducts(next);
        if (saved) showToast("产品已删除。");
      });
    }
    if (productCancelEdit) productCancelEdit.addEventListener("click", resetProductForm);

    if (newsTitle) newsTitle.addEventListener("input", function () { if (newsError) newsError.textContent = ""; });
    if (newsText) newsText.addEventListener("input", function () { if (newsError) newsError.textContent = ""; });
    if (newsAuthor) newsAuthor.addEventListener("input", function () { if (newsError) newsError.textContent = ""; });
    if (sponsorName) sponsorName.addEventListener("input", function () { if (sponsorError) sponsorError.textContent = ""; });
    if (sponsorUrl) sponsorUrl.addEventListener("input", function () { if (sponsorError) sponsorError.textContent = ""; });
    if (teamName) teamName.addEventListener("input", function () { if (teamError) teamError.textContent = ""; });
    if (teamNameZh) teamNameZh.addEventListener("input", function () { if (teamError) teamError.textContent = ""; });
    if (teamIntro) teamIntro.addEventListener("input", function () { if (teamError) teamError.textContent = ""; });
    if (productName) productName.addEventListener("input", function () { if (productError) productError.textContent = ""; });
    if (productNameZh) productNameZh.addEventListener("input", function () { if (productError) productError.textContent = ""; });
    if (productPrice) productPrice.addEventListener("input", function () { if (productError) productError.textContent = ""; });
    if (productIntro) productIntro.addEventListener("input", function () { if (productError) productError.textContent = ""; });
  }

  async function initSiteContent() {
    try {
      const values = await Promise.all([
        readSiteCollection("news"),
        readSiteCollection("gallery"),
        readSiteCollection("events"),
        readSiteCollection("teams"),
        readSiteCollection("products"),
        readSiteCollection("sponsors")
      ]);

      siteState.news = sanitizeNews(values[0]) || [];
      siteState.gallery = sanitizeGallery(values[1]) || [];
      siteState.events = sanitizeEvents(values[2]) || [];
      siteState.teams = sanitizeTeams(values[3]) || [];
      siteState.products = sanitizeProducts(values[4]) || [];
      siteState.sponsors = sanitizeSponsors(values[5]) || [];
    } catch (error) {
      siteState.news = [];
      siteState.gallery = [];
      siteState.events = [];
      siteState.teams = [];
      siteState.products = [];
      siteState.sponsors = [];
    }

    siteState.ready = true;
    renderPosterWall();
    renderNewsSection();
    renderEventsPage();
    renderTeamsPage();
    renderProductsPage();
    renderSponsorBar();
    renderNewsAdmin();
    renderEventAdmin();
    renderGalleryAdmin();
    renderTeamAdmin();
    renderProductAdmin();
    renderSponsorAdmin();
  }

  initPosterDrop();
  initImageDrops();
  initPosterCarousel();
  initPosterDev();
  initContentDev();
  initDetails();
  initPosterLightbox();
  initDonation();
  initLanguage();
  initSiteContent();

  // Make sure the visual menu state is reset when coming back through browser cache.
  window.addEventListener("pageshow", () => {
    if (desktopQuery.matches) setMenu(false, false);
  });
})();
