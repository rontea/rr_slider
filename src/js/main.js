$(document).ready(function (){

  $("#slider-body").rrslider({
          imgLocId: ".items",
          title: ".info",
          description: ".sub",
          DelayNextClick: "1000",
          transitionDuration: "4000",
          setPreview: "true",
          buttonLocId: "#slider-body .bottom",
          imgOff: "img/off.fw.png",
          imgOn: "img/on.fw.png",
          setArrow: "false"
      });

});
