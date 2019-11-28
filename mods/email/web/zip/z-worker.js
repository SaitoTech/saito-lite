/* jshint worker:true */
(function main(global) {
	"use strict";

	if (global.zWorkerInitialized)
		throw new Error('z-worker.js should be run only once');
	global.zWorkerInitialized = true;

	addEventListener("message", function(event) {
		var message = event.data, type = message.type, sn = message.sn;
		var handler = handlers[type];
		if (handler) {
			try {
				handler(message);
			***REMOVED*** catch (e) {
				onError(type, sn, e);
			***REMOVED***
		***REMOVED***
		//for debug
		//postMessage({type: 'echo', originalType: type, sn: sn***REMOVED***);
	***REMOVED***);

	var handlers = {
		importScripts: doImportScripts,
		newTask: newTask,
		append: processData,
		flush: processData,
	***REMOVED***;

	// deflater/inflater tasks indexed by serial numbers
	var tasks = {***REMOVED***;

	function doImportScripts(msg) {
		if (msg.scripts && msg.scripts.length > 0)
			importScripts.apply(undefined, msg.scripts);
		postMessage({type: 'importScripts'***REMOVED***);
	***REMOVED***

	function newTask(msg) {
		var CodecClass = global[msg.codecClass];
		var sn = msg.sn;
		if (tasks[sn])
			throw Error('duplicated sn');
		tasks[sn] =  {
			codec: new CodecClass(msg.options),
			crcInput: msg.crcType === 'input',
			crcOutput: msg.crcType === 'output',
			crc: new Crc32(),
		***REMOVED***;
		postMessage({type: 'newTask', sn: sn***REMOVED***);
	***REMOVED***

	// performance may not be supported
	var now = global.performance ? global.performance.now.bind(global.performance) : Date.now;

	function processData(msg) {
		var sn = msg.sn, type = msg.type, input = msg.data;
		var task = tasks[sn];
		// allow creating codec on first append
		if (!task && msg.codecClass) {
			newTask(msg);
			task = tasks[sn];
		***REMOVED***
		var isAppend = type === 'append';
		var start = now();
		var output;
		if (isAppend) {
			try {
				output = task.codec.append(input, function onprogress(loaded) {
					postMessage({type: 'progress', sn: sn, loaded: loaded***REMOVED***);
				***REMOVED***);
			***REMOVED*** catch (e) {
				delete tasks[sn];
				throw e;
			***REMOVED***
		***REMOVED*** else {
			delete tasks[sn];
			output = task.codec.flush();
		***REMOVED***
		var codecTime = now() - start;

		start = now();
		if (input && task.crcInput)
			task.crc.append(input);
		if (output && task.crcOutput)
			task.crc.append(output);
		var crcTime = now() - start;

		var rmsg = {type: type, sn: sn, codecTime: codecTime, crcTime: crcTime***REMOVED***;
		var transferables = [];
		if (output) {
			rmsg.data = output;
			transferables.push(output.buffer);
		***REMOVED***
		if (!isAppend && (task.crcInput || task.crcOutput))
			rmsg.crc = task.crc.get();
		
		// posting a message with transferables will fail on IE10
		try {
			postMessage(rmsg, transferables);
		***REMOVED*** catch(ex) {
			postMessage(rmsg); // retry without transferables
		***REMOVED***
	***REMOVED***

	function onError(type, sn, e) {
		var msg = {
			type: type,
			sn: sn,
			error: formatError(e)
		***REMOVED***;
		postMessage(msg);
	***REMOVED***

	function formatError(e) {
		return { message: e.message, stack: e.stack ***REMOVED***;
	***REMOVED***

	// Crc32 code copied from file zip.js
	function Crc32() {
		this.crc = -1;
	***REMOVED***
	Crc32.prototype.append = function append(data) {
		var crc = this.crc | 0, table = this.table;
		for (var offset = 0, len = data.length | 0; offset < len; offset++)
			crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
		this.crc = crc;
	***REMOVED***;
	Crc32.prototype.get = function get() {
		return ~this.crc;
	***REMOVED***;
	Crc32.prototype.table = (function() {
		var i, j, t, table = []; // Uint32Array is actually slower than []
		for (i = 0; i < 256; i++) {
			t = i;
			for (j = 0; j < 8; j++)
				if (t & 1)
					t = (t >>> 1) ^ 0xEDB88320;
				else
					t = t >>> 1;
			table[i] = t;
		***REMOVED***
		return table;
	***REMOVED***)();

	// "no-op" codec
	function NOOP() {***REMOVED***
	global.NOOP = NOOP;
	NOOP.prototype.append = function append(bytes, onprogress) {
		return bytes;
	***REMOVED***;
	NOOP.prototype.flush = function flush() {***REMOVED***;
***REMOVED***)(this);
