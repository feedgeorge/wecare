

var WCMAP = function(id,prefix,edit,option) {
	this._id = id;
	this._prefix = prefix;
	
	this._edit = edit || false;
	this._op = {};
	
	this._markers = [];
	this._marker = null;
	this._infowindow = null;
	this._polys = [];
	this._polypoints = [];
	this._zindex = 90;
	this.d_latlng = new google.maps.LatLng(3.14463,101.700439);
	
	var default_op = {
		'drawpoly':false
	};
	
	if (typeof(option) == 'undefined')	option = default_op;
	
	this._op['singlemarker'] = false || option['singlemarker'];
	this._op['drawpoly'] = false || option['drawpoly'];
	this._op['plocation'] = false || option['plocation'];
	this._op['showsearchform'] = false || option['showsearchform'];
	this._op['showpoly'] = false || option['showpoly'];
	this._op['showlabel'] = false || option['showlabel'];
    this._op['singlemap'] = false || option['singlemap'];
	
	this.triggerCenter = false;
	this.initialZoom = false;
	this._latlng = new google.maps.LatLng(3.14463,101.700439);
	
	this._map = new google.maps.Map( document.getElementById(this._id), {
		    zoom: 14,
			center: this._latlng,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
			scrollwheel: false,
	});	
	
	if (this._edit) {
        this._poly = null;
		this._op['showsearchform'] = true;
		if (this._op['drawpoly']) this.initPoly();
		var point = $.cookie('_wc_session_location');
		this._bounds = [];
		if (!this._op['drawpoly']) this.addMarker(point,null);
		var that = this;
		var listener = google.maps.event.addListener(this._map, "idle", function() { 
			
			if (this.getZoom() >= 12) this.setZoom(15);
			
			//this.setCenter(that._marker.getPosition());
			google.maps.event.removeListener(listener); 
		});
		
	}
	else {
		//this._infowindow = new google.maps.InfoWindow();
		this._infowindow  = new InfoBox({boxClass:'mapinfobox',pixelOffset: new google.maps.Size(0,0),alignBottom:true});
		this._bounds = [];
		if (this._op['showpoly']) {
			
			this.loadInit();
		}
		else {
			this.loadInit();
			google.maps.event.addListener(this._infowindow, 'domready', function() {
				$('.postdetail').click(function(){
				
					var id = $(this).attr("id").replace('p_','');
					dboard.getPostDialog(id);
					postmap.resize();
					postmap.fitMarkers();
					return false;
				});
			});
		}
		var that = this;
		var listener = google.maps.event.addListener(this._map, "idle", function() { 
			
			if (that.triggerCenter == true) {
				this.setZoom(12);
				this.setCenter(this.getCenter());
				that.triggerCenter = false;
			//google.maps.event.removeListener(listener1); 
			}
			//if (this.getZoom() >= 12) this.setZoom(12); 
			//google.maps.event.removeListener(listener); 
		});
		
		/*google.maps.event.addListener(this._map, 'center_changed', function() {
			if (that.triggerCenter == true) {
				this.setZoom(15);
				that.triggerCenter = false;
			//google.maps.event.removeListener(listener1); 
			}
		});*/
		
		

	}
	
	if (this._op['showsearchform']) this.initForm();
};

WCMAP.prototype.loadInit = function() {
	var that = this;
	var showPoly = this._op['showpoly'];

	if (this._op['plocation']) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
			    
				if (!isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
					var latlng = new google.maps.LatLng(latitude,longitude);
					that._latlng = latlng;
					$.cookie('_wc_session_location', latitude+'-'+longitude , { path: '/', domain: '.' + domain });
					that.goCenter(latlng);
					//that.searchGroups(latitude,longitude,showPoly);
                   
				}
			},
			function() {
                alert('adadadasd');
				that.goCenter(that._latlng);
				//that.searchGroups(that._latlng.lat(),that._latlng.lng(),showPoly);
				$.cookie('_wc_session_location', that._latlng.lat()+'-'+that._latlng.lng() , { path: '/', domain: '.' + domain });
			},
			{maximumAge:60000, timeout:5000, enableHighAccuracy:true}
		 );
		}
		else {
			this.goCenter(this.d_latlng);
			this.searchGroups(d_latlng.lat(),d_latlng.lng(),showPoly);
		}
		
		//this.goCenter(this.d_latlng);
		this.searchGroups(this.d_latlng.lat(),this.d_latlng.lng(),showPoly);
	}
};


