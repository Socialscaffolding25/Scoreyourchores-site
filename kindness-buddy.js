/* Score Your Chores Kindness Buddy kit: a stand-up paper Buddy, its arrival letter and 24 morning notes that only
   notice the good. Uses the Buddies and QR code from printables.js. No tracking, nothing leaves the page. */
(function () {
  "use strict";
  var D = window.__SYC;
  var root = document.querySelector("[data-kindness-buddy]");
  if (!D || !root) return;
  // data-mode="notes" prints only the 24 notes, signed by whoever the family chooses (an elf, a Buddy, any December visitor).
  var notesOnly = root.getAttribute("data-mode") === "notes";
  // Facebook and Instagram open links in their own browser, where printing often does nothing.
  var inApp = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger/i.test(navigator.userAgent || "");
  var inAppNote = '<p class="maker-note maker-inapp"><strong>Opened from Facebook or Instagram?</strong> Printing may not work inside the app. Tap the ••• menu at the top and open this page in your browser, then print.</p>';

  var themes = {
    bubblegum: { name: "Bubblegum", strong: "#C92F7C", main: "#F4579E", soft: "#FFE0F0", page: "#FFF0F7", border: "#F7D3E5" },
    orange: { name: "Orange", strong: "#C4500F", main: "#FF8A3D", soft: "#FFE6D6", page: "#FFF4EC", border: "#F9D8C2" },
    sky: { name: "Sky", strong: "#1E6FB8", main: "#3AA7F5", soft: "#DDF0FF", page: "#EEF7FF", border: "#CBE4F7" },
    lime: { name: "Lime", strong: "#237A2C", main: "#58C23A", soft: "#E2F7D9", page: "#F1FBEC", border: "#CDEBC0" },
    sunshine: { name: "Sunshine", strong: "#8A5A00", main: "#FFC31F", soft: "#FFF1C7", page: "#FFF9E6", border: "#F5E0A0" },
    grape: { name: "Grape", strong: "#5A3FD6", main: "#8F7BFF", soft: "#ECE7FF", page: "#F5F2FF", border: "#DCD3FB" },
  };
  var buddyNames = { pip: "Pip", nimbus: "Nimbus", bolt: "Bolt", mochi: "Mochi", pebble: "Pebble", twinkle: "Twinkle" };
  var SPOT = "spot";
  // "spot" notes have a line for the grown-up to write what they saw; the rest are gentle missions.
  var notes = [
    ["hello", "Hello {name}! I’ve come to look for kind things. I think I’ll find lots."],
    [SPOT, "I spotted you", "That was so kind!"],
    ["mission", "Today’s mission: make someone smile."],
    ["mission", "Today’s mission: tidy one thing without being asked."],
    [SPOT, "I spotted you", "I did a happy dance!"],
    ["mission", "Today’s mission: say thank you three times."],
    ["mission", "Today’s mission: draw a picture for someone you love."],
    [SPOT, "I spotted you", "You’re a superstar."],
    ["mission", "Today’s mission: help lay the table."],
    ["mission", "Today’s mission: share something with someone."],
    [SPOT, "I spotted you", "That made my day."],
    ["half", "Halfway to Christmas! I’ve already seen so many good things."],
    ["mission", "Today’s mission: give someone a compliment."],
    ["mission", "Today’s mission: help someone who looks busy."],
    [SPOT, "I spotted you", "Kindness is your superpower."],
    ["mission", "Today’s mission: make a thank you card."],
    ["mission", "Today’s mission: let someone else go first."],
    [SPOT, "I spotted you", "Wow!"],
    ["mission", "Today’s mission: help with the Christmas baking or cooking."],
    ["mission", "Today’s mission: make a card for someone special."],
    [SPOT, "I spotted you", "My heart is glowing."],
    ["mission", "Today’s mission: put your toys away before bed."],
    [SPOT, "I spotted you", "Only two more sleeps!"],
    ["bye", "It’s Christmas Eve! Thank you for a month of kindness, {name}. Happy Christmas!"],
  ];
  var state = { name: "", from: "", buddy: root.getAttribute("data-buddy") || "twinkle", theme: root.getAttribute("data-theme") || "bubblegum" };

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function nameOr(fallback) {
    return state.name.trim() ? esc(state.name.trim()) : fallback;
  }
  function possessive() {
    var n = state.name.trim();
    if (!n) return "Your";
    return esc(n) + (/s$/i.test(n) ? "’" : "’s");
  }
  function buddySvg(kind, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 120 120" aria-hidden="true">' + D.buddies[kind] + "</svg>";
  }
  function vars(t) {
    return "--strong:" + t.strong + ";--main:" + t.main + ";--soft:" + t.soft + ";--page:" + t.page + ";--border:" + t.border;
  }
  function fill(text) {
    return esc(text).replace("{name}", nameOr("friend"));
  }
  function signer() {
    if (!notesOnly) return esc(buddyNames[state.buddy]);
    return state.from.trim() ? esc(state.from.trim()) : "your elf";
  }
  function noteIcon() {
    if (!notesOnly) return buddySvg(state.buddy, "kb-mini");
    return '<svg class="kb-mini" viewBox="0 0 24 24" aria-hidden="true"><path d="' + D.icons.star + '" style="fill:var(--main);stroke:var(--strong)" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  }

  function sheets() {
    var t = themes[state.theme];
    var b = buddyNames[state.buddy];
    var out = [];
    if (!notesOnly) {
    // 1. The stand-up Buddy: a tent card. The top half is upside down so it reads the right way round once folded.
    out.push(
      '<div class="sheet sheet-portrait kb-sheet" style="' + vars(t) + '">' +
        '<p class="kb-howto">Cut along the dotted line, fold along the middle and stand your Buddy on a shelf.</p>' +
        '<div class="kb-tent"><div class="kb-panel kb-back"><p class="kb-hi">Hello! I’m ' + esc(b) + ",</p><p class=\"kb-big\">" + (state.name.trim() ? possessive() : "your") +
        " Kindness Buddy.</p><p>I only notice the good things.</p></div>" +
        '<div class="kb-fold"><span>fold</span></div>' +
        '<div class="kb-panel kb-front">' + buddySvg(state.buddy, "kb-buddy") + '<p class="kb-banner">' + possessive() + " Kindness Buddy</p></div></div></div>"
    );
    // 2. The arrival letter and the grown-ups' guide.
    out.push(
      '<div class="sheet sheet-portrait kb-sheet" style="' + vars(t) + '">' +
        '<div class="kb-letter">' + buddySvg(state.buddy, "kb-letter-buddy") +
        "<h2>Dear " + nameOr("friend") + ",</h2>" +
        "<p>Hello! I’m " + esc(b) + ". I’ve come to stay with you until Christmas Eve.</p>" +
        "<p>I’m a Kindness Buddy, which means I only look for good things: helping, sharing, trying hard and being kind.</p>" +
        "<p>Every morning I’ll leave you a little note. Some will tell you something kind I spotted. Some will give you a mission.</p>" +
        "<p>There’s no naughty list. I’m not here to tell on anyone. I just love noticing good things!</p>" +
        '<p class="kb-sign">Love from ' + esc(b) + "</p></div>" +
        '<div class="kb-cut"><span>cut</span></div>' +
        '<div class="kb-guide"><h3>For grown ups: how the Kindness Buddy works</h3><ol>' +
        "<li>Cut out the Buddy, fold it along the middle and stand it on a shelf on 1 December with the letter.</li>" +
        "<li>Cut out the 24 notes. Each night, leave the next one by the Buddy. On the “I spotted you” notes, write something kind or helpful you saw that day.</li>" +
        "<li>Say it out loud too. The Buddy is for catching your child being good, never for watching for mistakes.</li></ol>" +
        '<div class="kb-app"><div class="sheet-qr">' + D.qr + "</div><p><strong>Keep it going after Christmas.</strong> In the free Score Your Chores app, each child picks their own Buddy that grows with every quest, and points go towards rewards you choose. For " +
        (D.androidLive ? "iPhone and Android" : "iPhone") + " at scoreyourchores.com</p></div></div></div>"
    );
    }
    // 3 and 4. Twelve notes a page.
    for (var p = 0; p < 2; p++) {
      var html = '<div class="sheet sheet-portrait kb-sheet" style="' + vars(t) + '"><div class="kb-notes">';
      for (var i = p * 12; i < p * 12 + 12; i++) {
        var n = notes[i];
        html += '<div class="kb-note"><div class="kb-note-head"><b>' + (i + 1) + "</b><span>December</span>" + noteIcon() + "</div>";
        if (n[0] === SPOT) html += '<p>' + esc(n[1]) + '</p><i class="kb-line"></i><i class="kb-line"></i><p class="kb-after">' + esc(n[2]) + "</p>";
        else html += "<p" + (n[0] === "mission" ? ' class="kb-mission"' : "") + ">" + fill(notesOnly && i === 0 ? "Hello {name}! This year I’m looking out for kind things. I think I’ll find lots." : n[1]) + "</p>";
        html += '<p class="kb-from">' + signer() + "</p></div>";
      }
      html += "</div>";
      if (notesOnly) html += '<p class="kb-foot"><strong>Made with Score Your Chores.</strong> For grown-ups: more free printables and a family chore app at scoreyourchores.com</p>';
      out.push(html + "</div>");
    }
    return out;
  }

  var controls = document.createElement("div");
  controls.className = "maker-controls";
  var previewWrap = document.createElement("div");
  previewWrap.className = "maker-preview";
  var stage = document.createElement("div");
  stage.className = "maker-stage kb-stage";
  previewWrap.appendChild(stage);
  root.appendChild(controls);
  root.appendChild(previewWrap);

  function field(label, inner) {
    var tag = inner.indexOf("<input") === 0 ? "label" : "div";
    return "<" + tag + ' class="field"><span class="field-label">' + label + "</span>" + inner + "</" + tag + ">";
  }
  function renderControls() {
    var html = field("Child’s name", '<input type="text" maxlength="22" autocomplete="off" data-k="name" placeholder="e.g. Mia" value="' + esc(state.name) + '" />');
    if (notesOnly) html += field("Who signs the notes?", '<input type="text" maxlength="22" autocomplete="off" data-k="from" placeholder="e.g. Jingle" value="' + esc(state.from) + '" />');
    if (!notesOnly) html += field(
      "Pick a Buddy",
      '<div class="buddy-pick" role="radiogroup" aria-label="Buddy">' +
        Object.keys(buddyNames).map(function (k) {
          return '<button type="button" role="radio" aria-checked="' + (state.buddy === k) + '" data-buddy="' + k + '" title="' + buddyNames[k] + '">' + buddySvg(k) + "<span>" + buddyNames[k] + "</span></button>";
        }).join("") + "</div>"
    );
    html += field(
      "Colour",
      '<div class="theme-pick" role="radiogroup" aria-label="Colour">' +
        Object.keys(themes).map(function (id) {
          return '<button type="button" role="radio" aria-checked="' + (state.theme === id) + '" aria-label="' + themes[id].name + '" data-theme="' + id + '" style="--sw:' + themes[id].main + '"></button>';
        }).join("") + "</div>"
    );
    if (notesOnly) {
      html += '<button type="button" class="button primary print-btn" data-print>Print the notes (2 pages)</button>';
      html += '<p class="maker-note">Free, no sign up. Prints on A4: 24 notes, 12 to a page. Leave “Who signs the notes?” blank to sign them “your elf”. Choose “Save as PDF” in the print window to keep a copy.</p>';
    } else {
      html += '<button type="button" class="button primary print-btn" data-print>Print the kit (4 pages)</button>';
      html += '<p class="maker-note">Free, no sign up. Prints on A4: the stand-up Buddy, its letter and 24 notes. Choose “Save as PDF” in the print window to keep a copy.</p>';
    }
    if (inApp) html += inAppNote;
    controls.innerHTML = html;
  }
  function fit() {
    var list = stage.querySelectorAll(".sheet");
    if (!list.length) return;
    var w = list[0];
    w.style.transform = "none";
    var scale = Math.min(1, previewWrap.clientWidth / w.offsetWidth);
    var gap = 12;
    var y = 0;
    Array.prototype.forEach.call(list, function (s) {
      s.style.transform = "translateY(" + y + "px) scale(" + scale + ")";
      y += s.offsetHeight * scale + gap;
    });
    stage.style.height = y - gap + "px";
  }
  function renderSheets() {
    stage.innerHTML = sheets().join("");
    fit();
  }
  function all() {
    renderControls();
    renderSheets();
  }

  var printRoot = document.getElementById("print-root");
  if (!printRoot) {
    printRoot = document.createElement("div");
    printRoot.id = "print-root";
    document.body.appendChild(printRoot);
  }
  function preparePrint() {
    printRoot.innerHTML = sheets().join("");
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
    renderSheets();
  });
  controls.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    if (btn.hasAttribute("data-print")) {
      preparePrint();
      window.print();
      return;
    }
    if (btn.getAttribute("data-buddy")) state.buddy = btn.getAttribute("data-buddy");
    else if (btn.getAttribute("data-theme")) state.theme = btn.getAttribute("data-theme");
    else return;
    all();
  });
  window.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  all();
})();
