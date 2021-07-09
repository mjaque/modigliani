# Modigliani
Modigliani es una aplicación CRUD (Create, Read, Update, Delete) para la gestión de Cuadros.

# Dependencias
Requiere:
	- Selenium IDE para la ejecución de las pruebas automáticas.
	- JsDoc para la generación automática de la documentación de JavaScript (fronend).
	- PHPDocumentor para la generación automática de la documentación de PHP (backend)
	- Mocha para pruebas unitarias.

## JsDoc Instalación:
	Referencia en https://jsdoc.app/
	sudo apt install npm
	npm install jsdoc

### Ejecución:
	./node_modules/jsdoc/jsdoc.js -d doc/js src/js/*

## PHPDocumentor Instalación:
	Referencia en https://phpdoc.org/
	Descargar https://phpdoc.org/phpDocumentor.phar
	Dar permisos de ejecución: chmod u+x phpDocumentor.phar

### Ejecución:
	./src/phpDocumentor.phar -d ./src -t ./doc/php

## Mocha Instalación:
	Referencia en https://mochajs.org/
	npm install --save-dev mocha

### Ejecución de Tests
	./node_modules/mocha/bin/mocha

	O definir el script en package.json y ejecutar: npm test
