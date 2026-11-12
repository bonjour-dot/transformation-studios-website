// Site settings: change these in one place.
const SITE = {
  appStoreUrl: "#",        // iPhone and iPad App Store link
  macAppStoreUrl: "#",     // Mac App Store link
  storyVideoUrl: "",       // YouTube or Vimeo link for "Ryan's story"
  supportEmail: "hello@transformationstudio.site"
};

(function(){
  var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  // App Store buttons and badges: use the real links once they are set; until then buttons scroll to Pricing and badges stay hidden
  function live(u){return !!u&&u!=="#"}
  document.querySelectorAll("[data-store]").forEach(function(a){var u=a.getAttribute("data-store")==="mac"?SITE.macAppStoreUrl:SITE.appStoreUrl;if(live(u)){a.href=u;a.rel="noopener";a.hidden=false}});
  document.querySelectorAll("[data-support]").forEach(function(a){a.href="mailto:"+SITE.supportEmail;if(a.hasAttribute("data-fill"))a.textContent=SITE.supportEmail});
  // Story video: a click-to-play preview. Nothing loads from YouTube or Vimeo until the visitor clicks.
  var vbox=document.querySelector(".video"),vurl=SITE.storyVideoUrl||"",vm,vsrc="";
  if((vm=vurl.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)))vsrc="https://www.youtube-nocookie.com/embed/"+vm[1]+"?autoplay=1&rel=0";
  else if((vm=vurl.match(/vimeo\.com\/(?:video\/)?(\d+)/)))vsrc="https://player.vimeo.com/video/"+vm[1]+"?autoplay=1&dnt=1";
  if(vbox&&vsrc){var lab=vbox.querySelector("small");if(lab)lab.textContent="RYAN'S STORY \u00b7 PLAY VIDEO";vbox.classList.add("ready");vbox.setAttribute("role","button");vbox.tabIndex=0;vbox.setAttribute("aria-label","Play Ryan's story");
    var playv=function(){if(vbox.querySelector("iframe"))return;var f=document.createElement("iframe");f.src=vsrc;f.title="Ryan's story";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.referrerPolicy="strict-origin-when-cross-origin";vbox.textContent="";vbox.appendChild(f);vbox.classList.add("playing");vbox.removeAttribute("role");vbox.removeAttribute("tabindex")};
    vbox.addEventListener("click",playv);vbox.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();playv()}})}
  // waveform bars
  var w=document.getElementById("wave");
  if(w){var s=7,h="";for(var i=0;i<44;i++){s=(s*9301+49297)%233280;var v=30+Math.round(s/233280*62);h+='<i style="height:'+v+'%"></i>'}w.insertAdjacentHTML("afterbegin",h)}
  // trim digits: start value ticks forward, like typing an exact time
  var ts=document.getElementById("tr-s"),cur=document.getElementById("ev-cur"),k=0;
  if(ts&&!rm)setInterval(function(){k=(k+1)%40;var t=k*0.3;ts.textContent="0:"+(t<10?"0":"")+t.toFixed(1);var c=Math.floor(k*5.6);cur.textContent=Math.floor(c/60)+":"+String(c%60).padStart(2,"0")},700);
  // captions word highlight
  var cw=document.querySelectorAll("#capw span"),ci=0;
  if(cw.length){cw[0].classList.add("on");if(!rm)setInterval(function(){cw[ci].classList.remove("on");ci=(ci+1)%cw.length;cw[ci].classList.add("on")},480)}
  // teleprompter demo record
  var tp=document.getElementById("tp"),rb=document.getElementById("recb"),tm,t=0;
  function tick(){t++;var r=180-t;document.getElementById("tp-t").textContent=Math.floor(t/60)+":"+String(t%60).padStart(2,"0");document.getElementById("tp-left").textContent=Math.floor(r/60)+":"+String(r%60).padStart(2,"0");document.getElementById("tp-prog").style.width=(t/180*100)+"%";if(t>=180)t=0}
  if(rb)rb.addEventListener("click",function(){if(tp.classList.toggle("recording")){t=0;tick();tm=setInterval(tick,1000)}else clearInterval(tm)});
  // transcript hold
  var box=document.getElementById("trx");
  if(box){var ps=box.querySelectorAll(".para"),pop=document.getElementById("pop");
    function on(el){ps.forEach(function(x){x.classList.toggle("on",x===el)});box.classList.add("holding");var b=box.getBoundingClientRect(),r=el.getBoundingClientRect(),sc=box.offsetWidth/b.width||1,y=(r.top-b.top)*sc,top=y-pop.offsetHeight-8;if(top<box.offsetHeight*0.1)top=y+r.height*sc+8;pop.style.top=top+"px"}
    ps.forEach(function(el){var tmr;el.addEventListener("click",function(){on(el)});el.addEventListener("pointerdown",function(){tmr=setTimeout(function(){on(el)},350)});["pointerup","pointerleave"].forEach(function(e){el.addEventListener(e,function(){clearTimeout(tmr)})})});
    window.addEventListener("load",function(){on(ps[1])});window.addEventListener("resize",function(){var c=box.querySelector(".para.on");if(c)on(c)})}
  // Auto carousels: keep moving on their own, pause briefly while the visitor touches, hovers or scrolls them, then carry on
  function cards(r){return [].slice.call(r.children).filter(function(c){return c.offsetWidth>0})}
  function curIdx(r){var cs=cards(r),x=r.scrollLeft+r.clientWidth/2,best=0,d=1e9;cs.forEach(function(c,i){var m=c.offsetLeft+c.offsetWidth/2-r.offsetLeft,dd=Math.abs(m-x);if(dd<d){d=dd;best=i}});return best}
  function go(r,i){var cs=cards(r);if(!cs.length)return;i=(i+cs.length)%cs.length;var c=cs[i];r.scrollTo({left:c.offsetLeft-r.offsetLeft-(r.clientWidth-c.offsetWidth)/2,behavior:rm?"auto":"smooth"})}
  var tabs=document.querySelectorAll(".mac-tabs button"),mac=document.getElementById("mactrack");
  document.querySelectorAll(".auto").forEach(function(r){
    var dots=document.querySelector('.dots[data-for="'+r.id+'"]'),hold=0,vis=false,n=cards(r).length;
    if(dots){for(var i=0;i<n;i++){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show item "+(i+1));(function(k){b.onclick=function(){hold=Date.now()+8000;go(r,k)}})(i);dots.appendChild(b)}}
    function sync(){var c=curIdx(r);if(dots){dots.classList.toggle("hide",r.scrollWidth<=r.clientWidth+4);[].forEach.call(dots.children,function(d,i){d.classList.toggle("on",i===c)})}
      if(r===mac)tabs.forEach(function(t,i){t.setAttribute("aria-selected",i===c?"true":"false");if(i===c&&t.parentNode.scrollWidth>t.parentNode.clientWidth)t.parentNode.scrollTo({left:t.offsetLeft-t.parentNode.clientWidth/2+t.offsetWidth/2,behavior:"smooth"})})}
    var st;r.addEventListener("scroll",function(){clearTimeout(st);st=setTimeout(sync,80)},{passive:true});
    ["pointerdown","touchstart","touchmove","wheel","focusin"].forEach(function(e){r.addEventListener(e,function(){hold=Date.now()+5000},{passive:true})});
    r.addEventListener("mouseenter",function(){hold=Date.now()+5000});r.addEventListener("mouseleave",function(){hold=Math.min(hold,Date.now()+1200)});
    new IntersectionObserver(function(es){vis=es[0].isIntersecting},{threshold:.35}).observe(r);
    window.addEventListener("resize",sync);sync();
    if(!rm)setInterval(function(){if(!vis||Date.now()<hold||document.hidden)return;var max=r.scrollWidth-r.clientWidth;if(max<=4)return;
      // at the end, go back to the start; otherwise go to the next card that actually moves the row (the last cards can't be centred on wide screens)
      if(r.scrollLeft>=max-4){go(r,0);return}
      var cs=cards(r),i=curIdx(r)+1;while(i<cs.length&&Math.min(max,cs[i].offsetLeft-r.offsetLeft-(r.clientWidth-cs[i].offsetWidth)/2)<=r.scrollLeft+4)i++;
      go(r,i>=cs.length?0:i)},r===mac?4000:3200);
  });
  tabs.forEach(function(t,i){t.addEventListener("click",function(){go(mac,i);mac.dispatchEvent(new Event("pointerdown"))})});
})();
