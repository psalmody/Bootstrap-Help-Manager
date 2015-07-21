<?php
require('../mysql-creds.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    //select and group concat relationships
    $sql = "SELECT bhm_helpers.*, pages.page_ids
            FROM bhm_helpers
            left join (
                SELECT
                    help_id,
                    GROUP_CONCAT(DISTINCT page_id) as page_ids
                FROM bhm_relationships
                GROUP BY help_id)
            pages
            on pages.help_id = bhm_helpers.id
            ORDER BY field_selecter, title";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data, JSON_PRETTY_PRINT);
    break;

    case 'POST':
    $data = $_POST['model'];
    foreach($data as $k=>$v) {
        $data[$k] = $db->escape_string($v);
    }
    $sql = "INSERT INTO
                bhm_helpers (id,field_selecter,title,large,html)
            VALUES ('$data[id]',
                    '$data[field_selecter]',
                    '$data[title]',
                    '$data[large]',
                    '$data[html]')
            ON DUPLICATE KEY UPDATE
                field_selecter = '$data[field_selecter]',
                title = '$data[title]',
                large = '$data[large]',
                html = '$data[html]'";
    $res = $db->query($sql) or die(mysqli_error($db));
    //delete old relationships
    $sql = "DELETE FROM bhm_relationships WHERE help_id = $data[id]";
    $res = $db->query($sql) or die(mysqli_error($db));
    //add new relationships
    $page_ids = explode(',',$data['page_ids']);
    foreach($page_ids as $page_id) {
        $sql = "INSERT INTO bhm_relationships (help_id, page_id) VALUES ($data[id], $page_id)";
        $res = $db->query($sql) or die(mysqli_error($db));
    }
    echo "saved";
    break;

    case 'DELETE':
    parse_str(urldecode(file_get_contents("php://input")),$data);
    $model = $data['model'];
    //delete helper
    $sql = "DELETE FROM bhm_helpers WHERE id='$model[id]'";
    $res = $db->query($sql) or die(mysqli_error($db));
    //delete relationships
    $sql = "DELETE FROM bhm_relationships WHERE help_id = $model[id]";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}

?>
