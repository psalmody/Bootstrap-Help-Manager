<?php

require('mysql-creds.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT * FROM bhm_help_pages ORDER BY url";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $data = json_decode($_POST['data']);
    print_r($data);
    $sql = "INSERT INTO bhm_help_pages(id,url) VALUES('$data->id','$data->url')";
    $result = $db->query($sql) or die(mysqli_error($db));
    echo "added";
    break;

    case 'DELETE':
    $data = json_decode(file_get_contents("php://input"));
    $sql = "DELETE FROM bhm_help_pages WHERE id='$data->id'";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}
?>
