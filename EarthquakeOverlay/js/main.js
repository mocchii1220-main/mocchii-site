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
  // 0.5. READMEのMarkdown表示
  // ==========================================
  const softwareReadme = document.getElementById("software-readme");

  if (softwareReadme) {
    const appendInlineMarkdown = (parent, text) => {
      const inlinePattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\.{0,2}\/[^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;
      let lastIndex = 0;
      let match;

      while ((match = inlinePattern.exec(text)) !== null) {
        parent.append(document.createTextNode(text.slice(lastIndex, match.index)));

        if (match[1] !== undefined) {
          const link = document.createElement("a");
          link.href = match[2];
          link.textContent = match[1];
          if (/^https?:\/\//i.test(match[2])) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          parent.append(link);
        } else {
          const element = document.createElement(match[3] !== undefined ? "strong" : match[4] !== undefined ? "code" : "em");
          element.textContent = match[3] ?? match[4] ?? match[5];
          parent.append(element);
        }

        lastIndex = inlinePattern.lastIndex;
      }

      parent.append(document.createTextNode(text.slice(lastIndex)));
    };

    const renderMarkdown = (markdown) => {
      const fragment = document.createDocumentFragment();
      let paragraphLines = [];
      let listElement = null;

      const flushParagraph = () => {
        if (paragraphLines.length === 0) return;
        const paragraph = document.createElement("p");
        appendInlineMarkdown(paragraph, paragraphLines.join(" "));
        fragment.append(paragraph);
        paragraphLines = [];
      };

      const closeList = () => {
        if (listElement) fragment.append(listElement);
        listElement = null;
      };

      markdown.replace(/\r\n?/g, "\n").split("\n").forEach((line) => {
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        const unorderedItem = line.match(/^\s*[-*+]\s+(.+)$/);
        const orderedItem = line.match(/^\s*\d+\.\s+(.+)$/);

        if (heading) {
          flushParagraph();
          closeList();
          const element = document.createElement(`h${Math.min(heading[1].length + 2, 5)}`);
          appendInlineMarkdown(element, heading[2]);
          fragment.append(element);
        } else if (unorderedItem || orderedItem) {
          flushParagraph();
          const listTag = unorderedItem ? "ul" : "ol";
          if (!listElement || listElement.tagName.toLowerCase() !== listTag) {
            closeList();
            listElement = document.createElement(listTag);
          }
          const item = document.createElement("li");
          appendInlineMarkdown(item, (unorderedItem || orderedItem)[1]);
          listElement.append(item);
        } else if (line.trim() === "") {
          flushParagraph();
          closeList();
        } else {
          closeList();
          paragraphLines.push(line.trim());
        }
      });

      flushParagraph();
      closeList();
      return fragment;
    };

    fetch("softwareReadme.md")
      .then((response) => {
        if (!response.ok) throw new Error("READMEの読み込みに失敗しました。");
        return response.text();
      })
      .then((markdown) => {
        softwareReadme.replaceChildren();
        if (markdown.trim()) {
          softwareReadme.append(renderMarkdown(markdown));
        } else {
          const status = document.createElement("p");
          status.className = "software-readme-status";
          status.textContent = "softwareReadme.md はまだ空です。";
          softwareReadme.append(status);
        }
      })
      .catch(() => {
        softwareReadme.replaceChildren();
        const status = document.createElement("p");
        status.className = "software-readme-status";
        status.textContent = "READMEを読み込めませんでした。";
        softwareReadme.append(status);
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
