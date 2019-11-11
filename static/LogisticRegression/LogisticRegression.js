var data = null;
var predictions = new Array();

var file = "data.txt"

var theta = null;
var mean = null;
var std = null;


var dataLoaded = false

/**
*  P5
**/
var pointsSize = 11;

function preload() {
	$.get(file, function(response) {
			datax = response.split("\n")
			datax.forEach((line) => {
				if (data == null) {
					data = math.matrix([line.split(",")])
				} else {
					data = math.concat(data, [line.split(",")], 0);
				}					
			});

			$("#calculate").prop('disabled', false);
			dataLoaded = true
			createTable(10);
	});
}

function setup(){
	var myCanvas = createCanvas(500, 500);
 	myCanvas.parent("canvas");
 	rectMode(CENTER);
}

function draw(){
	background(0)
	translate(width/2, height/2);

	if (data == null)
		return;
	size = math.size(data)
	for (i = 0; i <= size.get([0]) - 1; i++) {
		fill(255)
		x = data.get([i, 0])
		y = data.get([i, 1])
		if (data.get([i, 4]) == 0) {
			fill(255, 0, 0)
		}
		else {
			fill(0, 255, 0)
		}
		circle(c(x), c(y), 5); // rect(x, y, width, height)
	}

	//predictions
	push()
	strokeWeight(1);
	stroke(255);
	predictions.forEach(e => {
		if (e.color) fill(e.color)
		else fill("gray")
		circle(c(e.x), c(e.y), 10)
	})
	pop();
}


//Click on the screen, add new point for the predictions points.
function mouseClicked() {
	if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
	  	x = map(mouseX, 0, width, -pointsSize, pointsSize)
	  	y = map(mouseY, height, 0, pointsSize, -pointsSize)
	  	predictions.push(createVector(x, y))
	}
}

//convert numberts between -pointSize to pointSize into screen size;
c = (x) => map(x, -pointsSize, pointsSize, -width/2, width/2);





$(document).ready(function() {
    $("#calculate").click(function(){
    	iterations = $("#iterations").val() 
		alpha = $("#alpha").val()
		lambda = $("#lambda").val()

        //create a matrix mx1 with zeros
        theta = math.zeros(math.size(data).get([1]), 1)
        //split column y
        y = ml.getYCol(data)

        //split all column X 
        X = ml.getXMatrix(data)
        originalX = X.clone();

        //normalize X
        dataNormalized = normalize(X)


        X = dataNormalized.X;
        mean = dataNormalized.mean;
        std = dataNormalized.std;

        //add 1 column with 1 for theta 0
        X = ml.addInterceptTerm(X)	
        result =  ml.logisticGradientRegression(ml.jCostLogisticRegression, X, y, theta, iterations, lambda, alpha)

        theta = result.theta;

		createJCostChart(result)

		updateResult(result, originalX)
		$("#predict").prop('disabled', false);
    }); 
    

    $("#predict").click(function(){
    	if ((theta == null) || (mean == null) || (std == null))
    		return
		if (predictions.length > 0) {
			X = predictions.map(p => [p.x, p.y, p.x*p.x, p.y*p.y] )		
			var Xm = math.matrix(X);
			result = ml.predictLogisticGradient(Xm, mean, std, theta)

			predictions.forEach((e, i) => {
				r = result.get([i, 0])
				if (r >= 0.5)
					e.color = "green"
				else
					e.color = "red"
			})
		}		
    });


    $("#fillP").click(function() {
		predictions = new Array();
    	for (i = -pointsSize; i <= pointsSize; i += 0.3 )
    		for (j = -pointsSize; j <= pointsSize; j += 0.3 ) {
    			predictions.push({x: i, y: j})
    		}
    })

	$("#cleanP").click(function() {
		console.log("clear")
		predictions = new Array();
    })
    
});





//Create JCostChart
function createJCostChart(result) {
	var ctx = document.getElementById('JCost').getContext('2d');
	var myLineChart = new Chart(ctx, 
		{
			"type":"line",
			"data": {
				"labels" : new Array(result.JCost.length),
				"datasets":[
					{
						"label" : "JCost per iteration",
						"data" : result.JCost,
						"fill": false,
						"borderColor" : "rgb(75, 192, 192)" ,
						"lineTension" : 0.1
					}
				]
			},
			"options" : {}
		})
}



/**
*  HTML
**/

var updateResult = (result, originalX) => {
	$("#theta-result").empty();
	
	let theta = result.theta;
	let jsonGrap = result.JCost;

	size = math.size(theta)
	for (i=0; i < size.get([0]); i++)
		$("#theta-result").append("<p>theta" + i + " = " + theta.get([i, 0]) + "</p>")
	$("#theta-result").append("<p>JCost: " + jsonGrap[jsonGrap.length-1] + "</p>")


	X = originalX.clone();
	
	result = ml.predictLogisticGradient(X, mean, std, theta)
	totalRight = 0;

	for (i = 0; i < result._size[0]; i++) {
		totalRight += (Math.round(result.get([i, 0])) == data.get([i, data._size[1] - 1]))? 1 : 0;

	}
	$("#theta-result").append("<p>%: " + (totalRight /result._size[0])  + "</p>")


}





var createTable = (entries) => {

	let table = $("#data");
	table.empty();

	size = math.size(data)
	table.append("<tr id='header'></tr>");

	for (i = 0; i < size.get([1]) - 1; i++) {
		$("#data tr:first").append("<th>theta" + i + "</th>")
	}
	$("#data tr:first").append("<th class=result>y</th>")



	for (i = 0; i < math.min(entries, math.size(data).get([0])); i++) {
		table.append("<tr></tr>");		
		for (j = 0; j < size.get([1]); j++) {
			$("#data tr:last").append("<td>" + data.get([i, j]) + "</td>")
		}		
	}

}



