document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const siteNavigation = document.getElementById("site-navigation");

  const closeMenu = () => {
    siteHeader.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");
    siteNavigation.setAttribute("aria-hidden", "true");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    siteNavigation.setAttribute("aria-hidden", String(!isOpen));
  });

  siteNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // ==========================================
  // 0.25. OS別のプレビュー警告
  // ==========================================
  const devWarningBadge = document.getElementById("dev-warning-badge");

  if (devWarningBadge) {
    const windowsNtVersion = navigator.userAgent.match(/Windows NT ([\d.]+)/i);
    const platform = navigator.userAgentData?.platform || navigator.platform;
    const isWindows = /^win/i.test(platform) || Boolean(windowsNtVersion);
    let warning = "【注意】現在開発中のプレビュー版です";

    if (!isWindows) {
      warning += "・Windows PC以外では動作しません";
    } else if (windowsNtVersion && Number.parseFloat(windowsNtVersion[1]) < 10) {
      warning += "・Windows NT: 10.0未満のため動作未確認です";
    }

    devWarningBadge.textContent = warning;
  }

  // ==========================================
  // 1. 利用規約未チェック時のエラー制御モーダル
  // ==========================================
  const termsCheckbox = document.getElementById("terms-checkbox");
  const dlButtons = document.querySelectorAll(".js-dl-btn");
  const errorModal = document.getElementById("error-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  if (termsCheckbox && errorModal && modalCloseBtn) {
    dlButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        if (!termsCheckbox.checked) {
          event.preventDefault();
          errorModal.classList.add("is-open");
          errorModal.setAttribute("aria-hidden", "false");
        }
      });
    });

    modalCloseBtn.addEventListener("click", () => {
      errorModal.classList.remove("is-open");
      errorModal.setAttribute("aria-hidden", "true");
    });

    errorModal.addEventListener("click", (event) => {
      if (event.target === errorModal) {
        errorModal.classList.remove("is-open");
        errorModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // ==========================================
  // 2. デモ画像のクリック拡大ビューアー（暗転）
  // ==========================================
  const zoomableImages = document.querySelectorAll(".js-zoomable-img");
  const imageViewerModal = document.getElementById("image-viewer-modal");
  const imageViewerContent = imageViewerModal.querySelector(".image-viewer-content");
  const imageViewerClose = imageViewerModal.querySelector(".image-viewer-close");

  zoomableImages.forEach(img => {
    img.addEventListener("click", () => {
      const currentSrc = img.getAttribute("src");
      const currentAlt = img.getAttribute("alt");
      
      imageViewerContent.setAttribute("src", currentSrc);
      imageViewerContent.setAttribute("alt", currentAlt);
      
      imageViewerModal.classList.add("is-open");
      imageViewerModal.setAttribute("aria-hidden", "false");
    });
  });

  const closeImageViewer = () => {
    imageViewerModal.classList.remove("is-open");
    imageViewerModal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      imageViewerContent.setAttribute("src", "");
    }, 300);
  };

  imageViewerClose.addEventListener("click", closeImageViewer);
  imageViewerContent.addEventListener("click", closeImageViewer);
  imageViewerModal.addEventListener("click", (event) => {
    if (event.target === imageViewerModal) {
      closeImageViewer();
    }
  });
});
