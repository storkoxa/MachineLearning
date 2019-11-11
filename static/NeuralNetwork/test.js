var fs = require('fs');


fs.readFile('data.mat', function(err, buff) {
	console.log(buff.length)

	for (i = 0; i < 405; i++)
         console.log(buff[i]);
});