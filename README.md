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

	# Git

	## Descargar
	Para obtener la última versión (--depth 1 evita bajar todo el historial):
		git clone --depth 1 https://github.com/mjaque/modigliani

	Para obtener una versión específica
		git clone --depth 1 --branch v1.0 https://github.com/mjaque/modigliani

	## Branch & Merge
	Para hacer una rama y combinarla:
		git branch <nombre_rama>
		git checkout <nombre_rama>

		git commit -m 'Mensaje del commit en la rama nueva'

		Si hace falta cambiar a la rama master
		git checkout master
		git commit -m 'Mensaje del commit en la rama master'

		Para combinar ambas (desde la rama master)
		git merge <nombre_rama>

		Como ya no hace falta la rama, podemos borrarla
		git branch -d <nombre_rama>
