
	$(function(){
		// 預設顯示第一個 Tab
		var _showTab = 0;
		$('.abgne_tab').each(function(){
			// 目前的頁籤區塊
			var $tab = $(this);

			var $defaultLi = $('ul.tabs li', $tab).eq(_showTab).addClass('active');
			$($defaultLi.find('a').attr('href')).siblings().hide();
			
			// 當 li 頁籤被點擊時...
			// 若要改成滑鼠移到 li 頁籤就切換時, 把 click 改成 mouseover
			$('ul.tabs li', $tab).click(function() {
				// 找出 li 中的超連結 href(#id)
				var $this = $(this),
					_clickTab = $this.find('a').attr('href');
				// 把目前點擊到的 li 頁籤加上 .active
				// 並把兄弟元素中有 .active 的都移除 class
				$this.addClass('active').siblings('.active').removeClass('active');
				// 淡入相對應的內容並隱藏兄弟元素
				$(_clickTab).stop(false, true).fadeIn().siblings().hide();

				return false;
			}).find('a').focus(function(){
				this.blur();
			});
		});
	});

	$('ul.tabs li').click(function() {
			var $a = $(this).find('a');
			now_tab_page = $a.attr('page');
			clickTab = $a.attr('href');
			$(clickTab).stop(false, true).fadeIn().siblings().hide();
			prev_page = parseInt(now_tab_page)-1;
			next_page = parseInt(now_tab_page)+1;
			console.log(prev_page);
			console.log(next_page);
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
		
			
	});
