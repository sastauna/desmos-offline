window._require = window.require;
window.require = undefined;
window._process = window.process;
window.process = undefined;
window.jQuery = window.$ = _require("jquery");
console.log(jQuery);
