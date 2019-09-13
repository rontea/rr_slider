/*
 *
 * Credit to Animate.css : https://daneden.github.io/animate.css/
 * Required Jquery.keyframes.min.js

https://github.com/Keyframes/jQuery.Keyframes


 */
/*

main : main class or div of the carousel



*/
(function($) {
	/* Accepting )ptions */
	jQuery.fn.rrslider = function(options) {
		/* variables Defination */
		var defaults = {
			/* Main */
			main: "#items",
			carousel: "carousel",
			/* items */
			/* Navigation */
			navigation: "nav",
			next: ".prev",
			prev: ".next",
			buttons: ".buttons",
			/* Buttons */
			navigationButtonCSS: "",
			setPreview: "",
			previewType: "",
			imgRefOff: "",
			imgRefOn: "",
			/* Effect */
			effect: "fade",
			/*fade , carousel*/
			/*Other */
			transitionDuration: "4000",
			delayOnNextClick: "2000",
			content: "content",
			// set the caption on or off
			captionOff: "false"
		};
		/* Define the options */
		var _ = jQuery.extend(defaults, options);
		return this.each(function() {
			// main set to id
			var main = _.main;
			var imgItem = $(main + " img");
			// count all the img
			var imgCount = $(imgItem).length;
			var _imgMax = imgCount - 1;
			var cycle;
			/* GLobal */
			/* carousel set to class */
			var _carousel = "." + _.carousel;
			/* content set to class */
			var _content = "." + _.content;
			/* Navigation */
			var _navigation = "." + _.navigation;
			var _items;
			var _current;
			var _thumb;
			var _round = false;
			var activeID = 0;
			/* */
			if (_.effect === "carousel") {

				var _direction = "right";
				var _clickArrow = false;
				var _marginValue = "-100%";

			}else if (_.effect === "carousel2"){
        var _direction = "right";
				var _clickArrow = false;
      }
			/* Title , Caption , and source */
			var src = new Array();
			var titles = new Array();
			var link = new Array();
			var captions = new Array();


			/* Get info title, links, image src */
			getInfo();
			/* Build the interface */
			buildInterface();
			/* Build Thumbnail */
			buildThumb();
			buildNavigation();
			start();
			pause();
			/*
			 * Get the information of the data to post include title, caption and link
			 *
			 */


			function getInfo() {
				for (var y = 0; y < imgCount; y++) {
					// get all the title
					titles[y] = $(imgItem[y]).attr("title");
					console.log("title " + y + ":" + titles[y]);
					if (_.captionOff === "false") {
						captions[y] = $(imgItem[y]).attr("alt");
					}
					// get links
					link[y] = $(imgItem[y]).attr("id");
					// get image src
					src[y] = $(imgItem[y]).attr("src");
				}
				// remove old images for a new build of the interface
				$(imgItem).remove();
			}
			/*
			 * Build buildInterface
			 * class info < title , description
			 *
			 */
			function buildInterface() {
				$(main).append('<div class="' + _carousel.substring(1) + '"> </div>');
				$(_carousel).append('<ul class="' + _content.substring(1) + '"> </ul>');
				/* Button append collected data */
				for (var y = 0; y < imgCount; y++) {
					// create the content
					$(_content).append('<li> <img  src="' + src[y] + '" alt="' + titles[y] + '" />  <div class="item-info"> <div class="info"> <div class="title"> ' + titles[y] + ' </div> <div class="description"> ' + captions[y] + ' </div> </div>  </div></li>');
				}
				console.log("==== build complete interface ===");
			}
			/*
			 *
			 * Build Left and Right Navigation
			 *
			 * */
			function buildNavigation() {
				// create navigation make sure that it is clicable
				$(_carousel).append('<div class="' + _navigation.substring(1) + '"> <div class="left openNav">  </div><div class="right openNav"> </div> </div>');
				/* Navigation Hide and Display */
				var navigation = "display";
				var wrap_nav = _carousel + " " + _navigation;
				if (navigation === "display") {
					// first initiation to hide
					$(wrap_nav).hide();
					// on hover show navigation
					$(_carousel).hover(function() {
						$(wrap_nav).fadeIn();
						// on not hover hide navigation
					}, function() {
						$(wrap_nav).fadeOut();
					});
				}
				/*
				 * Build navigation Interaction
				 *
				 * */
				var nav_left = _carousel + " " + _navigation + " .left";
				// left
				$(nav_left).click(function() {
					console.log("stat: pause Left click ARROW");
					if ($(this).hasClass("openNav")) {

						_clickArrow = true;
						// clear the cycle
						clearInterval(cycle);
						// resume cycle
						doCycle("desending");
						// make the navigation is close
						$(this).removeClass("openNav").addClass("closeNav");
						// delay time before clicable again
						setTimeout(function() {
							$(nav_left).removeClass("closeNav").addClass("openNav");
						}, _.delayOnNextClick);
					}
				});
				var nav_right = _carousel + " " + _navigation + " .right";
				// right
				$(nav_right).click(function() {
					console.log("stat: pause Right click ARROW >>>>>");
					if ($(this).hasClass("openNav")) {

						_clickArrow = true;
						// clear the cycle
						clearInterval(cycle);
						// resume cycle
						doCycle("assending");
						// make the navigation is close
						$(this).removeClass("openNav").addClass("closeNav");
						// delay time before clicable again
						setTimeout(function() {
							$(nav_right).removeClass("closeNav").addClass("openNav");
						}, _.delayOnNextClick);
					}
				});
			}
			/*
			 * Build Thumbnail
			 *
			 * */
			function buildThumb() {
				$(_carousel).append('<ol class="thumb"> </ol>');
				for (var y = 0; y < imgCount; y++) {
					$(_carousel + " .thumb").append('<li> </li>');
				}
				clickButton();
			}
			/*
			 * Build Clickable Thumbnail
			 *
			 * */
			function clickButton() {
				// click event
				$(_carousel + " .thumb li").click(function() {

					var _thumb = $(main + " ol.thumb li");
					var next = $(this).index();
					// make sure that it is not active
					if (!$(this).hasClass("active")) {
						// stop function from running
						clearInterval(cycle);
						// set the global position to next image
						$(_thumb[next]).addClass("thumbNext");
						// continue moving
						doCycle("assending");
					}
				});
			}
			/* Start the Transition */
			function start() {
				initItems();
				console.log("stat: start <-----------------");
				cycle = setInterval(function() {
					doCycle("assending");
				}, _.transitionDuration);
			}
			/*
			 * Start the Process
			 *
			 * */
			function initItems() {
				_items = $(_carousel + " ul li");
				_thumb = $(main + " ol.thumb li");
				// fade
				if (_.effect === "fade") {
					$("" + _carousel + " .content li").css({
						"position": "absolute"
					});
					$(_items[0]).addClass("fadeIn current");
					$(_thumb[0]).addClass('active');
					// carousel
				}else if (_.effect === "carousel"){
					$(_items[0]).addClass("current");
					$(_thumb[0]).addClass("active");
					/* Set the width of the ul */
					$(_items[0]).addClass("current");
					$(_thumb[0]).addClass("active");
					$("" + main + " ul").css("width", "" + $("" + main + " li").width() * imgCount + "");
					$("" + _carousel + " .content li").css({
						"opacity": "1",
						"position": "relative",
						"float": "left"
					});
					$("" + main + " ul").css("position", "absolute");
				} else if (_.effect === "carousel2") {
					$(_items[0]).addClass("current");
					$(_thumb[0]).addClass("active");
					/* Set the width of the ul */
					$(_items[0]).addClass("current");
					$(_thumb[0]).addClass("active");
					$("" + main + " ul").css("width", "" + $("" + main + " li").width() * imgCount + "");
					$("" + _carousel + " .content li").css({
						"opacity": "1",
						"position": "relative",
						"float": "left"
					});
					$("" + main + " ul").css("position", "absolute");
				} else {
					$(".carousel .content li").css({
						"position": "absolute"
					});
					$(_items[0]).addClass("fadeIn current");
					$(_thumb[0]).addClass('active');
				}
			}

			function doCycle(direction) {
				var prevNext = getPost(direction);
				setActive(prevNext);
				effect(prevNext);
			}
      /*set the initial active state */
			function setActive(prevNext) {
				$(_items[prevNext[0]]).removeClass("current");
				$(_items[prevNext[1]]).addClass("current");
				$(_thumb[prevNext[1]]).addClass('active').removeClass('thumbNext');
				$(_thumb[prevNext[0]]).removeClass('active');
			}
			// generateEffect
			function slideToLeft(selector,start,margin){

				$.keyframe.define({
    			name: 'slide-ul-left',
    			from: {
        		'margin-left': ''+start+'%'
    			},
    			to: {
        		'margin-left': '-'+margin+'%'
    			}
				});

				$(selector).playKeyframe({
						name:'slide-ul-left',
						duration:"2s",
						timingFunction:'ease',
						direction:'normal',
						fillMode:'forwards',

					});

			}
      /* Effect */

			function effect(prevNext) {
				var prev = prevNext[0];
				var next = prevNext[1];
				var cur = prevNext[2];
				var direction = prevNext[3];
				var thumbClick = prevNext[4];

				// fade
				if (_.effect === "fade") {
					$(_items[prev]).removeClass("fadeIn").addClass("fadeOut");
					$(_items[next]).addClass("fadeIn").removeClass("fadeOut");
					// carousel
				} else if (_.effect === "carousel"){



					/*
						going back to first item

					var max = _imgMax -1;
					for( i=max; i >= 0; i--){
						$(_items[i]).addClass("slide-to-right");
					}
					*/

					/*
					for( i=0; i < _imgMax; i++){
						$(_items[i]).addClass("slide-to-left");
					}*/

						if(_clickArrow === false){
										$(_items[cur]).removeClass("slide-to-left").removeClass("slide-to-right");
					          $(_items[next]).removeClass("slide-to-left").removeClass("slide-to-right");

										if(_direction === "right"){


										$(_items[cur]).addClass("slide-to-left");


										}else if (_direction === "left"){


														$(_items[next]).addClass("slide-to-right");

										}

					} else {
						// go to last

						$(_items[cur]).removeClass("slide-to-left").removeClass("slide-to-right");
						$(_items[next]).removeClass("slide-to-left").removeClass("slide-to-right");

						var start = cur * 100;
						var total = (next * 100);

						console.log(' ' + start);

						if(next === _imgMax && cur === 0){

							slideToLeft("" + main + " ul",0,total);

						}else if (next == 0 && cur === _imgMax){

						} else if (_direction === "left"){

						}else if (_direction === "right"){
							slideToLeft("" + main + " ul","-"+start,total);
						}
						_clickArrow = false;
					}



				}else if (_.effect === "carousel2"){
        // carousel 2
          $(_items[cur]).removeClass("carRight").removeClass("carLeft");
          $(_items[next]).removeClass("carRight").removeClass("carLeft");

          if(thumbClick === false){

            if(_direction === "right"){
              if(next === 0){
                  $(_items[next]).addClass("carLeft");
              }else {
                  $(_items[cur]).addClass("carRight");
              }
            }else if (_direction === "left") {
              $(_items[next]).addClass("carLeft");
            }
          }else {
            //here

            if (cur < next) {
							for (var i = cur; i < next; i++) {
								$(_items[i]).addClass("carRight");
							}
              _direction = "right";



						} else if (next < cur) {
							$(_items[next]).addClass("carLeft");


							if(next === 0){
								_direction = "right";
							}else {
								_direction = "left";
							}

						}
          }
        } else {
					/* Default Effect fade out */
					$(_items[prev]).removeClass("fadeIn").addClass("fadeOut");
					$(_items[next]).addClass("fadeIn").removeClass("fadeOut");
				}
			}
			/* get item position */
			function getPost(direction) {
				var prevNext = new Array();
				var next;
				var prev;
				var cur = $(_carousel + " ul.content li.current").index();
				var thumbClick = $(_carousel + " ol.thumb li").hasClass("thumbNext");

				if (thumbClick === false) {
					if (_.effect === "carousel") {
						console.log(_clickArrow);
						if(_clickArrow === false){
							if(direction === "assending" && _direction === "right" ||
							 		direction == "desending" && _direction === "right" ){

								prev = cur;
								next = cur + 1;

								if(cur === _imgMax){
									next = cur - 1;
									_direction = "left";
								}else {

									_direction = "right";

								}
							}else if (direction === "assending" && _direction === "left"
												|| direction == "desending" && _direction === "left" ){
								prev = cur;
								next = cur - 1;

								if(cur === 0){
									next = cur + 1;
									_direction = "right";
								}else {

									_direction = "left";

								}
							}
						} else {

							prev = cur;

							if(cur === 0 && direction === "desending"){
								// go to last item
								next = _imgMax;
								_direction = "left";

							} else if (cur === _imgMax && direction === "assending"){
								next = 0;
								_direction = "right";
							}else if (direction === "assending" && _direction === "right") {
								next = cur + 1;
								_direction = "right";
							}else  {
								next = cur - 1;
								_direction = "left";
							}

						}

						console.log('cur ' + cur);
						console.log('next ' + next);
						console.log('direction' + _direction);

					}else if (_.effect === "carousel2") {

            if (direction === "assending" && _direction === "right"){

              prev = cur;
							next = cur + 1;

              if (cur === _imgMax){
                next = _imgMax -1;
                _direction = "left";
              }

            } else if (direction === "assending" && _direction === "left") {
              prev = cur;
              next = cur - 1;

              if (cur === 1){
                next = 0;
                _direction = "right";

              }

            }else if (direction === "desending" && _direction === "right") {

              prev = cur;
              next = cur + 1;

              if (cur === _imgMax){
                next = _imgMax -1;
                _direction = "left";
              }

            }else if (direction === "desending" && _direction === "left"){

              prev = cur;
							next = cur - 1;

              if (cur === 1){
                next = 0;
                _direction = "right";
              }

            }

          } else {
						/* Check Cycle */
						if (direction === "assending") {
							prev = cur;
							next = cur + 1;
							if (next >= imgCount) {
								next = 0;
								prev = imgCount - 1;
							}
						} else if (direction === "desending") {
							next = cur - 1;
							prev = cur;
							if (next < 0) {
								next = imgCount - 1;
								prev = 0;
							}
						}
					}
				} else {
					console.log('=============== Click thumb cycle =============== ');
					next = $(_carousel + " ol.thumb li.thumbNext").index();
					prev = cur;
				}
				prevNext = [prev, next, cur, direction, thumbClick];
				return prevNext;
			}
			/* Halt the Transition */
			function pause() {
				$(_carousel).hover(function() {
					console.log("stat: pause ----------->");
					clearInterval(cycle);
				}, function() {
					console.log("stat: pause unlock - -- -- --->");
					cycle = setInterval(function() {
						doCycle("assending");
					}, _.transitionDuration);
				});
			}
		});
	}; // end fn
})(jQuery);
