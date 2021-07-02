# Modigliani
Modigliani es una aplicación CRUD (Create, Read, Update, Delete) para la gestión de Cuadros. 

# Dependencias
Requiere:
	- Selenium IDE para la ejecución de las pruebas automáticas.
	- JsDoc para la generación automática de la documentación.
	- Mocha para pruebas unitarias.

## JsDoc Instalación:
	sudo apt install npm
	npm install jsdoc

### Ejecución:
	./node_modules/jsdoc/jsdoc.js -d doc src/js/*
	
## Mocha Instalación:
	npm install --save-dev mocha

### Ejecución de Tests
	./node_modules/mocha/bin/mocha

	O definir el script en package.json y ejecutar: npm test