WCMAP.prototype.initForm = function() {
	var defaulttxt = 'Please enter a location';
	this.searchform = $('<div class="searchform"></div>');
	this.searchbox = $('<input id="seachtext" class="inputbox" type="text" value="" />');
	this.button = $('<input type="button" id="searchbtn" value="Load" />');
	//this.searchbox.val(defaulttxt);
	this.searchform.append(this.searchbox);
	this.searchform.append(this.button);
	
	$('#' + this._id).prepend(this.searchform);
	var that = this;
	
	this.searchbox.watermark(defaulttxt,{className: 'watermark'});
	
	/*this.searchbox.focus(function() {
		$(this).val('');
	});
	this.searchbox.blur(function() {
		$(this).val(defaulttxt);
		
	});*/
	
	this.button.click(function() {
		$address = that.searchbox.val();
		if ($address != '')
			that.goLocation($address);
		else {
			alert('Please type any location');
			that.searchbox.focus();
		}
		return false;
	});
	
	this.searchbox.keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			
			$address = $(this).val();
			if ($address != '')
				that.goLocation($address);
			else {
				alert('Please type any location');
				that.searchbox.focus();
			}
			return false;
		}
	});
};

WCMAP.prototype.goLocation = function(address) {
	var that = this;
	var geocoder = new google.maps.Geocoder();
	var showPoly = this._op['showpoly'];
	
	if (address == '') address = 'Kuala Lumpur Malaysia';
	
	geocoder.geocode( { 'address': address}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
		var point = results[0].geometry.location;
	    that.goCenter(point);
		if (that._edit) 
			that.addMarker(point,null);
		else {
			if (showPoly) that._latlng = point;
			that.searchGroups(point.lat(),point.lng(),showPoly,false);
			that.goCenter(point);
			
		}
		
		
	  } else {
		//alert("The location you entered not found.");
	  }
	});
};

WCMAP.prototype.goCenter = function(point) {
	  this._map.setCenter(point);
	  
};

WCMAP.prototype.setLocation = function(lat,lng) {
	var latlng = new google.maps.LatLng(lat,lng);
	this.clearMarkers();
	this.addMarker(latlng,null,'');
	this.goCenter(latlng);
};

