$(function(){

	// 總資金用圓餅圖
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
		    type: 'doughnut',
		    data: {
		        labels: ["主帐户", "财神馆", "金誉城", "其他"],
		        datasets: [{
		            data: [1999, 1999, 599, 387],
		            backgroundColor: [
		                '#F9B300',
		                '#FDDC18',
		                '#F37E10',
		                '#4AA9A6'
		            ],
		            borderColor: [
		                '#F9B300',
		                '#FDDC18',
		                '#F37E10',
		                '#4AA9A6'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		    	// 隱藏上方label
		        legend: {
		            display: false,
		         },
		        // 隨DIV縮放
		        responsive: true,
		        // maintainAspectRatio: true,
		        // 動畫增加縮放
		        animation:{
			        animateScale: true,
			    },
			    // 控制內圓大小
			    cutoutPercentage: 34.375,
		    },
		});

});