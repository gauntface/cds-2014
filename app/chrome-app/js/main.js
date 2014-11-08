'use strict';

window.addEventListener('load', function() {
  var webview = document.querySelector('#foo');
  webview.addEventListener('permissionrequest', function(e) {
   e.request.allow();
  });
});
