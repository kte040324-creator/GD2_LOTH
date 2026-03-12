/**
 * 디테일 페이지: 설명(태그라인) 끝 ~ 그라데이션/카드 섹션 사이 여백을 고정.
 * 텍스트 길이와 관계없이 동일한 간격 유지.
 */
(function() {
  var GAP_PX = 200; /* 설명 끝과 카드 섹션 시작 사이 고정 여백(px) */
  var ARROW_ABOVE_CAROUSEL = -90; /* 음수면 화살표가 카드 영역 안으로 들어감 */

  var PREFIXES = ["jub", "ebo", "sandal", "wj", "ag", "jd", "rud", "ao", "lot"];

  function applyLayout(prefix) {
    var tagline = document.querySelector("." + prefix + "-tagline");
    var bg = document.querySelector("." + prefix + "-bg");
    var carousel = document.querySelector("." + prefix + "-carousel");
    var arrow = document.querySelector("." + prefix + "-arrow");
    if (!tagline || !bg) return false;

    var taglineBottomFromPage = tagline.offsetTop + tagline.offsetHeight;
    var gradientEnd = taglineBottomFromPage + GAP_PX;
    bg.style.height = gradientEnd + "px";
    if (carousel) carousel.style.top = gradientEnd + "px";
    if (arrow) arrow.style.top = (gradientEnd - ARROW_ABOVE_CAROUSEL) + "px";

    return true;
  }

  function run() {
    for (var i = 0; i < PREFIXES.length; i++) {
      if (applyLayout(PREFIXES[i])) break;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("resize", run);
  window.addEventListener("load", run); /* 폰트 로드 후 리플로우 대응 */
})();
