<?php

define('TEMPNAME','wecare');
define('TEMPPATH',SITEPATH . '/themes/' . TEMPNAME .'/');
define('DATADIR', SITEPATH . '/content/data/' );

define('APIKEY','');
define('SITEDOMAIN','wecare.my');
define('SITEURL','http://www.wecare.my');
define('SITETITLE','WECARE - E-Community FeedBack System ');
define('SITEDESC','For a better place');
define('SITELONGDESC','');

define('TEMPURL', SITEURL . '/themes/' . TEMPNAME .'/');


define('adminemail','support@wecare.my');
define('noreply','noreply@wecare.my');

/*$WC['cat'] = array(1=>'Feedback',2=>'Events',3=>'Poll');
$WC['post_status'] = array('All','Open | Being Attended','Open | Being Unattended','Closed | Being Unattended','Closed');
$WC['SUBTYPE'] = array(1=>'Crime',2=>'Complaint',3=>'Others');*/

//$WC['cat'] = array('1'=>'Feedback','1-1'=>'Feedback-Infrastructure','1-2'=>'Feedback-Crime','1-3'=>'Community Notices',2=>'Events',3=>'Poll','1-4'=>'Others');
//$WC['post_status'] = array('All','Open | Being Attended','Open | Being Unattended','Closed | Being Unattended','Closed');
$WC['cat'] = array('1'=>'Feedback','1-1'=>'Infrastructure','1-2'=>'Crime','1-3'=>'Announcements',2=>'Events',3=>'Survey','1-4'=>'Others');
$WC['post_status'] = array('All','Awaiting attention','Acknowledged','Solved','Unsolved');

$WC['SUBTYPE'] = array(
	'1-1' => array(
		 1 => 'Roads',
		 2 => 'Street & Traffic Lights',
		 3 => 'Parks',
		 4 => 'Buildings',
		 5 => 'Information Request',
		 6 => 'Others',
	),
	'1-2' => array(
		7 => 'Snatch Thieves',
		8 => 'Break-Ins',
		9 =>  'Car Thefts',
		10 => 'Others',
		),
	'2' => array(
		11 => 'City-Wide Events',
		12 => 'Community Events',
	),
);


//Database setting
$DB['host'] = 'mysql.wecare.my';
$DB['login'] = 'wecaremy';
$DB['passwd'] = 'gVnhCThU!2#4';
$DB['db'] = 'wecare_my';

?>