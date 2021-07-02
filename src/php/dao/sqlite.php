<?php

class MyDB extends SQLite3 {
	function __construct() {
		global $BASEDIR;
		$this->open($BASEDIR.'bd/alumnos.db');
	}
}