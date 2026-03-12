/**
 * SplitText: 디테일 페이지 태그라인을 글자 단위로 나누고
 * 스크롤 시 GSAP + ScrollTrigger로 순차 등장 애니메이션
 * (React SplitText 컴포넌트 동작을 바닐라로 구현)
 */
(function () {
  var TAGLINE_SELECTOR =
    ".jub-tagline, .ebo-tagline, .sandal-tagline, .wj-tagline, .ag-tagline, .jd-tagline, .rud-tagline, .ao-tagline, .lot-tagline";

  var DEFAULTS = {
    delay: 25,
    duration: 0.65,
    ease: "power3.out",
    splitType: "chars",
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
    threshold: 0.1,
    rootMargin: "-100px"
  };

  function splitIntoChars(text) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var s = document.createElement("span");
      s.className = "split-char";
      s.textContent = ch === " " ? "\u00A0" : ch;
      fragment.appendChild(s);
    }
    return fragment;
  }

  function applySplit(el) {
    var text = el.textContent.trim();
    if (!text) return;
    el.textContent = "";
    el.classList.add("split-parent");
    var fragment = splitIntoChars(text);
    el.appendChild(fragment);
    return el.querySelectorAll(".split-char");
  }

  function run() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    var taglines = document.querySelectorAll(TAGLINE_SELECTOR);
    var startPct = (1 - DEFAULTS.threshold) * 100;
    var margin = DEFAULTS.rootMargin;
    var start = "top " + startPct + "%" + (margin ? " " + margin : "");

    taglines.forEach(function (wrap) {
      var paragraphs = wrap.querySelectorAll("p");
      paragraphs.forEach(function (p) {
        if (p._splitApplied) return;
        var chars = applySplit(p);
        if (!chars || !chars.length) return;
        p._splitApplied = true;

        gsap.fromTo(
          chars,
          { opacity: DEFAULTS.from.opacity, y: DEFAULTS.from.y },
          {
            opacity: DEFAULTS.to.opacity,
            y: DEFAULTS.to.y,
            duration: DEFAULTS.duration,
            ease: DEFAULTS.ease,
            stagger: DEFAULTS.delay / 1000,
            scrollTrigger: {
              trigger: p,
              start: start,
              once: true,
              fastScrollEnd: true
            },
            willChange: "transform, opacity",
            force3D: true
          }
        );
      });
    });
  }

  function init() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        setTimeout(run, 0);
      });
    } else {
      setTimeout(run, 100);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
