/* assets/js/site.js  v6.3.5_202510170000 */
// active nav highlight
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname;
  document.querySelectorAll('.nav a').forEach(a => {
    try {
      const hrefPath = new URL(a.href).pathname;
      if (path.startsWith(hrefPath)) a.classList.add('active');
    } catch (e) {}
  });
});
