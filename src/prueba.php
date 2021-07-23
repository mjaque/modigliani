<?php

echo openssl_encrypt('{"user": Pepe}', "AES-128-CBC", "supersecreto");
echo "<br/>";
echo openssl_decrypt('09V7KigSQtIEuEjYzw9Sdg==', "AES-128-CBC", "supersecreto");

