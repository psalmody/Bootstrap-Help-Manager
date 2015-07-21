<?php
require('../mysql-creds.php');

//var_dump($_GET);

function makequery($path) {
    return "SELECT bhm_helpers.* FROM
    bhm_pages, bhm_relationships, bhm_helpers
    WHERE 1=1
    AND bhm_pages.url = '$path'
    AND bhm_pages.id = bhm_relationships.page_id
    AND bhm_relationships.help_id = bhm_helpers.id
    ";
}

$path = $_GET['collection']['pathname'];

$res = $db->query(makequery($path)) or die(mysqli_error($db));

if ($res->num_rows < 1) {
    $index = $_GET['collection']['indexpage'];
    for($i=0; $i < count($index); $i++ ) {
        $p = $path.$index[$i];
        $res = $db->query(makequery($p)) or die(mysqli_error($db));
        if ($res->num_rows > 0) break;
    }
}

echo json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);

?>
