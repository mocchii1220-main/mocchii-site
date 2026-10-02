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
});
