var myplaces = [];
jQuery(function() {

cleanForm('signuppop');	
$( "#signuppop" ).dialog({
			autoOpen: false,
			height: 320,
			width: 350,
			modal: true,
			resizable: false,
			position:'center',
			title: 'New Member Sign up',
			buttons: {
				"Sign Up": function() {
					
					var email = $( "#semail" ), password = $( "#spass" ),remail = $( "#sremail" ),rpass = $( "#srpass" );
					
					var user = new wcUser();
					user.signup(email,password,rpass);
					delete user;
					
				},
				Cancel: function() {
					$( this ).dialog( "close" );
					cleanForm('signuppop');
				}
			},
			close: function() {
				cleanForm('signuppop');
			}
		});
		
		
		$( "#loginpop" ).dialog({
			autoOpen: false,
			height: 250,
			width: 300,
			modal: true,
			resizable: false,
			position:'center',
			title: 'Member Login',
			buttons: {
				"Login": function() {
					var bValid = true;
					//allFields.removeClass( "ui-state-error" );

					var email = $( "#loginform input#lemail" ),password = $( "#loginform input#lpass" );
					var user = new wcUser();
					user.login(email,password);
					
				},
				Cancel: function() {
					$( this ).dialog( "close" );
					cleanForm('loginpop');
				}
			},
			close: function() {
				cleanForm('loginpop');
			}
		});
		
	
		$('#loginbtn').click(function() {
			//$('#loginbtn').css({'background-color':'#eee'});
			$( "#loginbtn" ).addClass('tabSelect');
			$( "#loginpop2" ).modal({position:[83,"65%"],minHeight:180,minWidth:150,closeHTML: "-",opacity:0,overlayClose:true,onClose:function(){$( "#loginbtn" ).removeClass('tabSelect');$.modal.close();}});
			//$( "#loginpop" ).dialog( "open" );
		});
		
		$( "#signinform input#signbtn" ).click(function() {
			
			var user = new wcUser();
			var email = $('#signinform input#lemail');
			var pass = $('#signinform input#lpass');
			user.login(email,pass);
		});
		
		$( "#signupform2" ).submit(function() {
			var email = $( "#signupform2 input#semail" ), password = $( "#signupform2 input#spass" ),rpass = $( "#signupform2 input#srpass" );
			var user = new wcUser();
			user.signup(email,password,rpass);
			delete user;
			return false;
		});
		
       $( "input#cancelbtn" ).click(function() {
			
			$.modal.close();
		});

		$( "#signupbtn" ).click(function() {
				$( "#signupbtn" ).addClass('tabSelect');
				$( "#signuppop2" ).modal({position:[83,"70%"],minHeight:200,minWidth:150,closeHTML: "-",opacity:0,overlayClose:true,onClose:function(){$( "#signupbtn" ).removeClass('tabSelect');$.modal.close();}});
			
		});
		
		$( ".editProbtn" ).click(function(e) {
			var d = jQuery.parseJSON($.cookie('_wc_session_in1'));
			
			$('#uploadAvatorform img.thumbnail').attr('src',d.p + '?' +new Date().getTime());
			cleanForm('changPwform');
			jQuery.modal.close();
			var m = $('#editPropop');
			$.modal($('#editPropop'),{minHeight:430,minWidth:300,overlayClose:true});
			
			return false;
		});
        
        $( "#forgotPwdbtn" ).click(function(e) {
			if ($( "#forgotpwdpop" ).is(':hidden'))
                $( "#forgotpwdpop" ).slideDown();
            else {
                cleanForm('forgotpwdpop');
                $( "#forgotpwdpop" ).slideUp();
            }
			return false;
		});
		
		$( "#forgotPopform" ).submit(function(e) {
			var u = new wcUser();
			u.forgetPassword();
			return false;
		});
		
		
		$( "#changPwform input#changepass" ).click(function(e) {
			var u = new wcUser();
			u.changePassword($('#changPwform'));
			return false;
		});
		
		
		$( "#changeContactform" ).submit(function(e) {
			var u = new wcUser();
			u.changeContact($(this));
			return false;
		});
		
		$( "#changeEmailform" ).submit(function(e) {
			var u = new wcUser();
			u.changeEmail($(this));
			return false;
		});
		
		$('#subscribebutton').click(function(e) {
			cleanForm('newsletterform');
			$( "#newsletterdiv" ).modal({minHeight:100,minWidth:300,opacity:0,overlayClose:true});
			return false;
		});
		
		$( "#uploadAvatorform" ).submit(function() {
			var u = new wcUser();
			u.uploadAvator($(this));
			return false;
		});
		
		
		$( "#shareplaceform" ).submit(function() {
			var place = $('#shareplaceform input#place');
			var bValid = true;
			bValid = bValid && checkRegexp2( place, /^([0-9a-zA-Z ])+$/);
			
			if (bValid) {
			$.post(HOMEURL + '/suggest.php',{act:'addplace',place:place.val()},function(e){
				cleanForm('shareplaceform');
				//if (e == 1) {
					alert('Thank you for your feedback. Meanwhile please sign up with our newsletter for latest update of the portal.');
				//}
			},'json');
			}
			else
				alert('Please enter a place you want');
				
			return false;
		});
		
		
		$( "#newsletterform" ).submit(function() {
			var email = $('#newsletterform input#nemail');
			var bValid = true;
			bValid = bValid && checkRegexp2( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i );
	
			if (bValid) {
			$.post(HOMEURL + '/suggest.php',{act:'addemail',nemail:email.val()},function(e){
				//if (e == 1) {
					alert('Thank you for sign up with our newsletter');
					$.modal.close();
				//}
			},'json');
			}
			else
				alert('Please enter your email. "eg. ui@jquery.com"');
				
			return false;
		});
		
		$('#editstatusfrm').submit(function() {
			var bValid = true;
			var status = $(this).children('select[name="status"]').val()
			
			if (status == '') {
				alert('Please select a status');
				$(this).children('select[name="status"]').focus();
				bValid = false;
			}
			
			if (bValid) {
				$.post(HOMEURL + '/status.php',$(this).serialize(),function(e) {
					alert('The post status Updated ');
					$.modal.close();
					window.location.reload();
				},'json');
			}
			
			return false;
		});
		
		$('#editpostfrm').submit(function() {
			var bValid = true;
			var cat = $(this).children('#posttype').val(), subcat = $(this).children('select[name="postsubtype"]').val();
			
			if (cat == -1) {
				alert('Please select a category');
				$(this).children('select[name="posttype"]').focus();
				bValid = false;
				return false;
			}
		
			if (bValid) {
				$.post(HOMEURL + '/status.php',$(this).serialize(),function(e) {
					alert('Updated ' + e);
					$.modal.close();
					window.location.reload();
				},'json');
			}
			return false;
		});
		
		$('#posttype').change(function(){
			var cat = $(this).val();
			loadSubcat($('#postsubtype'),cat,true);
		});
			
		$( "#logoutbtn" ).click(function() {
			
				var d = new wcData();
				d.load('user/logout',{},
					 function(data) {
						$.cookie('_wc_session', null,{ path: '/', domain: '.' + domain });
						$.cookie('_wc_session_in1', null,{ path: '/', domain: '.' + domain });
						window.location.href = HOMEURL + "/index.php";
					}
				);
				delete d;
				
		});
		
		$( ".FBSHARE" ).click(function() {
			var m = $(this).attr('name');
			alert(m);
		});
	});
	
