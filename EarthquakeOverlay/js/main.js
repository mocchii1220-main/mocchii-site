document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 0. ライト/ダークモードの切り替え
  // ==========================================
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleLabel = themeToggle.querySelector(".theme-toggle-label");
  const savedTheme = localStorage.getItem("earthquake-overlay-theme");
  const initialTheme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const updateTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    const label = theme === "dark"
      ? "To Lightmode"
      : "To Darkmode";
    themeToggleLabel.textContent = label;
    themeToggle.setAttribute("aria-label", label);
  };

  if (themeToggle) {
    updateTheme(initialTheme);
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      updateTheme(nextTheme);
      localStorage.setItem("earthquake-overlay-theme", nextTheme);
    });
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
