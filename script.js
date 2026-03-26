/* Works on any page that has #search and a tbody */
const searchInput = document.getElementById("search"); 

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const filter = searchInput.value.toLowerCase().trim();
    const rows = document.querySelectorAll("tbody tr");
 
    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();
      const match = text.includes(filter);
      row.style.display = match ? "" : "none";
 
      /* Subtle highlight animation on re-show */
      if (match && filter.length > 0) {
        row.style.animation = "none";
        /* Force reflow so animation restarts */
        void row.offsetWidth;
        row.style.animation = "cardSlideIn .3s ease both";
      }
    });
    /* Show a "no results" message if every row is hidden */
    const tbody = document.querySelector("tbody");
    if (tbody) {
      const visible = [...rows].some(r => r.style.display !== "none");
      let noResults = document.getElementById("no-results-msg");
 
      if (!visible) {
        if (!noResults) {
          noResults = document.createElement("tr");
          noResults.id = "no-results-msg";
          noResults.innerHTML =
            '<td colspan="10" style="text-align:center;padding:1.5rem;' +
            'font-family:var(--font-display);color:var(--color-primary);' +
            'letter-spacing:.05em;text-transform:uppercase;font-size:.9rem;">' +
            "No results found</td>";
          tbody.appendChild(noResults);
        }
      } else {
        if (noResults) noResults.remove();
      }
    }
  });
 
  /* Prevent form submit from reloading page — filter works live */
  const form = searchInput.closest("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }
}
/* Reads the #sort select value and re-orders tbody rows*/
const sortSelect = document.getElementById("sort");

function getRowSortValue(row, key) {
  switch (key) {
    case "name-asc":
    case "name-desc": {
      /* Athlete name: second td; Meet name: first td */
      const nameIndex = row.querySelector('[data-label="Athlete Name"]') ? 1 : 0;
      const cell = row.querySelectorAll("td")[nameIndex];
      return cell ? cell.textContent.trim().toLowerCase() : "";
    }
    case "date-asc":
    case "date-desc": {
      const timeEl = row.querySelector("time");
      return timeEl ? timeEl.getAttribute("datetime") || "" : "";
    }
    default:
      return "";
  }
}

function sortTable(selectEl) {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;
 
  const value = selectEl.value;
  const rows = [...tbody.querySelectorAll("tr:not(#no-results-msg)")];
 
  rows.sort(function (a, b) {
    const aVal = getRowSortValue(a, value);
    const bVal = getRowSortValue(b, value);
 
    if (value.endsWith("-asc")) {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
 
  /* Re-append in new order, triggering entrance animation */
  rows.forEach(function (row, i) {
    row.style.animationDelay = i * 0.05 + "s";
    row.style.animation = "none";
    void row.offsetWidth;
    row.style.animation = "cardSlideIn .35s ease both";
    tbody.appendChild(row);
  });
}
 
if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    sortTable(sortSelect);
  });

 

  const form = searchInput.closest("form");
  if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
    });
}

}
 
 

// SCROLL-TO-TOP FAB
// If a .fab button exists, clicking it scrolls to top.
// If none exists, one is injected automatically.

function injectFABIfMissing() {
  if (!document.querySelector(".fab")) {
    const fab = document.createElement("button");
    fab.className = "fab";
    fab.setAttribute("aria-label", "Scroll to top");
    fab.setAttribute("title", "Scroll to top");
    fab.textContent = "↑";
    document.body.appendChild(fab);
  }
}

injectFABIfMissing();

const fab = document.querySelector(".fab");
if (fab) {
  /* Only show FAB after scrolling down a bit */
  fab.style.opacity = "0";
  fab.style.pointerEvents = "none";
  fab.style.transition = "opacity 0.3s ease, transform 0.3s ease";
 
  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      fab.style.opacity = "1";
      fab.style.pointerEvents = "auto";
    } else {
      fab.style.opacity = "0";
      fab.style.pointerEvents = "none";
    }
  });
 
  fab.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/*ACTIVE NAV HIGHLIGHT, Marks the nav link matching the current page as active, and Adds aria-current="page" for accessibility. */
(function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");
 
  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
    } else {
      /* Remove stale aria-current if the HTML had it wrong */
      if (link.getAttribute("aria-current") === "page") {
        link.removeAttribute("aria-current");
      }
    }
  });
})();
 
 
/*Enhances any <a href="#..."> links beyond CSS scroll-behavior*/
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    const targetId = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      /* Move focus for accessibility */
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});

/*Enhances any <a href="#..."> links beyond CSS scroll-behavior*/
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    const targetId = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      /* Move focus for accessibility */
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});

/* If an image file is missing, show a simple "Image not available" fallback */
document.querySelectorAll("img").forEach(function (img) {
  img.addEventListener("error", function () {
    const wrapper = document.createElement("div");
    wrapper.style.width = img.width ? img.width + "px" : "200px";
    wrapper.style.height = img.height ? img.height + "px" : "200px";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.borderRadius = "8px";
    wrapper.style.border = "1px solid var(--color-border)";
    wrapper.style.backgroundColor = "var(--color-surface-2)";
    wrapper.style.fontFamily = "var(--font-display)";
    wrapper.style.fontSize = ".85rem";
    wrapper.style.textTransform = "uppercase";
    wrapper.style.letterSpacing = ".06em";
    wrapper.textContent = "Image not available";

    img.replaceWith(wrapper);
  }, { once: true });
});
