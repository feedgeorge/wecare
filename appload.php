<?php
	session_start();

	define('SITEPATH',dirname(__FILE__));

	define('INC', SITEPATH . '/wc-inc' );
	
	
	require_once INC . "/db_class.php";
	require_once INC . "/config.php";
	require_once INC . "/themes.php";
	require_once INC . "/functions.php";
	require_once INC . "/action.php";
	require_once INC . "/user.php";
	require_once INC . "/users.php";
	require_once INC . "/groups.php";
	require_once INC . "/wc_api.php";
	require_once INC . "/wcfeed.php";
	//$wc_user = new User();
?>