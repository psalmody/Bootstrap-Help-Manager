<?php
require('mysql-creds.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT *
            FROM bhm_help_modals";
    if (isset($_GET['page_id'])) {
        $sql .= " WHERE help_page_id = $_GET[page_id] ";
    }
    $sql .= " ORDER BY field_selecter, title";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $data = json_decode($_POST['data']);
    foreach($data as $k=>$v) {
        $data->$k = $db->escape_string($v);
    }
    $sql = "INSERT INTO
                bhm_help_modals (id,help_page_id,field_selecter,title,large,html)
            VALUES ('$data->id',
                    (SELECT id FROM bhm_help_pages WHERE url='$data->filename'),
                    '$data->field_selecter',
                    '$data->title',
                    '$data->large',
                    '$data->html')
            ON DUPLICATE KEY UPDATE
                field_selecter = '$data->field_selecter',
                title = '$data->title',
                large = '$data->large',
                html = '$data->html'";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo "saved";
    break;

    case 'DELETE':
    $data = json_decode(file_get_contents("php://input"));
    $sql = "DELETE FROM bhm_help_modals WHERE id='$data->id'";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}

?>
