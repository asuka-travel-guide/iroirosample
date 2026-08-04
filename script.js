const CSV_FILE_PATH = 'iro.csv';

const CATEGORY_LIST = [
  { name: "赤系", key: "red" },
  { name: "橙系", key: "orange" },
  { name: "茶系", key: "brown" },
  { name: "黄系", key: "yellow" },
  { name: "緑系", key: "green" },
  { name: "青系", key: "blue" },
  { name: "紫系", key: "purple" },
  { name: "桃系", key: "pink" },
  { name: "白黒", key: "mono" }
];

const DEFAULT_META = {
  title: "カラーサンプル | JIS規格(Z 8102)・RGB・HEX対応 673色一覧",
  description: "JIS規格 Z 8102:2001（物体色の色名）269色を含む全673色のカラーサンプルサイト。各色のRGB（16進数カラーコード）を網羅したシンプルで使いやすい色見本帳です。"
};

let colorDataMap = {};
let allColorsFlat = [];
let currentCategoryIndex = 0;
let globalCurrentIndex = 0;
let isDetailView = false;

// フリック操作用変数
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  initFlickEvents();
  loadCSVAndInit();

  // ブラウザの「戻る」「進む」ボタン操作（URLパラメータ変更）に対応
  window.addEventListener("popstate", handleUrlChange);
});

async function loadCSVAndInit() {
  try {
    const response = await fetch(CSV_FILE_PATH);
    if (!response.ok) {
      throw new Error(`CSVの読み込みに失敗しました: ${response.status}`);
    }
    const csvText = await response.text();
    
    parseCSV(csvText);

    // 初回ロード時にURLパラメータ（?color=◯◯）をチェック
    handleUrlChange();
  } catch (error) {
    console.error("CSV読み込みエラー:", error);
  }
}

function parseCSV(text) {
  const lines = text.trim().split(/\r\n|\n/);
  colorDataMap = {};
  allColorsFlat = [];

  lines.forEach(line => {
    if (!line.trim()) return;
    const cols = line.split(',').map(item => item.trim());
    if (cols.length < 5) return;

    const catKey = cols[0].toLowerCase();
    const kanaName = cols[2] || "";
    const name = cols[3] || "";
    const rawHex = cols[4] || "FFFFFF";
    const hex = rawHex.startsWith('#') ? rawHex : `#${rawHex}`;

    const textColor = getContrastTextColor(hex);

    const item = {
      categoryKey: catKey,
      kanaName,
      name,
      hex,
      textColor
    };

    if (!colorDataMap[catKey]) {
      colorDataMap[catKey] = [];
    }
    colorDataMap[catKey].push(item);
  });

  CATEGORY_LIST.forEach(cat => {
    if (colorDataMap[cat.key]) {
      allColorsFlat.push(...colorDataMap[cat.key]);
    }
  });
}

function getContrastTextColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#333333' : '#FFFFFF';
}

function initHeaderMenu() {
  const navButtons = document.querySelectorAll("#category-nav button");

  navButtons.forEach((button, idx) => {
    button.addEventListener("click", () => {
      // 一覧に戻る際はURLパラメータを消去
      history.pushState(null, "", window.location.pathname);
      switchCategoryByIndex(idx);
    });
  });

  document.getElementById("hdr-prev-btn").addEventListener("click", () => {
    handlePrevNavigation();
  });

  document.getElementById("hdr-next-btn").addEventListener("click", () => {
    handleNextNavigation();
  });
}

/**
 * 前へ移動する共通処理
 */
function handlePrevNavigation() {
  if (isDetailView) {
    navigateGlobalColor(-1);
  } else {
    navigateCategory(-1);
  }
}

/**
 * 次へ移動する共通処理
 */
function handleNextNavigation() {
  if (isDetailView) {
    navigateGlobalColor(1);
  } else {
    navigateCategory(1);
  }
}

/**
 * フリック（スワイプ）操作の初期化
 */
function initFlickEvents() {
  const targetArea = document.body;

  targetArea.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  targetArea.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });
}

/**
 * スワイプの判定処理
 */
function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  const minSwipeDistance = 50; // スワイプ検知の最小距離（px）

  // 縦スクロールと誤判定しないよう、横移動量が十分大きく縦移動より大きい場合のみ検知
  if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      // 左スワイプ（指を左へ＝次へ）
      handleNextNavigation();
    } else {
      // 右スワイプ（指を右へ＝前へ）
      handlePrevNavigation();
    }
  }
}

/**
 * URLパラメータ（例: ?color=肉桂色）を判定して画面を切り替える
 */
function handleUrlChange() {
  const urlParams = new URLSearchParams(window.location.search);
  const colorParam = urlParams.get('color');

  if (colorParam) {
    const decodedParam = decodeURIComponent(colorParam).trim();
    // ひらがな・漢字名で一致する色を検索
    const foundIdx = allColorsFlat.findIndex(
      item => item.kanaName === decodedParam || item.name === decodedParam
    );

    if (foundIdx >= 0) {
      showDetailView(foundIdx, false); // URL更新を行わずに表示
      return;
    }
  }

  // パラメータがない、または見つからない場合はデフォルトカテゴリ（0）を表示
  switchCategoryByIndex(currentCategoryIndex || 0);
}

