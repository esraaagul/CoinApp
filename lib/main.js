"use strict";

var _react = require("react");
var _client = require("react-dom/client");
var _reactQuery = require("@tanstack/react-query");
var _App = _interopRequireDefault(require("./App.tsx"));
require("./styles/index.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Creating the QueryClient
var queryClient = new _reactQuery.QueryClient();
(0, _client.createRoot)(document.getElementById("root")).render(<_react.StrictMode>
    <_reactQuery.QueryClientProvider client={queryClient}>
      <_App.default />
    </_reactQuery.QueryClientProvider>
  </_react.StrictMode>);
//# sourceMappingURL=main.js.map