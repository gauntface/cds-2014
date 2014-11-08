'use strict';

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var pendingDesktopCaptureRequestId = null;

function startDemoCam() {
  var errorCallback = function(e) {
    console.log('startDemoCam() Reejected!', e);
  };

  // Not showing vendor prefixes.
  navigator.getUserMedia({video: true},
    function(stream) {
      var video = document.querySelector('#DemoVideo');
      if (!video) {
        console.log('No #DemoVideo element found');
        return;
      }

      video.src = window.URL.createObjectURL(stream);

      video.onloadedmetadata = function(e) {
        // Ready to go. Do some stuff.
        startScreenShare();
      };
    }, errorCallback);
}

function startScreenShare() {
  console.log('chrome: ', chrome);
  pendingDesktopCaptureRequestId = chrome.desktopCapture.chooseDesktopMedia(
    ['screen'], function(id) {
      if (!id) {
        console.log('Access rejected.');
        return;
      }
      navigator.getUserMedia({
        audio:false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: id,
            maxWidth: 1920,
            maxHeight: 1200
          }
        }
      }, function(stream) {
        console.log('I can haz screen', stream);
        var video = document.querySelector('#DemoVideo-Screen');
        if (!video) {
          console.log('No #DemoVideo-Screen element found');
          return;
        }

        video.src = window.URL.createObjectURL(stream);

        video.onloadedmetadata = function(e) {
          // Ready to go. Do some stuff.
        };
      }, function(err) {
        console.err('Oops something went wrong');
      });
    }
  );
}

function hasGetUserMedia() {
  return !!(navigator.getUserMedia);
}

if (hasGetUserMedia()) {
  startDemoCam();
  //startScreenShare();
} else {
  // video fallback
}