WCMAP.prototype.addMarker = function(point,obj,msg) {
  var candrag = false, marker = null;
  if (this._edit) {
	candrag = true;
  }
  var title = '';
  if (obj != null) {
	 title =obj.name;
  }

   if (this._edit) {
	   if (point == null) point = this._latlng;
	   else {
		   if (typeof(point) != 'object') {
			m = point.split('-');
			point = new google.maps.LatLng(parseFloat(m[0]),parseFloat(m[1]));
			
		   }
	   }
	   $("input#"+ this._prefix +"lat").val(point.lat());
	   $("input#"+ this._prefix +"lng").val(point.lng());
		
       if (this._marker == null) {
			this._marker = new google.maps.Marker({
				position: point,
				map: this._map,
				title: title,
				draggable:candrag,
				/*animation: google.maps.Animation.DROP,*/
		    });
			//this.goCenter(point);
			google.maps.event.addListener(this._marker, 'dragstart', function() {
			//updateMarkerAddress('Dragging...');
			});
			google.maps.event.addListener(this._marker, 'dragend', function() {
				point = this.getPosition();
				$("input#"+ that._prefix +"lat").val(point.lat());
				$("input#"+ that._prefix +"lng").val(point.lng());
				}
			);
			//this._marker.setPosition(point);
			this.fitMap();
	   }
	   else {
		   this._marker.setPosition(point);
		   this._map.setCenter(point);
	   }
			
	   
	   var that = this;
	   
   }
   else{
	   marker = new google.maps.Marker({
		position: point,
		map: this._map,
		title: title,
		draggable:candrag,
		/*animation: google.maps.Animation.DROP,*/
       });
   
      var content = '', url = '';
	  if (obj != null) {
		url = HOMEURL + '/community/' + obj.id + '/' + obj.name;
		content = '<div class="icontent"><h2 class="ititle"><a href="'+url+'">' + obj.name + '</a></h2>('+obj.memberCount+' members)</div>';
		this._zindex -= 1;
		/* if (this._op['showlabel']) {
		    var label = new Label(content,{
			   map: this._map
			 },this._zindex);
			 label.bindTo('position', marker, 'position');
		  }*/
		
	  }
	  else if (msg != '') {
		content = msg;
	  }
	  //if (!this._op['showlabel']) {
      if(!this._op['singlemap'])
		this.infobox(marker,content);
	  //}
	  this._markers.push(marker);
   }
   
   delete marker;
};

WCMAP.prototype.infobox = function(marker, message) {
	var that = this;
	
	google.maps.event.addListener(marker, 'click', function(e) {
		/*if (that._infowindow) that._infowindow.close();
		that._infowindow.setContent(message);
		
		if(that._op['showpoly']) {
			that._infowindow.setPosition(e.latLng);
			that._infowindow.open(that._map);
		}
		else
			that._infowindow.open(that._map, marker);*/
		if(that._op['showpoly']) {
			that._infowindow.setPosition(e.latLng);
			that._infowindow.setContent(message);
			that._infowindow.open(that._map);
		}
		else
			that._infowindow.open(that._map,marker,message);
	});
};

WCMAP.prototype.addPoly = function(obj) {
	var poly = null;
     
     if (this._edit) {
        poly = obj;
     }
     else {
        poly = obj.polygon;
     }
	var polycoords = this.processPaths(poly);
     
	 var polyoption = {
		paths: polycoords,
		strokeColor: '#981E33',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		/*fillColor: '#ff0000',*/
		fillOpacity: 0,
		geodesic:true,
	};
	var poly = new google.maps.Polygon(polyoption);
	if (this._edit) {
        this._poly.setPath(poly);
        this._poly.reDraw();
    }
    else {
        poly.setMap(this._map);
        this._polys.push(poly);
        if (obj != null) {
            url = HOMEURL + '/group/' + obj.id + '/' + obj.name.replace(' ','_');
            content = '<div class="icontent"><h2 class="ititle"><a href="'+url+'">' + obj.name + '</a></h2>('+obj.memberCount+' members)</div>';
        }
        
        this.infobox(poly,content);
    }
    
	delete poly;
};

WCMAP.prototype.processPaths = function(paths) {
	var array = paths.split(',');
	var newpaths = [];
	
	if (array.length > 0) {
	var bound = new google.maps.LatLngBounds();
		for(var i=0; i<array.length; i++) {
			var geo = array[i].split(' ');
			var latlng = new google.maps.LatLng(geo[0],geo[1]);
			newpaths.push( latlng);
			bound.extend(latlng);
		}
		this._bounds.push(bound);
		delete bound;
	}
	return newpaths;
};

WCMAP.prototype.load = function(data) {
	this.clearMarkers();
	//this.resize();
	
	//if(data.length > 0) {
		//alert(JSON.stringify(data));
		for(var i in data) {
			var g = data[i];
			if (typeof(g.lat) != 'undefined' && typeof(g.lng) != 'undefined' ) {
				var lat = parseFloat(g.lat);
				var lng = parseFloat(g.lng);
				if (lat > -1 && lng > -1) {
					var point = new google.maps.LatLng(g.lat,g.lng);
					this.addMarker(point,null,g.content);
				}
			}
		}
	//}
};

