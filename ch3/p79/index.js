const {odd, even} = require('./var');
const checkNumber = require('./function');

function checkStringOddEven(str) {
	if (str.length % 2) {
		return odd;
	}
	return even;
}

console.log(checkNumber(10));
console.log(checkStringOddEven('hello'));