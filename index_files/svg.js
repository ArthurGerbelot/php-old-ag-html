$(document).ready(function(){
    svg_manager.__init();    
});

var svg_manager = {
    
    // Take care, can be recalled after ajax load
    __init : function(){
        svg_manager.update();
    },
    
    
    // Replace all svg use HTML code by a clone of the real SVG
    update: function(){
        $('svg').each(function(){
            if($(this).hasClass('svg-done') !== true){
                var $use = $('use', $(this));
                if($use.length > 0){                
                    svg_manager.replace_svg($(this),$use);                
                }
            }
        });
    },
    
    // Replace this SVG
    replace_svg: function($that, $use){
        $that.after( $('svg'+$use.attr('xlink:href')).clone() );   
        var $new = $that.next()
                        .attr('id', null)
                        .attr('class', $that.attr('class')+" svg-done")/*
                        .attr('class', "")*/;
        $that.remove();
    }
};
    