function edit_group(act,gid) {
	if (act == '') act = 'join';
	
	var data = new wcData();
	data.load('group/' + act, {groupId:gid}, function(e){
		//alert('Joined completed. Currently in pending status until Admin approval your request');
		window.location.href="/page/dashboard/" + gid;
	});
};

function checkRegexp( o, regexp, n ) {
			if ( !( regexp.test( o.val() ) ) ) {
				//o.addClass( "ui-state-error" );
				o.focus();
				updateTips( n );
				return false;
			} else {
				return true;
			}
};

function checkRegexp2( o, regexp, n) {
	if ( !( regexp.test( o.val() ) ) ) {
        alert(n);
		o.focus();
		return false;
	} else {
		return true;
	}
};

function updateTips( t ) {

	var tips = $( ".validateTips" );
	tips.text( t ).addClass( "ui-state-highlight" );
	setTimeout(function() {
		tips.removeClass( "ui-state-highlight", 1500 );
	}, 500 );
};

function cleanForm(formId) {
	$( "#" + formId + " input" ).each(function() {
		if ($(this).attr('type')!= 'radio' && $(this).attr('type')!= 'checkbox' && $(this).attr('type')!= 'button' && $(this).attr('type')!= 'submit' && $(this).attr('type')!= 'hidden') {
			$(this).val('');
			$(this).removeClass( "ui-state-error" );
		}
	});
	
	$( "#" + formId + " textarea" ).val('');
	
	$('#' + formId +' input:radio').each(function(){
      $(this).removeAttr('checked');
	});
	
	$('#' + formId + ' input[type="checkbox"]:checked').each(function(){
      $(this).checked = false;  
	});
 
	
	//$( "#" + formId + " select" ).val('');
};

