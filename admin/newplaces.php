<?php

require_once( dirname(dirname(__FILE__)) . '/appload.php' );
require_once INC . "/db_class.php";

$list = '';
$count = 1;

$db = new db_class();
$db->connect();

$rs = $db->query('select place, user_id,dt_created from newplaces order by dt_created desc');
while($row = $db->fetch_assoc($rs)) {
	
	$list .= '<tr><td>'.$count.'</td><td>'.$row['place'] . '</td><td>' . $row['user_id'] . '</td><td>' . $row['dt_created'] . '</td></tr>' ;
	$count++;
}
$db->free_result($rs);
unset($rs);

$db->close();
unset($db);

include 'header.php';
?>

<div id="onecontainer">
	<h2>Places Suggestion</h2>
	<table>
		<tr>
		<th>No.</th><th width="20%" >Place</th><th>User ID</th><th>Date Submitted</th>
		</tr>
		<?php echo $list ?>
	</table>
</div>
<?php
include 'footer.php';
exit;

?>