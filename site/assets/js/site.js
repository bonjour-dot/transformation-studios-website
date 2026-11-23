// Site settings: change these in one place.
const SITE = {
  appStoreUrl: "",         // iPhone and iPad App Store link. Empty = launch-list form. When set, every join button goes straight to it.
  campaignToken: "website",// added to the App Store link as ?ct=...&mt=8
  foundingCount: 0,        // Founding places taken (0 to 100). Update by hand. 0 = "places open 8 December".
  storyVideoUrl: "",       // YouTube or Vimeo link for "Ryan's story"
  supportEmail: "admin@transformationstudio.site"
};

(function(){
  var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Join buttons. No App Store link yet: they open the launch-list form. Link set: they go straight to the App Store.
  function live(u){return !!u&&u!=="#"}
  var storeHref="";
  if(live(SITE.appStoreUrl)){storeHref=SITE.appStoreUrl+(SITE.appStoreUrl.indexOf("?")<0?"?":"&")+"ct="+encodeURIComponent(SITE.campaignToken)+"&mt=8"}
  var dlg=document.getElementById("launch"),lastBtn=null;
  document.querySelectorAll("[data-join]").forEach(function(a){
    if(storeHref){a.href=storeHref;a.rel="noopener";return}
    a.setAttribute("role","button");
    a.addEventListener("click",function(e){e.preventDefault();lastBtn=a;if(dlg&&dlg.showModal){dlg.showModal();var em=dlg.querySelector('input[type=email]');if(em)em.focus()}else if(dlg){dlg.setAttribute("open","")}})});
  document.querySelectorAll("[data-store]").forEach(function(a){if(storeHref){a.href=storeHref;a.rel="noopener";a.hidden=false}});
  if(storeHref&&dlg)dlg.remove();
  else if(dlg){
    dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
    dlg.querySelectorAll("[data-close]").forEach(function(b){b.addEventListener("click",function(){dlg.close()})});
    dlg.addEventListener("close",function(){if(lastBtn)lastBtn.focus()});
    var f=dlg.querySelector("form"),msg=dlg.querySelector(".lmsg");
    f.addEventListener("submit",function(e){e.preventDefault();
      var em=f.querySelector('input[type=email]');
      if(!em.value||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)){msg.textContent="Type a valid email address, like name@example.com.";msg.className="lmsg err";em.focus();return}
      var body=new URLSearchParams(new FormData(f)).toString();
      msg.className="lmsg";msg.textContent="";
      fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body}).then(function(r){
        if(!r.ok)throw 0;f.hidden=true;msg.className="lmsg ok";msg.textContent="You're on the list. We'll send the App Store link on 8 December.";var cb=dlg.querySelector(".lclose");if(cb)cb.hidden=false
      }).catch(function(){msg.className="lmsg err";msg.textContent="That did not go through. Try again, or write to "+SITE.supportEmail+"."})})}
  // Founding 100: places taken
  var fc=Math.max(0,Math.min(100,SITE.foundingCount|0)),fd=document.getElementById("fdots"),fl=document.getElementById("fcount");
  if(fd&&fl){if(fc>0){var h="";for(var i=0;i<100;i++)h+='<i'+(i<fc?' class="on"':'')+'></i>';fd.innerHTML=h;fd.hidden=false;fl.textContent=fc+" of 100"}else{fd.hidden=true;fl.textContent="Founding places open 8 December"}}
  // Founding Ambassador: share the link
  var sb=document.getElementById("sharelink"),sm=document.getElementById("sharemsg");
  if(sb)sb.addEventListener("click",function(e){e.preventDefault();var u="https://transformationstudio.site/",d={title:"Transformation Studio",text:"Film, cut, caption and share, all in one app. Built by a missionary for the mission field.",url:u};
    if(navigator.share){navigator.share(d).catch(function(){})}
    else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(function(){sm.textContent="Link copied";setTimeout(function(){sm.textContent=""},4000)}).catch(function(){sm.textContent=u})}
    else{sm.textContent=u}});
  document.querySelectorAll("[data-support]").forEach(function(a){a.href="mailto:"+SITE.supportEmail;if(a.hasAttribute("data-fill"))a.textContent=SITE.supportEmail});
  // Story video: a click-to-play preview. Nothing loads from YouTube or Vimeo until the visitor clicks.
  var vbox=document.querySelector(".video"),vurl=SITE.storyVideoUrl||"",vm,vsrc="";
  if((vm=vurl.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)))vsrc="https://www.youtube-nocookie.com/embed/"+vm[1]+"?autoplay=1&rel=0";
  else if((vm=vurl.match(/vimeo\.com\/(?:video\/)?(\d+)/)))vsrc="https://player.vimeo.com/video/"+vm[1]+"?autoplay=1&dnt=1";
  if(vbox&&vsrc){var lab=vbox.querySelector("small");if(lab)lab.textContent="RYAN'S STORY \u00b7 PLAY VIDEO";vbox.classList.add("ready");vbox.setAttribute("role","button");vbox.tabIndex=0;vbox.setAttribute("aria-label","Play Ryan's story");
    var playv=function(){if(vbox.querySelector("iframe"))return;var f=document.createElement("iframe");f.src=vsrc;f.title="Ryan's story";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.referrerPolicy="strict-origin-when-cross-origin";vbox.textContent="";vbox.appendChild(f);vbox.classList.add("playing");vbox.removeAttribute("role");vbox.removeAttribute("tabindex")};
    vbox.addEventListener("click",playv);vbox.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();playv()}})}
  // Auto carousels: keep moving on their own, pause briefly while the visitor touches, hovers or scrolls them, then carry on
  function cards(r){return [].slice.call(r.children).filter(function(c){return c.offsetWidth>0})}
  function curIdx(r){var cs=cards(r),x=r.scrollLeft+r.clientWidth/2,best=0,d=1e9;cs.forEach(function(c,i){var m=c.offsetLeft+c.offsetWidth/2-r.offsetLeft,dd=Math.abs(m-x);if(dd<d){d=dd;best=i}});return best}
  // Glide: an eased, frame-by-frame scroll (native smooth scrolling is abrupt and fights scroll-snap). Snap is switched off while it glides.
  function glide(r,to){to=Math.max(0,Math.min(r.scrollWidth-r.clientWidth,to));if(rm){r.scrollLeft=to;return}
    var from=r.scrollLeft,d=to-from;if(Math.abs(d)<2)return;var t0=performance.now(),dur=Math.min(1500,Math.max(850,Math.abs(d)*1.1));
    r._glide=t0;r.style.scrollSnapType="none";r.style.scrollBehavior="auto";
    function f(now){if(r._glide!==t0)return;var p=Math.min(1,(now-t0)/dur),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;r.scrollLeft=from+d*e;
      if(p<1)requestAnimationFrame(f);else{r.style.scrollSnapType="";r.style.scrollBehavior=""}}
    requestAnimationFrame(f)}
  function stopGlide(r){if(r._glide){r._glide=0;r.style.scrollSnapType="";r.style.scrollBehavior=""}}
  function go(r,i){var cs=cards(r);if(!cs.length)return;i=(i+cs.length)%cs.length;var c=cs[i];glide(r,c.offsetLeft-r.offsetLeft-(r.clientWidth-c.offsetWidth)/2)}
  var tabs=document.querySelectorAll(".mac-tabs button"),mac=document.getElementById("mactrack");
  document.querySelectorAll(".auto").forEach(function(r){
    var dots=document.querySelector('.dots[data-for="'+r.id+'"]'),hold=0,vis=false,n=cards(r).length;
    if(dots){for(var i=0;i<n;i++){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show item "+(i+1));(function(k){b.onclick=function(){hold=Date.now()+8000;go(r,k)}})(i);dots.appendChild(b)}}
    function sync(){var c=curIdx(r);if(dots){dots.classList.toggle("hide",r.scrollWidth<=r.clientWidth+4);[].forEach.call(dots.children,function(d,i){d.classList.toggle("on",i===c)})}
    }
    var st;r.addEventListener("scroll",function(){clearTimeout(st);st=setTimeout(sync,80)},{passive:true});
    ["pointerdown","touchstart","touchmove","wheel","focusin"].forEach(function(e){r.addEventListener(e,function(){stopGlide(r);hold=Date.now()+5000},{passive:true})});
    r.addEventListener("mouseenter",function(){hold=Date.now()+5000});r.addEventListener("mouseleave",function(){hold=Math.min(hold,Date.now()+1200)});
    new IntersectionObserver(function(es){vis=es[0].isIntersecting},{threshold:.35}).observe(r);
    window.addEventListener("resize",sync);sync();
    if(!rm)setInterval(function(){if(!vis||Date.now()<hold||document.hidden)return;var max=r.scrollWidth-r.clientWidth;if(max<=4)return;
      // at the end, go back to the start; otherwise go to the next card that actually moves the row (the last cards can't be centred on wide screens)
      if(r.scrollLeft>=max-4){go(r,0);return}
      var cs=cards(r),i=curIdx(r)+1;while(i<cs.length&&Math.min(max,cs[i].offsetLeft-r.offsetLeft-(r.clientWidth-cs[i].offsetWidth)/2)<=r.scrollLeft+4)i++;
      go(r,i>=cs.length?0:i)},3600);
  });
  // Mac carousel: the screens sit on a ring that keeps turning the same way. Tabs, dots, arrow keys, a swipe or a click on a side screen turn it; it pauses briefly while touched or hovered.
  if(mac){(function(){
    var sl=[].slice.call(mac.children),n=sl.length,turn=0,hold=0,vis=false,step=360/n,dots=document.querySelector('.dots[data-for="mactrack"]'),view=mac.parentNode;
    function cur(){return((turn%n)+n)%n}
    function size(){var w=sl[0].offsetWidth;if(w)mac.style.setProperty("--r",Math.round(w/2/Math.tan(Math.PI/n))+"px")}
    function draw(){var c=cur();sl.forEach(function(s,i){var d=((i-c)%n+n)%n;if(d>n/2)d-=n;
        s.style.transform="translateZ(calc(var(--r) * -1)) rotateY("+((i-turn)*step)+"deg) translateZ(var(--r))";
        s.classList.toggle("cur",d===0);s.classList.toggle("near",d===1||d===-1);s.setAttribute("aria-hidden",d===0?"false":"true")});
      if(dots)[].forEach.call(dots.children,function(b,i){b.classList.toggle("on",i===c)});
      tabs.forEach(function(t,i){t.setAttribute("aria-selected",i===c?"true":"false");var p=t.parentNode;if(i===c&&p.scrollWidth>p.clientWidth)p.scrollTo({left:t.offsetLeft-p.clientWidth/2+t.offsetWidth/2,behavior:rm?"auto":"smooth"})})}
    function by(d){turn+=d;draw()}
    function to(i){var d=((i-cur())%n+n)%n;if(d>n/2)d-=n;by(d)}
    // once the carousel is on screen, load every screen so none turns up empty
    function eager(){if(eager.done)return;eager.done=true;mac.querySelectorAll("img").forEach(function(m){m.loading="eager"})}
    function wait(ms){hold=Math.max(hold,Date.now()+ms)}
    if(dots)sl.forEach(function(s,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show screen "+(i+1));b.onclick=function(){wait(8000);to(i)};dots.appendChild(b)});
    tabs.forEach(function(t,i){t.addEventListener("click",function(){wait(8000);to(i)})});
    // swipe or drag sideways to turn; a click on a side screen brings it to the front
    var x0=null,y0=0,moved=false;
    mac.addEventListener("pointerdown",function(e){x0=e.clientX;y0=e.clientY;moved=false;wait(5000)});
    mac.addEventListener("pointermove",function(e){if(x0===null)return;var dx=e.clientX-x0;if(Math.abs(dx)>36&&Math.abs(dx)>Math.abs(e.clientY-y0)){moved=true;x0=null;wait(5000);by(dx<0?1:-1)}});
    ["pointerup","pointercancel","pointerleave"].forEach(function(ev){mac.addEventListener(ev,function(){x0=null})});
    sl.forEach(function(s,i){s.addEventListener("click",function(){if(!moved&&s.classList.contains("near")){wait(5000);to(i)}})});
    mac.addEventListener("dragstart",function(e){e.preventDefault()});
    mac.addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();wait(8000);by(e.key==="ArrowRight"?1:-1)}});
    view.addEventListener("mouseenter",function(){wait(5000)});view.addEventListener("mouseleave",function(){hold=Math.min(hold,Date.now()+1200)});
    mac.addEventListener("focusin",function(){wait(5000)});
    if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)eager()},{threshold:.3}).observe(mac);else{vis=true;eager()}
    window.addEventListener("resize",size);window.addEventListener("load",size);size();draw();
    if(!rm)setInterval(function(){if(vis&&!document.hidden&&Date.now()>=hold)by(1)},3200);
  })()}
})();
