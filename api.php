<?php
//$ORIGEN = __DIR__.'/photoCollection.json';
$ORIGEN = __DIR__.'/santiago_segura.json';
//$ORIGEN = __DIR__.'/photoCollection.json';

$action = isset($_REQUEST['a']) ? $_REQUEST['a'] : 'list';

switch ($action) {
    case 'list':
        header('Content-Type: application/json');
        readfile($ORIGEN);
        break;
}