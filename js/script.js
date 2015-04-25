jQuery(function (){

  var $carousel = $('#carousel_wrapper'),
      $ul = $carousel.find('.carousel_inner'),
      $li = $ul.children(),
      $firstChild = $li.filter(':first-child'),
      $lastChild = $li.filter(':last-child'),
      $ulW = $ul.outerWidth(true);
      speed = 500,
      timerspeed = 3000;

  var timer,
      distance;

  var count = {
    min : 0,
    max : $li.length,
    current: 0
  };

  $ul.css({
    width: $ulW * ($li.length + 1),
    marginLeft: -$ulW,
    paddingLeft: $ulW
  });

  function range(n, d) {
    if(n >= 0) {
      distance = $ulW * n;
    } else {
      var addnum;
      if(d === 'minus') {addnum = -1};
      if(d === 'plus') {addnum = +1};
      distance = $ulW * (count.current + addnum);
    }
  };
  function scroll(d) {
    $ul.stop(true, false).animate({left: -d}, speed);
  };
  function counter(n, c) {
    if(n >= 0) {
      count.current = n;
    } else {
      if(c === 'increment') count.current++;
      if(c === 'decrement') count.current--;
    }
  };
  function pagerNav(n) {
    $pager.children('a').removeClass('current');
    $pager.children('a:eq(' + n + ')').addClass('current');
  };
  function pager(d) {
    if(!$ul.is(':animated')) {
      clearTimeout(timer);
      if(d === 'plus') slide.next();
      if(d === 'minus') slide.prev();
      play();
    }
    return false;
  };

  // carousel
  var slide = {
    next: function (index){
      range(index, 'plus');
      if(count.current < count.max - 1) {
        scroll(distance);
      } else {
        $firstChild.css('left', $ulW * $li.length);
        $ul.stop(true, false).animate(
          {left: -distance}, speed,
          function () {
            $firstChild.css('left', 0);
            $ul.css('left', 0);
          }
        );
        count.current = -1;
      }
      counter(index, 'increment');
      pagerNav(count.current);
    },
    prev: function (index){
      range(index, 'minus');
      if(count.current > count.min) {
        scroll(distance);
      } else {
        $lastChild.css('left', -($ulW * $li.length));
        $ul.stop(true, false).animate(
          {left: -distance}, speed,
          function () {
            $lastChild.css('left', '');
            $ul.css('left', -($ulW * ($li.length - 1)));
          }
        );
        count.current = count.max;
      }
      counter(index, 'decrement');
      pagerNav(count.current);
    }
  };
  function play (){
    timer = setTimeout(function () {
      slide.next();
      play();
    }, timerspeed);
  };

  // pager
  $('#prev').click(function(){
    pager('minus');
  });
  $('#next').click(function(){
    pager('plus');
  });
  var $pager = $('<p/>', {'class': 'pager clearfix'});
  $li.each(function (i) {
    $('<a/>').text(i + 1).appendTo($pager).click(function(){
      var num = i;
      clearTimeout(timer);
      if(num > count.current) {
        slide.next(num);
      } else if(num < count.current) {
        slide.prev(num);
      }
      play();
      return false;
    });
  });
  $pager.appendTo($carousel);
  $pager.find('a:first-child').addClass('current');
  $pager.css({'width': $('.pager a').outerWidth(true) * count.max + 'px'});
  play();


// flick event
  $ul.bind({
    touchstart: function(){
      clearTimeout(timer);
      this.touchX = event.changedTouches[0].pageX;
      this.slideX = $(this).position().left;
    },
    touchmove: function(){
      this.slideX = this.slideX - (this.touchX - event.changedTouches[0].pageX);
      $(this).css({left:this.slideX});
      this.touchX = event.changedTouches[0].pageX;
    },
    touchend: function(){
      if(this.touchX <= 160){
        timer = setTimeout(function (){
          slide.next();
          play();
        });
      } else {
        timer = setTimeout(function (){
          slide.prev();
          play();
        });
      }
    }
  });

});