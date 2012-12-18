<?php
	class User {
		function __construct() {
			global $wcapi;
			
			$this->api = $wcapi;
		}
		
		public function load_action($act) {
			switch($act) {
				case 'signup':
					$this->signup();
					break;
				
				case 'delete':
					$this->delete();
					break;
				
				case 'login':
					$this->login();
					break;
				
				case 'logout':
					$this->logout();
					break;
			}
		}
		
		
		public function signup() {
			
			$email = $_REQUEST['semail'];
			$pass = $_REQUEST['spass'];
			
			$code = $this->add($email,$pass);
			
			if (!$code) {
				$code = -1;
			}
			echo json_encode($code);
		}
		
		public function add($email,$password) {
			
			$result = $this->api->request('user/add',array(
				'email' => $email,
				'password' => $password,
				));
			
			
			if ($result['success'] == 1 && $result['error'] == 200 ) 
				return $result['result']['id'];
			
			return false;
		}
		
		public function login() {
			$email = $_REQUEST['lemail'];
			$pass = $_REQUEST['lpass'];
			
			$result = $this->api->request('user/login',array(
				'email' => $email,
				'password' => $pass,
			));
			
			if ($result['success'] == 1 && $result['error'] == 200 ) {
				$_SESSION['_u'] = array(
					'time' => time(),
					'id' => $result['result']['id']
				);
				redirect('/?page=dashboard');
			}
			else 
				redirect('/');
		}
		
		
		public function logout() {
			unset($_SESSION['_u']);
			redirect('/');
		}
		
		public function delete() {
		
		}
	}
	
	
?>