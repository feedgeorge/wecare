<?php

class wcAjax {

	function load_header() {
		if (isset($_SERVER['HTTP_ORIGIN'])) {
			header("Access-Control-Allow-Origin: " . SITEURL);
			header('Access-Control-Allow-Credentials: true');
			header('Access-Control-Max-Age: 86400');    // cache for 1 day
			header("Access-Control-Allow-Methods: POST, OPTIONS"); 
		}

		// Access-Control headers are received during OPTIONS requests
		if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
				header("Access-Control-Allow-Methods: POST, OPTIONS");         

			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
				header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

			exit(0);
		}
		
	}

	public function getStatusMsg($code) {
		return $this->codes[$code];
	}
	
	public function sendResponse($obj, $content_type = 'text/plain',$lang='utf-8') {
	
		//$status_header = 'HTTP/1.1 ' . $status . ' ' . $this->getStatusMsg($status);  
		// set the status  
		//header($status_header);  
		// set the content type  
		header('Content-type: ' . $content_type .'; charset='.$lang);  
		
		//$this->writeLog($msg . ' - ' .$status);
		
		echo json_encode($obj);
	}

}

?>