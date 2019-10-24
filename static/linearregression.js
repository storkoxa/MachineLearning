points = []

var x0 = 0.0;
var x1 = 0.0



function fx(x)  {
	return x0 + (x * x1);
}

function setup() {
	createCanvas(500, 500);
	background(0)
}

function mouseClicked() {
	if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
	  	x = map(mouseX, 0, width, 0, 1)
	  	y = map(mouseY, 0, height, 1, 0)
	  	points.push(createVector(x, y))

	}
}

function convergence() {
	if (points.length == 0)
		return;
	const lrate = 0.1
	x0p = 0
	x1p = 0
	points.forEach((p) => {
		guess = fx(p.x)
		error = guess - p.y
		x0p = x0p + (error)
		x1p = x1p + (error * p.x)

	}) 
	x0 = x0 - lrate / points.length * x0p
	x1 = x1 - lrate / points.length * x1p
}


function draw() {
	convergence()

	background(0)

	stroke(255)
	strokeWeight(3)
	points.forEach((v) => {
		x = map(v.x, 0, 1, 0, width);
		y = map(v.y, 0, 1, height, 0)
		point(x, y)
	})

	stroke(0, 255, 0);
	linecv(0, fx(0), 1, fx(1))


}

function linecv(x1, y1, x2, y2) {
	xa = map(x1, 0, 1, 0, width)
	xb = map(x2, 0, 1, 0, width)

	ya = map(y1, 0, 1, height, 0)
	yb = map(y2, 0, 1, height, 0)

	line(xa, ya, xb, yb)
}