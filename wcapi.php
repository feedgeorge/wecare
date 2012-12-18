<?php
	global $db;
	
	require_once INC . '/db_class.php';
	require_once INC . '/ajax_func.php';
	
	$wcaj = new wcAjax();
	
	//$wcaj->load_header();
	
	$mtd = $_REQUEST['mtd'];
	$gid = $_REQUEST['gid'];
	
	if (empty($gid) && isset($_REQUEST['groupId']) ) $gid = $_REQUEST['groupId'];
	
	if (!preg_match('/^[0-9]+$/',$gid)) {
		$wcaj->sendResponse(-1);
		exit;
	}
	
	$db = new db_class();
	$db->connect();
			
	$wcstatus = new wcStatus($gid);
    
	if ($mtd == 'add') {
		$wcstatus->add();
		$wcaj->sendResponse(1);
	}
	elseif ($mtd == 'addpost') {
		$wcstatus->addpost();
		$wcaj->sendResponse(1);
	}
    elseif ($mtd == 'addgrp') {
		$status = $wcstatus->addGroup();
		$wcaj->sendResponse($status);
	}
	elseif ($mtd == 'editpost') {
		$wcstatus->create();
		$wcaj->sendResponse(1);
	}
	else if ($mtd == 'get') {
		$arr = $wcstatus->getAll();
		//echo json_encode($arr);
		$wcaj->sendResponse($arr);
	}
	else if ($mtd == 'check') {
		$status = $wcstatus->getStatus();
		//echo json_encode(array('status'=>$status));
		$wcaj->sendResponse(array('status'=>$status));
	}
	else if ($mtd == 'delpost') {
		$status = $wcstatus->delpost();
		//echo json_encode($status);
		$wcaj->sendResponse($status);
	}
	else if ($mtd == 'changeContact') {
		$status = $wcstatus->changeContact();
		//echo json_encode($status);
		$wcaj->sendResponse($status);
	}
	else if ($mtd == 'changeEmail') {
			
		$status = $wcstatus->changeEmail();
	
		//echo json_encode($status);
		$wcaj->sendResponse($status);
	}
	else {
		//Action Not exist
		$wcaj->sendResponse(-2);
	}
	$db->close();
	unset($db);
	
	exit;
	
?>