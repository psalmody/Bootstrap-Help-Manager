<?php

require('../mysql-creds.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT * FROM bhm_pages ORDER BY url";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $data = $_POST['model'];
    $sql = "INSERT INTO bhm_pages(id,url) VALUES('$data[id]','$data[url]') ON DUPLICATE KEY UPDATE url=VALUES(url)";
    $result = $db->query($sql) or die(mysqli_error($db));
    echo "saved";
    break;

    case 'DELETE':
    parse_str(urldecode(file_get_contents("php://input")),$data);
    $model = $data['model'];
    //delete pages and all relationships
    $sql = "DELETE FROM bhm_pages WHERE id=$model[id]";
    $res = $db->query($sql) or die(mysqli_error($db));
    //delete relationships
    $sql = "DELETE FROM bhm_relationships WHERE page_id=$model[id]";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}
?>
