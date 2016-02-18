$(document).ready(function(){
    contact.__init();
});
var contact = {
    SPEED: 500,
    
    // Take care, __init are launched each time page are loaded on ajax
    __init: function(){
        if($('#main').hasClass('contact')){
            contact.load_events();
        } 
    },
    /**
     * Load events on init
     */
    load_events: function(){ 
        $("#main.contact form").submit(function(){
            
            var $form = $(this);            
            var url = $form.attr('action');
            var data = {
                ajax: true,
                name: $('input[name=name]', $form).val(),
                email: $('input[name=email]', $form).val(),
                subject: $('input[name=subject]', $form).val(),
                message: $('textarea[name=message]', $form).val()
            };            
            
            $.post(url, data, function(result){
                
                // Reset old .error and .success
                $('.success', $form).remove();
                $('.line.error .error', $form).remove();
                $('.line.error', $form).removeClass('error');
                
                console.log(result);
                if(result.status == "error" && result.errors){
                    for(field in result.errors){                        
                        var $field = $('input[name='+field+'], textarea[name='+field+']', $form);
                        var $line = $field.parents('.line');
                        var $error = $('<span class="error">'+
                            '<svg><use xlink:href="#error-icon"></svg>'+
                            '<span class="error-msg">'+result.errors[field]+'</span>'+
                        '</span>');
                        
                        $line.addClass('error');
                        $field.after($error);
                    }    
                }
                else if(result.status == "success" && result.success){
                    var $success = $('<span class="success">'+
                                        '<svg><use xlink:href="#valid-icon"></svg>'+
                                        '<span class="success-msg">'+result.success+'</span>'+
                                    '</span>');
                            
                    $form.prepend($success);
                    $success.hide().show(contact.SPEED);  
                }
                
                // Reload SVG 
                svg_manager.update();
                
            }, 'json');
            
            // Break form action
            return false;
        });
    }
                    
};