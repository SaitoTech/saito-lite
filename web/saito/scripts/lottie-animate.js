document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
    if(document.getElementById('content')){
      document.getElementById('content').style.display="none";
    }
  } else if (state == 'complete') {
    setTimeout(function(){
      document.getElementById('interactive');
      document.getElementById('lottie').style.display="none";
      if (document.getElementById('content')) {
        document.getElementById('content').style.visibility="unset";
        document.getElementById('content').style.display="unset";
      }
    },100);
  }
}

var animation = bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // Required
  path: '/saito/data.json', // Required
  renderer: 'svg', // Required
  loop: true, // Optional
  autoplay: true, // Optional
  name: "Saito loading animation", // Name for future reference. Optional.
});