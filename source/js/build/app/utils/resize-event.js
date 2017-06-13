define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* Modified from https://github.com/sdecima/javascript-detect-element-resize
   * version: 0.5.3
   *
   * The MIT License (MIT)
   *
   * Copyright (c) 2013 Sebastián Décima
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of
   * this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to
   * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
   * the Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
   * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
   * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
   * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
   * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */
  var isServer = typeof window === 'undefined';

  /* istanbul ignore next */
  var requestFrame = function () {
    if (isServer) return;
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
      return window.setTimeout(fn, 20);
    };
    return function (fn) {
      return raf(fn);
    };
  }();

  /* istanbul ignore next */
  var cancelFrame = function () {
    if (isServer) return;
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
    return function (id) {
      return cancel(id);
    };
  }();

  /* istanbul ignore next */
  var resetTrigger = function resetTrigger(element) {
    var trigger = element.__resizeTrigger__;
    var expand = trigger.firstElementChild;
    var contract = trigger.lastElementChild;
    var expandChild = expand.firstElementChild;

    contract.scrollLeft = contract.scrollWidth;
    contract.scrollTop = contract.scrollHeight;
    expandChild.style.width = expand.offsetWidth + 1 + 'px';
    expandChild.style.height = expand.offsetHeight + 1 + 'px';
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
  };

  /* istanbul ignore next */
  var checkTriggers = function checkTriggers(element) {
    return element.offsetWidth !== element.__resizeLast__.width || element.offsetHeight !== element.__resizeLast__.height;
  };

  /* istanbul ignore next */
  var scrollListener = function scrollListener(event) {
    var _this = this;

    resetTrigger(this);
    if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
    this.__resizeRAF__ = requestFrame(function () {
      if (checkTriggers(_this)) {
        _this.__resizeLast__.width = _this.offsetWidth;
        _this.__resizeLast__.height = _this.offsetHeight;
        _this.__resizeListeners__.forEach(function (fn) {
          fn.call(_this, event);
        });
      }
    });
  };

  /* Detect CSS Animations support to detect element display/re-attach */
  var attachEvent = isServer ? {} : document.attachEvent;
  var DOM_PREFIXES = 'Webkit Moz O ms'.split(' ');
  var START_EVENTS = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
  var RESIZE_ANIMATION_NAME = 'resizeanim';
  var animation = false;
  var keyFramePrefix = '';
  var animationStartEvent = 'animationstart';

  /* istanbul ignore next */
  if (!attachEvent && !isServer) {
    var testElement = document.createElement('fakeelement');
    if (testElement.style.animationName !== undefined) {
      animation = true;
    }

    if (animation === false) {
      var prefix = '';
      for (var i = 0; i < DOM_PREFIXES.length; i++) {
        if (testElement.style[DOM_PREFIXES[i] + 'AnimationName'] !== undefined) {
          prefix = DOM_PREFIXES[i];
          keyFramePrefix = '-' + prefix.toLowerCase() + '-';
          animationStartEvent = START_EVENTS[i];
          animation = true;
          break;
        }
      }
    }
  }

  var stylesCreated = false;
  /* istanbul ignore next */
  var createStyles = function createStyles() {
    if (!stylesCreated && !isServer) {
      var animationKeyframes = '@' + keyFramePrefix + 'keyframes ' + RESIZE_ANIMATION_NAME + ' { from { opacity: 0; } to { opacity: 0; } } ';
      var animationStyle = keyFramePrefix + 'animation: 1ms ' + RESIZE_ANIMATION_NAME + ';';

      // opacity: 0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
      var css = animationKeyframes + '\n      .resize-triggers { ' + animationStyle + ' visibility: hidden; opacity: 0; }\n      .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1 }\n      .resize-triggers > div { background: #eee; overflow: auto; }\n      .contract-trigger:before { width: 200%; height: 200%; }';

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');

      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
      stylesCreated = true;
    }
  };

  /* istanbul ignore next */
  var addResizeListener = exports.addResizeListener = function addResizeListener(element, fn) {
    if (isServer) return;
    if (attachEvent) {
      element.attachEvent('onresize', fn);
    } else {
      if (!element.__resizeTrigger__) {
        if (getComputedStyle(element).position === 'static') {
          element.style.position = 'relative';
        }
        createStyles();
        element.__resizeLast__ = {};
        element.__resizeListeners__ = [];

        var resizeTrigger = element.__resizeTrigger__ = document.createElement('div');
        resizeTrigger.className = 'resize-triggers';
        resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
        element.appendChild(resizeTrigger);

        resetTrigger(element);
        element.addEventListener('scroll', scrollListener, true);

        /* Listen for a css animation to detect element display/re-attach */
        if (animationStartEvent) {
          resizeTrigger.addEventListener(animationStartEvent, function (event) {
            if (event.animationName === RESIZE_ANIMATION_NAME) {
              resetTrigger(element);
            }
          });
        }
      }
      element.__resizeListeners__.push(fn);
    }
  };

  /* istanbul ignore next */
  var removeResizeListener = exports.removeResizeListener = function removeResizeListener(element, fn) {
    if (attachEvent) {
      element.detachEvent('onresize', fn);
    } else {
      element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
      if (!element.__resizeListeners__.length) {
        element.removeEventListener('scroll', scrollListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91dGlscy9yZXNpemUtZXZlbnQuanMiXSwibmFtZXMiOlsiaXNTZXJ2ZXIiLCJ3aW5kb3ciLCJyZXF1ZXN0RnJhbWUiLCJyYWYiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmbiIsInNldFRpbWVvdXQiLCJjYW5jZWxGcmFtZSIsImNhbmNlbCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSIsImNsZWFyVGltZW91dCIsImlkIiwicmVzZXRUcmlnZ2VyIiwiZWxlbWVudCIsInRyaWdnZXIiLCJfX3Jlc2l6ZVRyaWdnZXJfXyIsImV4cGFuZCIsImZpcnN0RWxlbWVudENoaWxkIiwiY29udHJhY3QiLCJsYXN0RWxlbWVudENoaWxkIiwiZXhwYW5kQ2hpbGQiLCJzY3JvbGxMZWZ0Iiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJzdHlsZSIsIndpZHRoIiwib2Zmc2V0V2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjaGVja1RyaWdnZXJzIiwiX19yZXNpemVMYXN0X18iLCJzY3JvbGxMaXN0ZW5lciIsImV2ZW50IiwiX19yZXNpemVSQUZfXyIsIl9fcmVzaXplTGlzdGVuZXJzX18iLCJmb3JFYWNoIiwiY2FsbCIsImF0dGFjaEV2ZW50IiwiZG9jdW1lbnQiLCJET01fUFJFRklYRVMiLCJzcGxpdCIsIlNUQVJUX0VWRU5UUyIsIlJFU0laRV9BTklNQVRJT05fTkFNRSIsImFuaW1hdGlvbiIsImtleUZyYW1lUHJlZml4IiwiYW5pbWF0aW9uU3RhcnRFdmVudCIsInRlc3RFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImFuaW1hdGlvbk5hbWUiLCJ1bmRlZmluZWQiLCJwcmVmaXgiLCJpIiwibGVuZ3RoIiwidG9Mb3dlckNhc2UiLCJzdHlsZXNDcmVhdGVkIiwiY3JlYXRlU3R5bGVzIiwiYW5pbWF0aW9uS2V5ZnJhbWVzIiwiYW5pbWF0aW9uU3R5bGUiLCJjc3MiLCJoZWFkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJ0eXBlIiwic3R5bGVTaGVldCIsImNzc1RleHQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVRleHROb2RlIiwiYWRkUmVzaXplTGlzdGVuZXIiLCJnZXRDb21wdXRlZFN0eWxlIiwicG9zaXRpb24iLCJyZXNpemVUcmlnZ2VyIiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsInB1c2giLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsImRldGFjaEV2ZW50Iiwic3BsaWNlIiwiaW5kZXhPZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsTUFBTUEsV0FBVyxPQUFPQyxNQUFQLEtBQWtCLFdBQW5DOztBQUVBO0FBQ0EsTUFBTUMsZUFBZ0IsWUFBVztBQUMvQixRQUFJRixRQUFKLEVBQWM7QUFDZCxRQUFNRyxNQUFNRixPQUFPRyxxQkFBUCxJQUFnQ0gsT0FBT0ksd0JBQXZDLElBQW1FSixPQUFPSywyQkFBMUUsSUFDVixVQUFTQyxFQUFULEVBQWE7QUFDWCxhQUFPTixPQUFPTyxVQUFQLENBQWtCRCxFQUFsQixFQUFzQixFQUF0QixDQUFQO0FBQ0QsS0FISDtBQUlBLFdBQU8sVUFBU0EsRUFBVCxFQUFhO0FBQ2xCLGFBQU9KLElBQUlJLEVBQUosQ0FBUDtBQUNELEtBRkQ7QUFHRCxHQVRvQixFQUFyQjs7QUFXQTtBQUNBLE1BQU1FLGNBQWUsWUFBVztBQUM5QixRQUFJVCxRQUFKLEVBQWM7QUFDZCxRQUFNVSxTQUFTVCxPQUFPVSxvQkFBUCxJQUErQlYsT0FBT1csdUJBQXRDLElBQWlFWCxPQUFPWSwwQkFBeEUsSUFBc0daLE9BQU9hLFlBQTVIO0FBQ0EsV0FBTyxVQUFTQyxFQUFULEVBQWE7QUFDbEIsYUFBT0wsT0FBT0ssRUFBUCxDQUFQO0FBQ0QsS0FGRDtBQUdELEdBTm1CLEVBQXBCOztBQVFBO0FBQ0EsTUFBTUMsZUFBZSxTQUFmQSxZQUFlLENBQVNDLE9BQVQsRUFBa0I7QUFDckMsUUFBTUMsVUFBVUQsUUFBUUUsaUJBQXhCO0FBQ0EsUUFBTUMsU0FBU0YsUUFBUUcsaUJBQXZCO0FBQ0EsUUFBTUMsV0FBV0osUUFBUUssZ0JBQXpCO0FBQ0EsUUFBTUMsY0FBY0osT0FBT0MsaUJBQTNCOztBQUVBQyxhQUFTRyxVQUFULEdBQXNCSCxTQUFTSSxXQUEvQjtBQUNBSixhQUFTSyxTQUFULEdBQXFCTCxTQUFTTSxZQUE5QjtBQUNBSixnQkFBWUssS0FBWixDQUFrQkMsS0FBbEIsR0FBMEJWLE9BQU9XLFdBQVAsR0FBcUIsQ0FBckIsR0FBeUIsSUFBbkQ7QUFDQVAsZ0JBQVlLLEtBQVosQ0FBa0JHLE1BQWxCLEdBQTJCWixPQUFPYSxZQUFQLEdBQXNCLENBQXRCLEdBQTBCLElBQXJEO0FBQ0FiLFdBQU9LLFVBQVAsR0FBb0JMLE9BQU9NLFdBQTNCO0FBQ0FOLFdBQU9PLFNBQVAsR0FBbUJQLE9BQU9RLFlBQTFCO0FBQ0QsR0FaRDs7QUFjQTtBQUNBLE1BQU1NLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBU2pCLE9BQVQsRUFBa0I7QUFDdEMsV0FBT0EsUUFBUWMsV0FBUixLQUF3QmQsUUFBUWtCLGNBQVIsQ0FBdUJMLEtBQS9DLElBQXdEYixRQUFRZ0IsWUFBUixLQUF5QmhCLFFBQVFrQixjQUFSLENBQXVCSCxNQUEvRztBQUNELEdBRkQ7O0FBSUE7QUFDQSxNQUFNSSxpQkFBaUIsU0FBakJBLGNBQWlCLENBQVNDLEtBQVQsRUFBZ0I7QUFBQTs7QUFDckNyQixpQkFBYSxJQUFiO0FBQ0EsUUFBSSxLQUFLc0IsYUFBVCxFQUF3QjdCLFlBQVksS0FBSzZCLGFBQWpCO0FBQ3hCLFNBQUtBLGFBQUwsR0FBcUJwQyxhQUFhLFlBQU07QUFDdEMsVUFBSWdDLG9CQUFKLEVBQXlCO0FBQ3ZCLGNBQUtDLGNBQUwsQ0FBb0JMLEtBQXBCLEdBQTRCLE1BQUtDLFdBQWpDO0FBQ0EsY0FBS0ksY0FBTCxDQUFvQkgsTUFBcEIsR0FBNkIsTUFBS0MsWUFBbEM7QUFDQSxjQUFLTSxtQkFBTCxDQUF5QkMsT0FBekIsQ0FBaUMsVUFBQ2pDLEVBQUQsRUFBUTtBQUN2Q0EsYUFBR2tDLElBQUgsUUFBY0osS0FBZDtBQUNELFNBRkQ7QUFHRDtBQUNGLEtBUm9CLENBQXJCO0FBU0QsR0FaRDs7QUFjQTtBQUNBLE1BQU1LLGNBQWMxQyxXQUFXLEVBQVgsR0FBZ0IyQyxTQUFTRCxXQUE3QztBQUNBLE1BQU1FLGVBQWUsa0JBQWtCQyxLQUFsQixDQUF3QixHQUF4QixDQUFyQjtBQUNBLE1BQU1DLGVBQWUsdUVBQXVFRCxLQUF2RSxDQUE2RSxHQUE3RSxDQUFyQjtBQUNBLE1BQU1FLHdCQUF3QixZQUE5QjtBQUNBLE1BQUlDLFlBQVksS0FBaEI7QUFDQSxNQUFJQyxpQkFBaUIsRUFBckI7QUFDQSxNQUFJQyxzQkFBc0IsZ0JBQTFCOztBQUVBO0FBQ0EsTUFBSSxDQUFDUixXQUFELElBQWdCLENBQUMxQyxRQUFyQixFQUErQjtBQUM3QixRQUFNbUQsY0FBY1IsU0FBU1MsYUFBVCxDQUF1QixhQUF2QixDQUFwQjtBQUNBLFFBQUlELFlBQVl0QixLQUFaLENBQWtCd0IsYUFBbEIsS0FBb0NDLFNBQXhDLEVBQW1EO0FBQ2pETixrQkFBWSxJQUFaO0FBQ0Q7O0FBRUQsUUFBSUEsY0FBYyxLQUFsQixFQUF5QjtBQUN2QixVQUFJTyxTQUFTLEVBQWI7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSVosYUFBYWEsTUFBakMsRUFBeUNELEdBQXpDLEVBQThDO0FBQzVDLFlBQUlMLFlBQVl0QixLQUFaLENBQWtCZSxhQUFhWSxDQUFiLElBQWtCLGVBQXBDLE1BQXlERixTQUE3RCxFQUF3RTtBQUN0RUMsbUJBQVNYLGFBQWFZLENBQWIsQ0FBVDtBQUNBUCwyQkFBaUIsTUFBTU0sT0FBT0csV0FBUCxFQUFOLEdBQTZCLEdBQTlDO0FBQ0FSLGdDQUFzQkosYUFBYVUsQ0FBYixDQUF0QjtBQUNBUixzQkFBWSxJQUFaO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxNQUFJVyxnQkFBZ0IsS0FBcEI7QUFDQTtBQUNBLE1BQU1DLGVBQWUsU0FBZkEsWUFBZSxHQUFXO0FBQzlCLFFBQUksQ0FBQ0QsYUFBRCxJQUFrQixDQUFDM0QsUUFBdkIsRUFBaUM7QUFDL0IsVUFBTTZELDJCQUF5QlosY0FBekIsa0JBQW9ERixxQkFBcEQsa0RBQU47QUFDQSxVQUFNZSxpQkFBb0JiLGNBQXBCLHVCQUFvREYscUJBQXBELE1BQU47O0FBRUE7QUFDQSxVQUFNZ0IsTUFBU0Ysa0JBQVQsbUNBQ2lCQyxjQURqQixvWEFBTjs7QUFNQSxVQUFNRSxPQUFPckIsU0FBU3FCLElBQVQsSUFBaUJyQixTQUFTc0Isb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsQ0FBOUI7QUFDQSxVQUFNcEMsUUFBUWMsU0FBU1MsYUFBVCxDQUF1QixPQUF2QixDQUFkOztBQUVBdkIsWUFBTXFDLElBQU4sR0FBYSxVQUFiO0FBQ0EsVUFBSXJDLE1BQU1zQyxVQUFWLEVBQXNCO0FBQ3BCdEMsY0FBTXNDLFVBQU4sQ0FBaUJDLE9BQWpCLEdBQTJCTCxHQUEzQjtBQUNELE9BRkQsTUFFTztBQUNMbEMsY0FBTXdDLFdBQU4sQ0FBa0IxQixTQUFTMkIsY0FBVCxDQUF3QlAsR0FBeEIsQ0FBbEI7QUFDRDs7QUFFREMsV0FBS0ssV0FBTCxDQUFpQnhDLEtBQWpCO0FBQ0E4QixzQkFBZ0IsSUFBaEI7QUFDRDtBQUNGLEdBekJEOztBQTJCQTtBQUNPLE1BQU1ZLGdEQUFvQixTQUFwQkEsaUJBQW9CLENBQVN0RCxPQUFULEVBQWtCVixFQUFsQixFQUFzQjtBQUNyRCxRQUFJUCxRQUFKLEVBQWM7QUFDZCxRQUFJMEMsV0FBSixFQUFpQjtBQUNmekIsY0FBUXlCLFdBQVIsQ0FBb0IsVUFBcEIsRUFBZ0NuQyxFQUFoQztBQUNELEtBRkQsTUFFTztBQUNMLFVBQUksQ0FBQ1UsUUFBUUUsaUJBQWIsRUFBZ0M7QUFDOUIsWUFBSXFELGlCQUFpQnZELE9BQWpCLEVBQTBCd0QsUUFBMUIsS0FBdUMsUUFBM0MsRUFBcUQ7QUFDbkR4RCxrQkFBUVksS0FBUixDQUFjNEMsUUFBZCxHQUF5QixVQUF6QjtBQUNEO0FBQ0RiO0FBQ0EzQyxnQkFBUWtCLGNBQVIsR0FBeUIsRUFBekI7QUFDQWxCLGdCQUFRc0IsbUJBQVIsR0FBOEIsRUFBOUI7O0FBRUEsWUFBTW1DLGdCQUFnQnpELFFBQVFFLGlCQUFSLEdBQTRCd0IsU0FBU1MsYUFBVCxDQUF1QixLQUF2QixDQUFsRDtBQUNBc0Isc0JBQWNDLFNBQWQsR0FBMEIsaUJBQTFCO0FBQ0FELHNCQUFjRSxTQUFkLEdBQTBCLG1GQUExQjtBQUNBM0QsZ0JBQVFvRCxXQUFSLENBQW9CSyxhQUFwQjs7QUFFQTFELHFCQUFhQyxPQUFiO0FBQ0FBLGdCQUFRNEQsZ0JBQVIsQ0FBeUIsUUFBekIsRUFBbUN6QyxjQUFuQyxFQUFtRCxJQUFuRDs7QUFFQTtBQUNBLFlBQUljLG1CQUFKLEVBQXlCO0FBQ3ZCd0Isd0JBQWNHLGdCQUFkLENBQStCM0IsbUJBQS9CLEVBQW9ELFVBQVNiLEtBQVQsRUFBZ0I7QUFDbEUsZ0JBQUlBLE1BQU1nQixhQUFOLEtBQXdCTixxQkFBNUIsRUFBbUQ7QUFDakQvQiwyQkFBYUMsT0FBYjtBQUNEO0FBQ0YsV0FKRDtBQUtEO0FBQ0Y7QUFDREEsY0FBUXNCLG1CQUFSLENBQTRCdUMsSUFBNUIsQ0FBaUN2RSxFQUFqQztBQUNEO0FBQ0YsR0FoQ007O0FBa0NQO0FBQ08sTUFBTXdFLHNEQUF1QixTQUF2QkEsb0JBQXVCLENBQVM5RCxPQUFULEVBQWtCVixFQUFsQixFQUFzQjtBQUN4RCxRQUFJbUMsV0FBSixFQUFpQjtBQUNmekIsY0FBUStELFdBQVIsQ0FBb0IsVUFBcEIsRUFBZ0N6RSxFQUFoQztBQUNELEtBRkQsTUFFTztBQUNMVSxjQUFRc0IsbUJBQVIsQ0FBNEIwQyxNQUE1QixDQUFtQ2hFLFFBQVFzQixtQkFBUixDQUE0QjJDLE9BQTVCLENBQW9DM0UsRUFBcEMsQ0FBbkMsRUFBNEUsQ0FBNUU7QUFDQSxVQUFJLENBQUNVLFFBQVFzQixtQkFBUixDQUE0QmtCLE1BQWpDLEVBQXlDO0FBQ3ZDeEMsZ0JBQVFrRSxtQkFBUixDQUE0QixRQUE1QixFQUFzQy9DLGNBQXRDO0FBQ0FuQixnQkFBUUUsaUJBQVIsR0FBNEIsQ0FBQ0YsUUFBUW1FLFdBQVIsQ0FBb0JuRSxRQUFRRSxpQkFBNUIsQ0FBN0I7QUFDRDtBQUNGO0FBQ0YsR0FWTSIsImZpbGUiOiJhcHAvdXRpbHMvcmVzaXplLWV2ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogTW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2RlY2ltYS9qYXZhc2NyaXB0LWRldGVjdC1lbGVtZW50LXJlc2l6ZVxuICogdmVyc2lvbjogMC41LjNcbiAqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgU2ViYXN0acOhbiBEw6ljaW1hXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZlxuICogdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpblxuICogdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xuICogdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2ZcbiAqIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SXG4gKiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVJcbiAqIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuY29uc3QgaXNTZXJ2ZXIgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJztcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmNvbnN0IHJlcXVlc3RGcmFtZSA9IChmdW5jdGlvbigpIHtcbiAgaWYgKGlzU2VydmVyKSByZXR1cm47XG4gIGNvbnN0IHJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChmbiwgMjApO1xuICAgIH07XG4gIHJldHVybiBmdW5jdGlvbihmbikge1xuICAgIHJldHVybiByYWYoZm4pO1xuICB9O1xufSkoKTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmNvbnN0IGNhbmNlbEZyYW1lID0gKGZ1bmN0aW9uKCkge1xuICBpZiAoaXNTZXJ2ZXIpIHJldHVybjtcbiAgY29uc3QgY2FuY2VsID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LmNsZWFyVGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIGNhbmNlbChpZCk7XG4gIH07XG59KSgpO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuY29uc3QgcmVzZXRUcmlnZ2VyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICBjb25zdCB0cmlnZ2VyID0gZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXztcbiAgY29uc3QgZXhwYW5kID0gdHJpZ2dlci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgY29uc3QgY29udHJhY3QgPSB0cmlnZ2VyLmxhc3RFbGVtZW50Q2hpbGQ7XG4gIGNvbnN0IGV4cGFuZENoaWxkID0gZXhwYW5kLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gIGNvbnRyYWN0LnNjcm9sbExlZnQgPSBjb250cmFjdC5zY3JvbGxXaWR0aDtcbiAgY29udHJhY3Quc2Nyb2xsVG9wID0gY29udHJhY3Quc2Nyb2xsSGVpZ2h0O1xuICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9IGV4cGFuZC5vZmZzZXRXaWR0aCArIDEgKyAncHgnO1xuICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSBleHBhbmQub2Zmc2V0SGVpZ2h0ICsgMSArICdweCc7XG4gIGV4cGFuZC5zY3JvbGxMZWZ0ID0gZXhwYW5kLnNjcm9sbFdpZHRoO1xuICBleHBhbmQuc2Nyb2xsVG9wID0gZXhwYW5kLnNjcm9sbEhlaWdodDtcbn07XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5jb25zdCBjaGVja1RyaWdnZXJzID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5vZmZzZXRXaWR0aCAhPT0gZWxlbWVudC5fX3Jlc2l6ZUxhc3RfXy53aWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCAhPT0gZWxlbWVudC5fX3Jlc2l6ZUxhc3RfXy5oZWlnaHQ7XG59O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuY29uc3Qgc2Nyb2xsTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICByZXNldFRyaWdnZXIodGhpcyk7XG4gIGlmICh0aGlzLl9fcmVzaXplUkFGX18pIGNhbmNlbEZyYW1lKHRoaXMuX19yZXNpemVSQUZfXyk7XG4gIHRoaXMuX19yZXNpemVSQUZfXyA9IHJlcXVlc3RGcmFtZSgoKSA9PiB7XG4gICAgaWYgKGNoZWNrVHJpZ2dlcnModGhpcykpIHtcbiAgICAgIHRoaXMuX19yZXNpemVMYXN0X18ud2lkdGggPSB0aGlzLm9mZnNldFdpZHRoO1xuICAgICAgdGhpcy5fX3Jlc2l6ZUxhc3RfXy5oZWlnaHQgPSB0aGlzLm9mZnNldEhlaWdodDtcbiAgICAgIHRoaXMuX19yZXNpemVMaXN0ZW5lcnNfXy5mb3JFYWNoKChmbikgPT4ge1xuICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKiBEZXRlY3QgQ1NTIEFuaW1hdGlvbnMgc3VwcG9ydCB0byBkZXRlY3QgZWxlbWVudCBkaXNwbGF5L3JlLWF0dGFjaCAqL1xuY29uc3QgYXR0YWNoRXZlbnQgPSBpc1NlcnZlciA/IHt9IDogZG9jdW1lbnQuYXR0YWNoRXZlbnQ7XG5jb25zdCBET01fUFJFRklYRVMgPSAnV2Via2l0IE1veiBPIG1zJy5zcGxpdCgnICcpO1xuY29uc3QgU1RBUlRfRVZFTlRTID0gJ3dlYmtpdEFuaW1hdGlvblN0YXJ0IGFuaW1hdGlvbnN0YXJ0IG9BbmltYXRpb25TdGFydCBNU0FuaW1hdGlvblN0YXJ0Jy5zcGxpdCgnICcpO1xuY29uc3QgUkVTSVpFX0FOSU1BVElPTl9OQU1FID0gJ3Jlc2l6ZWFuaW0nO1xubGV0IGFuaW1hdGlvbiA9IGZhbHNlO1xubGV0IGtleUZyYW1lUHJlZml4ID0gJyc7XG5sZXQgYW5pbWF0aW9uU3RhcnRFdmVudCA9ICdhbmltYXRpb25zdGFydCc7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAoIWF0dGFjaEV2ZW50ICYmICFpc1NlcnZlcikge1xuICBjb25zdCB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50Jyk7XG4gIGlmICh0ZXN0RWxlbWVudC5zdHlsZS5hbmltYXRpb25OYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBhbmltYXRpb24gPSB0cnVlO1xuICB9XG5cbiAgaWYgKGFuaW1hdGlvbiA9PT0gZmFsc2UpIHtcbiAgICBsZXQgcHJlZml4ID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBET01fUFJFRklYRVMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0ZXN0RWxlbWVudC5zdHlsZVtET01fUFJFRklYRVNbaV0gKyAnQW5pbWF0aW9uTmFtZSddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJlZml4ID0gRE9NX1BSRUZJWEVTW2ldO1xuICAgICAgICBrZXlGcmFtZVByZWZpeCA9ICctJyArIHByZWZpeC50b0xvd2VyQ2FzZSgpICsgJy0nO1xuICAgICAgICBhbmltYXRpb25TdGFydEV2ZW50ID0gU1RBUlRfRVZFTlRTW2ldO1xuICAgICAgICBhbmltYXRpb24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubGV0IHN0eWxlc0NyZWF0ZWQgPSBmYWxzZTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5jb25zdCBjcmVhdGVTdHlsZXMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCFzdHlsZXNDcmVhdGVkICYmICFpc1NlcnZlcikge1xuICAgIGNvbnN0IGFuaW1hdGlvbktleWZyYW1lcyA9IGBAJHtrZXlGcmFtZVByZWZpeH1rZXlmcmFtZXMgJHtSRVNJWkVfQU5JTUFUSU9OX05BTUV9IHsgZnJvbSB7IG9wYWNpdHk6IDA7IH0gdG8geyBvcGFjaXR5OiAwOyB9IH0gYDtcbiAgICBjb25zdCBhbmltYXRpb25TdHlsZSA9IGAke2tleUZyYW1lUHJlZml4fWFuaW1hdGlvbjogMW1zICR7UkVTSVpFX0FOSU1BVElPTl9OQU1FfTtgO1xuXG4gICAgLy8gb3BhY2l0eTogMCB3b3JrcyBhcm91bmQgYSBjaHJvbWUgYnVnIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yODYzNjBcbiAgICBjb25zdCBjc3MgPSBgJHthbmltYXRpb25LZXlmcmFtZXN9XG4gICAgICAucmVzaXplLXRyaWdnZXJzIHsgJHthbmltYXRpb25TdHlsZX0gdmlzaWJpbGl0eTogaGlkZGVuOyBvcGFjaXR5OiAwOyB9XG4gICAgICAucmVzaXplLXRyaWdnZXJzLCAucmVzaXplLXRyaWdnZXJzID4gZGl2LCAuY29udHJhY3QtdHJpZ2dlcjpiZWZvcmUgeyBjb250ZW50OiBcXFwiIFxcXCI7IGRpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgaGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgei1pbmRleDogLTEgfVxuICAgICAgLnJlc2l6ZS10cmlnZ2VycyA+IGRpdiB7IGJhY2tncm91bmQ6ICNlZWU7IG92ZXJmbG93OiBhdXRvOyB9XG4gICAgICAuY29udHJhY3QtdHJpZ2dlcjpiZWZvcmUgeyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlOyB9YDtcblxuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgfVxuXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgc3R5bGVzQ3JlYXRlZCA9IHRydWU7XG4gIH1cbn07XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgY29uc3QgYWRkUmVzaXplTGlzdGVuZXIgPSBmdW5jdGlvbihlbGVtZW50LCBmbikge1xuICBpZiAoaXNTZXJ2ZXIpIHJldHVybjtcbiAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb25yZXNpemUnLCBmbik7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fKSB7XG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICB9XG4gICAgICBjcmVhdGVTdHlsZXMoKTtcbiAgICAgIGVsZW1lbnQuX19yZXNpemVMYXN0X18gPSB7fTtcbiAgICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdO1xuXG4gICAgICBjb25zdCByZXNpemVUcmlnZ2VyID0gZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcmVzaXplVHJpZ2dlci5jbGFzc05hbWUgPSAncmVzaXplLXRyaWdnZXJzJztcbiAgICAgIHJlc2l6ZVRyaWdnZXIuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJleHBhbmQtdHJpZ2dlclwiPjxkaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImNvbnRyYWN0LXRyaWdnZXJcIj48L2Rpdj4nO1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChyZXNpemVUcmlnZ2VyKTtcblxuICAgICAgcmVzZXRUcmlnZ2VyKGVsZW1lbnQpO1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxMaXN0ZW5lciwgdHJ1ZSk7XG5cbiAgICAgIC8qIExpc3RlbiBmb3IgYSBjc3MgYW5pbWF0aW9uIHRvIGRldGVjdCBlbGVtZW50IGRpc3BsYXkvcmUtYXR0YWNoICovXG4gICAgICBpZiAoYW5pbWF0aW9uU3RhcnRFdmVudCkge1xuICAgICAgICByZXNpemVUcmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uU3RhcnRFdmVudCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBpZiAoZXZlbnQuYW5pbWF0aW9uTmFtZSA9PT0gUkVTSVpFX0FOSU1BVElPTl9OQU1FKSB7XG4gICAgICAgICAgICByZXNldFRyaWdnZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnB1c2goZm4pO1xuICB9XG59O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZVJlc2l6ZUxpc3RlbmVyID0gZnVuY3Rpb24oZWxlbWVudCwgZm4pIHtcbiAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbWVudC5kZXRhY2hFdmVudCgnb25yZXNpemUnLCBmbik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnNwbGljZShlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uaW5kZXhPZihmbiksIDEpO1xuICAgIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmxlbmd0aCkge1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxMaXN0ZW5lcik7XG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gIWVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyk7XG4gICAgfVxuICB9XG59O1xuIl19
