	$(document).ready(function() {
		var now_tab_page = 1; 
		var $tab = $(this)
		$("#tab1").stop(false, true).fadeIn().siblings().hide();
		var li_length = $('ul.tabs li').length;
		console.log(li_length);

		$('ul.tabs li').click(function() {
			var $a = $(this).find('a');
			now_tab_page = $a.attr('page');
			clickTab = $a.attr('href');
			$(clickTab).stop(false, true).fadeIn().siblings().hide();
		});
		
		$('#prev').click(function() {
			now_tab_page -= 1;
			var prevPage = "#tab" + now_tab_page;
			$(prevPage).stop(false, true).fadeIn().siblings().hide();
			if(now_tab_page < 1 ){now_tab_page = 1;}
		});
		
		$('#next').click(function() {
			now_tab_page += 1;
			var nextPage = "#tab" + now_tab_page;
			$(nextPage).stop(false, true).fadeIn().siblings().hide();
			if(now_tab_page>li_length){now_tab_page = li_length;}			
		});		
	});
	