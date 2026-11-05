(function(){
  var root=document.documentElement; root.classList.add('js');
  var $=function(id){return document.getElementById(id);};
  var secs=[].slice.call(document.querySelectorAll('.cat'));
  var tabs=[].slice.call(document.querySelectorAll('.tabs .ct'));
  var prev=$('cprev'), next=$('cnext'), intro=$('intro'), none=$('none'), q=$('q'), main=$('main');
  var near=$('near'), neari=$('neari'), nearl=$('nearl');
  var order=secs.map(function(s){return s.getAttribute('data-id');});
  secs.forEach(function(s){s.removeAttribute('id');});
  var base=document.title;
  var TH=16, MIN=6, MAX=18;               // 近似検索: Lab距離のしきい値 / 最小・最大件数

  function norm(s){
    return s.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-96);}).replace(/[#\s]/g,'');
  }
  function lab(h){
    var c=[0,2,4].map(function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});
    var x=(c[0]*.4124+c[1]*.3576+c[2]*.1805)/.95047, y=c[0]*.2126+c[1]*.7152+c[2]*.0722, z=(c[0]*.0193+c[1]*.1192+c[2]*.9505)/1.08883;
    function f(t){return t>.008856?Math.cbrt(t):7.787*t+16/116;}
    return [116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z))];
  }
  var items=[].slice.call(document.querySelectorAll('.cat li')).map(function(li){return {li:li,lab:lab(li.getAttribute('data-h'))};});
  function hexQuery(raw){
    var s=raw.normalize('NFKC').trim(), m=/^#?([0-9a-f]{6})$/i.exec(s)||/^#([0-9a-f]{3})$/i.exec(s);
    if(!m) return null;
    var h=m[1].toLowerCase(); return h.length===3?h.replace(/./g,'$&$&'):h;
  }
  function showNear(h){
    var L=lab(h), arr=items.map(function(it){
      return {it:it,d:Math.sqrt(Math.pow(it.lab[0]-L[0],2)+Math.pow(it.lab[1]-L[1],2)+Math.pow(it.lab[2]-L[2],2))};
    }).sort(function(a,b){return a.d-b.d;});
    var hits=arr.filter(function(a){return a.d<=TH;});
    if(hits.length<MIN) hits=arr.slice(0,MIN);
    hits=hits.slice(0,MAX);
    nearl.innerHTML='';
    hits.forEach(function(a){var c=a.it.li.cloneNode(true);c.hidden=false;c.removeAttribute('hidden');nearl.appendChild(c);});
    neari.textContent='#'+h+(hits[0].d<1?' と一致する色・':' に')+'近い色（'+hits.length+'色）';
    near.hidden=false;
  }
  function render(){
    var raw=q.value, cid=decodeURIComponent(location.hash.slice(1)), i, hit=0;
    if(order.indexOf(cid)<0) cid='';
    if(cid){q.value='';raw='';}
    var hx=raw?hexQuery(raw):null, term=hx?'':norm(raw);
    main.classList.toggle('is-cat',!!cid);
    main.classList.toggle('is-search',!!term||!!hx);
    near.hidden=true; none.hidden=true;
    if(hx){
      secs.forEach(function(s){s.hidden=true;}); intro.hidden=true; showNear(hx); cid='';
    }else if(term){
      secs.forEach(function(sec){
        var n=0;
        [].forEach.call(sec.querySelectorAll('li'),function(li){
          var m=li.getAttribute('data-s').indexOf(term)>-1; li.hidden=!m; if(m) n++;
        });
        sec.hidden=!n; hit+=n;
        sec.querySelector('h2 span').textContent=n+'色';
      });
      intro.hidden=true; none.hidden=hit>0; cid='';
    }else{
      secs.forEach(function(sec){
        [].forEach.call(sec.querySelectorAll('li'),function(li){li.hidden=false;});
        sec.querySelector('h2 span').textContent=sec.getAttribute('data-n')+'色';
        sec.hidden=sec.getAttribute('data-id')!==cid;
      });
      intro.hidden=!!cid;
    }
    tabs.forEach(function(a){
      if(a.getAttribute('data-cid')===cid) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    i=order.indexOf(cid);
    prev.setAttribute('href','#'+order[i<0?order.length-1:(i+order.length-1)%order.length]);
    next.setAttribute('href','#'+order[i<0?0:(i+1)%order.length]);
    var sec=cid&&document.querySelector('.cat[data-id="'+cid+'"]');
    document.title=sec?sec.getAttribute('data-name')+'の色見本一覧｜カラーサンプル':base;
    fit();
  }
  // 色名がカード幅からはみ出す場合だけ、文字サイズを実測して縮める
  function fit(){
    [].forEach.call(document.querySelectorAll('.cat:not([hidden]) .nm,#near:not([hidden]) .nm'),function(n){
      n.style.fontSize='';
      var w=n.clientWidth, f=parseFloat(getComputedStyle(n).fontSize);
      while(w&&n.scrollWidth>w&&f>9){f-=.5;n.style.fontSize=f+'px';}
    });
  }
  var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(fit,100);});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  // ← → キー / 左右フリックで色系(ヘッダーメニュー)を切り替え
  function step(d){
    var i=order.indexOf(decodeURIComponent(location.hash.slice(1)));
    location.hash='#'+order[i<0?(d>0?0:order.length-1):(i+d+order.length)%order.length];
  }
  document.addEventListener('keydown',function(e){
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey) return;
    var t=e.target&&e.target.tagName; if(t==='INPUT'||t==='TEXTAREA') return;
    if(e.key==='ArrowRight') step(1); else if(e.key==='ArrowLeft') step(-1);
  });
  var sx,sy,st;
  document.addEventListener('touchstart',function(e){
    if(e.touches.length!==1||(e.target.closest&&e.target.closest('input'))){sx=null;return;}
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();
  },{passive:true});
  document.addEventListener('touchend',function(e){
    if(sx==null) return;
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy; sx=null;
    if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5||Date.now()-st>900) return;
    step(dx<0?1:-1);
  },{passive:true});
  q.addEventListener('input',render);
  window.addEventListener('hashchange',function(){window.scrollTo(0,0);render();});
  var m=/[?&]q=([^&]*)/.exec(location.search);
  if(m){try{q.value=decodeURIComponent(m[1].replace(/\+/g,' '));}catch(e){}}
  render();
})();
