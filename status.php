<?php
	require_once('appload.php');
	require_once INC . "/db_class.php";
	
	
	$act = $_REQUEST['act'];
	$gid = $_REQUEST['gid'];
	
	if ($gid == '')
		$gid = $_REQUEST['groupId'];
	
	/*if (!preg_match('/^[0-9]+$/',$gid)) {
		echo json_encode(-1);
		exit;
	}*/
	
	$wcstatus = new wcStatus($gid);
	
	$db = new db_class();
	$db->connect();
	
	if ($act == 'add') {
		$wcstatus->add();
		echo json_encode('added');
	}
	elseif ($act == 'addpost') {
		$wcstatus->addpost();
		echo json_encode('added');
	}
	elseif ($act == 'editpost') {
		$wcstatus->create();
		echo json_encode('updated');
	}
	else if ($act == 'get') {
		$arr = $wcstatus->getAll();
		echo json_encode($arr);
	}
	else if ($act == 'check') {
		$status = $wcstatus->getStatus();
		echo json_encode(array('status'=>$status));
	}
	else if ($act == 'delpost') {
		$status = $wcstatus->delpost();
		echo json_encode($status);
	}
	else if ($act == 'changeContact') {
		$status = $wcstatus->changeContact();
		echo json_encode($status);
	}
	else if ($act == 'changeEmail') {
		$status = $wcstatus->changeEmail();
		echo json_encode($status);
	}
	else {
		echo json_encode('The action exist');
	}
	$db->close();
	unset($db);
	exit;
	
?>