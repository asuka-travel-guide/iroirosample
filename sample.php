<?php
	$Cid=$_GET['cid'];

	$Data=file("iro.csv");
	for($i=0; $i<sizeof($Data); $i++){
	$line=explode(",",$Data[$i]);
	if($line[1]==$Cid){$kaku=explode(",",$Data[$i]);
	}};
	if($kaku[5]<400){$text="f5f5f5";}else{$text="2f4f4f";}
	if($kaku[1]<673){$next="$kaku[1]";}else{$next="0";}
	if($kaku[1]>1){$back="$kaku[1]";}else{$back="674";}

	$head="<?xml version=\"1.0\" encoding=\"Shift_JIS\"?>";
	print($head);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
<title><?=$kaku[2]?>/<?=$kaku[3]?></title>
<meta name="keywords" content="<?=$kaku[2]?>,<?=$kaku[3]?>,色,カラー,サンプル" />
<meta name="description" content="<?=$kaku[2]?>のカラーサンプル(色見本)です。" />
<link rel="index" href="index.html" />
<link rel="shortcut icon" href="favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=SHIFT_JIS" />
<meta http-equiv="Content-Style-Type" content="text/css" />
<link rel="stylesheet" type="text/css" href="iroiro.css" />
<style type="text/css">
html,body{height:100%;}
body{background-color:#<?=$kaku[4]?>; color: #<?=$text?>;}
a,a:hover{color: #<?=$text?>;}
</style>
</head>
<body>
<div class="menu">
<table class="title"><tr>
<td class="title"><h1 class="title"><a class="title" href="index.html">色見本　いろ色SAMPLE</a></h1></td>
<td>
<script type="text/javascript"><!--
google_ad_client = "pub-3169670608923886";
/* 728x15, 作成済み 08/06/22 */
google_ad_slot = "1652980818";
google_ad_width = 728;
google_ad_height = 15;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</td>
</tr></table>
<table><tr>
<td class="arrow"><a class="arrow" href="sample.php?cid=<?=--$back?>">《</a></td>
<td style="background-color:#d71d3b"><a class="menu" href="menu.php?cid=red">赤系</a></td>
<td style="background-color:#e67928"><a class="menu" href="menu.php?cid=orange">橙系</a></td>
<td style="background-color:#734229"><a class="menu" href="menu.php?cid=brown">茶系</a></td>
<td style="background-color:#f8c620"><a class="menu" href="menu.php?cid=yellow">黄系</a></td>
<td style="background-color:#3baf75"><a class="menu" href="menu.php?cid=green">緑系</a></td>
<td style="background-color:#0091c5"><a class="menu" href="menu.php?cid=blue">青系</a></td>
<td style="background-color:#7c4b8d"><a class="menu" href="menu.php?cid=purple">紫系</a></td>
<td style="background-color:#eda49e"><a class="menu" href="menu.php?cid=pink">桃系</a></td>
<td style="background-color:#6b6d6c"><a class="menu" href="menu.php?cid=mono">白黒</a></td>
<td class="arrow"><a class="arrow" href="sample.php?cid=<?=++$next?>">》</a></td>
</tr></table></div>
<div style="height:100%;"></div>

<h1 class="sam1"><a href="menu.php?cid=<?=$kaku[0]?>"><?=$kaku[2]?></a></h1>
<h1 class="sam2"><a href="menu.php?cid=<?=$kaku[0]?>"><?=$kaku[3]?></a></h1>
<div class="sam5">
<h2>ＣＯＤＥ</h2><p>#<?=$kaku[4]?></p>
<h2>ＣＭＹＫ</h2><p><?=$kaku[6]?>%：<?=$kaku[7]?>%：<?=$kaku[8]?>%：<?=$kaku[9]?>%</p>
<h2>マンセル値</h2><p><?=$kaku[10]?></p>
</div>
<p><a class="sfoot" href="index.html">&copy; 2008 iroirosample.net</a></p>
</body>
</html>
