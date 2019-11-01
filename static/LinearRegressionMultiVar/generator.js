
const fs = require('fs');
data = [];



function r(minmax) { // min and max included 
  return Math.floor(Math.random() * (minmax[1] - minmax[0] + 1) + minmax[0]);
}


function fake() {
	size = [50, 3000];
	rooms = [1, 5]
	distance = [0, 10000]

	for (let i = 0; i < 1000; i++) {
		let s = r(size);
		let ro = r(rooms);
		let d = r(distance);
		let price = r([-200, 200]) + 10 * s + ro * ro * 20 + ((100000 - d) * 100);
		data.push([s, ro, d, Math.ceil( price / 100) * 100 ])
	}


}


fake();

var file = fs.createWriteStream('data.txt');
file.on('error', function(err) { /* error handling */ });
data.forEach(function(v) { file.write(v.join(', ') + '\n'); });
file.end();