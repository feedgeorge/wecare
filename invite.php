<?php
	require_once('appload.php');
	
	$act = $_REQUEST['act'];
	
	if ($act == 'invite') {
		$email = $_REQUEST['femail'];
		$msg = $_REQUEST['fcontent'];
		$subject = 'Your friend share from Wecare';
		mailTo($email,$subject,$msg);
		echo json_encode(1);
	}
	else
		echo json_encode(-1);
		
	exit;
	
?>