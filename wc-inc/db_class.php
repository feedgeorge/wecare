<?PHP

error_reporting(7);

class db_class {
	
	var $my = array();
	
	var $real_escape = false;
	
	function db_class() {
		global $DB;
		
		$this->my[database] = $DB['db'];
		$this->my[link_id] = 0;
		$this->my[query_id] = 0;
		$this->my[record] = array();
		$this->my[error] = "";
		$this->my[errdesc] = "";
		$this->my[errno] = 0;
		$this->my[reporterror] = 1;
		$this->my[server] = $DB['host'];
		$this->my[user] = $DB['login'];
		$this->my[password] = $DB['passwd'];
		$this->my[appname] = "";
		$this->my[appshortname] = "";
		$this->my[technicalemail] = "";
		
	}
	
	function connect() {
		global $usepconnect;
		if ($this->my[link_id] == 0) {
			if ($this->my[password] == "") {
				if ($usepconnect == 1)
					$this->my[link_id]=mysql_pconnect($this->my[server],$this->my[user]);
				else
					$this->my[link_id]=mysql_connect($this->my[server],$this->my[user]);
			} else {
				if ($usepconnect == 1)
					$this->my[link_id]=mysql_pconnect($this->my[server],$this->my[user],$this->my[password]);
				else
					$this->my[link_id]=mysql_connect($this->my[server],$this->my[user],$this->my[password]);
			}
			if (!$this->my[link_id])
				$this->halt("Link-ID == false, connect failed");
			if ($this->my[database] != "")
				if(!mysql_select_db($this->my[database], $this->my[link_id]))
					$this->halt("cannot use database ".$this->my[database]);
		}
	}
	
	function prepare( $query = null ) { // ( $query, *$args )
		if ( is_null( $query ) )
			return;

		$args = func_get_args();
		array_shift( $args );
		// If args were passed as an array (as in vsprintf), move them up
		if ( isset( $args[0] ) && is_array($args[0]) )
			$args = $args[0];
		$query = str_replace( "'%s'", '%s', $query ); // in case someone mistakenly already singlequoted it
		$query = str_replace( '"%s"', '%s', $query ); // doublequote unquoting
		$query = preg_replace( '|(?<!%)%s|', "'%s'", $query ); // quote the strings, avoiding escaped strings like %%s
		array_walk( $args, array( &$this, '_real_escape' ) );
		return @vsprintf( $query, $args );
	}
	
	function _real_escape( $string ) {
		if ( $this->real_escape )
			return mysql_real_escape_string( $string, $this->dbh );
		else
			return addslashes( $string );
	}
	
	function close() {
		mysql_close($this->my[link_id]);
	}
	
	function geterrdesc() {
		$this->my[error] = mysql_error();
		return $this->my[error];
	}
	
	function geterrno() {
		$this->my[errno] = mysql_errno();
		return $this->my[errno];
	}
	
	function select_db($database="") {
		if ($database != "")
			$this->my[database]=$database;
		
		if(!mysql_select_db($this->my[database], $this->my[link_id]))
			$this->halt("cannot use database ".$this->my[database]);
	}
	
	function query($query_string) {
		global $query_count, $showqueries, $explain, $querytime, $pagestarttime;
		if ($showqueries) {
			echo "Query Resullt: $query_string\n";
			$pageendtime = microtime();
			$starttime = explode(" ",$pagestarttime);
			$endtime = explode(" ",$pageendtime);
			$beforetime = $endtime[0]-$starttime[0]+$endtime[1]-$starttime[1];
			echo "Time Before Query: $beforetime\n";
		}
		
		$this->my[query_id] = mysql_query($query_string,$this->my[link_id]);
		
		if (!$this->my[query_id])
			$this->halt("Invalid SQL: ".$query_string);
		
		$query_count++;
		
		if ($showqueries) {
			$pageendtime = microtime();
			$starttime = explode(" ",$pagestarttime);
			$endtime = explode(" ",$pageendtime);
			$aftertime = $endtime[0]-$starttime[0]+$endtime[1]-$starttime[1];
			$querytime += $aftertime-$beforetime;
			
			echo "Time After Query:  $aftertime\n";
			
			if ($explain and substr(trim(strtoupper($query_string)),0,6) == "SELECT") {
				$explain_id = mysql_query("EXPLAIN $query_string",$this->my[link_id]);
				echo "</pre>\n";
				echo "
				<table width=\"100%\" border=\"1\" cellpadding=\"2\" cellspacing=\"1\">
				<tr>
				<td><b>Table</b></td>
				<td><b>Type</b></td>
				<td><b>Possible_Keys</b></td>
				<td><b>Key</b></td>
				<td><b>Key_Len</b></td>
				<td><b>Ref</b></td>
				<td><b>Rows</b></td>
				<td><b>Extra</b></td>
				</tr>\n";
				while ($array=mysql_fetch_array($explain_id)) {
					echo "
					<tr>
					<td>$array[table]&nbsp;</td>
					<td>$array[type]&nbsp;</td>
					<td>$array[possible_keys]&nbsp;</td>
					<td>$array[key]&nbsp;</td>
					<td>$array[key_len]&nbsp;</td>
					<td>$array[ref]&nbsp;</td>
					<td>$array[rows]&nbsp;</td>
					<td>$array[Extra]&nbsp;</td>
					</tr>\n";
				}
				echo "</table>\n<BR><hr>\n";
				echo "\n<pre>";
			} else { 
				echo "\n<hr>\n\n"; 
			}
		}
		return $this->my[query_id];
	}
	
