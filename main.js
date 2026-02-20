document.addEventListener("DOMContentLoaded", () => {

  /* ═══════════════════════════════════════════
     MOBILE NAVIGATION (Fully Responsive Safe)
  ═══════════════════════════════════════════ */

  const toggle = document.querySelector(".menu-toggle");
  const nav    = document.querySelector(".nav-links");

  if (toggle && nav) {

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.toggle("active");
      document.body.classList.toggle("nav-open");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar")) {
        nav.classList.remove("active");
        document.body.classList.remove("nav-open");
      }
    });

    // Close on resize (important for responsiveness)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        nav.classList.remove("active");
        document.body.classList.remove("nav-open");
      }
    });
  }


  /* ═══════════════════════════════════════════
     GALLERY SECTION (Only if Exists)
  ═══════════════════════════════════════════ */

  const items      = Array.from(document.querySelectorAll(".gallery-item"));
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (items.length > 0) {

    let currentIndex = 0;
    let visible = new Array(items.length).fill(true);
    let isNavigating = false;

    const likedItems = new Set();
    const savedItems = new Set();

    /* ───────────── Build Card UI ───────────── */

    items.forEach((item, index) => {

      /* Overlay */
      const overlay = document.createElement("div");
      overlay.className = "item-overlay";
      overlay.innerHTML = `<span class="overlay-label">View Artwork</span>`;
      item.appendChild(overlay);

      /* Action Buttons */
      const actions = document.createElement("div");
      actions.className = "item-actions";
      actions.innerHTML = `
        <button class="action-btn like-btn" aria-label="Like">♡</button>
        <button class="action-btn save-btn" aria-label="Save">🔖</button>
      `;
      item.appendChild(actions);

      const likeBtn = actions.querySelector(".like-btn");
      const saveBtn = actions.querySelector(".save-btn");

      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleState(index, likeBtn, likedItems, "♡", "♥", "liked");
      });

      saveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleState(index, saveBtn, savedItems, "🔖", "⭐", "saved");
      });

      item.addEventListener("click", () => {
        currentIndex = index;
        openLightbox();
      });
    });

    function toggleState(index, btn, set, offChar, onChar, className) {
      if (set.has(index)) {
        set.delete(index);
        btn.textContent = offChar;
        btn.classList.remove(className);
      } else {
        set.add(index);
        btn.textContent = onChar;
        btn.classList.add(className);
      }
    }


    /* ───────────── FILTER SYSTEM ───────────── */

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        items.forEach((item, i) => {
          const match = filter === "all" || item.dataset.category === filter;
          visible[i] = match;

          if (match) {
            item.style.display = "";
            requestAnimationFrame(() => {
              item.classList.remove("hide");
              item.classList.add("show");
            });
          } else {
            item.classList.add("hide");
            item.classList.remove("show");
            setTimeout(() => {
              if (item.classList.contains("hide")) {
                item.style.display = "none";
              }
            }, 400);
          }
        });

      });
    });


    /* ═══════════════════════════════════════════
       LIGHTBOX
    ═══════════════════════════════════════════ */

    function getVisibleIndices() {
      return items
        .map((_, i) => visible[i] ? i : null)
        .filter(i => i !== null);
    }

    function openLightbox() {

      const visibleIndices = getVisibleIndices();
      if (!visibleIndices.length) return;

      const pos = visibleIndices.indexOf(currentIndex);
      const total = visibleIndices.length;

      const box = document.createElement("div");
      box.className = "lightbox";

      const imgSrc = items[currentIndex].querySelector("img").src;

      box.innerHTML = `
        <div class="lightbox-counter">${pos + 1} / ${total}</div>
        <button class="lb-close">&#215;</button>
        <button class="lb-prev">&#8249;</button>
        <img src="${imgSrc}">
        <button class="lb-next">&#8250;</button>
      `;

      document.body.appendChild(box);
      document.body.style.overflow = "hidden";

      box.querySelector(".lb-close").onclick = () => closeLightbox(box);
      box.querySelector(".lb-prev").onclick  = () => navigate(-1, box);
      box.querySelector(".lb-next").onclick  = () => navigate(1, box);

      box.addEventListener("click", e => {
        if (e.target === box) closeLightbox(box);
      });

      document.addEventListener("keydown", keyHandler);

      function keyHandler(e) {
        if (e.key === "ArrowRight") navigate(1, box);
        if (e.key === "ArrowLeft")  navigate(-1, box);
        if (e.key === "Escape")     closeLightbox(box);
      }

      box._cleanup = () => {
        document.removeEventListener("keydown", keyHandler);
      };
    }

    function navigate(dir, box) {
      if (isNavigating) return;
      isNavigating = true;

      const visibleIndices = getVisibleIndices();
      let pos = visibleIndices.indexOf(currentIndex);
      pos = (pos + dir + visibleIndices.length) % visibleIndices.length;
      currentIndex = visibleIndices[pos];

      const img = box.querySelector("img");
      img.style.opacity = "0";

      setTimeout(() => {
        img.src = items[currentIndex].querySelector("img").src;
        img.style.opacity = "1";
        isNavigating = false;

        box.querySelector(".lightbox-counter").textContent =
          `${pos + 1} / ${visibleIndices.length}`;

      }, 200);
    }

    function closeLightbox(box) {
      if (box._cleanup) box._cleanup();
      box.remove();
      document.body.style.overflow = "";
    }

  }

});
