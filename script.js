const CSV_FILE_PATH = 'iro.csv';

// HTML側のボタン表記とCSV（1列目）の定義順・英語キー対応
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

let colorDataMap = {};          // { red: [...], orange: [...] }
let allColorsFlat = [];         // 全色を繋げた平坦化配列（系統またぎ移動用）
let currentCategoryIndex = 0;   // 現在選択中の系統インデックス
let globalCurrentIndex = 0;     // 全色配列における現在表示中のインデックス
let isDetailView = false;       // 詳細画面表示中フラグ

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  loadCSVAndInit();
});

/**
 * 1. CSVファイルを読み込んで初期化
 */
async function loadCSVAndInit() {
  try {
    const response = await fetch(CSV_FILE_PATH);
    if (!response.ok) {
      throw new Error(`CSVの読み込みに失敗しました: ${response.status}`);
    }
    const csvText = await response.text();
    
    parseCSV(csvText);
    switchCategoryByIndex(0); // 初期状態は赤系
  } catch (error) {
    console.error("CSV読み込みエラー:", error);
  }
}

/**
 * 2. iro.csv のパース処理
 * 列0: カテゴリ(red等), 列1: No, 列2: かな/カタカナ, 列3: 日本語/英語名, 列4: HEX, 列5: マンセル値
 */
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
    const munsell = cols[5] || "-";

    const rgbStr = hexToRGB(hex);
    const textColor = getContrastTextColor(hex);

    const item = {
      categoryKey: catKey,
      kanaName,
      name,
      hex,
      rgbStr,
      munsell,
      textColor
    };

    if (!colorDataMap[catKey]) {
      colorDataMap[catKey] = [];
    }
    colorDataMap[catKey].push(item);
  });

  // CATEGORY_LIST の順番で全色配列を作成
  CATEGORY_LIST.forEach(cat => {
    if (colorDataMap[cat.key]) {
      allColorsFlat.push(...colorDataMap[cat.key]);
    }
  });
}

/**
 * HEXからRGB文字表現を生成（例: RGB(237, 160, 152)）
 */
function hexToRGB(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return `RGB(${r}, ${g}, ${b})`;
}

/**
 * 背景色に応じてテキスト色（白/黒）を判定
 */
function getContrastTextColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#333333' : '#FFFFFF';
}

/**
 * 3. ヘッダーメニューの初期化とイベント設定
 */
function initHeaderMenu() {
  const navButtons = document.querySelectorAll("#category-nav button");

  // カテゴリボタンをクリックした時
  navButtons.forEach((button, idx) => {
    button.addEventListener("click", () => {
      switchCategoryByIndex(idx);
    });
  });

  // ヘッダーの左右矢印ボタン（《 》）
  document.getElementById("hdr-prev-btn").addEventListener("click", () => {
    if (isDetailView) {
      navigateGlobalColor(-1); // 詳細時は前の色へ
    } else {
      navigateCategory(-1);    // 一覧時は前の色系へ
    }
  });

  document.getElementById("hdr-next-btn").addEventListener("click", () => {
    if (isDetailView) {
      navigateGlobalColor(1);  // 詳細時は次の色へ
    } else {
      navigateCategory(1);     // 一覧時は次の色系へ
    }
  });
}

/**
 * 4. インデックスによる色系の切り替え
 */
function switchCategoryByIndex(catIndex) {
  currentCategoryIndex = catIndex;
  isDetailView = false;

  // アクティブクラスの切り替え
  const navButtons = document.querySelectorAll("#category-nav button");
  navButtons.forEach((btn, idx) => {
    if (idx === catIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const catKey = CATEGORY_LIST[catIndex].key;
  const colorList = colorDataMap[catKey] || [];

  document.getElementById("list-view").style.display = "grid";
  document.getElementById("detail-view").style.display = "none";

  renderListView(colorList);
}

/**
 * 5. 一覧時の色系移動（《 》ボタン用）
 */
function navigateCategory(step) {
  let newCatIdx = currentCategoryIndex + step;
  if (newCatIdx < 0) {
    newCatIdx = CATEGORY_LIST.length - 1;
  } else if (newCatIdx >= CATEGORY_LIST.length) {
    newCatIdx = 0;
  }
  switchCategoryByIndex(newCatIdx);
}

/**
 * 6. 一覧カード描画
 */
function renderListView(colorList) {
  const listView = document.getElementById("list-view");
  listView.innerHTML = "";

  colorList.forEach((item) => {
    const card = document.createElement("div");
    card.className = "color-card";
    card.style.backgroundColor = item.hex;
    card.style.color = item.textColor;

    card.innerHTML = `
      <div class="color-card-content">
        <span class="color-name">${item.kanaName}</span>
        <span class="color-code">${item.hex.toUpperCase()}</span>
      </div>
    `;

    // 全色配列内のインデックスを探して詳細画面を開く
    card.addEventListener("click", () => {
      const gIdx = allColorsFlat.indexOf(item);
      showDetailView(gIdx >= 0 ? gIdx : 0);
    });

    listView.appendChild(card);
  });
}

/**
 * 7. 各色カラーサンプル画面の表示（左上に詳細情報を配置）
 */
function showDetailView(globalIdx) {
  globalCurrentIndex = globalIdx;
  isDetailView = true;

  const colorData = allColorsFlat[globalCurrentIndex];
  if (!colorData) return;

  // 該当色の所属カテゴリに合わせてヘッダーのマークアップを更新
  const catIdx = CATEGORY_LIST.findIndex(c => c.key === colorData.categoryKey);
  if (catIdx >= 0) {
    currentCategoryIndex = catIdx;
    const navButtons = document.querySelectorAll("#category-nav button");
    navButtons.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === catIdx);
    });
  }

  document.getElementById("list-view").style.display = "none";
  const detailView = document.getElementById("detail-view");
  detailView.style.display = "flex";

  // 全画面バックグラウンド指定
  detailView.style.backgroundColor = colorData.hex;
  detailView.style.color = colorData.textColor;

  // 左上に指定された詳細情報を配置
  detailView.innerHTML = `
    <div class="detail-top-left-info">
      <div><strong>いろ名：</strong>${colorData.kanaName}</div>
      <div><strong>名称：</strong>${colorData.name}</div>
      <div><strong>RGB値：</strong>${colorData.rgbStr} (${colorData.hex.toUpperCase()})</div>
      <div><strong>マンセル値：</strong>${colorData.munsell}</div>
    </div>
    <button class="nav-arrow" id="prev-btn" aria-label="前の色">&lt;</button>
    <button class="nav-arrow" id="next-btn" aria-label="次の色">&gt;</button>
  `;

  document.getElementById("prev-btn").onclick = (e) => {
    e.stopPropagation();
    navigateGlobalColor(-1);
  };
  document.getElementById("next-btn").onclick = (e) => {
    e.stopPropagation();
    navigateGlobalColor(1);
  };
}

/**
 * 8. 詳細時の全色移動（系統を跨いで次の色系へ進む）
 */
function navigateGlobalColor(step) {
  let newGIdx = globalCurrentIndex + step;
  if (newGIdx < 0) {
    newGIdx = allColorsFlat.length - 1;
  } else if (newGIdx >= allColorsFlat.length) {
    newGIdx = 0;
  }
  showDetailView(newGIdx);
}