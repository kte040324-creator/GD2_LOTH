/**
 * Product detail: Size Guide 섹션이 뷰포트에 들어오면
 * S, M, L 이미지가 순서대로 위로 올라오는 애니메이션 트리거
 */
(function () {
  function init() {
    var section = document.querySelector(".detail-sg");
    if (!section) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("sg-visible");
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );
    observer.observe(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
