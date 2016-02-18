$(document).ready(function(){
    profile.__init();
});
var profile = {
    PIE_SPEED_INIT: 2000,
    PIE_SPEED_BOUNCE: 500,
    PIE_LINEWIDTH: 15,
    GAP_TIME: 250,
 
    // Take care, __init are launched each time page are loaded on ajax
    __init: function(){
        if($('#main').hasClass('profile')){
            profile.load_events();
            
            profile.manage_pie();
        }
    },
    /**
     * Load events on init
     */
    load_events: function(){ 
        
    }, 
    
    manage_pie: function(){
        
        var wait_gap = 0;
        
        $('.profile-pie').each(function(){
            
            var $that = $(this);
            
            var c=document.getElementById($that.attr('id'));
            var ctx=c.getContext('2d');
            
            var percent = $that.attr('data-percent');
            profile.draw_pie($that, c, ctx, 0);
                 
            setTimeout(function(){
                $({percent:0}).animate({percent: percent}, {
                    duration: profile.PIE_SPEED_INIT,
                    easing: 'easeOutBounce',
                    step: function(now) {
                        profile.draw_pie($that, c, ctx, now);
                    },
                    complete: function(){
                        
                        $that.mouseenter(function(){
                             $({val:0}).animate({val: 10}, {
                                duration: profile.PIE_SPEED_BOUNCE,
                                easing: 'easeOutCirc',
                                step: function(now) {
                                    profile.draw_bounce_pie($that, c, ctx, percent, now);
                                }
                            });      
                        });
                        $that.mouseleave(function(){
                             $({val:10}).animate({val: 0}, {
                                duration: profile.PIE_SPEED_BOUNCE,
                                easing: 'easeOutCirc',
                                step: function(now) {
                                    profile.draw_bounce_pie($that, c, ctx, percent, now);
                                },
                            });      
                        });
                    }
                });                
            }, wait_gap);
            wait_gap += profile.GAP_TIME;
        });
    },
    draw_pie: function($this, c, ctx, percent){
        
        percent = parseInt(percent);
        percent = (percent > 100) ? 100 : percent; // for easeOutBack
        percent = (percent < 0) ? 0 : percent; // for easeOutBack
        
        ctx.clearRect(0, 0, c.width, c.height);
        
        ctx.beginPath();
        ctx.arc(75,75,50, 0, 2*Math.PI);
        ctx.lineWidth = profile.PIE_LINEWIDTH;
        ctx.strokeStyle="#d8d8d8";
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(75,75,50, 1.5*Math.PI, profile.get_radian(percent)*Math.PI,true);
        ctx.lineWidth = profile.PIE_LINEWIDTH;
        ctx.strokeStyle="#5673cb";
        ctx.stroke();

        ctx.font='20px "Trebuchet MS"';
        ctx.textAlign = 'center';
        ctx.textBaseline="middle";
        ctx.fillStyle="#383838";
        ctx.fillText(percent+"%",c.width/2,c.height/2);

    },
    draw_bounce_pie: function($this, c, ctx, percent, bounce_size){
        
        percent = parseInt(percent);
        percent = (percent > 100) ? 100 : percent; // for easeOutBack
        percent = (percent < 0) ? 0 : percent; // for easeOutBack
                
        ctx.clearRect(0, 0, c.width, c.height);
        
        ctx.beginPath();
        ctx.arc(75,75,50, 0, 2*Math.PI);
        ctx.lineWidth = profile.PIE_LINEWIDTH;
        ctx.strokeStyle="#d8d8d8";
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(75, 75, 50, 1.5*Math.PI, profile.get_radian(percent)*Math.PI,true);
        ctx.lineWidth = profile.PIE_LINEWIDTH-bounce_size;
        ctx.strokeStyle="#5673cb";
        ctx.stroke();
        
        ctx.font='20px "Trebuchet MS"';
        ctx.textAlign = 'center';
        ctx.textBaseline="middle";
        ctx.fillStyle="#383838";
        ctx.fillText(percent+"%",c.width/2,c.height/2);
        
        ctx.beginPath();
        ctx.arc(75,75, 50 +bounce_size*1.5, 1.5*Math.PI, profile.get_radian(percent-20)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.2)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75, 50 +bounce_size*1.25, 1.5*Math.PI, profile.get_radian(percent-16)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.4)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75,50 +bounce_size*1, 1.5*Math.PI, profile.get_radian(percent-12)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.5)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75, 50 +bounce_size*0.75, 1.5*Math.PI, profile.get_radian(percent-8)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.6)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75,50 +bounce_size*0.5, 1.5*Math.PI, profile.get_radian(percent-4)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.8)";
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(75,75,50 -bounce_size*1.5, 1.5*Math.PI, profile.get_radian(percent-20)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.2)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75,50 -bounce_size*1.25, 1.5*Math.PI, profile.get_radian(percent-16)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.4)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75,50 -bounce_size*1, 1.5*Math.PI, profile.get_radian(percent-12)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.5)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75,50 -bounce_size*0.75, 1.5*Math.PI, profile.get_radian(percent-8)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.6)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(75,75,50 -bounce_size*0.5, 1.5*Math.PI, profile.get_radian(percent-4)*Math.PI,true);
        ctx.lineWidth = 1;
        ctx.strokeStyle="rgba(86, 115,203, 0.8)";
        ctx.stroke();
        
    },
    get_radian: function(percent){
        return 1.5-(percent*2/100) ;    
    }
    
                    
};