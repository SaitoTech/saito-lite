document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
      document.getElementById('content').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
        document.getElementById('interactive');
        document.getElementById('lottie').style.display="none";
        document.getElementById('content').style.visibility="visible";
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