export const activateEnhanceScript = `
(function(){
  document.addEventListener("click", function(e){
    var t = e.target && e.target.closest && e.target.closest("[data-copy]");
    if(!t) return;
    var v = t.getAttribute("data-copy");
    if(v && navigator.clipboard) navigator.clipboard.writeText(v);
  });
  document.querySelectorAll("audio").forEach(function(a){
    var orig = a.play.bind(a);
    a.play = function(){
      var p = orig();
      if(p && p.catch) p.catch(function(){
        var g = document.querySelector("[data-hear-none]");
        if(g) g.removeAttribute("hidden");
      });
      return p;
    };
  });
  document.querySelectorAll("form").forEach(function(f){
    f.addEventListener("submit", function(e){
      var btn = e.submitter || f.querySelector("button[type=submit].btn-lg, button[type=submit].btn-primary");
      if(!btn || btn.dataset.held || btn.dataset.noHold) return;
      e.preventDefault();
      btn.dataset.held = "1";
      btn.classList.add("btn-load");
      btn.setAttribute("aria-busy", "true");
      setTimeout(function(){
        if(typeof f.requestSubmit === "function") f.requestSubmit(btn);
        else f.submit();
      }, 520);
    });
  });
  var first = document.querySelector("main input:not([type=hidden]), main button, main select, main textarea");
  if(first && first.focus) setTimeout(function(){ try{ first.focus({preventScroll:true}); }catch(e){ first.focus(); } }, 80);
  document.querySelectorAll(".hrow .hc input").forEach(function(box){
    var row = box.closest(".hrow");
    if(!row) return;
    var sync = function(){ row.classList.toggle("closed", box.checked); };
    box.addEventListener("change", sync);
    sync();
  });
  var vary = document.querySelector("[data-hours-vary]");
  if(vary){
    vary.addEventListener("change", function(){
      if(!vary.checked) return;
      document.querySelectorAll(".hrow .hc input").forEach(function(box){
        box.checked = true;
        var row = box.closest(".hrow");
        if(row) row.classList.add("closed");
      });
      var msg = document.querySelector("input[name=after][value=message-only]");
      if(msg) msg.checked = true;
    });
  }
  var clock = document.querySelector("[data-call-ring] .cs-time");
  if(clock){
    var n = 0;
    setInterval(function(){
      n += 1;
      var seconds = 4 + Math.floor(n * 0.7);
      clock.textContent = "0:" + String(seconds).padStart(2, "0");
      if(n >= 9){
        var slow = document.querySelector("[data-slow-route]");
        if(slow) slow.removeAttribute("hidden");
      }
    }, 700);
  }
  var photo = document.querySelector("input[name=photo]");
  if(photo){
    photo.addEventListener("change", function(){
      var file = photo.files && photo.files[0];
      var quality = document.querySelector("input[name=quality]");
      if(!file || !quality) return;
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function(){
        var c = document.createElement("canvas");
        var w = 64, h = 64;
        c.width = w; c.height = h;
        var ctx = c.getContext("2d");
        if(!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        var data = ctx.getImageData(0,0,w,h).data;
        var sum=0, sum2=0, n=w*h;
        for(var i=0;i<data.length;i+=4){
          var y = 0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];
          sum += y; sum2 += y*y;
        }
        var mean = sum/n;
        var varr = sum2/n - mean*mean;
        var blurry = document.querySelector("[data-blurry]");
        if(varr < 180){
          quality.value = "blurry";
          photo.value = "";
          if(blurry){
            blurry.removeAttribute("hidden");
            blurry.innerHTML = blurry.innerHTML;
          }
        } else {
          quality.value = "ok";
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }
  var stage = document.querySelector("[data-browser-call]");
  if(stage && navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
      var pc = new RTCPeerConnection();
      stream.getTracks().forEach(function(track){ pc.addTrack(track, stream); });
      return pc.createOffer().then(function(offer){
        return pc.setLocalDescription(offer).then(function(){
          return fetch("/api/test-call", {
            method: "POST",
            headers: {"content-type":"application/sdp"},
            body: offer.sdp || ""
          });
        });
      }).then(function(res){ return res.text(); }).then(function(sdp){
        return pc.setRemoteDescription({type:"answer", sdp:sdp}).catch(function(){});
      });
    }).catch(function(){
      var fail = document.querySelector("[data-browser-fail]");
      if(fail) fail.removeAttribute("hidden");
    });
  }
})();
`;
