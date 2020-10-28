var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Photograph extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Photograph";
    this.description = "Take a photo and upload it to the Saito Blockchain";
    this.categories = "Utitlities";
    this.video = null;
    this.canvas = null;
    this.canvas_context = null;
    this.isStreamInit = false;

    this.image = "";

    this.cancel_callback = null;
    this.success_callback = null;

    this.constraints = {
      audio: false,
      video: {
        facingMode: 'environment'
      }
    }

    return this;

  }

  takePhotograph(success_callback = null, cancel_callback = null) {

    this.success_callback = success_callback;
    this.cancel_callback = cancel_callback;

    document.body.innerHTML = this.returnCameraHTML();
    this.addCameraEvents();

    this.start(
      document.getElementById("qr-video"),
      document.getElementById("qr-canvas")
    );

  }


  attachEvents(app) {

    let scanner_self = this;

    document.querySelector('.take-photo-btn').addEventListener('click', (e) => {

      let cameramod = app.modules.returnModule("Photograph");
      if (cameramod != null) {
        cameramod.takePhotograph(
          function (img) {
            document.body.innerHTML = "<p>You took this image:</p>";
            document.body.appendChild(img);
          },
          function () {
            alert("Cancel");
          }
        );
      }

    });

  }



  async start(video, canvas) {

    this.video = video
    this.canvas = canvas;
    this.canvas_context = this.canvas.getContext("2d");

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(stream);
    } catch (err) {
    }

    this.startCameraLoop();
  }



  startCameraLoop() {

    //
    // we try to write an image from the camera to the canvas
    // if it succeeds, then we attach the events to the buttons
    // that must be showing on the camera screen
    //
    x = this.attemptVideoCapture();
    if (x == 1) {
      //
      // attach event to button
      //
      document.querySelector(".capture-btn").addEventListener('click', (e) => {
        this.captureImage();
      });

    } else {
      setTimeout(() => {
        this.startCameraLoop();
      }, 100);
    }

  }





  //
  // main loop sending messages to quirc_worker to detect qrcodes on the page
  //
  attemptVideoCapture() {
    if (this.isStreamInit) {
      try {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas_context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        if (this.canvas.width == 0) { return 0; }
      } catch (err) {
        console.log("ERROR: " + err);
        return 0;
      }
    }

    return 1;
  }


  captureImage() {

    //
    // take another (refreshed) image
    //
    this.attemptVideoCapture();
    this.isStreamInit = false;

    //
    // grab image
    //
    var image = new Image();
    image.id = "pic";
    image.src = this.canvas.toDataURL();

    //
    // run callback if exists
    //
    if (this.success_callback != null) {
      document.querySelector('.preview-img').append(image);
      document.querySelector('.capture-preview').style.top = 0;
      this.image = image.src;
      return;
    }

    //
    // or just display
    //
    //document.body.innerHTML = "";
    //document.body.appendChild(image);

    return 1;

  }






  handleSuccess(stream) {
    window.stream = stream;
    this.video.srcObject = stream;
    this.isStreamInit = true;
  }




  returnCameraHTML() {

    document.querySelector('body').style.overflow = 'hidden';
    //document.querySelector('body').style.background_color = '#444';

    return `

      <div class="qrscanner-container">
      <div id="qr-target" class="qr-target"></div>
      <div id="outline" class="outline"></div>
      <div class="video-container">
        <video playsinline autoplay id="qr-video" style="height: 100vh;width: 100vw;"></video>
      </div>
      <canvas style="display: none" id="qr-canvas"></canvas>
      <div id="capture-btn" class="capture-btn" style="bottom:40px;left:50vw;transform:translate(-50%,0);position:absolute;width:10vw;height:10vw;z-index:10;background-color:white;border-radius:10vw;">
        <div style="width:8vw;height:8vw;margin:1vw;background-color:#888;border-radius:10vw;"></div>
      </div>
      <div class="capture-close"></div>
      </div>
      <div class="capture-preview">
        <div class="preview-img">
        </div>
        <div class="preview-controls">
        <div class="capture-accept">✔</div>
        <div class="capture-cancel">✘</div>
        </div>
      </div>
      <style>
      .capture-close {
        position: absolute;
        right: 32px;
        top: 32px;
        width: 32px;
        height: 32px;
        opacity: 0.3;
        background-color: #dddd;
        border-radius: 5px;
      }
      .capture-close:hover {
        opacity: 1;
      }
      .capture-close:before, .capture-close:after {
        position: absolute;
        left: 15px;
        content: ' ';
        height: 33px;
        width: 2px;
        background-color: #333;
      }
      .capture-close:before {
        transform: rotate(45deg);
      }
      .capture-close:after {
        transform: rotate(-45deg);
      }
      .preview-controls {
        display: flex;
        justify-content: space-around;
        position: absolute;
        bottom: 5vh;
        width: 100vw;
        height: 5vh;
      }
      .preview-controls div {
        width: 5vw;
        height: 5vw;
        border: 1px solid var(--saito-red);
        border-radius: 5vw;
        text-align: center;
        line-height: 5.5vw;
        font-size: 3vh;
        font-weight: bolder;
        background-color: var(--saito-red);
        color: #fff;
        cursor: pointer;
        }
        .preview-img {
        height: 90vh;
        position: relative;
      }
      .capture-preview {
        z-index: 15;
        position: absolute;
        top: -101vh;
        width: 100vw;
        height: 100vh;
        background-color: #000d;
      }
      img#pic {
        margin: auto;
        display: block;
        position: relative;
        top: 50%;
        transform: translate(0, -50%);
      }
      </style>

 `;

  }
  addCameraEvents() {

    var camera_self = this;

    document.querySelector('.capture-cancel').addEventListener('click', function () {
      document.querySelector('.capture-preview').style.top = "-101vh";
      document.querySelector('.preview-img').innerHTML = "";
    });

    document.querySelector('.capture-close').addEventListener('click', this.cancel_callback);

    document.querySelector('.capture-accept').addEventListener('click', function () {
      camera_self.success_callback(camera_self.image);
    });

  }

}

module.exports = Photograph;

