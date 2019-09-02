/*

rr-slider
Author: Ronryan Teano
Version : 0
Specification: Jquery 1.11.0

This plugin is under development

########################################################################################################################
Notes
########################################################################################################################
Define information:

		Image information:

		imgLocId :   The  id or class of the parent of image that will be use on the slides
		title :  The id or class of the Title area
		description: The id or class of the Description area
		delayNextClick: Delay of the next click when arrow is click , define a number
		transitionDuration: The duration of the transition of image , define a number

		Preview setting:

		setPreview: enable the preview button or thumbnail, if true = preview on else false = preview off
		preview:  Define the preview if "button" or "thumb"
		buttonLocId: The id or class of the Button area
		imgOff :  Link of the image in use for button if it is off
		imgOn :   Link of the image in use for button if it is on

		Arrow Setting:

		setArrow: enable the arrow left and right , if true = arrow is available else false = arrow is off
		setArrowAlwaysOn: set if the arrow is static on if true or if it is false it will be available if hover on it
		arrowLoc:  The id or class of the arrow
		leftArrow:  The id or class of the Left arrow
		rightArrow:  The id or class of the Right arrow

########################################################################################################################
*/

/* make the function private within the context of the plugin */
(function($) {


  /* Accepting options */
  jQuery.fn.rrslider = function(options) {

    // variables
    var defaults = {

      imgLocId: ".items",
      title: ".title",
      description: ".description",
      delayNextClick: "1000",
      transitionDuration: "4000",
      /* button */
      setPreview: "true",
      preview: "button",
      buttonLocId: "#buttons",
      imgOff: "img/rrslider_img/right.ico",
      imgOn: "img/rrslider_img/left.ico",
      /* arrow */
      setArrow: "true",
      setArrowAlwaysOn: "false",
      arrowLoc: "#arrow",
      leftArrow: ".leftArrow",
      rightArrow: ".rightArrow",

    }
    /* Define the options */
    var o = jQuery.extend(defaults, options);

    return this.each(function() {

      /* ================================

      Start Process

      =================================== */

      var slider = $(this);
      /* Title , Caption and link */
      var titles = new Array();
      var captions = new Array();
      var link = new Array();


      /* Image */
      var imgActive = o.imgLocId + " " + "img.active";
      /* Create the Button off image */
      var imgOffSrc = "<img src='" + o.imgOff + "'>";
      /* image location */
      var imgLoc = o.imgLocId + " img";
      var imgLocIdEq = o.imgLocId + " img:eq";

      /*Image Count */
      var imgCount = $(imgLoc).length;

      /*Buttons*/
      if (o.setPreview == "true") {
        var buttonLocImg = o.buttonLocId + " img";
        var buttonLocImgEq = o.buttonLocId + " img:eq";
        var onImage = buttonLocImg + ".on";
      }

      /* Default arrow Direction */
      var cycleDirection = "assending";

      /* Get the information on the image title and captions */
      for (var x = 0; x < imgCount; x++) {
        titles[x] = $("" + imgLocIdEq + "(" + x + ")").attr("title");
        captions[x] = $("" + imgLocIdEq + "(" + x + ")").attr("alt");
        link[x] = $("" + imgLocIdEq + "(" + x + ")").attr("id");
      }

      loadInfo();

      /* When Arrow is click */

      if (o.setArrow == "true") {
        arrowClick();
      }
      if (o.setPreview == "true") {
        buttonClick();
      }
      /* Do the cycle of image */

      if (imgCount != 1) {
        cycle = setInterval(function() {
          cycleImages(cycleDirection);
        }, o.transitionDuration);
      }

      /* ==============Function====================== */
      function buttonClick() {

        /* When Button is click */
        $(buttonLocImg).click(function() {
          // stop the cycle

          var currentImage = $(imgActive).index();
          var test = $(this).index()


          var next = $(this).index();
          var prev = $(onImage).index();


          if (next != prev) {
            clearInterval(cycle);
            if (o.preview == "button") {
              $(buttonLocImgEq + "(" + prev + ")").removeClass("on").addClass("off").attr("src", o.imgOff);
              $(this).removeClass("off").addClass("on").attr("src", o.imgOn);
            } else if (o.preview == "thumb") {
              $(buttonLocImgEq + "(" + prev + ")").removeClass("on").addClass("off").css("border", "none");
              $(this).removeClass("off").addClass("on").css("border", "#CCCCCC solid 1px");
            }


            currentImage = $(imgActive).index();
            $("" + imgLocIdEq + "(" + currentImage + ")").removeClass('active').addClass('inActive');
            $("" + imgLocIdEq + "(" + next + ")").removeClass("inActive").addClass("active");
            $(o.title).html('<a href="' + link[next] + '">' + titles[next] + '</a>');
            $(o.description).html(captions[next]);
            effect(currentImage, next);
            /*resume*/
            cycle = setInterval(function() {
              cycleImages("assending");
            }, o.transitionDuration);

          }

        });
      }

      function loadInfo() {

        /* Load the first image */
        $("" + imgLocIdEq + "(" + 0 + ")").css("display", "block");
        $(imgLoc).addClass("inActive");
        $(imgLoc).first().attr("class", "active");
        $(o.title).html('<a href="' + link[0] + '">' + titles[0] + '</a>');
        $(o.description).html(captions[0]);

        if (o.setPreview == "true") {
          if (o.preview == "button") {
            /* Generate the buttons make all off */
            for (var y = 0; y < imgCount; y++) {
              $(o.buttonLocId).append(imgOffSrc);
            }
            /* Make the first button on */
            $(buttonLocImg).first().addClass("on").attr("src", o.imgOn);
          } else if (o.preview == "thumb") {
            // thumbnails view here
            var source = "";
            for (var y = 0; y < imgCount; y++) {

              source = $(imgLocIdEq + "(" + y + ")").attr("src");
              $(o.buttonLocId).append("<img src='" + source + "' style='height:30px; width:30px;' />");

            }

          }
        }
      }

      // cycle the Image
      function cycleImages(cycleDirection) {

        var next;
        var prev;

        var current = $(imgActive).index();

        // determine the cycle
        if (cycleDirection == "assending") {

          prev = current;
          next = current + 1;

          if (next >= imgCount) {
            next = 0;
            prev = imgCount - 1;
          }

        } else if (cycleDirection == "desending") {
          next = current - 1;
          prev = current;

          if (prev == imgCount) {
            next = 0;
            prev = imgCount;
          }

        }


        if (o.setPreview == "true") {
          /* change the button to active and inactive */
          if (o.preview == "button") {
            $(buttonLocImgEq + "(" + prev + ")").addClass("off").removeClass("on").attr("src", o.imgOff);
            $(buttonLocImgEq + "(" + next + ")").addClass("on").removeClass("off").attr("src", o.imgOn);
          } else if (o.preview == "thumb") {

            $(buttonLocImgEq + "(" + prev + ")").addClass("off").removeClass("on").css("border", "none");
            $(buttonLocImgEq + "(" + next + ")").addClass("on").removeClass("off").css("border", "#CCCCCC solid 1px");

          }

        }
        /* change the image to active and inactive*/
        $("" + imgLocIdEq + "(" + prev + ")").removeClass('active').addClass('inActive');
        $("" + imgLocIdEq + "(" + next + ")").removeClass("inActive").addClass("active");


        current = $(imgActive).index();
        /* post the information */
        $(o.title).html('<a href="' + link[current] + '">' + titles[current] + '</a>');
        $(o.description).html(captions[current]);
        // effect
        effect(prev, next);
      }
      /* Define the Effect */
      function effect(prev, next) {

        $("" + imgLocIdEq + "(" + prev + ")").fadeOut("slow");
        $("" + imgLocIdEq + "(" + next + ")").fadeIn("slow");
      }

      /* Arrow Interaction */
      function arrowClick() {

        /* Arrows */
        var left = o.leftArrow.substring(1);
        var right = o.rightArrow.substring(1);

        $(o.arrowLoc).append("<div class='" + left + "'></div>");
        $(o.arrowLoc).append("<div class='" + right + "'></div>");


        /* set arrows to inActive first load */
        $(o.leftArrow).addClass("inActive");
        $(o.rightArrow).addClass("inActive");


        if (o.setArrowAlwaysOn == "false") {
          /* Arrow appear Effect */
          $(slider).mouseenter(function() {
            $(o.arrowLoc).fadeIn(); //mouse hover  fade in
          });
          $(slider).mouseleave(function() {
            $(o.arrowLoc).fadeOut(); //mouse out fade out
          });
        } else if (o.setArrowAlwaysOn == "true") {
          $(o.arrowLoc).css("display", "block");
        }
        /* When mouse over on Wrapper */
        slider.mouseover(function() {
          // clear the cache of cycle to make it stop
          clearInterval(cycle);
        });

        /* resume cycle of image */
        slider.mouseout(function() {
          // cycle image
          cycle = setInterval(function() {
            cycleImages(cycleDirection);
          }, o.transitionDuration);
        });

        // left arrow is click
        $(o.leftArrow).click(function() {
          // if it is inActive
          if ($(this).hasClass("inActive")) {
            clearInterval(cycle); // clear the slide
            cycleImages("desending"); // cycle again
            $(this).removeClass("inActive").addClass("active"); // set the previous  position of button to inactive and active to current position

            // make sure that the arrow is not accessible in 1000 millisecond
            setTimeout(function() {
              $(o.leftArrow).removeClass("active").addClass("inActive");
            }, o.delayNextClick);
          }

        });

        // Arrow click right
        $(o.rightArrow).click(function() {

          if ($(this).hasClass("inActive")) {
            clearInterval(cycle);
            cycleImages("assending");
            $(this).removeClass("inActive").addClass("active");
            setTimeout(function() {
              $(o.rightArrow).removeClass("active").addClass("inActive");
            }, o.delayNextClick);
          }
        });
      }

    }); // end return this
  }; // end fn

})(jQuery) // end jQuery
