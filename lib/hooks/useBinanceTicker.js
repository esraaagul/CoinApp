"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = require("react");
var _lodash = require("lodash");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * A custom React hook that establishes a WebSocket connection to Binance's ticker stream
 * and returns the latest prices for a list of specified cryptocurrency symbols.
 *
 * @param {string[]} symbols - An array of cryptocurrency symbols to track (e.g., ['BTCUSDT', 'ETHUSDT']).
 * @returns {Object<string, number>} An object where the keys are the symbols and the values are the latest prices.
 */
var useBinanceTicker = function useBinanceTicker(symbols) {
  var _useState = (0, _react.useState)({}),
    _useState2 = _slicedToArray(_useState, 2),
    prices = _useState2[0],
    setPrices = _useState2[1];

  /**
   * Creates a WebSocket connection to the specified URL and handles incoming messages
   * to update the cryptocurrency prices.
   *
   * @param {string} url - The WebSocket URL to connect to.
   * @returns {WebSocket} The created WebSocket instance.
   */
  var createWebSocket = function createWebSocket(url) {
    var ws = new WebSocket(url);
    ws.onopen = function () {
      console.log("WebSocket connection established.");
    };

    /**
     * Handles incoming WebSocket messages with debounce to prevent excessive updates.
     *
     * @param {MessageEvent} event - The WebSocket message event.
     */
    var handleWebSocketMessage = (0, _lodash.debounce)(function (event) {
      var message = JSON.parse(event.data);
      var data = message.data;
      var symbol = data.s; // Symbol name
      var price = parseFloat(data.c); // Current price

      setPrices(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, symbol, price));
      });
    }, 60000); // Debounce interval: 60 seconds

    ws.onmessage = handleWebSocketMessage;
    ws.onerror = function (error) {
      console.error("WebSocket error:", error);
      ws.close();
    };
    ws.onclose = function () {
      console.warn("WebSocket connection closed. Reconnecting...");
      reconnect(url);
    };
    return ws;
  };

  /**
   * Reconnects to the WebSocket server after a specified delay.
   *
   * @param {string} url - The WebSocket URL to reconnect to.
   * @param {number} [delay=5000] - The delay in milliseconds before attempting to reconnect.
   */
  var reconnect = function reconnect(url) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
    setTimeout(function () {
      createWebSocket(url);
    }, delay);
  };
  (0, _react.useEffect)(function () {
    if (symbols.length === 0) {
      return;
    }
    var streams = symbols.map(function (sym) {
      return "".concat(sym.toLowerCase(), "@ticker");
    }).join("/");
    var wsUrl = "wss://stream.binance.com:9443/stream?streams=".concat(streams);
    var ws = createWebSocket(wsUrl);
    return function () {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols]);
  return prices;
};
var _default = exports["default"] = useBinanceTicker;
//# sourceMappingURL=useBinanceTicker.js.map