WCMAP.prototype.fitPolys = function() {
	 var bounds = new google.maps.LatLngBounds();
	 
	 for (var i = 0; i < this._bounds.length; i++) {
		bounds.union(this._bounds[i]);
	 }
	 
	 this.initialZoom = true;
	 
	 this._map.fitBounds(bounds);
	 
	 /*if(this._map.getZoom()>14) {
		this._map.setZoom(14);
	 }*/
	 delete bounds;
	 var that = this;
	 
	google.maps.event.addListener(this._map, 'zoom_changed', function() {
			zoomChangeBoundsListener = 
				google.maps.event.addListener(that._map, 'bounds_changed', function(event) {
					if (this.getZoom() >= 12 && that.initialZoom == true) {
						// Change max/min zoom here
						
						this.setZoom(14);
						this.setCenter(that._latlng);
						that.initialZoom = false;
					}
				google.maps.event.removeListener(zoomChangeBoundsListener);
			});
	});
};

WCMAP.prototype.fitMarkers = function() {
	 var bounds = new google.maps.LatLngBounds();
	 
	 for (var i = 0; i < this._markers.length; i++) {
		bounds.extend(this._markers[i].getPosition());
	 }
	 
	 this._map.fitBounds(bounds);
	 var zoom = this._map.getZoom();
	 if(zoom >=14) {
		this._map.setZoom(12);
	 }
};

WCMAP.prototype.fitMap = function() {
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(this._marker.getPosition());
	this.initialZoom = true;
	this._map.setCenter(bounds.getCenter());
	this._map.fitBounds(bounds);
	
	var zoom = this._map.getZoom();
	 if(zoom >=14) {
		this._map.setZoom(14);
	 }
	
	delete bounds;
};

WCMAP.prototype.clearPoly = function() {
	for (var i = 0; i < this._polys.length; i++) {
		this._polys[i].setMap(null);
		this._polys[i] = null;
	}
	this._polys = [];
};

WCMAP.prototype.clearMarkers = function() {
	for (var i = 0; i < this._markers.length; i++) {
		this._markers[i].setMap(null);
		this._markers[i] = null;
	}
	this._markers = [];
};

WCMAP.prototype.initPoly = function() {
	this._poly = new Polytool(this._map, this._prefix);
};

WCMAP.prototype.searchGroups = function(lat,lng,poly,fit) {
	var data = new wcData();
	var that = this;
	if (poly == null) poly = false;
	if (fit == null) fit = false;
	
	data.load('group/search',{lat:lat,lng:lng},function(data) {
		if (typeof(data.groups)!='undefined' && data.groups.length > 0) {
			for(var i in data.groups) {
				var g = data.groups[i];
				if (poly)
					that.addPoly(g);
				//else {
					var point = new google.maps.LatLng(g.lat,g.lng);
					that.addMarker(point,g);
				//}
			}
			
			if (!fit) {
				that.triggerCenter = true;
			}
			
			
			//if (poly)
				//that.fitPolys();
			if (fit)
				that.fitMarkers();
		}
	});
};

WCMAP.prototype.resize = function() {
	google.maps.event.trigger(this._map,'resize');
	//this._map.setZoom( this._map.getZoom() );
};

function Polytool(map, prefix) {
	this.poly = null;
	this._points = [];
	this.markers = [];
	this._map = map;
	this._prefix = prefix;
	
	this.bounds = new google.maps.LatLngBounds();
	
	this.field1 = $('#' + prefix + 'poly');
	this.field2 = $('#' + prefix + 'center');
	
	this.marker = new google.maps.Marker({
		map: this._map,
		animation: google.maps.Animation.DROP,
    });
	
	this.polyoption = {
		strokeColor: '#ff0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#ff0000',
		fillOpacity: 0.35
	};
	
	this.poly = new google.maps.Polygon(this.polyoption);
	this.poly.setMap(this._map);
	
	var that = this;
	google.maps.event.addListener(this._map, 'click', function (e) {
		that.drawPoly(e);
	});
};

