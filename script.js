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

let colorDataMap = {};
let allColorsFlat = [];
let currentCategoryIndex = 0;
let globalCurrentIndex = 0;
let isDetailView = false;

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  loadCSVAndInit();
});

async function loadCSVAndInit() {
  try {
    const response = await fetch(CSV_FILE_PATH);
    if (!response.ok) {
      throw new Error(`CSVの読み込みに失敗しました: ${response.status}`);
    }
    const csvText = await response.text();
    
    parseCSV(csvText);
    switchCategoryByIndex(0);
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
    const munsell = cols[5] || "-";

    const textColor = getContrastTextColor(hex);

    const item = {
      categoryKey: catKey,
      kanaName,
      name,
      hex,
      munsell,
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
      switchCategoryByIndex(idx);
    });
  });

  // 【修正】一重矢印ボタン（< >）で操作
  document.getElementById("hdr-prev-btn").addEventListener("click", () => {
    if (isDetailView) {
      navigateGlobalColor(-1);
    } else {
      navigateCategory(-1);
    }
  });

  document.getElementById("hdr-next-btn").addEventListener("click", () => {
    if (isDetailView) {
      navigateGlobalColor(1);
    } else {
      navigateCategory(1);
    }
  });
}

function switchCategoryByIndex(catIndex) {
  currentCategoryIndex = catIndex;
  isDetailView = false;

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
  switchCategoryByIndex(newCatIdx);
}

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

    card.addEventListener("click", () => {
      const gIdx = allColorsFlat.indexOf(item);
      showDetailView(gIdx >= 0 ? gIdx : 0);
    });

    listView.appendChild(card);
  });
}

/**
 * 【修正】カラーサンプル画面のレンダリング
 * - メイン内の左右矢印を削除
 * - 不要なラベル/カッコ/RGB数値を削除し、要求通りの太目でおしゃれな文字配置に変更
 */
function showDetailView(globalIdx) {
  globalCurrentIndex = globalIdx;
  isDetailView = true;

  const colorData = allColorsFlat[globalCurrentIndex];
  if (!colorData) return;

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
  detailView.style.display = "block";

  detailView.style.backgroundColor = colorData.hex;
  detailView.style.color = colorData.textColor;

  // メインエリア内の矢印を削除し、指定のテキスト構成のみを出力
  detailView.innerHTML = `
    <div class="detail-top-left-info">
      <div class="info-kana">${colorData.kanaName}</div>
      <div class="info-kanji">${colorData.name}</div>
      <div class="info-rgb-group">
        <span class="info-rgb-label">RGB：</span>
        <span class="info-hex">${colorData.hex.toUpperCase()}</span>
      </div>
      <div class="info-munsell">マンセル値：${colorData.munsell}</div>
    </div>
  `;
}

function navigateGlobalColor(step) {
  let newGIdx = globalCurrentIndex + step;
  if (newGIdx < 0) {
    newGIdx = allColorsFlat.length - 1;
  } else if (newGIdx >= allColorsFlat.length) {
    newGIdx = 0;
  }
  showDetailView(newGIdx);
}