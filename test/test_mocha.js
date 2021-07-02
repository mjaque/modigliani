'use strict'

//Instalar con: npm install --save-dev mocha

//Ejecutar el test con: ./node_modules/mocha/bin/mocha
//O definir el script en package.json y ejecutar: npm test

var assert = require('assert')
describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal([1, 2, 3].indexOf(4), -1)
		})
	});
})