Polytool.prototype.drawPoly = function (e) {
	this._points = this.poly.getPath();
	this._points.push(e.latLng);
	var m = createMarker(e.latLng, this);
	this.bounds.extend(e.latLng);
	this.markers.push(m);
	//this.showText();
	m = null;
	e = null;
	this.toString();
	this.setCenter();
};

Polytool.prototype.getPoint = function (isarray) {
	if (isarray) return this.poly.getPath().getArray();
	else return this.poly.getPath();
};

Polytool.prototype.isMarkerInBounds_ = function (marker, bounds) {
	return bounds.contains(marker.getPosition());
};

Polytool.prototype.setCenter = function () {
	var center = this.getCenter();
	this.marker.setPosition(center);
	//this.field2.val(center.lat() + ',' + center.lng());
	$("input#"+ this._prefix +"lat").val(center.lat());
	$("input#"+ this._prefix +"lng").val(center.lng());
};

Polytool.prototype.getMarkers = function () {
	return this.markers;
};

Polytool.prototype.clearMarkers = function () {
	for (var i = 0; i < this.markers.length; i++) {
		this.markers[i].setMap(null);
		this.markers[i] = null;
	}
	this.markers = [];
};

Polytool.prototype.getCenter = function() {
	return this.bounds.getCenter();
};

Polytool.prototype.toString = function () {
	var point = this._points.getArray();
	var array1 = [];
	for(var i=0; i< point.length; i++) {
		array1.push(point[i].lat() + ' ' + point[i].lng());
	}
	array1.push(point[0].lat() + ' ' + point[0].lng());
	this.field1.val(array1.join(','));
};

Polytool.prototype.setPath = function(poly) {
    this.poly.setPath(poly.getPath());
};

Polytool.prototype.reDraw = function() {
    var points = this.poly.getPath().getArray();
  
    for(var i in points) {
		//var coor = new google.maps.LatLng(point[i].lat(),point[i].lng());
       
        var m = createMarker(points[i], this);
        this.bounds.extend(points[i]);
        this.markers.push(m);
	}
    
    this._map.fitBounds(this.bounds);
};


var createMarker = function (point, polytool) {
	var markers = polytool.getMarkers();
	var map = polytool._map;
	var imageNormal = new google.maps.MarkerImage("/images/square.png", new google.maps.Size(11, 11), new google.maps.Point(0, 0), new google.maps.Point(6, 6));
	var imageHover = new google.maps.MarkerImage("/images/square_over.png", new google.maps.Size(11, 11), new google.maps.Point(0, 0), new google.maps.Point(6, 6));
	var marker = new google.maps.Marker({
		position: point,
		map: map,
		icon: imageNormal,
		draggable: true
	});
	google.maps.event.addListener(marker, "mouseover", function () {
		marker.setIcon(imageHover);
	});
	google.maps.event.addListener(marker, "mouseout", function () {
		marker.setIcon(imageNormal);
	});
	google.maps.event.addListener(marker, "drag", function () {
		for (var m = 0; m < markers.length; m++) {
			if (markers[m] == marker) {
				polytool.getPoint(false).setAt(m, marker.getPosition());
				//polytool.showText();
				break;
			}
		}
		m = null;
	});
	google.maps.event.addListener(marker, "click", function () {
		for (var m = 0; m < markers.length; m++) {
			if (markers[m] == marker) {
				marker.setMap(null);
				markers.splice(m, 1);
				polytool.getPoint(false).removeAt(m);
				//polytool.showText();
				break;
			}
		}
		m = null;
	});
	return marker;
};


