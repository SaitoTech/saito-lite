var zipFs = new zip.fs.FS();

function onerror(message) {
	console.error(message);
***REMOVED***

function logText(text) {
	console.log(text);
	console.log("--------------");
***REMOVED***

zipFs.importHttpContent("lorem.zip", false, function() {
	var firstEntry = zipFs.root.children[0];
	firstEntry.getText(function(data) {
		logText(data);
	***REMOVED***);
***REMOVED***, onerror);
