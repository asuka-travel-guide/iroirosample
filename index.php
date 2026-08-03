<?php
// UTF-8 ヘッダーの出力
header('Content-Type: text/html; charset=utf-8');

$categories = [
    'red'    => ['name' => '赤系',     'color' => '#d71d3b'],
    'orange' => ['name' => 'オレンジ系', 'color' => '#e67928'],
    'brown'  => ['name' => '茶系',     'color' => '#734229'],
    'yellow' => ['name' => '黄系',     'color' => '#fbd01d'],
    'green'  => ['name' => '緑系',     'color' => '#3baf75'],
    'blue'   => ['name' => '青系',     'color' => '#0091c5'],
    'purple' => ['name' => '紫系',     'color' => '#7c4b8d'],
    'pink'   => ['name' => 'ピンク系',  'color' => '#eda49e'],
    'mono'   => ['name' => '白・黒系',  'color' => '#6b6d6c'],
];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>いろ色SAMPLE ～色見本・カラーサンプル～</title>
    <meta name="keywords" content="いろ,色,カラー,サンプル,color,sample,見本,色彩,配色">
    <meta name="description" content="JIS規格に基づくシンプルな色見本・カラーサンプルサイトです。">
    <style>
        :root { --main-text: #2f4f4f; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0; padding: 20px;
            color: var(--main-text);
            background-color: #f9f9f9;
            text-align: center;
        }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #d71d3b; margin-bottom: 20px; }
        .grid-menu {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 15px; margin: 30px 0;
        }
        .card {
            display: flex; align-items: center; text-decoration: none;
            color: #333; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
        .color-box { width: 60px; height: 60px; flex-shrink: 0; }
        .card-label { padding: 0 15px; font-weight: bold; font-size: 1.1em; }
        footer { margin-top: 40px; font-size: 0.85em; color: #777; }
        a.link { color: #0091c5; text-decoration: none; }
        a.link:hover { text-decoration: underline; }
    </style>
</head>
<body>

<div class="container">
    <h1>いろいろ SAMPLE</h1>
    <p>シンプルで使いやすいカラーサンプル・色見本集</p>
    
    <div class="grid-menu">
        <?php foreach ($categories as $cid => $info): ?>
            <a href="menu.php?cid=<?= htmlspecialchars($cid, ENT_QUOTES, 'UTF-8') ?>" class="card">
                <div class="color-box" style="background-color: <?= $info['color'] ?>;"></div>
                <div class="card-label"><?= htmlspecialchars($info['name'], ENT_QUOTES, 'UTF-8') ?></div>
            </a>
        <?php endforeach; ?>
    </div>

    <footer>
        <p><a href="mailto:iroirosample@hotmail.co.jp" class="link">管理人にメール</a></p>
        <p>&copy; iroirosample.net</p>
    </footer>
</div>

</body>
</html>