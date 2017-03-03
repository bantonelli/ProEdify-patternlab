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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpdHZpZHMuanMiXSwibmFtZXMiOlsiJCIsImZuIiwiZml0VmlkcyIsIm9wdGlvbnMiLCJzZXR0aW5ncyIsImN1c3RvbVNlbGVjdG9yIiwiZGl2IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicmVmIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwiZXh0ZW5kIiwiZWFjaCIsInNlbGVjdG9ycyIsInB1c2giLCIkYWxsVmlkZW9zIiwiZmluZCIsImpvaW4iLCIkdGhpcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudCIsImxlbmd0aCIsImhlaWdodCIsImF0dHIiLCJ3aWR0aCIsImFzcGVjdFJhdGlvIiwidmlkZW9JRCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIndyYXAiLCJjc3MiLCJyZW1vdmVBdHRyIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOzs7Ozs7Ozs7O0FBVUEsQ0FBQyxVQUFBLEFBQVUsR0FBRyxBQUVaOztJQUFBLEFBQUUsR0FBRixBQUFLLFVBQVUsVUFBQSxBQUFVLFNBQVUsQUFDakM7UUFBSTtzQkFBSixBQUFlLEFBQ0csQUFHbEIsQUFKZSxBQUNiOzs7UUFHRSxNQUFNLFNBQUEsQUFBUyxjQUFuQixBQUFVLEFBQXVCO1FBQzdCLE1BQU0sU0FBQSxBQUFTLHFCQUFULEFBQThCLFFBQTlCLEFBQXNDLE1BQU0sU0FBQSxBQUFTLHFCQUFULEFBQThCLFVBRHBGLEFBQ3NELEFBQXdDLEFBRTlGOztRQUFBLEFBQUksWUFBSixBQUFnQixBQUNoQjtRQUFBLEFBQUksWUFBSixBQUFnQixBQWtCaEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUFBLEFBQUksV0FBSixBQUFlLGFBQWYsQUFBNEIsS0FBNUIsQUFBZ0MsQUFFaEM7O1FBQUEsQUFBSyxTQUFVLEFBQ2I7UUFBQSxBQUFFLE9BQUYsQUFBVSxVQUFWLEFBQW9CLEFBQ3JCLEFBRUQ7OztnQkFBTyxBQUFLLEtBQUssWUFBVSxBQUN6QjtVQUFJLFlBQVksQ0FBQSxBQUNkLG1DQURjLEFBRWQsa0NBRmMsQUFHZCxzQ0FIYyxBQUlkLFVBSkYsQUFBZ0IsQUFLZCxBQUdGOztVQUFJLFNBQUosQUFBYSxnQkFBZ0IsQUFDM0I7a0JBQUEsQUFBVSxLQUFLLFNBQWYsQUFBd0IsQUFDekIsQUFFRDs7O1VBQUksYUFBYSxFQUFBLEFBQUUsTUFBRixBQUFRLEtBQUssVUFBQSxBQUFVLEtBQXhDLEFBQWlCLEFBQWEsQUFBZSxBQUU3Qzs7aUJBQUEsQUFBVyxLQUFLLFlBQVUsQUFDeEI7WUFBSSxRQUFRLEVBQVosQUFBWSxBQUFFLEFBQ2Q7WUFBSSxLQUFBLEFBQUssUUFBTCxBQUFhLGlCQUFiLEFBQThCLFdBQVcsTUFBQSxBQUFNLE9BQU4sQUFBYSxVQUF0RCxBQUFnRSxVQUFVLE1BQUEsQUFBTSxPQUFOLEFBQWEsOEJBQTNGLEFBQXlILFFBQVEsQUFBRSxBQUFTO0FBQzVJOztZQUFJLFNBQVcsS0FBQSxBQUFLLFFBQUwsQUFBYSxpQkFBYixBQUE4QixZQUFZLE1BQUEsQUFBTSxLQUFsRCxBQUE0QyxBQUFXLFlBQWMsTUFBQSxBQUFNLEtBQTNFLEFBQXFFLEFBQVcsWUFBWSxNQUF6RyxBQUF5RyxBQUFNO1lBQzNHLFFBQVEsTUFBQSxBQUFNLEtBQU4sQUFBVyxXQUFXLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLFdBQVcsTUFEeEQsQUFDd0QsQUFBTTtZQUMxRCxjQUFjLFNBRmxCLEFBRTJCLEFBQzNCO1lBQUcsQ0FBQyxNQUFBLEFBQU0sS0FBVixBQUFJLEFBQVcsT0FBTSxBQUNuQjtjQUFJLFVBQVUsV0FBVyxLQUFBLEFBQUssTUFBTSxLQUFBLEFBQUssV0FBekMsQUFBeUIsQUFBeUIsQUFDbEQ7Z0JBQUEsQUFBTSxLQUFOLEFBQVcsTUFBWCxBQUFpQixBQUNsQixBQUNEOztjQUFBLEFBQU0sS0FBTixBQUFXLGlEQUFYLEFBQTRELE9BQTVELEFBQW1FLDhCQUFuRSxBQUFpRyxJQUFqRyxBQUFxRyxlQUFnQixjQUFELEFBQWUsTUFBbkksQUFBd0ksQUFDeEk7Y0FBQSxBQUFNLFdBQU4sQUFBaUIsVUFBakIsQUFBMkIsV0FBM0IsQUFBc0MsQUFDdkMsQUFaRCxBQWFEO0FBNUJELEFBQU8sQUE2QlI7QUE3QlEsQUFqQ1QsQUErREQ7QUFqRUQ7R0FBQSxBQWlFSSIsImZpbGUiOiJidWlsZC9idWlsZC9maXR2aWRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgalF1ZXJ5ICovXHJcbi8qIVxyXG4qIEZpdFZpZHMgMS4wXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxMSwgQ2hyaXMgQ295aWVyIC0gaHR0cDovL2Nzcy10cmlja3MuY29tICsgRGF2ZSBSdXBlcnQgLSBodHRwOi8vZGF2ZXJ1cGVydC5jb21cclxuKiBDcmVkaXQgdG8gVGhpZXJyeSBLb2JsZW50eiAtIGh0dHA6Ly93d3cuYWxpc3RhcGFydC5jb20vYXJ0aWNsZXMvY3JlYXRpbmctaW50cmluc2ljLXJhdGlvcy1mb3ItdmlkZW8vXHJcbiogUmVsZWFzZWQgdW5kZXIgdGhlIFdURlBMIGxpY2Vuc2UgLSBodHRwOi8vc2FtLnpveS5vcmcvd3RmcGwvXHJcbipcclxuKiBEYXRlOiBUaHUgU2VwdCAwMSAxODowMDowMCAyMDExIC0wNTAwXHJcbiovXHJcblxyXG4oZnVuY3Rpb24oICQgKXtcclxuXHJcbiAgJC5mbi5maXRWaWRzID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcbiAgICB2YXIgc2V0dGluZ3MgPSB7XHJcbiAgICAgIGN1c3RvbVNlbGVjdG9yOiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgIHJlZiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdiYXNlJylbMF0gfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG5cclxuICAgIGRpdi5jbGFzc05hbWUgPSAnZml0LXZpZHMtc3R5bGUnO1xyXG4gICAgZGl2LmlubmVySFRNTCA9ICcmc2h5OzxzdHlsZT4gICAgICAgICBcXFxyXG4gICAgICAuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlciB7ICAgICAgICBcXFxyXG4gICAgICAgICB3aWR0aDogMTAwJTsgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7ICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICBwYWRkaW5nOiAwOyAgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICAuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlciBpZnJhbWUsICBcXFxyXG4gICAgICAuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlciBvYmplY3QsICBcXFxyXG4gICAgICAuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlciBlbWJlZCB7ICBcXFxyXG4gICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7ICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICB0b3A6IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICBsZWZ0OiAwOyAgICAgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICB3aWR0aDogMTAwJTsgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICAgICBoZWlnaHQ6IDEwMCU7ICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxyXG4gICAgPC9zdHlsZT4nO1xyXG5cclxuICAgIHJlZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkaXYscmVmKTtcclxuXHJcbiAgICBpZiAoIG9wdGlvbnMgKSB7XHJcbiAgICAgICQuZXh0ZW5kKCBzZXR0aW5ncywgb3B0aW9ucyApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIHNlbGVjdG9ycyA9IFtcclxuICAgICAgICBcImlmcmFtZVtzcmMqPSdwbGF5ZXIudmltZW8uY29tJ11cIixcclxuICAgICAgICBcImlmcmFtZVtzcmMqPSd3d3cueW91dHViZS5jb20nXVwiLFxyXG4gICAgICAgIFwiaWZyYW1lW3NyYyo9J3d3dy5raWNrc3RhcnRlci5jb20nXVwiLFxyXG4gICAgICAgIFwib2JqZWN0XCIsXHJcbiAgICAgICAgXCJlbWJlZFwiXHJcbiAgICAgIF07XHJcblxyXG4gICAgICBpZiAoc2V0dGluZ3MuY3VzdG9tU2VsZWN0b3IpIHtcclxuICAgICAgICBzZWxlY3RvcnMucHVzaChzZXR0aW5ncy5jdXN0b21TZWxlY3Rvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciAkYWxsVmlkZW9zID0gJCh0aGlzKS5maW5kKHNlbGVjdG9ycy5qb2luKCcsJykpO1xyXG5cclxuICAgICAgJGFsbFZpZGVvcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICBpZiAodGhpcy50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2VtYmVkJyAmJiAkdGhpcy5wYXJlbnQoJ29iamVjdCcpLmxlbmd0aCB8fCAkdGhpcy5wYXJlbnQoJy5mbHVpZC13aWR0aC12aWRlby13cmFwcGVyJykubGVuZ3RoKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHZhciBoZWlnaHQgPSAoIHRoaXMudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09ICdvYmplY3QnIHx8ICR0aGlzLmF0dHIoJ2hlaWdodCcpICkgPyAkdGhpcy5hdHRyKCdoZWlnaHQnKSA6ICR0aGlzLmhlaWdodCgpLFxyXG4gICAgICAgICAgICB3aWR0aCA9ICR0aGlzLmF0dHIoJ3dpZHRoJykgPyAkdGhpcy5hdHRyKCd3aWR0aCcpIDogJHRoaXMud2lkdGgoKSxcclxuICAgICAgICAgICAgYXNwZWN0UmF0aW8gPSBoZWlnaHQgLyB3aWR0aDtcclxuICAgICAgICBpZighJHRoaXMuYXR0cignaWQnKSl7XHJcbiAgICAgICAgICB2YXIgdmlkZW9JRCA9ICdmaXR2aWQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjk5OTk5OSk7XHJcbiAgICAgICAgICAkdGhpcy5hdHRyKCdpZCcsIHZpZGVvSUQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkdGhpcy53cmFwKCc8ZGl2IGNsYXNzPVwiZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlclwiPjwvZGl2PicpLnBhcmVudCgnLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXInKS5jc3MoJ3BhZGRpbmctdG9wJywgKGFzcGVjdFJhdGlvICogMTAwKStcIiVcIik7XHJcbiAgICAgICAgJHRoaXMucmVtb3ZlQXR0cignaGVpZ2h0JykucmVtb3ZlQXR0cignd2lkdGgnKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pKCBqUXVlcnkgKTsiXX0=
