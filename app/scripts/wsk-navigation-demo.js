'use strict';

window.addEventListener('load', function() {
  var demoSlide = document.querySelector('#wsk-navigation-demo');
  var demoIFrame = demoSlide.querySelector('iframe');
  var largeButton = demoSlide.querySelector('.large-btn');
  var mediumButton = demoSlide.querySelector('.medium-btn');
  var smallButton = demoSlide.querySelector('.small-btn');

  if (!largeButton && !mediumButton && !smallButton) {
    console.log('Unable to find one of the buttons [L,M,S].', largeButton,
      mediumButton, smallButton);
    return;
  }
  largeButton.addEventListener('click', function() {
    demoIFrame.classList.remove('small');
    demoIFrame.classList.remove('medium');
    demoIFrame.classList.add('large');
  });

  mediumButton.addEventListener('click', function() {
    demoIFrame.classList.remove('small');
    demoIFrame.classList.remove('large');
    demoIFrame.classList.add('medium');
  });

  smallButton.addEventListener('click', function() {
    demoIFrame.classList.remove('medium');
    demoIFrame.classList.remove('large');
    demoIFrame.classList.add('small');
  });
});
