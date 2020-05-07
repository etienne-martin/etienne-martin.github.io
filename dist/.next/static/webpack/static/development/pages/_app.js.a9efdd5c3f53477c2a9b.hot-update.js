webpackHotUpdate("static/development/pages/_app.js",{

/***/ "./src/styles/theme.ts":
/*!*****************************!*\
  !*** ./src/styles/theme.ts ***!
  \*****************************/
/*! exports provided: theme, GlobalStyle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "theme", function() { return theme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalStyle", function() { return GlobalStyle; });
/* harmony import */ var _babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");


function _templateObject() {
  var data = Object(_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');\n  \n  ::selection {\n    background: #8a3af4; /* WebKit/Blink Browsers */\n  }\n  ::-moz-selection {\n    background: #8a3af4; /* Gecko Browsers */\n  }\n\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}



var fonts = {
  sans: "'Bebas Neue', cursive, Helvetica, Arial, sans-serif",
  mono: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace"
};
var fontWeights = {
  bold: 700,
  medium: 500,
  regular: 400
};
var colors = {
  primary: "#8a3af4",
  secondary: "#000",
  tertiary: "#2AA1A1",
  textPrimary: "#fff",
  textSecondary: "#666",
  textTertiary: "#999",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3",
  success: "#4caf50"
};
var h1 = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:10vw;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
var h2 = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:48px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
var h3 = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:36px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
var h4 = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:24px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
var h5 = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:18px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
var h6 = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:16px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
var button = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:14px;font-weight:", ";"], fonts.sans, fontWeights.medium);
var body = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:18px;font-weight:", ";"], fonts.sans, fontWeights.regular);
var caption = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:14px;font-weight:", ";"], fonts.sans, fontWeights.regular);
var mono = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["font-family:", ";font-size:14px;font-weight:", ";"], fonts.mono, fontWeights.regular);
var theme = {
  fonts: fonts,
  fontWeights: fontWeights,
  colors: colors,
  typography: {
    h1: h1,
    h2: h2,
    h3: h3,
    h4: h4,
    h5: h5,
    h6: h6,
    body: body,
    caption: caption,
    button: button,
    mono: mono
  },
  spacing: {
    large: 30,
    medium: 20,
    small: 15,
    tiny: 10
  },
  transition: {
    slow: 0.35,
    normal: 0.25,
    fast: 0.15
  },
  cornerRadius: 4
};
var GlobalStyle = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["createGlobalStyle"])(_templateObject(), function (_ref) {
  var theme = _ref.theme;
  return Object(styled_components__WEBPACK_IMPORTED_MODULE_1__["css"])(["*{padding:0;margin:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}html,body,#__next{height:100%;min-width:320px;}body{background:#1b1b1b;color:", ";", ";cursor:default;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-text-size-adjust:none;}strong{font-weight:", ";}a{color:", ";text-decoration:none;}button{cursor:pointer;}"], theme.colors.textSecondary, theme.typography.body, theme.fontWeights.bold, theme.colors.textSecondary);
});

/***/ })

})
//# sourceMappingURL=_app.js.a9efdd5c3f53477c2a9b.hot-update.js.map