"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/socket/io";
exports.ids = ["pages/api/socket/io"];
exports.modules = {

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "(api)/./pages/api/socket/io.ts":
/*!********************************!*\
  !*** ./pages/api/socket/io.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! socket.io */ \"socket.io\");\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_0__);\n\nconst config = {\n    api: {\n        bodyParser: false\n    }\n};\nconst ioHandler = (req, res)=>{\n    if (!res.socket.server.io) {\n        const path = \"/api/socket/io\";\n        const httpServer = res.socket.server;\n        const io = new socket_io__WEBPACK_IMPORTED_MODULE_0__.Server(httpServer, {\n            path: path,\n            // @ts-ignore\n            addTrailingSlash: false\n        });\n        res.socket.server.io = io;\n    }\n    res.end();\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ioHandler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvc29ja2V0L2lvLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFK0M7QUFJeEMsTUFBTUUsU0FBUztJQUNwQkMsS0FBSztRQUNIQyxZQUFZO0lBQ2Q7QUFDRixFQUFFO0FBRUYsTUFBTUMsWUFBWSxDQUFDQyxLQUFxQkM7SUFDdEMsSUFBSSxDQUFDQSxJQUFJQyxNQUFNLENBQUNDLE1BQU0sQ0FBQ0MsRUFBRSxFQUFFO1FBQ3pCLE1BQU1DLE9BQU87UUFDYixNQUFNQyxhQUF3QkwsSUFBSUMsTUFBTSxDQUFDQyxNQUFNO1FBQy9DLE1BQU1DLEtBQUssSUFBSVQsNkNBQVFBLENBQUNXLFlBQVk7WUFDbENELE1BQU1BO1lBQ04sYUFBYTtZQUNiRSxrQkFBa0I7UUFDcEI7UUFDQU4sSUFBSUMsTUFBTSxDQUFDQyxNQUFNLENBQUNDLEVBQUUsR0FBR0E7SUFDekI7SUFFQUgsSUFBSU8sR0FBRztBQUNUO0FBRUEsaUVBQWVULFNBQVNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kaXNjb3JkLWNsb25lLy4vcGFnZXMvYXBpL3NvY2tldC9pby50cz9kOTNlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlcnZlciBhcyBOZXRTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xyXG5pbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCB9IGZyb20gXCJuZXh0XCI7XHJcbmltcG9ydCB7IFNlcnZlciBhcyBTZXJ2ZXJJTyB9IGZyb20gXCJzb2NrZXQuaW9cIjtcclxuXHJcbmltcG9ydCB7IE5leHRBcGlSZXNwb25zZVNlcnZlcklvIH0gZnJvbSBcIkAvdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XHJcbiAgYXBpOiB7XHJcbiAgICBib2R5UGFyc2VyOiBmYWxzZSxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgaW9IYW5kbGVyID0gKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlU2VydmVySW8pID0+IHtcclxuICBpZiAoIXJlcy5zb2NrZXQuc2VydmVyLmlvKSB7XHJcbiAgICBjb25zdCBwYXRoID0gXCIvYXBpL3NvY2tldC9pb1wiO1xyXG4gICAgY29uc3QgaHR0cFNlcnZlcjogTmV0U2VydmVyID0gcmVzLnNvY2tldC5zZXJ2ZXIgYXMgYW55O1xyXG4gICAgY29uc3QgaW8gPSBuZXcgU2VydmVySU8oaHR0cFNlcnZlciwge1xyXG4gICAgICBwYXRoOiBwYXRoLFxyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIGFkZFRyYWlsaW5nU2xhc2g6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICByZXMuc29ja2V0LnNlcnZlci5pbyA9IGlvO1xyXG4gIH1cclxuXHJcbiAgcmVzLmVuZCgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpb0hhbmRsZXI7XHJcbiJdLCJuYW1lcyI6WyJTZXJ2ZXIiLCJTZXJ2ZXJJTyIsImNvbmZpZyIsImFwaSIsImJvZHlQYXJzZXIiLCJpb0hhbmRsZXIiLCJyZXEiLCJyZXMiLCJzb2NrZXQiLCJzZXJ2ZXIiLCJpbyIsInBhdGgiLCJodHRwU2VydmVyIiwiYWRkVHJhaWxpbmdTbGFzaCIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/socket/io.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/socket/io.ts"));
module.exports = __webpack_exports__;

})();