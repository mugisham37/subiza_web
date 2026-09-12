/** Progressive enhancement only. The field is a usable <input> without this. */
export const otpSlotsScript = `(function(){
  function paint(root){
    var input = root.querySelector("input");
    var slots = root.querySelectorAll(".slot");
    if (!input || !slots.length) return;
    var value = String(input.value || "").replace(/\\D/g, "").slice(0, 6);
    if (value !== input.value) input.value = value;
    var active = document.activeElement === input ? value.length : -1;
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var ch = value.charAt(i);
      slot.textContent = ch;
      slot.classList.toggle("filled", Boolean(ch));
      slot.classList.toggle("cursor", i === active || (active === 6 && i === 5));
    }
  }
  function bind(root){
    if (root.getAttribute("data-otp-bound")) return;
    root.setAttribute("data-otp-bound", "1");
    var input = root.querySelector("input");
    if (!input) return;
    input.addEventListener("input", function(){ paint(root); });
    input.addEventListener("focus", function(){ paint(root); });
    input.addEventListener("blur", function(){ paint(root); });
    paint(root);
  }
  function scan(){
    var nodes = document.querySelectorAll("[data-otp]");
    for (var i = 0; i < nodes.length; i++) bind(nodes[i]);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }
})();`;
