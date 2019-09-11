'use strict';

$('li').on('click', function(){
  $(this).fadeOut(750);
  console.log('this is our this:', this);
  // 'this' is the event.target
});

$('#form').submit((e) => {
  e.preventDefault();
	console.log('form submitted')
})


$().ready(
  console.log( "ready!" )
);