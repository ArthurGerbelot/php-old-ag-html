$(document).ready(function(){    
    reload_javascript();
});

// Ready function for AJAX Manager
function reload_javascript(){
   
   // launch __init_container()
   link_effect.__init(); // @todo: __init_container  
   listing.__init(); // @todo: __init_container
   profile.__init(); // @todo: __init_container
   contact.__init(); // @todo: __init_container
   svg_manager.__init(); // @todo: __init_container
   projects.__init_container(); 
   ajax_page_manager.__init_container();

    $("body").removeClass('jqtransformdone').jqTransform(); 
    
    $('.fancybox').fancybox({
        iframe: true
    });
    
    $('.cycle').cycle({
        slides: '> .slide'
    });
}



var link_effect = {
    speed : 250,
    
    __init : function(){
        
        $('#main a:not(.no-link-effect)').append($('<span class="link_effect"></span>'))
            .mouseenter(function(){
                $('.link_effect', $(this)).css({
                    'width': 0,
                    'left' : 0
                }).animate({
                    'width': $(this).width(),
                    'left' : 0
                }, {
                    queue: false,
                    duration: link_effect.speed
                });
            }).mouseleave(function(){
                $('.link_effect', $(this)).animate({
                    'width': 0,
                    left : $(this).width() 
                }, {
                    queue: false,
                    duration: link_effect.speed
                });
            });
     
     
    }
};

var listing = {
    speed : 250,
    
    callback_change: null, // A callback is setted ? Call it after change
    
    all_type: ['icon','medium','full','scattered'],
  
    __init : function(){
        
        $('#main').on('click', '.listing-type a', function(){
            var $listing = $(this).parents('.listing');
            var $li = $(this).parent();
            var $listing_type = $(this).parents('.listing-type');
            
            // In case of .listing isn't the parent of .listing-type (cf projects)
            if($listing.length === 0){
                $listing = $('.listing');
            }
            
            var type="icon";
            if($li.hasClass('listing-type-medium')) {type = "medium";}
            if($li.hasClass('listing-type-full')) {type = "full";}
            if($li.hasClass('listing-type-scattered')) {type = "scattered";}
            
            listing.type_change(type, $listing, $listing_type);
            
            return false;
        });      

        $('#main .listing').on('mouseenter', ".listing-item", function(){
            
            if($(this).parents('.listing').hasClass('icon')){

                $(this).animate({
                    'top': '-5px'
                } , {
                    duration :listing.speed,
                    queue : false
                });
                $('.listing-item-after', $(this)).animate({
                    'bottom': 0
                } , {
                    duration :listing.speed,
                    queue : false
                });
            }
            
        }).on('mouseleave', ".listing-item", function(){
            if($(this).parents('.listing').hasClass('icon')){
                $(this).animate({
                    'top': 0
                } , {
                    duration :listing.speed,
                    queue : false
                });
                $('.listing-item-after', $(this)).animate({
                    'bottom': '10px'
                } , {
                    duration :listing.speed,
                    queue : false
                });
            }
        });
    },
    
    // Call on click trigger and on projects._window_resize
    type_change: function(type, $listing, $listing_type){

        $('li', $listing_type).removeClass('active');            
        $('li.listing-type-'+type, $listing_type).addClass('active');
        
        
        var count_displayed = $('.listing-item:not(.projects-hidden)', $('.listing')).length
        if(type === "scattered" && count_displayed > 1){
            $('.listing-nav').show();
        }
        else{
            $('.listing-nav').hide();
        }

        
        $listing.removeClass(listing.all_type.join(' ')).addClass(type);
        if(listing.callback_change){
            listing.callback_change(type);
        }
    }
};

