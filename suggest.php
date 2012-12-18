<?php
	require_once('appload.php');
	require_once INC . "/db_class.php";
	
	$act = $_REQUEST['act'];
	
	$wcstatus = new wcStatus($gid);
	
	$db = new db_class();
	$db->connect();
	
	if ($act == 'addplace') {
		$place = $_POST['place'];
		$sql = 'insert into newplaces (id, place, user_id, dt_created) values (null,%s,%s,now())';
		$db->query($db->prepare($sql,$place,$userid));
		echo json_encode(1);
	}
	else if ($act == 'addemail') {
		$email = $_POST['nemail'];
		$sql = 'insert into emails (id, email, dt_created) values (null,%s,now())';
		$db->query($db->prepare($sql,$email,$userid));
		echo json_encode(1);
	}
	else
		echo json_encode(-1);
	
	$db->close();
	unset($db);
	exit;
	
?>