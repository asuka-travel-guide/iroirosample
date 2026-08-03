// 全系統のサンプルデータ（オレンジ系を追加し、全カテゴリをカバー）
const colorDataMap = {
  "赤系": [
    { name: "茜色", hex: "#B7282E", textColor: "#FFFFFF" },
    { name: "朱色", hex: "#D7003A", textColor: "#FFFFFF" },
    { name: "真紅", hex: "#A70000", textColor: "#FFFFFF" }
  ],
  "オレンジ系": [
    { name: "蜜柑色", hex: "#F39800", textColor: "#FFFFFF" },
    { name: "柿色", hex: "#ED6D3D", textColor: "#FFFFFF" },
    { name: "杏色", hex: "#F7B97D", textColor: "#333333" }
  ],
  "茶系": [
    { name: "琥珀色", hex: "#BF783A", textColor: "#FFFFFF" },
    { name: "栗色", hex: "#6E4A27", textColor: "#FFFFFF" }
  ],
  "黄系": [
    { name: "山吹色", hex: "#FFB900", textColor: "#333333" },
    { name: "蒲公英色", hex: "#FFD900", textColor: "#333333" }
  ],
  "緑系": [
    { name: "常磐色", hex: "#007B43", textColor: "#FFFFFF" },
    { name: "若竹色", hex: "#68BE8D", textColor: "#FFFFFF" }
  ],
  "青系": [
    { name: "露草色", hex: "#38A1DB", textColor: "#FFFFFF" },
    { name: "瑠璃色", hex: "#005CAF", textColor: "#FFFFFF" }
  ],
  "紫系": [
    { name: "桔梗色", hex: "#56256E", textColor: "#FFFFFF" },
    { name: "藤色", hex: "#BB92CE", textColor: "#FFFFFF" }
  ],
  "ピンク系": [
    { name: "桜色", hex: "#FEF4F4", textColor: "#333333" },
    { name: "撫子色", hex: "#EE827C", textColor: "#FFFFFF" }
  ],
  "白黒系": [
    { name: "漆黒", hex: "#0D0015", textColor: "#FFFFFF" },
    { name: "消炭色", hex: "#434343", textColor: "#FFFFFF" },
    { name: "胡粉色", hex: "#FFFFFC", textColor: "#333333" }
  ]
};

let currentCategory = "赤系";
let currentFlatList = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  switchCategory("赤系");
});

// 1. ヘッダーメニュー初期化（data-category属性で安全に判定）
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

// 2. 系統切り替え
function switchCategory(categoryName) {
  currentCategory = categoryName;
  currentFlatList = colorDataMap[categoryName] || [];

  document.getElementById("list-view").style.display = "grid";
  document.getElementById("detail-view").style.display = "none";

  renderListView(currentFlatList);
}

// 3. 一覧カード描画（カード背景＝該当色、角丸小さめ、コード表示）
function renderListView(colorList) {
  const listView = document.getElementById("list-view");
  listView.innerHTML = "";

  colorList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "color-card";
    card.style.backgroundColor = item.hex;
    card.style.color = item.textColor || "#ffffff";

    card.innerHTML = `
      <div class="color-card-content">
        <span class="color-name">${item.name}</span>
        <span class="color-code">${item.hex}</span>
      </div>
    `;

    card.addEventListener("click", () => showDetailView(index));
    listView.appendChild(card);
  });
}

// 4. 各色サンプル画面（ヘッダー以外をその色にする・矢印のみ）
function showDetailView(index) {
  currentIndex = index;
  const colorData = currentFlatList[currentIndex];
  if (!colorData) return;

  document.getElementById("list-view").style.display = "none";
  const detailView = document.getElementById("detail-view");
  detailView.style.display = "flex";

  // 背景色と文字色の適用
  detailView.style.backgroundColor = colorData.hex;
  detailView.style.color = colorData.textColor || "#ffffff";

  detailView.innerHTML = `
    <button class="nav-arrow" id="prev-btn" aria-label="前の色">&lt;</button>
    <div class="detail-center-info">
      <div class="color-name">${colorData.name}</div>
      <div class="color-code">${colorData.hex}</div>
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

// 5. 矢印による前後移動
function navigateDetail(step) {
  let newIndex = currentIndex + step;
  if (newIndex < 0) {
    newIndex = currentFlatList.length - 1;
  } else if (newIndex >= currentFlatList.length) {
    newIndex = 0;
  }
  showDetailView(newIndex);
}