var ajax_page_manager = {

    __init : function(){
        
        ajax_page_manager.bind_links();
        
        // Inform nav of this first page (for futur call back button)
        ajax_page_manager.set_pushState({
            'html' : $("#main").html(),
            'data': data,
            'url' : current_url
        });
                
        // If click on back/forward
        window.onpopstate = function(e){
            if(e.state != null){                
                ajax_page_manager.get_popState(e.state);
            }
        };
    },
    
    __init_container: function(){
        ajax_page_manager.bind_links();
    },
    
    bind_links : function(){
        // Init event on each link
        $('a:not(.no-ajax):not(.ajax-manager-loaded)').each(function(){
            
            // keep me
            var that = $(this).addClass("ajax-manager-loaded");
            
            // Don't have a target blank'
            if(that.attr('target') != "blank" && that.attr('target') != "_blank"){
                // Is on this website
                var link = that.attr('href');
                
                if(typeof link != "undefined" && link.indexOf(domain_name) != "-1"){
                    
                    // Bind event click 
                    that.click(function(){
                        if(that.hasClass('link-disable') === false){
                            loader.start( ajax_page_manager.call_ajax, link );
                        }
                        return false;
                    });
                                      
                }
            }
        });
    },
    
    call_ajax : function(link){
        var data = {
            ajax_manager : true
        };
console.log("[Ajax manager] Get "+link);
        $.get(link, data, function(result){

            ajax_page_manager.post_received( result );

        }, 'json'); /*.fail(function(e) {

            console.log("[Ajax manager] "+e.status+" - "+e.statusText+" : "+link);
           // var result = JSON.parse( e.responseText );

            if( result.html && result.data ){
                ajax_page_manager.post_received( result );
            }
        });*/
    },
    
    post_received : function( result ){
                
        // Inform nav from new page 
        ajax_page_manager.set_pushState( result );
        
        // Update HTML
        ajax_page_manager.update_page( result );
        
        // Update vars
        frontend_context = result.data.frontend_context;
        current_url = result.url;
        
        // Hide loader
        loader.end( reload_javascript );
                        
        // Reload Javascript
        //reload_javascript();
    },
    
    update_page : function( result ){

        // Update HTML
        $("#main").html(result.html);
        $('head title').html(result.data.title_tag);
        $("#main").removeClass('home projects profile contact').addClass(result.data.frontend_context);
        
        // Update header item active (rezise trigger will move arrow)
        $('#header-menu li').removeClass('active');
        $('#header-menu li.'+result.data.frontend_context).addClass('active');
        
        // Manage asset CSS/JavaScript
//        ajax_page_manager.manage_asset( result );        
        
        // Send a trigger to resized content
        $(document).trigger('resize');
    },
    
    // Manage asset CSS / JavaScript
    manage_asset : function( result ){
        
        // Build array with Current and New CSS files (without versionning)
        var current_css_data = {};    
        var current_css = [];
        var new_css_data = {}
        var new_css = [];
        
        $('link[rel="stylesheet"]').each(function(){
            var href=$(this).attr('href').split('?')[0];
            current_css.push(href);
            current_css_data[href] = {
                'object' : $(this),
                'href' : $(this).attr('href'),
                'media' : $(this).attr('media')
            };
        });
        for( file in result.data.css_files ){
            var href= file.split('?')[0];
            new_css.push(href);
            new_css_data[href] = {
                'href' : file,
                'media' : result.data.css_files[file]
            };
        }
        
        // Delete old files not used
        for ( i in current_css ){
            if(new_css.indexOf(current_css[i]) === -1){
                current_css_data[current_css[i]].object.remove();
            }
        }
        
        // Add new files 
        for( i in new_css ){
           if(current_css.indexOf(new_css[i]) === -1){
                $('<link rel="stylesheet" href="'+new_css_data[new_css[i]].href+'" type="text/css" media="'+new_css_data[new_css[i]].media+'">').appendTo('head');
            } 
        }
        /*
        console.log("NEW CSS");
        console.log(new_css);
        console.log(new_css_data);
        
        console.log("CURRENT CSS");
        console.log(current_css);
        console.log(current_css_data);*/
    },
    
    /**
     * Take to Navigator to inform page change (Back/Forward history)
     * @param {object} result
     */
    set_pushState : function( stats ){
        
        window.history.pushState(stats, stats.data.title_tag, stats.url);
    },
    
    /**
     * Information about navigtor are received, user has used to back/forward button
     * @param {object} stats
     */
    get_popState : function( stats ){
        
        // Update HTML
        ajax_page_manager.update_page( stats );
        
        // Reload Javascript
        reload_javascript( );
    }
};