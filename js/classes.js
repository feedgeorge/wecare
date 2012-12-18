
function EventTarget(){
    this._listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },

    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};

var wcUser = function() {
};

wcUser.prototype.login = function(email,password) {
	var bValid = true;
	
	bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
	bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );

	if ( bValid ) {
		
		var d = new wcData();
		d.load('user/login',{email:email.val(),password:password.val()},
			 function(data) {
				
				if (data.id > 0) {
					var info = {n:data.displayName,p:data.pic};
					$.cookie('_wc_session', data.id , { path: '/', domain: '.' + domain });
					$.cookie('_wc_session_in1', JSON.stringify(info) , { path: '/', domain: '.' + domain });
					
					window.location.href = HOMEURL + "/page/dashboard";
					$( "#loginpop" ).dialog( "close" );
					$.modal.close();					
				}
				else {
					updateTips(data.reason);
					email.addClass( "ui-state-error" );
					password.addClass( "ui-state-error" );
				}
				delete d;
			}
			
		);
		delete d;
	
	}
	
};

wcUser.prototype.gologin = function(email,password) {
	var d = new wcData();
		d.load('user/login',{email:email,password:password},
			 function(data) {
				
				if (data.id > 0) {
					var info = {n:data.displayName,p:data.pic};
					$.cookie('_wc_session', data.id , { path: '/', domain: '.' + domain });
					$.cookie('_wc_session_in1', JSON.stringify(info) , { path: '/', domain: '.' + domain });
					
					window.location.href = HOMEURL + "/page/dashboard";
					//$( "#loginpop" ).dialog( "close" );
					//$.modal.close();					
				}
				delete d;
			}
			
		);
		delete d;
};


wcUser.prototype.signup = function(email,password,rpass) {
	var bValid = true;
	//allFields.removeClass( "ui-state-error" );

	//bValid = bValid && checkLength( name, "username", 3, 16 );
	//bValid = bValid && checkLength( email, "email", 6, 80 );
	//bValid = bValid && checkLength( password, "password", 5, 16 );
	//var email = $( "#semail" ), password = $( "#spass" ),remail = $( "#sremail" ),rpass = $( "#srpass" );
	
	//bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
	// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
	bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
	bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
	
	/*if (email.val() != remail.val()) {
		remail.addClass( "ui-state-error" );
		updateTips("Emails not match");
		bValid = false;
	}*/
	
	if (password.val() != rpass.val()) {
		//rpass.addClass( "ui-state-error" );
              rpass.focus();
		updateTips("Passwords not match");
		bValid = false;
	}

	if ( bValid ) {
		
		//$( this ).dialog( "close" );
		//alert('ok');
		//var d = new wcData();
		var that = this;
		//$.post(HOMEURL + '/index.php?page=user&act=signup',{semail:email.val(),spass:password.val()},function(data) {
		$.post(HOMEURL + '/user/signup',{semail:email.val(),spass:password.val()},function(data) {
			if (data != -1) {
				alert('Sign up Completed! Thank you for join WECARE');
				$( "#signuppop" ).dialog( "close" );
				$.modal.close();
				
				that.gologin(email.val(),password.val());
			}
		},'json'
		);
		
		return false;
	}
};

