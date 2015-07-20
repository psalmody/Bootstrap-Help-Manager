<?php

require('../mysql-creds.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT * FROM bhm_help_pages ORDER BY url";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $data = $_POST['model'];
    $sql = "INSERT INTO bhm_help_pages(id,url) VALUES('$data[id]','$data[url]')";
    $result = $db->query($sql) or die(mysqli_error($db));
    echo "added";
    break;

    case 'DELETE':
    parse_str(urldecode(file_get_contents("php://input")),$data);
    $model = $data['model'];
    $sql = "DELETE FROM bhm_help_pages WHERE id=$model[id]";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}
?>
