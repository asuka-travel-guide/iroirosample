<?php
header('Content-Type: text/html; charset=utf-8');

$Cid = $_GET['cid'] ?? '1';

$kaku = null;
if (file_exists("iro.csv")) {
    $file = fopen("iro.csv", "r");
    while (($data = fgetcsv($file)) !== FALSE) {
        if (isset($data[1]) && $data[1] === $Cid) {
            $kaku = $data;
            break;
        }
    }
    fclose($file);
}

// データが見つからない場合のデフォルト設定
if (!$kaku) {
    $kaku = ['red', '1', '赤色', 'あかいろ', 'ff0000', '200'];
}

// カテゴリ移動リンクの数値定義
$system_nav = [
    'red'    => ['next' => "41",  'back' => "242"],
    'orange' => ['next' => "55",  'back' => "1"],
    'brown'  => ['next' => "91",  'back' => "41"],
    'yellow' => ['next' => "121", 'back' => "55"],
    'green'  => ['next' => "163", 'back' => "91"],
    'blue'   => ['next' => "207", 'back' => "121"],
    'purple' => ['next' => "230", 'back' => "163"],
    'pink'   => ['next' => "242", 'back' => "207"],
    'mono'   => ['next' => "1",   'back' => "230"],
];

$cat = $kaku[0] ?? 'red';
$pnext = $system_nav[$cat]['next'] ?? '1';
$pback = $system_nav[$cat]['back'] ?? '1';

// 明度による文字色切り替え
$luminance = isset($kaku[5]) ? intval($kaku[5]) : 0;
$textColor = ($luminance < 400) ? "#f5f5f5" : "#2f4f4f";

// 前・次の色ID設定
$current_id = intval($kaku[1]);
$next_id = ($current_id < 269) ? ($current_id + 1) : 1;
$back_id = ($current_id > 1) ? ($current_id - 1) : 269;
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($kaku[2], ENT_QUOTES, 'UTF-8') ?> - 色見本</title>
    <style>
        body {
            margin: 0; padding: 0; min-height: 100vh;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            background-color: #<?= htmlspecialchars($kaku[4], ENT_QUOTES, 'UTF-8') ?>;
            color: <?= $textColor ?>;
            font-family: sans-serif; text-align: center;
        }
        a { color: <?= $textColor ?>; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        h1 { font-size: 2.5em; margin: 10px 0 5px 0; }
        h2 { font-size: 1.3em; margin: 0 0 30px 0; opacity: 0.8; }
        .nav-container { display: flex; flex-direction: column; gap: 15px; width: 280px; }
        .row { display: flex; justify-content: space-between; }
        .btn-link { padding: 10px; border: 1px solid <?= $textColor ?>; border-radius: 6px; font-size: 0.9em; }
    </style>
</head>
<body>

    <h1><?= htmlspecialchars($kaku[2], ENT_QUOTES, 'UTF-8') ?></h1>
    <h2><?= htmlspecialchars($kaku[3], ENT_QUOTES, 'UTF-8') ?> ( #<?= htmlspecialchars($kaku[4], ENT_QUOTES, 'UTF-8') ?> )</h2>

    <div class="nav-container">
        <div>
            <a class="btn-link" style="display:block;" href="sample.php?cid=<?= $back_id ?>">&uarr; 前の色</a>
        </div>
        <div class="row">
            <a class="btn-link" href="sample.php?cid=<?= $pback ?>">&larr; 前の色系</a>
            <a class="btn-link" href="sample.php?cid=<?= $pnext ?>">次の色系 &rarr;</a>
        </div>
        <div>
            <a class="btn-link" style="display:block;" href="sample.php?cid=<?= $next_id ?>">&darr; 次の色</a>
        </div>
        <div style="margin-top: 15px;">
            <a class="btn-link" style="display:block;" href="menu.php?cid=<?= htmlspecialchars($kaku[0], ENT_QUOTES, 'UTF-8') ?>">一覧へ戻る</a>
        </div>
    </div>

    <footer style="margin-top: 40px; font-size: 0.8em; opacity: 0.8;">
        &copy; iroirosample.net
    </footer>

</body>
</html>