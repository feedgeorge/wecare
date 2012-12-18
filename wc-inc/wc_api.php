<?php

class wc_API {
	
	//private $apikey = 'f8343c8ebd00438983353f03a4ada999';
	private $apikey = 'bc68c914d41a4c7587b8ef86cf95f87e';
	private $apiurl = 'https://developer.feedgeorge.com/';
	private $format = 'array';
	
	function __construct() {
	
	}
	
	
	public function request($method,$params=null) {
		
		if ($params == null) $params = array();
		
		$params['apiKey'] = $this->apikey;
		
		//$post_str = $this->create_url_string($params);
		
		return $this->postRequest($method, $params);
		
		
	}
	
	
	private function postRequest($method,$params) {
		//print_r($params);
		//if (!empty($params) && function_exists('curl_init')) {
			$posturl = $this->apiurl . $method;
			
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $posturl);
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS,$params);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			//curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);
			//curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);     
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2); 
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
			curl_setopt($ch, CURLOPT_TIMEOUT, 30);
			$result = curl_exec($ch);
			curl_close($ch);
			
			unset($ch);
			$array = json_decode($result,true);
			
			return $array;
		//}
		
		//return false;
		
	}
	
	
	private function create_url_string($params) {
		$post_params = array();
		foreach ($params as $key => &$val) {
		  $post_params[] = $key.'='.urlencode($val);
		}
		return implode('&', $post_params);
	}
	
}

$wcapi = new wc_API();

?>