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

// フリック操作用変数
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const HIRAGANA_TO_ROMAJI = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'ー': ''
};

function kanaToRomaji(text) {
  let res = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    if (i + 1 < n && HIRAGANA_TO_ROMAJI[text.slice(i, i + 2)]) {
      res.push(HIRAGANA_TO_ROMAJI[text.slice(i, i + 2)]);
      i += 2;
    } else if (text[i] === 'っ') {
      if (i + 1 < n) {
        let nextChar = text[i + 1];
        let nextRomaji = '';
        if (i + 2 < n && HIRAGANA_TO_ROMAJI[text.slice(i + 1, i + 3)]) {
          nextRomaji = HIRAGANA_TO_ROMAJI[text.slice(i + 1, i + 3)];
        } else if (HIRAGANA_TO_ROMAJI[nextChar]) {
          nextRomaji = HIRAGANA_TO_ROMAJI[nextChar];
        }
        if (nextRomaji) {
          res.push(nextRomaji[0]);
        }
      }
      i += 1;
    } else if (HIRAGANA_TO_ROMAJI[text[i]]) {
      res.push(HIRAGANA_TO_ROMAJI[text[i]]);
      i += 1;
    } else {
      res.push(text[i]);
      i += 1;
    }
  }
  return res.join('');
}

function isEnglish(text) {
  if (!text) return false;
  return /^[a-zA-Z0-9\s\-\.\'\(\)]+$/.test(text);
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderMenu();
  initFlickEvents();
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
  const usedFilenames = new Set();

  lines.forEach(line => {
    if (!line.trim()) return;
    const cols = line.split(',').map(item => item.trim());
    if (cols.length < 5) return;

    const catKey = cols[0].toLowerCase();
    const kanaName = cols[2] || "";
    const name = cols[3] || "";
    const rawHex = cols[4] || "FFFFFF";
    const hex = rawHex.startsWith('#') ? rawHex : `#${rawHex}`;

    let base = '';
    if (isEnglish(name)) {
      base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    } else {
      base = kanaToRomaji(kanaName).toLowerCase().replace(/[^a-z0-9\-]/g, '');
    }

    let filename = `${base}.html`;
    let counter = 1;
    while (usedFilenames.has(filename)) {
      filename = `${base}-${counter}.html`;
      counter += 1;
    }
    usedFilenames.add(filename);

    const textColor = getContrastTextColor(hex);

    const item = {
      categoryKey: catKey,
      kanaName,
      name,
      hex,
      textColor,
      filename
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

  document.getElementById("hdr-prev-btn").addEventListener("click", () => {
    navigateCategory(-1);
  });

  document.getElementById("hdr-next-btn").addEventListener("click", () => {
    navigateCategory(1);
  });
}

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

function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const minSwipeDistance = 50;

  if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      navigateCategory(1);
    } else {
      navigateCategory(-1);
    }
  }
}

function switchCategoryByIndex(catIndex) {
  currentCategoryIndex = catIndex;

  const navButtons = document.querySelectorAll("#category-nav button");
  navButtons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === catIndex);
  });

  const catKey = CATEGORY_LIST[catIndex].key;
  const colorList = colorDataMap[catKey] || [];

  document.getElementById("list-view").style.display = "grid";

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
    const card = document.createElement("a");
    card.className = "color-card";
    card.style.backgroundColor = item.hex;
    card.style.color = item.textColor;
    card.style.textDecoration = "none";
    card.href = `colors/${item.filename}`;

    card.innerHTML = `
      <div class="color-card-content">
        <span class="color-name">${item.kanaName}</span>
        <span class="color-code">${item.hex.toUpperCase()}</span>
      </div>
    `;

    listView.appendChild(card);
  });
}
