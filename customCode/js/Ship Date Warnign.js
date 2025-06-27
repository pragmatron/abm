/*  Highlight the dueDate field:
      • orange = 2-3 days left
      • red    = 0-1 day left OR past due
------------------------------------------------------------ */

const MS_PER_DAY = 86_400_000;

// selector that finds every rendered due-date cell or link
const DUE_CELL_SELECTOR = "a[aria-label='dueDate'], td[data-field='dueDate']";

// main routine ------------------------------------------------
function colorizeDueDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);          // midnight

  document.querySelectorAll(DUE_CELL_SELECTOR).forEach(el => {
    const txt  = el.textContent.trim();
    const date = new Date(txt);
    if (isNaN(date)) return;           // skip non-dates

    const diff = (date - today) / MS_PER_DAY;   // + = future
    el.classList.remove("due-warning", "due-danger");

    if (diff <= 1)       el.classList.add("due-danger");   // past due or ≤1 day
    else if (diff <= 3)  el.classList.add("due-warning");  // 2-3 days
  });
}

// first run
colorizeDueDates();

/*  Run again whenever the page DOM changes (grid reload, filters, etc.).
    MutationObserver is the safest generic hook in case $watchGrid
    isn’t available on this page.                                  */
new MutationObserver(colorizeDueDates)
  .observe(document.body, { childList:true, subtree:true });


