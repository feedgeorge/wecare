/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};


Date.prototype.friendlytime = function() {
	
	var comdate = this.getTime();
	
	var periods  = ["second", "minute", "hour", "day", "week", "month", "year", "decade"];
    var lengths  = [60,60,24,7,4.35,12,10];
	var friendly = new Object();
	
	var current = new Date().getTime();
	var diff = ((current - comdate)/1000);
	var day_diff = Math.round(diff/86400);
	
	//return this.toString() + ':' + day_diff + " -- " + diff;
	//return '';
	if (diff < 60) {
		friendly = 'Just now';
	}
	else {
		for(var j = 0; diff >= lengths[j] && j < lengths.length -1; j++) {
				diff /= lengths[j];
		}
		diff = Math.round(diff);
		
		if (diff == 0) diff = 1;
		if (diff > 1)
			friendly =  diff + " " + periods[j] + 's';
		else {
            //if (j == 2) friendly = 'an ' + periods[j];
			//else
			friendly = 'A ' + periods[j];
		}
		if (friendly == 'A day') friendly = 'Yesterday';
		else friendly = friendly + ' ago';
	}
	return friendly;
};



Date.prototype.getTimeStamp = function() {
	return parseInt(this.getTime().toString().substring(0, 10));
};


 
Date.prototype.toISO = function() {
    var d = this;
	return (d.getUTCFullYear() + '-' +  padzero(d.getUTCMonth() + 1) + '-' + padzero(d.getUTCDate()) + 'T' + padzero(d.getUTCHours()) + ':' +  padzero(d.getUTCMinutes()) + ':' + padzero(d.getUTCSeconds()) + 'Z');
	
	
};

Date.prototype.compare = function(date1,date2) {
	if (date1.getTime() == date1.getTime()) 
		return 0;
	else if (date1.getTime() >= date1.getTime()) 
		return 1;
	else if (date1.getTime() <= date1.getTime()) 
		return -1;	
}

Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};




// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

Date.prototype.addDaysInTimeStamp = function(days) {

	return this.getTime() + days*24*60*60*1000;

};

Date.prototype.toMysqlTimeStamp = function(gottime) {
	var d = this;
	var time = '';
	if(gottime) time = padzero(d.getHours()) +  padzero(d.getMinutes())  + padzero(d.getSeconds())
	
	return(d.getFullYear() + padzero(d.getMonth() + 1) + padzero(d.getDate()) + time);
};

function padzero(n) {
    return n < 10 ? '0' + n : n;
};
 
function pad2zeros(n) {
    if (n < 100) {
        n = '0' + n;
    }
    if (n < 10) {
        n = '0' + n;
    }
    return n;     
};

function trimDate(date) {
	var arr = date.split(/[- :]/);
	var t = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
	
	return t;
};