<?php
	require_once('appload.php');
	require_once INC . "/db_class.php";
	
	$act = $_REQUEST['act'];
	$gid = $_REQUEST['gid'];
	$feed = new wcFeed($gid);
	
	$db = new db_class();
	$db->connect();
	
	if ($act == 'get') {
		$url = $feed->getLists();
		echo json_encode($url);
	}
	
	$db->close();
	unset($db);
	exit;
	
?>