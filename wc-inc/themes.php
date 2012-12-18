<?php
	
function get_template($temp) {
	$tempfile = get_temp_dir() . $temp . '.html';
	
	if (file_exists($tempfile)) {
		return $tempfile;
	}

	return false;
}

function get_temp_dir() {
	return TEMPPATH;
}

function get_temp_url() {
	return TEMPURL;
}

function get_header($class='',$header='') {
	global $headertitle;
	
	if ($header!='') $headertitle = $header;
	
	load_header();
	
	if ($class == '') $class = 'page_inside';
	require_once get_temp_dir() .'header.html';
}


function get_footer() {
	require_once get_temp_dir() .'footer.html';
}


function get_leftsidebar() {
	require_once get_temp_dir() .'leftsidebar.html';
}

function get_sidebar() {
	require_once get_temp_dir() .'sidebar.html';
}

function get_homeurl() {
	return SITEURL;
}

function load_template($tempfile,$params=null) {
	
	if (file_exists($tempfile)) {
		$file = $tempfile;
	}
	
	require_once $file;
}


function load_page($page) {
	global $headertitle;
	
	if (empty($page)) $page = 'home';
	if ($tempfile = get_template($page)) {
		$headertitle = strtoupper($page);
		load_template($tempfile);
	}
	else
		echo 'The ' . $page . ' page not exisit';
}

function load_banners() {
	
	$bannerdir = TEMPPATH . 'images/banners';
	
	if($banners = scandir($bannerdir)) {
		foreach($banners as $img) {
			if (preg_match('/\.(jpg|jpeg|gif|png)$/',$img)) {
				echo '<a href="" onclick="return false;" style="cursor:default"><img src="'.get_homeurl().'/images/banners/'.$img.'"  alt="Slide 1"></a>';
			}
		}
	}
}


function load_header() {
	/*//if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: http://developer.feedgeorge.com");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
    //}

    // Access-Control headers are received during OPTIONS requests
    //if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        //exit(0);
    //}
	*/
}

function load_title() {
	
	echo SITETITLE;
}

function site_title() {
	echo SITETITLE;
}

function site_shortDesc() {
	echo SITEDESC;
}

function site_longDesc() {
	echo SITELONGDESC;
}

?>