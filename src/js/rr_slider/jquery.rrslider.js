/*
 *
 * Credit to Animate.css : https://daneden.github.io/animate.css/
 *
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
      main: "items",
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
      var main = "#" + _.main;
      var imgItem = $(main + " img");

      // count all the img
      var imgCount = $(imgItem).length;

      var cycle;
      /* GLobal */
      /* carousel set to class */
      var _carousel = "." + _.carousel;
      /* content set to class */
      var _content = "." + _.content;
      /* Navigation */
      var _navigation = "."+ _.navigation;

      var _items;
      var _current;
      var _thumb;
      var activeID = 0;
      /* */
      if (_.effect === "carousel") {
        var _statusCar = "right";
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
        $(_carousel).append('<div class="'+_navigation.substring(1)+'"> <div class="left openNav">  </div><div class="right openNav"> </div> </div>');

        /* Navigation Hide and Display */

        var navigation = "display";

        var wrap_nav = _carousel + " "+ _navigation;

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

        var nav_left = _carousel + " " + _navigation +" .left";
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

        var nav_right = _carousel + " " + _navigation +" .right";
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
        $(_carousel +" .thumb li").click(function() {

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

      /*
       * Start the Process
       *
       * */
      function initItems() {

        _items = $(_carousel +" li");
        _thumb = $(main + " ol.thumb li");

        if (_.effect === "fade") {

          $(".carousel .content li").css({
            "position": "absolute"
          });

          $(_items[0]).addClass("fadeIn current");
          $(_thumb[0]).addClass('active');

        } else if (_.effect === "carousel") {

          $(_items[0]).addClass("current");

          $(_thumb[0]).addClass('active');

          /* Set the width of the ul */
          $("" + main + " ul").css("width", "" + $("" + main + " li").width() * imgCount + "");
          $(".carousel .content li").css({
            "opacity": "1",
            "position": "relative",
            "float": "left"
          });
          $("" + main + " ul").css("position", "absolute");

        } else if (_.effect === "carousel1") {

          $(_items[0]).addClass("current");
          $(_thumb[0]).addClass('active');
          $("" + main + " ul").css("width", "" + $("" + main + " li").width() * imgCount + "");
          $(".carousel .content li").css({
            "opacity": "1",
            "position": "relative",
            "float": "left"
          });
          $("" + main + " ul").css("position", "absolute");

        } else {

        }
      }
      /* Start the Transition */
      function start() {

        initItems();
        console.log("stat: start <-----------------");
        cycle = setInterval(function() {
          doCycle("assending");
        }, _.transitionDuration);

      }

      function doCycle(direction) {


        var prevNext = getPost(direction);
        setActive(prevNext);
        effect(prevNext);

      }
      /****
       *
       * @param {type} prevNext
       * @returns {undefined}
       *
       *
       */
      function effect(prevNext) {
        var prev = prevNext[0];
        var next = prevNext[1];
        var cur = prevNext[2];

        if (_.effect === "fade") {
          $(_items[prev]).removeClass("fadeIn").addClass("fadeOut");
          $(_items[next]).addClass("fadeIn").removeClass("fadeOut");

        } else if (_.effect === "carousel") {


          // $(""+ main +" ul").css("width", ""+$(""+ main +" li").width() * imgCount+"");

          // x is on -100; if cur is coming from the right it means that the < cur is -100% and the > cur is on 100

          var x = 0;

          if (next > cur) {

            while (x < next) {


              x++;

            }

          }

          /*
                      var x = 0;
                      if(next > cur){

                          // x is on -100; if cur is coming from the right it means that the < cur is -100% and the > cur is on 100

                          x=0;
                          while(x < next){

                              $(_items[x]).addClass('carRight').removeClass('carLeft');
                              console.log("  x " + x);
                              x++;
                          }
                           console.log("second " + prev +""+ cur +""+ next +""+ (imgCount - 1));

                      }

                      if(next < cur){

                          // Push the next item
                           x=cur;



                          while(next <= x){

                              $(_items[x]).addClass('carLeft').removeClass('carRight');

                              console.log("  x " + x);
                              x--;
                          }
                           console.log("first " + prev +""+ cur +""+ next +""+ (imgCount - 1));
                      }
             */
        } else if (_.effect === "") {


        } else {
          /* Default Effect fade out */
          $(_items[prev]).removeClass("fadeIn").addClass("fadeOut");
          $(_items[next]).addClass("fadeIn").removeClass("fadeOut");
        }

      }

      function setActive(prevNext) {

        $(_items[prevNext[0]]).removeClass("current");
        $(_items[prevNext[1]]).addClass("current");
        $(_thumb[prevNext[1]]).addClass('active').removeClass('thumbNext');
        $(_thumb[prevNext[0]]).removeClass('active');

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
            var imgC = imgCount - 1;

            if (_clickArrow === true) {

              if (direction === "assending") {

                if (cur === imgC) {

                  next = 0;
                  prev = cur;

                } else {
                  prev = cur;
                  next = cur + 1;

                }

                // desending
              } else if (direction === "desending") {

                if (cur === 0) {

                  next = imgC;
                  prev = cur;

                } else {
                  prev = cur;
                  next = cur - 1;

                }

              }
              _clickArrow = false;

            } else {
              var enter = 0;

              var curAdd = cur + 1;
              var imgC = imgCount - 1;

              if (curAdd < imgCount && _statusCar === "right") {
                next = cur + 1;
                prev = cur;
                enter = 4;
              }
              if (cur === imgC && _statusCar === "right") {
                prev = cur;
                next = cur - 1;
                _statusCar = "left";
                enter = 1;
              }
              if (cur === 0 && _statusCar === "left") {

                _statusCar = "right";
                next = cur + 1;
                prev = 0;
                enter = 2;
              }
              if (cur < imgCount && _statusCar === "left") {
                next = cur - 1;
                prev = cur;
                enter = 3;
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
          console.log('=============== Click thumb cycle ===============');

          next = $(_carousel + " ol.thumb li.thumbNext").index();
          prev = cur;
        }

        prevNext = [prev, next, cur];

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
