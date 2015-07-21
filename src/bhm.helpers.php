<?php
require('../mysql-creds.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT *
            FROM bhm_help_modals";
    if (isset($_GET['collection']['page_id'])) {
        $pageid = $_GET['collection']['page_id'];
        $sql .= " WHERE help_page_id = $pageid ";
    }
    $sql .= " ORDER BY field_selecter, title";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $data = $_POST['model'];
    foreach($data as $k=>$v) {
        $data[$k] = $db->escape_string($v);
    }
    $sql = "INSERT INTO
                bhm_help_modals (id,help_page_id,field_selecter,title,large,html)
            VALUES ('$data[id]',
                    '$data[help_page_id]',
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
    echo "saved";
    break;

    case 'DELETE':
    parse_str(urldecode(file_get_contents("php://input")),$data);
    $model = $data['model'];
    $sql = "DELETE FROM bhm_help_modals WHERE id='$model[id]'";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}

?>
