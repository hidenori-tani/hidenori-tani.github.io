/* 業績ページの絞り込み。データはHTMLの data-* 属性だけを読む（二重管理をしない） */
(function () {
  var bar = document.querySelector('.filter');
  if (!bar) return;
  bar.hidden = false;                                  // JSが動く環境でだけ出す

  var items = [].slice.call(document.querySelectorAll('.pitem'));
  var secs  = [].slice.call(document.querySelectorAll('.pubsec'));
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var yrs   = [].slice.call(document.querySelectorAll('.yr'));
  var q     = document.getElementById('q');
  var st    = document.querySelector('.filter__st');
  var empty = document.querySelector('.empty');
  var state = { g: 'all', y: null, q: '' };
  // 表示文はページの lang から選ぶ（英語ページに日本語が漏れないように）
  var JA = document.documentElement.lang !== 'en';
  var T = JA
    ? { year: '\u5e74', quote: ['\u300c', '\u300d'], sep: '\u3000', join: '\u30fb',
        reset: '\u3000\u2014 \u3059\u3079\u3066\u8868\u793a\u306b\u623b\u3059\u306b\u306f\u300c\u3059\u3079\u3066\u300d\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044',
        count: function (n) { return n + ' \u4ef6'; } }
    : { year: '', quote: ['\u201c', '\u201d'], sep: ' \u00b7 ', join: ' \u00b7 ',
        reset: ' \u00b7 press All to clear',
        count: function (n) { return n + (n === 1 ? ' item' : ' items'); } };

  function norm(s) { return (s || '').toLowerCase(); }

  function apply() {
    var shown = 0;
    items.forEach(function (li) {
      var ok = (state.g === 'all' || li.dataset.group === state.g)
            && (state.y === null   || li.dataset.year  === state.y)
            && (state.q === ''     || li.dataset.q.indexOf(state.q) !== -1);
      li.hidden = !ok;
      if (ok) shown++;
    });
    secs.forEach(function (sec) {
      var vis = sec.querySelectorAll('.pitem:not([hidden])').length;
      sec.hidden = vis === 0;
      var b = sec.querySelector('.pubsec__n b');
      if (b) b.textContent = vis;
    });
    empty.hidden = shown !== 0;

    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.g === state.g)); });
    yrs.forEach(function (b) { b.classList.toggle('is-on', state.y === b.dataset.year); });

    var parts = [];
    if (state.g !== 'all') parts.push(document.querySelector('.chip[data-g="' + state.g + '"]').firstChild.nodeValue);
    if (state.y) parts.push(state.y === 'inpress' ? 'in press' : (state.y + T.year));
    if (state.q) parts.push(T.quote[0] + q.value.trim() + T.quote[1]);
    st.textContent = T.count(shown) + (parts.length ? T.sep + parts.join(T.join) + T.reset : '');
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      state.g = c.dataset.g;
      if (state.g === 'all') { state.y = null; state.q = ''; q.value = ''; }
      apply();
    });
  });
  yrs.forEach(function (b) {
    b.addEventListener('click', function () {
      state.y = (state.y === b.dataset.year) ? null : b.dataset.year;
      apply();
    });
  });
  var t;
  q.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { state.q = norm(q.value.trim()); apply(); }, 120);
  });
  q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; state.q = ''; apply(); } });

  apply();
})();
