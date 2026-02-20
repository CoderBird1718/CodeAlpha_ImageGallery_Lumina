document.addEventListener("DOMContentLoaded", () => {

  /* ═══════════════════════════════════════════
     MOBILE NAV
  ═══════════════════════════════════════════ */
  const toggle = document.querySelector(".menu-toggle");
  const nav    = document.querySelector(".nav-links");

  if (toggle) {
    toggle.addEventListener("click", e => {
      e.stopPropagation();
      nav.classList.toggle("active");
    });
    document.addEventListener("click", e => {
      if (!e.target.closest(".navbar")) nav.classList.remove("active");
    });
  }


  /* ═══════════════════════════════════════════
     GALLERY LOGIC
  ═══════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items      = Array.from(document.querySelectorAll(".gallery-item"));

  if (!items.length) return;

  // visible[i] = true means shown by current filter
  const visible = new Array(items.length).fill(true);
  let currentIndex = 0;

  const likedItems = new Set();
  const savedItems = new Set();


  /* ── Build overlay + action buttons on each card ── */
  items.forEach((item, index) => {

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "item-overlay";
    overlay.innerHTML = `<span class="overlay-label">View Artwork</span>`;
    item.appendChild(overlay);

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "item-actions";
    actions.innerHTML = `
      <button class="action-btn like-btn" title="Like" aria-label="Like">♡</button>
      <button class="action-btn save-btn" title="Save" aria-label="Save">🔖</button>
    `;
    item.appendChild(actions);

    /* Like */
    const likeBtn = actions.querySelector(".like-btn");
    likeBtn.addEventListener("click", e => {
      e.stopPropagation();
      createRipple(likeBtn, e);
      if (likedItems.has(index)) {
        likedItems.delete(index);
        likeBtn.classList.remove("liked");
        likeBtn.textContent = "♡";
      } else {
        likedItems.add(index);
        likeBtn.classList.add("liked");
        likeBtn.textContent = "♥";
        likeBtn.classList.remove("pulse");
        void likeBtn.offsetWidth;
        likeBtn.classList.add("pulse");
      }
    });

    /* Save */
    const saveBtn = actions.querySelector(".save-btn");
    saveBtn.addEventListener("click", e => {
      e.stopPropagation();
      createRipple(saveBtn, e);
      if (savedItems.has(index)) {
        savedItems.delete(index);
        saveBtn.classList.remove("saved");
        saveBtn.textContent = "🔖";
      } else {
        savedItems.add(index);
        saveBtn.classList.add("saved");
        saveBtn.textContent = "⭐";
        saveBtn.classList.remove("pulse");
        void saveBtn.offsetWidth;
        saveBtn.classList.add("pulse");
      }
    });

    /* Open lightbox */
    item.addEventListener("click", () => {
      currentIndex = index;
      openLightbox();
    });

    /* Touch ripple on card */
    item.addEventListener("touchstart", e => {
      createCardRipple(item, e.touches[0]);
    }, { passive: true });
  });


  /* ── FILTER ── */
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
          // Force reflow then animate in
          requestAnimationFrame(() => {
            item.classList.remove("hide");
            item.classList.add("show");
          });
        } else {
          item.classList.add("hide");
          item.classList.remove("show");
          setTimeout(() => {
            if (item.classList.contains("hide")) item.style.display = "none";
          }, 420);
        }
      });
    });
  });


  /* ═══════════════════════════════════════════
     LIGHTBOX
  ═══════════════════════════════════════════ */

  let touchStartX = 0;
  let touchStartY = 0;
  let isNavigating = false;

  function getVisibleIndices() {
    return items.reduce((acc, _, i) => {
      if (visible[i]) acc.push(i);
      return acc;
    }, []);
  }

  function openLightbox() {
    const visibleIndices = getVisibleIndices();
    const posInVisible   = visibleIndices.indexOf(currentIndex);
    const total          = visibleIndices.length;

    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");

    const imgSrc  = items[currentIndex].querySelector("img").src;
    const altText = items[currentIndex].querySelector("img").alt || "";

    box.innerHTML = `
      <div class="lightbox-counter">${posInVisible + 1} / ${total}</div>
      <button class="lb-close" aria-label="Close">&#215;</button>
      <button class="lb-prev"  aria-label="Previous">&#8249;</button>
      <img src="${imgSrc}" alt="${altText}">
      <button class="lb-next"  aria-label="Next">&#8250;</button>
      <div class="swipe-hint">swipe or use arrow keys</div>
    `;

    document.body.appendChild(box);
    document.body.style.overflow = "hidden";

    const closeBtn = box.querySelector(".lb-close");
    const prevBtn  = box.querySelector(".lb-prev");
    const nextBtn  = box.querySelector(".lb-next");

    closeBtn.addEventListener("click", e => { e.stopPropagation(); closeLightbox(box); });
    prevBtn.addEventListener("click",  e => { e.stopPropagation(); navigate(-1, box); });
    nextBtn.addEventListener("click",  e => { e.stopPropagation(); navigate(1, box); });

    /* Backdrop click — only close if clicking the dark backdrop itself */
    box.addEventListener("click", e => {
      if (e.target === box) closeLightbox(box);
    });

    /* Touch swipe */
    box.addEventListener("touchstart", e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    box.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (Math.abs(dx) > 50 && dy < 80) navigate(dx < 0 ? 1 : -1, box);
    });

    /* Keyboard */
    const onKey = e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); navigate(1, box); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); navigate(-1, box); }
      if (e.key === "Escape") closeLightbox(box);
    };
    document.addEventListener("keydown", onKey);
    box._cleanup = () => document.removeEventListener("keydown", onKey);

    // Focus trap
    closeBtn.focus();
  }

  function navigate(dir, box) {
    if (isNavigating) return;
    isNavigating = true;

    const visibleIndices = getVisibleIndices();
    if (visibleIndices.length < 2) { isNavigating = false; return; }

    let pos = visibleIndices.indexOf(currentIndex);
    pos = (pos + dir + visibleIndices.length) % visibleIndices.length;
    currentIndex = visibleIndices[pos];

    const img = box.querySelector("img");
    const slideOut = dir > 0 ? "-30px" : "30px";
    const slideIn  = dir > 0 ? "30px"  : "-30px";

    // Slide out
    img.style.transition = "opacity 0.18s ease, transform 0.18s ease";
    img.style.opacity    = "0";
    img.style.transform  = `translateX(${slideOut})`;

    setTimeout(() => {
      img.src       = items[currentIndex].querySelector("img").src;
      img.alt       = items[currentIndex].querySelector("img").alt || "";
      img.style.transition = "none";
      img.style.transform  = `translateX(${slideIn})`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          img.style.transition = "opacity 0.22s ease, transform 0.22s ease";
          img.style.opacity    = "1";
          img.style.transform  = "translateX(0)";
          isNavigating = false;
        });
      });

      // Update counter
      box.querySelector(".lightbox-counter").textContent =
        `${pos + 1} / ${visibleIndices.length}`;
    }, 190);
  }

  function closeLightbox(box) {
    if (box._cleanup) box._cleanup();
    box.style.transition = "opacity 0.22s ease";
    box.style.opacity    = "0";
    setTimeout(() => {
      box.remove();
      document.body.style.overflow = "";
    }, 230);
  }


  /* ═══════════════════════════════════════════
     RIPPLE HELPERS
  ═══════════════════════════════════════════ */

  function createRipple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const r    = document.createElement("span");
    r.className = "ripple";
    const size = 32;
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
    btn.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  }

  function createCardRipple(card, touch) {
    const rect = card.getBoundingClientRect();
    const r    = document.createElement("span");
    r.className = "ripple";
    const size = 90;
    r.style.cssText = `width:${size}px;height:${size}px;left:${touch.clientX - rect.left - size/2}px;top:${touch.clientY - rect.top - size/2}px;position:absolute;background:rgba(212,175,55,0.15);z-index:10;`;
    card.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  }

});