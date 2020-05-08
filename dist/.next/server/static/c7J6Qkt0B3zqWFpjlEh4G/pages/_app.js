module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("hUgY");


/***/ }),

/***/ "8Bbg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("B5Ud")


/***/ }),

/***/ "B5Ud":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__("TqRt");

exports.__esModule = true;
exports.Container = Container;
exports.createUrl = createUrl;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__("cDcd"));

var _utils = __webpack_require__("kYf9");

exports.AppInitialProps = _utils.AppInitialProps;
/**
* `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
* This allows for keeping state between navigation, custom error handling, injecting additional data.
*/

async function appGetInitialProps(_ref) {
  var {
    Component,
    ctx
  } = _ref;
  var pageProps = await (0, _utils.loadGetInitialProps)(Component, ctx);
  return {
    pageProps
  };
}

class App extends _react.default.Component {
  // Kept here for backwards compatibility.
  // When someone ended App they could call `super.componentDidCatch`.
  // @deprecated This method is no longer needed. Errors are caught at the top level
  componentDidCatch(error, _errorInfo) {
    throw error;
  }

  render() {
    var {
      router,
      Component,
      pageProps,
      __N_SSG,
      __N_SSP
    } = this.props;
    return _react.default.createElement(Component, Object.assign({}, pageProps, // we don't add the legacy URL prop if it's using non-legacy
    // methods like getStaticProps and getServerSideProps
    !(__N_SSG || __N_SSP) ? {
      url: createUrl(router)
    } : {}));
  }

}

exports.default = App;
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
var warnContainer;
var warnUrl;

if (false) {} // @deprecated noop for now until removal


function Container(p) {
  if (false) {}
  return p.children;
}

function createUrl(router) {
  // This is to make sure we don't references the router object at call time
  var {
    pathname,
    asPath,
    query
  } = router;
  return {
    get query() {
      if (false) {}
      return query;
    },

    get pathname() {
      if (false) {}
      return pathname;
    },

    get asPath() {
      if (false) {}
      return asPath;
    },

    back: () => {
      if (false) {}
      router.back();
    },
    push: (url, as) => {
      if (false) {}
      return router.push(url, as);
    },
    pushTo: (href, as) => {
      if (false) {}
      var pushRoute = as ? href : '';
      var pushUrl = as || href;
      return router.push(pushRoute, pushUrl);
    },
    replace: (url, as) => {
      if (false) {}
      return router.replace(url, as);
    },
    replaceTo: (href, as) => {
      if (false) {}
      var replaceRoute = as ? href : '';
      var replaceUrl = as || href;
      return router.replace(replaceRoute, replaceUrl);
    }
  };
}

/***/ }),

/***/ "Dtiu":
/***/ (function(module, exports) {

module.exports = require("styled-components");

/***/ }),

/***/ "TqRt":
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "cDcd":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "hUgY":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ _app_MyApp; });

// EXTERNAL MODULE: ./node_modules/next/app.js
var app = __webpack_require__("8Bbg");
var app_default = /*#__PURE__*/__webpack_require__.n(app);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__("cDcd");
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__("Dtiu");

// CONCATENATED MODULE: ./src/styles/theme.ts


const fonts = {
  sans: "'Bebas Neue', cursive, Helvetica, Arial, sans-serif",
  mono: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace"
};
const fontWeights = {
  bold: 700,
  medium: 500,
  regular: 400
};
const colors = {
  primary: "#8a3af4",
  secondary: "#000",
  tertiary: "#2AA1A1",
  textPrimary: "#fff",
  textSecondary: "#999",
  textTertiary: "#666",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3",
  success: "#4caf50"
};
const h1 = Object(external_styled_components_["css"])(["font-family:", ";font-size:10vw;font-weight:normal;line-height:0.9em;color:", ";"], fonts.sans, colors.textPrimary);
const h2 = Object(external_styled_components_["css"])(["font-family:", ";font-size:48px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
const h3 = Object(external_styled_components_["css"])(["font-family:", ";font-size:36px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
const h4 = Object(external_styled_components_["css"])(["font-family:", ";font-size:24px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
const h5 = Object(external_styled_components_["css"])(["font-family:", ";font-size:18px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
const h6 = Object(external_styled_components_["css"])(["font-family:", ";font-size:16px;font-weight:normal;line-height:1em;color:", ";"], fonts.sans, colors.textPrimary);
const theme_button = Object(external_styled_components_["css"])(["font-family:", ";font-size:14px;font-weight:", ";"], fonts.sans, fontWeights.medium);
const body = Object(external_styled_components_["css"])(["font-family:", ";font-size:18px;font-weight:", ";"], fonts.sans, fontWeights.regular);
const caption = Object(external_styled_components_["css"])(["font-family:", ";font-size:14px;font-weight:", ";"], fonts.sans, fontWeights.regular);
const mono = Object(external_styled_components_["css"])(["font-family:", ";font-size:14px;font-weight:", ";"], fonts.mono, fontWeights.regular);
const theme_theme = {
  fonts,
  fontWeights,
  colors,
  typography: {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    body,
    caption,
    button: theme_button,
    mono
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
const GlobalStyle = external_styled_components_["createGlobalStyle"]`
  ::selection {
    background: #8a3af4; /* WebKit/Blink Browsers */
  }
  ::-moz-selection {
    background: #8a3af4; /* Gecko Browsers */
  }

  ${({
  theme
}) => Object(external_styled_components_["css"])(["*{padding:0;margin:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}html,body,#__next{height:100%;min-width:320px;}body{background:#1b1b1b;color:", ";", ";cursor:default;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-text-size-adjust:none;}strong{font-weight:", ";}a{color:", ";text-decoration:none;transition:color ", "s;&:hover{color:", ";}}button{cursor:pointer;}"], theme.colors.textPrimary, theme.typography.body, theme.fontWeights.bold, theme.colors.textSecondary, theme.transition.fast, theme.colors.textPrimary)}
`;
// CONCATENATED MODULE: ./src/pages/_app.tsx
var __jsx = external_react_default.a.createElement;




class _app_MyApp extends app_default.a {
  render() {
    const {
      Component,
      pageProps
    } = this.props;
    return __jsx(external_styled_components_["ThemeProvider"], {
      theme: theme_theme
    }, __jsx(GlobalStyle, null), __jsx(Component, pageProps));
  }

}

/***/ }),

/***/ "kYf9":
/***/ (function(module, exports) {

module.exports = require("next/dist/next-server/lib/utils.js");

/***/ })

/******/ });