wcUser.prototype.changePassword = function(form) {
	var bValid = true;
	
	var password = $('#changPwform input#spass'),newpass = $('#changPwform input#snpass'), rnewpass = $('#changPwform input#srpass');
	
	bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Current Password field only allow : a-z 0-9" );
	bValid = bValid && checkRegexp( newpass, /^([0-9a-zA-Z])+$/, "New Password field only allow : a-z 0-9" );
	bValid = bValid && checkRegexp( rnewpass, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
	
	if (newpass.val() != rnewpass.val()) {
		//rpass.addClass( "ui-state-error" );
		rpass.focus();
		alert("New Password not match");
		bValid = false;
	}
	
	if ( bValid ) {
		
		var d = new wcData();
		
		d.load('user/newpassword',{currentPassword:password.val(),newPassword:newpass.val(),verifyPassword:rnewpass.val()},
			 function(data) {
				if (data == '') {
					alert('Password changed done');
					//$('#editPropop').dialog( "close" );
					cleanForm('changPwform');
					$.modal.close();
				}
				else {
					alert(JSON.stringify(data));
				}
				delete d;
			}
			
		);
		
	}
};

wcUser.prototype.forgetPassword = function() {
	var bValid = true;
	var uemail = $('#forgotPopform input#lemail'), submitbtn = $('#forgotPopform input#resetbtn');
	
    submitbtn.attr('disabled','disabled');
    uemail.attr('disabled','disabled');
    
	bValid = bValid && checkRegexp2( uemail, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Email format invalid. eg. ui@jquery.com" );
	
    if (!bValid) {
        submitbtn.removeAttr('disabled');
        uemail.removeAttr('disabled');
    }
    
	if (bValid) {
		var d = new wcData();
		d.load('user/requestReset',{email:uemail.val()},
			 function(data) {
				submitbtn.removeAttr('disabled');
                uemail.removeAttr('disabled');
                
				alert('A link to reset your password have sent to your email. Please check your inbox now');
				$('#forgotpwdpop').slideUp();
                cleanForm('forgotPopform');
				delete d;
			}
			
		);
		
	}
};

wcUser.prototype.changeContact = function(form) {
	var bValid = true;
	var contactno = $('#changeContactform input#contactno');
	
	if (contactno.val() != '')
		bValid = bValid && checkRegexp( contactno, /^([0-9a-zA-Z-+])+$/, "Contact field only allow : +07" );
	
	if (bValid) {
		
		/*$.post(HOMEURL + '/status.php',{act:'changeContact',uid:$.cookie('_wc_session'),contactno:contactno.val()},function(e){
			alert('Contact Number is updated');
			if (contactno.val() == '') contactno.val('+60');
		});*/
		
		var data = new wcData();
		data.postload('/api/status',{mtd:'changeContact',uid:$.cookie('_wc_session'),contactno:contactno.val()},function(e) {
			alert('Contact Number is updated');
			if (contactno.val() == '') contactno.val('+60');
			delete data;
		});
	}
};

wcUser.prototype.changeEmail = function(form) {
	var bValid = true;
	var newemail = $('#changeEmailform input#newemail');
	
	if (newemail.val() != '')
		bValid = bValid && checkRegexp( newemail, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
	
	if (bValid) {
		
		/*$.post('/api/status',{act1:'changeEmail',uid:$.cookie('_wc_session'),newemail:newemail.val()},function(e){
			alert(e + ' Email Address is updated');
		},'json');*/
		
		var data = new wcData();
		data.postload('/api/status',{mtd:'changeEmail',uid:$.cookie('_wc_session'),newemail:newemail.val()},function(e) {
			alert(e + ' Email Address is updated');
			delete data;
			//alert(data.postload(null,null,null));
		});
		
	}
};

wcUser.prototype.uploadAvator = function(form) {
	
	var d = new wcData();
	
	d.formload(form,'user/updateAvatar',
		 function(data) {
			
			if (data.id > 0) {
				
				var pic = data.pic;
				
				var d = jQuery.parseJSON($.cookie('_wc_session_in1'));
				d.p = pic;
				
				$.cookie('_wc_session_in1', JSON.stringify(d),{ path: '/', domain: '.' + domain });
				
				d = new Date();

				$('#uploadAvatorform img.thumbnail').attr('src',pic + '?' +d.getTime());
				cleanForm('changPwform');
			}
			else {
				alert(JSON.stringify(data));
			}
			delete d;
		}
		
	);
};

/*
* Group Classes
*/
var wcGroups = function() {
	//this.postlist.
	//this.data = new wcData();
   this.members = {};
   this.role = '';
};

wcGroups.prototype.loadSingle = function(gid) {
	this.gid = gid;
    if ($.cookie('_wc_session') != null && $.cookie('_wc_session') > 0) {
        this.loadMembers();
    }
    else
        this.listposts();
    
    
};


wcGroups.prototype.add = function(gid) {
	
	var data = new wcData();
	data.load('group/join', {groupId:gid}, function(e){
		
		window.location.href= HOMEURL + "/page/dashboard/" + gid;
		//delete data;
	});
	
};

wcGroups.prototype.join = function(gid) {
	var data = new wcData();
	//var that = this;
	
	if ($.cookie('_wc_session') != null && $.cookie('_wc_session') > 0) {
		data.load('group/join', {groupId:gid}, function(e){
			window.location.href= HOMEURL + "/page/dashboard/" + gid;
			delete data;
		});
	}
	else {
		alert('Please login');
	}
	
};

wcGroups.prototype.leave = function(gid,callback) {
	
	if (confirm('Are you sure you want to leave this Community?')) {
		var data = new wcData();
		var that = this;
		data.load('group/leave', {groupId:gid}, function(e){
			callback.call(that,e);
			delete data;
		});
	}
};

wcGroups.prototype.checkJoin = function(gid,callback) {
	if($.cookie('_wc_session') != null && $.cookie('_wc_session') > 0){
		var data = new wcData();
		var that = this;
		data.load('group/getrole', {groupId:gid}, function(e,d){
			var m = false;
			//alert(d.success);
			if (d.success==true) {
				$('#editbtn').prop('value','Leave this Community');
			}
			
			delete data;
		});
	}
};

wcGroups.prototype.approval = function(gid,id) {
	this.data.load('group/approve',{'groupId':gid,'userId':id},function(e) {
		alert(JSON.stringify(e));
	});
};

wcGroups.prototype.edit = function(act,gid) {
	if (act == '') act = 'join';
	
	var data = new wcData();
	data.load('group/' + act, {groupId:gid}, function(e){
		//alert('Joined completed. Currently in pending status until Admin approval your request');
		window.location.href= HOMEURL + "/page/dashboard/" + gid;
	});
};

wcGroups.prototype.deleteGroup = function(gid) {
    if(confirm('Are you sure want to delete this group?')) {
        if (! isNaN(parseInt(gid))) {
            var d = new wcData();
            d.load('group/Delete',{groupId:gid},function(e){
                alert(JSON.stringify(e));
            });
        }
    }
};

wcGroups.prototype.addPost = function(form) {
	
	var type = $('#posttype').val();
	var typefield = 'addpost', ic = form.children("input[name='ic']");

	if (type == -1) {
		alert('Please select a category');
		$('#posttype').focus();
		return false;
	}
	
	if ($('#text').val().length == 0) {
		alert('Content is empty. Please write something');
		$('#text').focus();
		return false;
	}
	
	if (ic.val().length > 0 && !checkRegexp2(ic, /^[0-9]+$/)) {
		alert('Please enter first 8 digits of IC');
		return false;
	}
	
	if (type == 2) {
		typefield = 'addevent';
		
		if ($('#eventDate').val() == '') {
			alert('Please choose a Date/Time');
			$('#eventDate').focus();
			return false;
		}
	}
	else if (type == 3) {
		typefield = 'addsurvey';
		var count=0,got=0;
		$('.choiceOp').each(function() {
			if ($(this).val().length > 0) got++;
			count++;
		});
		
		if (got < 2) {
			alert('Please type at least two choices');
			$('.choiceOp').each(function() {
				if ($(this).val().length == 0) {
					$(this).focus();
					return false;
				}
			});
			return false;
		}
		
	}
	
	if($('#subtype').is(':visible')) {
		if (!$("input[name='postsubtype']:checked").val()) {
			alert('Please choose one in Sub Category');
			return false;
		}
	}
	
	var fileInput = form.children("input[name='photo']").val();
	
	if(fileInput.length == 0){
		$("input[name='photo']").prop('disabled', true);
		form.attr( "enctype", "" );
	}
	else {
		var ext = fileInput.split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			form.children("input[name='photo']").focus();
			alert('Invalid Image format. Please upload image in gif, png or jpeg');
			return false;
		}

	}
	
	var d = new wcData();
	var type2 = $("input[name='postsubtype']:checked").val();
	
	form.children("input[name='act']").val('addpost');
	
		d.formload(form,'content/' + typefield,
		   function(e) {
				//alert(e);
				if (e.id > 0) {
					//$('#cid').val(e.id);
					form.children("input[name='cid']").val(e.id);
					
					var dataparams = form.formToJson();
					dataparams['mtd'] = 'addpost';
					delete dataparams.act;
					/*$.post(HOMEURL + '/api/status',form.serialize(),function(e) {
						//alert(e);
					},'json');*/
					
					var data1 = new wcData();
					data1.postload('/api/status',dataparams,function(e) {
						delete data1;
					});
					
					alert('Your post have been submitted!');
					//window.location.href="/page/dashboard";
					dboard.refreshPosts();
					$('#post-list').show();
					$('#addpostform').hide();
				}
				delete d;
		   }
		);
	
	
				
};

wcGroups.prototype.loadMembers = function(){
    var that = this;
    this.data = new wcData();
    this.data.load('group/listmembers',{'groupId':this.gid},function(e){
		var members = e.members;
        for(var m in members) {
            that.members[members[m].id] = members[m];
        }
        
        that.role = that.members[$.cookie('_wc_session')].role;
        that.listposts();
    });
};

wcGroups.prototype.listposts = function() {
	this.data = new wcData();
	var that = this, role = this.role, postlist = {};
	$('#postlist').empty();
    
	this.data.load('content/list',{'groupId':this.gid},function(e){
		if (typeof(e.content) != 'undefined') {
			var posts = e.content, list = '';
	
				for(var p in posts) {
					//alert(JSON.stringify(posts[p]))
					image = HOMEURL + '/images/post-logo.jpg';
					var deletebtn = '',postimg='',css='';
					//if (posts[p].image != null)
					//	image = posts[p].image;
					
					if (posts[p].image != null) {
						image = posts[p].image;
						postimg = '<div class="thumb"><img src="'+image+'" /></div>';
						css = 'margin-left:60px';
						css1 = 'style="margin-left:95px"';
					}
					
					var posturl = HOMEURL + '/post/' + posts[p].id;
					var eventdate = '';
					
					var dateUpdated = trimDate(posts[p].lastUpdate).friendlytime();
					
					if (posts[p].type == 2) {
						var event = trimDate(posts[p].eventDate);
						eventdate = '<div class="eventdate">Event Date: ' + event.format('dd mmm yyyy H:M') + '</div>';
					}
                    
                    /*if (($.cookie('_wc_session') == posts[p].authorId) || (role == 4 || role == 2)) {
						deletebtn = '<div class="crossbtn" onclick="_postDel('+posts[p].id+')">Delete</div>';
                    }*/
					
					list += '<div id="post-'+ posts[p].id +'" class="gpost">'+deletebtn+postimg+'<div class="postcontent" style="'+css+'" ><a href="'+posturl+'">' + posts[p].text + eventdate + '</a><div class="author">BY '+posts[p].authorName +' | <span class="timenote">'+ dateUpdated +'</span></div></div></div>';
					
					postlist[posts[p].id] = posts[p];
				}
                $('#postlist').append(list);
                
                $('#postlist .gpost').each(function() {
                    
                    var m = $(this).attr('id').replace('post-','');
                   
                    var id = m;
                    var postinfo = postlist[id];
           
                    if ($.cookie('_wc_session') == postinfo.authorId || (role == 4 || role == 2)) {
                            var deletebtn = $('<div id="delp-'+id+'" class="crossbtn" onclick="_postDel('+postinfo.id+')" style="display:none">Delete</div>');
                            $(this).append(deletebtn);
                            $(this).hover(function(){
                                deletebtn.show();
                            },
                            function(){
                                deletebtn.hide();
                            });
                    }
                });
			
		}
	}
			
	);
	
};

/*
* Feed
*/

var wcFeed = function(gid) {

	this._gid = gid;
	this._posts = [];
};


wcFeed.prototype.getTwitter = function(name,callback) {
	var data = new wcData();
	var that = this;
	
	var twiturl = 'http://search.twitter.com/search.rss?q=@' + name;
	
	this.retievefeed(twiturl,5,callback);
};


wcFeed.prototype.getFeed = function(callback) {
	var data = new wcData();
	var that = this;
	$.post(HOMEURL + '/getFeed.php',{act:'get',gid:this._gid},function(e){
		var statuses = e;
		
		for(var i =0; i<e.length; i++) 
			that.retievefeed(e[i],4,callback);
		
		//callback.call(that,posts);
		//alert(JSON.stringify(that._posts));
	},'json');
};


wcFeed.prototype.retievefeed = function(rssurl,type,callback) {
	var posts = [];
	var that = this;
	$.ajax({
			url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(rssurl),
			dataType: 'json',
			async:false,
			success: function(data) {
			  //callback(data.responseData.feed);
			  //alert(JSON.stringify(data.responseData.feed));
			  that.parser(data.responseData.feed,type)
			  callback.call(that,that._posts);
			}
	});
};

wcFeed.prototype.parser = function(feed,type) {
	//var posts = [];
	//var feed = data.responseData.feed;
	
	var entries = feed.entries;
	var name = feed.title;
	for(var e in entries) {
		var ent = entries[e];
		var post = {id:ent.guid,type:type,title:ent.title,text:ent.content,authorName:name,lastUpdate:ent.publishedDate,url:ent.link};
		this._posts.push(post);
	}
	
	//return posts;
};

/*
* Dashboard Classes
*/
var wcDashboard = function(gid) {
	
	this.memDialog = $('<div id="memdialog" class="poplayer2"><div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix" style="padding:5px"><span id="ui-dialog-title-loginpop" class="ui-dialog-title">Member Setting</span></div><div class="info"></div><input type="hidden" id="memId" name="memId"  /><select id="role" name="role"></select><input type="button" id="rolebtn" name="rolebtn" value="Change Role" /><br/><input type="button" id="banbtn" name="banbtn" value="Ban the member" /></div>');
	this.banmMemdialog = $('<div class=""><ul></ul></div>');
	this.memberrole = {0:'Pending',1:'Member',2:'Admin',4:'Creator'};
	//this.poststatus = {1:'Urgent',2:'Noted',3:'Done',4:'Inactive'};
	//this.poststatus = {1:'Open | Being Attended',2:'Open | Being Unattended',3:'Closed | Being Unattended',4:'Close'};
	this.poststatus = {1:'Awaiting attention',2:'Acknowledged',3:'Solved',4:'Unsolved'};
	//this.posttype = {1:'Feedback',2:'Event',3:'Survey',4:'RSS', 5:'Twitter'};
	
	this.posttype = {"1":'Feedback',"1-1":"Infrastructure","1-2":"Crime","1-3":"Announcements","2":"Events","3":"Survey","1-4":"Others"};
	this.postsubtype = {"1-1":{"1":"Roads","2":"Street &amp; Traffic Lights","3":"Parks","4":"Buildings","5":"Information Request","6":"Others"},"1-2":{"7":"Snatch Thieves","8":"Break-Ins","9":"Car Thefts","10":"Others"},"2":{"11":"City-Wide Events","12":"Community Events"}};
	
	this.postlist = {};
	this.placelist = {};
	this.memberlist = {};
	this.commentlist = {};
	this.firsttime = true;
	this._gid = gid || 0;
	this.feedList = [];
	
	this._currentpage = 1;
    this._grouprole = '';
	//var g = new wcGroups();
	//g.approval(5,7);
	
	this.init();
	this.listPlaces();
	
};

wcDashboard.prototype.init = function() {
	$('#memberlist').empty();
	$('#gpmem').hide();
	this.postlist = {};
	$('#postlist').empty();
	this._currentpage = 1;
};

wcDashboard.prototype.refresh = function(id,role) {
	this.init();
	this.listproinfo(id);
	this.listposts(id);
	
	$('#grpmembers').empty();
	
	$('#emailgrpbtn').hide();
	
	/*if (role == 2 || role == 4) {*/
	if (role == 2 || role == 4 || role == 1) {
		if (role != 1) $('#emailgrpbtn').show();
		this.listmembers(id,role);
		$('#gpmem').show();
	}
	
	//$('#gpmem').show();
	
	this.refreshGroupSelectbox();
	
};

wcDashboard.prototype.refreshListWithStatus = function() {
	var status = $('#statusSel').val();
	var type = $("#typeSel").val();
	var subtype = $('#feedbacktypeSel').val();
	this.refreshPostList(type,status,subtype);
};

wcDashboard.prototype.refreshGroupSelectbox = function() {
	if(typeof(this._gid) != 'undefined')
		$('#groupId').val(this._gid);
};

wcDashboard.prototype.refreshFeed = function() {
	var gid = this._gid;
	var feed = new wcFeed(gid);
	var TYPE = this.posttype;
	var sharebtn = '';
	var image = '';
	feed.getFeed(function(posts){
		for(var p in posts) {
			var cat = TYPE[posts[p].type];
			
			var dateUpdated = new Date(posts[p].lastUpdate.replace(/\s/,'T')).friendlytime();
			
			list = $('<div id="post-'+ posts[p].id +'-'+ posts[p].type +'" class="post sidebox"><div class="pbottom"><ul><li class="ptype">'+cat+'</li><li class="pstatus"></li><li class="comment"><div class="sq"></div></li></ul></div><div style="clear:both"></div><div class="thumb"><img src="'+image+'" /></div><div class="postentry"><a href="'+ posts[p].url +'" class="ptitle">'+posts[p].title + '</a><div class="pauthor" >By '+posts[p].authorName + ' | '+ dateUpdated +'</div><a href="'+ posts[p].url +'" class="ptext">' +posts[p].text + '</a><div class="pshare">'+sharebtn+'</div></div></div>');
			$('#postlist').append(list);
		}
	});
	
	feed.getTwitter('google',function(e) {
		//alert(JSON.stringify(e));
	});
};


wcDashboard.prototype.listPlaces = function() {
	
	if ($.cookie('_wc_session')==null) {
		
		this.listproinfo(this._gid);
		return '';
	}
	
	this.data = new wcData();
	var that = this;
	var currentgid = this._gid;
	var currenturl = window.location.href;
	var host = window.location.host;
	
	this.data.load('user/listgroups',{},
		function(e){
			var myplaces = e.groups;
			
			if(currenturl.indexOf(HOMEURL + '/page/dashboard') != -1) {
				
				if (myplaces.length == 0) {
					window.location.href = HOMEURL + '/page/groups';
					return;
				}
			}
			
			
			var list = '',list2='';
			if (myplaces.length > 0) {
				
				for(var pl in myplaces) {
					var selected = '';
					if (typeof(currentgid) != 'undefined' && currentgid > 0 && myplaces[pl].id == currentgid) {
						selected = 'selected';
					}
					var name = myplaces[pl].name;;
					if (myplaces[pl].name.length > 18) name = myplaces[pl].name.substr(0,18) + '..';
					
					
					list += '<li id="gp-'+myplaces[pl].id+'" class="wcgroup" style="cursor:pointer" title="' + myplaces[pl].name + '"><dl><dt>' + name + '</dt></dl></li>';
					list2 += '<option value="'+myplaces[pl].id+'" '+ selected+'>' + myplaces[pl].name + '</option>';
					that.placelist[myplaces[pl].id] = myplaces[pl];
				}
				
				$('#myplaces').append(list);
				//$('#groupId').append(list2);
				
				$( "#myplaces li" ).click(function() {
					
					var id = $(this).attr('id').replace('gp-','');
					var currenturl = window.location.href;
					var host = window.location.host;
					
					if(currenturl.indexOf(HOMEURL + '/page/dashboard') != -1) {

						if (typeof(dboard) != 'undefined') {
							$('#addpostform').hide();
							var role = that.placelist[id].role;
							dboard._gid = id;
							dboard.refresh(id,role);
							dmap.clearMarkers();
							
							if ($('.maptab').is(':visible')) {
								dmap.load(dboard.getGeolist());
								dmap.fitMarkers();
								$('#postlist').show();
			//$('#memview').hide();
								$('.maptab').slideUp();
							}
							
							//$(this).addClass('listselected');
						}
						that.clearClass();
					}
					else {
						window.location.href = HOMEURL + '/page/dashboard/' + id;
					}
					return false;
				});
			}
			
			
			if(that.firsttime && currenturl.indexOf(HOMEURL + '/page/dashboard') > -1) {
				if (myplaces.length > 0) {
					var place = myplaces[0];
					
					if (that._gid > 0) {
						place = that.placelist[that._gid];
					}
					
					that.refresh(place.id,place.role);
					that._gid = place.id;
					$('#groupId').val(that._gid);
				}
				that.firsttime = false;
			}
			else if (currenturl.indexOf(HOMEURL + '/post/') > -1) {
				if (myplaces.length > 0) {
					var place = that.placelist[gid];
					if (typeof(place) != 'undefined') {
						that.showCommentForm(pid,gid);
						that.refresh(place.id,place.role);
						
						if (place.role == 2 || place.role == 4 || place.role == 1) {
							$('#commentform').show();
							$('#surveyform').show();
						}
						
						if (gid > 0) {
							$('#gtitle').html(place.name);
						}
					}
					else {
						
						that.listproinfo(gid);
					}
				}
			}
			that.clearClass();
			
		});
};

wcDashboard.prototype.clearClass = function() {
	var gid = this._gid;
	$( "#myplaces li" ).each(function() {
		var dt = $(this).children("dl").children("dt")
		dt.removeClass('listselected');
		var id = $(this).attr('id').replace('gp-','');
		if (id == gid) {
			dt.addClass('listselected');
		}
	});
};

wcDashboard.prototype.isAdmin = function() {
	var that = this;
	this.data = new wcData();
	this.data.load('group/listmembers',{'groupId':id},function(e){
		
	});
};


wcDashboard.prototype.listmembers = function(id,role) {
    var banuserlink = $('<div style="clear:both"><a href="#">Banned Members</a></div>');
	
	var creator = $('<div class="mem"><h2>Creator </h2><ul></ul></div>');
	var admin = $('<div class="mem" style="clear:both"><h2>Admin (<span id="total"></span>)</h2><ul></ul></div>');
	var normals = $('<div class="mem" style="clear:both"><h2>Members (<span id="total"></span>)</h2><ul></ul></div>');
	var pending = $('<div class="mem" style="clear:both"><h2>Pending</h2><ul></ul></div>');
	var morelink = $('<a href="" style="clear:both">More</a>');
	$('#grpmembers').empty();
	$('#memview .mem-list').empty();
	$('#memview').hide();
	$('#post-list').show();
	banuserlink.attr('id',id);
	$('#grpmembers').append(this.memDialog);
	
    $('#emailgrpbtn').hide();
    $('#settinglink').hide();
    
	if (role == 2 || role == 4) {
		$('#grpmembers').append(this.banmMemdialog);
        $('#emailgrpbtn').show();
        $('#settinglink').show();
	}
    
	this.memDialog.hide();
	
	$('#emailgrpbtn').hide();
	var that = this;
	this.data = new wcData();
	var gotpending = false;
	this.data.load('group/listmembers',{'groupId':id},function(e){
			
			var members = e.members;
			var list = '',list2='',mcount=0,mmax=30,cadm=0,cmem=0;
			that.memberlist = {};
			for(var mem in members) {
				
				var memtmp = $('<li id="'+ id +'-'+members[mem].id+'" class="wcgroup" style="cursor:pointer" title="'+ members[mem].name + '"><img src="'+members[mem].pic+'"  /><br/></li>');
				
				that.memberlist[members[mem].id] = members[mem];
				
				if (members[mem].role == 4) {
					creator.children("ul").append(memtmp);
				}
				else if (members[mem].role == 2) {
					admin.children("ul").append(memtmp);
					cadm++;
				}
				else if (members[mem].role == 0) {
					pending.children("ul").append(memtmp);
					gotpending = true;
				}
				else {
					if (mcount <= mmax) {
					normals.children("ul").append(memtmp);
					}
					mcount++;
				}
                
			}
			
			if (role == 2 || role == 4) {
				$('#emailgrpbtn').show();
                $('#settinglink').show();
				pending.children("ul").children("li").click(function() {
					var arr = $(this).attr('id').split('-');
					var gid = arr[0], mid = arr[1];
					var r=confirm("Do you want to approve this member");
					if (r) {
						var data = new wcData();
						data.load('group/approve',{'groupId':gid,'userId':mid},function(e){
							alert('The member have approval');
							that.listmembers(gid,role);
						});
						delete data;
						
					}
					
				});
				
				normals.children("ul").children("li").click(function() {
					var id = $(this).attr('id');
					//alert('c=' + id);
					that.getMemberDialog(id);
					return false;
				});
				
				banuserlink.click(function() {
					var id = $(this).attr('id');
					that.getBannedMemberDialog(id);
					return false;
				});
				
				$('#grpmembers').append(banuserlink);
				
				if (gotpending) $('#grpmembers').append(pending);
			}
			
			if (role == 4) {
				admin.children("ul").children("li").click(function() {
					var id = $(this).attr('id');
					//alert('c=' + id);
					that.getMemberDialog(id);
					return false;
				});
			}
			
			morelink.click(function(e) {
				
				$('#memview .mem-list').empty();
				var mems = that.memberlist;
				var lists = '';
				for(var mm in mems) {
					lists += '<div id="'+id +'-'+mems[mm].id+'" class="memdiv"><img src="'+mems[mm].pic+'" /><span class="mname">'+mems[mm].name + '</span><span class="mrole">' + that.memberrole[mems[mm].role] +'</span></div>';
				}
				
				$('#memview .mem-list').append(lists);
				$('#memview').show();
				$('#post-list').hide();
				
				if (role == 2 || role == 4) {
					$('#memview .mem-list').children(".memdiv").click(function(e){
						var id = $(this).attr('id');
						that.getMemberDialog(id);
						return false;
						}
					);
				}
				
				return false;
			});
			
			admin.find("#total").html(cadm);
			normals.find("#total").html(mcount);
			normals.append(morelink);
			$('#grpmembers').append(creator);
			$('#grpmembers').append(admin);
			$('#grpmembers').append(normals);
			
			
			
			
		}	
		);
	
};

wcDashboard.prototype.getBannedMemberDialog = function(id) {
	var that = this;
	that.banmMemdialog.children('ul').empty();
	this.data.load('group/listbans',{'groupId':id},function(e){
		//alert(JSON.stringify(e));
		var mems = e.users;
		for(var i in mems) {
			var m = mems[i];
			var list = '<li id="'+m.id+'">' + m.name +' <input type="button" id="'+id+'-'+m.id+'" value="Unban" class="unban" /></li>';
			
			that.banmMemdialog.children('ul').append(list);
		}
		
		that.banmMemdialog.children("ul").children("li").children(".unban").click(function() {
		var arr = $(this).attr('id').split('-');
		var gid = arr[0], mid = arr[1];
		that.editMember('unban',{groupId:gid,userId:mid},'Unbanned');
		$.modal.close();
		return false;
		});
	});
	
	this.banmMemdialog.modal({minHeight:300,minWidth:300});
};

wcDashboard.prototype.getMemberDialog = function(id) {
	var adminlist = {2:'admin',1:'normal',0:'pending'};
	var statuslist = {2:'ban',1:'unban'};
	var arr1 = id.split('-');
	var member = this.memberlist[arr1[1]];
	//alert(id + JSON.stringify(this.memberlist));
	if (member.role == 4) return false;
	
			
	this.memDialog.children("input#memId").val(id);
	
	this.memDialog.children('.info').html('<img src="'+member.pic+'" /><span class="membername">' + member.name + '</span>' );
	this.memDialog.children('#role').empty();
	for(var i in adminlist) {
		
		this.memDialog.children('#role').append('<option value="'+i+'">'+adminlist[i]+'</option>')
	}
	this.memDialog.children('#role').val(member.role);
	/*this.memDialog.modal(
		{
			minheight: 400,
			minWidth: 300,
			overlayClose:true,
			
		}
	);*/
	$.modal(this.memDialog,{minHeight:170,minWidth:250,overlayClose:true});
	var changeRole = this.changeRole;
	//var memDialog = this.memDialog;
	var that = this;
	this.memDialog.children('#rolebtn').click(function(){
		var arr = that.memDialog.children("#memId").val().split('-');
		var newrole = that.memDialog.children("#role").val();
		
		var gid = arr[0], mid = arr[1];
		that.editMember('changerole',{groupId:gid,userId:mid,newRole:newrole},'Role changed');
		$.modal.close();
		return false;
	});
	
	this.memDialog.children('#banbtn').click(function(){
		var arr = that.memDialog.children("#memId").val().split('-');
		var newrole = that.memDialog.children("#role").val();
		
		var gid = arr[0], mid = arr[1];
		that.editMember('ban',{groupId:gid,userId:mid},'ban');
		$.modal.close();
		return false;
	});
};

wcDashboard.prototype.editMember = function(type, field,msg) {
	var that = this;
	var data = new wcData();
	data.load('group/' + type,field,function(e){
		alert(msg);
		that.listmembers(field['groupId']);
	});
};

wcDashboard.prototype.getGroupId = function() {
	if(jQuery.isEmptyObject(this.placelist)) return false;
	return this._gid;
};

wcDashboard.prototype.getSubtype = function(cat) {
	var subcat = this.postsubtype[cat];
	return subcat;
};

wcDashboard.prototype.goEdit = function() {
    window.location.href = '/community/edit/' + this._gid;
};



/*wcDashboard.prototype.getGroupName = function(gid) {
	//return this.placelist[gid];
	alert(JSON.stringify(this.placelist[gid]));
};*/

wcDashboard.prototype.getPostDialog = function(gid) {
	var posts = this.getGeolist();
	var post = posts[gid];
	
	var content = '<img src="'+post['image']+'" /><div class="author">By '+post.authorName+'</div><div class="timenote">'+post.lastUpdate+'</div><div class="desc">'+post.text+'</div>';
	
	var lat = parseFloat(post.lat);
	var lng = parseFloat(post.lng);
	postmap.clearMarkers();
	if (lat > -1 && lng > -1) {
		$('#plocation').show();
		var latlng = new google.maps.LatLng(lat,lng);
		
		postmap.addMarker(latlng,null,'');
	}
	else {
		$('#plocation').hide();
	}
	$('#commentform input#contentId').val(post.id);
	this.listComments(post.id,0);
	
	$('#pdetail .pcontent').html(content);
	
	$('#pdetail').modal({minWidth:500,minHeight:500,maxHeight:500});
	return false;
};

wcDashboard.prototype.showCommentForm = function(id,gid) {
	
	if (id > 0) {
	    var curplace = this.placelist[gid];
		var role = curplace.role;
		
		if ( role < 1) {
			$('#commentform').hide();
		}
	}
};

wcDashboard.prototype.showPost = function(id) {
	//var posts = this.getGeolist();
	var postid = id;
	var that = this;
	var data = new wcData();
	
	data.load('content/get',{contentId:id},function(e){
	
		var post = e.content, imageurl = '';
		//alert(JSON.stringify(post));
		var lat = parseFloat(post.lat);
		var lng = parseFloat(post.lng);
		
		var curplace = that.placelist[post.groupId];
		
		if (post.image != '') {
			imageurl = '<img src="'+post['image']+'"  />';
		}
		var content = '<div class="author">By ' + post.authorName+'</div><div class="timenote">'+post.lastUpdate+'</div><div class="desc">'+ imageurl +post.text+'</div>';
	
		
		postmap.clearMarkers();
		if (lat > -1 && lng > -1) {
			$('#pdetail .plocation').show();
			var latlng = new google.maps.LatLng(lat,lng);
			
			postmap.addMarker(latlng,null,'');
		}
		else {
			$('#pdetail .plocation').hide();
		}
		var role = curplace.role;
		
		if ( role < 1) {
			$('#commentform').hide();
			$('#surveyform').hide();
		}
		else if (role == 2 || role == 4) {
			that.listmembers(post.groupId,role);
		}
		
		
		$('#commentform input#contentId').val(post.id);
		that.listComments(post.id,0);
		
		$('#pdetail .pcontent').html(content);
	
	});
};

wcDashboard.prototype.listproinfo = function(gid) {
	var ginfo = this.placelist[gid];
	
	//if ($.cookie('_wc_session') == ginfo.authorId) {
	if ($.cookie('_wc_session') == null || typeof(ginfo) == 'undefined') {
		var data = new wcData();
		var that = this;
		data.load('group/info',{groupId:gid},function(e){
			var ginfo = e;
			that.setGroupInfo(ginfo);
			delete data;
		});
	}
	else
		this.setGroupInfo(ginfo);
	
	/*$('#gtitle').html(ginfo.name);
	var icon;
	var d = new Date();
	if (ginfo['icon'] != '') {
		icon = ginfo['icon']
	}
	else {
		var iconfile = HOMEURL + '/content/img/place_' + gid + '.jpg';
		
		if (ImageExist(iconfile))
			icon = iconfile;
		else
			icon = HOMEURL + '/images/place_icon.png';
	}
	
	var desc = ginfo['description'];
	if (desc.length > 200) {
		desc = desc.substr(0,200) + ' ... ';
	}
	t = d.getTime();
	var leavebtn = $('<input type="button" id="'+ginfo.id+'" value="Leave Community" />');
	
	var pinfo = '<img class="icon" src="'+icon+'?d='+t+'"><div class="desc">' + desc + '<a class="more" href="'+HOMEURL+'/community/'+ginfo.id+'/'+ginfo.name+'">MORE</a></div>';
	
	$('#pinfo').html(pinfo);
	$('#pinfo').append(leavebtn);
	
	var btn = leavebtn.click(function(e){
		var grp = new wcGroups();
		var id = $(this).attr('id');
		
		grp.leave(id,function(e) {
			location.reload();
			delete grp;
		});
		delete grp;
		delete btn;
	});*/
};

wcDashboard.prototype.setGroupInfo = function(ginfo) {
	if (typeof(ginfo) == 'undefined') return ;
	
	if ($.cookie('_wc_session') == null) {
		$('#gtitle').html('<a href="'+HOMEURL+'/community/'+ginfo.id+'">' + ginfo.name + '</a>');
	}
	else
		$('#gtitle').html('<a href="'+HOMEURL+'/page/dashboard/'+ginfo.id+'">' + ginfo.name + '</a>');
		
	var icon;
	var d = new Date();
	var gid = ginfo.id;
	
	
		var iconfile = HOMEURL + '/content/img/place_' + gid + '.jpg';
		
		if (ImageExist(iconfile))
			icon = iconfile;
		else if (ginfo['icon'] != '') {
			icon = ginfo['icon']
		}
		else
			icon = HOMEURL + '/images/place_icon.png';
	
	
	var desc = ginfo['description'];
	if (desc.length > 200) {
		desc = desc.substr(0,200) + ' ... ';
	}
	t = d.getTime();
	
	var ginfo1 = this.placelist[ginfo.id];
	
	var leavebtn = $('<input type="button" id="'+ginfo.id+'" value="Leave Community" />');
	
	var pinfo = '<img class="icon" src="'+icon+'?d='+t+'"><div class="desc">' + desc + '<a class="more" href="'+HOMEURL+'/community/'+ginfo.id+'/'+ginfo.name+'">LEARN MORE</a></div>';
	
	$('#pinfo').html(pinfo);
	
	if ($.cookie('_wc_session') != null && typeof(ginfo1) != 'undefined') {
		$('#pinfo').append(leavebtn);
		
		var btn = leavebtn.click(function(e){
			var grp = new wcGroups();
			var id = $(this).attr('id');
			
			grp.leave(id,function(e) {
				location.reload();
				delete grp;
			});
			delete grp;
			delete btn;
		});
	}
	else {
		var joinbtn = $('<input type="button" id="'+ginfo.id+'" value="Join Community" />');
	
		$('#pinfo').append(joinbtn);
		
		var btn = joinbtn.click(function(e){
			var grp = new wcGroups();
			var id = $(this).attr('id');
			
			grp.join(id);
			delete grp;
			delete btn;
		});
	}
};

wcDashboard.prototype.setPages = function(div) {
	var prevs = $('<a href="">More</a>');
	var that = this;
	var gid = this._gid;
	div.append(prevs);
	
	prevs.click(function() {
		//that.postlist = {};
		var page = that._currentpage + 1;
		
		//$('#postlist').empty();
		that.listposts(gid,page);
		that._currentpage = page;
		
		return false;
	});
};


wcDashboard.prototype.listposts = function(gid,page) {
	var data = new wcData();
	var that = this;
	
	if (typeof(page) == "undefined") {
		page = 1;
	}
	
	var role = this.placelist[gid].role;
    
	var POSTTYPE = this.posttype;
	var POSTSTATUSES = this.poststatus;
	var morediv = $('<div id="postmorelink" class="morelink"></div>');
	
	if($('.groupposts .morelink').is(":visible")) {
		$('.groupposts .morelink').hide();
	}
	
	data.load('content/list',{'groupId':gid,'page':page},function(e){
		//alert(JSON.stringify(e));
		var more = e.more;
		var currentDate = new Date();
		if (typeof(e.content) != 'undefined') {
			var posts = e.content, list = '',count=0,morelink='';
			
				for(var p in posts) {
					//alert(JSON.stringify(posts[p]))
					var pp = that.postlist[posts[p].id];
					
					if(typeof(pp) == 'undefined') {
						count++;
						var postimg = '',css='',css1='style="margin-left:10px"';
						image = HOMEURL + '/images/post-logo.jpg';
						var deletebtn = '', selectbox = '';
						
						if (posts[p].image != null) {
							image = posts[p].image;
							postimg = '<div class="thumb"><img src="'+image+'" /></div>';
							css = 'margin-left:40px';
							css1 = 'style="margin-left:95px"';
						}
						
						
						/*if (($.cookie('_wc_session') == posts[p].authorId) || (role == 4 || role == 2)) {
							deletebtn = '<div class="crossbtn" onclick="_postDel('+posts[p].id+')">Delete</div>';
						}*/
						
						var posturl = HOMEURL + '/post/' + posts[p].id;
						var eventdate = '';
						if (posts[p].type == 2) {
							
							var eventD = trimDate(posts[p].eventDate);
							
							if (eventD.getTime() < currentDate.getTime()) {
								posts[p].status = 4;
							}
							eventdate = '<div class="eventdate">Event Date: ' + eventD.format('dd mmm, yyyy H:M')  + '</div>';
							
						}
						var shorttext = posts[p].text;
						if (posts[p].text.length > 20) {
							shorttext = posts[p].text.substr(0,20) + '...';
						}
						
						var cat = POSTTYPE[posts[p].type];
						var msg1 = shorttext + ' ' + posturl;
						var sharebtn = '<li class="smail" onclick="emailToFriend(\''+msg1+'\')"></li><li><a class="stw" href="https://twitter.com/share?url='+posturl+'&text='+shorttext+'&related=WeCareMY"></a></li><li class="sfb" onclick="postToFeed(\''+posturl+'\',\''+posts[p].text+' ... \',\''+cat+'\',\'\')"></li>';
						
						var dateUpdated = trimDate(posts[p].lastUpdate).friendlytime();
						
						list = $('<div id="post-'+ posts[p].id +'-'+ posts[p].type +'" class="post sidebox"><div class="pbottom"><ul><li class="ptype">'+cat+'</li><li class="pstatus"></li><li class="comment">'+ posts[p].commentCount +'<div class="sq"></div></li></ul></div>'+deletebtn+'<div style="clear:both"></div><div class="postentry" >'+postimg+'<div class="p1" '+css1+'><a href="'+ posturl+'" class="ptext">' + posts[p].text + eventdate +'</a><div class="pauthor" id="'+posts[p].id + '-' + posts[p].authorId +'">By '+posts[p].authorName + ' | '+ dateUpdated +'</div></div><div class="pshare">'+sharebtn+'</div></div></div>');
						list.hide();
						$('#postlist').append(list);
						//that.postlist.push([posts[p].id,posts[p].lat,posts[p].lng,content]);
						posts[p].content = '<div class="icontent">'+postimg+'<div class="postcontent" style="'+css+'"><a id="p_'+posts[p].id+'" class="detailbtn" href="'+ posturl+'">' + posts[p].text  + '</a>' + eventdate +'<div class="author"> by '+posts[p].authorName+ ' | ' +cat+' | ' + dateUpdated +'</div></div>';
						that.postlist[posts[p].id] = posts[p];
					}
				}
                
                $('#postlist .post').each(function() {
                    var m = $(this).attr('id').replace('post-','').split('-');
                    
                    var id = m[0];
                    var postinfo = that.postlist[id];
                    //that.loadPostComments(id,$(this));
                    if ($.cookie('_wc_session') == postinfo.authorId || (role == 4 || role == 2)) {
                            var deletebtn = $('<div id="delp-'+id+'" class="crossbtn" onclick="_postDel('+postinfo.id+')" style="display:none">Delete</div>');
                            $(this).append(deletebtn);
                            $(this).hover(function(){
                                deletebtn.show();
                            },
                            function(){
                                deletebtn.hide();
                            });
                    }
                });
                
                
				that.refreshFeed();
				//that.refreshListWithStatus();
				$('.groupposts .morelink').empty();
				
				//alert($('.groupposts .morelink').is(":visible"));
				//morediv.hide();
				if (more) {
					that.setPages(morediv);
					$('.groupposts').append(morediv);
					$('.groupposts .morelink').show();
				}
				else {
					$('.groupposts .morelink').empty();
					//morediv.hide();
				}
				
				//that.refreshListWithStatus();
				//if (role == 4 || role == 2) {
					//$.post(HOMEURL + '/status.php',{act:'get',gid:gid},function(e){
					var wdata = new wcData();
					wdata.postload('/api/status',{mtd:'get',gid:gid},function(e) {
						var statuses = e;
						
						$('#postlist').children('.post').each(function() {
							var m = $(this).attr('id').replace('post-','').split('-');
							var id = m[0], status = 1;
							
							if (typeof(that.postlist[id]) != 'undefined') {
								if (typeof(statuses[id]) != 'undefined') {
									status = statuses[id].status;
									subtype = statuses[id].subtype;
									subtype2 = statuses[id].subtype2;
									that.postlist[id].status = status;
									that.postlist[id].subtype = subtype;
									that.postlist[id].subtype2 = subtype2;
									
									if (that.postlist[id].type == 1 || that.postlist[id].type == 2) {
										var t = that.postlist[id].type, sub = '';
										if (subtype > 0) {
											t = that.postlist[id].type + '-' + subtype;
										}
										
										if (typeof(that.postsubtype[t]) != 'undefined' && subtype2 > 0) sub = ' - ' + that.postsubtype[t][subtype2];
										
										$(this).children('.postentry').children('.p1').children('.pauthor').append(' | ' + that.posttype[t] + sub);
									}
									
									
								}
								else if (typeof(that.postlist[id].status) == 'undefined')
									that.postlist[id].status = 1;
								else
									status = that.postlist[id].status;
								
                                var status_text = $('<span class="statustext"></span>');
								if (role == 4 || role == 2 || ($.cookie('_wc_session') == that.postlist[id].authorId)) {	
									if (that.postlist[id].type == 1) {
										var statusForm = that.getStatusForm(gid,id,m[1],status);
                                        status_text.html(POSTSTATUSES[that.postlist[id].status]);
										$(this).children('.pbottom').children('ul').children('.pstatus').append(status_text);
                                        $(this).children('.pbottom').children('ul').children('.pstatus').append(statusForm);
                                        
                                        statusForm.hide();
                                         $(this).hover(function(){
                                            statusForm.show();
                                         },
                                         function(){
                                            statusForm.hide();
                                         });
									}
								}
								else {
									$(this).children('.pbottom').children('ul').children('.pstatus').html(POSTSTATUSES[that.postlist[id].status])
								}
							}
						});
						
						$('#postlist .wcStatus').change(function(){
							var id = $(this).attr("id").split('-');
							
							var obj = $(this), status = $(this).val(), parent = $(this).parent().parent();
							var params = {
								'mtd':'add',
								 gid:id[0],
								 cid:id[1],
								 status:status,
								 type:id[2]
								 };
							
							if(confirm('Do you sure want to change the post\'s status')) {

								var wdata2 = new wcData();
								wdata2.postload('/api/status',params,function(e) {
									/*alert('the post Status Updated');*/
                                    obj.hide();
                                    parent.find('.statustext').html(POSTSTATUSES[status]);
                                    
									delete wdata2;
								});
								
							}
						});
						that.refreshListWithStatus();
						delete wdata;
					});
					//},'json');
					
				//}
			
			
		   /*$('.postdetail').click(function(){
				var id = $(this).attr("id").replace('p_','');
				that.getPostDialog(id);
				postmap.resize();
				postmap.fitMarkers();
				return false;
			});*/
			
			
		}
	}
			
	);
};

wcDashboard.prototype.getMyPostList = function() {
	var gid = this._gid;
	var postlist = this.postlist;
	
	//if (gid > 0) {
	 var mid = $.cookie('_wc_session');
	 var marr = [];
		$('#postlist .post').each(function() {
			var m = $(this).attr('id').replace('post-','').split('-');
			var id = m[0];
			var show = false;
			
			var post = postlist[id];
			$(this).hide();
			if (post.authorId == mid) {
				$(this).show();
				show = true;
			}
			if (show) {
				marr.push(post);
			}
		});
		
		//if($('.maptab').is(':visible')) {
		if (marr.length > 0) {
			dmap.load(arr);
			dmap.resize();
			dmap.fitMarkers();
		}
	//}
};

wcDashboard.prototype.refreshPostList = function(type,status,subtype,subtype2) {
	var postlist = this.postlist;
	var arr = [], gotSubtype = false,gotSubtype2 = false;
	var emptymsg = $('<div id="emptymsg" style="text-align:center;margin-top:20px;">No any post found</div>');
	
	//alert(type + "=" + subtype + "=" + subtype2);
	if ((type == 1 || type == 2) && typeof(subtype)!= 'undefined' && subtype != null  ) {
		//subtype = $('#feedbacktypeSel').val();
		gotSubtype = true;
	}
	
	if ((type == 1 || type == 2) && typeof(subtype2)!= 'undefined' && subtype2 > -1) {
		//subtype = $('#feedbacktypeSel').val();
		gotSubtype2 = true;
	}
	
	if (subtype == 0 && subtype2 == -1) {
		gotSubtype = gotSubtype2 = false;
	}
	
	$('#postlist .post').each(function() {
		var m = $(this).attr('id').replace('post-','').split('-');
		var id = m[0], posttype = m[1];
		var show = false;
		var postinfo = postlist[id];
		//if (type == 2 && typeof(postinfo.subtype) != 'undefined' ) alert('C:' + id + '=' + postinfo.subtype + "=" + postinfo.subtype2);
		$(this).hide();
		
		if (gotSubtype && !gotSubtype2) {
			
			if ( type == postinfo.type) {
				if (subtype == -1) {
					if (status == postinfo.status) {
						$(this).show(); show = true;
					}
					else if (status == 0) {
						$(this).show(); show = true;
					}
				}
				else if (status == 0) {
					if (subtype == postinfo.subtype) {
						$(this).show(); show = true;
					}
				}
				else if (subtype == postinfo.subtype && status == postinfo.status) {
					
					$(this).show(); show = true;
				}
				
			}
		
		}
		else if (gotSubtype && gotSubtype2) {
			
			if ( type == postinfo.type) {
				if (subtype2 == -1 && subtype == postinfo.subtype) {
					if (status == postinfo.status) {
						$(this).show(); show = true;
					}
					else if (status == 0) {
						$(this).show(); show = true;
					}
				}
				else if (status == 0) {
					if (subtype == postinfo.subtype && subtype2 == postinfo.subtype2) {
						$(this).show(); show = true;
					}
				}
				else if ((subtype == postinfo.subtype && subtype2 == postinfo.subtype2) && status == postinfo.status) {
					
					$(this).show(); show = true;
				}
			}
		
		}
		
		else {
			
			if (type == -1) {
				if (status == postinfo.status) {
					$(this).show(); show = true;
				}
				else if (status == 0) {
					$(this).show(); show = true;
				}
			}
			else if (status == 0) {
				if (type == postinfo.type) {
					$(this).show(); show = true;
				}
				else if (type == -1) {
					$(this).show(); show = true;
				}
			}
			else if (type == postinfo.type && status == postinfo.status) {
				$(this).show(); show = true;
			}
		}
		
		if (show) {
			arr.push(postinfo);
		}
		
	});
	
	if (arr.length == 0) {
		//$('.morelink').empty();
		//$('#postmorelink').html('No result found');
		//$('#postlist').html('No result found');
		$('.groupposts .morelink').hide();
		$('.groupposts #emptymsg').empty();
		$('#postlist').append(emptymsg);
	}
	else if (arr.length < 20) {
		emptymsg.hide();
		$('.groupposts #emptymsg').empty();
		$('.groupposts .morelink').hide();
	}
	else
		$('.groupposts #emptymsg').empty();
		
	if($('.maptab').is(':visible')) {
		
		dmap.load(arr);
		dmap.resize();
		dmap.fitMarkers();
	}
	
};

wcDashboard.prototype.getStatusForm = function(gid,cid,type,status) {
	var list = '';
	var m = $('<div class="cel_selected" ><select id="'+gid+'-'+cid+'-'+type+'" class="wcStatus"></select>&nbsp;</div>');
	for(var i in this.poststatus) {
		var selected = '';
		if (i == status) selected = 'selected';
		m.find('select').append('<option value="'+i+'" '+selected+'>'+this.poststatus[i]+'</option>');
	}
	m.children('select').hide();
    
    m.click(function(){
        if (m.children('select').is(':hidden'))
            m.children('select').show();
        /*else
            m.children('select').hide();*/
    });
    
	return m;
};


wcDashboard.prototype.refreshPosts = function() {
	this.postlist = {};
	$('#postlist').empty();
	this.listposts(this._gid);
};

wcDashboard.prototype.getGeolist = function() {
	var arr = [];
	var postlist = this.postlist;
	
	$('#postlist .post').each(function() {
		var m = $(this).attr('id').replace('post-','').split('-');
		var id = m[0], posttype = m[1];
		var postinfo = postlist[id];
		
		if($(this).is(':visible') && typeof(postinfo) != 'undefined') {
			
			arr.push(postinfo);
		}
		
	});
	
	return arr;
};

wcDashboard.prototype.listComments = function(cid,pid) {
	//if ($.cookie('_wc_session')==null) return '';
	
	this.data = new wcData();
	var memberlist = this.memberlist;
	var that = this;
	$('#pdetail #commentlist').empty();
	
	this.data.load('content/listcomments',{'contentId':cid},function(e){
		var comments = e.comments;
		
		if (typeof(comments) != 'undefined') {
			var c=1;
			for(var i in comments) {
				var e = comments[i];
				//var mem = memberlist[e.commenterId];
				that.commentlist[e.id] = e;
				var deletebtn = '';
				if ($.cookie('_wc_session') == e.commenterId) {
						deletebtn = '<div class="crossbtn" onclick="_commentDel('+e.id+','+cid+','+pid+')">Delete</div>';
				}
				
				$('#pdetail #commentlist').append('<div id="'+e.id+'" class="commentpost boxes">'+deletebtn+'<div class="commententry">'+c+'. <span class="author">'+e.commenterName+' '+e.lastUpdate+'</span><div class="desc">'+e.comment+'</div></div></div>');
				c++;
			}
		}
	});
};

wcDashboard.prototype.postComment = function() {
	var cid = $('#commentform input#contentId').val();
	var comment = $('#commentform #comment').val();
	
	if (comment == '' || comment.length == 0) {
		$('#commentform #comment').focus();
		alert('Please type your comment');
	}
	else {
		var that = this;
		this.data = new wcData();
		this.data.load('content/addcomment',{'contentId':cid,'comment':comment},function(e){
			if (e.id > 0) {
				//alert("Comments added");
				that.listComments(cid);
			}
		});
		
		//$('#commentform input#contentId').val('');
		$('#commentform #comment').val('');
	}
	
};

wcDashboard.prototype.onData = function() {
	//this.data.fire({type:'onData',data:data});
};

wcDashboard.prototype.submitAnswer = function(id,cid,form) {
	var data = new wcData();
	var piechart = this.loadChart;
	
	data.load('content/answer',{contentId:cid,surveyOptionId:id},function(e) {
		var result = e.options;
		alert("Thank you for vote the survey");
		piechart('pie',result);
		$('#pie1').show();
		//dboard.loadChart('pie',result);
		cleanForm(form.attr("id"));
		delete data;
	});
};

wcDashboard.prototype.loadChart = function(charttype,data) {
	if (typeof(data) != 'undefined') {
		var array = [];
		for(var v in data) {
			var m = [data[v].description,parseInt(data[v].count)];
			array.push(m);
		}
		
		
		var plot1 = $.jqplot('pie1', [array], {
				seriesDefaults: {
					// Make this a pie chart.
					
					renderer: jQuery.jqplot.PieRenderer,
					rendererOptions: {
					  // Put data labels on the pie slices.
					  // By default, labels show the percentage of the slice.
					  showDataLabels: true,
					}
				},
				legend: { show:true, location: 'e' },
				grid:{
					shadow:false, 
					drawGridLines: false,
					background: '#fff', 
					borderWidth: 0
				}
			});
		$('#pie1').hide();
	}
};



/*
* Data Event
*/
var wcData = function() {
	this.apiurl = 'https://developer.feedgeorge.com/';
	this.apiurl2 = 'http://developer.feedgeorge.com/';
	this.apikey = 'bc68c914d41a4c7587b8ef86cf95f87e';
	this.options = { 
		target:  '#divToUpdate', 
		data: {'apiKey':this.apikey},
		dataType:  'json', 
		error: function(jqXHR, textStatus, errorThrown) {alert('error' + textStatus)},
		xhrFields: {
				withCredentials: true
		}
	}; 
};
/*wcData.prototype = new EventTarget();
wcData.prototype.constructor = wcData;
wcData.prototype.onData = function(data) {
	this.fire({type:'onData',data:data});
	//this.fireEvent(null,this,'onData',data);
};*/

wcData.prototype.load = function(url,params,callback) {
	params['apiKey'] = this.apikey;
	var that = this;
	
	if ($.browser.msie && parseInt($.browser.version, 10) >= 8 && window.XDomainRequest) {
			
			$.ajax({
			url: this.apiurl2 + url,
			data: params,
			error: function() {alert("url error1:")},
			success: function(data, textStatus, XMLHttpRequest) {
				if (data.success == true) {
					callback.call(that,data.result);
				}
				else {
					alert(data.error +"11: "+ data.reason);
				}
			}
		});	
    } 
	else {
         
		$.ajax({
			url: this.apiurl + url,
			data: params,
			error: function(jqXHR, textStatus){alert("url error:" + textStatus)},
			success: function(data, textStatus, XMLHttpRequest) {
				//alert(JSON.stringify($.cookie);
				//$('#header1').html(XMLHttpRequest.getAllResponseHeaders());
				if (data.success == true) {
					callback.call(that,data.result,data);
				}
				else {
					//alert(data.error +": "+ data.reason);
					callback.call(that,data);
				}
			}
		});	
	}
};

wcData.prototype.formload = function(form,url,callback) {
	var that = this;
	this.options['url'] = this.apiurl + url;
	this.options['success'] = function(data) {
		if (data.success == true) {
			callback.call(that,data.result);
		}
		else {
			alert(data.error +": "+ data.reason);
		}
	};
	form.attr('action',this.apiurl + url);
	
	form.ajaxSubmit(this.options);
};

wcData.prototype.postload = function(url,params,callback) {
	var that = this;
	params['apiKey'] = this.apikey;
	$.ajax({
		url: HOMEURL + url,
		type: "POST",
		data: params,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain:true,
		error: function(jqXHR, textStatus){alert("url "+url +" error: " + params['mtd'] + ' ' + textStatus)},
		success: function(data, textStatus, XMLHttpRequest) {
			callback.call(that,data);
		}
	});	
};

wcData.prototype.clear = function() {
	
	
};

(function($) {
$.fn.formToJson = function() {

   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
})(jQuery);

function _postDel(id) {
	
	
	if (confirm('Are you want to delete this post?')) {
		var data = new wcData();
		data.load('content/delete',{'contentId':id},function(e) {
			//alert(JSON.stringify(e));
			
			/*$.post(HOMEURL + '/status.php',{act:'delpost',cid:id},function(e){
			},'json');*/
			var data2 = new wcData();
			data2.postload('/api/status',{mtd:'delpost',cid:id},function(e){
				delete data2;
			});
			
			
			dboard.refreshPosts();
			delete data;
		});
		
	}
	
};

function _commentDel(id,cid,pid) {
	
	if (confirm("Do you want to delete the comment?")) {
		var data = new wcData();
		data.load('content/deletecomment',{'commentId':id},function(e) {
			//alert(JSON.stringify(e));
			dboard.listComments(cid,pid);
		});
		delete data;
	}
};

function _signup() {
	var bValid = true;
	var email = $( "#semail" ), password = $( "#spass" ),remail = $( "#sremail" ),rpass = $( "#srpass" );
	
	//bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
	// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
	bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
	bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
	
	/*if (email.val() != remail.()) {
		remail.addClass( "ui-state-error" );
		updateTips("Emails not match");
		bValid = false;
	}*/
	
	if (password.val() != rpass.val()) {
		rpass.addClass( "ui-state-error" );
		updateTips("Password not match");
		bValid = false;
	}
   
	if ( bValid ) {
		
		//$( this ).dialog( "close" );
		
		$.post('/index.php?page=user&act=signup',{semail:email.val(),spass:password.val()},function(data) {
			if (data != -1) {
				alert('Sign up Completed! Thank you for join wecare. Please login now.');
				$( "#signuppop" ).dialog( "close" );
				cleanForm('signupform');
			}
		},'json'
		);
		
		return false;
	}
}