function switchCategoryByIndex(catIndex) {
  currentCategoryIndex = catIndex;
  isDetailView = false;

  // デフォルトのメタ・タイトルに戻す
  updateMetaTags(DEFAULT_META.title, DEFAULT_META.description);

  const navButtons = document.querySelectorAll("#category-nav button");
  navButtons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === catIndex);
  });

  const catKey = CATEGORY_LIST[catIndex].key;
  const colorList = colorDataMap[catKey] || [];

  document.getElementById("list-view").style.display = "grid";
  document.getElementById("detail-view").style.display = "none";

  renderListView(colorList);
}

function navigateCategory(step) {
  let newCatIdx = currentCategoryIndex + step;
  if (newCatIdx < 0) {
    newCatIdx = CATEGORY_LIST.length - 1;
  } else if (newCatIdx >= CATEGORY_LIST.length) {
    newCatIdx = 0;
  }
  
  history.pushState(null, "", window.location.pathname);
  switchCategoryByIndex(newCatIdx);
}

function renderListView(colorList) {
  const listView = document.getElementById("list-view");
  listView.innerHTML = "";

  colorList.forEach((item) => {
    // 検索エンジンが各色リンクをクロールできるよう <a> タグ構造に変更
    const card = document.createElement("a");
    card.className = "color-card";
    card.style.backgroundColor = item.hex;
    card.style.color = item.textColor;
    card.style.textDecoration = "none"; // リンクの下線を削除
    card.href = `?color=${encodeURIComponent(item.kanaName)}`;

    card.innerHTML = `
      <div class="color-card-content">
        <span class="color-name">${item.kanaName}</span>
        <span class="color-code">${item.hex.toUpperCase()}</span>
      </div>
    `;

    card.addEventListener("click", (e) => {
      e.preventDefault(); // 通常のページ遷移を防止してSPA風に高速切替
      const gIdx = allColorsFlat.indexOf(item);
      showDetailView(gIdx >= 0 ? gIdx : 0, true);
    });

    listView.appendChild(card);
  });
}

/**
 * カラーサンプル（詳細画面）の表示
 * @param {number} globalIdx - カラーインデックス
 * @param {boolean} updateHistory - URL（パラメータ）履歴を更新するかどうか
 */
function showDetailView(globalIdx, updateHistory = true) {
  globalCurrentIndex = globalIdx;
  isDetailView = true;

  const colorData = allColorsFlat[globalCurrentIndex];
  if (!colorData) return;

  // カテゴリハイライトの同期
  const catIdx = CATEGORY_LIST.findIndex(c => c.key === colorData.categoryKey);
  if (catIdx >= 0) {
    currentCategoryIndex = catIdx;
    const navButtons = document.querySelectorAll("#category-nav button");
    navButtons.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === catIdx);
    });
  }

  // URLパラメータの設定
  const newUrl = `?color=${encodeURIComponent(colorData.kanaName)}`;
  if (updateHistory) {
    history.pushState(null, "", newUrl);
  }

  // SEO用メタタグ & タイトルの動的書き換え
  const pageTitle = `${colorData.kanaName}（${colorData.name}）の色見本・カラーサンプル | RGB: ${colorData.hex.toUpperCase()}`;
  const pageDesc = `${colorData.kanaName}（${colorData.name}）のカラーサンプル・色見本ページです。16進数カラーコード（${colorData.hex.toUpperCase()}）や配色詳細を確認できます。`;
  updateMetaTags(pageTitle, pageDesc);

  // 画面切替
  document.getElementById("list-view").style.display = "none";
  const detailView = document.getElementById("detail-view");
  detailView.style.display = "block";

  detailView.style.backgroundColor = colorData.hex;
  detailView.style.color = colorData.textColor;

  detailView.innerHTML = `
    <div class="detail-top-left-info">
      <div class="info-kana">${colorData.kanaName}</div>
      <div class="info-kanji">${colorData.name}</div>
      <div class="info-rgb-group">
        <span class="info-rgb-label">RGB：</span><span class="info-hex">${colorData.hex.toUpperCase()}</span>
      </div>
    </div>
  `;
}

/**
 * `<title>` および SEO・OGPメタタグを動的に書き換える関数
 */
function updateMetaTags(titleText, descText) {
  document.title = titleText;

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", descText);

  // OG Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", titleText);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", descText);

  // OG URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", window.location.href);
}

function navigateGlobalColor(step) {
  let newGIdx = globalCurrentIndex + step;
  if (newGIdx < 0) {
    newGIdx = allColorsFlat.length - 1;
  } else if (newGIdx >= allColorsFlat.length) {
    newGIdx = 0;
  }
  showDetailView(newGIdx, true);
}