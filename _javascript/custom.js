/* /_javascript/custom.js v202511050000 */

// Disable Turbo to fix all navigation and script reload issues.
// This is the definitive solution for the "Ctrl+Shift+R" problem.
if (typeof Turbo !== 'undefined') {
  Turbo.session.drive = false;
}
