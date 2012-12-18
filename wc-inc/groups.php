<?php
	class groups {
		function __construct() {
			global $wcapi;
			
			$this->api = $wcapi;
		}
		
		public function load_action($act) {
			switch($act) {
				case 'create':
					$this->create();
					break;
			
				case 'add':
					$this->add();
					break;
				
				case 'id':
					$this->loadpage();
					break;
				
				case 'post':
					$this->loadPost();
					break;
				
				case 'post1':
					load_template(get_template('post1'));
					break;
				
				case 'delete':
					$this->delete();
					break;
				
                case 'edit':
					$this->updateGroup();
					break;
			}
		}
		
		public function loadpage() {
            global $db;
            
			$id = $_REQUEST['gid'];
			if (!empty($id)) {
				$group = $this->get($id);
                
                $db = new db_class();
                $db->connect();
                $wcstatus = new wcStatus($id);
				$extra = $wcstatus->getGroup();
                $db->close();
                unset($db);
                
                
                $group['website'] = $extra['website'];
                $group['page'] = $extra['page'];
                
				load_template(get_template('group'),$group);
			}
			else	
				load_template(get_template('groups'),$group);
		}
		
		
		public function loadpost() {
			$id = $_REQUEST['pid'];
			
			if (!empty($id) && preg_match('/^[0-9]+$/',$id)) {
				$post = $this->getPost($id);
				list($post['status'],$post['tags'],$post['category']) = $this->getStatus($id,$post['groupId'],$post['type']);
				//if (isset($post))
				load_template(get_template('post'),$post);
				
			}
			
			
		}
        
        public function updateGroup() {
            global $db;
			$gid = $_REQUEST['gid'];
            
            is_login();
            if ($gid > 0) {
                $group = $this->get($gid);
                $db = new db_class();
                $db->connect();
                $wcstatus = new wcStatus($gid);
				$extra = $wcstatus->getGroup();
                $db->close();
                unset($db);
                
                $group['website'] = $extra['website'];
                $group['page'] = $extra['page'];
                
                load_template(get_template('editgroupform'),$group);
            }
                
		}
	
		
		public function create() {
			
			$this->showForm();
		}
		
		
		public function add() {
			
			$points = $_REQUEST['gppoly'];
			$name = $_REQUEST['gpname'];
			$desc = $_REQUEST['gpdesc'];
			list($lat,$lng) = split(',',$_REQUEST['gpcenter']);
			
			$result = $this->api->request('group/add',array(
				'groupName' => $name,
				'lat' => $lat,
				'lng'=> $lng,
				'polygon' => $points
				
			));
			
			
			$this->showForm();
			exit;
		}
		
		public function get($id) {
			
			if ($id > 0) {
				$result = $this->api->request('group/info',array(
					'groupId' => $id,
				));
			
				if ($result['success'] == true) {
					return $result['result'];
				}
			}
		}
		
		
		public function getPost($id,$type=1) {
			
			if ($id > 0) {
				$result = $this->api->request('content/get',array(
					'contentId' => $id,
				));
				
				
				if ($result['success'] == true) {
					
					return $result['result']['content'];
				}
			}
		}
		
		private function getStatus($id,$gid,$type) {
			global $WC,$db;
			
			$db = new db_class();
			$db->connect();
			$wcstatus = new wcStatus($gid);
			
			$row = $wcstatus->get($id);
			$db->close();
			unset($db);
			
			if (isset($row)) {
				$status = $row['status'];
				$tags = unserialize($row['tags']);
				$subtype = $row['subtype'];
				$subtype2 = $row['subtype2'];
				
				if ($subtype > 0) {
					$type = $type . '-' . $subtype;
				}
				
				if (is_array($tags) && count($tags)>0)
					$tags = implode(',',$tags);
				
				if ($status == '') {
					$status = 1;
					if ($type == 2) {
					
						$today = new DateTime($current);
						$eventdate = new DateTime($post['eventDate']);

						if ($eventdate < $today) {
							$status = 4;
						}
					
					}
				}
				
				return array(array('id'=>$status,'name'=>$WC['post_status'][$status]),$tags,array('catid'=>$type,'catname'=>$WC['cat'][$type],'subcatname'=>$WC['SUBTYPE'][$type][$subtype2],'subcat1'=>$subtype,'subcat2'=>$subtype2));
			}
		}
		
		private function showForm($new=true) {
			load_template(get_template('groupform'));
		}
	}
	
	
	
		class wcStatus {
		
		function __construct($id) {
			
			$this->gid = $id;
			$this->jsonFile = DATADIR . 'g_' .$this->gid .'.json';
			$this->postTable = 'posts';
            $this->groupTable = 'groups';
			$this->init();
		}
		
		function init() {
			$this->posts = $this->load();
			
		}
		
		/*function add() {
			
			$status = $_REQUEST['status'];
			$contentId = $_REQUEST['cid'];
			$type = $_REQUEST['type'];
			
			$array = array(
				'status' => $status,
				'contentId' => $contentId,
				'groupId' => $this->gid,
				'type' => $type,
				'last_updated' => time()
			);
			
			$this->posts[$contentId] = $array;
			$this->save();
		}*/
		
		function add() {
			global $db;
			
			$status = $_REQUEST['status'];
			$contentId = $_REQUEST['cid'];
			$type = $_REQUEST['type'];
			
			if ($this->check($contentId)) {
				$sql = 'update '.$this->postTable.' set status = %s , dtmodified = now() where cid = %s and gid = %s';
				$db->query($db->prepare($sql,$status,$contentId,$this->gid));
			}
			else {
				$sql = 'insert into '.$this->postTable.' (cid,gid,status,type,dtmodified) values (%s,%s,%s,%s,now())';
				$db->query($db->prepare($sql,$contentId,$this->gid,$status,$type));
			}
            
		}
        
        
        function addGroup() {
			global $db;
			
			$id = $_REQUEST['gid'];
			$name = $_REQUEST['name'];
			$pages = $_REQUEST['pages'];
            $web = $_REQUEST['web'];
			
			if ($this->checkGroup($id)) {
				$sql = 'update '.$this->groupTable.' set name = %s, page = %s, website = %s, dtmodified = now() where id = %s';
				$db->query($db->prepare($sql,$name,$pages,$web,$id));
                return $id;
			}
			else {
				$sql = 'insert into '.$this->groupTable.' (id,name,page,website,dtcreated) values (%s,%s,%s,%s,now())';
				$db->query($db->prepare($sql,$id,$name,$pages,$web));
                return $id;
			}
            
            return -1;
            
		}
		
		
		function create() {
			global $db;
			
			//$status = $_REQUEST['status'];
			$contentId = $_REQUEST['cid'];
			$type = $_REQUEST['posttype'];
			$subtype2 = $_REQUEST['postsubtype'];
			$tags = $_REQUEST['posttags'];
			
			if (!empty($tags)) $tags = serialize($tags);
			
			if (preg_match('/-/',$type)) {
				list($type,$subtype) = split('-',$type);	
			}
			else
				$subtype = 0;
			
			if ($this->check($contentId)) {
				$sql = 'update '.$this->postTable.' set tags = %s,subtype = %s,subtype2 = %s, dtmodified = now() where cid = %s and gid = %s';
				$db->query($db->prepare($sql,$tags,$subtype,$subtype2,$contentId,$this->gid));
				return true;
			}
			else {
				$sql = 'insert into '.$this->postTable.' (cid,gid,type,subtype,subtype2,tags,status,dt_created) values (%s,%s,%s,%s,%s,%s,1,now())';
				$db->query($db->prepare($sql,$contentId,$this->gid,$type,$subtype,$subtype2,$tags));
				return true;
			}
			
			return false;
		}
		
		function addpost() {
			global $db;
			
			$contentId = $_REQUEST['cid'];
			$type = $_REQUEST['posttype'];
			$subtype2 = $_REQUEST['postsubtype'];
			//$tags = $_REQUEST['posttags'];
			$contactno = $_POST['contactno'];
			
			if (!empty($tags)) $tags = serialize($tags);
			
			if (preg_match('/-/',$type)) {
				list($type,$subtype) = split('-',$type);	
			}
			else
				$subtype = 0;
			
			if (preg_match('/^[0-9]+$/',$_POST['ic'])) {
				$ic = $_POST['ic'];
			}
			
			if (preg_match('/^[0-9]+$/',$contentId)) {
				$sql = 'insert into '.$this->postTable.' (cid,gid,type,subtype,subtype2,tags,ic,contactno,status,dt_created) values (%s,%s,%s,%s,%s,%s,%s,%s,1,now())';
				$db->query($db->prepare($sql,$contentId,$this->gid,$type,$subtype,$subtype2,$tags,$ic,$contactno));
				
				return true;
			}
			
			return false;
		}
		
		function changeStatus($contentId,$status) {
			
			if ($this->check($contentId)) {
				$sql = 'update '.$this->postTable.' set status = %s , dtmodified = now() where cid = %s and gid = %s';
				$db->query($db->prepare($sql,$status,$contentId,$this->gid));
				return true;
			}
			return false;
		}
		
		function changeContact() {
			global $db;
			
			//$status = $_REQUEST['status'];
			$uid = $_REQUEST['uid'];
			$contact = $_REQUEST['contactno'];
			
			
			
			if ($this->checkuser($uid)) {
				$sql = 'update users set contact = %s where id = %s';
				$db->query($db->prepare($sql,$contact,$uid));
			}
			else {
				$sql = 'insert into users (id,contact,dt_created) values (%s,%s,now())';
				$db->query($db->prepare($sql,$uid,$contact));
			}
		}
		
		public function changeEmail() {
			global $db;
			
			//$status = $_REQUEST['status'];
			$uid = $_REQUEST['uid'];
			$email = $_REQUEST['newemail'];
			
			if ($this->checkuser($uid)) {
				$sql = 'update users set email = %s where id = %s';
				$db->query($db->prepare($sql,$email,$uid));
				return $uid;
			}
			else {
				$sql = 'insert into users (id,email,dt_created) values (%s,%s,now())';
				$db->query($db->prepare($sql,$uid,$email ));
				return $uid;
			}
			
			return false;
		}
		
		
		function delpost() {
			global $db;
			$contentId = $_REQUEST['cid'];
			
			if ($contentId > 0 && $this->check($contentId)) {
				$sql = 'delete from '.$this->postTable.' where cid = %s';
				$db->query($db->prepare($sql,$contentId));
				return true;
			}
			
			return false;
		}
		
		
		function getStatus() {
			$contentId = $_REQUEST['cid'];
			
			$arr = $this->posts[$contentId];
			$status = $arr['status'];
			if ($status == '') $status = 1;
			
			return $status;
		}
		
		function getGroup() {
			global $db;
			
			$row = $db->query_first('select id,name,website,page from '.$this->groupTable.' where id = ' . $this->gid);
			
			return $row;
		}
        
		public function getAll() {
			global $db;
			$arr = array();
			$rs = $db->query('select * from '.$this->postTable.' where gid = ' . $this->gid);
			while($row = $db->fetch_assoc($rs)) {
				$arr[$row['cid']] = $row;
			}
			
			return $arr;
		}
		
		public function get($cid) {
			global $db;
			
			$row = $db->query_first('select status,subtype,subtype2,tags from '.$this->postTable.' where cid = '. $cid .' and gid = '. $this->gid);
			
			return $row;
		}
		
		private function existFile() {
			
			if (file_exists($this->jsonFile)) {
				return true;
			}
			
			return false;
		}
		
		function load() {
			if ($this->existFile()) {
				return json_decode(file_get_contents($this->jsonFile),true);
			}
			else
				return array();
		}
		
		function check($cid) {
			global $db;
			
			if (preg_match('/^[0-9]+$/',$cid)) {
				$row = $db->query_first('select cid from '.$this->postTable.' where cid = '. $cid);
				
				if ($row['cid'] != '') return true;
			}
			
			return false;
		}
        
        function checkGroup($gid) {
			global $db;
			
			if (preg_match('/^[0-9]+$/',$gid)) {
				$row = $db->query_first('select id from '.$this->groupTable.' where id = '. $gid);
				
				if ($row['id'] != '') return true;
			}
			
			return false;
		}
		
		function checkuser($uid) {
			global $db;
			
			$row = $db->query_first('select id from users where id = '. $uid);
		   
			if ($row['id'] != '') return true;
			
			return false;
		}
		
		function getUserInfo($uid) {
			require_once INC . "/db_class.php";
			$db = new db_class();
			$db->connect();
			
			$row = $db->query_first('select id,contact,email from users where id = '. $uid);
			$db->close();
			if ($row['id'] != '') return $row;
			
			return false;
		}
		
		
		function save() {
			$json = json_encode($this->posts);
			if($fp = fopen($this->jsonFile, "w+")) {
				$fwrite = fwrite($fp, $json);
				fclose($fp);
			}
			
		}
	}
	
	
	function getContact($uid,$field) {
		
		$wcstatus = new wcStatus($gid);
		if($info = $wcstatus->getUserInfo($uid)) {
		
			return $info[$field];
		
		}
	}
?>