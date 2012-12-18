<?php
	require_once('appload.php');
	
	
	$page = $_REQUEST['page'];
	$action = $_REQUEST['act'];
	
	if (isset($action))
		load_action($page,$action);
	else
		load_page($page);
	
	exit(1);
?>