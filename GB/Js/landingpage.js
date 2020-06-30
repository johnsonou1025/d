$('.btn-switch,.btn-switch-on')
.delay(500)
.queue(function (next) { 
  $(this).css('z-index', '3');
  $('.c1').css('display', 'block'); 
  next(); 
});
$('.b1')
.delay(700)
.queue(function (next) { 
  $(this).fadeIn(400);
  next(); 
});
$('.leftmenu')
.delay(2700)
.queue(function (next) { 
  $(this).css('z-index', '3');
  next(); 
});
$('.b2')
.delay(2900)
.queue(function (next) { 
  $(this).fadeIn(400);
  next(); 
});

$(function() {
    if ( $(window).width() < 1279) {
		$('.bet-option4 .wrap,.b3,.statistics-select,.statistics,.b4,.c4_bubble,.c4_04,.btn-close').clearQueue();
		$('.mouse,.mouse_ani')
		.delay(4000)
		.queue(function (next) { 
		  $(this).fadeIn(400);
		  next(); 
		$(window).scroll(function(){
			if ($(window).scrollTop() > 350){
			  $('.bet-option4 .wrap').css("z-index", "3");
			  $('.b3')
			  .delay(200)
			  .queue(function (next) { 
				$(this).fadeIn(400);
				next(); 
			  });
			  $('.statistics-select')
			  .delay(2200)
			  .queue(function (next) { 
				$(this).css('z-index', '4');
				next(); 
			  });
			  $('.statistics')
			  .delay(2200)
			  .queue(function (next) { 
				$(this).css('z-index', '3');
				next(); 
			  });
			  $('.b4,.c4_bubble,.c4_04,.btn-close')
			  .delay(2400)
			  .queue(function (next) { 
				$(this).fadeIn(400);
				next(); 
			  });
			}	
		});
	  });
	}
	else {
		$('.mouse,.mouse_ani').css("display", "none");
		$('.bet-option4 .wrap')
		.delay(4900)
		.queue(function (next) { 
		  $(this).css('z-index', '3');
		  next(); 
		});
		$('.b3')
		.delay(5100)
		.queue(function (next) { 
		  $(this).fadeIn(400);
		  next(); 
		});
		$('.statistics-select')
		.delay(7100)
		.queue(function (next) { 
		  $(this).css('z-index', '4');
		  next(); 
		});
		$('.statistics')
		.delay(7100)
		.queue(function (next) { 
		  $(this).css('z-index', '3');
		  next(); 
		});
		$('.b4,.c4_bubble,.c4_04,.btn-close')
		.delay(7300)
		.queue(function (next) { 
		  $(this).fadeIn(400);
		  next(); 
		});
	}
		
});
$(window).resize(function() {
    if ( $(window).width() < 1279) {
		$('.bet-option4 .wrap,.b3,.statistics-select,.statistics,.b4,.c4_bubble,.c4_04,.btn-close').clearQueue();
		$('.mouse,.mouse_ani')
		.delay(4900)
		.queue(function (next) { 
		  $(this).fadeIn(400);
		  next(); 
	  });
	}
	else {
		$('.mouse,.mouse_ani').css("display", "none");
		/*$('.bet-option4 .wrap')
		.delay(4900)
		.queue(function (next) { 
		  $(this).css('z-index', '3');
		  next(); 
		});
		$('.b3')
		.delay(5100)
		.queue(function (next) { 
		  $(this).fadeIn(400);
		  next(); 
		});
		$('.statistics-select')
		.delay(7100)
		.queue(function (next) { 
		  $(this).css('z-index', '4');
		  next(); 
		});
		$('.statistics')
		.delay(7100)
		.queue(function (next) { 
		  $(this).css('z-index', '3');
		  next(); 
		});
		$('.b4,.c4_bubble,.c4_04,.btn-close')
		.delay(7300)
		.queue(function (next) { 
		  $(this).fadeIn(400);
		  next(); 
		});*/
	}
		
});