function listmyplace() {
	/*$.ajax({
		url:'http://developer.feedgeorge.com/user/listgroups',
		data: {apiKey:apikey},
		type: "post",
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain:true,
		error: function(jqXHR, textStatus){alert("url error:" + textStatus)},
		success: function(data) {
			//alert(JSON.stringify(data));
			if (data.success == true) {
				myplaces = data.result.groups;
				var list = '',list2='';
				for(var pl in myplaces) {
					list += '<li id="gp-'+myplaces[pl].id+'" class="wcgroup" style="cursor:pointer">' + myplaces[pl].name + '</li>';
					list2 += '<option value="'+myplaces[pl].id+'" >' + myplaces[pl].name + '</option>';
				}
				
				$('#myplaces').append(list);
				$('#pplace').append(list2);
				
				$( "#myplaces li" ).click(function() {
					var id = $(this).attr('id').replace('gp-','');
					
				});
			}
		}
	});*/
};


function InfoBox(opt) {
  google.maps.OverlayView.apply(this, arguments);
  
  this.latlng_ = null;
  this.offsetVertical_ = opt.offsetVertical || -150;
  this.offsetHorizontal_ = opt.offsetHorizontal || 0;
  
  this.pixelOffset_ = opt.pixelOffset || new google.maps.Size(0, 0);
  this.position_ = opt.position || new google.maps.LatLng(0, 0);
  this.enableEventPropagation_ = false;
  this.height_ = opt.height || 90;
  this.width_ = opt.width || 250;
  
  this.infoBoxClass = opt.boxClass || 'fg_infobox';
  
  
};

InfoBox.prototype = new google.maps.OverlayView();

InfoBox.prototype.open = function(map,anchor,content) {
	var me = this;
	this.map_ = map;
	if (content) this.content_ = content;
	
  if (anchor) {
	
    this.latlng_ = anchor.getPosition();
	
    this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
      me.setPosition(this.getPosition());
    });
  }
  this.setMap(map);

  if (this.div_) {
    this.panMap();
  }
};

InfoBox.prototype.setContent = function(content) {
	this.content_ = content;
};

InfoBox.prototype.createDiv = function() {
 
  var div = this.div_;
  var panes = this.getPanes();
  
  var cancelHandler = function (e) {
    e.cancelBubble = true;
   
    if (e.stopPropagation) {

      e.stopPropagation();
    }
  };

  var ignoreHandler = function (e) {

    e.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (!me.enableEventPropagation_) {
      cancelHandler(e);
    }
  };
  
  if (!this.div_) {
    // Create the DIV representing our Bar
    this.div_ = document.createElement("div");
	this.div_.className = this.infoBoxClass;
	this.div_.style.height = this.height_ + "px";
    var contentDiv = document.createElement("div");
    contentDiv.className = 'mapinfoContent';
    contentDiv.innerHTML = this.content_;

    var closeDiv = document.createElement("div");
	closeDiv.className = 'mapCloseDiv';
    //closeDiv.appendChild(closeImg);
	
	google.maps.event.addDomListener(closeDiv, 'click', this.removeInfoBox(this));
	
	var bottomDiv = document.createElement("div");
	bottomDiv.className = 'mapinfosq';
    
    this.div_.appendChild(closeDiv);
    this.div_.appendChild(contentDiv);
	this.div_.appendChild(bottomDiv);
    this.div_.style.display = 'none';
	
    //this.draw();

    // Then add this overlay to the DOM
    panes.floatPane.appendChild(this.div_);
	
	this.panMap();
	if (!this.enableEventPropagation_) {

      // Cancel event propagation.
      //
      this.eventListener1_ = google.maps.event.addDomListener(this.div_, "mousedown", cancelHandler);
      this.eventListener2_ = google.maps.event.addDomListener(this.div_, "click", cancelHandler);
      this.eventListener3_ = google.maps.event.addDomListener(this.div_, "dblclick", cancelHandler);
      this.eventListener4_ = google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
        this.style.cursor = "default";
      });
    }

    this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);
	//google.maps.event.trigger(this, "domready");
  }
  
};

