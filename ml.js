var math = require('mathjs');


sigmoid = (z) => {
	return math.dotDivide(1.0 , math.add(1, math.dotPow(Math.E, math.multiply(-1, z))) ) 
}



normalize = (X_) => {
	X = X_.clone();

	var mean = math.zeros(1, X._size[1]);
	var std = math.zeros(1, X._size[1]);
	for (i = 0; i < X._size[1]; i++) {
		col = getCol(X, i)
		std  = math.subset(std, math.index(0, i), math.std(col));
		mean  = math.subset(mean, math.index(0, i), math.mean(col));
	}

	var mu_matrix = math.multiply(math.ones(X._size[0], 1), mean)
	var std_matrix =  math.multiply(math.ones(X._size[0], 1), std)
	
	var X_norm = math.dotDivide(math.subtract(X, mu_matrix), std_matrix);
	return { 'X': X_norm, 'mean': mean, 'std': std };
}


//Compute cost and gradient for logistic regression with regularization
jCostLogisticRegression = (X, y, theta_, lambda) => {
	let theta = theta_.clone();

	let m = math.size(y).get([0]);

	let thetaByX = math.multiply(X, theta);
	
	let h = sigmoid(thetaByX); //hypothesis 

	theta.subset(math.index(0, 0), 0);

	let lambdaBy2m = (lambda / (2 * m));
	let regularization = math.multiply(lambdaBy2m, math.multiply(math.transpose(theta), theta)); 

	let negativeY = math.multiply(-1, y);

	let yEqual1 = math.multiply(math.transpose(negativeY), math.log(h) )
	let yEqual0 = math.multiply(math.transpose(math.subtract(1, y)), math.log(math.subtract(1, h)))


	let jcost = math.add(math.multiply((1/m),  math.subtract(yEqual1, yEqual0)) , regularization) 
	J = jcost.subset(math.index(0, 0))


	let gradRegularization = math.multiply(lambda/m, theta); 
	let	grad = math.add(math.multiply((1/m), math.multiply(math.transpose(X) ,	math.subtract(h, y))),	gradRegularization);



	return {'JCost': J, 'grad': grad }
}

//DO we need alpha?
logisticGradientRegression = (jCostFunc, X, y, theta_, iterations, lambda = 0.01, alpha = 0.03) => {
	let theta = theta_.clone();
	let m = math.size(y).get([0]);

	var jcost = new Array();
	for (i = 0; i < iterations; i++) {
		result = jCostFunc(X, y, theta, lambda)
		jcost.push(result.JCost)

		//alpha/m should be on the 1's place
		theta = math.subtract(theta, math.multiply( 1 , result.grad))
	}
	return {'theta': theta, 'JCost': jcost }  ;
}


oneVsAll = (X, y, lambda, iterations, progressCallBack = null) => {
	const labels = y.toArray().map(x => x[0]).filter((x, i, a) => a.indexOf(x) == i);;
	const m = X._size[0];
	const n = X._size[1];
	var allTheta = null;

	console.log("total labels " + labels.length)
	labels.forEach((v, i) => {
		console.log("Leaning: " + v)
		var newY =  math.matrix(y.toArray().map(x => x[0] == v?[1]:[0]));
		var theta = math.zeros(math.size(X).get([1]), 1)

		result = logisticGradientRegression(jCostLogisticRegression, X, newY, theta, iterations, lambda)

		theta = result.theta;
		if (allTheta == null) {
			allTheta = theta.clone();
		}
		else
			allTheta = math.concat(allTheta, theta);

		if (progressCallBack != null) {
			progressCallBack((i + 1) * 100 / labels.length)
		}



	});

	return allTheta;
}


/**
* For X, we have to normalise, add 1 then multiply by our theta
**/
predictLogisticGradient = (X_, mean, std, theta) => {
	let X = X_.clone();

	var mu_matrix = math.multiply(math.ones(X._size[0], 1), mean)
	var std_matrix =  math.multiply(math.ones(X._size[0], 1), std)

	X = math.dotDivide(math.subtract(X, mu_matrix), std_matrix);
	X = addInterceptTerm(X)
	

	return sigmoid(math.multiply(X, theta))
}







addInterceptTerm = (M_) => {
	M = M_.clone();
	return math.concat(math.ones(M._size[0], 1), M)
}

getRow = (M, i) => { 
	return math.flatten(M.subset(math.index(i, math.range(0, M._size[1])))).toArray(); 
}
getCol = (M, i) => { 
	return math.flatten(M.subset(math.index(math.range(0, M._size[0]),i))).toArray();
}
getYCol = (M) => {
	return M.subset(math.index(math.range(0, M._size[0]),[M._size[1] - 1]))
}
getXMatrix = (M) => {
	return M.subset(math.index(math.range(0, M._size[0]), math.range(0, M._size[1] - 1) ))
}




module.exports = { sigmoid, normalize, jCostLogisticRegression, logisticGradientRegression, oneVsAll, predictLogisticGradient, addInterceptTerm, getRow, getCol, getYCol, getXMatrix }