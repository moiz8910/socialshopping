exports.id = 4056;
exports.ids = [4056];
exports.modules = {

/***/ 60324:
/***/ ((module) => {

"use strict";

module.exports = asPromise;
/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */ /**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */ function asPromise(fn, ctx /*, varargs */ ) {
    var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
    while(index < arguments.length)params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err /*, varargs */ ) {
            if (pending) {
                pending = false;
                if (err) reject(err);
                else {
                    var params = new Array(arguments.length - 1), offset = 0;
                    while(offset < params.length)params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}


/***/ }),

/***/ 88557:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */ var base64 = exports;
/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */ base64.length = function length(string) {
    var p = string.length;
    if (!p) return 0;
    var n = 0;
    while(--p % 4 > 1 && string.charAt(p) === "=")++n;
    return Math.ceil(string.length * 3) / 4 - n;
};
// Base64 encoding table
var b64 = new Array(64);
// Base64 decoding table
var s64 = new Array(123);
// 65..90, 97..122, 48..57, 43, 47
for(var i = 0; i < 64;)s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */ base64.encode = function encode(buffer, start, end) {
    var parts = null, chunk = [];
    var i = 0, j = 0, t; // temporary
    while(start < end){
        var b = buffer[start++];
        switch(j){
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1) chunk[i++] = 61;
    }
    if (parts) {
        if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};
var invalidEncoding = "invalid encoding";
/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */ base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, t; // temporary
    for(var i = 0; i < string.length;){
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1) break;
        if ((c = s64[c]) === undefined) throw Error(invalidEncoding);
        switch(j){
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1) throw Error(invalidEncoding);
    return offset - start;
};
/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */ base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),

/***/ 92059:
/***/ ((module) => {

"use strict";

module.exports = EventEmitter;
/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */ function EventEmitter() {
    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */ this._listeners = {};
}
/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */ EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn: fn,
        ctx: ctx || this
    });
    return this;
};
/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */ EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined) this._listeners = {};
    else {
        if (fn === undefined) this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for(var i = 0; i < listeners.length;)if (listeners[i].fn === fn) listeners.splice(i, 1);
            else ++i;
        }
    }
    return this;
};
/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */ EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [], i = 1;
        for(; i < arguments.length;)args.push(arguments[i++]);
        for(i = 0; i < listeners.length;)listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};


/***/ }),

/***/ 64855:
/***/ ((module) => {

"use strict";

module.exports = factory(factory);
/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */ /**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ /**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ /**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ /**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ // Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {
    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([
            -0
        ]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }
        /* istanbul ignore next */ exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */ exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }
        /* istanbul ignore next */ exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */ exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
    // float: ieee754
    })();
    else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign) val = -val;
            if (val === 0) writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val)) writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }
        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 // denormal
             ? sign * 1.401298464324817e-45 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
    })();
    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([
            -0
        ]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }
        /* istanbul ignore next */ exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */ exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }
        /* istanbul ignore next */ exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */ exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
    // double: ieee754
    })();
    else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign) val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) {
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) {
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024) exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }
        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 // denormal
             ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
    })();
    return exports;
}
// uint helpers
function writeUintLE(val, buf, pos) {
    buf[pos] = val & 255;
    buf[pos + 1] = val >>> 8 & 255;
    buf[pos + 2] = val >>> 16 & 255;
    buf[pos + 3] = val >>> 24;
}
function writeUintBE(val, buf, pos) {
    buf[pos] = val >>> 24;
    buf[pos + 1] = val >>> 16 & 255;
    buf[pos + 2] = val >>> 8 & 255;
    buf[pos + 3] = val & 255;
}
function readUintLE(buf, pos) {
    return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
}
function readUintBE(buf, pos) {
    return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
}


/***/ }),

/***/ 99236:
/***/ ((module) => {

"use strict";

module.exports = inquire;
/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */ function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length)) return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}


/***/ }),

/***/ 12821:
/***/ ((module) => {

"use strict";

module.exports = pool;
/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */ /**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */ /**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */ function pool(alloc, slice, size) {
    var SIZE = size || 8192;
    var MAX = SIZE >>> 1;
    var slab = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX) return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) offset = (offset | 7) + 1;
        return buf;
    };
}


/***/ }),

/***/ 53566:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */ var utf8 = exports;
/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */ utf8.length = function utf8_length(string) {
    var len = 0, c = 0;
    for(var i = 0; i < string.length; ++i){
        c = string.charCodeAt(i);
        if (c < 128) len += 1;
        else if (c < 2048) len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else len += 3;
    }
    return len;
};
/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */ utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1) return "";
    var parts = null, chunk = [], i = 0, t; // temporary
    while(start < end){
        t = buffer[start++];
        if (t < 128) chunk[i++] = t;
        else if (t > 191 && t < 224) chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};
/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */ utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset, c1, c2; // character 2
    for(var i = 0; i < string.length; ++i){
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),

/***/ 39805:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = {
    parallel: __webpack_require__(11629),
    serial: __webpack_require__(15390),
    serialOrdered: __webpack_require__(33516)
};


/***/ }),

/***/ 24940:
/***/ ((module) => {

"use strict";
// API

module.exports = abort;
/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */ function abort(state) {
    Object.keys(state.jobs).forEach(clean.bind(state));
    // reset leftover jobs
    state.jobs = {};
}
/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */ function clean(key) {
    if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
    }
}


/***/ }),

/***/ 96794:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defer = __webpack_require__(78729);
// API
module.exports = async;
/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */ function async(callback) {
    var isAsync = false;
    // check if async happened
    defer(function() {
        isAsync = true;
    });
    return function async_callback(err, result) {
        if (isAsync) {
            callback(err, result);
        } else {
            defer(function nextTick_callback() {
                callback(err, result);
            });
        }
    };
}


/***/ }),

/***/ 78729:
/***/ ((module) => {

"use strict";

module.exports = defer;
/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */ function defer(fn) {
    var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
    if (nextTick) {
        nextTick(fn);
    } else {
        setTimeout(fn, 0);
    }
}


/***/ }),

/***/ 21781:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var async = __webpack_require__(96794), abort = __webpack_require__(24940);
// API
module.exports = iterate;
/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */ function iterate(list, iterator, state, callback) {
    // store current index
    var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
    state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        // don't repeat yourself
        // skip secondary callbacks
        if (!(key in state.jobs)) {
            return;
        }
        // clean up jobs
        delete state.jobs[key];
        if (error) {
            // don't process rest of the results
            // stop still active jobs
            // and reset the list
            abort(state);
        } else {
            state.results[key] = output;
        }
        // return salvaged results
        callback(error, state.results);
    });
}
/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */ function runJob(iterator, key, item, callback) {
    var aborter;
    // allow shortcut if iterator expects only two arguments
    if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
    } else {
        aborter = iterator(item, key, async(callback));
    }
    return aborter;
}


/***/ }),

/***/ 54047:
/***/ ((module) => {

"use strict";
// API

module.exports = state;
/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */ function state(list, sortMethod) {
    var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
    };
    if (sortMethod) {
        // sort array keys based on it's values
        // sort object's keys just on own merit
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
            return sortMethod(list[a], list[b]);
        });
    }
    return initState;
}


/***/ }),

/***/ 7514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var abort = __webpack_require__(24940), async = __webpack_require__(96794);
// API
module.exports = terminator;
/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */ function terminator(callback) {
    if (!Object.keys(this.jobs).length) {
        return;
    }
    // fast forward iteration index
    this.index = this.size;
    // abort jobs
    abort(this);
    // send back results we have so far
    async(callback)(null, this.results);
}


/***/ }),

/***/ 11629:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var iterate = __webpack_require__(21781), initState = __webpack_require__(54047), terminator = __webpack_require__(7514);
// Public API
module.exports = parallel;
/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function parallel(list, iterator, callback) {
    var state = initState(list);
    while(state.index < (state["keyedList"] || list).length){
        iterate(list, iterator, state, function(error, result) {
            if (error) {
                callback(error, result);
                return;
            }
            // looks like it's the last one
            if (Object.keys(state.jobs).length === 0) {
                callback(null, state.results);
                return;
            }
        });
        state.index++;
    }
    return terminator.bind(state, callback);
}


/***/ }),

/***/ 15390:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var serialOrdered = __webpack_require__(33516);
// Public API
module.exports = serial;
/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serial(list, iterator, callback) {
    return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 33516:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var iterate = __webpack_require__(21781), initState = __webpack_require__(54047), terminator = __webpack_require__(7514);
// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending = ascending;
module.exports.descending = descending;
/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serialOrdered(list, iterator, sortMethod, callback) {
    var state = initState(list, sortMethod);
    iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
            callback(error, result);
            return;
        }
        state.index++;
        // are we there yet?
        if (state.index < (state["keyedList"] || list).length) {
            iterate(list, iterator, state, iteratorHandler);
            return;
        }
        // done here
        callback(null, state.results);
    });
    return terminator.bind(state, callback);
}
/*
 * -- Sort methods
 */ /**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function descending(a, b) {
    return -1 * ascending(a, b);
}


/***/ }),

/***/ 69614:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var CombinedStream = __webpack_require__(25139);
var util = __webpack_require__(73837);
var path = __webpack_require__(71017);
var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var parseUrl = (__webpack_require__(57310).parse);
var fs = __webpack_require__(57147);
var Stream = (__webpack_require__(12781).Stream);
var mime = __webpack_require__(66899);
var asynckit = __webpack_require__(39805);
var populate = __webpack_require__(15903);
// Public API
module.exports = FormData;
// make it a Stream
util.inherits(FormData, CombinedStream);
/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */ function FormData(options) {
    if (!(this instanceof FormData)) {
        return new FormData(options);
    }
    this._overheadLength = 0;
    this._valueLength = 0;
    this._valuesToMeasure = [];
    CombinedStream.call(this);
    options = options || {};
    for(var option in options){
        this[option] = options[option];
    }
}
FormData.LINE_BREAK = "\r\n";
FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
FormData.prototype.append = function(field, value, options) {
    options = options || {};
    // allow filename as single option
    if (typeof options == "string") {
        options = {
            filename: options
        };
    }
    var append = CombinedStream.prototype.append.bind(this);
    // all that streamy business can't handle numbers
    if (typeof value == "number") {
        value = "" + value;
    }
    // https://github.com/felixge/node-form-data/issues/38
    if (util.isArray(value)) {
        // Please convert your array into string
        // the way web server expects it
        this._error(new Error("Arrays are not supported."));
        return;
    }
    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();
    append(header);
    append(value);
    append(footer);
    // pass along options.knownLength
    this._trackLength(header, value, options);
};
FormData.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;
    // used w/ getLengthSync(), when length is known.
    // e.g. for streaming directly from a remote server,
    // w/ a known file a size, and not wanting to wait for
    // incoming file to finish to get its size.
    if (options.knownLength != null) {
        valueLength += +options.knownLength;
    } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
    } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
    }
    this._valueLength += valueLength;
    // @check why add CRLF? does this account for custom/multiple CRLFs?
    this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
    // empty or either doesn't have path or not an http response or not a stream
    if (!value || !value.path && !(value.readable && value.hasOwnProperty("httpVersion")) && !(value instanceof Stream)) {
        return;
    }
    // no need to bother with the length
    if (!options.knownLength) {
        this._valuesToMeasure.push(value);
    }
};
FormData.prototype._lengthRetriever = function(value, callback) {
    if (value.hasOwnProperty("fd")) {
        // take read range into a account
        // `end` = Infinity –> read file till the end
        //
        // TODO: Looks like there is bug in Node fs.createReadStream
        // it doesn't respect `end` options without `start` options
        // Fix it when node fixes it.
        // https://github.com/joyent/node/issues/7819
        if (value.end != undefined && value.end != Infinity && value.start != undefined) {
            // when end specified
            // no need to calculate range
            // inclusive, starts with 0
            callback(null, value.end + 1 - (value.start ? value.start : 0));
        // not that fast snoopy
        } else {
            // still need to fetch file size from fs
            fs.stat(value.path, function(err, stat) {
                var fileSize;
                if (err) {
                    callback(err);
                    return;
                }
                // update final size based on the range options
                fileSize = stat.size - (value.start ? value.start : 0);
                callback(null, fileSize);
            });
        }
    // or http response
    } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
    // or request stream http://github.com/mikeal/request
    } else if (value.hasOwnProperty("httpModule")) {
        // wait till response come back
        value.on("response", function(response) {
            value.pause();
            callback(null, +response.headers["content-length"]);
        });
        value.resume();
    // something else
    } else {
        callback("Unknown stream");
    }
};
FormData.prototype._multiPartHeader = function(field, value, options) {
    // custom header specified (as string)?
    // it becomes responsible for boundary
    // (e.g. to handle extra CRLFs on .NET servers)
    if (typeof options.header == "string") {
        return options.header;
    }
    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);
    var contents = "";
    var headers = {
        // add custom disposition as third element or keep it two elements if not
        "Content-Disposition": [
            "form-data",
            'name="' + field + '"'
        ].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        "Content-Type": [].concat(contentType || [])
    };
    // allow custom headers.
    if (typeof options.header == "object") {
        populate(headers, options.header);
    }
    var header;
    for(var prop in headers){
        if (!headers.hasOwnProperty(prop)) continue;
        header = headers[prop];
        // skip nullish headers.
        if (header == null) {
            continue;
        }
        // convert all headers to arrays.
        if (!Array.isArray(header)) {
            header = [
                header
            ];
        }
        // add non-empty headers.
        if (header.length) {
            contents += prop + ": " + header.join("; ") + FormData.LINE_BREAK;
        }
    }
    return "--" + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};
FormData.prototype._getContentDisposition = function(value, options) {
    var filename, contentDisposition;
    if (typeof options.filepath === "string") {
        // custom filepath for relative paths
        filename = path.normalize(options.filepath).replace(/\\/g, "/");
    } else if (options.filename || value.name || value.path) {
        // custom filename take precedence
        // formidable and the browser add a name property
        // fs- and request- streams have path property
        filename = path.basename(options.filename || value.name || value.path);
    } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        // or try http response
        filename = path.basename(value.client._httpMessage.path || "");
    }
    if (filename) {
        contentDisposition = 'filename="' + filename + '"';
    }
    return contentDisposition;
};
FormData.prototype._getContentType = function(value, options) {
    // use custom content-type above all
    var contentType = options.contentType;
    // or try `name` from formidable, browser
    if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
    }
    // or try `path` from fs-, request- streams
    if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
    }
    // or if it's http-reponse
    if (!contentType && value.readable && value.hasOwnProperty("httpVersion")) {
        contentType = value.headers["content-type"];
    }
    // or guess it from the filepath or filename
    if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
    }
    // fallback to the default content type if `value` is not simple value
    if (!contentType && typeof value == "object") {
        contentType = FormData.DEFAULT_CONTENT_TYPE;
    }
    return contentType;
};
FormData.prototype._multiPartFooter = function() {
    return (function(next) {
        var footer = FormData.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
            footer += this._lastBoundary();
        }
        next(footer);
    }).bind(this);
};
FormData.prototype._lastBoundary = function() {
    return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK;
};
FormData.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
    };
    for(header in userHeaders){
        if (userHeaders.hasOwnProperty(header)) {
            formHeaders[header.toLowerCase()] = userHeaders[header];
        }
    }
    return formHeaders;
};
FormData.prototype.setBoundary = function(boundary) {
    this._boundary = boundary;
};
FormData.prototype.getBoundary = function() {
    if (!this._boundary) {
        this._generateBoundary();
    }
    return this._boundary;
};
FormData.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc(0);
    var boundary = this.getBoundary();
    // Create the form content. Add Line breaks to the end of data.
    for(var i = 0, len = this._streams.length; i < len; i++){
        if (typeof this._streams[i] !== "function") {
            // Add content to the buffer.
            if (Buffer.isBuffer(this._streams[i])) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    this._streams[i]
                ]);
            } else {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(this._streams[i])
                ]);
            }
            // Add break after content.
            if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(FormData.LINE_BREAK)
                ]);
            }
        }
    }
    // Add the footer and return the Buffer object.
    return Buffer.concat([
        dataBuffer,
        Buffer.from(this._lastBoundary())
    ]);
};
FormData.prototype._generateBoundary = function() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    var boundary = "--------------------------";
    for(var i = 0; i < 24; i++){
        boundary += Math.floor(Math.random() * 10).toString(16);
    }
    this._boundary = boundary;
};
// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;
    // Don't get confused, there are 3 "internal" streams for each keyval pair
    // so it basically checks if there is any value added to the form
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    // https://github.com/form-data/form-data/issues/40
    if (!this.hasKnownLength()) {
        // Some async length retrievers are present
        // therefore synchronous length calculation is false.
        // Please use getLength(callback) to get proper length
        this._error(new Error("Cannot calculate proper length in synchronous way."));
    }
    return knownLength;
};
// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
    var hasKnownLength = true;
    if (this._valuesToMeasure.length) {
        hasKnownLength = false;
    }
    return hasKnownLength;
};
FormData.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
    }
    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
            cb(err);
            return;
        }
        values.forEach(function(length) {
            knownLength += length;
        });
        cb(null, knownLength);
    });
};
FormData.prototype.submit = function(params, cb) {
    var request, options, defaults = {
        method: "post"
    };
    // parse provided url if it's string
    // or treat it as options object
    if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            protocol: params.protocol
        }, defaults);
    // use custom params
    } else {
        options = populate(params, defaults);
        // if no port provided use default one
        if (!options.port) {
            options.port = options.protocol == "https:" ? 443 : 80;
        }
    }
    // put that good code in getHeaders to some use
    options.headers = this.getHeaders(params.headers);
    // https if specified, fallback to http in any other case
    if (options.protocol == "https:") {
        request = https.request(options);
    } else {
        request = http.request(options);
    }
    // get content length and fire away
    this.getLength((function(err, length) {
        if (err && err !== "Unknown stream") {
            this._error(err);
            return;
        }
        // add content length
        if (length) {
            request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
            var onResponse;
            var callback = function(error, responce) {
                request.removeListener("error", callback);
                request.removeListener("response", onResponse);
                return cb.call(this, error, responce);
            };
            onResponse = callback.bind(this, null);
            request.on("error", callback);
            request.on("response", onResponse);
        }
    }).bind(this));
    return request;
};
FormData.prototype._error = function(err) {
    if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
    }
};
FormData.prototype.toString = function() {
    return "[object FormData]";
};


/***/ }),

/***/ 15903:
/***/ ((module) => {

"use strict";
// populates missing values

module.exports = function(dst, src) {
    Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
    });
    return dst;
};


/***/ }),

/***/ 93038:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*jshint node:true */ 
var Buffer = (__webpack_require__(14300).Buffer); // browserify
var SlowBuffer = (__webpack_require__(14300).SlowBuffer);
module.exports = bufferEq;
function bufferEq(a, b) {
    // shortcutting on type is necessary for correctness
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        return false;
    }
    // buffer sizes should be well-known information, so despite this
    // shortcutting, it doesn't leak any information about the *contents* of the
    // buffers.
    if (a.length !== b.length) {
        return false;
    }
    var c = 0;
    for(var i = 0; i < a.length; i++){
        /*jshint bitwise:false */ c |= a[i] ^ b[i]; // XOR
    }
    return c === 0;
}
bufferEq.install = function() {
    Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
    };
};
var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
    Buffer.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
};


/***/ }),

/***/ 25139:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(73837);
var Stream = (__webpack_require__(12781).Stream);
var DelayedStream = __webpack_require__(51608);
module.exports = CombinedStream;
function CombinedStream() {
    this.writable = false;
    this.readable = true;
    this.dataSize = 0;
    this.maxDataSize = 2 * 1024 * 1024;
    this.pauseStreams = true;
    this._released = false;
    this._streams = [];
    this._currentStream = null;
    this._insideLoop = false;
    this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);
CombinedStream.create = function(options) {
    var combinedStream = new this();
    options = options || {};
    for(var option in options){
        combinedStream[option] = options[option];
    }
    return combinedStream;
};
CombinedStream.isStreamLike = function(stream) {
    return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
};
CombinedStream.prototype.append = function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
            var newStream = DelayedStream.create(stream, {
                maxDataSize: Infinity,
                pauseStream: this.pauseStreams
            });
            stream.on("data", this._checkDataSize.bind(this));
            stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
            stream.pause();
        }
    }
    this._streams.push(stream);
    return this;
};
CombinedStream.prototype.pipe = function(dest, options) {
    Stream.prototype.pipe.call(this, dest, options);
    this.resume();
    return dest;
};
CombinedStream.prototype._getNext = function() {
    this._currentStream = null;
    if (this._insideLoop) {
        this._pendingNext = true;
        return; // defer call
    }
    this._insideLoop = true;
    try {
        do {
            this._pendingNext = false;
            this._realGetNext();
        }while (this._pendingNext);
    } finally{
        this._insideLoop = false;
    }
};
CombinedStream.prototype._realGetNext = function() {
    var stream = this._streams.shift();
    if (typeof stream == "undefined") {
        this.end();
        return;
    }
    if (typeof stream !== "function") {
        this._pipeNext(stream);
        return;
    }
    var getStream = stream;
    getStream((function(stream) {
        var isStreamLike = CombinedStream.isStreamLike(stream);
        if (isStreamLike) {
            stream.on("data", this._checkDataSize.bind(this));
            this._handleErrors(stream);
        }
        this._pipeNext(stream);
    }).bind(this));
};
CombinedStream.prototype._pipeNext = function(stream) {
    this._currentStream = stream;
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        stream.on("end", this._getNext.bind(this));
        stream.pipe(this, {
            end: false
        });
        return;
    }
    var value = stream;
    this.write(value);
    this._getNext();
};
CombinedStream.prototype._handleErrors = function(stream) {
    var self = this;
    stream.on("error", function(err) {
        self._emitError(err);
    });
};
CombinedStream.prototype.write = function(data) {
    this.emit("data", data);
};
CombinedStream.prototype.pause = function() {
    if (!this.pauseStreams) {
        return;
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
    this.emit("pause");
};
CombinedStream.prototype.resume = function() {
    if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
    this.emit("resume");
};
CombinedStream.prototype.end = function() {
    this._reset();
    this.emit("end");
};
CombinedStream.prototype.destroy = function() {
    this._reset();
    this.emit("close");
};
CombinedStream.prototype._reset = function() {
    this.writable = false;
    this._streams = [];
    this._currentStream = null;
};
CombinedStream.prototype._checkDataSize = function() {
    this._updateDataSize();
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(message));
};
CombinedStream.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var self = this;
    this._streams.forEach(function(stream) {
        if (!stream.dataSize) {
            return;
        }
        self.dataSize += stream.dataSize;
    });
    if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
    }
};
CombinedStream.prototype._emitError = function(err) {
    this._reset();
    this.emit("error", err);
};


/***/ }),

/***/ 75737:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* eslint-env browser */ /**
 * This is the web browser implementation of `debug()`.
 */ 
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (()=>{
    let warned = false;
    return ()=>{
        if (!warned) {
            warned = true;
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
    };
})();
/**
 * Colors.
 */ exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */ // eslint-disable-next-line complexity
function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (false) {}
    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
    }
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
     false && (0) || // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
    typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
    if (!this.useColors) {
        return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match)=>{
        if (match === "%%") {
            return;
        }
        index++;
        if (match === "%c") {
            // We only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */ exports.log = console.debug || console.log || (()=>{});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    try {
        if (namespaces) {
            exports.storage.setItem("debug", namespaces);
        } else {
            exports.storage.removeItem("debug");
        }
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    let r;
    try {
        r = exports.storage.getItem("debug");
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
    }
    return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */ function localstorage() {
    try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
module.exports = __webpack_require__(71006)(exports);
const { formatters } = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */ formatters.j = function(v) {
    try {
        return JSON.stringify(v);
    } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
    }
};


/***/ }),

/***/ 71006:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */ 
function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = __webpack_require__(6034);
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key)=>{
        createDebug[key] = env[key];
    });
    /**
	* The currently active debug mode names, and names to skip.
	*/ createDebug.names = [];
    createDebug.skips = [];
    /**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/ createDebug.formatters = {};
    /**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/ function selectColor(namespace) {
        let hash = 0;
        for(let i = 0; i < namespace.length; i++){
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    /**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/ function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
                return;
            }
            const self = debug;
            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== "string") {
                // Anything else let's inspect with %O
                args.unshift("%O");
            }
            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format)=>{
                // If we encounter an escaped % then don't increase the array index
                if (match === "%%") {
                    return "%";
                }
                index++;
                const formatter = createDebug.formatters[format];
                if (typeof formatter === "function") {
                    const val = args[index];
                    match = formatter.call(self, val);
                    // Now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });
            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
        Object.defineProperty(debug, "enabled", {
            enumerable: true,
            configurable: false,
            get: ()=>{
                if (enableOverride !== null) {
                    return enableOverride;
                }
                if (namespacesCache !== createDebug.namespaces) {
                    namespacesCache = createDebug.namespaces;
                    enabledCache = createDebug.enabled(namespace);
                }
                return enabledCache;
            },
            set: (v)=>{
                enableOverride = v;
            }
        });
        // Env-specific initialization logic for debug instances
        if (typeof createDebug.init === "function") {
            createDebug.init(debug);
        }
        return debug;
    }
    function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
    }
    /**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/ function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for(i = 0; i < len; i++){
            if (!split[i]) {
                continue;
            }
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
                createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
            } else {
                createDebug.names.push(new RegExp("^" + namespaces + "$"));
            }
        }
    }
    /**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/ function disable() {
        const namespaces = [
            ...createDebug.names.map(toNamespace),
            ...createDebug.skips.map(toNamespace).map((namespace)=>"-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
    }
    /**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/ function enabled(name) {
        if (name[name.length - 1] === "*") {
            return true;
        }
        let i;
        let len;
        for(i = 0, len = createDebug.skips.length; i < len; i++){
            if (createDebug.skips[i].test(name)) {
                return false;
            }
        }
        for(i = 0, len = createDebug.names.length; i < len; i++){
            if (createDebug.names[i].test(name)) {
                return true;
            }
        }
        return false;
    }
    /**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/ function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    /**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/ function coerce(val) {
        if (val instanceof Error) {
            return val.stack || val.message;
        }
        return val;
    }
    /**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/ function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
}
module.exports = setup;


/***/ }),

/***/ 63694:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */ 
if (typeof process === "undefined" || process.type === "renderer" || false === true || process.__nwjs) {
    module.exports = __webpack_require__(75737);
} else {
    module.exports = __webpack_require__(10056);
}


/***/ }),

/***/ 10056:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/**
 * Module dependencies.
 */ 
const tty = __webpack_require__(76224);
const util = __webpack_require__(73837);
/**
 * This is the Node.js implementation of `debug()`.
 */ exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(()=>{}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
/**
 * Colors.
 */ exports.colors = [
    6,
    2,
    3,
    4,
    5,
    1
];
try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = __webpack_require__(12662);
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221
        ];
    }
} catch (error) {
// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */ exports.inspectOpts = Object.keys(process.env).filter((key)=>{
    return /^debug_/i.test(key);
}).reduce((obj, key)=>{
    // Camel-case
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>{
        return k.toUpperCase();
    });
    // Coerce string value into JS value
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
    } else if (val === "null") {
        val = null;
    } else {
        val = Number(val);
    }
    obj[prop] = val;
    return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */ function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = "\x1b[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1b[0m");
    } else {
        args[0] = getDate() + name + " " + args[0];
    }
}
function getDate() {
    if (exports.inspectOpts.hideDate) {
        return "";
    }
    return new Date().toISOString() + " ";
}
/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */ function log(...args) {
    return process.stderr.write(util.format(...args) + "\n");
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    if (namespaces) {
        process.env.DEBUG = namespaces;
    } else {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */ function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for(let i = 0; i < keys.length; i++){
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
}
module.exports = __webpack_require__(71006)(exports);
const { formatters } = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */ formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split("\n").map((str)=>str.trim()).join(" ");
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */ formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 51608:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Stream = (__webpack_require__(12781).Stream);
var util = __webpack_require__(73837);
module.exports = DelayedStream;
function DelayedStream() {
    this.source = null;
    this.dataSize = 0;
    this.maxDataSize = 1024 * 1024;
    this.pauseStream = true;
    this._maxDataSizeExceeded = false;
    this._released = false;
    this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);
DelayedStream.create = function(source, options) {
    var delayedStream = new this();
    options = options || {};
    for(var option in options){
        delayedStream[option] = options[option];
    }
    delayedStream.source = source;
    var realEmit = source.emit;
    source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
    };
    source.on("error", function() {});
    if (delayedStream.pauseStream) {
        source.pause();
    }
    return delayedStream;
};
Object.defineProperty(DelayedStream.prototype, "readable", {
    configurable: true,
    enumerable: true,
    get: function() {
        return this.source.readable;
    }
});
DelayedStream.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
};
DelayedStream.prototype.resume = function() {
    if (!this._released) {
        this.release();
    }
    this.source.resume();
};
DelayedStream.prototype.pause = function() {
    this.source.pause();
};
DelayedStream.prototype.release = function() {
    this._released = true;
    this._bufferedEvents.forEach((function(args) {
        this.emit.apply(this, args);
    }).bind(this));
    this._bufferedEvents = [];
};
DelayedStream.prototype.pipe = function() {
    var r = Stream.prototype.pipe.apply(this, arguments);
    this.resume();
    return r;
};
DelayedStream.prototype._handleEmit = function(args) {
    if (this._released) {
        this.emit.apply(this, args);
        return;
    }
    if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
    }
    this._bufferedEvents.push(args);
};
DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) {
        return;
    }
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    this._maxDataSizeExceeded = true;
    var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(message));
};


/***/ }),

/***/ 91783:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(28569).Buffer);
var getParamBytesForAlg = __webpack_require__(77208);
var MAX_OCTET = 0x80, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 0x20, TAG_SEQ = 0x10, TAG_INT = 0x02, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
function base64Url(base64) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function signatureAsBuffer(signature) {
    if (Buffer.isBuffer(signature)) {
        return signature;
    } else if ("string" === typeof signature) {
        return Buffer.from(signature, "base64");
    }
    throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
}
function derToJose(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    // the DER encoded param should at most be the param size, plus a padding
    // zero, since due to being a signed integer
    var maxEncodedParamLength = paramBytes + 1;
    var inputLength = signature.length;
    var offset = 0;
    if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
    }
    var seqLength = signature[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
    }
    if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    }
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
    }
    var rLength = signature[offset++];
    if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    }
    if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var rOffset = offset;
    offset += rLength;
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
    }
    var sLength = signature[offset++];
    if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    }
    if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    }
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
    var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for(offset = 0; offset < rPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
    offset = paramBytes;
    for(var o = offset; offset < o + sPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
    dst = dst.toString("base64");
    dst = base64Url(dst);
    return dst;
}
function countPadding(buf, start, stop) {
    var padding = 0;
    while(start + padding < stop && buf[start + padding] === 0){
        ++padding;
    }
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
        --padding;
    }
    return padding;
}
function joseToDer(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    }
    var rPadding = countPadding(signature, 0, paramBytes);
    var sPadding = countPadding(signature, paramBytes, signature.length);
    var rLength = paramBytes - rPadding;
    var sLength = paramBytes - sPadding;
    var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    var shortLength = rsBytes < MAX_OCTET;
    var dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
    var offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
        // Bit 8 has value "0"
        // bits 7-1 give the length.
        dst[offset++] = rsBytes;
    } else {
        // Bit 8 of first octet has value "1"
        // bits 7-1 give the number of additional length octets.
        dst[offset++] = MAX_OCTET | 1;
        // length, base 256
        dst[offset++] = rsBytes & 0xff;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
    } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
    } else {
        signature.copy(dst, offset, paramBytes + sPadding);
    }
    return dst;
}
module.exports = {
    derToJose: derToJose,
    joseToDer: joseToDer
};


/***/ }),

/***/ 77208:
/***/ ((module) => {

"use strict";

function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
}
var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
};
function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
        return paramBytes;
    }
    throw new Error('Unknown algorithm "' + alg + '"');
}
module.exports = getParamBytesForAlg;


/***/ }),

/***/ 24686:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var debug;
module.exports = function() {
    if (!debug) {
        try {
            /* eslint global-require: off */ debug = __webpack_require__(63694)("follow-redirects");
        } catch (error) {}
        if (typeof debug !== "function") {
            debug = function() {};
        }
    }
    debug.apply(null, arguments);
};


/***/ }),

/***/ 2725:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var url = __webpack_require__(57310);
var URL = url.URL;
var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var Writable = (__webpack_require__(12781).Writable);
var assert = __webpack_require__(39491);
var debug = __webpack_require__(24686);
// Create handlers that pass events from native requests
var events = [
    "abort",
    "aborted",
    "connect",
    "error",
    "socket",
    "timeout"
];
var eventHandlers = Object.create(null);
events.forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
    };
});
var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
// Error types with codes
var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    // Attach a callback if passed
    if (responseCallback) {
        this.on("response", responseCallback);
    }
    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function(response) {
        self._processResponse(response);
    };
    // Perform the first request
    this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
    abortRequest(this._currentRequest);
    this.emit("abort");
};
// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function(data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
        throw new WriteAfterEndError();
    }
    // Validate input and shift parameters if necessary
    if (!isString(data) && !isBuffer(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
        if (callback) {
            callback();
        }
        return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({
            data: data,
            encoding: encoding
        });
        this._currentRequest.write(data, encoding, callback);
    } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
    }
};
// Ends the current native request
RedirectableRequest.prototype.end = function(data, encoding, callback) {
    // Shift parameters if necessary
    if (isFunction(data)) {
        callback = data;
        data = encoding = null;
    } else if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Write data if needed and end
    if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
    } else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
            self._ended = true;
            currentRequest.end(null, null, callback);
        });
        this._ending = true;
    }
};
// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
};
// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
};
// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self = this;
    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
    }
    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
        if (self._timeout) {
            clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function() {
            self.emit("timeout");
            clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
    }
    // Stops a timeout from triggering
    function clearTimer() {
        // Clear the timeout
        if (self._timeout) {
            clearTimeout(self._timeout);
            self._timeout = null;
        }
        // Clean up all attached listeners
        self.removeListener("abort", clearTimer);
        self.removeListener("error", clearTimer);
        self.removeListener("response", clearTimer);
        if (callback) {
            self.removeListener("timeout", callback);
        }
        if (!self.socket) {
            self._currentRequest.removeListener("socket", startTimer);
        }
    }
    // Attach callback if passed
    if (callback) {
        this.on("timeout", callback);
    }
    // Start the timer if or when the socket is opened
    if (this.socket) {
        startTimer(this.socket);
    } else {
        this._currentRequest.once("socket", startTimer);
    }
    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);
    return this;
};
// Proxy all other public ClientRequest methods
[
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
    };
});
// Proxy all public ClientRequest properties
[
    "aborted",
    "connection",
    "socket"
].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
            return this._currentRequest[property];
        }
    });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
    // Ensure headers are always present
    if (!options.headers) {
        options.headers = {};
    }
    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
        // Use hostname if set, because it has precedence
        if (!options.hostname) {
            options.hostname = options.host;
        }
        delete options.host;
    }
    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
            options.pathname = options.path;
        } else {
            options.pathname = options.path.substring(0, searchPos);
            options.search = options.path.substring(searchPos);
        }
    }
};
// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function() {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
        this.emit("error", new TypeError("Unsupported protocol " + protocol));
        return;
    }
    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
    }
    // Create the native request and set up its event handlers
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events){
        request.on(event, eventHandlers[event]);
    }
    // RFC7230§5.3.1: When making a request directly to an origin server, […]
    // a client MUST send only the absolute path […] as the request-target.
    this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;
    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
        // Write the request entity and end
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
            // Only write if this request has not been redirected yet
            /* istanbul ignore else */ if (request === self._currentRequest) {
                // Report any write errors
                /* istanbul ignore if */ if (error) {
                    self.emit("error", error);
                } else if (i < buffers.length) {
                    var buffer = buffers[i++];
                    /* istanbul ignore else */ if (!request.finished) {
                        request.write(buffer.data, buffer.encoding, writeNext);
                    }
                } else if (self._ended) {
                    request.end();
                }
            }
        })();
    }
};
// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function(response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
        this._redirects.push({
            url: this._currentUrl,
            headers: response.headers,
            statusCode: statusCode
        });
    }
    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    // If the response is not a redirect; return it as-is
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        // Clean up
        this._requestBodyBuffers = [];
        return;
    }
    // The response is a redirect, so abort the current request
    abortRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
    }
    // Store the request headers if applicable
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
        requestHeaders = Object.assign({
            // The Host header was set by nativeProtocol.request
            Host: response.req.getHeader("host")
        }, this._options.headers);
    }
    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
    }
    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = url.parse(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, {
        host: currentHost
    }));
    // Determine the URL of the redirection
    var redirectUrl;
    try {
        redirectUrl = url.resolve(currentUrl, location);
    } catch (cause) {
        this.emit("error", new RedirectionError({
            cause: cause
        }));
        return;
    }
    // Create the redirected request
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);
    // Drop confidential headers when redirecting to a less secure protocol
    // or to a different domain that is not a superdomain
    if (redirectUrlParts.protocol !== currentUrlParts.protocol && redirectUrlParts.protocol !== "https:" || redirectUrlParts.host !== currentHost && !isSubdomain(redirectUrlParts.host, currentHost)) {
        removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
    }
    // Evaluate the beforeRedirect callback
    if (isFunction(beforeRedirect)) {
        var responseDetails = {
            headers: response.headers,
            statusCode: statusCode
        };
        var requestDetails = {
            url: currentUrl,
            method: method,
            headers: requestHeaders
        };
        try {
            beforeRedirect(this._options, responseDetails, requestDetails);
        } catch (err) {
            this.emit("error", err);
            return;
        }
        this._sanitizeOptions(this._options);
    }
    // Perform the redirected request
    try {
        this._performRequest();
    } catch (cause) {
        this.emit("error", new RedirectionError({
            cause: cause
        }));
    }
};
// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
    // Default settings
    var exports = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
    };
    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
        // Executes a request, following redirects
        function request(input, options, callback) {
            // Parse parameters
            if (isString(input)) {
                var parsed;
                try {
                    parsed = urlToOptions(new URL(input));
                } catch (err) {
                    /* istanbul ignore next */ parsed = url.parse(input);
                }
                if (!isString(parsed.protocol)) {
                    throw new InvalidUrlError({
                        input
                    });
                }
                input = parsed;
            } else if (URL && input instanceof URL) {
                input = urlToOptions(input);
            } else {
                callback = options;
                options = input;
                input = {
                    protocol: protocol
                };
            }
            if (isFunction(options)) {
                callback = options;
                options = null;
            }
            // Set defaults
            options = Object.assign({
                maxRedirects: exports.maxRedirects,
                maxBodyLength: exports.maxBodyLength
            }, input, options);
            options.nativeProtocols = nativeProtocols;
            if (!isString(options.host) && !isString(options.hostname)) {
                options.hostname = "::1";
            }
            assert.equal(options.protocol, protocol, "protocol mismatch");
            debug("options", options);
            return new RedirectableRequest(options, callback);
        }
        // Executes a GET request, following redirects
        function get(input, options, callback) {
            var wrappedRequest = wrappedProtocol.request(input, options, callback);
            wrappedRequest.end();
            return wrappedRequest;
        }
        // Expose the properties on the wrapped protocol
        Object.defineProperties(wrappedProtocol, {
            request: {
                value: request,
                configurable: true,
                enumerable: true,
                writable: true
            },
            get: {
                value: get,
                configurable: true,
                enumerable: true,
                writable: true
            }
        });
    });
    return exports;
}
/* istanbul ignore next */ function noop() {}
// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
    var options = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ? /* istanbul ignore next */ urlObject.hostname.slice(1, -1) : urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href
    };
    if (urlObject.port !== "") {
        options.port = Number(urlObject.port);
    }
    return options;
}
function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for(var header in headers){
        if (regex.test(header)) {
            lastValue = headers[header];
            delete headers[header];
        }
    }
    return lastValue === null || typeof lastValue === "undefined" ? undefined : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
    // Create constructor
    function CustomError(properties) {
        Error.captureStackTrace(this, this.constructor);
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
    }
    // Attach constructor and set default properties
    CustomError.prototype = new (baseClass || Error)();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    return CustomError;
}
function abortRequest(request) {
    for (var event of events){
        request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.abort();
}
function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
function isFunction(value) {
    return typeof value === "function";
}
function isBuffer(value) {
    return typeof value === "object" && "length" in value;
}
// Exports
module.exports = wrap({
    http: http,
    https: https
});
module.exports.wrap = wrap;


/***/ }),

/***/ 29864:
/***/ ((module) => {

"use strict";

module.exports = (flag, argv = process.argv)=>{
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 27701:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var jws = __webpack_require__(64837);
module.exports = function(jwt, options) {
    options = options || {};
    var decoded = jws.decode(jwt, options);
    if (!decoded) {
        return null;
    }
    var payload = decoded.payload;
    //try parse the payload
    if (typeof payload === "string") {
        try {
            var obj = JSON.parse(payload);
            if (obj !== null && typeof obj === "object") {
                payload = obj;
            }
        } catch (e) {}
    }
    //return header if `complete` option is enabled.  header includes claims
    //such as `kid` and `alg` used to select the key within a JWKS needed to
    //verify the signature
    if (options.complete === true) {
        return {
            header: decoded.header,
            payload: payload,
            signature: decoded.signature
        };
    }
    return payload;
};


/***/ }),

/***/ 69877:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = {
    decode: __webpack_require__(27701),
    verify: __webpack_require__(45258),
    sign: __webpack_require__(80327),
    JsonWebTokenError: __webpack_require__(19615),
    NotBeforeError: __webpack_require__(68214),
    TokenExpiredError: __webpack_require__(19448)
};


/***/ }),

/***/ 19615:
/***/ ((module) => {

"use strict";

var JsonWebTokenError = function(message, error) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = "JsonWebTokenError";
    this.message = message;
    if (error) this.inner = error;
};
JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;
module.exports = JsonWebTokenError;


/***/ }),

/***/ 68214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var JsonWebTokenError = __webpack_require__(19615);
var NotBeforeError = function(message, date) {
    JsonWebTokenError.call(this, message);
    this.name = "NotBeforeError";
    this.date = date;
};
NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
NotBeforeError.prototype.constructor = NotBeforeError;
module.exports = NotBeforeError;


/***/ }),

/***/ 19448:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var JsonWebTokenError = __webpack_require__(19615);
var TokenExpiredError = function(message, expiredAt) {
    JsonWebTokenError.call(this, message);
    this.name = "TokenExpiredError";
    this.expiredAt = expiredAt;
};
TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
TokenExpiredError.prototype.constructor = TokenExpiredError;
module.exports = TokenExpiredError;


/***/ }),

/***/ 39116:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const semver = __webpack_require__(89724);
module.exports = semver.satisfies(process.version, ">=15.7.0");


/***/ }),

/***/ 21757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var semver = __webpack_require__(89724);
module.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");


/***/ }),

/***/ 38583:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const semver = __webpack_require__(89724);
module.exports = semver.satisfies(process.version, ">=16.9.0");


/***/ }),

/***/ 51068:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var ms = __webpack_require__(6034);
module.exports = function(time, iat) {
    var timestamp = iat || Math.floor(Date.now() / 1000);
    if (typeof time === "string") {
        var milliseconds = ms(time);
        if (typeof milliseconds === "undefined") {
            return;
        }
        return Math.floor(timestamp + milliseconds / 1000);
    } else if (typeof time === "number") {
        return timestamp + time;
    } else {
        return;
    }
};


/***/ }),

/***/ 20314:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ASYMMETRIC_KEY_DETAILS_SUPPORTED = __webpack_require__(39116);
const RSA_PSS_KEY_DETAILS_SUPPORTED = __webpack_require__(38583);
const allowedAlgorithmsForKeys = {
    "ec": [
        "ES256",
        "ES384",
        "ES512"
    ],
    "rsa": [
        "RS256",
        "PS256",
        "RS384",
        "PS384",
        "RS512",
        "PS512"
    ],
    "rsa-pss": [
        "PS256",
        "PS384",
        "PS512"
    ]
};
const allowedCurves = {
    ES256: "prime256v1",
    ES384: "secp384r1",
    ES512: "secp521r1"
};
module.exports = function(algorithm, key) {
    if (!algorithm || !key) return;
    const keyType = key.asymmetricKeyType;
    if (!keyType) return;
    const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
    if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
    }
    if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
    }
    /*
   * Ignore the next block from test coverage because it gets executed
   * conditionally depending on the Node version. Not ignoring it would
   * prevent us from reaching the target % of coverage for versions of
   * Node under 15.7.0.
   */ /* istanbul ignore next */ if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch(keyType){
            case "ec":
                const keyCurve = key.asymmetricKeyDetails.namedCurve;
                const allowedCurve = allowedCurves[algorithm];
                if (keyCurve !== allowedCurve) {
                    throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
                }
                break;
            case "rsa-pss":
                if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
                    const length = parseInt(algorithm.slice(-3), 10);
                    const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
                    if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
                    }
                    if (saltLength !== undefined && saltLength > length >> 3) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
                    }
                }
                break;
        }
    }
};


/***/ }),

/***/ 80327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const timespan = __webpack_require__(51068);
const PS_SUPPORTED = __webpack_require__(21757);
const validateAsymmetricKey = __webpack_require__(20314);
const jws = __webpack_require__(64837);
const { includes, isBoolean, isInteger, isNumber, isPlainObject, isString, once } = __webpack_require__(46517);
const { KeyObject, createSecretKey, createPrivateKey } = __webpack_require__(6113);
const SUPPORTED_ALGS = [
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "HS256",
    "HS384",
    "HS512",
    "none"
];
if (PS_SUPPORTED) {
    SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
}
const sign_options_schema = {
    expiresIn: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
    },
    notBefore: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
    },
    audience: {
        isValid: function(value) {
            return isString(value) || Array.isArray(value);
        },
        message: '"audience" must be a string or array'
    },
    algorithm: {
        isValid: includes.bind(null, SUPPORTED_ALGS),
        message: '"algorithm" must be a valid string enum value'
    },
    header: {
        isValid: isPlainObject,
        message: '"header" must be an object'
    },
    encoding: {
        isValid: isString,
        message: '"encoding" must be a string'
    },
    issuer: {
        isValid: isString,
        message: '"issuer" must be a string'
    },
    subject: {
        isValid: isString,
        message: '"subject" must be a string'
    },
    jwtid: {
        isValid: isString,
        message: '"jwtid" must be a string'
    },
    noTimestamp: {
        isValid: isBoolean,
        message: '"noTimestamp" must be a boolean'
    },
    keyid: {
        isValid: isString,
        message: '"keyid" must be a string'
    },
    mutatePayload: {
        isValid: isBoolean,
        message: '"mutatePayload" must be a boolean'
    },
    allowInsecureKeySizes: {
        isValid: isBoolean,
        message: '"allowInsecureKeySizes" must be a boolean'
    },
    allowInvalidAsymmetricKeyTypes: {
        isValid: isBoolean,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
    }
};
const registered_claims_schema = {
    iat: {
        isValid: isNumber,
        message: '"iat" should be a number of seconds'
    },
    exp: {
        isValid: isNumber,
        message: '"exp" should be a number of seconds'
    },
    nbf: {
        isValid: isNumber,
        message: '"nbf" should be a number of seconds'
    }
};
function validate(schema, allowUnknown, object, parameterName) {
    if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
    }
    Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
            if (!allowUnknown) {
                throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
            }
            return;
        }
        if (!validator.isValid(object[key])) {
            throw new Error(validator.message);
        }
    });
}
function validateOptions(options) {
    return validate(sign_options_schema, false, options, "options");
}
function validatePayload(payload) {
    return validate(registered_claims_schema, true, payload, "payload");
}
const options_to_payload = {
    "audience": "aud",
    "issuer": "iss",
    "subject": "sub",
    "jwtid": "jti"
};
const options_for_objects = [
    "expiresIn",
    "notBefore",
    "noTimestamp",
    "audience",
    "issuer",
    "subject",
    "jwtid"
];
module.exports = function(payload, secretOrPrivateKey, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }
    const isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload);
    const header = Object.assign({
        alg: options.algorithm || "HS256",
        typ: isObjectPayload ? "JWT" : undefined,
        kid: options.keyid
    }, options.header);
    function failure(err) {
        if (callback) {
            return callback(err);
        }
        throw err;
    }
    if (!secretOrPrivateKey && options.algorithm !== "none") {
        return failure(new Error("secretOrPrivateKey must have a value"));
    }
    if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
            secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
            try {
                secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
            } catch (_) {
                return failure(new Error("secretOrPrivateKey is not valid key material"));
            }
        }
    }
    if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret") {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
    } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== "private") {
            return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== undefined && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
            return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
    }
    if (typeof payload === "undefined") {
        return failure(new Error("payload is required"));
    } else if (isObjectPayload) {
        try {
            validatePayload(payload);
        } catch (error) {
            return failure(error);
        }
        if (!options.mutatePayload) {
            payload = Object.assign({}, payload);
        }
    } else {
        const invalid_options = options_for_objects.filter(function(opt) {
            return typeof options[opt] !== "undefined";
        });
        if (invalid_options.length > 0) {
            return failure(new Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
        }
    }
    if (typeof payload.exp !== "undefined" && typeof options.expiresIn !== "undefined") {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    }
    if (typeof payload.nbf !== "undefined" && typeof options.notBefore !== "undefined") {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    }
    try {
        validateOptions(options);
    } catch (error) {
        return failure(error);
    }
    if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
            validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
            return failure(error);
        }
    }
    const timestamp = payload.iat || Math.floor(Date.now() / 1000);
    if (options.noTimestamp) {
        delete payload.iat;
    } else if (isObjectPayload) {
        payload.iat = timestamp;
    }
    if (typeof options.notBefore !== "undefined") {
        try {
            payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.nbf === "undefined") {
            return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
        try {
            payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.exp === "undefined") {
            return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== "undefined") {
            if (typeof payload[claim] !== "undefined") {
                return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
            }
            payload[claim] = options[key];
        }
    });
    const encoding = options.encoding || "utf8";
    if (typeof callback === "function") {
        callback = callback && once(callback);
        jws.createSign({
            header: header,
            privateKey: secretOrPrivateKey,
            payload: payload,
            encoding: encoding
        }).once("error", callback).once("done", function(signature) {
            // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
            if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
                return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
            }
            callback(null, signature);
        });
    } else {
        let signature = jws.sign({
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: encoding
        });
        // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
    }
};


/***/ }),

/***/ 45258:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const JsonWebTokenError = __webpack_require__(19615);
const NotBeforeError = __webpack_require__(68214);
const TokenExpiredError = __webpack_require__(19448);
const decode = __webpack_require__(27701);
const timespan = __webpack_require__(51068);
const validateAsymmetricKey = __webpack_require__(20314);
const PS_SUPPORTED = __webpack_require__(21757);
const jws = __webpack_require__(64837);
const { KeyObject, createSecretKey, createPublicKey } = __webpack_require__(6113);
const PUB_KEY_ALGS = [
    "RS256",
    "RS384",
    "RS512"
];
const EC_KEY_ALGS = [
    "ES256",
    "ES384",
    "ES512"
];
const RSA_KEY_ALGS = [
    "RS256",
    "RS384",
    "RS512"
];
const HS_ALGS = [
    "HS256",
    "HS384",
    "HS512"
];
if (PS_SUPPORTED) {
    PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
    RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
}
module.exports = function(jwtString, secretOrPublicKey, options, callback) {
    if (typeof options === "function" && !callback) {
        callback = options;
        options = {};
    }
    if (!options) {
        options = {};
    }
    //clone this object since we are going to mutate it.
    options = Object.assign({}, options);
    let done;
    if (callback) {
        done = callback;
    } else {
        done = function(err, data) {
            if (err) throw err;
            return data;
        };
    }
    if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
        return done(new JsonWebTokenError("clockTimestamp must be a number"));
    }
    if (options.nonce !== undefined && (typeof options.nonce !== "string" || options.nonce.trim() === "")) {
        return done(new JsonWebTokenError("nonce must be a non-empty string"));
    }
    if (options.allowInvalidAsymmetricKeyTypes !== undefined && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean") {
        return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
    }
    const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!jwtString) {
        return done(new JsonWebTokenError("jwt must be provided"));
    }
    if (typeof jwtString !== "string") {
        return done(new JsonWebTokenError("jwt must be a string"));
    }
    const parts = jwtString.split(".");
    if (parts.length !== 3) {
        return done(new JsonWebTokenError("jwt malformed"));
    }
    let decodedToken;
    try {
        decodedToken = decode(jwtString, {
            complete: true
        });
    } catch (err) {
        return done(err);
    }
    if (!decodedToken) {
        return done(new JsonWebTokenError("invalid token"));
    }
    const header = decodedToken.header;
    let getSecret;
    if (typeof secretOrPublicKey === "function") {
        if (!callback) {
            return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
        }
        getSecret = secretOrPublicKey;
    } else {
        getSecret = function(header, secretCallback) {
            return secretCallback(null, secretOrPublicKey);
        };
    }
    return getSecret(header, function(err, secretOrPublicKey) {
        if (err) {
            return done(new JsonWebTokenError("error in secret or public key callback: " + err.message));
        }
        const hasSignature = parts[2].trim() !== "";
        if (!hasSignature && secretOrPublicKey) {
            return done(new JsonWebTokenError("jwt signature is required"));
        }
        if (hasSignature && !secretOrPublicKey) {
            return done(new JsonWebTokenError("secret or public key must be provided"));
        }
        if (!hasSignature && !options.algorithms) {
            return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey != null && !(secretOrPublicKey instanceof KeyObject)) {
            try {
                secretOrPublicKey = createPublicKey(secretOrPublicKey);
            } catch (_) {
                try {
                    secretOrPublicKey = createSecretKey(typeof secretOrPublicKey === "string" ? Buffer.from(secretOrPublicKey) : secretOrPublicKey);
                } catch (_) {
                    return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
                }
            }
        }
        if (!options.algorithms) {
            if (secretOrPublicKey.type === "secret") {
                options.algorithms = HS_ALGS;
            } else if ([
                "rsa",
                "rsa-pss"
            ].includes(secretOrPublicKey.asymmetricKeyType)) {
                options.algorithms = RSA_KEY_ALGS;
            } else if (secretOrPublicKey.asymmetricKeyType === "ec") {
                options.algorithms = EC_KEY_ALGS;
            } else {
                options.algorithms = PUB_KEY_ALGS;
            }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
            return done(new JsonWebTokenError("invalid algorithm"));
        }
        if (header.alg.startsWith("HS") && secretOrPublicKey.type !== "secret") {
            return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey.type !== "public") {
            return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
            try {
                validateAsymmetricKey(header.alg, secretOrPublicKey);
            } catch (e) {
                return done(e);
            }
        }
        let valid;
        try {
            valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
        } catch (e) {
            return done(e);
        }
        if (!valid) {
            return done(new JsonWebTokenError("invalid signature"));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
            if (typeof payload.nbf !== "number") {
                return done(new JsonWebTokenError("invalid nbf value"));
            }
            if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
                return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1000)));
            }
        }
        if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
            if (typeof payload.exp !== "number") {
                return done(new JsonWebTokenError("invalid exp value"));
            }
            if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1000)));
            }
        }
        if (options.audience) {
            const audiences = Array.isArray(options.audience) ? options.audience : [
                options.audience
            ];
            const target = Array.isArray(payload.aud) ? payload.aud : [
                payload.aud
            ];
            const match = target.some(function(targetAudience) {
                return audiences.some(function(audience) {
                    return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
                });
            });
            if (!match) {
                return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
            }
        }
        if (options.issuer) {
            const invalid_issuer = typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
            if (invalid_issuer) {
                return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
            }
        }
        if (options.subject) {
            if (payload.sub !== options.subject) {
                return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
            }
        }
        if (options.jwtid) {
            if (payload.jti !== options.jwtid) {
                return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
            }
        }
        if (options.nonce) {
            if (payload.nonce !== options.nonce) {
                return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
            }
        }
        if (options.maxAge) {
            if (typeof payload.iat !== "number") {
                return done(new JsonWebTokenError("iat required when maxAge is specified"));
            }
            const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
            if (typeof maxAgeTimestamp === "undefined") {
                return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
            }
            if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1000)));
            }
        }
        if (options.complete === true) {
            const signature = decodedToken.signature;
            return done(null, {
                header: header,
                payload: payload,
                signature: signature
            });
        }
        return done(null, payload);
    });
};


/***/ }),

/***/ 29328:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var bufferEqual = __webpack_require__(93038);
var Buffer = (__webpack_require__(28569).Buffer);
var crypto = __webpack_require__(6113);
var formatEcdsa = __webpack_require__(91783);
var util = __webpack_require__(73837);
var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
var MSG_INVALID_SECRET = "secret must be a string or buffer";
var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
var supportsKeyObjects = typeof crypto.createPublicKey === "function";
if (supportsKeyObjects) {
    MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
    MSG_INVALID_SECRET += "or a KeyObject";
}
function checkIsPublicKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === "string") {
        return;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key !== "object") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.type !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.asymmetricKeyType !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
}
;
function checkIsPrivateKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === "string") {
        return;
    }
    if (typeof key === "object") {
        return;
    }
    throw typeError(MSG_INVALID_SIGNER_KEY);
}
;
function checkIsSecretKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === "string") {
        return key;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key !== "object") {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (key.type !== "secret") {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_SECRET);
    }
}
function fromBase64(base64) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function toBase64(base64url) {
    base64url = base64url.toString();
    var padding = 4 - base64url.length % 4;
    if (padding !== 4) {
        for(var i = 0; i < padding; ++i){
            base64url += "=";
        }
    }
    return base64url.replace(/\-/g, "+").replace(/_/g, "/");
}
function typeError(template) {
    var args = [].slice.call(arguments, 1);
    var errMsg = util.format.bind(util, template).apply(null, args);
    return new TypeError(errMsg);
}
function bufferOrString(obj) {
    return Buffer.isBuffer(obj) || typeof obj === "string";
}
function normalizeInput(thing) {
    if (!bufferOrString(thing)) thing = JSON.stringify(thing);
    return thing;
}
function createHmacSigner(bits) {
    return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac("sha" + bits, secret);
        var sig = (hmac.update(thing), hmac.digest("base64"));
        return fromBase64(sig);
    };
}
function createHmacVerifier(bits) {
    return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return bufferEqual(Buffer.from(signature), Buffer.from(computedSig));
    };
}
function createKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        // Even though we are specifying "RSA" here, this works with ECDSA
        // keys as well.
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
        return fromBase64(sig);
    };
}
function createKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, "base64");
    };
}
function createPSSKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
        return fromBase64(sig);
    };
}
function createPSSKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, "base64");
    };
}
function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, "ES" + bits);
        return signature;
    };
}
function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
        var result = inner(thing, signature, publicKey);
        return result;
    };
}
function createNoneSigner() {
    return function sign() {
        return "";
    };
}
function createNoneVerifier() {
    return function verify(thing, signature) {
        return signature === "";
    };
}
module.exports = function jwa(algorithm) {
    var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
    };
    var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
    };
    var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
    if (!match) throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase();
    var bits = match[2];
    return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
    };
};


/***/ }),

/***/ 64837:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*global exports*/ var SignStream = __webpack_require__(22845);
var VerifyStream = __webpack_require__(51796);
var ALGORITHMS = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512"
];
exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
    return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
    return new VerifyStream(opts);
};


/***/ }),

/***/ 86612:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module, process*/ 
var Buffer = (__webpack_require__(28569).Buffer);
var Stream = __webpack_require__(12781);
var util = __webpack_require__(73837);
function DataStream(data) {
    this.buffer = null;
    this.writable = true;
    this.readable = true;
    // No input
    if (!data) {
        this.buffer = Buffer.alloc(0);
        return this;
    }
    // Stream
    if (typeof data.pipe === "function") {
        this.buffer = Buffer.alloc(0);
        data.pipe(this);
        return this;
    }
    // Buffer or String
    // or Object (assumedly a passworded key)
    if (data.length || typeof data === "object") {
        this.buffer = data;
        this.writable = false;
        process.nextTick((function() {
            this.emit("end", data);
            this.readable = false;
            this.emit("close");
        }).bind(this));
        return this;
    }
    throw new TypeError("Unexpected data type (" + typeof data + ")");
}
util.inherits(DataStream, Stream);
DataStream.prototype.write = function write(data) {
    this.buffer = Buffer.concat([
        this.buffer,
        Buffer.from(data)
    ]);
    this.emit("data", data);
};
DataStream.prototype.end = function end(data) {
    if (data) this.write(data);
    this.emit("end", data);
    this.emit("close");
    this.writable = false;
    this.readable = false;
};
module.exports = DataStream;


/***/ }),

/***/ 22845:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module*/ 
var Buffer = (__webpack_require__(28569).Buffer);
var DataStream = __webpack_require__(86612);
var jwa = __webpack_require__(29328);
var Stream = __webpack_require__(12781);
var toString = __webpack_require__(88472);
var util = __webpack_require__(73837);
function base64url(string, encoding) {
    return Buffer.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || "utf8";
    var encodedHeader = base64url(toString(header), "binary");
    var encodedPayload = base64url(toString(payload), encoding);
    return util.format("%s.%s", encodedHeader, encodedPayload);
}
function jwsSign(opts) {
    var header = opts.header;
    var payload = opts.payload;
    var secretOrKey = opts.secret || opts.privateKey;
    var encoding = opts.encoding;
    var algo = jwa(header.alg);
    var securedInput = jwsSecuredInput(header, payload, encoding);
    var signature = algo.sign(securedInput, secretOrKey);
    return util.format("%s.%s", securedInput, signature);
}
function SignStream(opts) {
    var secret = opts.secret || opts.privateKey || opts.key;
    var secretStream = new DataStream(secret);
    this.readable = true;
    this.header = opts.header;
    this.encoding = opts.encoding;
    this.secret = this.privateKey = this.key = secretStream;
    this.payload = new DataStream(opts.payload);
    this.secret.once("close", (function() {
        if (!this.payload.writable && this.readable) this.sign();
    }).bind(this));
    this.payload.once("close", (function() {
        if (!this.secret.writable && this.readable) this.sign();
    }).bind(this));
}
util.inherits(SignStream, Stream);
SignStream.prototype.sign = function sign() {
    try {
        var signature = jwsSign({
            header: this.header,
            payload: this.payload.buffer,
            secret: this.secret.buffer,
            encoding: this.encoding
        });
        this.emit("done", signature);
        this.emit("data", signature);
        this.emit("end");
        this.readable = false;
        return signature;
    } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
    }
};
SignStream.sign = jwsSign;
module.exports = SignStream;


/***/ }),

/***/ 88472:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module*/ 
var Buffer = (__webpack_require__(14300).Buffer);
module.exports = function toString(obj) {
    if (typeof obj === "string") return obj;
    if (typeof obj === "number" || Buffer.isBuffer(obj)) return obj.toString();
    return JSON.stringify(obj);
};


/***/ }),

/***/ 51796:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*global module*/ 
var Buffer = (__webpack_require__(28569).Buffer);
var DataStream = __webpack_require__(86612);
var jwa = __webpack_require__(29328);
var Stream = __webpack_require__(12781);
var toString = __webpack_require__(88472);
var util = __webpack_require__(73837);
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
function isObject(thing) {
    return Object.prototype.toString.call(thing) === "[object Object]";
}
function safeJsonParse(thing) {
    if (isObject(thing)) return thing;
    try {
        return JSON.parse(thing);
    } catch (e) {
        return undefined;
    }
}
function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split(".", 1)[0];
    return safeJsonParse(Buffer.from(encodedHeader, "base64").toString("binary"));
}
function securedInputFromJWS(jwsSig) {
    return jwsSig.split(".", 2).join(".");
}
function signatureFromJWS(jwsSig) {
    return jwsSig.split(".")[2];
}
function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || "utf8";
    var payload = jwsSig.split(".")[1];
    return Buffer.from(payload, "base64").toString(encoding);
}
function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
}
function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
    }
    jwsSig = toString(jwsSig);
    var signature = signatureFromJWS(jwsSig);
    var securedInput = securedInputFromJWS(jwsSig);
    var algo = jwa(algorithm);
    return algo.verify(securedInput, signature, secretOrKey);
}
function jwsDecode(jwsSig, opts) {
    opts = opts || {};
    jwsSig = toString(jwsSig);
    if (!isValidJws(jwsSig)) return null;
    var header = headerFromJWS(jwsSig);
    if (!header) return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === "JWT" || opts.json) payload = JSON.parse(payload, opts.encoding);
    return {
        header: header,
        payload: payload,
        signature: signatureFromJWS(jwsSig)
    };
}
function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret || opts.publicKey || opts.key;
    var secretStream = new DataStream(secretOrKey);
    this.readable = true;
    this.algorithm = opts.algorithm;
    this.encoding = opts.encoding;
    this.secret = this.publicKey = this.key = secretStream;
    this.signature = new DataStream(opts.signature);
    this.secret.once("close", (function() {
        if (!this.signature.writable && this.readable) this.verify();
    }).bind(this));
    this.signature.once("close", (function() {
        if (!this.secret.writable && this.readable) this.verify();
    }).bind(this));
}
util.inherits(VerifyStream, Stream);
VerifyStream.prototype.verify = function verify() {
    try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit("done", valid, obj);
        this.emit("data", valid);
        this.emit("end");
        this.readable = false;
        return valid;
    } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
    }
};
VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;
module.exports = VerifyStream;


/***/ }),

/***/ 51207:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = (void 0) && (void 0).__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = (void 0) && (void 0).__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TokenVerifier = exports.AccessToken = void 0;
const jwt = __importStar(__webpack_require__(69877));
// 6 hours
const defaultTTL = 6 * 60 * 60;
class AccessToken {
    /**
     * Creates a new AccessToken
     * @param apiKey API Key, can be set in env LIVEKIT_API_KEY
     * @param apiSecret Secret, can be set in env LIVEKIT_API_SECRET
     */ constructor(apiKey, apiSecret, options){
        if (!apiKey) {
            apiKey = process.env.LIVEKIT_API_KEY;
        }
        if (!apiSecret) {
            apiSecret = process.env.LIVEKIT_API_SECRET;
        }
        if (!apiKey || !apiSecret) {
            throw Error("api-key and api-secret must be set");
        } else if (typeof document !== "undefined") {
            // check against document rather than window because deno provides window
            console.error("You should not include your API secret in your web client bundle.\n\n" + "Your web client should request a token from your backend server which should then use " + "the API secret to generate a token. See https://docs.livekit.io/client/connect/");
        }
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.grants = {};
        this.identity = options === null || options === void 0 ? void 0 : options.identity;
        this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || defaultTTL;
        if (options === null || options === void 0 ? void 0 : options.metadata) {
            this.metadata = options.metadata;
        }
        if (options === null || options === void 0 ? void 0 : options.name) {
            this.name = options.name;
        }
    }
    /**
     * Adds a video grant to this token.
     * @param grant
     */ addGrant(grant) {
        this.grants.video = grant;
    }
    /**
     * Set metadata to be passed to the Participant, used only when joining the room
     */ set metadata(md) {
        this.grants.metadata = md;
    }
    set name(name) {
        this.grants.name = name;
    }
    get sha256() {
        return this.grants.sha256;
    }
    set sha256(sha) {
        this.grants.sha256 = sha;
    }
    /**
     * @returns JWT encoded token
     */ toJwt() {
        // TODO: check for video grant validity
        var _a;
        const opts = {
            issuer: this.apiKey,
            expiresIn: this.ttl,
            notBefore: 0
        };
        if (this.identity) {
            opts.subject = this.identity;
            opts.jwtid = this.identity;
        } else if ((_a = this.grants.video) === null || _a === void 0 ? void 0 : _a.roomJoin) {
            throw Error("identity is required for join but not set");
        }
        return jwt.sign(this.grants, this.apiSecret, opts);
    }
}
exports.AccessToken = AccessToken;
class TokenVerifier {
    constructor(apiKey, apiSecret){
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    verify(token) {
        const decoded = jwt.verify(token, this.apiSecret, {
            issuer: this.apiKey
        });
        if (!decoded) {
            throw Error("invalid token");
        }
        return decoded;
    }
}
exports.TokenVerifier = TokenVerifier; //# sourceMappingURL=AccessToken.js.map


/***/ }),

/***/ 34521:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EgressClient = void 0;
const livekit_egress_1 = __webpack_require__(64521);
const ServiceBase_1 = __importDefault(__webpack_require__(56413));
const TwirpRPC_1 = __webpack_require__(33265);
const svc = "Egress";
/**
 * Client to access Egress APIs
 */ class EgressClient extends ServiceBase_1.default {
    /**
     * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
     * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
     * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
     */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRPC_1.TwirpRpc(host, TwirpRPC_1.livekitPackage);
    }
    startRoomCompositeEgress(roomName, output, optsOrLayout, options, audioOnly, videoOnly, customBaseUrl) {
        return __awaiter(this, void 0, void 0, function*() {
            let layout;
            if (optsOrLayout !== undefined) {
                if (typeof optsOrLayout === "string") {
                    layout = optsOrLayout;
                } else {
                    const opts = optsOrLayout;
                    layout = opts.layout;
                    options = opts.encodingOptions;
                    audioOnly = opts.audioOnly;
                    videoOnly = opts.videoOnly;
                    customBaseUrl = opts.customBaseUrl;
                }
            }
            layout !== null && layout !== void 0 ? layout : layout = "";
            audioOnly !== null && audioOnly !== void 0 ? audioOnly : audioOnly = false;
            videoOnly !== null && videoOnly !== void 0 ? videoOnly : videoOnly = false;
            customBaseUrl !== null && customBaseUrl !== void 0 ? customBaseUrl : customBaseUrl = "";
            const { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs } = this.getOutputParams(output, options);
            const req = livekit_egress_1.RoomCompositeEgressRequest.toJSON({
                roomName,
                layout,
                audioOnly,
                videoOnly,
                customBaseUrl,
                file,
                stream,
                segments,
                preset,
                advanced,
                fileOutputs,
                streamOutputs,
                segmentOutputs
            });
            const data = yield this.rpc.request(svc, "StartRoomCompositeEgress", req, this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
    /**
     * @param url url
     * @param output file or stream output
     * @param opts WebOptions
     */ startWebEgress(url, output, opts) {
        return __awaiter(this, void 0, void 0, function*() {
            const audioOnly = (opts === null || opts === void 0 ? void 0 : opts.audioOnly) || false;
            const videoOnly = (opts === null || opts === void 0 ? void 0 : opts.videoOnly) || false;
            const awaitStartSignal = (opts === null || opts === void 0 ? void 0 : opts.awaitStartSignal) || false;
            const { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs } = this.getOutputParams(output, opts === null || opts === void 0 ? void 0 : opts.encodingOptions);
            const req = livekit_egress_1.WebEgressRequest.toJSON({
                url,
                audioOnly,
                videoOnly,
                awaitStartSignal,
                file,
                stream,
                segments,
                preset,
                advanced,
                fileOutputs,
                streamOutputs,
                segmentOutputs
            });
            const data = yield this.rpc.request(svc, "StartWebEgress", req, this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
    startTrackCompositeEgress(roomName, output, optsOrAudioTrackId, videoTrackId, options) {
        return __awaiter(this, void 0, void 0, function*() {
            let audioTrackId;
            if (optsOrAudioTrackId !== undefined) {
                if (typeof optsOrAudioTrackId === "string") {
                    audioTrackId = optsOrAudioTrackId;
                } else {
                    const opts = optsOrAudioTrackId;
                    audioTrackId = opts.audioTrackId;
                    videoTrackId = opts.videoTrackId;
                    options = opts.encodingOptions;
                }
            }
            audioTrackId !== null && audioTrackId !== void 0 ? audioTrackId : audioTrackId = "";
            videoTrackId !== null && videoTrackId !== void 0 ? videoTrackId : videoTrackId = "";
            const { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs } = this.getOutputParams(output, options);
            const req = livekit_egress_1.TrackCompositeEgressRequest.toJSON({
                roomName,
                audioTrackId,
                videoTrackId,
                file,
                stream,
                segments,
                preset,
                advanced,
                fileOutputs,
                streamOutputs,
                segmentOutputs
            });
            const data = yield this.rpc.request(svc, "StartTrackCompositeEgress", req, this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
    isEncodedOutputs(output) {
        return output.file !== undefined || output.stream !== undefined || output.segments !== undefined;
    }
    isEncodedFileOutput(output) {
        return output.filepath !== undefined || output.fileType !== undefined;
    }
    isSegmentedFileOutput(output) {
        return output.filenamePrefix !== undefined || output.playlistName !== undefined || output.filenameSuffix !== undefined;
    }
    isStreamOutput(output) {
        return output.protocol !== undefined || output.urls !== undefined;
    }
    getOutputParams(output, options) {
        let file;
        let fileOutputs;
        let stream;
        let streamOutputs;
        let segments;
        let segmentOutputs;
        let preset;
        let advanced;
        if (this.isEncodedOutputs(output)) {
            if (output.file !== undefined) {
                fileOutputs = [
                    output.file
                ];
            }
            if (output.stream !== undefined) {
                streamOutputs = [
                    output.stream
                ];
            }
            if (output.segments !== undefined) {
                segmentOutputs = [
                    output.segments
                ];
            }
        } else if (this.isEncodedFileOutput(output)) {
            file = output;
            fileOutputs = [
                file
            ];
        } else if (this.isSegmentedFileOutput(output)) {
            segments = output;
            segmentOutputs = [
                segments
            ];
        } else if (this.isStreamOutput(output)) {
            stream = output;
            streamOutputs = [
                stream
            ];
        }
        if (options) {
            if (typeof options === "number") {
                preset = options;
            } else {
                advanced = options;
            }
        }
        return {
            file,
            stream,
            segments,
            preset,
            advanced,
            fileOutputs,
            streamOutputs,
            segmentOutputs
        };
    }
    /**
     * @param roomName room name
     * @param output file or websocket output
     * @param trackId track Id
     */ startTrackEgress(roomName, output, trackId) {
        return __awaiter(this, void 0, void 0, function*() {
            let file;
            let websocketUrl;
            if (typeof output === "string") {
                websocketUrl = output;
            } else {
                file = output;
            }
            const req = livekit_egress_1.TrackEgressRequest.toJSON({
                roomName,
                trackId,
                file,
                websocketUrl
            });
            const data = yield this.rpc.request(svc, "StartTrackEgress", req, this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
    /**
     * @param egressId
     * @param layout
     */ updateLayout(egressId, layout) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "UpdateLayout", livekit_egress_1.UpdateLayoutRequest.toJSON({
                egressId,
                layout
            }), this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
    /**
     * @param egressId
     * @param addOutputUrls
     * @param removeOutputUrls
     */ updateStream(egressId, addOutputUrls, removeOutputUrls) {
        return __awaiter(this, void 0, void 0, function*() {
            addOutputUrls !== null && addOutputUrls !== void 0 ? addOutputUrls : addOutputUrls = [];
            removeOutputUrls !== null && removeOutputUrls !== void 0 ? removeOutputUrls : removeOutputUrls = [];
            const data = yield this.rpc.request(svc, "UpdateStream", livekit_egress_1.UpdateStreamRequest.toJSON({
                egressId,
                addOutputUrls,
                removeOutputUrls
            }), this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
    /**
     * @param roomName list egress for one room only
     */ listEgress(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            let req = {};
            if (typeof options === "string") {
                req.roomName = options;
            } else if (options !== undefined) {
                req = options;
            }
            const data = yield this.rpc.request(svc, "ListEgress", livekit_egress_1.ListEgressRequest.toJSON(req), this.authHeader({
                roomRecord: true
            }));
            return (_a = livekit_egress_1.ListEgressResponse.fromJSON(data).items) !== null && _a !== void 0 ? _a : [];
        });
    }
    /**
     * @param egressId
     */ stopEgress(egressId) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "StopEgress", livekit_egress_1.StopEgressRequest.toJSON({
                egressId
            }), this.authHeader({
                roomRecord: true
            }));
            return livekit_egress_1.EgressInfo.fromJSON(data);
        });
    }
}
exports.EgressClient = EgressClient; //# sourceMappingURL=EgressClient.js.map


/***/ }),

/***/ 65511:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IngressClient = void 0;
const livekit_ingress_1 = __webpack_require__(93208);
const ServiceBase_1 = __importDefault(__webpack_require__(56413));
const TwirpRPC_1 = __webpack_require__(33265);
const svc = "Ingress";
/**
 * Client to access Ingress APIs
 */ class IngressClient extends ServiceBase_1.default {
    /**
     * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
     * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
     * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
     */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRPC_1.TwirpRpc(host, TwirpRPC_1.livekitPackage);
    }
    /**
     * @param inputType protocol for the ingress
     * @param opts CreateIngressOptions
     */ createIngress(inputType, opts) {
        return __awaiter(this, void 0, void 0, function*() {
            let name = "";
            let roomName = "";
            let participantName = "";
            let participantIdentity = "";
            let bypassTranscoding = false;
            let url = "";
            let audio;
            let video;
            if (opts !== undefined) {
                name = opts.name || "";
                roomName = opts.roomName || "";
                participantName = opts.participantName || "";
                participantIdentity = opts.participantIdentity || "";
                bypassTranscoding = opts.bypassTranscoding || false;
                url = opts.url || "";
                audio = opts.audio;
                video = opts.video;
            }
            const req = livekit_ingress_1.CreateIngressRequest.toJSON({
                inputType,
                name,
                roomName,
                participantIdentity,
                participantName,
                bypassTranscoding,
                url,
                audio,
                video
            });
            const data = yield this.rpc.request(svc, "CreateIngress", req, this.authHeader({
                ingressAdmin: true
            }));
            return livekit_ingress_1.IngressInfo.fromJSON(data);
        });
    }
    /**
     * @param ingressId ID of the ingress to update
     * @param opts UpdateIngressOptions
     */ updateIngress(ingressId, opts) {
        return __awaiter(this, void 0, void 0, function*() {
            const name = opts.name || "";
            const roomName = opts.roomName || "";
            const participantName = opts.participantName || "";
            const participantIdentity = opts.participantIdentity || "";
            const { audio, video, bypassTranscoding } = opts;
            const req = livekit_ingress_1.UpdateIngressRequest.toJSON({
                ingressId,
                name,
                roomName,
                participantIdentity,
                participantName,
                bypassTranscoding,
                audio,
                video
            });
            const data = yield this.rpc.request(svc, "UpdateIngress", req, this.authHeader({
                ingressAdmin: true
            }));
            return livekit_ingress_1.IngressInfo.fromJSON(data);
        });
    }
    /**
     * @param roomName list ingress for one room only
     */ listIngress(roomName) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            roomName !== null && roomName !== void 0 ? roomName : roomName = "";
            const data = yield this.rpc.request(svc, "ListIngress", livekit_ingress_1.ListIngressRequest.toJSON({
                roomName
            }), this.authHeader({
                ingressAdmin: true
            }));
            return (_a = livekit_ingress_1.ListIngressResponse.fromJSON(data).items) !== null && _a !== void 0 ? _a : [];
        });
    }
    /**
     * @param ingressId ingress to delete
     */ deleteIngress(ingressId) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "DeleteIngress", livekit_ingress_1.DeleteIngressRequest.toJSON({
                ingressId
            }), this.authHeader({
                ingressAdmin: true
            }));
            return livekit_ingress_1.IngressInfo.fromJSON(data);
        });
    }
}
exports.IngressClient = IngressClient; //# sourceMappingURL=IngressClient.js.map


/***/ }),

/***/ 78726:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.RoomServiceClient = void 0;
const livekit_models_1 = __webpack_require__(49627);
const livekit_room_1 = __webpack_require__(88888);
const ServiceBase_1 = __importDefault(__webpack_require__(56413));
const TwirpRPC_1 = __webpack_require__(33265);
const svc = "RoomService";
/**
 * Client to access Room APIs
 */ class RoomServiceClient extends ServiceBase_1.default {
    /**
     *
     * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
     * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
     * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
     */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRPC_1.TwirpRpc(host, TwirpRPC_1.livekitPackage);
    }
    /**
     * Creates a new room. Explicit room creation is not required, since rooms will
     * be automatically created when the first participant joins. This method can be
     * used to customize room settings.
     * @param options
     */ createRoom(options) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "CreateRoom", livekit_room_1.CreateRoomRequest.toJSON(livekit_room_1.CreateRoomRequest.fromPartial(options)), this.authHeader({
                roomCreate: true
            }));
            return livekit_models_1.Room.fromJSON(data);
        });
    }
    /**
     * List active rooms
     * @param names when undefined or empty, list all rooms.
     *              otherwise returns rooms with matching names
     * @returns
     */ listRooms(names) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "ListRooms", livekit_room_1.ListRoomsRequest.toJSON({
                names: names !== null && names !== void 0 ? names : []
            }), this.authHeader({
                roomList: true
            }));
            const res = livekit_room_1.ListRoomsResponse.fromJSON(data);
            return (_a = res.rooms) !== null && _a !== void 0 ? _a : [];
        });
    }
    deleteRoom(room) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.rpc.request(svc, "DeleteRoom", livekit_room_1.DeleteRoomRequest.toJSON({
                room
            }), this.authHeader({
                roomCreate: true
            }));
        });
    }
    /**
     * Update metadata of a room
     * @param room name of the room
     * @param metadata the new metadata for the room
     */ updateRoomMetadata(room, metadata) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "UpdateRoomMetadata", livekit_room_1.UpdateRoomMetadataRequest.toJSON({
                room,
                metadata
            }), this.authHeader({
                roomAdmin: true,
                room
            }));
            return livekit_models_1.Room.fromJSON(data);
        });
    }
    /**
     * List participants in a room
     * @param room name of the room
     */ listParticipants(room) {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "ListParticipants", livekit_room_1.ListParticipantsRequest.toJSON({
                room
            }), this.authHeader({
                roomAdmin: true,
                room
            }));
            const res = livekit_room_1.ListParticipantsResponse.fromJSON(data);
            return (_a = res.participants) !== null && _a !== void 0 ? _a : [];
        });
    }
    /**
     * Get information on a specific participant, including the tracks that participant
     * has published
     * @param room name of the room
     * @param identity identity of the participant to return
     */ getParticipant(room, identity) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.rpc.request(svc, "GetParticipant", livekit_room_1.RoomParticipantIdentity.toJSON({
                room,
                identity
            }), this.authHeader({
                roomAdmin: true,
                room
            }));
            return livekit_models_1.ParticipantInfo.fromJSON(data);
        });
    }
    /**
     * Removes a participant in the room. This will disconnect the participant
     * and will emit a Disconnected event for that participant.
     * Even after being removed, the participant can still re-join the room.
     * @param room
     * @param identity
     */ removeParticipant(room, identity) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.rpc.request(svc, "RemoveParticipant", livekit_room_1.RoomParticipantIdentity.toJSON({
                room,
                identity
            }), this.authHeader({
                roomAdmin: true,
                room
            }));
        });
    }
    /**
     * Mutes a track that the participant has published.
     * @param room
     * @param identity
     * @param trackSid sid of the track to be muted
     * @param muted true to mute, false to unmute
     */ mutePublishedTrack(room, identity, trackSid, muted) {
        return __awaiter(this, void 0, void 0, function*() {
            const req = livekit_room_1.MuteRoomTrackRequest.toJSON({
                room,
                identity,
                trackSid,
                muted
            });
            const data = yield this.rpc.request(svc, "MutePublishedTrack", req, this.authHeader({
                roomAdmin: true,
                room
            }));
            const res = livekit_room_1.MuteRoomTrackResponse.fromJSON(data);
            return res.track;
        });
    }
    /**
     * Updates a participant's metadata or permissions
     * @param room
     * @param identity
     * @param metadata optional, metadata to update
     * @param permission optional, new permissions to assign to participant
     * @param name optional, new name for participant
     */ updateParticipant(room, identity, metadata, permission, name) {
        return __awaiter(this, void 0, void 0, function*() {
            const req = {
                room,
                identity,
                metadata: metadata || "",
                name: name || ""
            };
            if (permission) {
                req.permission = livekit_models_1.ParticipantPermission.fromPartial(permission);
            }
            const data = yield this.rpc.request(svc, "UpdateParticipant", livekit_room_1.UpdateParticipantRequest.toJSON(req), this.authHeader({
                roomAdmin: true,
                room
            }));
            return livekit_models_1.ParticipantInfo.fromJSON(data);
        });
    }
    /**
     * Updates a participant's subscription to tracks
     * @param room
     * @param identity
     * @param trackSids
     * @param subscribe true to subscribe, false to unsubscribe
     */ updateSubscriptions(room, identity, trackSids, subscribe) {
        return __awaiter(this, void 0, void 0, function*() {
            const req = livekit_room_1.UpdateSubscriptionsRequest.toJSON({
                room,
                identity,
                trackSids,
                subscribe,
                participantTracks: []
            });
            yield this.rpc.request(svc, "UpdateSubscriptions", req, this.authHeader({
                roomAdmin: true,
                room
            }));
        });
    }
    sendData(room, data, kind, options = {}) {
        return __awaiter(this, void 0, void 0, function*() {
            const destinationSids = Array.isArray(options) ? options : options.destinationSids;
            const topic = Array.isArray(options) ? undefined : options.topic;
            const req = livekit_room_1.SendDataRequest.toJSON({
                room,
                data,
                kind,
                destinationSids: destinationSids !== null && destinationSids !== void 0 ? destinationSids : [],
                topic
            });
            yield this.rpc.request(svc, "SendData", req, this.authHeader({
                roomAdmin: true,
                room
            }));
        });
    }
}
exports.RoomServiceClient = RoomServiceClient; //# sourceMappingURL=RoomServiceClient.js.map


/***/ }),

/***/ 56413:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const AccessToken_1 = __webpack_require__(51207);
/**
 * Utilities to handle authentication
 */ class ServiceBase {
    /**
     * @param apiKey API Key.
     * @param secret API Secret.
     * @param ttl token TTL
     */ constructor(apiKey, secret, ttl){
        this.apiKey = apiKey;
        this.secret = secret;
        this.ttl = ttl || "10m";
    }
    authHeader(grant) {
        const at = new AccessToken_1.AccessToken(this.apiKey, this.secret, {
            ttl: this.ttl
        });
        at.addGrant(grant);
        return {
            Authorization: `Bearer ${at.toJwt()}`
        };
    }
}
exports["default"] = ServiceBase; //# sourceMappingURL=ServiceBase.js.map


/***/ }),

/***/ 33265:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TwirpRpc = exports.livekitPackage = void 0;
const axios_1 = __importDefault(__webpack_require__(30658));
const camelcase_keys_1 = __importDefault(__webpack_require__(83346));
// twirp RPC adapter for client implementation
const defaultPrefix = "/twirp";
exports.livekitPackage = "livekit";
/**
 * JSON based Twirp V7 RPC
 */ class TwirpRpc {
    constructor(host, pkg, prefix){
        if (host.startsWith("ws")) {
            host = host.replace("ws", "http");
        }
        this.host = host;
        this.pkg = pkg;
        this.prefix = prefix || defaultPrefix;
        this.instance = axios_1.default.create({
            baseURL: host
        });
    }
    request(service, method, data, headers) {
        return new Promise((resolve, reject)=>{
            const path = `${this.prefix}/${this.pkg}.${service}/${method}`;
            this.instance.post(path, data, {
                headers
            }).then((res)=>{
                resolve(camelcase_keys_1.default(res.data, {
                    deep: true
                }));
            }).catch(reject);
        });
    }
}
exports.TwirpRpc = TwirpRpc; //# sourceMappingURL=TwirpRPC.js.map


/***/ }),

/***/ 81829:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.WebhookReceiver = exports.authorizeHeader = void 0;
const crypto_1 = __importDefault(__webpack_require__(6113));
const AccessToken_1 = __webpack_require__(51207);
const livekit_webhook_1 = __webpack_require__(35642);
exports.authorizeHeader = "Authorize";
class WebhookReceiver {
    constructor(apiKey, apiSecret){
        this.verifier = new AccessToken_1.TokenVerifier(apiKey, apiSecret);
    }
    /**
     *
     * @param body string of the posted body
     * @param authHeader `Authorization` header from the request
     * @param skipAuth true to skip auth validation
     * @returns
     */ receive(body, authHeader, skipAuth = false) {
        // verify token
        if (!skipAuth) {
            if (!authHeader) {
                throw new Error("authorization header is empty");
            }
            const claims = this.verifier.verify(authHeader);
            // confirm sha
            const hash = crypto_1.default.createHash("sha256");
            hash.update(body);
            if (claims.sha256 !== hash.digest("base64")) {
                throw new Error("sha256 checksum of body does not match");
            }
        }
        return livekit_webhook_1.WebhookEvent.fromJSON(JSON.parse(body));
    }
}
exports.WebhookReceiver = WebhookReceiver; //# sourceMappingURL=WebhookReceiver.js.map


/***/ }),

/***/ 21700:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TrackSource = void 0;
var TrackSource;
(function(TrackSource) {
    TrackSource["CAMERA"] = "camera";
    TrackSource["MICROPHONE"] = "microphone";
    TrackSource["SCREEN_SHARE"] = "screen_share";
    TrackSource["SCREEN_SHARE_AUDIO"] = "screen_share_audio";
})(TrackSource = exports.TrackSource || (exports.TrackSource = {})); //# sourceMappingURL=grants.js.map


/***/ }),

/***/ 4056:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TrackType = exports.TrackInfo = exports.Room = exports.ParticipantPermission = exports.ParticipantInfo_State = exports.ParticipantInfo = exports.DataPacket_Kind = exports.IngressVideoOptions = exports.IngressVideoEncodingPreset = exports.IngressVideoEncodingOptions = exports.IngressState = exports.IngressInput = exports.IngressInfo = exports.IngressAudioOptions = exports.IngressAudioEncodingPreset = exports.IngressAudioEncodingOptions = exports.StreamProtocol = exports.StreamOutput = exports.SegmentedFileProtocol = exports.SegmentedFileOutput = exports.EncodingOptionsPreset = exports.EncodingOptions = exports.EncodedFileType = exports.EncodedFileOutput = exports.EgressInfo = exports.DirectFileOutput = void 0;
__exportStar(__webpack_require__(51207), exports);
__exportStar(__webpack_require__(34521), exports);
__exportStar(__webpack_require__(65511), exports);
__exportStar(__webpack_require__(78726), exports);
__exportStar(__webpack_require__(81829), exports);
__exportStar(__webpack_require__(21700), exports);
var livekit_egress_1 = __webpack_require__(64521);
Object.defineProperty(exports, "DirectFileOutput", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.DirectFileOutput;
    }
}));
Object.defineProperty(exports, "EgressInfo", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.EgressInfo;
    }
}));
Object.defineProperty(exports, "EncodedFileOutput", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.EncodedFileOutput;
    }
}));
Object.defineProperty(exports, "EncodedFileType", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.EncodedFileType;
    }
}));
Object.defineProperty(exports, "EncodingOptions", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.EncodingOptions;
    }
}));
Object.defineProperty(exports, "EncodingOptionsPreset", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.EncodingOptionsPreset;
    }
}));
Object.defineProperty(exports, "SegmentedFileOutput", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.SegmentedFileOutput;
    }
}));
Object.defineProperty(exports, "SegmentedFileProtocol", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.SegmentedFileProtocol;
    }
}));
Object.defineProperty(exports, "StreamOutput", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.StreamOutput;
    }
}));
Object.defineProperty(exports, "StreamProtocol", ({
    enumerable: true,
    get: function() {
        return livekit_egress_1.StreamProtocol;
    }
}));
var livekit_ingress_1 = __webpack_require__(93208);
Object.defineProperty(exports, "IngressAudioEncodingOptions", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressAudioEncodingOptions;
    }
}));
Object.defineProperty(exports, "IngressAudioEncodingPreset", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressAudioEncodingPreset;
    }
}));
Object.defineProperty(exports, "IngressAudioOptions", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressAudioOptions;
    }
}));
Object.defineProperty(exports, "IngressInfo", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressInfo;
    }
}));
Object.defineProperty(exports, "IngressInput", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressInput;
    }
}));
Object.defineProperty(exports, "IngressState", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressState;
    }
}));
Object.defineProperty(exports, "IngressVideoEncodingOptions", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressVideoEncodingOptions;
    }
}));
Object.defineProperty(exports, "IngressVideoEncodingPreset", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressVideoEncodingPreset;
    }
}));
Object.defineProperty(exports, "IngressVideoOptions", ({
    enumerable: true,
    get: function() {
        return livekit_ingress_1.IngressVideoOptions;
    }
}));
var livekit_models_1 = __webpack_require__(49627);
Object.defineProperty(exports, "DataPacket_Kind", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.DataPacket_Kind;
    }
}));
Object.defineProperty(exports, "ParticipantInfo", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.ParticipantInfo;
    }
}));
Object.defineProperty(exports, "ParticipantInfo_State", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.ParticipantInfo_State;
    }
}));
Object.defineProperty(exports, "ParticipantPermission", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.ParticipantPermission;
    }
}));
Object.defineProperty(exports, "Room", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.Room;
    }
}));
Object.defineProperty(exports, "TrackInfo", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.TrackInfo;
    }
}));
Object.defineProperty(exports, "TrackType", ({
    enumerable: true,
    get: function() {
        return livekit_models_1.TrackType;
    }
})); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 17905:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.Timestamp = exports.protobufPackage = void 0;
/* eslint-disable */ const long_1 = __importDefault(__webpack_require__(21288));
const minimal_1 = __importDefault(__webpack_require__(51948));
exports.protobufPackage = "google.protobuf";
function createBaseTimestamp() {
    return {
        seconds: 0,
        nanos: 0
    };
}
exports.Timestamp = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.seconds !== 0) {
            writer.uint32(8).int64(message.seconds);
        }
        if (message.nanos !== 0) {
            writer.uint32(16).int32(message.nanos);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimestamp();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.seconds = longToNumber(reader.int64());
                    break;
                case 2:
                    message.nanos = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            seconds: isSet(object.seconds) ? Number(object.seconds) : 0,
            nanos: isSet(object.nanos) ? Number(object.nanos) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.seconds !== undefined && (obj.seconds = Math.round(message.seconds));
        message.nanos !== undefined && (obj.nanos = Math.round(message.nanos));
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseTimestamp();
        message.seconds = (_a = object.seconds) !== null && _a !== void 0 ? _a : 0;
        message.nanos = (_b = object.nanos) !== null && _b !== void 0 ? _b : 0;
        return message;
    }
};
var globalThis = (()=>{
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (false) {}
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
} //# sourceMappingURL=timestamp.js.map


/***/ }),

/***/ 64521:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AutoTrackEgress = exports.SegmentsInfo = exports.FileInfo = exports.StreamInfo = exports.StreamInfoList = exports.EgressInfo = exports.StopEgressRequest = exports.ListEgressResponse = exports.ListEgressRequest = exports.UpdateStreamRequest = exports.UpdateLayoutRequest = exports.EncodingOptions = exports.StreamOutput = exports.AliOSSUpload = exports.AzureBlobUpload = exports.GCPUpload = exports.S3Upload_MetadataEntry = exports.S3Upload = exports.DirectFileOutput = exports.SegmentedFileOutput = exports.EncodedFileOutput = exports.TrackEgressRequest = exports.TrackCompositeEgressRequest = exports.WebEgressRequest = exports.RoomCompositeEgressRequest = exports.streamInfo_StatusToJSON = exports.streamInfo_StatusFromJSON = exports.StreamInfo_Status = exports.egressStatusToJSON = exports.egressStatusFromJSON = exports.EgressStatus = exports.encodingOptionsPresetToJSON = exports.encodingOptionsPresetFromJSON = exports.EncodingOptionsPreset = exports.streamProtocolToJSON = exports.streamProtocolFromJSON = exports.StreamProtocol = exports.segmentedFileSuffixToJSON = exports.segmentedFileSuffixFromJSON = exports.SegmentedFileSuffix = exports.segmentedFileProtocolToJSON = exports.segmentedFileProtocolFromJSON = exports.SegmentedFileProtocol = exports.encodedFileTypeToJSON = exports.encodedFileTypeFromJSON = exports.EncodedFileType = exports.protobufPackage = void 0;
/* eslint-disable */ const long_1 = __importDefault(__webpack_require__(21288));
const minimal_1 = __importDefault(__webpack_require__(51948));
const livekit_models_1 = __webpack_require__(49627);
exports.protobufPackage = "livekit";
var EncodedFileType;
(function(EncodedFileType) {
    /** DEFAULT_FILETYPE - file type chosen based on codecs */ EncodedFileType[EncodedFileType["DEFAULT_FILETYPE"] = 0] = "DEFAULT_FILETYPE";
    EncodedFileType[EncodedFileType["MP4"] = 1] = "MP4";
    EncodedFileType[EncodedFileType["OGG"] = 2] = "OGG";
    EncodedFileType[EncodedFileType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(EncodedFileType = exports.EncodedFileType || (exports.EncodedFileType = {}));
function encodedFileTypeFromJSON(object) {
    switch(object){
        case 0:
        case "DEFAULT_FILETYPE":
            return EncodedFileType.DEFAULT_FILETYPE;
        case 1:
        case "MP4":
            return EncodedFileType.MP4;
        case 2:
        case "OGG":
            return EncodedFileType.OGG;
        case -1:
        case "UNRECOGNIZED":
        default:
            return EncodedFileType.UNRECOGNIZED;
    }
}
exports.encodedFileTypeFromJSON = encodedFileTypeFromJSON;
function encodedFileTypeToJSON(object) {
    switch(object){
        case EncodedFileType.DEFAULT_FILETYPE:
            return "DEFAULT_FILETYPE";
        case EncodedFileType.MP4:
            return "MP4";
        case EncodedFileType.OGG:
            return "OGG";
        case EncodedFileType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.encodedFileTypeToJSON = encodedFileTypeToJSON;
var SegmentedFileProtocol;
(function(SegmentedFileProtocol) {
    SegmentedFileProtocol[SegmentedFileProtocol["DEFAULT_SEGMENTED_FILE_PROTOCOL"] = 0] = "DEFAULT_SEGMENTED_FILE_PROTOCOL";
    SegmentedFileProtocol[SegmentedFileProtocol["HLS_PROTOCOL"] = 1] = "HLS_PROTOCOL";
    SegmentedFileProtocol[SegmentedFileProtocol["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SegmentedFileProtocol = exports.SegmentedFileProtocol || (exports.SegmentedFileProtocol = {}));
function segmentedFileProtocolFromJSON(object) {
    switch(object){
        case 0:
        case "DEFAULT_SEGMENTED_FILE_PROTOCOL":
            return SegmentedFileProtocol.DEFAULT_SEGMENTED_FILE_PROTOCOL;
        case 1:
        case "HLS_PROTOCOL":
            return SegmentedFileProtocol.HLS_PROTOCOL;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SegmentedFileProtocol.UNRECOGNIZED;
    }
}
exports.segmentedFileProtocolFromJSON = segmentedFileProtocolFromJSON;
function segmentedFileProtocolToJSON(object) {
    switch(object){
        case SegmentedFileProtocol.DEFAULT_SEGMENTED_FILE_PROTOCOL:
            return "DEFAULT_SEGMENTED_FILE_PROTOCOL";
        case SegmentedFileProtocol.HLS_PROTOCOL:
            return "HLS_PROTOCOL";
        case SegmentedFileProtocol.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.segmentedFileProtocolToJSON = segmentedFileProtocolToJSON;
var SegmentedFileSuffix;
(function(SegmentedFileSuffix) {
    SegmentedFileSuffix[SegmentedFileSuffix["INDEX"] = 0] = "INDEX";
    SegmentedFileSuffix[SegmentedFileSuffix["TIMESTAMP"] = 1] = "TIMESTAMP";
    SegmentedFileSuffix[SegmentedFileSuffix["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SegmentedFileSuffix = exports.SegmentedFileSuffix || (exports.SegmentedFileSuffix = {}));
function segmentedFileSuffixFromJSON(object) {
    switch(object){
        case 0:
        case "INDEX":
            return SegmentedFileSuffix.INDEX;
        case 1:
        case "TIMESTAMP":
            return SegmentedFileSuffix.TIMESTAMP;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SegmentedFileSuffix.UNRECOGNIZED;
    }
}
exports.segmentedFileSuffixFromJSON = segmentedFileSuffixFromJSON;
function segmentedFileSuffixToJSON(object) {
    switch(object){
        case SegmentedFileSuffix.INDEX:
            return "INDEX";
        case SegmentedFileSuffix.TIMESTAMP:
            return "TIMESTAMP";
        case SegmentedFileSuffix.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.segmentedFileSuffixToJSON = segmentedFileSuffixToJSON;
var StreamProtocol;
(function(StreamProtocol) {
    /** DEFAULT_PROTOCOL - protocol chosen based on urls */ StreamProtocol[StreamProtocol["DEFAULT_PROTOCOL"] = 0] = "DEFAULT_PROTOCOL";
    StreamProtocol[StreamProtocol["RTMP"] = 1] = "RTMP";
    StreamProtocol[StreamProtocol["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(StreamProtocol = exports.StreamProtocol || (exports.StreamProtocol = {}));
function streamProtocolFromJSON(object) {
    switch(object){
        case 0:
        case "DEFAULT_PROTOCOL":
            return StreamProtocol.DEFAULT_PROTOCOL;
        case 1:
        case "RTMP":
            return StreamProtocol.RTMP;
        case -1:
        case "UNRECOGNIZED":
        default:
            return StreamProtocol.UNRECOGNIZED;
    }
}
exports.streamProtocolFromJSON = streamProtocolFromJSON;
function streamProtocolToJSON(object) {
    switch(object){
        case StreamProtocol.DEFAULT_PROTOCOL:
            return "DEFAULT_PROTOCOL";
        case StreamProtocol.RTMP:
            return "RTMP";
        case StreamProtocol.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.streamProtocolToJSON = streamProtocolToJSON;
var EncodingOptionsPreset;
(function(EncodingOptionsPreset) {
    /** H264_720P_30 - 1280x720, 30fps, 3000kpbs, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["H264_720P_30"] = 0] = "H264_720P_30";
    /** H264_720P_60 - 1280x720, 60fps, 4500kbps, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["H264_720P_60"] = 1] = "H264_720P_60";
    /** H264_1080P_30 - 1920x1080, 30fps, 4500kbps, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["H264_1080P_30"] = 2] = "H264_1080P_30";
    /** H264_1080P_60 - 1920x1080, 60fps, 6000kbps, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["H264_1080P_60"] = 3] = "H264_1080P_60";
    /** PORTRAIT_H264_720P_30 - 720x1280, 30fps, 3000kpbs, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["PORTRAIT_H264_720P_30"] = 4] = "PORTRAIT_H264_720P_30";
    /** PORTRAIT_H264_720P_60 - 720x1280, 60fps, 4500kbps, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["PORTRAIT_H264_720P_60"] = 5] = "PORTRAIT_H264_720P_60";
    /** PORTRAIT_H264_1080P_30 - 1080x1920, 30fps, 4500kbps, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["PORTRAIT_H264_1080P_30"] = 6] = "PORTRAIT_H264_1080P_30";
    /** PORTRAIT_H264_1080P_60 - 1080x1920, 60fps, 6000kbps, H.264_MAIN / OPUS */ EncodingOptionsPreset[EncodingOptionsPreset["PORTRAIT_H264_1080P_60"] = 7] = "PORTRAIT_H264_1080P_60";
    EncodingOptionsPreset[EncodingOptionsPreset["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(EncodingOptionsPreset = exports.EncodingOptionsPreset || (exports.EncodingOptionsPreset = {}));
function encodingOptionsPresetFromJSON(object) {
    switch(object){
        case 0:
        case "H264_720P_30":
            return EncodingOptionsPreset.H264_720P_30;
        case 1:
        case "H264_720P_60":
            return EncodingOptionsPreset.H264_720P_60;
        case 2:
        case "H264_1080P_30":
            return EncodingOptionsPreset.H264_1080P_30;
        case 3:
        case "H264_1080P_60":
            return EncodingOptionsPreset.H264_1080P_60;
        case 4:
        case "PORTRAIT_H264_720P_30":
            return EncodingOptionsPreset.PORTRAIT_H264_720P_30;
        case 5:
        case "PORTRAIT_H264_720P_60":
            return EncodingOptionsPreset.PORTRAIT_H264_720P_60;
        case 6:
        case "PORTRAIT_H264_1080P_30":
            return EncodingOptionsPreset.PORTRAIT_H264_1080P_30;
        case 7:
        case "PORTRAIT_H264_1080P_60":
            return EncodingOptionsPreset.PORTRAIT_H264_1080P_60;
        case -1:
        case "UNRECOGNIZED":
        default:
            return EncodingOptionsPreset.UNRECOGNIZED;
    }
}
exports.encodingOptionsPresetFromJSON = encodingOptionsPresetFromJSON;
function encodingOptionsPresetToJSON(object) {
    switch(object){
        case EncodingOptionsPreset.H264_720P_30:
            return "H264_720P_30";
        case EncodingOptionsPreset.H264_720P_60:
            return "H264_720P_60";
        case EncodingOptionsPreset.H264_1080P_30:
            return "H264_1080P_30";
        case EncodingOptionsPreset.H264_1080P_60:
            return "H264_1080P_60";
        case EncodingOptionsPreset.PORTRAIT_H264_720P_30:
            return "PORTRAIT_H264_720P_30";
        case EncodingOptionsPreset.PORTRAIT_H264_720P_60:
            return "PORTRAIT_H264_720P_60";
        case EncodingOptionsPreset.PORTRAIT_H264_1080P_30:
            return "PORTRAIT_H264_1080P_30";
        case EncodingOptionsPreset.PORTRAIT_H264_1080P_60:
            return "PORTRAIT_H264_1080P_60";
        case EncodingOptionsPreset.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.encodingOptionsPresetToJSON = encodingOptionsPresetToJSON;
var EgressStatus;
(function(EgressStatus) {
    EgressStatus[EgressStatus["EGRESS_STARTING"] = 0] = "EGRESS_STARTING";
    EgressStatus[EgressStatus["EGRESS_ACTIVE"] = 1] = "EGRESS_ACTIVE";
    EgressStatus[EgressStatus["EGRESS_ENDING"] = 2] = "EGRESS_ENDING";
    EgressStatus[EgressStatus["EGRESS_COMPLETE"] = 3] = "EGRESS_COMPLETE";
    EgressStatus[EgressStatus["EGRESS_FAILED"] = 4] = "EGRESS_FAILED";
    EgressStatus[EgressStatus["EGRESS_ABORTED"] = 5] = "EGRESS_ABORTED";
    EgressStatus[EgressStatus["EGRESS_LIMIT_REACHED"] = 6] = "EGRESS_LIMIT_REACHED";
    EgressStatus[EgressStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(EgressStatus = exports.EgressStatus || (exports.EgressStatus = {}));
function egressStatusFromJSON(object) {
    switch(object){
        case 0:
        case "EGRESS_STARTING":
            return EgressStatus.EGRESS_STARTING;
        case 1:
        case "EGRESS_ACTIVE":
            return EgressStatus.EGRESS_ACTIVE;
        case 2:
        case "EGRESS_ENDING":
            return EgressStatus.EGRESS_ENDING;
        case 3:
        case "EGRESS_COMPLETE":
            return EgressStatus.EGRESS_COMPLETE;
        case 4:
        case "EGRESS_FAILED":
            return EgressStatus.EGRESS_FAILED;
        case 5:
        case "EGRESS_ABORTED":
            return EgressStatus.EGRESS_ABORTED;
        case 6:
        case "EGRESS_LIMIT_REACHED":
            return EgressStatus.EGRESS_LIMIT_REACHED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return EgressStatus.UNRECOGNIZED;
    }
}
exports.egressStatusFromJSON = egressStatusFromJSON;
function egressStatusToJSON(object) {
    switch(object){
        case EgressStatus.EGRESS_STARTING:
            return "EGRESS_STARTING";
        case EgressStatus.EGRESS_ACTIVE:
            return "EGRESS_ACTIVE";
        case EgressStatus.EGRESS_ENDING:
            return "EGRESS_ENDING";
        case EgressStatus.EGRESS_COMPLETE:
            return "EGRESS_COMPLETE";
        case EgressStatus.EGRESS_FAILED:
            return "EGRESS_FAILED";
        case EgressStatus.EGRESS_ABORTED:
            return "EGRESS_ABORTED";
        case EgressStatus.EGRESS_LIMIT_REACHED:
            return "EGRESS_LIMIT_REACHED";
        case EgressStatus.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.egressStatusToJSON = egressStatusToJSON;
var StreamInfo_Status;
(function(StreamInfo_Status) {
    StreamInfo_Status[StreamInfo_Status["ACTIVE"] = 0] = "ACTIVE";
    StreamInfo_Status[StreamInfo_Status["FINISHED"] = 1] = "FINISHED";
    StreamInfo_Status[StreamInfo_Status["FAILED"] = 2] = "FAILED";
    StreamInfo_Status[StreamInfo_Status["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(StreamInfo_Status = exports.StreamInfo_Status || (exports.StreamInfo_Status = {}));
function streamInfo_StatusFromJSON(object) {
    switch(object){
        case 0:
        case "ACTIVE":
            return StreamInfo_Status.ACTIVE;
        case 1:
        case "FINISHED":
            return StreamInfo_Status.FINISHED;
        case 2:
        case "FAILED":
            return StreamInfo_Status.FAILED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return StreamInfo_Status.UNRECOGNIZED;
    }
}
exports.streamInfo_StatusFromJSON = streamInfo_StatusFromJSON;
function streamInfo_StatusToJSON(object) {
    switch(object){
        case StreamInfo_Status.ACTIVE:
            return "ACTIVE";
        case StreamInfo_Status.FINISHED:
            return "FINISHED";
        case StreamInfo_Status.FAILED:
            return "FAILED";
        case StreamInfo_Status.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.streamInfo_StatusToJSON = streamInfo_StatusToJSON;
function createBaseRoomCompositeEgressRequest() {
    return {
        roomName: "",
        layout: "",
        audioOnly: false,
        videoOnly: false,
        customBaseUrl: "",
        file: undefined,
        stream: undefined,
        segments: undefined,
        preset: undefined,
        advanced: undefined,
        fileOutputs: [],
        streamOutputs: [],
        segmentOutputs: []
    };
}
exports.RoomCompositeEgressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(10).string(message.roomName);
        }
        if (message.layout !== undefined && message.layout !== "") {
            writer.uint32(18).string(message.layout);
        }
        if (message.audioOnly === true) {
            writer.uint32(24).bool(message.audioOnly);
        }
        if (message.videoOnly === true) {
            writer.uint32(32).bool(message.videoOnly);
        }
        if (message.customBaseUrl !== undefined && message.customBaseUrl !== "") {
            writer.uint32(42).string(message.customBaseUrl);
        }
        if (message.file !== undefined) {
            exports.EncodedFileOutput.encode(message.file, writer.uint32(50).fork()).ldelim();
        }
        if (message.stream !== undefined) {
            exports.StreamOutput.encode(message.stream, writer.uint32(58).fork()).ldelim();
        }
        if (message.segments !== undefined) {
            exports.SegmentedFileOutput.encode(message.segments, writer.uint32(82).fork()).ldelim();
        }
        if (message.preset !== undefined) {
            writer.uint32(64).int32(message.preset);
        }
        if (message.advanced !== undefined) {
            exports.EncodingOptions.encode(message.advanced, writer.uint32(74).fork()).ldelim();
        }
        if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
            for (const v of message.fileOutputs){
                exports.EncodedFileOutput.encode(v, writer.uint32(90).fork()).ldelim();
            }
        }
        if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
            for (const v of message.streamOutputs){
                exports.StreamOutput.encode(v, writer.uint32(98).fork()).ldelim();
            }
        }
        if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
            for (const v of message.segmentOutputs){
                exports.SegmentedFileOutput.encode(v, writer.uint32(106).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRoomCompositeEgressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.roomName = reader.string();
                    break;
                case 2:
                    message.layout = reader.string();
                    break;
                case 3:
                    message.audioOnly = reader.bool();
                    break;
                case 4:
                    message.videoOnly = reader.bool();
                    break;
                case 5:
                    message.customBaseUrl = reader.string();
                    break;
                case 6:
                    message.file = exports.EncodedFileOutput.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.stream = exports.StreamOutput.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.segments = exports.SegmentedFileOutput.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.preset = reader.int32();
                    break;
                case 9:
                    message.advanced = exports.EncodingOptions.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.fileOutputs.push(exports.EncodedFileOutput.decode(reader, reader.uint32()));
                    break;
                case 12:
                    message.streamOutputs.push(exports.StreamOutput.decode(reader, reader.uint32()));
                    break;
                case 13:
                    message.segmentOutputs.push(exports.SegmentedFileOutput.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            layout: isSet(object.layout) ? String(object.layout) : "",
            audioOnly: isSet(object.audioOnly) ? Boolean(object.audioOnly) : false,
            videoOnly: isSet(object.videoOnly) ? Boolean(object.videoOnly) : false,
            customBaseUrl: isSet(object.customBaseUrl) ? String(object.customBaseUrl) : "",
            file: isSet(object.file) ? exports.EncodedFileOutput.fromJSON(object.file) : undefined,
            stream: isSet(object.stream) ? exports.StreamOutput.fromJSON(object.stream) : undefined,
            segments: isSet(object.segments) ? exports.SegmentedFileOutput.fromJSON(object.segments) : undefined,
            preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
            advanced: isSet(object.advanced) ? exports.EncodingOptions.fromJSON(object.advanced) : undefined,
            fileOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.fileOutputs) ? object.fileOutputs.map((e)=>exports.EncodedFileOutput.fromJSON(e)) : [],
            streamOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.streamOutputs) ? object.streamOutputs.map((e)=>exports.StreamOutput.fromJSON(e)) : [],
            segmentOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.segmentOutputs) ? object.segmentOutputs.map((e)=>exports.SegmentedFileOutput.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.layout !== undefined && (obj.layout = message.layout);
        message.audioOnly !== undefined && (obj.audioOnly = message.audioOnly);
        message.videoOnly !== undefined && (obj.videoOnly = message.videoOnly);
        message.customBaseUrl !== undefined && (obj.customBaseUrl = message.customBaseUrl);
        message.file !== undefined && (obj.file = message.file ? exports.EncodedFileOutput.toJSON(message.file) : undefined);
        message.stream !== undefined && (obj.stream = message.stream ? exports.StreamOutput.toJSON(message.stream) : undefined);
        message.segments !== undefined && (obj.segments = message.segments ? exports.SegmentedFileOutput.toJSON(message.segments) : undefined);
        message.preset !== undefined && (obj.preset = message.preset !== undefined ? encodingOptionsPresetToJSON(message.preset) : undefined);
        message.advanced !== undefined && (obj.advanced = message.advanced ? exports.EncodingOptions.toJSON(message.advanced) : undefined);
        if (message.fileOutputs) {
            obj.fileOutputs = message.fileOutputs.map((e)=>e ? exports.EncodedFileOutput.toJSON(e) : undefined);
        } else {
            obj.fileOutputs = [];
        }
        if (message.streamOutputs) {
            obj.streamOutputs = message.streamOutputs.map((e)=>e ? exports.StreamOutput.toJSON(e) : undefined);
        } else {
            obj.streamOutputs = [];
        }
        if (message.segmentOutputs) {
            obj.segmentOutputs = message.segmentOutputs.map((e)=>e ? exports.SegmentedFileOutput.toJSON(e) : undefined);
        } else {
            obj.segmentOutputs = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseRoomCompositeEgressRequest();
        message.roomName = (_a = object.roomName) !== null && _a !== void 0 ? _a : "";
        message.layout = (_b = object.layout) !== null && _b !== void 0 ? _b : "";
        message.audioOnly = (_c = object.audioOnly) !== null && _c !== void 0 ? _c : false;
        message.videoOnly = (_d = object.videoOnly) !== null && _d !== void 0 ? _d : false;
        message.customBaseUrl = (_e = object.customBaseUrl) !== null && _e !== void 0 ? _e : "";
        message.file = object.file !== undefined && object.file !== null ? exports.EncodedFileOutput.fromPartial(object.file) : undefined;
        message.stream = object.stream !== undefined && object.stream !== null ? exports.StreamOutput.fromPartial(object.stream) : undefined;
        message.segments = object.segments !== undefined && object.segments !== null ? exports.SegmentedFileOutput.fromPartial(object.segments) : undefined;
        message.preset = (_f = object.preset) !== null && _f !== void 0 ? _f : undefined;
        message.advanced = object.advanced !== undefined && object.advanced !== null ? exports.EncodingOptions.fromPartial(object.advanced) : undefined;
        message.fileOutputs = ((_g = object.fileOutputs) === null || _g === void 0 ? void 0 : _g.map((e)=>exports.EncodedFileOutput.fromPartial(e))) || [];
        message.streamOutputs = ((_h = object.streamOutputs) === null || _h === void 0 ? void 0 : _h.map((e)=>exports.StreamOutput.fromPartial(e))) || [];
        message.segmentOutputs = ((_j = object.segmentOutputs) === null || _j === void 0 ? void 0 : _j.map((e)=>exports.SegmentedFileOutput.fromPartial(e))) || [];
        return message;
    }
};
function createBaseWebEgressRequest() {
    return {
        url: "",
        audioOnly: false,
        videoOnly: false,
        awaitStartSignal: false,
        file: undefined,
        stream: undefined,
        segments: undefined,
        preset: undefined,
        advanced: undefined,
        fileOutputs: [],
        streamOutputs: [],
        segmentOutputs: []
    };
}
exports.WebEgressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.url !== undefined && message.url !== "") {
            writer.uint32(10).string(message.url);
        }
        if (message.audioOnly === true) {
            writer.uint32(16).bool(message.audioOnly);
        }
        if (message.videoOnly === true) {
            writer.uint32(24).bool(message.videoOnly);
        }
        if (message.awaitStartSignal === true) {
            writer.uint32(96).bool(message.awaitStartSignal);
        }
        if (message.file !== undefined) {
            exports.EncodedFileOutput.encode(message.file, writer.uint32(34).fork()).ldelim();
        }
        if (message.stream !== undefined) {
            exports.StreamOutput.encode(message.stream, writer.uint32(42).fork()).ldelim();
        }
        if (message.segments !== undefined) {
            exports.SegmentedFileOutput.encode(message.segments, writer.uint32(50).fork()).ldelim();
        }
        if (message.preset !== undefined) {
            writer.uint32(56).int32(message.preset);
        }
        if (message.advanced !== undefined) {
            exports.EncodingOptions.encode(message.advanced, writer.uint32(66).fork()).ldelim();
        }
        if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
            for (const v of message.fileOutputs){
                exports.EncodedFileOutput.encode(v, writer.uint32(74).fork()).ldelim();
            }
        }
        if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
            for (const v of message.streamOutputs){
                exports.StreamOutput.encode(v, writer.uint32(82).fork()).ldelim();
            }
        }
        if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
            for (const v of message.segmentOutputs){
                exports.SegmentedFileOutput.encode(v, writer.uint32(90).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWebEgressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.audioOnly = reader.bool();
                    break;
                case 3:
                    message.videoOnly = reader.bool();
                    break;
                case 12:
                    message.awaitStartSignal = reader.bool();
                    break;
                case 4:
                    message.file = exports.EncodedFileOutput.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.stream = exports.StreamOutput.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.segments = exports.SegmentedFileOutput.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.preset = reader.int32();
                    break;
                case 8:
                    message.advanced = exports.EncodingOptions.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.fileOutputs.push(exports.EncodedFileOutput.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.streamOutputs.push(exports.StreamOutput.decode(reader, reader.uint32()));
                    break;
                case 11:
                    message.segmentOutputs.push(exports.SegmentedFileOutput.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            url: isSet(object.url) ? String(object.url) : "",
            audioOnly: isSet(object.audioOnly) ? Boolean(object.audioOnly) : false,
            videoOnly: isSet(object.videoOnly) ? Boolean(object.videoOnly) : false,
            awaitStartSignal: isSet(object.awaitStartSignal) ? Boolean(object.awaitStartSignal) : false,
            file: isSet(object.file) ? exports.EncodedFileOutput.fromJSON(object.file) : undefined,
            stream: isSet(object.stream) ? exports.StreamOutput.fromJSON(object.stream) : undefined,
            segments: isSet(object.segments) ? exports.SegmentedFileOutput.fromJSON(object.segments) : undefined,
            preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
            advanced: isSet(object.advanced) ? exports.EncodingOptions.fromJSON(object.advanced) : undefined,
            fileOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.fileOutputs) ? object.fileOutputs.map((e)=>exports.EncodedFileOutput.fromJSON(e)) : [],
            streamOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.streamOutputs) ? object.streamOutputs.map((e)=>exports.StreamOutput.fromJSON(e)) : [],
            segmentOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.segmentOutputs) ? object.segmentOutputs.map((e)=>exports.SegmentedFileOutput.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.url !== undefined && (obj.url = message.url);
        message.audioOnly !== undefined && (obj.audioOnly = message.audioOnly);
        message.videoOnly !== undefined && (obj.videoOnly = message.videoOnly);
        message.awaitStartSignal !== undefined && (obj.awaitStartSignal = message.awaitStartSignal);
        message.file !== undefined && (obj.file = message.file ? exports.EncodedFileOutput.toJSON(message.file) : undefined);
        message.stream !== undefined && (obj.stream = message.stream ? exports.StreamOutput.toJSON(message.stream) : undefined);
        message.segments !== undefined && (obj.segments = message.segments ? exports.SegmentedFileOutput.toJSON(message.segments) : undefined);
        message.preset !== undefined && (obj.preset = message.preset !== undefined ? encodingOptionsPresetToJSON(message.preset) : undefined);
        message.advanced !== undefined && (obj.advanced = message.advanced ? exports.EncodingOptions.toJSON(message.advanced) : undefined);
        if (message.fileOutputs) {
            obj.fileOutputs = message.fileOutputs.map((e)=>e ? exports.EncodedFileOutput.toJSON(e) : undefined);
        } else {
            obj.fileOutputs = [];
        }
        if (message.streamOutputs) {
            obj.streamOutputs = message.streamOutputs.map((e)=>e ? exports.StreamOutput.toJSON(e) : undefined);
        } else {
            obj.streamOutputs = [];
        }
        if (message.segmentOutputs) {
            obj.segmentOutputs = message.segmentOutputs.map((e)=>e ? exports.SegmentedFileOutput.toJSON(e) : undefined);
        } else {
            obj.segmentOutputs = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBaseWebEgressRequest();
        message.url = (_a = object.url) !== null && _a !== void 0 ? _a : "";
        message.audioOnly = (_b = object.audioOnly) !== null && _b !== void 0 ? _b : false;
        message.videoOnly = (_c = object.videoOnly) !== null && _c !== void 0 ? _c : false;
        message.awaitStartSignal = (_d = object.awaitStartSignal) !== null && _d !== void 0 ? _d : false;
        message.file = object.file !== undefined && object.file !== null ? exports.EncodedFileOutput.fromPartial(object.file) : undefined;
        message.stream = object.stream !== undefined && object.stream !== null ? exports.StreamOutput.fromPartial(object.stream) : undefined;
        message.segments = object.segments !== undefined && object.segments !== null ? exports.SegmentedFileOutput.fromPartial(object.segments) : undefined;
        message.preset = (_e = object.preset) !== null && _e !== void 0 ? _e : undefined;
        message.advanced = object.advanced !== undefined && object.advanced !== null ? exports.EncodingOptions.fromPartial(object.advanced) : undefined;
        message.fileOutputs = ((_f = object.fileOutputs) === null || _f === void 0 ? void 0 : _f.map((e)=>exports.EncodedFileOutput.fromPartial(e))) || [];
        message.streamOutputs = ((_g = object.streamOutputs) === null || _g === void 0 ? void 0 : _g.map((e)=>exports.StreamOutput.fromPartial(e))) || [];
        message.segmentOutputs = ((_h = object.segmentOutputs) === null || _h === void 0 ? void 0 : _h.map((e)=>exports.SegmentedFileOutput.fromPartial(e))) || [];
        return message;
    }
};
function createBaseTrackCompositeEgressRequest() {
    return {
        roomName: "",
        audioTrackId: "",
        videoTrackId: "",
        file: undefined,
        stream: undefined,
        segments: undefined,
        preset: undefined,
        advanced: undefined,
        fileOutputs: [],
        streamOutputs: [],
        segmentOutputs: []
    };
}
exports.TrackCompositeEgressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(10).string(message.roomName);
        }
        if (message.audioTrackId !== undefined && message.audioTrackId !== "") {
            writer.uint32(18).string(message.audioTrackId);
        }
        if (message.videoTrackId !== undefined && message.videoTrackId !== "") {
            writer.uint32(26).string(message.videoTrackId);
        }
        if (message.file !== undefined) {
            exports.EncodedFileOutput.encode(message.file, writer.uint32(34).fork()).ldelim();
        }
        if (message.stream !== undefined) {
            exports.StreamOutput.encode(message.stream, writer.uint32(42).fork()).ldelim();
        }
        if (message.segments !== undefined) {
            exports.SegmentedFileOutput.encode(message.segments, writer.uint32(66).fork()).ldelim();
        }
        if (message.preset !== undefined) {
            writer.uint32(48).int32(message.preset);
        }
        if (message.advanced !== undefined) {
            exports.EncodingOptions.encode(message.advanced, writer.uint32(58).fork()).ldelim();
        }
        if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
            for (const v of message.fileOutputs){
                exports.EncodedFileOutput.encode(v, writer.uint32(90).fork()).ldelim();
            }
        }
        if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
            for (const v of message.streamOutputs){
                exports.StreamOutput.encode(v, writer.uint32(98).fork()).ldelim();
            }
        }
        if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
            for (const v of message.segmentOutputs){
                exports.SegmentedFileOutput.encode(v, writer.uint32(106).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTrackCompositeEgressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.roomName = reader.string();
                    break;
                case 2:
                    message.audioTrackId = reader.string();
                    break;
                case 3:
                    message.videoTrackId = reader.string();
                    break;
                case 4:
                    message.file = exports.EncodedFileOutput.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.stream = exports.StreamOutput.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.segments = exports.SegmentedFileOutput.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.preset = reader.int32();
                    break;
                case 7:
                    message.advanced = exports.EncodingOptions.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.fileOutputs.push(exports.EncodedFileOutput.decode(reader, reader.uint32()));
                    break;
                case 12:
                    message.streamOutputs.push(exports.StreamOutput.decode(reader, reader.uint32()));
                    break;
                case 13:
                    message.segmentOutputs.push(exports.SegmentedFileOutput.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            audioTrackId: isSet(object.audioTrackId) ? String(object.audioTrackId) : "",
            videoTrackId: isSet(object.videoTrackId) ? String(object.videoTrackId) : "",
            file: isSet(object.file) ? exports.EncodedFileOutput.fromJSON(object.file) : undefined,
            stream: isSet(object.stream) ? exports.StreamOutput.fromJSON(object.stream) : undefined,
            segments: isSet(object.segments) ? exports.SegmentedFileOutput.fromJSON(object.segments) : undefined,
            preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
            advanced: isSet(object.advanced) ? exports.EncodingOptions.fromJSON(object.advanced) : undefined,
            fileOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.fileOutputs) ? object.fileOutputs.map((e)=>exports.EncodedFileOutput.fromJSON(e)) : [],
            streamOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.streamOutputs) ? object.streamOutputs.map((e)=>exports.StreamOutput.fromJSON(e)) : [],
            segmentOutputs: Array.isArray(object === null || object === void 0 ? void 0 : object.segmentOutputs) ? object.segmentOutputs.map((e)=>exports.SegmentedFileOutput.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.audioTrackId !== undefined && (obj.audioTrackId = message.audioTrackId);
        message.videoTrackId !== undefined && (obj.videoTrackId = message.videoTrackId);
        message.file !== undefined && (obj.file = message.file ? exports.EncodedFileOutput.toJSON(message.file) : undefined);
        message.stream !== undefined && (obj.stream = message.stream ? exports.StreamOutput.toJSON(message.stream) : undefined);
        message.segments !== undefined && (obj.segments = message.segments ? exports.SegmentedFileOutput.toJSON(message.segments) : undefined);
        message.preset !== undefined && (obj.preset = message.preset !== undefined ? encodingOptionsPresetToJSON(message.preset) : undefined);
        message.advanced !== undefined && (obj.advanced = message.advanced ? exports.EncodingOptions.toJSON(message.advanced) : undefined);
        if (message.fileOutputs) {
            obj.fileOutputs = message.fileOutputs.map((e)=>e ? exports.EncodedFileOutput.toJSON(e) : undefined);
        } else {
            obj.fileOutputs = [];
        }
        if (message.streamOutputs) {
            obj.streamOutputs = message.streamOutputs.map((e)=>e ? exports.StreamOutput.toJSON(e) : undefined);
        } else {
            obj.streamOutputs = [];
        }
        if (message.segmentOutputs) {
            obj.segmentOutputs = message.segmentOutputs.map((e)=>e ? exports.SegmentedFileOutput.toJSON(e) : undefined);
        } else {
            obj.segmentOutputs = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseTrackCompositeEgressRequest();
        message.roomName = (_a = object.roomName) !== null && _a !== void 0 ? _a : "";
        message.audioTrackId = (_b = object.audioTrackId) !== null && _b !== void 0 ? _b : "";
        message.videoTrackId = (_c = object.videoTrackId) !== null && _c !== void 0 ? _c : "";
        message.file = object.file !== undefined && object.file !== null ? exports.EncodedFileOutput.fromPartial(object.file) : undefined;
        message.stream = object.stream !== undefined && object.stream !== null ? exports.StreamOutput.fromPartial(object.stream) : undefined;
        message.segments = object.segments !== undefined && object.segments !== null ? exports.SegmentedFileOutput.fromPartial(object.segments) : undefined;
        message.preset = (_d = object.preset) !== null && _d !== void 0 ? _d : undefined;
        message.advanced = object.advanced !== undefined && object.advanced !== null ? exports.EncodingOptions.fromPartial(object.advanced) : undefined;
        message.fileOutputs = ((_e = object.fileOutputs) === null || _e === void 0 ? void 0 : _e.map((e)=>exports.EncodedFileOutput.fromPartial(e))) || [];
        message.streamOutputs = ((_f = object.streamOutputs) === null || _f === void 0 ? void 0 : _f.map((e)=>exports.StreamOutput.fromPartial(e))) || [];
        message.segmentOutputs = ((_g = object.segmentOutputs) === null || _g === void 0 ? void 0 : _g.map((e)=>exports.SegmentedFileOutput.fromPartial(e))) || [];
        return message;
    }
};
function createBaseTrackEgressRequest() {
    return {
        roomName: "",
        trackId: "",
        file: undefined,
        websocketUrl: undefined
    };
}
exports.TrackEgressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(10).string(message.roomName);
        }
        if (message.trackId !== undefined && message.trackId !== "") {
            writer.uint32(18).string(message.trackId);
        }
        if (message.file !== undefined) {
            exports.DirectFileOutput.encode(message.file, writer.uint32(26).fork()).ldelim();
        }
        if (message.websocketUrl !== undefined) {
            writer.uint32(34).string(message.websocketUrl);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTrackEgressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.roomName = reader.string();
                    break;
                case 2:
                    message.trackId = reader.string();
                    break;
                case 3:
                    message.file = exports.DirectFileOutput.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.websocketUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            trackId: isSet(object.trackId) ? String(object.trackId) : "",
            file: isSet(object.file) ? exports.DirectFileOutput.fromJSON(object.file) : undefined,
            websocketUrl: isSet(object.websocketUrl) ? String(object.websocketUrl) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.trackId !== undefined && (obj.trackId = message.trackId);
        message.file !== undefined && (obj.file = message.file ? exports.DirectFileOutput.toJSON(message.file) : undefined);
        message.websocketUrl !== undefined && (obj.websocketUrl = message.websocketUrl);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseTrackEgressRequest();
        message.roomName = (_a = object.roomName) !== null && _a !== void 0 ? _a : "";
        message.trackId = (_b = object.trackId) !== null && _b !== void 0 ? _b : "";
        message.file = object.file !== undefined && object.file !== null ? exports.DirectFileOutput.fromPartial(object.file) : undefined;
        message.websocketUrl = (_c = object.websocketUrl) !== null && _c !== void 0 ? _c : undefined;
        return message;
    }
};
function createBaseEncodedFileOutput() {
    return {
        fileType: 0,
        filepath: "",
        disableManifest: false,
        s3: undefined,
        gcp: undefined,
        azure: undefined,
        aliOSS: undefined
    };
}
exports.EncodedFileOutput = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.fileType !== undefined && message.fileType !== 0) {
            writer.uint32(8).int32(message.fileType);
        }
        if (message.filepath !== undefined && message.filepath !== "") {
            writer.uint32(18).string(message.filepath);
        }
        if (message.disableManifest === true) {
            writer.uint32(48).bool(message.disableManifest);
        }
        if (message.s3 !== undefined) {
            exports.S3Upload.encode(message.s3, writer.uint32(26).fork()).ldelim();
        }
        if (message.gcp !== undefined) {
            exports.GCPUpload.encode(message.gcp, writer.uint32(34).fork()).ldelim();
        }
        if (message.azure !== undefined) {
            exports.AzureBlobUpload.encode(message.azure, writer.uint32(42).fork()).ldelim();
        }
        if (message.aliOSS !== undefined) {
            exports.AliOSSUpload.encode(message.aliOSS, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEncodedFileOutput();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.fileType = reader.int32();
                    break;
                case 2:
                    message.filepath = reader.string();
                    break;
                case 6:
                    message.disableManifest = reader.bool();
                    break;
                case 3:
                    message.s3 = exports.S3Upload.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.gcp = exports.GCPUpload.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.azure = exports.AzureBlobUpload.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.aliOSS = exports.AliOSSUpload.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            fileType: isSet(object.fileType) ? encodedFileTypeFromJSON(object.fileType) : 0,
            filepath: isSet(object.filepath) ? String(object.filepath) : "",
            disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
            s3: isSet(object.s3) ? exports.S3Upload.fromJSON(object.s3) : undefined,
            gcp: isSet(object.gcp) ? exports.GCPUpload.fromJSON(object.gcp) : undefined,
            azure: isSet(object.azure) ? exports.AzureBlobUpload.fromJSON(object.azure) : undefined,
            aliOSS: isSet(object.aliOSS) ? exports.AliOSSUpload.fromJSON(object.aliOSS) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.fileType !== undefined && (obj.fileType = encodedFileTypeToJSON(message.fileType));
        message.filepath !== undefined && (obj.filepath = message.filepath);
        message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
        message.s3 !== undefined && (obj.s3 = message.s3 ? exports.S3Upload.toJSON(message.s3) : undefined);
        message.gcp !== undefined && (obj.gcp = message.gcp ? exports.GCPUpload.toJSON(message.gcp) : undefined);
        message.azure !== undefined && (obj.azure = message.azure ? exports.AzureBlobUpload.toJSON(message.azure) : undefined);
        message.aliOSS !== undefined && (obj.aliOSS = message.aliOSS ? exports.AliOSSUpload.toJSON(message.aliOSS) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseEncodedFileOutput();
        message.fileType = (_a = object.fileType) !== null && _a !== void 0 ? _a : 0;
        message.filepath = (_b = object.filepath) !== null && _b !== void 0 ? _b : "";
        message.disableManifest = (_c = object.disableManifest) !== null && _c !== void 0 ? _c : false;
        message.s3 = object.s3 !== undefined && object.s3 !== null ? exports.S3Upload.fromPartial(object.s3) : undefined;
        message.gcp = object.gcp !== undefined && object.gcp !== null ? exports.GCPUpload.fromPartial(object.gcp) : undefined;
        message.azure = object.azure !== undefined && object.azure !== null ? exports.AzureBlobUpload.fromPartial(object.azure) : undefined;
        message.aliOSS = object.aliOSS !== undefined && object.aliOSS !== null ? exports.AliOSSUpload.fromPartial(object.aliOSS) : undefined;
        return message;
    }
};
function createBaseSegmentedFileOutput() {
    return {
        protocol: 0,
        filenamePrefix: "",
        playlistName: "",
        segmentDuration: 0,
        filenameSuffix: 0,
        disableManifest: false,
        s3: undefined,
        gcp: undefined,
        azure: undefined,
        aliOSS: undefined
    };
}
exports.SegmentedFileOutput = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.protocol !== undefined && message.protocol !== 0) {
            writer.uint32(8).int32(message.protocol);
        }
        if (message.filenamePrefix !== undefined && message.filenamePrefix !== "") {
            writer.uint32(18).string(message.filenamePrefix);
        }
        if (message.playlistName !== undefined && message.playlistName !== "") {
            writer.uint32(26).string(message.playlistName);
        }
        if (message.segmentDuration !== undefined && message.segmentDuration !== 0) {
            writer.uint32(32).uint32(message.segmentDuration);
        }
        if (message.filenameSuffix !== undefined && message.filenameSuffix !== 0) {
            writer.uint32(80).int32(message.filenameSuffix);
        }
        if (message.disableManifest === true) {
            writer.uint32(64).bool(message.disableManifest);
        }
        if (message.s3 !== undefined) {
            exports.S3Upload.encode(message.s3, writer.uint32(42).fork()).ldelim();
        }
        if (message.gcp !== undefined) {
            exports.GCPUpload.encode(message.gcp, writer.uint32(50).fork()).ldelim();
        }
        if (message.azure !== undefined) {
            exports.AzureBlobUpload.encode(message.azure, writer.uint32(58).fork()).ldelim();
        }
        if (message.aliOSS !== undefined) {
            exports.AliOSSUpload.encode(message.aliOSS, writer.uint32(74).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSegmentedFileOutput();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.protocol = reader.int32();
                    break;
                case 2:
                    message.filenamePrefix = reader.string();
                    break;
                case 3:
                    message.playlistName = reader.string();
                    break;
                case 4:
                    message.segmentDuration = reader.uint32();
                    break;
                case 10:
                    message.filenameSuffix = reader.int32();
                    break;
                case 8:
                    message.disableManifest = reader.bool();
                    break;
                case 5:
                    message.s3 = exports.S3Upload.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.gcp = exports.GCPUpload.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.azure = exports.AzureBlobUpload.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.aliOSS = exports.AliOSSUpload.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            protocol: isSet(object.protocol) ? segmentedFileProtocolFromJSON(object.protocol) : 0,
            filenamePrefix: isSet(object.filenamePrefix) ? String(object.filenamePrefix) : "",
            playlistName: isSet(object.playlistName) ? String(object.playlistName) : "",
            segmentDuration: isSet(object.segmentDuration) ? Number(object.segmentDuration) : 0,
            filenameSuffix: isSet(object.filenameSuffix) ? segmentedFileSuffixFromJSON(object.filenameSuffix) : 0,
            disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
            s3: isSet(object.s3) ? exports.S3Upload.fromJSON(object.s3) : undefined,
            gcp: isSet(object.gcp) ? exports.GCPUpload.fromJSON(object.gcp) : undefined,
            azure: isSet(object.azure) ? exports.AzureBlobUpload.fromJSON(object.azure) : undefined,
            aliOSS: isSet(object.aliOSS) ? exports.AliOSSUpload.fromJSON(object.aliOSS) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.protocol !== undefined && (obj.protocol = segmentedFileProtocolToJSON(message.protocol));
        message.filenamePrefix !== undefined && (obj.filenamePrefix = message.filenamePrefix);
        message.playlistName !== undefined && (obj.playlistName = message.playlistName);
        message.segmentDuration !== undefined && (obj.segmentDuration = Math.round(message.segmentDuration));
        message.filenameSuffix !== undefined && (obj.filenameSuffix = segmentedFileSuffixToJSON(message.filenameSuffix));
        message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
        message.s3 !== undefined && (obj.s3 = message.s3 ? exports.S3Upload.toJSON(message.s3) : undefined);
        message.gcp !== undefined && (obj.gcp = message.gcp ? exports.GCPUpload.toJSON(message.gcp) : undefined);
        message.azure !== undefined && (obj.azure = message.azure ? exports.AzureBlobUpload.toJSON(message.azure) : undefined);
        message.aliOSS !== undefined && (obj.aliOSS = message.aliOSS ? exports.AliOSSUpload.toJSON(message.aliOSS) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseSegmentedFileOutput();
        message.protocol = (_a = object.protocol) !== null && _a !== void 0 ? _a : 0;
        message.filenamePrefix = (_b = object.filenamePrefix) !== null && _b !== void 0 ? _b : "";
        message.playlistName = (_c = object.playlistName) !== null && _c !== void 0 ? _c : "";
        message.segmentDuration = (_d = object.segmentDuration) !== null && _d !== void 0 ? _d : 0;
        message.filenameSuffix = (_e = object.filenameSuffix) !== null && _e !== void 0 ? _e : 0;
        message.disableManifest = (_f = object.disableManifest) !== null && _f !== void 0 ? _f : false;
        message.s3 = object.s3 !== undefined && object.s3 !== null ? exports.S3Upload.fromPartial(object.s3) : undefined;
        message.gcp = object.gcp !== undefined && object.gcp !== null ? exports.GCPUpload.fromPartial(object.gcp) : undefined;
        message.azure = object.azure !== undefined && object.azure !== null ? exports.AzureBlobUpload.fromPartial(object.azure) : undefined;
        message.aliOSS = object.aliOSS !== undefined && object.aliOSS !== null ? exports.AliOSSUpload.fromPartial(object.aliOSS) : undefined;
        return message;
    }
};
function createBaseDirectFileOutput() {
    return {
        filepath: "",
        disableManifest: false,
        s3: undefined,
        gcp: undefined,
        azure: undefined,
        aliOSS: undefined
    };
}
exports.DirectFileOutput = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.filepath !== undefined && message.filepath !== "") {
            writer.uint32(10).string(message.filepath);
        }
        if (message.disableManifest === true) {
            writer.uint32(40).bool(message.disableManifest);
        }
        if (message.s3 !== undefined) {
            exports.S3Upload.encode(message.s3, writer.uint32(18).fork()).ldelim();
        }
        if (message.gcp !== undefined) {
            exports.GCPUpload.encode(message.gcp, writer.uint32(26).fork()).ldelim();
        }
        if (message.azure !== undefined) {
            exports.AzureBlobUpload.encode(message.azure, writer.uint32(34).fork()).ldelim();
        }
        if (message.aliOSS !== undefined) {
            exports.AliOSSUpload.encode(message.aliOSS, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDirectFileOutput();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.filepath = reader.string();
                    break;
                case 5:
                    message.disableManifest = reader.bool();
                    break;
                case 2:
                    message.s3 = exports.S3Upload.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.gcp = exports.GCPUpload.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.azure = exports.AzureBlobUpload.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.aliOSS = exports.AliOSSUpload.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            filepath: isSet(object.filepath) ? String(object.filepath) : "",
            disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
            s3: isSet(object.s3) ? exports.S3Upload.fromJSON(object.s3) : undefined,
            gcp: isSet(object.gcp) ? exports.GCPUpload.fromJSON(object.gcp) : undefined,
            azure: isSet(object.azure) ? exports.AzureBlobUpload.fromJSON(object.azure) : undefined,
            aliOSS: isSet(object.aliOSS) ? exports.AliOSSUpload.fromJSON(object.aliOSS) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.filepath !== undefined && (obj.filepath = message.filepath);
        message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
        message.s3 !== undefined && (obj.s3 = message.s3 ? exports.S3Upload.toJSON(message.s3) : undefined);
        message.gcp !== undefined && (obj.gcp = message.gcp ? exports.GCPUpload.toJSON(message.gcp) : undefined);
        message.azure !== undefined && (obj.azure = message.azure ? exports.AzureBlobUpload.toJSON(message.azure) : undefined);
        message.aliOSS !== undefined && (obj.aliOSS = message.aliOSS ? exports.AliOSSUpload.toJSON(message.aliOSS) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseDirectFileOutput();
        message.filepath = (_a = object.filepath) !== null && _a !== void 0 ? _a : "";
        message.disableManifest = (_b = object.disableManifest) !== null && _b !== void 0 ? _b : false;
        message.s3 = object.s3 !== undefined && object.s3 !== null ? exports.S3Upload.fromPartial(object.s3) : undefined;
        message.gcp = object.gcp !== undefined && object.gcp !== null ? exports.GCPUpload.fromPartial(object.gcp) : undefined;
        message.azure = object.azure !== undefined && object.azure !== null ? exports.AzureBlobUpload.fromPartial(object.azure) : undefined;
        message.aliOSS = object.aliOSS !== undefined && object.aliOSS !== null ? exports.AliOSSUpload.fromPartial(object.aliOSS) : undefined;
        return message;
    }
};
function createBaseS3Upload() {
    return {
        accessKey: "",
        secret: "",
        region: "",
        endpoint: "",
        bucket: "",
        forcePathStyle: false,
        metadata: {},
        tagging: ""
    };
}
exports.S3Upload = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.accessKey !== undefined && message.accessKey !== "") {
            writer.uint32(10).string(message.accessKey);
        }
        if (message.secret !== undefined && message.secret !== "") {
            writer.uint32(18).string(message.secret);
        }
        if (message.region !== undefined && message.region !== "") {
            writer.uint32(26).string(message.region);
        }
        if (message.endpoint !== undefined && message.endpoint !== "") {
            writer.uint32(34).string(message.endpoint);
        }
        if (message.bucket !== undefined && message.bucket !== "") {
            writer.uint32(42).string(message.bucket);
        }
        if (message.forcePathStyle === true) {
            writer.uint32(48).bool(message.forcePathStyle);
        }
        Object.entries(message.metadata || {}).forEach(([key, value])=>{
            exports.S3Upload_MetadataEntry.encode({
                key: key,
                value
            }, writer.uint32(58).fork()).ldelim();
        });
        if (message.tagging !== undefined && message.tagging !== "") {
            writer.uint32(66).string(message.tagging);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseS3Upload();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.accessKey = reader.string();
                    break;
                case 2:
                    message.secret = reader.string();
                    break;
                case 3:
                    message.region = reader.string();
                    break;
                case 4:
                    message.endpoint = reader.string();
                    break;
                case 5:
                    message.bucket = reader.string();
                    break;
                case 6:
                    message.forcePathStyle = reader.bool();
                    break;
                case 7:
                    const entry7 = exports.S3Upload_MetadataEntry.decode(reader, reader.uint32());
                    if (entry7.value !== undefined) {
                        message.metadata[entry7.key] = entry7.value;
                    }
                    break;
                case 8:
                    message.tagging = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            accessKey: isSet(object.accessKey) ? String(object.accessKey) : "",
            secret: isSet(object.secret) ? String(object.secret) : "",
            region: isSet(object.region) ? String(object.region) : "",
            endpoint: isSet(object.endpoint) ? String(object.endpoint) : "",
            bucket: isSet(object.bucket) ? String(object.bucket) : "",
            forcePathStyle: isSet(object.forcePathStyle) ? Boolean(object.forcePathStyle) : false,
            metadata: isObject(object.metadata) ? Object.entries(object.metadata).reduce((acc, [key, value])=>{
                acc[key] = String(value);
                return acc;
            }, {}) : {},
            tagging: isSet(object.tagging) ? String(object.tagging) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.accessKey !== undefined && (obj.accessKey = message.accessKey);
        message.secret !== undefined && (obj.secret = message.secret);
        message.region !== undefined && (obj.region = message.region);
        message.endpoint !== undefined && (obj.endpoint = message.endpoint);
        message.bucket !== undefined && (obj.bucket = message.bucket);
        message.forcePathStyle !== undefined && (obj.forcePathStyle = message.forcePathStyle);
        obj.metadata = {};
        if (message.metadata) {
            Object.entries(message.metadata).forEach(([k, v])=>{
                obj.metadata[k] = v;
            });
        }
        message.tagging !== undefined && (obj.tagging = message.tagging);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBaseS3Upload();
        message.accessKey = (_a = object.accessKey) !== null && _a !== void 0 ? _a : "";
        message.secret = (_b = object.secret) !== null && _b !== void 0 ? _b : "";
        message.region = (_c = object.region) !== null && _c !== void 0 ? _c : "";
        message.endpoint = (_d = object.endpoint) !== null && _d !== void 0 ? _d : "";
        message.bucket = (_e = object.bucket) !== null && _e !== void 0 ? _e : "";
        message.forcePathStyle = (_f = object.forcePathStyle) !== null && _f !== void 0 ? _f : false;
        message.metadata = Object.entries((_g = object.metadata) !== null && _g !== void 0 ? _g : {}).reduce((acc, [key, value])=>{
            if (value !== undefined) {
                acc[key] = String(value);
            }
            return acc;
        }, {});
        message.tagging = (_h = object.tagging) !== null && _h !== void 0 ? _h : "";
        return message;
    }
};
function createBaseS3Upload_MetadataEntry() {
    return {
        key: "",
        value: ""
    };
}
exports.S3Upload_MetadataEntry = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== "") {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseS3Upload_MetadataEntry();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? String(object.value) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseS3Upload_MetadataEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
function createBaseGCPUpload() {
    return {
        credentials: "",
        bucket: ""
    };
}
exports.GCPUpload = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.credentials !== undefined && message.credentials !== "") {
            writer.uint32(10).string(message.credentials);
        }
        if (message.bucket !== undefined && message.bucket !== "") {
            writer.uint32(18).string(message.bucket);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGCPUpload();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.credentials = reader.string();
                    break;
                case 2:
                    message.bucket = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            credentials: isSet(object.credentials) ? String(object.credentials) : "",
            bucket: isSet(object.bucket) ? String(object.bucket) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.credentials !== undefined && (obj.credentials = message.credentials);
        message.bucket !== undefined && (obj.bucket = message.bucket);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseGCPUpload();
        message.credentials = (_a = object.credentials) !== null && _a !== void 0 ? _a : "";
        message.bucket = (_b = object.bucket) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
function createBaseAzureBlobUpload() {
    return {
        accountName: "",
        accountKey: "",
        containerName: ""
    };
}
exports.AzureBlobUpload = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.accountName !== undefined && message.accountName !== "") {
            writer.uint32(10).string(message.accountName);
        }
        if (message.accountKey !== undefined && message.accountKey !== "") {
            writer.uint32(18).string(message.accountKey);
        }
        if (message.containerName !== undefined && message.containerName !== "") {
            writer.uint32(26).string(message.containerName);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAzureBlobUpload();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.accountName = reader.string();
                    break;
                case 2:
                    message.accountKey = reader.string();
                    break;
                case 3:
                    message.containerName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            accountName: isSet(object.accountName) ? String(object.accountName) : "",
            accountKey: isSet(object.accountKey) ? String(object.accountKey) : "",
            containerName: isSet(object.containerName) ? String(object.containerName) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.accountName !== undefined && (obj.accountName = message.accountName);
        message.accountKey !== undefined && (obj.accountKey = message.accountKey);
        message.containerName !== undefined && (obj.containerName = message.containerName);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseAzureBlobUpload();
        message.accountName = (_a = object.accountName) !== null && _a !== void 0 ? _a : "";
        message.accountKey = (_b = object.accountKey) !== null && _b !== void 0 ? _b : "";
        message.containerName = (_c = object.containerName) !== null && _c !== void 0 ? _c : "";
        return message;
    }
};
function createBaseAliOSSUpload() {
    return {
        accessKey: "",
        secret: "",
        region: "",
        endpoint: "",
        bucket: ""
    };
}
exports.AliOSSUpload = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.accessKey !== undefined && message.accessKey !== "") {
            writer.uint32(10).string(message.accessKey);
        }
        if (message.secret !== undefined && message.secret !== "") {
            writer.uint32(18).string(message.secret);
        }
        if (message.region !== undefined && message.region !== "") {
            writer.uint32(26).string(message.region);
        }
        if (message.endpoint !== undefined && message.endpoint !== "") {
            writer.uint32(34).string(message.endpoint);
        }
        if (message.bucket !== undefined && message.bucket !== "") {
            writer.uint32(42).string(message.bucket);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAliOSSUpload();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.accessKey = reader.string();
                    break;
                case 2:
                    message.secret = reader.string();
                    break;
                case 3:
                    message.region = reader.string();
                    break;
                case 4:
                    message.endpoint = reader.string();
                    break;
                case 5:
                    message.bucket = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            accessKey: isSet(object.accessKey) ? String(object.accessKey) : "",
            secret: isSet(object.secret) ? String(object.secret) : "",
            region: isSet(object.region) ? String(object.region) : "",
            endpoint: isSet(object.endpoint) ? String(object.endpoint) : "",
            bucket: isSet(object.bucket) ? String(object.bucket) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.accessKey !== undefined && (obj.accessKey = message.accessKey);
        message.secret !== undefined && (obj.secret = message.secret);
        message.region !== undefined && (obj.region = message.region);
        message.endpoint !== undefined && (obj.endpoint = message.endpoint);
        message.bucket !== undefined && (obj.bucket = message.bucket);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseAliOSSUpload();
        message.accessKey = (_a = object.accessKey) !== null && _a !== void 0 ? _a : "";
        message.secret = (_b = object.secret) !== null && _b !== void 0 ? _b : "";
        message.region = (_c = object.region) !== null && _c !== void 0 ? _c : "";
        message.endpoint = (_d = object.endpoint) !== null && _d !== void 0 ? _d : "";
        message.bucket = (_e = object.bucket) !== null && _e !== void 0 ? _e : "";
        return message;
    }
};
function createBaseStreamOutput() {
    return {
        protocol: 0,
        urls: []
    };
}
exports.StreamOutput = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.protocol !== undefined && message.protocol !== 0) {
            writer.uint32(8).int32(message.protocol);
        }
        if (message.urls !== undefined && message.urls.length !== 0) {
            for (const v of message.urls){
                writer.uint32(18).string(v);
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamOutput();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.protocol = reader.int32();
                    break;
                case 2:
                    message.urls.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            protocol: isSet(object.protocol) ? streamProtocolFromJSON(object.protocol) : 0,
            urls: Array.isArray(object === null || object === void 0 ? void 0 : object.urls) ? object.urls.map((e)=>String(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.protocol !== undefined && (obj.protocol = streamProtocolToJSON(message.protocol));
        if (message.urls) {
            obj.urls = message.urls.map((e)=>e);
        } else {
            obj.urls = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseStreamOutput();
        message.protocol = (_a = object.protocol) !== null && _a !== void 0 ? _a : 0;
        message.urls = ((_b = object.urls) === null || _b === void 0 ? void 0 : _b.map((e)=>e)) || [];
        return message;
    }
};
function createBaseEncodingOptions() {
    return {
        width: 0,
        height: 0,
        depth: 0,
        framerate: 0,
        audioCodec: 0,
        audioBitrate: 0,
        audioFrequency: 0,
        videoCodec: 0,
        videoBitrate: 0,
        keyFrameInterval: 0
    };
}
exports.EncodingOptions = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.width !== undefined && message.width !== 0) {
            writer.uint32(8).int32(message.width);
        }
        if (message.height !== undefined && message.height !== 0) {
            writer.uint32(16).int32(message.height);
        }
        if (message.depth !== undefined && message.depth !== 0) {
            writer.uint32(24).int32(message.depth);
        }
        if (message.framerate !== undefined && message.framerate !== 0) {
            writer.uint32(32).int32(message.framerate);
        }
        if (message.audioCodec !== undefined && message.audioCodec !== 0) {
            writer.uint32(40).int32(message.audioCodec);
        }
        if (message.audioBitrate !== undefined && message.audioBitrate !== 0) {
            writer.uint32(48).int32(message.audioBitrate);
        }
        if (message.audioFrequency !== undefined && message.audioFrequency !== 0) {
            writer.uint32(56).int32(message.audioFrequency);
        }
        if (message.videoCodec !== undefined && message.videoCodec !== 0) {
            writer.uint32(64).int32(message.videoCodec);
        }
        if (message.videoBitrate !== undefined && message.videoBitrate !== 0) {
            writer.uint32(72).int32(message.videoBitrate);
        }
        if (message.keyFrameInterval !== undefined && message.keyFrameInterval !== 0) {
            writer.uint32(81).double(message.keyFrameInterval);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEncodingOptions();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.width = reader.int32();
                    break;
                case 2:
                    message.height = reader.int32();
                    break;
                case 3:
                    message.depth = reader.int32();
                    break;
                case 4:
                    message.framerate = reader.int32();
                    break;
                case 5:
                    message.audioCodec = reader.int32();
                    break;
                case 6:
                    message.audioBitrate = reader.int32();
                    break;
                case 7:
                    message.audioFrequency = reader.int32();
                    break;
                case 8:
                    message.videoCodec = reader.int32();
                    break;
                case 9:
                    message.videoBitrate = reader.int32();
                    break;
                case 10:
                    message.keyFrameInterval = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            width: isSet(object.width) ? Number(object.width) : 0,
            height: isSet(object.height) ? Number(object.height) : 0,
            depth: isSet(object.depth) ? Number(object.depth) : 0,
            framerate: isSet(object.framerate) ? Number(object.framerate) : 0,
            audioCodec: isSet(object.audioCodec) ? livekit_models_1.audioCodecFromJSON(object.audioCodec) : 0,
            audioBitrate: isSet(object.audioBitrate) ? Number(object.audioBitrate) : 0,
            audioFrequency: isSet(object.audioFrequency) ? Number(object.audioFrequency) : 0,
            videoCodec: isSet(object.videoCodec) ? livekit_models_1.videoCodecFromJSON(object.videoCodec) : 0,
            videoBitrate: isSet(object.videoBitrate) ? Number(object.videoBitrate) : 0,
            keyFrameInterval: isSet(object.keyFrameInterval) ? Number(object.keyFrameInterval) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.width !== undefined && (obj.width = Math.round(message.width));
        message.height !== undefined && (obj.height = Math.round(message.height));
        message.depth !== undefined && (obj.depth = Math.round(message.depth));
        message.framerate !== undefined && (obj.framerate = Math.round(message.framerate));
        message.audioCodec !== undefined && (obj.audioCodec = livekit_models_1.audioCodecToJSON(message.audioCodec));
        message.audioBitrate !== undefined && (obj.audioBitrate = Math.round(message.audioBitrate));
        message.audioFrequency !== undefined && (obj.audioFrequency = Math.round(message.audioFrequency));
        message.videoCodec !== undefined && (obj.videoCodec = livekit_models_1.videoCodecToJSON(message.videoCodec));
        message.videoBitrate !== undefined && (obj.videoBitrate = Math.round(message.videoBitrate));
        message.keyFrameInterval !== undefined && (obj.keyFrameInterval = message.keyFrameInterval);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseEncodingOptions();
        message.width = (_a = object.width) !== null && _a !== void 0 ? _a : 0;
        message.height = (_b = object.height) !== null && _b !== void 0 ? _b : 0;
        message.depth = (_c = object.depth) !== null && _c !== void 0 ? _c : 0;
        message.framerate = (_d = object.framerate) !== null && _d !== void 0 ? _d : 0;
        message.audioCodec = (_e = object.audioCodec) !== null && _e !== void 0 ? _e : 0;
        message.audioBitrate = (_f = object.audioBitrate) !== null && _f !== void 0 ? _f : 0;
        message.audioFrequency = (_g = object.audioFrequency) !== null && _g !== void 0 ? _g : 0;
        message.videoCodec = (_h = object.videoCodec) !== null && _h !== void 0 ? _h : 0;
        message.videoBitrate = (_j = object.videoBitrate) !== null && _j !== void 0 ? _j : 0;
        message.keyFrameInterval = (_k = object.keyFrameInterval) !== null && _k !== void 0 ? _k : 0;
        return message;
    }
};
function createBaseUpdateLayoutRequest() {
    return {
        egressId: "",
        layout: ""
    };
}
exports.UpdateLayoutRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.egressId !== undefined && message.egressId !== "") {
            writer.uint32(10).string(message.egressId);
        }
        if (message.layout !== undefined && message.layout !== "") {
            writer.uint32(18).string(message.layout);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateLayoutRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.egressId = reader.string();
                    break;
                case 2:
                    message.layout = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            egressId: isSet(object.egressId) ? String(object.egressId) : "",
            layout: isSet(object.layout) ? String(object.layout) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.egressId !== undefined && (obj.egressId = message.egressId);
        message.layout !== undefined && (obj.layout = message.layout);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseUpdateLayoutRequest();
        message.egressId = (_a = object.egressId) !== null && _a !== void 0 ? _a : "";
        message.layout = (_b = object.layout) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
function createBaseUpdateStreamRequest() {
    return {
        egressId: "",
        addOutputUrls: [],
        removeOutputUrls: []
    };
}
exports.UpdateStreamRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.egressId !== undefined && message.egressId !== "") {
            writer.uint32(10).string(message.egressId);
        }
        if (message.addOutputUrls !== undefined && message.addOutputUrls.length !== 0) {
            for (const v of message.addOutputUrls){
                writer.uint32(18).string(v);
            }
        }
        if (message.removeOutputUrls !== undefined && message.removeOutputUrls.length !== 0) {
            for (const v of message.removeOutputUrls){
                writer.uint32(26).string(v);
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateStreamRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.egressId = reader.string();
                    break;
                case 2:
                    message.addOutputUrls.push(reader.string());
                    break;
                case 3:
                    message.removeOutputUrls.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            egressId: isSet(object.egressId) ? String(object.egressId) : "",
            addOutputUrls: Array.isArray(object === null || object === void 0 ? void 0 : object.addOutputUrls) ? object.addOutputUrls.map((e)=>String(e)) : [],
            removeOutputUrls: Array.isArray(object === null || object === void 0 ? void 0 : object.removeOutputUrls) ? object.removeOutputUrls.map((e)=>String(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.egressId !== undefined && (obj.egressId = message.egressId);
        if (message.addOutputUrls) {
            obj.addOutputUrls = message.addOutputUrls.map((e)=>e);
        } else {
            obj.addOutputUrls = [];
        }
        if (message.removeOutputUrls) {
            obj.removeOutputUrls = message.removeOutputUrls.map((e)=>e);
        } else {
            obj.removeOutputUrls = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseUpdateStreamRequest();
        message.egressId = (_a = object.egressId) !== null && _a !== void 0 ? _a : "";
        message.addOutputUrls = ((_b = object.addOutputUrls) === null || _b === void 0 ? void 0 : _b.map((e)=>e)) || [];
        message.removeOutputUrls = ((_c = object.removeOutputUrls) === null || _c === void 0 ? void 0 : _c.map((e)=>e)) || [];
        return message;
    }
};
function createBaseListEgressRequest() {
    return {
        roomName: "",
        egressId: "",
        active: false
    };
}
exports.ListEgressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(10).string(message.roomName);
        }
        if (message.egressId !== undefined && message.egressId !== "") {
            writer.uint32(18).string(message.egressId);
        }
        if (message.active === true) {
            writer.uint32(24).bool(message.active);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListEgressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.roomName = reader.string();
                    break;
                case 2:
                    message.egressId = reader.string();
                    break;
                case 3:
                    message.active = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            egressId: isSet(object.egressId) ? String(object.egressId) : "",
            active: isSet(object.active) ? Boolean(object.active) : false
        };
    },
    toJSON (message) {
        const obj = {};
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.egressId !== undefined && (obj.egressId = message.egressId);
        message.active !== undefined && (obj.active = message.active);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseListEgressRequest();
        message.roomName = (_a = object.roomName) !== null && _a !== void 0 ? _a : "";
        message.egressId = (_b = object.egressId) !== null && _b !== void 0 ? _b : "";
        message.active = (_c = object.active) !== null && _c !== void 0 ? _c : false;
        return message;
    }
};
function createBaseListEgressResponse() {
    return {
        items: []
    };
}
exports.ListEgressResponse = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.items !== undefined && message.items.length !== 0) {
            for (const v of message.items){
                exports.EgressInfo.encode(v, writer.uint32(10).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListEgressResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.items.push(exports.EgressInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            items: Array.isArray(object === null || object === void 0 ? void 0 : object.items) ? object.items.map((e)=>exports.EgressInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.items) {
            obj.items = message.items.map((e)=>e ? exports.EgressInfo.toJSON(e) : undefined);
        } else {
            obj.items = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseListEgressResponse();
        message.items = ((_a = object.items) === null || _a === void 0 ? void 0 : _a.map((e)=>exports.EgressInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseStopEgressRequest() {
    return {
        egressId: ""
    };
}
exports.StopEgressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.egressId !== undefined && message.egressId !== "") {
            writer.uint32(10).string(message.egressId);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStopEgressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.egressId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            egressId: isSet(object.egressId) ? String(object.egressId) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.egressId !== undefined && (obj.egressId = message.egressId);
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseStopEgressRequest();
        message.egressId = (_a = object.egressId) !== null && _a !== void 0 ? _a : "";
        return message;
    }
};
function createBaseEgressInfo() {
    return {
        egressId: "",
        roomId: "",
        roomName: "",
        status: 0,
        startedAt: 0,
        endedAt: 0,
        updatedAt: 0,
        error: "",
        roomComposite: undefined,
        trackComposite: undefined,
        track: undefined,
        web: undefined,
        stream: undefined,
        file: undefined,
        segments: undefined,
        streamResults: [],
        fileResults: [],
        segmentResults: []
    };
}
exports.EgressInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.egressId !== undefined && message.egressId !== "") {
            writer.uint32(10).string(message.egressId);
        }
        if (message.roomId !== undefined && message.roomId !== "") {
            writer.uint32(18).string(message.roomId);
        }
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(106).string(message.roomName);
        }
        if (message.status !== undefined && message.status !== 0) {
            writer.uint32(24).int32(message.status);
        }
        if (message.startedAt !== undefined && message.startedAt !== 0) {
            writer.uint32(80).int64(message.startedAt);
        }
        if (message.endedAt !== undefined && message.endedAt !== 0) {
            writer.uint32(88).int64(message.endedAt);
        }
        if (message.updatedAt !== undefined && message.updatedAt !== 0) {
            writer.uint32(144).int64(message.updatedAt);
        }
        if (message.error !== undefined && message.error !== "") {
            writer.uint32(74).string(message.error);
        }
        if (message.roomComposite !== undefined) {
            exports.RoomCompositeEgressRequest.encode(message.roomComposite, writer.uint32(34).fork()).ldelim();
        }
        if (message.trackComposite !== undefined) {
            exports.TrackCompositeEgressRequest.encode(message.trackComposite, writer.uint32(42).fork()).ldelim();
        }
        if (message.track !== undefined) {
            exports.TrackEgressRequest.encode(message.track, writer.uint32(50).fork()).ldelim();
        }
        if (message.web !== undefined) {
            exports.WebEgressRequest.encode(message.web, writer.uint32(114).fork()).ldelim();
        }
        if (message.stream !== undefined) {
            exports.StreamInfoList.encode(message.stream, writer.uint32(58).fork()).ldelim();
        }
        if (message.file !== undefined) {
            exports.FileInfo.encode(message.file, writer.uint32(66).fork()).ldelim();
        }
        if (message.segments !== undefined) {
            exports.SegmentsInfo.encode(message.segments, writer.uint32(98).fork()).ldelim();
        }
        if (message.streamResults !== undefined && message.streamResults.length !== 0) {
            for (const v of message.streamResults){
                exports.StreamInfo.encode(v, writer.uint32(122).fork()).ldelim();
            }
        }
        if (message.fileResults !== undefined && message.fileResults.length !== 0) {
            for (const v of message.fileResults){
                exports.FileInfo.encode(v, writer.uint32(130).fork()).ldelim();
            }
        }
        if (message.segmentResults !== undefined && message.segmentResults.length !== 0) {
            for (const v of message.segmentResults){
                exports.SegmentsInfo.encode(v, writer.uint32(138).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEgressInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.egressId = reader.string();
                    break;
                case 2:
                    message.roomId = reader.string();
                    break;
                case 13:
                    message.roomName = reader.string();
                    break;
                case 3:
                    message.status = reader.int32();
                    break;
                case 10:
                    message.startedAt = longToNumber(reader.int64());
                    break;
                case 11:
                    message.endedAt = longToNumber(reader.int64());
                    break;
                case 18:
                    message.updatedAt = longToNumber(reader.int64());
                    break;
                case 9:
                    message.error = reader.string();
                    break;
                case 4:
                    message.roomComposite = exports.RoomCompositeEgressRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.trackComposite = exports.TrackCompositeEgressRequest.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.track = exports.TrackEgressRequest.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.web = exports.WebEgressRequest.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.stream = exports.StreamInfoList.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.file = exports.FileInfo.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.segments = exports.SegmentsInfo.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.streamResults.push(exports.StreamInfo.decode(reader, reader.uint32()));
                    break;
                case 16:
                    message.fileResults.push(exports.FileInfo.decode(reader, reader.uint32()));
                    break;
                case 17:
                    message.segmentResults.push(exports.SegmentsInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            egressId: isSet(object.egressId) ? String(object.egressId) : "",
            roomId: isSet(object.roomId) ? String(object.roomId) : "",
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            status: isSet(object.status) ? egressStatusFromJSON(object.status) : 0,
            startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
            endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
            updatedAt: isSet(object.updatedAt) ? Number(object.updatedAt) : 0,
            error: isSet(object.error) ? String(object.error) : "",
            roomComposite: isSet(object.roomComposite) ? exports.RoomCompositeEgressRequest.fromJSON(object.roomComposite) : undefined,
            trackComposite: isSet(object.trackComposite) ? exports.TrackCompositeEgressRequest.fromJSON(object.trackComposite) : undefined,
            track: isSet(object.track) ? exports.TrackEgressRequest.fromJSON(object.track) : undefined,
            web: isSet(object.web) ? exports.WebEgressRequest.fromJSON(object.web) : undefined,
            stream: isSet(object.stream) ? exports.StreamInfoList.fromJSON(object.stream) : undefined,
            file: isSet(object.file) ? exports.FileInfo.fromJSON(object.file) : undefined,
            segments: isSet(object.segments) ? exports.SegmentsInfo.fromJSON(object.segments) : undefined,
            streamResults: Array.isArray(object === null || object === void 0 ? void 0 : object.streamResults) ? object.streamResults.map((e)=>exports.StreamInfo.fromJSON(e)) : [],
            fileResults: Array.isArray(object === null || object === void 0 ? void 0 : object.fileResults) ? object.fileResults.map((e)=>exports.FileInfo.fromJSON(e)) : [],
            segmentResults: Array.isArray(object === null || object === void 0 ? void 0 : object.segmentResults) ? object.segmentResults.map((e)=>exports.SegmentsInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.egressId !== undefined && (obj.egressId = message.egressId);
        message.roomId !== undefined && (obj.roomId = message.roomId);
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.status !== undefined && (obj.status = egressStatusToJSON(message.status));
        message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
        message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
        message.updatedAt !== undefined && (obj.updatedAt = Math.round(message.updatedAt));
        message.error !== undefined && (obj.error = message.error);
        message.roomComposite !== undefined && (obj.roomComposite = message.roomComposite ? exports.RoomCompositeEgressRequest.toJSON(message.roomComposite) : undefined);
        message.trackComposite !== undefined && (obj.trackComposite = message.trackComposite ? exports.TrackCompositeEgressRequest.toJSON(message.trackComposite) : undefined);
        message.track !== undefined && (obj.track = message.track ? exports.TrackEgressRequest.toJSON(message.track) : undefined);
        message.web !== undefined && (obj.web = message.web ? exports.WebEgressRequest.toJSON(message.web) : undefined);
        message.stream !== undefined && (obj.stream = message.stream ? exports.StreamInfoList.toJSON(message.stream) : undefined);
        message.file !== undefined && (obj.file = message.file ? exports.FileInfo.toJSON(message.file) : undefined);
        message.segments !== undefined && (obj.segments = message.segments ? exports.SegmentsInfo.toJSON(message.segments) : undefined);
        if (message.streamResults) {
            obj.streamResults = message.streamResults.map((e)=>e ? exports.StreamInfo.toJSON(e) : undefined);
        } else {
            obj.streamResults = [];
        }
        if (message.fileResults) {
            obj.fileResults = message.fileResults.map((e)=>e ? exports.FileInfo.toJSON(e) : undefined);
        } else {
            obj.fileResults = [];
        }
        if (message.segmentResults) {
            obj.segmentResults = message.segmentResults.map((e)=>e ? exports.SegmentsInfo.toJSON(e) : undefined);
        } else {
            obj.segmentResults = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = createBaseEgressInfo();
        message.egressId = (_a = object.egressId) !== null && _a !== void 0 ? _a : "";
        message.roomId = (_b = object.roomId) !== null && _b !== void 0 ? _b : "";
        message.roomName = (_c = object.roomName) !== null && _c !== void 0 ? _c : "";
        message.status = (_d = object.status) !== null && _d !== void 0 ? _d : 0;
        message.startedAt = (_e = object.startedAt) !== null && _e !== void 0 ? _e : 0;
        message.endedAt = (_f = object.endedAt) !== null && _f !== void 0 ? _f : 0;
        message.updatedAt = (_g = object.updatedAt) !== null && _g !== void 0 ? _g : 0;
        message.error = (_h = object.error) !== null && _h !== void 0 ? _h : "";
        message.roomComposite = object.roomComposite !== undefined && object.roomComposite !== null ? exports.RoomCompositeEgressRequest.fromPartial(object.roomComposite) : undefined;
        message.trackComposite = object.trackComposite !== undefined && object.trackComposite !== null ? exports.TrackCompositeEgressRequest.fromPartial(object.trackComposite) : undefined;
        message.track = object.track !== undefined && object.track !== null ? exports.TrackEgressRequest.fromPartial(object.track) : undefined;
        message.web = object.web !== undefined && object.web !== null ? exports.WebEgressRequest.fromPartial(object.web) : undefined;
        message.stream = object.stream !== undefined && object.stream !== null ? exports.StreamInfoList.fromPartial(object.stream) : undefined;
        message.file = object.file !== undefined && object.file !== null ? exports.FileInfo.fromPartial(object.file) : undefined;
        message.segments = object.segments !== undefined && object.segments !== null ? exports.SegmentsInfo.fromPartial(object.segments) : undefined;
        message.streamResults = ((_j = object.streamResults) === null || _j === void 0 ? void 0 : _j.map((e)=>exports.StreamInfo.fromPartial(e))) || [];
        message.fileResults = ((_k = object.fileResults) === null || _k === void 0 ? void 0 : _k.map((e)=>exports.FileInfo.fromPartial(e))) || [];
        message.segmentResults = ((_l = object.segmentResults) === null || _l === void 0 ? void 0 : _l.map((e)=>exports.SegmentsInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseStreamInfoList() {
    return {
        info: []
    };
}
exports.StreamInfoList = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.info !== undefined && message.info.length !== 0) {
            for (const v of message.info){
                exports.StreamInfo.encode(v, writer.uint32(10).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamInfoList();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.info.push(exports.StreamInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            info: Array.isArray(object === null || object === void 0 ? void 0 : object.info) ? object.info.map((e)=>exports.StreamInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.info) {
            obj.info = message.info.map((e)=>e ? exports.StreamInfo.toJSON(e) : undefined);
        } else {
            obj.info = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseStreamInfoList();
        message.info = ((_a = object.info) === null || _a === void 0 ? void 0 : _a.map((e)=>exports.StreamInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseStreamInfo() {
    return {
        url: "",
        startedAt: 0,
        endedAt: 0,
        duration: 0,
        status: 0,
        error: ""
    };
}
exports.StreamInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.url !== undefined && message.url !== "") {
            writer.uint32(10).string(message.url);
        }
        if (message.startedAt !== undefined && message.startedAt !== 0) {
            writer.uint32(16).int64(message.startedAt);
        }
        if (message.endedAt !== undefined && message.endedAt !== 0) {
            writer.uint32(24).int64(message.endedAt);
        }
        if (message.duration !== undefined && message.duration !== 0) {
            writer.uint32(32).int64(message.duration);
        }
        if (message.status !== undefined && message.status !== 0) {
            writer.uint32(40).int32(message.status);
        }
        if (message.error !== undefined && message.error !== "") {
            writer.uint32(50).string(message.error);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.startedAt = longToNumber(reader.int64());
                    break;
                case 3:
                    message.endedAt = longToNumber(reader.int64());
                    break;
                case 4:
                    message.duration = longToNumber(reader.int64());
                    break;
                case 5:
                    message.status = reader.int32();
                    break;
                case 6:
                    message.error = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            url: isSet(object.url) ? String(object.url) : "",
            startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
            endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
            duration: isSet(object.duration) ? Number(object.duration) : 0,
            status: isSet(object.status) ? streamInfo_StatusFromJSON(object.status) : 0,
            error: isSet(object.error) ? String(object.error) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.url !== undefined && (obj.url = message.url);
        message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
        message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
        message.duration !== undefined && (obj.duration = Math.round(message.duration));
        message.status !== undefined && (obj.status = streamInfo_StatusToJSON(message.status));
        message.error !== undefined && (obj.error = message.error);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseStreamInfo();
        message.url = (_a = object.url) !== null && _a !== void 0 ? _a : "";
        message.startedAt = (_b = object.startedAt) !== null && _b !== void 0 ? _b : 0;
        message.endedAt = (_c = object.endedAt) !== null && _c !== void 0 ? _c : 0;
        message.duration = (_d = object.duration) !== null && _d !== void 0 ? _d : 0;
        message.status = (_e = object.status) !== null && _e !== void 0 ? _e : 0;
        message.error = (_f = object.error) !== null && _f !== void 0 ? _f : "";
        return message;
    }
};
function createBaseFileInfo() {
    return {
        filename: "",
        startedAt: 0,
        endedAt: 0,
        duration: 0,
        size: 0,
        location: ""
    };
}
exports.FileInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.filename !== undefined && message.filename !== "") {
            writer.uint32(10).string(message.filename);
        }
        if (message.startedAt !== undefined && message.startedAt !== 0) {
            writer.uint32(16).int64(message.startedAt);
        }
        if (message.endedAt !== undefined && message.endedAt !== 0) {
            writer.uint32(24).int64(message.endedAt);
        }
        if (message.duration !== undefined && message.duration !== 0) {
            writer.uint32(48).int64(message.duration);
        }
        if (message.size !== undefined && message.size !== 0) {
            writer.uint32(32).int64(message.size);
        }
        if (message.location !== undefined && message.location !== "") {
            writer.uint32(42).string(message.location);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFileInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.filename = reader.string();
                    break;
                case 2:
                    message.startedAt = longToNumber(reader.int64());
                    break;
                case 3:
                    message.endedAt = longToNumber(reader.int64());
                    break;
                case 6:
                    message.duration = longToNumber(reader.int64());
                    break;
                case 4:
                    message.size = longToNumber(reader.int64());
                    break;
                case 5:
                    message.location = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            filename: isSet(object.filename) ? String(object.filename) : "",
            startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
            endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
            duration: isSet(object.duration) ? Number(object.duration) : 0,
            size: isSet(object.size) ? Number(object.size) : 0,
            location: isSet(object.location) ? String(object.location) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.filename !== undefined && (obj.filename = message.filename);
        message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
        message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
        message.duration !== undefined && (obj.duration = Math.round(message.duration));
        message.size !== undefined && (obj.size = Math.round(message.size));
        message.location !== undefined && (obj.location = message.location);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseFileInfo();
        message.filename = (_a = object.filename) !== null && _a !== void 0 ? _a : "";
        message.startedAt = (_b = object.startedAt) !== null && _b !== void 0 ? _b : 0;
        message.endedAt = (_c = object.endedAt) !== null && _c !== void 0 ? _c : 0;
        message.duration = (_d = object.duration) !== null && _d !== void 0 ? _d : 0;
        message.size = (_e = object.size) !== null && _e !== void 0 ? _e : 0;
        message.location = (_f = object.location) !== null && _f !== void 0 ? _f : "";
        return message;
    }
};
function createBaseSegmentsInfo() {
    return {
        playlistName: "",
        duration: 0,
        size: 0,
        playlistLocation: "",
        segmentCount: 0,
        startedAt: 0,
        endedAt: 0
    };
}
exports.SegmentsInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.playlistName !== undefined && message.playlistName !== "") {
            writer.uint32(10).string(message.playlistName);
        }
        if (message.duration !== undefined && message.duration !== 0) {
            writer.uint32(16).int64(message.duration);
        }
        if (message.size !== undefined && message.size !== 0) {
            writer.uint32(24).int64(message.size);
        }
        if (message.playlistLocation !== undefined && message.playlistLocation !== "") {
            writer.uint32(34).string(message.playlistLocation);
        }
        if (message.segmentCount !== undefined && message.segmentCount !== 0) {
            writer.uint32(40).int64(message.segmentCount);
        }
        if (message.startedAt !== undefined && message.startedAt !== 0) {
            writer.uint32(48).int64(message.startedAt);
        }
        if (message.endedAt !== undefined && message.endedAt !== 0) {
            writer.uint32(56).int64(message.endedAt);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSegmentsInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.playlistName = reader.string();
                    break;
                case 2:
                    message.duration = longToNumber(reader.int64());
                    break;
                case 3:
                    message.size = longToNumber(reader.int64());
                    break;
                case 4:
                    message.playlistLocation = reader.string();
                    break;
                case 5:
                    message.segmentCount = longToNumber(reader.int64());
                    break;
                case 6:
                    message.startedAt = longToNumber(reader.int64());
                    break;
                case 7:
                    message.endedAt = longToNumber(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            playlistName: isSet(object.playlistName) ? String(object.playlistName) : "",
            duration: isSet(object.duration) ? Number(object.duration) : 0,
            size: isSet(object.size) ? Number(object.size) : 0,
            playlistLocation: isSet(object.playlistLocation) ? String(object.playlistLocation) : "",
            segmentCount: isSet(object.segmentCount) ? Number(object.segmentCount) : 0,
            startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
            endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.playlistName !== undefined && (obj.playlistName = message.playlistName);
        message.duration !== undefined && (obj.duration = Math.round(message.duration));
        message.size !== undefined && (obj.size = Math.round(message.size));
        message.playlistLocation !== undefined && (obj.playlistLocation = message.playlistLocation);
        message.segmentCount !== undefined && (obj.segmentCount = Math.round(message.segmentCount));
        message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
        message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseSegmentsInfo();
        message.playlistName = (_a = object.playlistName) !== null && _a !== void 0 ? _a : "";
        message.duration = (_b = object.duration) !== null && _b !== void 0 ? _b : 0;
        message.size = (_c = object.size) !== null && _c !== void 0 ? _c : 0;
        message.playlistLocation = (_d = object.playlistLocation) !== null && _d !== void 0 ? _d : "";
        message.segmentCount = (_e = object.segmentCount) !== null && _e !== void 0 ? _e : 0;
        message.startedAt = (_f = object.startedAt) !== null && _f !== void 0 ? _f : 0;
        message.endedAt = (_g = object.endedAt) !== null && _g !== void 0 ? _g : 0;
        return message;
    }
};
function createBaseAutoTrackEgress() {
    return {
        filepath: "",
        disableManifest: false,
        s3: undefined,
        gcp: undefined,
        azure: undefined
    };
}
exports.AutoTrackEgress = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.filepath !== undefined && message.filepath !== "") {
            writer.uint32(10).string(message.filepath);
        }
        if (message.disableManifest === true) {
            writer.uint32(40).bool(message.disableManifest);
        }
        if (message.s3 !== undefined) {
            exports.S3Upload.encode(message.s3, writer.uint32(18).fork()).ldelim();
        }
        if (message.gcp !== undefined) {
            exports.GCPUpload.encode(message.gcp, writer.uint32(26).fork()).ldelim();
        }
        if (message.azure !== undefined) {
            exports.AzureBlobUpload.encode(message.azure, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAutoTrackEgress();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.filepath = reader.string();
                    break;
                case 5:
                    message.disableManifest = reader.bool();
                    break;
                case 2:
                    message.s3 = exports.S3Upload.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.gcp = exports.GCPUpload.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.azure = exports.AzureBlobUpload.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            filepath: isSet(object.filepath) ? String(object.filepath) : "",
            disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
            s3: isSet(object.s3) ? exports.S3Upload.fromJSON(object.s3) : undefined,
            gcp: isSet(object.gcp) ? exports.GCPUpload.fromJSON(object.gcp) : undefined,
            azure: isSet(object.azure) ? exports.AzureBlobUpload.fromJSON(object.azure) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.filepath !== undefined && (obj.filepath = message.filepath);
        message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
        message.s3 !== undefined && (obj.s3 = message.s3 ? exports.S3Upload.toJSON(message.s3) : undefined);
        message.gcp !== undefined && (obj.gcp = message.gcp ? exports.GCPUpload.toJSON(message.gcp) : undefined);
        message.azure !== undefined && (obj.azure = message.azure ? exports.AzureBlobUpload.toJSON(message.azure) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseAutoTrackEgress();
        message.filepath = (_a = object.filepath) !== null && _a !== void 0 ? _a : "";
        message.disableManifest = (_b = object.disableManifest) !== null && _b !== void 0 ? _b : false;
        message.s3 = object.s3 !== undefined && object.s3 !== null ? exports.S3Upload.fromPartial(object.s3) : undefined;
        message.gcp = object.gcp !== undefined && object.gcp !== null ? exports.GCPUpload.fromPartial(object.gcp) : undefined;
        message.azure = object.azure !== undefined && object.azure !== null ? exports.AzureBlobUpload.fromPartial(object.azure) : undefined;
        return message;
    }
};
var globalThis = (()=>{
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (false) {}
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
} //# sourceMappingURL=livekit_egress.js.map


/***/ }),

/***/ 93208:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DeleteIngressRequest = exports.ListIngressResponse = exports.ListIngressRequest = exports.UpdateIngressRequest = exports.InputAudioState = exports.InputVideoState = exports.IngressState = exports.IngressInfo = exports.IngressVideoEncodingOptions = exports.IngressAudioEncodingOptions = exports.IngressVideoOptions = exports.IngressAudioOptions = exports.CreateIngressRequest = exports.ingressState_StatusToJSON = exports.ingressState_StatusFromJSON = exports.IngressState_Status = exports.ingressVideoEncodingPresetToJSON = exports.ingressVideoEncodingPresetFromJSON = exports.IngressVideoEncodingPreset = exports.ingressAudioEncodingPresetToJSON = exports.ingressAudioEncodingPresetFromJSON = exports.IngressAudioEncodingPreset = exports.ingressInputToJSON = exports.ingressInputFromJSON = exports.IngressInput = exports.protobufPackage = void 0;
/* eslint-disable */ const long_1 = __importDefault(__webpack_require__(21288));
const minimal_1 = __importDefault(__webpack_require__(51948));
const livekit_models_1 = __webpack_require__(49627);
exports.protobufPackage = "livekit";
var IngressInput;
(function(IngressInput) {
    IngressInput[IngressInput["RTMP_INPUT"] = 0] = "RTMP_INPUT";
    IngressInput[IngressInput["WHIP_INPUT"] = 1] = "WHIP_INPUT";
    /** URL_INPUT - Pull from the provided URL. Only HTTP url are supported, serving either a single media file or a HLS stream */ IngressInput[IngressInput["URL_INPUT"] = 2] = "URL_INPUT";
    IngressInput[IngressInput["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(IngressInput = exports.IngressInput || (exports.IngressInput = {}));
function ingressInputFromJSON(object) {
    switch(object){
        case 0:
        case "RTMP_INPUT":
            return IngressInput.RTMP_INPUT;
        case 1:
        case "WHIP_INPUT":
            return IngressInput.WHIP_INPUT;
        case 2:
        case "URL_INPUT":
            return IngressInput.URL_INPUT;
        case -1:
        case "UNRECOGNIZED":
        default:
            return IngressInput.UNRECOGNIZED;
    }
}
exports.ingressInputFromJSON = ingressInputFromJSON;
function ingressInputToJSON(object) {
    switch(object){
        case IngressInput.RTMP_INPUT:
            return "RTMP_INPUT";
        case IngressInput.WHIP_INPUT:
            return "WHIP_INPUT";
        case IngressInput.URL_INPUT:
            return "URL_INPUT";
        case IngressInput.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.ingressInputToJSON = ingressInputToJSON;
var IngressAudioEncodingPreset;
(function(IngressAudioEncodingPreset) {
    /** OPUS_STEREO_96KBPS - OPUS, 2 channels, 96kbps */ IngressAudioEncodingPreset[IngressAudioEncodingPreset["OPUS_STEREO_96KBPS"] = 0] = "OPUS_STEREO_96KBPS";
    /** OPUS_MONO_64KBS - OPUS, 1 channel, 64kbps */ IngressAudioEncodingPreset[IngressAudioEncodingPreset["OPUS_MONO_64KBS"] = 1] = "OPUS_MONO_64KBS";
    IngressAudioEncodingPreset[IngressAudioEncodingPreset["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(IngressAudioEncodingPreset = exports.IngressAudioEncodingPreset || (exports.IngressAudioEncodingPreset = {}));
function ingressAudioEncodingPresetFromJSON(object) {
    switch(object){
        case 0:
        case "OPUS_STEREO_96KBPS":
            return IngressAudioEncodingPreset.OPUS_STEREO_96KBPS;
        case 1:
        case "OPUS_MONO_64KBS":
            return IngressAudioEncodingPreset.OPUS_MONO_64KBS;
        case -1:
        case "UNRECOGNIZED":
        default:
            return IngressAudioEncodingPreset.UNRECOGNIZED;
    }
}
exports.ingressAudioEncodingPresetFromJSON = ingressAudioEncodingPresetFromJSON;
function ingressAudioEncodingPresetToJSON(object) {
    switch(object){
        case IngressAudioEncodingPreset.OPUS_STEREO_96KBPS:
            return "OPUS_STEREO_96KBPS";
        case IngressAudioEncodingPreset.OPUS_MONO_64KBS:
            return "OPUS_MONO_64KBS";
        case IngressAudioEncodingPreset.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.ingressAudioEncodingPresetToJSON = ingressAudioEncodingPresetToJSON;
var IngressVideoEncodingPreset;
(function(IngressVideoEncodingPreset) {
    /** H264_720P_30FPS_3_LAYERS - 1280x720,  30fps, 1700kbps main layer, 3 layers total */ IngressVideoEncodingPreset[IngressVideoEncodingPreset["H264_720P_30FPS_3_LAYERS"] = 0] = "H264_720P_30FPS_3_LAYERS";
    /** H264_1080P_30FPS_3_LAYERS - 1980x1080, 30fps, 3000kbps main layer, 3 layers total */ IngressVideoEncodingPreset[IngressVideoEncodingPreset["H264_1080P_30FPS_3_LAYERS"] = 1] = "H264_1080P_30FPS_3_LAYERS";
    /** H264_540P_25FPS_2_LAYERS - 960x540,  25fps, 600kbps  main layer, 2 layers total */ IngressVideoEncodingPreset[IngressVideoEncodingPreset["H264_540P_25FPS_2_LAYERS"] = 2] = "H264_540P_25FPS_2_LAYERS";
    /** H264_720P_30FPS_1_LAYER - 1280x720,  30fps, 1700kbps, no simulcast */ IngressVideoEncodingPreset[IngressVideoEncodingPreset["H264_720P_30FPS_1_LAYER"] = 3] = "H264_720P_30FPS_1_LAYER";
    /** H264_1080P_30FPS_1_LAYER - 1980x1080, 30fps, 3000kbps, no simulcast */ IngressVideoEncodingPreset[IngressVideoEncodingPreset["H264_1080P_30FPS_1_LAYER"] = 4] = "H264_1080P_30FPS_1_LAYER";
    IngressVideoEncodingPreset[IngressVideoEncodingPreset["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(IngressVideoEncodingPreset = exports.IngressVideoEncodingPreset || (exports.IngressVideoEncodingPreset = {}));
function ingressVideoEncodingPresetFromJSON(object) {
    switch(object){
        case 0:
        case "H264_720P_30FPS_3_LAYERS":
            return IngressVideoEncodingPreset.H264_720P_30FPS_3_LAYERS;
        case 1:
        case "H264_1080P_30FPS_3_LAYERS":
            return IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS;
        case 2:
        case "H264_540P_25FPS_2_LAYERS":
            return IngressVideoEncodingPreset.H264_540P_25FPS_2_LAYERS;
        case 3:
        case "H264_720P_30FPS_1_LAYER":
            return IngressVideoEncodingPreset.H264_720P_30FPS_1_LAYER;
        case 4:
        case "H264_1080P_30FPS_1_LAYER":
            return IngressVideoEncodingPreset.H264_1080P_30FPS_1_LAYER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return IngressVideoEncodingPreset.UNRECOGNIZED;
    }
}
exports.ingressVideoEncodingPresetFromJSON = ingressVideoEncodingPresetFromJSON;
function ingressVideoEncodingPresetToJSON(object) {
    switch(object){
        case IngressVideoEncodingPreset.H264_720P_30FPS_3_LAYERS:
            return "H264_720P_30FPS_3_LAYERS";
        case IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS:
            return "H264_1080P_30FPS_3_LAYERS";
        case IngressVideoEncodingPreset.H264_540P_25FPS_2_LAYERS:
            return "H264_540P_25FPS_2_LAYERS";
        case IngressVideoEncodingPreset.H264_720P_30FPS_1_LAYER:
            return "H264_720P_30FPS_1_LAYER";
        case IngressVideoEncodingPreset.H264_1080P_30FPS_1_LAYER:
            return "H264_1080P_30FPS_1_LAYER";
        case IngressVideoEncodingPreset.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.ingressVideoEncodingPresetToJSON = ingressVideoEncodingPresetToJSON;
var IngressState_Status;
(function(IngressState_Status) {
    IngressState_Status[IngressState_Status["ENDPOINT_INACTIVE"] = 0] = "ENDPOINT_INACTIVE";
    IngressState_Status[IngressState_Status["ENDPOINT_BUFFERING"] = 1] = "ENDPOINT_BUFFERING";
    IngressState_Status[IngressState_Status["ENDPOINT_PUBLISHING"] = 2] = "ENDPOINT_PUBLISHING";
    IngressState_Status[IngressState_Status["ENDPOINT_ERROR"] = 3] = "ENDPOINT_ERROR";
    IngressState_Status[IngressState_Status["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(IngressState_Status = exports.IngressState_Status || (exports.IngressState_Status = {}));
function ingressState_StatusFromJSON(object) {
    switch(object){
        case 0:
        case "ENDPOINT_INACTIVE":
            return IngressState_Status.ENDPOINT_INACTIVE;
        case 1:
        case "ENDPOINT_BUFFERING":
            return IngressState_Status.ENDPOINT_BUFFERING;
        case 2:
        case "ENDPOINT_PUBLISHING":
            return IngressState_Status.ENDPOINT_PUBLISHING;
        case 3:
        case "ENDPOINT_ERROR":
            return IngressState_Status.ENDPOINT_ERROR;
        case -1:
        case "UNRECOGNIZED":
        default:
            return IngressState_Status.UNRECOGNIZED;
    }
}
exports.ingressState_StatusFromJSON = ingressState_StatusFromJSON;
function ingressState_StatusToJSON(object) {
    switch(object){
        case IngressState_Status.ENDPOINT_INACTIVE:
            return "ENDPOINT_INACTIVE";
        case IngressState_Status.ENDPOINT_BUFFERING:
            return "ENDPOINT_BUFFERING";
        case IngressState_Status.ENDPOINT_PUBLISHING:
            return "ENDPOINT_PUBLISHING";
        case IngressState_Status.ENDPOINT_ERROR:
            return "ENDPOINT_ERROR";
        case IngressState_Status.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.ingressState_StatusToJSON = ingressState_StatusToJSON;
function createBaseCreateIngressRequest() {
    return {
        inputType: 0,
        url: "",
        name: "",
        roomName: "",
        participantIdentity: "",
        participantName: "",
        bypassTranscoding: false,
        audio: undefined,
        video: undefined
    };
}
exports.CreateIngressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.inputType !== undefined && message.inputType !== 0) {
            writer.uint32(8).int32(message.inputType);
        }
        if (message.url !== undefined && message.url !== "") {
            writer.uint32(74).string(message.url);
        }
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(26).string(message.roomName);
        }
        if (message.participantIdentity !== undefined && message.participantIdentity !== "") {
            writer.uint32(34).string(message.participantIdentity);
        }
        if (message.participantName !== undefined && message.participantName !== "") {
            writer.uint32(42).string(message.participantName);
        }
        if (message.bypassTranscoding === true) {
            writer.uint32(64).bool(message.bypassTranscoding);
        }
        if (message.audio !== undefined) {
            exports.IngressAudioOptions.encode(message.audio, writer.uint32(50).fork()).ldelim();
        }
        if (message.video !== undefined) {
            exports.IngressVideoOptions.encode(message.video, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateIngressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.inputType = reader.int32();
                    break;
                case 9:
                    message.url = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.roomName = reader.string();
                    break;
                case 4:
                    message.participantIdentity = reader.string();
                    break;
                case 5:
                    message.participantName = reader.string();
                    break;
                case 8:
                    message.bypassTranscoding = reader.bool();
                    break;
                case 6:
                    message.audio = exports.IngressAudioOptions.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.video = exports.IngressVideoOptions.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            inputType: isSet(object.inputType) ? ingressInputFromJSON(object.inputType) : 0,
            url: isSet(object.url) ? String(object.url) : "",
            name: isSet(object.name) ? String(object.name) : "",
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            participantIdentity: isSet(object.participantIdentity) ? String(object.participantIdentity) : "",
            participantName: isSet(object.participantName) ? String(object.participantName) : "",
            bypassTranscoding: isSet(object.bypassTranscoding) ? Boolean(object.bypassTranscoding) : false,
            audio: isSet(object.audio) ? exports.IngressAudioOptions.fromJSON(object.audio) : undefined,
            video: isSet(object.video) ? exports.IngressVideoOptions.fromJSON(object.video) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.inputType !== undefined && (obj.inputType = ingressInputToJSON(message.inputType));
        message.url !== undefined && (obj.url = message.url);
        message.name !== undefined && (obj.name = message.name);
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.participantIdentity !== undefined && (obj.participantIdentity = message.participantIdentity);
        message.participantName !== undefined && (obj.participantName = message.participantName);
        message.bypassTranscoding !== undefined && (obj.bypassTranscoding = message.bypassTranscoding);
        message.audio !== undefined && (obj.audio = message.audio ? exports.IngressAudioOptions.toJSON(message.audio) : undefined);
        message.video !== undefined && (obj.video = message.video ? exports.IngressVideoOptions.toJSON(message.video) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseCreateIngressRequest();
        message.inputType = (_a = object.inputType) !== null && _a !== void 0 ? _a : 0;
        message.url = (_b = object.url) !== null && _b !== void 0 ? _b : "";
        message.name = (_c = object.name) !== null && _c !== void 0 ? _c : "";
        message.roomName = (_d = object.roomName) !== null && _d !== void 0 ? _d : "";
        message.participantIdentity = (_e = object.participantIdentity) !== null && _e !== void 0 ? _e : "";
        message.participantName = (_f = object.participantName) !== null && _f !== void 0 ? _f : "";
        message.bypassTranscoding = (_g = object.bypassTranscoding) !== null && _g !== void 0 ? _g : false;
        message.audio = object.audio !== undefined && object.audio !== null ? exports.IngressAudioOptions.fromPartial(object.audio) : undefined;
        message.video = object.video !== undefined && object.video !== null ? exports.IngressVideoOptions.fromPartial(object.video) : undefined;
        return message;
    }
};
function createBaseIngressAudioOptions() {
    return {
        name: "",
        source: 0,
        preset: undefined,
        options: undefined
    };
}
exports.IngressAudioOptions = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.source !== undefined && message.source !== 0) {
            writer.uint32(16).int32(message.source);
        }
        if (message.preset !== undefined) {
            writer.uint32(24).int32(message.preset);
        }
        if (message.options !== undefined) {
            exports.IngressAudioEncodingOptions.encode(message.options, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIngressAudioOptions();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.source = reader.int32();
                    break;
                case 3:
                    message.preset = reader.int32();
                    break;
                case 4:
                    message.options = exports.IngressAudioEncodingOptions.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            source: isSet(object.source) ? livekit_models_1.trackSourceFromJSON(object.source) : 0,
            preset: isSet(object.preset) ? ingressAudioEncodingPresetFromJSON(object.preset) : undefined,
            options: isSet(object.options) ? exports.IngressAudioEncodingOptions.fromJSON(object.options) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.source !== undefined && (obj.source = livekit_models_1.trackSourceToJSON(message.source));
        message.preset !== undefined && (obj.preset = message.preset !== undefined ? ingressAudioEncodingPresetToJSON(message.preset) : undefined);
        message.options !== undefined && (obj.options = message.options ? exports.IngressAudioEncodingOptions.toJSON(message.options) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseIngressAudioOptions();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.source = (_b = object.source) !== null && _b !== void 0 ? _b : 0;
        message.preset = (_c = object.preset) !== null && _c !== void 0 ? _c : undefined;
        message.options = object.options !== undefined && object.options !== null ? exports.IngressAudioEncodingOptions.fromPartial(object.options) : undefined;
        return message;
    }
};
function createBaseIngressVideoOptions() {
    return {
        name: "",
        source: 0,
        preset: undefined,
        options: undefined
    };
}
exports.IngressVideoOptions = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.source !== undefined && message.source !== 0) {
            writer.uint32(16).int32(message.source);
        }
        if (message.preset !== undefined) {
            writer.uint32(24).int32(message.preset);
        }
        if (message.options !== undefined) {
            exports.IngressVideoEncodingOptions.encode(message.options, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIngressVideoOptions();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.source = reader.int32();
                    break;
                case 3:
                    message.preset = reader.int32();
                    break;
                case 4:
                    message.options = exports.IngressVideoEncodingOptions.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            source: isSet(object.source) ? livekit_models_1.trackSourceFromJSON(object.source) : 0,
            preset: isSet(object.preset) ? ingressVideoEncodingPresetFromJSON(object.preset) : undefined,
            options: isSet(object.options) ? exports.IngressVideoEncodingOptions.fromJSON(object.options) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.source !== undefined && (obj.source = livekit_models_1.trackSourceToJSON(message.source));
        message.preset !== undefined && (obj.preset = message.preset !== undefined ? ingressVideoEncodingPresetToJSON(message.preset) : undefined);
        message.options !== undefined && (obj.options = message.options ? exports.IngressVideoEncodingOptions.toJSON(message.options) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseIngressVideoOptions();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.source = (_b = object.source) !== null && _b !== void 0 ? _b : 0;
        message.preset = (_c = object.preset) !== null && _c !== void 0 ? _c : undefined;
        message.options = object.options !== undefined && object.options !== null ? exports.IngressVideoEncodingOptions.fromPartial(object.options) : undefined;
        return message;
    }
};
function createBaseIngressAudioEncodingOptions() {
    return {
        audioCodec: 0,
        bitrate: 0,
        disableDtx: false,
        channels: 0
    };
}
exports.IngressAudioEncodingOptions = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.audioCodec !== undefined && message.audioCodec !== 0) {
            writer.uint32(8).int32(message.audioCodec);
        }
        if (message.bitrate !== undefined && message.bitrate !== 0) {
            writer.uint32(16).uint32(message.bitrate);
        }
        if (message.disableDtx === true) {
            writer.uint32(24).bool(message.disableDtx);
        }
        if (message.channels !== undefined && message.channels !== 0) {
            writer.uint32(32).uint32(message.channels);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIngressAudioEncodingOptions();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.audioCodec = reader.int32();
                    break;
                case 2:
                    message.bitrate = reader.uint32();
                    break;
                case 3:
                    message.disableDtx = reader.bool();
                    break;
                case 4:
                    message.channels = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            audioCodec: isSet(object.audioCodec) ? livekit_models_1.audioCodecFromJSON(object.audioCodec) : 0,
            bitrate: isSet(object.bitrate) ? Number(object.bitrate) : 0,
            disableDtx: isSet(object.disableDtx) ? Boolean(object.disableDtx) : false,
            channels: isSet(object.channels) ? Number(object.channels) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.audioCodec !== undefined && (obj.audioCodec = livekit_models_1.audioCodecToJSON(message.audioCodec));
        message.bitrate !== undefined && (obj.bitrate = Math.round(message.bitrate));
        message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
        message.channels !== undefined && (obj.channels = Math.round(message.channels));
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseIngressAudioEncodingOptions();
        message.audioCodec = (_a = object.audioCodec) !== null && _a !== void 0 ? _a : 0;
        message.bitrate = (_b = object.bitrate) !== null && _b !== void 0 ? _b : 0;
        message.disableDtx = (_c = object.disableDtx) !== null && _c !== void 0 ? _c : false;
        message.channels = (_d = object.channels) !== null && _d !== void 0 ? _d : 0;
        return message;
    }
};
function createBaseIngressVideoEncodingOptions() {
    return {
        videoCodec: 0,
        frameRate: 0,
        layers: []
    };
}
exports.IngressVideoEncodingOptions = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.videoCodec !== undefined && message.videoCodec !== 0) {
            writer.uint32(8).int32(message.videoCodec);
        }
        if (message.frameRate !== undefined && message.frameRate !== 0) {
            writer.uint32(17).double(message.frameRate);
        }
        if (message.layers !== undefined && message.layers.length !== 0) {
            for (const v of message.layers){
                livekit_models_1.VideoLayer.encode(v, writer.uint32(26).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIngressVideoEncodingOptions();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.videoCodec = reader.int32();
                    break;
                case 2:
                    message.frameRate = reader.double();
                    break;
                case 3:
                    message.layers.push(livekit_models_1.VideoLayer.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            videoCodec: isSet(object.videoCodec) ? livekit_models_1.videoCodecFromJSON(object.videoCodec) : 0,
            frameRate: isSet(object.frameRate) ? Number(object.frameRate) : 0,
            layers: Array.isArray(object === null || object === void 0 ? void 0 : object.layers) ? object.layers.map((e)=>livekit_models_1.VideoLayer.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.videoCodec !== undefined && (obj.videoCodec = livekit_models_1.videoCodecToJSON(message.videoCodec));
        message.frameRate !== undefined && (obj.frameRate = message.frameRate);
        if (message.layers) {
            obj.layers = message.layers.map((e)=>e ? livekit_models_1.VideoLayer.toJSON(e) : undefined);
        } else {
            obj.layers = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseIngressVideoEncodingOptions();
        message.videoCodec = (_a = object.videoCodec) !== null && _a !== void 0 ? _a : 0;
        message.frameRate = (_b = object.frameRate) !== null && _b !== void 0 ? _b : 0;
        message.layers = ((_c = object.layers) === null || _c === void 0 ? void 0 : _c.map((e)=>livekit_models_1.VideoLayer.fromPartial(e))) || [];
        return message;
    }
};
function createBaseIngressInfo() {
    return {
        ingressId: "",
        name: "",
        streamKey: "",
        url: "",
        inputType: 0,
        bypassTranscoding: false,
        audio: undefined,
        video: undefined,
        roomName: "",
        participantIdentity: "",
        participantName: "",
        reusable: false,
        state: undefined
    };
}
exports.IngressInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.ingressId !== undefined && message.ingressId !== "") {
            writer.uint32(10).string(message.ingressId);
        }
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.streamKey !== undefined && message.streamKey !== "") {
            writer.uint32(26).string(message.streamKey);
        }
        if (message.url !== undefined && message.url !== "") {
            writer.uint32(34).string(message.url);
        }
        if (message.inputType !== undefined && message.inputType !== 0) {
            writer.uint32(40).int32(message.inputType);
        }
        if (message.bypassTranscoding === true) {
            writer.uint32(104).bool(message.bypassTranscoding);
        }
        if (message.audio !== undefined) {
            exports.IngressAudioOptions.encode(message.audio, writer.uint32(50).fork()).ldelim();
        }
        if (message.video !== undefined) {
            exports.IngressVideoOptions.encode(message.video, writer.uint32(58).fork()).ldelim();
        }
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(66).string(message.roomName);
        }
        if (message.participantIdentity !== undefined && message.participantIdentity !== "") {
            writer.uint32(74).string(message.participantIdentity);
        }
        if (message.participantName !== undefined && message.participantName !== "") {
            writer.uint32(82).string(message.participantName);
        }
        if (message.reusable === true) {
            writer.uint32(88).bool(message.reusable);
        }
        if (message.state !== undefined) {
            exports.IngressState.encode(message.state, writer.uint32(98).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIngressInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.ingressId = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.streamKey = reader.string();
                    break;
                case 4:
                    message.url = reader.string();
                    break;
                case 5:
                    message.inputType = reader.int32();
                    break;
                case 13:
                    message.bypassTranscoding = reader.bool();
                    break;
                case 6:
                    message.audio = exports.IngressAudioOptions.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.video = exports.IngressVideoOptions.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.roomName = reader.string();
                    break;
                case 9:
                    message.participantIdentity = reader.string();
                    break;
                case 10:
                    message.participantName = reader.string();
                    break;
                case 11:
                    message.reusable = reader.bool();
                    break;
                case 12:
                    message.state = exports.IngressState.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            ingressId: isSet(object.ingressId) ? String(object.ingressId) : "",
            name: isSet(object.name) ? String(object.name) : "",
            streamKey: isSet(object.streamKey) ? String(object.streamKey) : "",
            url: isSet(object.url) ? String(object.url) : "",
            inputType: isSet(object.inputType) ? ingressInputFromJSON(object.inputType) : 0,
            bypassTranscoding: isSet(object.bypassTranscoding) ? Boolean(object.bypassTranscoding) : false,
            audio: isSet(object.audio) ? exports.IngressAudioOptions.fromJSON(object.audio) : undefined,
            video: isSet(object.video) ? exports.IngressVideoOptions.fromJSON(object.video) : undefined,
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            participantIdentity: isSet(object.participantIdentity) ? String(object.participantIdentity) : "",
            participantName: isSet(object.participantName) ? String(object.participantName) : "",
            reusable: isSet(object.reusable) ? Boolean(object.reusable) : false,
            state: isSet(object.state) ? exports.IngressState.fromJSON(object.state) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.ingressId !== undefined && (obj.ingressId = message.ingressId);
        message.name !== undefined && (obj.name = message.name);
        message.streamKey !== undefined && (obj.streamKey = message.streamKey);
        message.url !== undefined && (obj.url = message.url);
        message.inputType !== undefined && (obj.inputType = ingressInputToJSON(message.inputType));
        message.bypassTranscoding !== undefined && (obj.bypassTranscoding = message.bypassTranscoding);
        message.audio !== undefined && (obj.audio = message.audio ? exports.IngressAudioOptions.toJSON(message.audio) : undefined);
        message.video !== undefined && (obj.video = message.video ? exports.IngressVideoOptions.toJSON(message.video) : undefined);
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.participantIdentity !== undefined && (obj.participantIdentity = message.participantIdentity);
        message.participantName !== undefined && (obj.participantName = message.participantName);
        message.reusable !== undefined && (obj.reusable = message.reusable);
        message.state !== undefined && (obj.state = message.state ? exports.IngressState.toJSON(message.state) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseIngressInfo();
        message.ingressId = (_a = object.ingressId) !== null && _a !== void 0 ? _a : "";
        message.name = (_b = object.name) !== null && _b !== void 0 ? _b : "";
        message.streamKey = (_c = object.streamKey) !== null && _c !== void 0 ? _c : "";
        message.url = (_d = object.url) !== null && _d !== void 0 ? _d : "";
        message.inputType = (_e = object.inputType) !== null && _e !== void 0 ? _e : 0;
        message.bypassTranscoding = (_f = object.bypassTranscoding) !== null && _f !== void 0 ? _f : false;
        message.audio = object.audio !== undefined && object.audio !== null ? exports.IngressAudioOptions.fromPartial(object.audio) : undefined;
        message.video = object.video !== undefined && object.video !== null ? exports.IngressVideoOptions.fromPartial(object.video) : undefined;
        message.roomName = (_g = object.roomName) !== null && _g !== void 0 ? _g : "";
        message.participantIdentity = (_h = object.participantIdentity) !== null && _h !== void 0 ? _h : "";
        message.participantName = (_j = object.participantName) !== null && _j !== void 0 ? _j : "";
        message.reusable = (_k = object.reusable) !== null && _k !== void 0 ? _k : false;
        message.state = object.state !== undefined && object.state !== null ? exports.IngressState.fromPartial(object.state) : undefined;
        return message;
    }
};
function createBaseIngressState() {
    return {
        status: 0,
        error: "",
        video: undefined,
        audio: undefined,
        roomId: "",
        startedAt: 0,
        endedAt: 0,
        resourceId: "",
        tracks: []
    };
}
exports.IngressState = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.status !== undefined && message.status !== 0) {
            writer.uint32(8).int32(message.status);
        }
        if (message.error !== undefined && message.error !== "") {
            writer.uint32(18).string(message.error);
        }
        if (message.video !== undefined) {
            exports.InputVideoState.encode(message.video, writer.uint32(26).fork()).ldelim();
        }
        if (message.audio !== undefined) {
            exports.InputAudioState.encode(message.audio, writer.uint32(34).fork()).ldelim();
        }
        if (message.roomId !== undefined && message.roomId !== "") {
            writer.uint32(42).string(message.roomId);
        }
        if (message.startedAt !== undefined && message.startedAt !== 0) {
            writer.uint32(56).int64(message.startedAt);
        }
        if (message.endedAt !== undefined && message.endedAt !== 0) {
            writer.uint32(64).int64(message.endedAt);
        }
        if (message.resourceId !== undefined && message.resourceId !== "") {
            writer.uint32(74).string(message.resourceId);
        }
        if (message.tracks !== undefined && message.tracks.length !== 0) {
            for (const v of message.tracks){
                livekit_models_1.TrackInfo.encode(v, writer.uint32(50).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIngressState();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.status = reader.int32();
                    break;
                case 2:
                    message.error = reader.string();
                    break;
                case 3:
                    message.video = exports.InputVideoState.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.audio = exports.InputAudioState.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.roomId = reader.string();
                    break;
                case 7:
                    message.startedAt = longToNumber(reader.int64());
                    break;
                case 8:
                    message.endedAt = longToNumber(reader.int64());
                    break;
                case 9:
                    message.resourceId = reader.string();
                    break;
                case 6:
                    message.tracks.push(livekit_models_1.TrackInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            status: isSet(object.status) ? ingressState_StatusFromJSON(object.status) : 0,
            error: isSet(object.error) ? String(object.error) : "",
            video: isSet(object.video) ? exports.InputVideoState.fromJSON(object.video) : undefined,
            audio: isSet(object.audio) ? exports.InputAudioState.fromJSON(object.audio) : undefined,
            roomId: isSet(object.roomId) ? String(object.roomId) : "",
            startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
            endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
            resourceId: isSet(object.resourceId) ? String(object.resourceId) : "",
            tracks: Array.isArray(object === null || object === void 0 ? void 0 : object.tracks) ? object.tracks.map((e)=>livekit_models_1.TrackInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.status !== undefined && (obj.status = ingressState_StatusToJSON(message.status));
        message.error !== undefined && (obj.error = message.error);
        message.video !== undefined && (obj.video = message.video ? exports.InputVideoState.toJSON(message.video) : undefined);
        message.audio !== undefined && (obj.audio = message.audio ? exports.InputAudioState.toJSON(message.audio) : undefined);
        message.roomId !== undefined && (obj.roomId = message.roomId);
        message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
        message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
        message.resourceId !== undefined && (obj.resourceId = message.resourceId);
        if (message.tracks) {
            obj.tracks = message.tracks.map((e)=>e ? livekit_models_1.TrackInfo.toJSON(e) : undefined);
        } else {
            obj.tracks = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseIngressState();
        message.status = (_a = object.status) !== null && _a !== void 0 ? _a : 0;
        message.error = (_b = object.error) !== null && _b !== void 0 ? _b : "";
        message.video = object.video !== undefined && object.video !== null ? exports.InputVideoState.fromPartial(object.video) : undefined;
        message.audio = object.audio !== undefined && object.audio !== null ? exports.InputAudioState.fromPartial(object.audio) : undefined;
        message.roomId = (_c = object.roomId) !== null && _c !== void 0 ? _c : "";
        message.startedAt = (_d = object.startedAt) !== null && _d !== void 0 ? _d : 0;
        message.endedAt = (_e = object.endedAt) !== null && _e !== void 0 ? _e : 0;
        message.resourceId = (_f = object.resourceId) !== null && _f !== void 0 ? _f : "";
        message.tracks = ((_g = object.tracks) === null || _g === void 0 ? void 0 : _g.map((e)=>livekit_models_1.TrackInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseInputVideoState() {
    return {
        mimeType: "",
        averageBitrate: 0,
        width: 0,
        height: 0,
        framerate: 0
    };
}
exports.InputVideoState = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.mimeType !== undefined && message.mimeType !== "") {
            writer.uint32(10).string(message.mimeType);
        }
        if (message.averageBitrate !== undefined && message.averageBitrate !== 0) {
            writer.uint32(16).uint32(message.averageBitrate);
        }
        if (message.width !== undefined && message.width !== 0) {
            writer.uint32(24).uint32(message.width);
        }
        if (message.height !== undefined && message.height !== 0) {
            writer.uint32(32).uint32(message.height);
        }
        if (message.framerate !== undefined && message.framerate !== 0) {
            writer.uint32(41).double(message.framerate);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInputVideoState();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.mimeType = reader.string();
                    break;
                case 2:
                    message.averageBitrate = reader.uint32();
                    break;
                case 3:
                    message.width = reader.uint32();
                    break;
                case 4:
                    message.height = reader.uint32();
                    break;
                case 5:
                    message.framerate = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            mimeType: isSet(object.mimeType) ? String(object.mimeType) : "",
            averageBitrate: isSet(object.averageBitrate) ? Number(object.averageBitrate) : 0,
            width: isSet(object.width) ? Number(object.width) : 0,
            height: isSet(object.height) ? Number(object.height) : 0,
            framerate: isSet(object.framerate) ? Number(object.framerate) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.mimeType !== undefined && (obj.mimeType = message.mimeType);
        message.averageBitrate !== undefined && (obj.averageBitrate = Math.round(message.averageBitrate));
        message.width !== undefined && (obj.width = Math.round(message.width));
        message.height !== undefined && (obj.height = Math.round(message.height));
        message.framerate !== undefined && (obj.framerate = message.framerate);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseInputVideoState();
        message.mimeType = (_a = object.mimeType) !== null && _a !== void 0 ? _a : "";
        message.averageBitrate = (_b = object.averageBitrate) !== null && _b !== void 0 ? _b : 0;
        message.width = (_c = object.width) !== null && _c !== void 0 ? _c : 0;
        message.height = (_d = object.height) !== null && _d !== void 0 ? _d : 0;
        message.framerate = (_e = object.framerate) !== null && _e !== void 0 ? _e : 0;
        return message;
    }
};
function createBaseInputAudioState() {
    return {
        mimeType: "",
        averageBitrate: 0,
        channels: 0,
        sampleRate: 0
    };
}
exports.InputAudioState = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.mimeType !== undefined && message.mimeType !== "") {
            writer.uint32(10).string(message.mimeType);
        }
        if (message.averageBitrate !== undefined && message.averageBitrate !== 0) {
            writer.uint32(16).uint32(message.averageBitrate);
        }
        if (message.channels !== undefined && message.channels !== 0) {
            writer.uint32(24).uint32(message.channels);
        }
        if (message.sampleRate !== undefined && message.sampleRate !== 0) {
            writer.uint32(32).uint32(message.sampleRate);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInputAudioState();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.mimeType = reader.string();
                    break;
                case 2:
                    message.averageBitrate = reader.uint32();
                    break;
                case 3:
                    message.channels = reader.uint32();
                    break;
                case 4:
                    message.sampleRate = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            mimeType: isSet(object.mimeType) ? String(object.mimeType) : "",
            averageBitrate: isSet(object.averageBitrate) ? Number(object.averageBitrate) : 0,
            channels: isSet(object.channels) ? Number(object.channels) : 0,
            sampleRate: isSet(object.sampleRate) ? Number(object.sampleRate) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.mimeType !== undefined && (obj.mimeType = message.mimeType);
        message.averageBitrate !== undefined && (obj.averageBitrate = Math.round(message.averageBitrate));
        message.channels !== undefined && (obj.channels = Math.round(message.channels));
        message.sampleRate !== undefined && (obj.sampleRate = Math.round(message.sampleRate));
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseInputAudioState();
        message.mimeType = (_a = object.mimeType) !== null && _a !== void 0 ? _a : "";
        message.averageBitrate = (_b = object.averageBitrate) !== null && _b !== void 0 ? _b : 0;
        message.channels = (_c = object.channels) !== null && _c !== void 0 ? _c : 0;
        message.sampleRate = (_d = object.sampleRate) !== null && _d !== void 0 ? _d : 0;
        return message;
    }
};
function createBaseUpdateIngressRequest() {
    return {
        ingressId: "",
        name: "",
        roomName: "",
        participantIdentity: "",
        participantName: "",
        bypassTranscoding: undefined,
        audio: undefined,
        video: undefined
    };
}
exports.UpdateIngressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.ingressId !== undefined && message.ingressId !== "") {
            writer.uint32(10).string(message.ingressId);
        }
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(26).string(message.roomName);
        }
        if (message.participantIdentity !== undefined && message.participantIdentity !== "") {
            writer.uint32(34).string(message.participantIdentity);
        }
        if (message.participantName !== undefined && message.participantName !== "") {
            writer.uint32(42).string(message.participantName);
        }
        if (message.bypassTranscoding !== undefined) {
            writer.uint32(64).bool(message.bypassTranscoding);
        }
        if (message.audio !== undefined) {
            exports.IngressAudioOptions.encode(message.audio, writer.uint32(50).fork()).ldelim();
        }
        if (message.video !== undefined) {
            exports.IngressVideoOptions.encode(message.video, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateIngressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.ingressId = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.roomName = reader.string();
                    break;
                case 4:
                    message.participantIdentity = reader.string();
                    break;
                case 5:
                    message.participantName = reader.string();
                    break;
                case 8:
                    message.bypassTranscoding = reader.bool();
                    break;
                case 6:
                    message.audio = exports.IngressAudioOptions.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.video = exports.IngressVideoOptions.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            ingressId: isSet(object.ingressId) ? String(object.ingressId) : "",
            name: isSet(object.name) ? String(object.name) : "",
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            participantIdentity: isSet(object.participantIdentity) ? String(object.participantIdentity) : "",
            participantName: isSet(object.participantName) ? String(object.participantName) : "",
            bypassTranscoding: isSet(object.bypassTranscoding) ? Boolean(object.bypassTranscoding) : undefined,
            audio: isSet(object.audio) ? exports.IngressAudioOptions.fromJSON(object.audio) : undefined,
            video: isSet(object.video) ? exports.IngressVideoOptions.fromJSON(object.video) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.ingressId !== undefined && (obj.ingressId = message.ingressId);
        message.name !== undefined && (obj.name = message.name);
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.participantIdentity !== undefined && (obj.participantIdentity = message.participantIdentity);
        message.participantName !== undefined && (obj.participantName = message.participantName);
        message.bypassTranscoding !== undefined && (obj.bypassTranscoding = message.bypassTranscoding);
        message.audio !== undefined && (obj.audio = message.audio ? exports.IngressAudioOptions.toJSON(message.audio) : undefined);
        message.video !== undefined && (obj.video = message.video ? exports.IngressVideoOptions.toJSON(message.video) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseUpdateIngressRequest();
        message.ingressId = (_a = object.ingressId) !== null && _a !== void 0 ? _a : "";
        message.name = (_b = object.name) !== null && _b !== void 0 ? _b : "";
        message.roomName = (_c = object.roomName) !== null && _c !== void 0 ? _c : "";
        message.participantIdentity = (_d = object.participantIdentity) !== null && _d !== void 0 ? _d : "";
        message.participantName = (_e = object.participantName) !== null && _e !== void 0 ? _e : "";
        message.bypassTranscoding = (_f = object.bypassTranscoding) !== null && _f !== void 0 ? _f : undefined;
        message.audio = object.audio !== undefined && object.audio !== null ? exports.IngressAudioOptions.fromPartial(object.audio) : undefined;
        message.video = object.video !== undefined && object.video !== null ? exports.IngressVideoOptions.fromPartial(object.video) : undefined;
        return message;
    }
};
function createBaseListIngressRequest() {
    return {
        roomName: "",
        ingressId: ""
    };
}
exports.ListIngressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.roomName !== undefined && message.roomName !== "") {
            writer.uint32(10).string(message.roomName);
        }
        if (message.ingressId !== undefined && message.ingressId !== "") {
            writer.uint32(18).string(message.ingressId);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListIngressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.roomName = reader.string();
                    break;
                case 2:
                    message.ingressId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            roomName: isSet(object.roomName) ? String(object.roomName) : "",
            ingressId: isSet(object.ingressId) ? String(object.ingressId) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.roomName !== undefined && (obj.roomName = message.roomName);
        message.ingressId !== undefined && (obj.ingressId = message.ingressId);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseListIngressRequest();
        message.roomName = (_a = object.roomName) !== null && _a !== void 0 ? _a : "";
        message.ingressId = (_b = object.ingressId) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
function createBaseListIngressResponse() {
    return {
        items: []
    };
}
exports.ListIngressResponse = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.items !== undefined && message.items.length !== 0) {
            for (const v of message.items){
                exports.IngressInfo.encode(v, writer.uint32(10).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListIngressResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.items.push(exports.IngressInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            items: Array.isArray(object === null || object === void 0 ? void 0 : object.items) ? object.items.map((e)=>exports.IngressInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.items) {
            obj.items = message.items.map((e)=>e ? exports.IngressInfo.toJSON(e) : undefined);
        } else {
            obj.items = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseListIngressResponse();
        message.items = ((_a = object.items) === null || _a === void 0 ? void 0 : _a.map((e)=>exports.IngressInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseDeleteIngressRequest() {
    return {
        ingressId: ""
    };
}
exports.DeleteIngressRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.ingressId !== undefined && message.ingressId !== "") {
            writer.uint32(10).string(message.ingressId);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeleteIngressRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.ingressId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            ingressId: isSet(object.ingressId) ? String(object.ingressId) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.ingressId !== undefined && (obj.ingressId = message.ingressId);
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseDeleteIngressRequest();
        message.ingressId = (_a = object.ingressId) !== null && _a !== void 0 ? _a : "";
        return message;
    }
};
var globalThis = (()=>{
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (false) {}
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
} //# sourceMappingURL=livekit_ingress.js.map


/***/ }),

/***/ 49627:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ParticipantPermission = exports.PlayoutDelay = exports.Codec = exports.Room = exports.clientInfo_SDKToJSON = exports.clientInfo_SDKFromJSON = exports.ClientInfo_SDK = exports.serverInfo_EditionToJSON = exports.serverInfo_EditionFromJSON = exports.ServerInfo_Edition = exports.dataPacket_KindToJSON = exports.dataPacket_KindFromJSON = exports.DataPacket_Kind = exports.encryption_TypeToJSON = exports.encryption_TypeFromJSON = exports.Encryption_Type = exports.participantInfo_StateToJSON = exports.participantInfo_StateFromJSON = exports.ParticipantInfo_State = exports.subscriptionErrorToJSON = exports.subscriptionErrorFromJSON = exports.SubscriptionError = exports.reconnectReasonToJSON = exports.reconnectReasonFromJSON = exports.ReconnectReason = exports.disconnectReasonToJSON = exports.disconnectReasonFromJSON = exports.DisconnectReason = exports.clientConfigSettingToJSON = exports.clientConfigSettingFromJSON = exports.ClientConfigSetting = exports.connectionQualityToJSON = exports.connectionQualityFromJSON = exports.ConnectionQuality = exports.videoQualityToJSON = exports.videoQualityFromJSON = exports.VideoQuality = exports.trackSourceToJSON = exports.trackSourceFromJSON = exports.TrackSource = exports.trackTypeToJSON = exports.trackTypeFromJSON = exports.TrackType = exports.videoCodecToJSON = exports.videoCodecFromJSON = exports.VideoCodec = exports.audioCodecToJSON = exports.audioCodecFromJSON = exports.AudioCodec = exports.protobufPackage = void 0;
exports.TimedVersion = exports.RTPStats_GapHistogramEntry = exports.RTPStats = exports.DisabledCodecs = exports.VideoConfiguration = exports.ClientConfiguration = exports.ClientInfo = exports.ServerInfo = exports.ParticipantTracks = exports.UserPacket = exports.SpeakerInfo = exports.ActiveSpeakerUpdate = exports.DataPacket = exports.VideoLayer = exports.TrackInfo = exports.SimulcastCodecInfo = exports.Encryption = exports.ParticipantInfo = void 0;
/* eslint-disable */ const long_1 = __importDefault(__webpack_require__(21288));
const minimal_1 = __importDefault(__webpack_require__(51948));
const timestamp_1 = __webpack_require__(17905);
exports.protobufPackage = "livekit";
var AudioCodec;
(function(AudioCodec) {
    AudioCodec[AudioCodec["DEFAULT_AC"] = 0] = "DEFAULT_AC";
    AudioCodec[AudioCodec["OPUS"] = 1] = "OPUS";
    AudioCodec[AudioCodec["AAC"] = 2] = "AAC";
    AudioCodec[AudioCodec["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(AudioCodec = exports.AudioCodec || (exports.AudioCodec = {}));
function audioCodecFromJSON(object) {
    switch(object){
        case 0:
        case "DEFAULT_AC":
            return AudioCodec.DEFAULT_AC;
        case 1:
        case "OPUS":
            return AudioCodec.OPUS;
        case 2:
        case "AAC":
            return AudioCodec.AAC;
        case -1:
        case "UNRECOGNIZED":
        default:
            return AudioCodec.UNRECOGNIZED;
    }
}
exports.audioCodecFromJSON = audioCodecFromJSON;
function audioCodecToJSON(object) {
    switch(object){
        case AudioCodec.DEFAULT_AC:
            return "DEFAULT_AC";
        case AudioCodec.OPUS:
            return "OPUS";
        case AudioCodec.AAC:
            return "AAC";
        case AudioCodec.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.audioCodecToJSON = audioCodecToJSON;
var VideoCodec;
(function(VideoCodec) {
    VideoCodec[VideoCodec["DEFAULT_VC"] = 0] = "DEFAULT_VC";
    VideoCodec[VideoCodec["H264_BASELINE"] = 1] = "H264_BASELINE";
    VideoCodec[VideoCodec["H264_MAIN"] = 2] = "H264_MAIN";
    VideoCodec[VideoCodec["H264_HIGH"] = 3] = "H264_HIGH";
    VideoCodec[VideoCodec["VP8"] = 4] = "VP8";
    VideoCodec[VideoCodec["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VideoCodec = exports.VideoCodec || (exports.VideoCodec = {}));
function videoCodecFromJSON(object) {
    switch(object){
        case 0:
        case "DEFAULT_VC":
            return VideoCodec.DEFAULT_VC;
        case 1:
        case "H264_BASELINE":
            return VideoCodec.H264_BASELINE;
        case 2:
        case "H264_MAIN":
            return VideoCodec.H264_MAIN;
        case 3:
        case "H264_HIGH":
            return VideoCodec.H264_HIGH;
        case 4:
        case "VP8":
            return VideoCodec.VP8;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VideoCodec.UNRECOGNIZED;
    }
}
exports.videoCodecFromJSON = videoCodecFromJSON;
function videoCodecToJSON(object) {
    switch(object){
        case VideoCodec.DEFAULT_VC:
            return "DEFAULT_VC";
        case VideoCodec.H264_BASELINE:
            return "H264_BASELINE";
        case VideoCodec.H264_MAIN:
            return "H264_MAIN";
        case VideoCodec.H264_HIGH:
            return "H264_HIGH";
        case VideoCodec.VP8:
            return "VP8";
        case VideoCodec.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.videoCodecToJSON = videoCodecToJSON;
var TrackType;
(function(TrackType) {
    TrackType[TrackType["AUDIO"] = 0] = "AUDIO";
    TrackType[TrackType["VIDEO"] = 1] = "VIDEO";
    TrackType[TrackType["DATA"] = 2] = "DATA";
    TrackType[TrackType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TrackType = exports.TrackType || (exports.TrackType = {}));
function trackTypeFromJSON(object) {
    switch(object){
        case 0:
        case "AUDIO":
            return TrackType.AUDIO;
        case 1:
        case "VIDEO":
            return TrackType.VIDEO;
        case 2:
        case "DATA":
            return TrackType.DATA;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TrackType.UNRECOGNIZED;
    }
}
exports.trackTypeFromJSON = trackTypeFromJSON;
function trackTypeToJSON(object) {
    switch(object){
        case TrackType.AUDIO:
            return "AUDIO";
        case TrackType.VIDEO:
            return "VIDEO";
        case TrackType.DATA:
            return "DATA";
        case TrackType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.trackTypeToJSON = trackTypeToJSON;
var TrackSource;
(function(TrackSource) {
    TrackSource[TrackSource["UNKNOWN"] = 0] = "UNKNOWN";
    TrackSource[TrackSource["CAMERA"] = 1] = "CAMERA";
    TrackSource[TrackSource["MICROPHONE"] = 2] = "MICROPHONE";
    TrackSource[TrackSource["SCREEN_SHARE"] = 3] = "SCREEN_SHARE";
    TrackSource[TrackSource["SCREEN_SHARE_AUDIO"] = 4] = "SCREEN_SHARE_AUDIO";
    TrackSource[TrackSource["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TrackSource = exports.TrackSource || (exports.TrackSource = {}));
function trackSourceFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN":
            return TrackSource.UNKNOWN;
        case 1:
        case "CAMERA":
            return TrackSource.CAMERA;
        case 2:
        case "MICROPHONE":
            return TrackSource.MICROPHONE;
        case 3:
        case "SCREEN_SHARE":
            return TrackSource.SCREEN_SHARE;
        case 4:
        case "SCREEN_SHARE_AUDIO":
            return TrackSource.SCREEN_SHARE_AUDIO;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TrackSource.UNRECOGNIZED;
    }
}
exports.trackSourceFromJSON = trackSourceFromJSON;
function trackSourceToJSON(object) {
    switch(object){
        case TrackSource.UNKNOWN:
            return "UNKNOWN";
        case TrackSource.CAMERA:
            return "CAMERA";
        case TrackSource.MICROPHONE:
            return "MICROPHONE";
        case TrackSource.SCREEN_SHARE:
            return "SCREEN_SHARE";
        case TrackSource.SCREEN_SHARE_AUDIO:
            return "SCREEN_SHARE_AUDIO";
        case TrackSource.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.trackSourceToJSON = trackSourceToJSON;
var VideoQuality;
(function(VideoQuality) {
    VideoQuality[VideoQuality["LOW"] = 0] = "LOW";
    VideoQuality[VideoQuality["MEDIUM"] = 1] = "MEDIUM";
    VideoQuality[VideoQuality["HIGH"] = 2] = "HIGH";
    VideoQuality[VideoQuality["OFF"] = 3] = "OFF";
    VideoQuality[VideoQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VideoQuality = exports.VideoQuality || (exports.VideoQuality = {}));
function videoQualityFromJSON(object) {
    switch(object){
        case 0:
        case "LOW":
            return VideoQuality.LOW;
        case 1:
        case "MEDIUM":
            return VideoQuality.MEDIUM;
        case 2:
        case "HIGH":
            return VideoQuality.HIGH;
        case 3:
        case "OFF":
            return VideoQuality.OFF;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VideoQuality.UNRECOGNIZED;
    }
}
exports.videoQualityFromJSON = videoQualityFromJSON;
function videoQualityToJSON(object) {
    switch(object){
        case VideoQuality.LOW:
            return "LOW";
        case VideoQuality.MEDIUM:
            return "MEDIUM";
        case VideoQuality.HIGH:
            return "HIGH";
        case VideoQuality.OFF:
            return "OFF";
        case VideoQuality.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.videoQualityToJSON = videoQualityToJSON;
var ConnectionQuality;
(function(ConnectionQuality) {
    ConnectionQuality[ConnectionQuality["POOR"] = 0] = "POOR";
    ConnectionQuality[ConnectionQuality["GOOD"] = 1] = "GOOD";
    ConnectionQuality[ConnectionQuality["EXCELLENT"] = 2] = "EXCELLENT";
    ConnectionQuality[ConnectionQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ConnectionQuality = exports.ConnectionQuality || (exports.ConnectionQuality = {}));
function connectionQualityFromJSON(object) {
    switch(object){
        case 0:
        case "POOR":
            return ConnectionQuality.POOR;
        case 1:
        case "GOOD":
            return ConnectionQuality.GOOD;
        case 2:
        case "EXCELLENT":
            return ConnectionQuality.EXCELLENT;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ConnectionQuality.UNRECOGNIZED;
    }
}
exports.connectionQualityFromJSON = connectionQualityFromJSON;
function connectionQualityToJSON(object) {
    switch(object){
        case ConnectionQuality.POOR:
            return "POOR";
        case ConnectionQuality.GOOD:
            return "GOOD";
        case ConnectionQuality.EXCELLENT:
            return "EXCELLENT";
        case ConnectionQuality.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.connectionQualityToJSON = connectionQualityToJSON;
var ClientConfigSetting;
(function(ClientConfigSetting) {
    ClientConfigSetting[ClientConfigSetting["UNSET"] = 0] = "UNSET";
    ClientConfigSetting[ClientConfigSetting["DISABLED"] = 1] = "DISABLED";
    ClientConfigSetting[ClientConfigSetting["ENABLED"] = 2] = "ENABLED";
    ClientConfigSetting[ClientConfigSetting["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ClientConfigSetting = exports.ClientConfigSetting || (exports.ClientConfigSetting = {}));
function clientConfigSettingFromJSON(object) {
    switch(object){
        case 0:
        case "UNSET":
            return ClientConfigSetting.UNSET;
        case 1:
        case "DISABLED":
            return ClientConfigSetting.DISABLED;
        case 2:
        case "ENABLED":
            return ClientConfigSetting.ENABLED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ClientConfigSetting.UNRECOGNIZED;
    }
}
exports.clientConfigSettingFromJSON = clientConfigSettingFromJSON;
function clientConfigSettingToJSON(object) {
    switch(object){
        case ClientConfigSetting.UNSET:
            return "UNSET";
        case ClientConfigSetting.DISABLED:
            return "DISABLED";
        case ClientConfigSetting.ENABLED:
            return "ENABLED";
        case ClientConfigSetting.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.clientConfigSettingToJSON = clientConfigSettingToJSON;
var DisconnectReason;
(function(DisconnectReason) {
    DisconnectReason[DisconnectReason["UNKNOWN_REASON"] = 0] = "UNKNOWN_REASON";
    DisconnectReason[DisconnectReason["CLIENT_INITIATED"] = 1] = "CLIENT_INITIATED";
    DisconnectReason[DisconnectReason["DUPLICATE_IDENTITY"] = 2] = "DUPLICATE_IDENTITY";
    DisconnectReason[DisconnectReason["SERVER_SHUTDOWN"] = 3] = "SERVER_SHUTDOWN";
    DisconnectReason[DisconnectReason["PARTICIPANT_REMOVED"] = 4] = "PARTICIPANT_REMOVED";
    DisconnectReason[DisconnectReason["ROOM_DELETED"] = 5] = "ROOM_DELETED";
    DisconnectReason[DisconnectReason["STATE_MISMATCH"] = 6] = "STATE_MISMATCH";
    DisconnectReason[DisconnectReason["JOIN_FAILURE"] = 7] = "JOIN_FAILURE";
    DisconnectReason[DisconnectReason["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(DisconnectReason = exports.DisconnectReason || (exports.DisconnectReason = {}));
function disconnectReasonFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN_REASON":
            return DisconnectReason.UNKNOWN_REASON;
        case 1:
        case "CLIENT_INITIATED":
            return DisconnectReason.CLIENT_INITIATED;
        case 2:
        case "DUPLICATE_IDENTITY":
            return DisconnectReason.DUPLICATE_IDENTITY;
        case 3:
        case "SERVER_SHUTDOWN":
            return DisconnectReason.SERVER_SHUTDOWN;
        case 4:
        case "PARTICIPANT_REMOVED":
            return DisconnectReason.PARTICIPANT_REMOVED;
        case 5:
        case "ROOM_DELETED":
            return DisconnectReason.ROOM_DELETED;
        case 6:
        case "STATE_MISMATCH":
            return DisconnectReason.STATE_MISMATCH;
        case 7:
        case "JOIN_FAILURE":
            return DisconnectReason.JOIN_FAILURE;
        case -1:
        case "UNRECOGNIZED":
        default:
            return DisconnectReason.UNRECOGNIZED;
    }
}
exports.disconnectReasonFromJSON = disconnectReasonFromJSON;
function disconnectReasonToJSON(object) {
    switch(object){
        case DisconnectReason.UNKNOWN_REASON:
            return "UNKNOWN_REASON";
        case DisconnectReason.CLIENT_INITIATED:
            return "CLIENT_INITIATED";
        case DisconnectReason.DUPLICATE_IDENTITY:
            return "DUPLICATE_IDENTITY";
        case DisconnectReason.SERVER_SHUTDOWN:
            return "SERVER_SHUTDOWN";
        case DisconnectReason.PARTICIPANT_REMOVED:
            return "PARTICIPANT_REMOVED";
        case DisconnectReason.ROOM_DELETED:
            return "ROOM_DELETED";
        case DisconnectReason.STATE_MISMATCH:
            return "STATE_MISMATCH";
        case DisconnectReason.JOIN_FAILURE:
            return "JOIN_FAILURE";
        case DisconnectReason.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.disconnectReasonToJSON = disconnectReasonToJSON;
var ReconnectReason;
(function(ReconnectReason) {
    ReconnectReason[ReconnectReason["RR_UNKNOWN"] = 0] = "RR_UNKNOWN";
    ReconnectReason[ReconnectReason["RR_SIGNAL_DISCONNECTED"] = 1] = "RR_SIGNAL_DISCONNECTED";
    ReconnectReason[ReconnectReason["RR_PUBLISHER_FAILED"] = 2] = "RR_PUBLISHER_FAILED";
    ReconnectReason[ReconnectReason["RR_SUBSCRIBER_FAILED"] = 3] = "RR_SUBSCRIBER_FAILED";
    ReconnectReason[ReconnectReason["RR_SWITCH_CANDIDATE"] = 4] = "RR_SWITCH_CANDIDATE";
    ReconnectReason[ReconnectReason["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ReconnectReason = exports.ReconnectReason || (exports.ReconnectReason = {}));
function reconnectReasonFromJSON(object) {
    switch(object){
        case 0:
        case "RR_UNKNOWN":
            return ReconnectReason.RR_UNKNOWN;
        case 1:
        case "RR_SIGNAL_DISCONNECTED":
            return ReconnectReason.RR_SIGNAL_DISCONNECTED;
        case 2:
        case "RR_PUBLISHER_FAILED":
            return ReconnectReason.RR_PUBLISHER_FAILED;
        case 3:
        case "RR_SUBSCRIBER_FAILED":
            return ReconnectReason.RR_SUBSCRIBER_FAILED;
        case 4:
        case "RR_SWITCH_CANDIDATE":
            return ReconnectReason.RR_SWITCH_CANDIDATE;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ReconnectReason.UNRECOGNIZED;
    }
}
exports.reconnectReasonFromJSON = reconnectReasonFromJSON;
function reconnectReasonToJSON(object) {
    switch(object){
        case ReconnectReason.RR_UNKNOWN:
            return "RR_UNKNOWN";
        case ReconnectReason.RR_SIGNAL_DISCONNECTED:
            return "RR_SIGNAL_DISCONNECTED";
        case ReconnectReason.RR_PUBLISHER_FAILED:
            return "RR_PUBLISHER_FAILED";
        case ReconnectReason.RR_SUBSCRIBER_FAILED:
            return "RR_SUBSCRIBER_FAILED";
        case ReconnectReason.RR_SWITCH_CANDIDATE:
            return "RR_SWITCH_CANDIDATE";
        case ReconnectReason.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.reconnectReasonToJSON = reconnectReasonToJSON;
var SubscriptionError;
(function(SubscriptionError) {
    SubscriptionError[SubscriptionError["SE_UNKNOWN"] = 0] = "SE_UNKNOWN";
    SubscriptionError[SubscriptionError["SE_CODEC_UNSUPPORTED"] = 1] = "SE_CODEC_UNSUPPORTED";
    SubscriptionError[SubscriptionError["SE_TRACK_NOTFOUND"] = 2] = "SE_TRACK_NOTFOUND";
    SubscriptionError[SubscriptionError["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SubscriptionError = exports.SubscriptionError || (exports.SubscriptionError = {}));
function subscriptionErrorFromJSON(object) {
    switch(object){
        case 0:
        case "SE_UNKNOWN":
            return SubscriptionError.SE_UNKNOWN;
        case 1:
        case "SE_CODEC_UNSUPPORTED":
            return SubscriptionError.SE_CODEC_UNSUPPORTED;
        case 2:
        case "SE_TRACK_NOTFOUND":
            return SubscriptionError.SE_TRACK_NOTFOUND;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SubscriptionError.UNRECOGNIZED;
    }
}
exports.subscriptionErrorFromJSON = subscriptionErrorFromJSON;
function subscriptionErrorToJSON(object) {
    switch(object){
        case SubscriptionError.SE_UNKNOWN:
            return "SE_UNKNOWN";
        case SubscriptionError.SE_CODEC_UNSUPPORTED:
            return "SE_CODEC_UNSUPPORTED";
        case SubscriptionError.SE_TRACK_NOTFOUND:
            return "SE_TRACK_NOTFOUND";
        case SubscriptionError.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.subscriptionErrorToJSON = subscriptionErrorToJSON;
var ParticipantInfo_State;
(function(ParticipantInfo_State) {
    /** JOINING - websocket' connected, but not offered yet */ ParticipantInfo_State[ParticipantInfo_State["JOINING"] = 0] = "JOINING";
    /** JOINED - server received client offer */ ParticipantInfo_State[ParticipantInfo_State["JOINED"] = 1] = "JOINED";
    /** ACTIVE - ICE connectivity established */ ParticipantInfo_State[ParticipantInfo_State["ACTIVE"] = 2] = "ACTIVE";
    /** DISCONNECTED - WS disconnected */ ParticipantInfo_State[ParticipantInfo_State["DISCONNECTED"] = 3] = "DISCONNECTED";
    ParticipantInfo_State[ParticipantInfo_State["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ParticipantInfo_State = exports.ParticipantInfo_State || (exports.ParticipantInfo_State = {}));
function participantInfo_StateFromJSON(object) {
    switch(object){
        case 0:
        case "JOINING":
            return ParticipantInfo_State.JOINING;
        case 1:
        case "JOINED":
            return ParticipantInfo_State.JOINED;
        case 2:
        case "ACTIVE":
            return ParticipantInfo_State.ACTIVE;
        case 3:
        case "DISCONNECTED":
            return ParticipantInfo_State.DISCONNECTED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ParticipantInfo_State.UNRECOGNIZED;
    }
}
exports.participantInfo_StateFromJSON = participantInfo_StateFromJSON;
function participantInfo_StateToJSON(object) {
    switch(object){
        case ParticipantInfo_State.JOINING:
            return "JOINING";
        case ParticipantInfo_State.JOINED:
            return "JOINED";
        case ParticipantInfo_State.ACTIVE:
            return "ACTIVE";
        case ParticipantInfo_State.DISCONNECTED:
            return "DISCONNECTED";
        case ParticipantInfo_State.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.participantInfo_StateToJSON = participantInfo_StateToJSON;
var Encryption_Type;
(function(Encryption_Type) {
    Encryption_Type[Encryption_Type["NONE"] = 0] = "NONE";
    Encryption_Type[Encryption_Type["GCM"] = 1] = "GCM";
    Encryption_Type[Encryption_Type["CUSTOM"] = 2] = "CUSTOM";
    Encryption_Type[Encryption_Type["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(Encryption_Type = exports.Encryption_Type || (exports.Encryption_Type = {}));
function encryption_TypeFromJSON(object) {
    switch(object){
        case 0:
        case "NONE":
            return Encryption_Type.NONE;
        case 1:
        case "GCM":
            return Encryption_Type.GCM;
        case 2:
        case "CUSTOM":
            return Encryption_Type.CUSTOM;
        case -1:
        case "UNRECOGNIZED":
        default:
            return Encryption_Type.UNRECOGNIZED;
    }
}
exports.encryption_TypeFromJSON = encryption_TypeFromJSON;
function encryption_TypeToJSON(object) {
    switch(object){
        case Encryption_Type.NONE:
            return "NONE";
        case Encryption_Type.GCM:
            return "GCM";
        case Encryption_Type.CUSTOM:
            return "CUSTOM";
        case Encryption_Type.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.encryption_TypeToJSON = encryption_TypeToJSON;
var DataPacket_Kind;
(function(DataPacket_Kind) {
    DataPacket_Kind[DataPacket_Kind["RELIABLE"] = 0] = "RELIABLE";
    DataPacket_Kind[DataPacket_Kind["LOSSY"] = 1] = "LOSSY";
    DataPacket_Kind[DataPacket_Kind["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(DataPacket_Kind = exports.DataPacket_Kind || (exports.DataPacket_Kind = {}));
function dataPacket_KindFromJSON(object) {
    switch(object){
        case 0:
        case "RELIABLE":
            return DataPacket_Kind.RELIABLE;
        case 1:
        case "LOSSY":
            return DataPacket_Kind.LOSSY;
        case -1:
        case "UNRECOGNIZED":
        default:
            return DataPacket_Kind.UNRECOGNIZED;
    }
}
exports.dataPacket_KindFromJSON = dataPacket_KindFromJSON;
function dataPacket_KindToJSON(object) {
    switch(object){
        case DataPacket_Kind.RELIABLE:
            return "RELIABLE";
        case DataPacket_Kind.LOSSY:
            return "LOSSY";
        case DataPacket_Kind.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.dataPacket_KindToJSON = dataPacket_KindToJSON;
var ServerInfo_Edition;
(function(ServerInfo_Edition) {
    ServerInfo_Edition[ServerInfo_Edition["Standard"] = 0] = "Standard";
    ServerInfo_Edition[ServerInfo_Edition["Cloud"] = 1] = "Cloud";
    ServerInfo_Edition[ServerInfo_Edition["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ServerInfo_Edition = exports.ServerInfo_Edition || (exports.ServerInfo_Edition = {}));
function serverInfo_EditionFromJSON(object) {
    switch(object){
        case 0:
        case "Standard":
            return ServerInfo_Edition.Standard;
        case 1:
        case "Cloud":
            return ServerInfo_Edition.Cloud;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ServerInfo_Edition.UNRECOGNIZED;
    }
}
exports.serverInfo_EditionFromJSON = serverInfo_EditionFromJSON;
function serverInfo_EditionToJSON(object) {
    switch(object){
        case ServerInfo_Edition.Standard:
            return "Standard";
        case ServerInfo_Edition.Cloud:
            return "Cloud";
        case ServerInfo_Edition.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.serverInfo_EditionToJSON = serverInfo_EditionToJSON;
var ClientInfo_SDK;
(function(ClientInfo_SDK) {
    ClientInfo_SDK[ClientInfo_SDK["UNKNOWN"] = 0] = "UNKNOWN";
    ClientInfo_SDK[ClientInfo_SDK["JS"] = 1] = "JS";
    ClientInfo_SDK[ClientInfo_SDK["SWIFT"] = 2] = "SWIFT";
    ClientInfo_SDK[ClientInfo_SDK["ANDROID"] = 3] = "ANDROID";
    ClientInfo_SDK[ClientInfo_SDK["FLUTTER"] = 4] = "FLUTTER";
    ClientInfo_SDK[ClientInfo_SDK["GO"] = 5] = "GO";
    ClientInfo_SDK[ClientInfo_SDK["UNITY"] = 6] = "UNITY";
    ClientInfo_SDK[ClientInfo_SDK["REACT_NATIVE"] = 7] = "REACT_NATIVE";
    ClientInfo_SDK[ClientInfo_SDK["RUST"] = 8] = "RUST";
    ClientInfo_SDK[ClientInfo_SDK["PYTHON"] = 9] = "PYTHON";
    ClientInfo_SDK[ClientInfo_SDK["CPP"] = 10] = "CPP";
    ClientInfo_SDK[ClientInfo_SDK["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ClientInfo_SDK = exports.ClientInfo_SDK || (exports.ClientInfo_SDK = {}));
function clientInfo_SDKFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN":
            return ClientInfo_SDK.UNKNOWN;
        case 1:
        case "JS":
            return ClientInfo_SDK.JS;
        case 2:
        case "SWIFT":
            return ClientInfo_SDK.SWIFT;
        case 3:
        case "ANDROID":
            return ClientInfo_SDK.ANDROID;
        case 4:
        case "FLUTTER":
            return ClientInfo_SDK.FLUTTER;
        case 5:
        case "GO":
            return ClientInfo_SDK.GO;
        case 6:
        case "UNITY":
            return ClientInfo_SDK.UNITY;
        case 7:
        case "REACT_NATIVE":
            return ClientInfo_SDK.REACT_NATIVE;
        case 8:
        case "RUST":
            return ClientInfo_SDK.RUST;
        case 9:
        case "PYTHON":
            return ClientInfo_SDK.PYTHON;
        case 10:
        case "CPP":
            return ClientInfo_SDK.CPP;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ClientInfo_SDK.UNRECOGNIZED;
    }
}
exports.clientInfo_SDKFromJSON = clientInfo_SDKFromJSON;
function clientInfo_SDKToJSON(object) {
    switch(object){
        case ClientInfo_SDK.UNKNOWN:
            return "UNKNOWN";
        case ClientInfo_SDK.JS:
            return "JS";
        case ClientInfo_SDK.SWIFT:
            return "SWIFT";
        case ClientInfo_SDK.ANDROID:
            return "ANDROID";
        case ClientInfo_SDK.FLUTTER:
            return "FLUTTER";
        case ClientInfo_SDK.GO:
            return "GO";
        case ClientInfo_SDK.UNITY:
            return "UNITY";
        case ClientInfo_SDK.REACT_NATIVE:
            return "REACT_NATIVE";
        case ClientInfo_SDK.RUST:
            return "RUST";
        case ClientInfo_SDK.PYTHON:
            return "PYTHON";
        case ClientInfo_SDK.CPP:
            return "CPP";
        case ClientInfo_SDK.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.clientInfo_SDKToJSON = clientInfo_SDKToJSON;
function createBaseRoom() {
    return {
        sid: "",
        name: "",
        emptyTimeout: 0,
        maxParticipants: 0,
        creationTime: 0,
        turnPassword: "",
        enabledCodecs: [],
        metadata: "",
        numParticipants: 0,
        numPublishers: 0,
        activeRecording: false,
        playoutDelay: undefined
    };
}
exports.Room = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.emptyTimeout !== 0) {
            writer.uint32(24).uint32(message.emptyTimeout);
        }
        if (message.maxParticipants !== 0) {
            writer.uint32(32).uint32(message.maxParticipants);
        }
        if (message.creationTime !== 0) {
            writer.uint32(40).int64(message.creationTime);
        }
        if (message.turnPassword !== "") {
            writer.uint32(50).string(message.turnPassword);
        }
        for (const v of message.enabledCodecs){
            exports.Codec.encode(v, writer.uint32(58).fork()).ldelim();
        }
        if (message.metadata !== "") {
            writer.uint32(66).string(message.metadata);
        }
        if (message.numParticipants !== 0) {
            writer.uint32(72).uint32(message.numParticipants);
        }
        if (message.numPublishers !== 0) {
            writer.uint32(88).uint32(message.numPublishers);
        }
        if (message.activeRecording === true) {
            writer.uint32(80).bool(message.activeRecording);
        }
        if (message.playoutDelay !== undefined) {
            exports.PlayoutDelay.encode(message.playoutDelay, writer.uint32(98).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRoom();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.emptyTimeout = reader.uint32();
                    break;
                case 4:
                    message.maxParticipants = reader.uint32();
                    break;
                case 5:
                    message.creationTime = longToNumber(reader.int64());
                    break;
                case 6:
                    message.turnPassword = reader.string();
                    break;
                case 7:
                    message.enabledCodecs.push(exports.Codec.decode(reader, reader.uint32()));
                    break;
                case 8:
                    message.metadata = reader.string();
                    break;
                case 9:
                    message.numParticipants = reader.uint32();
                    break;
                case 11:
                    message.numPublishers = reader.uint32();
                    break;
                case 10:
                    message.activeRecording = reader.bool();
                    break;
                case 12:
                    message.playoutDelay = exports.PlayoutDelay.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            sid: isSet(object.sid) ? String(object.sid) : "",
            name: isSet(object.name) ? String(object.name) : "",
            emptyTimeout: isSet(object.emptyTimeout) ? Number(object.emptyTimeout) : 0,
            maxParticipants: isSet(object.maxParticipants) ? Number(object.maxParticipants) : 0,
            creationTime: isSet(object.creationTime) ? Number(object.creationTime) : 0,
            turnPassword: isSet(object.turnPassword) ? String(object.turnPassword) : "",
            enabledCodecs: Array.isArray(object === null || object === void 0 ? void 0 : object.enabledCodecs) ? object.enabledCodecs.map((e)=>exports.Codec.fromJSON(e)) : [],
            metadata: isSet(object.metadata) ? String(object.metadata) : "",
            numParticipants: isSet(object.numParticipants) ? Number(object.numParticipants) : 0,
            numPublishers: isSet(object.numPublishers) ? Number(object.numPublishers) : 0,
            activeRecording: isSet(object.activeRecording) ? Boolean(object.activeRecording) : false,
            playoutDelay: isSet(object.playoutDelay) ? exports.PlayoutDelay.fromJSON(object.playoutDelay) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.name !== undefined && (obj.name = message.name);
        message.emptyTimeout !== undefined && (obj.emptyTimeout = Math.round(message.emptyTimeout));
        message.maxParticipants !== undefined && (obj.maxParticipants = Math.round(message.maxParticipants));
        message.creationTime !== undefined && (obj.creationTime = Math.round(message.creationTime));
        message.turnPassword !== undefined && (obj.turnPassword = message.turnPassword);
        if (message.enabledCodecs) {
            obj.enabledCodecs = message.enabledCodecs.map((e)=>e ? exports.Codec.toJSON(e) : undefined);
        } else {
            obj.enabledCodecs = [];
        }
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.numParticipants !== undefined && (obj.numParticipants = Math.round(message.numParticipants));
        message.numPublishers !== undefined && (obj.numPublishers = Math.round(message.numPublishers));
        message.activeRecording !== undefined && (obj.activeRecording = message.activeRecording);
        message.playoutDelay !== undefined && (obj.playoutDelay = message.playoutDelay ? exports.PlayoutDelay.toJSON(message.playoutDelay) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = createBaseRoom();
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.name = (_b = object.name) !== null && _b !== void 0 ? _b : "";
        message.emptyTimeout = (_c = object.emptyTimeout) !== null && _c !== void 0 ? _c : 0;
        message.maxParticipants = (_d = object.maxParticipants) !== null && _d !== void 0 ? _d : 0;
        message.creationTime = (_e = object.creationTime) !== null && _e !== void 0 ? _e : 0;
        message.turnPassword = (_f = object.turnPassword) !== null && _f !== void 0 ? _f : "";
        message.enabledCodecs = ((_g = object.enabledCodecs) === null || _g === void 0 ? void 0 : _g.map((e)=>exports.Codec.fromPartial(e))) || [];
        message.metadata = (_h = object.metadata) !== null && _h !== void 0 ? _h : "";
        message.numParticipants = (_j = object.numParticipants) !== null && _j !== void 0 ? _j : 0;
        message.numPublishers = (_k = object.numPublishers) !== null && _k !== void 0 ? _k : 0;
        message.activeRecording = (_l = object.activeRecording) !== null && _l !== void 0 ? _l : false;
        message.playoutDelay = object.playoutDelay !== undefined && object.playoutDelay !== null ? exports.PlayoutDelay.fromPartial(object.playoutDelay) : undefined;
        return message;
    }
};
function createBaseCodec() {
    return {
        mime: "",
        fmtpLine: ""
    };
}
exports.Codec = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.mime !== "") {
            writer.uint32(10).string(message.mime);
        }
        if (message.fmtpLine !== "") {
            writer.uint32(18).string(message.fmtpLine);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCodec();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.mime = reader.string();
                    break;
                case 2:
                    message.fmtpLine = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            mime: isSet(object.mime) ? String(object.mime) : "",
            fmtpLine: isSet(object.fmtpLine) ? String(object.fmtpLine) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.mime !== undefined && (obj.mime = message.mime);
        message.fmtpLine !== undefined && (obj.fmtpLine = message.fmtpLine);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseCodec();
        message.mime = (_a = object.mime) !== null && _a !== void 0 ? _a : "";
        message.fmtpLine = (_b = object.fmtpLine) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
function createBasePlayoutDelay() {
    return {
        enabled: false,
        min: 0
    };
}
exports.PlayoutDelay = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.enabled === true) {
            writer.uint32(8).bool(message.enabled);
        }
        if (message.min !== 0) {
            writer.uint32(16).uint32(message.min);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePlayoutDelay();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.enabled = reader.bool();
                    break;
                case 2:
                    message.min = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            enabled: isSet(object.enabled) ? Boolean(object.enabled) : false,
            min: isSet(object.min) ? Number(object.min) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.enabled !== undefined && (obj.enabled = message.enabled);
        message.min !== undefined && (obj.min = Math.round(message.min));
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBasePlayoutDelay();
        message.enabled = (_a = object.enabled) !== null && _a !== void 0 ? _a : false;
        message.min = (_b = object.min) !== null && _b !== void 0 ? _b : 0;
        return message;
    }
};
function createBaseParticipantPermission() {
    return {
        canSubscribe: false,
        canPublish: false,
        canPublishData: false,
        canPublishSources: [],
        hidden: false,
        recorder: false,
        canUpdateMetadata: false
    };
}
exports.ParticipantPermission = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.canSubscribe === true) {
            writer.uint32(8).bool(message.canSubscribe);
        }
        if (message.canPublish === true) {
            writer.uint32(16).bool(message.canPublish);
        }
        if (message.canPublishData === true) {
            writer.uint32(24).bool(message.canPublishData);
        }
        writer.uint32(74).fork();
        for (const v of message.canPublishSources){
            writer.int32(v);
        }
        writer.ldelim();
        if (message.hidden === true) {
            writer.uint32(56).bool(message.hidden);
        }
        if (message.recorder === true) {
            writer.uint32(64).bool(message.recorder);
        }
        if (message.canUpdateMetadata === true) {
            writer.uint32(80).bool(message.canUpdateMetadata);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParticipantPermission();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.canSubscribe = reader.bool();
                    break;
                case 2:
                    message.canPublish = reader.bool();
                    break;
                case 3:
                    message.canPublishData = reader.bool();
                    break;
                case 9:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while(reader.pos < end2){
                            message.canPublishSources.push(reader.int32());
                        }
                    } else {
                        message.canPublishSources.push(reader.int32());
                    }
                    break;
                case 7:
                    message.hidden = reader.bool();
                    break;
                case 8:
                    message.recorder = reader.bool();
                    break;
                case 10:
                    message.canUpdateMetadata = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            canSubscribe: isSet(object.canSubscribe) ? Boolean(object.canSubscribe) : false,
            canPublish: isSet(object.canPublish) ? Boolean(object.canPublish) : false,
            canPublishData: isSet(object.canPublishData) ? Boolean(object.canPublishData) : false,
            canPublishSources: Array.isArray(object === null || object === void 0 ? void 0 : object.canPublishSources) ? object.canPublishSources.map((e)=>trackSourceFromJSON(e)) : [],
            hidden: isSet(object.hidden) ? Boolean(object.hidden) : false,
            recorder: isSet(object.recorder) ? Boolean(object.recorder) : false,
            canUpdateMetadata: isSet(object.canUpdateMetadata) ? Boolean(object.canUpdateMetadata) : false
        };
    },
    toJSON (message) {
        const obj = {};
        message.canSubscribe !== undefined && (obj.canSubscribe = message.canSubscribe);
        message.canPublish !== undefined && (obj.canPublish = message.canPublish);
        message.canPublishData !== undefined && (obj.canPublishData = message.canPublishData);
        if (message.canPublishSources) {
            obj.canPublishSources = message.canPublishSources.map((e)=>trackSourceToJSON(e));
        } else {
            obj.canPublishSources = [];
        }
        message.hidden !== undefined && (obj.hidden = message.hidden);
        message.recorder !== undefined && (obj.recorder = message.recorder);
        message.canUpdateMetadata !== undefined && (obj.canUpdateMetadata = message.canUpdateMetadata);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseParticipantPermission();
        message.canSubscribe = (_a = object.canSubscribe) !== null && _a !== void 0 ? _a : false;
        message.canPublish = (_b = object.canPublish) !== null && _b !== void 0 ? _b : false;
        message.canPublishData = (_c = object.canPublishData) !== null && _c !== void 0 ? _c : false;
        message.canPublishSources = ((_d = object.canPublishSources) === null || _d === void 0 ? void 0 : _d.map((e)=>e)) || [];
        message.hidden = (_e = object.hidden) !== null && _e !== void 0 ? _e : false;
        message.recorder = (_f = object.recorder) !== null && _f !== void 0 ? _f : false;
        message.canUpdateMetadata = (_g = object.canUpdateMetadata) !== null && _g !== void 0 ? _g : false;
        return message;
    }
};
function createBaseParticipantInfo() {
    return {
        sid: "",
        identity: "",
        state: 0,
        tracks: [],
        metadata: "",
        joinedAt: 0,
        name: "",
        version: 0,
        permission: undefined,
        region: "",
        isPublisher: false
    };
}
exports.ParticipantInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        if (message.state !== 0) {
            writer.uint32(24).int32(message.state);
        }
        for (const v of message.tracks){
            exports.TrackInfo.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.metadata !== "") {
            writer.uint32(42).string(message.metadata);
        }
        if (message.joinedAt !== 0) {
            writer.uint32(48).int64(message.joinedAt);
        }
        if (message.name !== "") {
            writer.uint32(74).string(message.name);
        }
        if (message.version !== 0) {
            writer.uint32(80).uint32(message.version);
        }
        if (message.permission !== undefined) {
            exports.ParticipantPermission.encode(message.permission, writer.uint32(90).fork()).ldelim();
        }
        if (message.region !== "") {
            writer.uint32(98).string(message.region);
        }
        if (message.isPublisher === true) {
            writer.uint32(104).bool(message.isPublisher);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParticipantInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.state = reader.int32();
                    break;
                case 4:
                    message.tracks.push(exports.TrackInfo.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.metadata = reader.string();
                    break;
                case 6:
                    message.joinedAt = longToNumber(reader.int64());
                    break;
                case 9:
                    message.name = reader.string();
                    break;
                case 10:
                    message.version = reader.uint32();
                    break;
                case 11:
                    message.permission = exports.ParticipantPermission.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.region = reader.string();
                    break;
                case 13:
                    message.isPublisher = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            sid: isSet(object.sid) ? String(object.sid) : "",
            identity: isSet(object.identity) ? String(object.identity) : "",
            state: isSet(object.state) ? participantInfo_StateFromJSON(object.state) : 0,
            tracks: Array.isArray(object === null || object === void 0 ? void 0 : object.tracks) ? object.tracks.map((e)=>exports.TrackInfo.fromJSON(e)) : [],
            metadata: isSet(object.metadata) ? String(object.metadata) : "",
            joinedAt: isSet(object.joinedAt) ? Number(object.joinedAt) : 0,
            name: isSet(object.name) ? String(object.name) : "",
            version: isSet(object.version) ? Number(object.version) : 0,
            permission: isSet(object.permission) ? exports.ParticipantPermission.fromJSON(object.permission) : undefined,
            region: isSet(object.region) ? String(object.region) : "",
            isPublisher: isSet(object.isPublisher) ? Boolean(object.isPublisher) : false
        };
    },
    toJSON (message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.identity !== undefined && (obj.identity = message.identity);
        message.state !== undefined && (obj.state = participantInfo_StateToJSON(message.state));
        if (message.tracks) {
            obj.tracks = message.tracks.map((e)=>e ? exports.TrackInfo.toJSON(e) : undefined);
        } else {
            obj.tracks = [];
        }
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.joinedAt !== undefined && (obj.joinedAt = Math.round(message.joinedAt));
        message.name !== undefined && (obj.name = message.name);
        message.version !== undefined && (obj.version = Math.round(message.version));
        message.permission !== undefined && (obj.permission = message.permission ? exports.ParticipantPermission.toJSON(message.permission) : undefined);
        message.region !== undefined && (obj.region = message.region);
        message.isPublisher !== undefined && (obj.isPublisher = message.isPublisher);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseParticipantInfo();
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        message.state = (_c = object.state) !== null && _c !== void 0 ? _c : 0;
        message.tracks = ((_d = object.tracks) === null || _d === void 0 ? void 0 : _d.map((e)=>exports.TrackInfo.fromPartial(e))) || [];
        message.metadata = (_e = object.metadata) !== null && _e !== void 0 ? _e : "";
        message.joinedAt = (_f = object.joinedAt) !== null && _f !== void 0 ? _f : 0;
        message.name = (_g = object.name) !== null && _g !== void 0 ? _g : "";
        message.version = (_h = object.version) !== null && _h !== void 0 ? _h : 0;
        message.permission = object.permission !== undefined && object.permission !== null ? exports.ParticipantPermission.fromPartial(object.permission) : undefined;
        message.region = (_j = object.region) !== null && _j !== void 0 ? _j : "";
        message.isPublisher = (_k = object.isPublisher) !== null && _k !== void 0 ? _k : false;
        return message;
    }
};
function createBaseEncryption() {
    return {};
}
exports.Encryption = {
    encode (_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEncryption();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        return {};
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseEncryption();
        return message;
    }
};
function createBaseSimulcastCodecInfo() {
    return {
        mimeType: "",
        mid: "",
        cid: "",
        layers: []
    };
}
exports.SimulcastCodecInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.mimeType !== "") {
            writer.uint32(10).string(message.mimeType);
        }
        if (message.mid !== "") {
            writer.uint32(18).string(message.mid);
        }
        if (message.cid !== "") {
            writer.uint32(26).string(message.cid);
        }
        for (const v of message.layers){
            exports.VideoLayer.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSimulcastCodecInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.mimeType = reader.string();
                    break;
                case 2:
                    message.mid = reader.string();
                    break;
                case 3:
                    message.cid = reader.string();
                    break;
                case 4:
                    message.layers.push(exports.VideoLayer.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            mimeType: isSet(object.mimeType) ? String(object.mimeType) : "",
            mid: isSet(object.mid) ? String(object.mid) : "",
            cid: isSet(object.cid) ? String(object.cid) : "",
            layers: Array.isArray(object === null || object === void 0 ? void 0 : object.layers) ? object.layers.map((e)=>exports.VideoLayer.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.mimeType !== undefined && (obj.mimeType = message.mimeType);
        message.mid !== undefined && (obj.mid = message.mid);
        message.cid !== undefined && (obj.cid = message.cid);
        if (message.layers) {
            obj.layers = message.layers.map((e)=>e ? exports.VideoLayer.toJSON(e) : undefined);
        } else {
            obj.layers = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseSimulcastCodecInfo();
        message.mimeType = (_a = object.mimeType) !== null && _a !== void 0 ? _a : "";
        message.mid = (_b = object.mid) !== null && _b !== void 0 ? _b : "";
        message.cid = (_c = object.cid) !== null && _c !== void 0 ? _c : "";
        message.layers = ((_d = object.layers) === null || _d === void 0 ? void 0 : _d.map((e)=>exports.VideoLayer.fromPartial(e))) || [];
        return message;
    }
};
function createBaseTrackInfo() {
    return {
        sid: "",
        type: 0,
        name: "",
        muted: false,
        width: 0,
        height: 0,
        simulcast: false,
        disableDtx: false,
        source: 0,
        layers: [],
        mimeType: "",
        mid: "",
        codecs: [],
        stereo: false,
        disableRed: false,
        encryption: 0,
        stream: ""
    };
}
exports.TrackInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.type !== 0) {
            writer.uint32(16).int32(message.type);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        if (message.muted === true) {
            writer.uint32(32).bool(message.muted);
        }
        if (message.width !== 0) {
            writer.uint32(40).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(48).uint32(message.height);
        }
        if (message.simulcast === true) {
            writer.uint32(56).bool(message.simulcast);
        }
        if (message.disableDtx === true) {
            writer.uint32(64).bool(message.disableDtx);
        }
        if (message.source !== 0) {
            writer.uint32(72).int32(message.source);
        }
        for (const v of message.layers){
            exports.VideoLayer.encode(v, writer.uint32(82).fork()).ldelim();
        }
        if (message.mimeType !== "") {
            writer.uint32(90).string(message.mimeType);
        }
        if (message.mid !== "") {
            writer.uint32(98).string(message.mid);
        }
        for (const v of message.codecs){
            exports.SimulcastCodecInfo.encode(v, writer.uint32(106).fork()).ldelim();
        }
        if (message.stereo === true) {
            writer.uint32(112).bool(message.stereo);
        }
        if (message.disableRed === true) {
            writer.uint32(120).bool(message.disableRed);
        }
        if (message.encryption !== 0) {
            writer.uint32(128).int32(message.encryption);
        }
        if (message.stream !== "") {
            writer.uint32(138).string(message.stream);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTrackInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.muted = reader.bool();
                    break;
                case 5:
                    message.width = reader.uint32();
                    break;
                case 6:
                    message.height = reader.uint32();
                    break;
                case 7:
                    message.simulcast = reader.bool();
                    break;
                case 8:
                    message.disableDtx = reader.bool();
                    break;
                case 9:
                    message.source = reader.int32();
                    break;
                case 10:
                    message.layers.push(exports.VideoLayer.decode(reader, reader.uint32()));
                    break;
                case 11:
                    message.mimeType = reader.string();
                    break;
                case 12:
                    message.mid = reader.string();
                    break;
                case 13:
                    message.codecs.push(exports.SimulcastCodecInfo.decode(reader, reader.uint32()));
                    break;
                case 14:
                    message.stereo = reader.bool();
                    break;
                case 15:
                    message.disableRed = reader.bool();
                    break;
                case 16:
                    message.encryption = reader.int32();
                    break;
                case 17:
                    message.stream = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            sid: isSet(object.sid) ? String(object.sid) : "",
            type: isSet(object.type) ? trackTypeFromJSON(object.type) : 0,
            name: isSet(object.name) ? String(object.name) : "",
            muted: isSet(object.muted) ? Boolean(object.muted) : false,
            width: isSet(object.width) ? Number(object.width) : 0,
            height: isSet(object.height) ? Number(object.height) : 0,
            simulcast: isSet(object.simulcast) ? Boolean(object.simulcast) : false,
            disableDtx: isSet(object.disableDtx) ? Boolean(object.disableDtx) : false,
            source: isSet(object.source) ? trackSourceFromJSON(object.source) : 0,
            layers: Array.isArray(object === null || object === void 0 ? void 0 : object.layers) ? object.layers.map((e)=>exports.VideoLayer.fromJSON(e)) : [],
            mimeType: isSet(object.mimeType) ? String(object.mimeType) : "",
            mid: isSet(object.mid) ? String(object.mid) : "",
            codecs: Array.isArray(object === null || object === void 0 ? void 0 : object.codecs) ? object.codecs.map((e)=>exports.SimulcastCodecInfo.fromJSON(e)) : [],
            stereo: isSet(object.stereo) ? Boolean(object.stereo) : false,
            disableRed: isSet(object.disableRed) ? Boolean(object.disableRed) : false,
            encryption: isSet(object.encryption) ? encryption_TypeFromJSON(object.encryption) : 0,
            stream: isSet(object.stream) ? String(object.stream) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.type !== undefined && (obj.type = trackTypeToJSON(message.type));
        message.name !== undefined && (obj.name = message.name);
        message.muted !== undefined && (obj.muted = message.muted);
        message.width !== undefined && (obj.width = Math.round(message.width));
        message.height !== undefined && (obj.height = Math.round(message.height));
        message.simulcast !== undefined && (obj.simulcast = message.simulcast);
        message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
        message.source !== undefined && (obj.source = trackSourceToJSON(message.source));
        if (message.layers) {
            obj.layers = message.layers.map((e)=>e ? exports.VideoLayer.toJSON(e) : undefined);
        } else {
            obj.layers = [];
        }
        message.mimeType !== undefined && (obj.mimeType = message.mimeType);
        message.mid !== undefined && (obj.mid = message.mid);
        if (message.codecs) {
            obj.codecs = message.codecs.map((e)=>e ? exports.SimulcastCodecInfo.toJSON(e) : undefined);
        } else {
            obj.codecs = [];
        }
        message.stereo !== undefined && (obj.stereo = message.stereo);
        message.disableRed !== undefined && (obj.disableRed = message.disableRed);
        message.encryption !== undefined && (obj.encryption = encryption_TypeToJSON(message.encryption));
        message.stream !== undefined && (obj.stream = message.stream);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        const message = createBaseTrackInfo();
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.type = (_b = object.type) !== null && _b !== void 0 ? _b : 0;
        message.name = (_c = object.name) !== null && _c !== void 0 ? _c : "";
        message.muted = (_d = object.muted) !== null && _d !== void 0 ? _d : false;
        message.width = (_e = object.width) !== null && _e !== void 0 ? _e : 0;
        message.height = (_f = object.height) !== null && _f !== void 0 ? _f : 0;
        message.simulcast = (_g = object.simulcast) !== null && _g !== void 0 ? _g : false;
        message.disableDtx = (_h = object.disableDtx) !== null && _h !== void 0 ? _h : false;
        message.source = (_j = object.source) !== null && _j !== void 0 ? _j : 0;
        message.layers = ((_k = object.layers) === null || _k === void 0 ? void 0 : _k.map((e)=>exports.VideoLayer.fromPartial(e))) || [];
        message.mimeType = (_l = object.mimeType) !== null && _l !== void 0 ? _l : "";
        message.mid = (_m = object.mid) !== null && _m !== void 0 ? _m : "";
        message.codecs = ((_o = object.codecs) === null || _o === void 0 ? void 0 : _o.map((e)=>exports.SimulcastCodecInfo.fromPartial(e))) || [];
        message.stereo = (_p = object.stereo) !== null && _p !== void 0 ? _p : false;
        message.disableRed = (_q = object.disableRed) !== null && _q !== void 0 ? _q : false;
        message.encryption = (_r = object.encryption) !== null && _r !== void 0 ? _r : 0;
        message.stream = (_s = object.stream) !== null && _s !== void 0 ? _s : "";
        return message;
    }
};
function createBaseVideoLayer() {
    return {
        quality: 0,
        width: 0,
        height: 0,
        bitrate: 0,
        ssrc: 0
    };
}
exports.VideoLayer = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.quality !== 0) {
            writer.uint32(8).int32(message.quality);
        }
        if (message.width !== 0) {
            writer.uint32(16).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(24).uint32(message.height);
        }
        if (message.bitrate !== 0) {
            writer.uint32(32).uint32(message.bitrate);
        }
        if (message.ssrc !== 0) {
            writer.uint32(40).uint32(message.ssrc);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoLayer();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.quality = reader.int32();
                    break;
                case 2:
                    message.width = reader.uint32();
                    break;
                case 3:
                    message.height = reader.uint32();
                    break;
                case 4:
                    message.bitrate = reader.uint32();
                    break;
                case 5:
                    message.ssrc = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            quality: isSet(object.quality) ? videoQualityFromJSON(object.quality) : 0,
            width: isSet(object.width) ? Number(object.width) : 0,
            height: isSet(object.height) ? Number(object.height) : 0,
            bitrate: isSet(object.bitrate) ? Number(object.bitrate) : 0,
            ssrc: isSet(object.ssrc) ? Number(object.ssrc) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.quality !== undefined && (obj.quality = videoQualityToJSON(message.quality));
        message.width !== undefined && (obj.width = Math.round(message.width));
        message.height !== undefined && (obj.height = Math.round(message.height));
        message.bitrate !== undefined && (obj.bitrate = Math.round(message.bitrate));
        message.ssrc !== undefined && (obj.ssrc = Math.round(message.ssrc));
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseVideoLayer();
        message.quality = (_a = object.quality) !== null && _a !== void 0 ? _a : 0;
        message.width = (_b = object.width) !== null && _b !== void 0 ? _b : 0;
        message.height = (_c = object.height) !== null && _c !== void 0 ? _c : 0;
        message.bitrate = (_d = object.bitrate) !== null && _d !== void 0 ? _d : 0;
        message.ssrc = (_e = object.ssrc) !== null && _e !== void 0 ? _e : 0;
        return message;
    }
};
function createBaseDataPacket() {
    return {
        kind: 0,
        user: undefined,
        speaker: undefined
    };
}
exports.DataPacket = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.kind !== 0) {
            writer.uint32(8).int32(message.kind);
        }
        if (message.user !== undefined) {
            exports.UserPacket.encode(message.user, writer.uint32(18).fork()).ldelim();
        }
        if (message.speaker !== undefined) {
            exports.ActiveSpeakerUpdate.encode(message.speaker, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDataPacket();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.kind = reader.int32();
                    break;
                case 2:
                    message.user = exports.UserPacket.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.speaker = exports.ActiveSpeakerUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            kind: isSet(object.kind) ? dataPacket_KindFromJSON(object.kind) : 0,
            user: isSet(object.user) ? exports.UserPacket.fromJSON(object.user) : undefined,
            speaker: isSet(object.speaker) ? exports.ActiveSpeakerUpdate.fromJSON(object.speaker) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.kind !== undefined && (obj.kind = dataPacket_KindToJSON(message.kind));
        message.user !== undefined && (obj.user = message.user ? exports.UserPacket.toJSON(message.user) : undefined);
        message.speaker !== undefined && (obj.speaker = message.speaker ? exports.ActiveSpeakerUpdate.toJSON(message.speaker) : undefined);
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseDataPacket();
        message.kind = (_a = object.kind) !== null && _a !== void 0 ? _a : 0;
        message.user = object.user !== undefined && object.user !== null ? exports.UserPacket.fromPartial(object.user) : undefined;
        message.speaker = object.speaker !== undefined && object.speaker !== null ? exports.ActiveSpeakerUpdate.fromPartial(object.speaker) : undefined;
        return message;
    }
};
function createBaseActiveSpeakerUpdate() {
    return {
        speakers: []
    };
}
exports.ActiveSpeakerUpdate = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.speakers){
            exports.SpeakerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseActiveSpeakerUpdate();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.speakers.push(exports.SpeakerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            speakers: Array.isArray(object === null || object === void 0 ? void 0 : object.speakers) ? object.speakers.map((e)=>exports.SpeakerInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.speakers) {
            obj.speakers = message.speakers.map((e)=>e ? exports.SpeakerInfo.toJSON(e) : undefined);
        } else {
            obj.speakers = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseActiveSpeakerUpdate();
        message.speakers = ((_a = object.speakers) === null || _a === void 0 ? void 0 : _a.map((e)=>exports.SpeakerInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseSpeakerInfo() {
    return {
        sid: "",
        level: 0,
        active: false
    };
}
exports.SpeakerInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.level !== 0) {
            writer.uint32(21).float(message.level);
        }
        if (message.active === true) {
            writer.uint32(24).bool(message.active);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSpeakerInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.level = reader.float();
                    break;
                case 3:
                    message.active = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            sid: isSet(object.sid) ? String(object.sid) : "",
            level: isSet(object.level) ? Number(object.level) : 0,
            active: isSet(object.active) ? Boolean(object.active) : false
        };
    },
    toJSON (message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.level !== undefined && (obj.level = message.level);
        message.active !== undefined && (obj.active = message.active);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c;
        const message = createBaseSpeakerInfo();
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.level = (_b = object.level) !== null && _b !== void 0 ? _b : 0;
        message.active = (_c = object.active) !== null && _c !== void 0 ? _c : false;
        return message;
    }
};
function createBaseUserPacket() {
    return {
        participantSid: "",
        payload: new Uint8Array(),
        destinationSids: [],
        topic: undefined
    };
}
exports.UserPacket = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.payload.length !== 0) {
            writer.uint32(18).bytes(message.payload);
        }
        for (const v of message.destinationSids){
            writer.uint32(26).string(v);
        }
        if (message.topic !== undefined) {
            writer.uint32(34).string(message.topic);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUserPacket();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.payload = reader.bytes();
                    break;
                case 3:
                    message.destinationSids.push(reader.string());
                    break;
                case 4:
                    message.topic = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            participantSid: isSet(object.participantSid) ? String(object.participantSid) : "",
            payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(),
            destinationSids: Array.isArray(object === null || object === void 0 ? void 0 : object.destinationSids) ? object.destinationSids.map((e)=>String(e)) : [],
            topic: isSet(object.topic) ? String(object.topic) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.participantSid !== undefined && (obj.participantSid = message.participantSid);
        message.payload !== undefined && (obj.payload = base64FromBytes(message.payload !== undefined ? message.payload : new Uint8Array()));
        if (message.destinationSids) {
            obj.destinationSids = message.destinationSids.map((e)=>e);
        } else {
            obj.destinationSids = [];
        }
        message.topic !== undefined && (obj.topic = message.topic);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseUserPacket();
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.payload = (_b = object.payload) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.destinationSids = ((_c = object.destinationSids) === null || _c === void 0 ? void 0 : _c.map((e)=>e)) || [];
        message.topic = (_d = object.topic) !== null && _d !== void 0 ? _d : undefined;
        return message;
    }
};
function createBaseParticipantTracks() {
    return {
        participantSid: "",
        trackSids: []
    };
}
exports.ParticipantTracks = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        for (const v of message.trackSids){
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParticipantTracks();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.trackSids.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            participantSid: isSet(object.participantSid) ? String(object.participantSid) : "",
            trackSids: Array.isArray(object === null || object === void 0 ? void 0 : object.trackSids) ? object.trackSids.map((e)=>String(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.participantSid !== undefined && (obj.participantSid = message.participantSid);
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e)=>e);
        } else {
            obj.trackSids = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseParticipantTracks();
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.trackSids = ((_b = object.trackSids) === null || _b === void 0 ? void 0 : _b.map((e)=>e)) || [];
        return message;
    }
};
function createBaseServerInfo() {
    return {
        edition: 0,
        version: "",
        protocol: 0,
        region: "",
        nodeId: "",
        debugInfo: ""
    };
}
exports.ServerInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.edition !== 0) {
            writer.uint32(8).int32(message.edition);
        }
        if (message.version !== "") {
            writer.uint32(18).string(message.version);
        }
        if (message.protocol !== 0) {
            writer.uint32(24).int32(message.protocol);
        }
        if (message.region !== "") {
            writer.uint32(34).string(message.region);
        }
        if (message.nodeId !== "") {
            writer.uint32(42).string(message.nodeId);
        }
        if (message.debugInfo !== "") {
            writer.uint32(50).string(message.debugInfo);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseServerInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.edition = reader.int32();
                    break;
                case 2:
                    message.version = reader.string();
                    break;
                case 3:
                    message.protocol = reader.int32();
                    break;
                case 4:
                    message.region = reader.string();
                    break;
                case 5:
                    message.nodeId = reader.string();
                    break;
                case 6:
                    message.debugInfo = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            edition: isSet(object.edition) ? serverInfo_EditionFromJSON(object.edition) : 0,
            version: isSet(object.version) ? String(object.version) : "",
            protocol: isSet(object.protocol) ? Number(object.protocol) : 0,
            region: isSet(object.region) ? String(object.region) : "",
            nodeId: isSet(object.nodeId) ? String(object.nodeId) : "",
            debugInfo: isSet(object.debugInfo) ? String(object.debugInfo) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.edition !== undefined && (obj.edition = serverInfo_EditionToJSON(message.edition));
        message.version !== undefined && (obj.version = message.version);
        message.protocol !== undefined && (obj.protocol = Math.round(message.protocol));
        message.region !== undefined && (obj.region = message.region);
        message.nodeId !== undefined && (obj.nodeId = message.nodeId);
        message.debugInfo !== undefined && (obj.debugInfo = message.debugInfo);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseServerInfo();
        message.edition = (_a = object.edition) !== null && _a !== void 0 ? _a : 0;
        message.version = (_b = object.version) !== null && _b !== void 0 ? _b : "";
        message.protocol = (_c = object.protocol) !== null && _c !== void 0 ? _c : 0;
        message.region = (_d = object.region) !== null && _d !== void 0 ? _d : "";
        message.nodeId = (_e = object.nodeId) !== null && _e !== void 0 ? _e : "";
        message.debugInfo = (_f = object.debugInfo) !== null && _f !== void 0 ? _f : "";
        return message;
    }
};
function createBaseClientInfo() {
    return {
        sdk: 0,
        version: "",
        protocol: 0,
        os: "",
        osVersion: "",
        deviceModel: "",
        browser: "",
        browserVersion: "",
        address: "",
        network: ""
    };
}
exports.ClientInfo = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.sdk !== 0) {
            writer.uint32(8).int32(message.sdk);
        }
        if (message.version !== "") {
            writer.uint32(18).string(message.version);
        }
        if (message.protocol !== 0) {
            writer.uint32(24).int32(message.protocol);
        }
        if (message.os !== "") {
            writer.uint32(34).string(message.os);
        }
        if (message.osVersion !== "") {
            writer.uint32(42).string(message.osVersion);
        }
        if (message.deviceModel !== "") {
            writer.uint32(50).string(message.deviceModel);
        }
        if (message.browser !== "") {
            writer.uint32(58).string(message.browser);
        }
        if (message.browserVersion !== "") {
            writer.uint32(66).string(message.browserVersion);
        }
        if (message.address !== "") {
            writer.uint32(74).string(message.address);
        }
        if (message.network !== "") {
            writer.uint32(82).string(message.network);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClientInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.sdk = reader.int32();
                    break;
                case 2:
                    message.version = reader.string();
                    break;
                case 3:
                    message.protocol = reader.int32();
                    break;
                case 4:
                    message.os = reader.string();
                    break;
                case 5:
                    message.osVersion = reader.string();
                    break;
                case 6:
                    message.deviceModel = reader.string();
                    break;
                case 7:
                    message.browser = reader.string();
                    break;
                case 8:
                    message.browserVersion = reader.string();
                    break;
                case 9:
                    message.address = reader.string();
                    break;
                case 10:
                    message.network = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            sdk: isSet(object.sdk) ? clientInfo_SDKFromJSON(object.sdk) : 0,
            version: isSet(object.version) ? String(object.version) : "",
            protocol: isSet(object.protocol) ? Number(object.protocol) : 0,
            os: isSet(object.os) ? String(object.os) : "",
            osVersion: isSet(object.osVersion) ? String(object.osVersion) : "",
            deviceModel: isSet(object.deviceModel) ? String(object.deviceModel) : "",
            browser: isSet(object.browser) ? String(object.browser) : "",
            browserVersion: isSet(object.browserVersion) ? String(object.browserVersion) : "",
            address: isSet(object.address) ? String(object.address) : "",
            network: isSet(object.network) ? String(object.network) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.sdk !== undefined && (obj.sdk = clientInfo_SDKToJSON(message.sdk));
        message.version !== undefined && (obj.version = message.version);
        message.protocol !== undefined && (obj.protocol = Math.round(message.protocol));
        message.os !== undefined && (obj.os = message.os);
        message.osVersion !== undefined && (obj.osVersion = message.osVersion);
        message.deviceModel !== undefined && (obj.deviceModel = message.deviceModel);
        message.browser !== undefined && (obj.browser = message.browser);
        message.browserVersion !== undefined && (obj.browserVersion = message.browserVersion);
        message.address !== undefined && (obj.address = message.address);
        message.network !== undefined && (obj.network = message.network);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseClientInfo();
        message.sdk = (_a = object.sdk) !== null && _a !== void 0 ? _a : 0;
        message.version = (_b = object.version) !== null && _b !== void 0 ? _b : "";
        message.protocol = (_c = object.protocol) !== null && _c !== void 0 ? _c : 0;
        message.os = (_d = object.os) !== null && _d !== void 0 ? _d : "";
        message.osVersion = (_e = object.osVersion) !== null && _e !== void 0 ? _e : "";
        message.deviceModel = (_f = object.deviceModel) !== null && _f !== void 0 ? _f : "";
        message.browser = (_g = object.browser) !== null && _g !== void 0 ? _g : "";
        message.browserVersion = (_h = object.browserVersion) !== null && _h !== void 0 ? _h : "";
        message.address = (_j = object.address) !== null && _j !== void 0 ? _j : "";
        message.network = (_k = object.network) !== null && _k !== void 0 ? _k : "";
        return message;
    }
};
function createBaseClientConfiguration() {
    return {
        video: undefined,
        screen: undefined,
        resumeConnection: 0,
        disabledCodecs: undefined,
        forceRelay: 0
    };
}
exports.ClientConfiguration = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.video !== undefined) {
            exports.VideoConfiguration.encode(message.video, writer.uint32(10).fork()).ldelim();
        }
        if (message.screen !== undefined) {
            exports.VideoConfiguration.encode(message.screen, writer.uint32(18).fork()).ldelim();
        }
        if (message.resumeConnection !== 0) {
            writer.uint32(24).int32(message.resumeConnection);
        }
        if (message.disabledCodecs !== undefined) {
            exports.DisabledCodecs.encode(message.disabledCodecs, writer.uint32(34).fork()).ldelim();
        }
        if (message.forceRelay !== 0) {
            writer.uint32(40).int32(message.forceRelay);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClientConfiguration();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.video = exports.VideoConfiguration.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.screen = exports.VideoConfiguration.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.resumeConnection = reader.int32();
                    break;
                case 4:
                    message.disabledCodecs = exports.DisabledCodecs.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.forceRelay = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            video: isSet(object.video) ? exports.VideoConfiguration.fromJSON(object.video) : undefined,
            screen: isSet(object.screen) ? exports.VideoConfiguration.fromJSON(object.screen) : undefined,
            resumeConnection: isSet(object.resumeConnection) ? clientConfigSettingFromJSON(object.resumeConnection) : 0,
            disabledCodecs: isSet(object.disabledCodecs) ? exports.DisabledCodecs.fromJSON(object.disabledCodecs) : undefined,
            forceRelay: isSet(object.forceRelay) ? clientConfigSettingFromJSON(object.forceRelay) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.video !== undefined && (obj.video = message.video ? exports.VideoConfiguration.toJSON(message.video) : undefined);
        message.screen !== undefined && (obj.screen = message.screen ? exports.VideoConfiguration.toJSON(message.screen) : undefined);
        message.resumeConnection !== undefined && (obj.resumeConnection = clientConfigSettingToJSON(message.resumeConnection));
        message.disabledCodecs !== undefined && (obj.disabledCodecs = message.disabledCodecs ? exports.DisabledCodecs.toJSON(message.disabledCodecs) : undefined);
        message.forceRelay !== undefined && (obj.forceRelay = clientConfigSettingToJSON(message.forceRelay));
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseClientConfiguration();
        message.video = object.video !== undefined && object.video !== null ? exports.VideoConfiguration.fromPartial(object.video) : undefined;
        message.screen = object.screen !== undefined && object.screen !== null ? exports.VideoConfiguration.fromPartial(object.screen) : undefined;
        message.resumeConnection = (_a = object.resumeConnection) !== null && _a !== void 0 ? _a : 0;
        message.disabledCodecs = object.disabledCodecs !== undefined && object.disabledCodecs !== null ? exports.DisabledCodecs.fromPartial(object.disabledCodecs) : undefined;
        message.forceRelay = (_b = object.forceRelay) !== null && _b !== void 0 ? _b : 0;
        return message;
    }
};
function createBaseVideoConfiguration() {
    return {
        hardwareEncoder: 0
    };
}
exports.VideoConfiguration = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.hardwareEncoder !== 0) {
            writer.uint32(8).int32(message.hardwareEncoder);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoConfiguration();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.hardwareEncoder = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            hardwareEncoder: isSet(object.hardwareEncoder) ? clientConfigSettingFromJSON(object.hardwareEncoder) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.hardwareEncoder !== undefined && (obj.hardwareEncoder = clientConfigSettingToJSON(message.hardwareEncoder));
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseVideoConfiguration();
        message.hardwareEncoder = (_a = object.hardwareEncoder) !== null && _a !== void 0 ? _a : 0;
        return message;
    }
};
function createBaseDisabledCodecs() {
    return {
        codecs: [],
        publish: []
    };
}
exports.DisabledCodecs = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.codecs){
            exports.Codec.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.publish){
            exports.Codec.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDisabledCodecs();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.codecs.push(exports.Codec.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.publish.push(exports.Codec.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            codecs: Array.isArray(object === null || object === void 0 ? void 0 : object.codecs) ? object.codecs.map((e)=>exports.Codec.fromJSON(e)) : [],
            publish: Array.isArray(object === null || object === void 0 ? void 0 : object.publish) ? object.publish.map((e)=>exports.Codec.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.codecs) {
            obj.codecs = message.codecs.map((e)=>e ? exports.Codec.toJSON(e) : undefined);
        } else {
            obj.codecs = [];
        }
        if (message.publish) {
            obj.publish = message.publish.map((e)=>e ? exports.Codec.toJSON(e) : undefined);
        } else {
            obj.publish = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseDisabledCodecs();
        message.codecs = ((_a = object.codecs) === null || _a === void 0 ? void 0 : _a.map((e)=>exports.Codec.fromPartial(e))) || [];
        message.publish = ((_b = object.publish) === null || _b === void 0 ? void 0 : _b.map((e)=>exports.Codec.fromPartial(e))) || [];
        return message;
    }
};
function createBaseRTPStats() {
    return {
        startTime: undefined,
        endTime: undefined,
        duration: 0,
        packets: 0,
        packetRate: 0,
        bytes: 0,
        headerBytes: 0,
        bitrate: 0,
        packetsLost: 0,
        packetLossRate: 0,
        packetLossPercentage: 0,
        packetsDuplicate: 0,
        packetDuplicateRate: 0,
        bytesDuplicate: 0,
        headerBytesDuplicate: 0,
        bitrateDuplicate: 0,
        packetsPadding: 0,
        packetPaddingRate: 0,
        bytesPadding: 0,
        headerBytesPadding: 0,
        bitratePadding: 0,
        packetsOutOfOrder: 0,
        frames: 0,
        frameRate: 0,
        jitterCurrent: 0,
        jitterMax: 0,
        gapHistogram: {},
        nacks: 0,
        nackAcks: 0,
        nackMisses: 0,
        nackRepeated: 0,
        plis: 0,
        lastPli: undefined,
        firs: 0,
        lastFir: undefined,
        rttCurrent: 0,
        rttMax: 0,
        keyFrames: 0,
        lastKeyFrame: undefined,
        layerLockPlis: 0,
        lastLayerLockPli: undefined,
        sampleRate: 0,
        driftMs: 0
    };
}
exports.RTPStats = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.startTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.startTime), writer.uint32(10).fork()).ldelim();
        }
        if (message.endTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.endTime), writer.uint32(18).fork()).ldelim();
        }
        if (message.duration !== 0) {
            writer.uint32(25).double(message.duration);
        }
        if (message.packets !== 0) {
            writer.uint32(32).uint32(message.packets);
        }
        if (message.packetRate !== 0) {
            writer.uint32(41).double(message.packetRate);
        }
        if (message.bytes !== 0) {
            writer.uint32(48).uint64(message.bytes);
        }
        if (message.headerBytes !== 0) {
            writer.uint32(312).uint64(message.headerBytes);
        }
        if (message.bitrate !== 0) {
            writer.uint32(57).double(message.bitrate);
        }
        if (message.packetsLost !== 0) {
            writer.uint32(64).uint32(message.packetsLost);
        }
        if (message.packetLossRate !== 0) {
            writer.uint32(73).double(message.packetLossRate);
        }
        if (message.packetLossPercentage !== 0) {
            writer.uint32(85).float(message.packetLossPercentage);
        }
        if (message.packetsDuplicate !== 0) {
            writer.uint32(88).uint32(message.packetsDuplicate);
        }
        if (message.packetDuplicateRate !== 0) {
            writer.uint32(97).double(message.packetDuplicateRate);
        }
        if (message.bytesDuplicate !== 0) {
            writer.uint32(104).uint64(message.bytesDuplicate);
        }
        if (message.headerBytesDuplicate !== 0) {
            writer.uint32(320).uint64(message.headerBytesDuplicate);
        }
        if (message.bitrateDuplicate !== 0) {
            writer.uint32(113).double(message.bitrateDuplicate);
        }
        if (message.packetsPadding !== 0) {
            writer.uint32(120).uint32(message.packetsPadding);
        }
        if (message.packetPaddingRate !== 0) {
            writer.uint32(129).double(message.packetPaddingRate);
        }
        if (message.bytesPadding !== 0) {
            writer.uint32(136).uint64(message.bytesPadding);
        }
        if (message.headerBytesPadding !== 0) {
            writer.uint32(328).uint64(message.headerBytesPadding);
        }
        if (message.bitratePadding !== 0) {
            writer.uint32(145).double(message.bitratePadding);
        }
        if (message.packetsOutOfOrder !== 0) {
            writer.uint32(152).uint32(message.packetsOutOfOrder);
        }
        if (message.frames !== 0) {
            writer.uint32(160).uint32(message.frames);
        }
        if (message.frameRate !== 0) {
            writer.uint32(169).double(message.frameRate);
        }
        if (message.jitterCurrent !== 0) {
            writer.uint32(177).double(message.jitterCurrent);
        }
        if (message.jitterMax !== 0) {
            writer.uint32(185).double(message.jitterMax);
        }
        Object.entries(message.gapHistogram).forEach(([key, value])=>{
            exports.RTPStats_GapHistogramEntry.encode({
                key: key,
                value
            }, writer.uint32(194).fork()).ldelim();
        });
        if (message.nacks !== 0) {
            writer.uint32(200).uint32(message.nacks);
        }
        if (message.nackAcks !== 0) {
            writer.uint32(296).uint32(message.nackAcks);
        }
        if (message.nackMisses !== 0) {
            writer.uint32(208).uint32(message.nackMisses);
        }
        if (message.nackRepeated !== 0) {
            writer.uint32(304).uint32(message.nackRepeated);
        }
        if (message.plis !== 0) {
            writer.uint32(216).uint32(message.plis);
        }
        if (message.lastPli !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.lastPli), writer.uint32(226).fork()).ldelim();
        }
        if (message.firs !== 0) {
            writer.uint32(232).uint32(message.firs);
        }
        if (message.lastFir !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.lastFir), writer.uint32(242).fork()).ldelim();
        }
        if (message.rttCurrent !== 0) {
            writer.uint32(248).uint32(message.rttCurrent);
        }
        if (message.rttMax !== 0) {
            writer.uint32(256).uint32(message.rttMax);
        }
        if (message.keyFrames !== 0) {
            writer.uint32(264).uint32(message.keyFrames);
        }
        if (message.lastKeyFrame !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.lastKeyFrame), writer.uint32(274).fork()).ldelim();
        }
        if (message.layerLockPlis !== 0) {
            writer.uint32(280).uint32(message.layerLockPlis);
        }
        if (message.lastLayerLockPli !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.lastLayerLockPli), writer.uint32(290).fork()).ldelim();
        }
        if (message.sampleRate !== 0) {
            writer.uint32(337).double(message.sampleRate);
        }
        if (message.driftMs !== 0) {
            writer.uint32(345).double(message.driftMs);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRTPStats();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.startTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.endTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.duration = reader.double();
                    break;
                case 4:
                    message.packets = reader.uint32();
                    break;
                case 5:
                    message.packetRate = reader.double();
                    break;
                case 6:
                    message.bytes = longToNumber(reader.uint64());
                    break;
                case 39:
                    message.headerBytes = longToNumber(reader.uint64());
                    break;
                case 7:
                    message.bitrate = reader.double();
                    break;
                case 8:
                    message.packetsLost = reader.uint32();
                    break;
                case 9:
                    message.packetLossRate = reader.double();
                    break;
                case 10:
                    message.packetLossPercentage = reader.float();
                    break;
                case 11:
                    message.packetsDuplicate = reader.uint32();
                    break;
                case 12:
                    message.packetDuplicateRate = reader.double();
                    break;
                case 13:
                    message.bytesDuplicate = longToNumber(reader.uint64());
                    break;
                case 40:
                    message.headerBytesDuplicate = longToNumber(reader.uint64());
                    break;
                case 14:
                    message.bitrateDuplicate = reader.double();
                    break;
                case 15:
                    message.packetsPadding = reader.uint32();
                    break;
                case 16:
                    message.packetPaddingRate = reader.double();
                    break;
                case 17:
                    message.bytesPadding = longToNumber(reader.uint64());
                    break;
                case 41:
                    message.headerBytesPadding = longToNumber(reader.uint64());
                    break;
                case 18:
                    message.bitratePadding = reader.double();
                    break;
                case 19:
                    message.packetsOutOfOrder = reader.uint32();
                    break;
                case 20:
                    message.frames = reader.uint32();
                    break;
                case 21:
                    message.frameRate = reader.double();
                    break;
                case 22:
                    message.jitterCurrent = reader.double();
                    break;
                case 23:
                    message.jitterMax = reader.double();
                    break;
                case 24:
                    const entry24 = exports.RTPStats_GapHistogramEntry.decode(reader, reader.uint32());
                    if (entry24.value !== undefined) {
                        message.gapHistogram[entry24.key] = entry24.value;
                    }
                    break;
                case 25:
                    message.nacks = reader.uint32();
                    break;
                case 37:
                    message.nackAcks = reader.uint32();
                    break;
                case 26:
                    message.nackMisses = reader.uint32();
                    break;
                case 38:
                    message.nackRepeated = reader.uint32();
                    break;
                case 27:
                    message.plis = reader.uint32();
                    break;
                case 28:
                    message.lastPli = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 29:
                    message.firs = reader.uint32();
                    break;
                case 30:
                    message.lastFir = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 31:
                    message.rttCurrent = reader.uint32();
                    break;
                case 32:
                    message.rttMax = reader.uint32();
                    break;
                case 33:
                    message.keyFrames = reader.uint32();
                    break;
                case 34:
                    message.lastKeyFrame = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 35:
                    message.layerLockPlis = reader.uint32();
                    break;
                case 36:
                    message.lastLayerLockPli = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 42:
                    message.sampleRate = reader.double();
                    break;
                case 43:
                    message.driftMs = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
            endTime: isSet(object.endTime) ? fromJsonTimestamp(object.endTime) : undefined,
            duration: isSet(object.duration) ? Number(object.duration) : 0,
            packets: isSet(object.packets) ? Number(object.packets) : 0,
            packetRate: isSet(object.packetRate) ? Number(object.packetRate) : 0,
            bytes: isSet(object.bytes) ? Number(object.bytes) : 0,
            headerBytes: isSet(object.headerBytes) ? Number(object.headerBytes) : 0,
            bitrate: isSet(object.bitrate) ? Number(object.bitrate) : 0,
            packetsLost: isSet(object.packetsLost) ? Number(object.packetsLost) : 0,
            packetLossRate: isSet(object.packetLossRate) ? Number(object.packetLossRate) : 0,
            packetLossPercentage: isSet(object.packetLossPercentage) ? Number(object.packetLossPercentage) : 0,
            packetsDuplicate: isSet(object.packetsDuplicate) ? Number(object.packetsDuplicate) : 0,
            packetDuplicateRate: isSet(object.packetDuplicateRate) ? Number(object.packetDuplicateRate) : 0,
            bytesDuplicate: isSet(object.bytesDuplicate) ? Number(object.bytesDuplicate) : 0,
            headerBytesDuplicate: isSet(object.headerBytesDuplicate) ? Number(object.headerBytesDuplicate) : 0,
            bitrateDuplicate: isSet(object.bitrateDuplicate) ? Number(object.bitrateDuplicate) : 0,
            packetsPadding: isSet(object.packetsPadding) ? Number(object.packetsPadding) : 0,
            packetPaddingRate: isSet(object.packetPaddingRate) ? Number(object.packetPaddingRate) : 0,
            bytesPadding: isSet(object.bytesPadding) ? Number(object.bytesPadding) : 0,
            headerBytesPadding: isSet(object.headerBytesPadding) ? Number(object.headerBytesPadding) : 0,
            bitratePadding: isSet(object.bitratePadding) ? Number(object.bitratePadding) : 0,
            packetsOutOfOrder: isSet(object.packetsOutOfOrder) ? Number(object.packetsOutOfOrder) : 0,
            frames: isSet(object.frames) ? Number(object.frames) : 0,
            frameRate: isSet(object.frameRate) ? Number(object.frameRate) : 0,
            jitterCurrent: isSet(object.jitterCurrent) ? Number(object.jitterCurrent) : 0,
            jitterMax: isSet(object.jitterMax) ? Number(object.jitterMax) : 0,
            gapHistogram: isObject(object.gapHistogram) ? Object.entries(object.gapHistogram).reduce((acc, [key, value])=>{
                acc[Number(key)] = Number(value);
                return acc;
            }, {}) : {},
            nacks: isSet(object.nacks) ? Number(object.nacks) : 0,
            nackAcks: isSet(object.nackAcks) ? Number(object.nackAcks) : 0,
            nackMisses: isSet(object.nackMisses) ? Number(object.nackMisses) : 0,
            nackRepeated: isSet(object.nackRepeated) ? Number(object.nackRepeated) : 0,
            plis: isSet(object.plis) ? Number(object.plis) : 0,
            lastPli: isSet(object.lastPli) ? fromJsonTimestamp(object.lastPli) : undefined,
            firs: isSet(object.firs) ? Number(object.firs) : 0,
            lastFir: isSet(object.lastFir) ? fromJsonTimestamp(object.lastFir) : undefined,
            rttCurrent: isSet(object.rttCurrent) ? Number(object.rttCurrent) : 0,
            rttMax: isSet(object.rttMax) ? Number(object.rttMax) : 0,
            keyFrames: isSet(object.keyFrames) ? Number(object.keyFrames) : 0,
            lastKeyFrame: isSet(object.lastKeyFrame) ? fromJsonTimestamp(object.lastKeyFrame) : undefined,
            layerLockPlis: isSet(object.layerLockPlis) ? Number(object.layerLockPlis) : 0,
            lastLayerLockPli: isSet(object.lastLayerLockPli) ? fromJsonTimestamp(object.lastLayerLockPli) : undefined,
            sampleRate: isSet(object.sampleRate) ? Number(object.sampleRate) : 0,
            driftMs: isSet(object.driftMs) ? Number(object.driftMs) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.startTime !== undefined && (obj.startTime = message.startTime.toISOString());
        message.endTime !== undefined && (obj.endTime = message.endTime.toISOString());
        message.duration !== undefined && (obj.duration = message.duration);
        message.packets !== undefined && (obj.packets = Math.round(message.packets));
        message.packetRate !== undefined && (obj.packetRate = message.packetRate);
        message.bytes !== undefined && (obj.bytes = Math.round(message.bytes));
        message.headerBytes !== undefined && (obj.headerBytes = Math.round(message.headerBytes));
        message.bitrate !== undefined && (obj.bitrate = message.bitrate);
        message.packetsLost !== undefined && (obj.packetsLost = Math.round(message.packetsLost));
        message.packetLossRate !== undefined && (obj.packetLossRate = message.packetLossRate);
        message.packetLossPercentage !== undefined && (obj.packetLossPercentage = message.packetLossPercentage);
        message.packetsDuplicate !== undefined && (obj.packetsDuplicate = Math.round(message.packetsDuplicate));
        message.packetDuplicateRate !== undefined && (obj.packetDuplicateRate = message.packetDuplicateRate);
        message.bytesDuplicate !== undefined && (obj.bytesDuplicate = Math.round(message.bytesDuplicate));
        message.headerBytesDuplicate !== undefined && (obj.headerBytesDuplicate = Math.round(message.headerBytesDuplicate));
        message.bitrateDuplicate !== undefined && (obj.bitrateDuplicate = message.bitrateDuplicate);
        message.packetsPadding !== undefined && (obj.packetsPadding = Math.round(message.packetsPadding));
        message.packetPaddingRate !== undefined && (obj.packetPaddingRate = message.packetPaddingRate);
        message.bytesPadding !== undefined && (obj.bytesPadding = Math.round(message.bytesPadding));
        message.headerBytesPadding !== undefined && (obj.headerBytesPadding = Math.round(message.headerBytesPadding));
        message.bitratePadding !== undefined && (obj.bitratePadding = message.bitratePadding);
        message.packetsOutOfOrder !== undefined && (obj.packetsOutOfOrder = Math.round(message.packetsOutOfOrder));
        message.frames !== undefined && (obj.frames = Math.round(message.frames));
        message.frameRate !== undefined && (obj.frameRate = message.frameRate);
        message.jitterCurrent !== undefined && (obj.jitterCurrent = message.jitterCurrent);
        message.jitterMax !== undefined && (obj.jitterMax = message.jitterMax);
        obj.gapHistogram = {};
        if (message.gapHistogram) {
            Object.entries(message.gapHistogram).forEach(([k, v])=>{
                obj.gapHistogram[k] = Math.round(v);
            });
        }
        message.nacks !== undefined && (obj.nacks = Math.round(message.nacks));
        message.nackAcks !== undefined && (obj.nackAcks = Math.round(message.nackAcks));
        message.nackMisses !== undefined && (obj.nackMisses = Math.round(message.nackMisses));
        message.nackRepeated !== undefined && (obj.nackRepeated = Math.round(message.nackRepeated));
        message.plis !== undefined && (obj.plis = Math.round(message.plis));
        message.lastPli !== undefined && (obj.lastPli = message.lastPli.toISOString());
        message.firs !== undefined && (obj.firs = Math.round(message.firs));
        message.lastFir !== undefined && (obj.lastFir = message.lastFir.toISOString());
        message.rttCurrent !== undefined && (obj.rttCurrent = Math.round(message.rttCurrent));
        message.rttMax !== undefined && (obj.rttMax = Math.round(message.rttMax));
        message.keyFrames !== undefined && (obj.keyFrames = Math.round(message.keyFrames));
        message.lastKeyFrame !== undefined && (obj.lastKeyFrame = message.lastKeyFrame.toISOString());
        message.layerLockPlis !== undefined && (obj.layerLockPlis = Math.round(message.layerLockPlis));
        message.lastLayerLockPli !== undefined && (obj.lastLayerLockPli = message.lastLayerLockPli.toISOString());
        message.sampleRate !== undefined && (obj.sampleRate = message.sampleRate);
        message.driftMs !== undefined && (obj.driftMs = message.driftMs);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
        const message = createBaseRTPStats();
        message.startTime = (_a = object.startTime) !== null && _a !== void 0 ? _a : undefined;
        message.endTime = (_b = object.endTime) !== null && _b !== void 0 ? _b : undefined;
        message.duration = (_c = object.duration) !== null && _c !== void 0 ? _c : 0;
        message.packets = (_d = object.packets) !== null && _d !== void 0 ? _d : 0;
        message.packetRate = (_e = object.packetRate) !== null && _e !== void 0 ? _e : 0;
        message.bytes = (_f = object.bytes) !== null && _f !== void 0 ? _f : 0;
        message.headerBytes = (_g = object.headerBytes) !== null && _g !== void 0 ? _g : 0;
        message.bitrate = (_h = object.bitrate) !== null && _h !== void 0 ? _h : 0;
        message.packetsLost = (_j = object.packetsLost) !== null && _j !== void 0 ? _j : 0;
        message.packetLossRate = (_k = object.packetLossRate) !== null && _k !== void 0 ? _k : 0;
        message.packetLossPercentage = (_l = object.packetLossPercentage) !== null && _l !== void 0 ? _l : 0;
        message.packetsDuplicate = (_m = object.packetsDuplicate) !== null && _m !== void 0 ? _m : 0;
        message.packetDuplicateRate = (_o = object.packetDuplicateRate) !== null && _o !== void 0 ? _o : 0;
        message.bytesDuplicate = (_p = object.bytesDuplicate) !== null && _p !== void 0 ? _p : 0;
        message.headerBytesDuplicate = (_q = object.headerBytesDuplicate) !== null && _q !== void 0 ? _q : 0;
        message.bitrateDuplicate = (_r = object.bitrateDuplicate) !== null && _r !== void 0 ? _r : 0;
        message.packetsPadding = (_s = object.packetsPadding) !== null && _s !== void 0 ? _s : 0;
        message.packetPaddingRate = (_t = object.packetPaddingRate) !== null && _t !== void 0 ? _t : 0;
        message.bytesPadding = (_u = object.bytesPadding) !== null && _u !== void 0 ? _u : 0;
        message.headerBytesPadding = (_v = object.headerBytesPadding) !== null && _v !== void 0 ? _v : 0;
        message.bitratePadding = (_w = object.bitratePadding) !== null && _w !== void 0 ? _w : 0;
        message.packetsOutOfOrder = (_x = object.packetsOutOfOrder) !== null && _x !== void 0 ? _x : 0;
        message.frames = (_y = object.frames) !== null && _y !== void 0 ? _y : 0;
        message.frameRate = (_z = object.frameRate) !== null && _z !== void 0 ? _z : 0;
        message.jitterCurrent = (_0 = object.jitterCurrent) !== null && _0 !== void 0 ? _0 : 0;
        message.jitterMax = (_1 = object.jitterMax) !== null && _1 !== void 0 ? _1 : 0;
        message.gapHistogram = Object.entries((_2 = object.gapHistogram) !== null && _2 !== void 0 ? _2 : {}).reduce((acc, [key, value])=>{
            if (value !== undefined) {
                acc[Number(key)] = Number(value);
            }
            return acc;
        }, {});
        message.nacks = (_3 = object.nacks) !== null && _3 !== void 0 ? _3 : 0;
        message.nackAcks = (_4 = object.nackAcks) !== null && _4 !== void 0 ? _4 : 0;
        message.nackMisses = (_5 = object.nackMisses) !== null && _5 !== void 0 ? _5 : 0;
        message.nackRepeated = (_6 = object.nackRepeated) !== null && _6 !== void 0 ? _6 : 0;
        message.plis = (_7 = object.plis) !== null && _7 !== void 0 ? _7 : 0;
        message.lastPli = (_8 = object.lastPli) !== null && _8 !== void 0 ? _8 : undefined;
        message.firs = (_9 = object.firs) !== null && _9 !== void 0 ? _9 : 0;
        message.lastFir = (_10 = object.lastFir) !== null && _10 !== void 0 ? _10 : undefined;
        message.rttCurrent = (_11 = object.rttCurrent) !== null && _11 !== void 0 ? _11 : 0;
        message.rttMax = (_12 = object.rttMax) !== null && _12 !== void 0 ? _12 : 0;
        message.keyFrames = (_13 = object.keyFrames) !== null && _13 !== void 0 ? _13 : 0;
        message.lastKeyFrame = (_14 = object.lastKeyFrame) !== null && _14 !== void 0 ? _14 : undefined;
        message.layerLockPlis = (_15 = object.layerLockPlis) !== null && _15 !== void 0 ? _15 : 0;
        message.lastLayerLockPli = (_16 = object.lastLayerLockPli) !== null && _16 !== void 0 ? _16 : undefined;
        message.sampleRate = (_17 = object.sampleRate) !== null && _17 !== void 0 ? _17 : 0;
        message.driftMs = (_18 = object.driftMs) !== null && _18 !== void 0 ? _18 : 0;
        return message;
    }
};
function createBaseRTPStats_GapHistogramEntry() {
    return {
        key: 0,
        value: 0
    };
}
exports.RTPStats_GapHistogramEntry = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).int32(message.key);
        }
        if (message.value !== 0) {
            writer.uint32(16).uint32(message.value);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRTPStats_GapHistogramEntry();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.key = reader.int32();
                    break;
                case 2:
                    message.value = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            key: isSet(object.key) ? Number(object.key) : 0,
            value: isSet(object.value) ? Number(object.value) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.key !== undefined && (obj.key = Math.round(message.key));
        message.value !== undefined && (obj.value = Math.round(message.value));
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseRTPStats_GapHistogramEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : 0;
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : 0;
        return message;
    }
};
function createBaseTimedVersion() {
    return {
        unixMicro: 0,
        ticks: 0
    };
}
exports.TimedVersion = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.unixMicro !== 0) {
            writer.uint32(8).int64(message.unixMicro);
        }
        if (message.ticks !== 0) {
            writer.uint32(16).int32(message.ticks);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimedVersion();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.unixMicro = longToNumber(reader.int64());
                    break;
                case 2:
                    message.ticks = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            unixMicro: isSet(object.unixMicro) ? Number(object.unixMicro) : 0,
            ticks: isSet(object.ticks) ? Number(object.ticks) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.unixMicro !== undefined && (obj.unixMicro = Math.round(message.unixMicro));
        message.ticks !== undefined && (obj.ticks = Math.round(message.ticks));
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseTimedVersion();
        message.unixMicro = (_a = object.unixMicro) !== null && _a !== void 0 ? _a : 0;
        message.ticks = (_b = object.ticks) !== null && _b !== void 0 ? _b : 0;
        return message;
    }
};
var globalThis = (()=>{
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (false) {}
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (globalThis.Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    } else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for(let i = 0; i < bin.length; ++i){
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    } else {
        const bin = [];
        arr.forEach((byte)=>{
            bin.push(String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}
function toTimestamp(date) {
    const seconds = date.getTime() / 1000;
    const nanos = date.getTime() % 1000 * 1000000;
    return {
        seconds,
        nanos
    };
}
function fromTimestamp(t) {
    let millis = t.seconds * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    } else if (typeof o === "string") {
        return new Date(o);
    } else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
} //# sourceMappingURL=livekit_models.js.map


/***/ }),

/***/ 88888:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.UpdateRoomMetadataRequest = exports.SendDataResponse = exports.SendDataRequest = exports.UpdateSubscriptionsResponse = exports.UpdateSubscriptionsRequest = exports.UpdateParticipantRequest = exports.MuteRoomTrackResponse = exports.MuteRoomTrackRequest = exports.RemoveParticipantResponse = exports.RoomParticipantIdentity = exports.ListParticipantsResponse = exports.ListParticipantsRequest = exports.DeleteRoomResponse = exports.DeleteRoomRequest = exports.ListRoomsResponse = exports.ListRoomsRequest = exports.RoomEgress = exports.CreateRoomRequest = exports.protobufPackage = void 0;
/* eslint-disable */ const minimal_1 = __importDefault(__webpack_require__(51948));
const livekit_egress_1 = __webpack_require__(64521);
const livekit_models_1 = __webpack_require__(49627);
exports.protobufPackage = "livekit";
function createBaseCreateRoomRequest() {
    return {
        name: "",
        emptyTimeout: 0,
        maxParticipants: 0,
        nodeId: "",
        metadata: "",
        egress: undefined,
        minPlayoutDelay: 0
    };
}
exports.CreateRoomRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.emptyTimeout !== undefined && message.emptyTimeout !== 0) {
            writer.uint32(16).uint32(message.emptyTimeout);
        }
        if (message.maxParticipants !== undefined && message.maxParticipants !== 0) {
            writer.uint32(24).uint32(message.maxParticipants);
        }
        if (message.nodeId !== undefined && message.nodeId !== "") {
            writer.uint32(34).string(message.nodeId);
        }
        if (message.metadata !== undefined && message.metadata !== "") {
            writer.uint32(42).string(message.metadata);
        }
        if (message.egress !== undefined) {
            exports.RoomEgress.encode(message.egress, writer.uint32(50).fork()).ldelim();
        }
        if (message.minPlayoutDelay !== undefined && message.minPlayoutDelay !== 0) {
            writer.uint32(56).uint32(message.minPlayoutDelay);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateRoomRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.emptyTimeout = reader.uint32();
                    break;
                case 3:
                    message.maxParticipants = reader.uint32();
                    break;
                case 4:
                    message.nodeId = reader.string();
                    break;
                case 5:
                    message.metadata = reader.string();
                    break;
                case 6:
                    message.egress = exports.RoomEgress.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.minPlayoutDelay = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            emptyTimeout: isSet(object.emptyTimeout) ? Number(object.emptyTimeout) : 0,
            maxParticipants: isSet(object.maxParticipants) ? Number(object.maxParticipants) : 0,
            nodeId: isSet(object.nodeId) ? String(object.nodeId) : "",
            metadata: isSet(object.metadata) ? String(object.metadata) : "",
            egress: isSet(object.egress) ? exports.RoomEgress.fromJSON(object.egress) : undefined,
            minPlayoutDelay: isSet(object.minPlayoutDelay) ? Number(object.minPlayoutDelay) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.emptyTimeout !== undefined && (obj.emptyTimeout = Math.round(message.emptyTimeout));
        message.maxParticipants !== undefined && (obj.maxParticipants = Math.round(message.maxParticipants));
        message.nodeId !== undefined && (obj.nodeId = message.nodeId);
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.egress !== undefined && (obj.egress = message.egress ? exports.RoomEgress.toJSON(message.egress) : undefined);
        message.minPlayoutDelay !== undefined && (obj.minPlayoutDelay = Math.round(message.minPlayoutDelay));
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseCreateRoomRequest();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.emptyTimeout = (_b = object.emptyTimeout) !== null && _b !== void 0 ? _b : 0;
        message.maxParticipants = (_c = object.maxParticipants) !== null && _c !== void 0 ? _c : 0;
        message.nodeId = (_d = object.nodeId) !== null && _d !== void 0 ? _d : "";
        message.metadata = (_e = object.metadata) !== null && _e !== void 0 ? _e : "";
        message.egress = object.egress !== undefined && object.egress !== null ? exports.RoomEgress.fromPartial(object.egress) : undefined;
        message.minPlayoutDelay = (_f = object.minPlayoutDelay) !== null && _f !== void 0 ? _f : 0;
        return message;
    }
};
function createBaseRoomEgress() {
    return {
        room: undefined,
        tracks: undefined
    };
}
exports.RoomEgress = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_egress_1.RoomCompositeEgressRequest.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        if (message.tracks !== undefined) {
            livekit_egress_1.AutoTrackEgress.encode(message.tracks, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRoomEgress();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = livekit_egress_1.RoomCompositeEgressRequest.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.tracks = livekit_egress_1.AutoTrackEgress.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? livekit_egress_1.RoomCompositeEgressRequest.fromJSON(object.room) : undefined,
            tracks: isSet(object.tracks) ? livekit_egress_1.AutoTrackEgress.fromJSON(object.tracks) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room ? livekit_egress_1.RoomCompositeEgressRequest.toJSON(message.room) : undefined);
        message.tracks !== undefined && (obj.tracks = message.tracks ? livekit_egress_1.AutoTrackEgress.toJSON(message.tracks) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRoomEgress();
        message.room = object.room !== undefined && object.room !== null ? livekit_egress_1.RoomCompositeEgressRequest.fromPartial(object.room) : undefined;
        message.tracks = object.tracks !== undefined && object.tracks !== null ? livekit_egress_1.AutoTrackEgress.fromPartial(object.tracks) : undefined;
        return message;
    }
};
function createBaseListRoomsRequest() {
    return {
        names: []
    };
}
exports.ListRoomsRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.names !== undefined && message.names.length !== 0) {
            for (const v of message.names){
                writer.uint32(10).string(v);
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListRoomsRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.names.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            names: Array.isArray(object === null || object === void 0 ? void 0 : object.names) ? object.names.map((e)=>String(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.names) {
            obj.names = message.names.map((e)=>e);
        } else {
            obj.names = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseListRoomsRequest();
        message.names = ((_a = object.names) === null || _a === void 0 ? void 0 : _a.map((e)=>e)) || [];
        return message;
    }
};
function createBaseListRoomsResponse() {
    return {
        rooms: []
    };
}
exports.ListRoomsResponse = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.rooms !== undefined && message.rooms.length !== 0) {
            for (const v of message.rooms){
                livekit_models_1.Room.encode(v, writer.uint32(10).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListRoomsResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.rooms.push(livekit_models_1.Room.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            rooms: Array.isArray(object === null || object === void 0 ? void 0 : object.rooms) ? object.rooms.map((e)=>livekit_models_1.Room.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.rooms) {
            obj.rooms = message.rooms.map((e)=>e ? livekit_models_1.Room.toJSON(e) : undefined);
        } else {
            obj.rooms = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseListRoomsResponse();
        message.rooms = ((_a = object.rooms) === null || _a === void 0 ? void 0 : _a.map((e)=>livekit_models_1.Room.fromPartial(e))) || [];
        return message;
    }
};
function createBaseDeleteRoomRequest() {
    return {
        room: ""
    };
}
exports.DeleteRoomRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeleteRoomRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseDeleteRoomRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        return message;
    }
};
function createBaseDeleteRoomResponse() {
    return {};
}
exports.DeleteRoomResponse = {
    encode (_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeleteRoomResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        return {};
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseDeleteRoomResponse();
        return message;
    }
};
function createBaseListParticipantsRequest() {
    return {
        room: ""
    };
}
exports.ListParticipantsRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListParticipantsRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseListParticipantsRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        return message;
    }
};
function createBaseListParticipantsResponse() {
    return {
        participants: []
    };
}
exports.ListParticipantsResponse = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.participants !== undefined && message.participants.length !== 0) {
            for (const v of message.participants){
                livekit_models_1.ParticipantInfo.encode(v, writer.uint32(10).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListParticipantsResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.participants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            participants: Array.isArray(object === null || object === void 0 ? void 0 : object.participants) ? object.participants.map((e)=>livekit_models_1.ParticipantInfo.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        if (message.participants) {
            obj.participants = message.participants.map((e)=>e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        } else {
            obj.participants = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a;
        const message = createBaseListParticipantsResponse();
        message.participants = ((_a = object.participants) === null || _a === void 0 ? void 0 : _a.map((e)=>livekit_models_1.ParticipantInfo.fromPartial(e))) || [];
        return message;
    }
};
function createBaseRoomParticipantIdentity() {
    return {
        room: "",
        identity: ""
    };
}
exports.RoomParticipantIdentity = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        if (message.identity !== undefined && message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRoomParticipantIdentity();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : "",
            identity: isSet(object.identity) ? String(object.identity) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        message.identity !== undefined && (obj.identity = message.identity);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseRoomParticipantIdentity();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
function createBaseRemoveParticipantResponse() {
    return {};
}
exports.RemoveParticipantResponse = {
    encode (_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRemoveParticipantResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        return {};
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseRemoveParticipantResponse();
        return message;
    }
};
function createBaseMuteRoomTrackRequest() {
    return {
        room: "",
        identity: "",
        trackSid: "",
        muted: false
    };
}
exports.MuteRoomTrackRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        if (message.identity !== undefined && message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        if (message.trackSid !== undefined && message.trackSid !== "") {
            writer.uint32(26).string(message.trackSid);
        }
        if (message.muted === true) {
            writer.uint32(32).bool(message.muted);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMuteRoomTrackRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.trackSid = reader.string();
                    break;
                case 4:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : "",
            identity: isSet(object.identity) ? String(object.identity) : "",
            trackSid: isSet(object.trackSid) ? String(object.trackSid) : "",
            muted: isSet(object.muted) ? Boolean(object.muted) : false
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        message.identity !== undefined && (obj.identity = message.identity);
        message.trackSid !== undefined && (obj.trackSid = message.trackSid);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseMuteRoomTrackRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        message.trackSid = (_c = object.trackSid) !== null && _c !== void 0 ? _c : "";
        message.muted = (_d = object.muted) !== null && _d !== void 0 ? _d : false;
        return message;
    }
};
function createBaseMuteRoomTrackResponse() {
    return {
        track: undefined
    };
}
exports.MuteRoomTrackResponse = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.track !== undefined) {
            livekit_models_1.TrackInfo.encode(message.track, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMuteRoomTrackResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.track = livekit_models_1.TrackInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            track: isSet(object.track) ? livekit_models_1.TrackInfo.fromJSON(object.track) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.track !== undefined && (obj.track = message.track ? livekit_models_1.TrackInfo.toJSON(message.track) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseMuteRoomTrackResponse();
        message.track = object.track !== undefined && object.track !== null ? livekit_models_1.TrackInfo.fromPartial(object.track) : undefined;
        return message;
    }
};
function createBaseUpdateParticipantRequest() {
    return {
        room: "",
        identity: "",
        metadata: "",
        permission: undefined,
        name: ""
    };
}
exports.UpdateParticipantRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        if (message.identity !== undefined && message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        if (message.metadata !== undefined && message.metadata !== "") {
            writer.uint32(26).string(message.metadata);
        }
        if (message.permission !== undefined) {
            livekit_models_1.ParticipantPermission.encode(message.permission, writer.uint32(34).fork()).ldelim();
        }
        if (message.name !== undefined && message.name !== "") {
            writer.uint32(42).string(message.name);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateParticipantRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.metadata = reader.string();
                    break;
                case 4:
                    message.permission = livekit_models_1.ParticipantPermission.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : "",
            identity: isSet(object.identity) ? String(object.identity) : "",
            metadata: isSet(object.metadata) ? String(object.metadata) : "",
            permission: isSet(object.permission) ? livekit_models_1.ParticipantPermission.fromJSON(object.permission) : undefined,
            name: isSet(object.name) ? String(object.name) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        message.identity !== undefined && (obj.identity = message.identity);
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.permission !== undefined && (obj.permission = message.permission ? livekit_models_1.ParticipantPermission.toJSON(message.permission) : undefined);
        message.name !== undefined && (obj.name = message.name);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseUpdateParticipantRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        message.metadata = (_c = object.metadata) !== null && _c !== void 0 ? _c : "";
        message.permission = object.permission !== undefined && object.permission !== null ? livekit_models_1.ParticipantPermission.fromPartial(object.permission) : undefined;
        message.name = (_d = object.name) !== null && _d !== void 0 ? _d : "";
        return message;
    }
};
function createBaseUpdateSubscriptionsRequest() {
    return {
        room: "",
        identity: "",
        trackSids: [],
        subscribe: false,
        participantTracks: []
    };
}
exports.UpdateSubscriptionsRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        if (message.identity !== undefined && message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        if (message.trackSids !== undefined && message.trackSids.length !== 0) {
            for (const v of message.trackSids){
                writer.uint32(26).string(v);
            }
        }
        if (message.subscribe === true) {
            writer.uint32(32).bool(message.subscribe);
        }
        if (message.participantTracks !== undefined && message.participantTracks.length !== 0) {
            for (const v of message.participantTracks){
                livekit_models_1.ParticipantTracks.encode(v, writer.uint32(42).fork()).ldelim();
            }
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateSubscriptionsRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.trackSids.push(reader.string());
                    break;
                case 4:
                    message.subscribe = reader.bool();
                    break;
                case 5:
                    message.participantTracks.push(livekit_models_1.ParticipantTracks.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : "",
            identity: isSet(object.identity) ? String(object.identity) : "",
            trackSids: Array.isArray(object === null || object === void 0 ? void 0 : object.trackSids) ? object.trackSids.map((e)=>String(e)) : [],
            subscribe: isSet(object.subscribe) ? Boolean(object.subscribe) : false,
            participantTracks: Array.isArray(object === null || object === void 0 ? void 0 : object.participantTracks) ? object.participantTracks.map((e)=>livekit_models_1.ParticipantTracks.fromJSON(e)) : []
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        message.identity !== undefined && (obj.identity = message.identity);
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e)=>e);
        } else {
            obj.trackSids = [];
        }
        message.subscribe !== undefined && (obj.subscribe = message.subscribe);
        if (message.participantTracks) {
            obj.participantTracks = message.participantTracks.map((e)=>e ? livekit_models_1.ParticipantTracks.toJSON(e) : undefined);
        } else {
            obj.participantTracks = [];
        }
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseUpdateSubscriptionsRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        message.trackSids = ((_c = object.trackSids) === null || _c === void 0 ? void 0 : _c.map((e)=>e)) || [];
        message.subscribe = (_d = object.subscribe) !== null && _d !== void 0 ? _d : false;
        message.participantTracks = ((_e = object.participantTracks) === null || _e === void 0 ? void 0 : _e.map((e)=>livekit_models_1.ParticipantTracks.fromPartial(e))) || [];
        return message;
    }
};
function createBaseUpdateSubscriptionsResponse() {
    return {};
}
exports.UpdateSubscriptionsResponse = {
    encode (_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateSubscriptionsResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        return {};
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseUpdateSubscriptionsResponse();
        return message;
    }
};
function createBaseSendDataRequest() {
    return {
        room: "",
        data: new Uint8Array(),
        kind: 0,
        destinationSids: [],
        topic: undefined
    };
}
exports.SendDataRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        if (message.data !== undefined && message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        if (message.kind !== undefined && message.kind !== 0) {
            writer.uint32(24).int32(message.kind);
        }
        if (message.destinationSids !== undefined && message.destinationSids.length !== 0) {
            for (const v of message.destinationSids){
                writer.uint32(34).string(v);
            }
        }
        if (message.topic !== undefined) {
            writer.uint32(42).string(message.topic);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSendDataRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                case 3:
                    message.kind = reader.int32();
                    break;
                case 4:
                    message.destinationSids.push(reader.string());
                    break;
                case 5:
                    message.topic = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : "",
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            kind: isSet(object.kind) ? livekit_models_1.dataPacket_KindFromJSON(object.kind) : 0,
            destinationSids: Array.isArray(object === null || object === void 0 ? void 0 : object.destinationSids) ? object.destinationSids.map((e)=>String(e)) : [],
            topic: isSet(object.topic) ? String(object.topic) : undefined
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        message.data !== undefined && (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        message.kind !== undefined && (obj.kind = livekit_models_1.dataPacket_KindToJSON(message.kind));
        if (message.destinationSids) {
            obj.destinationSids = message.destinationSids.map((e)=>e);
        } else {
            obj.destinationSids = [];
        }
        message.topic !== undefined && (obj.topic = message.topic);
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseSendDataRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        message.data = (_b = object.data) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.kind = (_c = object.kind) !== null && _c !== void 0 ? _c : 0;
        message.destinationSids = ((_d = object.destinationSids) === null || _d === void 0 ? void 0 : _d.map((e)=>e)) || [];
        message.topic = (_e = object.topic) !== null && _e !== void 0 ? _e : undefined;
        return message;
    }
};
function createBaseSendDataResponse() {
    return {};
}
exports.SendDataResponse = {
    encode (_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSendDataResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        return {};
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseSendDataResponse();
        return message;
    }
};
function createBaseUpdateRoomMetadataRequest() {
    return {
        room: "",
        metadata: ""
    };
}
exports.UpdateRoomMetadataRequest = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined && message.room !== "") {
            writer.uint32(10).string(message.room);
        }
        if (message.metadata !== undefined && message.metadata !== "") {
            writer.uint32(18).string(message.metadata);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateRoomMetadataRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.room = reader.string();
                    break;
                case 2:
                    message.metadata = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            room: isSet(object.room) ? String(object.room) : "",
            metadata: isSet(object.metadata) ? String(object.metadata) : ""
        };
    },
    toJSON (message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room);
        message.metadata !== undefined && (obj.metadata = message.metadata);
        return obj;
    },
    fromPartial (object) {
        var _a, _b;
        const message = createBaseUpdateRoomMetadataRequest();
        message.room = (_a = object.room) !== null && _a !== void 0 ? _a : "";
        message.metadata = (_b = object.metadata) !== null && _b !== void 0 ? _b : "";
        return message;
    }
};
var globalThis = (()=>{
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (false) {}
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (globalThis.Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    } else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for(let i = 0; i < bin.length; ++i){
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    } else {
        const bin = [];
        arr.forEach((byte)=>{
            bin.push(String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}
function isSet(value) {
    return value !== null && value !== undefined;
} //# sourceMappingURL=livekit_room.js.map


/***/ }),

/***/ 35642:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var __importDefault = (void 0) && (void 0).__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.WebhookEvent = exports.protobufPackage = void 0;
/* eslint-disable */ const long_1 = __importDefault(__webpack_require__(21288));
const minimal_1 = __importDefault(__webpack_require__(51948));
const livekit_egress_1 = __webpack_require__(64521);
const livekit_ingress_1 = __webpack_require__(93208);
const livekit_models_1 = __webpack_require__(49627);
exports.protobufPackage = "livekit";
function createBaseWebhookEvent() {
    return {
        event: "",
        room: undefined,
        participant: undefined,
        egressInfo: undefined,
        ingressInfo: undefined,
        track: undefined,
        id: "",
        createdAt: 0,
        numDropped: 0
    };
}
exports.WebhookEvent = {
    encode (message, writer = minimal_1.default.Writer.create()) {
        if (message.event !== undefined && message.event !== "") {
            writer.uint32(10).string(message.event);
        }
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(18).fork()).ldelim();
        }
        if (message.participant !== undefined) {
            livekit_models_1.ParticipantInfo.encode(message.participant, writer.uint32(26).fork()).ldelim();
        }
        if (message.egressInfo !== undefined) {
            livekit_egress_1.EgressInfo.encode(message.egressInfo, writer.uint32(74).fork()).ldelim();
        }
        if (message.ingressInfo !== undefined) {
            livekit_ingress_1.IngressInfo.encode(message.ingressInfo, writer.uint32(82).fork()).ldelim();
        }
        if (message.track !== undefined) {
            livekit_models_1.TrackInfo.encode(message.track, writer.uint32(66).fork()).ldelim();
        }
        if (message.id !== undefined && message.id !== "") {
            writer.uint32(50).string(message.id);
        }
        if (message.createdAt !== undefined && message.createdAt !== 0) {
            writer.uint32(56).int64(message.createdAt);
        }
        if (message.numDropped !== undefined && message.numDropped !== 0) {
            writer.uint32(88).int32(message.numDropped);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWebhookEvent();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.event = reader.string();
                    break;
                case 2:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.participant = livekit_models_1.ParticipantInfo.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.egressInfo = livekit_egress_1.EgressInfo.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.ingressInfo = livekit_ingress_1.IngressInfo.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.track = livekit_models_1.TrackInfo.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.id = reader.string();
                    break;
                case 7:
                    message.createdAt = longToNumber(reader.int64());
                    break;
                case 11:
                    message.numDropped = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        return {
            event: isSet(object.event) ? String(object.event) : "",
            room: isSet(object.room) ? livekit_models_1.Room.fromJSON(object.room) : undefined,
            participant: isSet(object.participant) ? livekit_models_1.ParticipantInfo.fromJSON(object.participant) : undefined,
            egressInfo: isSet(object.egressInfo) ? livekit_egress_1.EgressInfo.fromJSON(object.egressInfo) : undefined,
            ingressInfo: isSet(object.ingressInfo) ? livekit_ingress_1.IngressInfo.fromJSON(object.ingressInfo) : undefined,
            track: isSet(object.track) ? livekit_models_1.TrackInfo.fromJSON(object.track) : undefined,
            id: isSet(object.id) ? String(object.id) : "",
            createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
            numDropped: isSet(object.numDropped) ? Number(object.numDropped) : 0
        };
    },
    toJSON (message) {
        const obj = {};
        message.event !== undefined && (obj.event = message.event);
        message.room !== undefined && (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        message.participant !== undefined && (obj.participant = message.participant ? livekit_models_1.ParticipantInfo.toJSON(message.participant) : undefined);
        message.egressInfo !== undefined && (obj.egressInfo = message.egressInfo ? livekit_egress_1.EgressInfo.toJSON(message.egressInfo) : undefined);
        message.ingressInfo !== undefined && (obj.ingressInfo = message.ingressInfo ? livekit_ingress_1.IngressInfo.toJSON(message.ingressInfo) : undefined);
        message.track !== undefined && (obj.track = message.track ? livekit_models_1.TrackInfo.toJSON(message.track) : undefined);
        message.id !== undefined && (obj.id = message.id);
        message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
        message.numDropped !== undefined && (obj.numDropped = Math.round(message.numDropped));
        return obj;
    },
    fromPartial (object) {
        var _a, _b, _c, _d;
        const message = createBaseWebhookEvent();
        message.event = (_a = object.event) !== null && _a !== void 0 ? _a : "";
        message.room = object.room !== undefined && object.room !== null ? livekit_models_1.Room.fromPartial(object.room) : undefined;
        message.participant = object.participant !== undefined && object.participant !== null ? livekit_models_1.ParticipantInfo.fromPartial(object.participant) : undefined;
        message.egressInfo = object.egressInfo !== undefined && object.egressInfo !== null ? livekit_egress_1.EgressInfo.fromPartial(object.egressInfo) : undefined;
        message.ingressInfo = object.ingressInfo !== undefined && object.ingressInfo !== null ? livekit_ingress_1.IngressInfo.fromPartial(object.ingressInfo) : undefined;
        message.track = object.track !== undefined && object.track !== null ? livekit_models_1.TrackInfo.fromPartial(object.track) : undefined;
        message.id = (_b = object.id) !== null && _b !== void 0 ? _b : "";
        message.createdAt = (_c = object.createdAt) !== null && _c !== void 0 ? _c : 0;
        message.numDropped = (_d = object.numDropped) !== null && _d !== void 0 ? _d : 0;
        return message;
    }
};
var globalThis = (()=>{
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (false) {}
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
} //# sourceMappingURL=livekit_webhook.js.map


/***/ }),

/***/ 83346:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const mapObj = __webpack_require__(60095);
const camelCase = __webpack_require__(16192);
const QuickLru = __webpack_require__(94001);
const has = (array, key)=>array.some((x)=>{
        if (typeof x === "string") {
            return x === key;
        }
        x.lastIndex = 0;
        return x.test(key);
    });
const cache = new QuickLru({
    maxSize: 100000
});
// Reproduces behavior from `map-obj`
const isObject = (value)=>typeof value === "object" && value !== null && !(value instanceof RegExp) && !(value instanceof Error) && !(value instanceof Date);
const camelCaseConvert = (input, options)=>{
    if (!isObject(input)) {
        return input;
    }
    options = {
        deep: false,
        pascalCase: false,
        ...options
    };
    const { exclude, pascalCase, stopPaths, deep } = options;
    const stopPathsSet = new Set(stopPaths);
    const makeMapper = (parentPath)=>(key, value)=>{
            if (deep && isObject(value)) {
                const path = parentPath === undefined ? key : `${parentPath}.${key}`;
                if (!stopPathsSet.has(path)) {
                    value = mapObj(value, makeMapper(path));
                }
            }
            if (!(exclude && has(exclude, key))) {
                const cacheKey = pascalCase ? `${key}_` : key;
                if (cache.has(cacheKey)) {
                    key = cache.get(cacheKey);
                } else {
                    const returnValue = camelCase(key, {
                        pascalCase,
                        locale: false
                    });
                    if (key.length < 100) {
                        cache.set(cacheKey, returnValue);
                    }
                    key = returnValue;
                }
            }
            return [
                key,
                value
            ];
        };
    return mapObj(input, makeMapper(undefined));
};
module.exports = (input, options)=>{
    if (Array.isArray(input)) {
        return Object.keys(input).map((key)=>camelCaseConvert(input[key], options));
    }
    return camelCaseConvert(input, options);
};


/***/ }),

/***/ 16192:
/***/ ((module) => {

"use strict";

const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const SEPARATORS = /[_.\- ]+/;
const LEADING_SEPARATORS = new RegExp("^" + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, "gu");
const NUMBERS_AND_IDENTIFIER = new RegExp("\\d+" + IDENTIFIER.source, "gu");
const preserveCamelCase = (string, toLowerCase, toUpperCase)=>{
    let isLastCharLower = false;
    let isLastCharUpper = false;
    let isLastLastCharUpper = false;
    for(let i = 0; i < string.length; i++){
        const character = string[i];
        if (isLastCharLower && UPPERCASE.test(character)) {
            string = string.slice(0, i) + "-" + string.slice(i);
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i++;
        } else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character)) {
            string = string.slice(0, i - 1) + "-" + string.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
        } else {
            isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
        }
    }
    return string;
};
const preserveConsecutiveUppercase = (input, toLowerCase)=>{
    LEADING_CAPITAL.lastIndex = 0;
    return input.replace(LEADING_CAPITAL, (m1)=>toLowerCase(m1));
};
const postProcess = (input, toUpperCase)=>{
    SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
    NUMBERS_AND_IDENTIFIER.lastIndex = 0;
    return input.replace(SEPARATORS_AND_IDENTIFIER, (_, identifier)=>toUpperCase(identifier)).replace(NUMBERS_AND_IDENTIFIER, (m)=>toUpperCase(m));
};
const camelCase = (input, options)=>{
    if (!(typeof input === "string" || Array.isArray(input))) {
        throw new TypeError("Expected the input to be `string | string[]`");
    }
    options = {
        pascalCase: false,
        preserveConsecutiveUppercase: false,
        ...options
    };
    if (Array.isArray(input)) {
        input = input.map((x)=>x.trim()).filter((x)=>x.length).join("-");
    } else {
        input = input.trim();
    }
    if (input.length === 0) {
        return "";
    }
    const toLowerCase = options.locale === false ? (string)=>string.toLowerCase() : (string)=>string.toLocaleLowerCase(options.locale);
    const toUpperCase = options.locale === false ? (string)=>string.toUpperCase() : (string)=>string.toLocaleUpperCase(options.locale);
    if (input.length === 1) {
        return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
    }
    const hasUpperCase = input !== toLowerCase(input);
    if (hasUpperCase) {
        input = preserveCamelCase(input, toLowerCase, toUpperCase);
    }
    input = input.replace(LEADING_SEPARATORS, "");
    if (options.preserveConsecutiveUppercase) {
        input = preserveConsecutiveUppercase(input, toLowerCase);
    } else {
        input = toLowerCase(input);
    }
    if (options.pascalCase) {
        input = toUpperCase(input.charAt(0)) + input.slice(1);
    }
    return postProcess(input, toUpperCase);
};
module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports["default"] = camelCase;


/***/ }),

/***/ 94001:
/***/ ((module) => {

"use strict";

class QuickLRU {
    constructor(options = {}){
        if (!(options.maxSize && options.maxSize > 0)) {
            throw new TypeError("`maxSize` must be a number greater than 0");
        }
        this.maxSize = options.maxSize;
        this.onEviction = options.onEviction;
        this.cache = new Map();
        this.oldCache = new Map();
        this._size = 0;
    }
    _set(key, value) {
        this.cache.set(key, value);
        this._size++;
        if (this._size >= this.maxSize) {
            this._size = 0;
            if (typeof this.onEviction === "function") {
                for (const [key, value] of this.oldCache.entries()){
                    this.onEviction(key, value);
                }
            }
            this.oldCache = this.cache;
            this.cache = new Map();
        }
    }
    get(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
            const value = this.oldCache.get(key);
            this.oldCache.delete(key);
            this._set(key, value);
            return value;
        }
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.set(key, value);
        } else {
            this._set(key, value);
        }
        return this;
    }
    has(key) {
        return this.cache.has(key) || this.oldCache.has(key);
    }
    peek(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
            return this.oldCache.get(key);
        }
    }
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this._size--;
        }
        return this.oldCache.delete(key) || deleted;
    }
    clear() {
        this.cache.clear();
        this.oldCache.clear();
        this._size = 0;
    }
    *keys() {
        for (const [key] of this){
            yield key;
        }
    }
    *values() {
        for (const [, value] of this){
            yield value;
        }
    }
    *[Symbol.iterator]() {
        for (const item of this.cache){
            yield item;
        }
        for (const item of this.oldCache){
            const [key] = item;
            if (!this.cache.has(key)) {
                yield item;
            }
        }
    }
    get size() {
        let oldCacheSize = 0;
        for (const key of this.oldCache.keys()){
            if (!this.cache.has(key)) {
                oldCacheSize++;
            }
        }
        return Math.min(this._size + oldCacheSize, this.maxSize);
    }
}
module.exports = QuickLRU;


/***/ }),

/***/ 88303:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(66962);
const MAX = Symbol("max");
const LENGTH = Symbol("length");
const LENGTH_CALCULATOR = Symbol("lengthCalculator");
const ALLOW_STALE = Symbol("allowStale");
const MAX_AGE = Symbol("maxAge");
const DISPOSE = Symbol("dispose");
const NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
const LRU_LIST = Symbol("lruList");
const CACHE = Symbol("cache");
const UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
const naiveLength = ()=>1;
// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
    constructor(options){
        if (typeof options === "number") options = {
            max: options
        };
        if (!options) options = {};
        if (options.max && (typeof options.max !== "number" || options.max < 0)) throw new TypeError("max must be a non-negative number");
        // Kind of weird to have a default max of Infinity, but oh well.
        const max = this[MAX] = options.max || Infinity;
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== "number") throw new TypeError("maxAge must be a number");
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
    }
    // resize the cache when the max changes.
    set max(mL) {
        if (typeof mL !== "number" || mL < 0) throw new TypeError("max must be a non-negative number");
        this[MAX] = mL || Infinity;
        trim(this);
    }
    get max() {
        return this[MAX];
    }
    set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
        return this[ALLOW_STALE];
    }
    set maxAge(mA) {
        if (typeof mA !== "number") throw new TypeError("maxAge must be a non-negative number");
        this[MAX_AGE] = mA;
        trim(this);
    }
    get maxAge() {
        return this[MAX_AGE];
    }
    // resize the cache when the lengthCalculator changes.
    set lengthCalculator(lC) {
        if (typeof lC !== "function") lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach((hit)=>{
                hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
                this[LENGTH] += hit.length;
            });
        }
        trim(this);
    }
    get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
    }
    get length() {
        return this[LENGTH];
    }
    get itemCount() {
        return this[LRU_LIST].length;
    }
    rforEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].tail; walker !== null;){
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
        }
    }
    forEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].head; walker !== null;){
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
        }
    }
    keys() {
        return this[LRU_LIST].toArray().map((k)=>k.key);
    }
    values() {
        return this[LRU_LIST].toArray().map((k)=>k.value);
    }
    reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach((hit)=>this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = new Map() // hash of items by key
        ;
        this[LRU_LIST] = new Yallist() // list of items in order of use recency
        ;
        this[LENGTH] = 0 // length of items in the list
        ;
    }
    dump() {
        return this[LRU_LIST].map((hit)=>isStale(this, hit) ? false : {
                k: hit.key,
                v: hit.value,
                e: hit.now + (hit.maxAge || 0)
            }).toArray().filter((h)=>h);
    }
    dumpLru() {
        return this[LRU_LIST];
    }
    set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== "number") throw new TypeError("maxAge must be a number");
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
                del(this, this[CACHE].get(key));
                return false;
            }
            const node = this[CACHE].get(key);
            const item = node.value;
            // dispose of the old one before overwriting
            // split out into 2 ifs for better coverage tracking
            if (this[DISPOSE]) {
                if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
            }
            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        // oversized objects fall out of cache automatically.
        if (hit.length > this[MAX]) {
            if (this[DISPOSE]) this[DISPOSE](key, value);
            return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
    }
    has(key) {
        if (!this[CACHE].has(key)) return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
    }
    get(key) {
        return get(this, key, true);
    }
    peek(key) {
        return get(this, key, false);
    }
    pop() {
        const node = this[LRU_LIST].tail;
        if (!node) return null;
        del(this, node);
        return node.value;
    }
    del(key) {
        del(this, this[CACHE].get(key));
    }
    load(arr) {
        // reset the cache
        this.reset();
        const now = Date.now();
        // A previous serialized cache has the most recent items first
        for(let l = arr.length - 1; l >= 0; l--){
            const hit = arr[l];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0) // the item was created without expiration in a non aged cache
            this.set(hit.k, hit.v);
            else {
                const maxAge = expiresAt - now;
                // dont add already expired items
                if (maxAge > 0) {
                    this.set(hit.k, hit.v, maxAge);
                }
            }
        }
    }
    prune() {
        this[CACHE].forEach((value, key)=>get(this, key, false));
    }
}
const get = (self, key, doUse)=>{
    const node = self[CACHE].get(key);
    if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE]) return undefined;
        } else {
            if (doUse) {
                if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
                self[LRU_LIST].unshiftNode(node);
            }
        }
        return hit.value;
    }
};
const isStale = (self, hit)=>{
    if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};
const trim = (self)=>{
    if (self[LENGTH] > self[MAX]) {
        for(let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;){
            // We know that we're about to delete this one, and also
            // what the next least recently used key will be, so just
            // go ahead and set it now.
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
        }
    }
};
const del = (self, node)=>{
    if (node) {
        const hit = node.value;
        if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
    }
};
class Entry {
    constructor(key, value, length, now, maxAge){
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
    }
}
const forEachStep = (self, fn, node, thisp)=>{
    let hit = node.value;
    if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE]) hit = undefined;
    }
    if (hit) fn.call(thisp, hit.value, hit.key, self);
};
module.exports = LRUCache;


/***/ }),

/***/ 47176:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */ /**
 * Module exports.
 */ 
module.exports = __webpack_require__(2753);


/***/ }),

/***/ 66899:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module dependencies.
 * @private
 */ var db = __webpack_require__(47176);
var extname = (__webpack_require__(71017).extname);
/**
 * Module variables.
 * @private
 */ var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/**
 * Module exports.
 * @public
 */ exports.charset = charset;
exports.charsets = {
    lookup: charset
};
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null);
// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types);
/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function charset(type) {
    if (!type || typeof type !== "string") {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    var mime = match && db[match[1].toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    // default text/* to utf-8
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
    }
    return false;
}
/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */ function contentType(str) {
    // TODO: should this even be in this module?
    if (!str || typeof str !== "string") {
        return false;
    }
    var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
    if (!mime) {
        return false;
    }
    // TODO: use content-type or other module
    if (mime.indexOf("charset") === -1) {
        var charset = exports.charset(mime);
        if (charset) mime += "; charset=" + charset.toLowerCase();
    }
    return mime;
}
/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function extension(type) {
    if (!type || typeof type !== "string") {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    // get extensions
    var exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
        return false;
    }
    return exts[0];
}
/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */ function lookup(path) {
    if (!path || typeof path !== "string") {
        return false;
    }
    // get the extension ("ext" or ".ext" or full path)
    var extension = extname("x." + path).toLowerCase().substr(1);
    if (!extension) {
        return false;
    }
    return exports.types[extension] || false;
}
/**
 * Populate the extensions and types maps.
 * @private
 */ function populateMaps(extensions, types) {
    // source preference (least -> most)
    var preference = [
        "nginx",
        "apache",
        undefined,
        "iana"
    ];
    Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
            return;
        }
        // mime -> extensions
        extensions[type] = exts;
        // extension -> mime
        for(var i = 0; i < exts.length; i++){
            var extension = exts[i];
            if (types[extension]) {
                var from = preference.indexOf(db[types[extension]].source);
                var to = preference.indexOf(mime.source);
                if (types[extension] !== "application/octet-stream" && (from > to || from === to && types[extension].substr(0, 12) === "application/")) {
                    continue;
                }
            }
            // set the extension -> mime
            types[extension] = type;
        }
    });
}


/***/ }),

/***/ 6034:
/***/ ((module) => {

"use strict";
/**
 * Helpers.
 */ 
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
        return parse(val);
    } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch(type){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return n * y;
        case "weeks":
        case "week":
        case "w":
            return n * w;
        case "days":
        case "day":
        case "d":
            return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + "s";
    }
    return ms + "ms";
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
}


/***/ }),

/***/ 51948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// minimal library entry point.

module.exports = __webpack_require__(90108);


/***/ }),

/***/ 90108:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var protobuf = exports;
/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */ protobuf.build = "minimal";
// Serialization
protobuf.Writer = __webpack_require__(30065);
protobuf.BufferWriter = __webpack_require__(15311);
protobuf.Reader = __webpack_require__(66619);
protobuf.BufferReader = __webpack_require__(45965);
// Utility
protobuf.util = __webpack_require__(27663);
protobuf.rpc = __webpack_require__(22703);
protobuf.roots = __webpack_require__(30840);
protobuf.configure = configure;
/* istanbul ignore next */ /**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */ function configure() {
    protobuf.util._configure();
    protobuf.Writer._configure(protobuf.BufferWriter);
    protobuf.Reader._configure(protobuf.BufferReader);
}
// Set up buffer utility according to the environment
configure();


/***/ }),

/***/ 66619:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Reader;
var util = __webpack_require__(27663);
var BufferReader; // cyclic
var LongBits = util.LongBits, utf8 = util.utf8;
/* istanbul ignore next */ function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}
/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */ function Reader(buffer) {
    /**
     * Read buffer.
     * @type {Uint8Array}
     */ this.buf = buffer;
    /**
     * Read buffer position.
     * @type {number}
     */ this.pos = 0;
    /**
     * Read buffer length.
     * @type {number}
     */ this.len = buffer.length;
}
var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
    if (buffer instanceof Uint8Array || Array.isArray(buffer)) return new Reader(buffer);
    throw Error("illegal buffer");
} : function create_array(buffer) {
    if (Array.isArray(buffer)) return new Reader(buffer);
    throw Error("illegal buffer");
};
var create = function create() {
    return util.Buffer ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer) {
            return util.Buffer.isBuffer(buffer) ? new BufferReader(buffer) : create_array(buffer);
        })(buffer);
    } : create_array;
};
/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */ Reader.create = create();
Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;
/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */ Reader.prototype.uint32 = function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        /* istanbul ignore if */ if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
}();
/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */ Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};
/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */ Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};
/* eslint-disable no-invalid-this */ function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) {
        for(; i < 4; ++i){
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128) return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128) return bits;
        i = 0;
    } else {
        for(; i < 3; ++i){
            /* istanbul ignore if */ if (this.pos >= this.len) throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128) return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) {
        for(; i < 5; ++i){
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128) return bits;
        }
    } else {
        for(; i < 5; ++i){
            /* istanbul ignore if */ if (this.pos >= this.len) throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128) return bits;
        }
    }
    /* istanbul ignore next */ throw Error("invalid varint encoding");
}
/* eslint-enable no-invalid-this */ /**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */ /**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */ /**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */ /**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */ Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};
function readFixed32_end(buf, end) {
    return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
}
/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */ Reader.prototype.fixed32 = function read_fixed32() {
    /* istanbul ignore if */ if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, this.pos += 4);
};
/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */ Reader.prototype.sfixed32 = function read_sfixed32() {
    /* istanbul ignore if */ if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, this.pos += 4) | 0;
};
/* eslint-disable no-invalid-this */ function readFixed64() {
    /* istanbul ignore if */ if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}
/* eslint-enable no-invalid-this */ /**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */ /**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */ /**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */ Reader.prototype.float = function read_float() {
    /* istanbul ignore if */ if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};
/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */ Reader.prototype.double = function read_double() {
    /* istanbul ignore if */ if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};
/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */ Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(), start = this.pos, end = this.pos + length;
    /* istanbul ignore if */ if (end > this.len) throw indexOutOfRange(this, length);
    this.pos += length;
    if (Array.isArray(this.buf)) return this.buf.slice(start, end);
    if (start === end) {
        var nativeBuffer = util.Buffer;
        return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
    }
    return this._slice.call(this.buf, start, end);
};
/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */ Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};
/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */ Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */ if (this.pos + length > this.len) throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */ if (this.pos >= this.len) throw indexOutOfRange(this);
        }while (this.buf[this.pos++] & 128);
    }
    return this;
};
/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */ Reader.prototype.skipType = function(wireType) {
    switch(wireType){
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while((wireType = this.uint32() & 7) !== 4){
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;
        /* istanbul ignore next */ default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};
Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();
    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {
        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }
    });
};


/***/ }),

/***/ 45965:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = BufferReader;
// extends Reader
var Reader = __webpack_require__(66619);
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
var util = __webpack_require__(27663);
/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */ function BufferReader(buffer) {
    Reader.call(this, buffer);
/**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */ }
BufferReader._configure = function() {
    /* istanbul ignore else */ if (util.Buffer) BufferReader.prototype._slice = util.Buffer.prototype.slice;
};
/**
 * @override
 */ BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
};
/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */ BufferReader._configure();


/***/ }),

/***/ 30840:
/***/ ((module) => {

"use strict";

module.exports = {}; /**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available across modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */ 


/***/ }),

/***/ 22703:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Streaming RPC helpers.
 * @namespace
 */ var rpc = exports;
/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */ /**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */ rpc.Service = __webpack_require__(64554);


/***/ }),

/***/ 64554:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Service;
var util = __webpack_require__(27663);
// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */ /**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */ /**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */ function Service(rpcImpl, requestDelimited, responseDelimited) {
    if (typeof rpcImpl !== "function") throw TypeError("rpcImpl must be a function");
    util.EventEmitter.call(this);
    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */ this.rpcImpl = rpcImpl;
    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */ this.requestDelimited = Boolean(requestDelimited);
    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */ this.responseDelimited = Boolean(responseDelimited);
}
/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */ Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
    if (!request) throw TypeError("request must be specified");
    var self = this;
    if (!callback) return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);
    if (!self.rpcImpl) {
        setTimeout(function() {
            callback(Error("already ended"));
        }, 0);
        return undefined;
    }
    try {
        return self.rpcImpl(method, requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(), function rpcCallback(err, response) {
            if (err) {
                self.emit("error", err, method);
                return callback(err);
            }
            if (response === null) {
                self.end(/* endedByRPC */ true);
                return undefined;
            }
            if (!(response instanceof responseCtor)) {
                try {
                    response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                } catch (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }
            }
            self.emit("data", response, method);
            return callback(null, response);
        });
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() {
            callback(err);
        }, 0);
        return undefined;
    }
};
/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */ Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};


/***/ }),

/***/ 78091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = LongBits;
var util = __webpack_require__(27663);
/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */ function LongBits(lo, hi) {
    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.
    /**
     * Low bits.
     * @type {number}
     */ this.lo = lo >>> 0;
    /**
     * High bits.
     * @type {number}
     */ this.hi = hi >>> 0;
}
/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */ var zero = LongBits.zero = new LongBits(0, 0);
zero.toNumber = function() {
    return 0;
};
zero.zzEncode = zero.zzDecode = function() {
    return this;
};
zero.length = function() {
    return 1;
};
/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */ var zeroHash = LongBits.zeroHash = "\x00\x00\x00\x00\x00\x00\x00\x00";
/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */ LongBits.fromNumber = function fromNumber(value) {
    if (value === 0) return zero;
    var sign = value < 0;
    if (sign) value = -value;
    var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295) hi = 0;
        }
    }
    return new LongBits(lo, hi);
};
/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */ LongBits.from = function from(value) {
    if (typeof value === "number") return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */ if (util.Long) value = util.Long.fromString(value);
        else return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};
/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */ LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo) hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};
/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */ LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : {
        low: this.lo | 0,
        high: this.hi | 0,
        unsigned: Boolean(unsigned)
    };
};
var charCodeAt = String.prototype.charCodeAt;
/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */ LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash) return zero;
    return new LongBits((charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0, (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0);
};
/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */ LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
};
/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */ LongBits.prototype.zzEncode = function zzEncode() {
    var mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
};
/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */ LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
};
/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */ LongBits.prototype.length = function length() {
    var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
};


/***/ }),

/***/ 27663:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var util = exports;
// used to return a Promise where callback is omitted
util.asPromise = __webpack_require__(60324);
// converts to / from base64 encoded strings
util.base64 = __webpack_require__(88557);
// base class of rpc.Service
util.EventEmitter = __webpack_require__(92059);
// float handling accross browsers
util.float = __webpack_require__(64855);
// requires modules optionally and hides the call from bundlers
util.inquire = __webpack_require__(99236);
// converts to / from utf8 encoded strings
util.utf8 = __webpack_require__(53566);
// provides a node-like buffer pool in the browser
util.pool = __webpack_require__(12821);
// utility to work with the low and high bits of a 64 bit value
util.LongBits = __webpack_require__(78091);
/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 */ util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
/**
 * Global object reference.
 * @memberof util
 * @type {Object}
 */ util.global = util.isNode && global ||  false && 0 || typeof self !== "undefined" && self || this; // eslint-disable-line no-invalid-this
/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */ util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes
/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */ util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes
/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */ util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};
/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */ util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};
/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */ util.isObject = function isObject(value) {
    return value && typeof value === "object";
};
/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */ util.isset = /**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */ util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};
/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */ /**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */ util.Buffer = function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */ return null;
    }
}();
// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;
// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;
/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */ util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */ return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
};
/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */ util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */  : Array;
/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */ /**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */ util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long || /* istanbul ignore next */ util.global.Long || util.inquire("long");
/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */ util.key2Re = /^true|false|0|1$/;
/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */ util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */ util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */ util.longToHash = function longToHash(value) {
    return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
};
/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */ util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long) return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};
/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */ function merge(dst, src, ifNotSet) {
    for(var keys = Object.keys(src), i = 0; i < keys.length; ++i)if (dst[keys[i]] === undefined || !ifNotSet) dst[keys[i]] = src[keys[i]];
    return dst;
}
util.merge = merge;
/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */ util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};
/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */ function newError(name) {
    function CustomError(message, properties) {
        if (!(this instanceof CustomError)) return new CustomError(message, properties);
        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function
        Object.defineProperty(this, "message", {
            get: function() {
                return message;
            }
        });
        /* istanbul ignore next */ if (Error.captureStackTrace) Error.captureStackTrace(this, CustomError);
        else Object.defineProperty(this, "stack", {
            value: new Error().stack || ""
        });
        if (properties) merge(this, properties);
    }
    CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true
        },
        name: {
            get: function get() {
                return name;
            },
            set: undefined,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true
        },
        toString: {
            value: function value() {
                return this.name + ": " + this.message;
            },
            writable: true,
            enumerable: false,
            configurable: true
        }
    });
    return CustomError;
}
util.newError = newError;
/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */ util.ProtocolError = newError("ProtocolError");
/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */ /**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */ /**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */ util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for(var i = 0; i < fieldNames.length; ++i)fieldMap[fieldNames[i]] = 1;
    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */ return function() {
        for(var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null) return keys[i];
    };
};
/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */ /**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */ util.oneOfSetter = function setOneOf(fieldNames) {
    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */ return function(name) {
        for(var i = 0; i < fieldNames.length; ++i)if (fieldNames[i] !== name) delete this[fieldNames[i]];
    };
};
/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */ util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};
// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */ if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || /* istanbul ignore next */ function Buffer_from(value, encoding) {
        return new Buffer(value, encoding);
    };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe || /* istanbul ignore next */ function Buffer_allocUnsafe(size) {
        return new Buffer(size);
    };
};


/***/ }),

/***/ 30065:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Writer;
var util = __webpack_require__(27663);
var BufferWriter; // cyclic
var LongBits = util.LongBits, base64 = util.base64, utf8 = util.utf8;
/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */ function Op(fn, len, val) {
    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */ this.fn = fn;
    /**
     * Value byte length.
     * @type {number}
     */ this.len = len;
    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */ this.next = undefined;
    /**
     * Value to write.
     * @type {*}
     */ this.val = val; // type varies
}
/* istanbul ignore next */ function noop() {} // eslint-disable-line no-empty-function
/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */ function State(writer) {
    /**
     * Current head.
     * @type {Writer.Op}
     */ this.head = writer.head;
    /**
     * Current tail.
     * @type {Writer.Op}
     */ this.tail = writer.tail;
    /**
     * Current buffer length.
     * @type {number}
     */ this.len = writer.len;
    /**
     * Next state.
     * @type {State|null}
     */ this.next = writer.states;
}
/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */ function Writer() {
    /**
     * Current length.
     * @type {number}
     */ this.len = 0;
    /**
     * Operations head.
     * @type {Object}
     */ this.head = new Op(noop, 0, 0);
    /**
     * Operations tail
     * @type {Object}
     */ this.tail = this.head;
    /**
     * Linked forked states.
     * @type {Object|null}
     */ this.states = null;
// When a value is written, the writer calculates its byte length and puts it into a linked
// list of operations to perform when finish() is called. This both allows us to allocate
// buffers of the exact required size and reduces the amount of work we have to do compared
// to first calculating over objects and then encoding over objects. In our case, the encoding
// part is just a linked list walk calling operations with already prepared values.
}
var create = function create() {
    return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
            return new BufferWriter();
        })();
    } : function create_array() {
        return new Writer();
    };
};
/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */ Writer.create = create();
/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */ Writer.alloc = function alloc(size) {
    return new util.Array(size);
};
// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */ if (util.Array !== Array) Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */ Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};
function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}
function writeVarint32(val, buf, pos) {
    while(val > 127){
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}
/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */ function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}
VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;
/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
    return this;
};
/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.int32 = function write_int32(value) {
    return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
     : this.uint32(value);
};
/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};
function writeVarint64(val, buf, pos) {
    while(val.hi){
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while(val.lo > 127){
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}
/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */ Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};
/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */ Writer.prototype.int64 = Writer.prototype.uint64;
/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */ Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};
/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};
function writeFixed32(val, buf, pos) {
    buf[pos] = val & 255;
    buf[pos + 1] = val >>> 8 & 255;
    buf[pos + 2] = val >>> 16 & 255;
    buf[pos + 3] = val >>> 24;
}
/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};
/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.sfixed32 = Writer.prototype.fixed32;
/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */ Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};
/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */ Writer.prototype.sfixed64 = Writer.prototype.fixed64;
/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};
/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};
var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
    buf.set(val, pos); // also works for plain array values
} : function writeBytes_for(val, buf, pos) {
    for(var i = 0; i < val.length; ++i)buf[pos + i] = val[i];
};
/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */ Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len) return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};
/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */ Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
};
/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */ Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};
/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */ Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
    }
    return this;
};
/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */ Writer.prototype.ldelim = function ldelim() {
    var head = this.head, tail = this.tail, len = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};
/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */ Writer.prototype.finish = function finish() {
    var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
    while(head){
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};
Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
};


/***/ }),

/***/ 15311:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = BufferWriter;
// extends Writer
var Writer = __webpack_require__(30065);
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
var util = __webpack_require__(27663);
/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */ function BufferWriter() {
    Writer.call(this);
}
BufferWriter._configure = function() {
    /**
     * Allocates a buffer of the specified size.
     * @function
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */ BufferWriter.alloc = util._Buffer_allocUnsafe;
    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
    // also works for plain array values
    } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy) val.copy(buf, pos, 0, val.length);
        else for(var i = 0; i < val.length;)buf[pos++] = val[i++];
    };
};
/**
 * @override
 */ BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value)) value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len) this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
};
function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) util.utf8.write(val, buf, pos);
    else if (buf.utf8Write) buf.utf8Write(val, pos);
    else buf.write(val, pos);
}
/**
 * @override
 */ BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util.Buffer.byteLength(value);
    this.uint32(len);
    if (len) this._push(writeStringBuffer, len, value);
    return this;
};
/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */ BufferWriter._configure();


/***/ }),

/***/ 77913:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var parseUrl = (__webpack_require__(57310).parse);
var DEFAULT_PORTS = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
};
var stringEndsWith = String.prototype.endsWith || function(s) {
    return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
};
/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */ function getProxyForUrl(url) {
    var parsedUrl = typeof url === "string" ? parseUrl(url) : url || {};
    var proto = parsedUrl.protocol;
    var hostname = parsedUrl.host;
    var port = parsedUrl.port;
    if (typeof hostname !== "string" || !hostname || typeof proto !== "string") {
        return ""; // Don't proxy URLs without a valid scheme or host.
    }
    proto = proto.split(":", 1)[0];
    // Stripping ports in this way instead of using parsedUrl.hostname to make
    // sure that the brackets around IPv6 addresses are kept.
    hostname = hostname.replace(/:\d*$/, "");
    port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
    if (!shouldProxy(hostname, port)) {
        return ""; // Don't proxy URLs that match NO_PROXY.
    }
    var proxy = getEnv("npm_config_" + proto + "_proxy") || getEnv(proto + "_proxy") || getEnv("npm_config_proxy") || getEnv("all_proxy");
    if (proxy && proxy.indexOf("://") === -1) {
        // Missing scheme in proxy, default to the requested URL's scheme.
        proxy = proto + "://" + proxy;
    }
    return proxy;
}
/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */ function shouldProxy(hostname, port) {
    var NO_PROXY = (getEnv("npm_config_no_proxy") || getEnv("no_proxy")).toLowerCase();
    if (!NO_PROXY) {
        return true; // Always proxy if NO_PROXY is not set.
    }
    if (NO_PROXY === "*") {
        return false; // Never proxy if wildcard is set.
    }
    return NO_PROXY.split(/[,\s]/).every(function(proxy) {
        if (!proxy) {
            return true; // Skip zero-length hosts.
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
            return true; // Skip if ports don't match.
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
            // No wildcards, so stop proxying if there is an exact match.
            return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === "*") {
            // Remove leading wildcard.
            parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        // Stop proxying if the hostname ends with the no_proxy host.
        return !stringEndsWith.call(hostname, parsedProxyHostname);
    });
}
/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */ function getEnv(key) {
    return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
exports.getProxyForUrl = getProxyForUrl;


/***/ }),

/***/ 28569:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ 
var buffer = __webpack_require__(14300);
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === "string") {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
};


/***/ }),

/***/ 39761:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ANY = Symbol("SemVer ANY");
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options){
        options = parseOptions(options);
        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = "";
        } else {
            this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
    }
    parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== undefined ? m[1] : "";
        if (this.operator === "=") {
            this.operator = "";
        }
        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new SemVer(m[2], this.options.loose);
        }
    }
    toString() {
        return this.value;
    }
    test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
            return true;
        }
        if (typeof version === "string") {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
            if (this.value === "") {
                return true;
            }
            return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
            if (comp.value === "") {
                return true;
            }
            return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        // Special cases where nothing can possibly be lower
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
            return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
            return false;
        }
        // Same direction increasing (> or >=)
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
            return true;
        }
        // Same direction decreasing (< or <=)
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
            return true;
        }
        // same SemVer and both sides are inclusive (<= or >=)
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
            return true;
        }
        // opposite directions less than
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
            return true;
        }
        // opposite directions greater than
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
            return true;
        }
        return false;
    }
}
module.exports = Comparator;
const parseOptions = __webpack_require__(15471);
const { safeRe: re, t } = __webpack_require__(61872);
const cmp = __webpack_require__(80048);
const debug = __webpack_require__(17041);
const SemVer = __webpack_require__(72893);
const Range = __webpack_require__(9138);


/***/ }),

/***/ 9138:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// hoisted class for cyclic dependency

class Range {
    constructor(range, options){
        options = parseOptions(options);
        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }
        if (range instanceof Comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [
                [
                    range
                ]
            ];
            this.format();
            return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        // First reduce all whitespace as much as possible so we do not have to rely
        // on potentially slow regexes like \s*. This is then stored and used for
        // future error messages as well.
        this.raw = range.trim().split(/\s+/).join(" ");
        // First, split on ||
        this.set = this.raw.split("||")// map the range to a 2d array of comparators
        .map((r)=>this.parseRange(r.trim()))// throw out any comparator lists that are empty
        // this generally means that it was not a valid range, which is allowed
        // in loose mode, but will still throw if the WHOLE range is invalid.
        .filter((c)=>c.length);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        // if we have any that are not the null set, throw out null sets.
        if (this.set.length > 1) {
            // keep the first one, in case they're all null sets
            const first = this.set[0];
            this.set = this.set.filter((c)=>!isNullSet(c[0]));
            if (this.set.length === 0) {
                this.set = [
                    first
                ];
            } else if (this.set.length > 1) {
                // if we have any that are *, then the range is just *
                for (const c of this.set){
                    if (c.length === 1 && isAny(c[0])) {
                        this.set = [
                            c
                        ];
                        break;
                    }
                }
            }
        }
        this.format();
    }
    format() {
        this.range = this.set.map((comps)=>comps.join(" ").trim()).join("||").trim();
        return this.range;
    }
    toString() {
        return this.range;
    }
    parseRange(range) {
        // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
            return cached;
        }
        const loose = this.options.loose;
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        let rangeList = range.split(" ").map((comp)=>parseComparator(comp, this.options)).join(" ").split(/\s+/)// >=0.0.0 is equivalent to *
        .map((comp)=>replaceGTE0(comp, this.options));
        if (loose) {
            // in loose mode, throw out any that are not valid comparators
            rangeList = rangeList.filter((comp)=>{
                debug("loose invalid filter", comp, this.options);
                return !!comp.match(re[t.COMPARATORLOOSE]);
            });
        }
        debug("range list", rangeList);
        // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once
        const rangeMap = new Map();
        const comparators = rangeList.map((comp)=>new Comparator(comp, this.options));
        for (const comp of comparators){
            if (isNullSet(comp)) {
                return [
                    comp
                ];
            }
            rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
            rangeMap.delete("");
        }
        const result = [
            ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
    }
    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators)=>{
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators)=>{
                return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator)=>{
                    return rangeComparators.every((rangeComparator)=>{
                        return thisComparator.intersects(rangeComparator, options);
                    });
                });
            });
        });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === "string") {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        for(let i = 0; i < this.set.length; i++){
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
module.exports = Range;
const LRU = __webpack_require__(88303);
const cache = new LRU({
    max: 1000
});
const parseOptions = __webpack_require__(15471);
const Comparator = __webpack_require__(39761);
const debug = __webpack_require__(17041);
const SemVer = __webpack_require__(72893);
const { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = __webpack_require__(61872);
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __webpack_require__(51923);
const isNullSet = (c)=>c.value === "<0.0.0-0";
const isAny = (c)=>c.value === "";
// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options)=>{
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every((otherComparator)=>{
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
};
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options)=>{
    debug("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug("caret", comp);
    comp = replaceTildes(comp, options);
    debug("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug("xrange", comp);
    comp = replaceStars(comp, options);
    debug("stars", comp);
    return comp;
};
const isX = (id)=>!id || id.toLowerCase() === "x" || id === "*";
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceTilde(c, options)).join(" ");
};
const replaceTilde = (comp, options)=>{
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = "";
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            debug("replaceTilde pr", pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
    });
};
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceCaret(c, options)).join(" ");
};
const replaceCaret = (comp, options)=>{
    debug("caret", comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = "";
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === "0") {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            debug("replaceCaret pr", pr);
            if (M === "0") {
                if (m === "0") {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            debug("no pr");
            if (M === "0") {
                if (m === "0") {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        debug("caret return", ret);
        return ret;
    });
};
const replaceXRanges = (comp, options)=>{
    debug("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c)=>replaceXRange(c, options)).join(" ");
};
const replaceXRange = (comp, options)=>{
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
            gtlt = "";
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
            if (gtlt === ">" || gtlt === "<") {
                // nothing is allowed
                ret = "<0.0.0-0";
            } else {
                // nothing is forbidden
                ret = "*";
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === ">") {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = ">=";
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === "<=") {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = "<";
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === "<") {
                pr = "-0";
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
    });
};
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options)=>{
    debug("replaceStars", comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], "");
};
const replaceGTE0 = (comp, options)=>{
    debug("replaceGTE0", comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
};
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = (incPr)=>($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb)=>{
        if (isX(fM)) {
            from = "";
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${incPr ? "-0" : ""}`;
        }
        if (isX(tM)) {
            to = "";
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    };
const testSet = (set, version, options)=>{
    for(let i = 0; i < set.length; i++){
        if (!set[i].test(version)) {
            return false;
        }
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(let i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
                continue;
            }
            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                    return true;
                }
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
};


/***/ }),

/***/ 72893:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const debug = __webpack_require__(17041);
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(51923);
const { safeRe: re, t } = __webpack_require__(61872);
const parseOptions = __webpack_require__(15471);
const { compareIdentifiers } = __webpack_require__(9009);
class SemVer {
    constructor(version, options){
        options = parseOptions(options);
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== "string") {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
        }
        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split(".").map((id)=>{
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }
                return id;
            });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === "string" && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
            return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    }
    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug("prerelease compare", i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i);
    }
    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug("prerelease compare", i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
        switch(release){
            case "premajor":
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc("pre", identifier, identifierBase);
                break;
            case "preminor":
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc("pre", identifier, identifierBase);
                break;
            case "prepatch":
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc("patch", identifier, identifierBase);
                this.inc("pre", identifier, identifierBase);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case "prerelease":
                if (this.prerelease.length === 0) {
                    this.inc("patch", identifier, identifierBase);
                }
                this.inc("pre", identifier, identifierBase);
                break;
            case "major":
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case "minor":
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case "patch":
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case "pre":
                {
                    const base = Number(identifierBase) ? 1 : 0;
                    if (!identifier && identifierBase === false) {
                        throw new Error("invalid increment argument: identifier is empty");
                    }
                    if (this.prerelease.length === 0) {
                        this.prerelease = [
                            base
                        ];
                    } else {
                        let i = this.prerelease.length;
                        while(--i >= 0){
                            if (typeof this.prerelease[i] === "number") {
                                this.prerelease[i]++;
                                i = -2;
                            }
                        }
                        if (i === -1) {
                            // didn't increment anything
                            if (identifier === this.prerelease.join(".") && identifierBase === false) {
                                throw new Error("invalid increment argument: identifier already exists");
                            }
                            this.prerelease.push(base);
                        }
                    }
                    if (identifier) {
                        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                        let prerelease = [
                            identifier,
                            base
                        ];
                        if (identifierBase === false) {
                            prerelease = [
                                identifier
                            ];
                        }
                        if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                            if (isNaN(this.prerelease[1])) {
                                this.prerelease = prerelease;
                            }
                        } else {
                            this.prerelease = prerelease;
                        }
                    }
                    break;
                }
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
            this.raw += `+${this.build.join(".")}`;
        }
        return this;
    }
}
module.exports = SemVer;


/***/ }),

/***/ 77368:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(61475);
const clean = (version, options)=>{
    const s = parse(version.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
};
module.exports = clean;


/***/ }),

/***/ 80048:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const eq = __webpack_require__(17456);
const neq = __webpack_require__(23262);
const gt = __webpack_require__(12880);
const gte = __webpack_require__(4073);
const lt = __webpack_require__(40281);
const lte = __webpack_require__(71115);
const cmp = (a, op, b, loose)=>{
    switch(op){
        case "===":
            if (typeof a === "object") {
                a = a.version;
            }
            if (typeof b === "object") {
                b = b.version;
            }
            return a === b;
        case "!==":
            if (typeof a === "object") {
                a = a.version;
            }
            if (typeof b === "object") {
                b = b.version;
            }
            return a !== b;
        case "":
        case "=":
        case "==":
            return eq(a, b, loose);
        case "!=":
            return neq(a, b, loose);
        case ">":
            return gt(a, b, loose);
        case ">=":
            return gte(a, b, loose);
        case "<":
            return lt(a, b, loose);
        case "<=":
            return lte(a, b, loose);
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
module.exports = cmp;


/***/ }),

/***/ 82639:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const parse = __webpack_require__(61475);
const { safeRe: re, t } = __webpack_require__(61872);
const coerce = (version, options)=>{
    if (version instanceof SemVer) {
        return version;
    }
    if (typeof version === "number") {
        version = String(version);
    }
    if (typeof version !== "string") {
        return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
        match = version.match(re[t.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        let next;
        while((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        re[t.COERCERTL].lastIndex = -1;
    }
    if (match === null) {
        return null;
    }
    return parse(`${match[2]}.${match[3] || "0"}.${match[4] || "0"}`, options);
};
module.exports = coerce;


/***/ }),

/***/ 63929:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const compareBuild = (a, b, loose)=>{
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
module.exports = compareBuild;


/***/ }),

/***/ 99866:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const compareLoose = (a, b)=>compare(a, b, true);
module.exports = compareLoose;


/***/ }),

/***/ 18309:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const compare = (a, b, loose)=>new SemVer(a, loose).compare(new SemVer(b, loose));
module.exports = compare;


/***/ }),

/***/ 88249:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(61475);
const diff = (version1, version2)=>{
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
        return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
        // Going from prerelease -> no prerelease requires some special casing
        // If the low version has only a major, then it will always be a major
        // Some examples:
        // 1.0.0-1 -> 1.0.0
        // 1.0.0-1 -> 1.1.1
        // 1.0.0-1 -> 2.0.0
        if (!lowVersion.patch && !lowVersion.minor) {
            return "major";
        }
        // Otherwise it can be determined by checking the high version
        if (highVersion.patch) {
            // anything higher than a patch bump would result in the wrong version
            return "patch";
        }
        if (highVersion.minor) {
            // anything higher than a minor bump would result in the wrong version
            return "minor";
        }
        // bumping major/minor/patch all have same result
        return "major";
    }
    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? "pre" : "";
    if (v1.major !== v2.major) {
        return prefix + "major";
    }
    if (v1.minor !== v2.minor) {
        return prefix + "minor";
    }
    if (v1.patch !== v2.patch) {
        return prefix + "patch";
    }
    // high and low are preleases
    return "prerelease";
};
module.exports = diff;


/***/ }),

/***/ 17456:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const eq = (a, b, loose)=>compare(a, b, loose) === 0;
module.exports = eq;


/***/ }),

/***/ 12880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const gt = (a, b, loose)=>compare(a, b, loose) > 0;
module.exports = gt;


/***/ }),

/***/ 4073:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const gte = (a, b, loose)=>compare(a, b, loose) >= 0;
module.exports = gte;


/***/ }),

/***/ 87788:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const inc = (version, release, options, identifier, identifierBase)=>{
    if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = undefined;
    }
    try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
        return null;
    }
};
module.exports = inc;


/***/ }),

/***/ 40281:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const lt = (a, b, loose)=>compare(a, b, loose) < 0;
module.exports = lt;


/***/ }),

/***/ 71115:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const lte = (a, b, loose)=>compare(a, b, loose) <= 0;
module.exports = lte;


/***/ }),

/***/ 20301:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const major = (a, loose)=>new SemVer(a, loose).major;
module.exports = major;


/***/ }),

/***/ 59551:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const minor = (a, loose)=>new SemVer(a, loose).minor;
module.exports = minor;


/***/ }),

/***/ 23262:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const neq = (a, b, loose)=>compare(a, b, loose) !== 0;
module.exports = neq;


/***/ }),

/***/ 61475:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const parse = (version, options, throwErrors = false)=>{
    if (version instanceof SemVer) {
        return version;
    }
    try {
        return new SemVer(version, options);
    } catch (er) {
        if (!throwErrors) {
            return null;
        }
        throw er;
    }
};
module.exports = parse;


/***/ }),

/***/ 73989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const patch = (a, loose)=>new SemVer(a, loose).patch;
module.exports = patch;


/***/ }),

/***/ 89268:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(61475);
const prerelease = (version, options)=>{
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
module.exports = prerelease;


/***/ }),

/***/ 68400:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compare = __webpack_require__(18309);
const rcompare = (a, b, loose)=>compare(b, a, loose);
module.exports = rcompare;


/***/ }),

/***/ 79536:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compareBuild = __webpack_require__(63929);
const rsort = (list, loose)=>list.sort((a, b)=>compareBuild(b, a, loose));
module.exports = rsort;


/***/ }),

/***/ 12990:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(9138);
const satisfies = (version, range, options)=>{
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
};
module.exports = satisfies;


/***/ }),

/***/ 50595:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const compareBuild = __webpack_require__(63929);
const sort = (list, loose)=>list.sort((a, b)=>compareBuild(a, b, loose));
module.exports = sort;


/***/ }),

/***/ 29488:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parse = __webpack_require__(61475);
const valid = (version, options)=>{
    const v = parse(version, options);
    return v ? v.version : null;
};
module.exports = valid;


/***/ }),

/***/ 89724:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// just pre-load all the stuff that index.js lazily exports

const internalRe = __webpack_require__(61872);
const constants = __webpack_require__(51923);
const SemVer = __webpack_require__(72893);
const identifiers = __webpack_require__(9009);
const parse = __webpack_require__(61475);
const valid = __webpack_require__(29488);
const clean = __webpack_require__(77368);
const inc = __webpack_require__(87788);
const diff = __webpack_require__(88249);
const major = __webpack_require__(20301);
const minor = __webpack_require__(59551);
const patch = __webpack_require__(73989);
const prerelease = __webpack_require__(89268);
const compare = __webpack_require__(18309);
const rcompare = __webpack_require__(68400);
const compareLoose = __webpack_require__(99866);
const compareBuild = __webpack_require__(63929);
const sort = __webpack_require__(50595);
const rsort = __webpack_require__(79536);
const gt = __webpack_require__(12880);
const lt = __webpack_require__(40281);
const eq = __webpack_require__(17456);
const neq = __webpack_require__(23262);
const gte = __webpack_require__(4073);
const lte = __webpack_require__(71115);
const cmp = __webpack_require__(80048);
const coerce = __webpack_require__(82639);
const Comparator = __webpack_require__(39761);
const Range = __webpack_require__(9138);
const satisfies = __webpack_require__(12990);
const toComparators = __webpack_require__(5645);
const maxSatisfying = __webpack_require__(31681);
const minSatisfying = __webpack_require__(74957);
const minVersion = __webpack_require__(22292);
const validRange = __webpack_require__(76721);
const outside = __webpack_require__(48210);
const gtr = __webpack_require__(54097);
const ltr = __webpack_require__(18437);
const intersects = __webpack_require__(7463);
const simplifyRange = __webpack_require__(73428);
const subset = __webpack_require__(80746);
module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
};


/***/ }),

/***/ 51923:
/***/ ((module) => {

"use strict";
// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.

const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;
// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
const RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
];
module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
};


/***/ }),

/***/ 17041:
/***/ ((module) => {

"use strict";

const debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error("SEMVER", ...args) : ()=>{};
module.exports = debug;


/***/ }),

/***/ 9009:
/***/ ((module) => {

"use strict";

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b)=>{
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b)=>compareIdentifiers(b, a);
module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
};


/***/ }),

/***/ 15471:
/***/ ((module) => {

"use strict";
// parse out just the options we care about

const looseOption = Object.freeze({
    loose: true
});
const emptyOpts = Object.freeze({});
const parseOptions = (options)=>{
    if (!options) {
        return emptyOpts;
    }
    if (typeof options !== "object") {
        return looseOption;
    }
    return options;
};
module.exports = parseOptions;


/***/ }),

/***/ 61872:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = __webpack_require__(51923);
const debug = __webpack_require__(17041);
exports = module.exports = {};
// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const t = exports.t = {};
let R = 0;
const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
    [
        "\\s",
        1
    ],
    [
        "\\d",
        MAX_LENGTH
    ],
    [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
    ]
];
const makeSafeRegex = (value)=>{
    for (const [token, max] of safeRegexReplacements){
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
};
const createToken = (name, value, isGlobal)=>{
    const safe = makeSafeRegex(value);
    const index = R++;
    debug(name, index, value);
    t[name] = index;
    src[index] = value;
    re[index] = new RegExp(value, isGlobal ? "g" : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
// ## Main Version
// Three dot-separated numeric identifiers.
createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken("FULL", `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
createToken("GTLT", "((?:<|>)?=?)");
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken("COERCE", `${"(^|[^\\d])" + "(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:$|[^\\d])`);
createToken("COERCERTL", src[t.COERCE], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken("LONETILDE", "(?:~>?)");
createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = "$1~";
createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken("LONECARET", "(?:\\^)");
createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = "$1^";
createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = "$1$2$3";
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken("STAR", "(<|>)?=?\\s*\\*");
// >=0.0.0 is like a star
createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");


/***/ }),

/***/ 54097:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Determine if version is greater than all the versions possible in the range.

const outside = __webpack_require__(48210);
const gtr = (version, range, options)=>outside(version, range, ">", options);
module.exports = gtr;


/***/ }),

/***/ 7463:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(9138);
const intersects = (r1, r2, options)=>{
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
};
module.exports = intersects;


/***/ }),

/***/ 18437:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const outside = __webpack_require__(48210);
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options)=>outside(version, range, "<", options);
module.exports = ltr;


/***/ }),

/***/ 31681:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const Range = __webpack_require__(9138);
const maxSatisfying = (versions, range, options)=>{
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
};
module.exports = maxSatisfying;


/***/ }),

/***/ 74957:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const Range = __webpack_require__(9138);
const minSatisfying = (versions, range, options)=>{
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
};
module.exports = minSatisfying;


/***/ }),

/***/ 22292:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const Range = __webpack_require__(9138);
const gt = __webpack_require__(12880);
const minVersion = (range, loose)=>{
    range = new Range(range, loose);
    let minver = new SemVer("0.0.0");
    if (range.test(minver)) {
        return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range.test(minver)) {
        return minver;
    }
    minver = null;
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator)=>{
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case ">":
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */ case "":
                case ">=":
                    if (!setMin || gt(compver, setMin)) {
                        setMin = compver;
                    }
                    break;
                case "<":
                case "<=":
                    break;
                /* istanbul ignore next */ default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
        }
    }
    if (minver && range.test(minver)) {
        return minver;
    }
    return null;
};
module.exports = minVersion;


/***/ }),

/***/ 48210:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const SemVer = __webpack_require__(72893);
const Comparator = __webpack_require__(39761);
const { ANY } = Comparator;
const Range = __webpack_require__(9138);
const satisfies = __webpack_require__(12990);
const gt = __webpack_require__(12880);
const lt = __webpack_require__(40281);
const lte = __webpack_require__(71115);
const gte = __webpack_require__(4073);
const outside = (version, range, hilo, options)=>{
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case ">":
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = ">";
            ecomp = ">=";
            break;
        case "<":
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = "<";
            ecomp = "<=";
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisfies the range it is not outside
    if (satisfies(version, range, options)) {
        return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator)=>{
            if (comparator.semver === ANY) {
                comparator = new Comparator(">=0.0.0");
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
                high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
                low = comparator;
            }
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};
module.exports = outside;


/***/ }),

/***/ 73428:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.

const satisfies = __webpack_require__(12990);
const compare = __webpack_require__(18309);
module.exports = (versions, range, options)=>{
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b)=>compare(a, b, options));
    for (const version of v){
        const included = satisfies(version, range, options);
        if (included) {
            prev = version;
            if (!first) {
                first = version;
            }
        } else {
            if (prev) {
                set.push([
                    first,
                    prev
                ]);
            }
            prev = null;
            first = null;
        }
    }
    if (first) {
        set.push([
            first,
            null
        ]);
    }
    const ranges = [];
    for (const [min, max] of set){
        if (min === max) {
            ranges.push(min);
        } else if (!max && min === v[0]) {
            ranges.push("*");
        } else if (!max) {
            ranges.push(`>=${min}`);
        } else if (min === v[0]) {
            ranges.push(`<=${max}`);
        } else {
            ranges.push(`${min} - ${max}`);
        }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range.raw === "string" ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
};


/***/ }),

/***/ 80746:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(9138);
const Comparator = __webpack_require__(39761);
const { ANY } = Comparator;
const satisfies = __webpack_require__(12990);
const compare = __webpack_require__(18309);
// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true
const subset = (sub, dom, options = {})=>{
    if (sub === dom) {
        return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set){
        for (const simpleDom of dom.set){
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
                continue OUTER;
            }
        }
        // the null set is a subset of everything, but null simple ranges in
        // a complex range should be ignored.  so if we saw a non-null range,
        // then we know this isn't a subset, but if EVERY simple range was null,
        // then it is a subset.
        if (sawNonNull) {
            return false;
        }
    }
    return true;
};
const minimumVersionWithPreRelease = [
    new Comparator(">=0.0.0-0")
];
const minimumVersion = [
    new Comparator(">=0.0.0")
];
const simpleSubset = (sub, dom, options)=>{
    if (sub === dom) {
        return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
        } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
        } else {
            sub = minimumVersion;
        }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
            return true;
        } else {
            dom = minimumVersion;
        }
    }
    const eqSet = new Set();
    let gt, lt;
    for (const c of sub){
        if (c.operator === ">" || c.operator === ">=") {
            gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
            lt = lowerLT(lt, c, options);
        } else {
            eqSet.add(c.semver);
        }
    }
    if (eqSet.size > 1) {
        return null;
    }
    let gtltComp;
    if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
            return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
            return null;
        }
    }
    // will iterate one or zero times
    for (const eq of eqSet){
        if (gt && !satisfies(eq, String(gt), options)) {
            return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
            return null;
        }
        for (const c of dom){
            if (!satisfies(eq, String(c), options)) {
                return false;
            }
        }
        return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
    }
    for (const c of dom){
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
            if (needDomGTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                    needDomGTPre = false;
                }
            }
            if (c.operator === ">" || c.operator === ">=") {
                higher = higherGT(gt, c, options);
                if (higher === c && higher !== gt) {
                    return false;
                }
            } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
                return false;
            }
        }
        if (lt) {
            if (needDomLTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                    needDomLTPre = false;
                }
            }
            if (c.operator === "<" || c.operator === "<=") {
                lower = lowerLT(lt, c, options);
                if (lower === c && lower !== lt) {
                    return false;
                }
            } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
                return false;
            }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
        }
    }
    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
    }
    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
        return false;
    }
    return true;
};
// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
};
// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
};
module.exports = subset;


/***/ }),

/***/ 5645:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(9138);
// Mostly just for testing and legacy API reasons
const toComparators = (range, options)=>new Range(range, options).set.map((comp)=>comp.map((c)=>c.value).join(" ").trim().split(" "));
module.exports = toComparators;


/***/ }),

/***/ 76721:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Range = __webpack_require__(9138);
const validRange = (range, options)=>{
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || "*";
    } catch (er) {
        return null;
    }
};
module.exports = validRange;


/***/ }),

/***/ 12662:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(22037);
const tty = __webpack_require__(76224);
const hasFlag = __webpack_require__(29864);
const { env } = process;
let forceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
    forceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    forceColor = 1;
}
if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
        forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
    } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
}
function translateLevel(level) {
    if (level === 0) {
        return false;
    }
    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
    };
}
function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
        return 0;
    }
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
    }
    if (hasFlag("color=256")) {
        return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
        return min;
    }
    if (process.platform === "win32") {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
            return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
    }
    if ("CI" in env) {
        if ([
            "TRAVIS",
            "CIRCLECI",
            "APPVEYOR",
            "GITLAB_CI",
            "GITHUB_ACTIONS",
            "BUILDKITE"
        ].some((sign)=>sign in env) || env.CI_NAME === "codeship") {
            return 1;
        }
        return min;
    }
    if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
        return 3;
    }
    if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch(env.TERM_PROGRAM){
            case "iTerm.app":
                return version >= 3 ? 3 : 2;
            case "Apple_Terminal":
                return 2;
        }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
    }
    if ("COLORTERM" in env) {
        return 1;
    }
    return min;
}
function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
}
module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 82198:
/***/ ((module) => {

"use strict";

module.exports = function(Yallist) {
    Yallist.prototype[Symbol.iterator] = function*() {
        for(let walker = this.head; walker; walker = walker.next){
            yield walker.value;
        }
    };
};


/***/ }),

/***/ 66962:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;
function Yallist(list) {
    var self = this;
    if (!(self instanceof Yallist)) {
        self = new Yallist();
    }
    self.tail = null;
    self.head = null;
    self.length = 0;
    if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
            self.push(item);
        });
    } else if (arguments.length > 0) {
        for(var i = 0, l = arguments.length; i < l; i++){
            self.push(arguments[i]);
        }
    }
    return self;
}
Yallist.prototype.removeNode = function(node) {
    if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
    }
    var next = node.next;
    var prev = node.prev;
    if (next) {
        next.prev = prev;
    }
    if (prev) {
        prev.next = next;
    }
    if (node === this.head) {
        this.head = next;
    }
    if (node === this.tail) {
        this.tail = prev;
    }
    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
    return next;
};
Yallist.prototype.unshiftNode = function(node) {
    if (node === this.head) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
        head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
        this.tail = node;
    }
    this.length++;
};
Yallist.prototype.pushNode = function(node) {
    if (node === this.tail) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
        tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
        this.head = node;
    }
    this.length++;
};
Yallist.prototype.push = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        push(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.unshift = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        unshift(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.pop = function() {
    if (!this.tail) {
        return undefined;
    }
    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
        this.tail.next = null;
    } else {
        this.head = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.shift = function() {
    if (!this.head) {
        return undefined;
    }
    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
        this.head.prev = null;
    } else {
        this.tail = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.forEach = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.head, i = 0; walker !== null; i++){
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
    }
};
Yallist.prototype.forEachReverse = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.tail, i = this.length - 1; walker !== null; i--){
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
    }
};
Yallist.prototype.get = function(n) {
    for(var i = 0, walker = this.head; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.next;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.getReverse = function(n) {
    for(var i = 0, walker = this.tail; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.prev;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.map = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.head; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
    }
    return res;
};
Yallist.prototype.mapReverse = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.tail; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
    }
    return res;
};
Yallist.prototype.reduce = function(fn, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
    } else {
        throw new TypeError("Reduce of empty list with no initial value");
    }
    for(var i = 0; walker !== null; i++){
        acc = fn(acc, walker.value, i);
        walker = walker.next;
    }
    return acc;
};
Yallist.prototype.reduceReverse = function(fn, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
    } else {
        throw new TypeError("Reduce of empty list with no initial value");
    }
    for(var i = this.length - 1; walker !== null; i--){
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
    }
    return acc;
};
Yallist.prototype.toArray = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.head; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.next;
    }
    return arr;
};
Yallist.prototype.toArrayReverse = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.tail; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.prev;
    }
    return arr;
};
Yallist.prototype.slice = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = 0, walker = this.head; walker !== null && i < from; i++){
        walker = walker.next;
    }
    for(; walker !== null && i < to; i++, walker = walker.next){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.sliceReverse = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = this.length, walker = this.tail; walker !== null && i > to; i--){
        walker = walker.prev;
    }
    for(; walker !== null && i > from; i--, walker = walker.prev){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
    if (start > this.length) {
        start = this.length - 1;
    }
    if (start < 0) {
        start = this.length + start;
    }
    for(var i = 0, walker = this.head; walker !== null && i < start; i++){
        walker = walker.next;
    }
    var ret = [];
    for(var i = 0; walker && i < deleteCount; i++){
        ret.push(walker.value);
        walker = this.removeNode(walker);
    }
    if (walker === null) {
        walker = this.tail;
    }
    if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
    }
    for(var i = 0; i < nodes.length; i++){
        walker = insert(this, walker, nodes[i]);
    }
    return ret;
};
Yallist.prototype.reverse = function() {
    var head = this.head;
    var tail = this.tail;
    for(var walker = head; walker !== null; walker = walker.prev){
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
};
function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
    if (inserted.next === null) {
        self.tail = inserted;
    }
    if (inserted.prev === null) {
        self.head = inserted;
    }
    self.length++;
    return inserted;
}
function push(self, item) {
    self.tail = new Node(item, self.tail, null, self);
    if (!self.head) {
        self.head = self.tail;
    }
    self.length++;
}
function unshift(self, item) {
    self.head = new Node(item, null, self.head, self);
    if (!self.tail) {
        self.tail = self.head;
    }
    self.length++;
}
function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
    }
    this.list = list;
    this.value = value;
    if (prev) {
        prev.next = this;
        this.prev = prev;
    } else {
        this.prev = null;
    }
    if (next) {
        next.prev = this;
        this.next = next;
    } else {
        this.next = null;
    }
}
try {
    // add if support for Symbol.iterator is present
    __webpack_require__(82198)(Yallist);
} catch (er) {}


/***/ }),

/***/ 30658:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Axios v1.4.0 Copyright (c) 2023 Matt Zabriskie and contributors

const FormData$1 = __webpack_require__(69614);
const url = __webpack_require__(57310);
const proxyFromEnv = __webpack_require__(77913);
const http = __webpack_require__(13685);
const https = __webpack_require__(95687);
const util = __webpack_require__(73837);
const followRedirects = __webpack_require__(2725);
const zlib = __webpack_require__(59796);
const stream = __webpack_require__(12781);
const EventEmitter = __webpack_require__(82361);
function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : {
        "default": e
    };
}
const FormData__default = /*#__PURE__*/ _interopDefaultLegacy(FormData$1);
const url__default = /*#__PURE__*/ _interopDefaultLegacy(url);
const http__default = /*#__PURE__*/ _interopDefaultLegacy(http);
const https__default = /*#__PURE__*/ _interopDefaultLegacy(https);
const util__default = /*#__PURE__*/ _interopDefaultLegacy(util);
const followRedirects__default = /*#__PURE__*/ _interopDefaultLegacy(followRedirects);
const zlib__default = /*#__PURE__*/ _interopDefaultLegacy(zlib);
const stream__default = /*#__PURE__*/ _interopDefaultLegacy(stream);
const EventEmitter__default = /*#__PURE__*/ _interopDefaultLegacy(EventEmitter);
function bind(fn, thisArg) {
    return function wrap() {
        return fn.apply(thisArg, arguments);
    };
}
// utils is a library of generic helper functions non-specific to axios
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = ((cache)=>(thing)=>{
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));
const kindOfTest = (type)=>{
    type = type.toLowerCase();
    return (thing)=>kindOf(thing) === type;
};
const typeOfTest = (type)=>(thing)=>typeof thing === type;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */ const { isArray } = Array;
/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */ const isUndefined = typeOfTest("undefined");
/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */ function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */ const isArrayBuffer = kindOfTest("ArrayBuffer");
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */ function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
    } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
}
/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */ const isString = typeOfTest("string");
/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */ const isFunction = typeOfTest("function");
/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */ const isNumber = typeOfTest("number");
/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */ const isObject = (thing)=>thing !== null && typeof thing === "object";
/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */ const isBoolean = (thing)=>thing === true || thing === false;
/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */ const isPlainObject = (val)=>{
    if (kindOf(val) !== "object") {
        return false;
    }
    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */ const isDate = kindOfTest("Date");
/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFile = kindOfTest("File");
/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */ const isBlob = kindOfTest("Blob");
/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFileList = kindOfTest("FileList");
/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */ const isStream = (val)=>isObject(val) && isFunction(val.pipe);
/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */ const isFormData = (thing)=>{
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */ const isURLSearchParams = kindOfTest("URLSearchParams");
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */ const trim = (str)=>str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */ function forEach(obj, fn, { allOwnKeys = false } = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === "undefined") {
        return;
    }
    let i;
    let l;
    // Force an array if not already something iterable
    if (typeof obj !== "object") {
        /*eslint no-param-reassign:0*/ obj = [
            obj
        ];
    }
    if (isArray(obj)) {
        // Iterate over array values
        for(i = 0, l = obj.length; i < l; i++){
            fn.call(null, obj[i], i, obj);
        }
    } else {
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for(i = 0; i < len; i++){
            key = keys[i];
            fn.call(null, obj[key], key, obj);
        }
    }
}
function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while(i-- > 0){
        _key = keys[i];
        if (key === _key.toLowerCase()) {
            return _key;
        }
    }
    return null;
}
const _global = (()=>{
    /*eslint no-undef:0*/ if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self :  false ? 0 : global;
})();
const isContextDefined = (context)=>!isUndefined(context) && context !== _global;
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */ function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key)=>{
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
            result[targetKey] = merge(result[targetKey], val);
        } else if (isPlainObject(val)) {
            result[targetKey] = merge({}, val);
        } else if (isArray(val)) {
            result[targetKey] = val.slice();
        } else {
            result[targetKey] = val;
        }
    };
    for(let i = 0, l = arguments.length; i < l; i++){
        arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */ const extend = (a, b, thisArg, { allOwnKeys } = {})=>{
    forEach(b, (val, key)=>{
        if (thisArg && isFunction(val)) {
            a[key] = bind(val, thisArg);
        } else {
            a[key] = val;
        }
    }, {
        allOwnKeys
    });
    return a;
};
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */ const stripBOM = (content)=>{
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
};
/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */ const inherits = (constructor, superConstructor, props, descriptors)=>{
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
        value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
};
/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */ const toFlatObject = (sourceObj, destObj, filter, propFilter)=>{
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;
    do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while(i-- > 0){
            prop = props[i];
            if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
                destObj[prop] = sourceObj[prop];
                merged[prop] = true;
            }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
    }while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
};
/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */ const endsWith = (str, searchString, position)=>{
    str = String(str);
    if (position === undefined || position > str.length) {
        position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};
/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */ const toArray = (thing)=>{
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while(i-- > 0){
        arr[i] = thing[i];
    }
    return arr;
};
/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */ // eslint-disable-next-line func-names
const isTypedArray = ((TypedArray)=>{
    // eslint-disable-next-line func-names
    return (thing)=>{
        return TypedArray && thing instanceof TypedArray;
    };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */ const forEachEntry = (obj, fn)=>{
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while((result = iterator.next()) && !result.done){
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
    }
};
/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */ const matchAll = (regExp, str)=>{
    let matches;
    const arr = [];
    while((matches = regExp.exec(str)) !== null){
        arr.push(matches);
    }
    return arr;
};
/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */ const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str)=>{
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
    });
};
/* Creating a function that will check if an object has a property. */ const hasOwnProperty = (({ hasOwnProperty })=>(obj, prop)=>hasOwnProperty.call(obj, prop))(Object.prototype);
/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */ const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer)=>{
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors, (descriptor, name)=>{
        if (reducer(descriptor, name, obj) !== false) {
            reducedDescriptors[name] = descriptor;
        }
    });
    Object.defineProperties(obj, reducedDescriptors);
};
/**
 * Makes all methods read-only
 * @param {Object} obj
 */ const freezeMethods = (obj)=>{
    reduceDescriptors(obj, (descriptor, name)=>{
        // skip restricted props in strict mode
        if (isFunction(obj) && [
            "arguments",
            "caller",
            "callee"
        ].indexOf(name) !== -1) {
            return false;
        }
        const value = obj[name];
        if (!isFunction(value)) return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
            descriptor.writable = false;
            return;
        }
        if (!descriptor.set) {
            descriptor.set = ()=>{
                throw Error("Can not rewrite read-only method '" + name + "'");
            };
        }
    });
};
const toObjectSet = (arrayOrString, delimiter)=>{
    const obj = {};
    const define = (arr)=>{
        arr.forEach((value)=>{
            obj[value] = true;
        });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
};
const noop = ()=>{};
const toFiniteNumber = (value, defaultValue)=>{
    value = +value;
    return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT)=>{
    let str = "";
    const { length } = alphabet;
    while(size--){
        str += alphabet[Math.random() * length | 0];
    }
    return str;
};
/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */ function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj)=>{
    const stack = new Array(10);
    const visit = (source, i)=>{
        if (isObject(source)) {
            if (stack.indexOf(source) >= 0) {
                return;
            }
            if (!("toJSON" in source)) {
                stack[i] = source;
                const target = isArray(source) ? [] : {};
                forEach(source, (value, key)=>{
                    const reducedValue = visit(value, i + 1);
                    !isUndefined(reducedValue) && (target[key] = reducedValue);
                });
                stack[i] = undefined;
                return target;
            }
        }
        return source;
    };
    return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing)=>thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
const utils = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable
};
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */ function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: utils.toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
        };
    }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
].forEach((code)=>{
    descriptors[code] = {
        value: code
    };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", {
    value: true
});
// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps)=>{
    const axiosError = Object.create(prototype$1);
    utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
    }, (prop)=>{
        return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
};
/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */ function isVisitable(thing) {
    return utils.isPlainObject(thing) || utils.isArray(thing);
}
/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */ function removeBrackets(key) {
    return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */ function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
}
/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */ function isFlatArray(arr) {
    return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
});
/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/ /**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */ function toFormData(obj, formData, options) {
    if (!utils.isObject(obj)) {
        throw new TypeError("target must be an object");
    }
    // eslint-disable-next-line no-param-reassign
    formData = formData || new (FormData__default["default"] || FormData)();
    // eslint-disable-next-line no-param-reassign
    options = utils.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
    }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !utils.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils.isSpecCompliantForm(formData);
    if (!utils.isFunction(visitor)) {
        throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
        if (value === null) return "";
        if (utils.isDate(value)) {
            return value.toISOString();
        }
        if (!useBlob && utils.isBlob(value)) {
            throw new AxiosError("Blob is not supported. Use a Buffer instead.");
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
            return useBlob && typeof Blob === "function" ? new Blob([
                value
            ]) : Buffer.from(value);
        }
        return value;
    }
    /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */ function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === "object") {
            if (utils.endsWith(key, "{}")) {
                // eslint-disable-next-line no-param-reassign
                key = metaTokens ? key : key.slice(0, -2);
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
            } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]")) && (arr = utils.toArray(value))) {
                // eslint-disable-next-line no-param-reassign
                key = removeBrackets(key);
                arr.forEach(function each(el, index) {
                    !(utils.isUndefined(el) || el === null) && formData.append(// eslint-disable-next-line no-nested-ternary
                    indexes === true ? renderKey([
                        key
                    ], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
                });
                return false;
            }
        }
        if (isVisitable(value)) {
            return true;
        }
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
    });
    function build(value, path) {
        if (utils.isUndefined(value)) return;
        if (stack.indexOf(value) !== -1) {
            throw Error("Circular reference detected in " + path.join("."));
        }
        stack.push(value);
        utils.forEach(value, function each(el, key) {
            const result = !(utils.isUndefined(el) || el === null) && visitor.call(formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers);
            if (result === true) {
                build(el, path ? path.concat(key) : [
                    key
                ]);
            }
        });
        stack.pop();
    }
    if (!utils.isObject(obj)) {
        throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
}
/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */ function encode$1(str) {
    const charMap = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\x00"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
    });
}
/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */ function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
    this._pairs.push([
        name,
        value
    ]);
};
prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
};
/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */ function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */ function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/ if (!params) {
        return url;
    }
    const _encode = options && options.encode || encode;
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
        serializedParams = serializeFn(params, options);
    } else {
        serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}
class InterceptorManager {
    constructor(){
        this.handlers = [];
    }
    /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */ use(fulfilled, rejected, options) {
        this.handlers.push({
            fulfilled,
            rejected,
            synchronous: options ? options.synchronous : false,
            runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
    }
    /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */ eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
    /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */ clear() {
        if (this.handlers) {
            this.handlers = [];
        }
    }
    /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */ forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    }
}
const InterceptorManager$1 = InterceptorManager;
const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
};
const URLSearchParams = url__default["default"].URLSearchParams;
const platform = {
    isNode: true,
    classes: {
        URLSearchParams,
        FormData: FormData__default["default"],
        Blob: typeof Blob !== "undefined" && Blob || null
    },
    protocols: [
        "http",
        "https",
        "file",
        "data"
    ]
};
function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
            if (utils.isBuffer(value)) {
                this.append(key, value.toString("base64"));
                return false;
            }
            return helpers.defaultVisitor.apply(this, arguments);
        }
    }, options));
}
/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */ function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match)=>{
        return match[0] === "[]" ? "" : match[1] || match[0];
    });
}
/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */ function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for(i = 0; i < len; i++){
        key = keys[i];
        obj[key] = arr[key];
    }
    return obj;
}
/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */ function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils.isArray(target) ? target.length : name;
        if (isLast) {
            if (utils.hasOwnProp(target, name)) {
                target[name] = [
                    target[name],
                    value
                ];
            } else {
                target[name] = value;
            }
            return !isNumericKey;
        }
        if (!target[name] || !utils.isObject(target[name])) {
            target[name] = [];
        }
        const result = buildPath(path, value, target[name], index);
        if (result && utils.isArray(target[name])) {
            target[name] = arrayToObject(target[name]);
        }
        return !isNumericKey;
    }
    if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
        const obj = {};
        utils.forEachEntry(formData, (name, value)=>{
            buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
    }
    return null;
}
const DEFAULT_CONTENT_TYPE = {
    "Content-Type": undefined
};
/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */ function stringifySafely(rawValue, parser, encoder) {
    if (utils.isString(rawValue)) {
        try {
            (parser || JSON.parse)(rawValue);
            return utils.trim(rawValue);
        } catch (e) {
            if (e.name !== "SyntaxError") {
                throw e;
            }
        }
    }
    return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
    transitional: transitionalDefaults,
    adapter: [
        "xhr",
        "http"
    ],
    transformRequest: [
        function transformRequest(data, headers) {
            const contentType = headers.getContentType() || "";
            const hasJSONContentType = contentType.indexOf("application/json") > -1;
            const isObjectPayload = utils.isObject(data);
            if (isObjectPayload && utils.isHTMLForm(data)) {
                data = new FormData(data);
            }
            const isFormData = utils.isFormData(data);
            if (isFormData) {
                if (!hasJSONContentType) {
                    return data;
                }
                return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
            }
            if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
                return data;
            }
            if (utils.isArrayBufferView(data)) {
                return data.buffer;
            }
            if (utils.isURLSearchParams(data)) {
                headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
                return data.toString();
            }
            let isFileList;
            if (isObjectPayload) {
                if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
                    return toURLEncodedForm(data, this.formSerializer).toString();
                }
                if ((isFileList = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
                    const _FormData = this.env && this.env.FormData;
                    return toFormData(isFileList ? {
                        "files[]": data
                    } : data, _FormData && new _FormData(), this.formSerializer);
                }
            }
            if (isObjectPayload || hasJSONContentType) {
                headers.setContentType("application/json", false);
                return stringifySafely(data);
            }
            return data;
        }
    ],
    transformResponse: [
        function transformResponse(data) {
            const transitional = this.transitional || defaults.transitional;
            const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
            const JSONRequested = this.responseType === "json";
            if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
                const silentJSONParsing = transitional && transitional.silentJSONParsing;
                const strictJSONParsing = !silentJSONParsing && JSONRequested;
                try {
                    return JSON.parse(data);
                } catch (e) {
                    if (strictJSONParsing) {
                        if (e.name === "SyntaxError") {
                            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
                        }
                        throw e;
                    }
                }
            }
            return data;
        }
    ],
    /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */ timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    headers: {
        common: {
            "Accept": "application/json, text/plain, */*"
        }
    }
};
utils.forEach([
    "delete",
    "get",
    "head"
], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
});
utils.forEach([
    "post",
    "put",
    "patch"
], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
const defaults$1 = defaults;
// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
]);
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */ const parseHeaders = (rawHeaders)=>{
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) {
            return;
        }
        if (key === "set-cookie") {
            if (parsed[key]) {
                parsed[key].push(val);
            } else {
                parsed[key] = [
                    val
                ];
            }
        } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
    });
    return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
    if (value === false || value == null) {
        return value;
    }
    return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while(match = tokensRE.exec(str)){
        tokens[match[1]] = match[2];
    }
    return tokens;
}
const isValidHeaderName = (str)=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils.isFunction(filter)) {
        return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
        value = header;
    }
    if (!utils.isString(value)) return;
    if (utils.isString(filter)) {
        return value.indexOf(filter) !== -1;
    }
    if (utils.isRegExp(filter)) {
        return filter.test(value);
    }
}
function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str)=>{
        return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
    const accessorName = utils.toCamelCase(" " + header);
    [
        "get",
        "set",
        "has"
    ].forEach((methodName)=>{
        Object.defineProperty(obj, methodName + accessorName, {
            value: function(arg1, arg2, arg3) {
                return this[methodName].call(this, header, arg1, arg2, arg3);
            },
            configurable: true
        });
    });
}
class AxiosHeaders {
    constructor(headers){
        headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
        const self1 = this;
        function setHeader(_value, _header, _rewrite) {
            const lHeader = normalizeHeader(_header);
            if (!lHeader) {
                throw new Error("header name must be a non-empty string");
            }
            const key = utils.findKey(self1, lHeader);
            if (!key || self1[key] === undefined || _rewrite === true || _rewrite === undefined && self1[key] !== false) {
                self1[key || _header] = normalizeValue(_value);
            }
        }
        const setHeaders = (headers, _rewrite)=>utils.forEach(headers, (_value, _header)=>setHeader(_value, _header, _rewrite));
        if (utils.isPlainObject(header) || header instanceof this.constructor) {
            setHeaders(header, valueOrRewrite);
        } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
            setHeaders(parseHeaders(header), valueOrRewrite);
        } else {
            header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
    }
    get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
            const key = utils.findKey(this, header);
            if (key) {
                const value = this[key];
                if (!parser) {
                    return value;
                }
                if (parser === true) {
                    return parseTokens(value);
                }
                if (utils.isFunction(parser)) {
                    return parser.call(this, value, key);
                }
                if (utils.isRegExp(parser)) {
                    return parser.exec(value);
                }
                throw new TypeError("parser must be boolean|regexp|function");
            }
        }
    }
    has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
            const key = utils.findKey(this, header);
            return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
    }
    delete(header, matcher) {
        const self1 = this;
        let deleted = false;
        function deleteHeader(_header) {
            _header = normalizeHeader(_header);
            if (_header) {
                const key = utils.findKey(self1, _header);
                if (key && (!matcher || matchHeaderValue(self1, self1[key], key, matcher))) {
                    delete self1[key];
                    deleted = true;
                }
            }
        }
        if (utils.isArray(header)) {
            header.forEach(deleteHeader);
        } else {
            deleteHeader(header);
        }
        return deleted;
    }
    clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while(i--){
            const key = keys[i];
            if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
                delete this[key];
                deleted = true;
            }
        }
        return deleted;
    }
    normalize(format) {
        const self1 = this;
        const headers = {};
        utils.forEach(this, (value, header)=>{
            const key = utils.findKey(headers, header);
            if (key) {
                self1[key] = normalizeValue(value);
                delete self1[header];
                return;
            }
            const normalized = format ? formatHeader(header) : String(header).trim();
            if (normalized !== header) {
                delete self1[header];
            }
            self1[normalized] = normalizeValue(value);
            headers[normalized] = true;
        });
        return this;
    }
    concat(...targets) {
        return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
        const obj = Object.create(null);
        utils.forEach(this, (value, header)=>{
            value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
        });
        return obj;
    }
    [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
        return Object.entries(this.toJSON()).map(([header, value])=>header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
        return "AxiosHeaders";
    }
    static from(thing) {
        return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target)=>computed.set(target));
        return computed;
    }
    static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
            accessors: {}
        };
        const accessors = internals.accessors;
        const prototype = this.prototype;
        function defineAccessor(_header) {
            const lHeader = normalizeHeader(_header);
            if (!accessors[lHeader]) {
                buildAccessors(prototype, _header);
                accessors[lHeader] = true;
            }
        }
        utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
    }
}
AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
]);
utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);
const AxiosHeaders$1 = AxiosHeaders;
/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */ function transformData(fns, response) {
    const config = this || defaults$1;
    const context = response || config;
    const headers = AxiosHeaders$1.from(context.headers);
    let data = context.data;
    utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });
    headers.normalize();
    return data;
}
function isCancel(value) {
    return !!(value && value.__CANCEL__);
}
/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */ function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
    this.name = "CanceledError";
}
utils.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
});
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */ function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
    } else {
        reject(new AxiosError("Request failed with status code " + response.status, [
            AxiosError.ERR_BAD_REQUEST,
            AxiosError.ERR_BAD_RESPONSE
        ][Math.floor(response.status / 100) - 4], response.config, response.request, response));
    }
}
/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */ function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */ function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */ function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
}
const VERSION = "1.4.0";
function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
}
const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */ function fromDataURI(uri, asBlob, options) {
    const _Blob = options && options.Blob || platform.classes.Blob;
    const protocol = parseProtocol(uri);
    if (asBlob === undefined && _Blob) {
        asBlob = true;
    }
    if (protocol === "data") {
        uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
        const match = DATA_URL_PATTERN.exec(uri);
        if (!match) {
            throw new AxiosError("Invalid URL", AxiosError.ERR_INVALID_URL);
        }
        const mime = match[1];
        const isBase64 = match[2];
        const body = match[3];
        const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
        if (asBlob) {
            if (!_Blob) {
                throw new AxiosError("Blob is not supported", AxiosError.ERR_NOT_SUPPORT);
            }
            return new _Blob([
                buffer
            ], {
                type: mime
            });
        }
        return buffer;
    }
    throw new AxiosError("Unsupported protocol " + protocol, AxiosError.ERR_NOT_SUPPORT);
}
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */ function throttle(fn, freq) {
    let timestamp = 0;
    const threshold = 1000 / freq;
    let timer = null;
    return function throttled(force, args) {
        const now = Date.now();
        if (force || now - timestamp > threshold) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timestamp = now;
            return fn.apply(null, args);
        }
        if (!timer) {
            timer = setTimeout(()=>{
                timer = null;
                timestamp = Date.now();
                return fn.apply(null, args);
            }, threshold - (now - timestamp));
        }
    };
}
/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */ function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== undefined ? min : 1000;
    return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) {
            firstSampleTS = now;
        }
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while(i !== head){
            bytesCount += bytes[i++];
            i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) {
            tail = (tail + 1) % samplesCount;
        }
        if (now - firstSampleTS < min) {
            return;
        }
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
}
const kInternals = Symbol("internals");
class AxiosTransformStream extends stream__default["default"].Transform {
    constructor(options){
        options = utils.toFlatObject(options, {
            maxRate: 0,
            chunkSize: 64 * 1024,
            minChunkSize: 100,
            timeWindow: 500,
            ticksRate: 2,
            samplesCount: 15
        }, null, (prop, source)=>{
            return !utils.isUndefined(source[prop]);
        });
        super({
            readableHighWaterMark: options.chunkSize
        });
        const self1 = this;
        const internals = this[kInternals] = {
            length: options.length,
            timeWindow: options.timeWindow,
            ticksRate: options.ticksRate,
            chunkSize: options.chunkSize,
            maxRate: options.maxRate,
            minChunkSize: options.minChunkSize,
            bytesSeen: 0,
            isCaptured: false,
            notifiedBytesLoaded: 0,
            ts: Date.now(),
            bytes: 0,
            onReadCallback: null
        };
        const _speedometer = speedometer(internals.ticksRate * options.samplesCount, internals.timeWindow);
        this.on("newListener", (event)=>{
            if (event === "progress") {
                if (!internals.isCaptured) {
                    internals.isCaptured = true;
                }
            }
        });
        let bytesNotified = 0;
        internals.updateProgress = throttle(function throttledHandler() {
            const totalBytes = internals.length;
            const bytesTransferred = internals.bytesSeen;
            const progressBytes = bytesTransferred - bytesNotified;
            if (!progressBytes || self1.destroyed) return;
            const rate = _speedometer(progressBytes);
            bytesNotified = bytesTransferred;
            process.nextTick(()=>{
                self1.emit("progress", {
                    "loaded": bytesTransferred,
                    "total": totalBytes,
                    "progress": totalBytes ? bytesTransferred / totalBytes : undefined,
                    "bytes": progressBytes,
                    "rate": rate ? rate : undefined,
                    "estimated": rate && totalBytes && bytesTransferred <= totalBytes ? (totalBytes - bytesTransferred) / rate : undefined
                });
            });
        }, internals.ticksRate);
        const onFinish = ()=>{
            internals.updateProgress(true);
        };
        this.once("end", onFinish);
        this.once("error", onFinish);
    }
    _read(size) {
        const internals = this[kInternals];
        if (internals.onReadCallback) {
            internals.onReadCallback();
        }
        return super._read(size);
    }
    _transform(chunk, encoding, callback) {
        const self1 = this;
        const internals = this[kInternals];
        const maxRate = internals.maxRate;
        const readableHighWaterMark = this.readableHighWaterMark;
        const timeWindow = internals.timeWindow;
        const divider = 1000 / timeWindow;
        const bytesThreshold = maxRate / divider;
        const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
        function pushChunk(_chunk, _callback) {
            const bytes = Buffer.byteLength(_chunk);
            internals.bytesSeen += bytes;
            internals.bytes += bytes;
            if (internals.isCaptured) {
                internals.updateProgress();
            }
            if (self1.push(_chunk)) {
                process.nextTick(_callback);
            } else {
                internals.onReadCallback = ()=>{
                    internals.onReadCallback = null;
                    process.nextTick(_callback);
                };
            }
        }
        const transformChunk = (_chunk, _callback)=>{
            const chunkSize = Buffer.byteLength(_chunk);
            let chunkRemainder = null;
            let maxChunkSize = readableHighWaterMark;
            let bytesLeft;
            let passed = 0;
            if (maxRate) {
                const now = Date.now();
                if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
                    internals.ts = now;
                    bytesLeft = bytesThreshold - internals.bytes;
                    internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
                    passed = 0;
                }
                bytesLeft = bytesThreshold - internals.bytes;
            }
            if (maxRate) {
                if (bytesLeft <= 0) {
                    // next time window
                    return setTimeout(()=>{
                        _callback(null, _chunk);
                    }, timeWindow - passed);
                }
                if (bytesLeft < maxChunkSize) {
                    maxChunkSize = bytesLeft;
                }
            }
            if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
                chunkRemainder = _chunk.subarray(maxChunkSize);
                _chunk = _chunk.subarray(0, maxChunkSize);
            }
            pushChunk(_chunk, chunkRemainder ? ()=>{
                process.nextTick(_callback, null, chunkRemainder);
            } : _callback);
        };
        transformChunk(chunk, function transformNextChunk(err, _chunk) {
            if (err) {
                return callback(err);
            }
            if (_chunk) {
                transformChunk(_chunk, transformNextChunk);
            } else {
                callback(null);
            }
        });
    }
    setLength(length) {
        this[kInternals].length = +length;
        return this;
    }
}
const AxiosTransformStream$1 = AxiosTransformStream;
const { asyncIterator } = Symbol;
const readBlob = async function*(blob) {
    if (blob.stream) {
        yield* blob.stream();
    } else if (blob.arrayBuffer) {
        yield await blob.arrayBuffer();
    } else if (blob[asyncIterator]) {
        yield* blob[asyncIterator]();
    } else {
        yield blob;
    }
};
const readBlob$1 = readBlob;
const BOUNDARY_ALPHABET = utils.ALPHABET.ALPHA_DIGIT + "-_";
const textEncoder = new util.TextEncoder();
const CRLF = "\r\n";
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;
class FormDataPart {
    constructor(name, value){
        const { escapeName } = this.constructor;
        const isStringValue = utils.isString(value);
        let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
        if (isStringValue) {
            value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
        } else {
            headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
        }
        this.headers = textEncoder.encode(headers + CRLF);
        this.contentLength = isStringValue ? value.byteLength : value.size;
        this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
        this.name = name;
        this.value = value;
    }
    async *encode() {
        yield this.headers;
        const { value } = this;
        if (utils.isTypedArray(value)) {
            yield value;
        } else {
            yield* readBlob$1(value);
        }
        yield CRLF_BYTES;
    }
    static escapeName(name) {
        return String(name).replace(/[\r\n"]/g, (match)=>({
                "\r": "%0D",
                "\n": "%0A",
                '"': "%22"
            })[match]);
    }
}
const formDataToStream = (form, headersHandler, options)=>{
    const { tag = "form-data-boundary", size = 25, boundary = tag + "-" + utils.generateString(size, BOUNDARY_ALPHABET) } = options || {};
    if (!utils.isFormData(form)) {
        throw TypeError("FormData instance required");
    }
    if (boundary.length < 1 || boundary.length > 70) {
        throw Error("boundary must be 10-70 characters long");
    }
    const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
    const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF + CRLF);
    let contentLength = footerBytes.byteLength;
    const parts = Array.from(form.entries()).map(([name, value])=>{
        const part = new FormDataPart(name, value);
        contentLength += part.size;
        return part;
    });
    contentLength += boundaryBytes.byteLength * parts.length;
    contentLength = utils.toFiniteNumber(contentLength);
    const computedHeaders = {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
    };
    if (Number.isFinite(contentLength)) {
        computedHeaders["Content-Length"] = contentLength;
    }
    headersHandler && headersHandler(computedHeaders);
    return stream.Readable.from(async function*() {
        for (const part of parts){
            yield boundaryBytes;
            yield* part.encode();
        }
        yield footerBytes;
    }());
};
const formDataToStream$1 = formDataToStream;
class ZlibHeaderTransformStream extends stream__default["default"].Transform {
    __transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
    }
    _transform(chunk, encoding, callback) {
        if (chunk.length !== 0) {
            this._transform = this.__transform;
            // Add Default Compression headers if no zlib headers are present
            if (chunk[0] !== 120) {
                const header = Buffer.alloc(2);
                header[0] = 120; // Hex: 78
                header[1] = 156; // Hex: 9C 
                this.push(header, encoding);
            }
        }
        this.__transform(chunk, encoding, callback);
    }
}
const ZlibHeaderTransformStream$1 = ZlibHeaderTransformStream;
const callbackify = (fn, reducer)=>{
    return utils.isAsyncFn(fn) ? function(...args) {
        const cb = args.pop();
        fn.apply(this, args).then((value)=>{
            try {
                reducer ? cb(null, ...reducer(value)) : cb(null, value);
            } catch (err) {
                cb(err);
            }
        }, cb);
    } : fn;
};
const callbackify$1 = callbackify;
const zlibOptions = {
    flush: zlib__default["default"].constants.Z_SYNC_FLUSH,
    finishFlush: zlib__default["default"].constants.Z_SYNC_FLUSH
};
const brotliOptions = {
    flush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH,
    finishFlush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH
};
const isBrotliSupported = utils.isFunction(zlib__default["default"].createBrotliDecompress);
const { http: httpFollow, https: httpsFollow } = followRedirects__default["default"];
const isHttps = /https:?/;
const supportedProtocols = platform.protocols.map((protocol)=>{
    return protocol + ":";
});
/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */ function dispatchBeforeRedirect(options) {
    if (options.beforeRedirects.proxy) {
        options.beforeRedirects.proxy(options);
    }
    if (options.beforeRedirects.config) {
        options.beforeRedirects.config(options);
    }
}
/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */ function setProxy(options, configProxy, location) {
    let proxy = configProxy;
    if (!proxy && proxy !== false) {
        const proxyUrl = proxyFromEnv.getProxyForUrl(location);
        if (proxyUrl) {
            proxy = new URL(proxyUrl);
        }
    }
    if (proxy) {
        // Basic proxy authorization
        if (proxy.username) {
            proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
        }
        if (proxy.auth) {
            // Support proxy auth object form
            if (proxy.auth.username || proxy.auth.password) {
                proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
            }
            const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
            options.headers["Proxy-Authorization"] = "Basic " + base64;
        }
        options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
        const proxyHost = proxy.hostname || proxy.host;
        options.hostname = proxyHost;
        // Replace 'host' since options is not a URL object
        options.host = proxyHost;
        options.port = proxy.port;
        options.path = location;
        if (proxy.protocol) {
            options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
        }
    }
    options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
        // Configure proxy for redirected request, passing the original config proxy to apply
        // the exact same logic as if the redirected request was performed by axios directly.
        setProxy(redirectOptions, configProxy, redirectOptions.href);
    };
}
const isHttpAdapterSupported = typeof process !== "undefined" && utils.kindOf(process) === "process";
// temporary hotfix
const wrapAsync = (asyncExecutor)=>{
    return new Promise((resolve, reject)=>{
        let onDone;
        let isDone;
        const done = (value, isRejected)=>{
            if (isDone) return;
            isDone = true;
            onDone && onDone(value, isRejected);
        };
        const _resolve = (value)=>{
            done(value);
            resolve(value);
        };
        const _reject = (reason)=>{
            done(reason, true);
            reject(reason);
        };
        asyncExecutor(_resolve, _reject, (onDoneHandler)=>onDone = onDoneHandler).catch(_reject);
    });
};
/*eslint consistent-return:0*/ const httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
    return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
        let { data, lookup, family } = config;
        const { responseType, responseEncoding } = config;
        const method = config.method.toUpperCase();
        let isDone;
        let rejected = false;
        let req;
        if (lookup && utils.isAsyncFn(lookup)) {
            lookup = callbackify$1(lookup, (entry)=>{
                if (utils.isString(entry)) {
                    entry = [
                        entry,
                        entry.indexOf(".") < 0 ? 6 : 4
                    ];
                } else if (!utils.isArray(entry)) {
                    throw new TypeError("lookup async function must return an array [ip: string, family: number]]");
                }
                return entry;
            });
        }
        // temporary internal emitter until the AxiosRequest class will be implemented
        const emitter = new EventEmitter__default["default"]();
        const onFinished = ()=>{
            if (config.cancelToken) {
                config.cancelToken.unsubscribe(abort);
            }
            if (config.signal) {
                config.signal.removeEventListener("abort", abort);
            }
            emitter.removeAllListeners();
        };
        onDone((value, isRejected)=>{
            isDone = true;
            if (isRejected) {
                rejected = true;
                onFinished();
            }
        });
        function abort(reason) {
            emitter.emit("abort", !reason || reason.type ? new CanceledError(null, config, req) : reason);
        }
        emitter.once("abort", reject);
        if (config.cancelToken || config.signal) {
            config.cancelToken && config.cancelToken.subscribe(abort);
            if (config.signal) {
                config.signal.aborted ? abort() : config.signal.addEventListener("abort", abort);
            }
        }
        // Parse url
        const fullPath = buildFullPath(config.baseURL, config.url);
        const parsed = new URL(fullPath, "http://localhost");
        const protocol = parsed.protocol || supportedProtocols[0];
        if (protocol === "data:") {
            let convertedData;
            if (method !== "GET") {
                return settle(resolve, reject, {
                    status: 405,
                    statusText: "method not allowed",
                    headers: {},
                    config
                });
            }
            try {
                convertedData = fromDataURI(config.url, responseType === "blob", {
                    Blob: config.env && config.env.Blob
                });
            } catch (err) {
                throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
            }
            if (responseType === "text") {
                convertedData = convertedData.toString(responseEncoding);
                if (!responseEncoding || responseEncoding === "utf8") {
                    convertedData = utils.stripBOM(convertedData);
                }
            } else if (responseType === "stream") {
                convertedData = stream__default["default"].Readable.from(convertedData);
            }
            return settle(resolve, reject, {
                data: convertedData,
                status: 200,
                statusText: "OK",
                headers: new AxiosHeaders$1(),
                config
            });
        }
        if (supportedProtocols.indexOf(protocol) === -1) {
            return reject(new AxiosError("Unsupported protocol " + protocol, AxiosError.ERR_BAD_REQUEST, config));
        }
        const headers = AxiosHeaders$1.from(config.headers).normalize();
        // Set User-Agent (required by some servers)
        // See https://github.com/axios/axios/issues/69
        // User-Agent is specified; handle case where no UA header is desired
        // Only set header if it hasn't been set in config
        headers.set("User-Agent", "axios/" + VERSION, false);
        const onDownloadProgress = config.onDownloadProgress;
        const onUploadProgress = config.onUploadProgress;
        const maxRate = config.maxRate;
        let maxUploadRate = undefined;
        let maxDownloadRate = undefined;
        // support for spec compliant FormData objects
        if (utils.isSpecCompliantForm(data)) {
            const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
            data = formDataToStream$1(data, (formHeaders)=>{
                headers.set(formHeaders);
            }, {
                tag: `axios-${VERSION}-boundary`,
                boundary: userBoundary && userBoundary[1] || undefined
            });
        // support for https://www.npmjs.com/package/form-data api
        } else if (utils.isFormData(data) && utils.isFunction(data.getHeaders)) {
            headers.set(data.getHeaders());
            if (!headers.hasContentLength()) {
                try {
                    const knownLength = await util__default["default"].promisify(data.getLength).call(data);
                    Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
                /*eslint no-empty:0*/ } catch (e) {}
            }
        } else if (utils.isBlob(data)) {
            data.size && headers.setContentType(data.type || "application/octet-stream");
            headers.setContentLength(data.size || 0);
            data = stream__default["default"].Readable.from(readBlob$1(data));
        } else if (data && !utils.isStream(data)) {
            if (Buffer.isBuffer(data)) ;
            else if (utils.isArrayBuffer(data)) {
                data = Buffer.from(new Uint8Array(data));
            } else if (utils.isString(data)) {
                data = Buffer.from(data, "utf-8");
            } else {
                return reject(new AxiosError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", AxiosError.ERR_BAD_REQUEST, config));
            }
            // Add Content-Length header if data exists
            headers.setContentLength(data.length, false);
            if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
                return reject(new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config));
            }
        }
        const contentLength = utils.toFiniteNumber(headers.getContentLength());
        if (utils.isArray(maxRate)) {
            maxUploadRate = maxRate[0];
            maxDownloadRate = maxRate[1];
        } else {
            maxUploadRate = maxDownloadRate = maxRate;
        }
        if (data && (onUploadProgress || maxUploadRate)) {
            if (!utils.isStream(data)) {
                data = stream__default["default"].Readable.from(data, {
                    objectMode: false
                });
            }
            data = stream__default["default"].pipeline([
                data,
                new AxiosTransformStream$1({
                    length: contentLength,
                    maxRate: utils.toFiniteNumber(maxUploadRate)
                })
            ], utils.noop);
            onUploadProgress && data.on("progress", (progress)=>{
                onUploadProgress(Object.assign(progress, {
                    upload: true
                }));
            });
        }
        // HTTP basic authentication
        let auth = undefined;
        if (config.auth) {
            const username = config.auth.username || "";
            const password = config.auth.password || "";
            auth = username + ":" + password;
        }
        if (!auth && parsed.username) {
            const urlUsername = parsed.username;
            const urlPassword = parsed.password;
            auth = urlUsername + ":" + urlPassword;
        }
        auth && headers.delete("authorization");
        let path;
        try {
            path = buildURL(parsed.pathname + parsed.search, config.params, config.paramsSerializer).replace(/^\?/, "");
        } catch (err) {
            const customErr = new Error(err.message);
            customErr.config = config;
            customErr.url = config.url;
            customErr.exists = true;
            return reject(customErr);
        }
        headers.set("Accept-Encoding", "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""), false);
        const options = {
            path,
            method: method,
            headers: headers.toJSON(),
            agents: {
                http: config.httpAgent,
                https: config.httpsAgent
            },
            auth,
            protocol,
            family,
            lookup,
            beforeRedirect: dispatchBeforeRedirect,
            beforeRedirects: {}
        };
        if (config.socketPath) {
            options.socketPath = config.socketPath;
        } else {
            options.hostname = parsed.hostname;
            options.port = parsed.port;
            setProxy(options, config.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
        }
        let transport;
        const isHttpsRequest = isHttps.test(options.protocol);
        options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        if (config.transport) {
            transport = config.transport;
        } else if (config.maxRedirects === 0) {
            transport = isHttpsRequest ? https__default["default"] : http__default["default"];
        } else {
            if (config.maxRedirects) {
                options.maxRedirects = config.maxRedirects;
            }
            if (config.beforeRedirect) {
                options.beforeRedirects.config = config.beforeRedirect;
            }
            transport = isHttpsRequest ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
            options.maxBodyLength = config.maxBodyLength;
        } else {
            // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
            options.maxBodyLength = Infinity;
        }
        if (config.insecureHTTPParser) {
            options.insecureHTTPParser = config.insecureHTTPParser;
        }
        // Create the request
        req = transport.request(options, function handleResponse(res) {
            if (req.destroyed) return;
            const streams = [
                res
            ];
            const responseLength = +res.headers["content-length"];
            if (onDownloadProgress) {
                const transformStream = new AxiosTransformStream$1({
                    length: utils.toFiniteNumber(responseLength),
                    maxRate: utils.toFiniteNumber(maxDownloadRate)
                });
                onDownloadProgress && transformStream.on("progress", (progress)=>{
                    onDownloadProgress(Object.assign(progress, {
                        download: true
                    }));
                });
                streams.push(transformStream);
            }
            // decompress the response body transparently if required
            let responseStream = res;
            // return the last request in case of redirects
            const lastRequest = res.req || req;
            // if decompress disabled we should not decompress
            if (config.decompress !== false && res.headers["content-encoding"]) {
                // if no content, but headers still say that it is encoded,
                // remove the header not confuse downstream operations
                if (method === "HEAD" || res.statusCode === 204) {
                    delete res.headers["content-encoding"];
                }
                switch(res.headers["content-encoding"]){
                    /*eslint default-case:0*/ case "gzip":
                    case "x-gzip":
                    case "compress":
                    case "x-compress":
                        // add the unzipper to the body stream processing pipeline
                        streams.push(zlib__default["default"].createUnzip(zlibOptions));
                        // remove the content-encoding in order to not confuse downstream operations
                        delete res.headers["content-encoding"];
                        break;
                    case "deflate":
                        streams.push(new ZlibHeaderTransformStream$1());
                        // add the unzipper to the body stream processing pipeline
                        streams.push(zlib__default["default"].createUnzip(zlibOptions));
                        // remove the content-encoding in order to not confuse downstream operations
                        delete res.headers["content-encoding"];
                        break;
                    case "br":
                        if (isBrotliSupported) {
                            streams.push(zlib__default["default"].createBrotliDecompress(brotliOptions));
                            delete res.headers["content-encoding"];
                        }
                }
            }
            responseStream = streams.length > 1 ? stream__default["default"].pipeline(streams, utils.noop) : streams[0];
            const offListeners = stream__default["default"].finished(responseStream, ()=>{
                offListeners();
                onFinished();
            });
            const response = {
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: new AxiosHeaders$1(res.headers),
                config,
                request: lastRequest
            };
            if (responseType === "stream") {
                response.data = responseStream;
                settle(resolve, reject, response);
            } else {
                const responseBuffer = [];
                let totalResponseBytes = 0;
                responseStream.on("data", function handleStreamData(chunk) {
                    responseBuffer.push(chunk);
                    totalResponseBytes += chunk.length;
                    // make sure the content length is not over the maxContentLength if specified
                    if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
                        // stream.destroy() emit aborted event before calling reject() on Node.js v16
                        rejected = true;
                        responseStream.destroy();
                        reject(new AxiosError("maxContentLength size of " + config.maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
                    }
                });
                responseStream.on("aborted", function handlerStreamAborted() {
                    if (rejected) {
                        return;
                    }
                    const err = new AxiosError("maxContentLength size of " + config.maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, lastRequest);
                    responseStream.destroy(err);
                    reject(err);
                });
                responseStream.on("error", function handleStreamError(err) {
                    if (req.destroyed) return;
                    reject(AxiosError.from(err, null, config, lastRequest));
                });
                responseStream.on("end", function handleStreamEnd() {
                    try {
                        let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
                        if (responseType !== "arraybuffer") {
                            responseData = responseData.toString(responseEncoding);
                            if (!responseEncoding || responseEncoding === "utf8") {
                                responseData = utils.stripBOM(responseData);
                            }
                        }
                        response.data = responseData;
                    } catch (err) {
                        reject(AxiosError.from(err, null, config, response.request, response));
                    }
                    settle(resolve, reject, response);
                });
            }
            emitter.once("abort", (err)=>{
                if (!responseStream.destroyed) {
                    responseStream.emit("error", err);
                    responseStream.destroy();
                }
            });
        });
        emitter.once("abort", (err)=>{
            reject(err);
            req.destroy(err);
        });
        // Handle errors
        req.on("error", function handleRequestError(err) {
            // @todo remove
            // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
            reject(AxiosError.from(err, null, config, req));
        });
        // set tcp keep alive to prevent drop connection by peer
        req.on("socket", function handleRequestSocket(socket) {
            // default interval of sending ack packet is 1 minute
            socket.setKeepAlive(true, 1000 * 60);
        });
        // Handle request timeout
        if (config.timeout) {
            // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
            const timeout = parseInt(config.timeout, 10);
            if (isNaN(timeout)) {
                reject(new AxiosError("error trying to parse `config.timeout` to int", AxiosError.ERR_BAD_OPTION_VALUE, config, req));
                return;
            }
            // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
            // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
            // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
            // And then these socket which be hang up will devouring CPU little by little.
            // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
            req.setTimeout(timeout, function handleRequestTimeout() {
                if (isDone) return;
                let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
                const transitional = config.transitional || transitionalDefaults;
                if (config.timeoutErrorMessage) {
                    timeoutErrorMessage = config.timeoutErrorMessage;
                }
                reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, req));
                abort();
            });
        }
        // Send the request
        if (utils.isStream(data)) {
            let ended = false;
            let errored = false;
            data.on("end", ()=>{
                ended = true;
            });
            data.once("error", (err)=>{
                errored = true;
                req.destroy(err);
            });
            data.on("close", ()=>{
                if (!ended && !errored) {
                    abort(new CanceledError("Request stream has been aborted", config, req));
                }
            });
            data.pipe(req);
        } else {
            req.end(data);
        }
    });
};
const cookies = platform.isStandardBrowserEnv ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
    return {
        write: function write(name, value, expires, path, domain, secure) {
            const cookie = [];
            cookie.push(name + "=" + encodeURIComponent(value));
            if (utils.isNumber(expires)) {
                cookie.push("expires=" + new Date(expires).toGMTString());
            }
            if (utils.isString(path)) {
                cookie.push("path=" + path);
            }
            if (utils.isString(domain)) {
                cookie.push("domain=" + domain);
            }
            if (secure === true) {
                cookie.push("secure");
            }
            document.cookie = cookie.join("; ");
        },
        read: function read(name) {
            const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
            this.write(name, "", Date.now() - 86400000);
        }
    };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
    return {
        write: function write() {},
        read: function read() {
            return null;
        },
        remove: function remove() {}
    };
}();
const isURLSameOrigin = platform.isStandardBrowserEnv ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */ function resolveURL(url) {
        let href = url;
        if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
    }
    originURL = resolveURL(window.location.href);
    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */ return function isURLSameOrigin(requestURL) {
        const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
        return true;
    };
}();
function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return (e)=>{
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
            loaded,
            total,
            progress: total ? loaded / total : undefined,
            bytes: progressBytes,
            rate: rate ? rate : undefined,
            estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
            event: e
        };
        data[isDownloadStream ? "download" : "upload"] = true;
        listener(data);
    };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
        const responseType = config.responseType;
        let onCanceled;
        function done() {
            if (config.cancelToken) {
                config.cancelToken.unsubscribe(onCanceled);
            }
            if (config.signal) {
                config.signal.removeEventListener("abort", onCanceled);
            }
        }
        if (utils.isFormData(requestData)) {
            if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
                requestHeaders.setContentType(false); // Let the browser set it
            } else {
                requestHeaders.setContentType("multipart/form-data;", false); // mobile/desktop app frameworks
            }
        }
        let request = new XMLHttpRequest();
        // HTTP basic authentication
        if (config.auth) {
            const username = config.auth.username || "";
            const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
            requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
        }
        const fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        // Set the request timeout in MS
        request.timeout = config.timeout;
        function onloadend() {
            if (!request) {
                return;
            }
            // Prepare the response
            const responseHeaders = AxiosHeaders$1.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
            const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            const response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            };
            settle(function _resolve(value) {
                resolve(value);
                done();
            }, function _reject(err) {
                reject(err);
                done();
            }, response);
            // Clean up request
            request = null;
        }
        if ("onloadend" in request) {
            // Use onloadend if available
            request.onloadend = onloadend;
        } else {
            // Listen for ready state to emulate onloadend
            request.onreadystatechange = function handleLoad() {
                if (!request || request.readyState !== 4) {
                    return;
                }
                // The request errored out and we didn't get a response, this will be
                // handled by onerror instead
                // With one exception: request that using file: protocol, most browsers
                // will return status as 0 even though it's a successful request
                if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                    return;
                }
                // readystate handler is calling before onerror or ontimeout handlers,
                // so we should call onloadend on the next 'tick'
                setTimeout(onloadend);
            };
        }
        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
            if (!request) {
                return;
            }
            reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Handle low level network errors
        request.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
            // Clean up request
            request = null;
        };
        // Handle timeout
        request.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
            const transitional = config.transitional || transitionalDefaults;
            if (config.timeoutErrorMessage) {
                timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (platform.isStandardBrowserEnv) {
            // Add xsrf header
            const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
            if (xsrfValue) {
                requestHeaders.set(config.xsrfHeaderName, xsrfValue);
            }
        }
        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);
        // Add headers to the request
        if ("setRequestHeader" in request) {
            utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
                request.setRequestHeader(key, val);
            });
        }
        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
            request.withCredentials = !!config.withCredentials;
        }
        // Add responseType to request if needed
        if (responseType && responseType !== "json") {
            request.responseType = config.responseType;
        }
        // Handle progress if needed
        if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
        }
        // Not all browsers support upload events
        if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
        }
        if (config.cancelToken || config.signal) {
            // Handle cancellation
            // eslint-disable-next-line func-names
            onCanceled = (cancel)=>{
                if (!request) {
                    return;
                }
                reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
                request.abort();
                request = null;
            };
            config.cancelToken && config.cancelToken.subscribe(onCanceled);
            if (config.signal) {
                config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
            }
        }
        const protocol = parseProtocol(fullPath);
        if (protocol && platform.protocols.indexOf(protocol) === -1) {
            reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
            return;
        }
        // Send the request
        request.send(requestData || null);
    });
};
const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter
};
utils.forEach(knownAdapters, (fn, value)=>{
    if (fn) {
        try {
            Object.defineProperty(fn, "name", {
                value
            });
        } catch (e) {
        // eslint-disable-next-line no-empty
        }
        Object.defineProperty(fn, "adapterName", {
            value
        });
    }
});
const adapters = {
    getAdapter: (adapters)=>{
        adapters = utils.isArray(adapters) ? adapters : [
            adapters
        ];
        const { length } = adapters;
        let nameOrAdapter;
        let adapter;
        for(let i = 0; i < length; i++){
            nameOrAdapter = adapters[i];
            if (adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {
                break;
            }
        }
        if (!adapter) {
            if (adapter === false) {
                throw new AxiosError(`Adapter ${nameOrAdapter} is not supported by the environment`, "ERR_NOT_SUPPORT");
            }
            throw new Error(utils.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`);
        }
        if (!utils.isFunction(adapter)) {
            throw new TypeError("adapter is not a function");
        }
        return adapter;
    },
    adapters: knownAdapters
};
/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */ function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
        throw new CanceledError(null, config);
    }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */ function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders$1.from(config.headers);
    // Transform request data
    config.data = transformData.call(config, config.transformRequest);
    if ([
        "post",
        "put",
        "patch"
    ].indexOf(config.method) !== -1) {
        config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        // Transform response data
        response.data = transformData.call(config, config.transformResponse, response);
        response.headers = AxiosHeaders$1.from(response.headers);
        return response;
    }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            // Transform response data
            if (reason && reason.response) {
                reason.response.data = transformData.call(config, config.transformResponse, reason.response);
                reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
            }
        }
        return Promise.reject(reason);
    });
}
const headersToObject = (thing)=>thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */ function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, caseless) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
            return utils.merge.call({
                caseless
            }, target, source);
        } else if (utils.isPlainObject(source)) {
            return utils.merge({}, source);
        } else if (utils.isArray(source)) {
            return source.slice();
        }
        return source;
    }
    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, caseless) {
        if (!utils.isUndefined(b)) {
            return getMergedValue(a, b, caseless);
        } else if (!utils.isUndefined(a)) {
            return getMergedValue(undefined, a, caseless);
        }
    }
    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
        if (!utils.isUndefined(b)) {
            return getMergedValue(undefined, b);
        }
    }
    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
        if (!utils.isUndefined(b)) {
            return getMergedValue(undefined, b);
        } else if (!utils.isUndefined(a)) {
            return getMergedValue(undefined, a);
        }
    }
    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
            return getMergedValue(a, b);
        } else if (prop in config1) {
            return getMergedValue(undefined, a);
        }
    }
    const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b)=>mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };
    utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(config1[prop], config2[prop], prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
}
const validators$1 = {};
// eslint-disable-next-line func-names
[
    "object",
    "boolean",
    "number",
    "function",
    "string",
    "symbol"
].forEach((type, i)=>{
    validators$1[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
});
const deprecatedWarnings = {};
/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */ validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    // eslint-disable-next-line func-names
    return (value, opt, opts)=>{
        if (validator === false) {
            throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
        }
        if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            // eslint-disable-next-line no-console
            console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
        }
        return validator ? validator(value, opt, opts) : true;
    };
};
/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */ function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
        throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while(i-- > 0){
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
            const value = options[opt];
            const result = value === undefined || validator(value, opt, options);
            if (result !== true) {
                throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
            }
            continue;
        }
        if (allowUnknown !== true) {
            throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
        }
    }
}
const validator = {
    assertOptions,
    validators: validators$1
};
const validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */ class Axios {
    constructor(instanceConfig){
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new InterceptorManager$1(),
            response: new InterceptorManager$1()
        };
    }
    /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */ request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/ // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === "string") {
            config = config || {};
            config.url = configOrUrl;
        } else {
            config = configOrUrl || {};
        }
        config = mergeConfig(this.defaults, config);
        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== undefined) {
            validator.assertOptions(transitional, {
                silentJSONParsing: validators.transitional(validators.boolean),
                forcedJSONParsing: validators.transitional(validators.boolean),
                clarifyTimeoutError: validators.transitional(validators.boolean)
            }, false);
        }
        if (paramsSerializer != null) {
            if (utils.isFunction(paramsSerializer)) {
                config.paramsSerializer = {
                    serialize: paramsSerializer
                };
            } else {
                validator.assertOptions(paramsSerializer, {
                    encode: validators.function,
                    serialize: validators.function
                }, true);
            }
        }
        // Set config.method
        config.method = (config.method || this.defaults.method || "get").toLowerCase();
        let contextHeaders;
        // Flatten headers
        contextHeaders = headers && utils.merge(headers.common, headers[config.method]);
        contextHeaders && utils.forEach([
            "delete",
            "get",
            "head",
            "post",
            "put",
            "patch",
            "common"
        ], (method)=>{
            delete headers[method];
        });
        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
                return;
            }
            synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
            const chain = [
                dispatchRequest.bind(this),
                undefined
            ];
            chain.unshift.apply(chain, requestInterceptorChain);
            chain.push.apply(chain, responseInterceptorChain);
            len = chain.length;
            promise = Promise.resolve(config);
            while(i < len){
                promise = promise.then(chain[i++], chain[i++]);
            }
            return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        i = 0;
        while(i < len){
            const onFulfilled = requestInterceptorChain[i++];
            const onRejected = requestInterceptorChain[i++];
            try {
                newConfig = onFulfilled(newConfig);
            } catch (error) {
                onRejected.call(this, error);
                break;
            }
        }
        try {
            promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
            return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while(i < len){
            promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
    }
    getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url);
        return buildURL(fullPath, config.params, config.paramsSerializer);
    }
}
// Provide aliases for supported request methods
utils.forEach([
    "delete",
    "get",
    "head",
    "options"
], function forEachMethodNoData(method) {
    /*eslint func-names:0*/ Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
            method,
            url,
            data: (config || {}).data
        }));
    };
});
utils.forEach([
    "post",
    "put",
    "patch"
], function forEachMethodWithData(method) {
    /*eslint func-names:0*/ function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
            return this.request(mergeConfig(config || {}, {
                method,
                headers: isForm ? {
                    "Content-Type": "multipart/form-data"
                } : {},
                url,
                data
            }));
        };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
const Axios$1 = Axios;
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */ class CancelToken {
    constructor(executor){
        if (typeof executor !== "function") {
            throw new TypeError("executor must be a function.");
        }
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });
        const token = this;
        // eslint-disable-next-line func-names
        this.promise.then((cancel)=>{
            if (!token._listeners) return;
            let i = token._listeners.length;
            while(i-- > 0){
                token._listeners[i](cancel);
            }
            token._listeners = null;
        });
        // eslint-disable-next-line func-names
        this.promise.then = (onfulfilled)=>{
            let _resolve;
            // eslint-disable-next-line func-names
            const promise = new Promise((resolve)=>{
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject() {
                token.unsubscribe(_resolve);
            };
            return promise;
        };
        executor(function cancel(message, config, request) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }
            token.reason = new CanceledError(message, config, request);
            resolvePromise(token.reason);
        });
    }
    /**
   * Throws a `CanceledError` if cancellation has been requested.
   */ throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }
    /**
   * Subscribe to the cancel signal
   */ subscribe(listener) {
        if (this.reason) {
            listener(this.reason);
            return;
        }
        if (this._listeners) {
            this._listeners.push(listener);
        } else {
            this._listeners = [
                listener
            ];
        }
    }
    /**
   * Unsubscribe from the cancel signal
   */ unsubscribe(listener) {
        if (!this._listeners) {
            return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }
    /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */ static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token,
            cancel
        };
    }
}
const CancelToken$1 = CancelToken;
/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */ function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
}
/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */ function isAxiosError(payload) {
    return utils.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value])=>{
    HttpStatusCode[value] = key;
});
const HttpStatusCode$1 = HttpStatusCode;
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */ function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);
    // Copy axios.prototype to instance
    utils.extend(instance, Axios$1.prototype, context, {
        allOwnKeys: true
    });
    // Copy context to instance
    utils.extend(instance, context, null, {
        allOwnKeys: true
    });
    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
}
// Create the default instance to be exported
const axios = createInstance(defaults$1);
// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;
// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
// Expose AxiosError class
axios.AxiosError = AxiosError;
// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;
// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = spread;
// Expose isAxiosError
axios.isAxiosError = isAxiosError;
// Expose mergeConfig
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing)=>formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
module.exports = axios; //# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ 21288:
/***/ ((module, exports) => {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// GENERATED FILE. DO NOT EDIT.

var Long = function(exports1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.default = void 0;
    /**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   */ // WebAssembly optimizations to do native i64 multiplication and divide
    var wasm = null;
    try {
        wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
            0,
            97,
            115,
            109,
            1,
            0,
            0,
            0,
            1,
            13,
            2,
            96,
            0,
            1,
            127,
            96,
            4,
            127,
            127,
            127,
            127,
            1,
            127,
            3,
            7,
            6,
            0,
            1,
            1,
            1,
            1,
            1,
            6,
            6,
            1,
            127,
            1,
            65,
            0,
            11,
            7,
            50,
            6,
            3,
            109,
            117,
            108,
            0,
            1,
            5,
            100,
            105,
            118,
            95,
            115,
            0,
            2,
            5,
            100,
            105,
            118,
            95,
            117,
            0,
            3,
            5,
            114,
            101,
            109,
            95,
            115,
            0,
            4,
            5,
            114,
            101,
            109,
            95,
            117,
            0,
            5,
            8,
            103,
            101,
            116,
            95,
            104,
            105,
            103,
            104,
            0,
            0,
            10,
            191,
            1,
            6,
            4,
            0,
            35,
            0,
            11,
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            126,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            127,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            128,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            129,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            130,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11
        ])), {}).exports;
    } catch (e) {}
    /**
   * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
   *  See the from* functions below for more convenient ways of constructing Longs.
   * @exports Long
   * @class A Long class for representing a 64 bit two's-complement integer value.
   * @param {number} low The low (signed) 32 bits of the long
   * @param {number} high The high (signed) 32 bits of the long
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @constructor
   */ function Long(low, high, unsigned) {
        /**
     * The low 32 bits as a signed value.
     * @type {number}
     */ this.low = low | 0;
        /**
     * The high 32 bits as a signed value.
     * @type {number}
     */ this.high = high | 0;
        /**
     * Whether unsigned or not.
     * @type {boolean}
     */ this.unsigned = !!unsigned;
    } // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.
    /**
   * An indicator used to reliably determine if an object is a Long or not.
   * @type {boolean}
   * @const
   * @private
   */ Long.prototype.__isLong__;
    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true
    });
    /**
   * @function
   * @param {*} obj Object
   * @returns {boolean}
   * @inner
   */ function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }
    /**
   * @function
   * @param {*} value number
   * @returns {number}
   * @inner
   */ function ctz32(value) {
        var c = Math.clz32(value & -value);
        return value ? 31 - c : c;
    }
    /**
   * Tests if the specified object is a Long.
   * @function
   * @param {*} obj Object
   * @returns {boolean}
   */ Long.isLong = isLong;
    /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @inner
   */ var INT_CACHE = {};
    /**
   * A cache of the Long representations of small unsigned integer values.
   * @type {!Object}
   * @inner
   */ var UINT_CACHE = {};
    /**
   * @param {number} value
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */ function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, 0, true);
            if (cache) UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache) INT_CACHE[value] = obj;
            return obj;
        }
    }
    /**
   * Returns a Long representing the given 32 bit integer value.
   * @function
   * @param {number} value The 32 bit integer in question
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long} The corresponding Long value
   */ Long.fromInt = fromInt;
    /**
   * @param {number} value
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */ function fromNumber(value, unsigned) {
        if (isNaN(value)) return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0) return UZERO;
            if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
        }
        if (value < 0) return fromNumber(-value, unsigned).neg();
        return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    /**
   * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
   * @function
   * @param {number} value The number in question
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long} The corresponding Long value
   */ Long.fromNumber = fromNumber;
    /**
   * @param {number} lowBits
   * @param {number} highBits
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */ function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }
    /**
   * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
   *  assumed to use 32 bits.
   * @function
   * @param {number} lowBits The low 32 bits
   * @param {number} highBits The high 32 bits
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long} The corresponding Long value
   */ Long.fromBits = fromBits;
    /**
   * @function
   * @param {number} base
   * @param {number} exponent
   * @returns {number}
   * @inner
   */ var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)
    /**
   * @param {string} str
   * @param {(boolean|number)=} unsigned
   * @param {number=} radix
   * @returns {!Long}
   * @inner
   */ function fromString(str, unsigned, radix) {
        if (str.length === 0) throw Error("empty string");
        if (typeof unsigned === "number") {
            // For goog.math.long compatibility
            radix = unsigned;
            unsigned = false;
        } else {
            unsigned = !!unsigned;
        }
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return unsigned ? UZERO : ZERO;
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError("radix");
        var p;
        if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
        else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        } // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));
        var result = ZERO;
        for(var i = 0; i < str.length; i += 8){
            var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }
    /**
   * Returns a Long representation of the given string, written using the specified radix.
   * @function
   * @param {string} str The textual representation of the Long
   * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
   * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
   * @returns {!Long} The corresponding Long value
   */ Long.fromString = fromString;
    /**
   * @function
   * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */ function fromValue(val, unsigned) {
        if (typeof val === "number") return fromNumber(val, unsigned);
        if (typeof val === "string") return fromString(val, unsigned); // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    /**
   * Converts the specified value to a Long using the appropriate from* function for its type.
   * @function
   * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long}
   */ Long.fromValue = fromValue; // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.
    /**
   * @type {number}
   * @const
   * @inner
   */ var TWO_PWR_16_DBL = 1 << 16;
    /**
   * @type {number}
   * @const
   * @inner
   */ var TWO_PWR_24_DBL = 1 << 24;
    /**
   * @type {number}
   * @const
   * @inner
   */ var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    /**
   * @type {number}
   * @const
   * @inner
   */ var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    /**
   * @type {number}
   * @const
   * @inner
   */ var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    /**
   * @type {!Long}
   * @const
   * @inner
   */ var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    /**
   * @type {!Long}
   * @inner
   */ var ZERO = fromInt(0);
    /**
   * Signed zero.
   * @type {!Long}
   */ Long.ZERO = ZERO;
    /**
   * @type {!Long}
   * @inner
   */ var UZERO = fromInt(0, true);
    /**
   * Unsigned zero.
   * @type {!Long}
   */ Long.UZERO = UZERO;
    /**
   * @type {!Long}
   * @inner
   */ var ONE = fromInt(1);
    /**
   * Signed one.
   * @type {!Long}
   */ Long.ONE = ONE;
    /**
   * @type {!Long}
   * @inner
   */ var UONE = fromInt(1, true);
    /**
   * Unsigned one.
   * @type {!Long}
   */ Long.UONE = UONE;
    /**
   * @type {!Long}
   * @inner
   */ var NEG_ONE = fromInt(-1);
    /**
   * Signed negative one.
   * @type {!Long}
   */ Long.NEG_ONE = NEG_ONE;
    /**
   * @type {!Long}
   * @inner
   */ var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);
    /**
   * Maximum signed value.
   * @type {!Long}
   */ Long.MAX_VALUE = MAX_VALUE;
    /**
   * @type {!Long}
   * @inner
   */ var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);
    /**
   * Maximum unsigned value.
   * @type {!Long}
   */ Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    /**
   * @type {!Long}
   * @inner
   */ var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);
    /**
   * Minimum signed value.
   * @type {!Long}
   */ Long.MIN_VALUE = MIN_VALUE;
    /**
   * @alias Long.prototype
   * @inner
   */ var LongPrototype = Long.prototype;
    /**
   * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
   * @this {!Long}
   * @returns {number}
   */ LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };
    /**
   * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
   * @this {!Long}
   * @returns {number}
   */ LongPrototype.toNumber = function toNumber() {
        if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    /**
   * Converts the Long to a string written in the specified radix.
   * @this {!Long}
   * @param {number=} radix Radix (2-36), defaults to 10
   * @returns {string}
   * @override
   * @throws {RangeError} If `radix` is out of range
   */ LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError("radix");
        if (this.isZero()) return "0";
        if (this.isNegative()) {
            // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else return "-" + this.neg().toString(radix);
        } // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
        var result = "";
        while(true){
            var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) return digits + result;
            else {
                while(digits.length < 6)digits = "0" + digits;
                result = "" + digits + result;
            }
        }
    };
    /**
   * Gets the high 32 bits as a signed integer.
   * @this {!Long}
   * @returns {number} Signed high bits
   */ LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };
    /**
   * Gets the high 32 bits as an unsigned integer.
   * @this {!Long}
   * @returns {number} Unsigned high bits
   */ LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };
    /**
   * Gets the low 32 bits as a signed integer.
   * @this {!Long}
   * @returns {number} Signed low bits
   */ LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };
    /**
   * Gets the low 32 bits as an unsigned integer.
   * @this {!Long}
   * @returns {number} Unsigned low bits
   */ LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };
    /**
   * Gets the number of bits needed to represent the absolute value of this Long.
   * @this {!Long}
   * @returns {number}
   */ LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for(var bit = 31; bit > 0; bit--)if ((val & 1 << bit) != 0) break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };
    /**
   * Tests if this Long's value equals zero.
   * @this {!Long}
   * @returns {boolean}
   */ LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };
    /**
   * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
   * @returns {boolean}
   */ LongPrototype.eqz = LongPrototype.isZero;
    /**
   * Tests if this Long's value is negative.
   * @this {!Long}
   * @returns {boolean}
   */ LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };
    /**
   * Tests if this Long's value is positive or zero.
   * @this {!Long}
   * @returns {boolean}
   */ LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };
    /**
   * Tests if this Long's value is odd.
   * @this {!Long}
   * @returns {boolean}
   */ LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };
    /**
   * Tests if this Long's value is even.
   * @this {!Long}
   * @returns {boolean}
   */ LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };
    /**
   * Tests if this Long's value equals the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.equals = function equals(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
        return this.high === other.high && this.low === other.low;
    };
    /**
   * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.eq = LongPrototype.equals;
    /**
   * Tests if this Long's value differs from the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.notEquals = function notEquals(other) {
        return !this.eq(/* validates */ other);
    };
    /**
   * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.neq = LongPrototype.notEquals;
    /**
   * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.ne = LongPrototype.notEquals;
    /**
   * Tests if this Long's value is less than the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.lessThan = function lessThan(other) {
        return this.comp(/* validates */ other) < 0;
    };
    /**
   * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.lt = LongPrototype.lessThan;
    /**
   * Tests if this Long's value is less than or equal the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp(/* validates */ other) <= 0;
    };
    /**
   * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.lte = LongPrototype.lessThanOrEqual;
    /**
   * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.le = LongPrototype.lessThanOrEqual;
    /**
   * Tests if this Long's value is greater than the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp(/* validates */ other) > 0;
    };
    /**
   * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.gt = LongPrototype.greaterThan;
    /**
   * Tests if this Long's value is greater than or equal the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp(/* validates */ other) >= 0;
    };
    /**
   * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    /**
   * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */ LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    /**
   * Compares this Long's value with the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {number} 0 if they are the same, 1 if the this is greater and -1
   *  if the given one is greater
   */ LongPrototype.compare = function compare(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.eq(other)) return 0;
        var thisNeg = this.isNegative(), otherNeg = other.isNegative();
        if (thisNeg && !otherNeg) return -1;
        if (!thisNeg && otherNeg) return 1; // At this point the sign bits are the same
        if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1; // Both are positive if at least one is unsigned
        return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    /**
   * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {number} 0 if they are the same, 1 if the this is greater and -1
   *  if the given one is greater
   */ LongPrototype.comp = LongPrototype.compare;
    /**
   * Negates this Long's value.
   * @this {!Long}
   * @returns {!Long} Negated Long
   */ LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
        return this.not().add(ONE);
    };
    /**
   * Negates this Long's value. This is an alias of {@link Long#negate}.
   * @function
   * @returns {!Long} Negated Long
   */ LongPrototype.neg = LongPrototype.negate;
    /**
   * Returns the sum of this and the specified Long.
   * @this {!Long}
   * @param {!Long|number|string} addend Addend
   * @returns {!Long} Sum
   */ LongPrototype.add = function add(addend) {
        if (!isLong(addend)) addend = fromValue(addend); // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;
        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    /**
   * Returns the difference of this and the specified Long.
   * @this {!Long}
   * @param {!Long|number|string} subtrahend Subtrahend
   * @returns {!Long} Difference
   */ LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };
    /**
   * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
   * @function
   * @param {!Long|number|string} subtrahend Subtrahend
   * @returns {!Long} Difference
   */ LongPrototype.sub = LongPrototype.subtract;
    /**
   * Returns the product of this and the specified Long.
   * @this {!Long}
   * @param {!Long|number|string} multiplier Multiplier
   * @returns {!Long} Product
   */ LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero()) return this;
        if (!isLong(multiplier)) multiplier = fromValue(multiplier); // use wasm support if present
        if (wasm) {
            var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
            return fromBits(low, wasm["get_high"](), this.unsigned);
        }
        if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
        if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
        if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
            else return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg(); // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned); // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;
        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    /**
   * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
   * @function
   * @param {!Long|number|string} multiplier Multiplier
   * @returns {!Long} Product
   */ LongPrototype.mul = LongPrototype.multiply;
    /**
   * Returns this Long divided by the specified. The result is signed if this Long is signed or
   *  unsigned if this Long is unsigned.
   * @this {!Long}
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Quotient
   */ LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        if (divisor.isZero()) throw Error("division by zero"); // use wasm support if present
        if (wasm) {
            // guard against signed division overflow: the largest
            // negative number / -1 would be 1 larger than the largest
            // positive number, due to two's complement.
            if (!this.unsigned && this.high === -0x80000000 && divisor.low === -1 && divisor.high === -1) {
                // be consistent with non-wasm code path
                return this;
            }
            var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high);
            return fromBits(low, wasm["get_high"](), this.unsigned);
        }
        if (this.isZero()) return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE)) return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned) divisor = divisor.toUnsigned();
            if (divisor.gt(this)) return UZERO;
            if (divisor.gt(this.shru(1))) return UONE;
            res = UZERO;
        } // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while(rem.gte(divisor)){
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber())); // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
            while(approxRem.isNegative() || approxRem.gt(rem)){
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            } // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) approxRes = ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };
    /**
   * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
   * @function
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Quotient
   */ LongPrototype.div = LongPrototype.divide;
    /**
   * Returns this Long modulo the specified.
   * @this {!Long}
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Remainder
   */ LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor); // use wasm support if present
        if (wasm) {
            var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high);
            return fromBits(low, wasm["get_high"](), this.unsigned);
        }
        return this.sub(this.div(divisor).mul(divisor));
    };
    /**
   * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
   * @function
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Remainder
   */ LongPrototype.mod = LongPrototype.modulo;
    /**
   * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
   * @function
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Remainder
   */ LongPrototype.rem = LongPrototype.modulo;
    /**
   * Returns the bitwise NOT of this Long.
   * @this {!Long}
   * @returns {!Long}
   */ LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };
    /**
   * Returns count leading zeros of this Long.
   * @this {!Long}
   * @returns {!number}
   */ LongPrototype.countLeadingZeros = function countLeadingZeros() {
        return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
    };
    /**
   * Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
   * @function
   * @param {!Long}
   * @returns {!number}
   */ LongPrototype.clz = LongPrototype.countLeadingZeros;
    /**
   * Returns count trailing zeros of this Long.
   * @this {!Long}
   * @returns {!number}
   */ LongPrototype.countTrailingZeros = function countTrailingZeros() {
        return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
    };
    /**
   * Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
   * @function
   * @param {!Long}
   * @returns {!number}
   */ LongPrototype.ctz = LongPrototype.countTrailingZeros;
    /**
   * Returns the bitwise AND of this Long and the specified.
   * @this {!Long}
   * @param {!Long|number|string} other Other Long
   * @returns {!Long}
   */ LongPrototype.and = function and(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    /**
   * Returns the bitwise OR of this Long and the specified.
   * @this {!Long}
   * @param {!Long|number|string} other Other Long
   * @returns {!Long}
   */ LongPrototype.or = function or(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    /**
   * Returns the bitwise XOR of this Long and the given one.
   * @this {!Long}
   * @param {!Long|number|string} other Other Long
   * @returns {!Long}
   */ LongPrototype.xor = function xor(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
        else return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    /**
   * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shl = LongPrototype.shiftLeft;
    /**
   * Returns this Long with bits arithmetically shifted to the right by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
        else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    /**
   * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shr = LongPrototype.shiftRight;
    /**
   * Returns this Long with bits logically shifted to the right by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
        if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
        return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
    };
    /**
   * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    /**
   * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */ LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    /**
   * Returns this Long with bits rotated to the left by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */ LongPrototype.rotateLeft = function rotateLeft(numBits) {
        var b;
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
        if (numBits < 32) {
            b = 32 - numBits;
            return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
        }
        numBits -= 32;
        b = 32 - numBits;
        return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
    };
    /**
   * Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */ LongPrototype.rotl = LongPrototype.rotateLeft;
    /**
   * Returns this Long with bits rotated to the right by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */ LongPrototype.rotateRight = function rotateRight(numBits) {
        var b;
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
        if (numBits < 32) {
            b = 32 - numBits;
            return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
        }
        numBits -= 32;
        b = 32 - numBits;
        return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
    };
    /**
   * Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */ LongPrototype.rotr = LongPrototype.rotateRight;
    /**
   * Converts this Long to signed.
   * @this {!Long}
   * @returns {!Long} Signed long
   */ LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned) return this;
        return fromBits(this.low, this.high, false);
    };
    /**
   * Converts this Long to unsigned.
   * @this {!Long}
   * @returns {!Long} Unsigned long
   */ LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned) return this;
        return fromBits(this.low, this.high, true);
    };
    /**
   * Converts this Long to its byte representation.
   * @param {boolean=} le Whether little or big endian, defaults to big endian
   * @this {!Long}
   * @returns {!Array.<number>} Byte representation
   */ LongPrototype.toBytes = function toBytes(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    };
    /**
   * Converts this Long to its little endian byte representation.
   * @this {!Long}
   * @returns {!Array.<number>} Little endian byte representation
   */ LongPrototype.toBytesLE = function toBytesLE() {
        var hi = this.high, lo = this.low;
        return [
            lo & 0xff,
            lo >>> 8 & 0xff,
            lo >>> 16 & 0xff,
            lo >>> 24,
            hi & 0xff,
            hi >>> 8 & 0xff,
            hi >>> 16 & 0xff,
            hi >>> 24
        ];
    };
    /**
   * Converts this Long to its big endian byte representation.
   * @this {!Long}
   * @returns {!Array.<number>} Big endian byte representation
   */ LongPrototype.toBytesBE = function toBytesBE() {
        var hi = this.high, lo = this.low;
        return [
            hi >>> 24,
            hi >>> 16 & 0xff,
            hi >>> 8 & 0xff,
            hi & 0xff,
            lo >>> 24,
            lo >>> 16 & 0xff,
            lo >>> 8 & 0xff,
            lo & 0xff
        ];
    };
    /**
   * Creates a Long from its byte representation.
   * @param {!Array.<number>} bytes Byte representation
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @param {boolean=} le Whether little or big endian, defaults to big endian
   * @returns {Long} The corresponding Long value
   */ Long.fromBytes = function fromBytes(bytes, unsigned, le) {
        return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    };
    /**
   * Creates a Long from its little endian byte representation.
   * @param {!Array.<number>} bytes Little endian byte representation
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {Long} The corresponding Long value
   */ Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
        return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
    };
    /**
   * Creates a Long from its big endian byte representation.
   * @param {!Array.<number>} bytes Big endian byte representation
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {Long} The corresponding Long value
   */ Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
        return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
    };
    var _default = Long;
    exports1.default = _default;
    return "default" in exports1 ? exports1.default : exports1;
}({});
if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return Long;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
else {}


/***/ }),

/***/ 2753:
/***/ ((module) => {

"use strict";

/***/ })

};
;