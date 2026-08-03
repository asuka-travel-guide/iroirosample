// サンプルデータ構造（実際のデータに合わせて調整してください）
const sampleColorData = {
  "赤系": [
    { name: "茜色", hex: "#B7282E", textColor: "#FFFFFF" },
    { name: "朱色", hex: "#EB6100", textColor: "#FFFFFF" },
    { name: "紅赤", hex: "#D7003A", textColor: "#FFFFFF" }
  ],
  "ピンク系": [
    { name: "桜色", hex: "#FEF4F4", textColor: "#333333" },
    { name: "桃色", hex: "#F09199", textColor: "#FFFFFF" }
  ],
  "白黒系": [
    { name: "漆黒", hex: "#0D0015", textColor: "#FFFFFF" },
    { name: "白銀", hex: "#C0C0C0", textColor: "#333333" }
  ]
};

// 現在選択されている状態の管理
let currentCategory = "赤系";
let currentFlatList = []; // 現在の系統の色配列
let currentIndex = 0;     // 詳細画面で開いている色のインデックス

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  switchCategory(currentCategory);
});

/**
 * 1. ヘッダーメニューの初期化とクリック監視
 */
function initHeaderMenu() {
  const navButtons = document.querySelectorAll("header nav button");

  navButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      // 全ボタンから active を外す
      navButtons.forEach(btn => btn.classList.remove("active"));
      
      // 押されたボタンに active を付与
      e.currentTarget.classList.add("active");

      // カテゴリ切り替え（ボタンのテキスト等から取得）
      const catName = e.currentTarget.textContent.trim();
      if (sampleColorData[catName]) {
        switchCategory(catName);
      }
    });
  });
}

/**
 * 2. 系統（カテゴリ）切り替え処理
 */
function switchCategory(categoryName) {
  currentCategory = categoryName;
  currentFlatList = sampleColorData[categoryName] || [];

  // 一覧表示画面を表示、詳細画面を隠す
  document.getElementById("list-view").style.display = "grid";
  document.getElementById("detail-view").style.display = "none";

  // 一覧カードを描画
  renderListView(currentFlatList);
}

/**
 * 3. 一覧カード群のレンダリング
 */
function renderListView(colorList) {
  const listView = document.getElementById("list-view");
  listView.innerHTML = ""; // 初期化

  colorList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "color-card";
    
    // 背景色と文字色を設定
    card.style.backgroundColor = item.hex;
    card.style.color = item.textColor || "#ffffff";

    // カード内部の要素（名前＋カラーコード）
    card.innerHTML = `
      <div class="color-card-content">
        <span class="color-name">${item.name}</span>
        <span class="color-code">${item.hex}</span>
      </div>
    `;

    // カードクリックで詳細画面へ
    card.addEventListener("click", () => {
      showDetailView(index);
    });

    listView.appendChild(card);
  });
}

/**
 * 4. 詳細画面（各色サンプル）の表示
 */
function showDetailView(index) {
  currentIndex = index;
  const colorData = currentFlatList[currentIndex];

  if (!colorData) return;

  // 画面切り替え
  document.getElementById("list-view").style.display = "none";
  const detailView = document.getElementById("detail-view");
  detailView.style.display = "flex";

  // 【重要】ヘッダー以外（#detail-view）の背景色を「その色」に設定
  detailView.style.backgroundColor = colorData.hex;
  detailView.style.color = colorData.textColor || "#ffffff";

  // HTMLのコンテンツ描画（矢印のみのナビゲーション）
  detailView.innerHTML = `
    <button class="nav-arrow" id="prev-btn" aria-label="前の色">&lt;</button>
    <div class="detail-center-info">
      <div class="color-name">${colorData.name}</div>
      <div class="color-code">${colorData.hex}</div>
    </div>
    <button class="nav-arrow" id="next-btn" aria-label="次の色">&gt;</button>
  `;

  // 前へ・次へ ボタンのイベント登録
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
 * 5. 前の色・次の色の移動処理
 */
function navigateDetail(step) {
  let newIndex = currentIndex + step;
  
  // ループ処理（先頭から前へ行ったら末尾へ、逆も然り）
  if (newIndex < 0) {
    newIndex = currentFlatList.length - 1;
  } else if (newIndex >= currentFlatList.length) {
    newIndex = 0;
  }

  showDetailView(newIndex);
}