/**
 * 장바구니: S/M/L 선택 후 ADD TO CART 시 헤더 카트 아이콘에 숫자 배지 누적
 */
(function () {
  var STORAGE_KEY = "loth_cart_count";

  function getCartCount() {
    try {
      var n = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return isNaN(n) || n < 0 ? 0 : n;
    } catch (e) {
      return 0;
    }
  }

  function setCartCount(n) {
    var num = Math.max(0, parseInt(n, 10) || 0);
    try {
      localStorage.setItem(STORAGE_KEY, String(num));
    } catch (e) {}
    return num;
  }

  function ensureBadge() {
    var cart = document.querySelector(".icon-cart");
    if (!cart) return null;
    var badge = cart.querySelector(".cart-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      badge.setAttribute("aria-hidden", "true");
      cart.appendChild(badge);
    }
    return badge;
  }

  function updateCartBadge() {
    var badge = ensureBadge();
    if (!badge) return;
    var count = getCartCount();
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.setAttribute("data-count", String(count));
    badge.style.display = count > 0 ? "flex" : "none";
  }

  function getSelectedSize(product) {
    if (!product) return null;
    var wrap = product.querySelector(".jub-size-wrap.is-selected, .ebo-size-wrap.is-selected, .sandal-size-wrap.is-selected, .wj-size-wrap.is-selected, .ag-size-wrap.is-selected, .jd-size-wrap.is-selected, .rud-size-wrap.is-selected, .ao-size-wrap.is-selected, .lot-size-wrap.is-selected");
    if (!wrap) return null;
    if (wrap.classList.contains("jub-size-s") || wrap.classList.contains("ebo-size-s") || wrap.classList.contains("sandal-size-s") || wrap.classList.contains("wj-size-s") || wrap.classList.contains("ag-size-s") || wrap.classList.contains("jd-size-s") || wrap.classList.contains("rud-size-s") || wrap.classList.contains("ao-size-s") || wrap.classList.contains("lot-size-s")) return "S";
    if (wrap.classList.contains("jub-size-m") || wrap.classList.contains("ebo-size-m") || wrap.classList.contains("sandal-size-m") || wrap.classList.contains("wj-size-m") || wrap.classList.contains("ag-size-m") || wrap.classList.contains("jd-size-m") || wrap.classList.contains("rud-size-m") || wrap.classList.contains("ao-size-m") || wrap.classList.contains("lot-size-m")) return "M";
    if (wrap.classList.contains("jub-size-l") || wrap.classList.contains("ebo-size-l") || wrap.classList.contains("sandal-size-l") || wrap.classList.contains("wj-size-l") || wrap.classList.contains("ag-size-l") || wrap.classList.contains("jd-size-l") || wrap.classList.contains("rud-size-l") || wrap.classList.contains("ao-size-l") || wrap.classList.contains("lot-size-l")) return "L";
    return null;
  }

  function bindAddToCart() {
    var btn = document.querySelector(".jub-add-cart, .ebo-add-cart, .sandal-add-cart, .wj-add-cart, .ag-add-cart, .jd-add-cart, .rud-add-cart, .ao-add-cart, .lot-add-cart");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var product = btn.closest(".jub-product, .ebo-product, .sandal-product, .wj-product, .ag-product, .jd-product, .rud-product, .ao-product, .lot-product");
      var size = getSelectedSize(product);
      if (!size) {
        alert("Please select a size (S, M, or L).");
        return;
      }
      var count = getCartCount() + 1;
      setCartCount(count);
      updateCartBadge();
    });
  }

  function init() {
    updateCartBadge();
    bindAddToCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
