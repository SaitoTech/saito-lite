var URL = "lorem_store.zip";

var zipFs = new zip.fs.FS();

function onerror(message) {
	console.error(message);
***REMOVED***

function zipImportedZip(callback) {
	var directory = zipFs.root.addDirectory("import");
	directory.importHttpContent(URL, false, function() {
		zipFs.exportBlob(callback);
	***REMOVED***, onerror);
***REMOVED***

function unzipBlob(blob, callback) {
	zipFs.importBlob(blob, function() {
		var directory = zipFs.root.getChildByName("import");
		var firstEntry = directory.children[0];
		firstEntry.getText(callback);
	***REMOVED***, onerror);
***REMOVED***

function logText(text) {
	console.log(text);
	console.log("--------------");
***REMOVED***

zipImportedZip(function(zippedBlob) {
	unzipBlob(zippedBlob, function(unzippedText) {
		logText(unzippedText);
	***REMOVED***);
***REMOVED***);