function ImageExist(url) 
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
};

function postToFeed(url,name,type,desc) {
		var msg, type1 = type;
		
		if (type == 'Group') {
			desc = msg = 'Join me at ' + name + ' ' + url;
			type1 = 'Community';
		}
		
        // calling the API ...
        var obj = {
          method: 'feed',
		  message: msg,
          link: url,
          picture: HOMEURL + '/images/wecarelogo.png',
          name: name,
		  caption: type1,
          description: desc,
		  user_message_prompt: 'Share your thoughts about ' + name + ' via wecare.my '
        };

        function callback(response) {
          //document.getElementById('FBMSG').innerHTML = "Post ID: " + response['post_id'];
		 
			if (response && response.post_id) {
			  alert('Post was published.');
			} else {
			  //alert('Post was not published.');
			}
  
        }

        FB.ui(obj, callback);
};

function emailToGroupMember() {
	var msgbox = $('<div class="mailform"><h3>Email to Group Members</h3><form action="" method="POST"></form></div>');
	//var emailbox = $('<label>To</label><input type="text" name="femail" id="femail" />');
	var contentbox = $('<textarea id="fcontent" name="fcontent"></textarea>');
	var sendButton = $('<input type="button" name="send" id="send" value="Send Now" />');
	
	var emailgroup = $('<br/><input type="checkbox" name="emailtogroup" value="1" />Emails to group members');
	
	//emailbox.watermark('Your friend emails');
	//contentbox.watermark("Hi friends. \n\n Join me at Wecare.my");
	contentbox.val();
	
	//msgbox.children('form').append(emailbox);
	//msgbox.children('form').append(emailgroup);
	msgbox.children('form').append(contentbox);
	msgbox.children('form').append(sendButton);
	$('#main').append(msgbox);
	
	sendButton.click(function(e) {
		var bValid = true;
		if (contentbox.val() == '') {
			   alert("please enter any message");
			   contentbox.focus();
			   bValid = false;
		}
		
		
		if (bValid) {
			
			
			$.ajax({
				url: HOMEURL + '/invite.php',
				type: "post",
				data: {act:'invite',femail:emailbox.val(),fcontent:contentbox.val()},
				dataType: 'json',
				error: function(jqXHR, textStatus){alert("url error:" + textStatus)},
				success: function(data) {
					alert(JSON.stringify(data));	
				}
			});	
		}
		return false;
	});
	
	msgbox.modal({minHeight:200,minWidth:300});
};


