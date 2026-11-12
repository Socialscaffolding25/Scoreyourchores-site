/* Score Your Chores kindness advent calendar maker. Uses the Buddies and QR code from printables.js.
   No tracking, nothing leaves the page. */
(function () {
  "use strict";
  var D = window.__SYC;
  var root = document.querySelector("[data-advent]");
  if (!D || !root) return;

  var themes = {
    bubblegum: { name: "Bubblegum", strong: "#C92F7C", main: "#F4579E", soft: "#FFE0F0", page: "#FFF0F7", border: "#F7D3E5" },
    orange: { name: "Orange", strong: "#C4500F", main: "#FF8A3D", soft: "#FFE6D6", page: "#FFF4EC", border: "#F9D8C2" },
    sky: { name: "Sky", strong: "#1E6FB8", main: "#3AA7F5", soft: "#DDF0FF", page: "#EEF7FF", border: "#CBE4F7" },
    lime: { name: "Lime", strong: "#237A2C", main: "#58C23A", soft: "#E2F7D9", page: "#F1FBEC", border: "#CDEBC0" },
    sunshine: { name: "Sunshine", strong: "#8A5A00", main: "#FFC31F", soft: "#FFF1C7", page: "#FFF9E6", border: "#F5E0A0" },
    grape: { name: "Grape", strong: "#5A3FD6", main: "#8F7BFF", soft: "#ECE7FF", page: "#F5F2FF", border: "#DCD3FB" },
  };
  var buddyNames = { pip: "Pip", nimbus: "Nimbus", bolt: "Bolt", mochi: "Mochi", pebble: "Pebble", twinkle: "Twinkle" };
  var lists = {
    mix: {
      label: "Kind acts and helping",
      acts: [
        "Make someone a card", "Help lay the table", "Say three kind things", "Tidy up without being asked",
        "Share a toy or game", "Draw a picture for a neighbour", "Help make breakfast", "Give someone a compliment",
        "Pick toys for the charity shop", "Read a story to someone", "Put out food for the birds", "Help with the washing up",
        "Write a thank you note", "Make someone laugh", "Help wrap a present", "Call a grandparent",
        "Hold the door for someone", "Tidy your bedroom", "Make a paper snowflake", "Let someone else choose",
        "Help with the Christmas baking", "Thank a teacher or helper", "Put out the crackers", "Give the biggest hug",
      ],
    },
    little: {
      label: "For little ones (3 to 5)",
      acts: [
        "Give someone a hug", "Put your toys away", "Draw a picture for Grandma", "Say thank you three times",
        "Share your snack", "Help feed the pet", "Hang a bauble on the tree", "Shoes by the door",
        "Help water the plants", "Make a card for a friend", "Tell someone you love them", "Help pair the socks",
        "Pick a toy to give away", "Help lay the table", "Sing a song for someone", "Put your coat on the hook",
        "Help stir the baking", "Wave to a neighbour", "Clothes in the basket", "Say sorry and make up",
        "Make someone a paper chain", "Help carry the shopping", "Put out the crackers", "Give the biggest hug",
      ],
    },
  };
  var state = {
    name: "",
    buddy: root.getAttribute("data-buddy") || "twinkle",
    theme: root.getAttribute("data-theme") || "bubblegum",
    list: "mix",
  };

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function buddySvg(kind, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 120 120" aria-hidden="true">' + D.buddies[kind] + "</svg>";
  }
  function starSvg(color) {
    return '<svg class="advent-star" viewBox="0 0 24 24" aria-hidden="true"><path d="' + D.icons.star + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  }
  function possessive(name) {
    var n = name.trim();
    if (!n) return "My";
    return esc(n) + (/s$/i.test(n) ? "’" : "’s");
  }

  function sheet() {
    var t = themes[state.theme];
    var acts = lists[state.list].acts;
    var html =
      '<div class="sheet sheet-portrait advent-sheet" style="--strong:' + t.strong + ";--main:" + t.main + ";--soft:" + t.soft + ";--page:" + t.page + ";--border:" + t.border + '">' +
      '<div class="sheet-head">' + buddySvg(state.buddy, "sheet-buddy") +
      '<div class="sheet-title"><p class="sheet-eyebrow">' + esc(buddyNames[state.buddy]) + " and " + (state.name.trim() ? esc(state.name.trim()) : "me") + "</p>" +
      "<h2>" + possessive(state.name) + " Kindness Advent Calendar</h2><p>One kind act a day. Colour the star when it’s done!</p></div></div>" +
      '<div class="advent-grid">';
    acts.forEach(function (a, i) {
      var day = i + 1;
      html += '<div class="advent-day' + (day === 24 ? " is-last" : "") + '"><b>' + day + "</b><span>" + esc(a) + "</span>" + starSvg(day === 24 ? "#ffffff" : t.strong) + "</div>";
    });
    html +=
      '</div><div class="sheet-foot"><div class="sheet-brand"><div class="sheet-qr">' + D.qr + "</div><div><strong>Made with Score Your Chores</strong>" +
      "<span>The free chore chart app for " + (D.androidLive ? "iPhone and Android" : "iPhone") + ". Scan to get it, or visit scoreyourchores.com</span></div></div></div></div>";
    return html;
  }

  var controls = document.createElement("div");
  controls.className = "maker-controls";
  var previewWrap = document.createElement("div");
  previewWrap.className = "maker-preview";
  var stage = document.createElement("div");
  stage.className = "maker-stage";
  previewWrap.appendChild(stage);
  root.appendChild(controls);
  root.appendChild(previewWrap);

  function field(label, inner) {
    var tag = inner.indexOf("<input") === 0 ? "label" : "div";
    return "<" + tag + ' class="field"><span class="field-label">' + label + "</span>" + inner + "</" + tag + ">";
  }
  function renderControls() {
    var html = field("Child’s name", '<input type="text" maxlength="16" autocomplete="off" data-k="name" placeholder="e.g. Mia" value="' + esc(state.name) + '" />');
    html += field(
      "Pick a Buddy",
      '<div class="buddy-pick" role="radiogroup" aria-label="Buddy">' +
        Object.keys(buddyNames)
          .map(function (b) {
            return '<button type="button" role="radio" aria-checked="' + (state.buddy === b) + '" data-buddy="' + b + '" title="' + buddyNames[b] + '">' + buddySvg(b) + "<span>" + buddyNames[b] + "</span></button>";
          })
          .join("") +
        "</div>"
    );
    html += field(
      "Colour",
      '<div class="theme-pick" role="radiogroup" aria-label="Colour">' +
        Object.keys(themes)
          .map(function (id) {
            return '<button type="button" role="radio" aria-checked="' + (state.theme === id) + '" aria-label="' + themes[id].name + '" data-theme="' + id + '" style="--sw:' + themes[id].main + '"></button>';
          })
          .join("") +
        "</div>"
    );
    html += field(
      "Which 24 days?",
      '<div class="seg" role="radiogroup" aria-label="Which list">' +
        Object.keys(lists)
          .map(function (id) {
            return '<button type="button" role="radio" aria-checked="' + (state.list === id) + '" data-list="' + id + '">' + lists[id].label + "</button>";
          })
          .join("") +
        "</div>"
    );
    html += '<button type="button" class="button primary print-btn" data-print>Print or save as PDF</button>';
    html += '<p class="maker-note">Free, no sign up. Prints on A4. Choose “Save as PDF” in the print window to keep a copy.</p>';
    controls.innerHTML = html;
  }
  function fit() {
    var s = stage.firstChild;
    if (!s) return;
    s.style.transform = "none";
    var scale = Math.min(1, previewWrap.clientWidth / s.offsetWidth);
    s.style.transform = "scale(" + scale + ")";
    stage.style.height = s.offsetHeight * scale + "px";
  }
  function renderSheet() {
    stage.innerHTML = sheet();
    fit();
  }
  function all() {
    renderControls();
    renderSheet();
  }

  var printRoot = document.getElementById("print-root");
  if (!printRoot) {
    printRoot = document.createElement("div");
    printRoot.id = "print-root";
    document.body.appendChild(printRoot);
  }
  function preparePrint() {
    printRoot.innerHTML = stage.firstChild ? stage.firstChild.outerHTML : "";
    if (printRoot.firstChild) printRoot.firstChild.style.transform = "none";
  }
  window.addEventListener("beforeprint", function () {
    if (!printRoot.firstChild) preparePrint();
  });
  window.addEventListener("afterprint", function () {
    printRoot.innerHTML = "";
  });

  controls.addEventListener("input", function (e) {
    var k = e.target.getAttribute("data-k");
    if (!k) return;
    state[k] = e.target.value;
    renderSheet();
  });
  controls.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-print")) {
      preparePrint();
      window.print();
      return;
    }
    if (b.getAttribute("data-buddy")) state.buddy = b.getAttribute("data-buddy");
    else if (b.getAttribute("data-theme")) state.theme = b.getAttribute("data-theme");
    else if (b.getAttribute("data-list")) state.list = b.getAttribute("data-list");
    else return;
    all();
  });
  window.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  all();
})();