	function fetch_array($query_id=-1, $query_string="") {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		if (isset($this->my[query_id])) {
			$this->my[record] = mysql_fetch_array($this->my[query_id]);
		} else {
			if (!empty($query_string))
				$this->halt("Invalid query id (".$this->my[query_id].") on this query: $query_string");
			else
				$this->halt("Invalid query id ".$this->my[query_id]." specified");
		}
		return $this->my[record];
	}
	
	function fetch_assoc($query_id=-1, $query_string="") {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		if (isset($this->my[query_id])) {
			$this->my[record] = mysql_fetch_assoc($this->my[query_id]);
		} else {
			if (!empty($query_string))
				$this->halt("Invalid query id (".$this->my[query_id].") on this query: $query_string");
			else
				$this->halt("Invalid query id ".$this->my[query_id]." specified");
		}
		return $this->my[record];
	}
	
	function fetch_object($query_id=-1,$query_string="") {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		if (isset($this->my[query_id])) {
			$this->my[record] = mysql_fetch_object($this->my[query_id]);
		} else {
			if (!empty($query_string))
				$this->halt("Invalid query id (".$this->my[query_id].") on this query: $query_string");
			else
				$this->halt("Invalid query id ".$this->my[query_id]." specified");
		}
		return $this->my[record];
	}
	
	function fetch_row($query_id=-1,$query_string="") {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		if (isset($this->my[query_id])) {
			$this->my[record] = mysql_fetch_row($this->my[query_id]);
		} else {
			if (!empty($query_string))
				$this->halt("Invalid query id (".$this->my[query_id].") on this query: $query_string");
			else
				$this->halt("Invalid query id ".$this->my[query_id]." specified");
		}
		return $this->my[record];
	}
	
	function free_result($query_id=-1) {
		if ($query_id!=-1)
			$this->my[query_id]=$query_id;
		if (isset($this->my[query_id]))
			mysql_free_result($this->my[query_id]);
		
	}
	
	function query_first($query_string) {
		$query_id = $this->query($query_string);
		$returnarray=$this->fetch_array($query_id, $query_string);
		$this->free_result($query_id);
		return $returnarray;
	}
	
	function data_seek($pos, $query_id=-1) {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		return mysql_data_seek($this->my[query_id], $pos);
	}
	
	function num_rows($query_id=-1) {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		return mysql_num_rows($this->my[query_id]);
	}
	
	function num_fields($query_id=-1) {
		if ($query_id != -1)
			$this->my[query_id]=$query_id;
		return mysql_num_fields($this->my[query_id]);
	}
	
	function insert_id() {
		return mysql_insert_id($this->my[link_id]);
	}
	
	function halt($msg) { 
		global $scriptpath, $contactemail; 
	    $this->my[errdesc] = mysql_error(); 
	    $this->my[errno] = mysql_errno(); 
	      
	    if ($this->my[reporterror] == 1) { 
	         $message  = "<br><b>Database Error In ".$this->my[appname].":</b> $msg<br><br>\n"; 
	         $message .= "<b>MySQL Error:</b> ".$this->my[errdesc]."<br><br>\n"; 
	         $message .= "<b>MySQL Error Number:</b> ".$this->my[errno]."<br><br>\n"; 
	         $message .= "<b>Date:</b> ".date("l dS of F Y h:i:s A")."<br><br>\n"; 
	         $message .= "<b>Script:</b> ".(($scriptpath)?$scriptpath:$_SERVER['REQUEST_URI'])."<br><br>\n"; 
	         $message .= "<b>Referer:</b> ".$_SERVER['HTTP_REFERER']."<br><br>\n"; 
	         echo "<html>\n<head>\n<title>MySQL Error!!!</title></head>\n<body>\n"; 
	         echo "<p>There seems to have been a slight problem with the database. Please contact the server admin to report this problem. <a href=\"#\" onclick=\"javascript: sqlerror.style.visibility='visible';\">Show Error</a></p>"; 
	         echo "<div id=\"sqlerror\" style=\"visibility: hidden;\">\n<fieldset style=\"background: whitesmoke;font-family: Verdana;font-size: 12px;\">"; 
	         echo "<legend style=\"background: #FF0000; border: solid #000000 1pt; width: 200px; color: #FFFFFF;\">&nbsp;MySQL Error :</legend>\n"; 
	         echo $message; 
	         echo "</fieldset>\n</div>"; 
	         echo "</body><html>"; 
	         die(""); 
	    }
	}
}
?>
