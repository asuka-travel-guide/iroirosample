// CSVファイルのパス（ファイル名に合わせて変更してください）
const CSV_FILE_PATH = 'iro.csv';

// HTML側の日本語カテゴリ名と、CSV（1列目）の英語カテゴリ名のマッピング表
const CATEGORY_MAP = {
  "赤系": "red",
  "オレンジ系": "orange",
  "茶系": "brown",
  "黄系": "yellow",
  "緑系": "green",
  "青系": "blue",
  "紫系": "purple",
  "ピンク系": "pink",
  "白黒系": "mono"
};

let colorDataMap = {};
let currentCategoryName = "赤系";
let currentFlatList = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  loadCSVAndInit();
});

/**
 * 1. CSVファイルを取得して読み込み＆初期化
 */
async function loadCSVAndInit() {
  try {
    const response = await fetch(CSV_FILE_PATH);
    if (!response.ok) {
      throw new Error(`CSVの読み込みに失敗しました: ${response.status}`);
    }
    const csvText = await response.text();
    
    // CSVテキストをカテゴリごとのオブジェクトにパース
    colorDataMap = parseCSV(csvText);

    // 初期表示（赤系）
    switchCategory("赤系");
  } catch (error) {
    console.error("CSV読み込みエラー:", error);
  }
}

/**
 * 2. CSV（ヘッダーなし、カンマ区切り）のパース処理
 */
function parseCSV(text) {
  const lines = text.trim().split(/\r\n|\n/);
  const result = {};

  lines.forEach(line => {
    if (!line.trim()) return;
    
    // カンマ区切り
    const cols = line.split(',').map(item => item.trim());
    if (cols.length < 5) return;

    const csvCategory = cols[0].toLowerCase(); // 例: 'red'
    const name = cols[2];                       // 列2: 色名
    const rawHex = cols[4];                     // 列4: 16進数（#なし）
    const hex = rawHex.startsWith('#') ? rawHex : `#${rawHex}`;

    // 背景色の明暗を自動判定して文字色（白 or 黒）を決める関数
    const textColor = getContrastTextColor(hex);

    const item = { name, hex, textColor };

    if (!result[csvCategory]) {
      result[csvCategory] = [];
    }
    result[csvCategory].push(item);
  });

  return result;
}

/**
 * 背景色（HEX）の輝度を計算し、文字色を白(#FFFFFF)か黒(#333333)に自動決定する
 */
function getContrastTextColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // YIQ方式による輝度計算
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#333333' : '#FFFFFF';
}

/**
 * 3. ヘッダーメニュー初期化
 */
function initHeaderMenu() {
  const navButtons = document.querySelectorAll("header nav button");

  navButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      navButtons.forEach(btn => btn.classList.remove("active"));
      
      const targetBtn = e.currentTarget;
      targetBtn.classList.add("active");

      const categoryName = targetBtn.getAttribute("data-category") || targetBtn.textContent.trim();
      switchCategory(categoryName);
    });
  });
}

/**
 * 4. 系統（カテゴリ）切り替え
 */
function switchCategory(categoryName) {
  currentCategoryName = categoryName;
  
  // 日本語のカテゴリ名（例: "赤系"）を CSV内の英語名（例: "red"）に変換
  const csvKey = CATEGORY_MAP[categoryName] || categoryName;
  currentFlatList = colorDataMap[csvKey] || [];

  document.getElementById("list-view").style.display = "grid";
  document.getElementById("detail-view").style.display = "none";

  renderListView(currentFlatList);
}

/**
 * 5. 一覧カード描画（カード背景＝その色、角丸統一、文字色自動計算）
 */
function renderListView(colorList) {
  const listView = document.getElementById("list-view");
  listView.innerHTML = "";

  colorList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "color-card";
    card.style.backgroundColor = item.hex;
    card.style.color = item.textColor;

    card.innerHTML = `
      <div class="color-card-content">
        <span class="color-name">${item.name}</span>
        <span class="color-code">${item.hex.toUpperCase()}</span>
      </div>
    `;

    card.addEventListener("click", () => showDetailView(index));
    listView.appendChild(card);
  });
}

/**
 * 6. 詳細画面表示（ヘッダー以外をその色に＋矢印のみ）
 */
function showDetailView(index) {
  currentIndex = index;
  const colorData = currentFlatList[currentIndex];
  if (!colorData) return;

  document.getElementById("list-view").style.display = "none";
  const detailView = document.getElementById("detail-view");
  detailView.style.display = "flex";

  detailView.style.backgroundColor = colorData.hex;
  detailView.style.color = colorData.textColor;

  detailView.innerHTML = `
    <button class="nav-arrow" id="prev-btn" aria-label="前の色">&lt;</button>
    <div class="detail-center-info">
      <div class="color-name">${colorData.name}</div>
      <div class="color-code">${colorData.hex.toUpperCase()}</div>
    </div>
    <button class="nav-arrow" id="next-btn" aria-label="次の色">&gt;</button>
  `;

  document.getElementById("prev-btn").onclick = (e) => {
    e.stopPropagation();
    navigateDetail(-1);
  };
  document.getElementById("next-btn").onclick = (e) => {
    e.stopPropagation();
    navigateDetail(1);
  };
}

/**
 * 7. 前へ・次へ移動
 */
function navigateDetail(step) {
  let newIndex = currentIndex + step;
  if (newIndex < 0) {
    newIndex = currentFlatList.length - 1;
  } else if (newIndex >= currentFlatList.length) {
    newIndex = 0;
  }
  showDetailView(newIndex);
}