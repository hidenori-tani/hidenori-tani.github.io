/* スクロールで静かに現れる。JS が無い環境では CSS 側の .js 縛りで最初から見えている */
(function () {
  var els = document.querySelectorAll('.rise');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (e, i) {
    e.style.transitionDelay = (Math.min(i % 6, 5) * 70) + 'ms';
    io.observe(e);
  });
})();
