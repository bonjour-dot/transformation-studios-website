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
  // "Coming soon on the App Store" stands in for the badges until the App Store link is set.
  document.querySelectorAll("[data-store-soon]").forEach(function(s){s.hidden=!!storeHref});
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
      }).catch(function(){msg.className="lmsg err";msg.textContent="That did not go through. ";var a=document.createElement("a"),pick=f.querySelector("input[name=interest]:checked");a.href="mailto:"+SITE.supportEmail+"?subject="+encodeURIComponent("Launch list")+"&body="+encodeURIComponent("Add me to the launch list.\nEmail: "+em.value+"\nI'm here to: "+(pick?pick.value:"use the app"));a.textContent="Join by email instead";msg.appendChild(a)})})}
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
  var msec=document.getElementById("mission-video");
  if(msec&&(vsrc||/^(localhost|127\.0\.0\.1)$/.test(location.hostname)))msec.hidden=false;
  if(vbox&&vsrc){var lab=vbox.querySelector("small");if(lab)lab.textContent="RYAN'S STORY \u00b7 PLAY VIDEO";vbox.classList.add("ready");vbox.setAttribute("role","button");vbox.tabIndex=0;vbox.setAttribute("aria-label","Play Ryan's story");
    var playv=function(){if(vbox.querySelector("iframe"))return;var f=document.createElement("iframe");f.src=vsrc;f.title="Ryan's story";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.referrerPolicy="strict-origin-when-cross-origin";vbox.textContent="";vbox.appendChild(f);vbox.classList.add("playing");vbox.removeAttribute("role");vbox.removeAttribute("tabindex")};
    vbox.addEventListener("click",playv);vbox.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();playv()}})}
  // ---- Phone demos (build 47 look) ----
  // waveform bars in the Trim demo
  var w=document.getElementById("wave");
  if(w){var sd=7,h="";for(var i=0;i<40;i++){sd=(sd*9301+49297)%233280;var v=22+Math.round(sd/233280*70);h+='<i style="height:'+v+'%"></i>'}w.insertAdjacentHTML("afterbegin",h)}
  // trim and cut digits tick forward, like typing an exact time
  function fmt(t){var m=Math.floor(t/60),x=t-m*60;return m+":"+(x<10?"0":"")+x.toFixed(1)}
  var ts=document.getElementById("tr-s"),cur=document.getElementById("ev-cur"),cs=document.getElementById("cut-s"),cc=document.getElementById("cut-cur"),k=0;
  if(!rm&&(ts||cs))setInterval(function(){k=(k+1)%40;if(ts)ts.textContent=fmt(k*0.3);if(cur){var c=Math.floor(k*5.6);cur.textContent=Math.floor(c/60)+":"+String(c%60).padStart(2,"0")}if(cs)cs.textContent=fmt(k*0.1);if(cc)cc.textContent=fmt(4.2+(k%20)*0.3)},700);
  // captions light up word by word
  var cw=document.querySelectorAll("#capw span"),ci=0;
  if(cw.length){cw[0].classList.add("on");if(!rm)setInterval(function(){cw[ci].classList.remove("on");ci=(ci+1)%cw.length;cw[ci].classList.add("on")},480)}
  // Smart Cut: the three levels take turns; a tap picks one
  var lv=document.getElementById("sc-lvl");
  if(lv){var opts=[].slice.call(lv.children),held=0,cutz=document.querySelectorAll("#sc .cutz"),
      shapes={"Tight":[[16,11],[44,15],[78,13],[30,6],[62,5]],"Natural":[[18,9],[46,12],[80,10]],"Relaxed":[[46,10],[80,8]]};
    function pick(o){opts.forEach(function(x){x.classList.toggle("on",x===o)});
      document.getElementById("sc-p").textContent=o.dataset.p;document.getElementById("sc-s").textContent=o.dataset.s;
      document.getElementById("sc-after").textContent=o.dataset.l;document.getElementById("sc-len").textContent="0:12 → "+o.dataset.l;
      document.getElementById("sc-bar").style.width=o.dataset.w+"%";
      var sh=shapes[o.textContent]||[],box=cutz[0]&&cutz[0].parentNode;if(box){box.innerHTML=sh.map(function(z){return '<span class="cutz" style="left:'+z[0]+'%;width:'+z[1]+'%"></span>'}).join("")}}
    opts.forEach(function(o){o.style.cursor="pointer";o.addEventListener("click",function(){held=Date.now()+8000;pick(o)})});
    var si=1;if(!rm)setInterval(function(){if(Date.now()<held)return;si=(si+1)%opts.length;pick(opts[si])},2600)}
  // teleprompter demo record: the timer and countdown appear
  var tp=document.getElementById("tp"),rb=document.getElementById("recb"),tm,t=0;
  function tick(){t++;var r=30-t;document.getElementById("tp-t").textContent="0:"+String(t).padStart(2,"0");document.getElementById("tp-left").textContent="0:"+String(Math.max(r,0)).padStart(2,"0");document.getElementById("tp-prog").style.width=(t/30*100)+"%";if(t>=30)t=0}
  if(rb)rb.addEventListener("click",function(){if(tp.classList.toggle("recording")){t=0;tick();tm=setInterval(tick,1000)}else clearInterval(tm)});
  // Level page: tap a level
  document.querySelectorAll("#lv .b4lv").forEach(function(b,_,all){b.addEventListener("click",function(){[].forEach.call(document.querySelectorAll("#lv .b4lv"),function(x){x.classList.toggle("on",x===b)})})});
  // transcript: choose a paragraph to hear it
  var box=document.getElementById("trx");
  if(box){var ps=box.querySelectorAll(".para"),bar=document.getElementById("trx-bar"),tt=document.getElementById("trx-t"),pt;
    function choose(el){ps.forEach(function(x){x.classList.toggle("on",x===el)});box.classList.add("chosen");tt.textContent=el.dataset.t;
      var parts=el.dataset.t.split(":"),start=(+parts[0])*60+(+parts[1]);bar.style.transition="none";bar.style.width=(start/18*100)+"%";
      clearTimeout(pt);pt=setTimeout(function(){bar.style.transition="width 3s linear";bar.style.width=Math.min(100,(start+3)/18*100)+"%"},60)}
    ps.forEach(function(el){el.addEventListener("click",function(){choose(el)})});
    window.addEventListener("load",function(){choose(ps[1])})}
  // export: pick a format, the big button follows; tap it
  var fm=document.getElementById("fmt");
  if(fm){var fb=fm.querySelectorAll("button"),eb=document.getElementById("shbtn"),et=document.getElementById("shbtn-t"),sel=fb[0],ft;
    fb.forEach(function(b){b.addEventListener("click",function(){sel=b;fb.forEach(function(x){x.classList.toggle("on",x===b)});et.textContent="Export "+b.dataset.n})});
    eb.addEventListener("click",function(){et.textContent=sel.dataset.d;clearTimeout(ft);ft=setTimeout(function(){et.textContent="Export "+sel.dataset.n},1500)})}
  // ---- The demos play by themselves (like a live screen), pause for a few seconds when touched, and stay still with reduce motion ----
  function autoplay(root,ms,step){if(rm||!root)return;var held=0,vis=false;
    ["pointerdown","focusin","keydown"].forEach(function(e){root.addEventListener(e,function(){held=Date.now()+8000},{passive:true})});
    if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting},{threshold:.2}).observe(root);else vis=true;
    setInterval(function(){if(vis&&!document.hidden&&Date.now()>held)step()},ms)}
  function cycle(sel,cls,ms,root){var els=[].slice.call(document.querySelectorAll(sel));if(!els.length)return;var n=0;
    autoplay(root||els[0].closest(".scr"),ms,function(){els[n].classList.remove(cls);n=(n+1)%els.length;els[n].classList.add(cls)})}
  // Edit it all together and the other video tools: the dock lights up tool by tool
  [].forEach.call(document.querySelectorAll(".b4.v"),function(scr){var d=scr.querySelectorAll(".b4dock span");if(!d.length||scr.querySelector(".b4dock .on"))return;var n=-1;
    autoplay(scr,1300,function(){if(n>=0)d[n].classList.remove("on");n=(n+1)%d.length;d[n].classList.add("on")})});
  // Cut: Play, Split, Trim, Add and Zoom take turns
  var ct=document.querySelectorAll(".b4tools span");if(ct.length){var cn=2;autoplay(ct[0].closest(".scr"),1500,function(){ct[cn].classList.remove("on");cn=(cn+1)%ct.length;ct[cn].classList.add("on")})}
  // Captions: the styles take turns
  cycle(".b4styles span","on",1900);
  // Teleprompter: records a take, stops, starts again
  if(tp&&rb){var auto=true;rb.addEventListener("click",function(){auto=false},true);
    autoplay(tp,7000,function(){if(!auto)return;if(tp.classList.toggle("recording")){t=0;tick();clearInterval(tm);tm=setInterval(tick,1000)}else clearInterval(tm)})}
  // Level: Time, Delivery and Smart take turns
  (function(){var lv=document.querySelectorAll("#lv .b4lv");if(!lv.length)return;var n=1;autoplay(document.getElementById("lv"),2600,function(){n=(n+1)%lv.length;[].forEach.call(lv,function(x,i){x.classList.toggle("on",i===n)})})})();
  // Transcript: the paragraphs play one after another
  (function(){var b=document.getElementById("trx");if(!b)return;var ps=b.querySelectorAll(".para"),n=1;autoplay(b,3200,function(){n=(n+1)%ps.length;ps[n].click()})})();
  // Export: formats take turns, and the button shows it worked
  (function(){var f=document.getElementById("fmt");if(!f)return;var bs=f.querySelectorAll("button"),n=0,eb=document.getElementById("shbtn");
    autoplay(f.closest(".scr"),2200,function(){n=(n+1)%bs.length;bs[n].click();if(n%2===0)setTimeout(function(){eb.click()},900)})})();
  // ---- Cut: the chosen part moves, start, end and length follow ----
  (function(){var sel=document.getElementById("cut-sel");if(!sel)return;var st=document.getElementById("cut-start"),en=document.getElementById("cut-end"),ln=document.getElementById("cut-len"),
      parts=[[1.6,6.3],[3.2,8.0],[0.4,4.1],[5.5,10.8],[2.4,7.2]],n=0;
    function show(p){st.textContent=fmt(p[0]);en.textContent=fmt(p[1]);ln.textContent=(p[1]-p[0]).toFixed(1)+" s";sel.style.left=(p[0]/12*100)+"%";sel.style.width=((p[1]-p[0])/12*100)+"%"}
    show(parts[0]);autoplay(document.getElementById("cutd"),2400,function(){n=(n+1)%parts.length;show(parts[n])})})();
  // ---- Voice: record and stop ----
  (function(){var d=document.getElementById("vrecd");if(!d)return;var b=document.getElementById("vrecb"),c=document.getElementById("vrec"),secs=2,run;
    function clock(){clearInterval(run);if(d.classList.contains("rec")&&!rm)run=setInterval(function(){secs++;c.textContent=Math.floor(secs/60)+":"+String(secs%60).padStart(2,"0")},1000)}
    function toggle(){if(d.classList.toggle("rec")){secs=0;c.textContent="0:00"}else{c.textContent="0:18"}clock()}
    b.addEventListener("click",toggle);clock();autoplay(d,5200,toggle)})();
  // ---- Voice: translate ----
  (function(){var d=document.getElementById("trl");if(!d)return;var tr=JSON.parse(d.getAttribute("data-tr")),bs=d.querySelectorAll("#trl-l button"),n=0;
    function pick(k){n=k;[].forEach.call(bs,function(x,i){x.classList.toggle("on",i===k)});d.classList.add("swap");setTimeout(function(){document.getElementById("trl-0").textContent=tr[k][0];document.getElementById("trl-1").textContent=tr[k][1];d.classList.remove("swap")},220)}
    [].forEach.call(bs,function(b,k){b.addEventListener("click",function(){pick(k)})});autoplay(d,2800,function(){pick((n+1)%bs.length)})})();
  // ---- Photo: layout first ----
  (function(){var d=document.getElementById("lay");if(!d)return;var pv=document.getElementById("lay-p"),cs=d.querySelectorAll("#lay-c button"),ls=[].slice.call(d.querySelectorAll("#lay-l button")),nm=document.getElementById("lay-n"),order=ls.map(function(x){return x.dataset.k}),n=order.indexOf("l3a");
    function setLay(k){var c=k.charAt(1);n=order.indexOf(k);pv.className="b4col "+k;[].forEach.call(cs,function(x){x.classList.toggle("on",x.dataset.c===c)});
      ls.forEach(function(x){x.classList.toggle("hide",x.dataset.c!==c);x.classList.toggle("on",x.dataset.k===k)});nm.textContent="Add "+c+" photos"}
    [].forEach.call(cs,function(b){b.addEventListener("click",function(){setLay(ls.filter(function(x){return x.dataset.c===b.dataset.c})[0].dataset.k)})});
    ls.forEach(function(b){b.addEventListener("click",function(){setLay(b.dataset.k)})});
    autoplay(d,2200,function(){setLay(order[(n+1)%order.length])})})();
  // ---- Photo: filters ----
  (function(){var d=document.getElementById("flt");if(!d)return;var pv=d.querySelectorAll("#flt-p img"),bs=d.querySelectorAll("#flt-l button"),n=0;
    function pick(k){n=k;[].forEach.call(bs,function(x,i){x.classList.toggle("on",i===k)});[].forEach.call(pv,function(m){m.style.filter=bs[k].dataset.f})}
    [].forEach.call(bs,function(b,k){b.addEventListener("click",function(){pick(k)})});autoplay(d,2000,function(){pick((n+1)%bs.length)})})();
  // ---- Photo: adjust on a dial ----
  (function(){var d=document.getElementById("adj");if(!d)return;var pv=d.querySelectorAll("#adj-p img"),bs=d.querySelectorAll("#adj-l button"),v=document.getElementById("adj-v"),tk=d.querySelector(".b4dial .ticks"),mode=1,val=12,dir=1,steps=0;
    function apply(){var x=1+val/100,f=bs[mode].dataset.a;var css=f==="auto"?"brightness(1.08) contrast(1.08) saturate(1.15)":f+"("+x.toFixed(2)+")";
      [].forEach.call(pv,function(m){m.style.filter=css});v.textContent=f==="auto"?"Auto":(val>0?"+":"")+val;tk.style.backgroundPosition=(val*1.4)+"px 0"}
    function pick(k){mode=k;[].forEach.call(bs,function(x,i){x.classList.toggle("on",i===k)});val=k===0?0:12;apply()}
    [].forEach.call(bs,function(b,k){b.addEventListener("click",function(){pick(k)})});apply();
    autoplay(d,700,function(){steps++;if(steps%7===0){pick((mode+1)%bs.length);return}if(mode===0)return;val+=dir*8;if(val>=36||val<=-24)dir=-dir;apply()})})();
  // ---- Cameras: Photo takes photos, Video films ----
  [].forEach.call(document.querySelectorAll(".b4shoot"),function(d){var mode=d.dataset.mode,b=d.querySelector(".b4shut"),t=d.querySelector(".b4rtime"),last=d.querySelector(".b4last"),run,secs=0,shots=0,
      pics=["ph-s1","ph-s4","ph-s3","ph-s6"];
    function thumb(src,vid){last.style.backgroundImage="url(/assets/img/build47/"+src+".jpg)";last.classList.toggle("vid",!!vid);last.classList.add("pop");setTimeout(function(){last.classList.remove("pop")},300)}
    function press(){if(mode==="photo"){d.classList.remove("snap");void d.offsetWidth;d.classList.add("snap");thumb(pics[shots++%pics.length]);return}
      if(d.classList.toggle("filming")){secs=0;t.textContent="0:00";clearInterval(run);run=setInterval(function(){secs++;t.textContent="0:"+String(secs).padStart(2,"0")},1000)}else{clearInterval(run);thumb("ph-s2",true)}}
    b.addEventListener("click",press);
    var script=mode==="photo"?["press","wait","press","wait"]:["press","wait","wait","wait","press","wait"],k=0;
    autoplay(d,1400,function(){if(script[k++%script.length]==="press")press()})});
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
