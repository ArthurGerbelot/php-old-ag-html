$(document).ready(function(){
    // Just __init loader one time here, we never need to re-init that.
    loader.__init();
});

var loader = {
    SPEED: 500,
    
    $el: null,
    
    __init: function(){
        
        loader.$el = $('#loader');
        if(loader.$el.length === 0){
            loader.create_html();
        }
        
    },
    
    create_html: function(){        
        loader.$el = $('<ul id="loader"><li></li><li></li><li></li><li></li></ul>');
        loader.$el.hide().appendTo('body');
    },
    
    start: function( callback_fn ){

        $('html, body').animate({
            scrollTop: 0
        }, 500);
        loader.$el.stop().css('opacity',0).show().animate({opacity:1}, loader.SPEED);
        
        var callbk = callback_fn;
        var arg1 = arguments[1];
                
        $("#main").animate({opacity:0}, {duration:loader.SPEED, complete: function(){ 
            callbk( arg1 );
        }});        
    },
    
    end: function( callback_fn ){
        loader.$el.stop().css('opacity',1).animate({opacity:1}, {
            duration:loader.SPEED,
            complete: function(){
                loader.$el.hide();
                $("#main").animate({opacity:1}, {duration:500, complete: callback_fn});

            }
        });
    }
    
};