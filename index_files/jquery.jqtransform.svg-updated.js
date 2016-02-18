/*
 *
 * jqTransform
 * by mathieu vilaplana mvilaplana@dfc-e.com
 * Designer ghyslain armand garmand@dfc-e.com
 *
 *
 * Version 1.0 25.09.08
 * Version 1.1 06.08.09
 * Add event click on Checkbox and Radio
 * Auto calculate the size of a select element
 * Can now, disabled the elements
 * Correct bug in ff if click on select (overflow=hidden)
 * No need any more preloading !!
 *
 ******************************************** */

(function($){
	var defaultOptions = {preloadImg:true};
	var jqTransformImgPreloaded = false;

	var jqTransformPreloadHoverFocusImg = function(strImgUrl) {
		//guillemets to remove for ie
		strImgUrl = strImgUrl.replace(/^url\((.*)\)/,'$1').replace(/^\"(.*)\"$/,'$1');
		var imgHover = new Image();
		imgHover.src = strImgUrl.replace(/\.([a-zA-Z]*)$/,'-hover.$1');
		var imgFocus = new Image();
		imgFocus.src = strImgUrl.replace(/\.([a-zA-Z]*)$/,'-focus.$1');
	};


	/***************************
	  Labels
	***************************/
	var jqTransformGetLabel = function(objfield){
		var selfForm = $(objfield.get(0).form);
		var oLabel = objfield.next();
		if(!oLabel.is('label')) {
			oLabel = objfield.prev();
			if(oLabel.is('label')){
				var inputname = objfield.attr('id');
				if(inputname){
					oLabel = selfForm.find('label[for="'+inputname+'"]');
				}
                        //Prevent click looping when clicking a checkbox or a radio button
			} else {
                            oLabel = objfield.parents('label').eq(0);
                        }

		}
		if(oLabel.is('label')){return oLabel.css('cursor','pointer');}
		return false;
	};

	/* Hide all open selects */
	var jqTransformHideSelect = function(oTarget){
		var ulVisible = $('.jqTransformSelectWrapper ul:visible');
                $('.jqTransformSelectWrapper').removeClass('focus');
		ulVisible.each(function(){
			var oSelect = $(this).parents(".jqTransformSelectWrapper:first").find("select").get(0);
			//do not hide if click on the label object associated to the select
			if( !(oTarget && oSelect.oLabel && oSelect.oLabel.get(0) == oTarget.get(0)) ){$(this).hide();}
		});
	};
	/* Check for an external click */
	var jqTransformCheckExternalClick = function(event) {
		if ($(event.target).parents('.jqTransformSelectWrapper').length === 0) {jqTransformHideSelect($(event.target));}
	};

	/* Apply document listener */
	var jqTransformAddDocumentListener = function (){
		$(document).mousedown(jqTransformCheckExternalClick);
	};

	/* Add a new handler for the reset action */
	var jqTransformReset = function(f){
		var sel;
		$('.jqTransformSelectWrapper select', f).each(function(){sel = (this.selectedIndex<0) ? 0 : this.selectedIndex;$('ul', $(this).parent()).each(function(){$('a:eq('+ sel +')', this).click();});});
		$('a.jqTransformCheckbox, a.jqTransformRadio', f).removeClass('jqTransformChecked');
		$('input[type=checkbox], input[type=radio]', f).each(function(){if(this.checked){$('a', $(this).parent()).addClass('jqTransformChecked');}});
	};

	/***************************
	  Buttons
	 ***************************/
	$.fn.jqTransInputButton = function(){
		return this.each(function(){
			var newBtn = $('<button id="'+ this.id +'" name="'+ this.name +'" type="'+ this.type +'" class="'+ this.className +' jqTransformButton"><span><span>'+ $(this).attr('value') +'</span></span>')
				.hover(function(){newBtn.addClass('jqTransformButton_hover');},function(){newBtn.removeClass('jqTransformButton_hover')})
				.mousedown(function(){newBtn.addClass('jqTransformButton_click')})
				.mouseup(function(){newBtn.removeClass('jqTransformButton_click')})
			;
			$(this).replaceWith(newBtn);
		});
	};

	/***************************
	  Text Fields
	 ***************************/
	$.fn.jqTransInputText = function(){
		return this.each(function(){
			var $input = $(this);

			if($input.hasClass('jqtranformdone') || !$input.is('input')) {return;}
			$input.addClass('jqtranformdone');

			var oLabel = jqTransformGetLabel($(this));
			oLabel && oLabel.bind('click',function(){$input.focus();});

			var inputSize=$input.width();
			if($input.attr('size')){
				inputSize = $input.attr('size')*10;
				$input.css('width',inputSize);
			}

			$input.addClass("jqTransformInput").wrap('<div class="jqTransformInputWrapper"><div class="jqTransformInputInner"><div></div></div></div>');
			var $wrapper = $input.parent().parent().parent();
			$wrapper.css("width", inputSize+10);
			$input
				.focus(function(){$wrapper.addClass("jqTransformInputWrapper_focus");})
				.blur(function(){$wrapper.removeClass("jqTransformInputWrapper_focus");})
				.hover(function(){$wrapper.addClass("jqTransformInputWrapper_hover");},function(){$wrapper.removeClass("jqTransformInputWrapper_hover");})
			;

			/* If this is safari we need to add an extra class */
			$.browser.safari && $wrapper.addClass('jqTransformSafari');
			$.browser.safari && $input.css('width',$wrapper.width()+16);
			this.wrapper = $wrapper;

		});
	};

	/***************************
	  Check Boxes
	 ***************************/
	$.fn.jqTransCheckBox = function(){
		return this.each(function(){
			if($(this).hasClass('jqTransformHidden')) {return;}

			var $input = $(this);
			var inputSelf = this;

			//set the click on the label
			var oLabel = jqTransformGetLabel($input);
			var aLink = $('<a href="#" class="jqTransformCheckbox">'+
                            '<svg class="checkbox-svg"><use xlink:href="#checkbox-icon"></svg>'+
                            '<svg class="checkbox-svg-checked"><use xlink:href="#checkbox-checked-icon"></svg>'+
                        '</a>');
			oLabel && oLabel.click(function(e){
                            if (!$(e.target).is('a') && !$(e.target).is('input')) {
                                e.preventDefault();//aLink.trigger('click');
                                $input.trigger('click');
                            }
                        });

			//wrap and add the link
			$input.addClass('jqTransformHidden').wrap('<span class="jqTransformCheckboxWrapper"></span>').parent().prepend(aLink);
			//on change, change the class of the link
			$input.change(function(){
				this.checked && aLink.addClass('jqTransformChecked') || aLink.removeClass('jqTransformChecked');
				return true;
			});
			// Click Handler, trigger the click and change event on the input
			aLink.click(function(e){
				//do nothing if the original input is disabled
				if($input.attr('disabled')){return false;}
				//trigger the envents on the input object
				$input.trigger('click').trigger("change");
				return false;
			});

			// set the default state
			this.checked && aLink.addClass('jqTransformChecked');
		});
	};
	/***************************
	  Radio Buttons
	 ***************************/
	$.fn.jqTransRadio = function(){
		return this.each(function(){
			if($(this).hasClass('jqTransformHidden')) {return;}

			var $input = $(this);
			var inputSelf = this;

			var oLabel = jqTransformGetLabel($input);
			oLabel && oLabel.click(function(e){

                            if (!$(e.target).is('a') && !$(e.target).is('input')) {
                                e.preventDefault();
                                $input.trigger('click');
                            }
                        });

			var aLink = $('<a href="#" class="jqTransformRadio" rel="'+ this.name +'"></a>');
			$input.addClass('jqTransformHidden').wrap('<span class="jqTransformRadioWrapper"></span>').parent().prepend(aLink);

			$input.change(function(){
				if (inputSelf.checked) {
                                    $('a[rel="'+aLink[0].rel+'"]').removeClass('jqTransformChecked');
                                    aLink.addClass('jqTransformChecked');
                                } else {
                                    aLink.removeClass('jqTransformChecked');
                                }

				return true;
			});
			// Click Handler
			aLink.click(function(){
				if($input.attr('disabled')){return false;}
				$input.trigger('click').trigger('change');

				//SMA uncheck all others of same name input radio elements
				$('input[name="'+$input.attr('name')+'"]',inputSelf.form).not($input).each(function(){
					$(this).attr('type')==='radio' && $(this).trigger('change');
				});

				return false;
			});
			// set the default state
			inputSelf.checked && aLink.addClass('jqTransformChecked');
		});
	};

	/***************************
	  Range Inputs
	 ***************************/
	$.fn.jqTransRange = function(){
                var getStepValue = function ($input, pct) {
                    var step = parseFloat($input.attr('step'));
                    var min  = parseFloat($input.attr('min'));
                    var max  = parseFloat($input.attr('max'));

                    //Give a default step if attribute is not set
                    if (isNaN(step)) {
                        step = 1;
                    }
                    var initial_value = (max-min)*pct/100+min;
                    var steps = initial_value/step;
                    var value = (steps*step)-step;

                    //if passed the middle of the step, change value by adding one step
                    if (initial_value-value > step/2) {
                        value += step;
                    }

                    return value;
                };
		return this.each(function(){
			if($(this).hasClass('jqTransformHidden')) {return;}

			var $input = $(this);
			var inputSelf = this;
                        $input.focus(function(e){e.preventDefault();});
			var oLabel = jqTransformGetLabel($input);
			oLabel && oLabel.click(function(e){e.preventDefault()});

			var $range = $('<span class="jqTransformRange" rel="'+ this.name +'"><a class="jqTransformRangeHandle"></a></span>').css({position: 'relative'});
                        var $handle = $('a', $range).css({position:'absolute'});
			$input.addClass('jqTransformHidden').wrap('<span class="jqTransformRangeWrapper"></span>').parent().prepend($range);
                        var current_value = parseInt(this.value);
                        $handle.css('left', ($(this).val()-$(this).attr('min'))*100/($(this).attr('max')-$(this).attr('min'))+'%');

                        var is_draggable = false;
                        window.onselectstart = function(){return false;};
                        $handle.mousedown(function(e) {e.preventDefault();is_draggable = true;}).click(function(e) {e.preventDefault();});
                        $(document).mouseup(function(e) {e.preventDefault();is_draggable = false;})
                                 .mousemove(function(e) {
                                     e.preventDefault();
                                   if (is_draggable === true) {
                                       var offset = $range.offset();
                                       offset.left = e.pageX-offset.left;
                                       var pct = offset.left*100/$range.width();
                                       if (pct > 100) pct = 100;
                                       if (pct < 0) pct = 0;
                                       $handle.css('left', pct+'%');
                                       var val = getStepValue($input, pct)
                                       $input.val(val);
                                       $input.trigger('change');
                                   }
                                 });

                        $input.change(function(e){
                            var min = parseFloat($input.attr('min'));
                            var max = parseFloat($input.attr('max'));
                            var val = parseFloat($input.val());
                            var pct = (val-min)*100/(max-min);
                            $handle.css('left', pct+'%');
		});

		});
	};

	/***************************
	  Number Inputs
	 ***************************/
	$.fn.jqTransNumber = function(){
		return this.each(function(){
			if($(this).hasClass('jqTransformHidden')) {return;}

			var $input = $(this);
			var inputSelf = this;
                        $input.focus(function(e){e.preventDefault()})
			var oLabel = jqTransformGetLabel($input);
			oLabel && oLabel.click(function(e){e.preventDefault()});
                        var current_value = parseInt(this.value);
                        var step = parseFloat($input.attr('step'));
                        var max = parseFloat($input.attr('max'));
                        var min = parseFloat($input.attr('min'));
                        var that = this;

                        if (this.value > max) {
                            this.value = max;
                        }

                        if (isNaN(step) || step == 0) {
                            step = 1;
                        }

			var $number = $('<input type="text" class="jqTransformNumberValue"  rel="'+ this.name +'" value="'+this.value+'" /><span class="jqTransformNumberHandles"><a class="jqTransformNumberUp"><span>Up</span></a><a class="jqTransformNumberDown"><span>Down</span></a></span>');
                        var $handleUp = $('.jqTransformNumberUp', $number);
                        var $handleDown = $('.jqTransformNumberDown', $number);
			$input.addClass('jqTransformHidden').wrap('<span class="jqTransformNumberWrapper"></span>').parent().prepend($number);
                        $number = $number.eq(0);


                        $handleUp.mousedown(function(e) {e.preventDefault();});
                        $handleDown.mousedown(function(e) {e.preventDefault();});

                        $number.keydown(function(e) {
                            if ((e.which <= 105 && e.which >= 96) || (e.which >= 48 && e.which <= 57) || e.which == 110 || e.which == 190 || e.which == 188 || e.which == 46 || e.which == 8) {
                                $input.trigger('keydown');
                            } else {
                                e.preventDefault();
                            }
                        });
                        $number.keyup(function(e) {
                            $input.trigger('keyup');
                        })

                        $handleUp.click(function() {
                            var val = parseFloat($input.val())+step;
                            if (!isNaN(max) && val > max) {
                                val = max;
                            }
                            $input.val(val).trigger('change');
                        });

                        $handleDown.click(function() {
                            var val = parseFloat($input.val())-step;
                            if (!isNaN(min) && val < min) {
                                val = min;
                            }
                            $input.val(val).trigger('change');
                        });

                        $input.change(function() {
                            $number.val(this.value);
		});

                        $number.change(function() {
                            $input.val(this.value).trigger('change');
                        });

		});
	};

	/***************************
	  TextArea
	 ***************************/
	$.fn.jqTransTextarea = function(){
		return this.each(function(){
			var textarea = $(this);

			if(textarea.hasClass('jqtransformdone')) {return;}
			textarea.addClass('jqtransformdone');

			var oLabel = jqTransformGetLabel(textarea);
			oLabel && oLabel.click(function(){textarea.focus();});

			var strTable = '<table cellspacing="0" cellpadding="0" border="0" class="jqTransformTextarea">';
			strTable +='<tr><td id="jqTransformTextarea-tl"></td><td id="jqTransformTextarea-tm"></td><td id="jqTransformTextarea-tr"></td></tr>';
			strTable +='<tr><td id="jqTransformTextarea-ml">&nbsp;</td><td id="jqTransformTextarea-mm"><div></div></td><td id="jqTransformTextarea-mr">&nbsp;</td></tr>';
			strTable +='<tr><td id="jqTransformTextarea-bl"></td><td id="jqTransformTextarea-bm"></td><td id="jqTransformTextarea-br"></td></tr>';
			strTable +='</table>';
			var oTable = $(strTable)
					.insertAfter(textarea)
					.hover(function(){
						!oTable.hasClass('jqTransformTextarea-focus') && oTable.addClass('jqTransformTextarea-hover');
					},function(){
						oTable.removeClass('jqTransformTextarea-hover');
					})
				;

			textarea
				.focus(function(){oTable.removeClass('jqTransformTextarea-hover').addClass('jqTransformTextarea-focus');})
				.blur(function(){oTable.removeClass('jqTransformTextarea-focus');})
				.appendTo($('#jqTransformTextarea-mm div',oTable))
			;
			this.oTable = oTable;
			if($.browser.safari){
				$('#jqTransformTextarea-mm',oTable)
					.addClass('jqTransformSafariTextarea')
					.find('div')
						.css('height',textarea.height())
						.css('width',textarea.width())
				;
			}
		});
	};

	/***************************
	  Select
	 ***************************/
	$.fn.jqTransSelect = function(){

		return this.each(function(index){


			var $select = $(this);

			if($select.hasClass('jqTransformHidden')) {return;}
                        if($select.hasClass('jq-ignore')) {return;}
			if($select.attr('multiple')) {return;}


			var oLabel  =  jqTransformGetLabel($select);
			/* First thing we do is Wrap it */
			var $wrapper = $select
				.addClass('jqTransformHidden')
				.wrap('<div class="jqTransformSelectWrapper"></div>')
				.parent()
				.css({zIndex: 200-index});

			/* Now add the html for the select */
			$wrapper.prepend('<div><span></span><a href="#" class="jqTransformSelectOpen"></a></div><ul></ul>');
			var $ul = $('ul', $wrapper).css('width',$select.width()).hide();
			/* Now we add the options */
			$('option', this).each(function(i){
				var oLi = $('<li><a href="#" index="'+ i +'">'+ $(this).html() +'</a></li>');
				$ul.append(oLi);
			});

			/* Add click handler to the a */
			$ul.find('a').click(function(){

					$('a.selected', $wrapper).removeClass('selected');
					$(this).addClass('selected');
					/* Fire the onchange event */
					if ($select[0].selectedIndex != $(this).attr('index') && $select[0].onchange) {
                                            $select[0].selectedIndex = $(this).attr('index');$select[0].onchange();
                                        }

					$select[0].selectedIndex = $(this).attr('index');
                                        $($select[0]).trigger('change'); //SMA trigger select change on click
					$('span:eq(0)', $wrapper).html($(this).html());
                                        $ul.hide();
                                        $wrapper.removeClass('focus');
					return false;
			});

			$select.change(function(){
                            var $this = $('li:eq('+$(':selected', $select).index()+') a', $wrapper);
                            $('a.selected', $wrapper).removeClass('selected');
                            $this.addClass('selected');
                            /* Fire the onchange event */

                            if ($select[0].selectedIndex != $this.attr('index') && $select[0].onchange) {
                                $select[0].selectedIndex = $this.attr('index'); $select[0].onchange();
                            }
                            $select[0].selectedIndex = $this.attr('index');
                            $('span:eq(0)', $wrapper).html($this.html());
                            $ul.hide();
                            $wrapper.removeClass('focus');
			});

			/* Set the default */
			$('a:eq('+ this.selectedIndex +')', $ul).click();

                        //SMA
			//$($wrapper).click(function(){$("a.jqTransformSelectOpen",$wrapper).trigger('click');});
			//oLabel && oLabel.click(function(){$($wrapper).trigger('click');});
			this.oLabel = oLabel;

			/* Apply the click handler to the Open */
			var oLinkOpen = $('a.jqTransformSelectOpen', $wrapper);
				$wrapper.click(function(){
					//Check if box is already open to still allow toggle, but close all other selects
					if( $ul.css('display') === 'none' ) {
                                            jqTransformHideSelect();
                                        }
					if($select.attr('disabled')){return false;}
                                        //inverted condition, because of the toggle after which changes the visible state
                                        if (!$ul.is(':visible')) {
                                            $wrapper.addClass('focus');
                                        } else {
                                            $wrapper.removeClass('focus');
                                        }
					$ul.slideToggle('fast', function(){
						var offSet = ($('a.selected', $ul).offset().top - $ul.offset().top);
						$ul.animate({scrollTop: offSet});
					});
					return false;
				})
			;

			// Set the new width
			var iSelectWidth = $select.outerWidth();
			var oSpan = $('span:first',$wrapper);
			var newWidth = (iSelectWidth > oSpan.innerWidth())?iSelectWidth+oLinkOpen.outerWidth():$wrapper.width();
			$wrapper.css('width',newWidth);
			$ul.css('width',newWidth-2);
			oSpan.css({width:iSelectWidth});

			// Calculate the height if necessary, less elements that the default height
			//show the ul to calculate the block, if ul is not displayed li height value is 0
			$ul.css({display:'block',visibility:'hidden'});
			var iSelectHeight = ($('li',$ul).length)*($('li:first',$ul).height());//+1 else bug ff
			(iSelectHeight < $ul.height()) && $ul.css({height:iSelectHeight,'overflow':'hidden'});//hidden else bug with ff
			$ul.css({display:'none',visibility:'visible'});

		});
	};
	$.fn.jqTransform = function(options){
		var opt = $.extend({},defaultOptions,options);

		/* each form */
		 return this.each(function(){
			var selfForm = $(this);
			if(selfForm.hasClass('jqtransformdone')) {return;}
			selfForm.addClass('jqtransformdone');

			//$('input:submit, input:reset, input[type="button"]', this).jqTransInputButton();
			//$('input:text, input:password', this).jqTransInputText();
			$('input:checkbox', this).jqTransCheckBox();
			$('.radio:not(".nojq") input[type=radio]', this).jqTransRadio();
			$('input[type=range], input.range', this).jqTransRange();
			$('input[type=number], input.number', this).jqTransNumber();
			//$('textarea', this).jqTransTextarea();

			if( $(':not(".nojq") > select:not(".nojq")').jqTransSelect().length > 0 ){jqTransformAddDocumentListener();}
			selfForm.bind('reset',function(){var action = function(){jqTransformReset(selfForm);};window.setTimeout(action, 10);});

			//preloading dont needed anymore since normal, focus and hover image are the same one
			/*if(opt.preloadImg && !jqTransformImgPreloaded){
				jqTransformImgPreloaded = true;
				var oInputText = $('input:text:first', selfForm);
				if(oInputText.length > 0){
					//pour ie on eleve les ""
					var strWrapperImgUrl = oInputText.get(0).wrapper.css('background-image');
					jqTransformPreloadHoverFocusImg(strWrapperImgUrl);
					var strInnerImgUrl = $('div.jqTransformInputInner',$(oInputText.get(0).wrapper)).css('background-image');
					jqTransformPreloadHoverFocusImg(strInnerImgUrl);
				}

				var oTextarea = $('textarea',selfForm);
				if(oTextarea.length > 0){
					var oTable = oTextarea.get(0).oTable;
					$('td',oTable).each(function(){
						var strImgBack = $(this).css('background-image');
						jqTransformPreloadHoverFocusImg(strImgBack);
					});
				}
			}*/


		}); /* End Form each */

	};/* End the Plugin */

})(jQuery);
