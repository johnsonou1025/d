  var DChar = function () {
  var chart = null;
  var ChartData = "";
  var options = {
        chart: {
            renderTo: 'container',
            width: 200,
            height: 200,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: '#eee'

        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                size: 10,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: false
            }
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            labelFormatter: function () {
                return this.name + ' : ' + this.y;
            }
        },
        series: [{
            type: 'pie',
            size: '110%',
            innerSize: '86%',
        }]
    };
	
var Data = '[{"code":"1","name":"game1","y":100.0000,"color":"#cf5958"},{"code":"2","name":"game2","y":200.0000,"color":"#c1c1c1"}]';

var getChartData = function () {
debugger;
	ChartData = JSON.parse(Data);
	options.series[0].data = ChartData;
	chart = new Highcharts.Chart(options);
	return ChartData;
}

 return {
        Init: function () {
			getChartData();
        },
    };
}();

               