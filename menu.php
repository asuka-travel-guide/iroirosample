<?php
$cid=$_GET['cid'];

if($cid==red){$next=orange; $back=mono; $namae=赤;}
else if($cid==orange){$next=brown; $back=red; $namae=オレンジ;}
else if($cid==brown){$next=yellow; $back=orange; $namae=茶;}
else if($cid==yellow){$next=green; $back=brown; $namae=黄;}
else if($cid==green){$next=blue; $back=yellow; $namae=緑;}
else if($cid==blue){$next=purple; $back=green; $namae=青;}
else if($cid==purple){$next=pink; $back=blue; $namae=紫;}
else if($cid==pink){$next=mono; $back=purple; $namae=ピンク;}
else if($cid==mono){$next=red; $back=pink; $namae=白黒;}
else{$next=red; $back=mono;}

$head="<?xml version=\"1.0\" encoding=\"Shift_JIS\"?>";
print($head);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
<title><?=$namae?>系の色見本</title>
<meta name="keywords" content="<?=$namae?>" />
<meta name="description" content="<?=$namae?>系の色見本(カラーサンプル)です。" />
<link rel="index" href="index.html" />
<link rel="shortcut icon" href="favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=SHIFT_JIS" />
<meta http-equiv="Content-Style-Type" content="text/css" />
<link rel="stylesheet" type="text/css" href="iroiro.css" />
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
<td class="arrow"><a class="arrow" href="menu.php?cid=<?=$back?>">《</a></td>
<td style="background-color:#d71d3b"><a class="menu" href="menu.php?cid=red">赤系</a></td>
<td style="background-color:#e67928"><a class="menu" href="menu.php?cid=orange">橙系</a></td>
<td style="background-color:#734229"><a class="menu" href="menu.php?cid=brown">茶系</a></td>
<td style="background-color:#f8c620"><a class="menu" href="menu.php?cid=yellow">黄系</a></td>
<td style="background-color:#3baf75"><a class="menu" href="menu.php?cid=green">緑系</a></td>
<td style="background-color:#0091c5"><a class="menu" href="menu.php?cid=blue">青系</a></td>
<td style="background-color:#7c4b8d"><a class="menu" href="menu.php?cid=purple">紫系</a></td>
<td style="background-color:#eda49e"><a class="menu" href="menu.php?cid=pink">桃系</a></td>
<td style="background-color:#6b6d6c"><a class="menu" href="menu.php?cid=mono">白黒</a></td>
<td class="arrow"><a class="arrow" href="menu.php?cid=<?=$next?>">》</a></td>
</tr></table></div>

<div style="margin-top:73px; margin-left:2px;  margin-right:2px; text-align:left;">

<ul>
<?php
	$Data=file("iro.csv");
	for($i=0; $i<sizeof($Data); $i++){
	$line=explode(",",$Data[$i]);
	if($line[0]==$cid){
	if($line[5]<400){$text="f5f5f5";}else{$text="2f4f4f";}
	print("<li style=\"background-color:#$line[4]\"><a style=\"color:#"."$text\" href=\"sample.php?cid=$line[1]\">$line[2]<br />#$line[4]</a></li>");
	}};
?>
</ul>

<div style="clear:both; margin-top:30px;">
<script type="text/javascript"><!--
google_ad_client = "pub-3169670608923886";
/* 728x90, 作成済み 08/05/29 */
google_ad_slot = "9206539174";
google_ad_width = 728;
google_ad_height = 90;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>

</div>
<p><a class="foot" href="index.html">&copy; 2008 iroirosample.net</a></p>
</body>
</html>
