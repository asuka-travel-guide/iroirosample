(function(){
  var el,timer;
  function toast(msg){
    if(!el){el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el);}
    el.textContent=msg; void el.offsetWidth; el.classList.add('on');
    clearTimeout(timer); timer=setTimeout(function(){el.classList.remove('on');},1500);
  }
  function fallback(s){
    var a=document.createElement('textarea'); a.value=s; a.setAttribute('readonly','');
    a.style.cssText='position:fixed;top:0;left:0;opacity:0'; document.body.appendChild(a); a.select();
    var ok=false; try{ok=document.execCommand('copy');}catch(e){} document.body.removeChild(a); return ok;
  }
  window.copyHex=function(s){
    function done(ok){toast(ok?'コピーしました　'+s:'コピーできませんでした');}
    if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(s).then(function(){done(true);},function(){done(fallback(s));});
    else done(fallback(s));
  };
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.hx');
    if(b){e.preventDefault();window.copyHex(b.getAttribute('data-hex'));}
  });
})();
