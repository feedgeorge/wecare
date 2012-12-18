<?php

function load_action($page,$act) {

	switch($page) {
		case 'group':
			$groups = new Groups();
			$groups->load_action($act);
			break;
		
		case 'post':
			$groups = new Groups();
			$groups->load_action($act);
			break;
		
		case 'user':
			$user = new Users();
			$user->load_action($act);
			break;
		
		case 'api':
			
			load_ajax($act);
			break;
		
		default:
			break;
	}
	
}

function load_ajax($func) {

	switch($func) {
		case 'status':
			require_once(SITEPATH . '/wcapi.php');
			break;
		
		case 'invite':
			require_once(SITEPATH . '/invite.php');
			break;
		
		
		default:
			break;
	}
}

?>