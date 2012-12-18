<?php

function redirect($url) {
	header('location: ' . $url);
	exit;
}


function is_login() {
	/*if (!isset($_SESSION['_u'])) {
		redirect('/');
	}*/
	if (!isset($_COOKIE['_wc_session'])) {
		redirect('/');
	}
}


function is_logined() {
	$user = new Users();
	echo "Login status: " . $_SESSION['_u']['id'] . ' = ' . $user->islogined();
}

function show_selectinput($type,$data='') {
	global $WC;
	
	$array = $WC[$type];
	$output = '';
	if (isset($array) && is_array($array)) {
		foreach($array as $k=>$v) {
		//for($i=0; $i<count($array); $i++) {
			$select = '';
			if ($k == $data) $select = 'selected';
			
			$output .= '<option value="'.$k.'" '.$select.' >'.$v.'</option>';
		}
		
		echo $output;
	}
	
	
	
}

function mailTo($to,$subject,$msg) {
	
	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

	// Additional headers
	$headers .= 'To: '. $to . "\r\n";
	$headers .= 'From: Wecare <'.adminemail.'>' . "\r\n";
	$headers .= 'Bcc: chfoo@feedgeorge.com' . "\r\n";

	// Mail it
	mail($to, $subject, $msg, $headers);
}

?>