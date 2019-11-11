var color = Chart.helpers.color;
var scatterChartData = {
	datasets: [{
		label: 'Red',
		xAxisID: 'x-axis-1',
		yAxisID: 'y-axis-1',
		borderColor: 'rgba(0, 255, 0, 1)',
		backgroundColor: 'rgba(0, 255, 0, .8)'
	}, {
		label: 'Blue',
		xAxisID: 'x-axis-1',
		yAxisID: 'y-axis-2',
		borderColor: 'rgba(0, 0, 255, 1)',
		backgroundColor: 'rgba(0, 0, 255, .8)'
	}, {
		label: 'Border',
		xAxisID: 'x-axis-1',
		yAxisID: 'y-axis-2',
		borderColor: 'rgba(100, 100, 100, 1)',
		backgroundColor: 'rgba(100, 100, 100, .8)'
	}


	]
}

$(document).ready(function() {
	//create the chart
	var ctx = document.getElementById('canvas').getContext('2d');
	window.myScatter = Chart.Scatter(ctx, {
		data: scatterChartData,
		options: {
			responsive: true,
			hoverMode: 'nearest',
			intersect: true,
			title: {
				display: true,
				text: 'Green and Blues'
			},
			scales: {
				xAxes: [{
					position: 'bottom',
					gridLines: { zeroLineColor: 'rgba(255,0,0,1)' }
				}],
				yAxes: [{
					type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
					display: true,
					position: 'left',
					id: 'y-axis-1',

				}, {
					type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
					display: true,
					position: 'right',
					reverse: true,
					id: 'y-axis-2',
					gridLines: { drawOnChartArea: false },
				}],
			}
		}
	});


});

var updateGraph = (points) => {
	scatterChartData.datasets[0].data = points[0]
	scatterChartData.datasets[1].data = points[1]
	scatterChartData.datasets[2].data = [{x: 5, y: 5}, {x: -5, y: 5}, {x: 5, y: -5}, {x:-5, y: -5}, {x: 0, y: 0}]
	window.myScatter.update();
}
