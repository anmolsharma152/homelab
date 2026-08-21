(function () {
  const ACTIVE_GROUP_NAME = "Active";

  function findActiveGroup() {
    const groups = document.querySelectorAll("#layout-groups > div");
    for (const group of groups) {
      const heading = group.querySelector("h2, h3");
      if (heading && heading.textContent.trim() === ACTIVE_GROUP_NAME) {
        return group;
      }
    }
    return null;
  }

  function ensureGroupExpanded(group) {
    const btn = group.querySelector("button");
    if (btn && btn.getAttribute("aria-expanded") !== "true") {
      btn.click();
    }
  }

  function openStats(group) {
    const toggles = group.querySelectorAll("li.service button.service-container-stats");
    toggles.forEach((btn) => {
      const li = btn.closest("li");
      const stats = li ? li.querySelector(".service-stats") : null;
      if (stats && stats.children.length === 0) {
        btn.click();
      }
    });
  }

  function run() {
    const group = findActiveGroup();
    if (!group) return;
    ensureGroupExpanded(group);
    setTimeout(() => openStats(group), 150);
  }

  run();

  let lastRun = 0;
  const observer = new MutationObserver(() => {
    const now = Date.now();
    if (now - lastRun > 800) {
      lastRun = now;
      run();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
