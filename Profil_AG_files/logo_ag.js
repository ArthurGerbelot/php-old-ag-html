/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var logo_ag = {
    
    $el: null,
    $cube: null,
    
    speed: 5000,
    range: 2500,
    
    refresh_speed: 1000/24,
    change_color_speed: 2000,
        
    angles: {
        x: 0,
        y: 0,
        z: 0
    },

    current_color: null,
    color: {
       home: "#f8954e", 
       projects: "#70c06d", 
       profile: "#5673cb", 
       contact: "#e15757",  
       gray: "#e8e8e8"
    },
    
    __init: function(){
        logo_ag.$el = $('#header-logo');    
        
        if(logo_ag.$el.length === 1){
            // Get $cube
            logo_ag.$cube = $('#header-cube', logo_ag.$el);
            // Init CSS angles
            logo_ag.$cube.css({
                transform : "rotateX("+logo_ag.angles.x+"deg)"+
                            "rotateY("+logo_ag.angles.y+"deg)"+
                            "rotateZ("+logo_ag.angles.z+"deg)"
            });
            
            // Run 3 triggers, one for each angle
            logo_ag.run("x");
            logo_ag.run("y");
            logo_ag.run("z");
            
            // Run display 
            logo_ag.draw();
            
			// If not colored, check if I must be 
			if(logo_ag.current_color === null){
			$active_menu = $("#header-menu li.active");
				if($active_menu.length > 0){
					if($active_menu.hasClass('home')){
						logo_ag.change_color('home');
					}
					else if($active_menu.hasClass('projects')){
						logo_ag.change_color('projects');
					}
					else if($active_menu.hasClass('profile')){
						logo_ag.change_color('profile');
					}
					else if($active_menu.hasClass('contact')){
						logo_ag.change_color('contact');
					}
				}
			}
			
            // Load events
            logo_ag.load_events();
        }
    },
    
    /**
     * Load events
     */
    load_events: function(){
        // No events
    },
    /**
     * Update cube
     */
    draw: function(){
        logo_ag.$cube.css({
                transform : "rotateX("+logo_ag.angles.x+"deg)"+
                            "rotateY("+logo_ag.angles.y+"deg)"+
                            "rotateZ("+logo_ag.angles.z+"deg)"
            });
            
        setTimeout(logo_ag.draw, logo_ag.refresh_speed);
    },
    /**
     * Run an animation for one angle 
     * @param {string} angle [x|y|z]
     */
    run: function(angle){
        // Get next angle value for angle [x|y|z] 
        var current_value = logo_ag.angles[angle];
        if(current_value > 360){
            current_value -= 360;
        }
        if(current_value < 0){
            current_value += 360;
        }        
        var new_value = Math.floor(Math.random() * 2 * 360) - 360 + current_value;
     //   var new_value = Math.floor(Math.random() * 359);
        var speed = logo_ag.speed + Math.floor(Math.random()*logo_ag.range*2) - logo_ag.range;
        
        // Set animation
        $({deg:current_value}).animate({deg: new_value}, {
                duration: speed,
                step: function(now) {
                    // Update angle
                    logo_ag.angles[angle] = now;
                }
            });
        
        setTimeout(function(){
            logo_ag.run(angle);
        }, speed);
        
    },
    
    /**
     * Change colors
     */ 
    change_color: function(color){
        // Not initiate
        if( logo_ag.$el === null){
            return;
        }
        
        var color_val = color !== null && logo_ag.color[color] ? logo_ag.color[color] : logo_ag.color.gray;
        logo_ag.current_color = color;
		
        // Make an animation with color attr
        logo_ag.$el.stop().animate({color: color_val},{
            duration:logo_ag.change_color_speed,
            step: function(){
                // Get rgb 
                var rgb = logo_ag.$el.css('color');
                var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
                var match = matchColors.exec(rgb);
                
                if(match !== null){
                    $('figure', logo_ag.$el).css({
                        background: 'rgba('+match[1]+','+match[2]+','+match[3]+', 0.3)',
                        boxShadow: '0px 0px 10px rgba('+match[1]+','+match[2]+','+match[3]+', 0.4)',
                        borderColor: 'rgb('+match[1]+','+match[2]+','+match[3]+')'
                    });
                    $('.header-name-color', logo_ag.$el).css({
                        color: 'rgb('+match[1]+','+match[2]+','+match[3]+')'
                    });
                }
            }
        });
    }
    
};

$(document).ready(function(){
    logo_ag.__init();
});