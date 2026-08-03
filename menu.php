<?php
header('Content-Type: text/html; charset=utf-8');

$categories = [
    'red'    => ['name' => '赤系',     'next' => 'orange', 'back' => 'mono'],
    'orange' => ['name' => 'オレンジ系', 'next' => 'brown',  'back' => 'red'],
    'brown'  => ['name' => '茶系',     'next' => 'yellow', 'back' => 'orange'],
    'yellow' => ['name' => '黄系',     'next' => 'green',  'back' => 'brown'],
    'green'  => ['name' => '緑系',     'next' => 'blue',   'back' => 'yellow'],
    'blue'   => ['name' => '青系',     'next' => 'purple', 'back' => 'green'],
    'purple' => ['name' => '紫系',     'next' => 'pink',   'back' => 'blue'],
    'pink'   => ['name' => 'ピンク系',  'next' => 'mono',   'back' => 'purple'],
    'mono'   => ['name' => '白黒系',   'next' => 'red',    'back' => 'pink'],
];

$Cid = $_GET['cid'] ?? 'red';
if (!array_key_exists($Cid, $categories)) {
    $Cid = 'red';
}

$current = $categories[$Cid];
$title = $current['name'];
$next_cid = $current['next'];
$back_cid = $current['back'];

// CSV読み込み
$colors = [];
if (file_exists("iro.csv")) {
    $file = fopen("iro.csv", "r");
    while (($data = fgetcsv($file)) !== FALSE) {
        if (isset($data[0]) && $data[0] === $Cid) {
            $colors[] = [
                'id'    => $data[1] ?? '',
                'name'  => $data[2] ?? '',
                'kana'  => $data[3] ?? '',
                'code'  => $data[4] ?? 'ffffff',
            ];
        }
    }
    fclose($file);
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>いろいろSAMPLE ◆<?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?>◆</title>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 20px; background: #f9f9f9; color: #2f4f4f; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; }
        .nav-buttons { display: flex; justify: space-between; margin: 20px 0; }
        .btn { padding: 8px 16px; background: #eee; text-decoration: none; color: #333; border-radius: 4px; font-size: 0.9em; }
        .btn:hover { background: #ddd; }
        .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; margin: 20px 0; }
        .color-item { display: flex; align-items: center; text-decoration: none; color: #333; border: 1px solid #eee; border-radius: 6px; overflow: hidden; }
        .color-preview { width: 50px; height: 50px; flex-shrink: 0; }
        .color-name { padding: 0 10px; font-size: 0.95em; font-weight: bold; }
    </style>
</head>
<body>

<div class="container">
    <h1><a href="index.php" style="color:#d71d3b; text-decoration:none;">いろいろSAMPLE</a></h1>
    <h2>◆ <?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?> ◆</h2>

    <div class="nav-buttons">
        <a class="btn" href="menu.php?cid=<?= $back_cid ?>">&laquo; 前の色系 (<?= $categories[$back_cid]['name'] ?>)</a>
        <a class="btn" href="menu.php?cid=<?= $next_cid ?>">次の色系 (<?= $categories[$next_cid]['name'] ?>) &raquo;</a>
    </div>

    <div class="color-grid">
        <?php foreach ($colors as $color): ?>
            <a class="color-item" href="sample.php?cid=<?= urlencode($color['id']) ?>">
                <div class="color-preview" style="background-color: #<?= htmlspecialchars($color['code'], ENT_QUOTES, 'UTF-8') ?>;"></div>
                <div class="color-name"><?= htmlspecialchars($color['name'], ENT_QUOTES, 'UTF-8') ?></div>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="nav-buttons">
        <a class="btn" href="menu.php?cid=<?= $back_cid ?>">&laquo; 前の色系</a>
        <a class="btn" href="index.php">TOPメニュー</a>
        <a class="btn" href="menu.php?cid=<?= $next_cid ?>">次の色系 &raquo;</a>
    </div>

    <footer style="margin-top:30px; font-size:0.85em; color:#888;">
        &copy; iroirosample.net
    </footer>
</div>

</body>
</html>