InfoBox.prototype.onRemove = function() {
	if (this.div_) {
		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
	}
};

InfoBox.prototype.draw = function() {
  this.createDiv();
  if (!this.div_) return;
  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  
  if (!pixPosition) return;
  
  // Now position our DIV based on the DIV coordinates of our bounds
  this.div_.style.width = this.width_ + "px";
  var width = this.div_.style.width.replace('px','');
 
  this.div_.style.left = (pixPosition.x - (width/2) - 20) + "px";
  //this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
  
  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
  
  this.div_.style.display = 'block';
  
};

InfoBox.prototype.removeInfoBox = function(inbox) {
      
	  return function (e) {

		// 1.0.3 fix: Always prevent propagation of a close box click to the map:
		e.cancelBubble = true;

		if (e.stopPropagation) {

		  e.stopPropagation();
		}

		inbox.setMap(null);
		//google.maps.event.trigger(me, "closeclick");
	};
};


InfoBox.prototype.panMap = function() {
  // if we go beyond map, pan map
  var map = this.getMap();
  if (map instanceof google.maps.Map) {
	  var bounds = map.getBounds();
	  if (!bounds) return;

	  // The position of the infowindow
	  var position = this.latlng_;

	  // The dimension of the infowindow
	  var iwWidth = this.width_;
	  var iwHeight = this.height_;

	  // The offset position of the infowindow
	  var iwOffsetX = this.offsetHorizontal_;
	  var iwOffsetY = this.offsetVertical_;

	  // Padding on the infowindow
	  var padX = 40;
	  var padY = 40;

	  // The degrees per pixel
	  var mapDiv = map.getDiv();
	  var mapWidth = mapDiv.offsetWidth;
	  var mapHeight = mapDiv.offsetHeight;
	  var boundsSpan = bounds.toSpan();
	  var longSpan = boundsSpan.lng();
	  var latSpan = boundsSpan.lat();
	  var degPixelX = longSpan / mapWidth;
	  var degPixelY = latSpan / mapHeight;

	  // The bounds of the map
	  var mapWestLng = bounds.getSouthWest().lng();
	  var mapEastLng = bounds.getNorthEast().lng();
	  var mapNorthLat = bounds.getNorthEast().lat();
	  var mapSouthLat = bounds.getSouthWest().lat();

	  // The bounds of the infowindow
	  var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
	  var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
	  var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
	  var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

	  // calculate center shift
	  var shiftLng =
		  (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
		  (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
	  var shiftLat =
		  (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
		  (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

	  // The center of the map
	  var center = map.getCenter();

	  // The new map center
	  var centerX = center.lng() - shiftLng;
	  var centerY = center.lat() - shiftLat;

	  // center the map to the new shifted center
	  map.setCenter(new google.maps.LatLng(centerY, centerX));

	  // Remove the listener after panning is complete.
	  //google.maps.event.removeListener(this.boundsChangedListener_);
	  //this.boundsChangedListener_ = null;
  }
};

InfoBox.prototype.setPosition = function (latlng) {

  this.latlng_ = latlng;

  if (this.div_) {

    this.draw();
  }

  /**
   * This event is fired when the position of the InfoBox changes.
   * @name InfoBox#position_changed
   * @event
   */
  //google.maps.event.trigger(this, "position_changed");
};



// Define the overlay, derived from google.maps.OverlayView
function Label(content,opt_options,zindex) {
 // Initialization
 this.setValues(opt_options);
 this.height_ = 60;
 this.width_ = 200;
 this.offsetVertical_ = -100;
 this.offsetHorizontal_ = 0;
 this._content = content;
 this._zindex = zindex;
 // Label specific
 var span = this.span_ = document.createElement('span');
 span.className = 'wcmap_label_span';
  
 var div = this.div_ = document.createElement('div');
 div.appendChild(span);
 
 div.className = 'wcmap_label';
 div.style.cssText = 'display: none; z-index: ' + this._zindex;
 
};
Label.prototype = new google.maps.OverlayView;

// Implement onAdd
Label.prototype.onAdd = function() {
 var pane = this.getPanes();
 
 var cancelHandler = function (e) {
  e.cancelBubble = true;
   
    if (e.stopPropagation) {

      e.stopPropagation();
    }
  };

  var ignoreHandler = function (e) {

    e.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (!me.enableEventPropagation_) {
      cancelHandler(e);
    }
  };
  
 pane.floatPane.appendChild(this.div_);
 var bottomDiv = document.createElement("div");
 bottomDiv.className = 'mapinfosq';
 this.div_.appendChild(bottomDiv);
 
 //this.panMap();
 // Ensures the label is redrawn if the text or position is changed.
 var me = this;
 
 this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);
 
 this.listeners_ = [
   google.maps.event.addListener(this, 'position_changed',
       function() { me.draw(); }),
   google.maps.event.addListener(this, 'text_changed',
       function() { me.draw(); })
 ];
};

// Implement onRemove
Label.prototype.onRemove = function() {
 this.div_.parentNode.removeChild(this.div_);

 // Label is removed from the map, stop updating its position/text.
 for (var i = 0, I = this.listeners_.length; i < I; ++i) {
   google.maps.event.removeListener(this.listeners_[i]);
 }
};

// Implement draw
Label.prototype.draw = function() {
 
 
   
 var projection = this.getProjection();
 var position = projection.fromLatLngToDivPixel(this.get('position'));

 var div = this.div_;
 div.style.left = (position.x - (this.width_/2) - 20) + "px";
 div.style.top = (position.y - 120) + "px";
 div.style.display = 'block';
 
 this.span_.innerHTML = this._content;
};


Label.prototype.panMap = function() {
  // if we go beyond map, pan map
  var map = this.getMap();
  if (map instanceof google.maps.Map) {
	  var bounds = map.getBounds();
	  if (!bounds) return;

	  // The position of the infowindow
	  var position = this.get('position'); //this.latlng_;

	  // The dimension of the infowindow
	  var iwWidth = this.width_;
	  var iwHeight = this.height_;

	  // The offset position of the infowindow
	  var iwOffsetX = 0;//this.offsetHorizontal_;
	  var iwOffsetY = -150; //this.offsetVertical_;

	  // Padding on the infowindow
	  var padX = 40;
	  var padY = 40;

	  // The degrees per pixel
	  var mapDiv = map.getDiv();
	  var mapWidth = mapDiv.offsetWidth;
	  var mapHeight = mapDiv.offsetHeight;
	  var boundsSpan = bounds.toSpan();
	  var longSpan = boundsSpan.lng();
	  var latSpan = boundsSpan.lat();
	  var degPixelX = longSpan / mapWidth;
	  var degPixelY = latSpan / mapHeight;

	  // The bounds of the map
	  var mapWestLng = bounds.getSouthWest().lng();
	  var mapEastLng = bounds.getNorthEast().lng();
	  var mapNorthLat = bounds.getNorthEast().lat();
	  var mapSouthLat = bounds.getSouthWest().lat();

	  // The bounds of the infowindow
	  var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
	  var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
	  var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
	  var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

	  // calculate center shift
	  var shiftLng =
		  (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
		  (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
	  var shiftLat =
		  (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
		  (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

	  // The center of the map
	  var center = map.getCenter();

	  // The new map center
	  var centerX = center.lng() - shiftLng;
	  var centerY = center.lat() - shiftLat;

	  // center the map to the new shifted center
	  map.setCenter(new google.maps.LatLng(centerY, centerX));

	  // Remove the listener after panning is complete.
	  //google.maps.event.removeListener(this.boundsChangedListener_);
	  //this.boundsChangedListener_ = null;
  }
};


