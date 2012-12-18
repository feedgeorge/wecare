<?php
	class wcFeed {
		
		function __construct($id) {
			$this->gid = $id;
			$this->feedtbl = 'feed';
			
		}
		
		public function getLists() {
			global $db;
			$url = array();
			$sql = 'select feed_url from ' .$this->feedtbl . ' where group_id = %s and feed_status = 1';
			//echo $db->prepare($sql,$this->gid);
			$rs = $db->query($db->prepare($sql,$this->gid));
			while($row = $db->fetch_assoc($rs)) {
				array_push($url,$row['feed_url']);
			}
			
			return $url;
		}
		
		
		public function call() {
		
		}
	
	
	}
?>