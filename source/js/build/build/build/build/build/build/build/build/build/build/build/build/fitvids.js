/*global jQuery */
/*!
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function ($) {

  $.fn.fitVids = function (options) {
    var settings = {
      customSelector: null
    };

    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];

    div.className = 'fit-vids-style';
    div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>';

    ref.parentNode.insertBefore(div, ref);

    if (options) {
      $.extend(settings, options);
    }

    return this.each(function () {
      var selectors = ["iframe[src*='player.vimeo.com']", "iframe[src*='www.youtube.com']", "iframe[src*='www.kickstarter.com']", "object", "embed"];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));

      $allVideos.each(function () {
        var $this = $(this);
        if (this.tagName.toLowerCase() == 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) {
          return;
        }
        var height = this.tagName.toLowerCase() == 'object' || $this.attr('height') ? $this.attr('height') : $this.height(),
            width = $this.attr('width') ? $this.attr('width') : $this.width(),
            aspectRatio = height / width;
        if (!$this.attr('id')) {
          var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', aspectRatio * 100 + "%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpdHZpZHMuanMiXSwibmFtZXMiOlsiJCIsImZuIiwiZml0VmlkcyIsIm9wdGlvbnMiLCJzZXR0aW5ncyIsImN1c3RvbVNlbGVjdG9yIiwiZGl2IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicmVmIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwiZXh0ZW5kIiwiZWFjaCIsInNlbGVjdG9ycyIsInB1c2giLCIkYWxsVmlkZW9zIiwiZmluZCIsImpvaW4iLCIkdGhpcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudCIsImxlbmd0aCIsImhlaWdodCIsImF0dHIiLCJ3aWR0aCIsImFzcGVjdFJhdGlvIiwidmlkZW9JRCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIndyYXAiLCJjc3MiLCJyZW1vdmVBdHRyIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOzs7Ozs7Ozs7O0FBVUEsQ0FBQyxVQUFBLEFBQVUsR0FBRyxBQUVaOztJQUFBLEFBQUUsR0FBRixBQUFLLFVBQVUsVUFBQSxBQUFVLFNBQVUsQUFDakM7UUFBSTtzQkFBSixBQUFlLEFBQ2IsQUFBZ0IsQUFHbEI7OztRQUFJLE1BQU0sU0FBQSxBQUFTLGNBQW5CLEFBQVUsQUFBdUI7UUFDN0IsTUFBTSxTQUFBLEFBQVMscUJBQVQsQUFBOEIsUUFBOUIsQUFBc0MsTUFBTSxTQUFBLEFBQVMscUJBQVQsQUFBOEIsVUFEcEYsQUFDc0QsQUFBd0MsQUFFOUY7O1FBQUEsQUFBSSxZQUFKLEFBQWdCLEFBQ2hCO1FBQUEsQUFBSSxZQUFKLEFBQWdCLEFBa0JoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBQUEsQUFBSSxXQUFKLEFBQWUsYUFBZixBQUE0QixLQUE1QixBQUFnQyxBQUVoQzs7UUFBQSxBQUFLLFNBQVUsQUFDYjtRQUFBLEFBQUUsT0FBRixBQUFVLFVBQVYsQUFBb0IsQUFDckIsQUFFRDs7O2dCQUFPLEFBQUssS0FBSyxZQUFVLEFBQ3pCO1VBQUksWUFBWSxDQUFBLEFBQ2QsbUNBRGMsQUFFZCxrQ0FGYyxBQUdkLHNDQUhjLEFBSWQsVUFKRixBQUFnQixBQUtkLEFBR0Y7O1VBQUksU0FBSixBQUFhLGdCQUFnQixBQUMzQjtrQkFBQSxBQUFVLEtBQUssU0FBZixBQUF3QixBQUN6QixBQUVEOzs7VUFBSSxhQUFhLEVBQUEsQUFBRSxNQUFGLEFBQVEsS0FBSyxVQUFBLEFBQVUsS0FBeEMsQUFBaUIsQUFBYSxBQUFlLEFBRTdDOztpQkFBQSxBQUFXLEtBQUssWUFBVSxBQUN4QjtZQUFJLFFBQVEsRUFBWixBQUFZLEFBQUUsQUFDZDtZQUFJLEtBQUEsQUFBSyxRQUFMLEFBQWEsaUJBQWIsQUFBOEIsV0FBVyxNQUFBLEFBQU0sT0FBTixBQUFhLFVBQXRELEFBQWdFLFVBQVUsTUFBQSxBQUFNLE9BQU4sQUFBYSw4QkFBM0YsQUFBeUgsUUFBUSxBQUFFLEFBQVMsQUFDNUk7OztZQUFJLFNBQVcsS0FBQSxBQUFLLFFBQUwsQUFBYSxpQkFBYixBQUE4QixZQUFZLE1BQUEsQUFBTSxLQUFsRCxBQUE0QyxBQUFXLFlBQWMsTUFBQSxBQUFNLEtBQTNFLEFBQXFFLEFBQVcsWUFBWSxNQUF6RyxBQUF5RyxBQUFNO1lBQzNHLFFBQVEsTUFBQSxBQUFNLEtBQU4sQUFBVyxXQUFXLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLFdBQVcsTUFEeEQsQUFDd0QsQUFBTTtZQUMxRCxjQUFjLFNBRmxCLEFBRTJCLEFBQzNCO1lBQUcsQ0FBQyxNQUFBLEFBQU0sS0FBVixBQUFJLEFBQVcsT0FBTSxBQUNuQjtjQUFJLFVBQVUsV0FBVyxLQUFBLEFBQUssTUFBTSxLQUFBLEFBQUssV0FBekMsQUFBeUIsQUFBeUIsQUFDbEQ7Z0JBQUEsQUFBTSxLQUFOLEFBQVcsTUFBWCxBQUFpQixBQUNsQixBQUNEOztjQUFBLEFBQU0sS0FBTixBQUFXLGlEQUFYLEFBQTRELE9BQTVELEFBQW1FLDhCQUFuRSxBQUFpRyxJQUFqRyxBQUFxRyxlQUFnQixjQUFELEFBQWUsTUFBbkksQUFBd0ksQUFDeEk7Y0FBQSxBQUFNLFdBQU4sQUFBaUIsVUFBakIsQUFBMkIsV0E3RG5DLEFBRUUsQUFpQ0UsQUFBTyxBQWVMLEFBV0UsQUFBc0MsQUFDdkMsQUFDRixBQUNGLEFBQ0Y7Ozs7R0FqRUQsQUFpRUkiLCJmaWxlIjoiYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvYnVpbGQvZml0dmlkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFsIGpRdWVyeSAqL1xyXG4vKiFcclxuKiBGaXRWaWRzIDEuMFxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTEsIENocmlzIENveWllciAtIGh0dHA6Ly9jc3MtdHJpY2tzLmNvbSArIERhdmUgUnVwZXJ0IC0gaHR0cDovL2RhdmVydXBlcnQuY29tXHJcbiogQ3JlZGl0IHRvIFRoaWVycnkgS29ibGVudHogLSBodHRwOi8vd3d3LmFsaXN0YXBhcnQuY29tL2FydGljbGVzL2NyZWF0aW5nLWludHJpbnNpYy1yYXRpb3MtZm9yLXZpZGVvL1xyXG4qIFJlbGVhc2VkIHVuZGVyIHRoZSBXVEZQTCBsaWNlbnNlIC0gaHR0cDovL3NhbS56b3kub3JnL3d0ZnBsL1xyXG4qXHJcbiogRGF0ZTogVGh1IFNlcHQgMDEgMTg6MDA6MDAgMjAxMSAtMDUwMFxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKCAkICl7XHJcblxyXG4gICQuZm4uZml0VmlkcyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG4gICAgdmFyIHNldHRpbmdzID0ge1xyXG4gICAgICBjdXN0b21TZWxlY3RvcjogbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICByZWYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmFzZScpWzBdIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuXHJcbiAgICBkaXYuY2xhc3NOYW1lID0gJ2ZpdC12aWRzLXN0eWxlJztcclxuICAgIGRpdi5pbm5lckhUTUwgPSAnJnNoeTs8c3R5bGU+ICAgICAgICAgXFxcclxuICAgICAgLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXIgeyAgICAgICAgXFxcclxuICAgICAgICAgd2lkdGg6IDEwMCU7ICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgcGFkZGluZzogMDsgICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXIgaWZyYW1lLCAgXFxcclxuICAgICAgLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXIgb2JqZWN0LCAgXFxcclxuICAgICAgLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXIgZW1iZWQgeyAgXFxcclxuICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgdG9wOiAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgbGVmdDogMDsgICAgICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgd2lkdGg6IDEwMCU7ICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgICAgaGVpZ2h0OiAxMDAlOyAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcclxuICAgIDwvc3R5bGU+JztcclxuXHJcbiAgICByZWYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGl2LHJlZik7XHJcblxyXG4gICAgaWYgKCBvcHRpb25zICkge1xyXG4gICAgICAkLmV4dGVuZCggc2V0dGluZ3MsIG9wdGlvbnMgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBzZWxlY3RvcnMgPSBbXHJcbiAgICAgICAgXCJpZnJhbWVbc3JjKj0ncGxheWVyLnZpbWVvLmNvbSddXCIsXHJcbiAgICAgICAgXCJpZnJhbWVbc3JjKj0nd3d3LnlvdXR1YmUuY29tJ11cIixcclxuICAgICAgICBcImlmcmFtZVtzcmMqPSd3d3cua2lja3N0YXJ0ZXIuY29tJ11cIixcclxuICAgICAgICBcIm9iamVjdFwiLFxyXG4gICAgICAgIFwiZW1iZWRcIlxyXG4gICAgICBdO1xyXG5cclxuICAgICAgaWYgKHNldHRpbmdzLmN1c3RvbVNlbGVjdG9yKSB7XHJcbiAgICAgICAgc2VsZWN0b3JzLnB1c2goc2V0dGluZ3MuY3VzdG9tU2VsZWN0b3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgJGFsbFZpZGVvcyA9ICQodGhpcykuZmluZChzZWxlY3RvcnMuam9pbignLCcpKTtcclxuXHJcbiAgICAgICRhbGxWaWRlb3MuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgaWYgKHRoaXMudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09ICdlbWJlZCcgJiYgJHRoaXMucGFyZW50KCdvYmplY3QnKS5sZW5ndGggfHwgJHRoaXMucGFyZW50KCcuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlcicpLmxlbmd0aCkgeyByZXR1cm47IH1cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gKCB0aGlzLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSAnb2JqZWN0JyB8fCAkdGhpcy5hdHRyKCdoZWlnaHQnKSApID8gJHRoaXMuYXR0cignaGVpZ2h0JykgOiAkdGhpcy5oZWlnaHQoKSxcclxuICAgICAgICAgICAgd2lkdGggPSAkdGhpcy5hdHRyKCd3aWR0aCcpID8gJHRoaXMuYXR0cignd2lkdGgnKSA6ICR0aGlzLndpZHRoKCksXHJcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvID0gaGVpZ2h0IC8gd2lkdGg7XHJcbiAgICAgICAgaWYoISR0aGlzLmF0dHIoJ2lkJykpe1xyXG4gICAgICAgICAgdmFyIHZpZGVvSUQgPSAnZml0dmlkJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo5OTk5OTkpO1xyXG4gICAgICAgICAgJHRoaXMuYXR0cignaWQnLCB2aWRlb0lEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHRoaXMud3JhcCgnPGRpdiBjbGFzcz1cImZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXJcIj48L2Rpdj4nKS5wYXJlbnQoJy5mbHVpZC13aWR0aC12aWRlby13cmFwcGVyJykuY3NzKCdwYWRkaW5nLXRvcCcsIChhc3BlY3RSYXRpbyAqIDEwMCkrXCIlXCIpO1xyXG4gICAgICAgICR0aGlzLnJlbW92ZUF0dHIoJ2hlaWdodCcpLnJlbW92ZUF0dHIoJ3dpZHRoJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KSggalF1ZXJ5ICk7Il19
