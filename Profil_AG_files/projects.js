$(document).ready(function(){
    projects.__init();
});
var projects = {
    
    SPEED: 500, // animation speed
    
    listing_type: null, // icon | scattered
    sizes_data: {}, // size configuration 
 
    // Launch only one time !
    __init: function(){
        
        // Get browser sizes
        projects._update_sizes_data();
        $( window ).resize(projects._window_resize);
        
        // Init keypress event on body only one time !
        $("body").keydown(function(e) {
            if(     $('#main').hasClass('projects') 
                &&  $('.listing.scattered').length > 0){
                if(e.keyCode == 37) { // left
                    projects.manage_prev_next( false );
                }
                else if(e.keyCode == 39) { // right
                    projects.manage_prev_next( true );
                }
            }
        });
    },
    
    // Take care, __init_container are launched each time page are loaded on ajax
    __init_container: function(){
        // If it's a good page, load events
        if($('#main').hasClass('projects')){
            
            // Update browsers sizes
            projects._update_sizes_data();
            
            // Set callback for listing type change
            listing.callback_change = projects.type_change_callback;

            // Get current type
            projects.listing_type = 
            $('.listing-type li.active').hasClass('listing-type-scattered')
                ? 'scattered'
                : 'icon';
        
            projects.load_events();

            // Scattered listing view
            if(projects.listing_type === "scattered"){

                setTimeout(function(){
                    // Update browsers sizes
                    projects._update_sizes_data();
                    projects.init_listing();            
               }, 200);
            }
        }
    },
    
    /**
     * Load events for this #container
     */
    load_events: function(){
        $('.listing-filters input[type=checkbox]').change(projects.filter_change);
    },
     
    // Start function call one time by #container
    init_listing: function(){ 
        // First launch
        projects.manage_listing();
        
        // Init events 
        $('.listing-item a, .listing-item', $('.listing')).click(function(e){
            // Make special action only if listing is scattered
            if(projects.listing_type === "scattered"){
                e.stopPropagation();

                $item = $(this).hasClass('listing-item') ? $(this) : $(this).parents('.listing-item');
                if($item.hasClass('active') === false){
                    // Unset all other
                    $('.listing-item', $('.listing')).removeClass('active');
                    $item.addClass('active');

                    projects.manage_listing();

                    return false;
                }
            }
        });
        $('.listing-nav', $('.listing')).click(function(e){
            projects.manage_prev_next( $(this).hasClass('listing-next') ? true : false);
            return false;
        });
        
        $('.corner', $('.listing')).mouseenter(function(){
            if($(this).parents('.listing-item').hasClass('active') === true){
                projects.animate_corner($(this), 96);
            }
        }).mouseleave(function(){
            if($(this).parents('.listing-item').hasClass('active') === true){
                projects.animate_corner($(this), 48);      
            }
        });
    },
        
    // Reorder items
    manage_listing: function(){
        $('.listing-nav').hide();
        
        // No selected ?
        if($('.listing-item.active', $('.listing')).length === 0){
            $('.listing-item:not(.projects-hidden)', $('.listing')).eq(0).addClass('active');
        }
                
        $('.listing-item', $('.listing')).each(function(){
            // Is the active item
            if($(this).hasClass('active')){
                projects.update_item_data(
                    $(this), 
                    projects.sizes_data.half_x, 
                    projects.sizes_data.half_y, 
                    0, 
                    true);
            }
            else{
                projects.update_item_random($(this));
            }
        });
        
		setTimeout(function(){
			projects.update_center_active();
            $('.listing-nav').show();
        }, projects.SPEED);
    },
    
    // Callback called by :
    // - main.listing on type change
    // - projects._window_resize 
    type_change_callback: function(type){
        // It's  too small to do that 
        if(type === "scattered" && projects.sizes_data.x < 800){
            // talk to listing to return on icon type
            listing.type_change('icon', $('.listing'), $('.listing-type'));
            
            return;
        }
        
        // Update type
        projects.listing_type = type;
        
        if($('#main').hasClass('projects')){
            if(type === 'icon'){
                // Unset all CSS added by Javascript 
                $('.listing-item', $('.listing')).css({
                    left: '',
                    top: '',
                    transform: '',
                    'z-index': ''
                }).removeClass('active'); // No active items
                // Hide all inactive 
                $('.listing-item.projects-hidden').hide();
            }
            else{
                projects.manage_listing(); 
            }
        }
    },
    
    //
    filter_change: function(){
        var category = $(this).val();
        var is_checked = $(this).prop('checked');
        
        if(projects.listing_type === 'scattered'){

            if(is_checked === false){
                $('.listing-item.projects-'+category, $('.listing')).addClass('projects-hidden').animate({
                    top:'-500px'
                }, projects.SPEED);
                
                if($('.listing-item.projects-'+category+'.active', $('.listing')).length > 0){
                    $('.listing-item.projects-'+category+'.active', $('.listing')).removeClass('active');

                    var $new_active = $('.listing-item:not(.projects-hidden)', $('.listing')).eq(0);
                    if($new_active.length > 0){
                        $new_active.addClass('active');
                        
                        projects.update_item_data(
                            $new_active, 
                            projects.sizes_data.half_x, 
                            projects.sizes_data.half_y, 
                            0, 
                            true);   
                    }
                }
            }
            else{
                if($('.listing-item.active:not(.projects-hidden)', $('.listing')).length === 0){
                    $('.listing-item.projects-'+category).eq(0).addClass('active');
                }

                $('.listing-item.projects-'+category, $('.listing')).each(function(){
                    $(this).removeClass('projects-hidden').show().css('top', '-500px'); 
                    if($(this).hasClass('active')){
                        projects.update_item_data(
                            $(this), 
                            projects.sizes_data.half_x, 
                            projects.sizes_data.half_y, 
                            0, 
                            true);
                    }
                    else{
                        projects.update_item_random($(this));
                    }
                });
            }
            
            if($('.listing-item:not(.projects-hidden)', $('.listing')).length > 1){
                $('.listing-nav').show();
            }
            else{
                $('.listing-nav').hide();                
            }
            
        } // end scattered
        else if(projects.listing_type === 'icon'){
            
            if(is_checked === false){
                $('.listing-item.projects-'+category, $('.listing')).addClass('projects-hidden').hide();
            }
            else{
                $('.listing-item.projects-'+category, $('.listing')).removeClass('projects-hidden').show();
            }
        }
    },
    
    
    // Prev / next
    // Keyboard or button
    manage_prev_next: function( is_next ){
        if($('.listing-item:not(.projects-hidden)', $('.listing')).length > 1){
            var count_display = 0;
            var index_current = 0;
            var current_passed = false;

            $('.listing .listing-item').each(function(){
                if(!$(this).hasClass('projects-hidden')){
                    count_display++;

                    if(current_passed || $(this).hasClass('active')){
                        current_passed = true;
                    }
                    else{
                        index_current++;
                    }
                }
            });

            var next_index = is_next === true
                ? index_current+1 
                : index_current-1;

            if(next_index === count_display){
                next_index = 0;
            }
            else if(next_index < 0){
                next_index = count_display-1;
            }
            $('.listing-item', $('.listing')).removeClass('active');
            $('.listing-item:not(.projects-hidden):eq('+next_index+')', $('.listing')).addClass('active');

            projects.manage_listing();
        }
    },
    
    update_item_random: function($item){
        var x = Math.random()*projects.sizes_data.x;
        var y = Math.random()*projects.sizes_data.y;
        var angle = (Math.random()*90)-45; // -45/45

        // Don't place on middle
        if(x > projects.sizes_data.limit_x_min && x < projects.sizes_data.limit_x_max
            && y > projects.sizes_data.limit_y_min && y < projects.sizes_data.limit_y_max){
            if(x < projects.sizes_data.half_x){
                x -= projects.sizes_data.step_x;
            }else{
                x += projects.sizes_data.step_x;
            }
            // Already on ? update y too
            if(x > projects.sizes_data.limit_x_min && x < projects.sizes_data.limit_x_max
                && y > projects.sizes_data.limit_y_min && y < projects.sizes_data.limit_y_max){

                if(y < projects.sizes_data.half_y){
                    y -= projects.sizes_data.step_y;
                }else{
                    y += projects.sizes_data.step_y;
                }
            }
        }
        
        projects.update_item_data($item, x, y, angle, false);
    },
    
    update_item_data: function($item, x, y, angle, is_active){        
        
        var old_angle = $item.attr('data-listing-angle');
        if(typeof old_angle === "undefined"){
            old_angle = 0;
        }
        var old_x = parseInt($item.css('left'));
        if(typeof old_x === "undefined"){
            old_x = 0;
        }
        var old_y = parseInt($item.css('top'));
        if(typeof old_y === "undefined"){
            old_y = 0;
        }
        
        // Manage pos
        x -= projects.sizes_data.half_item_width // Delete half item size
        y -= projects.sizes_data.half_item_height*1.5; // Delete half item size and align on top (1.5*)
        y          
        if(y < projects.sizes_data.header_height){ // Limit min
            y = projects.sizes_data.header_height;
        }        
        
        var displayed = $item.hasClass('projects-hidden') ? false : true;        
        // Update pos 
        if(displayed === true){   // Dont animate if item are not displayed
            // Animate X
            $({
                val:old_x
            }).animate({
                val:x
            }, {
                duration: projects.SPEED,
                step: function(now) {
                    $item.css('left', now+'px');
                }
            });
            // Animate Y
            $({
                val:old_y
            }).animate({
                val:y
            }, {
                duration: projects.SPEED,
                step: function(now) {
                    $item.css('top', now+'px');
                }
            });
                        
            // Animate angle
            $({
                val:old_angle
            }).animate({
                val:angle
            }, {
                duration: projects.SPEED,
                step:  function(now) {
                    $item.css({
                        'transform': 'rotateZ('+now+'deg)'
                    });
                    $item.attr('data-listing-angle', now);
                },
                complete: function(){
                    if(is_active == true){
                        $item.css('z-index', 11);
                        $('a', $item).removeClass('link-disable');
                    }
                    else{
                        $item.css('z-index', 10);
                        $('a', $item).addClass('link-disable');
                    }
                }
            }); 
            
            // Animate corners
            setTimeout(function(){
                var corner_size = (is_active === true)? 48 : 0;
                projects.animate_corner($('.corner', $item), corner_size);
                
            }, (is_active === true) ? projects.SPEED : 0);
        }
        
    },
        
    update_center_active: function(){
        var x = projects.sizes_data.half_x;
        var y = projects.sizes_data.half_y;

        // Manage pos
        x -= projects.sizes_data.half_item_width // Delete half item size
        y -= projects.sizes_data.half_item_height*1.5; // Delete half item size and align on top (1.5*)
        if(y < projects.sizes_data.header_height){ // Limit min
            y = projects.sizes_data.header_height;
        }   

        $('.listing-item.active', $('.listing')).css({
            top:y,
            left:x
        });
        $('.listing-nav', $('.listing')).css({
            top: y + projects.sizes_data.half_item_height - 64
        });
    },
    
    animate_corner: function( $corner, corner_size){
        $corner.stop().animate({
            width: corner_size+'px',
            height: corner_size+'px'
        },{
            duration: projects.SPEED,
            step: function(now) {
                $('.corner-triangle', $corner).css({                            
                    borderBottom: now+'px solid #CCC',
                    borderRight: now+'px solid transparent'
                });
            } 
        });
    },
    
    _window_resize: function(){
        // If it's a good page, feed you with this data ! (mouhahahaa...)  => []
        if($('#main').hasClass('projects')){
            // Update browsers sizes
            projects._update_sizes_data();
            
            console.log("resize : "+projects.listing_type+" / "+projects.sizes_data.x);
            
            // If scattered listing type
            if(projects.listing_type === 'scattered'){
                // If too small !
                if(projects.sizes_data.x < 800){
                    // Call listing to redraw
                    listing.type_change('icon', $('.listing'), $('.listing-type'));
                    // Call projects to change type
                    projects.type_change_callback('icon');
                }
                else{
                    // Update active items 
                    projects.update_center_active();
                }
            }   
        }
    },
        
    _update_sizes_data: function(){
        
        var x = $( window ).width();
        var y = $( window ).height();
        var $container_header = $('#container-header');
        var $one_item = $('.listing-item', $('.listing')).eq(0);   
        
        var sizes_data = {
            x: x,
            y: y,
            half_x: x/2,
            half_y: y/2,
            step_x: x/5,
            step_y: y/3,   
            header_height: parseInt($container_header.height())
            + parseInt($container_header.css('paddingTop'))
            + parseInt($container_header.css('paddingBottom')),
            item_width: parseInt($one_item.width())
            + parseInt($one_item.css('paddingLeft'))
            + parseInt($one_item.css('paddingRight')),
            item_height: parseInt($one_item.height())
            + parseInt($one_item.css('paddingTop'))
            + parseInt($one_item.css('paddingBottom'))
        };
        sizes_data.limit_x_min = sizes_data.half_x - sizes_data.step_x;
        sizes_data.limit_x_max = sizes_data.half_x + sizes_data.step_x;
        sizes_data.limit_y_min = sizes_data.half_y - sizes_data.step_y;
        sizes_data.limit_y_max = sizes_data.half_y + sizes_data.step_y;
        
        sizes_data.half_item_width = sizes_data.item_width/2;
        sizes_data.half_item_height = sizes_data.item_height/2;
        
        projects.sizes_data = sizes_data;
    }
    
}; 