$(document).ready(function(){
    header_menu.__init();    
});

var background_color_size = 4000; // background width for colors
var header_menu = {
    
    speed : 750,
    speed_crazy_loop : 5000,
    
    last_color_change : 0, // Last time color change (for crazy loop)
    min_time_between_crazy_loop : 30000, // Between [time] and 2*[time]
    
    arrow_width : 22,
    
    // color position (each 25%)
    colors_pos : {
        home : background_color_size/4,
        projects : background_color_size/2,
        profile : background_color_size*3/4,
        contact : background_color_size
    },
    
    __init : function(){
        // Get active
        var active = $('#header-menu li.active');
        
        // Init            
        header_menu.move_arrow(active, 0);
        
        // Load events
        $('#header-menu li a').mouseenter(function(){
            header_menu.move_arrow($(this).parent(), header_menu.speed, false);
        }).click(function(){
            // Change #main class
            var current_id = header_menu.get_item_id(active);
            var new_id = header_menu.get_item_id($(this).parent());
            
            active = $(this).parent();
            // Move arrow
            header_menu.move_arrow($(this).parent(), header_menu.speed);            
        });
        $('#header-menu').mouseleave(function(){
            header_menu.move_arrow(active, header_menu.speed, false);
        });
        
        // Resizing
        $(window).resize(function() {
            active = $('#header-menu li.active');
            header_menu.move_arrow(active, header_menu.speed);
        });
        $(document).resize(function() {
            active = $('#header-menu li.active');
            header_menu.move_arrow(active, header_menu.speed);
        });
        
        // Set a crazy loop
        header_menu.make_crazy_loop();            
    },
    
    move_arrow : function(item, time, change_active){   
        
        if(typeof change_active == "undefined"){
            change_active = true;
        }
        
        if(item.length == 0){
            var window_width = parseInt($(window).width());
            
            var new_css_border = {
                'background-position-x': "0px"
            };
            var new_css_arrow = {
                'left': window_width,
                'background-position-x': -window_width+"px"
            };
                   
            logo_ag.change_color(null);
        }
        else{
            if(change_active == true){
                // Change #header-menu li.active
                $('#header-menu li').removeClass('active');
                item.addClass('active');
            }
            
            // Save last time
            var d = new Date();
            header_menu.last_color_change = d.getTime();


            // Get Icon size (can change)
            var icon_width = parseInt($('.header-menu-icon', item).width());

            // Get position for arrow
            var item_left = parseInt(item.position().left);
            var arrow_left = item_left
                                - header_menu.arrow_width/2
                                + icon_width/2;
            // Get the good color
            var color_id = header_menu.get_item_id(item);

            var color_gap = item_left - header_menu.colors_pos[color_id];

            // Build new CSS 
            var new_css_border = {
                'background-position': (+color_gap)+"px"
            };
            var new_css_arrow = {
                'left': arrow_left,
                'background-position': (-arrow_left+color_gap)+"px"
            };
            
            // Change the logo color
            if(typeof logo_ag !== "undefined"){
                if(item.hasClass('home')){
                    logo_ag.change_color('home');
                }
                else if(item.hasClass('projects')){
                    logo_ag.change_color('projects');
                }
                else if(item.hasClass('profile')){
                    logo_ag.change_color('profile');
                }
                else if(item.hasClass('contact')){
                    logo_ag.change_color('contact');
                }
                else{
                    logo_ag.change_color(null);
                }
            }
        }
        // Set new CSS ( use stop() to end if we are on crazy loop function)
        if(time > 0){
            $('#header-arrow').stop().animate(new_css_arrow, {
                queue: false,
                duration: time,
                easing: 'easeOutBack'
            });
            $('#header-border-colors').stop().animate(new_css_border, {
                queue: false,
                duration: time,
                easing: 'easeOutBack'
            });
        }
        else{
            $('#header-arrow').stop().css(new_css_arrow);            
            $('#header-border-colors').stop().css(new_css_border);            
        }
    },
    
    get_item_id : function(item){
        var item_id = 'home';
        if(typeof item != "undefined"){
            if(item.hasClass('projects')) {item_id = 'projects'}
            else if(item.hasClass('profile')) {item_id = 'profile'}
            else if(item.hasClass('contact')) {item_id = 'contact'}
        }
        return item_id;
    },

    make_crazy_loop : function(){
                    
        // Not change during waiting ?
        var d = new Date();
        var current_time = d.getTime();
        
        // To know if have change during crazy loop and replace (or not) background after complete        
        var save_last_color_change = header_menu.last_color_change;
        
        if(current_time - header_menu.last_color_change > header_menu.min_time_between_crazy_loop){

            var current_bg_pos_arrow = parseInt($('#header-arrow').css('background-position-x'));
            var current_bg_pos_border = parseInt($('#header-border-colors').css('background-position-x'));
            
            var direction = (Math.random()*2 > 1) ? 1 : -1;
            
            $('#header-arrow').animate({
                'background-position-x': (current_bg_pos_arrow - direction*background_color_size)+"px"
            }, {
                queue: false,
                duration: header_menu.speed_crazy_loop
            }, "linear");
            $('#header-border-colors').animate({
                'background-position-x': (current_bg_pos_border - direction*background_color_size)+"px"
            }, {
                queue: false,
                duration: header_menu.speed_crazy_loop,
                complete : function(){
                    if(header_menu.last_color_change == save_last_color_change){
                        $('#header-arrow').css('background-position-x', current_bg_pos_arrow);
                        $('#header-border-colors').css('background-position-x', current_bg_pos_border);
                    }
                }
            });
        }
        
        // Set an other crazy loop later
        var next_loop = header_menu.min_time_between_crazy_loop*(1+Math.random());
        console.log("Next crazy loop in "+parseInt(next_loop/1000)+"sec");
        setTimeout(function(){
            header_menu.make_crazy_loop();            
        }, next_loop);
    }
};