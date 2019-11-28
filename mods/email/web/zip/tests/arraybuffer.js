// Code can be found at: http://www.calormen.com/polyfill/typedarray.js

/*
 $LicenseInfo:firstyear=2010&license=mit$

 Copyright (c) 2010, Linden Research, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 $/LicenseInfo$
 */

// Original can be found at:  https://bitbucket.org/lindenlab/llsd
// Modifications by Joshua Bell inexorabletash@hotmail.com
//  * Restructure the creation of types and exporting to global namespace
//  * Allow no arguments to DataView constructor
//  * Work cross-frame with native arrays/shimmed DataView
//  * Corrected Object.defineProperty shim for IE8
// ES3/ES5 implementation of the Krhonos TypedArray Working Draft (work in progress):
//   Ref: https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/doc/spec/TypedArray-spec.html
//   Date: 2011-02-01
//
// Variations:
//  * Float/Double -> Float32/Float64, per WebGL-Public mailing list conversations (post 5/17)
//  * Allows typed_array.get/set() as alias for subscripts (typed_array[])
(function(global) {
	"use strict";

	var USE_NATIVE_IF_AVAILABLE = true;

	// Approximations of internal ECMAScript conversion functions
	var ECMAScript = (function() {
		// Stash a copy in case other scripts modify these
		var opts = Object.prototype.toString, ophop = Object.prototype.hasOwnProperty;

		return {
			// Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
			Class : function(v) {
				return opts.call(v).replace(/^\[object *|\]$/g, '');
			***REMOVED***,
			HasProperty : function(o, p) {
				return p in o;
			***REMOVED***,
			HasOwnProperty : function(o, p) {
				return ophop.call(o, p);
			***REMOVED***,
			IsCallable : function(o) {
				return typeof o === 'function';
			***REMOVED***,
			ToInt32 : function(v) {
				return v >> 0;
			***REMOVED***,
			ToUint32 : function(v) {
				return v >>> 0;
			***REMOVED***
		***REMOVED***;
	***REMOVED***());

	// Create an INDEX_SIZE_ERR event - intentionally induces a DOM error if possible

	function new_INDEX_SIZE_ERR() {
		try {
			if (document) {
				// raises DOMException(INDEX_SIZE_ERR)
				document.createTextNode("").splitText(1);
			***REMOVED***
			return new RangeError("INDEX_SIZE_ERR");
		***REMOVED*** catch (e) {
			return e;
		***REMOVED***
	***REMOVED***

	// ES5: lock down object properties

	function configureProperties(obj) {
		if (Object.getOwnPropertyNames && Object.defineProperty) {
			var props = Object.getOwnPropertyNames(obj), i;
			for (i = 0; i < props.length; i += 1) {
				Object.defineProperty(obj, props[i], {
					value : obj[props[i]],
					writable : false,
					enumerable : false,
					configurable : false
				***REMOVED***);
			***REMOVED***
		***REMOVED***
	***REMOVED***

	// emulate ES5 getter/setter API using legacy APIs
	// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
	// (second clause tests for Object.defineProperty() in IE<9 that only supports extending DOM prototypes, but
	// note that IE<9 does not support __defineGetter__ or __defineSetter__ so it just renders the method harmless)
	if (!Object.defineProperty || !(function() {
		try {
			Object.defineProperty({***REMOVED***, 'x', {***REMOVED***);
			return true;
		***REMOVED*** catch (e) {
			return false;
		***REMOVED***
	***REMOVED***())) {
		Object.defineProperty = function(o, p, desc) {
			if (!o === Object(o)) {
				throw new TypeError("Object.defineProperty called on non-object");
			***REMOVED***
			if (ECMAScript.HasProperty(desc, 'get') && Object.prototype.__defineGetter__) {
				Object.prototype.__defineGetter__.call(o, p, desc.get);
			***REMOVED***
			if (ECMAScript.HasProperty(desc, 'set') && Object.prototype.__defineSetter__) {
				Object.prototype.__defineSetter__.call(o, p, desc.set);
			***REMOVED***
			if (ECMAScript.HasProperty(desc, 'value')) {
				o[p] = desc.value;
			***REMOVED***
			return o;
		***REMOVED***;
	***REMOVED***

	if (!Object.getOwnPropertyNames) {
		Object.getOwnPropertyNames = function getOwnPropertyNames(o) {
			if (o !== Object(o)) {
				throw new TypeError("Object.getOwnPropertyNames called on non-object");
			***REMOVED***
			var props = [], p;
			for (p in o) {
				if (ECMAScript.HasOwnProperty(o, p)) {
					props.push(p);
				***REMOVED***
			***REMOVED***
			return props;
		***REMOVED***;
	***REMOVED***

	// ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)
	// for index in 0 ... obj.length

	function makeArrayAccessors(obj) {
		if (!Object.defineProperty) {
			return;
		***REMOVED***

		function makeArrayAccessor(index) {
			Object.defineProperty(obj, index, {
				'get' : function() {
					return obj._getter(index);
				***REMOVED***,
				'set' : function(v) {
					obj._setter(index, v);
				***REMOVED***,
				enumerable : true,
				configurable : false
			***REMOVED***);
		***REMOVED***

		var i;
		for (i = 0; i < obj.length; i += 1) {
			makeArrayAccessor(i);
		***REMOVED***
	***REMOVED***

	// Internal conversion functions:
	// pack<Type>() - take a number (interpreted as Type), output a byte array
	// unpack<Type>() - take a byte array, output a Type-like number

	function as_signed(value, bits) {
		var s = 32 - bits;
		return (value << s) >> s;
	***REMOVED***

	function as_unsigned(value, bits) {
		var s = 32 - bits;
		return (value << s) >>> s;
	***REMOVED***

	function packInt8(n) {
		return [ n & 0xff ];
	***REMOVED***

	function unpackInt8(bytes) {
		return as_signed(bytes[0], 8);
	***REMOVED***

	function packUint8(n) {
		return [ n & 0xff ];
	***REMOVED***

	function unpackUint8(bytes) {
		return as_unsigned(bytes[0], 8);
	***REMOVED***

	function packInt16(n) {
		return [ (n >> 8) & 0xff, n & 0xff ];
	***REMOVED***

	function unpackInt16(bytes) {
		return as_signed(bytes[0] << 8 | bytes[1], 16);
	***REMOVED***

	function packUint16(n) {
		return [ (n >> 8) & 0xff, n & 0xff ];
	***REMOVED***

	function unpackUint16(bytes) {
		return as_unsigned(bytes[0] << 8 | bytes[1], 16);
	***REMOVED***

	function packInt32(n) {
		return [ (n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff ];
	***REMOVED***

	function unpackInt32(bytes) {
		return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32);
	***REMOVED***

	function packUint32(n) {
		return [ (n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff ];
	***REMOVED***

	function unpackUint32(bytes) {
		return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32);
	***REMOVED***

	function packIEEE754(v, ebits, fbits) {

		var bias = (1 << (ebits - 1)) - 1, s, e, f, ln, i, bits, str, bytes;

		// Compute sign, exponent, fraction
		if (v !== v) {
			// NaN
			// http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
			e = (1 << bias) - 1;
			f = Math.pow(2, fbits - 1);
			s = 0;
		***REMOVED*** else if (v === Infinity || v === -Infinity) {
			e = (1 << bias) - 1;
			f = 0;
			s = (v < 0) ? 1 : 0;
		***REMOVED*** else if (v === 0) {
			e = 0;
			f = 0;
			s = (1 / v === -Infinity) ? 1 : 0;
		***REMOVED*** else {
			s = v < 0;
			v = Math.abs(v);

			if (v >= Math.pow(2, 1 - bias)) {
				// Normalized
				ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
				e = ln + bias;
				f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
			***REMOVED*** else {
				// Denormalized
				e = 0;
				f = Math.round(v / Math.pow(2, 1 - bias - fbits));
			***REMOVED***
		***REMOVED***

		// Pack sign, exponent, fraction
		bits = [];
		for (i = fbits; i; i -= 1) {
			bits.push(f % 2 ? 1 : 0);
			f = Math.floor(f / 2);
		***REMOVED***
		for (i = ebits; i; i -= 1) {
			bits.push(e % 2 ? 1 : 0);
			e = Math.floor(e / 2);
		***REMOVED***
		bits.push(s ? 1 : 0);
		bits.reverse();
		str = bits.join('');

		// Bits to bytes
		bytes = [];
		while (str.length) {
			bytes.push(parseInt(str.substring(0, 8), 2));
			str = str.substring(8);
		***REMOVED***
		return bytes;
	***REMOVED***

	function unpackIEEE754(bytes, ebits, fbits) {

		// Bytes to bits
		var bits = [], i, j, b, str, bias, s, e, f;

		for (i = bytes.length; i; i -= 1) {
			b = bytes[i - 1];
			for (j = 8; j; j -= 1) {
				bits.push(b % 2 ? 1 : 0);
				b = b >> 1;
			***REMOVED***
		***REMOVED***
		bits.reverse();
		str = bits.join('');

		// Unpack sign, exponent, fraction
		bias = (1 << (ebits - 1)) - 1;
		s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
		e = parseInt(str.substring(1, 1 + ebits), 2);
		f = parseInt(str.substring(1 + ebits), 2);

		// Produce number
		if (e === (1 << ebits) - 1) {
			return f !== 0 ? NaN : s * Infinity;
		***REMOVED*** else if (e > 0) {
			// Normalized
			return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
		***REMOVED*** else if (f !== 0) {
			// Denormalized
			return s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits));
		***REMOVED*** else {
			return s < 0 ? -0 : 0;
		***REMOVED***
	***REMOVED***

	function unpackFloat64(b) {
		return unpackIEEE754(b, 11, 52);
	***REMOVED***

	function packFloat64(v) {
		return packIEEE754(v, 11, 52);
	***REMOVED***

	function unpackFloat32(b) {
		return unpackIEEE754(b, 8, 23);
	***REMOVED***

	function packFloat32(v) {
		return packIEEE754(v, 8, 23);
	***REMOVED***

	//
	// 3 The ArrayBuffer Type
	//
	(function() {

		/** @constructor */
		var ArrayBuffer = function ArrayBuffer(length) {
			length = ECMAScript.ToInt32(length);
			if (length < 0) {
				throw new RangeError('ArrayBuffer size is not a small enough positive integer.');
			***REMOVED***

			this.byteLength = length;
			this._bytes = [];
			this._bytes.length = length;

			var i;
			for (i = 0; i < this.byteLength; i += 1) {
				this._bytes[i] = 0;
			***REMOVED***

			configureProperties(this);
		***REMOVED***;

		//
		// 4 The ArrayBufferView Type
		//
		// NOTE: this constructor is not exported
		/** @constructor */
		var ArrayBufferView = function ArrayBufferView() {
			// this.buffer = null;
			// this.byteOffset = 0;
			// this.byteLength = 0;
		***REMOVED***;

		//
		// 5 The Typed Array View Types
		//

		function makeTypedArrayConstructor(bytesPerElement, pack, unpack) {
			// Each TypedArray type requires a distinct constructor instance with
			// identical logic, which this produces.
			var ctor;
			ctor = function(buffer, byteOffset, length) {
				var array, sequence, i, s;

				if (!arguments.length || typeof arguments[0] === 'number') {
					// Constructor(unsigned long length)
					this.length = ECMAScript.ToInt32(arguments[0]);
					if (length < 0) {
						throw new RangeError('ArrayBufferView size is not a small enough positive integer.');
					***REMOVED***

					this.byteLength = this.length * this.BYTES_PER_ELEMENT;
					this.buffer = new ArrayBuffer(this.byteLength);
					this.byteOffset = 0;
				***REMOVED*** else if (typeof arguments[0] === 'object' && arguments[0].constructor === ctor) {
					// Constructor(TypedArray array)
					array = arguments[0];

					this.length = array.length;
					this.byteLength = this.length * this.BYTES_PER_ELEMENT;
					this.buffer = new ArrayBuffer(this.byteLength);
					this.byteOffset = 0;

					for (i = 0; i < this.length; i += 1) {
						this._setter(i, array._getter(i));
					***REMOVED***
				***REMOVED*** else if (typeof arguments[0] === 'object' && !(arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
					// Constructor(sequence<type> array)
					sequence = arguments[0];

					this.length = ECMAScript.ToUint32(sequence.length);
					this.byteLength = this.length * this.BYTES_PER_ELEMENT;
					this.buffer = new ArrayBuffer(this.byteLength);
					this.byteOffset = 0;

					for (i = 0; i < this.length; i += 1) {
						s = sequence[i];
						this._setter(i, Number(s));
					***REMOVED***
				***REMOVED*** else if (typeof arguments[0] === 'object' && (arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
					// Constructor(ArrayBuffer buffer,
					// optional unsigned long byteOffset, optional unsigned long length)
					this.buffer = buffer;

					this.byteOffset = ECMAScript.ToUint32(byteOffset);
					if (this.byteOffset > this.buffer.byteLength) {
						throw new_INDEX_SIZE_ERR(); // byteOffset out of range
					***REMOVED***

					if (this.byteOffset % this.BYTES_PER_ELEMENT) {
						// The given byteOffset must be a multiple of the element
						// size of the specific type, otherwise an exception is raised.
						// throw new_INDEX_SIZE_ERR();
						throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
					***REMOVED***

					if (arguments.length < 3) {
						this.byteLength = this.buffer.byteLength - this.byteOffset;

						if (this.byteLength % this.BYTES_PER_ELEMENT) {
							throw new_INDEX_SIZE_ERR(); // length of buffer minus byteOffset not a multiple of the element size
						***REMOVED***
						this.length = this.byteLength / this.BYTES_PER_ELEMENT;
					***REMOVED*** else {
						this.length = ECMAScript.ToUint32(length);
						this.byteLength = this.length * this.BYTES_PER_ELEMENT;
					***REMOVED***

					if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
						throw new_INDEX_SIZE_ERR(); // byteOffset and length reference an area beyond the end of the buffer
					***REMOVED***
				***REMOVED*** else {
					throw new TypeError("Unexpected argument type(s)");
				***REMOVED***

				this.constructor = ctor;

				configureProperties(this);
				makeArrayAccessors(this);
			***REMOVED***;

			ctor.prototype = new ArrayBufferView();
			ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
			ctor.prototype._pack = pack;
			ctor.prototype._unpack = unpack;
			ctor.BYTES_PER_ELEMENT = bytesPerElement;

			// getter type (unsigned long index);
			ctor.prototype._getter = function(index) {
				if (arguments.length < 1) {
					throw new SyntaxError("Not enough arguments");
				***REMOVED***

				index = ECMAScript.ToUint32(index);
				if (index >= this.length) {
					// throw new_INDEX_SIZE_ERR(); // Array index out of range
					return (void 0); // undefined
				***REMOVED***

				var bytes = [], i, o;
				for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT; i < this.BYTES_PER_ELEMENT; i += 1, o += 1) {
					bytes.push(this.buffer._bytes[o]);
				***REMOVED***
				return this._unpack(bytes);
			***REMOVED***;

			// NONSTANDARD: convenience alias for getter: type get(unsigned long index);
			ctor.prototype.get = ctor.prototype._getter;

			// setter void (unsigned long index, type value);
			ctor.prototype._setter = function(index, value) {
				if (arguments.length < 2) {
					throw new SyntaxError("Not enough arguments");
				***REMOVED***

				index = ECMAScript.ToUint32(index);
				if (index >= this.length) {
					// throw new_INDEX_SIZE_ERR(); // Array index out of range
					return;
				***REMOVED***

				var bytes = this._pack(value), i, o;
				for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT; i < this.BYTES_PER_ELEMENT; i += 1, o += 1) {
					this.buffer._bytes[o] = bytes[i];
				***REMOVED***
			***REMOVED***;

			// void set(TypedArray array, optional unsigned long offset);
			// void set(sequence<type> array, optional unsigned long offset);
			ctor.prototype.set = function(index, value) {
				if (arguments.length < 1) {
					throw new SyntaxError("Not enough arguments");
				***REMOVED***
				var array, sequence, offset, len, i, s, d, byteOffset, byteLength, tmp;

				if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
					// void set(TypedArray array, optional unsigned long offset);
					array = arguments[0];
					offset = ECMAScript.ToUint32(arguments[1]);

					if (offset + array.length > this.length) {
						throw new_INDEX_SIZE_ERR(); // Offset plus length of array is out of range
					***REMOVED***

					byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
					byteLength = array.length * this.BYTES_PER_ELEMENT;

					if (array.buffer === this.buffer) {
						tmp = [];
						for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
							tmp[i] = array.buffer._bytes[s];
						***REMOVED***
						for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
							this.buffer._bytes[d] = tmp[i];
						***REMOVED***
					***REMOVED*** else {
						for (i = 0, s = array.byteOffset, d = byteOffset; i < byteLength; i += 1, s += 1, d += 1) {
							this.buffer._bytes[d] = array.buffer._bytes[s];
						***REMOVED***
					***REMOVED***
				***REMOVED*** else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
					// void set(sequence<type> array, optional unsigned long offset);
					sequence = arguments[0];
					len = ECMAScript.ToUint32(sequence.length);
					offset = ECMAScript.ToUint32(arguments[1]);

					if (offset + len > this.length) {
						throw new_INDEX_SIZE_ERR(); // Offset plus length of array is out of range
					***REMOVED***

					for (i = 0; i < len; i += 1) {
						s = sequence[i];
						this._setter(offset + i, Number(s));
					***REMOVED***
				***REMOVED*** else {
					throw new TypeError("Unexpected argument type(s)");
				***REMOVED***
			***REMOVED***;

			// TypedArray subarray(long begin, optional long end);
			ctor.prototype.subarray = function(start, end) {
				function clamp(v, min, max) {
					return v < min ? min : v > max ? max : v;
				***REMOVED***

				start = ECMAScript.ToInt32(start);
				end = ECMAScript.ToInt32(end);

				if (arguments.length < 1) {
					start = 0;
				***REMOVED***
				if (arguments.length < 2) {
					end = this.length;
				***REMOVED***

				if (start < 0) {
					start = this.length + start;
				***REMOVED***
				if (end < 0) {
					end = this.length + end;
				***REMOVED***

				start = clamp(start, 0, this.length);
				end = clamp(end, 0, this.length);

				var len = end - start;
				if (len < 0) {
					len = 0;
				***REMOVED***

				return new this.constructor(this.buffer, start * this.BYTES_PER_ELEMENT, len);
			***REMOVED***;

			return ctor;
		***REMOVED***

		var Int8Array = makeTypedArrayConstructor(1, packInt8, unpackInt8);
		var Uint8Array = makeTypedArrayConstructor(1, packUint8, unpackUint8);
		var Int16Array = makeTypedArrayConstructor(2, packInt16, unpackInt16);
		var Uint16Array = makeTypedArrayConstructor(2, packUint16, unpackUint16);
		var Int32Array = makeTypedArrayConstructor(4, packInt32, unpackInt32);
		var Uint32Array = makeTypedArrayConstructor(4, packUint32, unpackUint32);
		var Float32Array = makeTypedArrayConstructor(4, packFloat32, unpackFloat32);
		var Float64Array = makeTypedArrayConstructor(8, packFloat64, unpackFloat64);

		if (USE_NATIVE_IF_AVAILABLE) {
			global.ArrayBuffer = global.ArrayBuffer || ArrayBuffer;
			global.Int8Array = global.Int8Array || Int8Array;
			global.Uint8Array = global.Uint8Array || Uint8Array;
			global.Int16Array = global.Int16Array || Int16Array;
			global.Uint16Array = global.Uint16Array || Uint16Array;
			global.Int32Array = global.Int32Array || Int32Array;
			global.Uint32Array = global.Uint32Array || Uint32Array;
			global.Float32Array = global.Float32Array || Float32Array;
			global.Float64Array = global.Float64Array || Float64Array;
		***REMOVED*** else {
			global.ArrayBuffer = ArrayBuffer;
			global.Int8Array = Int8Array;
			global.Uint8Array = Uint8Array;
			global.Int16Array = Int16Array;
			global.Uint16Array = Uint16Array;
			global.Int32Array = Int32Array;
			global.Uint32Array = Uint32Array;
			global.Float32Array = Float32Array;
			global.Float64Array = Float64Array;
		***REMOVED***
	***REMOVED***());

	//
	// 6 The DataView View Type
	//
	(function() {
		function r(array, index) {
			return ECMAScript.IsCallable(array.get) ? array.get(index) : array[index];
		***REMOVED***

		var IS_BIG_ENDIAN = (function() {
			var u16array = new Uint16Array([ 0x1234 ]), u8array = new Uint8Array(u16array.buffer);
			return r(u8array, 0) === 0x12;
		***REMOVED***());

		// Constructor(ArrayBuffer buffer,
		// optional unsigned long byteOffset,
		// optional unsigned long byteLength)
		/** @constructor */
		var DataView = function DataView(buffer, byteOffset, byteLength) {
			if (arguments.length === 0) {
				buffer = new ArrayBuffer(0);
			***REMOVED*** else if (!(buffer instanceof ArrayBuffer || ECMAScript.Class(buffer) === 'ArrayBuffer')) {
				throw new TypeError("TypeError");
			***REMOVED***

			this.buffer = buffer || new ArrayBuffer(0);

			this.byteOffset = ECMAScript.ToUint32(byteOffset);
			if (this.byteOffset > this.buffer.byteLength) {
				throw new_INDEX_SIZE_ERR(); // byteOffset out of range
			***REMOVED***

			if (arguments.length < 3) {
				this.byteLength = this.buffer.byteLength - this.byteOffset;
			***REMOVED*** else {
				this.byteLength = ECMAScript.ToUint32(byteLength);
			***REMOVED***

			if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
				throw new_INDEX_SIZE_ERR(); // byteOffset and length reference an area beyond the end of the buffer
			***REMOVED***

			configureProperties(this);
		***REMOVED***;

		// TODO: Reintroduce this to get correct hierarchy
		// if (typeof ArrayBufferView === 'function') {
		// DataView.prototype = new ArrayBufferView();
		// ***REMOVED***

		function makeDataView_getter(arrayType) {
			return function(byteOffset, littleEndian) {

				byteOffset = ECMAScript.ToUint32(byteOffset);

				if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
					throw new_INDEX_SIZE_ERR(); // Array index out of range
				***REMOVED***
				byteOffset += this.byteOffset;

				var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT), bytes = [], i;
				for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
					bytes.push(r(uint8Array, i));
				***REMOVED***

				if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
					bytes.reverse();
				***REMOVED***

				return r(new arrayType(new Uint8Array(bytes).buffer), 0);
			***REMOVED***;
		***REMOVED***

		DataView.prototype.getUint8 = makeDataView_getter(Uint8Array);
		DataView.prototype.getInt8 = makeDataView_getter(Int8Array);
		DataView.prototype.getUint16 = makeDataView_getter(Uint16Array);
		DataView.prototype.getInt16 = makeDataView_getter(Int16Array);
		DataView.prototype.getUint32 = makeDataView_getter(Uint32Array);
		DataView.prototype.getInt32 = makeDataView_getter(Int32Array);
		DataView.prototype.getFloat32 = makeDataView_getter(Float32Array);
		DataView.prototype.getFloat64 = makeDataView_getter(Float64Array);

		function makeDataView_setter(arrayType) {
			return function(byteOffset, value, littleEndian) {

				byteOffset = ECMAScript.ToUint32(byteOffset);
				if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
					throw new_INDEX_SIZE_ERR(); // Array index out of range
				***REMOVED***

				// Get bytes
				var typeArray = new arrayType([ value ]), byteArray = new Uint8Array(typeArray.buffer), bytes = [], i, byteView;

				for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
					bytes.push(r(byteArray, i));
				***REMOVED***

				// Flip if necessary
				if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
					bytes.reverse();
				***REMOVED***

				// Write them
				byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
				byteView.set(bytes);
			***REMOVED***;
		***REMOVED***

		DataView.prototype.setUint8 = makeDataView_setter(Uint8Array);
		DataView.prototype.setInt8 = makeDataView_setter(Int8Array);
		DataView.prototype.setUint16 = makeDataView_setter(Uint16Array);
		DataView.prototype.setInt16 = makeDataView_setter(Int16Array);
		DataView.prototype.setUint32 = makeDataView_setter(Uint32Array);
		DataView.prototype.setInt32 = makeDataView_setter(Int32Array);
		DataView.prototype.setFloat32 = makeDataView_setter(Float32Array);
		DataView.prototype.setFloat64 = makeDataView_setter(Float64Array);

		if (USE_NATIVE_IF_AVAILABLE) {
			global.DataView = global.DataView || DataView;
		***REMOVED*** else {
			global.DataView = DataView;
		***REMOVED***

	***REMOVED***());

***REMOVED***(this));
