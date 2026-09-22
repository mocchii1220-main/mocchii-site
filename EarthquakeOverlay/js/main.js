document.addEventListener("DOMContentLoaded", () => {
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
