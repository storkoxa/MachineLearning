var data = null
var alpha;
var iterations;
var prediction; 

var file = "data.txt"
var jsonGrap = new Array();





//Create JCostChart
function createJCostChart() {
	var ctx = document.getElementById('JCost').getContext('2d');
	var myLineChart = new Chart(ctx, 
		{
			"type":"line",
			"data": {
				"labels" : new Array(jsonGrap.length),
				"datasets":[
					{
						"label" : "JCost per iteration",
						"data" : jsonGrap,
						"fill": false,
						"borderColor" : "rgb(75, 192, 192)" ,
						"lineTension" : 0.1
					}
				]
			},
			"options" : {}
		})
}



//Load the data.txt in memory + html table
var loadData = () => {
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

			createTable(10);
	});
}



/**
* hypothesis = (current theta values) * X
* error =  hypothesis - results
* JCost = sum(error^2)/ 2m (m is the size of the dataset)
**/
var JCost = (X, y, theta) => {
	let h = math.multiply(X, theta)
	let error = math.subtract(h, y)
	let error_sqr = math.dotPow(error, 2)
	return math.sum(error_sqr) / (2 * y._size[1])
}


/**
* for n iterations
*     calculate Hypothesis, Error
*	  theta_change = X' * error
*	  theta = theta - learning_rate/m * theta_change

*	  we push jcost to save and visualize the graph
**/
var gradientDescentMulti = (X, y, theta) => {
	jsonGrap = new Array();
	for (i = 0; i < iterations; i++) {
		let h = math.multiply(X, theta)
		let error = math.subtract(h, y)
		thetaChange = math.multiply(math.transpose(X),error)
		theta = math.subtract(theta,  math.divide( math.multiply(alpha, thetaChange) , y._size[0]) )
		jsonGrap.push(JCost(X, y, theta))

	}
	return theta;
}

/**
* feature normalize will return 3 things
*  normalized M (M - MEAN ./ STD)
*  mean (mean of each column)
*  std (Standard deviation) of each colum
**/
var featureNormalize = (M) => {
	mean = math.zeros(1, M._size[1]);
	std = math.zeros(1, M._size[1]);
	for (i = 0; i < M._size[1]; i++) {
		col = getCol(M, i)
		std  = math.subset(std, math.index(0, i), math.std(col));
		mean  = math.subset(mean, math.index(0, i), math.mean(col));
	}

	var mu_matrix = math.multiply(math.ones(M._size[0], 1), mean)
	var std_matrix =  math.multiply(math.ones(M._size[0], 1), std)
	
	var X_norm = math.dotDivide(math.subtract(M, mu_matrix), std_matrix);

	return [X_norm, mean, std];
}


/**
* For X, we have to normalise, add 1 then multiply by our theta
**/
var predict = (X, mean, std, theta) => {

	var mu_matrix = math.multiply(math.ones(X._size[0], 1), mean)
	var std_matrix =  math.multiply(math.ones(X._size[0], 1), std)

	var X = math.dotDivide(math.subtract(X, mu_matrix), std_matrix);

	X = addInterceptTerm(X)
	
	return math.multiply(X, theta)
}



$(document).ready(function() {
	loadData()



    $("#calculate").click(function(){
    	iterations = $("#iterations").val() 
		alpha = $("#alpha").val()
		prediction = $("#prediction").val()
        //create a matrix mx1 with zeros
        theta = math.zeros(math.size(data).get([1]), 1)
        //split column y
        y = getYCol(data)
        //split all column X 
        X = getXMatrix(data)
        //normalize X
        XN_mean_std = featureNormalize(X)
        //X is normalized 
        X = XN_mean_std[0]
        //add 1 column with 1 for theta 0
        X = addInterceptTerm(X)	
        theta = gradientDescentMulti(X, y, theta)

        //console.log(theta)
		createJCostChart()

		//prediction
		if (prediction != null && prediction != "") {
			var p = math.matrix(JSON.parse(prediction));
			result = predict(p, XN_mean_std[1],  XN_mean_std[2], theta)
			updateTable(p, result)
		}




    }); 
});




var updateTable = (p, result) => {
	let table = $("#data");

	console.log(result)
	pm = math.size(p).get([0]);
	pn = math.size(p).get([1]);
	console.log(result)
	for (i = 0; i < pm; i++) {
		table.append("<tr></tr>");		
		for (j = 0; j < pn; j++) {
			$("#data tr:last").append("<td class='prediction'>" + p.get([i, j]) + "</td>")
		}		
		$("#data tr:last").append("<td class='prediction'>" + result.get([i, 0]) + "</td>")
	}


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







var addInterceptTerm = (M) => {
	return math.concat(math.ones(M._size[0], 1), M)
}

var getRow = (M, i) => { 
	return math.flatten(M.subset(math.index(i, math.range(0, M._size[1])))).toArray(); 
}
var getCol = (M, i) => { 
	return math.flatten(M.subset(math.index(math.range(0, M._size[0]),i))).toArray();
}
var getYCol = (M) => {
	return M.subset(math.index(math.range(0, M._size[0]),[M._size[1] - 1]))
}
var getXMatrix = (M) => {
	return M.subset(math.index(math.range(0, M._size[0]), math.range(0, M._size[1] - 1) ))
}