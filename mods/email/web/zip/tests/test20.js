var requestFileSystem = window.webkitRequestFileSystem || window.mozRequestFileSystem || window.msRequestFileSystem || window.requestFileSystem;
var filesystem, zipFs = new zip.fs.FS();
var THRESHOLD = 150;

function onerror(message) {
	console.error(message);
***REMOVED***

function generateFs(entry, onend, onerror) {
	var i = 0;

	function next() {
		i++;
		generateNextEntry();
	***REMOVED***

	function generateNextEntry() {
		if (i <= THRESHOLD)
			entry.getFile(i, {
				create: true
			***REMOVED***, next, onerror);
		else
			onend();
	***REMOVED***

	next();
***REMOVED***

function checkZipFileSystemSize() {
	zipFs.root.addFileEntry(filesystem.root, function() {
		console.log(zipFs.root.children.length === THRESHOLD);
	***REMOVED***, onerror);
***REMOVED***

requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(fs) {
	filesystem = fs;
	generateFs(filesystem.root, checkZipFileSystemSize, onerror);
***REMOVED***, onerror);
