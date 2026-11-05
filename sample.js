(function(){
  var b=document.body;
  function go(u){if(u)location.href=u;}
  function rel(r){var l=document.querySelector('link[rel="'+r+'"]');return l&&l.href;}
  // ← → : 前/次の色系(メニュー)  ↑ ↓ : 次/前の色  Esc : 一覧へ
  var act={
    prevcat:function(){go(b.getAttribute('data-pc'));}, nextcat:function(){go(b.getAttribute('data-nc'));},
    next:function(){go(rel('next'));}, prev:function(){go(rel('prev'));}, up:function(){go(rel('up'));}
  };
  document.addEventListener('keydown',function(e){
    if(e.altKey||e.ctrlKey||e.metaKey||e.defaultPrevented) return;
    if(e.key==='c'||e.key==='C'){var h=document.querySelector('.spec .hx');if(h&&window.copyHex){e.preventDefault();window.copyHex(h.getAttribute('data-hex'));}return;}
    if(e.shiftKey) return;
    var k={ArrowLeft:'prevcat',ArrowRight:'nextcat',ArrowUp:'next',ArrowDown:'prev',Escape:'up'}[e.key];
    if(k){e.preventDefault();act[k]();}
  });
  // フリック: 左=次の色系 / 右=前の色系 / 上=次の色 / 下=前の色
  var sx,sy,st;
  document.addEventListener('touchstart',function(e){
    if(e.touches.length!==1){sx=null;return;}
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();
  },{passive:true});
  document.addEventListener('touchend',function(e){
    if(sx==null) return;
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy,ax=Math.abs(dx),ay=Math.abs(dy);
    sx=null;
    if(Math.max(ax,ay)<50||Date.now()-st>900) return;
    if(ax>ay*1.2) act[dx<0?'nextcat':'prevcat']();
    else if(ay>ax*1.2) act[dy<0?'next':'prev']();
  },{passive:true});
})();