function emailToFriend(msg) {
	var msgbox = $('<div class="mailform"><h3>Share to Friend(s)</h3><form action="" method="POST"></form></div>');
	var emailbox = $('<label>To</label><input type="text" name="femail" id="femail" />');
	var contentbox = $('<textarea id="fcontent" name="fcontent"></textarea>');
	var sendButton = $('<input type="button" name="send" id="send" value="Send Now" />');
	
	//var emailgroup = $('<br/><input type="checkbox" name="emailtogroup" value="1" />Emails to group members');
	
	emailbox.watermark('Your friend emails');
	contentbox.watermark("Hi friends. \n\n Join me at Wecare.my");
	contentbox.val(msg);
	
	msgbox.children('form').append(emailbox);
	//msgbox.children('form').append(emailgroup);
	msgbox.children('form').append(contentbox);
	msgbox.children('form').append(sendButton);
	
	$('#main').append(msgbox);
	
    sendButton.click(function(e) {
		var data = wcData();
		var bValid = true;
		
		if (emailbox.val() == '') {
			alert('Please type your friend\'s email ');
			bValid = false;
		}
		
		bValid = bValid && checkRegexp( emailbox, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
				
		if (bValid) {
			
			if ($("input[name='emailtogroup']:checked").val()) {
			   
			}
		
		
			$.ajax({
				url: HOMEURL + '/invite.php',
				type: "post",
				data: {act:'invite',femail:emailbox.val(),fcontent:contentbox.val()},
				dataType: 'json',
				error: function(jqXHR, textStatus){alert("url error:" + textStatus)},
				success: function(data) {
					alert(JSON.stringify(data));	
				}
			});	
		}
		return false;
		
	});
	
	msgbox.modal({minHeight:200,minWidth:300});
};

function loadSubcat(obj,cat,noall) {
			obj.empty();
			if (noall == null) noall = false;
			if (dboard) {
				var subtypes = dboard.getSubtype(cat), c=0;
				if(!noall) obj.append('<option value="-1"> All </option>'+"\n");
				for(var i in subtypes) {
					obj.append('<option value="'+i+'"> '+subtypes[i]+'</option>'+"\n");
					c++;
				}
				if (c > 0) {
					//$('#subtype > .subcatlist').prepend('<label>Sub Category</label>');
					 obj.show();
				}
				else
					obj.hide();
			}
};


/*
* Slides, A Slideshow Plugin for jQuery
* Intructions: http://slidesjs.com
* By: Nathan Searles, http://nathansearles.com
* Version: 1.1.9
* Updated: September 5th, 2011
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
(function(a){a.fn.slides=function(b){return b=a.extend({},a.fn.slides.option,b),this.each(function(){function w(g,h,i){if(!p&&o){p=!0,b.animationStart(n+1);switch(g){case"next":l=n,k=n+1,k=e===k?0:k,r=f*2,g=-f*2,n=k;break;case"prev":l=n,k=n-1,k=k===-1?e-1:k,r=0,g=0,n=k;break;case"pagination":k=parseInt(i,10),l=a("."+b.paginationClass+" li."+b.currentClass+" a",c).attr("href").match("[^#/]+$"),k>l?(r=f*2,g=-f*2):(r=0,g=0),n=k}h==="fade"?b.crossfade?d.children(":eq("+k+")",c).css({zIndex:10}).fadeIn(b.fadeSpeed,b.fadeEasing,function(){b.autoHeight?d.animate({height:d.children(":eq("+k+")",c).outerHeight()},b.autoHeightSpeed,function(){d.children(":eq("+l+")",c).css({display:"none",zIndex:0}),d.children(":eq("+k+")",c).css({zIndex:0}),b.animationComplete(k+1),p=!1}):(d.children(":eq("+l+")",c).css({display:"none",zIndex:0}),d.children(":eq("+k+")",c).css({zIndex:0}),b.animationComplete(k+1),p=!1)}):d.children(":eq("+l+")",c).fadeOut(b.fadeSpeed,b.fadeEasing,function(){b.autoHeight?d.animate({height:d.children(":eq("+k+")",c).outerHeight()},b.autoHeightSpeed,function(){d.children(":eq("+k+")",c).fadeIn(b.fadeSpeed,b.fadeEasing)}):d.children(":eq("+k+")",c).fadeIn(b.fadeSpeed,b.fadeEasing,function(){a.browser.msie&&a(this).get(0).style.removeAttribute("filter")}),b.animationComplete(k+1),p=!1}):(d.children(":eq("+k+")").css({left:r,display:"block"}),b.autoHeight?d.animate({left:g,height:d.children(":eq("+k+")").outerHeight()},b.slideSpeed,b.slideEasing,function(){d.css({left:-f}),d.children(":eq("+k+")").css({left:f,zIndex:5}),d.children(":eq("+l+")").css({left:f,display:"none",zIndex:0}),b.animationComplete(k+1),p=!1}):d.animate({left:g},b.slideSpeed,b.slideEasing,function(){d.css({left:-f}),d.children(":eq("+k+")").css({left:f,zIndex:5}),d.children(":eq("+l+")").css({left:f,display:"none",zIndex:0}),b.animationComplete(k+1),p=!1})),b.pagination&&(a("."+b.paginationClass+" li."+b.currentClass,c).removeClass(b.currentClass),a("."+b.paginationClass+" li:eq("+k+")",c).addClass(b.currentClass))}}function x(){clearInterval(c.data("interval"))}function y(){b.pause?(clearTimeout(c.data("pause")),clearInterval(c.data("interval")),u=setTimeout(function(){clearTimeout(c.data("pause")),v=setInterval(function(){w("next",i)},b.play),c.data("interval",v)},b.pause),c.data("pause",u)):x()}a("."+b.container,a(this)).children().wrapAll('<div class="slides_control"/>');var c=a(this),d=a(".slides_control",c),e=d.children().size(),f=d.children().outerWidth(),g=d.children().outerHeight(),h=b.start-1,i=b.effect.indexOf(",")<0?b.effect:b.effect.replace(" ","").split(",")[0],j=b.effect.indexOf(",")<0?i:b.effect.replace(" ","").split(",")[1],k=0,l=0,m=0,n=0,o,p,q,r,s,t,u,v;if(e<2)return a("."+b.container,a(this)).fadeIn(b.fadeSpeed,b.fadeEasing,function(){o=!0,b.slidesLoaded()}),a("."+b.next+", ."+b.prev).fadeOut(0),!1;if(e<2)return;h<0&&(h=0),h>e&&(h=e-1),b.start&&(n=h),b.randomize&&d.randomize(),a("."+b.container,c).css({overflow:"hidden",position:"relative"}),d.children().css({position:"absolute",top:0,left:d.children().outerWidth(),zIndex:0,display:"none"}),d.css({position:"relative",width:f*3,height:g,left:-f}),a("."+b.container,c).css({display:"block"}),b.autoHeight&&(d.children().css({height:"auto"}),d.animate({height:d.children(":eq("+h+")").outerHeight()},b.autoHeightSpeed));if(b.preload&&d.find("img:eq("+h+")").length){a("."+b.container,c).css({background:"url("+b.preloadImage+") no-repeat 50% 50%"});var z=d.find("img:eq("+h+")").attr("src")+"?"+(new Date).getTime();a("img",c).parent().attr("class")!="slides_control"?t=d.children(":eq(0)")[0].tagName.toLowerCase():t=d.find("img:eq("+h+")"),d.find("img:eq("+h+")").attr("src",z).load(function(){d.find(t+":eq("+h+")").fadeIn(b.fadeSpeed,b.fadeEasing,function(){a(this).css({zIndex:5}),a("."+b.container,c).css({background:""}),o=!0,b.slidesLoaded()})})}else d.children(":eq("+h+")").fadeIn(b.fadeSpeed,b.fadeEasing,function(){o=!0,b.slidesLoaded()});b.bigTarget&&(d.children().css({cursor:"pointer"}),d.children().click(function(){return w("next",i),!1})),b.hoverPause&&b.play&&(d.bind("mouseover",function(){x()}),d.bind("mouseleave",function(){y()})),b.generateNextPrev&&(a("."+b.container,c).after('<a href="#" class="'+b.prev+'">Prev</a>'),a("."+b.prev,c).after('<a href="#" class="'+b.next+'">Next</a>')),a("."+b.next,c).click(function(a){a.preventDefault(),b.play&&y(),w("next",i)}),a("."+b.prev,c).click(function(a){a.preventDefault(),b.play&&y(),w("prev",i)}),b.generatePagination?(b.prependPagination?c.prepend("<ul class="+b.paginationClass+"></ul>"):c.append("<ul class="+b.paginationClass+"></ul>"),d.children().each(function(){a("."+b.paginationClass,c).append('<li><a href="#'+m+'">'+(m+1)+"</a></li>"),m++})):a("."+b.paginationClass+" li a",c).each(function(){a(this).attr("href","#"+m),m++}),a("."+b.paginationClass+" li:eq("+h+")",c).addClass(b.currentClass),a("."+b.paginationClass+" li a",c).click(function(){return b.play&&y(),q=a(this).attr("href").match("[^#/]+$"),n!=q&&w("pagination",j,q),!1}),a("a.link",c).click(function(){return b.play&&y(),q=a(this).attr("href").match("[^#/]+$")-1,n!=q&&w("pagination",j,q),!1}),b.play&&(v=setInterval(function(){w("next",i)},b.play),c.data("interval",v))})},a.fn.slides.option={preload:!1,preloadImage:"/img/loading.gif",container:"slides_container",generateNextPrev:!1,next:"next",prev:"prev",pagination:!0,generatePagination:!0,prependPagination:!1,paginationClass:"pagination",currentClass:"current",fadeSpeed:350,fadeEasing:"",slideSpeed:350,slideEasing:"",start:1,effect:"slide",crossfade:!1,randomize:!1,play:0,pause:0,hoverPause:!1,autoHeight:!1,autoHeightSpeed:350,bigTarget:!1,animationStart:function(){},animationComplete:function(){},slidesLoaded:function(){}},a.fn.randomize=function(b){function c(){return Math.round(Math.random())-.5}return a(this).each(function(){var d=a(this),e=d.children(),f=e.length;if(f>1){e.hide();var g=[];for(i=0;i<f;i++)g[g.length]=i;g=g.sort(c),a.each(g,function(a,c){var f=e.eq(c),g=f.clone(!0);g.show().appendTo(d),b!==undefined&&b(f,g),f.remove()})}})}})(jQuery)