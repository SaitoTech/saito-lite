var requestFileSystem = window.webkitRequestFileSystem || window.mozRequestFileSystem || window.msRequestFileSystem || window.requestFileSystem;
var URL = "lorem.zip", FILENAME = "lorem.txt";
var filesystem, zipFs = new zip.fs.FS();

function onerror(message) {
	console.error(message);
***REMOVED***

function removeRecursively(entry, onend, onerror) {
	var rootReader = entry.createReader();
	rootReader.readEntries(function(entries) {
		var i = 0;

		function next() {
			i++;
			removeNextEntry();
		***REMOVED***

		function removeNextEntry() {
			var entry = entries[i];
			if (entry) {
				if (entry.isDirectory)
					removeRecursively(entry, next, onerror);
				if (entry.isFile)
					entry.remove(next, onerror);
			***REMOVED*** else
				onend();
		***REMOVED***

		removeNextEntry();
	***REMOVED***, onerror);
***REMOVED***

function importZipToFilesystem(callback) {
	zipFs.importHttpContent(URL, false, function() {
		filesystem.root.getFile(FILENAME, {
			create : true
		***REMOVED***, function(fileEntry) {
			var zippedFile = zipFs.root.getChildByName(FILENAME);
			zippedFile.getFileEntry(fileEntry, callback, null, onerror);
		***REMOVED***, onerror);
	***REMOVED***, onerror);
***REMOVED***

function logFile(file) {
	var reader = new FileReader();
	reader.onload = function(event) {
		console.log(event.target.result);
		console.log("--------------");
	***REMOVED***;
	reader.onerror = onerror;
	reader.readAsText(file);
***REMOVED***

function test() {
	importZipToFilesystem(function() {
		filesystem.root.getFile(FILENAME, null, function(fileEntry) {
			fileEntry.file(logFile, onerror);
		***REMOVED***, onerror);
	***REMOVED***, onerror);
***REMOVED***

requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(fs) {
	filesystem = fs;
	removeRecursively(filesystem.root, test, onerror);
***REMOVED***, onerror);
