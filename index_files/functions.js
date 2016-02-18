$(document).ready(function() {
    $('html').addClass('js-enabled').removeClass('no-js');
});

function scrollTo(anchor) {
    var offset = $(anchor).offset();
    var position = 0;

    if (typeof offset === 'object' && offset !== null) {
        position = offset.top;
    }
    $('*[href="'+anchor+'"]').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: position
        }, 300);
    });
}
var Input = function (selector) {
    var value, $el;
    $el = $(selector);
    if ($el.parents('.error').length == 0) {
        value = $el.val();
        var clearInput = function (e) {
            if (value == $(e.currentTarget).val()) {
                $(e.currentTarget).val('');
            }
        }
        var resetInput = function (e) {
            if ($(e.currentTarget).val() == '') {
                $(e.currentTarget).val(value);
            }
        }
        $el.on('focus', clearInput);
        $el.on('blur', resetInput);
    }
};

var logger = {
    log: function(msg) {
        if (window.environment == 'development' || window.environment == 'preprod') {
            try {
                console.log(msg);
            } catch (e) {
                if (window.environment == 'development') {
                    alert(msg);
                }
            }
        }
    }
};

var Cookie = {
    set: function (name,value,days) {
        var expires;
        if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	else {
            expires = "";
        }
	document.cookie = name+"="+encodeURIComponent(value)+expires+"; path=/";
    },
    get: function (name) {
        var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) {
                    return decodeURIComponent(c.substring(nameEQ.length,c.length));
                }
	}
	return null;
    }
}

function duplicate_array( array ) {
    var new_array = [];
    for(i in array ){
        new_array.push( array[i] );
    }
    return new_array;
}