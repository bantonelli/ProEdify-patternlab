define(['module', 'exports'], function (module, exports) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /*!
   * Vue.js v2.3.3
   * (c) 2014-2017 Evan You
   * Released under the MIT License.
   */
  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Vue = factory();
  })(undefined, function () {
    'use strict';

    /*  */

    // these helpers produces better vm code in JS engines due to their
    // explicitness and function inlining

    function isUndef(v) {
      return v === undefined || v === null;
    }

    function isDef(v) {
      return v !== undefined && v !== null;
    }

    function isTrue(v) {
      return v === true;
    }

    function isFalse(v) {
      return v === false;
    }
    /**
     * Check if value is primitive
     */
    function isPrimitive(value) {
      return typeof value === 'string' || typeof value === 'number';
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     */
    function isObject(obj) {
      return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
    }

    var _toString = Object.prototype.toString;

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    function isPlainObject(obj) {
      return _toString.call(obj) === '[object Object]';
    }

    function isRegExp(v) {
      return _toString.call(v) === '[object RegExp]';
    }

    /**
     * Convert a value to a string that is actually rendered.
     */
    function toString(val) {
      return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
    }

    /**
     * Convert a input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber(val) {
      var n = parseFloat(val);
      return isNaN(n) ? val : n;
    }

    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     */
    function makeMap(str, expectsLowerCase) {
      var map = Object.create(null);
      var list = str.split(',');
      for (var i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase ? function (val) {
        return map[val.toLowerCase()];
      } : function (val) {
        return map[val];
      };
    }

    /**
     * Check if a tag is a built-in tag.
     */
    var isBuiltInTag = makeMap('slot,component', true);

    /**
     * Remove an item from an array
     */
    function remove(arr, item) {
      if (arr.length) {
        var index = arr.indexOf(item);
        if (index > -1) {
          return arr.splice(index, 1);
        }
      }
    }

    /**
     * Check whether the object has the property.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
    }

    /**
     * Create a cached version of a pure function.
     */
    function cached(fn) {
      var cache = Object.create(null);
      return function cachedFn(str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    }

    /**
     * Camelize a hyphen-delimited string.
     */
    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
      return str.replace(camelizeRE, function (_, c) {
        return c ? c.toUpperCase() : '';
      });
    });

    /**
     * Capitalize a string.
     */
    var capitalize = cached(function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    /**
     * Hyphenate a camelCase string.
     */
    var hyphenateRE = /([^-])([A-Z])/g;
    var hyphenate = cached(function (str) {
      return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
    });

    /**
     * Simple bind, faster than native
     */
    function bind(fn, ctx) {
      function boundFn(a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
      }
      // record original fn length
      boundFn._length = fn.length;
      return boundFn;
    }

    /**
     * Convert an Array-like object to a real Array.
     */
    function toArray(list, start) {
      start = start || 0;
      var i = list.length - start;
      var ret = new Array(i);
      while (i--) {
        ret[i] = list[i + start];
      }
      return ret;
    }

    /**
     * Mix properties into target object.
     */
    function extend(to, _from) {
      for (var key in _from) {
        to[key] = _from[key];
      }
      return to;
    }

    /**
     * Merge an Array of Objects into a single Object.
     */
    function toObject(arr) {
      var res = {};
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
          extend(res, arr[i]);
        }
      }
      return res;
    }

    /**
     * Perform no operation.
     */
    function noop() {}

    /**
     * Always return false.
     */
    var no = function no() {
      return false;
    };

    /**
     * Return same value
     */
    var identity = function identity(_) {
      return _;
    };

    /**
     * Generate a static keys string from compiler modules.
     */
    function genStaticKeys(modules) {
      return modules.reduce(function (keys, m) {
        return keys.concat(m.staticKeys || []);
      }, []).join(',');
    }

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     */
    function looseEqual(a, b) {
      var isObjectA = isObject(a);
      var isObjectB = isObject(b);
      if (isObjectA && isObjectB) {
        try {
          return JSON.stringify(a) === JSON.stringify(b);
        } catch (e) {
          // possible circular reference
          return a === b;
        }
      } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b);
      } else {
        return false;
      }
    }

    function looseIndexOf(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val)) {
          return i;
        }
      }
      return -1;
    }

    /**
     * Ensure a function is called only once.
     */
    function once(fn) {
      var called = false;
      return function () {
        if (!called) {
          called = true;
          fn.apply(this, arguments);
        }
      };
    }

    var SSR_ATTR = 'data-server-rendered';

    var ASSET_TYPES = ['component', 'directive', 'filter'];

    var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated'];

    /*  */

    var config = {
      /**
       * Option merge strategies (used in core/util/options)
       */
      optionMergeStrategies: Object.create(null),

      /**
       * Whether to suppress warnings.
       */
      silent: false,

      /**
       * Show production mode tip message on boot?
       */
      productionTip: "development" !== 'production',

      /**
       * Whether to enable devtools
       */
      devtools: "development" !== 'production',

      /**
       * Whether to record perf
       */
      performance: false,

      /**
       * Error handler for watcher errors
       */
      errorHandler: null,

      /**
       * Ignore certain custom elements
       */
      ignoredElements: [],

      /**
       * Custom user key aliases for v-on
       */
      keyCodes: Object.create(null),

      /**
       * Check if a tag is reserved so that it cannot be registered as a
       * component. This is platform-dependent and may be overwritten.
       */
      isReservedTag: no,

      /**
       * Check if an attribute is reserved so that it cannot be used as a component
       * prop. This is platform-dependent and may be overwritten.
       */
      isReservedAttr: no,

      /**
       * Check if a tag is an unknown element.
       * Platform-dependent.
       */
      isUnknownElement: no,

      /**
       * Get the namespace of an element
       */
      getTagNamespace: noop,

      /**
       * Parse the real tag name for the specific platform.
       */
      parsePlatformTagName: identity,

      /**
       * Check if an attribute must be bound using property, e.g. value
       * Platform-dependent.
       */
      mustUseProp: no,

      /**
       * Exposed for legacy reasons
       */
      _lifecycleHooks: LIFECYCLE_HOOKS
    };

    /*  */

    var emptyObject = Object.freeze({});

    /**
     * Check if a string starts with $ or _
     */
    function isReserved(str) {
      var c = (str + '').charCodeAt(0);
      return c === 0x24 || c === 0x5F;
    }

    /**
     * Define a property.
     */
    function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
      });
    }

    /**
     * Parse simple path.
     */
    var bailRE = /[^\w.$]/;
    function parsePath(path) {
      if (bailRE.test(path)) {
        return;
      }
      var segments = path.split('.');
      return function (obj) {
        for (var i = 0; i < segments.length; i++) {
          if (!obj) {
            return;
          }
          obj = obj[segments[i]];
        }
        return obj;
      };
    }

    /*  */

    var warn = noop;
    var tip = noop;
    var formatComponentName = null; // work around flow check

    {
      var hasConsole = typeof console !== 'undefined';
      var classifyRE = /(?:^|[-_])(\w)/g;
      var classify = function classify(str) {
        return str.replace(classifyRE, function (c) {
          return c.toUpperCase();
        }).replace(/[-_]/g, '');
      };

      warn = function warn(msg, vm) {
        if (hasConsole && !config.silent) {
          console.error("[Vue warn]: " + msg + (vm ? generateComponentTrace(vm) : ''));
        }
      };

      tip = function tip(msg, vm) {
        if (hasConsole && !config.silent) {
          console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
        }
      };

      formatComponentName = function formatComponentName(vm, includeFile) {
        if (vm.$root === vm) {
          return '<Root>';
        }
        var name = typeof vm === 'string' ? vm : typeof vm === 'function' && vm.options ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;

        var file = vm._isVue && vm.$options.__file;
        if (!name && file) {
          var match = file.match(/([^/\\]+)\.vue$/);
          name = match && match[1];
        }

        return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
      };

      var repeat = function repeat(str, n) {
        var res = '';
        while (n) {
          if (n % 2 === 1) {
            res += str;
          }
          if (n > 1) {
            str += str;
          }
          n >>= 1;
        }
        return res;
      };

      var generateComponentTrace = function generateComponentTrace(vm) {
        if (vm._isVue && vm.$parent) {
          var tree = [];
          var currentRecursiveSequence = 0;
          while (vm) {
            if (tree.length > 0) {
              var last = tree[tree.length - 1];
              if (last.constructor === vm.constructor) {
                currentRecursiveSequence++;
                vm = vm.$parent;
                continue;
              } else if (currentRecursiveSequence > 0) {
                tree[tree.length - 1] = [last, currentRecursiveSequence];
                currentRecursiveSequence = 0;
              }
            }
            tree.push(vm);
            vm = vm.$parent;
          }
          return '\n\nfound in\n\n' + tree.map(function (vm, i) {
            return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
          }).join('\n');
        } else {
          return "\n\n(found in " + formatComponentName(vm) + ")";
        }
      };
    }

    /*  */

    function handleError(err, vm, info) {
      if (config.errorHandler) {
        config.errorHandler.call(null, err, vm, info);
      } else {
        {
          warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
        }
        /* istanbul ignore else */
        if (inBrowser && typeof console !== 'undefined') {
          console.error(err);
        } else {
          throw err;
        }
      }
    }

    /*  */
    /* globals MutationObserver */

    // can we use __proto__?
    var hasProto = '__proto__' in {};

    // Browser environment sniffing
    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    var isEdge = UA && UA.indexOf('edge/') > 0;
    var isAndroid = UA && UA.indexOf('android') > 0;
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

    var supportsPassive = false;
    if (inBrowser) {
      try {
        var opts = {};
        Object.defineProperty(opts, 'passive', {
          get: function get() {
            /* istanbul ignore next */
            supportsPassive = true;
          }
        }); // https://github.com/facebook/flow/issues/285
        window.addEventListener('test-passive', null, opts);
      } catch (e) {}
    }

    // this needs to be lazy-evaled because vue may be required before
    // vue-server-renderer can set VUE_ENV
    var _isServer;
    var isServerRendering = function isServerRendering() {
      if (_isServer === undefined) {
        /* istanbul ignore if */
        if (!inBrowser && typeof global !== 'undefined') {
          // detect presence of vue-server-renderer and avoid
          // Webpack shimming the process
          _isServer = global['process'].env.VUE_ENV === 'server';
        } else {
          _isServer = false;
        }
      }
      return _isServer;
    };

    // detect devtools
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    /* istanbul ignore next */
    function isNative(Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
    }

    var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

    /**
     * Defer a task to execute it asynchronously.
     */
    var nextTick = function () {
      var callbacks = [];
      var pending = false;
      var timerFunc;

      function nextTickHandler() {
        pending = false;
        var copies = callbacks.slice(0);
        callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
          copies[i]();
        }
      }

      // the nextTick behavior leverages the microtask queue, which can be accessed
      // via either native Promise.then or MutationObserver.
      // MutationObserver has wider support, however it is seriously bugged in
      // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
      // completely stops working after triggering a few times... so, if native
      // Promise is available, we will use it:
      /* istanbul ignore if */
      if (typeof Promise !== 'undefined' && isNative(Promise)) {
        var p = Promise.resolve();
        var logError = function logError(err) {
          console.error(err);
        };
        timerFunc = function timerFunc() {
          p.then(nextTickHandler).catch(logError);
          // in problematic UIWebViews, Promise.then doesn't completely break, but
          // it can get stuck in a weird state where callbacks are pushed into the
          // microtask queue but the queue isn't being flushed, until the browser
          // needs to do some other work, e.g. handle a timer. Therefore we can
          // "force" the microtask queue to be flushed by adding an empty timer.
          if (isIOS) {
            setTimeout(noop);
          }
        };
      } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) ||
      // PhantomJS and iOS 7.x
      MutationObserver.toString() === '[object MutationObserverConstructor]')) {
        // use MutationObserver where native Promise is not available,
        // e.g. PhantomJS IE11, iOS7, Android 4.4
        var counter = 1;
        var observer = new MutationObserver(nextTickHandler);
        var textNode = document.createTextNode(String(counter));
        observer.observe(textNode, {
          characterData: true
        });
        timerFunc = function timerFunc() {
          counter = (counter + 1) % 2;
          textNode.data = String(counter);
        };
      } else {
        // fallback to setTimeout
        /* istanbul ignore next */
        timerFunc = function timerFunc() {
          setTimeout(nextTickHandler, 0);
        };
      }

      return function queueNextTick(cb, ctx) {
        var _resolve;
        callbacks.push(function () {
          if (cb) {
            try {
              cb.call(ctx);
            } catch (e) {
              handleError(e, ctx, 'nextTick');
            }
          } else if (_resolve) {
            _resolve(ctx);
          }
        });
        if (!pending) {
          pending = true;
          timerFunc();
        }
        if (!cb && typeof Promise !== 'undefined') {
          return new Promise(function (resolve, reject) {
            _resolve = resolve;
          });
        }
      };
    }();

    var _Set;
    /* istanbul ignore if */
    if (typeof Set !== 'undefined' && isNative(Set)) {
      // use native Set when available.
      _Set = Set;
    } else {
      // a non-standard Set polyfill that only works with primitive keys.
      _Set = function () {
        function Set() {
          this.set = Object.create(null);
        }
        Set.prototype.has = function has(key) {
          return this.set[key] === true;
        };
        Set.prototype.add = function add(key) {
          this.set[key] = true;
        };
        Set.prototype.clear = function clear() {
          this.set = Object.create(null);
        };

        return Set;
      }();
    }

    /*  */

    var uid = 0;

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     */
    var Dep = function Dep() {
      this.id = uid++;
      this.subs = [];
    };

    Dep.prototype.addSub = function addSub(sub) {
      this.subs.push(sub);
    };

    Dep.prototype.removeSub = function removeSub(sub) {
      remove(this.subs, sub);
    };

    Dep.prototype.depend = function depend() {
      if (Dep.target) {
        Dep.target.addDep(this);
      }
    };

    Dep.prototype.notify = function notify() {
      // stabilize the subscriber list first
      var subs = this.subs.slice();
      for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    };

    // the current target watcher being evaluated.
    // this is globally unique because there could be only one
    // watcher being evaluated at any time.
    Dep.target = null;
    var targetStack = [];

    function pushTarget(_target) {
      if (Dep.target) {
        targetStack.push(Dep.target);
      }
      Dep.target = _target;
    }

    function popTarget() {
      Dep.target = targetStack.pop();
    }

    /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     */

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
      // cache original method
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator() {
        var arguments$1 = arguments;

        // avoid leaking arguments:
        // http://jsperf.com/closure-with-arguments
        var i = arguments.length;
        var args = new Array(i);
        while (i--) {
          args[i] = arguments$1[i];
        }
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
          case 'push':
            inserted = args;
            break;
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.slice(2);
            break;
        }
        if (inserted) {
          ob.observeArray(inserted);
        }
        // notify change
        ob.dep.notify();
        return result;
      });
    });

    /*  */

    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

    /**
     * By default, when a reactive property is set, the new value is
     * also converted to become reactive. However when passing down props,
     * we don't want to force conversion because the value may be a nested value
     * under a frozen data structure. Converting it would defeat the optimization.
     */
    var observerState = {
      shouldConvert: true,
      isSettingProps: false
    };

    /**
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     */
    var Observer = function Observer(value) {
      this.value = value;
      this.dep = new Dep();
      this.vmCount = 0;
      def(value, '__ob__', this);
      if (Array.isArray(value)) {
        var augment = hasProto ? protoAugment : copyAugment;
        augment(value, arrayMethods, arrayKeys);
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    };

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    Observer.prototype.walk = function walk(obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        defineReactive$$1(obj, keys[i], obj[keys[i]]);
      }
    };

    /**
     * Observe a list of Array items.
     */
    Observer.prototype.observeArray = function observeArray(items) {
      for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
      }
    };

    // helpers

    /**
     * Augment an target Object or Array by intercepting
     * the prototype chain using __proto__
     */
    function protoAugment(target, src) {
      /* eslint-disable no-proto */
      target.__proto__ = src;
      /* eslint-enable no-proto */
    }

    /**
     * Augment an target Object or Array by defining
     * hidden properties.
     */
    /* istanbul ignore next */
    function copyAugment(target, src, keys) {
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        def(target, key, src[key]);
      }
    }

    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     */
    function observe(value, asRootData) {
      if (!isObject(value)) {
        return;
      }
      var ob;
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
      } else if (observerState.shouldConvert && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
        ob = new Observer(value);
      }
      if (asRootData && ob) {
        ob.vmCount++;
      }
      return ob;
    }

    /**
     * Define a reactive property on an Object.
     */
    function defineReactive$$1(obj, key, val, customSetter) {
      var dep = new Dep();

      var property = Object.getOwnPropertyDescriptor(obj, key);
      if (property && property.configurable === false) {
        return;
      }

      // cater for pre-defined getter/setters
      var getter = property && property.get;
      var setter = property && property.set;

      var childOb = observe(val);
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
          var value = getter ? getter.call(obj) : val;
          if (Dep.target) {
            dep.depend();
            if (childOb) {
              childOb.dep.depend();
            }
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
          return value;
        },
        set: function reactiveSetter(newVal) {
          var value = getter ? getter.call(obj) : val;
          /* eslint-disable no-self-compare */
          if (newVal === value || newVal !== newVal && value !== value) {
            return;
          }
          /* eslint-enable no-self-compare */
          if ("development" !== 'production' && customSetter) {
            customSetter();
          }
          if (setter) {
            setter.call(obj, newVal);
          } else {
            val = newVal;
          }
          childOb = observe(newVal);
          dep.notify();
        }
      });
    }

    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     */
    function set(target, key, val) {
      if (Array.isArray(target) && typeof key === 'number') {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
      }
      if (hasOwn(target, key)) {
        target[key] = val;
        return val;
      }
      var ob = target.__ob__;
      if (target._isVue || ob && ob.vmCount) {
        "development" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
        return val;
      }
      if (!ob) {
        target[key] = val;
        return val;
      }
      defineReactive$$1(ob.value, key, val);
      ob.dep.notify();
      return val;
    }

    /**
     * Delete a property and trigger change if necessary.
     */
    function del(target, key) {
      if (Array.isArray(target) && typeof key === 'number') {
        target.splice(key, 1);
        return;
      }
      var ob = target.__ob__;
      if (target._isVue || ob && ob.vmCount) {
        "development" !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
        return;
      }
      if (!hasOwn(target, key)) {
        return;
      }
      delete target[key];
      if (!ob) {
        return;
      }
      ob.dep.notify();
    }

    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     */
    function dependArray(value) {
      for (var e = void 0, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
          dependArray(e);
        }
      }
    }

    /*  */

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     */
    var strats = config.optionMergeStrategies;

    /**
     * Options with restrictions
     */
    {
      strats.el = strats.propsData = function (parent, child, vm, key) {
        if (!vm) {
          warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
        }
        return defaultStrat(parent, child);
      };
    }

    /**
     * Helper that recursively merges two data objects together.
     */
    function mergeData(to, from) {
      if (!from) {
        return to;
      }
      var key, toVal, fromVal;
      var keys = Object.keys(from);
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
          set(to, key, fromVal);
        } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
          mergeData(toVal, fromVal);
        }
      }
      return to;
    }

    /**
     * Data
     */
    strats.data = function (parentVal, childVal, vm) {
      if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
          return parentVal;
        }
        if (typeof childVal !== 'function') {
          "development" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
          return parentVal;
        }
        if (!parentVal) {
          return childVal;
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
          return mergeData(childVal.call(this), parentVal.call(this));
        };
      } else if (parentVal || childVal) {
        return function mergedInstanceDataFn() {
          // instance merge
          var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
          var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
          if (instanceData) {
            return mergeData(instanceData, defaultData);
          } else {
            return defaultData;
          }
        };
      }
    };

    /**
     * Hooks and props are merged as arrays.
     */
    function mergeHook(parentVal, childVal) {
      return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
    }

    LIFECYCLE_HOOKS.forEach(function (hook) {
      strats[hook] = mergeHook;
    });

    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     */
    function mergeAssets(parentVal, childVal) {
      var res = Object.create(parentVal || null);
      return childVal ? extend(res, childVal) : res;
    }

    ASSET_TYPES.forEach(function (type) {
      strats[type + 's'] = mergeAssets;
    });

    /**
     * Watchers.
     *
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     */
    strats.watch = function (parentVal, childVal) {
      /* istanbul ignore if */
      if (!childVal) {
        return Object.create(parentVal || null);
      }
      if (!parentVal) {
        return childVal;
      }
      var ret = {};
      extend(ret, parentVal);
      for (var key in childVal) {
        var parent = ret[key];
        var child = childVal[key];
        if (parent && !Array.isArray(parent)) {
          parent = [parent];
        }
        ret[key] = parent ? parent.concat(child) : [child];
      }
      return ret;
    };

    /**
     * Other object hashes.
     */
    strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
      if (!childVal) {
        return Object.create(parentVal || null);
      }
      if (!parentVal) {
        return childVal;
      }
      var ret = Object.create(null);
      extend(ret, parentVal);
      extend(ret, childVal);
      return ret;
    };

    /**
     * Default strategy.
     */
    var defaultStrat = function defaultStrat(parentVal, childVal) {
      return childVal === undefined ? parentVal : childVal;
    };

    /**
     * Validate component names
     */
    function checkComponents(options) {
      for (var key in options.components) {
        var lower = key.toLowerCase();
        if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
          warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
        }
      }
    }

    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     */
    function normalizeProps(options) {
      var props = options.props;
      if (!props) {
        return;
      }
      var res = {};
      var i, val, name;
      if (Array.isArray(props)) {
        i = props.length;
        while (i--) {
          val = props[i];
          if (typeof val === 'string') {
            name = camelize(val);
            res[name] = { type: null };
          } else {
            warn('props must be strings when using array syntax.');
          }
        }
      } else if (isPlainObject(props)) {
        for (var key in props) {
          val = props[key];
          name = camelize(key);
          res[name] = isPlainObject(val) ? val : { type: val };
        }
      }
      options.props = res;
    }

    /**
     * Normalize raw function directives into object format.
     */
    function normalizeDirectives(options) {
      var dirs = options.directives;
      if (dirs) {
        for (var key in dirs) {
          var def = dirs[key];
          if (typeof def === 'function') {
            dirs[key] = { bind: def, update: def };
          }
        }
      }
    }

    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     */
    function mergeOptions(parent, child, vm) {
      {
        checkComponents(child);
      }

      if (typeof child === 'function') {
        child = child.options;
      }

      normalizeProps(child);
      normalizeDirectives(child);
      var extendsFrom = child.extends;
      if (extendsFrom) {
        parent = mergeOptions(parent, extendsFrom, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
      var options = {};
      var key;
      for (key in parent) {
        mergeField(key);
      }
      for (key in child) {
        if (!hasOwn(parent, key)) {
          mergeField(key);
        }
      }
      function mergeField(key) {
        var strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
      }
      return options;
    }

    /**
     * Resolve an asset.
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     */
    function resolveAsset(options, type, id, warnMissing) {
      /* istanbul ignore if */
      if (typeof id !== 'string') {
        return;
      }
      var assets = options[type];
      // check local registration variations first
      if (hasOwn(assets, id)) {
        return assets[id];
      }
      var camelizedId = camelize(id);
      if (hasOwn(assets, camelizedId)) {
        return assets[camelizedId];
      }
      var PascalCaseId = capitalize(camelizedId);
      if (hasOwn(assets, PascalCaseId)) {
        return assets[PascalCaseId];
      }
      // fallback to prototype chain
      var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
      if ("development" !== 'production' && warnMissing && !res) {
        warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
      }
      return res;
    }

    /*  */

    function validateProp(key, propOptions, propsData, vm) {
      var prop = propOptions[key];
      var absent = !hasOwn(propsData, key);
      var value = propsData[key];
      // handle boolean props
      if (isType(Boolean, prop.type)) {
        if (absent && !hasOwn(prop, 'default')) {
          value = false;
        } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
          value = true;
        }
      }
      // check default value
      if (value === undefined) {
        value = getPropDefaultValue(vm, prop, key);
        // since the default value is a fresh copy,
        // make sure to observe it.
        var prevShouldConvert = observerState.shouldConvert;
        observerState.shouldConvert = true;
        observe(value);
        observerState.shouldConvert = prevShouldConvert;
      }
      {
        assertProp(prop, key, value, vm, absent);
      }
      return value;
    }

    /**
     * Get the default value of a prop.
     */
    function getPropDefaultValue(vm, prop, key) {
      // no default, return undefined
      if (!hasOwn(prop, 'default')) {
        return undefined;
      }
      var def = prop.default;
      // warn against non-factory defaults for Object & Array
      if ("development" !== 'production' && isObject(def)) {
        warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
      }
      // the raw prop value was also undefined from previous render,
      // return previous default value to avoid unnecessary watcher trigger
      if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
        return vm._props[key];
      }
      // call factory function for non-Function types
      // a value is Function if its prototype is function even across different execution context
      return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
    }

    /**
     * Assert whether a prop is valid.
     */
    function assertProp(prop, name, value, vm, absent) {
      if (prop.required && absent) {
        warn('Missing required prop: "' + name + '"', vm);
        return;
      }
      if (value == null && !prop.required) {
        return;
      }
      var type = prop.type;
      var valid = !type || type === true;
      var expectedTypes = [];
      if (type) {
        if (!Array.isArray(type)) {
          type = [type];
        }
        for (var i = 0; i < type.length && !valid; i++) {
          var assertedType = assertType(value, type[i]);
          expectedTypes.push(assertedType.expectedType || '');
          valid = assertedType.valid;
        }
      }
      if (!valid) {
        warn('Invalid prop: type check failed for prop "' + name + '".' + ' Expected ' + expectedTypes.map(capitalize).join(', ') + ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.', vm);
        return;
      }
      var validator = prop.validator;
      if (validator) {
        if (!validator(value)) {
          warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
        }
      }
    }

    var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

    function assertType(value, type) {
      var valid;
      var expectedType = getType(type);
      if (simpleCheckRE.test(expectedType)) {
        valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === expectedType.toLowerCase();
      } else if (expectedType === 'Object') {
        valid = isPlainObject(value);
      } else if (expectedType === 'Array') {
        valid = Array.isArray(value);
      } else {
        valid = value instanceof type;
      }
      return {
        valid: valid,
        expectedType: expectedType
      };
    }

    /**
     * Use function string name to check built-in types,
     * because a simple equality check will fail when running
     * across different vms / iframes.
     */
    function getType(fn) {
      var match = fn && fn.toString().match(/^\s*function (\w+)/);
      return match ? match[1] : '';
    }

    function isType(type, fn) {
      if (!Array.isArray(fn)) {
        return getType(fn) === getType(type);
      }
      for (var i = 0, len = fn.length; i < len; i++) {
        if (getType(fn[i]) === getType(type)) {
          return true;
        }
      }
      /* istanbul ignore next */
      return false;
    }

    /*  */

    var mark;
    var measure;

    {
      var perf = inBrowser && window.performance;
      /* istanbul ignore if */
      if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
        mark = function mark(tag) {
          return perf.mark(tag);
        };
        measure = function measure(name, startTag, endTag) {
          perf.measure(name, startTag, endTag);
          perf.clearMarks(startTag);
          perf.clearMarks(endTag);
          perf.clearMeasures(name);
        };
      }
    }

    /* not type checking this file because flow doesn't play well with Proxy */

    var initProxy;

    {
      var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
      );

      var warnNonPresent = function warnNonPresent(target, key) {
        warn("Property or method \"" + key + "\" is not defined on the instance but " + "referenced during render. Make sure to declare reactive data " + "properties in the data option.", target);
      };

      var hasProxy = typeof Proxy !== 'undefined' && Proxy.toString().match(/native code/);

      if (hasProxy) {
        var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
        config.keyCodes = new Proxy(config.keyCodes, {
          set: function set(target, key, value) {
            if (isBuiltInModifier(key)) {
              warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
              return false;
            } else {
              target[key] = value;
              return true;
            }
          }
        });
      }

      var hasHandler = {
        has: function has(target, key) {
          var has = key in target;
          var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
          if (!has && !isAllowed) {
            warnNonPresent(target, key);
          }
          return has || !isAllowed;
        }
      };

      var getHandler = {
        get: function get(target, key) {
          if (typeof key === 'string' && !(key in target)) {
            warnNonPresent(target, key);
          }
          return target[key];
        }
      };

      initProxy = function initProxy(vm) {
        if (hasProxy) {
          // determine which proxy handler to use
          var options = vm.$options;
          var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
          vm._renderProxy = new Proxy(vm, handlers);
        } else {
          vm._renderProxy = vm;
        }
      };
    }

    /*  */

    var VNode = function VNode(tag, data, children, text, elm, context, componentOptions) {
      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.functionalContext = undefined;
      this.key = data && data.key;
      this.componentOptions = componentOptions;
      this.componentInstance = undefined;
      this.parent = undefined;
      this.raw = false;
      this.isStatic = false;
      this.isRootInsert = true;
      this.isComment = false;
      this.isCloned = false;
      this.isOnce = false;
    };

    var prototypeAccessors = { child: {} };

    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    prototypeAccessors.child.get = function () {
      return this.componentInstance;
    };

    Object.defineProperties(VNode.prototype, prototypeAccessors);

    var createEmptyVNode = function createEmptyVNode() {
      var node = new VNode();
      node.text = '';
      node.isComment = true;
      return node;
    };

    function createTextVNode(val) {
      return new VNode(undefined, undefined, undefined, String(val));
    }

    // optimized shallow clone
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    function cloneVNode(vnode) {
      var cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions);
      cloned.ns = vnode.ns;
      cloned.isStatic = vnode.isStatic;
      cloned.key = vnode.key;
      cloned.isComment = vnode.isComment;
      cloned.isCloned = true;
      return cloned;
    }

    function cloneVNodes(vnodes) {
      var len = vnodes.length;
      var res = new Array(len);
      for (var i = 0; i < len; i++) {
        res[i] = cloneVNode(vnodes[i]);
      }
      return res;
    }

    /*  */

    var normalizeEvent = cached(function (name) {
      var passive = name.charAt(0) === '&';
      name = passive ? name.slice(1) : name;
      var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
      name = once$$1 ? name.slice(1) : name;
      var capture = name.charAt(0) === '!';
      name = capture ? name.slice(1) : name;
      return {
        name: name,
        once: once$$1,
        capture: capture,
        passive: passive
      };
    });

    function createFnInvoker(fns) {
      function invoker() {
        var arguments$1 = arguments;

        var fns = invoker.fns;
        if (Array.isArray(fns)) {
          for (var i = 0; i < fns.length; i++) {
            fns[i].apply(null, arguments$1);
          }
        } else {
          // return handler return value for single handlers
          return fns.apply(null, arguments);
        }
      }
      invoker.fns = fns;
      return invoker;
    }

    function updateListeners(on, oldOn, add, remove$$1, vm) {
      var name, cur, old, event;
      for (name in on) {
        cur = on[name];
        old = oldOn[name];
        event = normalizeEvent(name);
        if (isUndef(cur)) {
          "development" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
        } else if (isUndef(old)) {
          if (isUndef(cur.fns)) {
            cur = on[name] = createFnInvoker(cur);
          }
          add(event.name, cur, event.once, event.capture, event.passive);
        } else if (cur !== old) {
          old.fns = cur;
          on[name] = old;
        }
      }
      for (name in oldOn) {
        if (isUndef(on[name])) {
          event = normalizeEvent(name);
          remove$$1(event.name, oldOn[name], event.capture);
        }
      }
    }

    /*  */

    function mergeVNodeHook(def, hookKey, hook) {
      var invoker;
      var oldHook = def[hookKey];

      function wrappedHook() {
        hook.apply(this, arguments);
        // important: remove merged hook to ensure it's called only once
        // and prevent memory leak
        remove(invoker.fns, wrappedHook);
      }

      if (isUndef(oldHook)) {
        // no existing hook
        invoker = createFnInvoker([wrappedHook]);
      } else {
        /* istanbul ignore if */
        if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
          // already a merged invoker
          invoker = oldHook;
          invoker.fns.push(wrappedHook);
        } else {
          // existing plain hook
          invoker = createFnInvoker([oldHook, wrappedHook]);
        }
      }

      invoker.merged = true;
      def[hookKey] = invoker;
    }

    /*  */

    function extractPropsFromVNodeData(data, Ctor, tag) {
      // we are only extracting raw values here.
      // validation and default values are handled in the child
      // component itself.
      var propOptions = Ctor.options.props;
      if (isUndef(propOptions)) {
        return;
      }
      var res = {};
      var attrs = data.attrs;
      var props = data.props;
      if (isDef(attrs) || isDef(props)) {
        for (var key in propOptions) {
          var altKey = hyphenate(key);
          {
            var keyInLowerCase = key.toLowerCase();
            if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
              tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
            }
          }
          checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
        }
      }
      return res;
    }

    function checkProp(res, hash, key, altKey, preserve) {
      if (isDef(hash)) {
        if (hasOwn(hash, key)) {
          res[key] = hash[key];
          if (!preserve) {
            delete hash[key];
          }
          return true;
        } else if (hasOwn(hash, altKey)) {
          res[key] = hash[altKey];
          if (!preserve) {
            delete hash[altKey];
          }
          return true;
        }
      }
      return false;
    }

    /*  */

    // The template compiler attempts to minimize the need for normalization by
    // statically analyzing the template at compile time.
    //
    // For plain HTML markup, normalization can be completely skipped because the
    // generated render function is guaranteed to return Array<VNode>. There are
    // two cases where extra normalization is needed:

    // 1. When the children contains components - because a functional component
    // may return an Array instead of a single root. In this case, just a simple
    // normalization is needed - if any child is an Array, we flatten the whole
    // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
    // because functional components already normalize their own children.
    function simpleNormalizeChildren(children) {
      for (var i = 0; i < children.length; i++) {
        if (Array.isArray(children[i])) {
          return Array.prototype.concat.apply([], children);
        }
      }
      return children;
    }

    // 2. When the children contains constructs that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    function normalizeChildren(children) {
      return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
    }

    function isTextNode(node) {
      return isDef(node) && isDef(node.text) && isFalse(node.isComment);
    }

    function normalizeArrayChildren(children, nestedIndex) {
      var res = [];
      var i, c, last;
      for (i = 0; i < children.length; i++) {
        c = children[i];
        if (isUndef(c) || typeof c === 'boolean') {
          continue;
        }
        last = res[res.length - 1];
        //  nested
        if (Array.isArray(c)) {
          res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || '') + "_" + i));
        } else if (isPrimitive(c)) {
          if (isTextNode(last)) {
            // merge adjacent text nodes
            // this is necessary for SSR hydration because text nodes are
            // essentially merged when rendered to HTML strings
            last.text += String(c);
          } else if (c !== '') {
            // convert primitive to vnode
            res.push(createTextVNode(c));
          }
        } else {
          if (isTextNode(c) && isTextNode(last)) {
            // merge adjacent text nodes
            res[res.length - 1] = createTextVNode(last.text + c.text);
          } else {
            // default key for nested array children (likely generated by v-for)
            if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
              c.key = "__vlist" + nestedIndex + "_" + i + "__";
            }
            res.push(c);
          }
        }
      }
      return res;
    }

    /*  */

    function ensureCtor(comp, base) {
      return isObject(comp) ? base.extend(comp) : comp;
    }

    function resolveAsyncComponent(factory, baseCtor, context) {
      if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp;
      }

      if (isDef(factory.resolved)) {
        return factory.resolved;
      }

      if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp;
      }

      if (isDef(factory.contexts)) {
        // already pending
        factory.contexts.push(context);
      } else {
        var contexts = factory.contexts = [context];
        var sync = true;

        var forceRender = function forceRender() {
          for (var i = 0, l = contexts.length; i < l; i++) {
            contexts[i].$forceUpdate();
          }
        };

        var resolve = once(function (res) {
          // cache resolved
          factory.resolved = ensureCtor(res, baseCtor);
          // invoke callbacks only if this is not a synchronous resolve
          // (async resolves are shimmed as synchronous during SSR)
          if (!sync) {
            forceRender();
          }
        });

        var reject = once(function (reason) {
          "development" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
          if (isDef(factory.errorComp)) {
            factory.error = true;
            forceRender();
          }
        });

        var res = factory(resolve, reject);

        if (isObject(res)) {
          if (typeof res.then === 'function') {
            // () => Promise
            if (isUndef(factory.resolved)) {
              res.then(resolve, reject);
            }
          } else if (isDef(res.component) && typeof res.component.then === 'function') {
            res.component.then(resolve, reject);

            if (isDef(res.error)) {
              factory.errorComp = ensureCtor(res.error, baseCtor);
            }

            if (isDef(res.loading)) {
              factory.loadingComp = ensureCtor(res.loading, baseCtor);
              if (res.delay === 0) {
                factory.loading = true;
              } else {
                setTimeout(function () {
                  if (isUndef(factory.resolved) && isUndef(factory.error)) {
                    factory.loading = true;
                    forceRender();
                  }
                }, res.delay || 200);
              }
            }

            if (isDef(res.timeout)) {
              setTimeout(function () {
                if (isUndef(factory.resolved)) {
                  reject("timeout (" + res.timeout + "ms)");
                }
              }, res.timeout);
            }
          }
        }

        sync = false;
        // return in case resolved synchronously
        return factory.loading ? factory.loadingComp : factory.resolved;
      }
    }

    /*  */

    function getFirstComponentChild(children) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          var c = children[i];
          if (isDef(c) && isDef(c.componentOptions)) {
            return c;
          }
        }
      }
    }

    /*  */

    /*  */

    function initEvents(vm) {
      vm._events = Object.create(null);
      vm._hasHookEvent = false;
      // init parent attached events
      var listeners = vm.$options._parentListeners;
      if (listeners) {
        updateComponentListeners(vm, listeners);
      }
    }

    var target;

    function add(event, fn, once$$1) {
      if (once$$1) {
        target.$once(event, fn);
      } else {
        target.$on(event, fn);
      }
    }

    function remove$1(event, fn) {
      target.$off(event, fn);
    }

    function updateComponentListeners(vm, listeners, oldListeners) {
      target = vm;
      updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
    }

    function eventsMixin(Vue) {
      var hookRE = /^hook:/;
      Vue.prototype.$on = function (event, fn) {
        var this$1 = this;

        var vm = this;
        if (Array.isArray(event)) {
          for (var i = 0, l = event.length; i < l; i++) {
            this$1.$on(event[i], fn);
          }
        } else {
          (vm._events[event] || (vm._events[event] = [])).push(fn);
          // optimize hook:event cost by using a boolean flag marked at registration
          // instead of a hash lookup
          if (hookRE.test(event)) {
            vm._hasHookEvent = true;
          }
        }
        return vm;
      };

      Vue.prototype.$once = function (event, fn) {
        var vm = this;
        function on() {
          vm.$off(event, on);
          fn.apply(vm, arguments);
        }
        on.fn = fn;
        vm.$on(event, on);
        return vm;
      };

      Vue.prototype.$off = function (event, fn) {
        var this$1 = this;

        var vm = this;
        // all
        if (!arguments.length) {
          vm._events = Object.create(null);
          return vm;
        }
        // array of events
        if (Array.isArray(event)) {
          for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
            this$1.$off(event[i$1], fn);
          }
          return vm;
        }
        // specific event
        var cbs = vm._events[event];
        if (!cbs) {
          return vm;
        }
        if (arguments.length === 1) {
          vm._events[event] = null;
          return vm;
        }
        // specific handler
        var cb;
        var i = cbs.length;
        while (i--) {
          cb = cbs[i];
          if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1);
            break;
          }
        }
        return vm;
      };

      Vue.prototype.$emit = function (event) {
        var vm = this;
        {
          var lowerCaseEvent = event.toLowerCase();
          if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
            tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
          }
        }
        var cbs = vm._events[event];
        if (cbs) {
          cbs = cbs.length > 1 ? toArray(cbs) : cbs;
          var args = toArray(arguments, 1);
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i].apply(vm, args);
          }
        }
        return vm;
      };
    }

    /*  */

    /**
     * Runtime helper for resolving raw children VNodes into a slot object.
     */
    function resolveSlots(children, context) {
      var slots = {};
      if (!children) {
        return slots;
      }
      var defaultSlot = [];
      for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];
        // named slots should only be respected if the vnode was rendered in the
        // same context.
        if ((child.context === context || child.functionalContext === context) && child.data && child.data.slot != null) {
          var name = child.data.slot;
          var slot = slots[name] || (slots[name] = []);
          if (child.tag === 'template') {
            slot.push.apply(slot, child.children);
          } else {
            slot.push(child);
          }
        } else {
          defaultSlot.push(child);
        }
      }
      // ignore whitespace
      if (!defaultSlot.every(isWhitespace)) {
        slots.default = defaultSlot;
      }
      return slots;
    }

    function isWhitespace(node) {
      return node.isComment || node.text === ' ';
    }

    function resolveScopedSlots(fns, // see flow/vnode
    res) {
      res = res || {};
      for (var i = 0; i < fns.length; i++) {
        if (Array.isArray(fns[i])) {
          resolveScopedSlots(fns[i], res);
        } else {
          res[fns[i].key] = fns[i].fn;
        }
      }
      return res;
    }

    /*  */

    var activeInstance = null;

    function initLifecycle(vm) {
      var options = vm.$options;

      // locate first non-abstract parent
      var parent = options.parent;
      if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
          parent = parent.$parent;
        }
        parent.$children.push(vm);
      }

      vm.$parent = parent;
      vm.$root = parent ? parent.$root : vm;

      vm.$children = [];
      vm.$refs = {};

      vm._watcher = null;
      vm._inactive = null;
      vm._directInactive = false;
      vm._isMounted = false;
      vm._isDestroyed = false;
      vm._isBeingDestroyed = false;
    }

    function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode, hydrating) {
        var vm = this;
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate');
        }
        var prevEl = vm.$el;
        var prevVnode = vm._vnode;
        var prevActiveInstance = activeInstance;
        activeInstance = vm;
        vm._vnode = vnode;
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        if (!prevVnode) {
          // initial render
          vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */
          , vm.$options._parentElm, vm.$options._refElm);
        } else {
          // updates
          vm.$el = vm.__patch__(prevVnode, vnode);
        }
        activeInstance = prevActiveInstance;
        // update __vue__ reference
        if (prevEl) {
          prevEl.__vue__ = null;
        }
        if (vm.$el) {
          vm.$el.__vue__ = vm;
        }
        // if parent is an HOC, update its $el as well
        if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
          vm.$parent.$el = vm.$el;
        }
        // updated hook is called by the scheduler to ensure that children are
        // updated in a parent's updated hook.
      };

      Vue.prototype.$forceUpdate = function () {
        var vm = this;
        if (vm._watcher) {
          vm._watcher.update();
        }
      };

      Vue.prototype.$destroy = function () {
        var vm = this;
        if (vm._isBeingDestroyed) {
          return;
        }
        callHook(vm, 'beforeDestroy');
        vm._isBeingDestroyed = true;
        // remove self from parent
        var parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
          remove(parent.$children, vm);
        }
        // teardown watchers
        if (vm._watcher) {
          vm._watcher.teardown();
        }
        var i = vm._watchers.length;
        while (i--) {
          vm._watchers[i].teardown();
        }
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
          vm._data.__ob__.vmCount--;
        }
        // call the last hook...
        vm._isDestroyed = true;
        // invoke destroy hooks on current rendered tree
        vm.__patch__(vm._vnode, null);
        // fire destroyed hook
        callHook(vm, 'destroyed');
        // turn off all instance listeners.
        vm.$off();
        // remove __vue__ reference
        if (vm.$el) {
          vm.$el.__vue__ = null;
        }
        // remove reference to DOM nodes (prevents leak)
        vm.$options._parentElm = vm.$options._refElm = null;
      };
    }

    function mountComponent(vm, el, hydrating) {
      vm.$el = el;
      if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode;
        {
          /* istanbul ignore if */
          if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
            warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
          } else {
            warn('Failed to mount component: template or render function not defined.', vm);
          }
        }
      }
      callHook(vm, 'beforeMount');

      var updateComponent;
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        updateComponent = function updateComponent() {
          var name = vm._name;
          var id = vm._uid;
          var startTag = "vue-perf-start:" + id;
          var endTag = "vue-perf-end:" + id;

          mark(startTag);
          var vnode = vm._render();
          mark(endTag);
          measure(name + " render", startTag, endTag);

          mark(startTag);
          vm._update(vnode, hydrating);
          mark(endTag);
          measure(name + " patch", startTag, endTag);
        };
      } else {
        updateComponent = function updateComponent() {
          vm._update(vm._render(), hydrating);
        };
      }

      vm._watcher = new Watcher(vm, updateComponent, noop);
      hydrating = false;

      // manually mounted instance, call mounted on self
      // mounted is called for render-created child components in its inserted hook
      if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook(vm, 'mounted');
      }
      return vm;
    }

    function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
      // determine whether component has slot children
      // we need to do this before overwriting $options._renderChildren
      var hasChildren = !!(renderChildren || // has new static slots
      vm.$options._renderChildren || // has old static slots
      parentVnode.data.scopedSlots || // has new scoped slots
      vm.$scopedSlots !== emptyObject // has old scoped slots
      );

      vm.$options._parentVnode = parentVnode;
      vm.$vnode = parentVnode; // update vm's placeholder node without re-render
      if (vm._vnode) {
        // update child tree's parent
        vm._vnode.parent = parentVnode;
      }
      vm.$options._renderChildren = renderChildren;

      // update props
      if (propsData && vm.$options.props) {
        observerState.shouldConvert = false;
        {
          observerState.isSettingProps = true;
        }
        var props = vm._props;
        var propKeys = vm.$options._propKeys || [];
        for (var i = 0; i < propKeys.length; i++) {
          var key = propKeys[i];
          props[key] = validateProp(key, vm.$options.props, propsData, vm);
        }
        observerState.shouldConvert = true;
        {
          observerState.isSettingProps = false;
        }
        // keep a copy of raw propsData
        vm.$options.propsData = propsData;
      }
      // update listeners
      if (listeners) {
        var oldListeners = vm.$options._parentListeners;
        vm.$options._parentListeners = listeners;
        updateComponentListeners(vm, listeners, oldListeners);
      }
      // resolve slots + force update if has children
      if (hasChildren) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context);
        vm.$forceUpdate();
      }
    }

    function isInInactiveTree(vm) {
      while (vm && (vm = vm.$parent)) {
        if (vm._inactive) {
          return true;
        }
      }
      return false;
    }

    function activateChildComponent(vm, direct) {
      if (direct) {
        vm._directInactive = false;
        if (isInInactiveTree(vm)) {
          return;
        }
      } else if (vm._directInactive) {
        return;
      }
      if (vm._inactive || vm._inactive === null) {
        vm._inactive = false;
        for (var i = 0; i < vm.$children.length; i++) {
          activateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'activated');
      }
    }

    function deactivateChildComponent(vm, direct) {
      if (direct) {
        vm._directInactive = true;
        if (isInInactiveTree(vm)) {
          return;
        }
      }
      if (!vm._inactive) {
        vm._inactive = true;
        for (var i = 0; i < vm.$children.length; i++) {
          deactivateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'deactivated');
      }
    }

    function callHook(vm, hook) {
      var handlers = vm.$options[hook];
      if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
          try {
            handlers[i].call(vm);
          } catch (e) {
            handleError(e, vm, hook + " hook");
          }
        }
      }
      if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
      }
    }

    /*  */

    var MAX_UPDATE_COUNT = 100;

    var queue = [];
    var activatedChildren = [];
    var has = {};
    var circular = {};
    var waiting = false;
    var flushing = false;
    var index = 0;

    /**
     * Reset the scheduler's state.
     */
    function resetSchedulerState() {
      index = queue.length = activatedChildren.length = 0;
      has = {};
      {
        circular = {};
      }
      waiting = flushing = false;
    }

    /**
     * Flush both queues and run the watchers.
     */
    function flushSchedulerQueue() {
      flushing = true;
      var watcher, id;

      // Sort queue before flush.
      // This ensures that:
      // 1. Components are updated from parent to child. (because parent is always
      //    created before the child)
      // 2. A component's user watchers are run before its render watcher (because
      //    user watchers are created before the render watcher)
      // 3. If a component is destroyed during a parent component's watcher run,
      //    its watchers can be skipped.
      queue.sort(function (a, b) {
        return a.id - b.id;
      });

      // do not cache length because more watchers might be pushed
      // as we run existing watchers
      for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run();
        // in dev build, check and stop circular updates.
        if ("development" !== 'production' && has[id] != null) {
          circular[id] = (circular[id] || 0) + 1;
          if (circular[id] > MAX_UPDATE_COUNT) {
            warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
            break;
          }
        }
      }

      // keep copies of post queues before resetting state
      var activatedQueue = activatedChildren.slice();
      var updatedQueue = queue.slice();

      resetSchedulerState();

      // call component updated and activated hooks
      callActivatedHooks(activatedQueue);
      callUpdateHooks(updatedQueue);

      // devtool hook
      /* istanbul ignore if */
      if (devtools && config.devtools) {
        devtools.emit('flush');
      }
    }

    function callUpdateHooks(queue) {
      var i = queue.length;
      while (i--) {
        var watcher = queue[i];
        var vm = watcher.vm;
        if (vm._watcher === watcher && vm._isMounted) {
          callHook(vm, 'updated');
        }
      }
    }

    /**
     * Queue a kept-alive component that was activated during patch.
     * The queue will be processed after the entire tree has been patched.
     */
    function queueActivatedComponent(vm) {
      // setting _inactive to false here so that a render function can
      // rely on checking whether it's in an inactive tree (e.g. router-view)
      vm._inactive = false;
      activatedChildren.push(vm);
    }

    function callActivatedHooks(queue) {
      for (var i = 0; i < queue.length; i++) {
        queue[i]._inactive = true;
        activateChildComponent(queue[i], true /* true */);
      }
    }

    /**
     * Push a watcher into the watcher queue.
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     */
    function queueWatcher(watcher) {
      var id = watcher.id;
      if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
          queue.push(watcher);
        } else {
          // if already flushing, splice the watcher based on its id
          // if already past its id, it will be run next immediately.
          var i = queue.length - 1;
          while (i > index && queue[i].id > watcher.id) {
            i--;
          }
          queue.splice(i + 1, 0, watcher);
        }
        // queue the flush
        if (!waiting) {
          waiting = true;
          nextTick(flushSchedulerQueue);
        }
      }
    }

    /*  */

    var uid$2 = 0;

    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     */
    var Watcher = function Watcher(vm, expOrFn, cb, options) {
      this.vm = vm;
      vm._watchers.push(this);
      // options
      if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
        this.lazy = !!options.lazy;
        this.sync = !!options.sync;
      } else {
        this.deep = this.user = this.lazy = this.sync = false;
      }
      this.cb = cb;
      this.id = ++uid$2; // uid for batching
      this.active = true;
      this.dirty = this.lazy; // for lazy watchers
      this.deps = [];
      this.newDeps = [];
      this.depIds = new _Set();
      this.newDepIds = new _Set();
      this.expression = expOrFn.toString();
      // parse expression for getter
      if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
        if (!this.getter) {
          this.getter = function () {};
          "development" !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
        }
      }
      this.value = this.lazy ? undefined : this.get();
    };

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    Watcher.prototype.get = function get() {
      pushTarget(this);
      var value;
      var vm = this.vm;
      if (this.user) {
        try {
          value = this.getter.call(vm, vm);
        } catch (e) {
          handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
        }
      } else {
        value = this.getter.call(vm, vm);
      }
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
      return value;
    };

    /**
     * Add a dependency to this directive.
     */
    Watcher.prototype.addDep = function addDep(dep) {
      var id = dep.id;
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    };

    /**
     * Clean up for dependency collection.
     */
    Watcher.prototype.cleanupDeps = function cleanupDeps() {
      var this$1 = this;

      var i = this.deps.length;
      while (i--) {
        var dep = this$1.deps[i];
        if (!this$1.newDepIds.has(dep.id)) {
          dep.removeSub(this$1);
        }
      }
      var tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    };

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    Watcher.prototype.update = function update() {
      /* istanbul ignore else */
      if (this.lazy) {
        this.dirty = true;
      } else if (this.sync) {
        this.run();
      } else {
        queueWatcher(this);
      }
    };

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    Watcher.prototype.run = function run() {
      if (this.active) {
        var value = this.get();
        if (value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) || this.deep) {
          // set new value
          var oldValue = this.value;
          this.value = value;
          if (this.user) {
            try {
              this.cb.call(this.vm, value, oldValue);
            } catch (e) {
              handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
            }
          } else {
            this.cb.call(this.vm, value, oldValue);
          }
        }
      }
    };

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    Watcher.prototype.evaluate = function evaluate() {
      this.value = this.get();
      this.dirty = false;
    };

    /**
     * Depend on all deps collected by this watcher.
     */
    Watcher.prototype.depend = function depend() {
      var this$1 = this;

      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].depend();
      }
    };

    /**
     * Remove self from all dependencies' subscriber list.
     */
    Watcher.prototype.teardown = function teardown() {
      var this$1 = this;

      if (this.active) {
        // remove self from vm's watcher list
        // this is a somewhat expensive operation so we skip it
        // if the vm is being destroyed.
        if (!this.vm._isBeingDestroyed) {
          remove(this.vm._watchers, this);
        }
        var i = this.deps.length;
        while (i--) {
          this$1.deps[i].removeSub(this$1);
        }
        this.active = false;
      }
    };

    /**
     * Recursively traverse an object to evoke all converted
     * getters, so that every nested property inside the object
     * is collected as a "deep" dependency.
     */
    var seenObjects = new _Set();
    function traverse(val) {
      seenObjects.clear();
      _traverse(val, seenObjects);
    }

    function _traverse(val, seen) {
      var i, keys;
      var isA = Array.isArray(val);
      if (!isA && !isObject(val) || !Object.isExtensible(val)) {
        return;
      }
      if (val.__ob__) {
        var depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
          return;
        }
        seen.add(depId);
      }
      if (isA) {
        i = val.length;
        while (i--) {
          _traverse(val[i], seen);
        }
      } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) {
          _traverse(val[keys[i]], seen);
        }
      }
    }

    /*  */

    var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noop,
      set: noop
    };

    function proxy(target, sourceKey, key) {
      sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
      };
      sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
      };
      Object.defineProperty(target, key, sharedPropertyDefinition);
    }

    function initState(vm) {
      vm._watchers = [];
      var opts = vm.$options;
      if (opts.props) {
        initProps(vm, opts.props);
      }
      if (opts.methods) {
        initMethods(vm, opts.methods);
      }
      if (opts.data) {
        initData(vm);
      } else {
        observe(vm._data = {}, true /* asRootData */);
      }
      if (opts.computed) {
        initComputed(vm, opts.computed);
      }
      if (opts.watch) {
        initWatch(vm, opts.watch);
      }
    }

    var isReservedProp = {
      key: 1,
      ref: 1,
      slot: 1
    };

    function initProps(vm, propsOptions) {
      var propsData = vm.$options.propsData || {};
      var props = vm._props = {};
      // cache prop keys so that future props updates can iterate using Array
      // instead of dynamic object key enumeration.
      var keys = vm.$options._propKeys = [];
      var isRoot = !vm.$parent;
      // root instance props should be converted
      observerState.shouldConvert = isRoot;
      var loop = function loop(key) {
        keys.push(key);
        var value = validateProp(key, propsOptions, propsData, vm);
        /* istanbul ignore else */
        {
          if (isReservedProp[key] || config.isReservedAttr(key)) {
            warn("\"" + key + "\" is a reserved attribute and cannot be used as component prop.", vm);
          }
          defineReactive$$1(props, key, value, function () {
            if (vm.$parent && !observerState.isSettingProps) {
              warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
            }
          });
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
          proxy(vm, "_props", key);
        }
      };

      for (var key in propsOptions) {
        loop(key);
      }observerState.shouldConvert = true;
    }

    function initData(vm) {
      var data = vm.$options.data;
      data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
      if (!isPlainObject(data)) {
        data = {};
        "development" !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
      }
      // proxy data on instance
      var keys = Object.keys(data);
      var props = vm.$options.props;
      var i = keys.length;
      while (i--) {
        if (props && hasOwn(props, keys[i])) {
          "development" !== 'production' && warn("The data property \"" + keys[i] + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
        } else if (!isReserved(keys[i])) {
          proxy(vm, "_data", keys[i]);
        }
      }
      // observe data
      observe(data, true /* asRootData */);
    }

    function getData(data, vm) {
      try {
        return data.call(vm);
      } catch (e) {
        handleError(e, vm, "data()");
        return {};
      }
    }

    var computedWatcherOptions = { lazy: true };

    function initComputed(vm, computed) {
      var watchers = vm._computedWatchers = Object.create(null);

      for (var key in computed) {
        var userDef = computed[key];
        var getter = typeof userDef === 'function' ? userDef : userDef.get;
        {
          if (getter === undefined) {
            warn("No getter function has been defined for computed property \"" + key + "\".", vm);
            getter = noop;
          }
        }
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
          defineComputed(vm, key, userDef);
        } else {
          if (key in vm.$data) {
            warn("The computed property \"" + key + "\" is already defined in data.", vm);
          } else if (vm.$options.props && key in vm.$options.props) {
            warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
          }
        }
      }
    }

    function defineComputed(target, key, userDef) {
      if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key);
        sharedPropertyDefinition.set = noop;
      } else {
        sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
        sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
      }
      Object.defineProperty(target, key, sharedPropertyDefinition);
    }

    function createComputedGetter(key) {
      return function computedGetter() {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
          if (watcher.dirty) {
            watcher.evaluate();
          }
          if (Dep.target) {
            watcher.depend();
          }
          return watcher.value;
        }
      };
    }

    function initMethods(vm, methods) {
      var props = vm.$options.props;
      for (var key in methods) {
        vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
        {
          if (methods[key] == null) {
            warn("method \"" + key + "\" has an undefined value in the component definition. " + "Did you reference the function correctly?", vm);
          }
          if (props && hasOwn(props, key)) {
            warn("method \"" + key + "\" has already been defined as a prop.", vm);
          }
        }
      }
    }

    function initWatch(vm, watch) {
      for (var key in watch) {
        var handler = watch[key];
        if (Array.isArray(handler)) {
          for (var i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i]);
          }
        } else {
          createWatcher(vm, key, handler);
        }
      }
    }

    function createWatcher(vm, key, handler) {
      var options;
      if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
      }
      if (typeof handler === 'string') {
        handler = vm[handler];
      }
      vm.$watch(key, handler, options);
    }

    function stateMixin(Vue) {
      // flow somehow has problems with directly declared definition object
      // when using Object.defineProperty, so we have to procedurally build up
      // the object here.
      var dataDef = {};
      dataDef.get = function () {
        return this._data;
      };
      var propsDef = {};
      propsDef.get = function () {
        return this._props;
      };
      {
        dataDef.set = function (newData) {
          warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
        };
        propsDef.set = function () {
          warn("$props is readonly.", this);
        };
      }
      Object.defineProperty(Vue.prototype, '$data', dataDef);
      Object.defineProperty(Vue.prototype, '$props', propsDef);

      Vue.prototype.$set = set;
      Vue.prototype.$delete = del;

      Vue.prototype.$watch = function (expOrFn, cb, options) {
        var vm = this;
        options = options || {};
        options.user = true;
        var watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
          cb.call(vm, watcher.value);
        }
        return function unwatchFn() {
          watcher.teardown();
        };
      };
    }

    /*  */

    function initProvide(vm) {
      var provide = vm.$options.provide;
      if (provide) {
        vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
      }
    }

    function initInjections(vm) {
      var result = resolveInject(vm.$options.inject, vm);
      if (result) {
        Object.keys(result).forEach(function (key) {
          /* istanbul ignore else */
          {
            defineReactive$$1(vm, key, result[key], function () {
              warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
            });
          }
        });
      }
    }

    function resolveInject(inject, vm) {
      if (inject) {
        // inject is :any because flow is not smart enough to figure out cached
        // isArray here
        var isArray = Array.isArray(inject);
        var result = Object.create(null);
        var keys = isArray ? inject : hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var provideKey = isArray ? key : inject[key];
          var source = vm;
          while (source) {
            if (source._provided && provideKey in source._provided) {
              result[key] = source._provided[provideKey];
              break;
            }
            source = source.$parent;
          }
        }
        return result;
      }
    }

    /*  */

    function createFunctionalComponent(Ctor, propsData, data, context, children) {
      var props = {};
      var propOptions = Ctor.options.props;
      if (isDef(propOptions)) {
        for (var key in propOptions) {
          props[key] = validateProp(key, propOptions, propsData || {});
        }
      } else {
        if (isDef(data.attrs)) {
          mergeProps(props, data.attrs);
        }
        if (isDef(data.props)) {
          mergeProps(props, data.props);
        }
      }
      // ensure the createElement function in functional components
      // gets a unique context - this is necessary for correct named slot check
      var _context = Object.create(context);
      var h = function h(a, b, c, d) {
        return createElement(_context, a, b, c, d, true);
      };
      var vnode = Ctor.options.render.call(null, h, {
        data: data,
        props: props,
        children: children,
        parent: context,
        listeners: data.on || {},
        injections: resolveInject(Ctor.options.inject, context),
        slots: function slots() {
          return resolveSlots(children, context);
        }
      });
      if (vnode instanceof VNode) {
        vnode.functionalContext = context;
        vnode.functionalOptions = Ctor.options;
        if (data.slot) {
          (vnode.data || (vnode.data = {})).slot = data.slot;
        }
      }
      return vnode;
    }

    function mergeProps(to, from) {
      for (var key in from) {
        to[camelize(key)] = from[key];
      }
    }

    /*  */

    // hooks to be invoked on component VNodes during patch
    var componentVNodeHooks = {
      init: function init(vnode, hydrating, parentElm, refElm) {
        if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
          var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance, parentElm, refElm);
          child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        } else if (vnode.data.keepAlive) {
          // kept-alive components, treat as a patch
          var mountedNode = vnode; // work around flow
          componentVNodeHooks.prepatch(mountedNode, mountedNode);
        }
      },

      prepatch: function prepatch(oldVnode, vnode) {
        var options = vnode.componentOptions;
        var child = vnode.componentInstance = oldVnode.componentInstance;
        updateChildComponent(child, options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
        );
      },

      insert: function insert(vnode) {
        var context = vnode.context;
        var componentInstance = vnode.componentInstance;
        if (!componentInstance._isMounted) {
          componentInstance._isMounted = true;
          callHook(componentInstance, 'mounted');
        }
        if (vnode.data.keepAlive) {
          if (context._isMounted) {
            // vue-router#1212
            // During updates, a kept-alive component's child components may
            // change, so directly walking the tree here may call activated hooks
            // on incorrect children. Instead we push them into a queue which will
            // be processed after the whole patch process ended.
            queueActivatedComponent(componentInstance);
          } else {
            activateChildComponent(componentInstance, true /* direct */);
          }
        }
      },

      destroy: function destroy(vnode) {
        var componentInstance = vnode.componentInstance;
        if (!componentInstance._isDestroyed) {
          if (!vnode.data.keepAlive) {
            componentInstance.$destroy();
          } else {
            deactivateChildComponent(componentInstance, true /* direct */);
          }
        }
      }
    };

    var hooksToMerge = Object.keys(componentVNodeHooks);

    function createComponent(Ctor, data, context, children, tag) {
      if (isUndef(Ctor)) {
        return;
      }

      var baseCtor = context.$options._base;

      // plain options object: turn it into a constructor
      if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
      }

      // if at this stage it's not a constructor or an async component factory,
      // reject.
      if (typeof Ctor !== 'function') {
        {
          warn("Invalid Component definition: " + String(Ctor), context);
        }
        return;
      }

      // async component
      if (isUndef(Ctor.cid)) {
        Ctor = resolveAsyncComponent(Ctor, baseCtor, context);
        if (Ctor === undefined) {
          // return nothing if this is indeed an async component
          // wait for the callback to trigger parent update.
          return;
        }
      }

      // resolve constructor options in case global mixins are applied after
      // component constructor creation
      resolveConstructorOptions(Ctor);

      data = data || {};

      // transform component v-model data into props & events
      if (isDef(data.model)) {
        transformModel(Ctor.options, data);
      }

      // extract props
      var propsData = extractPropsFromVNodeData(data, Ctor, tag);

      // functional component
      if (isTrue(Ctor.options.functional)) {
        return createFunctionalComponent(Ctor, propsData, data, context, children);
      }

      // extract listeners, since these needs to be treated as
      // child component listeners instead of DOM listeners
      var listeners = data.on;
      // replace with listeners with .native modifier
      data.on = data.nativeOn;

      if (isTrue(Ctor.options.abstract)) {
        // abstract components do not keep anything
        // other than props & listeners
        data = {};
      }

      // merge component management hooks onto the placeholder node
      mergeHooks(data);

      // return a placeholder vnode
      var name = Ctor.options.name || tag;
      var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children });
      return vnode;
    }

    function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
    parent, // activeInstance in lifecycle state
    parentElm, refElm) {
      var vnodeComponentOptions = vnode.componentOptions;
      var options = {
        _isComponent: true,
        parent: parent,
        propsData: vnodeComponentOptions.propsData,
        _componentTag: vnodeComponentOptions.tag,
        _parentVnode: vnode,
        _parentListeners: vnodeComponentOptions.listeners,
        _renderChildren: vnodeComponentOptions.children,
        _parentElm: parentElm || null,
        _refElm: refElm || null
      };
      // check inline-template render functions
      var inlineTemplate = vnode.data.inlineTemplate;
      if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render;
        options.staticRenderFns = inlineTemplate.staticRenderFns;
      }
      return new vnodeComponentOptions.Ctor(options);
    }

    function mergeHooks(data) {
      if (!data.hook) {
        data.hook = {};
      }
      for (var i = 0; i < hooksToMerge.length; i++) {
        var key = hooksToMerge[i];
        var fromParent = data.hook[key];
        var ours = componentVNodeHooks[key];
        data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
      }
    }

    function mergeHook$1(one, two) {
      return function (a, b, c, d) {
        one(a, b, c, d);
        two(a, b, c, d);
      };
    }

    // transform component v-model info (value and callback) into
    // prop and event handler respectively.
    function transformModel(options, data) {
      var prop = options.model && options.model.prop || 'value';
      var event = options.model && options.model.event || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
      var on = data.on || (data.on = {});
      if (isDef(on[event])) {
        on[event] = [data.model.callback].concat(on[event]);
      } else {
        on[event] = data.model.callback;
      }
    }

    /*  */

    var SIMPLE_NORMALIZE = 1;
    var ALWAYS_NORMALIZE = 2;

    // wrapper function for providing a more flexible interface
    // without getting yelled at by flow
    function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
      if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children;
        children = data;
        data = undefined;
      }
      if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE;
      }
      return _createElement(context, tag, data, children, normalizationType);
    }

    function _createElement(context, tag, data, children, normalizationType) {
      if (isDef(data) && isDef(data.__ob__)) {
        "development" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
        return createEmptyVNode();
      }
      if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode();
      }
      // support single function children as default scoped slot
      if (Array.isArray(children) && typeof children[0] === 'function') {
        data = data || {};
        data.scopedSlots = { default: children[0] };
        children.length = 0;
      }
      if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children);
      } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children);
      }
      var vnode, ns;
      if (typeof tag === 'string') {
        var Ctor;
        ns = config.getTagNamespace(tag);
        if (config.isReservedTag(tag)) {
          // platform built-in elements
          vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
        } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
          // component
          vnode = createComponent(Ctor, data, context, children, tag);
        } else {
          // unknown or unlisted namespaced elements
          // check at runtime because it may get assigned a namespace when its
          // parent normalizes children
          vnode = new VNode(tag, data, children, undefined, undefined, context);
        }
      } else {
        // direct component options / constructor
        vnode = createComponent(tag, data, context, children);
      }
      if (isDef(vnode)) {
        if (ns) {
          applyNS(vnode, ns);
        }
        return vnode;
      } else {
        return createEmptyVNode();
      }
    }

    function applyNS(vnode, ns) {
      vnode.ns = ns;
      if (vnode.tag === 'foreignObject') {
        // use default namespace inside foreignObject
        return;
      }
      if (isDef(vnode.children)) {
        for (var i = 0, l = vnode.children.length; i < l; i++) {
          var child = vnode.children[i];
          if (isDef(child.tag) && isUndef(child.ns)) {
            applyNS(child, ns);
          }
        }
      }
    }

    /*  */

    /**
     * Runtime helper for rendering v-for lists.
     */
    function renderList(val, render) {
      var ret, i, l, keys, key;
      if (Array.isArray(val) || typeof val === 'string') {
        ret = new Array(val.length);
        for (i = 0, l = val.length; i < l; i++) {
          ret[i] = render(val[i], i);
        }
      } else if (typeof val === 'number') {
        ret = new Array(val);
        for (i = 0; i < val; i++) {
          ret[i] = render(i + 1, i);
        }
      } else if (isObject(val)) {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
      if (isDef(ret)) {
        ret._isVList = true;
      }
      return ret;
    }

    /*  */

    /**
     * Runtime helper for rendering <slot>
     */
    function renderSlot(name, fallback, props, bindObject) {
      var scopedSlotFn = this.$scopedSlots[name];
      if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
          extend(props, bindObject);
        }
        return scopedSlotFn(props) || fallback;
      } else {
        var slotNodes = this.$slots[name];
        // warn duplicate slot usage
        if (slotNodes && "development" !== 'production') {
          slotNodes._rendered && warn("Duplicate presence of slot \"" + name + "\" found in the same render tree " + "- this will likely cause render errors.", this);
          slotNodes._rendered = true;
        }
        return slotNodes || fallback;
      }
    }

    /*  */

    /**
     * Runtime helper for resolving filters
     */
    function resolveFilter(id) {
      return resolveAsset(this.$options, 'filters', id, true) || identity;
    }

    /*  */

    /**
     * Runtime helper for checking keyCodes from config.
     */
    function checkKeyCodes(eventKeyCode, key, builtInAlias) {
      var keyCodes = config.keyCodes[key] || builtInAlias;
      if (Array.isArray(keyCodes)) {
        return keyCodes.indexOf(eventKeyCode) === -1;
      } else {
        return keyCodes !== eventKeyCode;
      }
    }

    /*  */

    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     */
    function bindObjectProps(data, tag, value, asProp) {
      if (value) {
        if (!isObject(value)) {
          "development" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
        } else {
          if (Array.isArray(value)) {
            value = toObject(value);
          }
          var hash;
          for (var key in value) {
            if (key === 'class' || key === 'style') {
              hash = data;
            } else {
              var type = data.attrs && data.attrs.type;
              hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
            }
            if (!(key in hash)) {
              hash[key] = value[key];
            }
          }
        }
      }
      return data;
    }

    /*  */

    /**
     * Runtime helper for rendering static trees.
     */
    function renderStatic(index, isInFor) {
      var tree = this._staticTrees[index];
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree by doing a shallow clone.
      if (tree && !isInFor) {
        return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree);
      }
      // otherwise, render a fresh tree.
      tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
      markStatic(tree, "__static__" + index, false);
      return tree;
    }

    /**
     * Runtime helper for v-once.
     * Effectively it means marking the node as static with a unique key.
     */
    function markOnce(tree, index, key) {
      markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
      return tree;
    }

    function markStatic(tree, key, isOnce) {
      if (Array.isArray(tree)) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i] && typeof tree[i] !== 'string') {
            markStaticNode(tree[i], key + "_" + i, isOnce);
          }
        }
      } else {
        markStaticNode(tree, key, isOnce);
      }
    }

    function markStaticNode(node, key, isOnce) {
      node.isStatic = true;
      node.key = key;
      node.isOnce = isOnce;
    }

    /*  */

    function initRender(vm) {
      vm._vnode = null; // the root of the child tree
      vm._staticTrees = null;
      var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
      var renderContext = parentVnode && parentVnode.context;
      vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
      vm.$scopedSlots = emptyObject;
      // bind the createElement fn to this instance
      // so that we get proper render context inside it.
      // args order: tag, data, children, normalizationType, alwaysNormalize
      // internal version is used by render functions compiled from templates
      vm._c = function (a, b, c, d) {
        return createElement(vm, a, b, c, d, false);
      };
      // normalization is always applied for the public version, used in
      // user-written render functions.
      vm.$createElement = function (a, b, c, d) {
        return createElement(vm, a, b, c, d, true);
      };
    }

    function renderMixin(Vue) {
      Vue.prototype.$nextTick = function (fn) {
        return nextTick(fn, this);
      };

      Vue.prototype._render = function () {
        var vm = this;
        var ref = vm.$options;
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        var _parentVnode = ref._parentVnode;

        if (vm._isMounted) {
          // clone slot nodes on re-renders
          for (var key in vm.$slots) {
            vm.$slots[key] = cloneVNodes(vm.$slots[key]);
          }
        }

        vm.$scopedSlots = _parentVnode && _parentVnode.data.scopedSlots || emptyObject;

        if (staticRenderFns && !vm._staticTrees) {
          vm._staticTrees = [];
        }
        // set parent vnode. this allows render functions to have access
        // to the data on the placeholder node.
        vm.$vnode = _parentVnode;
        // render self
        var vnode;
        try {
          vnode = render.call(vm._renderProxy, vm.$createElement);
        } catch (e) {
          handleError(e, vm, "render function");
          // return error render result,
          // or previous vnode to prevent render error causing blank component
          /* istanbul ignore else */
          {
            vnode = vm.$options.renderError ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e) : vm._vnode;
          }
        }
        // return empty vnode in case the render function errored out
        if (!(vnode instanceof VNode)) {
          if ("development" !== 'production' && Array.isArray(vnode)) {
            warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
          }
          vnode = createEmptyVNode();
        }
        // set parent
        vnode.parent = _parentVnode;
        return vnode;
      };

      // internal render helpers.
      // these are exposed on the instance prototype to reduce generated render
      // code size.
      Vue.prototype._o = markOnce;
      Vue.prototype._n = toNumber;
      Vue.prototype._s = toString;
      Vue.prototype._l = renderList;
      Vue.prototype._t = renderSlot;
      Vue.prototype._q = looseEqual;
      Vue.prototype._i = looseIndexOf;
      Vue.prototype._m = renderStatic;
      Vue.prototype._f = resolveFilter;
      Vue.prototype._k = checkKeyCodes;
      Vue.prototype._b = bindObjectProps;
      Vue.prototype._v = createTextVNode;
      Vue.prototype._e = createEmptyVNode;
      Vue.prototype._u = resolveScopedSlots;
    }

    /*  */

    var uid$1 = 0;

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        // a uid
        vm._uid = uid$1++;

        var startTag, endTag;
        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
          startTag = "vue-perf-init:" + vm._uid;
          endTag = "vue-perf-end:" + vm._uid;
          mark(startTag);
        }

        // a flag to avoid this being observed
        vm._isVue = true;
        // merge options
        if (options && options._isComponent) {
          // optimize internal component instantiation
          // since dynamic options merging is pretty slow, and none of the
          // internal component options needs special treatment.
          initInternalComponent(vm, options);
        } else {
          vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
        }
        /* istanbul ignore else */
        {
          initProxy(vm);
        }
        // expose real self
        vm._self = vm;
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);
        callHook(vm, 'beforeCreate');
        initInjections(vm); // resolve injections before data/props
        initState(vm);
        initProvide(vm); // resolve provide after data/props
        callHook(vm, 'created');

        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
          vm._name = formatComponentName(vm, false);
          mark(endTag);
          measure(vm._name + " init", startTag, endTag);
        }

        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
    }

    function initInternalComponent(vm, options) {
      var opts = vm.$options = Object.create(vm.constructor.options);
      // doing this because it's faster than dynamic enumeration.
      opts.parent = options.parent;
      opts.propsData = options.propsData;
      opts._parentVnode = options._parentVnode;
      opts._parentListeners = options._parentListeners;
      opts._renderChildren = options._renderChildren;
      opts._componentTag = options._componentTag;
      opts._parentElm = options._parentElm;
      opts._refElm = options._refElm;
      if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
      }
    }

    function resolveConstructorOptions(Ctor) {
      var options = Ctor.options;
      if (Ctor.super) {
        var superOptions = resolveConstructorOptions(Ctor.super);
        var cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
          // super option changed,
          // need to resolve new options.
          Ctor.superOptions = superOptions;
          // check if there are any late-modified/attached options (#4976)
          var modifiedOptions = resolveModifiedOptions(Ctor);
          // update base extend options
          if (modifiedOptions) {
            extend(Ctor.extendOptions, modifiedOptions);
          }
          options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
          if (options.name) {
            options.components[options.name] = Ctor;
          }
        }
      }
      return options;
    }

    function resolveModifiedOptions(Ctor) {
      var modified;
      var latest = Ctor.options;
      var extended = Ctor.extendOptions;
      var sealed = Ctor.sealedOptions;
      for (var key in latest) {
        if (latest[key] !== sealed[key]) {
          if (!modified) {
            modified = {};
          }
          modified[key] = dedupe(latest[key], extended[key], sealed[key]);
        }
      }
      return modified;
    }

    function dedupe(latest, extended, sealed) {
      // compare latest and sealed to ensure lifecycle hooks won't be duplicated
      // between merges
      if (Array.isArray(latest)) {
        var res = [];
        sealed = Array.isArray(sealed) ? sealed : [sealed];
        extended = Array.isArray(extended) ? extended : [extended];
        for (var i = 0; i < latest.length; i++) {
          // push original options and not sealed options to exclude duplicated options
          if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
            res.push(latest[i]);
          }
        }
        return res;
      } else {
        return latest;
      }
    }

    function Vue$3(options) {
      if ("development" !== 'production' && !(this instanceof Vue$3)) {
        warn('Vue is a constructor and should be called with the `new` keyword');
      }
      this._init(options);
    }

    initMixin(Vue$3);
    stateMixin(Vue$3);
    eventsMixin(Vue$3);
    lifecycleMixin(Vue$3);
    renderMixin(Vue$3);

    /*  */

    function initUse(Vue) {
      Vue.use = function (plugin) {
        /* istanbul ignore if */
        if (plugin.installed) {
          return this;
        }
        // additional parameters
        var args = toArray(arguments, 1);
        args.unshift(this);
        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args);
        } else if (typeof plugin === 'function') {
          plugin.apply(null, args);
        }
        plugin.installed = true;
        return this;
      };
    }

    /*  */

    function initMixin$1(Vue) {
      Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
      };
    }

    /*  */

    function initExtend(Vue) {
      /**
       * Each instance constructor, including Vue, has a unique
       * cid. This enables us to create wrapped "child
       * constructors" for prototypal inheritance and cache them.
       */
      Vue.cid = 0;
      var cid = 1;

      /**
       * Class inheritance
       */
      Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this;
        var SuperId = Super.cid;
        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) {
          return cachedCtors[SuperId];
        }

        var name = extendOptions.name || Super.options.name;
        {
          if (!/^[a-zA-Z][\w-]*$/.test(name)) {
            warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
          }
        }

        var Sub = function VueComponent(options) {
          this._init(options);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub['super'] = Super;

        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
          initProps$1(Sub);
        }
        if (Sub.options.computed) {
          initComputed$1(Sub);
        }

        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend;
        Sub.mixin = Super.mixin;
        Sub.use = Super.use;

        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
          Sub[type] = Super[type];
        });
        // enable recursive self-lookup
        if (name) {
          Sub.options.components[name] = Sub;
        }

        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        Sub.sealedOptions = extend({}, Sub.options);

        // cache constructor
        cachedCtors[SuperId] = Sub;
        return Sub;
      };
    }

    function initProps$1(Comp) {
      var props = Comp.options.props;
      for (var key in props) {
        proxy(Comp.prototype, "_props", key);
      }
    }

    function initComputed$1(Comp) {
      var computed = Comp.options.computed;
      for (var key in computed) {
        defineComputed(Comp.prototype, key, computed[key]);
      }
    }

    /*  */

    function initAssetRegisters(Vue) {
      /**
       * Create asset registration methods.
       */
      ASSET_TYPES.forEach(function (type) {
        Vue[type] = function (id, definition) {
          if (!definition) {
            return this.options[type + 's'][id];
          } else {
            /* istanbul ignore if */
            {
              if (type === 'component' && config.isReservedTag(id)) {
                warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
              }
            }
            if (type === 'component' && isPlainObject(definition)) {
              definition.name = definition.name || id;
              definition = this.options._base.extend(definition);
            }
            if (type === 'directive' && typeof definition === 'function') {
              definition = { bind: definition, update: definition };
            }
            this.options[type + 's'][id] = definition;
            return definition;
          }
        };
      });
    }

    /*  */

    var patternTypes = [String, RegExp];

    function getComponentName(opts) {
      return opts && (opts.Ctor.options.name || opts.tag);
    }

    function matches(pattern, name) {
      if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1;
      } else if (isRegExp(pattern)) {
        return pattern.test(name);
      }
      /* istanbul ignore next */
      return false;
    }

    function pruneCache(cache, current, filter) {
      for (var key in cache) {
        var cachedNode = cache[key];
        if (cachedNode) {
          var name = getComponentName(cachedNode.componentOptions);
          if (name && !filter(name)) {
            if (cachedNode !== current) {
              pruneCacheEntry(cachedNode);
            }
            cache[key] = null;
          }
        }
      }
    }

    function pruneCacheEntry(vnode) {
      if (vnode) {
        vnode.componentInstance.$destroy();
      }
    }

    var KeepAlive = {
      name: 'keep-alive',
      abstract: true,

      props: {
        include: patternTypes,
        exclude: patternTypes
      },

      created: function created() {
        this.cache = Object.create(null);
      },

      destroyed: function destroyed() {
        var this$1 = this;

        for (var key in this$1.cache) {
          pruneCacheEntry(this$1.cache[key]);
        }
      },

      watch: {
        include: function include(val) {
          pruneCache(this.cache, this._vnode, function (name) {
            return matches(val, name);
          });
        },
        exclude: function exclude(val) {
          pruneCache(this.cache, this._vnode, function (name) {
            return !matches(val, name);
          });
        }
      },

      render: function render() {
        var vnode = getFirstComponentChild(this.$slots.default);
        var componentOptions = vnode && vnode.componentOptions;
        if (componentOptions) {
          // check pattern
          var name = getComponentName(componentOptions);
          if (name && (this.include && !matches(this.include, name) || this.exclude && matches(this.exclude, name))) {
            return vnode;
          }
          var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;
          if (this.cache[key]) {
            vnode.componentInstance = this.cache[key].componentInstance;
          } else {
            this.cache[key] = vnode;
          }
          vnode.data.keepAlive = true;
        }
        return vnode;
      }
    };

    var builtInComponents = {
      KeepAlive: KeepAlive
    };

    /*  */

    function initGlobalAPI(Vue) {
      // config
      var configDef = {};
      configDef.get = function () {
        return config;
      };
      {
        configDef.set = function () {
          warn('Do not replace the Vue.config object, set individual fields instead.');
        };
      }
      Object.defineProperty(Vue, 'config', configDef);

      // exposed util methods.
      // NOTE: these are not considered part of the public API - avoid relying on
      // them unless you are aware of the risk.
      Vue.util = {
        warn: warn,
        extend: extend,
        mergeOptions: mergeOptions,
        defineReactive: defineReactive$$1
      };

      Vue.set = set;
      Vue.delete = del;
      Vue.nextTick = nextTick;

      Vue.options = Object.create(null);
      ASSET_TYPES.forEach(function (type) {
        Vue.options[type + 's'] = Object.create(null);
      });

      // this is used to identify the "base" constructor to extend all plain-object
      // components with in Weex's multi-instance scenarios.
      Vue.options._base = Vue;

      extend(Vue.options.components, builtInComponents);

      initUse(Vue);
      initMixin$1(Vue);
      initExtend(Vue);
      initAssetRegisters(Vue);
    }

    initGlobalAPI(Vue$3);

    Object.defineProperty(Vue$3.prototype, '$isServer', {
      get: isServerRendering
    });

    Object.defineProperty(Vue$3.prototype, '$ssrContext', {
      get: function get() {
        /* istanbul ignore next */
        return this.$vnode.ssrContext;
      }
    });

    Vue$3.version = '2.3.3';

    /*  */

    // these are reserved for web because they are directly compiled away
    // during template compilation
    var isReservedAttr = makeMap('style,class');

    // attributes that should be using props for binding
    var acceptValue = makeMap('input,textarea,option,select');
    var mustUseProp = function mustUseProp(tag, type, attr) {
      return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
    };

    var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

    var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

    var xlinkNS = 'http://www.w3.org/1999/xlink';

    var isXlink = function isXlink(name) {
      return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
    };

    var getXlinkProp = function getXlinkProp(name) {
      return isXlink(name) ? name.slice(6, name.length) : '';
    };

    var isFalsyAttrValue = function isFalsyAttrValue(val) {
      return val == null || val === false;
    };

    /*  */

    function genClassForVnode(vnode) {
      var data = vnode.data;
      var parentNode = vnode;
      var childNode = vnode;
      while (isDef(childNode.componentInstance)) {
        childNode = childNode.componentInstance._vnode;
        if (childNode.data) {
          data = mergeClassData(childNode.data, data);
        }
      }
      while (isDef(parentNode = parentNode.parent)) {
        if (parentNode.data) {
          data = mergeClassData(data, parentNode.data);
        }
      }
      return genClassFromData(data);
    }

    function mergeClassData(child, parent) {
      return {
        staticClass: concat(child.staticClass, parent.staticClass),
        class: isDef(child.class) ? [child.class, parent.class] : parent.class
      };
    }

    function genClassFromData(data) {
      var dynamicClass = data.class;
      var staticClass = data.staticClass;
      if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass, stringifyClass(dynamicClass));
      }
      /* istanbul ignore next */
      return '';
    }

    function concat(a, b) {
      return a ? b ? a + ' ' + b : a : b || '';
    }

    function stringifyClass(value) {
      if (isUndef(value)) {
        return '';
      }
      if (typeof value === 'string') {
        return value;
      }
      var res = '';
      if (Array.isArray(value)) {
        var stringified;
        for (var i = 0, l = value.length; i < l; i++) {
          if (isDef(value[i])) {
            if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
              res += stringified + ' ';
            }
          }
        }
        return res.slice(0, -1);
      }
      if (isObject(value)) {
        for (var key in value) {
          if (value[key]) {
            res += key + ' ';
          }
        }
        return res.slice(0, -1);
      }
      /* istanbul ignore next */
      return res;
    }

    /*  */

    var namespaceMap = {
      svg: 'http://www.w3.org/2000/svg',
      math: 'http://www.w3.org/1998/Math/MathML'
    };

    var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template');

    // this map is intentionally selective, only covering SVG elements that may
    // contain child elements.
    var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

    var isPreTag = function isPreTag(tag) {
      return tag === 'pre';
    };

    var isReservedTag = function isReservedTag(tag) {
      return isHTMLTag(tag) || isSVG(tag);
    };

    function getTagNamespace(tag) {
      if (isSVG(tag)) {
        return 'svg';
      }
      // basic support for MathML
      // note it doesn't support other MathML elements being component roots
      if (tag === 'math') {
        return 'math';
      }
    }

    var unknownElementCache = Object.create(null);
    function isUnknownElement(tag) {
      /* istanbul ignore if */
      if (!inBrowser) {
        return true;
      }
      if (isReservedTag(tag)) {
        return false;
      }
      tag = tag.toLowerCase();
      /* istanbul ignore if */
      if (unknownElementCache[tag] != null) {
        return unknownElementCache[tag];
      }
      var el = document.createElement(tag);
      if (tag.indexOf('-') > -1) {
        // http://stackoverflow.com/a/28210364/1070244
        return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
      } else {
        return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
      }
    }

    /*  */

    /**
     * Query an element selector if it's not an element already.
     */
    function query(el) {
      if (typeof el === 'string') {
        var selected = document.querySelector(el);
        if (!selected) {
          "development" !== 'production' && warn('Cannot find element: ' + el);
          return document.createElement('div');
        }
        return selected;
      } else {
        return el;
      }
    }

    /*  */

    function createElement$1(tagName, vnode) {
      var elm = document.createElement(tagName);
      if (tagName !== 'select') {
        return elm;
      }
      // false or null will remove the attribute but undefined will not
      if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
        elm.setAttribute('multiple', 'multiple');
      }
      return elm;
    }

    function createElementNS(namespace, tagName) {
      return document.createElementNS(namespaceMap[namespace], tagName);
    }

    function createTextNode(text) {
      return document.createTextNode(text);
    }

    function createComment(text) {
      return document.createComment(text);
    }

    function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
    }

    function removeChild(node, child) {
      node.removeChild(child);
    }

    function appendChild(node, child) {
      node.appendChild(child);
    }

    function parentNode(node) {
      return node.parentNode;
    }

    function nextSibling(node) {
      return node.nextSibling;
    }

    function tagName(node) {
      return node.tagName;
    }

    function setTextContent(node, text) {
      node.textContent = text;
    }

    function setAttribute(node, key, val) {
      node.setAttribute(key, val);
    }

    var nodeOps = Object.freeze({
      createElement: createElement$1,
      createElementNS: createElementNS,
      createTextNode: createTextNode,
      createComment: createComment,
      insertBefore: insertBefore,
      removeChild: removeChild,
      appendChild: appendChild,
      parentNode: parentNode,
      nextSibling: nextSibling,
      tagName: tagName,
      setTextContent: setTextContent,
      setAttribute: setAttribute
    });

    /*  */

    var ref = {
      create: function create(_, vnode) {
        registerRef(vnode);
      },
      update: function update(oldVnode, vnode) {
        if (oldVnode.data.ref !== vnode.data.ref) {
          registerRef(oldVnode, true);
          registerRef(vnode);
        }
      },
      destroy: function destroy(vnode) {
        registerRef(vnode, true);
      }
    };

    function registerRef(vnode, isRemoval) {
      var key = vnode.data.ref;
      if (!key) {
        return;
      }

      var vm = vnode.context;
      var ref = vnode.componentInstance || vnode.elm;
      var refs = vm.$refs;
      if (isRemoval) {
        if (Array.isArray(refs[key])) {
          remove(refs[key], ref);
        } else if (refs[key] === ref) {
          refs[key] = undefined;
        }
      } else {
        if (vnode.data.refInFor) {
          if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
            refs[key].push(ref);
          } else {
            refs[key] = [ref];
          }
        } else {
          refs[key] = ref;
        }
      }
    }

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/paldepind/snabbdom/blob/master/LICENSE
     *
     * modified by Evan You (@yyx990803)
     *
    
    /*
     * Not type-checking this because this file is perf-critical and the cost
     * of making flow understand it is not worth it.
     */

    var emptyNode = new VNode('', {}, []);

    var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

    function sameVnode(a, b) {
      return a.key === b.key && a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b);
    }

    // Some browsers do not support dynamically changing type for <input>
    // so they need to be treated as different nodes
    function sameInputType(a, b) {
      if (a.tag !== 'input') {
        return true;
      }
      var i;
      var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
      var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
      return typeA === typeB;
    }

    function createKeyToOldIdx(children, beginIdx, endIdx) {
      var i, key;
      var map = {};
      for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) {
          map[key] = i;
        }
      }
      return map;
    }

    function createPatchFunction(backend) {
      var i, j;
      var cbs = {};

      var modules = backend.modules;
      var nodeOps = backend.nodeOps;

      for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
          if (isDef(modules[j][hooks[i]])) {
            cbs[hooks[i]].push(modules[j][hooks[i]]);
          }
        }
      }

      function emptyNodeAt(elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
      }

      function createRmCb(childElm, listeners) {
        function remove$$1() {
          if (--remove$$1.listeners === 0) {
            removeNode(childElm);
          }
        }
        remove$$1.listeners = listeners;
        return remove$$1;
      }

      function removeNode(el) {
        var parent = nodeOps.parentNode(el);
        // element may have already been removed due to v-html / v-text
        if (isDef(parent)) {
          nodeOps.removeChild(parent, el);
        }
      }

      var inPre = 0;
      function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
        vnode.isRootInsert = !nested; // for transition enter check
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
          return;
        }

        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        if (isDef(tag)) {
          {
            if (data && data.pre) {
              inPre++;
            }
            if (!inPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) && config.isUnknownElement(tag)) {
              warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
            }
          }
          vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
          setScope(vnode);

          /* istanbul ignore if */
          {
            createChildren(vnode, children, insertedVnodeQueue);
            if (isDef(data)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
            }
            insert(parentElm, vnode.elm, refElm);
          }

          if ("development" !== 'production' && data && data.pre) {
            inPre--;
          }
        } else if (isTrue(vnode.isComment)) {
          vnode.elm = nodeOps.createComment(vnode.text);
          insert(parentElm, vnode.elm, refElm);
        } else {
          vnode.elm = nodeOps.createTextNode(vnode.text);
          insert(parentElm, vnode.elm, refElm);
        }
      }

      function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i = vnode.data;
        if (isDef(i)) {
          var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
          if (isDef(i = i.hook) && isDef(i = i.init)) {
            i(vnode, false /* hydrating */, parentElm, refElm);
          }
          // after calling the init hook, if the vnode is a child component
          // it should've created a child instance and mounted it. the child
          // component also has set the placeholder vnode's elm.
          // in that case we can just return the element and be done.
          if (isDef(vnode.componentInstance)) {
            initComponent(vnode, insertedVnodeQueue);
            if (isTrue(isReactivated)) {
              reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
            }
            return true;
          }
        }
      }

      function initComponent(vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
          insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        }
        vnode.elm = vnode.componentInstance.$el;
        if (isPatchable(vnode)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
          setScope(vnode);
        } else {
          // empty component root.
          // skip all element-related modules except for ref (#3455)
          registerRef(vnode);
          // make sure to invoke the insert hook
          insertedVnodeQueue.push(vnode);
        }
      }

      function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i;
        // hack for #4339: a reactivated component with inner transition
        // does not trigger because the inner node's created hooks are not called
        // again. It's not ideal to involve module-specific logic in here but
        // there doesn't seem to be a better way to do it.
        var innerNode = vnode;
        while (innerNode.componentInstance) {
          innerNode = innerNode.componentInstance._vnode;
          if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
            for (i = 0; i < cbs.activate.length; ++i) {
              cbs.activate[i](emptyNode, innerNode);
            }
            insertedVnodeQueue.push(innerNode);
            break;
          }
        }
        // unlike a newly created component,
        // a reactivated keep-alive component doesn't insert itself
        insert(parentElm, vnode.elm, refElm);
      }

      function insert(parent, elm, ref) {
        if (isDef(parent)) {
          if (isDef(ref)) {
            if (ref.parentNode === parent) {
              nodeOps.insertBefore(parent, elm, ref);
            }
          } else {
            nodeOps.appendChild(parent, elm);
          }
        }
      }

      function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
          for (var i = 0; i < children.length; ++i) {
            createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
          }
        } else if (isPrimitive(vnode.text)) {
          nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
        }
      }

      function isPatchable(vnode) {
        while (vnode.componentInstance) {
          vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag);
      }

      function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
          cbs.create[i$1](emptyNode, vnode);
        }
        i = vnode.data.hook; // Reuse variable
        if (isDef(i)) {
          if (isDef(i.create)) {
            i.create(emptyNode, vnode);
          }
          if (isDef(i.insert)) {
            insertedVnodeQueue.push(vnode);
          }
        }
      }

      // set scope id attribute for scoped CSS.
      // this is implemented as a special case to avoid the overhead
      // of going through the normal attribute patching process.
      function setScope(vnode) {
        var i;
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setAttribute(vnode.elm, i, '');
          }
          ancestor = ancestor.parent;
        }
        // for slot content they should also get the scopeId from the host instance.
        if (isDef(i = activeInstance) && i !== vnode.context && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
      }

      function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
          createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
        }
      }

      function invokeDestroyHook(vnode) {
        var i, j;
        var data = vnode.data;
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.destroy)) {
            i(vnode);
          }
          for (i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](vnode);
          }
        }
        if (isDef(i = vnode.children)) {
          for (j = 0; j < vnode.children.length; ++j) {
            invokeDestroyHook(vnode.children[j]);
          }
        }
      }

      function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
          var ch = vnodes[startIdx];
          if (isDef(ch)) {
            if (isDef(ch.tag)) {
              removeAndInvokeRemoveHook(ch);
              invokeDestroyHook(ch);
            } else {
              // Text node
              removeNode(ch.elm);
            }
          }
        }
      }

      function removeAndInvokeRemoveHook(vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
          var i;
          var listeners = cbs.remove.length + 1;
          if (isDef(rm)) {
            // we have a recursively passed down rm callback
            // increase the listeners count
            rm.listeners += listeners;
          } else {
            // directly removing
            rm = createRmCb(vnode.elm, listeners);
          }
          // recursively invoke hooks on child component root node
          if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
            removeAndInvokeRemoveHook(i, rm);
          }
          for (i = 0; i < cbs.remove.length; ++i) {
            cbs.remove[i](vnode, rm);
          }
          if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
            i(vnode, rm);
          } else {
            rm();
          }
        } else {
          removeNode(vnode.elm);
        }
      }

      function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        var oldStartIdx = 0;
        var newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx, idxInOld, elmToMove, refElm;

        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        var canMove = !removeOnly;

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
          if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
          } else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
          } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
          } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
          } else if (sameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
          } else if (sameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
          } else {
            if (isUndef(oldKeyToIdx)) {
              oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
            if (isUndef(idxInOld)) {
              // New element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            } else {
              elmToMove = oldCh[idxInOld];
              /* istanbul ignore if */
              if ("development" !== 'production' && !elmToMove) {
                warn('It seems there are duplicate keys that is causing an update error. ' + 'Make sure each v-for item has a unique key.');
              }
              if (sameVnode(elmToMove, newStartVnode)) {
                patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                oldCh[idxInOld] = undefined;
                canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
                newStartVnode = newCh[++newStartIdx];
              } else {
                // same key but different element. treat as new element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                newStartVnode = newCh[++newStartIdx];
              }
            }
          }
        }
        if (oldStartIdx > oldEndIdx) {
          refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
          addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        } else if (newStartIdx > newEndIdx) {
          removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
      }

      function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
        if (oldVnode === vnode) {
          return;
        }
        // reuse element for static trees.
        // note we only do this if the vnode is cloned -
        // if the new node is not cloned it means the render functions have been
        // reset by the hot-reload-api and we need to do a proper re-render.
        if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
          vnode.elm = oldVnode.elm;
          vnode.componentInstance = oldVnode.componentInstance;
          return;
        }
        var i;
        var data = vnode.data;
        if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
          i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (isDef(data) && isPatchable(vnode)) {
          for (i = 0; i < cbs.update.length; ++i) {
            cbs.update[i](oldVnode, vnode);
          }
          if (isDef(i = data.hook) && isDef(i = i.update)) {
            i(oldVnode, vnode);
          }
        }
        if (isUndef(vnode.text)) {
          if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) {
              updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
            }
          } else if (isDef(ch)) {
            if (isDef(oldVnode.text)) {
              nodeOps.setTextContent(elm, '');
            }
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
          } else if (isDef(oldCh)) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
          } else if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '');
          }
        } else if (oldVnode.text !== vnode.text) {
          nodeOps.setTextContent(elm, vnode.text);
        }
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
            i(oldVnode, vnode);
          }
        }
      }

      function invokeInsertHook(vnode, queue, initial) {
        // delay insert hooks for component root nodes, invoke them after the
        // element is really inserted
        if (isTrue(initial) && isDef(vnode.parent)) {
          vnode.parent.data.pendingInsert = queue;
        } else {
          for (var i = 0; i < queue.length; ++i) {
            queue[i].data.hook.insert(queue[i]);
          }
        }
      }

      var bailed = false;
      // list of modules that can skip create hook during hydration because they
      // are already rendered on the client or has no need for initialization
      var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

      // Note: this is a browser-only function so we can assume elms are DOM nodes.
      function hydrate(elm, vnode, insertedVnodeQueue) {
        {
          if (!assertNodeMatch(elm, vnode)) {
            return false;
          }
        }
        vnode.elm = elm;
        var tag = vnode.tag;
        var data = vnode.data;
        var children = vnode.children;
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.init)) {
            i(vnode, true /* hydrating */);
          }
          if (isDef(i = vnode.componentInstance)) {
            // child component. it should have hydrated its own tree.
            initComponent(vnode, insertedVnodeQueue);
            return true;
          }
        }
        if (isDef(tag)) {
          if (isDef(children)) {
            // empty element, allow client to pick up and populate children
            if (!elm.hasChildNodes()) {
              createChildren(vnode, children, insertedVnodeQueue);
            } else {
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                  childrenMatch = false;
                  break;
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                if ("development" !== 'production' && typeof console !== 'undefined' && !bailed) {
                  bailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false;
              }
            }
          }
          if (isDef(data)) {
            for (var key in data) {
              if (!isRenderedModule(key)) {
                invokeCreateHooks(vnode, insertedVnodeQueue);
                break;
              }
            }
          }
        } else if (elm.data !== vnode.text) {
          elm.data = vnode.text;
        }
        return true;
      }

      function assertNodeMatch(node, vnode) {
        if (isDef(vnode.tag)) {
          return vnode.tag.indexOf('vue-component') === 0 || vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
        } else {
          return node.nodeType === (vnode.isComment ? 8 : 3);
        }
      }

      return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
        if (isUndef(vnode)) {
          if (isDef(oldVnode)) {
            invokeDestroyHook(oldVnode);
          }
          return;
        }

        var isInitialPatch = false;
        var insertedVnodeQueue = [];

        if (isUndef(oldVnode)) {
          // empty mount (likely as component), create new root element
          isInitialPatch = true;
          createElm(vnode, insertedVnodeQueue, parentElm, refElm);
        } else {
          var isRealElement = isDef(oldVnode.nodeType);
          if (!isRealElement && sameVnode(oldVnode, vnode)) {
            // patch existing root node
            patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
          } else {
            if (isRealElement) {
              // mounting to a real element
              // check if this is server-rendered content and if we can perform
              // a successful hydration.
              if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                oldVnode.removeAttribute(SSR_ATTR);
                hydrating = true;
              }
              if (isTrue(hydrating)) {
                if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                  invokeInsertHook(vnode, insertedVnodeQueue, true);
                  return oldVnode;
                } else {
                  warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
                }
              }
              // either not server-rendered, or hydration failed.
              // create an empty node and replace it
              oldVnode = emptyNodeAt(oldVnode);
            }
            // replacing existing element
            var oldElm = oldVnode.elm;
            var parentElm$1 = nodeOps.parentNode(oldElm);
            createElm(vnode, insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm$1, nodeOps.nextSibling(oldElm));

            if (isDef(vnode.parent)) {
              // component root element replaced.
              // update parent placeholder node element, recursively
              var ancestor = vnode.parent;
              while (ancestor) {
                ancestor.elm = vnode.elm;
                ancestor = ancestor.parent;
              }
              if (isPatchable(vnode)) {
                for (var i = 0; i < cbs.create.length; ++i) {
                  cbs.create[i](emptyNode, vnode.parent);
                }
              }
            }

            if (isDef(parentElm$1)) {
              removeVnodes(parentElm$1, [oldVnode], 0, 0);
            } else if (isDef(oldVnode.tag)) {
              invokeDestroyHook(oldVnode);
            }
          }
        }

        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm;
      };
    }

    /*  */

    var directives = {
      create: updateDirectives,
      update: updateDirectives,
      destroy: function unbindDirectives(vnode) {
        updateDirectives(vnode, emptyNode);
      }
    };

    function updateDirectives(oldVnode, vnode) {
      if (oldVnode.data.directives || vnode.data.directives) {
        _update(oldVnode, vnode);
      }
    }

    function _update(oldVnode, vnode) {
      var isCreate = oldVnode === emptyNode;
      var isDestroy = vnode === emptyNode;
      var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
      var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

      var dirsWithInsert = [];
      var dirsWithPostpatch = [];

      var key, oldDir, dir;
      for (key in newDirs) {
        oldDir = oldDirs[key];
        dir = newDirs[key];
        if (!oldDir) {
          // new directive, bind
          callHook$1(dir, 'bind', vnode, oldVnode);
          if (dir.def && dir.def.inserted) {
            dirsWithInsert.push(dir);
          }
        } else {
          // existing directive, update
          dir.oldValue = oldDir.value;
          callHook$1(dir, 'update', vnode, oldVnode);
          if (dir.def && dir.def.componentUpdated) {
            dirsWithPostpatch.push(dir);
          }
        }
      }

      if (dirsWithInsert.length) {
        var callInsert = function callInsert() {
          for (var i = 0; i < dirsWithInsert.length; i++) {
            callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
          }
        };
        if (isCreate) {
          mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
        } else {
          callInsert();
        }
      }

      if (dirsWithPostpatch.length) {
        mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
          for (var i = 0; i < dirsWithPostpatch.length; i++) {
            callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
          }
        });
      }

      if (!isCreate) {
        for (key in oldDirs) {
          if (!newDirs[key]) {
            // no longer present, unbind
            callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
          }
        }
      }
    }

    var emptyModifiers = Object.create(null);

    function normalizeDirectives$1(dirs, vm) {
      var res = Object.create(null);
      if (!dirs) {
        return res;
      }
      var i, dir;
      for (i = 0; i < dirs.length; i++) {
        dir = dirs[i];
        if (!dir.modifiers) {
          dir.modifiers = emptyModifiers;
        }
        res[getRawDirName(dir)] = dir;
        dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
      }
      return res;
    }

    function getRawDirName(dir) {
      return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
    }

    function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
      var fn = dir.def && dir.def[hook];
      if (fn) {
        try {
          fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        } catch (e) {
          handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
        }
      }
    }

    var baseModules = [ref, directives];

    /*  */

    function updateAttrs(oldVnode, vnode) {
      if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return;
      }
      var key, cur, old;
      var elm = vnode.elm;
      var oldAttrs = oldVnode.data.attrs || {};
      var attrs = vnode.data.attrs || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(attrs.__ob__)) {
        attrs = vnode.data.attrs = extend({}, attrs);
      }

      for (key in attrs) {
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
          setAttr(elm, key, cur);
        }
      }
      // #4391: in IE9, setting type can reset value for input[type=radio]
      /* istanbul ignore if */
      if (isIE9 && attrs.value !== oldAttrs.value) {
        setAttr(elm, 'value', attrs.value);
      }
      for (key in oldAttrs) {
        if (isUndef(attrs[key])) {
          if (isXlink(key)) {
            elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
          } else if (!isEnumeratedAttr(key)) {
            elm.removeAttribute(key);
          }
        }
      }
    }

    function setAttr(el, key, value) {
      if (isBooleanAttr(key)) {
        // set attribute for blank value
        // e.g. <option disabled>Select one</option>
        if (isFalsyAttrValue(value)) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(key, key);
        }
      } else if (isEnumeratedAttr(key)) {
        el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
      } else if (isXlink(key)) {
        if (isFalsyAttrValue(value)) {
          el.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else {
          el.setAttributeNS(xlinkNS, key, value);
        }
      } else {
        if (isFalsyAttrValue(value)) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(key, value);
        }
      }
    }

    var attrs = {
      create: updateAttrs,
      update: updateAttrs
    };

    /*  */

    function updateClass(oldVnode, vnode) {
      var el = vnode.elm;
      var data = vnode.data;
      var oldData = oldVnode.data;
      if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
        return;
      }

      var cls = genClassForVnode(vnode);

      // handle transition classes
      var transitionClass = el._transitionClasses;
      if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass));
      }

      // set the class
      if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
      }
    }

    var klass = {
      create: updateClass,
      update: updateClass
    };

    /*  */

    var validDivisionCharRE = /[\w).+\-_$\]]/;

    function parseFilters(exp) {
      var inSingle = false;
      var inDouble = false;
      var inTemplateString = false;
      var inRegex = false;
      var curly = 0;
      var square = 0;
      var paren = 0;
      var lastFilterIndex = 0;
      var c, prev, i, expression, filters;

      for (i = 0; i < exp.length; i++) {
        prev = c;
        c = exp.charCodeAt(i);
        if (inSingle) {
          if (c === 0x27 && prev !== 0x5C) {
            inSingle = false;
          }
        } else if (inDouble) {
          if (c === 0x22 && prev !== 0x5C) {
            inDouble = false;
          }
        } else if (inTemplateString) {
          if (c === 0x60 && prev !== 0x5C) {
            inTemplateString = false;
          }
        } else if (inRegex) {
          if (c === 0x2f && prev !== 0x5C) {
            inRegex = false;
          }
        } else if (c === 0x7C && // pipe
        exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
          if (expression === undefined) {
            // first filter, end of expression
            lastFilterIndex = i + 1;
            expression = exp.slice(0, i).trim();
          } else {
            pushFilter();
          }
        } else {
          switch (c) {
            case 0x22:
              inDouble = true;break; // "
            case 0x27:
              inSingle = true;break; // '
            case 0x60:
              inTemplateString = true;break; // `
            case 0x28:
              paren++;break; // (
            case 0x29:
              paren--;break; // )
            case 0x5B:
              square++;break; // [
            case 0x5D:
              square--;break; // ]
            case 0x7B:
              curly++;break; // {
            case 0x7D:
              curly--;break; // }
          }
          if (c === 0x2f) {
            // /
            var j = i - 1;
            var p = void 0;
            // find first non-whitespace prev char
            for (; j >= 0; j--) {
              p = exp.charAt(j);
              if (p !== ' ') {
                break;
              }
            }
            if (!p || !validDivisionCharRE.test(p)) {
              inRegex = true;
            }
          }
        }
      }

      if (expression === undefined) {
        expression = exp.slice(0, i).trim();
      } else if (lastFilterIndex !== 0) {
        pushFilter();
      }

      function pushFilter() {
        (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
        lastFilterIndex = i + 1;
      }

      if (filters) {
        for (i = 0; i < filters.length; i++) {
          expression = wrapFilter(expression, filters[i]);
        }
      }

      return expression;
    }

    function wrapFilter(exp, filter) {
      var i = filter.indexOf('(');
      if (i < 0) {
        // _f: resolveFilter
        return "_f(\"" + filter + "\")(" + exp + ")";
      } else {
        var name = filter.slice(0, i);
        var args = filter.slice(i + 1);
        return "_f(\"" + name + "\")(" + exp + "," + args;
      }
    }

    /*  */

    function baseWarn(msg) {
      console.error("[Vue compiler]: " + msg);
    }

    function pluckModuleFunction(modules, key) {
      return modules ? modules.map(function (m) {
        return m[key];
      }).filter(function (_) {
        return _;
      }) : [];
    }

    function addProp(el, name, value) {
      (el.props || (el.props = [])).push({ name: name, value: value });
    }

    function addAttr(el, name, value) {
      (el.attrs || (el.attrs = [])).push({ name: name, value: value });
    }

    function addDirective(el, name, rawName, value, arg, modifiers) {
      (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
    }

    function addHandler(el, name, value, modifiers, important, warn) {
      // warn prevent and passive modifier
      /* istanbul ignore if */
      if ("development" !== 'production' && warn && modifiers && modifiers.prevent && modifiers.passive) {
        warn('passive and prevent can\'t be used together. ' + 'Passive handler can\'t prevent default event.');
      }
      // check capture modifier
      if (modifiers && modifiers.capture) {
        delete modifiers.capture;
        name = '!' + name; // mark the event as captured
      }
      if (modifiers && modifiers.once) {
        delete modifiers.once;
        name = '~' + name; // mark the event as once
      }
      /* istanbul ignore if */
      if (modifiers && modifiers.passive) {
        delete modifiers.passive;
        name = '&' + name; // mark the event as passive
      }
      var events;
      if (modifiers && modifiers.native) {
        delete modifiers.native;
        events = el.nativeEvents || (el.nativeEvents = {});
      } else {
        events = el.events || (el.events = {});
      }
      var newHandler = { value: value, modifiers: modifiers };
      var handlers = events[name];
      /* istanbul ignore if */
      if (Array.isArray(handlers)) {
        important ? handlers.unshift(newHandler) : handlers.push(newHandler);
      } else if (handlers) {
        events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
      } else {
        events[name] = newHandler;
      }
    }

    function getBindingAttr(el, name, getStatic) {
      var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
      if (dynamicValue != null) {
        return parseFilters(dynamicValue);
      } else if (getStatic !== false) {
        var staticValue = getAndRemoveAttr(el, name);
        if (staticValue != null) {
          return JSON.stringify(staticValue);
        }
      }
    }

    function getAndRemoveAttr(el, name) {
      var val;
      if ((val = el.attrsMap[name]) != null) {
        var list = el.attrsList;
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i].name === name) {
            list.splice(i, 1);
            break;
          }
        }
      }
      return val;
    }

    /*  */

    /**
     * Cross-platform code generation for component v-model
     */
    function genComponentModel(el, value, modifiers) {
      var ref = modifiers || {};
      var number = ref.number;
      var trim = ref.trim;

      var baseValueExpression = '$$v';
      var valueExpression = baseValueExpression;
      if (trim) {
        valueExpression = "(typeof " + baseValueExpression + " === 'string'" + "? " + baseValueExpression + ".trim()" + ": " + baseValueExpression + ")";
      }
      if (number) {
        valueExpression = "_n(" + valueExpression + ")";
      }
      var assignment = genAssignmentCode(value, valueExpression);

      el.model = {
        value: "(" + value + ")",
        expression: "\"" + value + "\"",
        callback: "function (" + baseValueExpression + ") {" + assignment + "}"
      };
    }

    /**
     * Cross-platform codegen helper for generating v-model value assignment code.
     */
    function genAssignmentCode(value, assignment) {
      var modelRs = parseModel(value);
      if (modelRs.idx === null) {
        return value + "=" + assignment;
      } else {
        return "var $$exp = " + modelRs.exp + ", $$idx = " + modelRs.idx + ";" + "if (!Array.isArray($$exp)){" + value + "=" + assignment + "}" + "else{$$exp.splice($$idx, 1, " + assignment + ")}";
      }
    }

    /**
     * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
     *
     * for loop possible cases:
     *
     * - test
     * - test[idx]
     * - test[test1[idx]]
     * - test["a"][idx]
     * - xxx.test[a[a].test1[idx]]
     * - test.xxx.a["asa"][test1[idx]]
     *
     */

    var len;
    var str;
    var chr;
    var index$1;
    var expressionPos;
    var expressionEndPos;

    function parseModel(val) {
      str = val;
      len = str.length;
      index$1 = expressionPos = expressionEndPos = 0;

      if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
        return {
          exp: val,
          idx: null
        };
      }

      while (!eof()) {
        chr = next();
        /* istanbul ignore if */
        if (isStringStart(chr)) {
          parseString(chr);
        } else if (chr === 0x5B) {
          parseBracket(chr);
        }
      }

      return {
        exp: val.substring(0, expressionPos),
        idx: val.substring(expressionPos + 1, expressionEndPos)
      };
    }

    function next() {
      return str.charCodeAt(++index$1);
    }

    function eof() {
      return index$1 >= len;
    }

    function isStringStart(chr) {
      return chr === 0x22 || chr === 0x27;
    }

    function parseBracket(chr) {
      var inBracket = 1;
      expressionPos = index$1;
      while (!eof()) {
        chr = next();
        if (isStringStart(chr)) {
          parseString(chr);
          continue;
        }
        if (chr === 0x5B) {
          inBracket++;
        }
        if (chr === 0x5D) {
          inBracket--;
        }
        if (inBracket === 0) {
          expressionEndPos = index$1;
          break;
        }
      }
    }

    function parseString(chr) {
      var stringQuote = chr;
      while (!eof()) {
        chr = next();
        if (chr === stringQuote) {
          break;
        }
      }
    }

    /*  */

    var warn$1;

    // in some cases, the event used has to be determined at runtime
    // so we used some reserved tokens during compile.
    var RANGE_TOKEN = '__r';
    var CHECKBOX_RADIO_TOKEN = '__c';

    function model(el, dir, _warn) {
      warn$1 = _warn;
      var value = dir.value;
      var modifiers = dir.modifiers;
      var tag = el.tag;
      var type = el.attrsMap.type;

      {
        var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
        if (tag === 'input' && dynamicType) {
          warn$1("<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" + "v-model does not support dynamic input types. Use v-if branches instead.");
        }
        // inputs with type="file" are read only and setting the input's
        // value will throw an error.
        if (tag === 'input' && type === 'file') {
          warn$1("<" + el.tag + " v-model=\"" + value + "\" type=\"file\">:\n" + "File inputs are read only. Use a v-on:change listener instead.");
        }
      }

      if (tag === 'select') {
        genSelect(el, value, modifiers);
      } else if (tag === 'input' && type === 'checkbox') {
        genCheckboxModel(el, value, modifiers);
      } else if (tag === 'input' && type === 'radio') {
        genRadioModel(el, value, modifiers);
      } else if (tag === 'input' || tag === 'textarea') {
        genDefaultModel(el, value, modifiers);
      } else if (!config.isReservedTag(tag)) {
        genComponentModel(el, value, modifiers);
        // component v-model doesn't need extra runtime
        return false;
      } else {
        warn$1("<" + el.tag + " v-model=\"" + value + "\">: " + "v-model is not supported on this element type. " + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.');
      }

      // ensure runtime directive metadata
      return true;
    }

    function genCheckboxModel(el, value, modifiers) {
      var number = modifiers && modifiers.number;
      var valueBinding = getBindingAttr(el, 'value') || 'null';
      var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
      var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
      addProp(el, 'checked', "Array.isArray(" + value + ")" + "?_i(" + value + "," + valueBinding + ")>-1" + (trueValueBinding === 'true' ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")"));
      addHandler(el, CHECKBOX_RADIO_TOKEN, "var $$a=" + value + "," + '$$el=$event.target,' + "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" + 'if(Array.isArray($$a)){' + "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," + '$$i=_i($$a,$$v);' + "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" + "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" + "}else{" + genAssignmentCode(value, '$$c') + "}", null, true);
    }

    function genRadioModel(el, value, modifiers) {
      var number = modifiers && modifiers.number;
      var valueBinding = getBindingAttr(el, 'value') || 'null';
      valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
      addProp(el, 'checked', "_q(" + value + "," + valueBinding + ")");
      addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
    }

    function genSelect(el, value, modifiers) {
      var number = modifiers && modifiers.number;
      var selectedVal = "Array.prototype.filter" + ".call($event.target.options,function(o){return o.selected})" + ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" + "return " + (number ? '_n(val)' : 'val') + "})";

      var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
      var code = "var $$selectedVal = " + selectedVal + ";";
      code = code + " " + genAssignmentCode(value, assignment);
      addHandler(el, 'change', code, null, true);
    }

    function genDefaultModel(el, value, modifiers) {
      var type = el.attrsMap.type;
      var ref = modifiers || {};
      var lazy = ref.lazy;
      var number = ref.number;
      var trim = ref.trim;
      var needCompositionGuard = !lazy && type !== 'range';
      var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';

      var valueExpression = '$event.target.value';
      if (trim) {
        valueExpression = "$event.target.value.trim()";
      }
      if (number) {
        valueExpression = "_n(" + valueExpression + ")";
      }

      var code = genAssignmentCode(value, valueExpression);
      if (needCompositionGuard) {
        code = "if($event.target.composing)return;" + code;
      }

      addProp(el, 'value', "(" + value + ")");
      addHandler(el, event, code, null, true);
      if (trim || number || type === 'number') {
        addHandler(el, 'blur', '$forceUpdate()');
      }
    }

    /*  */

    // normalize v-model event tokens that can only be determined at runtime.
    // it's important to place the event as the first in the array because
    // the whole point is ensuring the v-model callback gets called before
    // user-attached handlers.
    function normalizeEvents(on) {
      var event;
      /* istanbul ignore if */
      if (isDef(on[RANGE_TOKEN])) {
        // IE input[type=range] only supports `change` event
        event = isIE ? 'change' : 'input';
        on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
        delete on[RANGE_TOKEN];
      }
      if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
        // Chrome fires microtasks in between click/change, leads to #4521
        event = isChrome ? 'click' : 'change';
        on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
        delete on[CHECKBOX_RADIO_TOKEN];
      }
    }

    var target$1;

    function add$1(event, _handler, once$$1, capture, passive) {
      if (once$$1) {
        var oldHandler = _handler;
        var _target = target$1; // save current target element in closure
        _handler = function handler(ev) {
          var res = arguments.length === 1 ? oldHandler(ev) : oldHandler.apply(null, arguments);
          if (res !== null) {
            remove$2(event, _handler, capture, _target);
          }
        };
      }
      target$1.addEventListener(event, _handler, supportsPassive ? { capture: capture, passive: passive } : capture);
    }

    function remove$2(event, handler, capture, _target) {
      (_target || target$1).removeEventListener(event, handler, capture);
    }

    function updateDOMListeners(oldVnode, vnode) {
      if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return;
      }
      var on = vnode.data.on || {};
      var oldOn = oldVnode.data.on || {};
      target$1 = vnode.elm;
      normalizeEvents(on);
      updateListeners(on, oldOn, add$1, remove$2, vnode.context);
    }

    var events = {
      create: updateDOMListeners,
      update: updateDOMListeners
    };

    /*  */

    function updateDOMProps(oldVnode, vnode) {
      if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
        return;
      }
      var key, cur;
      var elm = vnode.elm;
      var oldProps = oldVnode.data.domProps || {};
      var props = vnode.data.domProps || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(props.__ob__)) {
        props = vnode.data.domProps = extend({}, props);
      }

      for (key in oldProps) {
        if (isUndef(props[key])) {
          elm[key] = '';
        }
      }
      for (key in props) {
        cur = props[key];
        // ignore children if the node has textContent or innerHTML,
        // as these will throw away existing DOM nodes and cause removal errors
        // on subsequent patches (#3360)
        if (key === 'textContent' || key === 'innerHTML') {
          if (vnode.children) {
            vnode.children.length = 0;
          }
          if (cur === oldProps[key]) {
            continue;
          }
        }

        if (key === 'value') {
          // store value as _value as well since
          // non-string values will be stringified
          elm._value = cur;
          // avoid resetting cursor position when value is the same
          var strCur = isUndef(cur) ? '' : String(cur);
          if (shouldUpdateValue(elm, vnode, strCur)) {
            elm.value = strCur;
          }
        } else {
          elm[key] = cur;
        }
      }
    }

    // check platforms/web/util/attrs.js acceptValue


    function shouldUpdateValue(elm, vnode, checkVal) {
      return !elm.composing && (vnode.tag === 'option' || isDirty(elm, checkVal) || isInputChanged(elm, checkVal));
    }

    function isDirty(elm, checkVal) {
      // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
      return document.activeElement !== elm && elm.value !== checkVal;
    }

    function isInputChanged(elm, newVal) {
      var value = elm.value;
      var modifiers = elm._vModifiers; // injected by v-model runtime
      if (isDef(modifiers) && modifiers.number || elm.type === 'number') {
        return toNumber(value) !== toNumber(newVal);
      }
      if (isDef(modifiers) && modifiers.trim) {
        return value.trim() !== newVal.trim();
      }
      return value !== newVal;
    }

    var domProps = {
      create: updateDOMProps,
      update: updateDOMProps
    };

    /*  */

    var parseStyleText = cached(function (cssText) {
      var res = {};
      var listDelimiter = /;(?![^(]*\))/g;
      var propertyDelimiter = /:(.+)/;
      cssText.split(listDelimiter).forEach(function (item) {
        if (item) {
          var tmp = item.split(propertyDelimiter);
          tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return res;
    });

    // merge static and dynamic style data on the same vnode
    function normalizeStyleData(data) {
      var style = normalizeStyleBinding(data.style);
      // static style is pre-processed into an object during compilation
      // and is always a fresh object, so it's safe to merge into it
      return data.staticStyle ? extend(data.staticStyle, style) : style;
    }

    // normalize possible array / string values into Object
    function normalizeStyleBinding(bindingStyle) {
      if (Array.isArray(bindingStyle)) {
        return toObject(bindingStyle);
      }
      if (typeof bindingStyle === 'string') {
        return parseStyleText(bindingStyle);
      }
      return bindingStyle;
    }

    /**
     * parent component style should be after child's
     * so that parent component's style could override it
     */
    function getStyle(vnode, checkChild) {
      var res = {};
      var styleData;

      if (checkChild) {
        var childNode = vnode;
        while (childNode.componentInstance) {
          childNode = childNode.componentInstance._vnode;
          if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
            extend(res, styleData);
          }
        }
      }

      if (styleData = normalizeStyleData(vnode.data)) {
        extend(res, styleData);
      }

      var parentNode = vnode;
      while (parentNode = parentNode.parent) {
        if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
          extend(res, styleData);
        }
      }
      return res;
    }

    /*  */

    var cssVarRE = /^--/;
    var importantRE = /\s*!important$/;
    var setProp = function setProp(el, name, val) {
      /* istanbul ignore if */
      if (cssVarRE.test(name)) {
        el.style.setProperty(name, val);
      } else if (importantRE.test(val)) {
        el.style.setProperty(name, val.replace(importantRE, ''), 'important');
      } else {
        var normalizedName = normalize(name);
        if (Array.isArray(val)) {
          // Support values array created by autoprefixer, e.g.
          // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
          // Set them one by one, and the browser will only set those it can recognize
          for (var i = 0, len = val.length; i < len; i++) {
            el.style[normalizedName] = val[i];
          }
        } else {
          el.style[normalizedName] = val;
        }
      }
    };

    var prefixes = ['Webkit', 'Moz', 'ms'];

    var testEl;
    var normalize = cached(function (prop) {
      testEl = testEl || document.createElement('div');
      prop = camelize(prop);
      if (prop !== 'filter' && prop in testEl.style) {
        return prop;
      }
      var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
      for (var i = 0; i < prefixes.length; i++) {
        var prefixed = prefixes[i] + upper;
        if (prefixed in testEl.style) {
          return prefixed;
        }
      }
    });

    function updateStyle(oldVnode, vnode) {
      var data = vnode.data;
      var oldData = oldVnode.data;

      if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
        return;
      }

      var cur, name;
      var el = vnode.elm;
      var oldStaticStyle = oldData.staticStyle;
      var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

      // if static style exists, stylebinding already merged into it when doing normalizeStyleData
      var oldStyle = oldStaticStyle || oldStyleBinding;

      var style = normalizeStyleBinding(vnode.data.style) || {};

      // store normalized style under a different key for next diff
      // make sure to clone it if it's reactive, since the user likley wants
      // to mutate it.
      vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;

      var newStyle = getStyle(vnode, true);

      for (name in oldStyle) {
        if (isUndef(newStyle[name])) {
          setProp(el, name, '');
        }
      }
      for (name in newStyle) {
        cur = newStyle[name];
        if (cur !== oldStyle[name]) {
          // ie9 setting to null has no effect, must use empty string
          setProp(el, name, cur == null ? '' : cur);
        }
      }
    }

    var style = {
      create: updateStyle,
      update: updateStyle
    };

    /*  */

    /**
     * Add class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     */
    function addClass(el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
        return;
      }

      /* istanbul ignore else */
      if (el.classList) {
        if (cls.indexOf(' ') > -1) {
          cls.split(/\s+/).forEach(function (c) {
            return el.classList.add(c);
          });
        } else {
          el.classList.add(cls);
        }
      } else {
        var cur = " " + (el.getAttribute('class') || '') + " ";
        if (cur.indexOf(' ' + cls + ' ') < 0) {
          el.setAttribute('class', (cur + cls).trim());
        }
      }
    }

    /**
     * Remove class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     */
    function removeClass(el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
        return;
      }

      /* istanbul ignore else */
      if (el.classList) {
        if (cls.indexOf(' ') > -1) {
          cls.split(/\s+/).forEach(function (c) {
            return el.classList.remove(c);
          });
        } else {
          el.classList.remove(cls);
        }
      } else {
        var cur = " " + (el.getAttribute('class') || '') + " ";
        var tar = ' ' + cls + ' ';
        while (cur.indexOf(tar) >= 0) {
          cur = cur.replace(tar, ' ');
        }
        el.setAttribute('class', cur.trim());
      }
    }

    /*  */

    function resolveTransition(def$$1) {
      if (!def$$1) {
        return;
      }
      /* istanbul ignore else */
      if ((typeof def$$1 === 'undefined' ? 'undefined' : _typeof(def$$1)) === 'object') {
        var res = {};
        if (def$$1.css !== false) {
          extend(res, autoCssTransition(def$$1.name || 'v'));
        }
        extend(res, def$$1);
        return res;
      } else if (typeof def$$1 === 'string') {
        return autoCssTransition(def$$1);
      }
    }

    var autoCssTransition = cached(function (name) {
      return {
        enterClass: name + "-enter",
        enterToClass: name + "-enter-to",
        enterActiveClass: name + "-enter-active",
        leaveClass: name + "-leave",
        leaveToClass: name + "-leave-to",
        leaveActiveClass: name + "-leave-active"
      };
    });

    var hasTransition = inBrowser && !isIE9;
    var TRANSITION = 'transition';
    var ANIMATION = 'animation';

    // Transition property/event sniffing
    var transitionProp = 'transition';
    var transitionEndEvent = 'transitionend';
    var animationProp = 'animation';
    var animationEndEvent = 'animationend';
    if (hasTransition) {
      /* istanbul ignore if */
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        transitionProp = 'WebkitTransition';
        transitionEndEvent = 'webkitTransitionEnd';
      }
      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        animationProp = 'WebkitAnimation';
        animationEndEvent = 'webkitAnimationEnd';
      }
    }

    // binding to window is necessary to make hot reload work in IE in strict mode
    var raf = inBrowser && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout;

    function nextFrame(fn) {
      raf(function () {
        raf(fn);
      });
    }

    function addTransitionClass(el, cls) {
      (el._transitionClasses || (el._transitionClasses = [])).push(cls);
      addClass(el, cls);
    }

    function removeTransitionClass(el, cls) {
      if (el._transitionClasses) {
        remove(el._transitionClasses, cls);
      }
      removeClass(el, cls);
    }

    function whenTransitionEnds(el, expectedType, cb) {
      var ref = getTransitionInfo(el, expectedType);
      var type = ref.type;
      var timeout = ref.timeout;
      var propCount = ref.propCount;
      if (!type) {
        return cb();
      }
      var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
      var ended = 0;
      var end = function end() {
        el.removeEventListener(event, onEnd);
        cb();
      };
      var onEnd = function onEnd(e) {
        if (e.target === el) {
          if (++ended >= propCount) {
            end();
          }
        }
      };
      setTimeout(function () {
        if (ended < propCount) {
          end();
        }
      }, timeout + 1);
      el.addEventListener(event, onEnd);
    }

    var transformRE = /\b(transform|all)(,|$)/;

    function getTransitionInfo(el, expectedType) {
      var styles = window.getComputedStyle(el);
      var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
      var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
      var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      var animationDelays = styles[animationProp + 'Delay'].split(', ');
      var animationDurations = styles[animationProp + 'Duration'].split(', ');
      var animationTimeout = getTimeout(animationDelays, animationDurations);

      var type;
      var timeout = 0;
      var propCount = 0;
      /* istanbul ignore if */
      if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
          type = TRANSITION;
          timeout = transitionTimeout;
          propCount = transitionDurations.length;
        }
      } else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
          type = ANIMATION;
          timeout = animationTimeout;
          propCount = animationDurations.length;
        }
      } else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
        propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
      }
      var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
      return {
        type: type,
        timeout: timeout,
        propCount: propCount,
        hasTransform: hasTransform
      };
    }

    function getTimeout(delays, durations) {
      /* istanbul ignore next */
      while (delays.length < durations.length) {
        delays = delays.concat(delays);
      }

      return Math.max.apply(null, durations.map(function (d, i) {
        return toMs(d) + toMs(delays[i]);
      }));
    }

    function toMs(s) {
      return Number(s.slice(0, -1)) * 1000;
    }

    /*  */

    function enter(vnode, toggleDisplay) {
      var el = vnode.elm;

      // call leave callback now
      if (isDef(el._leaveCb)) {
        el._leaveCb.cancelled = true;
        el._leaveCb();
      }

      var data = resolveTransition(vnode.data.transition);
      if (isUndef(data)) {
        return;
      }

      /* istanbul ignore if */
      if (isDef(el._enterCb) || el.nodeType !== 1) {
        return;
      }

      var css = data.css;
      var type = data.type;
      var enterClass = data.enterClass;
      var enterToClass = data.enterToClass;
      var enterActiveClass = data.enterActiveClass;
      var appearClass = data.appearClass;
      var appearToClass = data.appearToClass;
      var appearActiveClass = data.appearActiveClass;
      var beforeEnter = data.beforeEnter;
      var enter = data.enter;
      var afterEnter = data.afterEnter;
      var enterCancelled = data.enterCancelled;
      var beforeAppear = data.beforeAppear;
      var appear = data.appear;
      var afterAppear = data.afterAppear;
      var appearCancelled = data.appearCancelled;
      var duration = data.duration;

      // activeInstance will always be the <transition> component managing this
      // transition. One edge case to check is when the <transition> is placed
      // as the root node of a child component. In that case we need to check
      // <transition>'s parent for appear check.
      var context = activeInstance;
      var transitionNode = activeInstance.$vnode;
      while (transitionNode && transitionNode.parent) {
        transitionNode = transitionNode.parent;
        context = transitionNode.context;
      }

      var isAppear = !context._isMounted || !vnode.isRootInsert;

      if (isAppear && !appear && appear !== '') {
        return;
      }

      var startClass = isAppear && appearClass ? appearClass : enterClass;
      var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
      var toClass = isAppear && appearToClass ? appearToClass : enterToClass;

      var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
      var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
      var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
      var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;

      var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

      if ("development" !== 'production' && explicitEnterDuration != null) {
        checkDuration(explicitEnterDuration, 'enter', vnode);
      }

      var expectsCSS = css !== false && !isIE9;
      var userWantsControl = getHookArgumentsLength(enterHook);

      var cb = el._enterCb = once(function () {
        if (expectsCSS) {
          removeTransitionClass(el, toClass);
          removeTransitionClass(el, activeClass);
        }
        if (cb.cancelled) {
          if (expectsCSS) {
            removeTransitionClass(el, startClass);
          }
          enterCancelledHook && enterCancelledHook(el);
        } else {
          afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
      });

      if (!vnode.data.show) {
        // remove pending leave element on enter by injecting an insert hook
        mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
          var parent = el.parentNode;
          var pendingNode = parent && parent._pending && parent._pending[vnode.key];
          if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
            pendingNode.elm._leaveCb();
          }
          enterHook && enterHook(el, cb);
        });
      }

      // start enter transition
      beforeEnterHook && beforeEnterHook(el);
      if (expectsCSS) {
        addTransitionClass(el, startClass);
        addTransitionClass(el, activeClass);
        nextFrame(function () {
          addTransitionClass(el, toClass);
          removeTransitionClass(el, startClass);
          if (!cb.cancelled && !userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        });
      }

      if (vnode.data.show) {
        toggleDisplay && toggleDisplay();
        enterHook && enterHook(el, cb);
      }

      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }

    function leave(vnode, rm) {
      var el = vnode.elm;

      // call enter callback now
      if (isDef(el._enterCb)) {
        el._enterCb.cancelled = true;
        el._enterCb();
      }

      var data = resolveTransition(vnode.data.transition);
      if (isUndef(data)) {
        return rm();
      }

      /* istanbul ignore if */
      if (isDef(el._leaveCb) || el.nodeType !== 1) {
        return;
      }

      var css = data.css;
      var type = data.type;
      var leaveClass = data.leaveClass;
      var leaveToClass = data.leaveToClass;
      var leaveActiveClass = data.leaveActiveClass;
      var beforeLeave = data.beforeLeave;
      var leave = data.leave;
      var afterLeave = data.afterLeave;
      var leaveCancelled = data.leaveCancelled;
      var delayLeave = data.delayLeave;
      var duration = data.duration;

      var expectsCSS = css !== false && !isIE9;
      var userWantsControl = getHookArgumentsLength(leave);

      var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

      if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
        checkDuration(explicitLeaveDuration, 'leave', vnode);
      }

      var cb = el._leaveCb = once(function () {
        if (el.parentNode && el.parentNode._pending) {
          el.parentNode._pending[vnode.key] = null;
        }
        if (expectsCSS) {
          removeTransitionClass(el, leaveToClass);
          removeTransitionClass(el, leaveActiveClass);
        }
        if (cb.cancelled) {
          if (expectsCSS) {
            removeTransitionClass(el, leaveClass);
          }
          leaveCancelled && leaveCancelled(el);
        } else {
          rm();
          afterLeave && afterLeave(el);
        }
        el._leaveCb = null;
      });

      if (delayLeave) {
        delayLeave(performLeave);
      } else {
        performLeave();
      }

      function performLeave() {
        // the delayed leave may have already been cancelled
        if (cb.cancelled) {
          return;
        }
        // record leaving element
        if (!vnode.data.show) {
          (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
        }
        beforeLeave && beforeLeave(el);
        if (expectsCSS) {
          addTransitionClass(el, leaveClass);
          addTransitionClass(el, leaveActiveClass);
          nextFrame(function () {
            addTransitionClass(el, leaveToClass);
            removeTransitionClass(el, leaveClass);
            if (!cb.cancelled && !userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          });
        }
        leave && leave(el, cb);
        if (!expectsCSS && !userWantsControl) {
          cb();
        }
      }
    }

    // only used in dev mode
    function checkDuration(val, name, vnode) {
      if (typeof val !== 'number') {
        warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
      } else if (isNaN(val)) {
        warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
      }
    }

    function isValidDuration(val) {
      return typeof val === 'number' && !isNaN(val);
    }

    /**
     * Normalize a transition hook's argument length. The hook may be:
     * - a merged hook (invoker) with the original in .fns
     * - a wrapped component method (check ._length)
     * - a plain function (.length)
     */
    function getHookArgumentsLength(fn) {
      if (isUndef(fn)) {
        return false;
      }
      var invokerFns = fn.fns;
      if (isDef(invokerFns)) {
        // invoker
        return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
      } else {
        return (fn._length || fn.length) > 1;
      }
    }

    function _enter(_, vnode) {
      if (vnode.data.show !== true) {
        enter(vnode);
      }
    }

    var transition = inBrowser ? {
      create: _enter,
      activate: _enter,
      remove: function remove$$1(vnode, rm) {
        /* istanbul ignore else */
        if (vnode.data.show !== true) {
          leave(vnode, rm);
        } else {
          rm();
        }
      }
    } : {};

    var platformModules = [attrs, klass, events, domProps, style, transition];

    /*  */

    // the directive module should be applied last, after all
    // built-in modules have been applied.
    var modules = platformModules.concat(baseModules);

    var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

    /**
     * Not type checking this file because flow doesn't like attaching
     * properties to Elements.
     */

    /* istanbul ignore if */
    if (isIE9) {
      // http://www.matts411.com/post/internet-explorer-9-oninput/
      document.addEventListener('selectionchange', function () {
        var el = document.activeElement;
        if (el && el.vmodel) {
          trigger(el, 'input');
        }
      });
    }

    var model$1 = {
      inserted: function inserted(el, binding, vnode) {
        if (vnode.tag === 'select') {
          var cb = function cb() {
            setSelected(el, binding, vnode.context);
          };
          cb();
          /* istanbul ignore if */
          if (isIE || isEdge) {
            setTimeout(cb, 0);
          }
        } else if (vnode.tag === 'textarea' || el.type === 'text' || el.type === 'password') {
          el._vModifiers = binding.modifiers;
          if (!binding.modifiers.lazy) {
            // Safari < 10.2 & UIWebView doesn't fire compositionend when
            // switching focus before confirming composition choice
            // this also fixes the issue where some browsers e.g. iOS Chrome
            // fires "change" instead of "input" on autocomplete.
            el.addEventListener('change', onCompositionEnd);
            if (!isAndroid) {
              el.addEventListener('compositionstart', onCompositionStart);
              el.addEventListener('compositionend', onCompositionEnd);
            }
            /* istanbul ignore if */
            if (isIE9) {
              el.vmodel = true;
            }
          }
        }
      },
      componentUpdated: function componentUpdated(el, binding, vnode) {
        if (vnode.tag === 'select') {
          setSelected(el, binding, vnode.context);
          // in case the options rendered by v-for have changed,
          // it's possible that the value is out-of-sync with the rendered options.
          // detect such cases and filter out values that no longer has a matching
          // option in the DOM.
          var needReset = el.multiple ? binding.value.some(function (v) {
            return hasNoMatchingOption(v, el.options);
          }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    };

    function setSelected(el, binding, vm) {
      var value = binding.value;
      var isMultiple = el.multiple;
      if (isMultiple && !Array.isArray(value)) {
        "development" !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
        return;
      }
      var selected, option;
      for (var i = 0, l = el.options.length; i < l; i++) {
        option = el.options[i];
        if (isMultiple) {
          selected = looseIndexOf(value, getValue(option)) > -1;
          if (option.selected !== selected) {
            option.selected = selected;
          }
        } else {
          if (looseEqual(getValue(option), value)) {
            if (el.selectedIndex !== i) {
              el.selectedIndex = i;
            }
            return;
          }
        }
      }
      if (!isMultiple) {
        el.selectedIndex = -1;
      }
    }

    function hasNoMatchingOption(value, options) {
      for (var i = 0, l = options.length; i < l; i++) {
        if (looseEqual(getValue(options[i]), value)) {
          return false;
        }
      }
      return true;
    }

    function getValue(option) {
      return '_value' in option ? option._value : option.value;
    }

    function onCompositionStart(e) {
      e.target.composing = true;
    }

    function onCompositionEnd(e) {
      // prevent triggering an input event for no reason
      if (!e.target.composing) {
        return;
      }
      e.target.composing = false;
      trigger(e.target, 'input');
    }

    function trigger(el, type) {
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
    }

    /*  */

    // recursively search for possible transition defined inside the component root
    function locateNode(vnode) {
      return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
    }

    var show = {
      bind: function bind(el, ref, vnode) {
        var value = ref.value;

        vnode = locateNode(vnode);
        var transition = vnode.data && vnode.data.transition;
        var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
        if (value && transition && !isIE9) {
          vnode.data.show = true;
          enter(vnode, function () {
            el.style.display = originalDisplay;
          });
        } else {
          el.style.display = value ? originalDisplay : 'none';
        }
      },

      update: function update(el, ref, vnode) {
        var value = ref.value;
        var oldValue = ref.oldValue;

        /* istanbul ignore if */
        if (value === oldValue) {
          return;
        }
        vnode = locateNode(vnode);
        var transition = vnode.data && vnode.data.transition;
        if (transition && !isIE9) {
          vnode.data.show = true;
          if (value) {
            enter(vnode, function () {
              el.style.display = el.__vOriginalDisplay;
            });
          } else {
            leave(vnode, function () {
              el.style.display = 'none';
            });
          }
        } else {
          el.style.display = value ? el.__vOriginalDisplay : 'none';
        }
      },

      unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
        if (!isDestroy) {
          el.style.display = el.__vOriginalDisplay;
        }
      }
    };

    var platformDirectives = {
      model: model$1,
      show: show
    };

    /*  */

    // Provides transition support for a single element/component.
    // supports transition mode (out-in / in-out)

    var transitionProps = {
      name: String,
      appear: Boolean,
      css: Boolean,
      mode: String,
      type: String,
      enterClass: String,
      leaveClass: String,
      enterToClass: String,
      leaveToClass: String,
      enterActiveClass: String,
      leaveActiveClass: String,
      appearClass: String,
      appearActiveClass: String,
      appearToClass: String,
      duration: [Number, String, Object]
    };

    // in case the child is also an abstract component, e.g. <keep-alive>
    // we want to recursively retrieve the real component to be rendered
    function getRealChild(vnode) {
      var compOptions = vnode && vnode.componentOptions;
      if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children));
      } else {
        return vnode;
      }
    }

    function extractTransitionData(comp) {
      var data = {};
      var options = comp.$options;
      // props
      for (var key in options.propsData) {
        data[key] = comp[key];
      }
      // events.
      // extract listeners and pass them directly to the transition methods
      var listeners = options._parentListeners;
      for (var key$1 in listeners) {
        data[camelize(key$1)] = listeners[key$1];
      }
      return data;
    }

    function placeholder(h, rawChild) {
      if (/\d-keep-alive$/.test(rawChild.tag)) {
        return h('keep-alive', {
          props: rawChild.componentOptions.propsData
        });
      }
    }

    function hasParentTransition(vnode) {
      while (vnode = vnode.parent) {
        if (vnode.data.transition) {
          return true;
        }
      }
    }

    function isSameChild(child, oldChild) {
      return oldChild.key === child.key && oldChild.tag === child.tag;
    }

    var Transition = {
      name: 'transition',
      props: transitionProps,
      abstract: true,

      render: function render(h) {
        var this$1 = this;

        var children = this.$slots.default;
        if (!children) {
          return;
        }

        // filter out text nodes (possible whitespaces)
        children = children.filter(function (c) {
          return c.tag;
        });
        /* istanbul ignore if */
        if (!children.length) {
          return;
        }

        // warn multiple elements
        if ("development" !== 'production' && children.length > 1) {
          warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
        }

        var mode = this.mode;

        // warn invalid mode
        if ("development" !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
          warn('invalid <transition> mode: ' + mode, this.$parent);
        }

        var rawChild = children[0];

        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        if (hasParentTransition(this.$vnode)) {
          return rawChild;
        }

        // apply transition data to child
        // use getRealChild() to ignore abstract components e.g. keep-alive
        var child = getRealChild(rawChild);
        /* istanbul ignore if */
        if (!child) {
          return rawChild;
        }

        if (this._leaving) {
          return placeholder(h, rawChild);
        }

        // ensure a key that is unique to the vnode type and to this transition
        // component instance. This key will be used to remove pending leaving nodes
        // during entering.
        var id = "__transition-" + this._uid + "-";
        child.key = child.key == null ? id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;

        var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
        var oldRawChild = this._vnode;
        var oldChild = getRealChild(oldRawChild);

        // mark v-show
        // so that the transition module can hand over the control to the directive
        if (child.data.directives && child.data.directives.some(function (d) {
          return d.name === 'show';
        })) {
          child.data.show = true;
        }

        if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
          // replace old child transition data with fresh one
          // important for dynamic transitions!
          var oldData = oldChild && (oldChild.data.transition = extend({}, data));
          // handle transition mode
          if (mode === 'out-in') {
            // return placeholder node and queue update when leave finishes
            this._leaving = true;
            mergeVNodeHook(oldData, 'afterLeave', function () {
              this$1._leaving = false;
              this$1.$forceUpdate();
            });
            return placeholder(h, rawChild);
          } else if (mode === 'in-out') {
            var delayedLeave;
            var performLeave = function performLeave() {
              delayedLeave();
            };
            mergeVNodeHook(data, 'afterEnter', performLeave);
            mergeVNodeHook(data, 'enterCancelled', performLeave);
            mergeVNodeHook(oldData, 'delayLeave', function (leave) {
              delayedLeave = leave;
            });
          }
        }

        return rawChild;
      }
    };

    /*  */

    // Provides transition support for list items.
    // supports move transitions using the FLIP technique.

    // Because the vdom's children update algorithm is "unstable" - i.e.
    // it doesn't guarantee the relative positioning of removed elements,
    // we force transition-group to update its children into two passes:
    // in the first pass, we remove all nodes that need to be removed,
    // triggering their leaving transition; in the second pass, we insert/move
    // into the final desired state. This way in the second pass removed
    // nodes will remain where they should be.

    var props = extend({
      tag: String,
      moveClass: String
    }, transitionProps);

    delete props.mode;

    var TransitionGroup = {
      props: props,

      render: function render(h) {
        var tag = this.tag || this.$vnode.data.tag || 'span';
        var map = Object.create(null);
        var prevChildren = this.prevChildren = this.children;
        var rawChildren = this.$slots.default || [];
        var children = this.children = [];
        var transitionData = extractTransitionData(this);

        for (var i = 0; i < rawChildren.length; i++) {
          var c = rawChildren[i];
          if (c.tag) {
            if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
              children.push(c);
              map[c.key] = c;(c.data || (c.data = {})).transition = transitionData;
            } else {
              var opts = c.componentOptions;
              var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
              warn("<transition-group> children must be keyed: <" + name + ">");
            }
          }
        }

        if (prevChildren) {
          var kept = [];
          var removed = [];
          for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
            var c$1 = prevChildren[i$1];
            c$1.data.transition = transitionData;
            c$1.data.pos = c$1.elm.getBoundingClientRect();
            if (map[c$1.key]) {
              kept.push(c$1);
            } else {
              removed.push(c$1);
            }
          }
          this.kept = h(tag, null, kept);
          this.removed = removed;
        }

        return h(tag, null, children);
      },

      beforeUpdate: function beforeUpdate() {
        // force removing pass
        this.__patch__(this._vnode, this.kept, false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
        );
        this._vnode = this.kept;
      },

      updated: function updated() {
        var children = this.prevChildren;
        var moveClass = this.moveClass || (this.name || 'v') + '-move';
        if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
          return;
        }

        // we divide the work into three loops to avoid mixing DOM reads and writes
        // in each iteration - which helps prevent layout thrashing.
        children.forEach(callPendingCbs);
        children.forEach(recordPosition);
        children.forEach(applyTranslation);

        // force reflow to put everything in position
        var body = document.body;
        var f = body.offsetHeight; // eslint-disable-line

        children.forEach(function (c) {
          if (c.data.moved) {
            var el = c.elm;
            var s = el.style;
            addTransitionClass(el, moveClass);
            s.transform = s.WebkitTransform = s.transitionDuration = '';
            el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
              if (!e || /transform$/.test(e.propertyName)) {
                el.removeEventListener(transitionEndEvent, cb);
                el._moveCb = null;
                removeTransitionClass(el, moveClass);
              }
            });
          }
        });
      },

      methods: {
        hasMove: function hasMove(el, moveClass) {
          /* istanbul ignore if */
          if (!hasTransition) {
            return false;
          }
          if (this._hasMove != null) {
            return this._hasMove;
          }
          // Detect whether an element with the move class applied has
          // CSS transitions. Since the element may be inside an entering
          // transition at this very moment, we make a clone of it and remove
          // all other transition classes applied to ensure only the move class
          // is applied.
          var clone = el.cloneNode();
          if (el._transitionClasses) {
            el._transitionClasses.forEach(function (cls) {
              removeClass(clone, cls);
            });
          }
          addClass(clone, moveClass);
          clone.style.display = 'none';
          this.$el.appendChild(clone);
          var info = getTransitionInfo(clone);
          this.$el.removeChild(clone);
          return this._hasMove = info.hasTransform;
        }
      }
    };

    function callPendingCbs(c) {
      /* istanbul ignore if */
      if (c.elm._moveCb) {
        c.elm._moveCb();
      }
      /* istanbul ignore if */
      if (c.elm._enterCb) {
        c.elm._enterCb();
      }
    }

    function recordPosition(c) {
      c.data.newPos = c.elm.getBoundingClientRect();
    }

    function applyTranslation(c) {
      var oldPos = c.data.pos;
      var newPos = c.data.newPos;
      var dx = oldPos.left - newPos.left;
      var dy = oldPos.top - newPos.top;
      if (dx || dy) {
        c.data.moved = true;
        var s = c.elm.style;
        s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
        s.transitionDuration = '0s';
      }
    }

    var platformComponents = {
      Transition: Transition,
      TransitionGroup: TransitionGroup
    };

    /*  */

    // install platform specific utils
    Vue$3.config.mustUseProp = mustUseProp;
    Vue$3.config.isReservedTag = isReservedTag;
    Vue$3.config.isReservedAttr = isReservedAttr;
    Vue$3.config.getTagNamespace = getTagNamespace;
    Vue$3.config.isUnknownElement = isUnknownElement;

    // install platform runtime directives & components
    extend(Vue$3.options.directives, platformDirectives);
    extend(Vue$3.options.components, platformComponents);

    // install platform patch function
    Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

    // public mount method
    Vue$3.prototype.$mount = function (el, hydrating) {
      el = el && inBrowser ? query(el) : undefined;
      return mountComponent(this, el, hydrating);
    };

    // devtools global hook
    /* istanbul ignore next */
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue$3);
        } else if ("development" !== 'production' && isChrome) {
          console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
        }
      }
      if ("development" !== 'production' && config.productionTip !== false && inBrowser && typeof console !== 'undefined') {
        console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
      }
    }, 0);

    /*  */

    // check whether current browser encodes a char inside attribute values
    function shouldDecode(content, encoded) {
      var div = document.createElement('div');
      div.innerHTML = "<div a=\"" + content + "\">";
      return div.innerHTML.indexOf(encoded) > 0;
    }

    // #3663
    // IE encodes newlines inside attribute values while other browsers don't
    var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

    /*  */

    var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr');

    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

    // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
    // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
    var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');

    /*  */

    var decoder;

    function decode(html) {
      decoder = decoder || document.createElement('div');
      decoder.innerHTML = html;
      return decoder.textContent;
    }

    /**
     * Not type-checking this file because it's mostly vendor code.
     */

    /*!
     * HTML Parser By John Resig (ejohn.org)
     * Modified by Juriy "kangax" Zaytsev
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     */

    // Regular Expressions for parsing tags and attributes
    var singleAttrIdentifier = /([^\s"'<>/=]+)/;
    var singleAttrAssign = /(?:=)/;
    var singleAttrValues = [
    // attr value double quotes
    /"([^"]*)"+/.source,
    // attr value, single quotes
    /'([^']*)'+/.source,
    // attr value, no quotes
    /([^\s"'=<>`]+)/.source];
    var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');

    // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
    // but for Vue templates we can enforce a simple charset
    var ncname = '[a-zA-Z_][\\w\\-\\.]*';
    var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
    var startTagOpen = new RegExp('^<' + qnameCapture);
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
    var doctype = /^<!DOCTYPE [^>]+>/i;
    var comment = /^<!--/;
    var conditionalComment = /^<!\[/;

    var IS_REGEX_CAPTURING_BROKEN = false;
    'x'.replace(/x(.)?/g, function (m, g) {
      IS_REGEX_CAPTURING_BROKEN = g === '';
    });

    // Special Elements (can contain anything)
    var isPlainTextElement = makeMap('script,style,textarea', true);
    var reCache = {};

    var decodingMap = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&amp;': '&',
      '&#10;': '\n'
    };
    var encodedAttr = /&(?:lt|gt|quot|amp);/g;
    var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

    function decodeAttr(value, shouldDecodeNewlines) {
      var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
      return value.replace(re, function (match) {
        return decodingMap[match];
      });
    }

    function parseHTML(html, options) {
      var stack = [];
      var expectHTML = options.expectHTML;
      var isUnaryTag$$1 = options.isUnaryTag || no;
      var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
      var index = 0;
      var last, lastTag;
      while (html) {
        last = html;
        // Make sure we're not in a plaintext content element like script/style
        if (!lastTag || !isPlainTextElement(lastTag)) {
          var textEnd = html.indexOf('<');
          if (textEnd === 0) {
            // Comment:
            if (comment.test(html)) {
              var commentEnd = html.indexOf('-->');

              if (commentEnd >= 0) {
                advance(commentEnd + 3);
                continue;
              }
            }

            // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
            if (conditionalComment.test(html)) {
              var conditionalEnd = html.indexOf(']>');

              if (conditionalEnd >= 0) {
                advance(conditionalEnd + 2);
                continue;
              }
            }

            // Doctype:
            var doctypeMatch = html.match(doctype);
            if (doctypeMatch) {
              advance(doctypeMatch[0].length);
              continue;
            }

            // End tag:
            var endTagMatch = html.match(endTag);
            if (endTagMatch) {
              var curIndex = index;
              advance(endTagMatch[0].length);
              parseEndTag(endTagMatch[1], curIndex, index);
              continue;
            }

            // Start tag:
            var startTagMatch = parseStartTag();
            if (startTagMatch) {
              handleStartTag(startTagMatch);
              continue;
            }
          }

          var text = void 0,
              rest$1 = void 0,
              next = void 0;
          if (textEnd >= 0) {
            rest$1 = html.slice(textEnd);
            while (!endTag.test(rest$1) && !startTagOpen.test(rest$1) && !comment.test(rest$1) && !conditionalComment.test(rest$1)) {
              // < in plain text, be forgiving and treat it as text
              next = rest$1.indexOf('<', 1);
              if (next < 0) {
                break;
              }
              textEnd += next;
              rest$1 = html.slice(textEnd);
            }
            text = html.substring(0, textEnd);
            advance(textEnd);
          }

          if (textEnd < 0) {
            text = html;
            html = '';
          }

          if (options.chars && text) {
            options.chars(text);
          }
        } else {
          var stackedTag = lastTag.toLowerCase();
          var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
          var endTagLength = 0;
          var rest = html.replace(reStackedTag, function (all, text, endTag) {
            endTagLength = endTag.length;
            if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
              text = text.replace(/<!--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
            }
            if (options.chars) {
              options.chars(text);
            }
            return '';
          });
          index += html.length - rest.length;
          html = rest;
          parseEndTag(stackedTag, index - endTagLength, index);
        }

        if (html === last) {
          options.chars && options.chars(html);
          if ("development" !== 'production' && !stack.length && options.warn) {
            options.warn("Mal-formatted tag at end of template: \"" + html + "\"");
          }
          break;
        }
      }

      // Clean up any remaining tags
      parseEndTag();

      function advance(n) {
        index += n;
        html = html.substring(n);
      }

      function parseStartTag() {
        var start = html.match(startTagOpen);
        if (start) {
          var match = {
            tagName: start[1],
            attrs: [],
            start: index
          };
          advance(start[0].length);
          var end, attr;
          while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            advance(attr[0].length);
            match.attrs.push(attr);
          }
          if (end) {
            match.unarySlash = end[1];
            advance(end[0].length);
            match.end = index;
            return match;
          }
        }
      }

      function handleStartTag(match) {
        var tagName = match.tagName;
        var unarySlash = match.unarySlash;

        if (expectHTML) {
          if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
            parseEndTag(lastTag);
          }
          if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
            parseEndTag(tagName);
          }
        }

        var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

        var l = match.attrs.length;
        var attrs = new Array(l);
        for (var i = 0; i < l; i++) {
          var args = match.attrs[i];
          // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
          if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
            if (args[3] === '') {
              delete args[3];
            }
            if (args[4] === '') {
              delete args[4];
            }
            if (args[5] === '') {
              delete args[5];
            }
          }
          var value = args[3] || args[4] || args[5] || '';
          attrs[i] = {
            name: args[1],
            value: decodeAttr(value, options.shouldDecodeNewlines)
          };
        }

        if (!unary) {
          stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
          lastTag = tagName;
        }

        if (options.start) {
          options.start(tagName, attrs, unary, match.start, match.end);
        }
      }

      function parseEndTag(tagName, start, end) {
        var pos, lowerCasedTagName;
        if (start == null) {
          start = index;
        }
        if (end == null) {
          end = index;
        }

        if (tagName) {
          lowerCasedTagName = tagName.toLowerCase();
        }

        // Find the closest opened tag of the same type
        if (tagName) {
          for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].lowerCasedTag === lowerCasedTagName) {
              break;
            }
          }
        } else {
          // If no tag name is provided, clean shop
          pos = 0;
        }

        if (pos >= 0) {
          // Close all the open elements, up the stack
          for (var i = stack.length - 1; i >= pos; i--) {
            if ("development" !== 'production' && (i > pos || !tagName) && options.warn) {
              options.warn("tag <" + stack[i].tag + "> has no matching end tag.");
            }
            if (options.end) {
              options.end(stack[i].tag, start, end);
            }
          }

          // Remove the open elements from the stack
          stack.length = pos;
          lastTag = pos && stack[pos - 1].tag;
        } else if (lowerCasedTagName === 'br') {
          if (options.start) {
            options.start(tagName, [], true, start, end);
          }
        } else if (lowerCasedTagName === 'p') {
          if (options.start) {
            options.start(tagName, [], false, start, end);
          }
          if (options.end) {
            options.end(tagName, start, end);
          }
        }
      }
    }

    /*  */

    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

    var buildRegex = cached(function (delimiters) {
      var open = delimiters[0].replace(regexEscapeRE, '\\$&');
      var close = delimiters[1].replace(regexEscapeRE, '\\$&');
      return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
    });

    function parseText(text, delimiters) {
      var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
      if (!tagRE.test(text)) {
        return;
      }
      var tokens = [];
      var lastIndex = tagRE.lastIndex = 0;
      var match, index;
      while (match = tagRE.exec(text)) {
        index = match.index;
        // push text token
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        // tag token
        var exp = parseFilters(match[1].trim());
        tokens.push("_s(" + exp + ")");
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return tokens.join('+');
    }

    /*  */

    var onRE = /^@|^v-on:/;
    var dirRE = /^v-|^@|^:/;
    var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
    var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

    var argRE = /:(.*)$/;
    var bindRE = /^:|^v-bind:/;
    var modifierRE = /\.[^.]+/g;

    var decodeHTMLCached = cached(decode);

    // configurable state
    var warn$2;
    var delimiters;
    var transforms;
    var preTransforms;
    var postTransforms;
    var platformIsPreTag;
    var platformMustUseProp;
    var platformGetTagNamespace;

    /**
     * Convert HTML string to AST.
     */
    function parse(template, options) {
      warn$2 = options.warn || baseWarn;
      platformGetTagNamespace = options.getTagNamespace || no;
      platformMustUseProp = options.mustUseProp || no;
      platformIsPreTag = options.isPreTag || no;
      preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
      transforms = pluckModuleFunction(options.modules, 'transformNode');
      postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
      delimiters = options.delimiters;

      var stack = [];
      var preserveWhitespace = options.preserveWhitespace !== false;
      var root;
      var currentParent;
      var inVPre = false;
      var inPre = false;
      var warned = false;

      function warnOnce(msg) {
        if (!warned) {
          warned = true;
          warn$2(msg);
        }
      }

      function endPre(element) {
        // check pre state
        if (element.pre) {
          inVPre = false;
        }
        if (platformIsPreTag(element.tag)) {
          inPre = false;
        }
      }

      parseHTML(template, {
        warn: warn$2,
        expectHTML: options.expectHTML,
        isUnaryTag: options.isUnaryTag,
        canBeLeftOpenTag: options.canBeLeftOpenTag,
        shouldDecodeNewlines: options.shouldDecodeNewlines,
        start: function start(tag, attrs, unary) {
          // check namespace.
          // inherit parent ns if there is one
          var ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);

          // handle IE svg bug
          /* istanbul ignore if */
          if (isIE && ns === 'svg') {
            attrs = guardIESVGBug(attrs);
          }

          var element = {
            type: 1,
            tag: tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs),
            parent: currentParent,
            children: []
          };
          if (ns) {
            element.ns = ns;
          }

          if (isForbiddenTag(element) && !isServerRendering()) {
            element.forbidden = true;
            "development" !== 'production' && warn$2('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + "<" + tag + ">" + ', as they will not be parsed.');
          }

          // apply pre-transforms
          for (var i = 0; i < preTransforms.length; i++) {
            preTransforms[i](element, options);
          }

          if (!inVPre) {
            processPre(element);
            if (element.pre) {
              inVPre = true;
            }
          }
          if (platformIsPreTag(element.tag)) {
            inPre = true;
          }
          if (inVPre) {
            processRawAttrs(element);
          } else {
            processFor(element);
            processIf(element);
            processOnce(element);
            processKey(element);

            // determine whether this is a plain element after
            // removing structural attributes
            element.plain = !element.key && !attrs.length;

            processRef(element);
            processSlot(element);
            processComponent(element);
            for (var i$1 = 0; i$1 < transforms.length; i$1++) {
              transforms[i$1](element, options);
            }
            processAttrs(element);
          }

          function checkRootConstraints(el) {
            {
              if (el.tag === 'slot' || el.tag === 'template') {
                warnOnce("Cannot use <" + el.tag + "> as component root element because it may " + 'contain multiple nodes.');
              }
              if (el.attrsMap.hasOwnProperty('v-for')) {
                warnOnce('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.');
              }
            }
          }

          // tree management
          if (!root) {
            root = element;
            checkRootConstraints(root);
          } else if (!stack.length) {
            // allow root elements with v-if, v-else-if and v-else
            if (root.if && (element.elseif || element.else)) {
              checkRootConstraints(element);
              addIfCondition(root, {
                exp: element.elseif,
                block: element
              });
            } else {
              warnOnce("Component template should contain exactly one root element. " + "If you are using v-if on multiple elements, " + "use v-else-if to chain them instead.");
            }
          }
          if (currentParent && !element.forbidden) {
            if (element.elseif || element.else) {
              processIfConditions(element, currentParent);
            } else if (element.slotScope) {
              // scoped slot
              currentParent.plain = false;
              var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
            } else {
              currentParent.children.push(element);
              element.parent = currentParent;
            }
          }
          if (!unary) {
            currentParent = element;
            stack.push(element);
          } else {
            endPre(element);
          }
          // apply post-transforms
          for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
            postTransforms[i$2](element, options);
          }
        },

        end: function end() {
          // remove trailing whitespace
          var element = stack[stack.length - 1];
          var lastNode = element.children[element.children.length - 1];
          if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
            element.children.pop();
          }
          // pop stack
          stack.length -= 1;
          currentParent = stack[stack.length - 1];
          endPre(element);
        },

        chars: function chars(text) {
          if (!currentParent) {
            {
              if (text === template) {
                warnOnce('Component template requires a root element, rather than just text.');
              } else if (text = text.trim()) {
                warnOnce("text \"" + text + "\" outside root element will be ignored.");
              }
            }
            return;
          }
          // IE textarea placeholder bug
          /* istanbul ignore if */
          if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
            return;
          }
          var children = currentParent.children;
          text = inPre || text.trim() ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
          // only preserve whitespace if its not right after a starting tag
          : preserveWhitespace && children.length ? ' ' : '';
          if (text) {
            var expression;
            if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
              children.push({
                type: 2,
                expression: expression,
                text: text
              });
            } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
              children.push({
                type: 3,
                text: text
              });
            }
          }
        }
      });
      return root;
    }

    function processPre(el) {
      if (getAndRemoveAttr(el, 'v-pre') != null) {
        el.pre = true;
      }
    }

    function processRawAttrs(el) {
      var l = el.attrsList.length;
      if (l) {
        var attrs = el.attrs = new Array(l);
        for (var i = 0; i < l; i++) {
          attrs[i] = {
            name: el.attrsList[i].name,
            value: JSON.stringify(el.attrsList[i].value)
          };
        }
      } else if (!el.pre) {
        // non root node in pre blocks with no attributes
        el.plain = true;
      }
    }

    function processKey(el) {
      var exp = getBindingAttr(el, 'key');
      if (exp) {
        if ("development" !== 'production' && el.tag === 'template') {
          warn$2("<template> cannot be keyed. Place the key on real elements instead.");
        }
        el.key = exp;
      }
    }

    function processRef(el) {
      var ref = getBindingAttr(el, 'ref');
      if (ref) {
        el.ref = ref;
        el.refInFor = checkInFor(el);
      }
    }

    function processFor(el) {
      var exp;
      if (exp = getAndRemoveAttr(el, 'v-for')) {
        var inMatch = exp.match(forAliasRE);
        if (!inMatch) {
          "development" !== 'production' && warn$2("Invalid v-for expression: " + exp);
          return;
        }
        el.for = inMatch[2].trim();
        var alias = inMatch[1].trim();
        var iteratorMatch = alias.match(forIteratorRE);
        if (iteratorMatch) {
          el.alias = iteratorMatch[1].trim();
          el.iterator1 = iteratorMatch[2].trim();
          if (iteratorMatch[3]) {
            el.iterator2 = iteratorMatch[3].trim();
          }
        } else {
          el.alias = alias;
        }
      }
    }

    function processIf(el) {
      var exp = getAndRemoveAttr(el, 'v-if');
      if (exp) {
        el.if = exp;
        addIfCondition(el, {
          exp: exp,
          block: el
        });
      } else {
        if (getAndRemoveAttr(el, 'v-else') != null) {
          el.else = true;
        }
        var elseif = getAndRemoveAttr(el, 'v-else-if');
        if (elseif) {
          el.elseif = elseif;
        }
      }
    }

    function processIfConditions(el, parent) {
      var prev = findPrevElement(parent.children);
      if (prev && prev.if) {
        addIfCondition(prev, {
          exp: el.elseif,
          block: el
        });
      } else {
        warn$2("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " + "used on element <" + el.tag + "> without corresponding v-if.");
      }
    }

    function findPrevElement(children) {
      var i = children.length;
      while (i--) {
        if (children[i].type === 1) {
          return children[i];
        } else {
          if ("development" !== 'production' && children[i].text !== ' ') {
            warn$2("text \"" + children[i].text.trim() + "\" between v-if and v-else(-if) " + "will be ignored.");
          }
          children.pop();
        }
      }
    }

    function addIfCondition(el, condition) {
      if (!el.ifConditions) {
        el.ifConditions = [];
      }
      el.ifConditions.push(condition);
    }

    function processOnce(el) {
      var once$$1 = getAndRemoveAttr(el, 'v-once');
      if (once$$1 != null) {
        el.once = true;
      }
    }

    function processSlot(el) {
      if (el.tag === 'slot') {
        el.slotName = getBindingAttr(el, 'name');
        if ("development" !== 'production' && el.key) {
          warn$2("`key` does not work on <slot> because slots are abstract outlets " + "and can possibly expand into multiple elements. " + "Use the key on a wrapping element instead.");
        }
      } else {
        var slotTarget = getBindingAttr(el, 'slot');
        if (slotTarget) {
          el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
        }
        if (el.tag === 'template') {
          el.slotScope = getAndRemoveAttr(el, 'scope');
        }
      }
    }

    function processComponent(el) {
      var binding;
      if (binding = getBindingAttr(el, 'is')) {
        el.component = binding;
      }
      if (getAndRemoveAttr(el, 'inline-template') != null) {
        el.inlineTemplate = true;
      }
    }

    function processAttrs(el) {
      var list = el.attrsList;
      var i, l, name, rawName, value, modifiers, isProp;
      for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name;
        value = list[i].value;
        if (dirRE.test(name)) {
          // mark element as dynamic
          el.hasBindings = true;
          // modifiers
          modifiers = parseModifiers(name);
          if (modifiers) {
            name = name.replace(modifierRE, '');
          }
          if (bindRE.test(name)) {
            // v-bind
            name = name.replace(bindRE, '');
            value = parseFilters(value);
            isProp = false;
            if (modifiers) {
              if (modifiers.prop) {
                isProp = true;
                name = camelize(name);
                if (name === 'innerHtml') {
                  name = 'innerHTML';
                }
              }
              if (modifiers.camel) {
                name = camelize(name);
              }
              if (modifiers.sync) {
                addHandler(el, "update:" + camelize(name), genAssignmentCode(value, "$event"));
              }
            }
            if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
              addProp(el, name, value);
            } else {
              addAttr(el, name, value);
            }
          } else if (onRE.test(name)) {
            // v-on
            name = name.replace(onRE, '');
            addHandler(el, name, value, modifiers, false, warn$2);
          } else {
            // normal directives
            name = name.replace(dirRE, '');
            // parse arg
            var argMatch = name.match(argRE);
            var arg = argMatch && argMatch[1];
            if (arg) {
              name = name.slice(0, -(arg.length + 1));
            }
            addDirective(el, name, rawName, value, arg, modifiers);
            if ("development" !== 'production' && name === 'model') {
              checkForAliasModel(el, value);
            }
          }
        } else {
          // literal attribute
          {
            var expression = parseText(value, delimiters);
            if (expression) {
              warn$2(name + "=\"" + value + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.');
            }
          }
          addAttr(el, name, JSON.stringify(value));
        }
      }
    }

    function checkInFor(el) {
      var parent = el;
      while (parent) {
        if (parent.for !== undefined) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    }

    function parseModifiers(name) {
      var match = name.match(modifierRE);
      if (match) {
        var ret = {};
        match.forEach(function (m) {
          ret[m.slice(1)] = true;
        });
        return ret;
      }
    }

    function makeAttrsMap(attrs) {
      var map = {};
      for (var i = 0, l = attrs.length; i < l; i++) {
        if ("development" !== 'production' && map[attrs[i].name] && !isIE && !isEdge) {
          warn$2('duplicate attribute: ' + attrs[i].name);
        }
        map[attrs[i].name] = attrs[i].value;
      }
      return map;
    }

    // for script (e.g. type="x/template") or style, do not decode content
    function isTextTag(el) {
      return el.tag === 'script' || el.tag === 'style';
    }

    function isForbiddenTag(el) {
      return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
    }

    var ieNSBug = /^xmlns:NS\d+/;
    var ieNSPrefix = /^NS\d+:/;

    /* istanbul ignore next */
    function guardIESVGBug(attrs) {
      var res = [];
      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        if (!ieNSBug.test(attr.name)) {
          attr.name = attr.name.replace(ieNSPrefix, '');
          res.push(attr);
        }
      }
      return res;
    }

    function checkForAliasModel(el, value) {
      var _el = el;
      while (_el) {
        if (_el.for && _el.alias === value) {
          warn$2("<" + el.tag + " v-model=\"" + value + "\">: " + "You are binding v-model directly to a v-for iteration alias. " + "This will not be able to modify the v-for source array because " + "writing to the alias is like modifying a function local variable. " + "Consider using an array of objects and use v-model on an object property instead.");
        }
        _el = _el.parent;
      }
    }

    /*  */

    var isStaticKey;
    var isPlatformReservedTag;

    var genStaticKeysCached = cached(genStaticKeys$1);

    /**
     * Goal of the optimizer: walk the generated template AST tree
     * and detect sub-trees that are purely static, i.e. parts of
     * the DOM that never needs to change.
     *
     * Once we detect these sub-trees, we can:
     *
     * 1. Hoist them into constants, so that we no longer need to
     *    create fresh nodes for them on each re-render;
     * 2. Completely skip them in the patching process.
     */
    function optimize(root, options) {
      if (!root) {
        return;
      }
      isStaticKey = genStaticKeysCached(options.staticKeys || '');
      isPlatformReservedTag = options.isReservedTag || no;
      // first pass: mark all non-static nodes.
      markStatic$1(root);
      // second pass: mark static roots.
      markStaticRoots(root, false);
    }

    function genStaticKeys$1(keys) {
      return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs' + (keys ? ',' + keys : ''));
    }

    function markStatic$1(node) {
      node.static = isStatic(node);
      if (node.type === 1) {
        // do not make component slot content static. this avoids
        // 1. components not able to mutate slot nodes
        // 2. static slot content fails for hot-reloading
        if (!isPlatformReservedTag(node.tag) && node.tag !== 'slot' && node.attrsMap['inline-template'] == null) {
          return;
        }
        for (var i = 0, l = node.children.length; i < l; i++) {
          var child = node.children[i];
          markStatic$1(child);
          if (!child.static) {
            node.static = false;
          }
        }
      }
    }

    function markStaticRoots(node, isInFor) {
      if (node.type === 1) {
        if (node.static || node.once) {
          node.staticInFor = isInFor;
        }
        // For a node to qualify as a static root, it should have children that
        // are not just static text. Otherwise the cost of hoisting out will
        // outweigh the benefits and it's better off to just always render it fresh.
        if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
          node.staticRoot = true;
          return;
        } else {
          node.staticRoot = false;
        }
        if (node.children) {
          for (var i = 0, l = node.children.length; i < l; i++) {
            markStaticRoots(node.children[i], isInFor || !!node.for);
          }
        }
        if (node.ifConditions) {
          walkThroughConditionsBlocks(node.ifConditions, isInFor);
        }
      }
    }

    function walkThroughConditionsBlocks(conditionBlocks, isInFor) {
      for (var i = 1, len = conditionBlocks.length; i < len; i++) {
        markStaticRoots(conditionBlocks[i].block, isInFor);
      }
    }

    function isStatic(node) {
      if (node.type === 2) {
        // expression
        return false;
      }
      if (node.type === 3) {
        // text
        return true;
      }
      return !!(node.pre || !node.hasBindings && // no dynamic bindings
      !node.if && !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) && Object.keys(node).every(isStaticKey));
    }

    function isDirectChildOfTemplateFor(node) {
      while (node.parent) {
        node = node.parent;
        if (node.tag !== 'template') {
          return false;
        }
        if (node.for) {
          return true;
        }
      }
      return false;
    }

    /*  */

    var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
    var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

    // keyCode aliases
    var keyCodes = {
      esc: 27,
      tab: 9,
      enter: 13,
      space: 32,
      up: 38,
      left: 37,
      right: 39,
      down: 40,
      'delete': [8, 46]
    };

    // #4868: modifiers that prevent the execution of the listener
    // need to explicitly return null so that we can determine whether to remove
    // the listener for .once
    var genGuard = function genGuard(condition) {
      return "if(" + condition + ")return null;";
    };

    var modifierCode = {
      stop: '$event.stopPropagation();',
      prevent: '$event.preventDefault();',
      self: genGuard("$event.target !== $event.currentTarget"),
      ctrl: genGuard("!$event.ctrlKey"),
      shift: genGuard("!$event.shiftKey"),
      alt: genGuard("!$event.altKey"),
      meta: genGuard("!$event.metaKey"),
      left: genGuard("'button' in $event && $event.button !== 0"),
      middle: genGuard("'button' in $event && $event.button !== 1"),
      right: genGuard("'button' in $event && $event.button !== 2")
    };

    function genHandlers(events, isNative, warn) {
      var res = isNative ? 'nativeOn:{' : 'on:{';
      for (var name in events) {
        var handler = events[name];
        // #5330: warn click.right, since right clicks do not actually fire click events.
        if ("development" !== 'production' && name === 'click' && handler && handler.modifiers && handler.modifiers.right) {
          warn("Use \"contextmenu\" instead of \"click.right\" since right clicks " + "do not actually fire \"click\" events.");
        }
        res += "\"" + name + "\":" + genHandler(name, handler) + ",";
      }
      return res.slice(0, -1) + '}';
    }

    function genHandler(name, handler) {
      if (!handler) {
        return 'function(){}';
      }

      if (Array.isArray(handler)) {
        return "[" + handler.map(function (handler) {
          return genHandler(name, handler);
        }).join(',') + "]";
      }

      var isMethodPath = simplePathRE.test(handler.value);
      var isFunctionExpression = fnExpRE.test(handler.value);

      if (!handler.modifiers) {
        return isMethodPath || isFunctionExpression ? handler.value : "function($event){" + handler.value + "}"; // inline statement
      } else {
        var code = '';
        var genModifierCode = '';
        var keys = [];
        for (var key in handler.modifiers) {
          if (modifierCode[key]) {
            genModifierCode += modifierCode[key];
            // left/right
            if (keyCodes[key]) {
              keys.push(key);
            }
          } else {
            keys.push(key);
          }
        }
        if (keys.length) {
          code += genKeyFilter(keys);
        }
        // Make sure modifiers like prevent and stop get executed after key filtering
        if (genModifierCode) {
          code += genModifierCode;
        }
        var handlerCode = isMethodPath ? handler.value + '($event)' : isFunctionExpression ? "(" + handler.value + ")($event)" : handler.value;
        return "function($event){" + code + handlerCode + "}";
      }
    }

    function genKeyFilter(keys) {
      return "if(!('button' in $event)&&" + keys.map(genFilterCode).join('&&') + ")return null;";
    }

    function genFilterCode(key) {
      var keyVal = parseInt(key, 10);
      if (keyVal) {
        return "$event.keyCode!==" + keyVal;
      }
      var alias = keyCodes[key];
      return "_k($event.keyCode," + JSON.stringify(key) + (alias ? ',' + JSON.stringify(alias) : '') + ")";
    }

    /*  */

    function bind$1(el, dir) {
      el.wrapData = function (code) {
        return "_b(" + code + ",'" + el.tag + "'," + dir.value + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")";
      };
    }

    /*  */

    var baseDirectives = {
      bind: bind$1,
      cloak: noop
    };

    /*  */

    // configurable state
    var warn$3;
    var transforms$1;
    var dataGenFns;
    var platformDirectives$1;
    var isPlatformReservedTag$1;
    var staticRenderFns;
    var onceCount;
    var currentOptions;

    function generate(ast, options) {
      // save previous staticRenderFns so generate calls can be nested
      var prevStaticRenderFns = staticRenderFns;
      var currentStaticRenderFns = staticRenderFns = [];
      var prevOnceCount = onceCount;
      onceCount = 0;
      currentOptions = options;
      warn$3 = options.warn || baseWarn;
      transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
      dataGenFns = pluckModuleFunction(options.modules, 'genData');
      platformDirectives$1 = options.directives || {};
      isPlatformReservedTag$1 = options.isReservedTag || no;
      var code = ast ? genElement(ast) : '_c("div")';
      staticRenderFns = prevStaticRenderFns;
      onceCount = prevOnceCount;
      return {
        render: "with(this){return " + code + "}",
        staticRenderFns: currentStaticRenderFns
      };
    }

    function genElement(el) {
      if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el);
      } else if (el.once && !el.onceProcessed) {
        return genOnce(el);
      } else if (el.for && !el.forProcessed) {
        return genFor(el);
      } else if (el.if && !el.ifProcessed) {
        return genIf(el);
      } else if (el.tag === 'template' && !el.slotTarget) {
        return genChildren(el) || 'void 0';
      } else if (el.tag === 'slot') {
        return genSlot(el);
      } else {
        // component or element
        var code;
        if (el.component) {
          code = genComponent(el.component, el);
        } else {
          var data = el.plain ? undefined : genData(el);

          var children = el.inlineTemplate ? null : genChildren(el, true);
          code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
        }
        // module transforms
        for (var i = 0; i < transforms$1.length; i++) {
          code = transforms$1[i](el, code);
        }
        return code;
      }
    }

    // hoist static sub-trees out
    function genStatic(el) {
      el.staticProcessed = true;
      staticRenderFns.push("with(this){return " + genElement(el) + "}");
      return "_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
    }

    // v-once
    function genOnce(el) {
      el.onceProcessed = true;
      if (el.if && !el.ifProcessed) {
        return genIf(el);
      } else if (el.staticInFor) {
        var key = '';
        var parent = el.parent;
        while (parent) {
          if (parent.for) {
            key = parent.key;
            break;
          }
          parent = parent.parent;
        }
        if (!key) {
          "development" !== 'production' && warn$3("v-once can only be used inside v-for that is keyed. ");
          return genElement(el);
        }
        return "_o(" + genElement(el) + "," + onceCount++ + (key ? "," + key : "") + ")";
      } else {
        return genStatic(el);
      }
    }

    function genIf(el) {
      el.ifProcessed = true; // avoid recursion
      return genIfConditions(el.ifConditions.slice());
    }

    function genIfConditions(conditions) {
      if (!conditions.length) {
        return '_e()';
      }

      var condition = conditions.shift();
      if (condition.exp) {
        return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions);
      } else {
        return "" + genTernaryExp(condition.block);
      }

      // v-if with v-once should generate code like (a)?_m(0):_m(1)
      function genTernaryExp(el) {
        return el.once ? genOnce(el) : genElement(el);
      }
    }

    function genFor(el) {
      var exp = el.for;
      var alias = el.alias;
      var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
      var iterator2 = el.iterator2 ? "," + el.iterator2 : '';

      if ("development" !== 'production' && maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key) {
        warn$3("<" + el.tag + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " + "v-for should have explicit keys. " + "See https://vuejs.org/guide/list.html#key for more info.", true /* tip */
        );
      }

      el.forProcessed = true; // avoid recursion
      return "_l((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + genElement(el) + '})';
    }

    function genData(el) {
      var data = '{';

      // directives first.
      // directives may mutate the el's other properties before they are generated.
      var dirs = genDirectives(el);
      if (dirs) {
        data += dirs + ',';
      }

      // key
      if (el.key) {
        data += "key:" + el.key + ",";
      }
      // ref
      if (el.ref) {
        data += "ref:" + el.ref + ",";
      }
      if (el.refInFor) {
        data += "refInFor:true,";
      }
      // pre
      if (el.pre) {
        data += "pre:true,";
      }
      // record original tag name for components using "is" attribute
      if (el.component) {
        data += "tag:\"" + el.tag + "\",";
      }
      // module data generation functions
      for (var i = 0; i < dataGenFns.length; i++) {
        data += dataGenFns[i](el);
      }
      // attributes
      if (el.attrs) {
        data += "attrs:{" + genProps(el.attrs) + "},";
      }
      // DOM props
      if (el.props) {
        data += "domProps:{" + genProps(el.props) + "},";
      }
      // event handlers
      if (el.events) {
        data += genHandlers(el.events, false, warn$3) + ",";
      }
      if (el.nativeEvents) {
        data += genHandlers(el.nativeEvents, true, warn$3) + ",";
      }
      // slot target
      if (el.slotTarget) {
        data += "slot:" + el.slotTarget + ",";
      }
      // scoped slots
      if (el.scopedSlots) {
        data += genScopedSlots(el.scopedSlots) + ",";
      }
      // component v-model
      if (el.model) {
        data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},";
      }
      // inline-template
      if (el.inlineTemplate) {
        var inlineTemplate = genInlineTemplate(el);
        if (inlineTemplate) {
          data += inlineTemplate + ",";
        }
      }
      data = data.replace(/,$/, '') + '}';
      // v-bind data wrap
      if (el.wrapData) {
        data = el.wrapData(data);
      }
      return data;
    }

    function genDirectives(el) {
      var dirs = el.directives;
      if (!dirs) {
        return;
      }
      var res = 'directives:[';
      var hasRuntime = false;
      var i, l, dir, needRuntime;
      for (i = 0, l = dirs.length; i < l; i++) {
        dir = dirs[i];
        needRuntime = true;
        var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
        if (gen) {
          // compile-time directive that manipulates AST.
          // returns true if it also needs a runtime counterpart.
          needRuntime = !!gen(el, dir, warn$3);
        }
        if (needRuntime) {
          hasRuntime = true;
          res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:\"" + dir.arg + "\"" : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},";
        }
      }
      if (hasRuntime) {
        return res.slice(0, -1) + ']';
      }
    }

    function genInlineTemplate(el) {
      var ast = el.children[0];
      if ("development" !== 'production' && (el.children.length > 1 || ast.type !== 1)) {
        warn$3('Inline-template components must have exactly one child element.');
      }
      if (ast.type === 1) {
        var inlineRenderFns = generate(ast, currentOptions);
        return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function (code) {
          return "function(){" + code + "}";
        }).join(',') + "]}";
      }
    }

    function genScopedSlots(slots) {
      return "scopedSlots:_u([" + Object.keys(slots).map(function (key) {
        return genScopedSlot(key, slots[key]);
      }).join(',') + "])";
    }

    function genScopedSlot(key, el) {
      if (el.for && !el.forProcessed) {
        return genForScopedSlot(key, el);
      }
      return "{key:" + key + ",fn:function(" + String(el.attrsMap.scope) + "){" + "return " + (el.tag === 'template' ? genChildren(el) || 'void 0' : genElement(el)) + "}}";
    }

    function genForScopedSlot(key, el) {
      var exp = el.for;
      var alias = el.alias;
      var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
      var iterator2 = el.iterator2 ? "," + el.iterator2 : '';
      el.forProcessed = true; // avoid recursion
      return "_l((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + genScopedSlot(key, el) + '})';
    }

    function genChildren(el, checkSkip) {
      var children = el.children;
      if (children.length) {
        var el$1 = children[0];
        // optimize single v-for
        if (children.length === 1 && el$1.for && el$1.tag !== 'template' && el$1.tag !== 'slot') {
          return genElement(el$1);
        }
        var normalizationType = checkSkip ? getNormalizationType(children) : 0;
        return "[" + children.map(genNode).join(',') + "]" + (normalizationType ? "," + normalizationType : '');
      }
    }

    // determine the normalization needed for the children array.
    // 0: no normalization needed
    // 1: simple normalization needed (possible 1-level deep nested array)
    // 2: full normalization needed
    function getNormalizationType(children) {
      var res = 0;
      for (var i = 0; i < children.length; i++) {
        var el = children[i];
        if (el.type !== 1) {
          continue;
        }
        if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
          return needsNormalization(c.block);
        })) {
          res = 2;
          break;
        }
        if (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function (c) {
          return maybeComponent(c.block);
        })) {
          res = 1;
        }
      }
      return res;
    }

    function needsNormalization(el) {
      return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
    }

    function maybeComponent(el) {
      return !isPlatformReservedTag$1(el.tag);
    }

    function genNode(node) {
      if (node.type === 1) {
        return genElement(node);
      } else {
        return genText(node);
      }
    }

    function genText(text) {
      return "_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
      : transformSpecialNewlines(JSON.stringify(text.text))) + ")";
    }

    function genSlot(el) {
      var slotName = el.slotName || '"default"';
      var children = genChildren(el);
      var res = "_t(" + slotName + (children ? "," + children : '');
      var attrs = el.attrs && "{" + el.attrs.map(function (a) {
        return camelize(a.name) + ":" + a.value;
      }).join(',') + "}";
      var bind$$1 = el.attrsMap['v-bind'];
      if ((attrs || bind$$1) && !children) {
        res += ",null";
      }
      if (attrs) {
        res += "," + attrs;
      }
      if (bind$$1) {
        res += (attrs ? '' : ',null') + "," + bind$$1;
      }
      return res + ')';
    }

    // componentName is el.component, take it as argument to shun flow's pessimistic refinement
    function genComponent(componentName, el) {
      var children = el.inlineTemplate ? null : genChildren(el, true);
      return "_c(" + componentName + "," + genData(el) + (children ? "," + children : '') + ")";
    }

    function genProps(props) {
      var res = '';
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        res += "\"" + prop.name + "\":" + transformSpecialNewlines(prop.value) + ",";
      }
      return res.slice(0, -1);
    }

    // #3895, #4268
    function transformSpecialNewlines(text) {
      return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    }

    /*  */

    // these keywords should not appear inside expressions, but operators like
    // typeof, instanceof and in are allowed
    var prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b');

    // these unary operators should not be used as property/method names
    var unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

    // check valid identifier for v-for
    var identRE = /[A-Za-z_$][\w$]*/;

    // strip strings in expressions
    var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

    // detect problematic expressions in a template
    function detectErrors(ast) {
      var errors = [];
      if (ast) {
        checkNode(ast, errors);
      }
      return errors;
    }

    function checkNode(node, errors) {
      if (node.type === 1) {
        for (var name in node.attrsMap) {
          if (dirRE.test(name)) {
            var value = node.attrsMap[name];
            if (value) {
              if (name === 'v-for') {
                checkFor(node, "v-for=\"" + value + "\"", errors);
              } else if (onRE.test(name)) {
                checkEvent(value, name + "=\"" + value + "\"", errors);
              } else {
                checkExpression(value, name + "=\"" + value + "\"", errors);
              }
            }
          }
        }
        if (node.children) {
          for (var i = 0; i < node.children.length; i++) {
            checkNode(node.children[i], errors);
          }
        }
      } else if (node.type === 2) {
        checkExpression(node.expression, node.text, errors);
      }
    }

    function checkEvent(exp, text, errors) {
      var stipped = exp.replace(stripStringRE, '');
      var keywordMatch = stipped.match(unaryOperatorsRE);
      if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
        errors.push("avoid using JavaScript unary operator as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
      }
      checkExpression(exp, text, errors);
    }

    function checkFor(node, text, errors) {
      checkExpression(node.for || '', text, errors);
      checkIdentifier(node.alias, 'v-for alias', text, errors);
      checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
      checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
    }

    function checkIdentifier(ident, type, text, errors) {
      if (typeof ident === 'string' && !identRE.test(ident)) {
        errors.push("invalid " + type + " \"" + ident + "\" in expression: " + text.trim());
      }
    }

    function checkExpression(exp, text, errors) {
      try {
        new Function("return " + exp);
      } catch (e) {
        var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
        if (keywordMatch) {
          errors.push("avoid using JavaScript keyword as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
        } else {
          errors.push("invalid expression: " + text.trim());
        }
      }
    }

    /*  */

    function baseCompile(template, options) {
      var ast = parse(template.trim(), options);
      optimize(ast, options);
      var code = generate(ast, options);
      return {
        ast: ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
      };
    }

    function makeFunction(code, errors) {
      try {
        return new Function(code);
      } catch (err) {
        errors.push({ err: err, code: code });
        return noop;
      }
    }

    function createCompiler(baseOptions) {
      var functionCompileCache = Object.create(null);

      function compile(template, options) {
        var finalOptions = Object.create(baseOptions);
        var errors = [];
        var tips = [];
        finalOptions.warn = function (msg, tip$$1) {
          (tip$$1 ? tips : errors).push(msg);
        };

        if (options) {
          // merge custom modules
          if (options.modules) {
            finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(Object.create(baseOptions.directives), options.directives);
          }
          // copy other options
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        var compiled = baseCompile(template, finalOptions);
        {
          errors.push.apply(errors, detectErrors(compiled.ast));
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled;
      }

      function compileToFunctions(template, options, vm) {
        options = options || {};

        /* istanbul ignore if */
        {
          // detect possible CSP restriction
          try {
            new Function('return 1');
          } catch (e) {
            if (e.toString().match(/unsafe-eval|CSP/)) {
              warn('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
            }
          }
        }

        // check cache
        var key = options.delimiters ? String(options.delimiters) + template : template;
        if (functionCompileCache[key]) {
          return functionCompileCache[key];
        }

        // compile
        var compiled = compile(template, options);

        // check compilation errors/tips
        {
          if (compiled.errors && compiled.errors.length) {
            warn("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function (e) {
              return "- " + e;
            }).join('\n') + '\n', vm);
          }
          if (compiled.tips && compiled.tips.length) {
            compiled.tips.forEach(function (msg) {
              return tip(msg, vm);
            });
          }
        }

        // turn code into functions
        var res = {};
        var fnGenErrors = [];
        res.render = makeFunction(compiled.render, fnGenErrors);
        var l = compiled.staticRenderFns.length;
        res.staticRenderFns = new Array(l);
        for (var i = 0; i < l; i++) {
          res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
        }

        // check function generation errors.
        // this should only happen if there is a bug in the compiler itself.
        // mostly for codegen development use
        /* istanbul ignore if */
        {
          if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
            warn("Failed to generate render function:\n\n" + fnGenErrors.map(function (ref) {
              var err = ref.err;
              var code = ref.code;

              return err.toString() + " in\n\n" + code + "\n";
            }).join('\n'), vm);
          }
        }

        return functionCompileCache[key] = res;
      }

      return {
        compile: compile,
        compileToFunctions: compileToFunctions
      };
    }

    /*  */

    function transformNode(el, options) {
      var warn = options.warn || baseWarn;
      var staticClass = getAndRemoveAttr(el, 'class');
      if ("development" !== 'production' && staticClass) {
        var expression = parseText(staticClass, options.delimiters);
        if (expression) {
          warn("class=\"" + staticClass + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.');
        }
      }
      if (staticClass) {
        el.staticClass = JSON.stringify(staticClass);
      }
      var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
      if (classBinding) {
        el.classBinding = classBinding;
      }
    }

    function genData$1(el) {
      var data = '';
      if (el.staticClass) {
        data += "staticClass:" + el.staticClass + ",";
      }
      if (el.classBinding) {
        data += "class:" + el.classBinding + ",";
      }
      return data;
    }

    var klass$1 = {
      staticKeys: ['staticClass'],
      transformNode: transformNode,
      genData: genData$1
    };

    /*  */

    function transformNode$1(el, options) {
      var warn = options.warn || baseWarn;
      var staticStyle = getAndRemoveAttr(el, 'style');
      if (staticStyle) {
        /* istanbul ignore if */
        {
          var expression = parseText(staticStyle, options.delimiters);
          if (expression) {
            warn("style=\"" + staticStyle + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.');
          }
        }
        el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
      }

      var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
      if (styleBinding) {
        el.styleBinding = styleBinding;
      }
    }

    function genData$2(el) {
      var data = '';
      if (el.staticStyle) {
        data += "staticStyle:" + el.staticStyle + ",";
      }
      if (el.styleBinding) {
        data += "style:(" + el.styleBinding + "),";
      }
      return data;
    }

    var style$1 = {
      staticKeys: ['staticStyle'],
      transformNode: transformNode$1,
      genData: genData$2
    };

    var modules$1 = [klass$1, style$1];

    /*  */

    function text(el, dir) {
      if (dir.value) {
        addProp(el, 'textContent', "_s(" + dir.value + ")");
      }
    }

    /*  */

    function html(el, dir) {
      if (dir.value) {
        addProp(el, 'innerHTML', "_s(" + dir.value + ")");
      }
    }

    var directives$1 = {
      model: model,
      text: text,
      html: html
    };

    /*  */

    var baseOptions = {
      expectHTML: true,
      modules: modules$1,
      directives: directives$1,
      isPreTag: isPreTag,
      isUnaryTag: isUnaryTag,
      mustUseProp: mustUseProp,
      canBeLeftOpenTag: canBeLeftOpenTag,
      isReservedTag: isReservedTag,
      getTagNamespace: getTagNamespace,
      staticKeys: genStaticKeys(modules$1)
    };

    var ref$1 = createCompiler(baseOptions);
    var compileToFunctions = ref$1.compileToFunctions;

    /*  */

    var idToTemplate = cached(function (id) {
      var el = query(id);
      return el && el.innerHTML;
    });

    var mount = Vue$3.prototype.$mount;
    Vue$3.prototype.$mount = function (el, hydrating) {
      el = el && query(el);

      /* istanbul ignore if */
      if (el === document.body || el === document.documentElement) {
        "development" !== 'production' && warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
        return this;
      }

      var options = this.$options;
      // resolve template/el and convert to render function
      if (!options.render) {
        var template = options.template;
        if (template) {
          if (typeof template === 'string') {
            if (template.charAt(0) === '#') {
              template = idToTemplate(template);
              /* istanbul ignore if */
              if ("development" !== 'production' && !template) {
                warn("Template element not found or is empty: " + options.template, this);
              }
            }
          } else if (template.nodeType) {
            template = template.innerHTML;
          } else {
            {
              warn('invalid template option:' + template, this);
            }
            return this;
          }
        } else if (el) {
          template = getOuterHTML(el);
        }
        if (template) {
          /* istanbul ignore if */
          if ("development" !== 'production' && config.performance && mark) {
            mark('compile');
          }

          var ref = compileToFunctions(template, {
            shouldDecodeNewlines: shouldDecodeNewlines,
            delimiters: options.delimiters
          }, this);
          var render = ref.render;
          var staticRenderFns = ref.staticRenderFns;
          options.render = render;
          options.staticRenderFns = staticRenderFns;

          /* istanbul ignore if */
          if ("development" !== 'production' && config.performance && mark) {
            mark('compile end');
            measure(this._name + " compile", 'compile', 'compile end');
          }
        }
      }
      return mount.call(this, el, hydrating);
    };

    /**
     * Get outerHTML of elements, taking care
     * of SVG elements in IE as well.
     */
    function getOuterHTML(el) {
      if (el.outerHTML) {
        return el.outerHTML;
      } else {
        var container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
      }
    }

    Vue$3.compile = compileToFunctions;

    return Vue$3;
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC92dWUuanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZmFjdG9yeSIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZpbmUiLCJhbWQiLCJWdWUiLCJpc1VuZGVmIiwidiIsInVuZGVmaW5lZCIsImlzRGVmIiwiaXNUcnVlIiwiaXNGYWxzZSIsImlzUHJpbWl0aXZlIiwidmFsdWUiLCJpc09iamVjdCIsIm9iaiIsIl90b1N0cmluZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsImNhbGwiLCJpc1JlZ0V4cCIsInZhbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJ0b051bWJlciIsIm4iLCJwYXJzZUZsb2F0IiwiaXNOYU4iLCJtYWtlTWFwIiwic3RyIiwiZXhwZWN0c0xvd2VyQ2FzZSIsIm1hcCIsImNyZWF0ZSIsImxpc3QiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJ0b0xvd2VyQ2FzZSIsImlzQnVpbHRJblRhZyIsInJlbW92ZSIsImFyciIsIml0ZW0iLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJoYXNPd25Qcm9wZXJ0eSIsImhhc093biIsImtleSIsImNhY2hlZCIsImZuIiwiY2FjaGUiLCJjYWNoZWRGbiIsImhpdCIsImNhbWVsaXplUkUiLCJjYW1lbGl6ZSIsInJlcGxhY2UiLCJfIiwiYyIsInRvVXBwZXJDYXNlIiwiY2FwaXRhbGl6ZSIsImNoYXJBdCIsInNsaWNlIiwiaHlwaGVuYXRlUkUiLCJoeXBoZW5hdGUiLCJiaW5kIiwiY3R4IiwiYm91bmRGbiIsImEiLCJsIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbGVuZ3RoIiwidG9BcnJheSIsInN0YXJ0IiwicmV0IiwiQXJyYXkiLCJleHRlbmQiLCJ0byIsIl9mcm9tIiwidG9PYmplY3QiLCJyZXMiLCJub29wIiwibm8iLCJpZGVudGl0eSIsImdlblN0YXRpY0tleXMiLCJtb2R1bGVzIiwicmVkdWNlIiwia2V5cyIsIm0iLCJjb25jYXQiLCJzdGF0aWNLZXlzIiwiam9pbiIsImxvb3NlRXF1YWwiLCJiIiwiaXNPYmplY3RBIiwiaXNPYmplY3RCIiwiZSIsImxvb3NlSW5kZXhPZiIsIm9uY2UiLCJjYWxsZWQiLCJTU1JfQVRUUiIsIkFTU0VUX1RZUEVTIiwiTElGRUNZQ0xFX0hPT0tTIiwiY29uZmlnIiwib3B0aW9uTWVyZ2VTdHJhdGVnaWVzIiwic2lsZW50IiwicHJvZHVjdGlvblRpcCIsImRldnRvb2xzIiwicGVyZm9ybWFuY2UiLCJlcnJvckhhbmRsZXIiLCJpZ25vcmVkRWxlbWVudHMiLCJrZXlDb2RlcyIsImlzUmVzZXJ2ZWRUYWciLCJpc1Jlc2VydmVkQXR0ciIsImlzVW5rbm93bkVsZW1lbnQiLCJnZXRUYWdOYW1lc3BhY2UiLCJwYXJzZVBsYXRmb3JtVGFnTmFtZSIsIm11c3RVc2VQcm9wIiwiX2xpZmVjeWNsZUhvb2tzIiwiZW1wdHlPYmplY3QiLCJmcmVlemUiLCJpc1Jlc2VydmVkIiwiY2hhckNvZGVBdCIsImRlZiIsImVudW1lcmFibGUiLCJkZWZpbmVQcm9wZXJ0eSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiYmFpbFJFIiwicGFyc2VQYXRoIiwicGF0aCIsInRlc3QiLCJzZWdtZW50cyIsIndhcm4iLCJ0aXAiLCJmb3JtYXRDb21wb25lbnROYW1lIiwiaGFzQ29uc29sZSIsImNvbnNvbGUiLCJjbGFzc2lmeVJFIiwiY2xhc3NpZnkiLCJtc2ciLCJ2bSIsImVycm9yIiwiZ2VuZXJhdGVDb21wb25lbnRUcmFjZSIsImluY2x1ZGVGaWxlIiwiJHJvb3QiLCJuYW1lIiwib3B0aW9ucyIsIl9pc1Z1ZSIsIiRvcHRpb25zIiwiX2NvbXBvbmVudFRhZyIsImZpbGUiLCJfX2ZpbGUiLCJtYXRjaCIsInJlcGVhdCIsIiRwYXJlbnQiLCJ0cmVlIiwiY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlIiwibGFzdCIsImNvbnN0cnVjdG9yIiwicHVzaCIsImlzQXJyYXkiLCJoYW5kbGVFcnJvciIsImVyciIsImluZm8iLCJpbkJyb3dzZXIiLCJoYXNQcm90byIsIndpbmRvdyIsIlVBIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaXNJRSIsImlzSUU5IiwiaXNFZGdlIiwiaXNBbmRyb2lkIiwiaXNJT1MiLCJpc0Nocm9tZSIsInN1cHBvcnRzUGFzc2l2ZSIsIm9wdHMiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX2lzU2VydmVyIiwiaXNTZXJ2ZXJSZW5kZXJpbmciLCJlbnYiLCJWVUVfRU5WIiwiX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyIsImlzTmF0aXZlIiwiQ3RvciIsImhhc1N5bWJvbCIsIlN5bWJvbCIsIlJlZmxlY3QiLCJvd25LZXlzIiwibmV4dFRpY2siLCJjYWxsYmFja3MiLCJwZW5kaW5nIiwidGltZXJGdW5jIiwibmV4dFRpY2tIYW5kbGVyIiwiY29waWVzIiwiUHJvbWlzZSIsInAiLCJyZXNvbHZlIiwibG9nRXJyb3IiLCJ0aGVuIiwiY2F0Y2giLCJzZXRUaW1lb3V0IiwiTXV0YXRpb25PYnNlcnZlciIsImNvdW50ZXIiLCJvYnNlcnZlciIsInRleHROb2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVUZXh0Tm9kZSIsIm9ic2VydmUiLCJjaGFyYWN0ZXJEYXRhIiwiZGF0YSIsInF1ZXVlTmV4dFRpY2siLCJjYiIsIl9yZXNvbHZlIiwicmVqZWN0IiwiX1NldCIsIlNldCIsInNldCIsImhhcyIsImFkZCIsImNsZWFyIiwidWlkIiwiRGVwIiwiaWQiLCJzdWJzIiwiYWRkU3ViIiwic3ViIiwicmVtb3ZlU3ViIiwiZGVwZW5kIiwidGFyZ2V0IiwiYWRkRGVwIiwibm90aWZ5IiwidXBkYXRlIiwidGFyZ2V0U3RhY2siLCJwdXNoVGFyZ2V0IiwiX3RhcmdldCIsInBvcFRhcmdldCIsInBvcCIsImFycmF5UHJvdG8iLCJhcnJheU1ldGhvZHMiLCJmb3JFYWNoIiwibWV0aG9kIiwib3JpZ2luYWwiLCJtdXRhdG9yIiwiYXJndW1lbnRzJDEiLCJhcmdzIiwicmVzdWx0Iiwib2IiLCJfX29iX18iLCJpbnNlcnRlZCIsIm9ic2VydmVBcnJheSIsImRlcCIsImFycmF5S2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJvYnNlcnZlclN0YXRlIiwic2hvdWxkQ29udmVydCIsImlzU2V0dGluZ1Byb3BzIiwiT2JzZXJ2ZXIiLCJ2bUNvdW50IiwiYXVnbWVudCIsInByb3RvQXVnbWVudCIsImNvcHlBdWdtZW50Iiwid2FsayIsImRlZmluZVJlYWN0aXZlJCQxIiwiaXRlbXMiLCJzcmMiLCJfX3Byb3RvX18iLCJhc1Jvb3REYXRhIiwiaXNFeHRlbnNpYmxlIiwiY3VzdG9tU2V0dGVyIiwicHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXR0ZXIiLCJzZXR0ZXIiLCJjaGlsZE9iIiwicmVhY3RpdmVHZXR0ZXIiLCJkZXBlbmRBcnJheSIsInJlYWN0aXZlU2V0dGVyIiwibmV3VmFsIiwiTWF0aCIsIm1heCIsImRlbCIsInN0cmF0cyIsImVsIiwicHJvcHNEYXRhIiwicGFyZW50IiwiY2hpbGQiLCJkZWZhdWx0U3RyYXQiLCJtZXJnZURhdGEiLCJmcm9tIiwidG9WYWwiLCJmcm9tVmFsIiwicGFyZW50VmFsIiwiY2hpbGRWYWwiLCJtZXJnZWREYXRhRm4iLCJtZXJnZWRJbnN0YW5jZURhdGFGbiIsImluc3RhbmNlRGF0YSIsImRlZmF1bHREYXRhIiwibWVyZ2VIb29rIiwiaG9vayIsIm1lcmdlQXNzZXRzIiwidHlwZSIsIndhdGNoIiwicHJvcHMiLCJtZXRob2RzIiwiY29tcHV0ZWQiLCJjaGVja0NvbXBvbmVudHMiLCJjb21wb25lbnRzIiwibG93ZXIiLCJub3JtYWxpemVQcm9wcyIsIm5vcm1hbGl6ZURpcmVjdGl2ZXMiLCJkaXJzIiwiZGlyZWN0aXZlcyIsIm1lcmdlT3B0aW9ucyIsImV4dGVuZHNGcm9tIiwiZXh0ZW5kcyIsIm1peGlucyIsIm1lcmdlRmllbGQiLCJzdHJhdCIsInJlc29sdmVBc3NldCIsIndhcm5NaXNzaW5nIiwiYXNzZXRzIiwiY2FtZWxpemVkSWQiLCJQYXNjYWxDYXNlSWQiLCJ2YWxpZGF0ZVByb3AiLCJwcm9wT3B0aW9ucyIsInByb3AiLCJhYnNlbnQiLCJpc1R5cGUiLCJCb29sZWFuIiwiZ2V0UHJvcERlZmF1bHRWYWx1ZSIsInByZXZTaG91bGRDb252ZXJ0IiwiYXNzZXJ0UHJvcCIsImRlZmF1bHQiLCJfcHJvcHMiLCJnZXRUeXBlIiwicmVxdWlyZWQiLCJ2YWxpZCIsImV4cGVjdGVkVHlwZXMiLCJhc3NlcnRlZFR5cGUiLCJhc3NlcnRUeXBlIiwiZXhwZWN0ZWRUeXBlIiwidmFsaWRhdG9yIiwic2ltcGxlQ2hlY2tSRSIsImxlbiIsIm1hcmsiLCJtZWFzdXJlIiwicGVyZiIsImNsZWFyTWFya3MiLCJjbGVhck1lYXN1cmVzIiwidGFnIiwic3RhcnRUYWciLCJlbmRUYWciLCJpbml0UHJveHkiLCJhbGxvd2VkR2xvYmFscyIsIndhcm5Ob25QcmVzZW50IiwiaGFzUHJveHkiLCJQcm94eSIsImlzQnVpbHRJbk1vZGlmaWVyIiwiaGFzSGFuZGxlciIsImlzQWxsb3dlZCIsImdldEhhbmRsZXIiLCJoYW5kbGVycyIsInJlbmRlciIsIl93aXRoU3RyaXBwZWQiLCJfcmVuZGVyUHJveHkiLCJWTm9kZSIsImNoaWxkcmVuIiwidGV4dCIsImVsbSIsImNvbnRleHQiLCJjb21wb25lbnRPcHRpb25zIiwibnMiLCJmdW5jdGlvbmFsQ29udGV4dCIsImNvbXBvbmVudEluc3RhbmNlIiwicmF3IiwiaXNTdGF0aWMiLCJpc1Jvb3RJbnNlcnQiLCJpc0NvbW1lbnQiLCJpc0Nsb25lZCIsImlzT25jZSIsInByb3RvdHlwZUFjY2Vzc29ycyIsImRlZmluZVByb3BlcnRpZXMiLCJjcmVhdGVFbXB0eVZOb2RlIiwibm9kZSIsImNyZWF0ZVRleHRWTm9kZSIsImNsb25lVk5vZGUiLCJ2bm9kZSIsImNsb25lZCIsImNsb25lVk5vZGVzIiwidm5vZGVzIiwibm9ybWFsaXplRXZlbnQiLCJwYXNzaXZlIiwib25jZSQkMSIsImNhcHR1cmUiLCJjcmVhdGVGbkludm9rZXIiLCJmbnMiLCJpbnZva2VyIiwidXBkYXRlTGlzdGVuZXJzIiwib24iLCJvbGRPbiIsInJlbW92ZSQkMSIsImN1ciIsIm9sZCIsImV2ZW50IiwibWVyZ2VWTm9kZUhvb2siLCJob29rS2V5Iiwib2xkSG9vayIsIndyYXBwZWRIb29rIiwibWVyZ2VkIiwiZXh0cmFjdFByb3BzRnJvbVZOb2RlRGF0YSIsImF0dHJzIiwiYWx0S2V5Iiwia2V5SW5Mb3dlckNhc2UiLCJjaGVja1Byb3AiLCJoYXNoIiwicHJlc2VydmUiLCJzaW1wbGVOb3JtYWxpemVDaGlsZHJlbiIsIm5vcm1hbGl6ZUNoaWxkcmVuIiwibm9ybWFsaXplQXJyYXlDaGlsZHJlbiIsImlzVGV4dE5vZGUiLCJuZXN0ZWRJbmRleCIsIl9pc1ZMaXN0IiwiZW5zdXJlQ3RvciIsImNvbXAiLCJiYXNlIiwicmVzb2x2ZUFzeW5jQ29tcG9uZW50IiwiYmFzZUN0b3IiLCJlcnJvckNvbXAiLCJyZXNvbHZlZCIsImxvYWRpbmciLCJsb2FkaW5nQ29tcCIsImNvbnRleHRzIiwic3luYyIsImZvcmNlUmVuZGVyIiwiJGZvcmNlVXBkYXRlIiwicmVhc29uIiwiY29tcG9uZW50IiwiZGVsYXkiLCJ0aW1lb3V0IiwiZ2V0Rmlyc3RDb21wb25lbnRDaGlsZCIsImluaXRFdmVudHMiLCJfZXZlbnRzIiwiX2hhc0hvb2tFdmVudCIsImxpc3RlbmVycyIsIl9wYXJlbnRMaXN0ZW5lcnMiLCJ1cGRhdGVDb21wb25lbnRMaXN0ZW5lcnMiLCIkb25jZSIsIiRvbiIsInJlbW92ZSQxIiwiJG9mZiIsIm9sZExpc3RlbmVycyIsImV2ZW50c01peGluIiwiaG9va1JFIiwidGhpcyQxIiwiaSQxIiwiY2JzIiwiJGVtaXQiLCJsb3dlckNhc2VFdmVudCIsInJlc29sdmVTbG90cyIsInNsb3RzIiwiZGVmYXVsdFNsb3QiLCJzbG90IiwiZXZlcnkiLCJpc1doaXRlc3BhY2UiLCJyZXNvbHZlU2NvcGVkU2xvdHMiLCJhY3RpdmVJbnN0YW5jZSIsImluaXRMaWZlY3ljbGUiLCJhYnN0cmFjdCIsIiRjaGlsZHJlbiIsIiRyZWZzIiwiX3dhdGNoZXIiLCJfaW5hY3RpdmUiLCJfZGlyZWN0SW5hY3RpdmUiLCJfaXNNb3VudGVkIiwiX2lzRGVzdHJveWVkIiwiX2lzQmVpbmdEZXN0cm95ZWQiLCJsaWZlY3ljbGVNaXhpbiIsIl91cGRhdGUiLCJoeWRyYXRpbmciLCJjYWxsSG9vayIsInByZXZFbCIsIiRlbCIsInByZXZWbm9kZSIsIl92bm9kZSIsInByZXZBY3RpdmVJbnN0YW5jZSIsIl9fcGF0Y2hfXyIsIl9wYXJlbnRFbG0iLCJfcmVmRWxtIiwiX192dWVfXyIsIiR2bm9kZSIsIiRkZXN0cm95IiwidGVhcmRvd24iLCJfd2F0Y2hlcnMiLCJfZGF0YSIsIm1vdW50Q29tcG9uZW50IiwidGVtcGxhdGUiLCJ1cGRhdGVDb21wb25lbnQiLCJfbmFtZSIsIl91aWQiLCJfcmVuZGVyIiwiV2F0Y2hlciIsInVwZGF0ZUNoaWxkQ29tcG9uZW50IiwicGFyZW50Vm5vZGUiLCJyZW5kZXJDaGlsZHJlbiIsImhhc0NoaWxkcmVuIiwiX3JlbmRlckNoaWxkcmVuIiwic2NvcGVkU2xvdHMiLCIkc2NvcGVkU2xvdHMiLCJfcGFyZW50Vm5vZGUiLCJwcm9wS2V5cyIsIl9wcm9wS2V5cyIsIiRzbG90cyIsImlzSW5JbmFjdGl2ZVRyZWUiLCJhY3RpdmF0ZUNoaWxkQ29tcG9uZW50IiwiZGlyZWN0IiwiZGVhY3RpdmF0ZUNoaWxkQ29tcG9uZW50IiwiaiIsIk1BWF9VUERBVEVfQ09VTlQiLCJxdWV1ZSIsImFjdGl2YXRlZENoaWxkcmVuIiwiY2lyY3VsYXIiLCJ3YWl0aW5nIiwiZmx1c2hpbmciLCJyZXNldFNjaGVkdWxlclN0YXRlIiwiZmx1c2hTY2hlZHVsZXJRdWV1ZSIsIndhdGNoZXIiLCJzb3J0IiwicnVuIiwidXNlciIsImV4cHJlc3Npb24iLCJhY3RpdmF0ZWRRdWV1ZSIsInVwZGF0ZWRRdWV1ZSIsImNhbGxBY3RpdmF0ZWRIb29rcyIsImNhbGxVcGRhdGVIb29rcyIsImVtaXQiLCJxdWV1ZUFjdGl2YXRlZENvbXBvbmVudCIsInF1ZXVlV2F0Y2hlciIsInVpZCQyIiwiZXhwT3JGbiIsImRlZXAiLCJsYXp5IiwiYWN0aXZlIiwiZGlydHkiLCJkZXBzIiwibmV3RGVwcyIsImRlcElkcyIsIm5ld0RlcElkcyIsInRyYXZlcnNlIiwiY2xlYW51cERlcHMiLCJ0bXAiLCJvbGRWYWx1ZSIsImV2YWx1YXRlIiwic2Vlbk9iamVjdHMiLCJfdHJhdmVyc2UiLCJzZWVuIiwiaXNBIiwiZGVwSWQiLCJzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24iLCJwcm94eSIsInNvdXJjZUtleSIsInByb3h5R2V0dGVyIiwicHJveHlTZXR0ZXIiLCJpbml0U3RhdGUiLCJpbml0UHJvcHMiLCJpbml0TWV0aG9kcyIsImluaXREYXRhIiwiaW5pdENvbXB1dGVkIiwiaW5pdFdhdGNoIiwiaXNSZXNlcnZlZFByb3AiLCJyZWYiLCJwcm9wc09wdGlvbnMiLCJpc1Jvb3QiLCJsb29wIiwiZ2V0RGF0YSIsImNvbXB1dGVkV2F0Y2hlck9wdGlvbnMiLCJ3YXRjaGVycyIsIl9jb21wdXRlZFdhdGNoZXJzIiwidXNlckRlZiIsImRlZmluZUNvbXB1dGVkIiwiJGRhdGEiLCJjcmVhdGVDb21wdXRlZEdldHRlciIsImNvbXB1dGVkR2V0dGVyIiwiaGFuZGxlciIsImNyZWF0ZVdhdGNoZXIiLCIkd2F0Y2giLCJzdGF0ZU1peGluIiwiZGF0YURlZiIsInByb3BzRGVmIiwibmV3RGF0YSIsIiRzZXQiLCIkZGVsZXRlIiwiaW1tZWRpYXRlIiwidW53YXRjaEZuIiwiaW5pdFByb3ZpZGUiLCJwcm92aWRlIiwiX3Byb3ZpZGVkIiwiaW5pdEluamVjdGlvbnMiLCJyZXNvbHZlSW5qZWN0IiwiaW5qZWN0IiwicHJvdmlkZUtleSIsInNvdXJjZSIsImNyZWF0ZUZ1bmN0aW9uYWxDb21wb25lbnQiLCJtZXJnZVByb3BzIiwiX2NvbnRleHQiLCJoIiwiZCIsImNyZWF0ZUVsZW1lbnQiLCJpbmplY3Rpb25zIiwiZnVuY3Rpb25hbE9wdGlvbnMiLCJjb21wb25lbnRWTm9kZUhvb2tzIiwiaW5pdCIsInBhcmVudEVsbSIsInJlZkVsbSIsImNyZWF0ZUNvbXBvbmVudEluc3RhbmNlRm9yVm5vZGUiLCIkbW91bnQiLCJrZWVwQWxpdmUiLCJtb3VudGVkTm9kZSIsInByZXBhdGNoIiwib2xkVm5vZGUiLCJpbnNlcnQiLCJkZXN0cm95IiwiaG9va3NUb01lcmdlIiwiY3JlYXRlQ29tcG9uZW50IiwiX2Jhc2UiLCJjaWQiLCJyZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zIiwibW9kZWwiLCJ0cmFuc2Zvcm1Nb2RlbCIsImZ1bmN0aW9uYWwiLCJuYXRpdmVPbiIsIm1lcmdlSG9va3MiLCJ2bm9kZUNvbXBvbmVudE9wdGlvbnMiLCJfaXNDb21wb25lbnQiLCJpbmxpbmVUZW1wbGF0ZSIsInN0YXRpY1JlbmRlckZucyIsImZyb21QYXJlbnQiLCJvdXJzIiwibWVyZ2VIb29rJDEiLCJvbmUiLCJ0d28iLCJjYWxsYmFjayIsIlNJTVBMRV9OT1JNQUxJWkUiLCJBTFdBWVNfTk9STUFMSVpFIiwibm9ybWFsaXphdGlvblR5cGUiLCJhbHdheXNOb3JtYWxpemUiLCJfY3JlYXRlRWxlbWVudCIsImFwcGx5TlMiLCJyZW5kZXJMaXN0IiwicmVuZGVyU2xvdCIsImZhbGxiYWNrIiwiYmluZE9iamVjdCIsInNjb3BlZFNsb3RGbiIsInNsb3ROb2RlcyIsIl9yZW5kZXJlZCIsInJlc29sdmVGaWx0ZXIiLCJjaGVja0tleUNvZGVzIiwiZXZlbnRLZXlDb2RlIiwiYnVpbHRJbkFsaWFzIiwiYmluZE9iamVjdFByb3BzIiwiYXNQcm9wIiwiZG9tUHJvcHMiLCJyZW5kZXJTdGF0aWMiLCJpc0luRm9yIiwiX3N0YXRpY1RyZWVzIiwibWFya1N0YXRpYyIsIm1hcmtPbmNlIiwibWFya1N0YXRpY05vZGUiLCJpbml0UmVuZGVyIiwicmVuZGVyQ29udGV4dCIsIl9jIiwiJGNyZWF0ZUVsZW1lbnQiLCJyZW5kZXJNaXhpbiIsIiRuZXh0VGljayIsInJlbmRlckVycm9yIiwiX28iLCJfbiIsIl9zIiwiX2wiLCJfdCIsIl9xIiwiX2kiLCJfbSIsIl9mIiwiX2siLCJfYiIsIl92IiwiX2UiLCJfdSIsInVpZCQxIiwiaW5pdE1peGluIiwiX2luaXQiLCJpbml0SW50ZXJuYWxDb21wb25lbnQiLCJfc2VsZiIsInN1cGVyIiwic3VwZXJPcHRpb25zIiwiY2FjaGVkU3VwZXJPcHRpb25zIiwibW9kaWZpZWRPcHRpb25zIiwicmVzb2x2ZU1vZGlmaWVkT3B0aW9ucyIsImV4dGVuZE9wdGlvbnMiLCJtb2RpZmllZCIsImxhdGVzdCIsImV4dGVuZGVkIiwic2VhbGVkIiwic2VhbGVkT3B0aW9ucyIsImRlZHVwZSIsIlZ1ZSQzIiwiaW5pdFVzZSIsInVzZSIsInBsdWdpbiIsImluc3RhbGxlZCIsInVuc2hpZnQiLCJpbnN0YWxsIiwiaW5pdE1peGluJDEiLCJtaXhpbiIsImluaXRFeHRlbmQiLCJTdXBlciIsIlN1cGVySWQiLCJjYWNoZWRDdG9ycyIsIl9DdG9yIiwiU3ViIiwiVnVlQ29tcG9uZW50IiwiaW5pdFByb3BzJDEiLCJpbml0Q29tcHV0ZWQkMSIsIkNvbXAiLCJpbml0QXNzZXRSZWdpc3RlcnMiLCJkZWZpbml0aW9uIiwicGF0dGVyblR5cGVzIiwiUmVnRXhwIiwiZ2V0Q29tcG9uZW50TmFtZSIsIm1hdGNoZXMiLCJwYXR0ZXJuIiwicHJ1bmVDYWNoZSIsImN1cnJlbnQiLCJmaWx0ZXIiLCJjYWNoZWROb2RlIiwicHJ1bmVDYWNoZUVudHJ5IiwiS2VlcEFsaXZlIiwiaW5jbHVkZSIsImV4Y2x1ZGUiLCJjcmVhdGVkIiwiZGVzdHJveWVkIiwiYnVpbHRJbkNvbXBvbmVudHMiLCJpbml0R2xvYmFsQVBJIiwiY29uZmlnRGVmIiwidXRpbCIsImRlZmluZVJlYWN0aXZlIiwiZGVsZXRlIiwic3NyQ29udGV4dCIsInZlcnNpb24iLCJhY2NlcHRWYWx1ZSIsImF0dHIiLCJpc0VudW1lcmF0ZWRBdHRyIiwiaXNCb29sZWFuQXR0ciIsInhsaW5rTlMiLCJpc1hsaW5rIiwiZ2V0WGxpbmtQcm9wIiwiaXNGYWxzeUF0dHJWYWx1ZSIsImdlbkNsYXNzRm9yVm5vZGUiLCJwYXJlbnROb2RlIiwiY2hpbGROb2RlIiwibWVyZ2VDbGFzc0RhdGEiLCJnZW5DbGFzc0Zyb21EYXRhIiwic3RhdGljQ2xhc3MiLCJjbGFzcyIsImR5bmFtaWNDbGFzcyIsInN0cmluZ2lmeUNsYXNzIiwic3RyaW5naWZpZWQiLCJuYW1lc3BhY2VNYXAiLCJzdmciLCJtYXRoIiwiaXNIVE1MVGFnIiwiaXNTVkciLCJpc1ByZVRhZyIsInVua25vd25FbGVtZW50Q2FjaGUiLCJIVE1MVW5rbm93bkVsZW1lbnQiLCJIVE1MRWxlbWVudCIsInF1ZXJ5Iiwic2VsZWN0ZWQiLCJxdWVyeVNlbGVjdG9yIiwiY3JlYXRlRWxlbWVudCQxIiwidGFnTmFtZSIsIm11bHRpcGxlIiwic2V0QXR0cmlidXRlIiwiY3JlYXRlRWxlbWVudE5TIiwibmFtZXNwYWNlIiwiY3JlYXRlQ29tbWVudCIsImluc2VydEJlZm9yZSIsIm5ld05vZGUiLCJyZWZlcmVuY2VOb2RlIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsIm5leHRTaWJsaW5nIiwic2V0VGV4dENvbnRlbnQiLCJ0ZXh0Q29udGVudCIsIm5vZGVPcHMiLCJyZWdpc3RlclJlZiIsImlzUmVtb3ZhbCIsInJlZnMiLCJyZWZJbkZvciIsImVtcHR5Tm9kZSIsImhvb2tzIiwic2FtZVZub2RlIiwic2FtZUlucHV0VHlwZSIsInR5cGVBIiwidHlwZUIiLCJjcmVhdGVLZXlUb09sZElkeCIsImJlZ2luSWR4IiwiZW5kSWR4IiwiY3JlYXRlUGF0Y2hGdW5jdGlvbiIsImJhY2tlbmQiLCJlbXB0eU5vZGVBdCIsImNyZWF0ZVJtQ2IiLCJjaGlsZEVsbSIsInJlbW92ZU5vZGUiLCJpblByZSIsImNyZWF0ZUVsbSIsImluc2VydGVkVm5vZGVRdWV1ZSIsIm5lc3RlZCIsInByZSIsInNldFNjb3BlIiwiY3JlYXRlQ2hpbGRyZW4iLCJpbnZva2VDcmVhdGVIb29rcyIsImlzUmVhY3RpdmF0ZWQiLCJpbml0Q29tcG9uZW50IiwicmVhY3RpdmF0ZUNvbXBvbmVudCIsInBlbmRpbmdJbnNlcnQiLCJpc1BhdGNoYWJsZSIsImlubmVyTm9kZSIsInRyYW5zaXRpb24iLCJhY3RpdmF0ZSIsImFuY2VzdG9yIiwiX3Njb3BlSWQiLCJhZGRWbm9kZXMiLCJzdGFydElkeCIsImludm9rZURlc3Ryb3lIb29rIiwicmVtb3ZlVm5vZGVzIiwiY2giLCJyZW1vdmVBbmRJbnZva2VSZW1vdmVIb29rIiwicm0iLCJ1cGRhdGVDaGlsZHJlbiIsIm9sZENoIiwibmV3Q2giLCJyZW1vdmVPbmx5Iiwib2xkU3RhcnRJZHgiLCJuZXdTdGFydElkeCIsIm9sZEVuZElkeCIsIm9sZFN0YXJ0Vm5vZGUiLCJvbGRFbmRWbm9kZSIsIm5ld0VuZElkeCIsIm5ld1N0YXJ0Vm5vZGUiLCJuZXdFbmRWbm9kZSIsIm9sZEtleVRvSWR4IiwiaWR4SW5PbGQiLCJlbG1Ub01vdmUiLCJjYW5Nb3ZlIiwicGF0Y2hWbm9kZSIsInBvc3RwYXRjaCIsImludm9rZUluc2VydEhvb2siLCJpbml0aWFsIiwiYmFpbGVkIiwiaXNSZW5kZXJlZE1vZHVsZSIsImh5ZHJhdGUiLCJhc3NlcnROb2RlTWF0Y2giLCJoYXNDaGlsZE5vZGVzIiwiY2hpbGRyZW5NYXRjaCIsImZpcnN0Q2hpbGQiLCJjaGlsZE5vZGVzIiwibm9kZVR5cGUiLCJwYXRjaCIsImlzSW5pdGlhbFBhdGNoIiwiaXNSZWFsRWxlbWVudCIsImhhc0F0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsIm9sZEVsbSIsInBhcmVudEVsbSQxIiwiX2xlYXZlQ2IiLCJ1cGRhdGVEaXJlY3RpdmVzIiwidW5iaW5kRGlyZWN0aXZlcyIsImlzQ3JlYXRlIiwiaXNEZXN0cm95Iiwib2xkRGlycyIsIm5vcm1hbGl6ZURpcmVjdGl2ZXMkMSIsIm5ld0RpcnMiLCJkaXJzV2l0aEluc2VydCIsImRpcnNXaXRoUG9zdHBhdGNoIiwib2xkRGlyIiwiZGlyIiwiY2FsbEhvb2skMSIsImNvbXBvbmVudFVwZGF0ZWQiLCJjYWxsSW5zZXJ0IiwiZW1wdHlNb2RpZmllcnMiLCJtb2RpZmllcnMiLCJnZXRSYXdEaXJOYW1lIiwicmF3TmFtZSIsImJhc2VNb2R1bGVzIiwidXBkYXRlQXR0cnMiLCJvbGRBdHRycyIsInNldEF0dHIiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsInNldEF0dHJpYnV0ZU5TIiwidXBkYXRlQ2xhc3MiLCJvbGREYXRhIiwiY2xzIiwidHJhbnNpdGlvbkNsYXNzIiwiX3RyYW5zaXRpb25DbGFzc2VzIiwiX3ByZXZDbGFzcyIsImtsYXNzIiwidmFsaWREaXZpc2lvbkNoYXJSRSIsInBhcnNlRmlsdGVycyIsImV4cCIsImluU2luZ2xlIiwiaW5Eb3VibGUiLCJpblRlbXBsYXRlU3RyaW5nIiwiaW5SZWdleCIsImN1cmx5Iiwic3F1YXJlIiwicGFyZW4iLCJsYXN0RmlsdGVySW5kZXgiLCJwcmV2IiwiZmlsdGVycyIsInRyaW0iLCJwdXNoRmlsdGVyIiwid3JhcEZpbHRlciIsImJhc2VXYXJuIiwicGx1Y2tNb2R1bGVGdW5jdGlvbiIsImFkZFByb3AiLCJhZGRBdHRyIiwiYWRkRGlyZWN0aXZlIiwiYXJnIiwiYWRkSGFuZGxlciIsImltcG9ydGFudCIsInByZXZlbnQiLCJldmVudHMiLCJuYXRpdmUiLCJuYXRpdmVFdmVudHMiLCJuZXdIYW5kbGVyIiwiZ2V0QmluZGluZ0F0dHIiLCJnZXRTdGF0aWMiLCJkeW5hbWljVmFsdWUiLCJnZXRBbmRSZW1vdmVBdHRyIiwic3RhdGljVmFsdWUiLCJhdHRyc01hcCIsImF0dHJzTGlzdCIsImdlbkNvbXBvbmVudE1vZGVsIiwibnVtYmVyIiwiYmFzZVZhbHVlRXhwcmVzc2lvbiIsInZhbHVlRXhwcmVzc2lvbiIsImFzc2lnbm1lbnQiLCJnZW5Bc3NpZ25tZW50Q29kZSIsIm1vZGVsUnMiLCJwYXJzZU1vZGVsIiwiaWR4IiwiY2hyIiwiaW5kZXgkMSIsImV4cHJlc3Npb25Qb3MiLCJleHByZXNzaW9uRW5kUG9zIiwibGFzdEluZGV4T2YiLCJlb2YiLCJuZXh0IiwiaXNTdHJpbmdTdGFydCIsInBhcnNlU3RyaW5nIiwicGFyc2VCcmFja2V0Iiwic3Vic3RyaW5nIiwiaW5CcmFja2V0Iiwic3RyaW5nUXVvdGUiLCJ3YXJuJDEiLCJSQU5HRV9UT0tFTiIsIkNIRUNLQk9YX1JBRElPX1RPS0VOIiwiX3dhcm4iLCJkeW5hbWljVHlwZSIsImdlblNlbGVjdCIsImdlbkNoZWNrYm94TW9kZWwiLCJnZW5SYWRpb01vZGVsIiwiZ2VuRGVmYXVsdE1vZGVsIiwidmFsdWVCaW5kaW5nIiwidHJ1ZVZhbHVlQmluZGluZyIsImZhbHNlVmFsdWVCaW5kaW5nIiwic2VsZWN0ZWRWYWwiLCJjb2RlIiwibmVlZENvbXBvc2l0aW9uR3VhcmQiLCJub3JtYWxpemVFdmVudHMiLCJ0YXJnZXQkMSIsImFkZCQxIiwib2xkSGFuZGxlciIsImV2IiwicmVtb3ZlJDIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidXBkYXRlRE9NTGlzdGVuZXJzIiwidXBkYXRlRE9NUHJvcHMiLCJvbGRQcm9wcyIsIl92YWx1ZSIsInN0ckN1ciIsInNob3VsZFVwZGF0ZVZhbHVlIiwiY2hlY2tWYWwiLCJjb21wb3NpbmciLCJpc0RpcnR5IiwiaXNJbnB1dENoYW5nZWQiLCJhY3RpdmVFbGVtZW50IiwiX3ZNb2RpZmllcnMiLCJwYXJzZVN0eWxlVGV4dCIsImNzc1RleHQiLCJsaXN0RGVsaW1pdGVyIiwicHJvcGVydHlEZWxpbWl0ZXIiLCJub3JtYWxpemVTdHlsZURhdGEiLCJzdHlsZSIsIm5vcm1hbGl6ZVN0eWxlQmluZGluZyIsInN0YXRpY1N0eWxlIiwiYmluZGluZ1N0eWxlIiwiZ2V0U3R5bGUiLCJjaGVja0NoaWxkIiwic3R5bGVEYXRhIiwiY3NzVmFyUkUiLCJpbXBvcnRhbnRSRSIsInNldFByb3AiLCJzZXRQcm9wZXJ0eSIsIm5vcm1hbGl6ZWROYW1lIiwibm9ybWFsaXplIiwicHJlZml4ZXMiLCJ0ZXN0RWwiLCJ1cHBlciIsInByZWZpeGVkIiwidXBkYXRlU3R5bGUiLCJvbGRTdGF0aWNTdHlsZSIsIm9sZFN0eWxlQmluZGluZyIsIm5vcm1hbGl6ZWRTdHlsZSIsIm9sZFN0eWxlIiwibmV3U3R5bGUiLCJhZGRDbGFzcyIsImNsYXNzTGlzdCIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUNsYXNzIiwidGFyIiwicmVzb2x2ZVRyYW5zaXRpb24iLCJkZWYkJDEiLCJjc3MiLCJhdXRvQ3NzVHJhbnNpdGlvbiIsImVudGVyQ2xhc3MiLCJlbnRlclRvQ2xhc3MiLCJlbnRlckFjdGl2ZUNsYXNzIiwibGVhdmVDbGFzcyIsImxlYXZlVG9DbGFzcyIsImxlYXZlQWN0aXZlQ2xhc3MiLCJoYXNUcmFuc2l0aW9uIiwiVFJBTlNJVElPTiIsIkFOSU1BVElPTiIsInRyYW5zaXRpb25Qcm9wIiwidHJhbnNpdGlvbkVuZEV2ZW50IiwiYW5pbWF0aW9uUHJvcCIsImFuaW1hdGlvbkVuZEV2ZW50Iiwib250cmFuc2l0aW9uZW5kIiwib253ZWJraXR0cmFuc2l0aW9uZW5kIiwib25hbmltYXRpb25lbmQiLCJvbndlYmtpdGFuaW1hdGlvbmVuZCIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5leHRGcmFtZSIsImFkZFRyYW5zaXRpb25DbGFzcyIsInJlbW92ZVRyYW5zaXRpb25DbGFzcyIsIndoZW5UcmFuc2l0aW9uRW5kcyIsImdldFRyYW5zaXRpb25JbmZvIiwicHJvcENvdW50IiwiZW5kZWQiLCJlbmQiLCJvbkVuZCIsInRyYW5zZm9ybVJFIiwic3R5bGVzIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInRyYW5zaXRpb25EZWxheXMiLCJ0cmFuc2l0aW9uRHVyYXRpb25zIiwidHJhbnNpdGlvblRpbWVvdXQiLCJnZXRUaW1lb3V0IiwiYW5pbWF0aW9uRGVsYXlzIiwiYW5pbWF0aW9uRHVyYXRpb25zIiwiYW5pbWF0aW9uVGltZW91dCIsImhhc1RyYW5zZm9ybSIsImRlbGF5cyIsImR1cmF0aW9ucyIsInRvTXMiLCJzIiwiTnVtYmVyIiwiZW50ZXIiLCJ0b2dnbGVEaXNwbGF5IiwiY2FuY2VsbGVkIiwiX2VudGVyQ2IiLCJhcHBlYXJDbGFzcyIsImFwcGVhclRvQ2xhc3MiLCJhcHBlYXJBY3RpdmVDbGFzcyIsImJlZm9yZUVudGVyIiwiYWZ0ZXJFbnRlciIsImVudGVyQ2FuY2VsbGVkIiwiYmVmb3JlQXBwZWFyIiwiYXBwZWFyIiwiYWZ0ZXJBcHBlYXIiLCJhcHBlYXJDYW5jZWxsZWQiLCJkdXJhdGlvbiIsInRyYW5zaXRpb25Ob2RlIiwiaXNBcHBlYXIiLCJzdGFydENsYXNzIiwiYWN0aXZlQ2xhc3MiLCJ0b0NsYXNzIiwiYmVmb3JlRW50ZXJIb29rIiwiZW50ZXJIb29rIiwiYWZ0ZXJFbnRlckhvb2siLCJlbnRlckNhbmNlbGxlZEhvb2siLCJleHBsaWNpdEVudGVyRHVyYXRpb24iLCJjaGVja0R1cmF0aW9uIiwiZXhwZWN0c0NTUyIsInVzZXJXYW50c0NvbnRyb2wiLCJnZXRIb29rQXJndW1lbnRzTGVuZ3RoIiwic2hvdyIsInBlbmRpbmdOb2RlIiwiX3BlbmRpbmciLCJpc1ZhbGlkRHVyYXRpb24iLCJsZWF2ZSIsImJlZm9yZUxlYXZlIiwiYWZ0ZXJMZWF2ZSIsImxlYXZlQ2FuY2VsbGVkIiwiZGVsYXlMZWF2ZSIsImV4cGxpY2l0TGVhdmVEdXJhdGlvbiIsInBlcmZvcm1MZWF2ZSIsImludm9rZXJGbnMiLCJfZW50ZXIiLCJwbGF0Zm9ybU1vZHVsZXMiLCJ2bW9kZWwiLCJ0cmlnZ2VyIiwibW9kZWwkMSIsImJpbmRpbmciLCJzZXRTZWxlY3RlZCIsIm9uQ29tcG9zaXRpb25FbmQiLCJvbkNvbXBvc2l0aW9uU3RhcnQiLCJuZWVkUmVzZXQiLCJzb21lIiwiaGFzTm9NYXRjaGluZ09wdGlvbiIsImlzTXVsdGlwbGUiLCJvcHRpb24iLCJnZXRWYWx1ZSIsInNlbGVjdGVkSW5kZXgiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJsb2NhdGVOb2RlIiwib3JpZ2luYWxEaXNwbGF5IiwiX192T3JpZ2luYWxEaXNwbGF5IiwiZGlzcGxheSIsInVuYmluZCIsInBsYXRmb3JtRGlyZWN0aXZlcyIsInRyYW5zaXRpb25Qcm9wcyIsIm1vZGUiLCJnZXRSZWFsQ2hpbGQiLCJjb21wT3B0aW9ucyIsImV4dHJhY3RUcmFuc2l0aW9uRGF0YSIsImtleSQxIiwicGxhY2Vob2xkZXIiLCJyYXdDaGlsZCIsImhhc1BhcmVudFRyYW5zaXRpb24iLCJpc1NhbWVDaGlsZCIsIm9sZENoaWxkIiwiVHJhbnNpdGlvbiIsIl9sZWF2aW5nIiwib2xkUmF3Q2hpbGQiLCJkZWxheWVkTGVhdmUiLCJtb3ZlQ2xhc3MiLCJUcmFuc2l0aW9uR3JvdXAiLCJwcmV2Q2hpbGRyZW4iLCJyYXdDaGlsZHJlbiIsInRyYW5zaXRpb25EYXRhIiwia2VwdCIsInJlbW92ZWQiLCJjJDEiLCJwb3MiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJiZWZvcmVVcGRhdGUiLCJ1cGRhdGVkIiwiaGFzTW92ZSIsImNhbGxQZW5kaW5nQ2JzIiwicmVjb3JkUG9zaXRpb24iLCJhcHBseVRyYW5zbGF0aW9uIiwiYm9keSIsImYiLCJvZmZzZXRIZWlnaHQiLCJtb3ZlZCIsInRyYW5zZm9ybSIsIldlYmtpdFRyYW5zZm9ybSIsInRyYW5zaXRpb25EdXJhdGlvbiIsIl9tb3ZlQ2IiLCJwcm9wZXJ0eU5hbWUiLCJfaGFzTW92ZSIsImNsb25lIiwiY2xvbmVOb2RlIiwibmV3UG9zIiwib2xkUG9zIiwiZHgiLCJsZWZ0IiwiZHkiLCJ0b3AiLCJwbGF0Zm9ybUNvbXBvbmVudHMiLCJzaG91bGREZWNvZGUiLCJjb250ZW50IiwiZW5jb2RlZCIsImRpdiIsImlubmVySFRNTCIsInNob3VsZERlY29kZU5ld2xpbmVzIiwiaXNVbmFyeVRhZyIsImNhbkJlTGVmdE9wZW5UYWciLCJpc05vblBocmFzaW5nVGFnIiwiZGVjb2RlciIsImRlY29kZSIsImh0bWwiLCJzaW5nbGVBdHRySWRlbnRpZmllciIsInNpbmdsZUF0dHJBc3NpZ24iLCJzaW5nbGVBdHRyVmFsdWVzIiwiYXR0cmlidXRlIiwibmNuYW1lIiwicW5hbWVDYXB0dXJlIiwic3RhcnRUYWdPcGVuIiwic3RhcnRUYWdDbG9zZSIsImRvY3R5cGUiLCJjb21tZW50IiwiY29uZGl0aW9uYWxDb21tZW50IiwiSVNfUkVHRVhfQ0FQVFVSSU5HX0JST0tFTiIsImciLCJpc1BsYWluVGV4dEVsZW1lbnQiLCJyZUNhY2hlIiwiZGVjb2RpbmdNYXAiLCJlbmNvZGVkQXR0ciIsImVuY29kZWRBdHRyV2l0aE5ld0xpbmVzIiwiZGVjb2RlQXR0ciIsInJlIiwicGFyc2VIVE1MIiwic3RhY2siLCJleHBlY3RIVE1MIiwiaXNVbmFyeVRhZyQkMSIsImNhbkJlTGVmdE9wZW5UYWckJDEiLCJsYXN0VGFnIiwidGV4dEVuZCIsImNvbW1lbnRFbmQiLCJhZHZhbmNlIiwiY29uZGl0aW9uYWxFbmQiLCJkb2N0eXBlTWF0Y2giLCJlbmRUYWdNYXRjaCIsImN1ckluZGV4IiwicGFyc2VFbmRUYWciLCJzdGFydFRhZ01hdGNoIiwicGFyc2VTdGFydFRhZyIsImhhbmRsZVN0YXJ0VGFnIiwicmVzdCQxIiwiY2hhcnMiLCJzdGFja2VkVGFnIiwicmVTdGFja2VkVGFnIiwiZW5kVGFnTGVuZ3RoIiwicmVzdCIsImFsbCIsInVuYXJ5U2xhc2giLCJ1bmFyeSIsImxvd2VyQ2FzZWRUYWciLCJsb3dlckNhc2VkVGFnTmFtZSIsImRlZmF1bHRUYWdSRSIsInJlZ2V4RXNjYXBlUkUiLCJidWlsZFJlZ2V4IiwiZGVsaW1pdGVycyIsIm9wZW4iLCJjbG9zZSIsInBhcnNlVGV4dCIsInRhZ1JFIiwidG9rZW5zIiwibGFzdEluZGV4IiwiZXhlYyIsIm9uUkUiLCJkaXJSRSIsImZvckFsaWFzUkUiLCJmb3JJdGVyYXRvclJFIiwiYXJnUkUiLCJiaW5kUkUiLCJtb2RpZmllclJFIiwiZGVjb2RlSFRNTENhY2hlZCIsIndhcm4kMiIsInRyYW5zZm9ybXMiLCJwcmVUcmFuc2Zvcm1zIiwicG9zdFRyYW5zZm9ybXMiLCJwbGF0Zm9ybUlzUHJlVGFnIiwicGxhdGZvcm1NdXN0VXNlUHJvcCIsInBsYXRmb3JtR2V0VGFnTmFtZXNwYWNlIiwicGFyc2UiLCJwcmVzZXJ2ZVdoaXRlc3BhY2UiLCJyb290IiwiY3VycmVudFBhcmVudCIsImluVlByZSIsIndhcm5lZCIsIndhcm5PbmNlIiwiZW5kUHJlIiwiZWxlbWVudCIsImd1YXJkSUVTVkdCdWciLCJtYWtlQXR0cnNNYXAiLCJpc0ZvcmJpZGRlblRhZyIsImZvcmJpZGRlbiIsInByb2Nlc3NQcmUiLCJwcm9jZXNzUmF3QXR0cnMiLCJwcm9jZXNzRm9yIiwicHJvY2Vzc0lmIiwicHJvY2Vzc09uY2UiLCJwcm9jZXNzS2V5IiwicGxhaW4iLCJwcm9jZXNzUmVmIiwicHJvY2Vzc1Nsb3QiLCJwcm9jZXNzQ29tcG9uZW50IiwicHJvY2Vzc0F0dHJzIiwiY2hlY2tSb290Q29uc3RyYWludHMiLCJpZiIsImVsc2VpZiIsImVsc2UiLCJhZGRJZkNvbmRpdGlvbiIsImJsb2NrIiwicHJvY2Vzc0lmQ29uZGl0aW9ucyIsInNsb3RTY29wZSIsInNsb3RUYXJnZXQiLCJpJDIiLCJsYXN0Tm9kZSIsImlzVGV4dFRhZyIsImNoZWNrSW5Gb3IiLCJpbk1hdGNoIiwiZm9yIiwiYWxpYXMiLCJpdGVyYXRvck1hdGNoIiwiaXRlcmF0b3IxIiwiaXRlcmF0b3IyIiwiZmluZFByZXZFbGVtZW50IiwiY29uZGl0aW9uIiwiaWZDb25kaXRpb25zIiwic2xvdE5hbWUiLCJpc1Byb3AiLCJoYXNCaW5kaW5ncyIsInBhcnNlTW9kaWZpZXJzIiwiY2FtZWwiLCJhcmdNYXRjaCIsImNoZWNrRm9yQWxpYXNNb2RlbCIsImllTlNCdWciLCJpZU5TUHJlZml4IiwiX2VsIiwiaXNTdGF0aWNLZXkiLCJpc1BsYXRmb3JtUmVzZXJ2ZWRUYWciLCJnZW5TdGF0aWNLZXlzQ2FjaGVkIiwiZ2VuU3RhdGljS2V5cyQxIiwib3B0aW1pemUiLCJtYXJrU3RhdGljJDEiLCJtYXJrU3RhdGljUm9vdHMiLCJzdGF0aWMiLCJzdGF0aWNJbkZvciIsInN0YXRpY1Jvb3QiLCJ3YWxrVGhyb3VnaENvbmRpdGlvbnNCbG9ja3MiLCJjb25kaXRpb25CbG9ja3MiLCJpc0RpcmVjdENoaWxkT2ZUZW1wbGF0ZUZvciIsImZuRXhwUkUiLCJzaW1wbGVQYXRoUkUiLCJlc2MiLCJ0YWIiLCJzcGFjZSIsInVwIiwicmlnaHQiLCJkb3duIiwiZ2VuR3VhcmQiLCJtb2RpZmllckNvZGUiLCJzdG9wIiwic2VsZiIsImN0cmwiLCJzaGlmdCIsImFsdCIsIm1ldGEiLCJtaWRkbGUiLCJnZW5IYW5kbGVycyIsImdlbkhhbmRsZXIiLCJpc01ldGhvZFBhdGgiLCJpc0Z1bmN0aW9uRXhwcmVzc2lvbiIsImdlbk1vZGlmaWVyQ29kZSIsImdlbktleUZpbHRlciIsImhhbmRsZXJDb2RlIiwiZ2VuRmlsdGVyQ29kZSIsImtleVZhbCIsInBhcnNlSW50IiwiYmluZCQxIiwid3JhcERhdGEiLCJiYXNlRGlyZWN0aXZlcyIsImNsb2FrIiwid2FybiQzIiwidHJhbnNmb3JtcyQxIiwiZGF0YUdlbkZucyIsInBsYXRmb3JtRGlyZWN0aXZlcyQxIiwiaXNQbGF0Zm9ybVJlc2VydmVkVGFnJDEiLCJvbmNlQ291bnQiLCJjdXJyZW50T3B0aW9ucyIsImdlbmVyYXRlIiwiYXN0IiwicHJldlN0YXRpY1JlbmRlckZucyIsImN1cnJlbnRTdGF0aWNSZW5kZXJGbnMiLCJwcmV2T25jZUNvdW50IiwiZ2VuRWxlbWVudCIsInN0YXRpY1Byb2Nlc3NlZCIsImdlblN0YXRpYyIsIm9uY2VQcm9jZXNzZWQiLCJnZW5PbmNlIiwiZm9yUHJvY2Vzc2VkIiwiZ2VuRm9yIiwiaWZQcm9jZXNzZWQiLCJnZW5JZiIsImdlbkNoaWxkcmVuIiwiZ2VuU2xvdCIsImdlbkNvbXBvbmVudCIsImdlbkRhdGEiLCJnZW5JZkNvbmRpdGlvbnMiLCJjb25kaXRpb25zIiwiZ2VuVGVybmFyeUV4cCIsIm1heWJlQ29tcG9uZW50IiwiZ2VuRGlyZWN0aXZlcyIsImdlblByb3BzIiwiZ2VuU2NvcGVkU2xvdHMiLCJnZW5JbmxpbmVUZW1wbGF0ZSIsImhhc1J1bnRpbWUiLCJuZWVkUnVudGltZSIsImdlbiIsImlubGluZVJlbmRlckZucyIsImdlblNjb3BlZFNsb3QiLCJnZW5Gb3JTY29wZWRTbG90Iiwic2NvcGUiLCJjaGVja1NraXAiLCJlbCQxIiwiZ2V0Tm9ybWFsaXphdGlvblR5cGUiLCJnZW5Ob2RlIiwibmVlZHNOb3JtYWxpemF0aW9uIiwiZ2VuVGV4dCIsInRyYW5zZm9ybVNwZWNpYWxOZXdsaW5lcyIsImJpbmQkJDEiLCJjb21wb25lbnROYW1lIiwicHJvaGliaXRlZEtleXdvcmRSRSIsInVuYXJ5T3BlcmF0b3JzUkUiLCJpZGVudFJFIiwic3RyaXBTdHJpbmdSRSIsImRldGVjdEVycm9ycyIsImVycm9ycyIsImNoZWNrTm9kZSIsImNoZWNrRm9yIiwiY2hlY2tFdmVudCIsImNoZWNrRXhwcmVzc2lvbiIsInN0aXBwZWQiLCJrZXl3b3JkTWF0Y2giLCJjaGVja0lkZW50aWZpZXIiLCJpZGVudCIsIkZ1bmN0aW9uIiwiYmFzZUNvbXBpbGUiLCJtYWtlRnVuY3Rpb24iLCJjcmVhdGVDb21waWxlciIsImJhc2VPcHRpb25zIiwiZnVuY3Rpb25Db21waWxlQ2FjaGUiLCJjb21waWxlIiwiZmluYWxPcHRpb25zIiwidGlwcyIsInRpcCQkMSIsImNvbXBpbGVkIiwiY29tcGlsZVRvRnVuY3Rpb25zIiwiZm5HZW5FcnJvcnMiLCJ0cmFuc2Zvcm1Ob2RlIiwiY2xhc3NCaW5kaW5nIiwiZ2VuRGF0YSQxIiwia2xhc3MkMSIsInRyYW5zZm9ybU5vZGUkMSIsInN0eWxlQmluZGluZyIsImdlbkRhdGEkMiIsInN0eWxlJDEiLCJtb2R1bGVzJDEiLCJkaXJlY3RpdmVzJDEiLCJyZWYkMSIsImlkVG9UZW1wbGF0ZSIsIm1vdW50IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0T3V0ZXJIVE1MIiwib3V0ZXJIVE1MIiwiY29udGFpbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7QUFLQyxhQUFVQSxNQUFWLEVBQWtCQyxPQUFsQixFQUEyQjtBQUMzQixZQUFPQyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQW5CLElBQStCLE9BQU9DLE1BQVAsS0FBa0IsV0FBakQsR0FBK0RBLE9BQU9ELE9BQVAsR0FBaUJELFNBQWhGLEdBQ0Es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SixLQUFOLEdBQWUsVUFBeEIsRUFBcUMsU0FBckMsRUFBZ0QsYUFBaEQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxhQUFPNjhCLE1BQU1oN0MsSUFBTixDQUFXLElBQVgsRUFBaUI0USxFQUFqQixFQUFxQm9NLFNBQXJCLENBQVA7QUFDRCxLQWhFRDs7QUFrRUE7Ozs7QUFJQSxhQUFTaytCLFlBQVQsQ0FBdUJ0cUMsRUFBdkIsRUFBMkI7QUFDekIsVUFBSUEsR0FBR3VxQyxTQUFQLEVBQWtCO0FBQ2hCLGVBQU92cUMsR0FBR3VxQyxTQUFWO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSUMsWUFBWXJ2QyxTQUFTaVosYUFBVCxDQUF1QixLQUF2QixDQUFoQjtBQUNBbzJCLGtCQUFVNXFCLFdBQVYsQ0FBc0I1ZixHQUFHMDRCLFNBQUgsQ0FBYSxJQUFiLENBQXRCO0FBQ0EsZUFBTzhSLFVBQVVsUixTQUFqQjtBQUNEO0FBQ0Y7O0FBRUQvZSxVQUFNMHVCLE9BQU4sR0FBZ0JLLGtCQUFoQjs7QUFFQSxXQUFPL3VCLEtBQVA7QUFFQyxHQTk4U0EsQ0FBRCIsImZpbGUiOiJhcHAvdnVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBWdWUuanMgdjIuMy4zXG4gKiAoYykgMjAxNC0yMDE3IEV2YW4gWW91XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5WdWUgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8qICAqL1xuXG4vLyB0aGVzZSBoZWxwZXJzIHByb2R1Y2VzIGJldHRlciB2bSBjb2RlIGluIEpTIGVuZ2luZXMgZHVlIHRvIHRoZWlyXG4vLyBleHBsaWNpdG5lc3MgYW5kIGZ1bmN0aW9uIGlubGluaW5nXG5mdW5jdGlvbiBpc1VuZGVmICh2KSB7XG4gIHJldHVybiB2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbFxufVxuXG5mdW5jdGlvbiBpc0RlZiAodikge1xuICByZXR1cm4gdiAhPT0gdW5kZWZpbmVkICYmIHYgIT09IG51bGxcbn1cblxuZnVuY3Rpb24gaXNUcnVlICh2KSB7XG4gIHJldHVybiB2ID09PSB0cnVlXG59XG5cbmZ1bmN0aW9uIGlzRmFsc2UgKHYpIHtcbiAgcmV0dXJuIHYgPT09IGZhbHNlXG59XG4vKipcbiAqIENoZWNrIGlmIHZhbHVlIGlzIHByaW1pdGl2ZVxuICovXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSAodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xufVxuXG4vKipcbiAqIFF1aWNrIG9iamVjdCBjaGVjayAtIHRoaXMgaXMgcHJpbWFyaWx5IHVzZWQgdG8gdGVsbFxuICogT2JqZWN0cyBmcm9tIHByaW1pdGl2ZSB2YWx1ZXMgd2hlbiB3ZSBrbm93IHRoZSB2YWx1ZVxuICogaXMgYSBKU09OLWNvbXBsaWFudCB0eXBlLlxuICovXG5mdW5jdGlvbiBpc09iamVjdCAob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcbn1cblxudmFyIF90b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogU3RyaWN0IG9iamVjdCB0eXBlIGNoZWNrLiBPbmx5IHJldHVybnMgdHJ1ZVxuICogZm9yIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAob2JqKSB7XG4gIHJldHVybiBfdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJ1xufVxuXG5mdW5jdGlvbiBpc1JlZ0V4cCAodikge1xuICByZXR1cm4gX3RvU3RyaW5nLmNhbGwodikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXG59XG5cbi8qKlxuICogQ29udmVydCBhIHZhbHVlIHRvIGEgc3RyaW5nIHRoYXQgaXMgYWN0dWFsbHkgcmVuZGVyZWQuXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nICh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PSBudWxsXG4gICAgPyAnJ1xuICAgIDogdHlwZW9mIHZhbCA9PT0gJ29iamVjdCdcbiAgICAgID8gSlNPTi5zdHJpbmdpZnkodmFsLCBudWxsLCAyKVxuICAgICAgOiBTdHJpbmcodmFsKVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBpbnB1dCB2YWx1ZSB0byBhIG51bWJlciBmb3IgcGVyc2lzdGVuY2UuXG4gKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgcmV0dXJuIG9yaWdpbmFsIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIgKHZhbCkge1xuICB2YXIgbiA9IHBhcnNlRmxvYXQodmFsKTtcbiAgcmV0dXJuIGlzTmFOKG4pID8gdmFsIDogblxufVxuXG4vKipcbiAqIE1ha2UgYSBtYXAgYW5kIHJldHVybiBhIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIGtleVxuICogaXMgaW4gdGhhdCBtYXAuXG4gKi9cbmZ1bmN0aW9uIG1ha2VNYXAgKFxuICBzdHIsXG4gIGV4cGVjdHNMb3dlckNhc2Vcbikge1xuICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpc3QgPSBzdHIuc3BsaXQoJywnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwW2xpc3RbaV1dID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZXhwZWN0c0xvd2VyQ2FzZVxuICAgID8gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbC50b0xvd2VyQ2FzZSgpXTsgfVxuICAgIDogZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbF07IH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhZyBpcyBhIGJ1aWx0LWluIHRhZy5cbiAqL1xudmFyIGlzQnVpbHRJblRhZyA9IG1ha2VNYXAoJ3Nsb3QsY29tcG9uZW50JywgdHJ1ZSk7XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBhcnJheVxuICovXG5mdW5jdGlvbiByZW1vdmUgKGFyciwgaXRlbSkge1xuICBpZiAoYXJyLmxlbmd0aCkge1xuICAgIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gYXJyLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBvYmplY3QgaGFzIHRoZSBwcm9wZXJ0eS5cbiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGhhc093biAob2JqLCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgY2FjaGVkIHZlcnNpb24gb2YgYSBwdXJlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYWNoZWQgKGZuKSB7XG4gIHZhciBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAoZnVuY3Rpb24gY2FjaGVkRm4gKHN0cikge1xuICAgIHZhciBoaXQgPSBjYWNoZVtzdHJdO1xuICAgIHJldHVybiBoaXQgfHwgKGNhY2hlW3N0cl0gPSBmbihzdHIpKVxuICB9KVxufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbGltaXRlZCBzdHJpbmcuXG4gKi9cbnZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xudmFyIGNhbWVsaXplID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIGZ1bmN0aW9uIChfLCBjKSB7IHJldHVybiBjID8gYy50b1VwcGVyQ2FzZSgpIDogJyc7IH0pXG59KTtcblxuLyoqXG4gKiBDYXBpdGFsaXplIGEgc3RyaW5nLlxuICovXG52YXIgY2FwaXRhbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcbn0pO1xuXG4vKipcbiAqIEh5cGhlbmF0ZSBhIGNhbWVsQ2FzZSBzdHJpbmcuXG4gKi9cbnZhciBoeXBoZW5hdGVSRSA9IC8oW14tXSkoW0EtWl0pL2c7XG52YXIgaHlwaGVuYXRlID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0clxuICAgIC5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnJDEtJDInKVxuICAgIC5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnJDEtJDInKVxuICAgIC50b0xvd2VyQ2FzZSgpXG59KTtcblxuLyoqXG4gKiBTaW1wbGUgYmluZCwgZmFzdGVyIHRoYW4gbmF0aXZlXG4gKi9cbmZ1bmN0aW9uIGJpbmQgKGZuLCBjdHgpIHtcbiAgZnVuY3Rpb24gYm91bmRGbiAoYSkge1xuICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gbFxuICAgICAgPyBsID4gMVxuICAgICAgICA/IGZuLmFwcGx5KGN0eCwgYXJndW1lbnRzKVxuICAgICAgICA6IGZuLmNhbGwoY3R4LCBhKVxuICAgICAgOiBmbi5jYWxsKGN0eClcbiAgfVxuICAvLyByZWNvcmQgb3JpZ2luYWwgZm4gbGVuZ3RoXG4gIGJvdW5kRm4uX2xlbmd0aCA9IGZuLmxlbmd0aDtcbiAgcmV0dXJuIGJvdW5kRm5cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cbiAqL1xuZnVuY3Rpb24gdG9BcnJheSAobGlzdCwgc3RhcnQpIHtcbiAgc3RhcnQgPSBzdGFydCB8fCAwO1xuICB2YXIgaSA9IGxpc3QubGVuZ3RoIC0gc3RhcnQ7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0pIHtcbiAgICByZXRbaV0gPSBsaXN0W2kgKyBzdGFydF07XG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIE1peCBwcm9wZXJ0aWVzIGludG8gdGFyZ2V0IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZXh0ZW5kICh0bywgX2Zyb20pIHtcbiAgZm9yICh2YXIga2V5IGluIF9mcm9tKSB7XG4gICAgdG9ba2V5XSA9IF9mcm9tW2tleV07XG4gIH1cbiAgcmV0dXJuIHRvXG59XG5cbi8qKlxuICogTWVyZ2UgYW4gQXJyYXkgb2YgT2JqZWN0cyBpbnRvIGEgc2luZ2xlIE9iamVjdC5cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QgKGFycikge1xuICB2YXIgcmVzID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGFycltpXSkge1xuICAgICAgZXh0ZW5kKHJlcywgYXJyW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIFBlcmZvcm0gbm8gb3BlcmF0aW9uLlxuICovXG5mdW5jdGlvbiBub29wICgpIHt9XG5cbi8qKlxuICogQWx3YXlzIHJldHVybiBmYWxzZS5cbiAqL1xudmFyIG5vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH07XG5cbi8qKlxuICogUmV0dXJuIHNhbWUgdmFsdWVcbiAqL1xudmFyIGlkZW50aXR5ID0gZnVuY3Rpb24gKF8pIHsgcmV0dXJuIF87IH07XG5cbi8qKlxuICogR2VuZXJhdGUgYSBzdGF0aWMga2V5cyBzdHJpbmcgZnJvbSBjb21waWxlciBtb2R1bGVzLlxuICovXG5mdW5jdGlvbiBnZW5TdGF0aWNLZXlzIChtb2R1bGVzKSB7XG4gIHJldHVybiBtb2R1bGVzLnJlZHVjZShmdW5jdGlvbiAoa2V5cywgbSkge1xuICAgIHJldHVybiBrZXlzLmNvbmNhdChtLnN0YXRpY0tleXMgfHwgW10pXG4gIH0sIFtdKS5qb2luKCcsJylcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0d28gdmFsdWVzIGFyZSBsb29zZWx5IGVxdWFsIC0gdGhhdCBpcyxcbiAqIGlmIHRoZXkgYXJlIHBsYWluIG9iamVjdHMsIGRvIHRoZXkgaGF2ZSB0aGUgc2FtZSBzaGFwZT9cbiAqL1xuZnVuY3Rpb24gbG9vc2VFcXVhbCAoYSwgYikge1xuICB2YXIgaXNPYmplY3RBID0gaXNPYmplY3QoYSk7XG4gIHZhciBpc09iamVjdEIgPSBpc09iamVjdChiKTtcbiAgaWYgKGlzT2JqZWN0QSAmJiBpc09iamVjdEIpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHBvc3NpYmxlIGNpcmN1bGFyIHJlZmVyZW5jZVxuICAgICAgcmV0dXJuIGEgPT09IGJcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWlzT2JqZWN0QSAmJiAhaXNPYmplY3RCKSB7XG4gICAgcmV0dXJuIFN0cmluZyhhKSA9PT0gU3RyaW5nKGIpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gbG9vc2VJbmRleE9mIChhcnIsIHZhbCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGlmIChsb29zZUVxdWFsKGFycltpXSwgdmFsKSkgeyByZXR1cm4gaSB9XG4gIH1cbiAgcmV0dXJuIC0xXG59XG5cbi8qKlxuICogRW5zdXJlIGEgZnVuY3Rpb24gaXMgY2FsbGVkIG9ubHkgb25jZS5cbiAqL1xuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIFNTUl9BVFRSID0gJ2RhdGEtc2VydmVyLXJlbmRlcmVkJztcblxudmFyIEFTU0VUX1RZUEVTID0gW1xuICAnY29tcG9uZW50JyxcbiAgJ2RpcmVjdGl2ZScsXG4gICdmaWx0ZXInXG5dO1xuXG52YXIgTElGRUNZQ0xFX0hPT0tTID0gW1xuICAnYmVmb3JlQ3JlYXRlJyxcbiAgJ2NyZWF0ZWQnLFxuICAnYmVmb3JlTW91bnQnLFxuICAnbW91bnRlZCcsXG4gICdiZWZvcmVVcGRhdGUnLFxuICAndXBkYXRlZCcsXG4gICdiZWZvcmVEZXN0cm95JyxcbiAgJ2Rlc3Ryb3llZCcsXG4gICdhY3RpdmF0ZWQnLFxuICAnZGVhY3RpdmF0ZWQnXG5dO1xuXG4vKiAgKi9cblxudmFyIGNvbmZpZyA9ICh7XG4gIC8qKlxuICAgKiBPcHRpb24gbWVyZ2Ugc3RyYXRlZ2llcyAodXNlZCBpbiBjb3JlL3V0aWwvb3B0aW9ucylcbiAgICovXG4gIG9wdGlvbk1lcmdlU3RyYXRlZ2llczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBzdXBwcmVzcyB3YXJuaW5ncy5cbiAgICovXG4gIHNpbGVudDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFNob3cgcHJvZHVjdGlvbiBtb2RlIHRpcCBtZXNzYWdlIG9uIGJvb3Q/XG4gICAqL1xuICBwcm9kdWN0aW9uVGlwOiBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyxcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbmFibGUgZGV2dG9vbHNcbiAgICovXG4gIGRldnRvb2xzOiBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyxcblxuICAvKipcbiAgICogV2hldGhlciB0byByZWNvcmQgcGVyZlxuICAgKi9cbiAgcGVyZm9ybWFuY2U6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBFcnJvciBoYW5kbGVyIGZvciB3YXRjaGVyIGVycm9yc1xuICAgKi9cbiAgZXJyb3JIYW5kbGVyOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJZ25vcmUgY2VydGFpbiBjdXN0b20gZWxlbWVudHNcbiAgICovXG4gIGlnbm9yZWRFbGVtZW50czogW10sXG5cbiAgLyoqXG4gICAqIEN1c3RvbSB1c2VyIGtleSBhbGlhc2VzIGZvciB2LW9uXG4gICAqL1xuICBrZXlDb2RlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSB0YWcgaXMgcmVzZXJ2ZWQgc28gdGhhdCBpdCBjYW5ub3QgYmUgcmVnaXN0ZXJlZCBhcyBhXG4gICAqIGNvbXBvbmVudC4gVGhpcyBpcyBwbGF0Zm9ybS1kZXBlbmRlbnQgYW5kIG1heSBiZSBvdmVyd3JpdHRlbi5cbiAgICovXG4gIGlzUmVzZXJ2ZWRUYWc6IG5vLFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgaXMgcmVzZXJ2ZWQgc28gdGhhdCBpdCBjYW5ub3QgYmUgdXNlZCBhcyBhIGNvbXBvbmVudFxuICAgKiBwcm9wLiBUaGlzIGlzIHBsYXRmb3JtLWRlcGVuZGVudCBhbmQgbWF5IGJlIG92ZXJ3cml0dGVuLlxuICAgKi9cbiAgaXNSZXNlcnZlZEF0dHI6IG5vLFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHRhZyBpcyBhbiB1bmtub3duIGVsZW1lbnQuXG4gICAqIFBsYXRmb3JtLWRlcGVuZGVudC5cbiAgICovXG4gIGlzVW5rbm93bkVsZW1lbnQ6IG5vLFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5hbWVzcGFjZSBvZiBhbiBlbGVtZW50XG4gICAqL1xuICBnZXRUYWdOYW1lc3BhY2U6IG5vb3AsXG5cbiAgLyoqXG4gICAqIFBhcnNlIHRoZSByZWFsIHRhZyBuYW1lIGZvciB0aGUgc3BlY2lmaWMgcGxhdGZvcm0uXG4gICAqL1xuICBwYXJzZVBsYXRmb3JtVGFnTmFtZTogaWRlbnRpdHksXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFuIGF0dHJpYnV0ZSBtdXN0IGJlIGJvdW5kIHVzaW5nIHByb3BlcnR5LCBlLmcuIHZhbHVlXG4gICAqIFBsYXRmb3JtLWRlcGVuZGVudC5cbiAgICovXG4gIG11c3RVc2VQcm9wOiBubyxcblxuICAvKipcbiAgICogRXhwb3NlZCBmb3IgbGVnYWN5IHJlYXNvbnNcbiAgICovXG4gIF9saWZlY3ljbGVIb29rczogTElGRUNZQ0xFX0hPT0tTXG59KTtcblxuLyogICovXG5cbnZhciBlbXB0eU9iamVjdCA9IE9iamVjdC5mcmVlemUoe30pO1xuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RyaW5nIHN0YXJ0cyB3aXRoICQgb3IgX1xuICovXG5mdW5jdGlvbiBpc1Jlc2VydmVkIChzdHIpIHtcbiAgdmFyIGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMCk7XG4gIHJldHVybiBjID09PSAweDI0IHx8IGMgPT09IDB4NUZcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gZGVmIChvYmosIGtleSwgdmFsLCBlbnVtZXJhYmxlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgIHZhbHVlOiB2YWwsXG4gICAgZW51bWVyYWJsZTogISFlbnVtZXJhYmxlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyoqXG4gKiBQYXJzZSBzaW1wbGUgcGF0aC5cbiAqL1xudmFyIGJhaWxSRSA9IC9bXlxcdy4kXS87XG5mdW5jdGlvbiBwYXJzZVBhdGggKHBhdGgpIHtcbiAgaWYgKGJhaWxSRS50ZXN0KHBhdGgpKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLicpO1xuICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghb2JqKSB7IHJldHVybiB9XG4gICAgICBvYmogPSBvYmpbc2VnbWVudHNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gb2JqXG4gIH1cbn1cblxuLyogICovXG5cbnZhciB3YXJuID0gbm9vcDtcbnZhciB0aXAgPSBub29wO1xudmFyIGZvcm1hdENvbXBvbmVudE5hbWUgPSAobnVsbCk7IC8vIHdvcmsgYXJvdW5kIGZsb3cgY2hlY2tcblxue1xuICB2YXIgaGFzQ29uc29sZSA9IHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIGNsYXNzaWZ5UkUgPSAvKD86XnxbLV9dKShcXHcpL2c7XG4gIHZhciBjbGFzc2lmeSA9IGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0clxuICAgIC5yZXBsYWNlKGNsYXNzaWZ5UkUsIGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnRvVXBwZXJDYXNlKCk7IH0pXG4gICAgLnJlcGxhY2UoL1stX10vZywgJycpOyB9O1xuXG4gIHdhcm4gPSBmdW5jdGlvbiAobXNnLCB2bSkge1xuICAgIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbVnVlIHdhcm5dOiBcIiArIG1zZyArIChcbiAgICAgICAgdm0gPyBnZW5lcmF0ZUNvbXBvbmVudFRyYWNlKHZtKSA6ICcnXG4gICAgICApKTtcbiAgICB9XG4gIH07XG5cbiAgdGlwID0gZnVuY3Rpb24gKG1zZywgdm0pIHtcbiAgICBpZiAoaGFzQ29uc29sZSAmJiAoIWNvbmZpZy5zaWxlbnQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbVnVlIHRpcF06IFwiICsgbXNnICsgKFxuICAgICAgICB2bSA/IGdlbmVyYXRlQ29tcG9uZW50VHJhY2Uodm0pIDogJydcbiAgICAgICkpO1xuICAgIH1cbiAgfTtcblxuICBmb3JtYXRDb21wb25lbnROYW1lID0gZnVuY3Rpb24gKHZtLCBpbmNsdWRlRmlsZSkge1xuICAgIGlmICh2bS4kcm9vdCA9PT0gdm0pIHtcbiAgICAgIHJldHVybiAnPFJvb3Q+J1xuICAgIH1cbiAgICB2YXIgbmFtZSA9IHR5cGVvZiB2bSA9PT0gJ3N0cmluZydcbiAgICAgID8gdm1cbiAgICAgIDogdHlwZW9mIHZtID09PSAnZnVuY3Rpb24nICYmIHZtLm9wdGlvbnNcbiAgICAgICAgPyB2bS5vcHRpb25zLm5hbWVcbiAgICAgICAgOiB2bS5faXNWdWVcbiAgICAgICAgICA/IHZtLiRvcHRpb25zLm5hbWUgfHwgdm0uJG9wdGlvbnMuX2NvbXBvbmVudFRhZ1xuICAgICAgICAgIDogdm0ubmFtZTtcblxuICAgIHZhciBmaWxlID0gdm0uX2lzVnVlICYmIHZtLiRvcHRpb25zLl9fZmlsZTtcbiAgICBpZiAoIW5hbWUgJiYgZmlsZSkge1xuICAgICAgdmFyIG1hdGNoID0gZmlsZS5tYXRjaCgvKFteL1xcXFxdKylcXC52dWUkLyk7XG4gICAgICBuYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChuYW1lID8gKFwiPFwiICsgKGNsYXNzaWZ5KG5hbWUpKSArIFwiPlwiKSA6IFwiPEFub255bW91cz5cIikgK1xuICAgICAgKGZpbGUgJiYgaW5jbHVkZUZpbGUgIT09IGZhbHNlID8gKFwiIGF0IFwiICsgZmlsZSkgOiAnJylcbiAgICApXG4gIH07XG5cbiAgdmFyIHJlcGVhdCA9IGZ1bmN0aW9uIChzdHIsIG4pIHtcbiAgICB2YXIgcmVzID0gJyc7XG4gICAgd2hpbGUgKG4pIHtcbiAgICAgIGlmIChuICUgMiA9PT0gMSkgeyByZXMgKz0gc3RyOyB9XG4gICAgICBpZiAobiA+IDEpIHsgc3RyICs9IHN0cjsgfVxuICAgICAgbiA+Pj0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9O1xuXG4gIHZhciBnZW5lcmF0ZUNvbXBvbmVudFRyYWNlID0gZnVuY3Rpb24gKHZtKSB7XG4gICAgaWYgKHZtLl9pc1Z1ZSAmJiB2bS4kcGFyZW50KSB7XG4gICAgICB2YXIgdHJlZSA9IFtdO1xuICAgICAgdmFyIGN1cnJlbnRSZWN1cnNpdmVTZXF1ZW5jZSA9IDA7XG4gICAgICB3aGlsZSAodm0pIHtcbiAgICAgICAgaWYgKHRyZWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBsYXN0ID0gdHJlZVt0cmVlLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGlmIChsYXN0LmNvbnN0cnVjdG9yID09PSB2bS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlKys7XG4gICAgICAgICAgICB2bSA9IHZtLiRwYXJlbnQ7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlID4gMCkge1xuICAgICAgICAgICAgdHJlZVt0cmVlLmxlbmd0aCAtIDFdID0gW2xhc3QsIGN1cnJlbnRSZWN1cnNpdmVTZXF1ZW5jZV07XG4gICAgICAgICAgICBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2UgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cmVlLnB1c2godm0pO1xuICAgICAgICB2bSA9IHZtLiRwYXJlbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ1xcblxcbmZvdW5kIGluXFxuXFxuJyArIHRyZWVcbiAgICAgICAgLm1hcChmdW5jdGlvbiAodm0sIGkpIHsgcmV0dXJuIChcIlwiICsgKGkgPT09IDAgPyAnLS0tPiAnIDogcmVwZWF0KCcgJywgNSArIGkgKiAyKSkgKyAoQXJyYXkuaXNBcnJheSh2bSlcbiAgICAgICAgICAgID8gKChmb3JtYXRDb21wb25lbnROYW1lKHZtWzBdKSkgKyBcIi4uLiAoXCIgKyAodm1bMV0pICsgXCIgcmVjdXJzaXZlIGNhbGxzKVwiKVxuICAgICAgICAgICAgOiBmb3JtYXRDb21wb25lbnROYW1lKHZtKSkpOyB9KVxuICAgICAgICAuam9pbignXFxuJylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcIlxcblxcbihmb3VuZCBpbiBcIiArIChmb3JtYXRDb21wb25lbnROYW1lKHZtKSkgKyBcIilcIilcbiAgICB9XG4gIH07XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBoYW5kbGVFcnJvciAoZXJyLCB2bSwgaW5mbykge1xuICBpZiAoY29uZmlnLmVycm9ySGFuZGxlcikge1xuICAgIGNvbmZpZy5lcnJvckhhbmRsZXIuY2FsbChudWxsLCBlcnIsIHZtLCBpbmZvKTtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICB3YXJuKChcIkVycm9yIGluIFwiICsgaW5mbyArIFwiOiBcXFwiXCIgKyAoZXJyLnRvU3RyaW5nKCkpICsgXCJcXFwiXCIpLCB2bSk7XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGluQnJvd3NlciAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuLyogZ2xvYmFscyBNdXRhdGlvbk9ic2VydmVyICovXG5cbi8vIGNhbiB3ZSB1c2UgX19wcm90b19fP1xudmFyIGhhc1Byb3RvID0gJ19fcHJvdG9fXycgaW4ge307XG5cbi8vIEJyb3dzZXIgZW52aXJvbm1lbnQgc25pZmZpbmdcbnZhciBpbkJyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbnZhciBVQSA9IGluQnJvd3NlciAmJiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xudmFyIGlzSUUgPSBVQSAmJiAvbXNpZXx0cmlkZW50Ly50ZXN0KFVBKTtcbnZhciBpc0lFOSA9IFVBICYmIFVBLmluZGV4T2YoJ21zaWUgOS4wJykgPiAwO1xudmFyIGlzRWRnZSA9IFVBICYmIFVBLmluZGV4T2YoJ2VkZ2UvJykgPiAwO1xudmFyIGlzQW5kcm9pZCA9IFVBICYmIFVBLmluZGV4T2YoJ2FuZHJvaWQnKSA+IDA7XG52YXIgaXNJT1MgPSBVQSAmJiAvaXBob25lfGlwYWR8aXBvZHxpb3MvLnRlc3QoVUEpO1xudmFyIGlzQ2hyb21lID0gVUEgJiYgL2Nocm9tZVxcL1xcZCsvLnRlc3QoVUEpICYmICFpc0VkZ2U7XG5cbnZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcbmlmIChpbkJyb3dzZXIpIHtcbiAgdHJ5IHtcbiAgICB2YXIgb3B0cyA9IHt9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvcHRzLCAncGFzc2l2ZScsICh7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCAoKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSApKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzI4NVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0LXBhc3NpdmUnLCBudWxsLCBvcHRzKTtcbiAgfSBjYXRjaCAoZSkge31cbn1cblxuLy8gdGhpcyBuZWVkcyB0byBiZSBsYXp5LWV2YWxlZCBiZWNhdXNlIHZ1ZSBtYXkgYmUgcmVxdWlyZWQgYmVmb3JlXG4vLyB2dWUtc2VydmVyLXJlbmRlcmVyIGNhbiBzZXQgVlVFX0VOVlxudmFyIF9pc1NlcnZlcjtcbnZhciBpc1NlcnZlclJlbmRlcmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pc1NlcnZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFpbkJyb3dzZXIgJiYgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIGRldGVjdCBwcmVzZW5jZSBvZiB2dWUtc2VydmVyLXJlbmRlcmVyIGFuZCBhdm9pZFxuICAgICAgLy8gV2VicGFjayBzaGltbWluZyB0aGUgcHJvY2Vzc1xuICAgICAgX2lzU2VydmVyID0gZ2xvYmFsWydwcm9jZXNzJ10uZW52LlZVRV9FTlYgPT09ICdzZXJ2ZXInO1xuICAgIH0gZWxzZSB7XG4gICAgICBfaXNTZXJ2ZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIF9pc1NlcnZlclxufTtcblxuLy8gZGV0ZWN0IGRldnRvb2xzXG52YXIgZGV2dG9vbHMgPSBpbkJyb3dzZXIgJiYgd2luZG93Ll9fVlVFX0RFVlRPT0xTX0dMT0JBTF9IT09LX187XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBpc05hdGl2ZSAoQ3Rvcikge1xuICByZXR1cm4gdHlwZW9mIEN0b3IgPT09ICdmdW5jdGlvbicgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KEN0b3IudG9TdHJpbmcoKSlcbn1cblxudmFyIGhhc1N5bWJvbCA9XG4gIHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFN5bWJvbCkgJiZcbiAgdHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFJlZmxlY3Qub3duS2V5cyk7XG5cbi8qKlxuICogRGVmZXIgYSB0YXNrIHRvIGV4ZWN1dGUgaXQgYXN5bmNocm9ub3VzbHkuXG4gKi9cbnZhciBuZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBjYWxsYmFja3MgPSBbXTtcbiAgdmFyIHBlbmRpbmcgPSBmYWxzZTtcbiAgdmFyIHRpbWVyRnVuYztcblxuICBmdW5jdGlvbiBuZXh0VGlja0hhbmRsZXIgKCkge1xuICAgIHBlbmRpbmcgPSBmYWxzZTtcbiAgICB2YXIgY29waWVzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGNhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb3BpZXNbaV0oKTtcbiAgICB9XG4gIH1cblxuICAvLyB0aGUgbmV4dFRpY2sgYmVoYXZpb3IgbGV2ZXJhZ2VzIHRoZSBtaWNyb3Rhc2sgcXVldWUsIHdoaWNoIGNhbiBiZSBhY2Nlc3NlZFxuICAvLyB2aWEgZWl0aGVyIG5hdGl2ZSBQcm9taXNlLnRoZW4gb3IgTXV0YXRpb25PYnNlcnZlci5cbiAgLy8gTXV0YXRpb25PYnNlcnZlciBoYXMgd2lkZXIgc3VwcG9ydCwgaG93ZXZlciBpdCBpcyBzZXJpb3VzbHkgYnVnZ2VkIGluXG4gIC8vIFVJV2ViVmlldyBpbiBpT1MgPj0gOS4zLjMgd2hlbiB0cmlnZ2VyZWQgaW4gdG91Y2ggZXZlbnQgaGFuZGxlcnMuIEl0XG4gIC8vIGNvbXBsZXRlbHkgc3RvcHMgd29ya2luZyBhZnRlciB0cmlnZ2VyaW5nIGEgZmV3IHRpbWVzLi4uIHNvLCBpZiBuYXRpdmVcbiAgLy8gUHJvbWlzZSBpcyBhdmFpbGFibGUsIHdlIHdpbGwgdXNlIGl0OlxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBQcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShQcm9taXNlKSkge1xuICAgIHZhciBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH07XG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgcC50aGVuKG5leHRUaWNrSGFuZGxlcikuY2F0Y2gobG9nRXJyb3IpO1xuICAgICAgLy8gaW4gcHJvYmxlbWF0aWMgVUlXZWJWaWV3cywgUHJvbWlzZS50aGVuIGRvZXNuJ3QgY29tcGxldGVseSBicmVhaywgYnV0XG4gICAgICAvLyBpdCBjYW4gZ2V0IHN0dWNrIGluIGEgd2VpcmQgc3RhdGUgd2hlcmUgY2FsbGJhY2tzIGFyZSBwdXNoZWQgaW50byB0aGVcbiAgICAgIC8vIG1pY3JvdGFzayBxdWV1ZSBidXQgdGhlIHF1ZXVlIGlzbid0IGJlaW5nIGZsdXNoZWQsIHVudGlsIHRoZSBicm93c2VyXG4gICAgICAvLyBuZWVkcyB0byBkbyBzb21lIG90aGVyIHdvcmssIGUuZy4gaGFuZGxlIGEgdGltZXIuIFRoZXJlZm9yZSB3ZSBjYW5cbiAgICAgIC8vIFwiZm9yY2VcIiB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGZsdXNoZWQgYnkgYWRkaW5nIGFuIGVtcHR5IHRpbWVyLlxuICAgICAgaWYgKGlzSU9TKSB7IHNldFRpbWVvdXQobm9vcCk7IH1cbiAgICB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgaXNOYXRpdmUoTXV0YXRpb25PYnNlcnZlcikgfHxcbiAgICAvLyBQaGFudG9tSlMgYW5kIGlPUyA3LnhcbiAgICBNdXRhdGlvbk9ic2VydmVyLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE11dGF0aW9uT2JzZXJ2ZXJDb25zdHJ1Y3Rvcl0nXG4gICkpIHtcbiAgICAvLyB1c2UgTXV0YXRpb25PYnNlcnZlciB3aGVyZSBuYXRpdmUgUHJvbWlzZSBpcyBub3QgYXZhaWxhYmxlLFxuICAgIC8vIGUuZy4gUGhhbnRvbUpTIElFMTEsIGlPUzcsIEFuZHJvaWQgNC40XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG5leHRUaWNrSGFuZGxlcik7XG4gICAgdmFyIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKGNvdW50ZXIpKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRleHROb2RlLCB7XG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gICAgfSk7XG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyO1xuICAgICAgdGV4dE5vZGUuZGF0YSA9IFN0cmluZyhjb3VudGVyKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIC8vIGZhbGxiYWNrIHRvIHNldFRpbWVvdXRcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHRpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldFRpbWVvdXQobmV4dFRpY2tIYW5kbGVyLCAwKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHF1ZXVlTmV4dFRpY2sgKGNiLCBjdHgpIHtcbiAgICB2YXIgX3Jlc29sdmU7XG4gICAgY2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY2IuY2FsbChjdHgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaGFuZGxlRXJyb3IoZSwgY3R4LCAnbmV4dFRpY2snKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfcmVzb2x2ZSkge1xuICAgICAgICBfcmVzb2x2ZShjdHgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghcGVuZGluZykge1xuICAgICAgcGVuZGluZyA9IHRydWU7XG4gICAgICB0aW1lckZ1bmMoKTtcbiAgICB9XG4gICAgaWYgKCFjYiAmJiB0eXBlb2YgUHJvbWlzZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KSgpO1xuXG52YXIgX1NldDtcbi8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuaWYgKHR5cGVvZiBTZXQgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFNldCkpIHtcbiAgLy8gdXNlIG5hdGl2ZSBTZXQgd2hlbiBhdmFpbGFibGUuXG4gIF9TZXQgPSBTZXQ7XG59IGVsc2Uge1xuICAvLyBhIG5vbi1zdGFuZGFyZCBTZXQgcG9seWZpbGwgdGhhdCBvbmx5IHdvcmtzIHdpdGggcHJpbWl0aXZlIGtleXMuXG4gIF9TZXQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNldCAoKSB7XG4gICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuICAgIFNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzIChrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFtrZXldID09PSB0cnVlXG4gICAgfTtcbiAgICBTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCAoa2V5KSB7XG4gICAgICB0aGlzLnNldFtrZXldID0gdHJ1ZTtcbiAgICB9O1xuICAgIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgICB0aGlzLnNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfTtcblxuICAgIHJldHVybiBTZXQ7XG4gIH0oKSk7XG59XG5cbi8qICAqL1xuXG5cbnZhciB1aWQgPSAwO1xuXG4vKipcbiAqIEEgZGVwIGlzIGFuIG9ic2VydmFibGUgdGhhdCBjYW4gaGF2ZSBtdWx0aXBsZVxuICogZGlyZWN0aXZlcyBzdWJzY3JpYmluZyB0byBpdC5cbiAqL1xudmFyIERlcCA9IGZ1bmN0aW9uIERlcCAoKSB7XG4gIHRoaXMuaWQgPSB1aWQrKztcbiAgdGhpcy5zdWJzID0gW107XG59O1xuXG5EZXAucHJvdG90eXBlLmFkZFN1YiA9IGZ1bmN0aW9uIGFkZFN1YiAoc3ViKSB7XG4gIHRoaXMuc3Vicy5wdXNoKHN1Yik7XG59O1xuXG5EZXAucHJvdG90eXBlLnJlbW92ZVN1YiA9IGZ1bmN0aW9uIHJlbW92ZVN1YiAoc3ViKSB7XG4gIHJlbW92ZSh0aGlzLnN1YnMsIHN1Yik7XG59O1xuXG5EZXAucHJvdG90eXBlLmRlcGVuZCA9IGZ1bmN0aW9uIGRlcGVuZCAoKSB7XG4gIGlmIChEZXAudGFyZ2V0KSB7XG4gICAgRGVwLnRhcmdldC5hZGREZXAodGhpcyk7XG4gIH1cbn07XG5cbkRlcC5wcm90b3R5cGUubm90aWZ5ID0gZnVuY3Rpb24gbm90aWZ5ICgpIHtcbiAgLy8gc3RhYmlsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgdmFyIHN1YnMgPSB0aGlzLnN1YnMuc2xpY2UoKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdWJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHN1YnNbaV0udXBkYXRlKCk7XG4gIH1cbn07XG5cbi8vIHRoZSBjdXJyZW50IHRhcmdldCB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZC5cbi8vIHRoaXMgaXMgZ2xvYmFsbHkgdW5pcXVlIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb25seSBvbmVcbi8vIHdhdGNoZXIgYmVpbmcgZXZhbHVhdGVkIGF0IGFueSB0aW1lLlxuRGVwLnRhcmdldCA9IG51bGw7XG52YXIgdGFyZ2V0U3RhY2sgPSBbXTtcblxuZnVuY3Rpb24gcHVzaFRhcmdldCAoX3RhcmdldCkge1xuICBpZiAoRGVwLnRhcmdldCkgeyB0YXJnZXRTdGFjay5wdXNoKERlcC50YXJnZXQpOyB9XG4gIERlcC50YXJnZXQgPSBfdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBwb3BUYXJnZXQgKCkge1xuICBEZXAudGFyZ2V0ID0gdGFyZ2V0U3RhY2sucG9wKCk7XG59XG5cbi8qXG4gKiBub3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGhcbiAqIGR5bmFtaWNhbGx5IGFjY2Vzc2luZyBtZXRob2RzIG9uIEFycmF5IHByb3RvdHlwZVxuICovXG5cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5jcmVhdGUoYXJyYXlQcm90byk7W1xuICAncHVzaCcsXG4gICdwb3AnLFxuICAnc2hpZnQnLFxuICAndW5zaGlmdCcsXG4gICdzcGxpY2UnLFxuICAnc29ydCcsXG4gICdyZXZlcnNlJ1xuXVxuLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdO1xuICBkZWYoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IgKCkge1xuICAgIHZhciBhcmd1bWVudHMkMSA9IGFyZ3VtZW50cztcblxuICAgIC8vIGF2b2lkIGxlYWtpbmcgYXJndW1lbnRzOlxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2Nsb3N1cmUtd2l0aC1hcmd1bWVudHNcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSk7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50cyQxW2ldO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG4gICAgdmFyIG9iID0gdGhpcy5fX29iX187XG4gICAgdmFyIGluc2VydGVkO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdwdXNoJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgIGluc2VydGVkID0gYXJncztcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKTtcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKGluc2VydGVkKSB7IG9iLm9ic2VydmVBcnJheShpbnNlcnRlZCk7IH1cbiAgICAvLyBub3RpZnkgY2hhbmdlXG4gICAgb2IuZGVwLm5vdGlmeSgpO1xuICAgIHJldHVybiByZXN1bHRcbiAgfSk7XG59KTtcblxuLyogICovXG5cbnZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpO1xuXG4vKipcbiAqIEJ5IGRlZmF1bHQsIHdoZW4gYSByZWFjdGl2ZSBwcm9wZXJ0eSBpcyBzZXQsIHRoZSBuZXcgdmFsdWUgaXNcbiAqIGFsc28gY29udmVydGVkIHRvIGJlY29tZSByZWFjdGl2ZS4gSG93ZXZlciB3aGVuIHBhc3NpbmcgZG93biBwcm9wcyxcbiAqIHdlIGRvbid0IHdhbnQgdG8gZm9yY2UgY29udmVyc2lvbiBiZWNhdXNlIHRoZSB2YWx1ZSBtYXkgYmUgYSBuZXN0ZWQgdmFsdWVcbiAqIHVuZGVyIGEgZnJvemVuIGRhdGEgc3RydWN0dXJlLiBDb252ZXJ0aW5nIGl0IHdvdWxkIGRlZmVhdCB0aGUgb3B0aW1pemF0aW9uLlxuICovXG52YXIgb2JzZXJ2ZXJTdGF0ZSA9IHtcbiAgc2hvdWxkQ29udmVydDogdHJ1ZSxcbiAgaXNTZXR0aW5nUHJvcHM6IGZhbHNlXG59O1xuXG4vKipcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIGVhY2ggb2JzZXJ2ZWRcbiAqIG9iamVjdC4gT25jZSBhdHRhY2hlZCwgdGhlIG9ic2VydmVyIGNvbnZlcnRzIHRhcmdldFxuICogb2JqZWN0J3MgcHJvcGVydHkga2V5cyBpbnRvIGdldHRlci9zZXR0ZXJzIHRoYXRcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaGVzIHVwZGF0ZXMuXG4gKi9cbnZhciBPYnNlcnZlciA9IGZ1bmN0aW9uIE9ic2VydmVyICh2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIHRoaXMuZGVwID0gbmV3IERlcCgpO1xuICB0aGlzLnZtQ291bnQgPSAwO1xuICBkZWYodmFsdWUsICdfX29iX18nLCB0aGlzKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFyIGF1Z21lbnQgPSBoYXNQcm90b1xuICAgICAgPyBwcm90b0F1Z21lbnRcbiAgICAgIDogY29weUF1Z21lbnQ7XG4gICAgYXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzLCBhcnJheUtleXMpO1xuICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLndhbGsodmFsdWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFdhbGsgdGhyb3VnaCBlYWNoIHByb3BlcnR5IGFuZCBjb252ZXJ0IHRoZW0gaW50b1xuICogZ2V0dGVyL3NldHRlcnMuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCB3aGVuXG4gKiB2YWx1ZSB0eXBlIGlzIE9iamVjdC5cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiB3YWxrIChvYmopIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBkZWZpbmVSZWFjdGl2ZSQkMShvYmosIGtleXNbaV0sIG9ialtrZXlzW2ldXSk7XG4gIH1cbn07XG5cbi8qKlxuICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5vYnNlcnZlQXJyYXkgPSBmdW5jdGlvbiBvYnNlcnZlQXJyYXkgKGl0ZW1zKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb2JzZXJ2ZShpdGVtc1tpXSk7XG4gIH1cbn07XG5cbi8vIGhlbHBlcnNcblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXG4gKiB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIF9fcHJvdG9fX1xuICovXG5mdW5jdGlvbiBwcm90b0F1Z21lbnQgKHRhcmdldCwgc3JjKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gIHRhcmdldC5fX3Byb3RvX18gPSBzcmM7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tcHJvdG8gKi9cbn1cblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgZGVmaW5pbmdcbiAqIGhpZGRlbiBwcm9wZXJ0aWVzLlxuICovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZnVuY3Rpb24gY29weUF1Z21lbnQgKHRhcmdldCwgc3JjLCBrZXlzKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBkZWYodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHQgdG8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlIGZvciBhIHZhbHVlLFxuICogcmV0dXJucyB0aGUgbmV3IG9ic2VydmVyIGlmIHN1Y2Nlc3NmdWxseSBvYnNlcnZlZCxcbiAqIG9yIHRoZSBleGlzdGluZyBvYnNlcnZlciBpZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgb25lLlxuICovXG5mdW5jdGlvbiBvYnNlcnZlICh2YWx1ZSwgYXNSb290RGF0YSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBvYjtcbiAgaWYgKGhhc093bih2YWx1ZSwgJ19fb2JfXycpICYmIHZhbHVlLl9fb2JfXyBpbnN0YW5jZW9mIE9ic2VydmVyKSB7XG4gICAgb2IgPSB2YWx1ZS5fX29iX187XG4gIH0gZWxzZSBpZiAoXG4gICAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ICYmXG4gICAgIWlzU2VydmVyUmVuZGVyaW5nKCkgJiZcbiAgICAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgaXNQbGFpbk9iamVjdCh2YWx1ZSkpICYmXG4gICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSh2YWx1ZSkgJiZcbiAgICAhdmFsdWUuX2lzVnVlXG4gICkge1xuICAgIG9iID0gbmV3IE9ic2VydmVyKHZhbHVlKTtcbiAgfVxuICBpZiAoYXNSb290RGF0YSAmJiBvYikge1xuICAgIG9iLnZtQ291bnQrKztcbiAgfVxuICByZXR1cm4gb2Jcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSByZWFjdGl2ZSBwcm9wZXJ0eSBvbiBhbiBPYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlJCQxIChcbiAgb2JqLFxuICBrZXksXG4gIHZhbCxcbiAgY3VzdG9tU2V0dGVyXG4pIHtcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKTtcblxuICB2YXIgcHJvcGVydHkgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KTtcbiAgaWYgKHByb3BlcnR5ICYmIHByb3BlcnR5LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGNhdGVyIGZvciBwcmUtZGVmaW5lZCBnZXR0ZXIvc2V0dGVyc1xuICB2YXIgZ2V0dGVyID0gcHJvcGVydHkgJiYgcHJvcGVydHkuZ2V0O1xuICB2YXIgc2V0dGVyID0gcHJvcGVydHkgJiYgcHJvcGVydHkuc2V0O1xuXG4gIHZhciBjaGlsZE9iID0gb2JzZXJ2ZSh2YWwpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyICgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XG4gICAgICBpZiAoRGVwLnRhcmdldCkge1xuICAgICAgICBkZXAuZGVwZW5kKCk7XG4gICAgICAgIGlmIChjaGlsZE9iKSB7XG4gICAgICAgICAgY2hpbGRPYi5kZXAuZGVwZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgZGVwZW5kQXJyYXkodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVTZXR0ZXIgKG5ld1ZhbCkge1xuICAgICAgdmFyIHZhbHVlID0gZ2V0dGVyID8gZ2V0dGVyLmNhbGwob2JqKSA6IHZhbDtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSAqL1xuICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsdWUgfHwgKG5ld1ZhbCAhPT0gbmV3VmFsICYmIHZhbHVlICE9PSB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSAqL1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGN1c3RvbVNldHRlcikge1xuICAgICAgICBjdXN0b21TZXR0ZXIoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXR0ZXIpIHtcbiAgICAgICAgc2V0dGVyLmNhbGwob2JqLCBuZXdWYWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gbmV3VmFsO1xuICAgICAgfVxuICAgICAgY2hpbGRPYiA9IG9ic2VydmUobmV3VmFsKTtcbiAgICAgIGRlcC5ub3RpZnkoKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFNldCBhIHByb3BlcnR5IG9uIGFuIG9iamVjdC4gQWRkcyB0aGUgbmV3IHByb3BlcnR5IGFuZFxuICogdHJpZ2dlcnMgY2hhbmdlIG5vdGlmaWNhdGlvbiBpZiB0aGUgcHJvcGVydHkgZG9lc24ndFxuICogYWxyZWFkeSBleGlzdC5cbiAqL1xuZnVuY3Rpb24gc2V0ICh0YXJnZXQsIGtleSwgdmFsKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdHlwZW9mIGtleSA9PT0gJ251bWJlcicpIHtcbiAgICB0YXJnZXQubGVuZ3RoID0gTWF0aC5tYXgodGFyZ2V0Lmxlbmd0aCwga2V5KTtcbiAgICB0YXJnZXQuc3BsaWNlKGtleSwgMSwgdmFsKTtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgaWYgKGhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICB0YXJnZXRba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgdmFyIG9iID0gKHRhcmdldCApLl9fb2JfXztcbiAgaWYgKHRhcmdldC5faXNWdWUgfHwgKG9iICYmIG9iLnZtQ291bnQpKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICdBdm9pZCBhZGRpbmcgcmVhY3RpdmUgcHJvcGVydGllcyB0byBhIFZ1ZSBpbnN0YW5jZSBvciBpdHMgcm9vdCAkZGF0YSAnICtcbiAgICAgICdhdCBydW50aW1lIC0gZGVjbGFyZSBpdCB1cGZyb250IGluIHRoZSBkYXRhIG9wdGlvbi4nXG4gICAgKTtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgaWYgKCFvYikge1xuICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgIHJldHVybiB2YWxcbiAgfVxuICBkZWZpbmVSZWFjdGl2ZSQkMShvYi52YWx1ZSwga2V5LCB2YWwpO1xuICBvYi5kZXAubm90aWZ5KCk7XG4gIHJldHVybiB2YWxcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBwcm9wZXJ0eSBhbmQgdHJpZ2dlciBjaGFuZ2UgaWYgbmVjZXNzYXJ5LlxuICovXG5mdW5jdGlvbiBkZWwgKHRhcmdldCwga2V5KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdHlwZW9mIGtleSA9PT0gJ251bWJlcicpIHtcbiAgICB0YXJnZXQuc3BsaWNlKGtleSwgMSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIG9iID0gKHRhcmdldCApLl9fb2JfXztcbiAgaWYgKHRhcmdldC5faXNWdWUgfHwgKG9iICYmIG9iLnZtQ291bnQpKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICdBdm9pZCBkZWxldGluZyBwcm9wZXJ0aWVzIG9uIGEgVnVlIGluc3RhbmNlIG9yIGl0cyByb290ICRkYXRhICcgK1xuICAgICAgJy0ganVzdCBzZXQgaXQgdG8gbnVsbC4nXG4gICAgKTtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoIWhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBkZWxldGUgdGFyZ2V0W2tleV07XG4gIGlmICghb2IpIHtcbiAgICByZXR1cm5cbiAgfVxuICBvYi5kZXAubm90aWZ5KCk7XG59XG5cbi8qKlxuICogQ29sbGVjdCBkZXBlbmRlbmNpZXMgb24gYXJyYXkgZWxlbWVudHMgd2hlbiB0aGUgYXJyYXkgaXMgdG91Y2hlZCwgc2luY2VcbiAqIHdlIGNhbm5vdCBpbnRlcmNlcHQgYXJyYXkgZWxlbWVudCBhY2Nlc3MgbGlrZSBwcm9wZXJ0eSBnZXR0ZXJzLlxuICovXG5mdW5jdGlvbiBkZXBlbmRBcnJheSAodmFsdWUpIHtcbiAgZm9yICh2YXIgZSA9ICh2b2lkIDApLCBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGUgPSB2YWx1ZVtpXTtcbiAgICBlICYmIGUuX19vYl9fICYmIGUuX19vYl9fLmRlcC5kZXBlbmQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgZGVwZW5kQXJyYXkoZSk7XG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIE9wdGlvbiBvdmVyd3JpdGluZyBzdHJhdGVnaWVzIGFyZSBmdW5jdGlvbnMgdGhhdCBoYW5kbGVcbiAqIGhvdyB0byBtZXJnZSBhIHBhcmVudCBvcHRpb24gdmFsdWUgYW5kIGEgY2hpbGQgb3B0aW9uXG4gKiB2YWx1ZSBpbnRvIHRoZSBmaW5hbCB2YWx1ZS5cbiAqL1xudmFyIHN0cmF0cyA9IGNvbmZpZy5vcHRpb25NZXJnZVN0cmF0ZWdpZXM7XG5cbi8qKlxuICogT3B0aW9ucyB3aXRoIHJlc3RyaWN0aW9uc1xuICovXG57XG4gIHN0cmF0cy5lbCA9IHN0cmF0cy5wcm9wc0RhdGEgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCwgdm0sIGtleSkge1xuICAgIGlmICghdm0pIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIFwib3B0aW9uIFxcXCJcIiArIGtleSArIFwiXFxcIiBjYW4gb25seSBiZSB1c2VkIGR1cmluZyBpbnN0YW5jZSBcIiArXG4gICAgICAgICdjcmVhdGlvbiB3aXRoIHRoZSBgbmV3YCBrZXl3b3JkLidcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0U3RyYXQocGFyZW50LCBjaGlsZClcbiAgfTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgdGhhdCByZWN1cnNpdmVseSBtZXJnZXMgdHdvIGRhdGEgb2JqZWN0cyB0b2dldGhlci5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VEYXRhICh0bywgZnJvbSkge1xuICBpZiAoIWZyb20pIHsgcmV0dXJuIHRvIH1cbiAgdmFyIGtleSwgdG9WYWwsIGZyb21WYWw7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJvbSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgdG9WYWwgPSB0b1trZXldO1xuICAgIGZyb21WYWwgPSBmcm9tW2tleV07XG4gICAgaWYgKCFoYXNPd24odG8sIGtleSkpIHtcbiAgICAgIHNldCh0bywga2V5LCBmcm9tVmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodG9WYWwpICYmIGlzUGxhaW5PYmplY3QoZnJvbVZhbCkpIHtcbiAgICAgIG1lcmdlRGF0YSh0b1ZhbCwgZnJvbVZhbCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIERhdGFcbiAqL1xuc3RyYXRzLmRhdGEgPSBmdW5jdGlvbiAoXG4gIHBhcmVudFZhbCxcbiAgY2hpbGRWYWwsXG4gIHZtXG4pIHtcbiAgaWYgKCF2bSkge1xuICAgIC8vIGluIGEgVnVlLmV4dGVuZCBtZXJnZSwgYm90aCBzaG91bGQgYmUgZnVuY3Rpb25zXG4gICAgaWYgKCFjaGlsZFZhbCkge1xuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICAnVGhlIFwiZGF0YVwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcbiAgICAgICAgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArXG4gICAgICAgICdkZWZpbml0aW9ucy4nLFxuICAgICAgICB2bVxuICAgICAgKTtcbiAgICAgIHJldHVybiBwYXJlbnRWYWxcbiAgICB9XG4gICAgaWYgKCFwYXJlbnRWYWwpIHtcbiAgICAgIHJldHVybiBjaGlsZFZhbFxuICAgIH1cbiAgICAvLyB3aGVuIHBhcmVudFZhbCAmIGNoaWxkVmFsIGFyZSBib3RoIHByZXNlbnQsXG4gICAgLy8gd2UgbmVlZCB0byByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gICAgLy8gbWVyZ2VkIHJlc3VsdCBvZiBib3RoIGZ1bmN0aW9ucy4uLiBubyBuZWVkIHRvXG4gICAgLy8gY2hlY2sgaWYgcGFyZW50VmFsIGlzIGEgZnVuY3Rpb24gaGVyZSBiZWNhdXNlXG4gICAgLy8gaXQgaGFzIHRvIGJlIGEgZnVuY3Rpb24gdG8gcGFzcyBwcmV2aW91cyBtZXJnZXMuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbiAoKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKFxuICAgICAgICBjaGlsZFZhbC5jYWxsKHRoaXMpLFxuICAgICAgICBwYXJlbnRWYWwuY2FsbCh0aGlzKVxuICAgICAgKVxuICAgIH1cbiAgfSBlbHNlIGlmIChwYXJlbnRWYWwgfHwgY2hpbGRWYWwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkSW5zdGFuY2VEYXRhRm4gKCkge1xuICAgICAgLy8gaW5zdGFuY2UgbWVyZ2VcbiAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB0eXBlb2YgY2hpbGRWYWwgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyBjaGlsZFZhbC5jYWxsKHZtKVxuICAgICAgICA6IGNoaWxkVmFsO1xuICAgICAgdmFyIGRlZmF1bHREYXRhID0gdHlwZW9mIHBhcmVudFZhbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHBhcmVudFZhbC5jYWxsKHZtKVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChpbnN0YW5jZURhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlRGF0YShpbnN0YW5jZURhdGEsIGRlZmF1bHREYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHREYXRhXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEhvb2tzIGFuZCBwcm9wcyBhcmUgbWVyZ2VkIGFzIGFycmF5cy5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VIb29rIChcbiAgcGFyZW50VmFsLFxuICBjaGlsZFZhbFxuKSB7XG4gIHJldHVybiBjaGlsZFZhbFxuICAgID8gcGFyZW50VmFsXG4gICAgICA/IHBhcmVudFZhbC5jb25jYXQoY2hpbGRWYWwpXG4gICAgICA6IEFycmF5LmlzQXJyYXkoY2hpbGRWYWwpXG4gICAgICAgID8gY2hpbGRWYWxcbiAgICAgICAgOiBbY2hpbGRWYWxdXG4gICAgOiBwYXJlbnRWYWxcbn1cblxuTElGRUNZQ0xFX0hPT0tTLmZvckVhY2goZnVuY3Rpb24gKGhvb2spIHtcbiAgc3RyYXRzW2hvb2tdID0gbWVyZ2VIb29rO1xufSk7XG5cbi8qKlxuICogQXNzZXRzXG4gKlxuICogV2hlbiBhIHZtIGlzIHByZXNlbnQgKGluc3RhbmNlIGNyZWF0aW9uKSwgd2UgbmVlZCB0byBkb1xuICogYSB0aHJlZS13YXkgbWVyZ2UgYmV0d2VlbiBjb25zdHJ1Y3RvciBvcHRpb25zLCBpbnN0YW5jZVxuICogb3B0aW9ucyBhbmQgcGFyZW50IG9wdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlQXNzZXRzIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIHZhciByZXMgPSBPYmplY3QuY3JlYXRlKHBhcmVudFZhbCB8fCBudWxsKTtcbiAgcmV0dXJuIGNoaWxkVmFsXG4gICAgPyBleHRlbmQocmVzLCBjaGlsZFZhbClcbiAgICA6IHJlc1xufVxuXG5BU1NFVF9UWVBFUy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gIHN0cmF0c1t0eXBlICsgJ3MnXSA9IG1lcmdlQXNzZXRzO1xufSk7XG5cbi8qKlxuICogV2F0Y2hlcnMuXG4gKlxuICogV2F0Y2hlcnMgaGFzaGVzIHNob3VsZCBub3Qgb3ZlcndyaXRlIG9uZVxuICogYW5vdGhlciwgc28gd2UgbWVyZ2UgdGhlbSBhcyBhcnJheXMuXG4gKi9cbnN0cmF0cy53YXRjaCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIWNoaWxkVmFsKSB7IHJldHVybiBPYmplY3QuY3JlYXRlKHBhcmVudFZhbCB8fCBudWxsKSB9XG4gIGlmICghcGFyZW50VmFsKSB7IHJldHVybiBjaGlsZFZhbCB9XG4gIHZhciByZXQgPSB7fTtcbiAgZXh0ZW5kKHJldCwgcGFyZW50VmFsKTtcbiAgZm9yICh2YXIga2V5IGluIGNoaWxkVmFsKSB7XG4gICAgdmFyIHBhcmVudCA9IHJldFtrZXldO1xuICAgIHZhciBjaGlsZCA9IGNoaWxkVmFsW2tleV07XG4gICAgaWYgKHBhcmVudCAmJiAhQXJyYXkuaXNBcnJheShwYXJlbnQpKSB7XG4gICAgICBwYXJlbnQgPSBbcGFyZW50XTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBwYXJlbnRcbiAgICAgID8gcGFyZW50LmNvbmNhdChjaGlsZClcbiAgICAgIDogW2NoaWxkXTtcbiAgfVxuICByZXR1cm4gcmV0XG59O1xuXG4vKipcbiAqIE90aGVyIG9iamVjdCBoYXNoZXMuXG4gKi9cbnN0cmF0cy5wcm9wcyA9XG5zdHJhdHMubWV0aG9kcyA9XG5zdHJhdHMuY29tcHV0ZWQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBpZiAoIWNoaWxkVmFsKSB7IHJldHVybiBPYmplY3QuY3JlYXRlKHBhcmVudFZhbCB8fCBudWxsKSB9XG4gIGlmICghcGFyZW50VmFsKSB7IHJldHVybiBjaGlsZFZhbCB9XG4gIHZhciByZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpO1xuICBleHRlbmQocmV0LCBjaGlsZFZhbCk7XG4gIHJldHVybiByZXRcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzdHJhdGVneS5cbiAqL1xudmFyIGRlZmF1bHRTdHJhdCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIHJldHVybiBjaGlsZFZhbCA9PT0gdW5kZWZpbmVkXG4gICAgPyBwYXJlbnRWYWxcbiAgICA6IGNoaWxkVmFsXG59O1xuXG4vKipcbiAqIFZhbGlkYXRlIGNvbXBvbmVudCBuYW1lc1xuICovXG5mdW5jdGlvbiBjaGVja0NvbXBvbmVudHMgKG9wdGlvbnMpIHtcbiAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMuY29tcG9uZW50cykge1xuICAgIHZhciBsb3dlciA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChpc0J1aWx0SW5UYWcobG93ZXIpIHx8IGNvbmZpZy5pc1Jlc2VydmVkVGFnKGxvd2VyKSkge1xuICAgICAgd2FybihcbiAgICAgICAgJ0RvIG5vdCB1c2UgYnVpbHQtaW4gb3IgcmVzZXJ2ZWQgSFRNTCBlbGVtZW50cyBhcyBjb21wb25lbnQgJyArXG4gICAgICAgICdpZDogJyArIGtleVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFbnN1cmUgYWxsIHByb3BzIG9wdGlvbiBzeW50YXggYXJlIG5vcm1hbGl6ZWQgaW50byB0aGVcbiAqIE9iamVjdC1iYXNlZCBmb3JtYXQuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVByb3BzIChvcHRpb25zKSB7XG4gIHZhciBwcm9wcyA9IG9wdGlvbnMucHJvcHM7XG4gIGlmICghcHJvcHMpIHsgcmV0dXJuIH1cbiAgdmFyIHJlcyA9IHt9O1xuICB2YXIgaSwgdmFsLCBuYW1lO1xuICBpZiAoQXJyYXkuaXNBcnJheShwcm9wcykpIHtcbiAgICBpID0gcHJvcHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhbCA9IHByb3BzW2ldO1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG5hbWUgPSBjYW1lbGl6ZSh2YWwpO1xuICAgICAgICByZXNbbmFtZV0gPSB7IHR5cGU6IG51bGwgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdhcm4oJ3Byb3BzIG11c3QgYmUgc3RyaW5ncyB3aGVuIHVzaW5nIGFycmF5IHN5bnRheC4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdChwcm9wcykpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIHZhbCA9IHByb3BzW2tleV07XG4gICAgICBuYW1lID0gY2FtZWxpemUoa2V5KTtcbiAgICAgIHJlc1tuYW1lXSA9IGlzUGxhaW5PYmplY3QodmFsKVxuICAgICAgICA/IHZhbFxuICAgICAgICA6IHsgdHlwZTogdmFsIH07XG4gICAgfVxuICB9XG4gIG9wdGlvbnMucHJvcHMgPSByZXM7XG59XG5cbi8qKlxuICogTm9ybWFsaXplIHJhdyBmdW5jdGlvbiBkaXJlY3RpdmVzIGludG8gb2JqZWN0IGZvcm1hdC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplRGlyZWN0aXZlcyAob3B0aW9ucykge1xuICB2YXIgZGlycyA9IG9wdGlvbnMuZGlyZWN0aXZlcztcbiAgaWYgKGRpcnMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGlycykge1xuICAgICAgdmFyIGRlZiA9IGRpcnNba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRpcnNba2V5XSA9IHsgYmluZDogZGVmLCB1cGRhdGU6IGRlZiB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBvcHRpb24gb2JqZWN0cyBpbnRvIGEgbmV3IG9uZS5cbiAqIENvcmUgdXRpbGl0eSB1c2VkIGluIGJvdGggaW5zdGFudGlhdGlvbiBhbmQgaW5oZXJpdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlT3B0aW9ucyAoXG4gIHBhcmVudCxcbiAgY2hpbGQsXG4gIHZtXG4pIHtcbiAge1xuICAgIGNoZWNrQ29tcG9uZW50cyhjaGlsZCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNoaWxkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2hpbGQgPSBjaGlsZC5vcHRpb25zO1xuICB9XG5cbiAgbm9ybWFsaXplUHJvcHMoY2hpbGQpO1xuICBub3JtYWxpemVEaXJlY3RpdmVzKGNoaWxkKTtcbiAgdmFyIGV4dGVuZHNGcm9tID0gY2hpbGQuZXh0ZW5kcztcbiAgaWYgKGV4dGVuZHNGcm9tKSB7XG4gICAgcGFyZW50ID0gbWVyZ2VPcHRpb25zKHBhcmVudCwgZXh0ZW5kc0Zyb20sIHZtKTtcbiAgfVxuICBpZiAoY2hpbGQubWl4aW5zKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZC5taXhpbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJlbnQgPSBtZXJnZU9wdGlvbnMocGFyZW50LCBjaGlsZC5taXhpbnNbaV0sIHZtKTtcbiAgICB9XG4gIH1cbiAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gcGFyZW50KSB7XG4gICAgbWVyZ2VGaWVsZChrZXkpO1xuICB9XG4gIGZvciAoa2V5IGluIGNoaWxkKSB7XG4gICAgaWYgKCFoYXNPd24ocGFyZW50LCBrZXkpKSB7XG4gICAgICBtZXJnZUZpZWxkKGtleSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1lcmdlRmllbGQgKGtleSkge1xuICAgIHZhciBzdHJhdCA9IHN0cmF0c1trZXldIHx8IGRlZmF1bHRTdHJhdDtcbiAgICBvcHRpb25zW2tleV0gPSBzdHJhdChwYXJlbnRba2V5XSwgY2hpbGRba2V5XSwgdm0sIGtleSk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGFuIGFzc2V0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGJlY2F1c2UgY2hpbGQgaW5zdGFuY2VzIG5lZWQgYWNjZXNzXG4gKiB0byBhc3NldHMgZGVmaW5lZCBpbiBpdHMgYW5jZXN0b3IgY2hhaW4uXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVBc3NldCAoXG4gIG9wdGlvbnMsXG4gIHR5cGUsXG4gIGlkLFxuICB3YXJuTWlzc2luZ1xuKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBhc3NldHMgPSBvcHRpb25zW3R5cGVdO1xuICAvLyBjaGVjayBsb2NhbCByZWdpc3RyYXRpb24gdmFyaWF0aW9ucyBmaXJzdFxuICBpZiAoaGFzT3duKGFzc2V0cywgaWQpKSB7IHJldHVybiBhc3NldHNbaWRdIH1cbiAgdmFyIGNhbWVsaXplZElkID0gY2FtZWxpemUoaWQpO1xuICBpZiAoaGFzT3duKGFzc2V0cywgY2FtZWxpemVkSWQpKSB7IHJldHVybiBhc3NldHNbY2FtZWxpemVkSWRdIH1cbiAgdmFyIFBhc2NhbENhc2VJZCA9IGNhcGl0YWxpemUoY2FtZWxpemVkSWQpO1xuICBpZiAoaGFzT3duKGFzc2V0cywgUGFzY2FsQ2FzZUlkKSkgeyByZXR1cm4gYXNzZXRzW1Bhc2NhbENhc2VJZF0gfVxuICAvLyBmYWxsYmFjayB0byBwcm90b3R5cGUgY2hhaW5cbiAgdmFyIHJlcyA9IGFzc2V0c1tpZF0gfHwgYXNzZXRzW2NhbWVsaXplZElkXSB8fCBhc3NldHNbUGFzY2FsQ2FzZUlkXTtcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm5NaXNzaW5nICYmICFyZXMpIHtcbiAgICB3YXJuKFxuICAgICAgJ0ZhaWxlZCB0byByZXNvbHZlICcgKyB0eXBlLnNsaWNlKDAsIC0xKSArICc6ICcgKyBpZCxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcCAoXG4gIGtleSxcbiAgcHJvcE9wdGlvbnMsXG4gIHByb3BzRGF0YSxcbiAgdm1cbikge1xuICB2YXIgcHJvcCA9IHByb3BPcHRpb25zW2tleV07XG4gIHZhciBhYnNlbnQgPSAhaGFzT3duKHByb3BzRGF0YSwga2V5KTtcbiAgdmFyIHZhbHVlID0gcHJvcHNEYXRhW2tleV07XG4gIC8vIGhhbmRsZSBib29sZWFuIHByb3BzXG4gIGlmIChpc1R5cGUoQm9vbGVhbiwgcHJvcC50eXBlKSkge1xuICAgIGlmIChhYnNlbnQgJiYgIWhhc093bihwcm9wLCAnZGVmYXVsdCcpKSB7XG4gICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIWlzVHlwZShTdHJpbmcsIHByb3AudHlwZSkgJiYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gaHlwaGVuYXRlKGtleSkpKSB7XG4gICAgICB2YWx1ZSA9IHRydWU7XG4gICAgfVxuICB9XG4gIC8vIGNoZWNrIGRlZmF1bHQgdmFsdWVcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICB2YWx1ZSA9IGdldFByb3BEZWZhdWx0VmFsdWUodm0sIHByb3AsIGtleSk7XG4gICAgLy8gc2luY2UgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYSBmcmVzaCBjb3B5LFxuICAgIC8vIG1ha2Ugc3VyZSB0byBvYnNlcnZlIGl0LlxuICAgIHZhciBwcmV2U2hvdWxkQ29udmVydCA9IG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydDtcbiAgICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgPSB0cnVlO1xuICAgIG9ic2VydmUodmFsdWUpO1xuICAgIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IHByZXZTaG91bGRDb252ZXJ0O1xuICB9XG4gIHtcbiAgICBhc3NlcnRQcm9wKHByb3AsIGtleSwgdmFsdWUsIHZtLCBhYnNlbnQpO1xuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIEdldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhIHByb3AuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BEZWZhdWx0VmFsdWUgKHZtLCBwcm9wLCBrZXkpIHtcbiAgLy8gbm8gZGVmYXVsdCwgcmV0dXJuIHVuZGVmaW5lZFxuICBpZiAoIWhhc093bihwcm9wLCAnZGVmYXVsdCcpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG4gIHZhciBkZWYgPSBwcm9wLmRlZmF1bHQ7XG4gIC8vIHdhcm4gYWdhaW5zdCBub24tZmFjdG9yeSBkZWZhdWx0cyBmb3IgT2JqZWN0ICYgQXJyYXlcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGlzT2JqZWN0KGRlZikpIHtcbiAgICB3YXJuKFxuICAgICAgJ0ludmFsaWQgZGVmYXVsdCB2YWx1ZSBmb3IgcHJvcCBcIicgKyBrZXkgKyAnXCI6ICcgK1xuICAgICAgJ1Byb3BzIHdpdGggdHlwZSBPYmplY3QvQXJyYXkgbXVzdCB1c2UgYSBmYWN0b3J5IGZ1bmN0aW9uICcgK1xuICAgICAgJ3RvIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZS4nLFxuICAgICAgdm1cbiAgICApO1xuICB9XG4gIC8vIHRoZSByYXcgcHJvcCB2YWx1ZSB3YXMgYWxzbyB1bmRlZmluZWQgZnJvbSBwcmV2aW91cyByZW5kZXIsXG4gIC8vIHJldHVybiBwcmV2aW91cyBkZWZhdWx0IHZhbHVlIHRvIGF2b2lkIHVubmVjZXNzYXJ5IHdhdGNoZXIgdHJpZ2dlclxuICBpZiAodm0gJiYgdm0uJG9wdGlvbnMucHJvcHNEYXRhICYmXG4gICAgdm0uJG9wdGlvbnMucHJvcHNEYXRhW2tleV0gPT09IHVuZGVmaW5lZCAmJlxuICAgIHZtLl9wcm9wc1trZXldICE9PSB1bmRlZmluZWRcbiAgKSB7XG4gICAgcmV0dXJuIHZtLl9wcm9wc1trZXldXG4gIH1cbiAgLy8gY2FsbCBmYWN0b3J5IGZ1bmN0aW9uIGZvciBub24tRnVuY3Rpb24gdHlwZXNcbiAgLy8gYSB2YWx1ZSBpcyBGdW5jdGlvbiBpZiBpdHMgcHJvdG90eXBlIGlzIGZ1bmN0aW9uIGV2ZW4gYWNyb3NzIGRpZmZlcmVudCBleGVjdXRpb24gY29udGV4dFxuICByZXR1cm4gdHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJyAmJiBnZXRUeXBlKHByb3AudHlwZSkgIT09ICdGdW5jdGlvbidcbiAgICA/IGRlZi5jYWxsKHZtKVxuICAgIDogZGVmXG59XG5cbi8qKlxuICogQXNzZXJ0IHdoZXRoZXIgYSBwcm9wIGlzIHZhbGlkLlxuICovXG5mdW5jdGlvbiBhc3NlcnRQcm9wIChcbiAgcHJvcCxcbiAgbmFtZSxcbiAgdmFsdWUsXG4gIHZtLFxuICBhYnNlbnRcbikge1xuICBpZiAocHJvcC5yZXF1aXJlZCAmJiBhYnNlbnQpIHtcbiAgICB3YXJuKFxuICAgICAgJ01pc3NpbmcgcmVxdWlyZWQgcHJvcDogXCInICsgbmFtZSArICdcIicsXG4gICAgICB2bVxuICAgICk7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgJiYgIXByb3AucmVxdWlyZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdHlwZSA9IHByb3AudHlwZTtcbiAgdmFyIHZhbGlkID0gIXR5cGUgfHwgdHlwZSA9PT0gdHJ1ZTtcbiAgdmFyIGV4cGVjdGVkVHlwZXMgPSBbXTtcbiAgaWYgKHR5cGUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGUgPSBbdHlwZV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZS5sZW5ndGggJiYgIXZhbGlkOyBpKyspIHtcbiAgICAgIHZhciBhc3NlcnRlZFR5cGUgPSBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlW2ldKTtcbiAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChhc3NlcnRlZFR5cGUuZXhwZWN0ZWRUeXBlIHx8ICcnKTtcbiAgICAgIHZhbGlkID0gYXNzZXJ0ZWRUeXBlLnZhbGlkO1xuICAgIH1cbiAgfVxuICBpZiAoIXZhbGlkKSB7XG4gICAgd2FybihcbiAgICAgICdJbnZhbGlkIHByb3A6IHR5cGUgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFwiJyArIG5hbWUgKyAnXCIuJyArXG4gICAgICAnIEV4cGVjdGVkICcgKyBleHBlY3RlZFR5cGVzLm1hcChjYXBpdGFsaXplKS5qb2luKCcsICcpICtcbiAgICAgICcsIGdvdCAnICsgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSkgKyAnLicsXG4gICAgICB2bVxuICAgICk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHZhbGlkYXRvciA9IHByb3AudmFsaWRhdG9yO1xuICBpZiAodmFsaWRhdG9yKSB7XG4gICAgaWYgKCF2YWxpZGF0b3IodmFsdWUpKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAnSW52YWxpZCBwcm9wOiBjdXN0b20gdmFsaWRhdG9yIGNoZWNrIGZhaWxlZCBmb3IgcHJvcCBcIicgKyBuYW1lICsgJ1wiLicsXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG52YXIgc2ltcGxlQ2hlY2tSRSA9IC9eKFN0cmluZ3xOdW1iZXJ8Qm9vbGVhbnxGdW5jdGlvbnxTeW1ib2wpJC87XG5cbmZ1bmN0aW9uIGFzc2VydFR5cGUgKHZhbHVlLCB0eXBlKSB7XG4gIHZhciB2YWxpZDtcbiAgdmFyIGV4cGVjdGVkVHlwZSA9IGdldFR5cGUodHlwZSk7XG4gIGlmIChzaW1wbGVDaGVja1JFLnRlc3QoZXhwZWN0ZWRUeXBlKSkge1xuICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSBleHBlY3RlZFR5cGUudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdPYmplY3QnKSB7XG4gICAgdmFsaWQgPSBpc1BsYWluT2JqZWN0KHZhbHVlKTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdBcnJheScpIHtcbiAgICB2YWxpZCA9IEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkID0gdmFsdWUgaW5zdGFuY2VvZiB0eXBlO1xuICB9XG4gIHJldHVybiB7XG4gICAgdmFsaWQ6IHZhbGlkLFxuICAgIGV4cGVjdGVkVHlwZTogZXhwZWN0ZWRUeXBlXG4gIH1cbn1cblxuLyoqXG4gKiBVc2UgZnVuY3Rpb24gc3RyaW5nIG5hbWUgdG8gY2hlY2sgYnVpbHQtaW4gdHlwZXMsXG4gKiBiZWNhdXNlIGEgc2ltcGxlIGVxdWFsaXR5IGNoZWNrIHdpbGwgZmFpbCB3aGVuIHJ1bm5pbmdcbiAqIGFjcm9zcyBkaWZmZXJlbnQgdm1zIC8gaWZyYW1lcy5cbiAqL1xuZnVuY3Rpb24gZ2V0VHlwZSAoZm4pIHtcbiAgdmFyIG1hdGNoID0gZm4gJiYgZm4udG9TdHJpbmcoKS5tYXRjaCgvXlxccypmdW5jdGlvbiAoXFx3KykvKTtcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xufVxuXG5mdW5jdGlvbiBpc1R5cGUgKHR5cGUsIGZuKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShmbikpIHtcbiAgICByZXR1cm4gZ2V0VHlwZShmbikgPT09IGdldFR5cGUodHlwZSlcbiAgfVxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gZm4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZ2V0VHlwZShmbltpXSkgPT09IGdldFR5cGUodHlwZSkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKiAgKi9cblxudmFyIG1hcms7XG52YXIgbWVhc3VyZTtcblxue1xuICB2YXIgcGVyZiA9IGluQnJvd3NlciAmJiB3aW5kb3cucGVyZm9ybWFuY2U7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoXG4gICAgcGVyZiAmJlxuICAgIHBlcmYubWFyayAmJlxuICAgIHBlcmYubWVhc3VyZSAmJlxuICAgIHBlcmYuY2xlYXJNYXJrcyAmJlxuICAgIHBlcmYuY2xlYXJNZWFzdXJlc1xuICApIHtcbiAgICBtYXJrID0gZnVuY3Rpb24gKHRhZykgeyByZXR1cm4gcGVyZi5tYXJrKHRhZyk7IH07XG4gICAgbWVhc3VyZSA9IGZ1bmN0aW9uIChuYW1lLCBzdGFydFRhZywgZW5kVGFnKSB7XG4gICAgICBwZXJmLm1lYXN1cmUobmFtZSwgc3RhcnRUYWcsIGVuZFRhZyk7XG4gICAgICBwZXJmLmNsZWFyTWFya3Moc3RhcnRUYWcpO1xuICAgICAgcGVyZi5jbGVhck1hcmtzKGVuZFRhZyk7XG4gICAgICBwZXJmLmNsZWFyTWVhc3VyZXMobmFtZSk7XG4gICAgfTtcbiAgfVxufVxuXG4vKiBub3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGggUHJveHkgKi9cblxudmFyIGluaXRQcm94eTtcblxue1xuICB2YXIgYWxsb3dlZEdsb2JhbHMgPSBtYWtlTWFwKFxuICAgICdJbmZpbml0eSx1bmRlZmluZWQsTmFOLGlzRmluaXRlLGlzTmFOLCcgK1xuICAgICdwYXJzZUZsb2F0LHBhcnNlSW50LGRlY29kZVVSSSxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLGVuY29kZVVSSUNvbXBvbmVudCwnICtcbiAgICAnTWF0aCxOdW1iZXIsRGF0ZSxBcnJheSxPYmplY3QsQm9vbGVhbixTdHJpbmcsUmVnRXhwLE1hcCxTZXQsSlNPTixJbnRsLCcgK1xuICAgICdyZXF1aXJlJyAvLyBmb3IgV2VicGFjay9Ccm93c2VyaWZ5XG4gICk7XG5cbiAgdmFyIHdhcm5Ob25QcmVzZW50ID0gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7XG4gICAgd2FybihcbiAgICAgIFwiUHJvcGVydHkgb3IgbWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBpcyBub3QgZGVmaW5lZCBvbiB0aGUgaW5zdGFuY2UgYnV0IFwiICtcbiAgICAgIFwicmVmZXJlbmNlZCBkdXJpbmcgcmVuZGVyLiBNYWtlIHN1cmUgdG8gZGVjbGFyZSByZWFjdGl2ZSBkYXRhIFwiICtcbiAgICAgIFwicHJvcGVydGllcyBpbiB0aGUgZGF0YSBvcHRpb24uXCIsXG4gICAgICB0YXJnZXRcbiAgICApO1xuICB9O1xuXG4gIHZhciBoYXNQcm94eSA9XG4gICAgdHlwZW9mIFByb3h5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIFByb3h5LnRvU3RyaW5nKCkubWF0Y2goL25hdGl2ZSBjb2RlLyk7XG5cbiAgaWYgKGhhc1Byb3h5KSB7XG4gICAgdmFyIGlzQnVpbHRJbk1vZGlmaWVyID0gbWFrZU1hcCgnc3RvcCxwcmV2ZW50LHNlbGYsY3RybCxzaGlmdCxhbHQsbWV0YScpO1xuICAgIGNvbmZpZy5rZXlDb2RlcyA9IG5ldyBQcm94eShjb25maWcua2V5Q29kZXMsIHtcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0ICh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGlzQnVpbHRJbk1vZGlmaWVyKGtleSkpIHtcbiAgICAgICAgICB3YXJuKChcIkF2b2lkIG92ZXJ3cml0aW5nIGJ1aWx0LWluIG1vZGlmaWVyIGluIGNvbmZpZy5rZXlDb2RlczogLlwiICsga2V5KSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgaGFzSGFuZGxlciA9IHtcbiAgICBoYXM6IGZ1bmN0aW9uIGhhcyAodGFyZ2V0LCBrZXkpIHtcbiAgICAgIHZhciBoYXMgPSBrZXkgaW4gdGFyZ2V0O1xuICAgICAgdmFyIGlzQWxsb3dlZCA9IGFsbG93ZWRHbG9iYWxzKGtleSkgfHwga2V5LmNoYXJBdCgwKSA9PT0gJ18nO1xuICAgICAgaWYgKCFoYXMgJiYgIWlzQWxsb3dlZCkge1xuICAgICAgICB3YXJuTm9uUHJlc2VudCh0YXJnZXQsIGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzIHx8ICFpc0FsbG93ZWRcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldEhhbmRsZXIgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKHRhcmdldCwga2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYgIShrZXkgaW4gdGFyZ2V0KSkge1xuICAgICAgICB3YXJuTm9uUHJlc2VudCh0YXJnZXQsIGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV1cbiAgICB9XG4gIH07XG5cbiAgaW5pdFByb3h5ID0gZnVuY3Rpb24gaW5pdFByb3h5ICh2bSkge1xuICAgIGlmIChoYXNQcm94eSkge1xuICAgICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHByb3h5IGhhbmRsZXIgdG8gdXNlXG4gICAgICB2YXIgb3B0aW9ucyA9IHZtLiRvcHRpb25zO1xuICAgICAgdmFyIGhhbmRsZXJzID0gb3B0aW9ucy5yZW5kZXIgJiYgb3B0aW9ucy5yZW5kZXIuX3dpdGhTdHJpcHBlZFxuICAgICAgICA/IGdldEhhbmRsZXJcbiAgICAgICAgOiBoYXNIYW5kbGVyO1xuICAgICAgdm0uX3JlbmRlclByb3h5ID0gbmV3IFByb3h5KHZtLCBoYW5kbGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZtLl9yZW5kZXJQcm94eSA9IHZtO1xuICAgIH1cbiAgfTtcbn1cblxuLyogICovXG5cbnZhciBWTm9kZSA9IGZ1bmN0aW9uIFZOb2RlIChcbiAgdGFnLFxuICBkYXRhLFxuICBjaGlsZHJlbixcbiAgdGV4dCxcbiAgZWxtLFxuICBjb250ZXh0LFxuICBjb21wb25lbnRPcHRpb25zXG4pIHtcbiAgdGhpcy50YWcgPSB0YWc7XG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgdGhpcy5lbG0gPSBlbG07XG4gIHRoaXMubnMgPSB1bmRlZmluZWQ7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMuZnVuY3Rpb25hbENvbnRleHQgPSB1bmRlZmluZWQ7XG4gIHRoaXMua2V5ID0gZGF0YSAmJiBkYXRhLmtleTtcbiAgdGhpcy5jb21wb25lbnRPcHRpb25zID0gY29tcG9uZW50T3B0aW9ucztcbiAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gIHRoaXMucmF3ID0gZmFsc2U7XG4gIHRoaXMuaXNTdGF0aWMgPSBmYWxzZTtcbiAgdGhpcy5pc1Jvb3RJbnNlcnQgPSB0cnVlO1xuICB0aGlzLmlzQ29tbWVudCA9IGZhbHNlO1xuICB0aGlzLmlzQ2xvbmVkID0gZmFsc2U7XG4gIHRoaXMuaXNPbmNlID0gZmFsc2U7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBjaGlsZDoge30gfTtcblxuLy8gREVQUkVDQVRFRDogYWxpYXMgZm9yIGNvbXBvbmVudEluc3RhbmNlIGZvciBiYWNrd2FyZHMgY29tcGF0LlxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5jaGlsZC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmNvbXBvbmVudEluc3RhbmNlXG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggVk5vZGUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxudmFyIGNyZWF0ZUVtcHR5Vk5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlID0gbmV3IFZOb2RlKCk7XG4gIG5vZGUudGV4dCA9ICcnO1xuICBub2RlLmlzQ29tbWVudCA9IHRydWU7XG4gIHJldHVybiBub2RlXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVUZXh0Vk5vZGUgKHZhbCkge1xuICByZXR1cm4gbmV3IFZOb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFN0cmluZyh2YWwpKVxufVxuXG4vLyBvcHRpbWl6ZWQgc2hhbGxvdyBjbG9uZVxuLy8gdXNlZCBmb3Igc3RhdGljIG5vZGVzIGFuZCBzbG90IG5vZGVzIGJlY2F1c2UgdGhleSBtYXkgYmUgcmV1c2VkIGFjcm9zc1xuLy8gbXVsdGlwbGUgcmVuZGVycywgY2xvbmluZyB0aGVtIGF2b2lkcyBlcnJvcnMgd2hlbiBET00gbWFuaXB1bGF0aW9ucyByZWx5XG4vLyBvbiB0aGVpciBlbG0gcmVmZXJlbmNlLlxuZnVuY3Rpb24gY2xvbmVWTm9kZSAodm5vZGUpIHtcbiAgdmFyIGNsb25lZCA9IG5ldyBWTm9kZShcbiAgICB2bm9kZS50YWcsXG4gICAgdm5vZGUuZGF0YSxcbiAgICB2bm9kZS5jaGlsZHJlbixcbiAgICB2bm9kZS50ZXh0LFxuICAgIHZub2RlLmVsbSxcbiAgICB2bm9kZS5jb250ZXh0LFxuICAgIHZub2RlLmNvbXBvbmVudE9wdGlvbnNcbiAgKTtcbiAgY2xvbmVkLm5zID0gdm5vZGUubnM7XG4gIGNsb25lZC5pc1N0YXRpYyA9IHZub2RlLmlzU3RhdGljO1xuICBjbG9uZWQua2V5ID0gdm5vZGUua2V5O1xuICBjbG9uZWQuaXNDb21tZW50ID0gdm5vZGUuaXNDb21tZW50O1xuICBjbG9uZWQuaXNDbG9uZWQgPSB0cnVlO1xuICByZXR1cm4gY2xvbmVkXG59XG5cbmZ1bmN0aW9uIGNsb25lVk5vZGVzICh2bm9kZXMpIHtcbiAgdmFyIGxlbiA9IHZub2Rlcy5sZW5ndGg7XG4gIHZhciByZXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHJlc1tpXSA9IGNsb25lVk5vZGUodm5vZGVzW2ldKTtcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qICAqL1xuXG52YXIgbm9ybWFsaXplRXZlbnQgPSBjYWNoZWQoZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHBhc3NpdmUgPSBuYW1lLmNoYXJBdCgwKSA9PT0gJyYnO1xuICBuYW1lID0gcGFzc2l2ZSA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lO1xuICB2YXIgb25jZSQkMSA9IG5hbWUuY2hhckF0KDApID09PSAnfic7IC8vIFByZWZpeGVkIGxhc3QsIGNoZWNrZWQgZmlyc3RcbiAgbmFtZSA9IG9uY2UkJDEgPyBuYW1lLnNsaWNlKDEpIDogbmFtZTtcbiAgdmFyIGNhcHR1cmUgPSBuYW1lLmNoYXJBdCgwKSA9PT0gJyEnO1xuICBuYW1lID0gY2FwdHVyZSA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lO1xuICByZXR1cm4ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgb25jZTogb25jZSQkMSxcbiAgICBjYXB0dXJlOiBjYXB0dXJlLFxuICAgIHBhc3NpdmU6IHBhc3NpdmVcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZuSW52b2tlciAoZm5zKSB7XG4gIGZ1bmN0aW9uIGludm9rZXIgKCkge1xuICAgIHZhciBhcmd1bWVudHMkMSA9IGFyZ3VtZW50cztcblxuICAgIHZhciBmbnMgPSBpbnZva2VyLmZucztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmbnMpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmbnNbaV0uYXBwbHkobnVsbCwgYXJndW1lbnRzJDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZXR1cm4gaGFuZGxlciByZXR1cm4gdmFsdWUgZm9yIHNpbmdsZSBoYW5kbGVyc1xuICAgICAgcmV0dXJuIGZucy5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIGludm9rZXIuZm5zID0gZm5zO1xuICByZXR1cm4gaW52b2tlclxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaXN0ZW5lcnMgKFxuICBvbixcbiAgb2xkT24sXG4gIGFkZCxcbiAgcmVtb3ZlJCQxLFxuICB2bVxuKSB7XG4gIHZhciBuYW1lLCBjdXIsIG9sZCwgZXZlbnQ7XG4gIGZvciAobmFtZSBpbiBvbikge1xuICAgIGN1ciA9IG9uW25hbWVdO1xuICAgIG9sZCA9IG9sZE9uW25hbWVdO1xuICAgIGV2ZW50ID0gbm9ybWFsaXplRXZlbnQobmFtZSk7XG4gICAgaWYgKGlzVW5kZWYoY3VyKSkge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgXCJJbnZhbGlkIGhhbmRsZXIgZm9yIGV2ZW50IFxcXCJcIiArIChldmVudC5uYW1lKSArIFwiXFxcIjogZ290IFwiICsgU3RyaW5nKGN1ciksXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNVbmRlZihvbGQpKSB7XG4gICAgICBpZiAoaXNVbmRlZihjdXIuZm5zKSkge1xuICAgICAgICBjdXIgPSBvbltuYW1lXSA9IGNyZWF0ZUZuSW52b2tlcihjdXIpO1xuICAgICAgfVxuICAgICAgYWRkKGV2ZW50Lm5hbWUsIGN1ciwgZXZlbnQub25jZSwgZXZlbnQuY2FwdHVyZSwgZXZlbnQucGFzc2l2ZSk7XG4gICAgfSBlbHNlIGlmIChjdXIgIT09IG9sZCkge1xuICAgICAgb2xkLmZucyA9IGN1cjtcbiAgICAgIG9uW25hbWVdID0gb2xkO1xuICAgIH1cbiAgfVxuICBmb3IgKG5hbWUgaW4gb2xkT24pIHtcbiAgICBpZiAoaXNVbmRlZihvbltuYW1lXSkpIHtcbiAgICAgIGV2ZW50ID0gbm9ybWFsaXplRXZlbnQobmFtZSk7XG4gICAgICByZW1vdmUkJDEoZXZlbnQubmFtZSwgb2xkT25bbmFtZV0sIGV2ZW50LmNhcHR1cmUpO1xuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gbWVyZ2VWTm9kZUhvb2sgKGRlZiwgaG9va0tleSwgaG9vaykge1xuICB2YXIgaW52b2tlcjtcbiAgdmFyIG9sZEhvb2sgPSBkZWZbaG9va0tleV07XG5cbiAgZnVuY3Rpb24gd3JhcHBlZEhvb2sgKCkge1xuICAgIGhvb2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAvLyBpbXBvcnRhbnQ6IHJlbW92ZSBtZXJnZWQgaG9vayB0byBlbnN1cmUgaXQncyBjYWxsZWQgb25seSBvbmNlXG4gICAgLy8gYW5kIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICByZW1vdmUoaW52b2tlci5mbnMsIHdyYXBwZWRIb29rKTtcbiAgfVxuXG4gIGlmIChpc1VuZGVmKG9sZEhvb2spKSB7XG4gICAgLy8gbm8gZXhpc3RpbmcgaG9va1xuICAgIGludm9rZXIgPSBjcmVhdGVGbkludm9rZXIoW3dyYXBwZWRIb29rXSk7XG4gIH0gZWxzZSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGlzRGVmKG9sZEhvb2suZm5zKSAmJiBpc1RydWUob2xkSG9vay5tZXJnZWQpKSB7XG4gICAgICAvLyBhbHJlYWR5IGEgbWVyZ2VkIGludm9rZXJcbiAgICAgIGludm9rZXIgPSBvbGRIb29rO1xuICAgICAgaW52b2tlci5mbnMucHVzaCh3cmFwcGVkSG9vayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGV4aXN0aW5nIHBsYWluIGhvb2tcbiAgICAgIGludm9rZXIgPSBjcmVhdGVGbkludm9rZXIoW29sZEhvb2ssIHdyYXBwZWRIb29rXSk7XG4gICAgfVxuICB9XG5cbiAgaW52b2tlci5tZXJnZWQgPSB0cnVlO1xuICBkZWZbaG9va0tleV0gPSBpbnZva2VyO1xufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gZXh0cmFjdFByb3BzRnJvbVZOb2RlRGF0YSAoXG4gIGRhdGEsXG4gIEN0b3IsXG4gIHRhZ1xuKSB7XG4gIC8vIHdlIGFyZSBvbmx5IGV4dHJhY3RpbmcgcmF3IHZhbHVlcyBoZXJlLlxuICAvLyB2YWxpZGF0aW9uIGFuZCBkZWZhdWx0IHZhbHVlcyBhcmUgaGFuZGxlZCBpbiB0aGUgY2hpbGRcbiAgLy8gY29tcG9uZW50IGl0c2VsZi5cbiAgdmFyIHByb3BPcHRpb25zID0gQ3Rvci5vcHRpb25zLnByb3BzO1xuICBpZiAoaXNVbmRlZihwcm9wT3B0aW9ucykpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmVzID0ge307XG4gIHZhciBhdHRycyA9IGRhdGEuYXR0cnM7XG4gIHZhciBwcm9wcyA9IGRhdGEucHJvcHM7XG4gIGlmIChpc0RlZihhdHRycykgfHwgaXNEZWYocHJvcHMpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BPcHRpb25zKSB7XG4gICAgICB2YXIgYWx0S2V5ID0gaHlwaGVuYXRlKGtleSk7XG4gICAgICB7XG4gICAgICAgIHZhciBrZXlJbkxvd2VyQ2FzZSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAga2V5ICE9PSBrZXlJbkxvd2VyQ2FzZSAmJlxuICAgICAgICAgIGF0dHJzICYmIGhhc093bihhdHRycywga2V5SW5Mb3dlckNhc2UpXG4gICAgICAgICkge1xuICAgICAgICAgIHRpcChcbiAgICAgICAgICAgIFwiUHJvcCBcXFwiXCIgKyBrZXlJbkxvd2VyQ2FzZSArIFwiXFxcIiBpcyBwYXNzZWQgdG8gY29tcG9uZW50IFwiICtcbiAgICAgICAgICAgIChmb3JtYXRDb21wb25lbnROYW1lKHRhZyB8fCBDdG9yKSkgKyBcIiwgYnV0IHRoZSBkZWNsYXJlZCBwcm9wIG5hbWUgaXNcIiArXG4gICAgICAgICAgICBcIiBcXFwiXCIgKyBrZXkgKyBcIlxcXCIuIFwiICtcbiAgICAgICAgICAgIFwiTm90ZSB0aGF0IEhUTUwgYXR0cmlidXRlcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZSBhbmQgY2FtZWxDYXNlZCBcIiArXG4gICAgICAgICAgICBcInByb3BzIG5lZWQgdG8gdXNlIHRoZWlyIGtlYmFiLWNhc2UgZXF1aXZhbGVudHMgd2hlbiB1c2luZyBpbi1ET00gXCIgK1xuICAgICAgICAgICAgXCJ0ZW1wbGF0ZXMuIFlvdSBzaG91bGQgcHJvYmFibHkgdXNlIFxcXCJcIiArIGFsdEtleSArIFwiXFxcIiBpbnN0ZWFkIG9mIFxcXCJcIiArIGtleSArIFwiXFxcIi5cIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNoZWNrUHJvcChyZXMsIHByb3BzLCBrZXksIGFsdEtleSwgdHJ1ZSkgfHxcbiAgICAgIGNoZWNrUHJvcChyZXMsIGF0dHJzLCBrZXksIGFsdEtleSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGNoZWNrUHJvcCAoXG4gIHJlcyxcbiAgaGFzaCxcbiAga2V5LFxuICBhbHRLZXksXG4gIHByZXNlcnZlXG4pIHtcbiAgaWYgKGlzRGVmKGhhc2gpKSB7XG4gICAgaWYgKGhhc093bihoYXNoLCBrZXkpKSB7XG4gICAgICByZXNba2V5XSA9IGhhc2hba2V5XTtcbiAgICAgIGlmICghcHJlc2VydmUpIHtcbiAgICAgICAgZGVsZXRlIGhhc2hba2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIGlmIChoYXNPd24oaGFzaCwgYWx0S2V5KSkge1xuICAgICAgcmVzW2tleV0gPSBoYXNoW2FsdEtleV07XG4gICAgICBpZiAoIXByZXNlcnZlKSB7XG4gICAgICAgIGRlbGV0ZSBoYXNoW2FsdEtleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyogICovXG5cbi8vIFRoZSB0ZW1wbGF0ZSBjb21waWxlciBhdHRlbXB0cyB0byBtaW5pbWl6ZSB0aGUgbmVlZCBmb3Igbm9ybWFsaXphdGlvbiBieVxuLy8gc3RhdGljYWxseSBhbmFseXppbmcgdGhlIHRlbXBsYXRlIGF0IGNvbXBpbGUgdGltZS5cbi8vXG4vLyBGb3IgcGxhaW4gSFRNTCBtYXJrdXAsIG5vcm1hbGl6YXRpb24gY2FuIGJlIGNvbXBsZXRlbHkgc2tpcHBlZCBiZWNhdXNlIHRoZVxuLy8gZ2VuZXJhdGVkIHJlbmRlciBmdW5jdGlvbiBpcyBndWFyYW50ZWVkIHRvIHJldHVybiBBcnJheTxWTm9kZT4uIFRoZXJlIGFyZVxuLy8gdHdvIGNhc2VzIHdoZXJlIGV4dHJhIG5vcm1hbGl6YXRpb24gaXMgbmVlZGVkOlxuXG4vLyAxLiBXaGVuIHRoZSBjaGlsZHJlbiBjb250YWlucyBjb21wb25lbnRzIC0gYmVjYXVzZSBhIGZ1bmN0aW9uYWwgY29tcG9uZW50XG4vLyBtYXkgcmV0dXJuIGFuIEFycmF5IGluc3RlYWQgb2YgYSBzaW5nbGUgcm9vdC4gSW4gdGhpcyBjYXNlLCBqdXN0IGEgc2ltcGxlXG4vLyBub3JtYWxpemF0aW9uIGlzIG5lZWRlZCAtIGlmIGFueSBjaGlsZCBpcyBhbiBBcnJheSwgd2UgZmxhdHRlbiB0aGUgd2hvbGVcbi8vIHRoaW5nIHdpdGggQXJyYXkucHJvdG90eXBlLmNvbmNhdC4gSXQgaXMgZ3VhcmFudGVlZCB0byBiZSBvbmx5IDEtbGV2ZWwgZGVlcFxuLy8gYmVjYXVzZSBmdW5jdGlvbmFsIGNvbXBvbmVudHMgYWxyZWFkeSBub3JtYWxpemUgdGhlaXIgb3duIGNoaWxkcmVuLlxuZnVuY3Rpb24gc2ltcGxlTm9ybWFsaXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbltpXSkpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBjaGlsZHJlbilcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoaWxkcmVuXG59XG5cbi8vIDIuIFdoZW4gdGhlIGNoaWxkcmVuIGNvbnRhaW5zIGNvbnN0cnVjdHMgdGhhdCBhbHdheXMgZ2VuZXJhdGVkIG5lc3RlZCBBcnJheXMsXG4vLyBlLmcuIDx0ZW1wbGF0ZT4sIDxzbG90Piwgdi1mb3IsIG9yIHdoZW4gdGhlIGNoaWxkcmVuIGlzIHByb3ZpZGVkIGJ5IHVzZXJcbi8vIHdpdGggaGFuZC13cml0dGVuIHJlbmRlciBmdW5jdGlvbnMgLyBKU1guIEluIHN1Y2ggY2FzZXMgYSBmdWxsIG5vcm1hbGl6YXRpb25cbi8vIGlzIG5lZWRlZCB0byBjYXRlciB0byBhbGwgcG9zc2libGUgdHlwZXMgb2YgY2hpbGRyZW4gdmFsdWVzLlxuZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XG4gIHJldHVybiBpc1ByaW1pdGl2ZShjaGlsZHJlbilcbiAgICA/IFtjcmVhdGVUZXh0Vk5vZGUoY2hpbGRyZW4pXVxuICAgIDogQXJyYXkuaXNBcnJheShjaGlsZHJlbilcbiAgICAgID8gbm9ybWFsaXplQXJyYXlDaGlsZHJlbihjaGlsZHJlbilcbiAgICAgIDogdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIGlzVGV4dE5vZGUgKG5vZGUpIHtcbiAgcmV0dXJuIGlzRGVmKG5vZGUpICYmIGlzRGVmKG5vZGUudGV4dCkgJiYgaXNGYWxzZShub2RlLmlzQ29tbWVudClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXlDaGlsZHJlbiAoY2hpbGRyZW4sIG5lc3RlZEluZGV4KSB7XG4gIHZhciByZXMgPSBbXTtcbiAgdmFyIGksIGMsIGxhc3Q7XG4gIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBjaGlsZHJlbltpXTtcbiAgICBpZiAoaXNVbmRlZihjKSB8fCB0eXBlb2YgYyA9PT0gJ2Jvb2xlYW4nKSB7IGNvbnRpbnVlIH1cbiAgICBsYXN0ID0gcmVzW3Jlcy5sZW5ndGggLSAxXTtcbiAgICAvLyAgbmVzdGVkXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYykpIHtcbiAgICAgIHJlcy5wdXNoLmFwcGx5KHJlcywgbm9ybWFsaXplQXJyYXlDaGlsZHJlbihjLCAoKG5lc3RlZEluZGV4IHx8ICcnKSArIFwiX1wiICsgaSkpKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJpbWl0aXZlKGMpKSB7XG4gICAgICBpZiAoaXNUZXh0Tm9kZShsYXN0KSkge1xuICAgICAgICAvLyBtZXJnZSBhZGphY2VudCB0ZXh0IG5vZGVzXG4gICAgICAgIC8vIHRoaXMgaXMgbmVjZXNzYXJ5IGZvciBTU1IgaHlkcmF0aW9uIGJlY2F1c2UgdGV4dCBub2RlcyBhcmVcbiAgICAgICAgLy8gZXNzZW50aWFsbHkgbWVyZ2VkIHdoZW4gcmVuZGVyZWQgdG8gSFRNTCBzdHJpbmdzXG4gICAgICAgIChsYXN0KS50ZXh0ICs9IFN0cmluZyhjKTtcbiAgICAgIH0gZWxzZSBpZiAoYyAhPT0gJycpIHtcbiAgICAgICAgLy8gY29udmVydCBwcmltaXRpdmUgdG8gdm5vZGVcbiAgICAgICAgcmVzLnB1c2goY3JlYXRlVGV4dFZOb2RlKGMpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzVGV4dE5vZGUoYykgJiYgaXNUZXh0Tm9kZShsYXN0KSkge1xuICAgICAgICAvLyBtZXJnZSBhZGphY2VudCB0ZXh0IG5vZGVzXG4gICAgICAgIHJlc1tyZXMubGVuZ3RoIC0gMV0gPSBjcmVhdGVUZXh0Vk5vZGUobGFzdC50ZXh0ICsgYy50ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlZmF1bHQga2V5IGZvciBuZXN0ZWQgYXJyYXkgY2hpbGRyZW4gKGxpa2VseSBnZW5lcmF0ZWQgYnkgdi1mb3IpXG4gICAgICAgIGlmIChpc1RydWUoY2hpbGRyZW4uX2lzVkxpc3QpICYmXG4gICAgICAgICAgaXNEZWYoYy50YWcpICYmXG4gICAgICAgICAgaXNVbmRlZihjLmtleSkgJiZcbiAgICAgICAgICBpc0RlZihuZXN0ZWRJbmRleCkpIHtcbiAgICAgICAgICBjLmtleSA9IFwiX192bGlzdFwiICsgbmVzdGVkSW5kZXggKyBcIl9cIiArIGkgKyBcIl9fXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnB1c2goYyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGVuc3VyZUN0b3IgKGNvbXAsIGJhc2UpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGNvbXApXG4gICAgPyBiYXNlLmV4dGVuZChjb21wKVxuICAgIDogY29tcFxufVxuXG5mdW5jdGlvbiByZXNvbHZlQXN5bmNDb21wb25lbnQgKFxuICBmYWN0b3J5LFxuICBiYXNlQ3RvcixcbiAgY29udGV4dFxuKSB7XG4gIGlmIChpc1RydWUoZmFjdG9yeS5lcnJvcikgJiYgaXNEZWYoZmFjdG9yeS5lcnJvckNvbXApKSB7XG4gICAgcmV0dXJuIGZhY3RvcnkuZXJyb3JDb21wXG4gIH1cblxuICBpZiAoaXNEZWYoZmFjdG9yeS5yZXNvbHZlZCkpIHtcbiAgICByZXR1cm4gZmFjdG9yeS5yZXNvbHZlZFxuICB9XG5cbiAgaWYgKGlzVHJ1ZShmYWN0b3J5LmxvYWRpbmcpICYmIGlzRGVmKGZhY3RvcnkubG9hZGluZ0NvbXApKSB7XG4gICAgcmV0dXJuIGZhY3RvcnkubG9hZGluZ0NvbXBcbiAgfVxuXG4gIGlmIChpc0RlZihmYWN0b3J5LmNvbnRleHRzKSkge1xuICAgIC8vIGFscmVhZHkgcGVuZGluZ1xuICAgIGZhY3RvcnkuY29udGV4dHMucHVzaChjb250ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29udGV4dHMgPSBmYWN0b3J5LmNvbnRleHRzID0gW2NvbnRleHRdO1xuICAgIHZhciBzeW5jID0gdHJ1ZTtcblxuICAgIHZhciBmb3JjZVJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY29udGV4dHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnRleHRzW2ldLiRmb3JjZVVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzb2x2ZSA9IG9uY2UoZnVuY3Rpb24gKHJlcykge1xuICAgICAgLy8gY2FjaGUgcmVzb2x2ZWRcbiAgICAgIGZhY3RvcnkucmVzb2x2ZWQgPSBlbnN1cmVDdG9yKHJlcywgYmFzZUN0b3IpO1xuICAgICAgLy8gaW52b2tlIGNhbGxiYWNrcyBvbmx5IGlmIHRoaXMgaXMgbm90IGEgc3luY2hyb25vdXMgcmVzb2x2ZVxuICAgICAgLy8gKGFzeW5jIHJlc29sdmVzIGFyZSBzaGltbWVkIGFzIHN5bmNocm9ub3VzIGR1cmluZyBTU1IpXG4gICAgICBpZiAoIXN5bmMpIHtcbiAgICAgICAgZm9yY2VSZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciByZWplY3QgPSBvbmNlKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAgIFwiRmFpbGVkIHRvIHJlc29sdmUgYXN5bmMgY29tcG9uZW50OiBcIiArIChTdHJpbmcoZmFjdG9yeSkpICtcbiAgICAgICAgKHJlYXNvbiA/IChcIlxcblJlYXNvbjogXCIgKyByZWFzb24pIDogJycpXG4gICAgICApO1xuICAgICAgaWYgKGlzRGVmKGZhY3RvcnkuZXJyb3JDb21wKSkge1xuICAgICAgICBmYWN0b3J5LmVycm9yID0gdHJ1ZTtcbiAgICAgICAgZm9yY2VSZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciByZXMgPSBmYWN0b3J5KHJlc29sdmUsIHJlamVjdCk7XG5cbiAgICBpZiAoaXNPYmplY3QocmVzKSkge1xuICAgICAgaWYgKHR5cGVvZiByZXMudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyAoKSA9PiBQcm9taXNlXG4gICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpKSB7XG4gICAgICAgICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc0RlZihyZXMuY29tcG9uZW50KSAmJiB0eXBlb2YgcmVzLmNvbXBvbmVudC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJlcy5jb21wb25lbnQudGhlbihyZXNvbHZlLCByZWplY3QpO1xuXG4gICAgICAgIGlmIChpc0RlZihyZXMuZXJyb3IpKSB7XG4gICAgICAgICAgZmFjdG9yeS5lcnJvckNvbXAgPSBlbnN1cmVDdG9yKHJlcy5lcnJvciwgYmFzZUN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRGVmKHJlcy5sb2FkaW5nKSkge1xuICAgICAgICAgIGZhY3RvcnkubG9hZGluZ0NvbXAgPSBlbnN1cmVDdG9yKHJlcy5sb2FkaW5nLCBiYXNlQ3Rvcik7XG4gICAgICAgICAgaWYgKHJlcy5kZWxheSA9PT0gMCkge1xuICAgICAgICAgICAgZmFjdG9yeS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpICYmIGlzVW5kZWYoZmFjdG9yeS5lcnJvcikpIHtcbiAgICAgICAgICAgICAgICBmYWN0b3J5LmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcmNlUmVuZGVyKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHJlcy5kZWxheSB8fCAyMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0RlZihyZXMudGltZW91dCkpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpc1VuZGVmKGZhY3RvcnkucmVzb2x2ZWQpKSB7XG4gICAgICAgICAgICAgIHJlamVjdChcbiAgICAgICAgICAgICAgICBcInRpbWVvdXQgKFwiICsgKHJlcy50aW1lb3V0KSArIFwibXMpXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCByZXMudGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzeW5jID0gZmFsc2U7XG4gICAgLy8gcmV0dXJuIGluIGNhc2UgcmVzb2x2ZWQgc3luY2hyb25vdXNseVxuICAgIHJldHVybiBmYWN0b3J5LmxvYWRpbmdcbiAgICAgID8gZmFjdG9yeS5sb2FkaW5nQ29tcFxuICAgICAgOiBmYWN0b3J5LnJlc29sdmVkXG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGdldEZpcnN0Q29tcG9uZW50Q2hpbGQgKGNoaWxkcmVuKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2hpbGRyZW5baV07XG4gICAgICBpZiAoaXNEZWYoYykgJiYgaXNEZWYoYy5jb21wb25lbnRPcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gY1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRFdmVudHMgKHZtKSB7XG4gIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2bS5faGFzSG9va0V2ZW50ID0gZmFsc2U7XG4gIC8vIGluaXQgcGFyZW50IGF0dGFjaGVkIGV2ZW50c1xuICB2YXIgbGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgaWYgKGxpc3RlbmVycykge1xuICAgIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyh2bSwgbGlzdGVuZXJzKTtcbiAgfVxufVxuXG52YXIgdGFyZ2V0O1xuXG5mdW5jdGlvbiBhZGQgKGV2ZW50LCBmbiwgb25jZSQkMSkge1xuICBpZiAob25jZSQkMSkge1xuICAgIHRhcmdldC4kb25jZShldmVudCwgZm4pO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldC4kb24oZXZlbnQsIGZuKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmUkMSAoZXZlbnQsIGZuKSB7XG4gIHRhcmdldC4kb2ZmKGV2ZW50LCBmbik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyAoXG4gIHZtLFxuICBsaXN0ZW5lcnMsXG4gIG9sZExpc3RlbmVyc1xuKSB7XG4gIHRhcmdldCA9IHZtO1xuICB1cGRhdGVMaXN0ZW5lcnMobGlzdGVuZXJzLCBvbGRMaXN0ZW5lcnMgfHwge30sIGFkZCwgcmVtb3ZlJDEsIHZtKTtcbn1cblxuZnVuY3Rpb24gZXZlbnRzTWl4aW4gKFZ1ZSkge1xuICB2YXIgaG9va1JFID0gL15ob29rOi87XG4gIFZ1ZS5wcm90b3R5cGUuJG9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZXZlbnQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMkMS4kb24oZXZlbnRbaV0sIGZuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgKHZtLl9ldmVudHNbZXZlbnRdIHx8ICh2bS5fZXZlbnRzW2V2ZW50XSA9IFtdKSkucHVzaChmbik7XG4gICAgICAvLyBvcHRpbWl6ZSBob29rOmV2ZW50IGNvc3QgYnkgdXNpbmcgYSBib29sZWFuIGZsYWcgbWFya2VkIGF0IHJlZ2lzdHJhdGlvblxuICAgICAgLy8gaW5zdGVhZCBvZiBhIGhhc2ggbG9va3VwXG4gICAgICBpZiAoaG9va1JFLnRlc3QoZXZlbnQpKSB7XG4gICAgICAgIHZtLl9oYXNIb29rRXZlbnQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdm1cbiAgfTtcblxuICBWdWUucHJvdG90eXBlLiRvbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgZnVuY3Rpb24gb24gKCkge1xuICAgICAgdm0uJG9mZihldmVudCwgb24pO1xuICAgICAgZm4uYXBwbHkodm0sIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIG9uLmZuID0gZm47XG4gICAgdm0uJG9uKGV2ZW50LCBvbik7XG4gICAgcmV0dXJuIHZtXG4gIH07XG5cbiAgVnVlLnByb3RvdHlwZS4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICAvLyBhbGxcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgcmV0dXJuIHZtXG4gICAgfVxuICAgIC8vIGFycmF5IG9mIGV2ZW50c1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgZm9yICh2YXIgaSQxID0gMCwgbCA9IGV2ZW50Lmxlbmd0aDsgaSQxIDwgbDsgaSQxKyspIHtcbiAgICAgICAgdGhpcyQxLiRvZmYoZXZlbnRbaSQxXSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZtXG4gICAgfVxuICAgIC8vIHNwZWNpZmljIGV2ZW50XG4gICAgdmFyIGNicyA9IHZtLl9ldmVudHNbZXZlbnRdO1xuICAgIGlmICghY2JzKSB7XG4gICAgICByZXR1cm4gdm1cbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZtLl9ldmVudHNbZXZlbnRdID0gbnVsbDtcbiAgICAgIHJldHVybiB2bVxuICAgIH1cbiAgICAvLyBzcGVjaWZpYyBoYW5kbGVyXG4gICAgdmFyIGNiO1xuICAgIHZhciBpID0gY2JzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjYiA9IGNic1tpXTtcbiAgICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICAgIGNicy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2bVxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuJGVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHtcbiAgICAgIHZhciBsb3dlckNhc2VFdmVudCA9IGV2ZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAobG93ZXJDYXNlRXZlbnQgIT09IGV2ZW50ICYmIHZtLl9ldmVudHNbbG93ZXJDYXNlRXZlbnRdKSB7XG4gICAgICAgIHRpcChcbiAgICAgICAgICBcIkV2ZW50IFxcXCJcIiArIGxvd2VyQ2FzZUV2ZW50ICsgXCJcXFwiIGlzIGVtaXR0ZWQgaW4gY29tcG9uZW50IFwiICtcbiAgICAgICAgICAoZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpICsgXCIgYnV0IHRoZSBoYW5kbGVyIGlzIHJlZ2lzdGVyZWQgZm9yIFxcXCJcIiArIGV2ZW50ICsgXCJcXFwiLiBcIiArXG4gICAgICAgICAgXCJOb3RlIHRoYXQgSFRNTCBhdHRyaWJ1dGVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlIGFuZCB5b3UgY2Fubm90IHVzZSBcIiArXG4gICAgICAgICAgXCJ2LW9uIHRvIGxpc3RlbiB0byBjYW1lbENhc2UgZXZlbnRzIHdoZW4gdXNpbmcgaW4tRE9NIHRlbXBsYXRlcy4gXCIgK1xuICAgICAgICAgIFwiWW91IHNob3VsZCBwcm9iYWJseSB1c2UgXFxcIlwiICsgKGh5cGhlbmF0ZShldmVudCkpICsgXCJcXFwiIGluc3RlYWQgb2YgXFxcIlwiICsgZXZlbnQgKyBcIlxcXCIuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNicyA9IHZtLl9ldmVudHNbZXZlbnRdO1xuICAgIGlmIChjYnMpIHtcbiAgICAgIGNicyA9IGNicy5sZW5ndGggPiAxID8gdG9BcnJheShjYnMpIDogY2JzO1xuICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cywgMSk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY2JzW2ldLmFwcGx5KHZtLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZtXG4gIH07XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciByZXNvbHZpbmcgcmF3IGNoaWxkcmVuIFZOb2RlcyBpbnRvIGEgc2xvdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVTbG90cyAoXG4gIGNoaWxkcmVuLFxuICBjb250ZXh0XG4pIHtcbiAgdmFyIHNsb3RzID0ge307XG4gIGlmICghY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gc2xvdHNcbiAgfVxuICB2YXIgZGVmYXVsdFNsb3QgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAvLyBuYW1lZCBzbG90cyBzaG91bGQgb25seSBiZSByZXNwZWN0ZWQgaWYgdGhlIHZub2RlIHdhcyByZW5kZXJlZCBpbiB0aGVcbiAgICAvLyBzYW1lIGNvbnRleHQuXG4gICAgaWYgKChjaGlsZC5jb250ZXh0ID09PSBjb250ZXh0IHx8IGNoaWxkLmZ1bmN0aW9uYWxDb250ZXh0ID09PSBjb250ZXh0KSAmJlxuICAgICAgY2hpbGQuZGF0YSAmJiBjaGlsZC5kYXRhLnNsb3QgIT0gbnVsbFxuICAgICkge1xuICAgICAgdmFyIG5hbWUgPSBjaGlsZC5kYXRhLnNsb3Q7XG4gICAgICB2YXIgc2xvdCA9IChzbG90c1tuYW1lXSB8fCAoc2xvdHNbbmFtZV0gPSBbXSkpO1xuICAgICAgaWYgKGNoaWxkLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICBzbG90LnB1c2guYXBwbHkoc2xvdCwgY2hpbGQuY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xvdC5wdXNoKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNsb3QucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG4gIC8vIGlnbm9yZSB3aGl0ZXNwYWNlXG4gIGlmICghZGVmYXVsdFNsb3QuZXZlcnkoaXNXaGl0ZXNwYWNlKSkge1xuICAgIHNsb3RzLmRlZmF1bHQgPSBkZWZhdWx0U2xvdDtcbiAgfVxuICByZXR1cm4gc2xvdHNcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChub2RlKSB7XG4gIHJldHVybiBub2RlLmlzQ29tbWVudCB8fCBub2RlLnRleHQgPT09ICcgJ1xufVxuXG5mdW5jdGlvbiByZXNvbHZlU2NvcGVkU2xvdHMgKFxuICBmbnMsIC8vIHNlZSBmbG93L3Zub2RlXG4gIHJlc1xuKSB7XG4gIHJlcyA9IHJlcyB8fCB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmbnNbaV0pKSB7XG4gICAgICByZXNvbHZlU2NvcGVkU2xvdHMoZm5zW2ldLCByZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNbZm5zW2ldLmtleV0gPSBmbnNbaV0uZm47XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbnZhciBhY3RpdmVJbnN0YW5jZSA9IG51bGw7XG5cbmZ1bmN0aW9uIGluaXRMaWZlY3ljbGUgKHZtKSB7XG4gIHZhciBvcHRpb25zID0gdm0uJG9wdGlvbnM7XG5cbiAgLy8gbG9jYXRlIGZpcnN0IG5vbi1hYnN0cmFjdCBwYXJlbnRcbiAgdmFyIHBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xuICBpZiAocGFyZW50ICYmICFvcHRpb25zLmFic3RyYWN0KSB7XG4gICAgd2hpbGUgKHBhcmVudC4kb3B0aW9ucy5hYnN0cmFjdCAmJiBwYXJlbnQuJHBhcmVudCkge1xuICAgICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnQ7XG4gICAgfVxuICAgIHBhcmVudC4kY2hpbGRyZW4ucHVzaCh2bSk7XG4gIH1cblxuICB2bS4kcGFyZW50ID0gcGFyZW50O1xuICB2bS4kcm9vdCA9IHBhcmVudCA/IHBhcmVudC4kcm9vdCA6IHZtO1xuXG4gIHZtLiRjaGlsZHJlbiA9IFtdO1xuICB2bS4kcmVmcyA9IHt9O1xuXG4gIHZtLl93YXRjaGVyID0gbnVsbDtcbiAgdm0uX2luYWN0aXZlID0gbnVsbDtcbiAgdm0uX2RpcmVjdEluYWN0aXZlID0gZmFsc2U7XG4gIHZtLl9pc01vdW50ZWQgPSBmYWxzZTtcbiAgdm0uX2lzRGVzdHJveWVkID0gZmFsc2U7XG4gIHZtLl9pc0JlaW5nRGVzdHJveWVkID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGxpZmVjeWNsZU1peGluIChWdWUpIHtcbiAgVnVlLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIGlmICh2bS5faXNNb3VudGVkKSB7XG4gICAgICBjYWxsSG9vayh2bSwgJ2JlZm9yZVVwZGF0ZScpO1xuICAgIH1cbiAgICB2YXIgcHJldkVsID0gdm0uJGVsO1xuICAgIHZhciBwcmV2Vm5vZGUgPSB2bS5fdm5vZGU7XG4gICAgdmFyIHByZXZBY3RpdmVJbnN0YW5jZSA9IGFjdGl2ZUluc3RhbmNlO1xuICAgIGFjdGl2ZUluc3RhbmNlID0gdm07XG4gICAgdm0uX3Zub2RlID0gdm5vZGU7XG4gICAgLy8gVnVlLnByb3RvdHlwZS5fX3BhdGNoX18gaXMgaW5qZWN0ZWQgaW4gZW50cnkgcG9pbnRzXG4gICAgLy8gYmFzZWQgb24gdGhlIHJlbmRlcmluZyBiYWNrZW5kIHVzZWQuXG4gICAgaWYgKCFwcmV2Vm5vZGUpIHtcbiAgICAgIC8vIGluaXRpYWwgcmVuZGVyXG4gICAgICB2bS4kZWwgPSB2bS5fX3BhdGNoX18oXG4gICAgICAgIHZtLiRlbCwgdm5vZGUsIGh5ZHJhdGluZywgZmFsc2UgLyogcmVtb3ZlT25seSAqLyxcbiAgICAgICAgdm0uJG9wdGlvbnMuX3BhcmVudEVsbSxcbiAgICAgICAgdm0uJG9wdGlvbnMuX3JlZkVsbVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdXBkYXRlc1xuICAgICAgdm0uJGVsID0gdm0uX19wYXRjaF9fKHByZXZWbm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICBhY3RpdmVJbnN0YW5jZSA9IHByZXZBY3RpdmVJbnN0YW5jZTtcbiAgICAvLyB1cGRhdGUgX192dWVfXyByZWZlcmVuY2VcbiAgICBpZiAocHJldkVsKSB7XG4gICAgICBwcmV2RWwuX192dWVfXyA9IG51bGw7XG4gICAgfVxuICAgIGlmICh2bS4kZWwpIHtcbiAgICAgIHZtLiRlbC5fX3Z1ZV9fID0gdm07XG4gICAgfVxuICAgIC8vIGlmIHBhcmVudCBpcyBhbiBIT0MsIHVwZGF0ZSBpdHMgJGVsIGFzIHdlbGxcbiAgICBpZiAodm0uJHZub2RlICYmIHZtLiRwYXJlbnQgJiYgdm0uJHZub2RlID09PSB2bS4kcGFyZW50Ll92bm9kZSkge1xuICAgICAgdm0uJHBhcmVudC4kZWwgPSB2bS4kZWw7XG4gICAgfVxuICAgIC8vIHVwZGF0ZWQgaG9vayBpcyBjYWxsZWQgYnkgdGhlIHNjaGVkdWxlciB0byBlbnN1cmUgdGhhdCBjaGlsZHJlbiBhcmVcbiAgICAvLyB1cGRhdGVkIGluIGEgcGFyZW50J3MgdXBkYXRlZCBob29rLlxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuJGZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgaWYgKHZtLl93YXRjaGVyKSB7XG4gICAgICB2bS5fd2F0Y2hlci51cGRhdGUoKTtcbiAgICB9XG4gIH07XG5cbiAgVnVlLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIGlmICh2bS5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlRGVzdHJveScpO1xuICAgIHZtLl9pc0JlaW5nRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHBhcmVudFxuICAgIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50O1xuICAgIGlmIChwYXJlbnQgJiYgIXBhcmVudC5faXNCZWluZ0Rlc3Ryb3llZCAmJiAhdm0uJG9wdGlvbnMuYWJzdHJhY3QpIHtcbiAgICAgIHJlbW92ZShwYXJlbnQuJGNoaWxkcmVuLCB2bSk7XG4gICAgfVxuICAgIC8vIHRlYXJkb3duIHdhdGNoZXJzXG4gICAgaWYgKHZtLl93YXRjaGVyKSB7XG4gICAgICB2bS5fd2F0Y2hlci50ZWFyZG93bigpO1xuICAgIH1cbiAgICB2YXIgaSA9IHZtLl93YXRjaGVycy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdm0uX3dhdGNoZXJzW2ldLnRlYXJkb3duKCk7XG4gICAgfVxuICAgIC8vIHJlbW92ZSByZWZlcmVuY2UgZnJvbSBkYXRhIG9iXG4gICAgLy8gZnJvemVuIG9iamVjdCBtYXkgbm90IGhhdmUgb2JzZXJ2ZXIuXG4gICAgaWYgKHZtLl9kYXRhLl9fb2JfXykge1xuICAgICAgdm0uX2RhdGEuX19vYl9fLnZtQ291bnQtLTtcbiAgICB9XG4gICAgLy8gY2FsbCB0aGUgbGFzdCBob29rLi4uXG4gICAgdm0uX2lzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyBpbnZva2UgZGVzdHJveSBob29rcyBvbiBjdXJyZW50IHJlbmRlcmVkIHRyZWVcbiAgICB2bS5fX3BhdGNoX18odm0uX3Zub2RlLCBudWxsKTtcbiAgICAvLyBmaXJlIGRlc3Ryb3llZCBob29rXG4gICAgY2FsbEhvb2sodm0sICdkZXN0cm95ZWQnKTtcbiAgICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxuICAgIHZtLiRvZmYoKTtcbiAgICAvLyByZW1vdmUgX192dWVfXyByZWZlcmVuY2VcbiAgICBpZiAodm0uJGVsKSB7XG4gICAgICB2bS4kZWwuX192dWVfXyA9IG51bGw7XG4gICAgfVxuICAgIC8vIHJlbW92ZSByZWZlcmVuY2UgdG8gRE9NIG5vZGVzIChwcmV2ZW50cyBsZWFrKVxuICAgIHZtLiRvcHRpb25zLl9wYXJlbnRFbG0gPSB2bS4kb3B0aW9ucy5fcmVmRWxtID0gbnVsbDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbW91bnRDb21wb25lbnQgKFxuICB2bSxcbiAgZWwsXG4gIGh5ZHJhdGluZ1xuKSB7XG4gIHZtLiRlbCA9IGVsO1xuICBpZiAoIXZtLiRvcHRpb25zLnJlbmRlcikge1xuICAgIHZtLiRvcHRpb25zLnJlbmRlciA9IGNyZWF0ZUVtcHR5Vk5vZGU7XG4gICAge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoKHZtLiRvcHRpb25zLnRlbXBsYXRlICYmIHZtLiRvcHRpb25zLnRlbXBsYXRlLmNoYXJBdCgwKSAhPT0gJyMnKSB8fFxuICAgICAgICB2bS4kb3B0aW9ucy5lbCB8fCBlbCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdZb3UgYXJlIHVzaW5nIHRoZSBydW50aW1lLW9ubHkgYnVpbGQgb2YgVnVlIHdoZXJlIHRoZSB0ZW1wbGF0ZSAnICtcbiAgICAgICAgICAnY29tcGlsZXIgaXMgbm90IGF2YWlsYWJsZS4gRWl0aGVyIHByZS1jb21waWxlIHRoZSB0ZW1wbGF0ZXMgaW50byAnICtcbiAgICAgICAgICAncmVuZGVyIGZ1bmN0aW9ucywgb3IgdXNlIHRoZSBjb21waWxlci1pbmNsdWRlZCBidWlsZC4nLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdGYWlsZWQgdG8gbW91bnQgY29tcG9uZW50OiB0ZW1wbGF0ZSBvciByZW5kZXIgZnVuY3Rpb24gbm90IGRlZmluZWQuJyxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYWxsSG9vayh2bSwgJ2JlZm9yZU1vdW50Jyk7XG5cbiAgdmFyIHVwZGF0ZUNvbXBvbmVudDtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgbWFyaykge1xuICAgIHVwZGF0ZUNvbXBvbmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuYW1lID0gdm0uX25hbWU7XG4gICAgICB2YXIgaWQgPSB2bS5fdWlkO1xuICAgICAgdmFyIHN0YXJ0VGFnID0gXCJ2dWUtcGVyZi1zdGFydDpcIiArIGlkO1xuICAgICAgdmFyIGVuZFRhZyA9IFwidnVlLXBlcmYtZW5kOlwiICsgaWQ7XG5cbiAgICAgIG1hcmsoc3RhcnRUYWcpO1xuICAgICAgdmFyIHZub2RlID0gdm0uX3JlbmRlcigpO1xuICAgICAgbWFyayhlbmRUYWcpO1xuICAgICAgbWVhc3VyZSgobmFtZSArIFwiIHJlbmRlclwiKSwgc3RhcnRUYWcsIGVuZFRhZyk7XG5cbiAgICAgIG1hcmsoc3RhcnRUYWcpO1xuICAgICAgdm0uX3VwZGF0ZSh2bm9kZSwgaHlkcmF0aW5nKTtcbiAgICAgIG1hcmsoZW5kVGFnKTtcbiAgICAgIG1lYXN1cmUoKG5hbWUgKyBcIiBwYXRjaFwiKSwgc3RhcnRUYWcsIGVuZFRhZyk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB1cGRhdGVDb21wb25lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2bS5fdXBkYXRlKHZtLl9yZW5kZXIoKSwgaHlkcmF0aW5nKTtcbiAgICB9O1xuICB9XG5cbiAgdm0uX3dhdGNoZXIgPSBuZXcgV2F0Y2hlcih2bSwgdXBkYXRlQ29tcG9uZW50LCBub29wKTtcbiAgaHlkcmF0aW5nID0gZmFsc2U7XG5cbiAgLy8gbWFudWFsbHkgbW91bnRlZCBpbnN0YW5jZSwgY2FsbCBtb3VudGVkIG9uIHNlbGZcbiAgLy8gbW91bnRlZCBpcyBjYWxsZWQgZm9yIHJlbmRlci1jcmVhdGVkIGNoaWxkIGNvbXBvbmVudHMgaW4gaXRzIGluc2VydGVkIGhvb2tcbiAgaWYgKHZtLiR2bm9kZSA9PSBudWxsKSB7XG4gICAgdm0uX2lzTW91bnRlZCA9IHRydWU7XG4gICAgY2FsbEhvb2sodm0sICdtb3VudGVkJyk7XG4gIH1cbiAgcmV0dXJuIHZtXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkQ29tcG9uZW50IChcbiAgdm0sXG4gIHByb3BzRGF0YSxcbiAgbGlzdGVuZXJzLFxuICBwYXJlbnRWbm9kZSxcbiAgcmVuZGVyQ2hpbGRyZW5cbikge1xuICAvLyBkZXRlcm1pbmUgd2hldGhlciBjb21wb25lbnQgaGFzIHNsb3QgY2hpbGRyZW5cbiAgLy8gd2UgbmVlZCB0byBkbyB0aGlzIGJlZm9yZSBvdmVyd3JpdGluZyAkb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW5cbiAgdmFyIGhhc0NoaWxkcmVuID0gISEoXG4gICAgcmVuZGVyQ2hpbGRyZW4gfHwgICAgICAgICAgICAgICAvLyBoYXMgbmV3IHN0YXRpYyBzbG90c1xuICAgIHZtLiRvcHRpb25zLl9yZW5kZXJDaGlsZHJlbiB8fCAgLy8gaGFzIG9sZCBzdGF0aWMgc2xvdHNcbiAgICBwYXJlbnRWbm9kZS5kYXRhLnNjb3BlZFNsb3RzIHx8IC8vIGhhcyBuZXcgc2NvcGVkIHNsb3RzXG4gICAgdm0uJHNjb3BlZFNsb3RzICE9PSBlbXB0eU9iamVjdCAvLyBoYXMgb2xkIHNjb3BlZCBzbG90c1xuICApO1xuXG4gIHZtLiRvcHRpb25zLl9wYXJlbnRWbm9kZSA9IHBhcmVudFZub2RlO1xuICB2bS4kdm5vZGUgPSBwYXJlbnRWbm9kZTsgLy8gdXBkYXRlIHZtJ3MgcGxhY2Vob2xkZXIgbm9kZSB3aXRob3V0IHJlLXJlbmRlclxuICBpZiAodm0uX3Zub2RlKSB7IC8vIHVwZGF0ZSBjaGlsZCB0cmVlJ3MgcGFyZW50XG4gICAgdm0uX3Zub2RlLnBhcmVudCA9IHBhcmVudFZub2RlO1xuICB9XG4gIHZtLiRvcHRpb25zLl9yZW5kZXJDaGlsZHJlbiA9IHJlbmRlckNoaWxkcmVuO1xuXG4gIC8vIHVwZGF0ZSBwcm9wc1xuICBpZiAocHJvcHNEYXRhICYmIHZtLiRvcHRpb25zLnByb3BzKSB7XG4gICAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ID0gZmFsc2U7XG4gICAge1xuICAgICAgb2JzZXJ2ZXJTdGF0ZS5pc1NldHRpbmdQcm9wcyA9IHRydWU7XG4gICAgfVxuICAgIHZhciBwcm9wcyA9IHZtLl9wcm9wcztcbiAgICB2YXIgcHJvcEtleXMgPSB2bS4kb3B0aW9ucy5fcHJvcEtleXMgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IHByb3BLZXlzW2ldO1xuICAgICAgcHJvcHNba2V5XSA9IHZhbGlkYXRlUHJvcChrZXksIHZtLiRvcHRpb25zLnByb3BzLCBwcm9wc0RhdGEsIHZtKTtcbiAgICB9XG4gICAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ID0gdHJ1ZTtcbiAgICB7XG4gICAgICBvYnNlcnZlclN0YXRlLmlzU2V0dGluZ1Byb3BzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGtlZXAgYSBjb3B5IG9mIHJhdyBwcm9wc0RhdGFcbiAgICB2bS4kb3B0aW9ucy5wcm9wc0RhdGEgPSBwcm9wc0RhdGE7XG4gIH1cbiAgLy8gdXBkYXRlIGxpc3RlbmVyc1xuICBpZiAobGlzdGVuZXJzKSB7XG4gICAgdmFyIG9sZExpc3RlbmVycyA9IHZtLiRvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnM7XG4gICAgdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycyA9IGxpc3RlbmVycztcbiAgICB1cGRhdGVDb21wb25lbnRMaXN0ZW5lcnModm0sIGxpc3RlbmVycywgb2xkTGlzdGVuZXJzKTtcbiAgfVxuICAvLyByZXNvbHZlIHNsb3RzICsgZm9yY2UgdXBkYXRlIGlmIGhhcyBjaGlsZHJlblxuICBpZiAoaGFzQ2hpbGRyZW4pIHtcbiAgICB2bS4kc2xvdHMgPSByZXNvbHZlU2xvdHMocmVuZGVyQ2hpbGRyZW4sIHBhcmVudFZub2RlLmNvbnRleHQpO1xuICAgIHZtLiRmb3JjZVVwZGF0ZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzSW5JbmFjdGl2ZVRyZWUgKHZtKSB7XG4gIHdoaWxlICh2bSAmJiAodm0gPSB2bS4kcGFyZW50KSkge1xuICAgIGlmICh2bS5faW5hY3RpdmUpIHsgcmV0dXJuIHRydWUgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZUNoaWxkQ29tcG9uZW50ICh2bSwgZGlyZWN0KSB7XG4gIGlmIChkaXJlY3QpIHtcbiAgICB2bS5fZGlyZWN0SW5hY3RpdmUgPSBmYWxzZTtcbiAgICBpZiAoaXNJbkluYWN0aXZlVHJlZSh2bSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfSBlbHNlIGlmICh2bS5fZGlyZWN0SW5hY3RpdmUpIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAodm0uX2luYWN0aXZlIHx8IHZtLl9pbmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgIHZtLl9pbmFjdGl2ZSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uJGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhY3RpdmF0ZUNoaWxkQ29tcG9uZW50KHZtLiRjaGlsZHJlbltpXSk7XG4gICAgfVxuICAgIGNhbGxIb29rKHZtLCAnYWN0aXZhdGVkJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVhY3RpdmF0ZUNoaWxkQ29tcG9uZW50ICh2bSwgZGlyZWN0KSB7XG4gIGlmIChkaXJlY3QpIHtcbiAgICB2bS5fZGlyZWN0SW5hY3RpdmUgPSB0cnVlO1xuICAgIGlmIChpc0luSW5hY3RpdmVUcmVlKHZtKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICB9XG4gIGlmICghdm0uX2luYWN0aXZlKSB7XG4gICAgdm0uX2luYWN0aXZlID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLiRjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgZGVhY3RpdmF0ZUNoaWxkQ29tcG9uZW50KHZtLiRjaGlsZHJlbltpXSk7XG4gICAgfVxuICAgIGNhbGxIb29rKHZtLCAnZGVhY3RpdmF0ZWQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxsSG9vayAodm0sIGhvb2spIHtcbiAgdmFyIGhhbmRsZXJzID0gdm0uJG9wdGlvbnNbaG9va107XG4gIGlmIChoYW5kbGVycykge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBoYW5kbGVyc1tpXS5jYWxsKHZtKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IoZSwgdm0sIChob29rICsgXCIgaG9va1wiKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh2bS5faGFzSG9va0V2ZW50KSB7XG4gICAgdm0uJGVtaXQoJ2hvb2s6JyArIGhvb2spO1xuICB9XG59XG5cbi8qICAqL1xuXG5cbnZhciBNQVhfVVBEQVRFX0NPVU5UID0gMTAwO1xuXG52YXIgcXVldWUgPSBbXTtcbnZhciBhY3RpdmF0ZWRDaGlsZHJlbiA9IFtdO1xudmFyIGhhcyA9IHt9O1xudmFyIGNpcmN1bGFyID0ge307XG52YXIgd2FpdGluZyA9IGZhbHNlO1xudmFyIGZsdXNoaW5nID0gZmFsc2U7XG52YXIgaW5kZXggPSAwO1xuXG4vKipcbiAqIFJlc2V0IHRoZSBzY2hlZHVsZXIncyBzdGF0ZS5cbiAqL1xuZnVuY3Rpb24gcmVzZXRTY2hlZHVsZXJTdGF0ZSAoKSB7XG4gIGluZGV4ID0gcXVldWUubGVuZ3RoID0gYWN0aXZhdGVkQ2hpbGRyZW4ubGVuZ3RoID0gMDtcbiAgaGFzID0ge307XG4gIHtcbiAgICBjaXJjdWxhciA9IHt9O1xuICB9XG4gIHdhaXRpbmcgPSBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEZsdXNoIGJvdGggcXVldWVzIGFuZCBydW4gdGhlIHdhdGNoZXJzLlxuICovXG5mdW5jdGlvbiBmbHVzaFNjaGVkdWxlclF1ZXVlICgpIHtcbiAgZmx1c2hpbmcgPSB0cnVlO1xuICB2YXIgd2F0Y2hlciwgaWQ7XG5cbiAgLy8gU29ydCBxdWV1ZSBiZWZvcmUgZmx1c2guXG4gIC8vIFRoaXMgZW5zdXJlcyB0aGF0OlxuICAvLyAxLiBDb21wb25lbnRzIGFyZSB1cGRhdGVkIGZyb20gcGFyZW50IHRvIGNoaWxkLiAoYmVjYXVzZSBwYXJlbnQgaXMgYWx3YXlzXG4gIC8vICAgIGNyZWF0ZWQgYmVmb3JlIHRoZSBjaGlsZClcbiAgLy8gMi4gQSBjb21wb25lbnQncyB1c2VyIHdhdGNoZXJzIGFyZSBydW4gYmVmb3JlIGl0cyByZW5kZXIgd2F0Y2hlciAoYmVjYXVzZVxuICAvLyAgICB1c2VyIHdhdGNoZXJzIGFyZSBjcmVhdGVkIGJlZm9yZSB0aGUgcmVuZGVyIHdhdGNoZXIpXG4gIC8vIDMuIElmIGEgY29tcG9uZW50IGlzIGRlc3Ryb3llZCBkdXJpbmcgYSBwYXJlbnQgY29tcG9uZW50J3Mgd2F0Y2hlciBydW4sXG4gIC8vICAgIGl0cyB3YXRjaGVycyBjYW4gYmUgc2tpcHBlZC5cbiAgcXVldWUuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5pZCAtIGIuaWQ7IH0pO1xuXG4gIC8vIGRvIG5vdCBjYWNoZSBsZW5ndGggYmVjYXVzZSBtb3JlIHdhdGNoZXJzIG1pZ2h0IGJlIHB1c2hlZFxuICAvLyBhcyB3ZSBydW4gZXhpc3Rpbmcgd2F0Y2hlcnNcbiAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgcXVldWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgd2F0Y2hlciA9IHF1ZXVlW2luZGV4XTtcbiAgICBpZCA9IHdhdGNoZXIuaWQ7XG4gICAgaGFzW2lkXSA9IG51bGw7XG4gICAgd2F0Y2hlci5ydW4oKTtcbiAgICAvLyBpbiBkZXYgYnVpbGQsIGNoZWNrIGFuZCBzdG9wIGNpcmN1bGFyIHVwZGF0ZXMuXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGhhc1tpZF0gIT0gbnVsbCkge1xuICAgICAgY2lyY3VsYXJbaWRdID0gKGNpcmN1bGFyW2lkXSB8fCAwKSArIDE7XG4gICAgICBpZiAoY2lyY3VsYXJbaWRdID4gTUFYX1VQREFURV9DT1VOVCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgJyArIChcbiAgICAgICAgICAgIHdhdGNoZXIudXNlclxuICAgICAgICAgICAgICA/IChcImluIHdhdGNoZXIgd2l0aCBleHByZXNzaW9uIFxcXCJcIiArICh3YXRjaGVyLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpXG4gICAgICAgICAgICAgIDogXCJpbiBhIGNvbXBvbmVudCByZW5kZXIgZnVuY3Rpb24uXCJcbiAgICAgICAgICApLFxuICAgICAgICAgIHdhdGNoZXIudm1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBrZWVwIGNvcGllcyBvZiBwb3N0IHF1ZXVlcyBiZWZvcmUgcmVzZXR0aW5nIHN0YXRlXG4gIHZhciBhY3RpdmF0ZWRRdWV1ZSA9IGFjdGl2YXRlZENoaWxkcmVuLnNsaWNlKCk7XG4gIHZhciB1cGRhdGVkUXVldWUgPSBxdWV1ZS5zbGljZSgpO1xuXG4gIHJlc2V0U2NoZWR1bGVyU3RhdGUoKTtcblxuICAvLyBjYWxsIGNvbXBvbmVudCB1cGRhdGVkIGFuZCBhY3RpdmF0ZWQgaG9va3NcbiAgY2FsbEFjdGl2YXRlZEhvb2tzKGFjdGl2YXRlZFF1ZXVlKTtcbiAgY2FsbFVwZGF0ZUhvb2tzKHVwZGF0ZWRRdWV1ZSk7XG5cbiAgLy8gZGV2dG9vbCBob29rXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoZGV2dG9vbHMgJiYgY29uZmlnLmRldnRvb2xzKSB7XG4gICAgZGV2dG9vbHMuZW1pdCgnZmx1c2gnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxsVXBkYXRlSG9va3MgKHF1ZXVlKSB7XG4gIHZhciBpID0gcXVldWUubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgdmFyIHdhdGNoZXIgPSBxdWV1ZVtpXTtcbiAgICB2YXIgdm0gPSB3YXRjaGVyLnZtO1xuICAgIGlmICh2bS5fd2F0Y2hlciA9PT0gd2F0Y2hlciAmJiB2bS5faXNNb3VudGVkKSB7XG4gICAgICBjYWxsSG9vayh2bSwgJ3VwZGF0ZWQnKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBRdWV1ZSBhIGtlcHQtYWxpdmUgY29tcG9uZW50IHRoYXQgd2FzIGFjdGl2YXRlZCBkdXJpbmcgcGF0Y2guXG4gKiBUaGUgcXVldWUgd2lsbCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIGVudGlyZSB0cmVlIGhhcyBiZWVuIHBhdGNoZWQuXG4gKi9cbmZ1bmN0aW9uIHF1ZXVlQWN0aXZhdGVkQ29tcG9uZW50ICh2bSkge1xuICAvLyBzZXR0aW5nIF9pbmFjdGl2ZSB0byBmYWxzZSBoZXJlIHNvIHRoYXQgYSByZW5kZXIgZnVuY3Rpb24gY2FuXG4gIC8vIHJlbHkgb24gY2hlY2tpbmcgd2hldGhlciBpdCdzIGluIGFuIGluYWN0aXZlIHRyZWUgKGUuZy4gcm91dGVyLXZpZXcpXG4gIHZtLl9pbmFjdGl2ZSA9IGZhbHNlO1xuICBhY3RpdmF0ZWRDaGlsZHJlbi5wdXNoKHZtKTtcbn1cblxuZnVuY3Rpb24gY2FsbEFjdGl2YXRlZEhvb2tzIChxdWV1ZSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgcXVldWVbaV0uX2luYWN0aXZlID0gdHJ1ZTtcbiAgICBhY3RpdmF0ZUNoaWxkQ29tcG9uZW50KHF1ZXVlW2ldLCB0cnVlIC8qIHRydWUgKi8pO1xuICB9XG59XG5cbi8qKlxuICogUHVzaCBhIHdhdGNoZXIgaW50byB0aGUgd2F0Y2hlciBxdWV1ZS5cbiAqIEpvYnMgd2l0aCBkdXBsaWNhdGUgSURzIHdpbGwgYmUgc2tpcHBlZCB1bmxlc3MgaXQnc1xuICogcHVzaGVkIHdoZW4gdGhlIHF1ZXVlIGlzIGJlaW5nIGZsdXNoZWQuXG4gKi9cbmZ1bmN0aW9uIHF1ZXVlV2F0Y2hlciAod2F0Y2hlcikge1xuICB2YXIgaWQgPSB3YXRjaGVyLmlkO1xuICBpZiAoaGFzW2lkXSA9PSBudWxsKSB7XG4gICAgaGFzW2lkXSA9IHRydWU7XG4gICAgaWYgKCFmbHVzaGluZykge1xuICAgICAgcXVldWUucHVzaCh3YXRjaGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYWxyZWFkeSBmbHVzaGluZywgc3BsaWNlIHRoZSB3YXRjaGVyIGJhc2VkIG9uIGl0cyBpZFxuICAgICAgLy8gaWYgYWxyZWFkeSBwYXN0IGl0cyBpZCwgaXQgd2lsbCBiZSBydW4gbmV4dCBpbW1lZGlhdGVseS5cbiAgICAgIHZhciBpID0gcXVldWUubGVuZ3RoIC0gMTtcbiAgICAgIHdoaWxlIChpID4gaW5kZXggJiYgcXVldWVbaV0uaWQgPiB3YXRjaGVyLmlkKSB7XG4gICAgICAgIGktLTtcbiAgICAgIH1cbiAgICAgIHF1ZXVlLnNwbGljZShpICsgMSwgMCwgd2F0Y2hlcik7XG4gICAgfVxuICAgIC8vIHF1ZXVlIHRoZSBmbHVzaFxuICAgIGlmICghd2FpdGluZykge1xuICAgICAgd2FpdGluZyA9IHRydWU7XG4gICAgICBuZXh0VGljayhmbHVzaFNjaGVkdWxlclF1ZXVlKTtcbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cbnZhciB1aWQkMiA9IDA7XG5cbi8qKlxuICogQSB3YXRjaGVyIHBhcnNlcyBhbiBleHByZXNzaW9uLCBjb2xsZWN0cyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgZmlyZXMgY2FsbGJhY2sgd2hlbiB0aGUgZXhwcmVzc2lvbiB2YWx1ZSBjaGFuZ2VzLlxuICogVGhpcyBpcyB1c2VkIGZvciBib3RoIHRoZSAkd2F0Y2goKSBhcGkgYW5kIGRpcmVjdGl2ZXMuXG4gKi9cbnZhciBXYXRjaGVyID0gZnVuY3Rpb24gV2F0Y2hlciAoXG4gIHZtLFxuICBleHBPckZuLFxuICBjYixcbiAgb3B0aW9uc1xuKSB7XG4gIHRoaXMudm0gPSB2bTtcbiAgdm0uX3dhdGNoZXJzLnB1c2godGhpcyk7XG4gIC8vIG9wdGlvbnNcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICB0aGlzLmRlZXAgPSAhIW9wdGlvbnMuZGVlcDtcbiAgICB0aGlzLnVzZXIgPSAhIW9wdGlvbnMudXNlcjtcbiAgICB0aGlzLmxhenkgPSAhIW9wdGlvbnMubGF6eTtcbiAgICB0aGlzLnN5bmMgPSAhIW9wdGlvbnMuc3luYztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmRlZXAgPSB0aGlzLnVzZXIgPSB0aGlzLmxhenkgPSB0aGlzLnN5bmMgPSBmYWxzZTtcbiAgfVxuICB0aGlzLmNiID0gY2I7XG4gIHRoaXMuaWQgPSArK3VpZCQyOyAvLyB1aWQgZm9yIGJhdGNoaW5nXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgdGhpcy5kaXJ0eSA9IHRoaXMubGF6eTsgLy8gZm9yIGxhenkgd2F0Y2hlcnNcbiAgdGhpcy5kZXBzID0gW107XG4gIHRoaXMubmV3RGVwcyA9IFtdO1xuICB0aGlzLmRlcElkcyA9IG5ldyBfU2V0KCk7XG4gIHRoaXMubmV3RGVwSWRzID0gbmV3IF9TZXQoKTtcbiAgdGhpcy5leHByZXNzaW9uID0gZXhwT3JGbi50b1N0cmluZygpO1xuICAvLyBwYXJzZSBleHByZXNzaW9uIGZvciBnZXR0ZXJcbiAgaWYgKHR5cGVvZiBleHBPckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5nZXR0ZXIgPSBleHBPckZuO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZ2V0dGVyID0gcGFyc2VQYXRoKGV4cE9yRm4pO1xuICAgIGlmICghdGhpcy5nZXR0ZXIpIHtcbiAgICAgIHRoaXMuZ2V0dGVyID0gZnVuY3Rpb24gKCkge307XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICBcIkZhaWxlZCB3YXRjaGluZyBwYXRoOiBcXFwiXCIgKyBleHBPckZuICsgXCJcXFwiIFwiICtcbiAgICAgICAgJ1dhdGNoZXIgb25seSBhY2NlcHRzIHNpbXBsZSBkb3QtZGVsaW1pdGVkIHBhdGhzLiAnICtcbiAgICAgICAgJ0ZvciBmdWxsIGNvbnRyb2wsIHVzZSBhIGZ1bmN0aW9uIGluc3RlYWQuJyxcbiAgICAgICAgdm1cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHRoaXMudmFsdWUgPSB0aGlzLmxhenlcbiAgICA/IHVuZGVmaW5lZFxuICAgIDogdGhpcy5nZXQoKTtcbn07XG5cbi8qKlxuICogRXZhbHVhdGUgdGhlIGdldHRlciwgYW5kIHJlLWNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKCkge1xuICBwdXNoVGFyZ2V0KHRoaXMpO1xuICB2YXIgdmFsdWU7XG4gIHZhciB2bSA9IHRoaXMudm07XG4gIGlmICh0aGlzLnVzZXIpIHtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaGFuZGxlRXJyb3IoZSwgdm0sIChcImdldHRlciBmb3Igd2F0Y2hlciBcXFwiXCIgKyAodGhpcy5leHByZXNzaW9uKSArIFwiXFxcIlwiKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gdGhpcy5nZXR0ZXIuY2FsbCh2bSwgdm0pO1xuICB9XG4gIC8vIFwidG91Y2hcIiBldmVyeSBwcm9wZXJ0eSBzbyB0aGV5IGFyZSBhbGwgdHJhY2tlZCBhc1xuICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcbiAgaWYgKHRoaXMuZGVlcCkge1xuICAgIHRyYXZlcnNlKHZhbHVlKTtcbiAgfVxuICBwb3BUYXJnZXQoKTtcbiAgdGhpcy5jbGVhbnVwRGVwcygpO1xuICByZXR1cm4gdmFsdWVcbn07XG5cbi8qKlxuICogQWRkIGEgZGVwZW5kZW5jeSB0byB0aGlzIGRpcmVjdGl2ZS5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUuYWRkRGVwID0gZnVuY3Rpb24gYWRkRGVwIChkZXApIHtcbiAgdmFyIGlkID0gZGVwLmlkO1xuICBpZiAoIXRoaXMubmV3RGVwSWRzLmhhcyhpZCkpIHtcbiAgICB0aGlzLm5ld0RlcElkcy5hZGQoaWQpO1xuICAgIHRoaXMubmV3RGVwcy5wdXNoKGRlcCk7XG4gICAgaWYgKCF0aGlzLmRlcElkcy5oYXMoaWQpKSB7XG4gICAgICBkZXAuYWRkU3ViKHRoaXMpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBDbGVhbiB1cCBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5jbGVhbnVwRGVwcyA9IGZ1bmN0aW9uIGNsZWFudXBEZXBzICgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICB2YXIgaSA9IHRoaXMuZGVwcy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgZGVwID0gdGhpcyQxLmRlcHNbaV07XG4gICAgaWYgKCF0aGlzJDEubmV3RGVwSWRzLmhhcyhkZXAuaWQpKSB7XG4gICAgICBkZXAucmVtb3ZlU3ViKHRoaXMkMSk7XG4gICAgfVxuICB9XG4gIHZhciB0bXAgPSB0aGlzLmRlcElkcztcbiAgdGhpcy5kZXBJZHMgPSB0aGlzLm5ld0RlcElkcztcbiAgdGhpcy5uZXdEZXBJZHMgPSB0bXA7XG4gIHRoaXMubmV3RGVwSWRzLmNsZWFyKCk7XG4gIHRtcCA9IHRoaXMuZGVwcztcbiAgdGhpcy5kZXBzID0gdGhpcy5uZXdEZXBzO1xuICB0aGlzLm5ld0RlcHMgPSB0bXA7XG4gIHRoaXMubmV3RGVwcy5sZW5ndGggPSAwO1xufTtcblxuLyoqXG4gKiBTdWJzY3JpYmVyIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gKi9cbldhdGNoZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmICh0aGlzLmxhenkpIHtcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh0aGlzLnN5bmMpIHtcbiAgICB0aGlzLnJ1bigpO1xuICB9IGVsc2Uge1xuICAgIHF1ZXVlV2F0Y2hlcih0aGlzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTY2hlZHVsZXIgam9iIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBzY2hlZHVsZXIuXG4gKi9cbldhdGNoZXIucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIHJ1biAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KCk7XG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IHRoaXMudmFsdWUgfHxcbiAgICAgIC8vIERlZXAgd2F0Y2hlcnMgYW5kIHdhdGNoZXJzIG9uIE9iamVjdC9BcnJheXMgc2hvdWxkIGZpcmUgZXZlblxuICAgICAgLy8gd2hlbiB0aGUgdmFsdWUgaXMgdGhlIHNhbWUsIGJlY2F1c2UgdGhlIHZhbHVlIG1heVxuICAgICAgLy8gaGF2ZSBtdXRhdGVkLlxuICAgICAgaXNPYmplY3QodmFsdWUpIHx8XG4gICAgICB0aGlzLmRlZXBcbiAgICApIHtcbiAgICAgIC8vIHNldCBuZXcgdmFsdWVcbiAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy51c2VyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5jYi5jYWxsKHRoaXMudm0sIHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBoYW5kbGVFcnJvcihlLCB0aGlzLnZtLCAoXCJjYWxsYmFjayBmb3Igd2F0Y2hlciBcXFwiXCIgKyAodGhpcy5leHByZXNzaW9uKSArIFwiXFxcIlwiKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2IuY2FsbCh0aGlzLnZtLCB2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBFdmFsdWF0ZSB0aGUgdmFsdWUgb2YgdGhlIHdhdGNoZXIuXG4gKiBUaGlzIG9ubHkgZ2V0cyBjYWxsZWQgZm9yIGxhenkgd2F0Y2hlcnMuXG4gKi9cbldhdGNoZXIucHJvdG90eXBlLmV2YWx1YXRlID0gZnVuY3Rpb24gZXZhbHVhdGUgKCkge1xuICB0aGlzLnZhbHVlID0gdGhpcy5nZXQoKTtcbiAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBEZXBlbmQgb24gYWxsIGRlcHMgY29sbGVjdGVkIGJ5IHRoaXMgd2F0Y2hlci5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUuZGVwZW5kID0gZnVuY3Rpb24gZGVwZW5kICgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICB2YXIgaSA9IHRoaXMuZGVwcy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzJDEuZGVwc1tpXS5kZXBlbmQoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YnNjcmliZXIgbGlzdC5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiB0ZWFyZG93biAoKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgLy8gcmVtb3ZlIHNlbGYgZnJvbSB2bSdzIHdhdGNoZXIgbGlzdFxuICAgIC8vIHRoaXMgaXMgYSBzb21ld2hhdCBleHBlbnNpdmUgb3BlcmF0aW9uIHNvIHdlIHNraXAgaXRcbiAgICAvLyBpZiB0aGUgdm0gaXMgYmVpbmcgZGVzdHJveWVkLlxuICAgIGlmICghdGhpcy52bS5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgICAgcmVtb3ZlKHRoaXMudm0uX3dhdGNoZXJzLCB0aGlzKTtcbiAgICB9XG4gICAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHRoaXMkMS5kZXBzW2ldLnJlbW92ZVN1Yih0aGlzJDEpO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59O1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIGFuIG9iamVjdCB0byBldm9rZSBhbGwgY29udmVydGVkXG4gKiBnZXR0ZXJzLCBzbyB0aGF0IGV2ZXJ5IG5lc3RlZCBwcm9wZXJ0eSBpbnNpZGUgdGhlIG9iamVjdFxuICogaXMgY29sbGVjdGVkIGFzIGEgXCJkZWVwXCIgZGVwZW5kZW5jeS5cbiAqL1xudmFyIHNlZW5PYmplY3RzID0gbmV3IF9TZXQoKTtcbmZ1bmN0aW9uIHRyYXZlcnNlICh2YWwpIHtcbiAgc2Vlbk9iamVjdHMuY2xlYXIoKTtcbiAgX3RyYXZlcnNlKHZhbCwgc2Vlbk9iamVjdHMpO1xufVxuXG5mdW5jdGlvbiBfdHJhdmVyc2UgKHZhbCwgc2Vlbikge1xuICB2YXIgaSwga2V5cztcbiAgdmFyIGlzQSA9IEFycmF5LmlzQXJyYXkodmFsKTtcbiAgaWYgKCghaXNBICYmICFpc09iamVjdCh2YWwpKSB8fCAhT2JqZWN0LmlzRXh0ZW5zaWJsZSh2YWwpKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHZhbC5fX29iX18pIHtcbiAgICB2YXIgZGVwSWQgPSB2YWwuX19vYl9fLmRlcC5pZDtcbiAgICBpZiAoc2Vlbi5oYXMoZGVwSWQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgc2Vlbi5hZGQoZGVwSWQpO1xuICB9XG4gIGlmIChpc0EpIHtcbiAgICBpID0gdmFsLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7IF90cmF2ZXJzZSh2YWxbaV0sIHNlZW4pOyB9XG4gIH0gZWxzZSB7XG4gICAga2V5cyA9IE9iamVjdC5rZXlzKHZhbCk7XG4gICAgaSA9IGtleXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHsgX3RyYXZlcnNlKHZhbFtrZXlzW2ldXSwgc2Vlbik7IH1cbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbiA9IHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IG5vb3AsXG4gIHNldDogbm9vcFxufTtcblxuZnVuY3Rpb24gcHJveHkgKHRhcmdldCwgc291cmNlS2V5LCBrZXkpIHtcbiAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLmdldCA9IGZ1bmN0aW9uIHByb3h5R2V0dGVyICgpIHtcbiAgICByZXR1cm4gdGhpc1tzb3VyY2VLZXldW2tleV1cbiAgfTtcbiAgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uLnNldCA9IGZ1bmN0aW9uIHByb3h5U2V0dGVyICh2YWwpIHtcbiAgICB0aGlzW3NvdXJjZUtleV1ba2V5XSA9IHZhbDtcbiAgfTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24pO1xufVxuXG5mdW5jdGlvbiBpbml0U3RhdGUgKHZtKSB7XG4gIHZtLl93YXRjaGVycyA9IFtdO1xuICB2YXIgb3B0cyA9IHZtLiRvcHRpb25zO1xuICBpZiAob3B0cy5wcm9wcykgeyBpbml0UHJvcHModm0sIG9wdHMucHJvcHMpOyB9XG4gIGlmIChvcHRzLm1ldGhvZHMpIHsgaW5pdE1ldGhvZHModm0sIG9wdHMubWV0aG9kcyk7IH1cbiAgaWYgKG9wdHMuZGF0YSkge1xuICAgIGluaXREYXRhKHZtKTtcbiAgfSBlbHNlIHtcbiAgICBvYnNlcnZlKHZtLl9kYXRhID0ge30sIHRydWUgLyogYXNSb290RGF0YSAqLyk7XG4gIH1cbiAgaWYgKG9wdHMuY29tcHV0ZWQpIHsgaW5pdENvbXB1dGVkKHZtLCBvcHRzLmNvbXB1dGVkKTsgfVxuICBpZiAob3B0cy53YXRjaCkgeyBpbml0V2F0Y2godm0sIG9wdHMud2F0Y2gpOyB9XG59XG5cbnZhciBpc1Jlc2VydmVkUHJvcCA9IHtcbiAga2V5OiAxLFxuICByZWY6IDEsXG4gIHNsb3Q6IDFcbn07XG5cbmZ1bmN0aW9uIGluaXRQcm9wcyAodm0sIHByb3BzT3B0aW9ucykge1xuICB2YXIgcHJvcHNEYXRhID0gdm0uJG9wdGlvbnMucHJvcHNEYXRhIHx8IHt9O1xuICB2YXIgcHJvcHMgPSB2bS5fcHJvcHMgPSB7fTtcbiAgLy8gY2FjaGUgcHJvcCBrZXlzIHNvIHRoYXQgZnV0dXJlIHByb3BzIHVwZGF0ZXMgY2FuIGl0ZXJhdGUgdXNpbmcgQXJyYXlcbiAgLy8gaW5zdGVhZCBvZiBkeW5hbWljIG9iamVjdCBrZXkgZW51bWVyYXRpb24uXG4gIHZhciBrZXlzID0gdm0uJG9wdGlvbnMuX3Byb3BLZXlzID0gW107XG4gIHZhciBpc1Jvb3QgPSAhdm0uJHBhcmVudDtcbiAgLy8gcm9vdCBpbnN0YW5jZSBwcm9wcyBzaG91bGQgYmUgY29udmVydGVkXG4gIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IGlzUm9vdDtcbiAgdmFyIGxvb3AgPSBmdW5jdGlvbiAoIGtleSApIHtcbiAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB2YXIgdmFsdWUgPSB2YWxpZGF0ZVByb3Aoa2V5LCBwcm9wc09wdGlvbnMsIHByb3BzRGF0YSwgdm0pO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAge1xuICAgICAgaWYgKGlzUmVzZXJ2ZWRQcm9wW2tleV0gfHwgY29uZmlnLmlzUmVzZXJ2ZWRBdHRyKGtleSkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAoXCJcXFwiXCIgKyBrZXkgKyBcIlxcXCIgaXMgYSByZXNlcnZlZCBhdHRyaWJ1dGUgYW5kIGNhbm5vdCBiZSB1c2VkIGFzIGNvbXBvbmVudCBwcm9wLlwiKSxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgZGVmaW5lUmVhY3RpdmUkJDEocHJvcHMsIGtleSwgdmFsdWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHZtLiRwYXJlbnQgJiYgIW9ic2VydmVyU3RhdGUuaXNTZXR0aW5nUHJvcHMpIHtcbiAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgXCJBdm9pZCBtdXRhdGluZyBhIHByb3AgZGlyZWN0bHkgc2luY2UgdGhlIHZhbHVlIHdpbGwgYmUgXCIgK1xuICAgICAgICAgICAgXCJvdmVyd3JpdHRlbiB3aGVuZXZlciB0aGUgcGFyZW50IGNvbXBvbmVudCByZS1yZW5kZXJzLiBcIiArXG4gICAgICAgICAgICBcIkluc3RlYWQsIHVzZSBhIGRhdGEgb3IgY29tcHV0ZWQgcHJvcGVydHkgYmFzZWQgb24gdGhlIHByb3AncyBcIiArXG4gICAgICAgICAgICBcInZhbHVlLiBQcm9wIGJlaW5nIG11dGF0ZWQ6IFxcXCJcIiArIGtleSArIFwiXFxcIlwiLFxuICAgICAgICAgICAgdm1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gc3RhdGljIHByb3BzIGFyZSBhbHJlYWR5IHByb3hpZWQgb24gdGhlIGNvbXBvbmVudCdzIHByb3RvdHlwZVxuICAgIC8vIGR1cmluZyBWdWUuZXh0ZW5kKCkuIFdlIG9ubHkgbmVlZCB0byBwcm94eSBwcm9wcyBkZWZpbmVkIGF0XG4gICAgLy8gaW5zdGFudGlhdGlvbiBoZXJlLlxuICAgIGlmICghKGtleSBpbiB2bSkpIHtcbiAgICAgIHByb3h5KHZtLCBcIl9wcm9wc1wiLCBrZXkpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBrZXkgaW4gcHJvcHNPcHRpb25zKSBsb29wKCBrZXkgKTtcbiAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaW5pdERhdGEgKHZtKSB7XG4gIHZhciBkYXRhID0gdm0uJG9wdGlvbnMuZGF0YTtcbiAgZGF0YSA9IHZtLl9kYXRhID0gdHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbidcbiAgICA/IGdldERhdGEoZGF0YSwgdm0pXG4gICAgOiBkYXRhIHx8IHt9O1xuICBpZiAoIWlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICBkYXRhID0ge307XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICdkYXRhIGZ1bmN0aW9ucyBzaG91bGQgcmV0dXJuIGFuIG9iamVjdDpcXG4nICtcbiAgICAgICdodHRwczovL3Z1ZWpzLm9yZy92Mi9ndWlkZS9jb21wb25lbnRzLmh0bWwjZGF0YS1NdXN0LUJlLWEtRnVuY3Rpb24nLFxuICAgICAgdm1cbiAgICApO1xuICB9XG4gIC8vIHByb3h5IGRhdGEgb24gaW5zdGFuY2VcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgdmFyIHByb3BzID0gdm0uJG9wdGlvbnMucHJvcHM7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAocHJvcHMgJiYgaGFzT3duKHByb3BzLCBrZXlzW2ldKSkge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgXCJUaGUgZGF0YSBwcm9wZXJ0eSBcXFwiXCIgKyAoa2V5c1tpXSkgKyBcIlxcXCIgaXMgYWxyZWFkeSBkZWNsYXJlZCBhcyBhIHByb3AuIFwiICtcbiAgICAgICAgXCJVc2UgcHJvcCBkZWZhdWx0IHZhbHVlIGluc3RlYWQuXCIsXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIWlzUmVzZXJ2ZWQoa2V5c1tpXSkpIHtcbiAgICAgIHByb3h5KHZtLCBcIl9kYXRhXCIsIGtleXNbaV0pO1xuICAgIH1cbiAgfVxuICAvLyBvYnNlcnZlIGRhdGFcbiAgb2JzZXJ2ZShkYXRhLCB0cnVlIC8qIGFzUm9vdERhdGEgKi8pO1xufVxuXG5mdW5jdGlvbiBnZXREYXRhIChkYXRhLCB2bSkge1xuICB0cnkge1xuICAgIHJldHVybiBkYXRhLmNhbGwodm0pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBoYW5kbGVFcnJvcihlLCB2bSwgXCJkYXRhKClcIik7XG4gICAgcmV0dXJuIHt9XG4gIH1cbn1cblxudmFyIGNvbXB1dGVkV2F0Y2hlck9wdGlvbnMgPSB7IGxhenk6IHRydWUgfTtcblxuZnVuY3Rpb24gaW5pdENvbXB1dGVkICh2bSwgY29tcHV0ZWQpIHtcbiAgdmFyIHdhdGNoZXJzID0gdm0uX2NvbXB1dGVkV2F0Y2hlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZvciAodmFyIGtleSBpbiBjb21wdXRlZCkge1xuICAgIHZhciB1c2VyRGVmID0gY29tcHV0ZWRba2V5XTtcbiAgICB2YXIgZ2V0dGVyID0gdHlwZW9mIHVzZXJEZWYgPT09ICdmdW5jdGlvbicgPyB1c2VyRGVmIDogdXNlckRlZi5nZXQ7XG4gICAge1xuICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgKFwiTm8gZ2V0dGVyIGZ1bmN0aW9uIGhhcyBiZWVuIGRlZmluZWQgZm9yIGNvbXB1dGVkIHByb3BlcnR5IFxcXCJcIiArIGtleSArIFwiXFxcIi5cIiksXG4gICAgICAgICAgdm1cbiAgICAgICAgKTtcbiAgICAgICAgZ2V0dGVyID0gbm9vcDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gY3JlYXRlIGludGVybmFsIHdhdGNoZXIgZm9yIHRoZSBjb21wdXRlZCBwcm9wZXJ0eS5cbiAgICB3YXRjaGVyc1trZXldID0gbmV3IFdhdGNoZXIodm0sIGdldHRlciwgbm9vcCwgY29tcHV0ZWRXYXRjaGVyT3B0aW9ucyk7XG5cbiAgICAvLyBjb21wb25lbnQtZGVmaW5lZCBjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSBhbHJlYWR5IGRlZmluZWQgb24gdGhlXG4gICAgLy8gY29tcG9uZW50IHByb3RvdHlwZS4gV2Ugb25seSBuZWVkIHRvIGRlZmluZSBjb21wdXRlZCBwcm9wZXJ0aWVzIGRlZmluZWRcbiAgICAvLyBhdCBpbnN0YW50aWF0aW9uIGhlcmUuXG4gICAgaWYgKCEoa2V5IGluIHZtKSkge1xuICAgICAgZGVmaW5lQ29tcHV0ZWQodm0sIGtleSwgdXNlckRlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgaW4gdm0uJGRhdGEpIHtcbiAgICAgICAgd2FybigoXCJUaGUgY29tcHV0ZWQgcHJvcGVydHkgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIGFscmVhZHkgZGVmaW5lZCBpbiBkYXRhLlwiKSwgdm0pO1xuICAgICAgfSBlbHNlIGlmICh2bS4kb3B0aW9ucy5wcm9wcyAmJiBrZXkgaW4gdm0uJG9wdGlvbnMucHJvcHMpIHtcbiAgICAgICAgd2FybigoXCJUaGUgY29tcHV0ZWQgcHJvcGVydHkgXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIHByb3AuXCIpLCB2bSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluZUNvbXB1dGVkICh0YXJnZXQsIGtleSwgdXNlckRlZikge1xuICBpZiAodHlwZW9mIHVzZXJEZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uZ2V0ID0gY3JlYXRlQ29tcHV0ZWRHZXR0ZXIoa2V5KTtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gbm9vcDtcbiAgfSBlbHNlIHtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uZ2V0ID0gdXNlckRlZi5nZXRcbiAgICAgID8gdXNlckRlZi5jYWNoZSAhPT0gZmFsc2VcbiAgICAgICAgPyBjcmVhdGVDb21wdXRlZEdldHRlcihrZXkpXG4gICAgICAgIDogdXNlckRlZi5nZXRcbiAgICAgIDogbm9vcDtcbiAgICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gdXNlckRlZi5zZXRcbiAgICAgID8gdXNlckRlZi5zZXRcbiAgICAgIDogbm9vcDtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXB1dGVkR2V0dGVyIChrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXB1dGVkR2V0dGVyICgpIHtcbiAgICB2YXIgd2F0Y2hlciA9IHRoaXMuX2NvbXB1dGVkV2F0Y2hlcnMgJiYgdGhpcy5fY29tcHV0ZWRXYXRjaGVyc1trZXldO1xuICAgIGlmICh3YXRjaGVyKSB7XG4gICAgICBpZiAod2F0Y2hlci5kaXJ0eSkge1xuICAgICAgICB3YXRjaGVyLmV2YWx1YXRlKCk7XG4gICAgICB9XG4gICAgICBpZiAoRGVwLnRhcmdldCkge1xuICAgICAgICB3YXRjaGVyLmRlcGVuZCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdhdGNoZXIudmFsdWVcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdE1ldGhvZHMgKHZtLCBtZXRob2RzKSB7XG4gIHZhciBwcm9wcyA9IHZtLiRvcHRpb25zLnByb3BzO1xuICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykge1xuICAgIHZtW2tleV0gPSBtZXRob2RzW2tleV0gPT0gbnVsbCA/IG5vb3AgOiBiaW5kKG1ldGhvZHNba2V5XSwgdm0pO1xuICAgIHtcbiAgICAgIGlmIChtZXRob2RzW2tleV0gPT0gbnVsbCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIFwibWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBoYXMgYW4gdW5kZWZpbmVkIHZhbHVlIGluIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbi4gXCIgK1xuICAgICAgICAgIFwiRGlkIHlvdSByZWZlcmVuY2UgdGhlIGZ1bmN0aW9uIGNvcnJlY3RseT9cIixcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKHByb3BzICYmIGhhc093bihwcm9wcywga2V5KSkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIChcIm1ldGhvZCBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgaGFzIGFscmVhZHkgYmVlbiBkZWZpbmVkIGFzIGEgcHJvcC5cIiksXG4gICAgICAgICAgdm1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFdhdGNoICh2bSwgd2F0Y2gpIHtcbiAgZm9yICh2YXIga2V5IGluIHdhdGNoKSB7XG4gICAgdmFyIGhhbmRsZXIgPSB3YXRjaFtrZXldO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY3JlYXRlV2F0Y2hlcih2bSwga2V5LCBoYW5kbGVyW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY3JlYXRlV2F0Y2hlcih2bSwga2V5LCBoYW5kbGVyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlV2F0Y2hlciAodm0sIGtleSwgaGFuZGxlcikge1xuICB2YXIgb3B0aW9ucztcbiAgaWYgKGlzUGxhaW5PYmplY3QoaGFuZGxlcikpIHtcbiAgICBvcHRpb25zID0gaGFuZGxlcjtcbiAgICBoYW5kbGVyID0gaGFuZGxlci5oYW5kbGVyO1xuICB9XG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpIHtcbiAgICBoYW5kbGVyID0gdm1baGFuZGxlcl07XG4gIH1cbiAgdm0uJHdhdGNoKGtleSwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHN0YXRlTWl4aW4gKFZ1ZSkge1xuICAvLyBmbG93IHNvbWVob3cgaGFzIHByb2JsZW1zIHdpdGggZGlyZWN0bHkgZGVjbGFyZWQgZGVmaW5pdGlvbiBvYmplY3RcbiAgLy8gd2hlbiB1c2luZyBPYmplY3QuZGVmaW5lUHJvcGVydHksIHNvIHdlIGhhdmUgdG8gcHJvY2VkdXJhbGx5IGJ1aWxkIHVwXG4gIC8vIHRoZSBvYmplY3QgaGVyZS5cbiAgdmFyIGRhdGFEZWYgPSB7fTtcbiAgZGF0YURlZi5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9kYXRhIH07XG4gIHZhciBwcm9wc0RlZiA9IHt9O1xuICBwcm9wc0RlZi5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9wcm9wcyB9O1xuICB7XG4gICAgZGF0YURlZi5zZXQgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xuICAgICAgd2FybihcbiAgICAgICAgJ0F2b2lkIHJlcGxhY2luZyBpbnN0YW5jZSByb290ICRkYXRhLiAnICtcbiAgICAgICAgJ1VzZSBuZXN0ZWQgZGF0YSBwcm9wZXJ0aWVzIGluc3RlYWQuJyxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9O1xuICAgIHByb3BzRGVmLnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdhcm4oXCIkcHJvcHMgaXMgcmVhZG9ubHkuXCIsIHRoaXMpO1xuICAgIH07XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFZ1ZS5wcm90b3R5cGUsICckZGF0YScsIGRhdGFEZWYpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRwcm9wcycsIHByb3BzRGVmKTtcblxuICBWdWUucHJvdG90eXBlLiRzZXQgPSBzZXQ7XG4gIFZ1ZS5wcm90b3R5cGUuJGRlbGV0ZSA9IGRlbDtcblxuICBWdWUucHJvdG90eXBlLiR3YXRjaCA9IGZ1bmN0aW9uIChcbiAgICBleHBPckZuLFxuICAgIGNiLFxuICAgIG9wdGlvbnNcbiAgKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLnVzZXIgPSB0cnVlO1xuICAgIHZhciB3YXRjaGVyID0gbmV3IFdhdGNoZXIodm0sIGV4cE9yRm4sIGNiLCBvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5pbW1lZGlhdGUpIHtcbiAgICAgIGNiLmNhbGwodm0sIHdhdGNoZXIudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gdW53YXRjaEZuICgpIHtcbiAgICAgIHdhdGNoZXIudGVhcmRvd24oKTtcbiAgICB9XG4gIH07XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0UHJvdmlkZSAodm0pIHtcbiAgdmFyIHByb3ZpZGUgPSB2bS4kb3B0aW9ucy5wcm92aWRlO1xuICBpZiAocHJvdmlkZSkge1xuICAgIHZtLl9wcm92aWRlZCA9IHR5cGVvZiBwcm92aWRlID09PSAnZnVuY3Rpb24nXG4gICAgICA/IHByb3ZpZGUuY2FsbCh2bSlcbiAgICAgIDogcHJvdmlkZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0SW5qZWN0aW9ucyAodm0pIHtcbiAgdmFyIHJlc3VsdCA9IHJlc29sdmVJbmplY3Qodm0uJG9wdGlvbnMuaW5qZWN0LCB2bSk7XG4gIGlmIChyZXN1bHQpIHtcbiAgICBPYmplY3Qua2V5cyhyZXN1bHQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIHtcbiAgICAgICAgZGVmaW5lUmVhY3RpdmUkJDEodm0sIGtleSwgcmVzdWx0W2tleV0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgXCJBdm9pZCBtdXRhdGluZyBhbiBpbmplY3RlZCB2YWx1ZSBkaXJlY3RseSBzaW5jZSB0aGUgY2hhbmdlcyB3aWxsIGJlIFwiICtcbiAgICAgICAgICAgIFwib3ZlcndyaXR0ZW4gd2hlbmV2ZXIgdGhlIHByb3ZpZGVkIGNvbXBvbmVudCByZS1yZW5kZXJzLiBcIiArXG4gICAgICAgICAgICBcImluamVjdGlvbiBiZWluZyBtdXRhdGVkOiBcXFwiXCIgKyBrZXkgKyBcIlxcXCJcIixcbiAgICAgICAgICAgIHZtXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUluamVjdCAoaW5qZWN0LCB2bSkge1xuICBpZiAoaW5qZWN0KSB7XG4gICAgLy8gaW5qZWN0IGlzIDphbnkgYmVjYXVzZSBmbG93IGlzIG5vdCBzbWFydCBlbm91Z2ggdG8gZmlndXJlIG91dCBjYWNoZWRcbiAgICAvLyBpc0FycmF5IGhlcmVcbiAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoaW5qZWN0KTtcbiAgICB2YXIgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIga2V5cyA9IGlzQXJyYXlcbiAgICAgID8gaW5qZWN0XG4gICAgICA6IGhhc1N5bWJvbFxuICAgICAgICA/IFJlZmxlY3Qub3duS2V5cyhpbmplY3QpXG4gICAgICAgIDogT2JqZWN0LmtleXMoaW5qZWN0KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgcHJvdmlkZUtleSA9IGlzQXJyYXkgPyBrZXkgOiBpbmplY3Rba2V5XTtcbiAgICAgIHZhciBzb3VyY2UgPSB2bTtcbiAgICAgIHdoaWxlIChzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5fcHJvdmlkZWQgJiYgcHJvdmlkZUtleSBpbiBzb3VyY2UuX3Byb3ZpZGVkKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBzb3VyY2UuX3Byb3ZpZGVkW3Byb3ZpZGVLZXldO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgc291cmNlID0gc291cmNlLiRwYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb25hbENvbXBvbmVudCAoXG4gIEN0b3IsXG4gIHByb3BzRGF0YSxcbiAgZGF0YSxcbiAgY29udGV4dCxcbiAgY2hpbGRyZW5cbikge1xuICB2YXIgcHJvcHMgPSB7fTtcbiAgdmFyIHByb3BPcHRpb25zID0gQ3Rvci5vcHRpb25zLnByb3BzO1xuICBpZiAoaXNEZWYocHJvcE9wdGlvbnMpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BPcHRpb25zKSB7XG4gICAgICBwcm9wc1trZXldID0gdmFsaWRhdGVQcm9wKGtleSwgcHJvcE9wdGlvbnMsIHByb3BzRGF0YSB8fCB7fSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChpc0RlZihkYXRhLmF0dHJzKSkgeyBtZXJnZVByb3BzKHByb3BzLCBkYXRhLmF0dHJzKTsgfVxuICAgIGlmIChpc0RlZihkYXRhLnByb3BzKSkgeyBtZXJnZVByb3BzKHByb3BzLCBkYXRhLnByb3BzKTsgfVxuICB9XG4gIC8vIGVuc3VyZSB0aGUgY3JlYXRlRWxlbWVudCBmdW5jdGlvbiBpbiBmdW5jdGlvbmFsIGNvbXBvbmVudHNcbiAgLy8gZ2V0cyBhIHVuaXF1ZSBjb250ZXh0IC0gdGhpcyBpcyBuZWNlc3NhcnkgZm9yIGNvcnJlY3QgbmFtZWQgc2xvdCBjaGVja1xuICB2YXIgX2NvbnRleHQgPSBPYmplY3QuY3JlYXRlKGNvbnRleHQpO1xuICB2YXIgaCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KF9jb250ZXh0LCBhLCBiLCBjLCBkLCB0cnVlKTsgfTtcbiAgdmFyIHZub2RlID0gQ3Rvci5vcHRpb25zLnJlbmRlci5jYWxsKG51bGwsIGgsIHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIHByb3BzOiBwcm9wcyxcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgcGFyZW50OiBjb250ZXh0LFxuICAgIGxpc3RlbmVyczogZGF0YS5vbiB8fCB7fSxcbiAgICBpbmplY3Rpb25zOiByZXNvbHZlSW5qZWN0KEN0b3Iub3B0aW9ucy5pbmplY3QsIGNvbnRleHQpLFxuICAgIHNsb3RzOiBmdW5jdGlvbiAoKSB7IHJldHVybiByZXNvbHZlU2xvdHMoY2hpbGRyZW4sIGNvbnRleHQpOyB9XG4gIH0pO1xuICBpZiAodm5vZGUgaW5zdGFuY2VvZiBWTm9kZSkge1xuICAgIHZub2RlLmZ1bmN0aW9uYWxDb250ZXh0ID0gY29udGV4dDtcbiAgICB2bm9kZS5mdW5jdGlvbmFsT3B0aW9ucyA9IEN0b3Iub3B0aW9ucztcbiAgICBpZiAoZGF0YS5zbG90KSB7XG4gICAgICAodm5vZGUuZGF0YSB8fCAodm5vZGUuZGF0YSA9IHt9KSkuc2xvdCA9IGRhdGEuc2xvdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZub2RlXG59XG5cbmZ1bmN0aW9uIG1lcmdlUHJvcHMgKHRvLCBmcm9tKSB7XG4gIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgdG9bY2FtZWxpemUoa2V5KV0gPSBmcm9tW2tleV07XG4gIH1cbn1cblxuLyogICovXG5cbi8vIGhvb2tzIHRvIGJlIGludm9rZWQgb24gY29tcG9uZW50IFZOb2RlcyBkdXJpbmcgcGF0Y2hcbnZhciBjb21wb25lbnRWTm9kZUhvb2tzID0ge1xuICBpbml0OiBmdW5jdGlvbiBpbml0IChcbiAgICB2bm9kZSxcbiAgICBoeWRyYXRpbmcsXG4gICAgcGFyZW50RWxtLFxuICAgIHJlZkVsbVxuICApIHtcbiAgICBpZiAoIXZub2RlLmNvbXBvbmVudEluc3RhbmNlIHx8IHZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pc0Rlc3Ryb3llZCkge1xuICAgICAgdmFyIGNoaWxkID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgPSBjcmVhdGVDb21wb25lbnRJbnN0YW5jZUZvclZub2RlKFxuICAgICAgICB2bm9kZSxcbiAgICAgICAgYWN0aXZlSW5zdGFuY2UsXG4gICAgICAgIHBhcmVudEVsbSxcbiAgICAgICAgcmVmRWxtXG4gICAgICApO1xuICAgICAgY2hpbGQuJG1vdW50KGh5ZHJhdGluZyA/IHZub2RlLmVsbSA6IHVuZGVmaW5lZCwgaHlkcmF0aW5nKTtcbiAgICB9IGVsc2UgaWYgKHZub2RlLmRhdGEua2VlcEFsaXZlKSB7XG4gICAgICAvLyBrZXB0LWFsaXZlIGNvbXBvbmVudHMsIHRyZWF0IGFzIGEgcGF0Y2hcbiAgICAgIHZhciBtb3VudGVkTm9kZSA9IHZub2RlOyAvLyB3b3JrIGFyb3VuZCBmbG93XG4gICAgICBjb21wb25lbnRWTm9kZUhvb2tzLnByZXBhdGNoKG1vdW50ZWROb2RlLCBtb3VudGVkTm9kZSk7XG4gICAgfVxuICB9LFxuXG4gIHByZXBhdGNoOiBmdW5jdGlvbiBwcmVwYXRjaCAob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xuICAgIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gb2xkVm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XG4gICAgdXBkYXRlQ2hpbGRDb21wb25lbnQoXG4gICAgICBjaGlsZCxcbiAgICAgIG9wdGlvbnMucHJvcHNEYXRhLCAvLyB1cGRhdGVkIHByb3BzXG4gICAgICBvcHRpb25zLmxpc3RlbmVycywgLy8gdXBkYXRlZCBsaXN0ZW5lcnNcbiAgICAgIHZub2RlLCAvLyBuZXcgcGFyZW50IHZub2RlXG4gICAgICBvcHRpb25zLmNoaWxkcmVuIC8vIG5ldyBjaGlsZHJlblxuICAgICk7XG4gIH0sXG5cbiAgaW5zZXJ0OiBmdW5jdGlvbiBpbnNlcnQgKHZub2RlKSB7XG4gICAgdmFyIGNvbnRleHQgPSB2bm9kZS5jb250ZXh0O1xuICAgIHZhciBjb21wb25lbnRJbnN0YW5jZSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlO1xuICAgIGlmICghY29tcG9uZW50SW5zdGFuY2UuX2lzTW91bnRlZCkge1xuICAgICAgY29tcG9uZW50SW5zdGFuY2UuX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICBjYWxsSG9vayhjb21wb25lbnRJbnN0YW5jZSwgJ21vdW50ZWQnKTtcbiAgICB9XG4gICAgaWYgKHZub2RlLmRhdGEua2VlcEFsaXZlKSB7XG4gICAgICBpZiAoY29udGV4dC5faXNNb3VudGVkKSB7XG4gICAgICAgIC8vIHZ1ZS1yb3V0ZXIjMTIxMlxuICAgICAgICAvLyBEdXJpbmcgdXBkYXRlcywgYSBrZXB0LWFsaXZlIGNvbXBvbmVudCdzIGNoaWxkIGNvbXBvbmVudHMgbWF5XG4gICAgICAgIC8vIGNoYW5nZSwgc28gZGlyZWN0bHkgd2Fsa2luZyB0aGUgdHJlZSBoZXJlIG1heSBjYWxsIGFjdGl2YXRlZCBob29rc1xuICAgICAgICAvLyBvbiBpbmNvcnJlY3QgY2hpbGRyZW4uIEluc3RlYWQgd2UgcHVzaCB0aGVtIGludG8gYSBxdWV1ZSB3aGljaCB3aWxsXG4gICAgICAgIC8vIGJlIHByb2Nlc3NlZCBhZnRlciB0aGUgd2hvbGUgcGF0Y2ggcHJvY2VzcyBlbmRlZC5cbiAgICAgICAgcXVldWVBY3RpdmF0ZWRDb21wb25lbnQoY29tcG9uZW50SW5zdGFuY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aXZhdGVDaGlsZENvbXBvbmVudChjb21wb25lbnRJbnN0YW5jZSwgdHJ1ZSAvKiBkaXJlY3QgKi8pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95ICh2bm9kZSkge1xuICAgIHZhciBjb21wb25lbnRJbnN0YW5jZSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlO1xuICAgIGlmICghY29tcG9uZW50SW5zdGFuY2UuX2lzRGVzdHJveWVkKSB7XG4gICAgICBpZiAoIXZub2RlLmRhdGEua2VlcEFsaXZlKSB7XG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLiRkZXN0cm95KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWFjdGl2YXRlQ2hpbGRDb21wb25lbnQoY29tcG9uZW50SW5zdGFuY2UsIHRydWUgLyogZGlyZWN0ICovKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBob29rc1RvTWVyZ2UgPSBPYmplY3Qua2V5cyhjb21wb25lbnRWTm9kZUhvb2tzKTtcblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50IChcbiAgQ3RvcixcbiAgZGF0YSxcbiAgY29udGV4dCxcbiAgY2hpbGRyZW4sXG4gIHRhZ1xuKSB7XG4gIGlmIChpc1VuZGVmKEN0b3IpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgYmFzZUN0b3IgPSBjb250ZXh0LiRvcHRpb25zLl9iYXNlO1xuXG4gIC8vIHBsYWluIG9wdGlvbnMgb2JqZWN0OiB0dXJuIGl0IGludG8gYSBjb25zdHJ1Y3RvclxuICBpZiAoaXNPYmplY3QoQ3RvcikpIHtcbiAgICBDdG9yID0gYmFzZUN0b3IuZXh0ZW5kKEN0b3IpO1xuICB9XG5cbiAgLy8gaWYgYXQgdGhpcyBzdGFnZSBpdCdzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIGFuIGFzeW5jIGNvbXBvbmVudCBmYWN0b3J5LFxuICAvLyByZWplY3QuXG4gIGlmICh0eXBlb2YgQ3RvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHtcbiAgICAgIHdhcm4oKFwiSW52YWxpZCBDb21wb25lbnQgZGVmaW5pdGlvbjogXCIgKyAoU3RyaW5nKEN0b3IpKSksIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGFzeW5jIGNvbXBvbmVudFxuICBpZiAoaXNVbmRlZihDdG9yLmNpZCkpIHtcbiAgICBDdG9yID0gcmVzb2x2ZUFzeW5jQ29tcG9uZW50KEN0b3IsIGJhc2VDdG9yLCBjb250ZXh0KTtcbiAgICBpZiAoQ3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyByZXR1cm4gbm90aGluZyBpZiB0aGlzIGlzIGluZGVlZCBhbiBhc3luYyBjb21wb25lbnRcbiAgICAgIC8vIHdhaXQgZm9yIHRoZSBjYWxsYmFjayB0byB0cmlnZ2VyIHBhcmVudCB1cGRhdGUuXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cblxuICAvLyByZXNvbHZlIGNvbnN0cnVjdG9yIG9wdGlvbnMgaW4gY2FzZSBnbG9iYWwgbWl4aW5zIGFyZSBhcHBsaWVkIGFmdGVyXG4gIC8vIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBjcmVhdGlvblxuICByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKEN0b3IpO1xuXG4gIGRhdGEgPSBkYXRhIHx8IHt9O1xuXG4gIC8vIHRyYW5zZm9ybSBjb21wb25lbnQgdi1tb2RlbCBkYXRhIGludG8gcHJvcHMgJiBldmVudHNcbiAgaWYgKGlzRGVmKGRhdGEubW9kZWwpKSB7XG4gICAgdHJhbnNmb3JtTW9kZWwoQ3Rvci5vcHRpb25zLCBkYXRhKTtcbiAgfVxuXG4gIC8vIGV4dHJhY3QgcHJvcHNcbiAgdmFyIHByb3BzRGF0YSA9IGV4dHJhY3RQcm9wc0Zyb21WTm9kZURhdGEoZGF0YSwgQ3RvciwgdGFnKTtcblxuICAvLyBmdW5jdGlvbmFsIGNvbXBvbmVudFxuICBpZiAoaXNUcnVlKEN0b3Iub3B0aW9ucy5mdW5jdGlvbmFsKSkge1xuICAgIHJldHVybiBjcmVhdGVGdW5jdGlvbmFsQ29tcG9uZW50KEN0b3IsIHByb3BzRGF0YSwgZGF0YSwgY29udGV4dCwgY2hpbGRyZW4pXG4gIH1cblxuICAvLyBleHRyYWN0IGxpc3RlbmVycywgc2luY2UgdGhlc2UgbmVlZHMgdG8gYmUgdHJlYXRlZCBhc1xuICAvLyBjaGlsZCBjb21wb25lbnQgbGlzdGVuZXJzIGluc3RlYWQgb2YgRE9NIGxpc3RlbmVyc1xuICB2YXIgbGlzdGVuZXJzID0gZGF0YS5vbjtcbiAgLy8gcmVwbGFjZSB3aXRoIGxpc3RlbmVycyB3aXRoIC5uYXRpdmUgbW9kaWZpZXJcbiAgZGF0YS5vbiA9IGRhdGEubmF0aXZlT247XG5cbiAgaWYgKGlzVHJ1ZShDdG9yLm9wdGlvbnMuYWJzdHJhY3QpKSB7XG4gICAgLy8gYWJzdHJhY3QgY29tcG9uZW50cyBkbyBub3Qga2VlcCBhbnl0aGluZ1xuICAgIC8vIG90aGVyIHRoYW4gcHJvcHMgJiBsaXN0ZW5lcnNcbiAgICBkYXRhID0ge307XG4gIH1cblxuICAvLyBtZXJnZSBjb21wb25lbnQgbWFuYWdlbWVudCBob29rcyBvbnRvIHRoZSBwbGFjZWhvbGRlciBub2RlXG4gIG1lcmdlSG9va3MoZGF0YSk7XG5cbiAgLy8gcmV0dXJuIGEgcGxhY2Vob2xkZXIgdm5vZGVcbiAgdmFyIG5hbWUgPSBDdG9yLm9wdGlvbnMubmFtZSB8fCB0YWc7XG4gIHZhciB2bm9kZSA9IG5ldyBWTm9kZShcbiAgICAoXCJ2dWUtY29tcG9uZW50LVwiICsgKEN0b3IuY2lkKSArIChuYW1lID8gKFwiLVwiICsgbmFtZSkgOiAnJykpLFxuICAgIGRhdGEsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHQsXG4gICAgeyBDdG9yOiBDdG9yLCBwcm9wc0RhdGE6IHByb3BzRGF0YSwgbGlzdGVuZXJzOiBsaXN0ZW5lcnMsIHRhZzogdGFnLCBjaGlsZHJlbjogY2hpbGRyZW4gfVxuICApO1xuICByZXR1cm4gdm5vZGVcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VGb3JWbm9kZSAoXG4gIHZub2RlLCAvLyB3ZSBrbm93IGl0J3MgTW91bnRlZENvbXBvbmVudFZOb2RlIGJ1dCBmbG93IGRvZXNuJ3RcbiAgcGFyZW50LCAvLyBhY3RpdmVJbnN0YW5jZSBpbiBsaWZlY3ljbGUgc3RhdGVcbiAgcGFyZW50RWxtLFxuICByZWZFbG1cbikge1xuICB2YXIgdm5vZGVDb21wb25lbnRPcHRpb25zID0gdm5vZGUuY29tcG9uZW50T3B0aW9ucztcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgX2lzQ29tcG9uZW50OiB0cnVlLFxuICAgIHBhcmVudDogcGFyZW50LFxuICAgIHByb3BzRGF0YTogdm5vZGVDb21wb25lbnRPcHRpb25zLnByb3BzRGF0YSxcbiAgICBfY29tcG9uZW50VGFnOiB2bm9kZUNvbXBvbmVudE9wdGlvbnMudGFnLFxuICAgIF9wYXJlbnRWbm9kZTogdm5vZGUsXG4gICAgX3BhcmVudExpc3RlbmVyczogdm5vZGVDb21wb25lbnRPcHRpb25zLmxpc3RlbmVycyxcbiAgICBfcmVuZGVyQ2hpbGRyZW46IHZub2RlQ29tcG9uZW50T3B0aW9ucy5jaGlsZHJlbixcbiAgICBfcGFyZW50RWxtOiBwYXJlbnRFbG0gfHwgbnVsbCxcbiAgICBfcmVmRWxtOiByZWZFbG0gfHwgbnVsbFxuICB9O1xuICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGUgcmVuZGVyIGZ1bmN0aW9uc1xuICB2YXIgaW5saW5lVGVtcGxhdGUgPSB2bm9kZS5kYXRhLmlubGluZVRlbXBsYXRlO1xuICBpZiAoaXNEZWYoaW5saW5lVGVtcGxhdGUpKSB7XG4gICAgb3B0aW9ucy5yZW5kZXIgPSBpbmxpbmVUZW1wbGF0ZS5yZW5kZXI7XG4gICAgb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnMgPSBpbmxpbmVUZW1wbGF0ZS5zdGF0aWNSZW5kZXJGbnM7XG4gIH1cbiAgcmV0dXJuIG5ldyB2bm9kZUNvbXBvbmVudE9wdGlvbnMuQ3RvcihvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBtZXJnZUhvb2tzIChkYXRhKSB7XG4gIGlmICghZGF0YS5ob29rKSB7XG4gICAgZGF0YS5ob29rID0ge307XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBob29rc1RvTWVyZ2UubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gaG9va3NUb01lcmdlW2ldO1xuICAgIHZhciBmcm9tUGFyZW50ID0gZGF0YS5ob29rW2tleV07XG4gICAgdmFyIG91cnMgPSBjb21wb25lbnRWTm9kZUhvb2tzW2tleV07XG4gICAgZGF0YS5ob29rW2tleV0gPSBmcm9tUGFyZW50ID8gbWVyZ2VIb29rJDEob3VycywgZnJvbVBhcmVudCkgOiBvdXJzO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlSG9vayQxIChvbmUsIHR3bykge1xuICByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcbiAgICBvbmUoYSwgYiwgYywgZCk7XG4gICAgdHdvKGEsIGIsIGMsIGQpO1xuICB9XG59XG5cbi8vIHRyYW5zZm9ybSBjb21wb25lbnQgdi1tb2RlbCBpbmZvICh2YWx1ZSBhbmQgY2FsbGJhY2spIGludG9cbi8vIHByb3AgYW5kIGV2ZW50IGhhbmRsZXIgcmVzcGVjdGl2ZWx5LlxuZnVuY3Rpb24gdHJhbnNmb3JtTW9kZWwgKG9wdGlvbnMsIGRhdGEpIHtcbiAgdmFyIHByb3AgPSAob3B0aW9ucy5tb2RlbCAmJiBvcHRpb25zLm1vZGVsLnByb3ApIHx8ICd2YWx1ZSc7XG4gIHZhciBldmVudCA9IChvcHRpb25zLm1vZGVsICYmIG9wdGlvbnMubW9kZWwuZXZlbnQpIHx8ICdpbnB1dCc7KGRhdGEucHJvcHMgfHwgKGRhdGEucHJvcHMgPSB7fSkpW3Byb3BdID0gZGF0YS5tb2RlbC52YWx1ZTtcbiAgdmFyIG9uID0gZGF0YS5vbiB8fCAoZGF0YS5vbiA9IHt9KTtcbiAgaWYgKGlzRGVmKG9uW2V2ZW50XSkpIHtcbiAgICBvbltldmVudF0gPSBbZGF0YS5tb2RlbC5jYWxsYmFja10uY29uY2F0KG9uW2V2ZW50XSk7XG4gIH0gZWxzZSB7XG4gICAgb25bZXZlbnRdID0gZGF0YS5tb2RlbC5jYWxsYmFjaztcbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIFNJTVBMRV9OT1JNQUxJWkUgPSAxO1xudmFyIEFMV0FZU19OT1JNQUxJWkUgPSAyO1xuXG4vLyB3cmFwcGVyIGZ1bmN0aW9uIGZvciBwcm92aWRpbmcgYSBtb3JlIGZsZXhpYmxlIGludGVyZmFjZVxuLy8gd2l0aG91dCBnZXR0aW5nIHllbGxlZCBhdCBieSBmbG93XG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50IChcbiAgY29udGV4dCxcbiAgdGFnLFxuICBkYXRhLFxuICBjaGlsZHJlbixcbiAgbm9ybWFsaXphdGlvblR5cGUsXG4gIGFsd2F5c05vcm1hbGl6ZVxuKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpIHx8IGlzUHJpbWl0aXZlKGRhdGEpKSB7XG4gICAgbm9ybWFsaXphdGlvblR5cGUgPSBjaGlsZHJlbjtcbiAgICBjaGlsZHJlbiA9IGRhdGE7XG4gICAgZGF0YSA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoaXNUcnVlKGFsd2F5c05vcm1hbGl6ZSkpIHtcbiAgICBub3JtYWxpemF0aW9uVHlwZSA9IEFMV0FZU19OT1JNQUxJWkU7XG4gIH1cbiAgcmV0dXJuIF9jcmVhdGVFbGVtZW50KGNvbnRleHQsIHRhZywgZGF0YSwgY2hpbGRyZW4sIG5vcm1hbGl6YXRpb25UeXBlKVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlRWxlbWVudCAoXG4gIGNvbnRleHQsXG4gIHRhZyxcbiAgZGF0YSxcbiAgY2hpbGRyZW4sXG4gIG5vcm1hbGl6YXRpb25UeXBlXG4pIHtcbiAgaWYgKGlzRGVmKGRhdGEpICYmIGlzRGVmKChkYXRhKS5fX29iX18pKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgIFwiQXZvaWQgdXNpbmcgb2JzZXJ2ZWQgZGF0YSBvYmplY3QgYXMgdm5vZGUgZGF0YTogXCIgKyAoSlNPTi5zdHJpbmdpZnkoZGF0YSkpICsgXCJcXG5cIiArXG4gICAgICAnQWx3YXlzIGNyZWF0ZSBmcmVzaCB2bm9kZSBkYXRhIG9iamVjdHMgaW4gZWFjaCByZW5kZXIhJyxcbiAgICAgIGNvbnRleHRcbiAgICApO1xuICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcbiAgfVxuICBpZiAoIXRhZykge1xuICAgIC8vIGluIGNhc2Ugb2YgY29tcG9uZW50IDppcyBzZXQgdG8gZmFsc3kgdmFsdWVcbiAgICByZXR1cm4gY3JlYXRlRW1wdHlWTm9kZSgpXG4gIH1cbiAgLy8gc3VwcG9ydCBzaW5nbGUgZnVuY3Rpb24gY2hpbGRyZW4gYXMgZGVmYXVsdCBzY29wZWQgc2xvdFxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiZcbiAgICB0eXBlb2YgY2hpbGRyZW5bMF0gPT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZGF0YS5zY29wZWRTbG90cyA9IHsgZGVmYXVsdDogY2hpbGRyZW5bMF0gfTtcbiAgICBjaGlsZHJlbi5sZW5ndGggPSAwO1xuICB9XG4gIGlmIChub3JtYWxpemF0aW9uVHlwZSA9PT0gQUxXQVlTX05PUk1BTElaRSkge1xuICAgIGNoaWxkcmVuID0gbm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pO1xuICB9IGVsc2UgaWYgKG5vcm1hbGl6YXRpb25UeXBlID09PSBTSU1QTEVfTk9STUFMSVpFKSB7XG4gICAgY2hpbGRyZW4gPSBzaW1wbGVOb3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbik7XG4gIH1cbiAgdmFyIHZub2RlLCBucztcbiAgaWYgKHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIEN0b3I7XG4gICAgbnMgPSBjb25maWcuZ2V0VGFnTmFtZXNwYWNlKHRhZyk7XG4gICAgaWYgKGNvbmZpZy5pc1Jlc2VydmVkVGFnKHRhZykpIHtcbiAgICAgIC8vIHBsYXRmb3JtIGJ1aWx0LWluIGVsZW1lbnRzXG4gICAgICB2bm9kZSA9IG5ldyBWTm9kZShcbiAgICAgICAgY29uZmlnLnBhcnNlUGxhdGZvcm1UYWdOYW1lKHRhZyksIGRhdGEsIGNoaWxkcmVuLFxuICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGlzRGVmKEN0b3IgPSByZXNvbHZlQXNzZXQoY29udGV4dC4kb3B0aW9ucywgJ2NvbXBvbmVudHMnLCB0YWcpKSkge1xuICAgICAgLy8gY29tcG9uZW50XG4gICAgICB2bm9kZSA9IGNyZWF0ZUNvbXBvbmVudChDdG9yLCBkYXRhLCBjb250ZXh0LCBjaGlsZHJlbiwgdGFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdW5rbm93biBvciB1bmxpc3RlZCBuYW1lc3BhY2VkIGVsZW1lbnRzXG4gICAgICAvLyBjaGVjayBhdCBydW50aW1lIGJlY2F1c2UgaXQgbWF5IGdldCBhc3NpZ25lZCBhIG5hbWVzcGFjZSB3aGVuIGl0c1xuICAgICAgLy8gcGFyZW50IG5vcm1hbGl6ZXMgY2hpbGRyZW5cbiAgICAgIHZub2RlID0gbmV3IFZOb2RlKFxuICAgICAgICB0YWcsIGRhdGEsIGNoaWxkcmVuLFxuICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gZGlyZWN0IGNvbXBvbmVudCBvcHRpb25zIC8gY29uc3RydWN0b3JcbiAgICB2bm9kZSA9IGNyZWF0ZUNvbXBvbmVudCh0YWcsIGRhdGEsIGNvbnRleHQsIGNoaWxkcmVuKTtcbiAgfVxuICBpZiAoaXNEZWYodm5vZGUpKSB7XG4gICAgaWYgKG5zKSB7IGFwcGx5TlModm5vZGUsIG5zKTsgfVxuICAgIHJldHVybiB2bm9kZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBseU5TICh2bm9kZSwgbnMpIHtcbiAgdm5vZGUubnMgPSBucztcbiAgaWYgKHZub2RlLnRhZyA9PT0gJ2ZvcmVpZ25PYmplY3QnKSB7XG4gICAgLy8gdXNlIGRlZmF1bHQgbmFtZXNwYWNlIGluc2lkZSBmb3JlaWduT2JqZWN0XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKGlzRGVmKHZub2RlLmNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSB2bm9kZS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChpc0RlZihjaGlsZC50YWcpICYmIGlzVW5kZWYoY2hpbGQubnMpKSB7XG4gICAgICAgIGFwcGx5TlMoY2hpbGQsIG5zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlbmRlcmluZyB2LWZvciBsaXN0cy5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyTGlzdCAoXG4gIHZhbCxcbiAgcmVuZGVyXG4pIHtcbiAgdmFyIHJldCwgaSwgbCwga2V5cywga2V5O1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpIHx8IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0ID0gbmV3IEFycmF5KHZhbC5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDAsIGwgPSB2YWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICByZXRbaV0gPSByZW5kZXIodmFsW2ldLCBpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICByZXQgPSBuZXcgQXJyYXkodmFsKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdmFsOyBpKyspIHtcbiAgICAgIHJldFtpXSA9IHJlbmRlcihpICsgMSwgaSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcbiAgICByZXQgPSBuZXcgQXJyYXkoa2V5cy5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIHJldFtpXSA9IHJlbmRlcih2YWxba2V5XSwga2V5LCBpKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzRGVmKHJldCkpIHtcbiAgICAocmV0KS5faXNWTGlzdCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBSdW50aW1lIGhlbHBlciBmb3IgcmVuZGVyaW5nIDxzbG90PlxuICovXG5mdW5jdGlvbiByZW5kZXJTbG90IChcbiAgbmFtZSxcbiAgZmFsbGJhY2ssXG4gIHByb3BzLFxuICBiaW5kT2JqZWN0XG4pIHtcbiAgdmFyIHNjb3BlZFNsb3RGbiA9IHRoaXMuJHNjb3BlZFNsb3RzW25hbWVdO1xuICBpZiAoc2NvcGVkU2xvdEZuKSB7IC8vIHNjb3BlZCBzbG90XG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICBpZiAoYmluZE9iamVjdCkge1xuICAgICAgZXh0ZW5kKHByb3BzLCBiaW5kT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3BlZFNsb3RGbihwcm9wcykgfHwgZmFsbGJhY2tcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xvdE5vZGVzID0gdGhpcy4kc2xvdHNbbmFtZV07XG4gICAgLy8gd2FybiBkdXBsaWNhdGUgc2xvdCB1c2FnZVxuICAgIGlmIChzbG90Tm9kZXMgJiYgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHNsb3ROb2Rlcy5fcmVuZGVyZWQgJiYgd2FybihcbiAgICAgICAgXCJEdXBsaWNhdGUgcHJlc2VuY2Ugb2Ygc2xvdCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiIGZvdW5kIGluIHRoZSBzYW1lIHJlbmRlciB0cmVlIFwiICtcbiAgICAgICAgXCItIHRoaXMgd2lsbCBsaWtlbHkgY2F1c2UgcmVuZGVyIGVycm9ycy5cIixcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICAgIHNsb3ROb2Rlcy5fcmVuZGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gc2xvdE5vZGVzIHx8IGZhbGxiYWNrXG4gIH1cbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlc29sdmluZyBmaWx0ZXJzXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVGaWx0ZXIgKGlkKSB7XG4gIHJldHVybiByZXNvbHZlQXNzZXQodGhpcy4kb3B0aW9ucywgJ2ZpbHRlcnMnLCBpZCwgdHJ1ZSkgfHwgaWRlbnRpdHlcbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIGNoZWNraW5nIGtleUNvZGVzIGZyb20gY29uZmlnLlxuICovXG5mdW5jdGlvbiBjaGVja0tleUNvZGVzIChcbiAgZXZlbnRLZXlDb2RlLFxuICBrZXksXG4gIGJ1aWx0SW5BbGlhc1xuKSB7XG4gIHZhciBrZXlDb2RlcyA9IGNvbmZpZy5rZXlDb2Rlc1trZXldIHx8IGJ1aWx0SW5BbGlhcztcbiAgaWYgKEFycmF5LmlzQXJyYXkoa2V5Q29kZXMpKSB7XG4gICAgcmV0dXJuIGtleUNvZGVzLmluZGV4T2YoZXZlbnRLZXlDb2RlKSA9PT0gLTFcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ga2V5Q29kZXMgIT09IGV2ZW50S2V5Q29kZVxuICB9XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciBtZXJnaW5nIHYtYmluZD1cIm9iamVjdFwiIGludG8gYSBWTm9kZSdzIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGJpbmRPYmplY3RQcm9wcyAoXG4gIGRhdGEsXG4gIHRhZyxcbiAgdmFsdWUsXG4gIGFzUHJvcFxuKSB7XG4gIGlmICh2YWx1ZSkge1xuICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICAndi1iaW5kIHdpdGhvdXQgYXJndW1lbnQgZXhwZWN0cyBhbiBPYmplY3Qgb3IgQXJyYXkgdmFsdWUnLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB0b09iamVjdCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICB2YXIgaGFzaDtcbiAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3MnIHx8IGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgIGhhc2ggPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0eXBlID0gZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLnR5cGU7XG4gICAgICAgICAgaGFzaCA9IGFzUHJvcCB8fCBjb25maWcubXVzdFVzZVByb3AodGFnLCB0eXBlLCBrZXkpXG4gICAgICAgICAgICA/IGRhdGEuZG9tUHJvcHMgfHwgKGRhdGEuZG9tUHJvcHMgPSB7fSlcbiAgICAgICAgICAgIDogZGF0YS5hdHRycyB8fCAoZGF0YS5hdHRycyA9IHt9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShrZXkgaW4gaGFzaCkpIHtcbiAgICAgICAgICBoYXNoW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbi8qICAqL1xuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciByZW5kZXJpbmcgc3RhdGljIHRyZWVzLlxuICovXG5mdW5jdGlvbiByZW5kZXJTdGF0aWMgKFxuICBpbmRleCxcbiAgaXNJbkZvclxuKSB7XG4gIHZhciB0cmVlID0gdGhpcy5fc3RhdGljVHJlZXNbaW5kZXhdO1xuICAvLyBpZiBoYXMgYWxyZWFkeS1yZW5kZXJlZCBzdGF0aWMgdHJlZSBhbmQgbm90IGluc2lkZSB2LWZvcixcbiAgLy8gd2UgY2FuIHJldXNlIHRoZSBzYW1lIHRyZWUgYnkgZG9pbmcgYSBzaGFsbG93IGNsb25lLlxuICBpZiAodHJlZSAmJiAhaXNJbkZvcikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHRyZWUpXG4gICAgICA/IGNsb25lVk5vZGVzKHRyZWUpXG4gICAgICA6IGNsb25lVk5vZGUodHJlZSlcbiAgfVxuICAvLyBvdGhlcndpc2UsIHJlbmRlciBhIGZyZXNoIHRyZWUuXG4gIHRyZWUgPSB0aGlzLl9zdGF0aWNUcmVlc1tpbmRleF0gPVxuICAgIHRoaXMuJG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zW2luZGV4XS5jYWxsKHRoaXMuX3JlbmRlclByb3h5KTtcbiAgbWFya1N0YXRpYyh0cmVlLCAoXCJfX3N0YXRpY19fXCIgKyBpbmRleCksIGZhbHNlKTtcbiAgcmV0dXJuIHRyZWVcbn1cblxuLyoqXG4gKiBSdW50aW1lIGhlbHBlciBmb3Igdi1vbmNlLlxuICogRWZmZWN0aXZlbHkgaXQgbWVhbnMgbWFya2luZyB0aGUgbm9kZSBhcyBzdGF0aWMgd2l0aCBhIHVuaXF1ZSBrZXkuXG4gKi9cbmZ1bmN0aW9uIG1hcmtPbmNlIChcbiAgdHJlZSxcbiAgaW5kZXgsXG4gIGtleVxuKSB7XG4gIG1hcmtTdGF0aWModHJlZSwgKFwiX19vbmNlX19cIiArIGluZGV4ICsgKGtleSA/IChcIl9cIiArIGtleSkgOiBcIlwiKSksIHRydWUpO1xuICByZXR1cm4gdHJlZVxufVxuXG5mdW5jdGlvbiBtYXJrU3RhdGljIChcbiAgdHJlZSxcbiAga2V5LFxuICBpc09uY2Vcbikge1xuICBpZiAoQXJyYXkuaXNBcnJheSh0cmVlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRyZWVbaV0gJiYgdHlwZW9mIHRyZWVbaV0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1hcmtTdGF0aWNOb2RlKHRyZWVbaV0sIChrZXkgKyBcIl9cIiArIGkpLCBpc09uY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtYXJrU3RhdGljTm9kZSh0cmVlLCBrZXksIGlzT25jZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFya1N0YXRpY05vZGUgKG5vZGUsIGtleSwgaXNPbmNlKSB7XG4gIG5vZGUuaXNTdGF0aWMgPSB0cnVlO1xuICBub2RlLmtleSA9IGtleTtcbiAgbm9kZS5pc09uY2UgPSBpc09uY2U7XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0UmVuZGVyICh2bSkge1xuICB2bS5fdm5vZGUgPSBudWxsOyAvLyB0aGUgcm9vdCBvZiB0aGUgY2hpbGQgdHJlZVxuICB2bS5fc3RhdGljVHJlZXMgPSBudWxsO1xuICB2YXIgcGFyZW50Vm5vZGUgPSB2bS4kdm5vZGUgPSB2bS4kb3B0aW9ucy5fcGFyZW50Vm5vZGU7IC8vIHRoZSBwbGFjZWhvbGRlciBub2RlIGluIHBhcmVudCB0cmVlXG4gIHZhciByZW5kZXJDb250ZXh0ID0gcGFyZW50Vm5vZGUgJiYgcGFyZW50Vm5vZGUuY29udGV4dDtcbiAgdm0uJHNsb3RzID0gcmVzb2x2ZVNsb3RzKHZtLiRvcHRpb25zLl9yZW5kZXJDaGlsZHJlbiwgcmVuZGVyQ29udGV4dCk7XG4gIHZtLiRzY29wZWRTbG90cyA9IGVtcHR5T2JqZWN0O1xuICAvLyBiaW5kIHRoZSBjcmVhdGVFbGVtZW50IGZuIHRvIHRoaXMgaW5zdGFuY2VcbiAgLy8gc28gdGhhdCB3ZSBnZXQgcHJvcGVyIHJlbmRlciBjb250ZXh0IGluc2lkZSBpdC5cbiAgLy8gYXJncyBvcmRlcjogdGFnLCBkYXRhLCBjaGlsZHJlbiwgbm9ybWFsaXphdGlvblR5cGUsIGFsd2F5c05vcm1hbGl6ZVxuICAvLyBpbnRlcm5hbCB2ZXJzaW9uIGlzIHVzZWQgYnkgcmVuZGVyIGZ1bmN0aW9ucyBjb21waWxlZCBmcm9tIHRlbXBsYXRlc1xuICB2bS5fYyA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KHZtLCBhLCBiLCBjLCBkLCBmYWxzZSk7IH07XG4gIC8vIG5vcm1hbGl6YXRpb24gaXMgYWx3YXlzIGFwcGxpZWQgZm9yIHRoZSBwdWJsaWMgdmVyc2lvbiwgdXNlZCBpblxuICAvLyB1c2VyLXdyaXR0ZW4gcmVuZGVyIGZ1bmN0aW9ucy5cbiAgdm0uJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkgeyByZXR1cm4gY3JlYXRlRWxlbWVudCh2bSwgYSwgYiwgYywgZCwgdHJ1ZSk7IH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1peGluIChWdWUpIHtcbiAgVnVlLnByb3RvdHlwZS4kbmV4dFRpY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICByZXR1cm4gbmV4dFRpY2soZm4sIHRoaXMpXG4gIH07XG5cbiAgVnVlLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdmFyIHJlZiA9IHZtLiRvcHRpb25zO1xuICAgIHZhciByZW5kZXIgPSByZWYucmVuZGVyO1xuICAgIHZhciBzdGF0aWNSZW5kZXJGbnMgPSByZWYuc3RhdGljUmVuZGVyRm5zO1xuICAgIHZhciBfcGFyZW50Vm5vZGUgPSByZWYuX3BhcmVudFZub2RlO1xuXG4gICAgaWYgKHZtLl9pc01vdW50ZWQpIHtcbiAgICAgIC8vIGNsb25lIHNsb3Qgbm9kZXMgb24gcmUtcmVuZGVyc1xuICAgICAgZm9yICh2YXIga2V5IGluIHZtLiRzbG90cykge1xuICAgICAgICB2bS4kc2xvdHNba2V5XSA9IGNsb25lVk5vZGVzKHZtLiRzbG90c1trZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2bS4kc2NvcGVkU2xvdHMgPSAoX3BhcmVudFZub2RlICYmIF9wYXJlbnRWbm9kZS5kYXRhLnNjb3BlZFNsb3RzKSB8fCBlbXB0eU9iamVjdDtcblxuICAgIGlmIChzdGF0aWNSZW5kZXJGbnMgJiYgIXZtLl9zdGF0aWNUcmVlcykge1xuICAgICAgdm0uX3N0YXRpY1RyZWVzID0gW107XG4gICAgfVxuICAgIC8vIHNldCBwYXJlbnQgdm5vZGUuIHRoaXMgYWxsb3dzIHJlbmRlciBmdW5jdGlvbnMgdG8gaGF2ZSBhY2Nlc3NcbiAgICAvLyB0byB0aGUgZGF0YSBvbiB0aGUgcGxhY2Vob2xkZXIgbm9kZS5cbiAgICB2bS4kdm5vZGUgPSBfcGFyZW50Vm5vZGU7XG4gICAgLy8gcmVuZGVyIHNlbGZcbiAgICB2YXIgdm5vZGU7XG4gICAgdHJ5IHtcbiAgICAgIHZub2RlID0gcmVuZGVyLmNhbGwodm0uX3JlbmRlclByb3h5LCB2bS4kY3JlYXRlRWxlbWVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaGFuZGxlRXJyb3IoZSwgdm0sIFwicmVuZGVyIGZ1bmN0aW9uXCIpO1xuICAgICAgLy8gcmV0dXJuIGVycm9yIHJlbmRlciByZXN1bHQsXG4gICAgICAvLyBvciBwcmV2aW91cyB2bm9kZSB0byBwcmV2ZW50IHJlbmRlciBlcnJvciBjYXVzaW5nIGJsYW5rIGNvbXBvbmVudFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIHtcbiAgICAgICAgdm5vZGUgPSB2bS4kb3B0aW9ucy5yZW5kZXJFcnJvclxuICAgICAgICAgID8gdm0uJG9wdGlvbnMucmVuZGVyRXJyb3IuY2FsbCh2bS5fcmVuZGVyUHJveHksIHZtLiRjcmVhdGVFbGVtZW50LCBlKVxuICAgICAgICAgIDogdm0uX3Zub2RlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyByZXR1cm4gZW1wdHkgdm5vZGUgaW4gY2FzZSB0aGUgcmVuZGVyIGZ1bmN0aW9uIGVycm9yZWQgb3V0XG4gICAgaWYgKCEodm5vZGUgaW5zdGFuY2VvZiBWTm9kZSkpIHtcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBBcnJheS5pc0FycmF5KHZub2RlKSkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdNdWx0aXBsZSByb290IG5vZGVzIHJldHVybmVkIGZyb20gcmVuZGVyIGZ1bmN0aW9uLiBSZW5kZXIgZnVuY3Rpb24gJyArXG4gICAgICAgICAgJ3Nob3VsZCByZXR1cm4gYSBzaW5nbGUgcm9vdCBub2RlLicsXG4gICAgICAgICAgdm1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHZub2RlID0gY3JlYXRlRW1wdHlWTm9kZSgpO1xuICAgIH1cbiAgICAvLyBzZXQgcGFyZW50XG4gICAgdm5vZGUucGFyZW50ID0gX3BhcmVudFZub2RlO1xuICAgIHJldHVybiB2bm9kZVxuICB9O1xuXG4gIC8vIGludGVybmFsIHJlbmRlciBoZWxwZXJzLlxuICAvLyB0aGVzZSBhcmUgZXhwb3NlZCBvbiB0aGUgaW5zdGFuY2UgcHJvdG90eXBlIHRvIHJlZHVjZSBnZW5lcmF0ZWQgcmVuZGVyXG4gIC8vIGNvZGUgc2l6ZS5cbiAgVnVlLnByb3RvdHlwZS5fbyA9IG1hcmtPbmNlO1xuICBWdWUucHJvdG90eXBlLl9uID0gdG9OdW1iZXI7XG4gIFZ1ZS5wcm90b3R5cGUuX3MgPSB0b1N0cmluZztcbiAgVnVlLnByb3RvdHlwZS5fbCA9IHJlbmRlckxpc3Q7XG4gIFZ1ZS5wcm90b3R5cGUuX3QgPSByZW5kZXJTbG90O1xuICBWdWUucHJvdG90eXBlLl9xID0gbG9vc2VFcXVhbDtcbiAgVnVlLnByb3RvdHlwZS5faSA9IGxvb3NlSW5kZXhPZjtcbiAgVnVlLnByb3RvdHlwZS5fbSA9IHJlbmRlclN0YXRpYztcbiAgVnVlLnByb3RvdHlwZS5fZiA9IHJlc29sdmVGaWx0ZXI7XG4gIFZ1ZS5wcm90b3R5cGUuX2sgPSBjaGVja0tleUNvZGVzO1xuICBWdWUucHJvdG90eXBlLl9iID0gYmluZE9iamVjdFByb3BzO1xuICBWdWUucHJvdG90eXBlLl92ID0gY3JlYXRlVGV4dFZOb2RlO1xuICBWdWUucHJvdG90eXBlLl9lID0gY3JlYXRlRW1wdHlWTm9kZTtcbiAgVnVlLnByb3RvdHlwZS5fdSA9IHJlc29sdmVTY29wZWRTbG90cztcbn1cblxuLyogICovXG5cbnZhciB1aWQkMSA9IDA7XG5cbmZ1bmN0aW9uIGluaXRNaXhpbiAoVnVlKSB7XG4gIFZ1ZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgLy8gYSB1aWRcbiAgICB2bS5fdWlkID0gdWlkJDErKztcblxuICAgIHZhciBzdGFydFRhZywgZW5kVGFnO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgbWFyaykge1xuICAgICAgc3RhcnRUYWcgPSBcInZ1ZS1wZXJmLWluaXQ6XCIgKyAodm0uX3VpZCk7XG4gICAgICBlbmRUYWcgPSBcInZ1ZS1wZXJmLWVuZDpcIiArICh2bS5fdWlkKTtcbiAgICAgIG1hcmsoc3RhcnRUYWcpO1xuICAgIH1cblxuICAgIC8vIGEgZmxhZyB0byBhdm9pZCB0aGlzIGJlaW5nIG9ic2VydmVkXG4gICAgdm0uX2lzVnVlID0gdHJ1ZTtcbiAgICAvLyBtZXJnZSBvcHRpb25zXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5faXNDb21wb25lbnQpIHtcbiAgICAgIC8vIG9wdGltaXplIGludGVybmFsIGNvbXBvbmVudCBpbnN0YW50aWF0aW9uXG4gICAgICAvLyBzaW5jZSBkeW5hbWljIG9wdGlvbnMgbWVyZ2luZyBpcyBwcmV0dHkgc2xvdywgYW5kIG5vbmUgb2YgdGhlXG4gICAgICAvLyBpbnRlcm5hbCBjb21wb25lbnQgb3B0aW9ucyBuZWVkcyBzcGVjaWFsIHRyZWF0bWVudC5cbiAgICAgIGluaXRJbnRlcm5hbENvbXBvbmVudCh2bSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZtLiRvcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgICAgICByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKHZtLmNvbnN0cnVjdG9yKSxcbiAgICAgICAgb3B0aW9ucyB8fCB7fSxcbiAgICAgICAgdm1cbiAgICAgICk7XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAge1xuICAgICAgaW5pdFByb3h5KHZtKTtcbiAgICB9XG4gICAgLy8gZXhwb3NlIHJlYWwgc2VsZlxuICAgIHZtLl9zZWxmID0gdm07XG4gICAgaW5pdExpZmVjeWNsZSh2bSk7XG4gICAgaW5pdEV2ZW50cyh2bSk7XG4gICAgaW5pdFJlbmRlcih2bSk7XG4gICAgY2FsbEhvb2sodm0sICdiZWZvcmVDcmVhdGUnKTtcbiAgICBpbml0SW5qZWN0aW9ucyh2bSk7IC8vIHJlc29sdmUgaW5qZWN0aW9ucyBiZWZvcmUgZGF0YS9wcm9wc1xuICAgIGluaXRTdGF0ZSh2bSk7XG4gICAgaW5pdFByb3ZpZGUodm0pOyAvLyByZXNvbHZlIHByb3ZpZGUgYWZ0ZXIgZGF0YS9wcm9wc1xuICAgIGNhbGxIb29rKHZtLCAnY3JlYXRlZCcpO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNvbmZpZy5wZXJmb3JtYW5jZSAmJiBtYXJrKSB7XG4gICAgICB2bS5fbmFtZSA9IGZvcm1hdENvbXBvbmVudE5hbWUodm0sIGZhbHNlKTtcbiAgICAgIG1hcmsoZW5kVGFnKTtcbiAgICAgIG1lYXN1cmUoKCh2bS5fbmFtZSkgKyBcIiBpbml0XCIpLCBzdGFydFRhZywgZW5kVGFnKTtcbiAgICB9XG5cbiAgICBpZiAodm0uJG9wdGlvbnMuZWwpIHtcbiAgICAgIHZtLiRtb3VudCh2bS4kb3B0aW9ucy5lbCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbml0SW50ZXJuYWxDb21wb25lbnQgKHZtLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gdm0uJG9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKHZtLmNvbnN0cnVjdG9yLm9wdGlvbnMpO1xuICAvLyBkb2luZyB0aGlzIGJlY2F1c2UgaXQncyBmYXN0ZXIgdGhhbiBkeW5hbWljIGVudW1lcmF0aW9uLlxuICBvcHRzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50O1xuICBvcHRzLnByb3BzRGF0YSA9IG9wdGlvbnMucHJvcHNEYXRhO1xuICBvcHRzLl9wYXJlbnRWbm9kZSA9IG9wdGlvbnMuX3BhcmVudFZub2RlO1xuICBvcHRzLl9wYXJlbnRMaXN0ZW5lcnMgPSBvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnM7XG4gIG9wdHMuX3JlbmRlckNoaWxkcmVuID0gb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW47XG4gIG9wdHMuX2NvbXBvbmVudFRhZyA9IG9wdGlvbnMuX2NvbXBvbmVudFRhZztcbiAgb3B0cy5fcGFyZW50RWxtID0gb3B0aW9ucy5fcGFyZW50RWxtO1xuICBvcHRzLl9yZWZFbG0gPSBvcHRpb25zLl9yZWZFbG07XG4gIGlmIChvcHRpb25zLnJlbmRlcikge1xuICAgIG9wdHMucmVuZGVyID0gb3B0aW9ucy5yZW5kZXI7XG4gICAgb3B0cy5zdGF0aWNSZW5kZXJGbnMgPSBvcHRpb25zLnN0YXRpY1JlbmRlckZucztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zIChDdG9yKSB7XG4gIHZhciBvcHRpb25zID0gQ3Rvci5vcHRpb25zO1xuICBpZiAoQ3Rvci5zdXBlcikge1xuICAgIHZhciBzdXBlck9wdGlvbnMgPSByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKEN0b3Iuc3VwZXIpO1xuICAgIHZhciBjYWNoZWRTdXBlck9wdGlvbnMgPSBDdG9yLnN1cGVyT3B0aW9ucztcbiAgICBpZiAoc3VwZXJPcHRpb25zICE9PSBjYWNoZWRTdXBlck9wdGlvbnMpIHtcbiAgICAgIC8vIHN1cGVyIG9wdGlvbiBjaGFuZ2VkLFxuICAgICAgLy8gbmVlZCB0byByZXNvbHZlIG5ldyBvcHRpb25zLlxuICAgICAgQ3Rvci5zdXBlck9wdGlvbnMgPSBzdXBlck9wdGlvbnM7XG4gICAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGxhdGUtbW9kaWZpZWQvYXR0YWNoZWQgb3B0aW9ucyAoIzQ5NzYpXG4gICAgICB2YXIgbW9kaWZpZWRPcHRpb25zID0gcmVzb2x2ZU1vZGlmaWVkT3B0aW9ucyhDdG9yKTtcbiAgICAgIC8vIHVwZGF0ZSBiYXNlIGV4dGVuZCBvcHRpb25zXG4gICAgICBpZiAobW9kaWZpZWRPcHRpb25zKSB7XG4gICAgICAgIGV4dGVuZChDdG9yLmV4dGVuZE9wdGlvbnMsIG1vZGlmaWVkT3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gQ3Rvci5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHN1cGVyT3B0aW9ucywgQ3Rvci5leHRlbmRPcHRpb25zKTtcbiAgICAgIGlmIChvcHRpb25zLm5hbWUpIHtcbiAgICAgICAgb3B0aW9ucy5jb21wb25lbnRzW29wdGlvbnMubmFtZV0gPSBDdG9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3B0aW9uc1xufVxuXG5mdW5jdGlvbiByZXNvbHZlTW9kaWZpZWRPcHRpb25zIChDdG9yKSB7XG4gIHZhciBtb2RpZmllZDtcbiAgdmFyIGxhdGVzdCA9IEN0b3Iub3B0aW9ucztcbiAgdmFyIGV4dGVuZGVkID0gQ3Rvci5leHRlbmRPcHRpb25zO1xuICB2YXIgc2VhbGVkID0gQ3Rvci5zZWFsZWRPcHRpb25zO1xuICBmb3IgKHZhciBrZXkgaW4gbGF0ZXN0KSB7XG4gICAgaWYgKGxhdGVzdFtrZXldICE9PSBzZWFsZWRba2V5XSkge1xuICAgICAgaWYgKCFtb2RpZmllZCkgeyBtb2RpZmllZCA9IHt9OyB9XG4gICAgICBtb2RpZmllZFtrZXldID0gZGVkdXBlKGxhdGVzdFtrZXldLCBleHRlbmRlZFtrZXldLCBzZWFsZWRba2V5XSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtb2RpZmllZFxufVxuXG5mdW5jdGlvbiBkZWR1cGUgKGxhdGVzdCwgZXh0ZW5kZWQsIHNlYWxlZCkge1xuICAvLyBjb21wYXJlIGxhdGVzdCBhbmQgc2VhbGVkIHRvIGVuc3VyZSBsaWZlY3ljbGUgaG9va3Mgd29uJ3QgYmUgZHVwbGljYXRlZFxuICAvLyBiZXR3ZWVuIG1lcmdlc1xuICBpZiAoQXJyYXkuaXNBcnJheShsYXRlc3QpKSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHNlYWxlZCA9IEFycmF5LmlzQXJyYXkoc2VhbGVkKSA/IHNlYWxlZCA6IFtzZWFsZWRdO1xuICAgIGV4dGVuZGVkID0gQXJyYXkuaXNBcnJheShleHRlbmRlZCkgPyBleHRlbmRlZCA6IFtleHRlbmRlZF07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRlc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIHB1c2ggb3JpZ2luYWwgb3B0aW9ucyBhbmQgbm90IHNlYWxlZCBvcHRpb25zIHRvIGV4Y2x1ZGUgZHVwbGljYXRlZCBvcHRpb25zXG4gICAgICBpZiAoZXh0ZW5kZWQuaW5kZXhPZihsYXRlc3RbaV0pID49IDAgfHwgc2VhbGVkLmluZGV4T2YobGF0ZXN0W2ldKSA8IDApIHtcbiAgICAgICAgcmVzLnB1c2gobGF0ZXN0W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsYXRlc3RcbiAgfVxufVxuXG5mdW5jdGlvbiBWdWUkMyAob3B0aW9ucykge1xuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcbiAgICAhKHRoaXMgaW5zdGFuY2VvZiBWdWUkMylcbiAgKSB7XG4gICAgd2FybignVnVlIGlzIGEgY29uc3RydWN0b3IgYW5kIHNob3VsZCBiZSBjYWxsZWQgd2l0aCB0aGUgYG5ld2Aga2V5d29yZCcpO1xuICB9XG4gIHRoaXMuX2luaXQob3B0aW9ucyk7XG59XG5cbmluaXRNaXhpbihWdWUkMyk7XG5zdGF0ZU1peGluKFZ1ZSQzKTtcbmV2ZW50c01peGluKFZ1ZSQzKTtcbmxpZmVjeWNsZU1peGluKFZ1ZSQzKTtcbnJlbmRlck1peGluKFZ1ZSQzKTtcblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRVc2UgKFZ1ZSkge1xuICBWdWUudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChwbHVnaW4uaW5zdGFsbGVkKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcyk7XG4gICAgaWYgKHR5cGVvZiBwbHVnaW4uaW5zdGFsbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9XG4gICAgcGx1Z2luLmluc3RhbGxlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXNcbiAgfTtcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRNaXhpbiQxIChWdWUpIHtcbiAgVnVlLm1peGluID0gZnVuY3Rpb24gKG1peGluKSB7XG4gICAgdGhpcy5vcHRpb25zID0gbWVyZ2VPcHRpb25zKHRoaXMub3B0aW9ucywgbWl4aW4pO1xuICAgIHJldHVybiB0aGlzXG4gIH07XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0RXh0ZW5kIChWdWUpIHtcbiAgLyoqXG4gICAqIEVhY2ggaW5zdGFuY2UgY29uc3RydWN0b3IsIGluY2x1ZGluZyBWdWUsIGhhcyBhIHVuaXF1ZVxuICAgKiBjaWQuIFRoaXMgZW5hYmxlcyB1cyB0byBjcmVhdGUgd3JhcHBlZCBcImNoaWxkXG4gICAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxuICAgKi9cbiAgVnVlLmNpZCA9IDA7XG4gIHZhciBjaWQgPSAxO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBpbmhlcml0YW5jZVxuICAgKi9cbiAgVnVlLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XG4gICAgZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMgfHwge307XG4gICAgdmFyIFN1cGVyID0gdGhpcztcbiAgICB2YXIgU3VwZXJJZCA9IFN1cGVyLmNpZDtcbiAgICB2YXIgY2FjaGVkQ3RvcnMgPSBleHRlbmRPcHRpb25zLl9DdG9yIHx8IChleHRlbmRPcHRpb25zLl9DdG9yID0ge30pO1xuICAgIGlmIChjYWNoZWRDdG9yc1tTdXBlcklkXSkge1xuICAgICAgcmV0dXJuIGNhY2hlZEN0b3JzW1N1cGVySWRdXG4gICAgfVxuXG4gICAgdmFyIG5hbWUgPSBleHRlbmRPcHRpb25zLm5hbWUgfHwgU3VwZXIub3B0aW9ucy5uYW1lO1xuICAgIHtcbiAgICAgIGlmICghL15bYS16QS1aXVtcXHctXSokLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgJ0ludmFsaWQgY29tcG9uZW50IG5hbWU6IFwiJyArIG5hbWUgKyAnXCIuIENvbXBvbmVudCBuYW1lcyAnICtcbiAgICAgICAgICAnY2FuIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBhbmQgdGhlIGh5cGhlbiwgJyArXG4gICAgICAgICAgJ2FuZCBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBTdWIgPSBmdW5jdGlvbiBWdWVDb21wb25lbnQgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX2luaXQob3B0aW9ucyk7XG4gICAgfTtcbiAgICBTdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpO1xuICAgIFN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWI7XG4gICAgU3ViLmNpZCA9IGNpZCsrO1xuICAgIFN1Yi5vcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgICAgU3VwZXIub3B0aW9ucyxcbiAgICAgIGV4dGVuZE9wdGlvbnNcbiAgICApO1xuICAgIFN1Ylsnc3VwZXInXSA9IFN1cGVyO1xuXG4gICAgLy8gRm9yIHByb3BzIGFuZCBjb21wdXRlZCBwcm9wZXJ0aWVzLCB3ZSBkZWZpbmUgdGhlIHByb3h5IGdldHRlcnMgb25cbiAgICAvLyB0aGUgVnVlIGluc3RhbmNlcyBhdCBleHRlbnNpb24gdGltZSwgb24gdGhlIGV4dGVuZGVkIHByb3RvdHlwZS4gVGhpc1xuICAgIC8vIGF2b2lkcyBPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbHMgZm9yIGVhY2ggaW5zdGFuY2UgY3JlYXRlZC5cbiAgICBpZiAoU3ViLm9wdGlvbnMucHJvcHMpIHtcbiAgICAgIGluaXRQcm9wcyQxKFN1Yik7XG4gICAgfVxuICAgIGlmIChTdWIub3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgaW5pdENvbXB1dGVkJDEoU3ViKTtcbiAgICB9XG5cbiAgICAvLyBhbGxvdyBmdXJ0aGVyIGV4dGVuc2lvbi9taXhpbi9wbHVnaW4gdXNhZ2VcbiAgICBTdWIuZXh0ZW5kID0gU3VwZXIuZXh0ZW5kO1xuICAgIFN1Yi5taXhpbiA9IFN1cGVyLm1peGluO1xuICAgIFN1Yi51c2UgPSBTdXBlci51c2U7XG5cbiAgICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXG4gICAgLy8gY2FuIGhhdmUgdGhlaXIgcHJpdmF0ZSBhc3NldHMgdG9vLlxuICAgIEFTU0VUX1RZUEVTLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIFN1Ylt0eXBlXSA9IFN1cGVyW3R5cGVdO1xuICAgIH0pO1xuICAgIC8vIGVuYWJsZSByZWN1cnNpdmUgc2VsZi1sb29rdXBcbiAgICBpZiAobmFtZSkge1xuICAgICAgU3ViLm9wdGlvbnMuY29tcG9uZW50c1tuYW1lXSA9IFN1YjtcbiAgICB9XG5cbiAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBzdXBlciBvcHRpb25zIGF0IGV4dGVuc2lvbiB0aW1lLlxuICAgIC8vIGxhdGVyIGF0IGluc3RhbnRpYXRpb24gd2UgY2FuIGNoZWNrIGlmIFN1cGVyJ3Mgb3B0aW9ucyBoYXZlXG4gICAgLy8gYmVlbiB1cGRhdGVkLlxuICAgIFN1Yi5zdXBlck9wdGlvbnMgPSBTdXBlci5vcHRpb25zO1xuICAgIFN1Yi5leHRlbmRPcHRpb25zID0gZXh0ZW5kT3B0aW9ucztcbiAgICBTdWIuc2VhbGVkT3B0aW9ucyA9IGV4dGVuZCh7fSwgU3ViLm9wdGlvbnMpO1xuXG4gICAgLy8gY2FjaGUgY29uc3RydWN0b3JcbiAgICBjYWNoZWRDdG9yc1tTdXBlcklkXSA9IFN1YjtcbiAgICByZXR1cm4gU3ViXG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRQcm9wcyQxIChDb21wKSB7XG4gIHZhciBwcm9wcyA9IENvbXAub3B0aW9ucy5wcm9wcztcbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgcHJveHkoQ29tcC5wcm90b3R5cGUsIFwiX3Byb3BzXCIsIGtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdENvbXB1dGVkJDEgKENvbXApIHtcbiAgdmFyIGNvbXB1dGVkID0gQ29tcC5vcHRpb25zLmNvbXB1dGVkO1xuICBmb3IgKHZhciBrZXkgaW4gY29tcHV0ZWQpIHtcbiAgICBkZWZpbmVDb21wdXRlZChDb21wLnByb3RvdHlwZSwga2V5LCBjb21wdXRlZFtrZXldKTtcbiAgfVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdEFzc2V0UmVnaXN0ZXJzIChWdWUpIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhc3NldCByZWdpc3RyYXRpb24gbWV0aG9kcy5cbiAgICovXG4gIEFTU0VUX1RZUEVTLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBWdWVbdHlwZV0gPSBmdW5jdGlvbiAoXG4gICAgICBpZCxcbiAgICAgIGRlZmluaXRpb25cbiAgICApIHtcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NvbXBvbmVudCcgJiYgY29uZmlnLmlzUmVzZXJ2ZWRUYWcoaWQpKSB7XG4gICAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgICAnRG8gbm90IHVzZSBidWlsdC1pbiBvciByZXNlcnZlZCBIVE1MIGVsZW1lbnRzIGFzIGNvbXBvbmVudCAnICtcbiAgICAgICAgICAgICAgJ2lkOiAnICsgaWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnY29tcG9uZW50JyAmJiBpc1BsYWluT2JqZWN0KGRlZmluaXRpb24pKSB7XG4gICAgICAgICAgZGVmaW5pdGlvbi5uYW1lID0gZGVmaW5pdGlvbi5uYW1lIHx8IGlkO1xuICAgICAgICAgIGRlZmluaXRpb24gPSB0aGlzLm9wdGlvbnMuX2Jhc2UuZXh0ZW5kKGRlZmluaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnZGlyZWN0aXZlJyAmJiB0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGRlZmluaXRpb24gPSB7IGJpbmQ6IGRlZmluaXRpb24sIHVwZGF0ZTogZGVmaW5pdGlvbiB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVtpZF0gPSBkZWZpbml0aW9uO1xuICAgICAgICByZXR1cm4gZGVmaW5pdGlvblxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuXG4vKiAgKi9cblxudmFyIHBhdHRlcm5UeXBlcyA9IFtTdHJpbmcsIFJlZ0V4cF07XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUgKG9wdHMpIHtcbiAgcmV0dXJuIG9wdHMgJiYgKG9wdHMuQ3Rvci5vcHRpb25zLm5hbWUgfHwgb3B0cy50YWcpXG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKHBhdHRlcm4sIG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXR0ZXJuLnNwbGl0KCcsJykuaW5kZXhPZihuYW1lKSA+IC0xXG4gIH0gZWxzZSBpZiAoaXNSZWdFeHAocGF0dGVybikpIHtcbiAgICByZXR1cm4gcGF0dGVybi50ZXN0KG5hbWUpXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIHBydW5lQ2FjaGUgKGNhY2hlLCBjdXJyZW50LCBmaWx0ZXIpIHtcbiAgZm9yICh2YXIga2V5IGluIGNhY2hlKSB7XG4gICAgdmFyIGNhY2hlZE5vZGUgPSBjYWNoZVtrZXldO1xuICAgIGlmIChjYWNoZWROb2RlKSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY2FjaGVkTm9kZS5jb21wb25lbnRPcHRpb25zKTtcbiAgICAgIGlmIChuYW1lICYmICFmaWx0ZXIobmFtZSkpIHtcbiAgICAgICAgaWYgKGNhY2hlZE5vZGUgIT09IGN1cnJlbnQpIHtcbiAgICAgICAgICBwcnVuZUNhY2hlRW50cnkoY2FjaGVkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FjaGVba2V5XSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBydW5lQ2FjaGVFbnRyeSAodm5vZGUpIHtcbiAgaWYgKHZub2RlKSB7XG4gICAgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuJGRlc3Ryb3koKTtcbiAgfVxufVxuXG52YXIgS2VlcEFsaXZlID0ge1xuICBuYW1lOiAna2VlcC1hbGl2ZScsXG4gIGFic3RyYWN0OiB0cnVlLFxuXG4gIHByb3BzOiB7XG4gICAgaW5jbHVkZTogcGF0dGVyblR5cGVzLFxuICAgIGV4Y2x1ZGU6IHBhdHRlcm5UeXBlc1xuICB9LFxuXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQgKCkge1xuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9LFxuXG4gIGRlc3Ryb3llZDogZnVuY3Rpb24gZGVzdHJveWVkICgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzJDEuY2FjaGUpIHtcbiAgICAgIHBydW5lQ2FjaGVFbnRyeSh0aGlzJDEuY2FjaGVba2V5XSk7XG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaW5jbHVkZTogZnVuY3Rpb24gaW5jbHVkZSAodmFsKSB7XG4gICAgICBwcnVuZUNhY2hlKHRoaXMuY2FjaGUsIHRoaXMuX3Zub2RlLCBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gbWF0Y2hlcyh2YWwsIG5hbWUpOyB9KTtcbiAgICB9LFxuICAgIGV4Y2x1ZGU6IGZ1bmN0aW9uIGV4Y2x1ZGUgKHZhbCkge1xuICAgICAgcHJ1bmVDYWNoZSh0aGlzLmNhY2hlLCB0aGlzLl92bm9kZSwgZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuICFtYXRjaGVzKHZhbCwgbmFtZSk7IH0pO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlciAoKSB7XG4gICAgdmFyIHZub2RlID0gZ2V0Rmlyc3RDb21wb25lbnRDaGlsZCh0aGlzLiRzbG90cy5kZWZhdWx0KTtcbiAgICB2YXIgY29tcG9uZW50T3B0aW9ucyA9IHZub2RlICYmIHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XG4gICAgaWYgKGNvbXBvbmVudE9wdGlvbnMpIHtcbiAgICAgIC8vIGNoZWNrIHBhdHRlcm5cbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShjb21wb25lbnRPcHRpb25zKTtcbiAgICAgIGlmIChuYW1lICYmIChcbiAgICAgICAgKHRoaXMuaW5jbHVkZSAmJiAhbWF0Y2hlcyh0aGlzLmluY2x1ZGUsIG5hbWUpKSB8fFxuICAgICAgICAodGhpcy5leGNsdWRlICYmIG1hdGNoZXModGhpcy5leGNsdWRlLCBuYW1lKSlcbiAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuIHZub2RlXG4gICAgICB9XG4gICAgICB2YXIga2V5ID0gdm5vZGUua2V5ID09IG51bGxcbiAgICAgICAgLy8gc2FtZSBjb25zdHJ1Y3RvciBtYXkgZ2V0IHJlZ2lzdGVyZWQgYXMgZGlmZmVyZW50IGxvY2FsIGNvbXBvbmVudHNcbiAgICAgICAgLy8gc28gY2lkIGFsb25lIGlzIG5vdCBlbm91Z2ggKCMzMjY5KVxuICAgICAgICA/IGNvbXBvbmVudE9wdGlvbnMuQ3Rvci5jaWQgKyAoY29tcG9uZW50T3B0aW9ucy50YWcgPyAoXCI6OlwiICsgKGNvbXBvbmVudE9wdGlvbnMudGFnKSkgOiAnJylcbiAgICAgICAgOiB2bm9kZS5rZXk7XG4gICAgICBpZiAodGhpcy5jYWNoZVtrZXldKSB7XG4gICAgICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gdGhpcy5jYWNoZVtrZXldLmNvbXBvbmVudEluc3RhbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldID0gdm5vZGU7XG4gICAgICB9XG4gICAgICB2bm9kZS5kYXRhLmtlZXBBbGl2ZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB2bm9kZVxuICB9XG59O1xuXG52YXIgYnVpbHRJbkNvbXBvbmVudHMgPSB7XG4gIEtlZXBBbGl2ZTogS2VlcEFsaXZlXG59O1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdEdsb2JhbEFQSSAoVnVlKSB7XG4gIC8vIGNvbmZpZ1xuICB2YXIgY29uZmlnRGVmID0ge307XG4gIGNvbmZpZ0RlZi5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb25maWc7IH07XG4gIHtcbiAgICBjb25maWdEZWYuc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2FybihcbiAgICAgICAgJ0RvIG5vdCByZXBsYWNlIHRoZSBWdWUuY29uZmlnIG9iamVjdCwgc2V0IGluZGl2aWR1YWwgZmllbGRzIGluc3RlYWQuJ1xuICAgICAgKTtcbiAgICB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUsICdjb25maWcnLCBjb25maWdEZWYpO1xuXG4gIC8vIGV4cG9zZWQgdXRpbCBtZXRob2RzLlxuICAvLyBOT1RFOiB0aGVzZSBhcmUgbm90IGNvbnNpZGVyZWQgcGFydCBvZiB0aGUgcHVibGljIEFQSSAtIGF2b2lkIHJlbHlpbmcgb25cbiAgLy8gdGhlbSB1bmxlc3MgeW91IGFyZSBhd2FyZSBvZiB0aGUgcmlzay5cbiAgVnVlLnV0aWwgPSB7XG4gICAgd2Fybjogd2FybixcbiAgICBleHRlbmQ6IGV4dGVuZCxcbiAgICBtZXJnZU9wdGlvbnM6IG1lcmdlT3B0aW9ucyxcbiAgICBkZWZpbmVSZWFjdGl2ZTogZGVmaW5lUmVhY3RpdmUkJDFcbiAgfTtcblxuICBWdWUuc2V0ID0gc2V0O1xuICBWdWUuZGVsZXRlID0gZGVsO1xuICBWdWUubmV4dFRpY2sgPSBuZXh0VGljaztcblxuICBWdWUub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIEFTU0VUX1RZUEVTLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBWdWUub3B0aW9uc1t0eXBlICsgJ3MnXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH0pO1xuXG4gIC8vIHRoaXMgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgXCJiYXNlXCIgY29uc3RydWN0b3IgdG8gZXh0ZW5kIGFsbCBwbGFpbi1vYmplY3RcbiAgLy8gY29tcG9uZW50cyB3aXRoIGluIFdlZXgncyBtdWx0aS1pbnN0YW5jZSBzY2VuYXJpb3MuXG4gIFZ1ZS5vcHRpb25zLl9iYXNlID0gVnVlO1xuXG4gIGV4dGVuZChWdWUub3B0aW9ucy5jb21wb25lbnRzLCBidWlsdEluQ29tcG9uZW50cyk7XG5cbiAgaW5pdFVzZShWdWUpO1xuICBpbml0TWl4aW4kMShWdWUpO1xuICBpbml0RXh0ZW5kKFZ1ZSk7XG4gIGluaXRBc3NldFJlZ2lzdGVycyhWdWUpO1xufVxuXG5pbml0R2xvYmFsQVBJKFZ1ZSQzKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFZ1ZSQzLnByb3RvdHlwZSwgJyRpc1NlcnZlcicsIHtcbiAgZ2V0OiBpc1NlcnZlclJlbmRlcmluZ1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUkMy5wcm90b3R5cGUsICckc3NyQ29udGV4dCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuIHRoaXMuJHZub2RlLnNzckNvbnRleHRcbiAgfVxufSk7XG5cblZ1ZSQzLnZlcnNpb24gPSAnMi4zLjMnO1xuXG4vKiAgKi9cblxuLy8gdGhlc2UgYXJlIHJlc2VydmVkIGZvciB3ZWIgYmVjYXVzZSB0aGV5IGFyZSBkaXJlY3RseSBjb21waWxlZCBhd2F5XG4vLyBkdXJpbmcgdGVtcGxhdGUgY29tcGlsYXRpb25cbnZhciBpc1Jlc2VydmVkQXR0ciA9IG1ha2VNYXAoJ3N0eWxlLGNsYXNzJyk7XG5cbi8vIGF0dHJpYnV0ZXMgdGhhdCBzaG91bGQgYmUgdXNpbmcgcHJvcHMgZm9yIGJpbmRpbmdcbnZhciBhY2NlcHRWYWx1ZSA9IG1ha2VNYXAoJ2lucHV0LHRleHRhcmVhLG9wdGlvbixzZWxlY3QnKTtcbnZhciBtdXN0VXNlUHJvcCA9IGZ1bmN0aW9uICh0YWcsIHR5cGUsIGF0dHIpIHtcbiAgcmV0dXJuIChcbiAgICAoYXR0ciA9PT0gJ3ZhbHVlJyAmJiBhY2NlcHRWYWx1ZSh0YWcpKSAmJiB0eXBlICE9PSAnYnV0dG9uJyB8fFxuICAgIChhdHRyID09PSAnc2VsZWN0ZWQnICYmIHRhZyA9PT0gJ29wdGlvbicpIHx8XG4gICAgKGF0dHIgPT09ICdjaGVja2VkJyAmJiB0YWcgPT09ICdpbnB1dCcpIHx8XG4gICAgKGF0dHIgPT09ICdtdXRlZCcgJiYgdGFnID09PSAndmlkZW8nKVxuICApXG59O1xuXG52YXIgaXNFbnVtZXJhdGVkQXR0ciA9IG1ha2VNYXAoJ2NvbnRlbnRlZGl0YWJsZSxkcmFnZ2FibGUsc3BlbGxjaGVjaycpO1xuXG52YXIgaXNCb29sZWFuQXR0ciA9IG1ha2VNYXAoXG4gICdhbGxvd2Z1bGxzY3JlZW4sYXN5bmMsYXV0b2ZvY3VzLGF1dG9wbGF5LGNoZWNrZWQsY29tcGFjdCxjb250cm9scyxkZWNsYXJlLCcgK1xuICAnZGVmYXVsdCxkZWZhdWx0Y2hlY2tlZCxkZWZhdWx0bXV0ZWQsZGVmYXVsdHNlbGVjdGVkLGRlZmVyLGRpc2FibGVkLCcgK1xuICAnZW5hYmxlZCxmb3Jtbm92YWxpZGF0ZSxoaWRkZW4saW5kZXRlcm1pbmF0ZSxpbmVydCxpc21hcCxpdGVtc2NvcGUsbG9vcCxtdWx0aXBsZSwnICtcbiAgJ211dGVkLG5vaHJlZixub3Jlc2l6ZSxub3NoYWRlLG5vdmFsaWRhdGUsbm93cmFwLG9wZW4scGF1c2VvbmV4aXQscmVhZG9ubHksJyArXG4gICdyZXF1aXJlZCxyZXZlcnNlZCxzY29wZWQsc2VhbWxlc3Msc2VsZWN0ZWQsc29ydGFibGUsdHJhbnNsYXRlLCcgK1xuICAndHJ1ZXNwZWVkLHR5cGVtdXN0bWF0Y2gsdmlzaWJsZSdcbik7XG5cbnZhciB4bGlua05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuXG52YXIgaXNYbGluayA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBuYW1lLmNoYXJBdCg1KSA9PT0gJzonICYmIG5hbWUuc2xpY2UoMCwgNSkgPT09ICd4bGluaydcbn07XG5cbnZhciBnZXRYbGlua1Byb3AgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gaXNYbGluayhuYW1lKSA/IG5hbWUuc2xpY2UoNiwgbmFtZS5sZW5ndGgpIDogJydcbn07XG5cbnZhciBpc0ZhbHN5QXR0clZhbHVlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gdmFsID09IG51bGwgfHwgdmFsID09PSBmYWxzZVxufTtcblxuLyogICovXG5cbmZ1bmN0aW9uIGdlbkNsYXNzRm9yVm5vZGUgKHZub2RlKSB7XG4gIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgdmFyIHBhcmVudE5vZGUgPSB2bm9kZTtcbiAgdmFyIGNoaWxkTm9kZSA9IHZub2RlO1xuICB3aGlsZSAoaXNEZWYoY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xuICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XG4gICAgaWYgKGNoaWxkTm9kZS5kYXRhKSB7XG4gICAgICBkYXRhID0gbWVyZ2VDbGFzc0RhdGEoY2hpbGROb2RlLmRhdGEsIGRhdGEpO1xuICAgIH1cbiAgfVxuICB3aGlsZSAoaXNEZWYocGFyZW50Tm9kZSA9IHBhcmVudE5vZGUucGFyZW50KSkge1xuICAgIGlmIChwYXJlbnROb2RlLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBtZXJnZUNsYXNzRGF0YShkYXRhLCBwYXJlbnROb2RlLmRhdGEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZ2VuQ2xhc3NGcm9tRGF0YShkYXRhKVxufVxuXG5mdW5jdGlvbiBtZXJnZUNsYXNzRGF0YSAoY2hpbGQsIHBhcmVudCkge1xuICByZXR1cm4ge1xuICAgIHN0YXRpY0NsYXNzOiBjb25jYXQoY2hpbGQuc3RhdGljQ2xhc3MsIHBhcmVudC5zdGF0aWNDbGFzcyksXG4gICAgY2xhc3M6IGlzRGVmKGNoaWxkLmNsYXNzKVxuICAgICAgPyBbY2hpbGQuY2xhc3MsIHBhcmVudC5jbGFzc11cbiAgICAgIDogcGFyZW50LmNsYXNzXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuQ2xhc3NGcm9tRGF0YSAoZGF0YSkge1xuICB2YXIgZHluYW1pY0NsYXNzID0gZGF0YS5jbGFzcztcbiAgdmFyIHN0YXRpY0NsYXNzID0gZGF0YS5zdGF0aWNDbGFzcztcbiAgaWYgKGlzRGVmKHN0YXRpY0NsYXNzKSB8fCBpc0RlZihkeW5hbWljQ2xhc3MpKSB7XG4gICAgcmV0dXJuIGNvbmNhdChzdGF0aWNDbGFzcywgc3RyaW5naWZ5Q2xhc3MoZHluYW1pY0NsYXNzKSlcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICByZXR1cm4gJydcbn1cblxuZnVuY3Rpb24gY29uY2F0IChhLCBiKSB7XG4gIHJldHVybiBhID8gYiA/IChhICsgJyAnICsgYikgOiBhIDogKGIgfHwgJycpXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUNsYXNzICh2YWx1ZSkge1xuICBpZiAoaXNVbmRlZih2YWx1ZSkpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHZhciByZXMgPSAnJztcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFyIHN0cmluZ2lmaWVkO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaXNEZWYodmFsdWVbaV0pKSB7XG4gICAgICAgIGlmIChpc0RlZihzdHJpbmdpZmllZCA9IHN0cmluZ2lmeUNsYXNzKHZhbHVlW2ldKSkgJiYgc3RyaW5naWZpZWQgIT09ICcnKSB7XG4gICAgICAgICAgcmVzICs9IHN0cmluZ2lmaWVkICsgJyAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXMuc2xpY2UoMCwgLTEpXG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlW2tleV0pIHsgcmVzICs9IGtleSArICcgJzsgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbnZhciBuYW1lc3BhY2VNYXAgPSB7XG4gIHN2ZzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyxcbiAgbWF0aDogJ2h0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUwnXG59O1xuXG52YXIgaXNIVE1MVGFnID0gbWFrZU1hcChcbiAgJ2h0bWwsYm9keSxiYXNlLGhlYWQsbGluayxtZXRhLHN0eWxlLHRpdGxlLCcgK1xuICAnYWRkcmVzcyxhcnRpY2xlLGFzaWRlLGZvb3RlcixoZWFkZXIsaDEsaDIsaDMsaDQsaDUsaDYsaGdyb3VwLG5hdixzZWN0aW9uLCcgK1xuICAnZGl2LGRkLGRsLGR0LGZpZ2NhcHRpb24sZmlndXJlLGhyLGltZyxsaSxtYWluLG9sLHAscHJlLHVsLCcgK1xuICAnYSxiLGFiYnIsYmRpLGJkbyxicixjaXRlLGNvZGUsZGF0YSxkZm4sZW0saSxrYmQsbWFyayxxLHJwLHJ0LHJ0YyxydWJ5LCcgK1xuICAncyxzYW1wLHNtYWxsLHNwYW4sc3Ryb25nLHN1YixzdXAsdGltZSx1LHZhcix3YnIsYXJlYSxhdWRpbyxtYXAsdHJhY2ssdmlkZW8sJyArXG4gICdlbWJlZCxvYmplY3QscGFyYW0sc291cmNlLGNhbnZhcyxzY3JpcHQsbm9zY3JpcHQsZGVsLGlucywnICtcbiAgJ2NhcHRpb24sY29sLGNvbGdyb3VwLHRhYmxlLHRoZWFkLHRib2R5LHRkLHRoLHRyLCcgK1xuICAnYnV0dG9uLGRhdGFsaXN0LGZpZWxkc2V0LGZvcm0saW5wdXQsbGFiZWwsbGVnZW5kLG1ldGVyLG9wdGdyb3VwLG9wdGlvbiwnICtcbiAgJ291dHB1dCxwcm9ncmVzcyxzZWxlY3QsdGV4dGFyZWEsJyArXG4gICdkZXRhaWxzLGRpYWxvZyxtZW51LG1lbnVpdGVtLHN1bW1hcnksJyArXG4gICdjb250ZW50LGVsZW1lbnQsc2hhZG93LHRlbXBsYXRlJ1xuKTtcblxuLy8gdGhpcyBtYXAgaXMgaW50ZW50aW9uYWxseSBzZWxlY3RpdmUsIG9ubHkgY292ZXJpbmcgU1ZHIGVsZW1lbnRzIHRoYXQgbWF5XG4vLyBjb250YWluIGNoaWxkIGVsZW1lbnRzLlxudmFyIGlzU1ZHID0gbWFrZU1hcChcbiAgJ3N2ZyxhbmltYXRlLGNpcmNsZSxjbGlwcGF0aCxjdXJzb3IsZGVmcyxkZXNjLGVsbGlwc2UsZmlsdGVyLGZvbnQtZmFjZSwnICtcbiAgJ2ZvcmVpZ25PYmplY3QsZyxnbHlwaCxpbWFnZSxsaW5lLG1hcmtlcixtYXNrLG1pc3NpbmctZ2x5cGgscGF0aCxwYXR0ZXJuLCcgK1xuICAncG9seWdvbixwb2x5bGluZSxyZWN0LHN3aXRjaCxzeW1ib2wsdGV4dCx0ZXh0cGF0aCx0c3Bhbix1c2UsdmlldycsXG4gIHRydWVcbik7XG5cbnZhciBpc1ByZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHsgcmV0dXJuIHRhZyA9PT0gJ3ByZSc7IH07XG5cbnZhciBpc1Jlc2VydmVkVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICByZXR1cm4gaXNIVE1MVGFnKHRhZykgfHwgaXNTVkcodGFnKVxufTtcblxuZnVuY3Rpb24gZ2V0VGFnTmFtZXNwYWNlICh0YWcpIHtcbiAgaWYgKGlzU1ZHKHRhZykpIHtcbiAgICByZXR1cm4gJ3N2ZydcbiAgfVxuICAvLyBiYXNpYyBzdXBwb3J0IGZvciBNYXRoTUxcbiAgLy8gbm90ZSBpdCBkb2Vzbid0IHN1cHBvcnQgb3RoZXIgTWF0aE1MIGVsZW1lbnRzIGJlaW5nIGNvbXBvbmVudCByb290c1xuICBpZiAodGFnID09PSAnbWF0aCcpIHtcbiAgICByZXR1cm4gJ21hdGgnXG4gIH1cbn1cblxudmFyIHVua25vd25FbGVtZW50Q2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuZnVuY3Rpb24gaXNVbmtub3duRWxlbWVudCAodGFnKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIWluQnJvd3Nlcikge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgaWYgKGlzUmVzZXJ2ZWRUYWcodGFnKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHRhZyA9IHRhZy50b0xvd2VyQ2FzZSgpO1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHVua25vd25FbGVtZW50Q2FjaGVbdGFnXVxuICB9XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgaWYgKHRhZy5pbmRleE9mKCctJykgPiAtMSkge1xuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI4MjEwMzY0LzEwNzAyNDRcbiAgICByZXR1cm4gKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSA9IChcbiAgICAgIGVsLmNvbnN0cnVjdG9yID09PSB3aW5kb3cuSFRNTFVua25vd25FbGVtZW50IHx8XG4gICAgICBlbC5jb25zdHJ1Y3RvciA9PT0gd2luZG93LkhUTUxFbGVtZW50XG4gICAgKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKHVua25vd25FbGVtZW50Q2FjaGVbdGFnXSA9IC9IVE1MVW5rbm93bkVsZW1lbnQvLnRlc3QoZWwudG9TdHJpbmcoKSkpXG4gIH1cbn1cblxuLyogICovXG5cbi8qKlxuICogUXVlcnkgYW4gZWxlbWVudCBzZWxlY3RvciBpZiBpdCdzIG5vdCBhbiBlbGVtZW50IGFscmVhZHkuXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5IChlbCkge1xuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzZWxlY3RlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIGlmICghc2VsZWN0ZWQpIHtcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAgICdDYW5ub3QgZmluZCBlbGVtZW50OiAnICsgZWxcbiAgICAgICk7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdGVkXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVsXG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQkMSAodGFnTmFtZSwgdm5vZGUpIHtcbiAgdmFyIGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gIGlmICh0YWdOYW1lICE9PSAnc2VsZWN0Jykge1xuICAgIHJldHVybiBlbG1cbiAgfVxuICAvLyBmYWxzZSBvciBudWxsIHdpbGwgcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgYnV0IHVuZGVmaW5lZCB3aWxsIG5vdFxuICBpZiAodm5vZGUuZGF0YSAmJiB2bm9kZS5kYXRhLmF0dHJzICYmIHZub2RlLmRhdGEuYXR0cnMubXVsdGlwbGUgIT09IHVuZGVmaW5lZCkge1xuICAgIGVsbS5zZXRBdHRyaWJ1dGUoJ211bHRpcGxlJywgJ211bHRpcGxlJyk7XG4gIH1cbiAgcmV0dXJuIGVsbVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMgKG5hbWVzcGFjZSwgdGFnTmFtZSkge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZU1hcFtuYW1lc3BhY2VdLCB0YWdOYW1lKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVUZXh0Tm9kZSAodGV4dCkge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dClcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tbWVudCAodGV4dCkge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCh0ZXh0KVxufVxuXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUgKHBhcmVudE5vZGUsIG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpIHtcbiAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkIChub2RlLCBjaGlsZCkge1xuICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kQ2hpbGQgKG5vZGUsIGNoaWxkKSB7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGQpO1xufVxuXG5mdW5jdGlvbiBwYXJlbnROb2RlIChub2RlKSB7XG4gIHJldHVybiBub2RlLnBhcmVudE5vZGVcbn1cblxuZnVuY3Rpb24gbmV4dFNpYmxpbmcgKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUubmV4dFNpYmxpbmdcbn1cblxuZnVuY3Rpb24gdGFnTmFtZSAobm9kZSkge1xuICByZXR1cm4gbm9kZS50YWdOYW1lXG59XG5cbmZ1bmN0aW9uIHNldFRleHRDb250ZW50IChub2RlLCB0ZXh0KSB7XG4gIG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xufVxuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUgKG5vZGUsIGtleSwgdmFsKSB7XG4gIG5vZGUuc2V0QXR0cmlidXRlKGtleSwgdmFsKTtcbn1cblxuXG52YXIgbm9kZU9wcyA9IE9iamVjdC5mcmVlemUoe1xuXHRjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50JDEsXG5cdGNyZWF0ZUVsZW1lbnROUzogY3JlYXRlRWxlbWVudE5TLFxuXHRjcmVhdGVUZXh0Tm9kZTogY3JlYXRlVGV4dE5vZGUsXG5cdGNyZWF0ZUNvbW1lbnQ6IGNyZWF0ZUNvbW1lbnQsXG5cdGluc2VydEJlZm9yZTogaW5zZXJ0QmVmb3JlLFxuXHRyZW1vdmVDaGlsZDogcmVtb3ZlQ2hpbGQsXG5cdGFwcGVuZENoaWxkOiBhcHBlbmRDaGlsZCxcblx0cGFyZW50Tm9kZTogcGFyZW50Tm9kZSxcblx0bmV4dFNpYmxpbmc6IG5leHRTaWJsaW5nLFxuXHR0YWdOYW1lOiB0YWdOYW1lLFxuXHRzZXRUZXh0Q29udGVudDogc2V0VGV4dENvbnRlbnQsXG5cdHNldEF0dHJpYnV0ZTogc2V0QXR0cmlidXRlXG59KTtcblxuLyogICovXG5cbnZhciByZWYgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlIChfLCB2bm9kZSkge1xuICAgIHJlZ2lzdGVyUmVmKHZub2RlKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUgKG9sZFZub2RlLCB2bm9kZSkge1xuICAgIGlmIChvbGRWbm9kZS5kYXRhLnJlZiAhPT0gdm5vZGUuZGF0YS5yZWYpIHtcbiAgICAgIHJlZ2lzdGVyUmVmKG9sZFZub2RlLCB0cnVlKTtcbiAgICAgIHJlZ2lzdGVyUmVmKHZub2RlKTtcbiAgICB9XG4gIH0sXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3kgKHZub2RlKSB7XG4gICAgcmVnaXN0ZXJSZWYodm5vZGUsIHRydWUpO1xuICB9XG59O1xuXG5mdW5jdGlvbiByZWdpc3RlclJlZiAodm5vZGUsIGlzUmVtb3ZhbCkge1xuICB2YXIga2V5ID0gdm5vZGUuZGF0YS5yZWY7XG4gIGlmICgha2V5KSB7IHJldHVybiB9XG5cbiAgdmFyIHZtID0gdm5vZGUuY29udGV4dDtcbiAgdmFyIHJlZiA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlIHx8IHZub2RlLmVsbTtcbiAgdmFyIHJlZnMgPSB2bS4kcmVmcztcbiAgaWYgKGlzUmVtb3ZhbCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZnNba2V5XSkpIHtcbiAgICAgIHJlbW92ZShyZWZzW2tleV0sIHJlZik7XG4gICAgfSBlbHNlIGlmIChyZWZzW2tleV0gPT09IHJlZikge1xuICAgICAgcmVmc1trZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAodm5vZGUuZGF0YS5yZWZJbkZvcikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVmc1trZXldKSAmJiByZWZzW2tleV0uaW5kZXhPZihyZWYpIDwgMCkge1xuICAgICAgICByZWZzW2tleV0ucHVzaChyZWYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmc1trZXldID0gW3JlZl07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZnNba2V5XSA9IHJlZjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBWaXJ0dWFsIERPTSBwYXRjaGluZyBhbGdvcml0aG0gYmFzZWQgb24gU25hYmJkb20gYnlcbiAqIFNpbW9uIEZyaWlzIFZpbmR1bSAoQHBhbGRlcGluZClcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3BhbGRlcGluZC9zbmFiYmRvbS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKlxuICogbW9kaWZpZWQgYnkgRXZhbiBZb3UgKEB5eXg5OTA4MDMpXG4gKlxuXG4vKlxuICogTm90IHR5cGUtY2hlY2tpbmcgdGhpcyBiZWNhdXNlIHRoaXMgZmlsZSBpcyBwZXJmLWNyaXRpY2FsIGFuZCB0aGUgY29zdFxuICogb2YgbWFraW5nIGZsb3cgdW5kZXJzdGFuZCBpdCBpcyBub3Qgd29ydGggaXQuXG4gKi9cblxudmFyIGVtcHR5Tm9kZSA9IG5ldyBWTm9kZSgnJywge30sIFtdKTtcblxudmFyIGhvb2tzID0gWydjcmVhdGUnLCAnYWN0aXZhdGUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdkZXN0cm95J107XG5cbmZ1bmN0aW9uIHNhbWVWbm9kZSAoYSwgYikge1xuICByZXR1cm4gKFxuICAgIGEua2V5ID09PSBiLmtleSAmJlxuICAgIGEudGFnID09PSBiLnRhZyAmJlxuICAgIGEuaXNDb21tZW50ID09PSBiLmlzQ29tbWVudCAmJlxuICAgIGlzRGVmKGEuZGF0YSkgPT09IGlzRGVmKGIuZGF0YSkgJiZcbiAgICBzYW1lSW5wdXRUeXBlKGEsIGIpXG4gIClcbn1cblxuLy8gU29tZSBicm93c2VycyBkbyBub3Qgc3VwcG9ydCBkeW5hbWljYWxseSBjaGFuZ2luZyB0eXBlIGZvciA8aW5wdXQ+XG4vLyBzbyB0aGV5IG5lZWQgdG8gYmUgdHJlYXRlZCBhcyBkaWZmZXJlbnQgbm9kZXNcbmZ1bmN0aW9uIHNhbWVJbnB1dFR5cGUgKGEsIGIpIHtcbiAgaWYgKGEudGFnICE9PSAnaW5wdXQnKSB7IHJldHVybiB0cnVlIH1cbiAgdmFyIGk7XG4gIHZhciB0eXBlQSA9IGlzRGVmKGkgPSBhLmRhdGEpICYmIGlzRGVmKGkgPSBpLmF0dHJzKSAmJiBpLnR5cGU7XG4gIHZhciB0eXBlQiA9IGlzRGVmKGkgPSBiLmRhdGEpICYmIGlzRGVmKGkgPSBpLmF0dHJzKSAmJiBpLnR5cGU7XG4gIHJldHVybiB0eXBlQSA9PT0gdHlwZUJcbn1cblxuZnVuY3Rpb24gY3JlYXRlS2V5VG9PbGRJZHggKGNoaWxkcmVuLCBiZWdpbklkeCwgZW5kSWR4KSB7XG4gIHZhciBpLCBrZXk7XG4gIHZhciBtYXAgPSB7fTtcbiAgZm9yIChpID0gYmVnaW5JZHg7IGkgPD0gZW5kSWR4OyArK2kpIHtcbiAgICBrZXkgPSBjaGlsZHJlbltpXS5rZXk7XG4gICAgaWYgKGlzRGVmKGtleSkpIHsgbWFwW2tleV0gPSBpOyB9XG4gIH1cbiAgcmV0dXJuIG1hcFxufVxuXG5mdW5jdGlvbiBjcmVhdGVQYXRjaEZ1bmN0aW9uIChiYWNrZW5kKSB7XG4gIHZhciBpLCBqO1xuICB2YXIgY2JzID0ge307XG5cbiAgdmFyIG1vZHVsZXMgPSBiYWNrZW5kLm1vZHVsZXM7XG4gIHZhciBub2RlT3BzID0gYmFja2VuZC5ub2RlT3BzO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7ICsraSkge1xuICAgIGNic1tob29rc1tpXV0gPSBbXTtcbiAgICBmb3IgKGogPSAwOyBqIDwgbW9kdWxlcy5sZW5ndGg7ICsraikge1xuICAgICAgaWYgKGlzRGVmKG1vZHVsZXNbal1baG9va3NbaV1dKSkge1xuICAgICAgICBjYnNbaG9va3NbaV1dLnB1c2gobW9kdWxlc1tqXVtob29rc1tpXV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtcHR5Tm9kZUF0IChlbG0pIHtcbiAgICByZXR1cm4gbmV3IFZOb2RlKG5vZGVPcHMudGFnTmFtZShlbG0pLnRvTG93ZXJDYXNlKCksIHt9LCBbXSwgdW5kZWZpbmVkLCBlbG0pXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSbUNiIChjaGlsZEVsbSwgbGlzdGVuZXJzKSB7XG4gICAgZnVuY3Rpb24gcmVtb3ZlJCQxICgpIHtcbiAgICAgIGlmICgtLXJlbW92ZSQkMS5saXN0ZW5lcnMgPT09IDApIHtcbiAgICAgICAgcmVtb3ZlTm9kZShjaGlsZEVsbSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlbW92ZSQkMS5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XG4gICAgcmV0dXJuIHJlbW92ZSQkMVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlTm9kZSAoZWwpIHtcbiAgICB2YXIgcGFyZW50ID0gbm9kZU9wcy5wYXJlbnROb2RlKGVsKTtcbiAgICAvLyBlbGVtZW50IG1heSBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkIGR1ZSB0byB2LWh0bWwgLyB2LXRleHRcbiAgICBpZiAoaXNEZWYocGFyZW50KSkge1xuICAgICAgbm9kZU9wcy5yZW1vdmVDaGlsZChwYXJlbnQsIGVsKTtcbiAgICB9XG4gIH1cblxuICB2YXIgaW5QcmUgPSAwO1xuICBmdW5jdGlvbiBjcmVhdGVFbG0gKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgcmVmRWxtLCBuZXN0ZWQpIHtcbiAgICB2bm9kZS5pc1Jvb3RJbnNlcnQgPSAhbmVzdGVkOyAvLyBmb3IgdHJhbnNpdGlvbiBlbnRlciBjaGVja1xuICAgIGlmIChjcmVhdGVDb21wb25lbnQodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgdmFyIHRhZyA9IHZub2RlLnRhZztcbiAgICBpZiAoaXNEZWYodGFnKSkge1xuICAgICAge1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnByZSkge1xuICAgICAgICAgIGluUHJlKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICFpblByZSAmJlxuICAgICAgICAgICF2bm9kZS5ucyAmJlxuICAgICAgICAgICEoY29uZmlnLmlnbm9yZWRFbGVtZW50cy5sZW5ndGggJiYgY29uZmlnLmlnbm9yZWRFbGVtZW50cy5pbmRleE9mKHRhZykgPiAtMSkgJiZcbiAgICAgICAgICBjb25maWcuaXNVbmtub3duRWxlbWVudCh0YWcpXG4gICAgICAgICkge1xuICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAnVW5rbm93biBjdXN0b20gZWxlbWVudDogPCcgKyB0YWcgKyAnPiAtIGRpZCB5b3UgJyArXG4gICAgICAgICAgICAncmVnaXN0ZXIgdGhlIGNvbXBvbmVudCBjb3JyZWN0bHk/IEZvciByZWN1cnNpdmUgY29tcG9uZW50cywgJyArXG4gICAgICAgICAgICAnbWFrZSBzdXJlIHRvIHByb3ZpZGUgdGhlIFwibmFtZVwiIG9wdGlvbi4nLFxuICAgICAgICAgICAgdm5vZGUuY29udGV4dFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZub2RlLmVsbSA9IHZub2RlLm5zXG4gICAgICAgID8gbm9kZU9wcy5jcmVhdGVFbGVtZW50TlModm5vZGUubnMsIHRhZylcbiAgICAgICAgOiBub2RlT3BzLmNyZWF0ZUVsZW1lbnQodGFnLCB2bm9kZSk7XG4gICAgICBzZXRTY29wZSh2bm9kZSk7XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAge1xuICAgICAgICBjcmVhdGVDaGlsZHJlbih2bm9kZSwgY2hpbGRyZW4sIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgIGlmIChpc0RlZihkYXRhKSkge1xuICAgICAgICAgIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICB9XG4gICAgICAgIGluc2VydChwYXJlbnRFbG0sIHZub2RlLmVsbSwgcmVmRWxtKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGRhdGEgJiYgZGF0YS5wcmUpIHtcbiAgICAgICAgaW5QcmUtLTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzVHJ1ZSh2bm9kZS5pc0NvbW1lbnQpKSB7XG4gICAgICB2bm9kZS5lbG0gPSBub2RlT3BzLmNyZWF0ZUNvbW1lbnQodm5vZGUudGV4dCk7XG4gICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZub2RlLmVsbSA9IG5vZGVPcHMuY3JlYXRlVGV4dE5vZGUodm5vZGUudGV4dCk7XG4gICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50ICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSkge1xuICAgIHZhciBpID0gdm5vZGUuZGF0YTtcbiAgICBpZiAoaXNEZWYoaSkpIHtcbiAgICAgIHZhciBpc1JlYWN0aXZhdGVkID0gaXNEZWYodm5vZGUuY29tcG9uZW50SW5zdGFuY2UpICYmIGkua2VlcEFsaXZlO1xuICAgICAgaWYgKGlzRGVmKGkgPSBpLmhvb2spICYmIGlzRGVmKGkgPSBpLmluaXQpKSB7XG4gICAgICAgIGkodm5vZGUsIGZhbHNlIC8qIGh5ZHJhdGluZyAqLywgcGFyZW50RWxtLCByZWZFbG0pO1xuICAgICAgfVxuICAgICAgLy8gYWZ0ZXIgY2FsbGluZyB0aGUgaW5pdCBob29rLCBpZiB0aGUgdm5vZGUgaXMgYSBjaGlsZCBjb21wb25lbnRcbiAgICAgIC8vIGl0IHNob3VsZCd2ZSBjcmVhdGVkIGEgY2hpbGQgaW5zdGFuY2UgYW5kIG1vdW50ZWQgaXQuIHRoZSBjaGlsZFxuICAgICAgLy8gY29tcG9uZW50IGFsc28gaGFzIHNldCB0aGUgcGxhY2Vob2xkZXIgdm5vZGUncyBlbG0uXG4gICAgICAvLyBpbiB0aGF0IGNhc2Ugd2UgY2FuIGp1c3QgcmV0dXJuIHRoZSBlbGVtZW50IGFuZCBiZSBkb25lLlxuICAgICAgaWYgKGlzRGVmKHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xuICAgICAgICBpbml0Q29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBpZiAoaXNUcnVlKGlzUmVhY3RpdmF0ZWQpKSB7XG4gICAgICAgICAgcmVhY3RpdmF0ZUNvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0Q29tcG9uZW50ICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XG4gICAgaWYgKGlzRGVmKHZub2RlLmRhdGEucGVuZGluZ0luc2VydCkpIHtcbiAgICAgIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoLmFwcGx5KGluc2VydGVkVm5vZGVRdWV1ZSwgdm5vZGUuZGF0YS5wZW5kaW5nSW5zZXJ0KTtcbiAgICB9XG4gICAgdm5vZGUuZWxtID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuJGVsO1xuICAgIGlmIChpc1BhdGNoYWJsZSh2bm9kZSkpIHtcbiAgICAgIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgc2V0U2NvcGUodm5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbXB0eSBjb21wb25lbnQgcm9vdC5cbiAgICAgIC8vIHNraXAgYWxsIGVsZW1lbnQtcmVsYXRlZCBtb2R1bGVzIGV4Y2VwdCBmb3IgcmVmICgjMzQ1NSlcbiAgICAgIHJlZ2lzdGVyUmVmKHZub2RlKTtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0byBpbnZva2UgdGhlIGluc2VydCBob29rXG4gICAgICBpbnNlcnRlZFZub2RlUXVldWUucHVzaCh2bm9kZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhY3RpdmF0ZUNvbXBvbmVudCAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pIHtcbiAgICB2YXIgaTtcbiAgICAvLyBoYWNrIGZvciAjNDMzOTogYSByZWFjdGl2YXRlZCBjb21wb25lbnQgd2l0aCBpbm5lciB0cmFuc2l0aW9uXG4gICAgLy8gZG9lcyBub3QgdHJpZ2dlciBiZWNhdXNlIHRoZSBpbm5lciBub2RlJ3MgY3JlYXRlZCBob29rcyBhcmUgbm90IGNhbGxlZFxuICAgIC8vIGFnYWluLiBJdCdzIG5vdCBpZGVhbCB0byBpbnZvbHZlIG1vZHVsZS1zcGVjaWZpYyBsb2dpYyBpbiBoZXJlIGJ1dFxuICAgIC8vIHRoZXJlIGRvZXNuJ3Qgc2VlbSB0byBiZSBhIGJldHRlciB3YXkgdG8gZG8gaXQuXG4gICAgdmFyIGlubmVyTm9kZSA9IHZub2RlO1xuICAgIHdoaWxlIChpbm5lck5vZGUuY29tcG9uZW50SW5zdGFuY2UpIHtcbiAgICAgIGlubmVyTm9kZSA9IGlubmVyTm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XG4gICAgICBpZiAoaXNEZWYoaSA9IGlubmVyTm9kZS5kYXRhKSAmJiBpc0RlZihpID0gaS50cmFuc2l0aW9uKSkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmFjdGl2YXRlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgY2JzLmFjdGl2YXRlW2ldKGVtcHR5Tm9kZSwgaW5uZXJOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpbnNlcnRlZFZub2RlUXVldWUucHVzaChpbm5lck5vZGUpO1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB1bmxpa2UgYSBuZXdseSBjcmVhdGVkIGNvbXBvbmVudCxcbiAgICAvLyBhIHJlYWN0aXZhdGVkIGtlZXAtYWxpdmUgY29tcG9uZW50IGRvZXNuJ3QgaW5zZXJ0IGl0c2VsZlxuICAgIGluc2VydChwYXJlbnRFbG0sIHZub2RlLmVsbSwgcmVmRWxtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydCAocGFyZW50LCBlbG0sIHJlZikge1xuICAgIGlmIChpc0RlZihwYXJlbnQpKSB7XG4gICAgICBpZiAoaXNEZWYocmVmKSkge1xuICAgICAgICBpZiAocmVmLnBhcmVudE5vZGUgPT09IHBhcmVudCkge1xuICAgICAgICAgIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudCwgZWxtLCByZWYpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlT3BzLmFwcGVuZENoaWxkKHBhcmVudCwgZWxtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVDaGlsZHJlbiAodm5vZGUsIGNoaWxkcmVuLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY3JlYXRlRWxtKGNoaWxkcmVuW2ldLCBpbnNlcnRlZFZub2RlUXVldWUsIHZub2RlLmVsbSwgbnVsbCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1ByaW1pdGl2ZSh2bm9kZS50ZXh0KSkge1xuICAgICAgbm9kZU9wcy5hcHBlbmRDaGlsZCh2bm9kZS5lbG0sIG5vZGVPcHMuY3JlYXRlVGV4dE5vZGUodm5vZGUudGV4dCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUGF0Y2hhYmxlICh2bm9kZSkge1xuICAgIHdoaWxlICh2bm9kZS5jb21wb25lbnRJbnN0YW5jZSkge1xuICAgICAgdm5vZGUgPSB2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XG4gICAgfVxuICAgIHJldHVybiBpc0RlZih2bm9kZS50YWcpXG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VDcmVhdGVIb29rcyAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNicy5jcmVhdGUubGVuZ3RoOyArK2kkMSkge1xuICAgICAgY2JzLmNyZWF0ZVtpJDFdKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICBpID0gdm5vZGUuZGF0YS5ob29rOyAvLyBSZXVzZSB2YXJpYWJsZVxuICAgIGlmIChpc0RlZihpKSkge1xuICAgICAgaWYgKGlzRGVmKGkuY3JlYXRlKSkgeyBpLmNyZWF0ZShlbXB0eU5vZGUsIHZub2RlKTsgfVxuICAgICAgaWYgKGlzRGVmKGkuaW5zZXJ0KSkgeyBpbnNlcnRlZFZub2RlUXVldWUucHVzaCh2bm9kZSk7IH1cbiAgICB9XG4gIH1cblxuICAvLyBzZXQgc2NvcGUgaWQgYXR0cmlidXRlIGZvciBzY29wZWQgQ1NTLlxuICAvLyB0aGlzIGlzIGltcGxlbWVudGVkIGFzIGEgc3BlY2lhbCBjYXNlIHRvIGF2b2lkIHRoZSBvdmVyaGVhZFxuICAvLyBvZiBnb2luZyB0aHJvdWdoIHRoZSBub3JtYWwgYXR0cmlidXRlIHBhdGNoaW5nIHByb2Nlc3MuXG4gIGZ1bmN0aW9uIHNldFNjb3BlICh2bm9kZSkge1xuICAgIHZhciBpO1xuICAgIHZhciBhbmNlc3RvciA9IHZub2RlO1xuICAgIHdoaWxlIChhbmNlc3Rvcikge1xuICAgICAgaWYgKGlzRGVmKGkgPSBhbmNlc3Rvci5jb250ZXh0KSAmJiBpc0RlZihpID0gaS4kb3B0aW9ucy5fc2NvcGVJZCkpIHtcbiAgICAgICAgbm9kZU9wcy5zZXRBdHRyaWJ1dGUodm5vZGUuZWxtLCBpLCAnJyk7XG4gICAgICB9XG4gICAgICBhbmNlc3RvciA9IGFuY2VzdG9yLnBhcmVudDtcbiAgICB9XG4gICAgLy8gZm9yIHNsb3QgY29udGVudCB0aGV5IHNob3VsZCBhbHNvIGdldCB0aGUgc2NvcGVJZCBmcm9tIHRoZSBob3N0IGluc3RhbmNlLlxuICAgIGlmIChpc0RlZihpID0gYWN0aXZlSW5zdGFuY2UpICYmXG4gICAgICBpICE9PSB2bm9kZS5jb250ZXh0ICYmXG4gICAgICBpc0RlZihpID0gaS4kb3B0aW9ucy5fc2NvcGVJZClcbiAgICApIHtcbiAgICAgIG5vZGVPcHMuc2V0QXR0cmlidXRlKHZub2RlLmVsbSwgaSwgJycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFZub2RlcyAocGFyZW50RWxtLCByZWZFbG0sIHZub2Rlcywgc3RhcnRJZHgsIGVuZElkeCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XG4gICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xuICAgICAgY3JlYXRlRWxtKHZub2Rlc1tzdGFydElkeF0sIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZURlc3Ryb3lIb29rICh2bm9kZSkge1xuICAgIHZhciBpLCBqO1xuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgICBpZiAoaXNEZWYoZGF0YSkpIHtcbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5kZXN0cm95KSkgeyBpKHZub2RlKTsgfVxuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5kZXN0cm95Lmxlbmd0aDsgKytpKSB7IGNicy5kZXN0cm95W2ldKHZub2RlKTsgfVxuICAgIH1cbiAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNoaWxkcmVuKSkge1xuICAgICAgZm9yIChqID0gMDsgaiA8IHZub2RlLmNoaWxkcmVuLmxlbmd0aDsgKytqKSB7XG4gICAgICAgIGludm9rZURlc3Ryb3lIb29rKHZub2RlLmNoaWxkcmVuW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVWbm9kZXMgKHBhcmVudEVsbSwgdm5vZGVzLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xuICAgICAgdmFyIGNoID0gdm5vZGVzW3N0YXJ0SWR4XTtcbiAgICAgIGlmIChpc0RlZihjaCkpIHtcbiAgICAgICAgaWYgKGlzRGVmKGNoLnRhZykpIHtcbiAgICAgICAgICByZW1vdmVBbmRJbnZva2VSZW1vdmVIb29rKGNoKTtcbiAgICAgICAgICBpbnZva2VEZXN0cm95SG9vayhjaCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFRleHQgbm9kZVxuICAgICAgICAgIHJlbW92ZU5vZGUoY2guZWxtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUFuZEludm9rZVJlbW92ZUhvb2sgKHZub2RlLCBybSkge1xuICAgIGlmIChpc0RlZihybSkgfHwgaXNEZWYodm5vZGUuZGF0YSkpIHtcbiAgICAgIHZhciBpO1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGNicy5yZW1vdmUubGVuZ3RoICsgMTtcbiAgICAgIGlmIChpc0RlZihybSkpIHtcbiAgICAgICAgLy8gd2UgaGF2ZSBhIHJlY3Vyc2l2ZWx5IHBhc3NlZCBkb3duIHJtIGNhbGxiYWNrXG4gICAgICAgIC8vIGluY3JlYXNlIHRoZSBsaXN0ZW5lcnMgY291bnRcbiAgICAgICAgcm0ubGlzdGVuZXJzICs9IGxpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRpcmVjdGx5IHJlbW92aW5nXG4gICAgICAgIHJtID0gY3JlYXRlUm1DYih2bm9kZS5lbG0sIGxpc3RlbmVycyk7XG4gICAgICB9XG4gICAgICAvLyByZWN1cnNpdmVseSBpbnZva2UgaG9va3Mgb24gY2hpbGQgY29tcG9uZW50IHJvb3Qgbm9kZVxuICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSkgJiYgaXNEZWYoaSA9IGkuX3Zub2RlKSAmJiBpc0RlZihpLmRhdGEpKSB7XG4gICAgICAgIHJlbW92ZUFuZEludm9rZVJlbW92ZUhvb2soaSwgcm0pO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5yZW1vdmUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY2JzLnJlbW92ZVtpXSh2bm9kZSwgcm0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5kYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLnJlbW92ZSkpIHtcbiAgICAgICAgaSh2bm9kZSwgcm0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlTm9kZSh2bm9kZS5lbG0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuIChwYXJlbnRFbG0sIG9sZENoLCBuZXdDaCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KSB7XG4gICAgdmFyIG9sZFN0YXJ0SWR4ID0gMDtcbiAgICB2YXIgbmV3U3RhcnRJZHggPSAwO1xuICAgIHZhciBvbGRFbmRJZHggPSBvbGRDaC5sZW5ndGggLSAxO1xuICAgIHZhciBvbGRTdGFydFZub2RlID0gb2xkQ2hbMF07XG4gICAgdmFyIG9sZEVuZFZub2RlID0gb2xkQ2hbb2xkRW5kSWR4XTtcbiAgICB2YXIgbmV3RW5kSWR4ID0gbmV3Q2gubGVuZ3RoIC0gMTtcbiAgICB2YXIgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWzBdO1xuICAgIHZhciBuZXdFbmRWbm9kZSA9IG5ld0NoW25ld0VuZElkeF07XG4gICAgdmFyIG9sZEtleVRvSWR4LCBpZHhJbk9sZCwgZWxtVG9Nb3ZlLCByZWZFbG07XG5cbiAgICAvLyByZW1vdmVPbmx5IGlzIGEgc3BlY2lhbCBmbGFnIHVzZWQgb25seSBieSA8dHJhbnNpdGlvbi1ncm91cD5cbiAgICAvLyB0byBlbnN1cmUgcmVtb3ZlZCBlbGVtZW50cyBzdGF5IGluIGNvcnJlY3QgcmVsYXRpdmUgcG9zaXRpb25zXG4gICAgLy8gZHVyaW5nIGxlYXZpbmcgdHJhbnNpdGlvbnNcbiAgICB2YXIgY2FuTW92ZSA9ICFyZW1vdmVPbmx5O1xuXG4gICAgd2hpbGUgKG9sZFN0YXJ0SWR4IDw9IG9sZEVuZElkeCAmJiBuZXdTdGFydElkeCA8PSBuZXdFbmRJZHgpIHtcbiAgICAgIGlmIChpc1VuZGVmKG9sZFN0YXJ0Vm5vZGUpKSB7XG4gICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTsgLy8gVm5vZGUgaGFzIGJlZW4gbW92ZWQgbGVmdFxuICAgICAgfSBlbHNlIGlmIChpc1VuZGVmKG9sZEVuZFZub2RlKSkge1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgIH0gZWxzZSBpZiAoc2FtZVZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld1N0YXJ0Vm5vZGUpKSB7XG4gICAgICAgIHBhdGNoVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUpKSB7XG4gICAgICAgIHBhdGNoVm5vZGUob2xkRW5kVm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgcmlnaHRcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgY2FuTW92ZSAmJiBub2RlT3BzLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtLCBub2RlT3BzLm5leHRTaWJsaW5nKG9sZEVuZFZub2RlLmVsbSkpO1xuICAgICAgICBvbGRTdGFydFZub2RlID0gb2xkQ2hbKytvbGRTdGFydElkeF07XG4gICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hbLS1uZXdFbmRJZHhdO1xuICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkRW5kVm5vZGUsIG5ld1N0YXJ0Vm5vZGUpKSB7IC8vIFZub2RlIG1vdmVkIGxlZnRcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgY2FuTW92ZSAmJiBub2RlT3BzLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIG9sZEVuZFZub2RlLmVsbSwgb2xkU3RhcnRWbm9kZS5lbG0pO1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzVW5kZWYob2xkS2V5VG9JZHgpKSB7IG9sZEtleVRvSWR4ID0gY3JlYXRlS2V5VG9PbGRJZHgob2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpOyB9XG4gICAgICAgIGlkeEluT2xkID0gaXNEZWYobmV3U3RhcnRWbm9kZS5rZXkpID8gb2xkS2V5VG9JZHhbbmV3U3RhcnRWbm9kZS5rZXldIDogbnVsbDtcbiAgICAgICAgaWYgKGlzVW5kZWYoaWR4SW5PbGQpKSB7IC8vIE5ldyBlbGVtZW50XG4gICAgICAgICAgY3JlYXRlRWxtKG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsbVRvTW92ZSA9IG9sZENoW2lkeEluT2xkXTtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgIWVsbVRvTW92ZSkge1xuICAgICAgICAgICAgd2FybihcbiAgICAgICAgICAgICAgJ0l0IHNlZW1zIHRoZXJlIGFyZSBkdXBsaWNhdGUga2V5cyB0aGF0IGlzIGNhdXNpbmcgYW4gdXBkYXRlIGVycm9yLiAnICtcbiAgICAgICAgICAgICAgJ01ha2Ugc3VyZSBlYWNoIHYtZm9yIGl0ZW0gaGFzIGEgdW5pcXVlIGtleS4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2FtZVZub2RlKGVsbVRvTW92ZSwgbmV3U3RhcnRWbm9kZSkpIHtcbiAgICAgICAgICAgIHBhdGNoVm5vZGUoZWxtVG9Nb3ZlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICAgICAgb2xkQ2hbaWR4SW5PbGRdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY2FuTW92ZSAmJiBub2RlT3BzLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIG5ld1N0YXJ0Vm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNhbWUga2V5IGJ1dCBkaWZmZXJlbnQgZWxlbWVudC4gdHJlYXQgYXMgbmV3IGVsZW1lbnRcbiAgICAgICAgICAgIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHBhcmVudEVsbSwgb2xkU3RhcnRWbm9kZS5lbG0pO1xuICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2xkU3RhcnRJZHggPiBvbGRFbmRJZHgpIHtcbiAgICAgIHJlZkVsbSA9IGlzVW5kZWYobmV3Q2hbbmV3RW5kSWR4ICsgMV0pID8gbnVsbCA6IG5ld0NoW25ld0VuZElkeCArIDFdLmVsbTtcbiAgICAgIGFkZFZub2RlcyhwYXJlbnRFbG0sIHJlZkVsbSwgbmV3Q2gsIG5ld1N0YXJ0SWR4LCBuZXdFbmRJZHgsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgfSBlbHNlIGlmIChuZXdTdGFydElkeCA+IG5ld0VuZElkeCkge1xuICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSwgb2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGNoVm5vZGUgKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KSB7XG4gICAgaWYgKG9sZFZub2RlID09PSB2bm9kZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIHJldXNlIGVsZW1lbnQgZm9yIHN0YXRpYyB0cmVlcy5cbiAgICAvLyBub3RlIHdlIG9ubHkgZG8gdGhpcyBpZiB0aGUgdm5vZGUgaXMgY2xvbmVkIC1cbiAgICAvLyBpZiB0aGUgbmV3IG5vZGUgaXMgbm90IGNsb25lZCBpdCBtZWFucyB0aGUgcmVuZGVyIGZ1bmN0aW9ucyBoYXZlIGJlZW5cbiAgICAvLyByZXNldCBieSB0aGUgaG90LXJlbG9hZC1hcGkgYW5kIHdlIG5lZWQgdG8gZG8gYSBwcm9wZXIgcmUtcmVuZGVyLlxuICAgIGlmIChpc1RydWUodm5vZGUuaXNTdGF0aWMpICYmXG4gICAgICBpc1RydWUob2xkVm5vZGUuaXNTdGF0aWMpICYmXG4gICAgICB2bm9kZS5rZXkgPT09IG9sZFZub2RlLmtleSAmJlxuICAgICAgKGlzVHJ1ZSh2bm9kZS5pc0Nsb25lZCkgfHwgaXNUcnVlKHZub2RlLmlzT25jZSkpXG4gICAgKSB7XG4gICAgICB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG07XG4gICAgICB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSA9IG9sZFZub2RlLmNvbXBvbmVudEluc3RhbmNlO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBpO1xuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgICBpZiAoaXNEZWYoZGF0YSkgJiYgaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkucHJlcGF0Y2gpKSB7XG4gICAgICBpKG9sZFZub2RlLCB2bm9kZSk7XG4gICAgfVxuICAgIHZhciBlbG0gPSB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG07XG4gICAgdmFyIG9sZENoID0gb2xkVm5vZGUuY2hpbGRyZW47XG4gICAgdmFyIGNoID0gdm5vZGUuY2hpbGRyZW47XG4gICAgaWYgKGlzRGVmKGRhdGEpICYmIGlzUGF0Y2hhYmxlKHZub2RlKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy51cGRhdGUubGVuZ3RoOyArK2kpIHsgY2JzLnVwZGF0ZVtpXShvbGRWbm9kZSwgdm5vZGUpOyB9XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkudXBkYXRlKSkgeyBpKG9sZFZub2RlLCB2bm9kZSk7IH1cbiAgICB9XG4gICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcbiAgICAgIGlmIChpc0RlZihvbGRDaCkgJiYgaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChvbGRDaCAhPT0gY2gpIHsgdXBkYXRlQ2hpbGRyZW4oZWxtLCBvbGRDaCwgY2gsIGluc2VydGVkVm5vZGVRdWV1ZSwgcmVtb3ZlT25seSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkgeyBub2RlT3BzLnNldFRleHRDb250ZW50KGVsbSwgJycpOyB9XG4gICAgICAgIGFkZFZub2RlcyhlbG0sIG51bGwsIGNoLCAwLCBjaC5sZW5ndGggLSAxLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRDaCkpIHtcbiAgICAgICAgcmVtb3ZlVm5vZGVzKGVsbSwgb2xkQ2gsIDAsIG9sZENoLmxlbmd0aCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkge1xuICAgICAgICBub2RlT3BzLnNldFRleHRDb250ZW50KGVsbSwgJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2xkVm5vZGUudGV4dCAhPT0gdm5vZGUudGV4dCkge1xuICAgICAgbm9kZU9wcy5zZXRUZXh0Q29udGVudChlbG0sIHZub2RlLnRleHQpO1xuICAgIH1cbiAgICBpZiAoaXNEZWYoZGF0YSkpIHtcbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5wb3N0cGF0Y2gpKSB7IGkob2xkVm5vZGUsIHZub2RlKTsgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUluc2VydEhvb2sgKHZub2RlLCBxdWV1ZSwgaW5pdGlhbCkge1xuICAgIC8vIGRlbGF5IGluc2VydCBob29rcyBmb3IgY29tcG9uZW50IHJvb3Qgbm9kZXMsIGludm9rZSB0aGVtIGFmdGVyIHRoZVxuICAgIC8vIGVsZW1lbnQgaXMgcmVhbGx5IGluc2VydGVkXG4gICAgaWYgKGlzVHJ1ZShpbml0aWFsKSAmJiBpc0RlZih2bm9kZS5wYXJlbnQpKSB7XG4gICAgICB2bm9kZS5wYXJlbnQuZGF0YS5wZW5kaW5nSW5zZXJ0ID0gcXVldWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcXVldWVbaV0uZGF0YS5ob29rLmluc2VydChxdWV1ZVtpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhaWxlZCA9IGZhbHNlO1xuICAvLyBsaXN0IG9mIG1vZHVsZXMgdGhhdCBjYW4gc2tpcCBjcmVhdGUgaG9vayBkdXJpbmcgaHlkcmF0aW9uIGJlY2F1c2UgdGhleVxuICAvLyBhcmUgYWxyZWFkeSByZW5kZXJlZCBvbiB0aGUgY2xpZW50IG9yIGhhcyBubyBuZWVkIGZvciBpbml0aWFsaXphdGlvblxuICB2YXIgaXNSZW5kZXJlZE1vZHVsZSA9IG1ha2VNYXAoJ2F0dHJzLHN0eWxlLGNsYXNzLHN0YXRpY0NsYXNzLHN0YXRpY1N0eWxlLGtleScpO1xuXG4gIC8vIE5vdGU6IHRoaXMgaXMgYSBicm93c2VyLW9ubHkgZnVuY3Rpb24gc28gd2UgY2FuIGFzc3VtZSBlbG1zIGFyZSBET00gbm9kZXMuXG4gIGZ1bmN0aW9uIGh5ZHJhdGUgKGVsbSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIHtcbiAgICAgIGlmICghYXNzZXJ0Tm9kZU1hdGNoKGVsbSwgdm5vZGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICB2bm9kZS5lbG0gPSBlbG07XG4gICAgdmFyIHRhZyA9IHZub2RlLnRhZztcbiAgICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuaW5pdCkpIHsgaSh2bm9kZSwgdHJ1ZSAvKiBoeWRyYXRpbmcgKi8pOyB9XG4gICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xuICAgICAgICAvLyBjaGlsZCBjb21wb25lbnQuIGl0IHNob3VsZCBoYXZlIGh5ZHJhdGVkIGl0cyBvd24gdHJlZS5cbiAgICAgICAgaW5pdENvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzRGVmKHRhZykpIHtcbiAgICAgIGlmIChpc0RlZihjaGlsZHJlbikpIHtcbiAgICAgICAgLy8gZW1wdHkgZWxlbWVudCwgYWxsb3cgY2xpZW50IHRvIHBpY2sgdXAgYW5kIHBvcHVsYXRlIGNoaWxkcmVuXG4gICAgICAgIGlmICghZWxtLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgIGNyZWF0ZUNoaWxkcmVuKHZub2RlLCBjaGlsZHJlbiwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY2hpbGRyZW5NYXRjaCA9IHRydWU7XG4gICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IGVsbS5maXJzdENoaWxkO1xuICAgICAgICAgIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcbiAgICAgICAgICAgIGlmICghY2hpbGROb2RlIHx8ICFoeWRyYXRlKGNoaWxkTm9kZSwgY2hpbGRyZW5baSQxXSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSkge1xuICAgICAgICAgICAgICBjaGlsZHJlbk1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZE5vZGUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIGNoaWxkTm9kZSBpcyBub3QgbnVsbCwgaXQgbWVhbnMgdGhlIGFjdHVhbCBjaGlsZE5vZGVzIGxpc3QgaXNcbiAgICAgICAgICAvLyBsb25nZXIgdGhhbiB0aGUgdmlydHVhbCBjaGlsZHJlbiBsaXN0LlxuICAgICAgICAgIGlmICghY2hpbGRyZW5NYXRjaCB8fCBjaGlsZE5vZGUpIHtcbiAgICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgICAgICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgIWJhaWxlZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGJhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignUGFyZW50OiAnLCBlbG0pO1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ01pc21hdGNoaW5nIGNoaWxkTm9kZXMgdnMuIFZOb2RlczogJywgZWxtLmNoaWxkTm9kZXMsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgaWYgKCFpc1JlbmRlcmVkTW9kdWxlKGtleSkpIHtcbiAgICAgICAgICAgIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVsbS5kYXRhICE9PSB2bm9kZS50ZXh0KSB7XG4gICAgICBlbG0uZGF0YSA9IHZub2RlLnRleHQ7XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBhc3NlcnROb2RlTWF0Y2ggKG5vZGUsIHZub2RlKSB7XG4gICAgaWYgKGlzRGVmKHZub2RlLnRhZykpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZub2RlLnRhZy5pbmRleE9mKCd2dWUtY29tcG9uZW50JykgPT09IDAgfHxcbiAgICAgICAgdm5vZGUudGFnLnRvTG93ZXJDYXNlKCkgPT09IChub2RlLnRhZ05hbWUgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAodm5vZGUuaXNDb21tZW50ID8gOCA6IDMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHBhdGNoIChvbGRWbm9kZSwgdm5vZGUsIGh5ZHJhdGluZywgcmVtb3ZlT25seSwgcGFyZW50RWxtLCByZWZFbG0pIHtcbiAgICBpZiAoaXNVbmRlZih2bm9kZSkpIHtcbiAgICAgIGlmIChpc0RlZihvbGRWbm9kZSkpIHsgaW52b2tlRGVzdHJveUhvb2sob2xkVm5vZGUpOyB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgaXNJbml0aWFsUGF0Y2ggPSBmYWxzZTtcbiAgICB2YXIgaW5zZXJ0ZWRWbm9kZVF1ZXVlID0gW107XG5cbiAgICBpZiAoaXNVbmRlZihvbGRWbm9kZSkpIHtcbiAgICAgIC8vIGVtcHR5IG1vdW50IChsaWtlbHkgYXMgY29tcG9uZW50KSwgY3JlYXRlIG5ldyByb290IGVsZW1lbnRcbiAgICAgIGlzSW5pdGlhbFBhdGNoID0gdHJ1ZTtcbiAgICAgIGNyZWF0ZUVsbSh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpc1JlYWxFbGVtZW50ID0gaXNEZWYob2xkVm5vZGUubm9kZVR5cGUpO1xuICAgICAgaWYgKCFpc1JlYWxFbGVtZW50ICYmIHNhbWVWbm9kZShvbGRWbm9kZSwgdm5vZGUpKSB7XG4gICAgICAgIC8vIHBhdGNoIGV4aXN0aW5nIHJvb3Qgbm9kZVxuICAgICAgICBwYXRjaFZub2RlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCByZW1vdmVPbmx5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc1JlYWxFbGVtZW50KSB7XG4gICAgICAgICAgLy8gbW91bnRpbmcgdG8gYSByZWFsIGVsZW1lbnRcbiAgICAgICAgICAvLyBjaGVjayBpZiB0aGlzIGlzIHNlcnZlci1yZW5kZXJlZCBjb250ZW50IGFuZCBpZiB3ZSBjYW4gcGVyZm9ybVxuICAgICAgICAgIC8vIGEgc3VjY2Vzc2Z1bCBoeWRyYXRpb24uXG4gICAgICAgICAgaWYgKG9sZFZub2RlLm5vZGVUeXBlID09PSAxICYmIG9sZFZub2RlLmhhc0F0dHJpYnV0ZShTU1JfQVRUUikpIHtcbiAgICAgICAgICAgIG9sZFZub2RlLnJlbW92ZUF0dHJpYnV0ZShTU1JfQVRUUik7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNUcnVlKGh5ZHJhdGluZykpIHtcbiAgICAgICAgICAgIGlmIChoeWRyYXRlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSkge1xuICAgICAgICAgICAgICBpbnZva2VJbnNlcnRIb29rKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHRydWUpO1xuICAgICAgICAgICAgICByZXR1cm4gb2xkVm5vZGVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgICAgJ1RoZSBjbGllbnQtc2lkZSByZW5kZXJlZCB2aXJ0dWFsIERPTSB0cmVlIGlzIG5vdCBtYXRjaGluZyAnICtcbiAgICAgICAgICAgICAgICAnc2VydmVyLXJlbmRlcmVkIGNvbnRlbnQuIFRoaXMgaXMgbGlrZWx5IGNhdXNlZCBieSBpbmNvcnJlY3QgJyArXG4gICAgICAgICAgICAgICAgJ0hUTUwgbWFya3VwLCBmb3IgZXhhbXBsZSBuZXN0aW5nIGJsb2NrLWxldmVsIGVsZW1lbnRzIGluc2lkZSAnICtcbiAgICAgICAgICAgICAgICAnPHA+LCBvciBtaXNzaW5nIDx0Ym9keT4uIEJhaWxpbmcgaHlkcmF0aW9uIGFuZCBwZXJmb3JtaW5nICcgK1xuICAgICAgICAgICAgICAgICdmdWxsIGNsaWVudC1zaWRlIHJlbmRlci4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVpdGhlciBub3Qgc2VydmVyLXJlbmRlcmVkLCBvciBoeWRyYXRpb24gZmFpbGVkLlxuICAgICAgICAgIC8vIGNyZWF0ZSBhbiBlbXB0eSBub2RlIGFuZCByZXBsYWNlIGl0XG4gICAgICAgICAgb2xkVm5vZGUgPSBlbXB0eU5vZGVBdChvbGRWbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVwbGFjaW5nIGV4aXN0aW5nIGVsZW1lbnRcbiAgICAgICAgdmFyIG9sZEVsbSA9IG9sZFZub2RlLmVsbTtcbiAgICAgICAgdmFyIHBhcmVudEVsbSQxID0gbm9kZU9wcy5wYXJlbnROb2RlKG9sZEVsbSk7XG4gICAgICAgIGNyZWF0ZUVsbShcbiAgICAgICAgICB2bm9kZSxcbiAgICAgICAgICBpbnNlcnRlZFZub2RlUXVldWUsXG4gICAgICAgICAgLy8gZXh0cmVtZWx5IHJhcmUgZWRnZSBjYXNlOiBkbyBub3QgaW5zZXJ0IGlmIG9sZCBlbGVtZW50IGlzIGluIGFcbiAgICAgICAgICAvLyBsZWF2aW5nIHRyYW5zaXRpb24uIE9ubHkgaGFwcGVucyB3aGVuIGNvbWJpbmluZyB0cmFuc2l0aW9uICtcbiAgICAgICAgICAvLyBrZWVwLWFsaXZlICsgSE9Dcy4gKCM0NTkwKVxuICAgICAgICAgIG9sZEVsbS5fbGVhdmVDYiA/IG51bGwgOiBwYXJlbnRFbG0kMSxcbiAgICAgICAgICBub2RlT3BzLm5leHRTaWJsaW5nKG9sZEVsbSlcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoaXNEZWYodm5vZGUucGFyZW50KSkge1xuICAgICAgICAgIC8vIGNvbXBvbmVudCByb290IGVsZW1lbnQgcmVwbGFjZWQuXG4gICAgICAgICAgLy8gdXBkYXRlIHBhcmVudCBwbGFjZWhvbGRlciBub2RlIGVsZW1lbnQsIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgdmFyIGFuY2VzdG9yID0gdm5vZGUucGFyZW50O1xuICAgICAgICAgIHdoaWxlIChhbmNlc3Rvcikge1xuICAgICAgICAgICAgYW5jZXN0b3IuZWxtID0gdm5vZGUuZWxtO1xuICAgICAgICAgICAgYW5jZXN0b3IgPSBhbmNlc3Rvci5wYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc1BhdGNoYWJsZSh2bm9kZSkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2JzLmNyZWF0ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICBjYnMuY3JlYXRlW2ldKGVtcHR5Tm9kZSwgdm5vZGUucGFyZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEZWYocGFyZW50RWxtJDEpKSB7XG4gICAgICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSQxLCBbb2xkVm5vZGVdLCAwLCAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50YWcpKSB7XG4gICAgICAgICAgaW52b2tlRGVzdHJveUhvb2sob2xkVm5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW52b2tlSW5zZXJ0SG9vayh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBpc0luaXRpYWxQYXRjaCk7XG4gICAgcmV0dXJuIHZub2RlLmVsbVxuICB9XG59XG5cbi8qICAqL1xuXG52YXIgZGlyZWN0aXZlcyA9IHtcbiAgY3JlYXRlOiB1cGRhdGVEaXJlY3RpdmVzLFxuICB1cGRhdGU6IHVwZGF0ZURpcmVjdGl2ZXMsXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIHVuYmluZERpcmVjdGl2ZXMgKHZub2RlKSB7XG4gICAgdXBkYXRlRGlyZWN0aXZlcyh2bm9kZSwgZW1wdHlOb2RlKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gdXBkYXRlRGlyZWN0aXZlcyAob2xkVm5vZGUsIHZub2RlKSB7XG4gIGlmIChvbGRWbm9kZS5kYXRhLmRpcmVjdGl2ZXMgfHwgdm5vZGUuZGF0YS5kaXJlY3RpdmVzKSB7XG4gICAgX3VwZGF0ZShvbGRWbm9kZSwgdm5vZGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF91cGRhdGUgKG9sZFZub2RlLCB2bm9kZSkge1xuICB2YXIgaXNDcmVhdGUgPSBvbGRWbm9kZSA9PT0gZW1wdHlOb2RlO1xuICB2YXIgaXNEZXN0cm95ID0gdm5vZGUgPT09IGVtcHR5Tm9kZTtcbiAgdmFyIG9sZERpcnMgPSBub3JtYWxpemVEaXJlY3RpdmVzJDEob2xkVm5vZGUuZGF0YS5kaXJlY3RpdmVzLCBvbGRWbm9kZS5jb250ZXh0KTtcbiAgdmFyIG5ld0RpcnMgPSBub3JtYWxpemVEaXJlY3RpdmVzJDEodm5vZGUuZGF0YS5kaXJlY3RpdmVzLCB2bm9kZS5jb250ZXh0KTtcblxuICB2YXIgZGlyc1dpdGhJbnNlcnQgPSBbXTtcbiAgdmFyIGRpcnNXaXRoUG9zdHBhdGNoID0gW107XG5cbiAgdmFyIGtleSwgb2xkRGlyLCBkaXI7XG4gIGZvciAoa2V5IGluIG5ld0RpcnMpIHtcbiAgICBvbGREaXIgPSBvbGREaXJzW2tleV07XG4gICAgZGlyID0gbmV3RGlyc1trZXldO1xuICAgIGlmICghb2xkRGlyKSB7XG4gICAgICAvLyBuZXcgZGlyZWN0aXZlLCBiaW5kXG4gICAgICBjYWxsSG9vayQxKGRpciwgJ2JpbmQnLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgaWYgKGRpci5kZWYgJiYgZGlyLmRlZi5pbnNlcnRlZCkge1xuICAgICAgICBkaXJzV2l0aEluc2VydC5wdXNoKGRpcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGV4aXN0aW5nIGRpcmVjdGl2ZSwgdXBkYXRlXG4gICAgICBkaXIub2xkVmFsdWUgPSBvbGREaXIudmFsdWU7XG4gICAgICBjYWxsSG9vayQxKGRpciwgJ3VwZGF0ZScsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICBpZiAoZGlyLmRlZiAmJiBkaXIuZGVmLmNvbXBvbmVudFVwZGF0ZWQpIHtcbiAgICAgICAgZGlyc1dpdGhQb3N0cGF0Y2gucHVzaChkaXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChkaXJzV2l0aEluc2VydC5sZW5ndGgpIHtcbiAgICB2YXIgY2FsbEluc2VydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyc1dpdGhJbnNlcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbEhvb2skMShkaXJzV2l0aEluc2VydFtpXSwgJ2luc2VydGVkJywgdm5vZGUsIG9sZFZub2RlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChpc0NyZWF0ZSkge1xuICAgICAgbWVyZ2VWTm9kZUhvb2sodm5vZGUuZGF0YS5ob29rIHx8ICh2bm9kZS5kYXRhLmhvb2sgPSB7fSksICdpbnNlcnQnLCBjYWxsSW5zZXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbEluc2VydCgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChkaXJzV2l0aFBvc3RwYXRjaC5sZW5ndGgpIHtcbiAgICBtZXJnZVZOb2RlSG9vayh2bm9kZS5kYXRhLmhvb2sgfHwgKHZub2RlLmRhdGEuaG9vayA9IHt9KSwgJ3Bvc3RwYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyc1dpdGhQb3N0cGF0Y2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbEhvb2skMShkaXJzV2l0aFBvc3RwYXRjaFtpXSwgJ2NvbXBvbmVudFVwZGF0ZWQnLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFpc0NyZWF0ZSkge1xuICAgIGZvciAoa2V5IGluIG9sZERpcnMpIHtcbiAgICAgIGlmICghbmV3RGlyc1trZXldKSB7XG4gICAgICAgIC8vIG5vIGxvbmdlciBwcmVzZW50LCB1bmJpbmRcbiAgICAgICAgY2FsbEhvb2skMShvbGREaXJzW2tleV0sICd1bmJpbmQnLCBvbGRWbm9kZSwgb2xkVm5vZGUsIGlzRGVzdHJveSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciBlbXB0eU1vZGlmaWVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURpcmVjdGl2ZXMkMSAoXG4gIGRpcnMsXG4gIHZtXG4pIHtcbiAgdmFyIHJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGlmICghZGlycykge1xuICAgIHJldHVybiByZXNcbiAgfVxuICB2YXIgaSwgZGlyO1xuICBmb3IgKGkgPSAwOyBpIDwgZGlycy5sZW5ndGg7IGkrKykge1xuICAgIGRpciA9IGRpcnNbaV07XG4gICAgaWYgKCFkaXIubW9kaWZpZXJzKSB7XG4gICAgICBkaXIubW9kaWZpZXJzID0gZW1wdHlNb2RpZmllcnM7XG4gICAgfVxuICAgIHJlc1tnZXRSYXdEaXJOYW1lKGRpcildID0gZGlyO1xuICAgIGRpci5kZWYgPSByZXNvbHZlQXNzZXQodm0uJG9wdGlvbnMsICdkaXJlY3RpdmVzJywgZGlyLm5hbWUsIHRydWUpO1xuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZ2V0UmF3RGlyTmFtZSAoZGlyKSB7XG4gIHJldHVybiBkaXIucmF3TmFtZSB8fCAoKGRpci5uYW1lKSArIFwiLlwiICsgKE9iamVjdC5rZXlzKGRpci5tb2RpZmllcnMgfHwge30pLmpvaW4oJy4nKSkpXG59XG5cbmZ1bmN0aW9uIGNhbGxIb29rJDEgKGRpciwgaG9vaywgdm5vZGUsIG9sZFZub2RlLCBpc0Rlc3Ryb3kpIHtcbiAgdmFyIGZuID0gZGlyLmRlZiAmJiBkaXIuZGVmW2hvb2tdO1xuICBpZiAoZm4pIHtcbiAgICB0cnkge1xuICAgICAgZm4odm5vZGUuZWxtLCBkaXIsIHZub2RlLCBvbGRWbm9kZSwgaXNEZXN0cm95KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBoYW5kbGVFcnJvcihlLCB2bm9kZS5jb250ZXh0LCAoXCJkaXJlY3RpdmUgXCIgKyAoZGlyLm5hbWUpICsgXCIgXCIgKyBob29rICsgXCIgaG9va1wiKSk7XG4gICAgfVxuICB9XG59XG5cbnZhciBiYXNlTW9kdWxlcyA9IFtcbiAgcmVmLFxuICBkaXJlY3RpdmVzXG5dO1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gdXBkYXRlQXR0cnMgKG9sZFZub2RlLCB2bm9kZSkge1xuICBpZiAoaXNVbmRlZihvbGRWbm9kZS5kYXRhLmF0dHJzKSAmJiBpc1VuZGVmKHZub2RlLmRhdGEuYXR0cnMpKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIGtleSwgY3VyLCBvbGQ7XG4gIHZhciBlbG0gPSB2bm9kZS5lbG07XG4gIHZhciBvbGRBdHRycyA9IG9sZFZub2RlLmRhdGEuYXR0cnMgfHwge307XG4gIHZhciBhdHRycyA9IHZub2RlLmRhdGEuYXR0cnMgfHwge307XG4gIC8vIGNsb25lIG9ic2VydmVkIG9iamVjdHMsIGFzIHRoZSB1c2VyIHByb2JhYmx5IHdhbnRzIHRvIG11dGF0ZSBpdFxuICBpZiAoaXNEZWYoYXR0cnMuX19vYl9fKSkge1xuICAgIGF0dHJzID0gdm5vZGUuZGF0YS5hdHRycyA9IGV4dGVuZCh7fSwgYXR0cnMpO1xuICB9XG5cbiAgZm9yIChrZXkgaW4gYXR0cnMpIHtcbiAgICBjdXIgPSBhdHRyc1trZXldO1xuICAgIG9sZCA9IG9sZEF0dHJzW2tleV07XG4gICAgaWYgKG9sZCAhPT0gY3VyKSB7XG4gICAgICBzZXRBdHRyKGVsbSwga2V5LCBjdXIpO1xuICAgIH1cbiAgfVxuICAvLyAjNDM5MTogaW4gSUU5LCBzZXR0aW5nIHR5cGUgY2FuIHJlc2V0IHZhbHVlIGZvciBpbnB1dFt0eXBlPXJhZGlvXVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGlzSUU5ICYmIGF0dHJzLnZhbHVlICE9PSBvbGRBdHRycy52YWx1ZSkge1xuICAgIHNldEF0dHIoZWxtLCAndmFsdWUnLCBhdHRycy52YWx1ZSk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2xkQXR0cnMpIHtcbiAgICBpZiAoaXNVbmRlZihhdHRyc1trZXldKSkge1xuICAgICAgaWYgKGlzWGxpbmsoa2V5KSkge1xuICAgICAgICBlbG0ucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtOUywgZ2V0WGxpbmtQcm9wKGtleSkpO1xuICAgICAgfSBlbHNlIGlmICghaXNFbnVtZXJhdGVkQXR0cihrZXkpKSB7XG4gICAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0ciAoZWwsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGlzQm9vbGVhbkF0dHIoa2V5KSkge1xuICAgIC8vIHNldCBhdHRyaWJ1dGUgZm9yIGJsYW5rIHZhbHVlXG4gICAgLy8gZS5nLiA8b3B0aW9uIGRpc2FibGVkPlNlbGVjdCBvbmU8L29wdGlvbj5cbiAgICBpZiAoaXNGYWxzeUF0dHJWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBrZXkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0VudW1lcmF0ZWRBdHRyKGtleSkpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSB8fCB2YWx1ZSA9PT0gJ2ZhbHNlJyA/ICdmYWxzZScgOiAndHJ1ZScpO1xuICB9IGVsc2UgaWYgKGlzWGxpbmsoa2V5KSkge1xuICAgIGlmIChpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtOUywgZ2V0WGxpbmtQcm9wKGtleSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzRmFsc3lBdHRyVmFsdWUodmFsdWUpKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgYXR0cnMgPSB7XG4gIGNyZWF0ZTogdXBkYXRlQXR0cnMsXG4gIHVwZGF0ZTogdXBkYXRlQXR0cnNcbn07XG5cbi8qICAqL1xuXG5mdW5jdGlvbiB1cGRhdGVDbGFzcyAob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBlbCA9IHZub2RlLmVsbTtcbiAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xuICB2YXIgb2xkRGF0YSA9IG9sZFZub2RlLmRhdGE7XG4gIGlmIChcbiAgICBpc1VuZGVmKGRhdGEuc3RhdGljQ2xhc3MpICYmXG4gICAgaXNVbmRlZihkYXRhLmNsYXNzKSAmJiAoXG4gICAgICBpc1VuZGVmKG9sZERhdGEpIHx8IChcbiAgICAgICAgaXNVbmRlZihvbGREYXRhLnN0YXRpY0NsYXNzKSAmJlxuICAgICAgICBpc1VuZGVmKG9sZERhdGEuY2xhc3MpXG4gICAgICApXG4gICAgKVxuICApIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBjbHMgPSBnZW5DbGFzc0ZvclZub2RlKHZub2RlKTtcblxuICAvLyBoYW5kbGUgdHJhbnNpdGlvbiBjbGFzc2VzXG4gIHZhciB0cmFuc2l0aW9uQ2xhc3MgPSBlbC5fdHJhbnNpdGlvbkNsYXNzZXM7XG4gIGlmIChpc0RlZih0cmFuc2l0aW9uQ2xhc3MpKSB7XG4gICAgY2xzID0gY29uY2F0KGNscywgc3RyaW5naWZ5Q2xhc3ModHJhbnNpdGlvbkNsYXNzKSk7XG4gIH1cblxuICAvLyBzZXQgdGhlIGNsYXNzXG4gIGlmIChjbHMgIT09IGVsLl9wcmV2Q2xhc3MpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xzKTtcbiAgICBlbC5fcHJldkNsYXNzID0gY2xzO1xuICB9XG59XG5cbnZhciBrbGFzcyA9IHtcbiAgY3JlYXRlOiB1cGRhdGVDbGFzcyxcbiAgdXBkYXRlOiB1cGRhdGVDbGFzc1xufTtcblxuLyogICovXG5cbnZhciB2YWxpZERpdmlzaW9uQ2hhclJFID0gL1tcXHcpLitcXC1fJFxcXV0vO1xuXG5mdW5jdGlvbiBwYXJzZUZpbHRlcnMgKGV4cCkge1xuICB2YXIgaW5TaW5nbGUgPSBmYWxzZTtcbiAgdmFyIGluRG91YmxlID0gZmFsc2U7XG4gIHZhciBpblRlbXBsYXRlU3RyaW5nID0gZmFsc2U7XG4gIHZhciBpblJlZ2V4ID0gZmFsc2U7XG4gIHZhciBjdXJseSA9IDA7XG4gIHZhciBzcXVhcmUgPSAwO1xuICB2YXIgcGFyZW4gPSAwO1xuICB2YXIgbGFzdEZpbHRlckluZGV4ID0gMDtcbiAgdmFyIGMsIHByZXYsIGksIGV4cHJlc3Npb24sIGZpbHRlcnM7XG5cbiAgZm9yIChpID0gMDsgaSA8IGV4cC5sZW5ndGg7IGkrKykge1xuICAgIHByZXYgPSBjO1xuICAgIGMgPSBleHAuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoaW5TaW5nbGUpIHtcbiAgICAgIGlmIChjID09PSAweDI3ICYmIHByZXYgIT09IDB4NUMpIHsgaW5TaW5nbGUgPSBmYWxzZTsgfVxuICAgIH0gZWxzZSBpZiAoaW5Eb3VibGUpIHtcbiAgICAgIGlmIChjID09PSAweDIyICYmIHByZXYgIT09IDB4NUMpIHsgaW5Eb3VibGUgPSBmYWxzZTsgfVxuICAgIH0gZWxzZSBpZiAoaW5UZW1wbGF0ZVN0cmluZykge1xuICAgICAgaWYgKGMgPT09IDB4NjAgJiYgcHJldiAhPT0gMHg1QykgeyBpblRlbXBsYXRlU3RyaW5nID0gZmFsc2U7IH1cbiAgICB9IGVsc2UgaWYgKGluUmVnZXgpIHtcbiAgICAgIGlmIChjID09PSAweDJmICYmIHByZXYgIT09IDB4NUMpIHsgaW5SZWdleCA9IGZhbHNlOyB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4N0MgJiYgLy8gcGlwZVxuICAgICAgZXhwLmNoYXJDb2RlQXQoaSArIDEpICE9PSAweDdDICYmXG4gICAgICBleHAuY2hhckNvZGVBdChpIC0gMSkgIT09IDB4N0MgJiZcbiAgICAgICFjdXJseSAmJiAhc3F1YXJlICYmICFwYXJlblxuICAgICkge1xuICAgICAgaWYgKGV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBmaXJzdCBmaWx0ZXIsIGVuZCBvZiBleHByZXNzaW9uXG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxO1xuICAgICAgICBleHByZXNzaW9uID0gZXhwLnNsaWNlKDAsIGkpLnRyaW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hGaWx0ZXIoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgMHgyMjogaW5Eb3VibGUgPSB0cnVlOyBicmVhayAgICAgICAgIC8vIFwiXG4gICAgICAgIGNhc2UgMHgyNzogaW5TaW5nbGUgPSB0cnVlOyBicmVhayAgICAgICAgIC8vICdcbiAgICAgICAgY2FzZSAweDYwOiBpblRlbXBsYXRlU3RyaW5nID0gdHJ1ZTsgYnJlYWsgLy8gYFxuICAgICAgICBjYXNlIDB4Mjg6IHBhcmVuKys7IGJyZWFrICAgICAgICAgICAgICAgICAvLyAoXG4gICAgICAgIGNhc2UgMHgyOTogcGFyZW4tLTsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIClcbiAgICAgICAgY2FzZSAweDVCOiBzcXVhcmUrKzsgYnJlYWsgICAgICAgICAgICAgICAgLy8gW1xuICAgICAgICBjYXNlIDB4NUQ6IHNxdWFyZS0tOyBicmVhayAgICAgICAgICAgICAgICAvLyBdXG4gICAgICAgIGNhc2UgMHg3QjogY3VybHkrKzsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgY2FzZSAweDdEOiBjdXJseS0tOyBicmVhayAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09IDB4MmYpIHsgLy8gL1xuICAgICAgICB2YXIgaiA9IGkgLSAxO1xuICAgICAgICB2YXIgcCA9ICh2b2lkIDApO1xuICAgICAgICAvLyBmaW5kIGZpcnN0IG5vbi13aGl0ZXNwYWNlIHByZXYgY2hhclxuICAgICAgICBmb3IgKDsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICBwID0gZXhwLmNoYXJBdChqKTtcbiAgICAgICAgICBpZiAocCAhPT0gJyAnKSB7IGJyZWFrIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXAgfHwgIXZhbGlkRGl2aXNpb25DaGFyUkUudGVzdChwKSkge1xuICAgICAgICAgIGluUmVnZXggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgIGV4cHJlc3Npb24gPSBleHAuc2xpY2UoMCwgaSkudHJpbSgpO1xuICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gMCkge1xuICAgIHB1c2hGaWx0ZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hGaWx0ZXIgKCkge1xuICAgIChmaWx0ZXJzIHx8IChmaWx0ZXJzID0gW10pKS5wdXNoKGV4cC5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKSk7XG4gICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDE7XG4gIH1cblxuICBpZiAoZmlsdGVycykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBmaWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBleHByZXNzaW9uID0gd3JhcEZpbHRlcihleHByZXNzaW9uLCBmaWx0ZXJzW2ldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXhwcmVzc2lvblxufVxuXG5mdW5jdGlvbiB3cmFwRmlsdGVyIChleHAsIGZpbHRlcikge1xuICB2YXIgaSA9IGZpbHRlci5pbmRleE9mKCcoJyk7XG4gIGlmIChpIDwgMCkge1xuICAgIC8vIF9mOiByZXNvbHZlRmlsdGVyXG4gICAgcmV0dXJuIChcIl9mKFxcXCJcIiArIGZpbHRlciArIFwiXFxcIikoXCIgKyBleHAgKyBcIilcIilcbiAgfSBlbHNlIHtcbiAgICB2YXIgbmFtZSA9IGZpbHRlci5zbGljZSgwLCBpKTtcbiAgICB2YXIgYXJncyA9IGZpbHRlci5zbGljZShpICsgMSk7XG4gICAgcmV0dXJuIChcIl9mKFxcXCJcIiArIG5hbWUgKyBcIlxcXCIpKFwiICsgZXhwICsgXCIsXCIgKyBhcmdzKVxuICB9XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBiYXNlV2FybiAobXNnKSB7XG4gIGNvbnNvbGUuZXJyb3IoKFwiW1Z1ZSBjb21waWxlcl06IFwiICsgbXNnKSk7XG59XG5cbmZ1bmN0aW9uIHBsdWNrTW9kdWxlRnVuY3Rpb24gKFxuICBtb2R1bGVzLFxuICBrZXlcbikge1xuICByZXR1cm4gbW9kdWxlc1xuICAgID8gbW9kdWxlcy5tYXAoZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1ba2V5XTsgfSkuZmlsdGVyKGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9KVxuICAgIDogW11cbn1cblxuZnVuY3Rpb24gYWRkUHJvcCAoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIChlbC5wcm9wcyB8fCAoZWwucHJvcHMgPSBbXSkpLnB1c2goeyBuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWUgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHIgKGVsLCBuYW1lLCB2YWx1ZSkge1xuICAoZWwuYXR0cnMgfHwgKGVsLmF0dHJzID0gW10pKS5wdXNoKHsgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH0pO1xufVxuXG5mdW5jdGlvbiBhZGREaXJlY3RpdmUgKFxuICBlbCxcbiAgbmFtZSxcbiAgcmF3TmFtZSxcbiAgdmFsdWUsXG4gIGFyZyxcbiAgbW9kaWZpZXJzXG4pIHtcbiAgKGVsLmRpcmVjdGl2ZXMgfHwgKGVsLmRpcmVjdGl2ZXMgPSBbXSkpLnB1c2goeyBuYW1lOiBuYW1lLCByYXdOYW1lOiByYXdOYW1lLCB2YWx1ZTogdmFsdWUsIGFyZzogYXJnLCBtb2RpZmllcnM6IG1vZGlmaWVycyB9KTtcbn1cblxuZnVuY3Rpb24gYWRkSGFuZGxlciAoXG4gIGVsLFxuICBuYW1lLFxuICB2YWx1ZSxcbiAgbW9kaWZpZXJzLFxuICBpbXBvcnRhbnQsXG4gIHdhcm5cbikge1xuICAvLyB3YXJuIHByZXZlbnQgYW5kIHBhc3NpdmUgbW9kaWZpZXJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChcbiAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuICYmXG4gICAgbW9kaWZpZXJzICYmIG1vZGlmaWVycy5wcmV2ZW50ICYmIG1vZGlmaWVycy5wYXNzaXZlXG4gICkge1xuICAgIHdhcm4oXG4gICAgICAncGFzc2l2ZSBhbmQgcHJldmVudCBjYW5cXCd0IGJlIHVzZWQgdG9nZXRoZXIuICcgK1xuICAgICAgJ1Bhc3NpdmUgaGFuZGxlciBjYW5cXCd0IHByZXZlbnQgZGVmYXVsdCBldmVudC4nXG4gICAgKTtcbiAgfVxuICAvLyBjaGVjayBjYXB0dXJlIG1vZGlmaWVyXG4gIGlmIChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLmNhcHR1cmUpIHtcbiAgICBkZWxldGUgbW9kaWZpZXJzLmNhcHR1cmU7XG4gICAgbmFtZSA9ICchJyArIG5hbWU7IC8vIG1hcmsgdGhlIGV2ZW50IGFzIGNhcHR1cmVkXG4gIH1cbiAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMub25jZSkge1xuICAgIGRlbGV0ZSBtb2RpZmllcnMub25jZTtcbiAgICBuYW1lID0gJ34nICsgbmFtZTsgLy8gbWFyayB0aGUgZXZlbnQgYXMgb25jZVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAobW9kaWZpZXJzICYmIG1vZGlmaWVycy5wYXNzaXZlKSB7XG4gICAgZGVsZXRlIG1vZGlmaWVycy5wYXNzaXZlO1xuICAgIG5hbWUgPSAnJicgKyBuYW1lOyAvLyBtYXJrIHRoZSBldmVudCBhcyBwYXNzaXZlXG4gIH1cbiAgdmFyIGV2ZW50cztcbiAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMubmF0aXZlKSB7XG4gICAgZGVsZXRlIG1vZGlmaWVycy5uYXRpdmU7XG4gICAgZXZlbnRzID0gZWwubmF0aXZlRXZlbnRzIHx8IChlbC5uYXRpdmVFdmVudHMgPSB7fSk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzID0gZWwuZXZlbnRzIHx8IChlbC5ldmVudHMgPSB7fSk7XG4gIH1cbiAgdmFyIG5ld0hhbmRsZXIgPSB7IHZhbHVlOiB2YWx1ZSwgbW9kaWZpZXJzOiBtb2RpZmllcnMgfTtcbiAgdmFyIGhhbmRsZXJzID0gZXZlbnRzW25hbWVdO1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcnMpKSB7XG4gICAgaW1wb3J0YW50ID8gaGFuZGxlcnMudW5zaGlmdChuZXdIYW5kbGVyKSA6IGhhbmRsZXJzLnB1c2gobmV3SGFuZGxlcik7XG4gIH0gZWxzZSBpZiAoaGFuZGxlcnMpIHtcbiAgICBldmVudHNbbmFtZV0gPSBpbXBvcnRhbnQgPyBbbmV3SGFuZGxlciwgaGFuZGxlcnNdIDogW2hhbmRsZXJzLCBuZXdIYW5kbGVyXTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHNbbmFtZV0gPSBuZXdIYW5kbGVyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEJpbmRpbmdBdHRyIChcbiAgZWwsXG4gIG5hbWUsXG4gIGdldFN0YXRpY1xuKSB7XG4gIHZhciBkeW5hbWljVmFsdWUgPVxuICAgIGdldEFuZFJlbW92ZUF0dHIoZWwsICc6JyArIG5hbWUpIHx8XG4gICAgZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtYmluZDonICsgbmFtZSk7XG4gIGlmIChkeW5hbWljVmFsdWUgIT0gbnVsbCkge1xuICAgIHJldHVybiBwYXJzZUZpbHRlcnMoZHluYW1pY1ZhbHVlKVxuICB9IGVsc2UgaWYgKGdldFN0YXRpYyAhPT0gZmFsc2UpIHtcbiAgICB2YXIgc3RhdGljVmFsdWUgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCBuYW1lKTtcbiAgICBpZiAoc3RhdGljVmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0YXRpY1ZhbHVlKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRBbmRSZW1vdmVBdHRyIChlbCwgbmFtZSkge1xuICB2YXIgdmFsO1xuICBpZiAoKHZhbCA9IGVsLmF0dHJzTWFwW25hbWVdKSAhPSBudWxsKSB7XG4gICAgdmFyIGxpc3QgPSBlbC5hdHRyc0xpc3Q7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGxpc3RbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBDcm9zcy1wbGF0Zm9ybSBjb2RlIGdlbmVyYXRpb24gZm9yIGNvbXBvbmVudCB2LW1vZGVsXG4gKi9cbmZ1bmN0aW9uIGdlbkNvbXBvbmVudE1vZGVsIChcbiAgZWwsXG4gIHZhbHVlLFxuICBtb2RpZmllcnNcbikge1xuICB2YXIgcmVmID0gbW9kaWZpZXJzIHx8IHt9O1xuICB2YXIgbnVtYmVyID0gcmVmLm51bWJlcjtcbiAgdmFyIHRyaW0gPSByZWYudHJpbTtcblxuICB2YXIgYmFzZVZhbHVlRXhwcmVzc2lvbiA9ICckJHYnO1xuICB2YXIgdmFsdWVFeHByZXNzaW9uID0gYmFzZVZhbHVlRXhwcmVzc2lvbjtcbiAgaWYgKHRyaW0pIHtcbiAgICB2YWx1ZUV4cHJlc3Npb24gPVxuICAgICAgXCIodHlwZW9mIFwiICsgYmFzZVZhbHVlRXhwcmVzc2lvbiArIFwiID09PSAnc3RyaW5nJ1wiICtcbiAgICAgICAgXCI/IFwiICsgYmFzZVZhbHVlRXhwcmVzc2lvbiArIFwiLnRyaW0oKVwiICtcbiAgICAgICAgXCI6IFwiICsgYmFzZVZhbHVlRXhwcmVzc2lvbiArIFwiKVwiO1xuICB9XG4gIGlmIChudW1iZXIpIHtcbiAgICB2YWx1ZUV4cHJlc3Npb24gPSBcIl9uKFwiICsgdmFsdWVFeHByZXNzaW9uICsgXCIpXCI7XG4gIH1cbiAgdmFyIGFzc2lnbm1lbnQgPSBnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgdmFsdWVFeHByZXNzaW9uKTtcblxuICBlbC5tb2RlbCA9IHtcbiAgICB2YWx1ZTogKFwiKFwiICsgdmFsdWUgKyBcIilcIiksXG4gICAgZXhwcmVzc2lvbjogKFwiXFxcIlwiICsgdmFsdWUgKyBcIlxcXCJcIiksXG4gICAgY2FsbGJhY2s6IChcImZ1bmN0aW9uIChcIiArIGJhc2VWYWx1ZUV4cHJlc3Npb24gKyBcIikge1wiICsgYXNzaWdubWVudCArIFwifVwiKVxuICB9O1xufVxuXG4vKipcbiAqIENyb3NzLXBsYXRmb3JtIGNvZGVnZW4gaGVscGVyIGZvciBnZW5lcmF0aW5nIHYtbW9kZWwgdmFsdWUgYXNzaWdubWVudCBjb2RlLlxuICovXG5mdW5jdGlvbiBnZW5Bc3NpZ25tZW50Q29kZSAoXG4gIHZhbHVlLFxuICBhc3NpZ25tZW50XG4pIHtcbiAgdmFyIG1vZGVsUnMgPSBwYXJzZU1vZGVsKHZhbHVlKTtcbiAgaWYgKG1vZGVsUnMuaWR4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuICh2YWx1ZSArIFwiPVwiICsgYXNzaWdubWVudClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCJ2YXIgJCRleHAgPSBcIiArIChtb2RlbFJzLmV4cCkgKyBcIiwgJCRpZHggPSBcIiArIChtb2RlbFJzLmlkeCkgKyBcIjtcIiArXG4gICAgICBcImlmICghQXJyYXkuaXNBcnJheSgkJGV4cCkpe1wiICtcbiAgICAgICAgdmFsdWUgKyBcIj1cIiArIGFzc2lnbm1lbnQgKyBcIn1cIiArXG4gICAgICBcImVsc2V7JCRleHAuc3BsaWNlKCQkaWR4LCAxLCBcIiArIGFzc2lnbm1lbnQgKyBcIil9XCJcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlIGRpcmVjdGl2ZSBtb2RlbCB0byBkbyB0aGUgYXJyYXkgdXBkYXRlIHRyYW5zZm9ybS4gYVtpZHhdID0gdmFsID0+ICQkYS5zcGxpY2UoJCRpZHgsIDEsIHZhbClcbiAqXG4gKiBmb3IgbG9vcCBwb3NzaWJsZSBjYXNlczpcbiAqXG4gKiAtIHRlc3RcbiAqIC0gdGVzdFtpZHhdXG4gKiAtIHRlc3RbdGVzdDFbaWR4XV1cbiAqIC0gdGVzdFtcImFcIl1baWR4XVxuICogLSB4eHgudGVzdFthW2FdLnRlc3QxW2lkeF1dXG4gKiAtIHRlc3QueHh4LmFbXCJhc2FcIl1bdGVzdDFbaWR4XV1cbiAqXG4gKi9cblxudmFyIGxlbjtcbnZhciBzdHI7XG52YXIgY2hyO1xudmFyIGluZGV4JDE7XG52YXIgZXhwcmVzc2lvblBvcztcbnZhciBleHByZXNzaW9uRW5kUG9zO1xuXG5mdW5jdGlvbiBwYXJzZU1vZGVsICh2YWwpIHtcbiAgc3RyID0gdmFsO1xuICBsZW4gPSBzdHIubGVuZ3RoO1xuICBpbmRleCQxID0gZXhwcmVzc2lvblBvcyA9IGV4cHJlc3Npb25FbmRQb3MgPSAwO1xuXG4gIGlmICh2YWwuaW5kZXhPZignWycpIDwgMCB8fCB2YWwubGFzdEluZGV4T2YoJ10nKSA8IGxlbiAtIDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwOiB2YWwsXG4gICAgICBpZHg6IG51bGxcbiAgICB9XG4gIH1cblxuICB3aGlsZSAoIWVvZigpKSB7XG4gICAgY2hyID0gbmV4dCgpO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpc1N0cmluZ1N0YXJ0KGNocikpIHtcbiAgICAgIHBhcnNlU3RyaW5nKGNocik7XG4gICAgfSBlbHNlIGlmIChjaHIgPT09IDB4NUIpIHtcbiAgICAgIHBhcnNlQnJhY2tldChjaHIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXhwOiB2YWwuc3Vic3RyaW5nKDAsIGV4cHJlc3Npb25Qb3MpLFxuICAgIGlkeDogdmFsLnN1YnN0cmluZyhleHByZXNzaW9uUG9zICsgMSwgZXhwcmVzc2lvbkVuZFBvcylcbiAgfVxufVxuXG5mdW5jdGlvbiBuZXh0ICgpIHtcbiAgcmV0dXJuIHN0ci5jaGFyQ29kZUF0KCsraW5kZXgkMSlcbn1cblxuZnVuY3Rpb24gZW9mICgpIHtcbiAgcmV0dXJuIGluZGV4JDEgPj0gbGVuXG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nU3RhcnQgKGNocikge1xuICByZXR1cm4gY2hyID09PSAweDIyIHx8IGNociA9PT0gMHgyN1xufVxuXG5mdW5jdGlvbiBwYXJzZUJyYWNrZXQgKGNocikge1xuICB2YXIgaW5CcmFja2V0ID0gMTtcbiAgZXhwcmVzc2lvblBvcyA9IGluZGV4JDE7XG4gIHdoaWxlICghZW9mKCkpIHtcbiAgICBjaHIgPSBuZXh0KCk7XG4gICAgaWYgKGlzU3RyaW5nU3RhcnQoY2hyKSkge1xuICAgICAgcGFyc2VTdHJpbmcoY2hyKTtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICAgIGlmIChjaHIgPT09IDB4NUIpIHsgaW5CcmFja2V0Kys7IH1cbiAgICBpZiAoY2hyID09PSAweDVEKSB7IGluQnJhY2tldC0tOyB9XG4gICAgaWYgKGluQnJhY2tldCA9PT0gMCkge1xuICAgICAgZXhwcmVzc2lvbkVuZFBvcyA9IGluZGV4JDE7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyAoY2hyKSB7XG4gIHZhciBzdHJpbmdRdW90ZSA9IGNocjtcbiAgd2hpbGUgKCFlb2YoKSkge1xuICAgIGNociA9IG5leHQoKTtcbiAgICBpZiAoY2hyID09PSBzdHJpbmdRdW90ZSkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cbnZhciB3YXJuJDE7XG5cbi8vIGluIHNvbWUgY2FzZXMsIHRoZSBldmVudCB1c2VkIGhhcyB0byBiZSBkZXRlcm1pbmVkIGF0IHJ1bnRpbWVcbi8vIHNvIHdlIHVzZWQgc29tZSByZXNlcnZlZCB0b2tlbnMgZHVyaW5nIGNvbXBpbGUuXG52YXIgUkFOR0VfVE9LRU4gPSAnX19yJztcbnZhciBDSEVDS0JPWF9SQURJT19UT0tFTiA9ICdfX2MnO1xuXG5mdW5jdGlvbiBtb2RlbCAoXG4gIGVsLFxuICBkaXIsXG4gIF93YXJuXG4pIHtcbiAgd2FybiQxID0gX3dhcm47XG4gIHZhciB2YWx1ZSA9IGRpci52YWx1ZTtcbiAgdmFyIG1vZGlmaWVycyA9IGRpci5tb2RpZmllcnM7XG4gIHZhciB0YWcgPSBlbC50YWc7XG4gIHZhciB0eXBlID0gZWwuYXR0cnNNYXAudHlwZTtcblxuICB7XG4gICAgdmFyIGR5bmFtaWNUeXBlID0gZWwuYXR0cnNNYXBbJ3YtYmluZDp0eXBlJ10gfHwgZWwuYXR0cnNNYXBbJzp0eXBlJ107XG4gICAgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiBkeW5hbWljVHlwZSkge1xuICAgICAgd2FybiQxKFxuICAgICAgICBcIjxpbnB1dCA6dHlwZT1cXFwiXCIgKyBkeW5hbWljVHlwZSArIFwiXFxcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiPjpcXG5cIiArXG4gICAgICAgIFwidi1tb2RlbCBkb2VzIG5vdCBzdXBwb3J0IGR5bmFtaWMgaW5wdXQgdHlwZXMuIFVzZSB2LWlmIGJyYW5jaGVzIGluc3RlYWQuXCJcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIGlucHV0cyB3aXRoIHR5cGU9XCJmaWxlXCIgYXJlIHJlYWQgb25seSBhbmQgc2V0dGluZyB0aGUgaW5wdXQnc1xuICAgIC8vIHZhbHVlIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiB0eXBlID09PSAnZmlsZScpIHtcbiAgICAgIHdhcm4kMShcbiAgICAgICAgXCI8XCIgKyAoZWwudGFnKSArIFwiIHYtbW9kZWw9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCIgdHlwZT1cXFwiZmlsZVxcXCI+OlxcblwiICtcbiAgICAgICAgXCJGaWxlIGlucHV0cyBhcmUgcmVhZCBvbmx5LiBVc2UgYSB2LW9uOmNoYW5nZSBsaXN0ZW5lciBpbnN0ZWFkLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0YWcgPT09ICdzZWxlY3QnKSB7XG4gICAgZ2VuU2VsZWN0KGVsLCB2YWx1ZSwgbW9kaWZpZXJzKTtcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgIGdlbkNoZWNrYm94TW9kZWwoZWwsIHZhbHVlLCBtb2RpZmllcnMpO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ2lucHV0JyAmJiB0eXBlID09PSAncmFkaW8nKSB7XG4gICAgZ2VuUmFkaW9Nb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XG4gIH0gZWxzZSBpZiAodGFnID09PSAnaW5wdXQnIHx8IHRhZyA9PT0gJ3RleHRhcmVhJykge1xuICAgIGdlbkRlZmF1bHRNb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XG4gIH0gZWxzZSBpZiAoIWNvbmZpZy5pc1Jlc2VydmVkVGFnKHRhZykpIHtcbiAgICBnZW5Db21wb25lbnRNb2RlbChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XG4gICAgLy8gY29tcG9uZW50IHYtbW9kZWwgZG9lc24ndCBuZWVkIGV4dHJhIHJ1bnRpbWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICB3YXJuJDEoXG4gICAgICBcIjxcIiArIChlbC50YWcpICsgXCIgdi1tb2RlbD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj46IFwiICtcbiAgICAgIFwidi1tb2RlbCBpcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgZWxlbWVudCB0eXBlLiBcIiArXG4gICAgICAnSWYgeW91IGFyZSB3b3JraW5nIHdpdGggY29udGVudGVkaXRhYmxlLCBpdFxcJ3MgcmVjb21tZW5kZWQgdG8gJyArXG4gICAgICAnd3JhcCBhIGxpYnJhcnkgZGVkaWNhdGVkIGZvciB0aGF0IHB1cnBvc2UgaW5zaWRlIGEgY3VzdG9tIGNvbXBvbmVudC4nXG4gICAgKTtcbiAgfVxuXG4gIC8vIGVuc3VyZSBydW50aW1lIGRpcmVjdGl2ZSBtZXRhZGF0YVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBnZW5DaGVja2JveE1vZGVsIChcbiAgZWwsXG4gIHZhbHVlLFxuICBtb2RpZmllcnNcbikge1xuICB2YXIgbnVtYmVyID0gbW9kaWZpZXJzICYmIG1vZGlmaWVycy5udW1iZXI7XG4gIHZhciB2YWx1ZUJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ3ZhbHVlJykgfHwgJ251bGwnO1xuICB2YXIgdHJ1ZVZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAndHJ1ZS12YWx1ZScpIHx8ICd0cnVlJztcbiAgdmFyIGZhbHNlVmFsdWVCaW5kaW5nID0gZ2V0QmluZGluZ0F0dHIoZWwsICdmYWxzZS12YWx1ZScpIHx8ICdmYWxzZSc7XG4gIGFkZFByb3AoZWwsICdjaGVja2VkJyxcbiAgICBcIkFycmF5LmlzQXJyYXkoXCIgKyB2YWx1ZSArIFwiKVwiICtcbiAgICAgIFwiP19pKFwiICsgdmFsdWUgKyBcIixcIiArIHZhbHVlQmluZGluZyArIFwiKT4tMVwiICsgKFxuICAgICAgICB0cnVlVmFsdWVCaW5kaW5nID09PSAndHJ1ZSdcbiAgICAgICAgICA/IChcIjooXCIgKyB2YWx1ZSArIFwiKVwiKVxuICAgICAgICAgIDogKFwiOl9xKFwiICsgdmFsdWUgKyBcIixcIiArIHRydWVWYWx1ZUJpbmRpbmcgKyBcIilcIilcbiAgICAgIClcbiAgKTtcbiAgYWRkSGFuZGxlcihlbCwgQ0hFQ0tCT1hfUkFESU9fVE9LRU4sXG4gICAgXCJ2YXIgJCRhPVwiICsgdmFsdWUgKyBcIixcIiArXG4gICAgICAgICckJGVsPSRldmVudC50YXJnZXQsJyArXG4gICAgICAgIFwiJCRjPSQkZWwuY2hlY2tlZD8oXCIgKyB0cnVlVmFsdWVCaW5kaW5nICsgXCIpOihcIiArIGZhbHNlVmFsdWVCaW5kaW5nICsgXCIpO1wiICtcbiAgICAnaWYoQXJyYXkuaXNBcnJheSgkJGEpKXsnICtcbiAgICAgIFwidmFyICQkdj1cIiArIChudW1iZXIgPyAnX24oJyArIHZhbHVlQmluZGluZyArICcpJyA6IHZhbHVlQmluZGluZykgKyBcIixcIiArXG4gICAgICAgICAgJyQkaT1faSgkJGEsJCR2KTsnICtcbiAgICAgIFwiaWYoJCRjKXskJGk8MCYmKFwiICsgdmFsdWUgKyBcIj0kJGEuY29uY2F0KCQkdikpfVwiICtcbiAgICAgIFwiZWxzZXskJGk+LTEmJihcIiArIHZhbHVlICsgXCI9JCRhLnNsaWNlKDAsJCRpKS5jb25jYXQoJCRhLnNsaWNlKCQkaSsxKSkpfVwiICtcbiAgICBcIn1lbHNle1wiICsgKGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCAnJCRjJykpICsgXCJ9XCIsXG4gICAgbnVsbCwgdHJ1ZVxuICApO1xufVxuXG5mdW5jdGlvbiBnZW5SYWRpb01vZGVsIChcbiAgICBlbCxcbiAgICB2YWx1ZSxcbiAgICBtb2RpZmllcnNcbikge1xuICB2YXIgbnVtYmVyID0gbW9kaWZpZXJzICYmIG1vZGlmaWVycy5udW1iZXI7XG4gIHZhciB2YWx1ZUJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ3ZhbHVlJykgfHwgJ251bGwnO1xuICB2YWx1ZUJpbmRpbmcgPSBudW1iZXIgPyAoXCJfbihcIiArIHZhbHVlQmluZGluZyArIFwiKVwiKSA6IHZhbHVlQmluZGluZztcbiAgYWRkUHJvcChlbCwgJ2NoZWNrZWQnLCAoXCJfcShcIiArIHZhbHVlICsgXCIsXCIgKyB2YWx1ZUJpbmRpbmcgKyBcIilcIikpO1xuICBhZGRIYW5kbGVyKGVsLCBDSEVDS0JPWF9SQURJT19UT0tFTiwgZ2VuQXNzaWdubWVudENvZGUodmFsdWUsIHZhbHVlQmluZGluZyksIG51bGwsIHRydWUpO1xufVxuXG5mdW5jdGlvbiBnZW5TZWxlY3QgKFxuICAgIGVsLFxuICAgIHZhbHVlLFxuICAgIG1vZGlmaWVyc1xuKSB7XG4gIHZhciBudW1iZXIgPSBtb2RpZmllcnMgJiYgbW9kaWZpZXJzLm51bWJlcjtcbiAgdmFyIHNlbGVjdGVkVmFsID0gXCJBcnJheS5wcm90b3R5cGUuZmlsdGVyXCIgK1xuICAgIFwiLmNhbGwoJGV2ZW50LnRhcmdldC5vcHRpb25zLGZ1bmN0aW9uKG8pe3JldHVybiBvLnNlbGVjdGVkfSlcIiArXG4gICAgXCIubWFwKGZ1bmN0aW9uKG8pe3ZhciB2YWwgPSBcXFwiX3ZhbHVlXFxcIiBpbiBvID8gby5fdmFsdWUgOiBvLnZhbHVlO1wiICtcbiAgICBcInJldHVybiBcIiArIChudW1iZXIgPyAnX24odmFsKScgOiAndmFsJykgKyBcIn0pXCI7XG5cbiAgdmFyIGFzc2lnbm1lbnQgPSAnJGV2ZW50LnRhcmdldC5tdWx0aXBsZSA/ICQkc2VsZWN0ZWRWYWwgOiAkJHNlbGVjdGVkVmFsWzBdJztcbiAgdmFyIGNvZGUgPSBcInZhciAkJHNlbGVjdGVkVmFsID0gXCIgKyBzZWxlY3RlZFZhbCArIFwiO1wiO1xuICBjb2RlID0gY29kZSArIFwiIFwiICsgKGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCBhc3NpZ25tZW50KSk7XG4gIGFkZEhhbmRsZXIoZWwsICdjaGFuZ2UnLCBjb2RlLCBudWxsLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gZ2VuRGVmYXVsdE1vZGVsIChcbiAgZWwsXG4gIHZhbHVlLFxuICBtb2RpZmllcnNcbikge1xuICB2YXIgdHlwZSA9IGVsLmF0dHJzTWFwLnR5cGU7XG4gIHZhciByZWYgPSBtb2RpZmllcnMgfHwge307XG4gIHZhciBsYXp5ID0gcmVmLmxhenk7XG4gIHZhciBudW1iZXIgPSByZWYubnVtYmVyO1xuICB2YXIgdHJpbSA9IHJlZi50cmltO1xuICB2YXIgbmVlZENvbXBvc2l0aW9uR3VhcmQgPSAhbGF6eSAmJiB0eXBlICE9PSAncmFuZ2UnO1xuICB2YXIgZXZlbnQgPSBsYXp5XG4gICAgPyAnY2hhbmdlJ1xuICAgIDogdHlwZSA9PT0gJ3JhbmdlJ1xuICAgICAgPyBSQU5HRV9UT0tFTlxuICAgICAgOiAnaW5wdXQnO1xuXG4gIHZhciB2YWx1ZUV4cHJlc3Npb24gPSAnJGV2ZW50LnRhcmdldC52YWx1ZSc7XG4gIGlmICh0cmltKSB7XG4gICAgdmFsdWVFeHByZXNzaW9uID0gXCIkZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKVwiO1xuICB9XG4gIGlmIChudW1iZXIpIHtcbiAgICB2YWx1ZUV4cHJlc3Npb24gPSBcIl9uKFwiICsgdmFsdWVFeHByZXNzaW9uICsgXCIpXCI7XG4gIH1cblxuICB2YXIgY29kZSA9IGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCB2YWx1ZUV4cHJlc3Npb24pO1xuICBpZiAobmVlZENvbXBvc2l0aW9uR3VhcmQpIHtcbiAgICBjb2RlID0gXCJpZigkZXZlbnQudGFyZ2V0LmNvbXBvc2luZylyZXR1cm47XCIgKyBjb2RlO1xuICB9XG5cbiAgYWRkUHJvcChlbCwgJ3ZhbHVlJywgKFwiKFwiICsgdmFsdWUgKyBcIilcIikpO1xuICBhZGRIYW5kbGVyKGVsLCBldmVudCwgY29kZSwgbnVsbCwgdHJ1ZSk7XG4gIGlmICh0cmltIHx8IG51bWJlciB8fCB0eXBlID09PSAnbnVtYmVyJykge1xuICAgIGFkZEhhbmRsZXIoZWwsICdibHVyJywgJyRmb3JjZVVwZGF0ZSgpJyk7XG4gIH1cbn1cblxuLyogICovXG5cbi8vIG5vcm1hbGl6ZSB2LW1vZGVsIGV2ZW50IHRva2VucyB0aGF0IGNhbiBvbmx5IGJlIGRldGVybWluZWQgYXQgcnVudGltZS5cbi8vIGl0J3MgaW1wb3J0YW50IHRvIHBsYWNlIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgaW4gdGhlIGFycmF5IGJlY2F1c2Vcbi8vIHRoZSB3aG9sZSBwb2ludCBpcyBlbnN1cmluZyB0aGUgdi1tb2RlbCBjYWxsYmFjayBnZXRzIGNhbGxlZCBiZWZvcmVcbi8vIHVzZXItYXR0YWNoZWQgaGFuZGxlcnMuXG5mdW5jdGlvbiBub3JtYWxpemVFdmVudHMgKG9uKSB7XG4gIHZhciBldmVudDtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc0RlZihvbltSQU5HRV9UT0tFTl0pKSB7XG4gICAgLy8gSUUgaW5wdXRbdHlwZT1yYW5nZV0gb25seSBzdXBwb3J0cyBgY2hhbmdlYCBldmVudFxuICAgIGV2ZW50ID0gaXNJRSA/ICdjaGFuZ2UnIDogJ2lucHV0JztcbiAgICBvbltldmVudF0gPSBbXS5jb25jYXQob25bUkFOR0VfVE9LRU5dLCBvbltldmVudF0gfHwgW10pO1xuICAgIGRlbGV0ZSBvbltSQU5HRV9UT0tFTl07XG4gIH1cbiAgaWYgKGlzRGVmKG9uW0NIRUNLQk9YX1JBRElPX1RPS0VOXSkpIHtcbiAgICAvLyBDaHJvbWUgZmlyZXMgbWljcm90YXNrcyBpbiBiZXR3ZWVuIGNsaWNrL2NoYW5nZSwgbGVhZHMgdG8gIzQ1MjFcbiAgICBldmVudCA9IGlzQ2hyb21lID8gJ2NsaWNrJyA6ICdjaGFuZ2UnO1xuICAgIG9uW2V2ZW50XSA9IFtdLmNvbmNhdChvbltDSEVDS0JPWF9SQURJT19UT0tFTl0sIG9uW2V2ZW50XSB8fCBbXSk7XG4gICAgZGVsZXRlIG9uW0NIRUNLQk9YX1JBRElPX1RPS0VOXTtcbiAgfVxufVxuXG52YXIgdGFyZ2V0JDE7XG5cbmZ1bmN0aW9uIGFkZCQxIChcbiAgZXZlbnQsXG4gIGhhbmRsZXIsXG4gIG9uY2UkJDEsXG4gIGNhcHR1cmUsXG4gIHBhc3NpdmVcbikge1xuICBpZiAob25jZSQkMSkge1xuICAgIHZhciBvbGRIYW5kbGVyID0gaGFuZGxlcjtcbiAgICB2YXIgX3RhcmdldCA9IHRhcmdldCQxOyAvLyBzYXZlIGN1cnJlbnQgdGFyZ2V0IGVsZW1lbnQgaW4gY2xvc3VyZVxuICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIHZhciByZXMgPSBhcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgICAgID8gb2xkSGFuZGxlcihldilcbiAgICAgICAgOiBvbGRIYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICBpZiAocmVzICE9PSBudWxsKSB7XG4gICAgICAgIHJlbW92ZSQyKGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlLCBfdGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHRhcmdldCQxLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgZXZlbnQsXG4gICAgaGFuZGxlcixcbiAgICBzdXBwb3J0c1Bhc3NpdmVcbiAgICAgID8geyBjYXB0dXJlOiBjYXB0dXJlLCBwYXNzaXZlOiBwYXNzaXZlIH1cbiAgICAgIDogY2FwdHVyZVxuICApO1xufVxuXG5mdW5jdGlvbiByZW1vdmUkMiAoXG4gIGV2ZW50LFxuICBoYW5kbGVyLFxuICBjYXB0dXJlLFxuICBfdGFyZ2V0XG4pIHtcbiAgKF90YXJnZXQgfHwgdGFyZ2V0JDEpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVET01MaXN0ZW5lcnMgKG9sZFZub2RlLCB2bm9kZSkge1xuICBpZiAoaXNVbmRlZihvbGRWbm9kZS5kYXRhLm9uKSAmJiBpc1VuZGVmKHZub2RlLmRhdGEub24pKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIG9uID0gdm5vZGUuZGF0YS5vbiB8fCB7fTtcbiAgdmFyIG9sZE9uID0gb2xkVm5vZGUuZGF0YS5vbiB8fCB7fTtcbiAgdGFyZ2V0JDEgPSB2bm9kZS5lbG07XG4gIG5vcm1hbGl6ZUV2ZW50cyhvbik7XG4gIHVwZGF0ZUxpc3RlbmVycyhvbiwgb2xkT24sIGFkZCQxLCByZW1vdmUkMiwgdm5vZGUuY29udGV4dCk7XG59XG5cbnZhciBldmVudHMgPSB7XG4gIGNyZWF0ZTogdXBkYXRlRE9NTGlzdGVuZXJzLFxuICB1cGRhdGU6IHVwZGF0ZURPTUxpc3RlbmVyc1xufTtcblxuLyogICovXG5cbmZ1bmN0aW9uIHVwZGF0ZURPTVByb3BzIChvbGRWbm9kZSwgdm5vZGUpIHtcbiAgaWYgKGlzVW5kZWYob2xkVm5vZGUuZGF0YS5kb21Qcm9wcykgJiYgaXNVbmRlZih2bm9kZS5kYXRhLmRvbVByb3BzKSkge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBrZXksIGN1cjtcbiAgdmFyIGVsbSA9IHZub2RlLmVsbTtcbiAgdmFyIG9sZFByb3BzID0gb2xkVm5vZGUuZGF0YS5kb21Qcm9wcyB8fCB7fTtcbiAgdmFyIHByb3BzID0gdm5vZGUuZGF0YS5kb21Qcm9wcyB8fCB7fTtcbiAgLy8gY2xvbmUgb2JzZXJ2ZWQgb2JqZWN0cywgYXMgdGhlIHVzZXIgcHJvYmFibHkgd2FudHMgdG8gbXV0YXRlIGl0XG4gIGlmIChpc0RlZihwcm9wcy5fX29iX18pKSB7XG4gICAgcHJvcHMgPSB2bm9kZS5kYXRhLmRvbVByb3BzID0gZXh0ZW5kKHt9LCBwcm9wcyk7XG4gIH1cblxuICBmb3IgKGtleSBpbiBvbGRQcm9wcykge1xuICAgIGlmIChpc1VuZGVmKHByb3BzW2tleV0pKSB7XG4gICAgICBlbG1ba2V5XSA9ICcnO1xuICAgIH1cbiAgfVxuICBmb3IgKGtleSBpbiBwcm9wcykge1xuICAgIGN1ciA9IHByb3BzW2tleV07XG4gICAgLy8gaWdub3JlIGNoaWxkcmVuIGlmIHRoZSBub2RlIGhhcyB0ZXh0Q29udGVudCBvciBpbm5lckhUTUwsXG4gICAgLy8gYXMgdGhlc2Ugd2lsbCB0aHJvdyBhd2F5IGV4aXN0aW5nIERPTSBub2RlcyBhbmQgY2F1c2UgcmVtb3ZhbCBlcnJvcnNcbiAgICAvLyBvbiBzdWJzZXF1ZW50IHBhdGNoZXMgKCMzMzYwKVxuICAgIGlmIChrZXkgPT09ICd0ZXh0Q29udGVudCcgfHwga2V5ID09PSAnaW5uZXJIVE1MJykge1xuICAgICAgaWYgKHZub2RlLmNoaWxkcmVuKSB7IHZub2RlLmNoaWxkcmVuLmxlbmd0aCA9IDA7IH1cbiAgICAgIGlmIChjdXIgPT09IG9sZFByb3BzW2tleV0pIHsgY29udGludWUgfVxuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICd2YWx1ZScpIHtcbiAgICAgIC8vIHN0b3JlIHZhbHVlIGFzIF92YWx1ZSBhcyB3ZWxsIHNpbmNlXG4gICAgICAvLyBub24tc3RyaW5nIHZhbHVlcyB3aWxsIGJlIHN0cmluZ2lmaWVkXG4gICAgICBlbG0uX3ZhbHVlID0gY3VyO1xuICAgICAgLy8gYXZvaWQgcmVzZXR0aW5nIGN1cnNvciBwb3NpdGlvbiB3aGVuIHZhbHVlIGlzIHRoZSBzYW1lXG4gICAgICB2YXIgc3RyQ3VyID0gaXNVbmRlZihjdXIpID8gJycgOiBTdHJpbmcoY3VyKTtcbiAgICAgIGlmIChzaG91bGRVcGRhdGVWYWx1ZShlbG0sIHZub2RlLCBzdHJDdXIpKSB7XG4gICAgICAgIGVsbS52YWx1ZSA9IHN0ckN1cjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxtW2tleV0gPSBjdXI7XG4gICAgfVxuICB9XG59XG5cbi8vIGNoZWNrIHBsYXRmb3Jtcy93ZWIvdXRpbC9hdHRycy5qcyBhY2NlcHRWYWx1ZVxuXG5cbmZ1bmN0aW9uIHNob3VsZFVwZGF0ZVZhbHVlIChcbiAgZWxtLFxuICB2bm9kZSxcbiAgY2hlY2tWYWxcbikge1xuICByZXR1cm4gKCFlbG0uY29tcG9zaW5nICYmIChcbiAgICB2bm9kZS50YWcgPT09ICdvcHRpb24nIHx8XG4gICAgaXNEaXJ0eShlbG0sIGNoZWNrVmFsKSB8fFxuICAgIGlzSW5wdXRDaGFuZ2VkKGVsbSwgY2hlY2tWYWwpXG4gICkpXG59XG5cbmZ1bmN0aW9uIGlzRGlydHkgKGVsbSwgY2hlY2tWYWwpIHtcbiAgLy8gcmV0dXJuIHRydWUgd2hlbiB0ZXh0Ym94ICgubnVtYmVyIGFuZCAudHJpbSkgbG9zZXMgZm9jdXMgYW5kIGl0cyB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdGhlIHVwZGF0ZWQgdmFsdWVcbiAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVsbSAmJiBlbG0udmFsdWUgIT09IGNoZWNrVmFsXG59XG5cbmZ1bmN0aW9uIGlzSW5wdXRDaGFuZ2VkIChlbG0sIG5ld1ZhbCkge1xuICB2YXIgdmFsdWUgPSBlbG0udmFsdWU7XG4gIHZhciBtb2RpZmllcnMgPSBlbG0uX3ZNb2RpZmllcnM7IC8vIGluamVjdGVkIGJ5IHYtbW9kZWwgcnVudGltZVxuICBpZiAoKGlzRGVmKG1vZGlmaWVycykgJiYgbW9kaWZpZXJzLm51bWJlcikgfHwgZWxtLnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHRvTnVtYmVyKHZhbHVlKSAhPT0gdG9OdW1iZXIobmV3VmFsKVxuICB9XG4gIGlmIChpc0RlZihtb2RpZmllcnMpICYmIG1vZGlmaWVycy50cmltKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRyaW0oKSAhPT0gbmV3VmFsLnRyaW0oKVxuICB9XG4gIHJldHVybiB2YWx1ZSAhPT0gbmV3VmFsXG59XG5cbnZhciBkb21Qcm9wcyA9IHtcbiAgY3JlYXRlOiB1cGRhdGVET01Qcm9wcyxcbiAgdXBkYXRlOiB1cGRhdGVET01Qcm9wc1xufTtcblxuLyogICovXG5cbnZhciBwYXJzZVN0eWxlVGV4dCA9IGNhY2hlZChmdW5jdGlvbiAoY3NzVGV4dCkge1xuICB2YXIgcmVzID0ge307XG4gIHZhciBsaXN0RGVsaW1pdGVyID0gLzsoPyFbXihdKlxcKSkvZztcbiAgdmFyIHByb3BlcnR5RGVsaW1pdGVyID0gLzooLispLztcbiAgY3NzVGV4dC5zcGxpdChsaXN0RGVsaW1pdGVyKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIHZhciB0bXAgPSBpdGVtLnNwbGl0KHByb3BlcnR5RGVsaW1pdGVyKTtcbiAgICAgIHRtcC5sZW5ndGggPiAxICYmIChyZXNbdG1wWzBdLnRyaW0oKV0gPSB0bXBbMV0udHJpbSgpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzXG59KTtcblxuLy8gbWVyZ2Ugc3RhdGljIGFuZCBkeW5hbWljIHN0eWxlIGRhdGEgb24gdGhlIHNhbWUgdm5vZGVcbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlRGF0YSAoZGF0YSkge1xuICB2YXIgc3R5bGUgPSBub3JtYWxpemVTdHlsZUJpbmRpbmcoZGF0YS5zdHlsZSk7XG4gIC8vIHN0YXRpYyBzdHlsZSBpcyBwcmUtcHJvY2Vzc2VkIGludG8gYW4gb2JqZWN0IGR1cmluZyBjb21waWxhdGlvblxuICAvLyBhbmQgaXMgYWx3YXlzIGEgZnJlc2ggb2JqZWN0LCBzbyBpdCdzIHNhZmUgdG8gbWVyZ2UgaW50byBpdFxuICByZXR1cm4gZGF0YS5zdGF0aWNTdHlsZVxuICAgID8gZXh0ZW5kKGRhdGEuc3RhdGljU3R5bGUsIHN0eWxlKVxuICAgIDogc3R5bGVcbn1cblxuLy8gbm9ybWFsaXplIHBvc3NpYmxlIGFycmF5IC8gc3RyaW5nIHZhbHVlcyBpbnRvIE9iamVjdFxuZnVuY3Rpb24gbm9ybWFsaXplU3R5bGVCaW5kaW5nIChiaW5kaW5nU3R5bGUpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYmluZGluZ1N0eWxlKSkge1xuICAgIHJldHVybiB0b09iamVjdChiaW5kaW5nU3R5bGUpXG4gIH1cbiAgaWYgKHR5cGVvZiBiaW5kaW5nU3R5bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHBhcnNlU3R5bGVUZXh0KGJpbmRpbmdTdHlsZSlcbiAgfVxuICByZXR1cm4gYmluZGluZ1N0eWxlXG59XG5cbi8qKlxuICogcGFyZW50IGNvbXBvbmVudCBzdHlsZSBzaG91bGQgYmUgYWZ0ZXIgY2hpbGQnc1xuICogc28gdGhhdCBwYXJlbnQgY29tcG9uZW50J3Mgc3R5bGUgY291bGQgb3ZlcnJpZGUgaXRcbiAqL1xuZnVuY3Rpb24gZ2V0U3R5bGUgKHZub2RlLCBjaGVja0NoaWxkKSB7XG4gIHZhciByZXMgPSB7fTtcbiAgdmFyIHN0eWxlRGF0YTtcblxuICBpZiAoY2hlY2tDaGlsZCkge1xuICAgIHZhciBjaGlsZE5vZGUgPSB2bm9kZTtcbiAgICB3aGlsZSAoY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlKSB7XG4gICAgICBjaGlsZE5vZGUgPSBjaGlsZE5vZGUuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlO1xuICAgICAgaWYgKGNoaWxkTm9kZS5kYXRhICYmIChzdHlsZURhdGEgPSBub3JtYWxpemVTdHlsZURhdGEoY2hpbGROb2RlLmRhdGEpKSkge1xuICAgICAgICBleHRlbmQocmVzLCBzdHlsZURhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICgoc3R5bGVEYXRhID0gbm9ybWFsaXplU3R5bGVEYXRhKHZub2RlLmRhdGEpKSkge1xuICAgIGV4dGVuZChyZXMsIHN0eWxlRGF0YSk7XG4gIH1cblxuICB2YXIgcGFyZW50Tm9kZSA9IHZub2RlO1xuICB3aGlsZSAoKHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudCkpIHtcbiAgICBpZiAocGFyZW50Tm9kZS5kYXRhICYmIChzdHlsZURhdGEgPSBub3JtYWxpemVTdHlsZURhdGEocGFyZW50Tm9kZS5kYXRhKSkpIHtcbiAgICAgIGV4dGVuZChyZXMsIHN0eWxlRGF0YSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyogICovXG5cbnZhciBjc3NWYXJSRSA9IC9eLS0vO1xudmFyIGltcG9ydGFudFJFID0gL1xccyohaW1wb3J0YW50JC87XG52YXIgc2V0UHJvcCA9IGZ1bmN0aW9uIChlbCwgbmFtZSwgdmFsKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoY3NzVmFyUkUudGVzdChuYW1lKSkge1xuICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbCk7XG4gIH0gZWxzZSBpZiAoaW1wb3J0YW50UkUudGVzdCh2YWwpKSB7XG4gICAgZWwuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsLnJlcGxhY2UoaW1wb3J0YW50UkUsICcnKSwgJ2ltcG9ydGFudCcpO1xuICB9IGVsc2Uge1xuICAgIHZhciBub3JtYWxpemVkTmFtZSA9IG5vcm1hbGl6ZShuYW1lKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAvLyBTdXBwb3J0IHZhbHVlcyBhcnJheSBjcmVhdGVkIGJ5IGF1dG9wcmVmaXhlciwgZS5nLlxuICAgICAgLy8ge2Rpc3BsYXk6IFtcIi13ZWJraXQtYm94XCIsIFwiLW1zLWZsZXhib3hcIiwgXCJmbGV4XCJdfVxuICAgICAgLy8gU2V0IHRoZW0gb25lIGJ5IG9uZSwgYW5kIHRoZSBicm93c2VyIHdpbGwgb25seSBzZXQgdGhvc2UgaXQgY2FuIHJlY29nbml6ZVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBlbC5zdHlsZVtub3JtYWxpemVkTmFtZV0gPSB2YWxbaV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnN0eWxlW25vcm1hbGl6ZWROYW1lXSA9IHZhbDtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcyddO1xuXG52YXIgdGVzdEVsO1xudmFyIG5vcm1hbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAocHJvcCkge1xuICB0ZXN0RWwgPSB0ZXN0RWwgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHByb3AgPSBjYW1lbGl6ZShwcm9wKTtcbiAgaWYgKHByb3AgIT09ICdmaWx0ZXInICYmIChwcm9wIGluIHRlc3RFbC5zdHlsZSkpIHtcbiAgICByZXR1cm4gcHJvcFxuICB9XG4gIHZhciB1cHBlciA9IHByb3AuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wLnNsaWNlKDEpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHByZWZpeGVkID0gcHJlZml4ZXNbaV0gKyB1cHBlcjtcbiAgICBpZiAocHJlZml4ZWQgaW4gdGVzdEVsLnN0eWxlKSB7XG4gICAgICByZXR1cm4gcHJlZml4ZWRcbiAgICB9XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiB1cGRhdGVTdHlsZSAob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgdmFyIG9sZERhdGEgPSBvbGRWbm9kZS5kYXRhO1xuXG4gIGlmIChpc1VuZGVmKGRhdGEuc3RhdGljU3R5bGUpICYmIGlzVW5kZWYoZGF0YS5zdHlsZSkgJiZcbiAgICBpc1VuZGVmKG9sZERhdGEuc3RhdGljU3R5bGUpICYmIGlzVW5kZWYob2xkRGF0YS5zdHlsZSlcbiAgKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgY3VyLCBuYW1lO1xuICB2YXIgZWwgPSB2bm9kZS5lbG07XG4gIHZhciBvbGRTdGF0aWNTdHlsZSA9IG9sZERhdGEuc3RhdGljU3R5bGU7XG4gIHZhciBvbGRTdHlsZUJpbmRpbmcgPSBvbGREYXRhLm5vcm1hbGl6ZWRTdHlsZSB8fCBvbGREYXRhLnN0eWxlIHx8IHt9O1xuXG4gIC8vIGlmIHN0YXRpYyBzdHlsZSBleGlzdHMsIHN0eWxlYmluZGluZyBhbHJlYWR5IG1lcmdlZCBpbnRvIGl0IHdoZW4gZG9pbmcgbm9ybWFsaXplU3R5bGVEYXRhXG4gIHZhciBvbGRTdHlsZSA9IG9sZFN0YXRpY1N0eWxlIHx8IG9sZFN0eWxlQmluZGluZztcblxuICB2YXIgc3R5bGUgPSBub3JtYWxpemVTdHlsZUJpbmRpbmcodm5vZGUuZGF0YS5zdHlsZSkgfHwge307XG5cbiAgLy8gc3RvcmUgbm9ybWFsaXplZCBzdHlsZSB1bmRlciBhIGRpZmZlcmVudCBrZXkgZm9yIG5leHQgZGlmZlxuICAvLyBtYWtlIHN1cmUgdG8gY2xvbmUgaXQgaWYgaXQncyByZWFjdGl2ZSwgc2luY2UgdGhlIHVzZXIgbGlrbGV5IHdhbnRzXG4gIC8vIHRvIG11dGF0ZSBpdC5cbiAgdm5vZGUuZGF0YS5ub3JtYWxpemVkU3R5bGUgPSBpc0RlZihzdHlsZS5fX29iX18pXG4gICAgPyBleHRlbmQoe30sIHN0eWxlKVxuICAgIDogc3R5bGU7XG5cbiAgdmFyIG5ld1N0eWxlID0gZ2V0U3R5bGUodm5vZGUsIHRydWUpO1xuXG4gIGZvciAobmFtZSBpbiBvbGRTdHlsZSkge1xuICAgIGlmIChpc1VuZGVmKG5ld1N0eWxlW25hbWVdKSkge1xuICAgICAgc2V0UHJvcChlbCwgbmFtZSwgJycpO1xuICAgIH1cbiAgfVxuICBmb3IgKG5hbWUgaW4gbmV3U3R5bGUpIHtcbiAgICBjdXIgPSBuZXdTdHlsZVtuYW1lXTtcbiAgICBpZiAoY3VyICE9PSBvbGRTdHlsZVtuYW1lXSkge1xuICAgICAgLy8gaWU5IHNldHRpbmcgdG8gbnVsbCBoYXMgbm8gZWZmZWN0LCBtdXN0IHVzZSBlbXB0eSBzdHJpbmdcbiAgICAgIHNldFByb3AoZWwsIG5hbWUsIGN1ciA9PSBudWxsID8gJycgOiBjdXIpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgc3R5bGUgPSB7XG4gIGNyZWF0ZTogdXBkYXRlU3R5bGUsXG4gIHVwZGF0ZTogdXBkYXRlU3R5bGVcbn07XG5cbi8qICAqL1xuXG4vKipcbiAqIEFkZCBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIFNWRyBzaW5jZSBjbGFzc0xpc3QgaXMgbm90IHN1cHBvcnRlZCBvblxuICogU1ZHIGVsZW1lbnRzIGluIElFXG4gKi9cbmZ1bmN0aW9uIGFkZENsYXNzIChlbCwgY2xzKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIWNscyB8fCAhKGNscyA9IGNscy50cmltKCkpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgaWYgKGNscy5pbmRleE9mKCcgJykgPiAtMSkge1xuICAgICAgY2xzLnNwbGl0KC9cXHMrLykuZm9yRWFjaChmdW5jdGlvbiAoYykgeyByZXR1cm4gZWwuY2xhc3NMaXN0LmFkZChjKTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9IFwiIFwiICsgKGVsLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJykgKyBcIiBcIjtcbiAgICBpZiAoY3VyLmluZGV4T2YoJyAnICsgY2xzICsgJyAnKSA8IDApIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAoY3VyICsgY2xzKS50cmltKCkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIFNWRyBzaW5jZSBjbGFzc0xpc3QgaXMgbm90IHN1cHBvcnRlZCBvblxuICogU1ZHIGVsZW1lbnRzIGluIElFXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzIChlbCwgY2xzKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIWNscyB8fCAhKGNscyA9IGNscy50cmltKCkpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgaWYgKGNscy5pbmRleE9mKCcgJykgPiAtMSkge1xuICAgICAgY2xzLnNwbGl0KC9cXHMrLykuZm9yRWFjaChmdW5jdGlvbiAoYykgeyByZXR1cm4gZWwuY2xhc3NMaXN0LnJlbW92ZShjKTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9IFwiIFwiICsgKGVsLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJykgKyBcIiBcIjtcbiAgICB2YXIgdGFyID0gJyAnICsgY2xzICsgJyAnO1xuICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcbiAgICAgIGN1ciA9IGN1ci5yZXBsYWNlKHRhciwgJyAnKTtcbiAgICB9XG4gICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGN1ci50cmltKCkpO1xuICB9XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiByZXNvbHZlVHJhbnNpdGlvbiAoZGVmJCQxKSB7XG4gIGlmICghZGVmJCQxKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHR5cGVvZiBkZWYkJDEgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIHJlcyA9IHt9O1xuICAgIGlmIChkZWYkJDEuY3NzICE9PSBmYWxzZSkge1xuICAgICAgZXh0ZW5kKHJlcywgYXV0b0Nzc1RyYW5zaXRpb24oZGVmJCQxLm5hbWUgfHwgJ3YnKSk7XG4gICAgfVxuICAgIGV4dGVuZChyZXMsIGRlZiQkMSk7XG4gICAgcmV0dXJuIHJlc1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWYkJDEgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGF1dG9Dc3NUcmFuc2l0aW9uKGRlZiQkMSlcbiAgfVxufVxuXG52YXIgYXV0b0Nzc1RyYW5zaXRpb24gPSBjYWNoZWQoZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRlckNsYXNzOiAobmFtZSArIFwiLWVudGVyXCIpLFxuICAgIGVudGVyVG9DbGFzczogKG5hbWUgKyBcIi1lbnRlci10b1wiKSxcbiAgICBlbnRlckFjdGl2ZUNsYXNzOiAobmFtZSArIFwiLWVudGVyLWFjdGl2ZVwiKSxcbiAgICBsZWF2ZUNsYXNzOiAobmFtZSArIFwiLWxlYXZlXCIpLFxuICAgIGxlYXZlVG9DbGFzczogKG5hbWUgKyBcIi1sZWF2ZS10b1wiKSxcbiAgICBsZWF2ZUFjdGl2ZUNsYXNzOiAobmFtZSArIFwiLWxlYXZlLWFjdGl2ZVwiKVxuICB9XG59KTtcblxudmFyIGhhc1RyYW5zaXRpb24gPSBpbkJyb3dzZXIgJiYgIWlzSUU5O1xudmFyIFRSQU5TSVRJT04gPSAndHJhbnNpdGlvbic7XG52YXIgQU5JTUFUSU9OID0gJ2FuaW1hdGlvbic7XG5cbi8vIFRyYW5zaXRpb24gcHJvcGVydHkvZXZlbnQgc25pZmZpbmdcbnZhciB0cmFuc2l0aW9uUHJvcCA9ICd0cmFuc2l0aW9uJztcbnZhciB0cmFuc2l0aW9uRW5kRXZlbnQgPSAndHJhbnNpdGlvbmVuZCc7XG52YXIgYW5pbWF0aW9uUHJvcCA9ICdhbmltYXRpb24nO1xudmFyIGFuaW1hdGlvbkVuZEV2ZW50ID0gJ2FuaW1hdGlvbmVuZCc7XG5pZiAoaGFzVHJhbnNpdGlvbikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHdpbmRvdy5vbnRyYW5zaXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxuICAgIHdpbmRvdy5vbndlYmtpdHRyYW5zaXRpb25lbmQgIT09IHVuZGVmaW5lZFxuICApIHtcbiAgICB0cmFuc2l0aW9uUHJvcCA9ICdXZWJraXRUcmFuc2l0aW9uJztcbiAgICB0cmFuc2l0aW9uRW5kRXZlbnQgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCc7XG4gIH1cbiAgaWYgKHdpbmRvdy5vbmFuaW1hdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0YW5pbWF0aW9uZW5kICE9PSB1bmRlZmluZWRcbiAgKSB7XG4gICAgYW5pbWF0aW9uUHJvcCA9ICdXZWJraXRBbmltYXRpb24nO1xuICAgIGFuaW1hdGlvbkVuZEV2ZW50ID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCc7XG4gIH1cbn1cblxuLy8gYmluZGluZyB0byB3aW5kb3cgaXMgbmVjZXNzYXJ5IHRvIG1ha2UgaG90IHJlbG9hZCB3b3JrIGluIElFIGluIHN0cmljdCBtb2RlXG52YXIgcmFmID0gaW5Ccm93c2VyICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmJpbmQod2luZG93KVxuICA6IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIG5leHRGcmFtZSAoZm4pIHtcbiAgcmFmKGZ1bmN0aW9uICgpIHtcbiAgICByYWYoZm4pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVHJhbnNpdGlvbkNsYXNzIChlbCwgY2xzKSB7XG4gIChlbC5fdHJhbnNpdGlvbkNsYXNzZXMgfHwgKGVsLl90cmFuc2l0aW9uQ2xhc3NlcyA9IFtdKSkucHVzaChjbHMpO1xuICBhZGRDbGFzcyhlbCwgY2xzKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvbkNsYXNzIChlbCwgY2xzKSB7XG4gIGlmIChlbC5fdHJhbnNpdGlvbkNsYXNzZXMpIHtcbiAgICByZW1vdmUoZWwuX3RyYW5zaXRpb25DbGFzc2VzLCBjbHMpO1xuICB9XG4gIHJlbW92ZUNsYXNzKGVsLCBjbHMpO1xufVxuXG5mdW5jdGlvbiB3aGVuVHJhbnNpdGlvbkVuZHMgKFxuICBlbCxcbiAgZXhwZWN0ZWRUeXBlLFxuICBjYlxuKSB7XG4gIHZhciByZWYgPSBnZXRUcmFuc2l0aW9uSW5mbyhlbCwgZXhwZWN0ZWRUeXBlKTtcbiAgdmFyIHR5cGUgPSByZWYudHlwZTtcbiAgdmFyIHRpbWVvdXQgPSByZWYudGltZW91dDtcbiAgdmFyIHByb3BDb3VudCA9IHJlZi5wcm9wQ291bnQ7XG4gIGlmICghdHlwZSkgeyByZXR1cm4gY2IoKSB9XG4gIHZhciBldmVudCA9IHR5cGUgPT09IFRSQU5TSVRJT04gPyB0cmFuc2l0aW9uRW5kRXZlbnQgOiBhbmltYXRpb25FbmRFdmVudDtcbiAgdmFyIGVuZGVkID0gMDtcbiAgdmFyIGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvbkVuZCk7XG4gICAgY2IoKTtcbiAgfTtcbiAgdmFyIG9uRW5kID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICBpZiAoKytlbmRlZCA+PSBwcm9wQ291bnQpIHtcbiAgICAgICAgZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZW5kZWQgPCBwcm9wQ291bnQpIHtcbiAgICAgIGVuZCgpO1xuICAgIH1cbiAgfSwgdGltZW91dCArIDEpO1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBvbkVuZCk7XG59XG5cbnZhciB0cmFuc2Zvcm1SRSA9IC9cXGIodHJhbnNmb3JtfGFsbCkoLHwkKS87XG5cbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25JbmZvIChlbCwgZXhwZWN0ZWRUeXBlKSB7XG4gIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIHZhciB0cmFuc2l0aW9uRGVsYXlzID0gc3R5bGVzW3RyYW5zaXRpb25Qcm9wICsgJ0RlbGF5J10uc3BsaXQoJywgJyk7XG4gIHZhciB0cmFuc2l0aW9uRHVyYXRpb25zID0gc3R5bGVzW3RyYW5zaXRpb25Qcm9wICsgJ0R1cmF0aW9uJ10uc3BsaXQoJywgJyk7XG4gIHZhciB0cmFuc2l0aW9uVGltZW91dCA9IGdldFRpbWVvdXQodHJhbnNpdGlvbkRlbGF5cywgdHJhbnNpdGlvbkR1cmF0aW9ucyk7XG4gIHZhciBhbmltYXRpb25EZWxheXMgPSBzdHlsZXNbYW5pbWF0aW9uUHJvcCArICdEZWxheSddLnNwbGl0KCcsICcpO1xuICB2YXIgYW5pbWF0aW9uRHVyYXRpb25zID0gc3R5bGVzW2FuaW1hdGlvblByb3AgKyAnRHVyYXRpb24nXS5zcGxpdCgnLCAnKTtcbiAgdmFyIGFuaW1hdGlvblRpbWVvdXQgPSBnZXRUaW1lb3V0KGFuaW1hdGlvbkRlbGF5cywgYW5pbWF0aW9uRHVyYXRpb25zKTtcblxuICB2YXIgdHlwZTtcbiAgdmFyIHRpbWVvdXQgPSAwO1xuICB2YXIgcHJvcENvdW50ID0gMDtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChleHBlY3RlZFR5cGUgPT09IFRSQU5TSVRJT04pIHtcbiAgICBpZiAodHJhbnNpdGlvblRpbWVvdXQgPiAwKSB7XG4gICAgICB0eXBlID0gVFJBTlNJVElPTjtcbiAgICAgIHRpbWVvdXQgPSB0cmFuc2l0aW9uVGltZW91dDtcbiAgICAgIHByb3BDb3VudCA9IHRyYW5zaXRpb25EdXJhdGlvbnMubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09IEFOSU1BVElPTikge1xuICAgIGlmIChhbmltYXRpb25UaW1lb3V0ID4gMCkge1xuICAgICAgdHlwZSA9IEFOSU1BVElPTjtcbiAgICAgIHRpbWVvdXQgPSBhbmltYXRpb25UaW1lb3V0O1xuICAgICAgcHJvcENvdW50ID0gYW5pbWF0aW9uRHVyYXRpb25zLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGltZW91dCA9IE1hdGgubWF4KHRyYW5zaXRpb25UaW1lb3V0LCBhbmltYXRpb25UaW1lb3V0KTtcbiAgICB0eXBlID0gdGltZW91dCA+IDBcbiAgICAgID8gdHJhbnNpdGlvblRpbWVvdXQgPiBhbmltYXRpb25UaW1lb3V0XG4gICAgICAgID8gVFJBTlNJVElPTlxuICAgICAgICA6IEFOSU1BVElPTlxuICAgICAgOiBudWxsO1xuICAgIHByb3BDb3VudCA9IHR5cGVcbiAgICAgID8gdHlwZSA9PT0gVFJBTlNJVElPTlxuICAgICAgICA/IHRyYW5zaXRpb25EdXJhdGlvbnMubGVuZ3RoXG4gICAgICAgIDogYW5pbWF0aW9uRHVyYXRpb25zLmxlbmd0aFxuICAgICAgOiAwO1xuICB9XG4gIHZhciBoYXNUcmFuc2Zvcm0gPVxuICAgIHR5cGUgPT09IFRSQU5TSVRJT04gJiZcbiAgICB0cmFuc2Zvcm1SRS50ZXN0KHN0eWxlc1t0cmFuc2l0aW9uUHJvcCArICdQcm9wZXJ0eSddKTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgcHJvcENvdW50OiBwcm9wQ291bnQsXG4gICAgaGFzVHJhbnNmb3JtOiBoYXNUcmFuc2Zvcm1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUaW1lb3V0IChkZWxheXMsIGR1cmF0aW9ucykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB3aGlsZSAoZGVsYXlzLmxlbmd0aCA8IGR1cmF0aW9ucy5sZW5ndGgpIHtcbiAgICBkZWxheXMgPSBkZWxheXMuY29uY2F0KGRlbGF5cyk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgZHVyYXRpb25zLm1hcChmdW5jdGlvbiAoZCwgaSkge1xuICAgIHJldHVybiB0b01zKGQpICsgdG9NcyhkZWxheXNbaV0pXG4gIH0pKVxufVxuXG5mdW5jdGlvbiB0b01zIChzKSB7XG4gIHJldHVybiBOdW1iZXIocy5zbGljZSgwLCAtMSkpICogMTAwMFxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gZW50ZXIgKHZub2RlLCB0b2dnbGVEaXNwbGF5KSB7XG4gIHZhciBlbCA9IHZub2RlLmVsbTtcblxuICAvLyBjYWxsIGxlYXZlIGNhbGxiYWNrIG5vd1xuICBpZiAoaXNEZWYoZWwuX2xlYXZlQ2IpKSB7XG4gICAgZWwuX2xlYXZlQ2IuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICBlbC5fbGVhdmVDYigpO1xuICB9XG5cbiAgdmFyIGRhdGEgPSByZXNvbHZlVHJhbnNpdGlvbih2bm9kZS5kYXRhLnRyYW5zaXRpb24pO1xuICBpZiAoaXNVbmRlZihkYXRhKSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc0RlZihlbC5fZW50ZXJDYikgfHwgZWwubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBjc3MgPSBkYXRhLmNzcztcbiAgdmFyIHR5cGUgPSBkYXRhLnR5cGU7XG4gIHZhciBlbnRlckNsYXNzID0gZGF0YS5lbnRlckNsYXNzO1xuICB2YXIgZW50ZXJUb0NsYXNzID0gZGF0YS5lbnRlclRvQ2xhc3M7XG4gIHZhciBlbnRlckFjdGl2ZUNsYXNzID0gZGF0YS5lbnRlckFjdGl2ZUNsYXNzO1xuICB2YXIgYXBwZWFyQ2xhc3MgPSBkYXRhLmFwcGVhckNsYXNzO1xuICB2YXIgYXBwZWFyVG9DbGFzcyA9IGRhdGEuYXBwZWFyVG9DbGFzcztcbiAgdmFyIGFwcGVhckFjdGl2ZUNsYXNzID0gZGF0YS5hcHBlYXJBY3RpdmVDbGFzcztcbiAgdmFyIGJlZm9yZUVudGVyID0gZGF0YS5iZWZvcmVFbnRlcjtcbiAgdmFyIGVudGVyID0gZGF0YS5lbnRlcjtcbiAgdmFyIGFmdGVyRW50ZXIgPSBkYXRhLmFmdGVyRW50ZXI7XG4gIHZhciBlbnRlckNhbmNlbGxlZCA9IGRhdGEuZW50ZXJDYW5jZWxsZWQ7XG4gIHZhciBiZWZvcmVBcHBlYXIgPSBkYXRhLmJlZm9yZUFwcGVhcjtcbiAgdmFyIGFwcGVhciA9IGRhdGEuYXBwZWFyO1xuICB2YXIgYWZ0ZXJBcHBlYXIgPSBkYXRhLmFmdGVyQXBwZWFyO1xuICB2YXIgYXBwZWFyQ2FuY2VsbGVkID0gZGF0YS5hcHBlYXJDYW5jZWxsZWQ7XG4gIHZhciBkdXJhdGlvbiA9IGRhdGEuZHVyYXRpb247XG5cbiAgLy8gYWN0aXZlSW5zdGFuY2Ugd2lsbCBhbHdheXMgYmUgdGhlIDx0cmFuc2l0aW9uPiBjb21wb25lbnQgbWFuYWdpbmcgdGhpc1xuICAvLyB0cmFuc2l0aW9uLiBPbmUgZWRnZSBjYXNlIHRvIGNoZWNrIGlzIHdoZW4gdGhlIDx0cmFuc2l0aW9uPiBpcyBwbGFjZWRcbiAgLy8gYXMgdGhlIHJvb3Qgbm9kZSBvZiBhIGNoaWxkIGNvbXBvbmVudC4gSW4gdGhhdCBjYXNlIHdlIG5lZWQgdG8gY2hlY2tcbiAgLy8gPHRyYW5zaXRpb24+J3MgcGFyZW50IGZvciBhcHBlYXIgY2hlY2suXG4gIHZhciBjb250ZXh0ID0gYWN0aXZlSW5zdGFuY2U7XG4gIHZhciB0cmFuc2l0aW9uTm9kZSA9IGFjdGl2ZUluc3RhbmNlLiR2bm9kZTtcbiAgd2hpbGUgKHRyYW5zaXRpb25Ob2RlICYmIHRyYW5zaXRpb25Ob2RlLnBhcmVudCkge1xuICAgIHRyYW5zaXRpb25Ob2RlID0gdHJhbnNpdGlvbk5vZGUucGFyZW50O1xuICAgIGNvbnRleHQgPSB0cmFuc2l0aW9uTm9kZS5jb250ZXh0O1xuICB9XG5cbiAgdmFyIGlzQXBwZWFyID0gIWNvbnRleHQuX2lzTW91bnRlZCB8fCAhdm5vZGUuaXNSb290SW5zZXJ0O1xuXG4gIGlmIChpc0FwcGVhciAmJiAhYXBwZWFyICYmIGFwcGVhciAhPT0gJycpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdGFydENsYXNzID0gaXNBcHBlYXIgJiYgYXBwZWFyQ2xhc3NcbiAgICA/IGFwcGVhckNsYXNzXG4gICAgOiBlbnRlckNsYXNzO1xuICB2YXIgYWN0aXZlQ2xhc3MgPSBpc0FwcGVhciAmJiBhcHBlYXJBY3RpdmVDbGFzc1xuICAgID8gYXBwZWFyQWN0aXZlQ2xhc3NcbiAgICA6IGVudGVyQWN0aXZlQ2xhc3M7XG4gIHZhciB0b0NsYXNzID0gaXNBcHBlYXIgJiYgYXBwZWFyVG9DbGFzc1xuICAgID8gYXBwZWFyVG9DbGFzc1xuICAgIDogZW50ZXJUb0NsYXNzO1xuXG4gIHZhciBiZWZvcmVFbnRlckhvb2sgPSBpc0FwcGVhclxuICAgID8gKGJlZm9yZUFwcGVhciB8fCBiZWZvcmVFbnRlcilcbiAgICA6IGJlZm9yZUVudGVyO1xuICB2YXIgZW50ZXJIb29rID0gaXNBcHBlYXJcbiAgICA/ICh0eXBlb2YgYXBwZWFyID09PSAnZnVuY3Rpb24nID8gYXBwZWFyIDogZW50ZXIpXG4gICAgOiBlbnRlcjtcbiAgdmFyIGFmdGVyRW50ZXJIb29rID0gaXNBcHBlYXJcbiAgICA/IChhZnRlckFwcGVhciB8fCBhZnRlckVudGVyKVxuICAgIDogYWZ0ZXJFbnRlcjtcbiAgdmFyIGVudGVyQ2FuY2VsbGVkSG9vayA9IGlzQXBwZWFyXG4gICAgPyAoYXBwZWFyQ2FuY2VsbGVkIHx8IGVudGVyQ2FuY2VsbGVkKVxuICAgIDogZW50ZXJDYW5jZWxsZWQ7XG5cbiAgdmFyIGV4cGxpY2l0RW50ZXJEdXJhdGlvbiA9IHRvTnVtYmVyKFxuICAgIGlzT2JqZWN0KGR1cmF0aW9uKVxuICAgICAgPyBkdXJhdGlvbi5lbnRlclxuICAgICAgOiBkdXJhdGlvblxuICApO1xuXG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBleHBsaWNpdEVudGVyRHVyYXRpb24gIT0gbnVsbCkge1xuICAgIGNoZWNrRHVyYXRpb24oZXhwbGljaXRFbnRlckR1cmF0aW9uLCAnZW50ZXInLCB2bm9kZSk7XG4gIH1cblxuICB2YXIgZXhwZWN0c0NTUyA9IGNzcyAhPT0gZmFsc2UgJiYgIWlzSUU5O1xuICB2YXIgdXNlcldhbnRzQ29udHJvbCA9IGdldEhvb2tBcmd1bWVudHNMZW5ndGgoZW50ZXJIb29rKTtcblxuICB2YXIgY2IgPSBlbC5fZW50ZXJDYiA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICAgIGlmIChleHBlY3RzQ1NTKSB7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIHRvQ2xhc3MpO1xuICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBhY3RpdmVDbGFzcyk7XG4gICAgfVxuICAgIGlmIChjYi5jYW5jZWxsZWQpIHtcbiAgICAgIGlmIChleHBlY3RzQ1NTKSB7XG4gICAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgc3RhcnRDbGFzcyk7XG4gICAgICB9XG4gICAgICBlbnRlckNhbmNlbGxlZEhvb2sgJiYgZW50ZXJDYW5jZWxsZWRIb29rKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWZ0ZXJFbnRlckhvb2sgJiYgYWZ0ZXJFbnRlckhvb2soZWwpO1xuICAgIH1cbiAgICBlbC5fZW50ZXJDYiA9IG51bGw7XG4gIH0pO1xuXG4gIGlmICghdm5vZGUuZGF0YS5zaG93KSB7XG4gICAgLy8gcmVtb3ZlIHBlbmRpbmcgbGVhdmUgZWxlbWVudCBvbiBlbnRlciBieSBpbmplY3RpbmcgYW4gaW5zZXJ0IGhvb2tcbiAgICBtZXJnZVZOb2RlSG9vayh2bm9kZS5kYXRhLmhvb2sgfHwgKHZub2RlLmRhdGEuaG9vayA9IHt9KSwgJ2luc2VydCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgdmFyIHBlbmRpbmdOb2RlID0gcGFyZW50ICYmIHBhcmVudC5fcGVuZGluZyAmJiBwYXJlbnQuX3BlbmRpbmdbdm5vZGUua2V5XTtcbiAgICAgIGlmIChwZW5kaW5nTm9kZSAmJlxuICAgICAgICBwZW5kaW5nTm9kZS50YWcgPT09IHZub2RlLnRhZyAmJlxuICAgICAgICBwZW5kaW5nTm9kZS5lbG0uX2xlYXZlQ2JcbiAgICAgICkge1xuICAgICAgICBwZW5kaW5nTm9kZS5lbG0uX2xlYXZlQ2IoKTtcbiAgICAgIH1cbiAgICAgIGVudGVySG9vayAmJiBlbnRlckhvb2soZWwsIGNiKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHN0YXJ0IGVudGVyIHRyYW5zaXRpb25cbiAgYmVmb3JlRW50ZXJIb29rICYmIGJlZm9yZUVudGVySG9vayhlbCk7XG4gIGlmIChleHBlY3RzQ1NTKSB7XG4gICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBzdGFydENsYXNzKTtcbiAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGFjdGl2ZUNsYXNzKTtcbiAgICBuZXh0RnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCB0b0NsYXNzKTtcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgc3RhcnRDbGFzcyk7XG4gICAgICBpZiAoIWNiLmNhbmNlbGxlZCAmJiAhdXNlcldhbnRzQ29udHJvbCkge1xuICAgICAgICBpZiAoaXNWYWxpZER1cmF0aW9uKGV4cGxpY2l0RW50ZXJEdXJhdGlvbikpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGNiLCBleHBsaWNpdEVudGVyRHVyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdoZW5UcmFuc2l0aW9uRW5kcyhlbCwgdHlwZSwgY2IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpZiAodm5vZGUuZGF0YS5zaG93KSB7XG4gICAgdG9nZ2xlRGlzcGxheSAmJiB0b2dnbGVEaXNwbGF5KCk7XG4gICAgZW50ZXJIb29rICYmIGVudGVySG9vayhlbCwgY2IpO1xuICB9XG5cbiAgaWYgKCFleHBlY3RzQ1NTICYmICF1c2VyV2FudHNDb250cm9sKSB7XG4gICAgY2IoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsZWF2ZSAodm5vZGUsIHJtKSB7XG4gIHZhciBlbCA9IHZub2RlLmVsbTtcblxuICAvLyBjYWxsIGVudGVyIGNhbGxiYWNrIG5vd1xuICBpZiAoaXNEZWYoZWwuX2VudGVyQ2IpKSB7XG4gICAgZWwuX2VudGVyQ2IuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICBlbC5fZW50ZXJDYigpO1xuICB9XG5cbiAgdmFyIGRhdGEgPSByZXNvbHZlVHJhbnNpdGlvbih2bm9kZS5kYXRhLnRyYW5zaXRpb24pO1xuICBpZiAoaXNVbmRlZihkYXRhKSkge1xuICAgIHJldHVybiBybSgpXG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGlzRGVmKGVsLl9sZWF2ZUNiKSB8fCBlbC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIGNzcyA9IGRhdGEuY3NzO1xuICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcbiAgdmFyIGxlYXZlQ2xhc3MgPSBkYXRhLmxlYXZlQ2xhc3M7XG4gIHZhciBsZWF2ZVRvQ2xhc3MgPSBkYXRhLmxlYXZlVG9DbGFzcztcbiAgdmFyIGxlYXZlQWN0aXZlQ2xhc3MgPSBkYXRhLmxlYXZlQWN0aXZlQ2xhc3M7XG4gIHZhciBiZWZvcmVMZWF2ZSA9IGRhdGEuYmVmb3JlTGVhdmU7XG4gIHZhciBsZWF2ZSA9IGRhdGEubGVhdmU7XG4gIHZhciBhZnRlckxlYXZlID0gZGF0YS5hZnRlckxlYXZlO1xuICB2YXIgbGVhdmVDYW5jZWxsZWQgPSBkYXRhLmxlYXZlQ2FuY2VsbGVkO1xuICB2YXIgZGVsYXlMZWF2ZSA9IGRhdGEuZGVsYXlMZWF2ZTtcbiAgdmFyIGR1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcblxuICB2YXIgZXhwZWN0c0NTUyA9IGNzcyAhPT0gZmFsc2UgJiYgIWlzSUU5O1xuICB2YXIgdXNlcldhbnRzQ29udHJvbCA9IGdldEhvb2tBcmd1bWVudHNMZW5ndGgobGVhdmUpO1xuXG4gIHZhciBleHBsaWNpdExlYXZlRHVyYXRpb24gPSB0b051bWJlcihcbiAgICBpc09iamVjdChkdXJhdGlvbilcbiAgICAgID8gZHVyYXRpb24ubGVhdmVcbiAgICAgIDogZHVyYXRpb25cbiAgKTtcblxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgaXNEZWYoZXhwbGljaXRMZWF2ZUR1cmF0aW9uKSkge1xuICAgIGNoZWNrRHVyYXRpb24oZXhwbGljaXRMZWF2ZUR1cmF0aW9uLCAnbGVhdmUnLCB2bm9kZSk7XG4gIH1cblxuICB2YXIgY2IgPSBlbC5fbGVhdmVDYiA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICAgIGlmIChlbC5wYXJlbnROb2RlICYmIGVsLnBhcmVudE5vZGUuX3BlbmRpbmcpIHtcbiAgICAgIGVsLnBhcmVudE5vZGUuX3BlbmRpbmdbdm5vZGUua2V5XSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChleHBlY3RzQ1NTKSB7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlVG9DbGFzcyk7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlQWN0aXZlQ2xhc3MpO1xuICAgIH1cbiAgICBpZiAoY2IuY2FuY2VsbGVkKSB7XG4gICAgICBpZiAoZXhwZWN0c0NTUykge1xuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpO1xuICAgICAgfVxuICAgICAgbGVhdmVDYW5jZWxsZWQgJiYgbGVhdmVDYW5jZWxsZWQoZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBybSgpO1xuICAgICAgYWZ0ZXJMZWF2ZSAmJiBhZnRlckxlYXZlKGVsKTtcbiAgICB9XG4gICAgZWwuX2xlYXZlQ2IgPSBudWxsO1xuICB9KTtcblxuICBpZiAoZGVsYXlMZWF2ZSkge1xuICAgIGRlbGF5TGVhdmUocGVyZm9ybUxlYXZlKTtcbiAgfSBlbHNlIHtcbiAgICBwZXJmb3JtTGVhdmUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1MZWF2ZSAoKSB7XG4gICAgLy8gdGhlIGRlbGF5ZWQgbGVhdmUgbWF5IGhhdmUgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgIGlmIChjYi5jYW5jZWxsZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyByZWNvcmQgbGVhdmluZyBlbGVtZW50XG4gICAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcbiAgICAgIChlbC5wYXJlbnROb2RlLl9wZW5kaW5nIHx8IChlbC5wYXJlbnROb2RlLl9wZW5kaW5nID0ge30pKVsodm5vZGUua2V5KV0gPSB2bm9kZTtcbiAgICB9XG4gICAgYmVmb3JlTGVhdmUgJiYgYmVmb3JlTGVhdmUoZWwpO1xuICAgIGlmIChleHBlY3RzQ1NTKSB7XG4gICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpO1xuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUFjdGl2ZUNsYXNzKTtcbiAgICAgIG5leHRGcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVUb0NsYXNzKTtcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUNsYXNzKTtcbiAgICAgICAgaWYgKCFjYi5jYW5jZWxsZWQgJiYgIXVzZXJXYW50c0NvbnRyb2wpIHtcbiAgICAgICAgICBpZiAoaXNWYWxpZER1cmF0aW9uKGV4cGxpY2l0TGVhdmVEdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2IsIGV4cGxpY2l0TGVhdmVEdXJhdGlvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoZW5UcmFuc2l0aW9uRW5kcyhlbCwgdHlwZSwgY2IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGxlYXZlICYmIGxlYXZlKGVsLCBjYik7XG4gICAgaWYgKCFleHBlY3RzQ1NTICYmICF1c2VyV2FudHNDb250cm9sKSB7XG4gICAgICBjYigpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBvbmx5IHVzZWQgaW4gZGV2IG1vZGVcbmZ1bmN0aW9uIGNoZWNrRHVyYXRpb24gKHZhbCwgbmFtZSwgdm5vZGUpIHtcbiAgaWYgKHR5cGVvZiB2YWwgIT09ICdudW1iZXInKSB7XG4gICAgd2FybihcbiAgICAgIFwiPHRyYW5zaXRpb24+IGV4cGxpY2l0IFwiICsgbmFtZSArIFwiIGR1cmF0aW9uIGlzIG5vdCBhIHZhbGlkIG51bWJlciAtIFwiICtcbiAgICAgIFwiZ290IFwiICsgKEpTT04uc3RyaW5naWZ5KHZhbCkpICsgXCIuXCIsXG4gICAgICB2bm9kZS5jb250ZXh0XG4gICAgKTtcbiAgfSBlbHNlIGlmIChpc05hTih2YWwpKSB7XG4gICAgd2FybihcbiAgICAgIFwiPHRyYW5zaXRpb24+IGV4cGxpY2l0IFwiICsgbmFtZSArIFwiIGR1cmF0aW9uIGlzIE5hTiAtIFwiICtcbiAgICAgICd0aGUgZHVyYXRpb24gZXhwcmVzc2lvbiBtaWdodCBiZSBpbmNvcnJlY3QuJyxcbiAgICAgIHZub2RlLmNvbnRleHRcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWREdXJhdGlvbiAodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsKVxufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHRyYW5zaXRpb24gaG9vaydzIGFyZ3VtZW50IGxlbmd0aC4gVGhlIGhvb2sgbWF5IGJlOlxuICogLSBhIG1lcmdlZCBob29rIChpbnZva2VyKSB3aXRoIHRoZSBvcmlnaW5hbCBpbiAuZm5zXG4gKiAtIGEgd3JhcHBlZCBjb21wb25lbnQgbWV0aG9kIChjaGVjayAuX2xlbmd0aClcbiAqIC0gYSBwbGFpbiBmdW5jdGlvbiAoLmxlbmd0aClcbiAqL1xuZnVuY3Rpb24gZ2V0SG9va0FyZ3VtZW50c0xlbmd0aCAoZm4pIHtcbiAgaWYgKGlzVW5kZWYoZm4pKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgdmFyIGludm9rZXJGbnMgPSBmbi5mbnM7XG4gIGlmIChpc0RlZihpbnZva2VyRm5zKSkge1xuICAgIC8vIGludm9rZXJcbiAgICByZXR1cm4gZ2V0SG9va0FyZ3VtZW50c0xlbmd0aChcbiAgICAgIEFycmF5LmlzQXJyYXkoaW52b2tlckZucylcbiAgICAgICAgPyBpbnZva2VyRm5zWzBdXG4gICAgICAgIDogaW52b2tlckZuc1xuICAgIClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKGZuLl9sZW5ndGggfHwgZm4ubGVuZ3RoKSA+IDFcbiAgfVxufVxuXG5mdW5jdGlvbiBfZW50ZXIgKF8sIHZub2RlKSB7XG4gIGlmICh2bm9kZS5kYXRhLnNob3cgIT09IHRydWUpIHtcbiAgICBlbnRlcih2bm9kZSk7XG4gIH1cbn1cblxudmFyIHRyYW5zaXRpb24gPSBpbkJyb3dzZXIgPyB7XG4gIGNyZWF0ZTogX2VudGVyLFxuICBhY3RpdmF0ZTogX2VudGVyLFxuICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSQkMSAodm5vZGUsIHJtKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAodm5vZGUuZGF0YS5zaG93ICE9PSB0cnVlKSB7XG4gICAgICBsZWF2ZSh2bm9kZSwgcm0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBybSgpO1xuICAgIH1cbiAgfVxufSA6IHt9O1xuXG52YXIgcGxhdGZvcm1Nb2R1bGVzID0gW1xuICBhdHRycyxcbiAga2xhc3MsXG4gIGV2ZW50cyxcbiAgZG9tUHJvcHMsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uXG5dO1xuXG4vKiAgKi9cblxuLy8gdGhlIGRpcmVjdGl2ZSBtb2R1bGUgc2hvdWxkIGJlIGFwcGxpZWQgbGFzdCwgYWZ0ZXIgYWxsXG4vLyBidWlsdC1pbiBtb2R1bGVzIGhhdmUgYmVlbiBhcHBsaWVkLlxudmFyIG1vZHVsZXMgPSBwbGF0Zm9ybU1vZHVsZXMuY29uY2F0KGJhc2VNb2R1bGVzKTtcblxudmFyIHBhdGNoID0gY3JlYXRlUGF0Y2hGdW5jdGlvbih7IG5vZGVPcHM6IG5vZGVPcHMsIG1vZHVsZXM6IG1vZHVsZXMgfSk7XG5cbi8qKlxuICogTm90IHR5cGUgY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgZmxvdyBkb2Vzbid0IGxpa2UgYXR0YWNoaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIEVsZW1lbnRzLlxuICovXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuaWYgKGlzSUU5KSB7XG4gIC8vIGh0dHA6Ly93d3cubWF0dHM0MTEuY29tL3Bvc3QvaW50ZXJuZXQtZXhwbG9yZXItOS1vbmlucHV0L1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb25jaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoZWwgJiYgZWwudm1vZGVsKSB7XG4gICAgICB0cmlnZ2VyKGVsLCAnaW5wdXQnKTtcbiAgICB9XG4gIH0pO1xufVxuXG52YXIgbW9kZWwkMSA9IHtcbiAgaW5zZXJ0ZWQ6IGZ1bmN0aW9uIGluc2VydGVkIChlbCwgYmluZGluZywgdm5vZGUpIHtcbiAgICBpZiAodm5vZGUudGFnID09PSAnc2VsZWN0Jykge1xuICAgICAgdmFyIGNiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRTZWxlY3RlZChlbCwgYmluZGluZywgdm5vZGUuY29udGV4dCk7XG4gICAgICB9O1xuICAgICAgY2IoKTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGlzSUUgfHwgaXNFZGdlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoY2IsIDApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodm5vZGUudGFnID09PSAndGV4dGFyZWEnIHx8IGVsLnR5cGUgPT09ICd0ZXh0JyB8fCBlbC50eXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICBlbC5fdk1vZGlmaWVycyA9IGJpbmRpbmcubW9kaWZpZXJzO1xuICAgICAgaWYgKCFiaW5kaW5nLm1vZGlmaWVycy5sYXp5KSB7XG4gICAgICAgIC8vIFNhZmFyaSA8IDEwLjIgJiBVSVdlYlZpZXcgZG9lc24ndCBmaXJlIGNvbXBvc2l0aW9uZW5kIHdoZW5cbiAgICAgICAgLy8gc3dpdGNoaW5nIGZvY3VzIGJlZm9yZSBjb25maXJtaW5nIGNvbXBvc2l0aW9uIGNob2ljZVxuICAgICAgICAvLyB0aGlzIGFsc28gZml4ZXMgdGhlIGlzc3VlIHdoZXJlIHNvbWUgYnJvd3NlcnMgZS5nLiBpT1MgQ2hyb21lXG4gICAgICAgIC8vIGZpcmVzIFwiY2hhbmdlXCIgaW5zdGVhZCBvZiBcImlucHV0XCIgb24gYXV0b2NvbXBsZXRlLlxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBvbkNvbXBvc2l0aW9uRW5kKTtcbiAgICAgICAgaWYgKCFpc0FuZHJvaWQpIHtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0Jywgb25Db21wb3NpdGlvblN0YXJ0KTtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIG9uQ29tcG9zaXRpb25FbmQpO1xuICAgICAgICB9XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoaXNJRTkpIHtcbiAgICAgICAgICBlbC52bW9kZWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRVcGRhdGVkOiBmdW5jdGlvbiBjb21wb25lbnRVcGRhdGVkIChlbCwgYmluZGluZywgdm5vZGUpIHtcbiAgICBpZiAodm5vZGUudGFnID09PSAnc2VsZWN0Jykge1xuICAgICAgc2V0U2VsZWN0ZWQoZWwsIGJpbmRpbmcsIHZub2RlLmNvbnRleHQpO1xuICAgICAgLy8gaW4gY2FzZSB0aGUgb3B0aW9ucyByZW5kZXJlZCBieSB2LWZvciBoYXZlIGNoYW5nZWQsXG4gICAgICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIHZhbHVlIGlzIG91dC1vZi1zeW5jIHdpdGggdGhlIHJlbmRlcmVkIG9wdGlvbnMuXG4gICAgICAvLyBkZXRlY3Qgc3VjaCBjYXNlcyBhbmQgZmlsdGVyIG91dCB2YWx1ZXMgdGhhdCBubyBsb25nZXIgaGFzIGEgbWF0Y2hpbmdcbiAgICAgIC8vIG9wdGlvbiBpbiB0aGUgRE9NLlxuICAgICAgdmFyIG5lZWRSZXNldCA9IGVsLm11bHRpcGxlXG4gICAgICAgID8gYmluZGluZy52YWx1ZS5zb21lKGZ1bmN0aW9uICh2KSB7IHJldHVybiBoYXNOb01hdGNoaW5nT3B0aW9uKHYsIGVsLm9wdGlvbnMpOyB9KVxuICAgICAgICA6IGJpbmRpbmcudmFsdWUgIT09IGJpbmRpbmcub2xkVmFsdWUgJiYgaGFzTm9NYXRjaGluZ09wdGlvbihiaW5kaW5nLnZhbHVlLCBlbC5vcHRpb25zKTtcbiAgICAgIGlmIChuZWVkUmVzZXQpIHtcbiAgICAgICAgdHJpZ2dlcihlbCwgJ2NoYW5nZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2VsZWN0ZWQgKGVsLCBiaW5kaW5nLCB2bSkge1xuICB2YXIgdmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xuICB2YXIgaXNNdWx0aXBsZSA9IGVsLm11bHRpcGxlO1xuICBpZiAoaXNNdWx0aXBsZSAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgXCI8c2VsZWN0IG11bHRpcGxlIHYtbW9kZWw9XFxcIlwiICsgKGJpbmRpbmcuZXhwcmVzc2lvbikgKyBcIlxcXCI+IFwiICtcbiAgICAgIFwiZXhwZWN0cyBhbiBBcnJheSB2YWx1ZSBmb3IgaXRzIGJpbmRpbmcsIGJ1dCBnb3QgXCIgKyAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSkpLFxuICAgICAgdm1cbiAgICApO1xuICAgIHJldHVyblxuICB9XG4gIHZhciBzZWxlY3RlZCwgb3B0aW9uO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGVsLm9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb3B0aW9uID0gZWwub3B0aW9uc1tpXTtcbiAgICBpZiAoaXNNdWx0aXBsZSkge1xuICAgICAgc2VsZWN0ZWQgPSBsb29zZUluZGV4T2YodmFsdWUsIGdldFZhbHVlKG9wdGlvbikpID4gLTE7XG4gICAgICBpZiAob3B0aW9uLnNlbGVjdGVkICE9PSBzZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGxvb3NlRXF1YWwoZ2V0VmFsdWUob3B0aW9uKSwgdmFsdWUpKSB7XG4gICAgICAgIGlmIChlbC5zZWxlY3RlZEluZGV4ICE9PSBpKSB7XG4gICAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNNdWx0aXBsZSkge1xuICAgIGVsLnNlbGVjdGVkSW5kZXggPSAtMTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNOb01hdGNoaW5nT3B0aW9uICh2YWx1ZSwgb3B0aW9ucykge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGxvb3NlRXF1YWwoZ2V0VmFsdWUob3B0aW9uc1tpXSksIHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlIChvcHRpb24pIHtcbiAgcmV0dXJuICdfdmFsdWUnIGluIG9wdGlvblxuICAgID8gb3B0aW9uLl92YWx1ZVxuICAgIDogb3B0aW9uLnZhbHVlXG59XG5cbmZ1bmN0aW9uIG9uQ29tcG9zaXRpb25TdGFydCAoZSkge1xuICBlLnRhcmdldC5jb21wb3NpbmcgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uRW5kIChlKSB7XG4gIC8vIHByZXZlbnQgdHJpZ2dlcmluZyBhbiBpbnB1dCBldmVudCBmb3Igbm8gcmVhc29uXG4gIGlmICghZS50YXJnZXQuY29tcG9zaW5nKSB7IHJldHVybiB9XG4gIGUudGFyZ2V0LmNvbXBvc2luZyA9IGZhbHNlO1xuICB0cmlnZ2VyKGUudGFyZ2V0LCAnaW5wdXQnKTtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlciAoZWwsIHR5cGUpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICBlLmluaXRFdmVudCh0eXBlLCB0cnVlLCB0cnVlKTtcbiAgZWwuZGlzcGF0Y2hFdmVudChlKTtcbn1cblxuLyogICovXG5cbi8vIHJlY3Vyc2l2ZWx5IHNlYXJjaCBmb3IgcG9zc2libGUgdHJhbnNpdGlvbiBkZWZpbmVkIGluc2lkZSB0aGUgY29tcG9uZW50IHJvb3RcbmZ1bmN0aW9uIGxvY2F0ZU5vZGUgKHZub2RlKSB7XG4gIHJldHVybiB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSAmJiAoIXZub2RlLmRhdGEgfHwgIXZub2RlLmRhdGEudHJhbnNpdGlvbilcbiAgICA/IGxvY2F0ZU5vZGUodm5vZGUuY29tcG9uZW50SW5zdGFuY2UuX3Zub2RlKVxuICAgIDogdm5vZGVcbn1cblxudmFyIHNob3cgPSB7XG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQgKGVsLCByZWYsIHZub2RlKSB7XG4gICAgdmFyIHZhbHVlID0gcmVmLnZhbHVlO1xuXG4gICAgdm5vZGUgPSBsb2NhdGVOb2RlKHZub2RlKTtcbiAgICB2YXIgdHJhbnNpdGlvbiA9IHZub2RlLmRhdGEgJiYgdm5vZGUuZGF0YS50cmFuc2l0aW9uO1xuICAgIHZhciBvcmlnaW5hbERpc3BsYXkgPSBlbC5fX3ZPcmlnaW5hbERpc3BsYXkgPVxuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnID8gJycgOiBlbC5zdHlsZS5kaXNwbGF5O1xuICAgIGlmICh2YWx1ZSAmJiB0cmFuc2l0aW9uICYmICFpc0lFOSkge1xuICAgICAgdm5vZGUuZGF0YS5zaG93ID0gdHJ1ZTtcbiAgICAgIGVudGVyKHZub2RlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBvcmlnaW5hbERpc3BsYXk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gb3JpZ2luYWxEaXNwbGF5IDogJ25vbmUnO1xuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSAoZWwsIHJlZiwgdm5vZGUpIHtcbiAgICB2YXIgdmFsdWUgPSByZWYudmFsdWU7XG4gICAgdmFyIG9sZFZhbHVlID0gcmVmLm9sZFZhbHVlO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKHZhbHVlID09PSBvbGRWYWx1ZSkgeyByZXR1cm4gfVxuICAgIHZub2RlID0gbG9jYXRlTm9kZSh2bm9kZSk7XG4gICAgdmFyIHRyYW5zaXRpb24gPSB2bm9kZS5kYXRhICYmIHZub2RlLmRhdGEudHJhbnNpdGlvbjtcbiAgICBpZiAodHJhbnNpdGlvbiAmJiAhaXNJRTkpIHtcbiAgICAgIHZub2RlLmRhdGEuc2hvdyA9IHRydWU7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgZW50ZXIodm5vZGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gZWwuX192T3JpZ2luYWxEaXNwbGF5O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlYXZlKHZub2RlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/IGVsLl9fdk9yaWdpbmFsRGlzcGxheSA6ICdub25lJztcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQgKFxuICAgIGVsLFxuICAgIGJpbmRpbmcsXG4gICAgdm5vZGUsXG4gICAgb2xkVm5vZGUsXG4gICAgaXNEZXN0cm95XG4gICkge1xuICAgIGlmICghaXNEZXN0cm95KSB7XG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gZWwuX192T3JpZ2luYWxEaXNwbGF5O1xuICAgIH1cbiAgfVxufTtcblxudmFyIHBsYXRmb3JtRGlyZWN0aXZlcyA9IHtcbiAgbW9kZWw6IG1vZGVsJDEsXG4gIHNob3c6IHNob3dcbn07XG5cbi8qICAqL1xuXG4vLyBQcm92aWRlcyB0cmFuc2l0aW9uIHN1cHBvcnQgZm9yIGEgc2luZ2xlIGVsZW1lbnQvY29tcG9uZW50LlxuLy8gc3VwcG9ydHMgdHJhbnNpdGlvbiBtb2RlIChvdXQtaW4gLyBpbi1vdXQpXG5cbnZhciB0cmFuc2l0aW9uUHJvcHMgPSB7XG4gIG5hbWU6IFN0cmluZyxcbiAgYXBwZWFyOiBCb29sZWFuLFxuICBjc3M6IEJvb2xlYW4sXG4gIG1vZGU6IFN0cmluZyxcbiAgdHlwZTogU3RyaW5nLFxuICBlbnRlckNsYXNzOiBTdHJpbmcsXG4gIGxlYXZlQ2xhc3M6IFN0cmluZyxcbiAgZW50ZXJUb0NsYXNzOiBTdHJpbmcsXG4gIGxlYXZlVG9DbGFzczogU3RyaW5nLFxuICBlbnRlckFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gIGxlYXZlQWN0aXZlQ2xhc3M6IFN0cmluZyxcbiAgYXBwZWFyQ2xhc3M6IFN0cmluZyxcbiAgYXBwZWFyQWN0aXZlQ2xhc3M6IFN0cmluZyxcbiAgYXBwZWFyVG9DbGFzczogU3RyaW5nLFxuICBkdXJhdGlvbjogW051bWJlciwgU3RyaW5nLCBPYmplY3RdXG59O1xuXG4vLyBpbiBjYXNlIHRoZSBjaGlsZCBpcyBhbHNvIGFuIGFic3RyYWN0IGNvbXBvbmVudCwgZS5nLiA8a2VlcC1hbGl2ZT5cbi8vIHdlIHdhbnQgdG8gcmVjdXJzaXZlbHkgcmV0cmlldmUgdGhlIHJlYWwgY29tcG9uZW50IHRvIGJlIHJlbmRlcmVkXG5mdW5jdGlvbiBnZXRSZWFsQ2hpbGQgKHZub2RlKSB7XG4gIHZhciBjb21wT3B0aW9ucyA9IHZub2RlICYmIHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XG4gIGlmIChjb21wT3B0aW9ucyAmJiBjb21wT3B0aW9ucy5DdG9yLm9wdGlvbnMuYWJzdHJhY3QpIHtcbiAgICByZXR1cm4gZ2V0UmVhbENoaWxkKGdldEZpcnN0Q29tcG9uZW50Q2hpbGQoY29tcE9wdGlvbnMuY2hpbGRyZW4pKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB2bm9kZVxuICB9XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RUcmFuc2l0aW9uRGF0YSAoY29tcCkge1xuICB2YXIgZGF0YSA9IHt9O1xuICB2YXIgb3B0aW9ucyA9IGNvbXAuJG9wdGlvbnM7XG4gIC8vIHByb3BzXG4gIGZvciAodmFyIGtleSBpbiBvcHRpb25zLnByb3BzRGF0YSkge1xuICAgIGRhdGFba2V5XSA9IGNvbXBba2V5XTtcbiAgfVxuICAvLyBldmVudHMuXG4gIC8vIGV4dHJhY3QgbGlzdGVuZXJzIGFuZCBwYXNzIHRoZW0gZGlyZWN0bHkgdG8gdGhlIHRyYW5zaXRpb24gbWV0aG9kc1xuICB2YXIgbGlzdGVuZXJzID0gb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzO1xuICBmb3IgKHZhciBrZXkkMSBpbiBsaXN0ZW5lcnMpIHtcbiAgICBkYXRhW2NhbWVsaXplKGtleSQxKV0gPSBsaXN0ZW5lcnNba2V5JDFdO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbmZ1bmN0aW9uIHBsYWNlaG9sZGVyIChoLCByYXdDaGlsZCkge1xuICBpZiAoL1xcZC1rZWVwLWFsaXZlJC8udGVzdChyYXdDaGlsZC50YWcpKSB7XG4gICAgcmV0dXJuIGgoJ2tlZXAtYWxpdmUnLCB7XG4gICAgICBwcm9wczogcmF3Q2hpbGQuY29tcG9uZW50T3B0aW9ucy5wcm9wc0RhdGFcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhc1BhcmVudFRyYW5zaXRpb24gKHZub2RlKSB7XG4gIHdoaWxlICgodm5vZGUgPSB2bm9kZS5wYXJlbnQpKSB7XG4gICAgaWYgKHZub2RlLmRhdGEudHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTYW1lQ2hpbGQgKGNoaWxkLCBvbGRDaGlsZCkge1xuICByZXR1cm4gb2xkQ2hpbGQua2V5ID09PSBjaGlsZC5rZXkgJiYgb2xkQ2hpbGQudGFnID09PSBjaGlsZC50YWdcbn1cblxudmFyIFRyYW5zaXRpb24gPSB7XG4gIG5hbWU6ICd0cmFuc2l0aW9uJyxcbiAgcHJvcHM6IHRyYW5zaXRpb25Qcm9wcyxcbiAgYWJzdHJhY3Q6IHRydWUsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKGgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuJHNsb3RzLmRlZmF1bHQ7XG4gICAgaWYgKCFjaGlsZHJlbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZmlsdGVyIG91dCB0ZXh0IG5vZGVzIChwb3NzaWJsZSB3aGl0ZXNwYWNlcylcbiAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYy50YWc7IH0pO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB3YXJuIG11bHRpcGxlIGVsZW1lbnRzXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICc8dHJhbnNpdGlvbj4gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIHNpbmdsZSBlbGVtZW50LiBVc2UgJyArXG4gICAgICAgICc8dHJhbnNpdGlvbi1ncm91cD4gZm9yIGxpc3RzLicsXG4gICAgICAgIHRoaXMuJHBhcmVudFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgbW9kZSA9IHRoaXMubW9kZTtcblxuICAgIC8vIHdhcm4gaW52YWxpZCBtb2RlXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICBtb2RlICYmIG1vZGUgIT09ICdpbi1vdXQnICYmIG1vZGUgIT09ICdvdXQtaW4nXG4gICAgKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAnaW52YWxpZCA8dHJhbnNpdGlvbj4gbW9kZTogJyArIG1vZGUsXG4gICAgICAgIHRoaXMuJHBhcmVudFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgcmF3Q2hpbGQgPSBjaGlsZHJlblswXTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYSBjb21wb25lbnQgcm9vdCBub2RlIGFuZCB0aGUgY29tcG9uZW50J3NcbiAgICAvLyBwYXJlbnQgY29udGFpbmVyIG5vZGUgYWxzbyBoYXMgdHJhbnNpdGlvbiwgc2tpcC5cbiAgICBpZiAoaGFzUGFyZW50VHJhbnNpdGlvbih0aGlzLiR2bm9kZSkpIHtcbiAgICAgIHJldHVybiByYXdDaGlsZFxuICAgIH1cblxuICAgIC8vIGFwcGx5IHRyYW5zaXRpb24gZGF0YSB0byBjaGlsZFxuICAgIC8vIHVzZSBnZXRSZWFsQ2hpbGQoKSB0byBpZ25vcmUgYWJzdHJhY3QgY29tcG9uZW50cyBlLmcuIGtlZXAtYWxpdmVcbiAgICB2YXIgY2hpbGQgPSBnZXRSZWFsQ2hpbGQocmF3Q2hpbGQpO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIHJldHVybiByYXdDaGlsZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9sZWF2aW5nKSB7XG4gICAgICByZXR1cm4gcGxhY2Vob2xkZXIoaCwgcmF3Q2hpbGQpXG4gICAgfVxuXG4gICAgLy8gZW5zdXJlIGEga2V5IHRoYXQgaXMgdW5pcXVlIHRvIHRoZSB2bm9kZSB0eXBlIGFuZCB0byB0aGlzIHRyYW5zaXRpb25cbiAgICAvLyBjb21wb25lbnQgaW5zdGFuY2UuIFRoaXMga2V5IHdpbGwgYmUgdXNlZCB0byByZW1vdmUgcGVuZGluZyBsZWF2aW5nIG5vZGVzXG4gICAgLy8gZHVyaW5nIGVudGVyaW5nLlxuICAgIHZhciBpZCA9IFwiX190cmFuc2l0aW9uLVwiICsgKHRoaXMuX3VpZCkgKyBcIi1cIjtcbiAgICBjaGlsZC5rZXkgPSBjaGlsZC5rZXkgPT0gbnVsbFxuICAgICAgPyBpZCArIGNoaWxkLnRhZ1xuICAgICAgOiBpc1ByaW1pdGl2ZShjaGlsZC5rZXkpXG4gICAgICAgID8gKFN0cmluZyhjaGlsZC5rZXkpLmluZGV4T2YoaWQpID09PSAwID8gY2hpbGQua2V5IDogaWQgKyBjaGlsZC5rZXkpXG4gICAgICAgIDogY2hpbGQua2V5O1xuXG4gICAgdmFyIGRhdGEgPSAoY2hpbGQuZGF0YSB8fCAoY2hpbGQuZGF0YSA9IHt9KSkudHJhbnNpdGlvbiA9IGV4dHJhY3RUcmFuc2l0aW9uRGF0YSh0aGlzKTtcbiAgICB2YXIgb2xkUmF3Q2hpbGQgPSB0aGlzLl92bm9kZTtcbiAgICB2YXIgb2xkQ2hpbGQgPSBnZXRSZWFsQ2hpbGQob2xkUmF3Q2hpbGQpO1xuXG4gICAgLy8gbWFyayB2LXNob3dcbiAgICAvLyBzbyB0aGF0IHRoZSB0cmFuc2l0aW9uIG1vZHVsZSBjYW4gaGFuZCBvdmVyIHRoZSBjb250cm9sIHRvIHRoZSBkaXJlY3RpdmVcbiAgICBpZiAoY2hpbGQuZGF0YS5kaXJlY3RpdmVzICYmIGNoaWxkLmRhdGEuZGlyZWN0aXZlcy5zb21lKGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLm5hbWUgPT09ICdzaG93JzsgfSkpIHtcbiAgICAgIGNoaWxkLmRhdGEuc2hvdyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG9sZENoaWxkICYmIG9sZENoaWxkLmRhdGEgJiYgIWlzU2FtZUNoaWxkKGNoaWxkLCBvbGRDaGlsZCkpIHtcbiAgICAgIC8vIHJlcGxhY2Ugb2xkIGNoaWxkIHRyYW5zaXRpb24gZGF0YSB3aXRoIGZyZXNoIG9uZVxuICAgICAgLy8gaW1wb3J0YW50IGZvciBkeW5hbWljIHRyYW5zaXRpb25zIVxuICAgICAgdmFyIG9sZERhdGEgPSBvbGRDaGlsZCAmJiAob2xkQ2hpbGQuZGF0YS50cmFuc2l0aW9uID0gZXh0ZW5kKHt9LCBkYXRhKSk7XG4gICAgICAvLyBoYW5kbGUgdHJhbnNpdGlvbiBtb2RlXG4gICAgICBpZiAobW9kZSA9PT0gJ291dC1pbicpIHtcbiAgICAgICAgLy8gcmV0dXJuIHBsYWNlaG9sZGVyIG5vZGUgYW5kIHF1ZXVlIHVwZGF0ZSB3aGVuIGxlYXZlIGZpbmlzaGVzXG4gICAgICAgIHRoaXMuX2xlYXZpbmcgPSB0cnVlO1xuICAgICAgICBtZXJnZVZOb2RlSG9vayhvbGREYXRhLCAnYWZ0ZXJMZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzJDEuX2xlYXZpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzJDEuJGZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGxhY2Vob2xkZXIoaCwgcmF3Q2hpbGQpXG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdpbi1vdXQnKSB7XG4gICAgICAgIHZhciBkZWxheWVkTGVhdmU7XG4gICAgICAgIHZhciBwZXJmb3JtTGVhdmUgPSBmdW5jdGlvbiAoKSB7IGRlbGF5ZWRMZWF2ZSgpOyB9O1xuICAgICAgICBtZXJnZVZOb2RlSG9vayhkYXRhLCAnYWZ0ZXJFbnRlcicsIHBlcmZvcm1MZWF2ZSk7XG4gICAgICAgIG1lcmdlVk5vZGVIb29rKGRhdGEsICdlbnRlckNhbmNlbGxlZCcsIHBlcmZvcm1MZWF2ZSk7XG4gICAgICAgIG1lcmdlVk5vZGVIb29rKG9sZERhdGEsICdkZWxheUxlYXZlJywgZnVuY3Rpb24gKGxlYXZlKSB7IGRlbGF5ZWRMZWF2ZSA9IGxlYXZlOyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmF3Q2hpbGRcbiAgfVxufTtcblxuLyogICovXG5cbi8vIFByb3ZpZGVzIHRyYW5zaXRpb24gc3VwcG9ydCBmb3IgbGlzdCBpdGVtcy5cbi8vIHN1cHBvcnRzIG1vdmUgdHJhbnNpdGlvbnMgdXNpbmcgdGhlIEZMSVAgdGVjaG5pcXVlLlxuXG4vLyBCZWNhdXNlIHRoZSB2ZG9tJ3MgY2hpbGRyZW4gdXBkYXRlIGFsZ29yaXRobSBpcyBcInVuc3RhYmxlXCIgLSBpLmUuXG4vLyBpdCBkb2Vzbid0IGd1YXJhbnRlZSB0aGUgcmVsYXRpdmUgcG9zaXRpb25pbmcgb2YgcmVtb3ZlZCBlbGVtZW50cyxcbi8vIHdlIGZvcmNlIHRyYW5zaXRpb24tZ3JvdXAgdG8gdXBkYXRlIGl0cyBjaGlsZHJlbiBpbnRvIHR3byBwYXNzZXM6XG4vLyBpbiB0aGUgZmlyc3QgcGFzcywgd2UgcmVtb3ZlIGFsbCBub2RlcyB0aGF0IG5lZWQgdG8gYmUgcmVtb3ZlZCxcbi8vIHRyaWdnZXJpbmcgdGhlaXIgbGVhdmluZyB0cmFuc2l0aW9uOyBpbiB0aGUgc2Vjb25kIHBhc3MsIHdlIGluc2VydC9tb3ZlXG4vLyBpbnRvIHRoZSBmaW5hbCBkZXNpcmVkIHN0YXRlLiBUaGlzIHdheSBpbiB0aGUgc2Vjb25kIHBhc3MgcmVtb3ZlZFxuLy8gbm9kZXMgd2lsbCByZW1haW4gd2hlcmUgdGhleSBzaG91bGQgYmUuXG5cbnZhciBwcm9wcyA9IGV4dGVuZCh7XG4gIHRhZzogU3RyaW5nLFxuICBtb3ZlQ2xhc3M6IFN0cmluZ1xufSwgdHJhbnNpdGlvblByb3BzKTtcblxuZGVsZXRlIHByb3BzLm1vZGU7XG5cbnZhciBUcmFuc2l0aW9uR3JvdXAgPSB7XG4gIHByb3BzOiBwcm9wcyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlciAoaCkge1xuICAgIHZhciB0YWcgPSB0aGlzLnRhZyB8fCB0aGlzLiR2bm9kZS5kYXRhLnRhZyB8fCAnc3Bhbic7XG4gICAgdmFyIG1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdmFyIHByZXZDaGlsZHJlbiA9IHRoaXMucHJldkNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICB2YXIgcmF3Q2hpbGRyZW4gPSB0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdO1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB2YXIgdHJhbnNpdGlvbkRhdGEgPSBleHRyYWN0VHJhbnNpdGlvbkRhdGEodGhpcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYyA9IHJhd0NoaWxkcmVuW2ldO1xuICAgICAgaWYgKGMudGFnKSB7XG4gICAgICAgIGlmIChjLmtleSAhPSBudWxsICYmIFN0cmluZyhjLmtleSkuaW5kZXhPZignX192bGlzdCcpICE9PSAwKSB7XG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgICAgICBtYXBbYy5rZXldID0gY1xuICAgICAgICAgIDsoYy5kYXRhIHx8IChjLmRhdGEgPSB7fSkpLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb3B0cyA9IGMuY29tcG9uZW50T3B0aW9ucztcbiAgICAgICAgICB2YXIgbmFtZSA9IG9wdHMgPyAob3B0cy5DdG9yLm9wdGlvbnMubmFtZSB8fCBvcHRzLnRhZyB8fCAnJykgOiBjLnRhZztcbiAgICAgICAgICB3YXJuKChcIjx0cmFuc2l0aW9uLWdyb3VwPiBjaGlsZHJlbiBtdXN0IGJlIGtleWVkOiA8XCIgKyBuYW1lICsgXCI+XCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcmV2Q2hpbGRyZW4pIHtcbiAgICAgIHZhciBrZXB0ID0gW107XG4gICAgICB2YXIgcmVtb3ZlZCA9IFtdO1xuICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgcHJldkNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcbiAgICAgICAgdmFyIGMkMSA9IHByZXZDaGlsZHJlbltpJDFdO1xuICAgICAgICBjJDEuZGF0YS50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkRhdGE7XG4gICAgICAgIGMkMS5kYXRhLnBvcyA9IGMkMS5lbG0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChtYXBbYyQxLmtleV0pIHtcbiAgICAgICAgICBrZXB0LnB1c2goYyQxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZW1vdmVkLnB1c2goYyQxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5rZXB0ID0gaCh0YWcsIG51bGwsIGtlcHQpO1xuICAgICAgdGhpcy5yZW1vdmVkID0gcmVtb3ZlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gaCh0YWcsIG51bGwsIGNoaWxkcmVuKVxuICB9LFxuXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gYmVmb3JlVXBkYXRlICgpIHtcbiAgICAvLyBmb3JjZSByZW1vdmluZyBwYXNzXG4gICAgdGhpcy5fX3BhdGNoX18oXG4gICAgICB0aGlzLl92bm9kZSxcbiAgICAgIHRoaXMua2VwdCxcbiAgICAgIGZhbHNlLCAvLyBoeWRyYXRpbmdcbiAgICAgIHRydWUgLy8gcmVtb3ZlT25seSAoIWltcG9ydGFudCwgYXZvaWRzIHVubmVjZXNzYXJ5IG1vdmVzKVxuICAgICk7XG4gICAgdGhpcy5fdm5vZGUgPSB0aGlzLmtlcHQ7XG4gIH0sXG5cbiAgdXBkYXRlZDogZnVuY3Rpb24gdXBkYXRlZCAoKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcmV2Q2hpbGRyZW47XG4gICAgdmFyIG1vdmVDbGFzcyA9IHRoaXMubW92ZUNsYXNzIHx8ICgodGhpcy5uYW1lIHx8ICd2JykgKyAnLW1vdmUnKTtcbiAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCB8fCAhdGhpcy5oYXNNb3ZlKGNoaWxkcmVuWzBdLmVsbSwgbW92ZUNsYXNzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gd2UgZGl2aWRlIHRoZSB3b3JrIGludG8gdGhyZWUgbG9vcHMgdG8gYXZvaWQgbWl4aW5nIERPTSByZWFkcyBhbmQgd3JpdGVzXG4gICAgLy8gaW4gZWFjaCBpdGVyYXRpb24gLSB3aGljaCBoZWxwcyBwcmV2ZW50IGxheW91dCB0aHJhc2hpbmcuXG4gICAgY2hpbGRyZW4uZm9yRWFjaChjYWxsUGVuZGluZ0Nicyk7XG4gICAgY2hpbGRyZW4uZm9yRWFjaChyZWNvcmRQb3NpdGlvbik7XG4gICAgY2hpbGRyZW4uZm9yRWFjaChhcHBseVRyYW5zbGF0aW9uKTtcblxuICAgIC8vIGZvcmNlIHJlZmxvdyB0byBwdXQgZXZlcnl0aGluZyBpbiBwb3NpdGlvblxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICB2YXIgZiA9IGJvZHkub2Zmc2V0SGVpZ2h0OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICBpZiAoYy5kYXRhLm1vdmVkKSB7XG4gICAgICAgIHZhciBlbCA9IGMuZWxtO1xuICAgICAgICB2YXIgcyA9IGVsLnN0eWxlO1xuICAgICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIG1vdmVDbGFzcyk7XG4gICAgICAgIHMudHJhbnNmb3JtID0gcy5XZWJraXRUcmFuc2Zvcm0gPSBzLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcnO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FbmRFdmVudCwgZWwuX21vdmVDYiA9IGZ1bmN0aW9uIGNiIChlKSB7XG4gICAgICAgICAgaWYgKCFlIHx8IC90cmFuc2Zvcm0kLy50ZXN0KGUucHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kRXZlbnQsIGNiKTtcbiAgICAgICAgICAgIGVsLl9tb3ZlQ2IgPSBudWxsO1xuICAgICAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBtb3ZlQ2xhc3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGhhc01vdmU6IGZ1bmN0aW9uIGhhc01vdmUgKGVsLCBtb3ZlQ2xhc3MpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCFoYXNUcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2hhc01vdmUgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzTW92ZVxuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IHdoZXRoZXIgYW4gZWxlbWVudCB3aXRoIHRoZSBtb3ZlIGNsYXNzIGFwcGxpZWQgaGFzXG4gICAgICAvLyBDU1MgdHJhbnNpdGlvbnMuIFNpbmNlIHRoZSBlbGVtZW50IG1heSBiZSBpbnNpZGUgYW4gZW50ZXJpbmdcbiAgICAgIC8vIHRyYW5zaXRpb24gYXQgdGhpcyB2ZXJ5IG1vbWVudCwgd2UgbWFrZSBhIGNsb25lIG9mIGl0IGFuZCByZW1vdmVcbiAgICAgIC8vIGFsbCBvdGhlciB0cmFuc2l0aW9uIGNsYXNzZXMgYXBwbGllZCB0byBlbnN1cmUgb25seSB0aGUgbW92ZSBjbGFzc1xuICAgICAgLy8gaXMgYXBwbGllZC5cbiAgICAgIHZhciBjbG9uZSA9IGVsLmNsb25lTm9kZSgpO1xuICAgICAgaWYgKGVsLl90cmFuc2l0aW9uQ2xhc3Nlcykge1xuICAgICAgICBlbC5fdHJhbnNpdGlvbkNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xzKSB7IHJlbW92ZUNsYXNzKGNsb25lLCBjbHMpOyB9KTtcbiAgICAgIH1cbiAgICAgIGFkZENsYXNzKGNsb25lLCBtb3ZlQ2xhc3MpO1xuICAgICAgY2xvbmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgIHZhciBpbmZvID0gZ2V0VHJhbnNpdGlvbkluZm8oY2xvbmUpO1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgICAgcmV0dXJuICh0aGlzLl9oYXNNb3ZlID0gaW5mby5oYXNUcmFuc2Zvcm0pXG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBjYWxsUGVuZGluZ0NicyAoYykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGMuZWxtLl9tb3ZlQ2IpIHtcbiAgICBjLmVsbS5fbW92ZUNiKCk7XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChjLmVsbS5fZW50ZXJDYikge1xuICAgIGMuZWxtLl9lbnRlckNiKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVjb3JkUG9zaXRpb24gKGMpIHtcbiAgYy5kYXRhLm5ld1BvcyA9IGMuZWxtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xufVxuXG5mdW5jdGlvbiBhcHBseVRyYW5zbGF0aW9uIChjKSB7XG4gIHZhciBvbGRQb3MgPSBjLmRhdGEucG9zO1xuICB2YXIgbmV3UG9zID0gYy5kYXRhLm5ld1BvcztcbiAgdmFyIGR4ID0gb2xkUG9zLmxlZnQgLSBuZXdQb3MubGVmdDtcbiAgdmFyIGR5ID0gb2xkUG9zLnRvcCAtIG5ld1Bvcy50b3A7XG4gIGlmIChkeCB8fCBkeSkge1xuICAgIGMuZGF0YS5tb3ZlZCA9IHRydWU7XG4gICAgdmFyIHMgPSBjLmVsbS5zdHlsZTtcbiAgICBzLnRyYW5zZm9ybSA9IHMuV2Via2l0VHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyBkeCArIFwicHgsXCIgKyBkeSArIFwicHgpXCI7XG4gICAgcy50cmFuc2l0aW9uRHVyYXRpb24gPSAnMHMnO1xuICB9XG59XG5cbnZhciBwbGF0Zm9ybUNvbXBvbmVudHMgPSB7XG4gIFRyYW5zaXRpb246IFRyYW5zaXRpb24sXG4gIFRyYW5zaXRpb25Hcm91cDogVHJhbnNpdGlvbkdyb3VwXG59O1xuXG4vKiAgKi9cblxuLy8gaW5zdGFsbCBwbGF0Zm9ybSBzcGVjaWZpYyB1dGlsc1xuVnVlJDMuY29uZmlnLm11c3RVc2VQcm9wID0gbXVzdFVzZVByb3A7XG5WdWUkMy5jb25maWcuaXNSZXNlcnZlZFRhZyA9IGlzUmVzZXJ2ZWRUYWc7XG5WdWUkMy5jb25maWcuaXNSZXNlcnZlZEF0dHIgPSBpc1Jlc2VydmVkQXR0cjtcblZ1ZSQzLmNvbmZpZy5nZXRUYWdOYW1lc3BhY2UgPSBnZXRUYWdOYW1lc3BhY2U7XG5WdWUkMy5jb25maWcuaXNVbmtub3duRWxlbWVudCA9IGlzVW5rbm93bkVsZW1lbnQ7XG5cbi8vIGluc3RhbGwgcGxhdGZvcm0gcnVudGltZSBkaXJlY3RpdmVzICYgY29tcG9uZW50c1xuZXh0ZW5kKFZ1ZSQzLm9wdGlvbnMuZGlyZWN0aXZlcywgcGxhdGZvcm1EaXJlY3RpdmVzKTtcbmV4dGVuZChWdWUkMy5vcHRpb25zLmNvbXBvbmVudHMsIHBsYXRmb3JtQ29tcG9uZW50cyk7XG5cbi8vIGluc3RhbGwgcGxhdGZvcm0gcGF0Y2ggZnVuY3Rpb25cblZ1ZSQzLnByb3RvdHlwZS5fX3BhdGNoX18gPSBpbkJyb3dzZXIgPyBwYXRjaCA6IG5vb3A7XG5cbi8vIHB1YmxpYyBtb3VudCBtZXRob2RcblZ1ZSQzLnByb3RvdHlwZS4kbW91bnQgPSBmdW5jdGlvbiAoXG4gIGVsLFxuICBoeWRyYXRpbmdcbikge1xuICBlbCA9IGVsICYmIGluQnJvd3NlciA/IHF1ZXJ5KGVsKSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIG1vdW50Q29tcG9uZW50KHRoaXMsIGVsLCBoeWRyYXRpbmcpXG59O1xuXG4vLyBkZXZ0b29scyBnbG9iYWwgaG9va1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICBpZiAoY29uZmlnLmRldnRvb2xzKSB7XG4gICAgaWYgKGRldnRvb2xzKSB7XG4gICAgICBkZXZ0b29scy5lbWl0KCdpbml0JywgVnVlJDMpO1xuICAgIH0gZWxzZSBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgaXNDaHJvbWUpIHtcbiAgICAgIGNvbnNvbGVbY29uc29sZS5pbmZvID8gJ2luZm8nIDogJ2xvZyddKFxuICAgICAgICAnRG93bmxvYWQgdGhlIFZ1ZSBEZXZ0b29scyBleHRlbnNpb24gZm9yIGEgYmV0dGVyIGRldmVsb3BtZW50IGV4cGVyaWVuY2U6XFxuJyArXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLWRldnRvb2xzJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgY29uZmlnLnByb2R1Y3Rpb25UaXAgIT09IGZhbHNlICYmXG4gICAgaW5Ccm93c2VyICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICBjb25zb2xlW2NvbnNvbGUuaW5mbyA/ICdpbmZvJyA6ICdsb2cnXShcbiAgICAgIFwiWW91IGFyZSBydW5uaW5nIFZ1ZSBpbiBkZXZlbG9wbWVudCBtb2RlLlxcblwiICtcbiAgICAgIFwiTWFrZSBzdXJlIHRvIHR1cm4gb24gcHJvZHVjdGlvbiBtb2RlIHdoZW4gZGVwbG95aW5nIGZvciBwcm9kdWN0aW9uLlxcblwiICtcbiAgICAgIFwiU2VlIG1vcmUgdGlwcyBhdCBodHRwczovL3Z1ZWpzLm9yZy9ndWlkZS9kZXBsb3ltZW50Lmh0bWxcIlxuICAgICk7XG4gIH1cbn0sIDApO1xuXG4vKiAgKi9cblxuLy8gY2hlY2sgd2hldGhlciBjdXJyZW50IGJyb3dzZXIgZW5jb2RlcyBhIGNoYXIgaW5zaWRlIGF0dHJpYnV0ZSB2YWx1ZXNcbmZ1bmN0aW9uIHNob3VsZERlY29kZSAoY29udGVudCwgZW5jb2RlZCkge1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBcIjxkaXYgYT1cXFwiXCIgKyBjb250ZW50ICsgXCJcXFwiPlwiO1xuICByZXR1cm4gZGl2LmlubmVySFRNTC5pbmRleE9mKGVuY29kZWQpID4gMFxufVxuXG4vLyAjMzY2M1xuLy8gSUUgZW5jb2RlcyBuZXdsaW5lcyBpbnNpZGUgYXR0cmlidXRlIHZhbHVlcyB3aGlsZSBvdGhlciBicm93c2VycyBkb24ndFxudmFyIHNob3VsZERlY29kZU5ld2xpbmVzID0gaW5Ccm93c2VyID8gc2hvdWxkRGVjb2RlKCdcXG4nLCAnJiMxMDsnKSA6IGZhbHNlO1xuXG4vKiAgKi9cblxudmFyIGlzVW5hcnlUYWcgPSBtYWtlTWFwKFxuICAnYXJlYSxiYXNlLGJyLGNvbCxlbWJlZCxmcmFtZSxocixpbWcsaW5wdXQsaXNpbmRleCxrZXlnZW4sJyArXG4gICdsaW5rLG1ldGEscGFyYW0sc291cmNlLHRyYWNrLHdicidcbik7XG5cbi8vIEVsZW1lbnRzIHRoYXQgeW91IGNhbiwgaW50ZW50aW9uYWxseSwgbGVhdmUgb3BlblxuLy8gKGFuZCB3aGljaCBjbG9zZSB0aGVtc2VsdmVzKVxudmFyIGNhbkJlTGVmdE9wZW5UYWcgPSBtYWtlTWFwKFxuICAnY29sZ3JvdXAsZGQsZHQsbGksb3B0aW9ucyxwLHRkLHRmb290LHRoLHRoZWFkLHRyLHNvdXJjZSdcbik7XG5cbi8vIEhUTUw1IHRhZ3MgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sI2VsZW1lbnRzLTNcbi8vIFBocmFzaW5nIENvbnRlbnQgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZG9tLmh0bWwjcGhyYXNpbmctY29udGVudFxudmFyIGlzTm9uUGhyYXNpbmdUYWcgPSBtYWtlTWFwKFxuICAnYWRkcmVzcyxhcnRpY2xlLGFzaWRlLGJhc2UsYmxvY2txdW90ZSxib2R5LGNhcHRpb24sY29sLGNvbGdyb3VwLGRkLCcgK1xuICAnZGV0YWlscyxkaWFsb2csZGl2LGRsLGR0LGZpZWxkc2V0LGZpZ2NhcHRpb24sZmlndXJlLGZvb3Rlcixmb3JtLCcgK1xuICAnaDEsaDIsaDMsaDQsaDUsaDYsaGVhZCxoZWFkZXIsaGdyb3VwLGhyLGh0bWwsbGVnZW5kLGxpLG1lbnVpdGVtLG1ldGEsJyArXG4gICdvcHRncm91cCxvcHRpb24scGFyYW0scnAscnQsc291cmNlLHN0eWxlLHN1bW1hcnksdGJvZHksdGQsdGZvb3QsdGgsdGhlYWQsJyArXG4gICd0aXRsZSx0cix0cmFjaydcbik7XG5cbi8qICAqL1xuXG52YXIgZGVjb2RlcjtcblxuZnVuY3Rpb24gZGVjb2RlIChodG1sKSB7XG4gIGRlY29kZXIgPSBkZWNvZGVyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkZWNvZGVyLmlubmVySFRNTCA9IGh0bWw7XG4gIHJldHVybiBkZWNvZGVyLnRleHRDb250ZW50XG59XG5cbi8qKlxuICogTm90IHR5cGUtY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgaXQncyBtb3N0bHkgdmVuZG9yIGNvZGUuXG4gKi9cblxuLyohXG4gKiBIVE1MIFBhcnNlciBCeSBKb2huIFJlc2lnIChlam9obi5vcmcpXG4gKiBNb2RpZmllZCBieSBKdXJpeSBcImthbmdheFwiIFpheXRzZXZcbiAqIE9yaWdpbmFsIGNvZGUgYnkgRXJpayBBcnZpZHNzb24sIE1vemlsbGEgUHVibGljIExpY2Vuc2VcbiAqIGh0dHA6Ly9lcmlrLmVhZS5uZXQvc2ltcGxlaHRtbHBhcnNlci9zaW1wbGVodG1scGFyc2VyLmpzXG4gKi9cblxuLy8gUmVndWxhciBFeHByZXNzaW9ucyBmb3IgcGFyc2luZyB0YWdzIGFuZCBhdHRyaWJ1dGVzXG52YXIgc2luZ2xlQXR0cklkZW50aWZpZXIgPSAvKFteXFxzXCInPD4vPV0rKS87XG52YXIgc2luZ2xlQXR0ckFzc2lnbiA9IC8oPzo9KS87XG52YXIgc2luZ2xlQXR0clZhbHVlcyA9IFtcbiAgLy8gYXR0ciB2YWx1ZSBkb3VibGUgcXVvdGVzXG4gIC9cIihbXlwiXSopXCIrLy5zb3VyY2UsXG4gIC8vIGF0dHIgdmFsdWUsIHNpbmdsZSBxdW90ZXNcbiAgLycoW14nXSopJysvLnNvdXJjZSxcbiAgLy8gYXR0ciB2YWx1ZSwgbm8gcXVvdGVzXG4gIC8oW15cXHNcIic9PD5gXSspLy5zb3VyY2Vcbl07XG52YXIgYXR0cmlidXRlID0gbmV3IFJlZ0V4cChcbiAgJ15cXFxccyonICsgc2luZ2xlQXR0cklkZW50aWZpZXIuc291cmNlICtcbiAgJyg/OlxcXFxzKignICsgc2luZ2xlQXR0ckFzc2lnbi5zb3VyY2UgKyAnKScgK1xuICAnXFxcXHMqKD86JyArIHNpbmdsZUF0dHJWYWx1ZXMuam9pbignfCcpICsgJykpPydcbik7XG5cbi8vIGNvdWxkIHVzZSBodHRwczovL3d3dy53My5vcmcvVFIvMTk5OS9SRUMteG1sLW5hbWVzLTE5OTkwMTE0LyNOVC1RTmFtZVxuLy8gYnV0IGZvciBWdWUgdGVtcGxhdGVzIHdlIGNhbiBlbmZvcmNlIGEgc2ltcGxlIGNoYXJzZXRcbnZhciBuY25hbWUgPSAnW2EtekEtWl9dW1xcXFx3XFxcXC1cXFxcLl0qJztcbnZhciBxbmFtZUNhcHR1cmUgPSAnKCg/OicgKyBuY25hbWUgKyAnXFxcXDopPycgKyBuY25hbWUgKyAnKSc7XG52YXIgc3RhcnRUYWdPcGVuID0gbmV3IFJlZ0V4cCgnXjwnICsgcW5hbWVDYXB0dXJlKTtcbnZhciBzdGFydFRhZ0Nsb3NlID0gL15cXHMqKFxcLz8pPi87XG52YXIgZW5kVGFnID0gbmV3IFJlZ0V4cCgnXjxcXFxcLycgKyBxbmFtZUNhcHR1cmUgKyAnW14+XSo+Jyk7XG52YXIgZG9jdHlwZSA9IC9ePCFET0NUWVBFIFtePl0rPi9pO1xudmFyIGNvbW1lbnQgPSAvXjwhLS0vO1xudmFyIGNvbmRpdGlvbmFsQ29tbWVudCA9IC9ePCFcXFsvO1xuXG52YXIgSVNfUkVHRVhfQ0FQVFVSSU5HX0JST0tFTiA9IGZhbHNlO1xuJ3gnLnJlcGxhY2UoL3goLik/L2csIGZ1bmN0aW9uIChtLCBnKSB7XG4gIElTX1JFR0VYX0NBUFRVUklOR19CUk9LRU4gPSBnID09PSAnJztcbn0pO1xuXG4vLyBTcGVjaWFsIEVsZW1lbnRzIChjYW4gY29udGFpbiBhbnl0aGluZylcbnZhciBpc1BsYWluVGV4dEVsZW1lbnQgPSBtYWtlTWFwKCdzY3JpcHQsc3R5bGUsdGV4dGFyZWEnLCB0cnVlKTtcbnZhciByZUNhY2hlID0ge307XG5cbnZhciBkZWNvZGluZ01hcCA9IHtcbiAgJyZsdDsnOiAnPCcsXG4gICcmZ3Q7JzogJz4nLFxuICAnJnF1b3Q7JzogJ1wiJyxcbiAgJyZhbXA7JzogJyYnLFxuICAnJiMxMDsnOiAnXFxuJ1xufTtcbnZhciBlbmNvZGVkQXR0ciA9IC8mKD86bHR8Z3R8cXVvdHxhbXApOy9nO1xudmFyIGVuY29kZWRBdHRyV2l0aE5ld0xpbmVzID0gLyYoPzpsdHxndHxxdW90fGFtcHwjMTApOy9nO1xuXG5mdW5jdGlvbiBkZWNvZGVBdHRyICh2YWx1ZSwgc2hvdWxkRGVjb2RlTmV3bGluZXMpIHtcbiAgdmFyIHJlID0gc2hvdWxkRGVjb2RlTmV3bGluZXMgPyBlbmNvZGVkQXR0cldpdGhOZXdMaW5lcyA6IGVuY29kZWRBdHRyO1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShyZSwgZnVuY3Rpb24gKG1hdGNoKSB7IHJldHVybiBkZWNvZGluZ01hcFttYXRjaF07IH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlSFRNTCAoaHRtbCwgb3B0aW9ucykge1xuICB2YXIgc3RhY2sgPSBbXTtcbiAgdmFyIGV4cGVjdEhUTUwgPSBvcHRpb25zLmV4cGVjdEhUTUw7XG4gIHZhciBpc1VuYXJ5VGFnJCQxID0gb3B0aW9ucy5pc1VuYXJ5VGFnIHx8IG5vO1xuICB2YXIgY2FuQmVMZWZ0T3BlblRhZyQkMSA9IG9wdGlvbnMuY2FuQmVMZWZ0T3BlblRhZyB8fCBubztcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxhc3QsIGxhc3RUYWc7XG4gIHdoaWxlIChodG1sKSB7XG4gICAgbGFzdCA9IGh0bWw7XG4gICAgLy8gTWFrZSBzdXJlIHdlJ3JlIG5vdCBpbiBhIHBsYWludGV4dCBjb250ZW50IGVsZW1lbnQgbGlrZSBzY3JpcHQvc3R5bGVcbiAgICBpZiAoIWxhc3RUYWcgfHwgIWlzUGxhaW5UZXh0RWxlbWVudChsYXN0VGFnKSkge1xuICAgICAgdmFyIHRleHRFbmQgPSBodG1sLmluZGV4T2YoJzwnKTtcbiAgICAgIGlmICh0ZXh0RW5kID09PSAwKSB7XG4gICAgICAgIC8vIENvbW1lbnQ6XG4gICAgICAgIGlmIChjb21tZW50LnRlc3QoaHRtbCkpIHtcbiAgICAgICAgICB2YXIgY29tbWVudEVuZCA9IGh0bWwuaW5kZXhPZignLS0+Jyk7XG5cbiAgICAgICAgICBpZiAoY29tbWVudEVuZCA+PSAwKSB7XG4gICAgICAgICAgICBhZHZhbmNlKGNvbW1lbnRFbmQgKyAzKTtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db25kaXRpb25hbF9jb21tZW50I0Rvd25sZXZlbC1yZXZlYWxlZF9jb25kaXRpb25hbF9jb21tZW50XG4gICAgICAgIGlmIChjb25kaXRpb25hbENvbW1lbnQudGVzdChodG1sKSkge1xuICAgICAgICAgIHZhciBjb25kaXRpb25hbEVuZCA9IGh0bWwuaW5kZXhPZignXT4nKTtcblxuICAgICAgICAgIGlmIChjb25kaXRpb25hbEVuZCA+PSAwKSB7XG4gICAgICAgICAgICBhZHZhbmNlKGNvbmRpdGlvbmFsRW5kICsgMik7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvY3R5cGU6XG4gICAgICAgIHZhciBkb2N0eXBlTWF0Y2ggPSBodG1sLm1hdGNoKGRvY3R5cGUpO1xuICAgICAgICBpZiAoZG9jdHlwZU1hdGNoKSB7XG4gICAgICAgICAgYWR2YW5jZShkb2N0eXBlTWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5kIHRhZzpcbiAgICAgICAgdmFyIGVuZFRhZ01hdGNoID0gaHRtbC5tYXRjaChlbmRUYWcpO1xuICAgICAgICBpZiAoZW5kVGFnTWF0Y2gpIHtcbiAgICAgICAgICB2YXIgY3VySW5kZXggPSBpbmRleDtcbiAgICAgICAgICBhZHZhbmNlKGVuZFRhZ01hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgcGFyc2VFbmRUYWcoZW5kVGFnTWF0Y2hbMV0sIGN1ckluZGV4LCBpbmRleCk7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0YXJ0IHRhZzpcbiAgICAgICAgdmFyIHN0YXJ0VGFnTWF0Y2ggPSBwYXJzZVN0YXJ0VGFnKCk7XG4gICAgICAgIGlmIChzdGFydFRhZ01hdGNoKSB7XG4gICAgICAgICAgaGFuZGxlU3RhcnRUYWcoc3RhcnRUYWdNYXRjaCk7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdGV4dCA9ICh2b2lkIDApLCByZXN0JDEgPSAodm9pZCAwKSwgbmV4dCA9ICh2b2lkIDApO1xuICAgICAgaWYgKHRleHRFbmQgPj0gMCkge1xuICAgICAgICByZXN0JDEgPSBodG1sLnNsaWNlKHRleHRFbmQpO1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgIWVuZFRhZy50ZXN0KHJlc3QkMSkgJiZcbiAgICAgICAgICAhc3RhcnRUYWdPcGVuLnRlc3QocmVzdCQxKSAmJlxuICAgICAgICAgICFjb21tZW50LnRlc3QocmVzdCQxKSAmJlxuICAgICAgICAgICFjb25kaXRpb25hbENvbW1lbnQudGVzdChyZXN0JDEpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIDwgaW4gcGxhaW4gdGV4dCwgYmUgZm9yZ2l2aW5nIGFuZCB0cmVhdCBpdCBhcyB0ZXh0XG4gICAgICAgICAgbmV4dCA9IHJlc3QkMS5pbmRleE9mKCc8JywgMSk7XG4gICAgICAgICAgaWYgKG5leHQgPCAwKSB7IGJyZWFrIH1cbiAgICAgICAgICB0ZXh0RW5kICs9IG5leHQ7XG4gICAgICAgICAgcmVzdCQxID0gaHRtbC5zbGljZSh0ZXh0RW5kKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0ID0gaHRtbC5zdWJzdHJpbmcoMCwgdGV4dEVuZCk7XG4gICAgICAgIGFkdmFuY2UodGV4dEVuZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXh0RW5kIDwgMCkge1xuICAgICAgICB0ZXh0ID0gaHRtbDtcbiAgICAgICAgaHRtbCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jaGFycyAmJiB0ZXh0KSB7XG4gICAgICAgIG9wdGlvbnMuY2hhcnModGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFja2VkVGFnID0gbGFzdFRhZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgdmFyIHJlU3RhY2tlZFRhZyA9IHJlQ2FjaGVbc3RhY2tlZFRhZ10gfHwgKHJlQ2FjaGVbc3RhY2tlZFRhZ10gPSBuZXcgUmVnRXhwKCcoW1xcXFxzXFxcXFNdKj8pKDwvJyArIHN0YWNrZWRUYWcgKyAnW14+XSo+KScsICdpJykpO1xuICAgICAgdmFyIGVuZFRhZ0xlbmd0aCA9IDA7XG4gICAgICB2YXIgcmVzdCA9IGh0bWwucmVwbGFjZShyZVN0YWNrZWRUYWcsIGZ1bmN0aW9uIChhbGwsIHRleHQsIGVuZFRhZykge1xuICAgICAgICBlbmRUYWdMZW5ndGggPSBlbmRUYWcubGVuZ3RoO1xuICAgICAgICBpZiAoIWlzUGxhaW5UZXh0RWxlbWVudChzdGFja2VkVGFnKSAmJiBzdGFja2VkVGFnICE9PSAnbm9zY3JpcHQnKSB7XG4gICAgICAgICAgdGV4dCA9IHRleHRcbiAgICAgICAgICAgIC5yZXBsYWNlKC88IS0tKFtcXHNcXFNdKj8pLS0+L2csICckMScpXG4gICAgICAgICAgICAucmVwbGFjZSgvPCFcXFtDREFUQVxcWyhbXFxzXFxTXSo/KV1dPi9nLCAnJDEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5jaGFycykge1xuICAgICAgICAgIG9wdGlvbnMuY2hhcnModGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnXG4gICAgICB9KTtcbiAgICAgIGluZGV4ICs9IGh0bWwubGVuZ3RoIC0gcmVzdC5sZW5ndGg7XG4gICAgICBodG1sID0gcmVzdDtcbiAgICAgIHBhcnNlRW5kVGFnKHN0YWNrZWRUYWcsIGluZGV4IC0gZW5kVGFnTGVuZ3RoLCBpbmRleCk7XG4gICAgfVxuXG4gICAgaWYgKGh0bWwgPT09IGxhc3QpIHtcbiAgICAgIG9wdGlvbnMuY2hhcnMgJiYgb3B0aW9ucy5jaGFycyhodG1sKTtcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhc3RhY2subGVuZ3RoICYmIG9wdGlvbnMud2Fybikge1xuICAgICAgICBvcHRpb25zLndhcm4oKFwiTWFsLWZvcm1hdHRlZCB0YWcgYXQgZW5kIG9mIHRlbXBsYXRlOiBcXFwiXCIgKyBodG1sICsgXCJcXFwiXCIpKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gQ2xlYW4gdXAgYW55IHJlbWFpbmluZyB0YWdzXG4gIHBhcnNlRW5kVGFnKCk7XG5cbiAgZnVuY3Rpb24gYWR2YW5jZSAobikge1xuICAgIGluZGV4ICs9IG47XG4gICAgaHRtbCA9IGh0bWwuc3Vic3RyaW5nKG4pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTdGFydFRhZyAoKSB7XG4gICAgdmFyIHN0YXJ0ID0gaHRtbC5tYXRjaChzdGFydFRhZ09wZW4pO1xuICAgIGlmIChzdGFydCkge1xuICAgICAgdmFyIG1hdGNoID0ge1xuICAgICAgICB0YWdOYW1lOiBzdGFydFsxXSxcbiAgICAgICAgYXR0cnM6IFtdLFxuICAgICAgICBzdGFydDogaW5kZXhcbiAgICAgIH07XG4gICAgICBhZHZhbmNlKHN0YXJ0WzBdLmxlbmd0aCk7XG4gICAgICB2YXIgZW5kLCBhdHRyO1xuICAgICAgd2hpbGUgKCEoZW5kID0gaHRtbC5tYXRjaChzdGFydFRhZ0Nsb3NlKSkgJiYgKGF0dHIgPSBodG1sLm1hdGNoKGF0dHJpYnV0ZSkpKSB7XG4gICAgICAgIGFkdmFuY2UoYXR0clswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaC5hdHRycy5wdXNoKGF0dHIpO1xuICAgICAgfVxuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBtYXRjaC51bmFyeVNsYXNoID0gZW5kWzFdO1xuICAgICAgICBhZHZhbmNlKGVuZFswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaC5lbmQgPSBpbmRleDtcbiAgICAgICAgcmV0dXJuIG1hdGNoXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlU3RhcnRUYWcgKG1hdGNoKSB7XG4gICAgdmFyIHRhZ05hbWUgPSBtYXRjaC50YWdOYW1lO1xuICAgIHZhciB1bmFyeVNsYXNoID0gbWF0Y2gudW5hcnlTbGFzaDtcblxuICAgIGlmIChleHBlY3RIVE1MKSB7XG4gICAgICBpZiAobGFzdFRhZyA9PT0gJ3AnICYmIGlzTm9uUGhyYXNpbmdUYWcodGFnTmFtZSkpIHtcbiAgICAgICAgcGFyc2VFbmRUYWcobGFzdFRhZyk7XG4gICAgICB9XG4gICAgICBpZiAoY2FuQmVMZWZ0T3BlblRhZyQkMSh0YWdOYW1lKSAmJiBsYXN0VGFnID09PSB0YWdOYW1lKSB7XG4gICAgICAgIHBhcnNlRW5kVGFnKHRhZ05hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB1bmFyeSA9IGlzVW5hcnlUYWckJDEodGFnTmFtZSkgfHwgdGFnTmFtZSA9PT0gJ2h0bWwnICYmIGxhc3RUYWcgPT09ICdoZWFkJyB8fCAhIXVuYXJ5U2xhc2g7XG5cbiAgICB2YXIgbCA9IG1hdGNoLmF0dHJzLmxlbmd0aDtcbiAgICB2YXIgYXR0cnMgPSBuZXcgQXJyYXkobCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhcmdzID0gbWF0Y2guYXR0cnNbaV07XG4gICAgICAvLyBoYWNraXNoIHdvcmsgYXJvdW5kIEZGIGJ1ZyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjk3NzhcbiAgICAgIGlmIChJU19SRUdFWF9DQVBUVVJJTkdfQlJPS0VOICYmIGFyZ3NbMF0uaW5kZXhPZignXCJcIicpID09PSAtMSkge1xuICAgICAgICBpZiAoYXJnc1szXSA9PT0gJycpIHsgZGVsZXRlIGFyZ3NbM107IH1cbiAgICAgICAgaWYgKGFyZ3NbNF0gPT09ICcnKSB7IGRlbGV0ZSBhcmdzWzRdOyB9XG4gICAgICAgIGlmIChhcmdzWzVdID09PSAnJykgeyBkZWxldGUgYXJnc1s1XTsgfVxuICAgICAgfVxuICAgICAgdmFyIHZhbHVlID0gYXJnc1szXSB8fCBhcmdzWzRdIHx8IGFyZ3NbNV0gfHwgJyc7XG4gICAgICBhdHRyc1tpXSA9IHtcbiAgICAgICAgbmFtZTogYXJnc1sxXSxcbiAgICAgICAgdmFsdWU6IGRlY29kZUF0dHIoXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgb3B0aW9ucy5zaG91bGREZWNvZGVOZXdsaW5lc1xuICAgICAgICApXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghdW5hcnkpIHtcbiAgICAgIHN0YWNrLnB1c2goeyB0YWc6IHRhZ05hbWUsIGxvd2VyQ2FzZWRUYWc6IHRhZ05hbWUudG9Mb3dlckNhc2UoKSwgYXR0cnM6IGF0dHJzIH0pO1xuICAgICAgbGFzdFRhZyA9IHRhZ05hbWU7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc3RhcnQpIHtcbiAgICAgIG9wdGlvbnMuc3RhcnQodGFnTmFtZSwgYXR0cnMsIHVuYXJ5LCBtYXRjaC5zdGFydCwgbWF0Y2guZW5kKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUVuZFRhZyAodGFnTmFtZSwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBwb3MsIGxvd2VyQ2FzZWRUYWdOYW1lO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7IHN0YXJ0ID0gaW5kZXg7IH1cbiAgICBpZiAoZW5kID09IG51bGwpIHsgZW5kID0gaW5kZXg7IH1cblxuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICBsb3dlckNhc2VkVGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IG9wZW5lZCB0YWcgb2YgdGhlIHNhbWUgdHlwZVxuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICBmb3IgKHBvcyA9IHN0YWNrLmxlbmd0aCAtIDE7IHBvcyA+PSAwOyBwb3MtLSkge1xuICAgICAgICBpZiAoc3RhY2tbcG9zXS5sb3dlckNhc2VkVGFnID09PSBsb3dlckNhc2VkVGFnTmFtZSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gdGFnIG5hbWUgaXMgcHJvdmlkZWQsIGNsZWFuIHNob3BcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAvLyBDbG9zZSBhbGwgdGhlIG9wZW4gZWxlbWVudHMsIHVwIHRoZSBzdGFja1xuICAgICAgZm9yICh2YXIgaSA9IHN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gcG9zOyBpLS0pIHtcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICAgICAgKGkgPiBwb3MgfHwgIXRhZ05hbWUpICYmXG4gICAgICAgICAgb3B0aW9ucy53YXJuXG4gICAgICAgICkge1xuICAgICAgICAgIG9wdGlvbnMud2FybihcbiAgICAgICAgICAgIChcInRhZyA8XCIgKyAoc3RhY2tbaV0udGFnKSArIFwiPiBoYXMgbm8gbWF0Y2hpbmcgZW5kIHRhZy5cIilcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmVuZCkge1xuICAgICAgICAgIG9wdGlvbnMuZW5kKHN0YWNrW2ldLnRhZywgc3RhcnQsIGVuZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHRoZSBvcGVuIGVsZW1lbnRzIGZyb20gdGhlIHN0YWNrXG4gICAgICBzdGFjay5sZW5ndGggPSBwb3M7XG4gICAgICBsYXN0VGFnID0gcG9zICYmIHN0YWNrW3BvcyAtIDFdLnRhZztcbiAgICB9IGVsc2UgaWYgKGxvd2VyQ2FzZWRUYWdOYW1lID09PSAnYnInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zdGFydCkge1xuICAgICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIFtdLCB0cnVlLCBzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxvd2VyQ2FzZWRUYWdOYW1lID09PSAncCcpIHtcbiAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XG4gICAgICAgIG9wdGlvbnMuc3RhcnQodGFnTmFtZSwgW10sIGZhbHNlLCBzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmVuZCkge1xuICAgICAgICBvcHRpb25zLmVuZCh0YWdOYW1lLCBzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cbnZhciBkZWZhdWx0VGFnUkUgPSAvXFx7XFx7KCg/Oi58XFxuKSs/KVxcfVxcfS9nO1xudmFyIHJlZ2V4RXNjYXBlUkUgPSAvWy0uKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nO1xuXG52YXIgYnVpbGRSZWdleCA9IGNhY2hlZChmdW5jdGlvbiAoZGVsaW1pdGVycykge1xuICB2YXIgb3BlbiA9IGRlbGltaXRlcnNbMF0ucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJyk7XG4gIHZhciBjbG9zZSA9IGRlbGltaXRlcnNbMV0ucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJyk7XG4gIHJldHVybiBuZXcgUmVnRXhwKG9wZW4gKyAnKCg/Oi58XFxcXG4pKz8pJyArIGNsb3NlLCAnZycpXG59KTtcblxuZnVuY3Rpb24gcGFyc2VUZXh0IChcbiAgdGV4dCxcbiAgZGVsaW1pdGVyc1xuKSB7XG4gIHZhciB0YWdSRSA9IGRlbGltaXRlcnMgPyBidWlsZFJlZ2V4KGRlbGltaXRlcnMpIDogZGVmYXVsdFRhZ1JFO1xuICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdG9rZW5zID0gW107XG4gIHZhciBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXggPSAwO1xuICB2YXIgbWF0Y2gsIGluZGV4O1xuICB3aGlsZSAoKG1hdGNoID0gdGFnUkUuZXhlYyh0ZXh0KSkpIHtcbiAgICBpbmRleCA9IG1hdGNoLmluZGV4O1xuICAgIC8vIHB1c2ggdGV4dCB0b2tlblxuICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xuICAgICAgdG9rZW5zLnB1c2goSlNPTi5zdHJpbmdpZnkodGV4dC5zbGljZShsYXN0SW5kZXgsIGluZGV4KSkpO1xuICAgIH1cbiAgICAvLyB0YWcgdG9rZW5cbiAgICB2YXIgZXhwID0gcGFyc2VGaWx0ZXJzKG1hdGNoWzFdLnRyaW0oKSk7XG4gICAgdG9rZW5zLnB1c2goKFwiX3MoXCIgKyBleHAgKyBcIilcIikpO1xuICAgIGxhc3RJbmRleCA9IGluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICB9XG4gIGlmIChsYXN0SW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgIHRva2Vucy5wdXNoKEpTT04uc3RyaW5naWZ5KHRleHQuc2xpY2UobGFzdEluZGV4KSkpO1xuICB9XG4gIHJldHVybiB0b2tlbnMuam9pbignKycpXG59XG5cbi8qICAqL1xuXG52YXIgb25SRSA9IC9eQHxedi1vbjovO1xudmFyIGRpclJFID0gL152LXxeQHxeOi87XG52YXIgZm9yQWxpYXNSRSA9IC8oLio/KVxccysoPzppbnxvZilcXHMrKC4qKS87XG52YXIgZm9ySXRlcmF0b3JSRSA9IC9cXCgoXFx7W159XSpcXH18W14sXSopLChbXixdKikoPzosKFteLF0qKSk/XFwpLztcblxudmFyIGFyZ1JFID0gLzooLiopJC87XG52YXIgYmluZFJFID0gL146fF52LWJpbmQ6LztcbnZhciBtb2RpZmllclJFID0gL1xcLlteLl0rL2c7XG5cbnZhciBkZWNvZGVIVE1MQ2FjaGVkID0gY2FjaGVkKGRlY29kZSk7XG5cbi8vIGNvbmZpZ3VyYWJsZSBzdGF0ZVxudmFyIHdhcm4kMjtcbnZhciBkZWxpbWl0ZXJzO1xudmFyIHRyYW5zZm9ybXM7XG52YXIgcHJlVHJhbnNmb3JtcztcbnZhciBwb3N0VHJhbnNmb3JtcztcbnZhciBwbGF0Zm9ybUlzUHJlVGFnO1xudmFyIHBsYXRmb3JtTXVzdFVzZVByb3A7XG52YXIgcGxhdGZvcm1HZXRUYWdOYW1lc3BhY2U7XG5cbi8qKlxuICogQ29udmVydCBIVE1MIHN0cmluZyB0byBBU1QuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlIChcbiAgdGVtcGxhdGUsXG4gIG9wdGlvbnNcbikge1xuICB3YXJuJDIgPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XG4gIHBsYXRmb3JtR2V0VGFnTmFtZXNwYWNlID0gb3B0aW9ucy5nZXRUYWdOYW1lc3BhY2UgfHwgbm87XG4gIHBsYXRmb3JtTXVzdFVzZVByb3AgPSBvcHRpb25zLm11c3RVc2VQcm9wIHx8IG5vO1xuICBwbGF0Zm9ybUlzUHJlVGFnID0gb3B0aW9ucy5pc1ByZVRhZyB8fCBubztcbiAgcHJlVHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAncHJlVHJhbnNmb3JtTm9kZScpO1xuICB0cmFuc2Zvcm1zID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICd0cmFuc2Zvcm1Ob2RlJyk7XG4gIHBvc3RUcmFuc2Zvcm1zID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICdwb3N0VHJhbnNmb3JtTm9kZScpO1xuICBkZWxpbWl0ZXJzID0gb3B0aW9ucy5kZWxpbWl0ZXJzO1xuXG4gIHZhciBzdGFjayA9IFtdO1xuICB2YXIgcHJlc2VydmVXaGl0ZXNwYWNlID0gb3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2UgIT09IGZhbHNlO1xuICB2YXIgcm9vdDtcbiAgdmFyIGN1cnJlbnRQYXJlbnQ7XG4gIHZhciBpblZQcmUgPSBmYWxzZTtcbiAgdmFyIGluUHJlID0gZmFsc2U7XG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiB3YXJuT25jZSAobXNnKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICB3YXJuJDIobXNnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmRQcmUgKGVsZW1lbnQpIHtcbiAgICAvLyBjaGVjayBwcmUgc3RhdGVcbiAgICBpZiAoZWxlbWVudC5wcmUpIHtcbiAgICAgIGluVlByZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAocGxhdGZvcm1Jc1ByZVRhZyhlbGVtZW50LnRhZykpIHtcbiAgICAgIGluUHJlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGFyc2VIVE1MKHRlbXBsYXRlLCB7XG4gICAgd2Fybjogd2FybiQyLFxuICAgIGV4cGVjdEhUTUw6IG9wdGlvbnMuZXhwZWN0SFRNTCxcbiAgICBpc1VuYXJ5VGFnOiBvcHRpb25zLmlzVW5hcnlUYWcsXG4gICAgY2FuQmVMZWZ0T3BlblRhZzogb3B0aW9ucy5jYW5CZUxlZnRPcGVuVGFnLFxuICAgIHNob3VsZERlY29kZU5ld2xpbmVzOiBvcHRpb25zLnNob3VsZERlY29kZU5ld2xpbmVzLFxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCAodGFnLCBhdHRycywgdW5hcnkpIHtcbiAgICAgIC8vIGNoZWNrIG5hbWVzcGFjZS5cbiAgICAgIC8vIGluaGVyaXQgcGFyZW50IG5zIGlmIHRoZXJlIGlzIG9uZVxuICAgICAgdmFyIG5zID0gKGN1cnJlbnRQYXJlbnQgJiYgY3VycmVudFBhcmVudC5ucykgfHwgcGxhdGZvcm1HZXRUYWdOYW1lc3BhY2UodGFnKTtcblxuICAgICAgLy8gaGFuZGxlIElFIHN2ZyBidWdcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGlzSUUgJiYgbnMgPT09ICdzdmcnKSB7XG4gICAgICAgIGF0dHJzID0gZ3VhcmRJRVNWR0J1ZyhhdHRycyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50ID0ge1xuICAgICAgICB0eXBlOiAxLFxuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgYXR0cnNMaXN0OiBhdHRycyxcbiAgICAgICAgYXR0cnNNYXA6IG1ha2VBdHRyc01hcChhdHRycyksXG4gICAgICAgIHBhcmVudDogY3VycmVudFBhcmVudCxcbiAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICB9O1xuICAgICAgaWYgKG5zKSB7XG4gICAgICAgIGVsZW1lbnQubnMgPSBucztcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRm9yYmlkZGVuVGFnKGVsZW1lbnQpICYmICFpc1NlcnZlclJlbmRlcmluZygpKSB7XG4gICAgICAgIGVsZW1lbnQuZm9yYmlkZGVuID0gdHJ1ZTtcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybiQyKFxuICAgICAgICAgICdUZW1wbGF0ZXMgc2hvdWxkIG9ubHkgYmUgcmVzcG9uc2libGUgZm9yIG1hcHBpbmcgdGhlIHN0YXRlIHRvIHRoZSAnICtcbiAgICAgICAgICAnVUkuIEF2b2lkIHBsYWNpbmcgdGFncyB3aXRoIHNpZGUtZWZmZWN0cyBpbiB5b3VyIHRlbXBsYXRlcywgc3VjaCBhcyAnICtcbiAgICAgICAgICBcIjxcIiArIHRhZyArIFwiPlwiICsgJywgYXMgdGhleSB3aWxsIG5vdCBiZSBwYXJzZWQuJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBhcHBseSBwcmUtdHJhbnNmb3Jtc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVUcmFuc2Zvcm1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByZVRyYW5zZm9ybXNbaV0oZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW5WUHJlKSB7XG4gICAgICAgIHByb2Nlc3NQcmUoZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50LnByZSkge1xuICAgICAgICAgIGluVlByZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwbGF0Zm9ybUlzUHJlVGFnKGVsZW1lbnQudGFnKSkge1xuICAgICAgICBpblByZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW5WUHJlKSB7XG4gICAgICAgIHByb2Nlc3NSYXdBdHRycyhlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3NGb3IoZWxlbWVudCk7XG4gICAgICAgIHByb2Nlc3NJZihlbGVtZW50KTtcbiAgICAgICAgcHJvY2Vzc09uY2UoZWxlbWVudCk7XG4gICAgICAgIHByb2Nlc3NLZXkoZWxlbWVudCk7XG5cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhpcyBpcyBhIHBsYWluIGVsZW1lbnQgYWZ0ZXJcbiAgICAgICAgLy8gcmVtb3Zpbmcgc3RydWN0dXJhbCBhdHRyaWJ1dGVzXG4gICAgICAgIGVsZW1lbnQucGxhaW4gPSAhZWxlbWVudC5rZXkgJiYgIWF0dHJzLmxlbmd0aDtcblxuICAgICAgICBwcm9jZXNzUmVmKGVsZW1lbnQpO1xuICAgICAgICBwcm9jZXNzU2xvdChlbGVtZW50KTtcbiAgICAgICAgcHJvY2Vzc0NvbXBvbmVudChlbGVtZW50KTtcbiAgICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgdHJhbnNmb3Jtcy5sZW5ndGg7IGkkMSsrKSB7XG4gICAgICAgICAgdHJhbnNmb3Jtc1tpJDFdKGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NBdHRycyhlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2hlY2tSb290Q29uc3RyYWludHMgKGVsKSB7XG4gICAgICAgIHtcbiAgICAgICAgICBpZiAoZWwudGFnID09PSAnc2xvdCcgfHwgZWwudGFnID09PSAndGVtcGxhdGUnKSB7XG4gICAgICAgICAgICB3YXJuT25jZShcbiAgICAgICAgICAgICAgXCJDYW5ub3QgdXNlIDxcIiArIChlbC50YWcpICsgXCI+IGFzIGNvbXBvbmVudCByb290IGVsZW1lbnQgYmVjYXVzZSBpdCBtYXkgXCIgK1xuICAgICAgICAgICAgICAnY29udGFpbiBtdWx0aXBsZSBub2Rlcy4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwuYXR0cnNNYXAuaGFzT3duUHJvcGVydHkoJ3YtZm9yJykpIHtcbiAgICAgICAgICAgIHdhcm5PbmNlKFxuICAgICAgICAgICAgICAnQ2Fubm90IHVzZSB2LWZvciBvbiBzdGF0ZWZ1bCBjb21wb25lbnQgcm9vdCBlbGVtZW50IGJlY2F1c2UgJyArXG4gICAgICAgICAgICAgICdpdCByZW5kZXJzIG11bHRpcGxlIGVsZW1lbnRzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRyZWUgbWFuYWdlbWVudFxuICAgICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJvb3QgPSBlbGVtZW50O1xuICAgICAgICBjaGVja1Jvb3RDb25zdHJhaW50cyhyb290KTtcbiAgICAgIH0gZWxzZSBpZiAoIXN0YWNrLmxlbmd0aCkge1xuICAgICAgICAvLyBhbGxvdyByb290IGVsZW1lbnRzIHdpdGggdi1pZiwgdi1lbHNlLWlmIGFuZCB2LWVsc2VcbiAgICAgICAgaWYgKHJvb3QuaWYgJiYgKGVsZW1lbnQuZWxzZWlmIHx8IGVsZW1lbnQuZWxzZSkpIHtcbiAgICAgICAgICBjaGVja1Jvb3RDb25zdHJhaW50cyhlbGVtZW50KTtcbiAgICAgICAgICBhZGRJZkNvbmRpdGlvbihyb290LCB7XG4gICAgICAgICAgICBleHA6IGVsZW1lbnQuZWxzZWlmLFxuICAgICAgICAgICAgYmxvY2s6IGVsZW1lbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3YXJuT25jZShcbiAgICAgICAgICAgIFwiQ29tcG9uZW50IHRlbXBsYXRlIHNob3VsZCBjb250YWluIGV4YWN0bHkgb25lIHJvb3QgZWxlbWVudC4gXCIgK1xuICAgICAgICAgICAgXCJJZiB5b3UgYXJlIHVzaW5nIHYtaWYgb24gbXVsdGlwbGUgZWxlbWVudHMsIFwiICtcbiAgICAgICAgICAgIFwidXNlIHYtZWxzZS1pZiB0byBjaGFpbiB0aGVtIGluc3RlYWQuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFBhcmVudCAmJiAhZWxlbWVudC5mb3JiaWRkZW4pIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZWxzZWlmIHx8IGVsZW1lbnQuZWxzZSkge1xuICAgICAgICAgIHByb2Nlc3NJZkNvbmRpdGlvbnMoZWxlbWVudCwgY3VycmVudFBhcmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5zbG90U2NvcGUpIHsgLy8gc2NvcGVkIHNsb3RcbiAgICAgICAgICBjdXJyZW50UGFyZW50LnBsYWluID0gZmFsc2U7XG4gICAgICAgICAgdmFyIG5hbWUgPSBlbGVtZW50LnNsb3RUYXJnZXQgfHwgJ1wiZGVmYXVsdFwiJzsoY3VycmVudFBhcmVudC5zY29wZWRTbG90cyB8fCAoY3VycmVudFBhcmVudC5zY29wZWRTbG90cyA9IHt9KSlbbmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgICBlbGVtZW50LnBhcmVudCA9IGN1cnJlbnRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghdW5hcnkpIHtcbiAgICAgICAgY3VycmVudFBhcmVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHN0YWNrLnB1c2goZWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbmRQcmUoZWxlbWVudCk7XG4gICAgICB9XG4gICAgICAvLyBhcHBseSBwb3N0LXRyYW5zZm9ybXNcbiAgICAgIGZvciAodmFyIGkkMiA9IDA7IGkkMiA8IHBvc3RUcmFuc2Zvcm1zLmxlbmd0aDsgaSQyKyspIHtcbiAgICAgICAgcG9zdFRyYW5zZm9ybXNbaSQyXShlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5kOiBmdW5jdGlvbiBlbmQgKCkge1xuICAgICAgLy8gcmVtb3ZlIHRyYWlsaW5nIHdoaXRlc3BhY2VcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICB2YXIgbGFzdE5vZGUgPSBlbGVtZW50LmNoaWxkcmVuW2VsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICBpZiAobGFzdE5vZGUgJiYgbGFzdE5vZGUudHlwZSA9PT0gMyAmJiBsYXN0Tm9kZS50ZXh0ID09PSAnICcgJiYgIWluUHJlKSB7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4ucG9wKCk7XG4gICAgICB9XG4gICAgICAvLyBwb3Agc3RhY2tcbiAgICAgIHN0YWNrLmxlbmd0aCAtPSAxO1xuICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgZW5kUHJlKGVsZW1lbnQpO1xuICAgIH0sXG5cbiAgICBjaGFyczogZnVuY3Rpb24gY2hhcnMgKHRleHQpIHtcbiAgICAgIGlmICghY3VycmVudFBhcmVudCkge1xuICAgICAgICB7XG4gICAgICAgICAgaWYgKHRleHQgPT09IHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB3YXJuT25jZShcbiAgICAgICAgICAgICAgJ0NvbXBvbmVudCB0ZW1wbGF0ZSByZXF1aXJlcyBhIHJvb3QgZWxlbWVudCwgcmF0aGVyIHRoYW4ganVzdCB0ZXh0LidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIGlmICgodGV4dCA9IHRleHQudHJpbSgpKSkge1xuICAgICAgICAgICAgd2Fybk9uY2UoXG4gICAgICAgICAgICAgIChcInRleHQgXFxcIlwiICsgdGV4dCArIFwiXFxcIiBvdXRzaWRlIHJvb3QgZWxlbWVudCB3aWxsIGJlIGlnbm9yZWQuXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIElFIHRleHRhcmVhIHBsYWNlaG9sZGVyIGJ1Z1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoaXNJRSAmJlxuICAgICAgICBjdXJyZW50UGFyZW50LnRhZyA9PT0gJ3RleHRhcmVhJyAmJlxuICAgICAgICBjdXJyZW50UGFyZW50LmF0dHJzTWFwLnBsYWNlaG9sZGVyID09PSB0ZXh0XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRyZW4gPSBjdXJyZW50UGFyZW50LmNoaWxkcmVuO1xuICAgICAgdGV4dCA9IGluUHJlIHx8IHRleHQudHJpbSgpXG4gICAgICAgID8gaXNUZXh0VGFnKGN1cnJlbnRQYXJlbnQpID8gdGV4dCA6IGRlY29kZUhUTUxDYWNoZWQodGV4dClcbiAgICAgICAgLy8gb25seSBwcmVzZXJ2ZSB3aGl0ZXNwYWNlIGlmIGl0cyBub3QgcmlnaHQgYWZ0ZXIgYSBzdGFydGluZyB0YWdcbiAgICAgICAgOiBwcmVzZXJ2ZVdoaXRlc3BhY2UgJiYgY2hpbGRyZW4ubGVuZ3RoID8gJyAnIDogJyc7XG4gICAgICBpZiAodGV4dCkge1xuICAgICAgICB2YXIgZXhwcmVzc2lvbjtcbiAgICAgICAgaWYgKCFpblZQcmUgJiYgdGV4dCAhPT0gJyAnICYmIChleHByZXNzaW9uID0gcGFyc2VUZXh0KHRleHQsIGRlbGltaXRlcnMpKSkge1xuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogMixcbiAgICAgICAgICAgIGV4cHJlc3Npb246IGV4cHJlc3Npb24sXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGV4dCAhPT0gJyAnIHx8ICFjaGlsZHJlbi5sZW5ndGggfHwgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0udGV4dCAhPT0gJyAnKSB7XG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAzLFxuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJvb3Rcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1ByZSAoZWwpIHtcbiAgaWYgKGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LXByZScpICE9IG51bGwpIHtcbiAgICBlbC5wcmUgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NSYXdBdHRycyAoZWwpIHtcbiAgdmFyIGwgPSBlbC5hdHRyc0xpc3QubGVuZ3RoO1xuICBpZiAobCkge1xuICAgIHZhciBhdHRycyA9IGVsLmF0dHJzID0gbmV3IEFycmF5KGwpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBhdHRyc1tpXSA9IHtcbiAgICAgICAgbmFtZTogZWwuYXR0cnNMaXN0W2ldLm5hbWUsXG4gICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeShlbC5hdHRyc0xpc3RbaV0udmFsdWUpXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIGlmICghZWwucHJlKSB7XG4gICAgLy8gbm9uIHJvb3Qgbm9kZSBpbiBwcmUgYmxvY2tzIHdpdGggbm8gYXR0cmlidXRlc1xuICAgIGVsLnBsYWluID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzS2V5IChlbCkge1xuICB2YXIgZXhwID0gZ2V0QmluZGluZ0F0dHIoZWwsICdrZXknKTtcbiAgaWYgKGV4cCkge1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBlbC50YWcgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgIHdhcm4kMihcIjx0ZW1wbGF0ZT4gY2Fubm90IGJlIGtleWVkLiBQbGFjZSB0aGUga2V5IG9uIHJlYWwgZWxlbWVudHMgaW5zdGVhZC5cIik7XG4gICAgfVxuICAgIGVsLmtleSA9IGV4cDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzUmVmIChlbCkge1xuICB2YXIgcmVmID0gZ2V0QmluZGluZ0F0dHIoZWwsICdyZWYnKTtcbiAgaWYgKHJlZikge1xuICAgIGVsLnJlZiA9IHJlZjtcbiAgICBlbC5yZWZJbkZvciA9IGNoZWNrSW5Gb3IoZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NGb3IgKGVsKSB7XG4gIHZhciBleHA7XG4gIGlmICgoZXhwID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtZm9yJykpKSB7XG4gICAgdmFyIGluTWF0Y2ggPSBleHAubWF0Y2goZm9yQWxpYXNSRSk7XG4gICAgaWYgKCFpbk1hdGNoKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuJDIoXG4gICAgICAgIChcIkludmFsaWQgdi1mb3IgZXhwcmVzc2lvbjogXCIgKyBleHApXG4gICAgICApO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGVsLmZvciA9IGluTWF0Y2hbMl0udHJpbSgpO1xuICAgIHZhciBhbGlhcyA9IGluTWF0Y2hbMV0udHJpbSgpO1xuICAgIHZhciBpdGVyYXRvck1hdGNoID0gYWxpYXMubWF0Y2goZm9ySXRlcmF0b3JSRSk7XG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICAgIGVsLmFsaWFzID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCk7XG4gICAgICBlbC5pdGVyYXRvcjEgPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKTtcbiAgICAgIGlmIChpdGVyYXRvck1hdGNoWzNdKSB7XG4gICAgICAgIGVsLml0ZXJhdG9yMiA9IGl0ZXJhdG9yTWF0Y2hbM10udHJpbSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hbGlhcyA9IGFsaWFzO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzSWYgKGVsKSB7XG4gIHZhciBleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1pZicpO1xuICBpZiAoZXhwKSB7XG4gICAgZWwuaWYgPSBleHA7XG4gICAgYWRkSWZDb25kaXRpb24oZWwsIHtcbiAgICAgIGV4cDogZXhwLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UnKSAhPSBudWxsKSB7XG4gICAgICBlbC5lbHNlID0gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGVsc2VpZiA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UtaWYnKTtcbiAgICBpZiAoZWxzZWlmKSB7XG4gICAgICBlbC5lbHNlaWYgPSBlbHNlaWY7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NJZkNvbmRpdGlvbnMgKGVsLCBwYXJlbnQpIHtcbiAgdmFyIHByZXYgPSBmaW5kUHJldkVsZW1lbnQocGFyZW50LmNoaWxkcmVuKTtcbiAgaWYgKHByZXYgJiYgcHJldi5pZikge1xuICAgIGFkZElmQ29uZGl0aW9uKHByZXYsIHtcbiAgICAgIGV4cDogZWwuZWxzZWlmLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2FybiQyKFxuICAgICAgXCJ2LVwiICsgKGVsLmVsc2VpZiA/ICgnZWxzZS1pZj1cIicgKyBlbC5lbHNlaWYgKyAnXCInKSA6ICdlbHNlJykgKyBcIiBcIiArXG4gICAgICBcInVzZWQgb24gZWxlbWVudCA8XCIgKyAoZWwudGFnKSArIFwiPiB3aXRob3V0IGNvcnJlc3BvbmRpbmcgdi1pZi5cIlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZFByZXZFbGVtZW50IChjaGlsZHJlbikge1xuICB2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChjaGlsZHJlbltpXS50eXBlID09PSAxKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5baV1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNoaWxkcmVuW2ldLnRleHQgIT09ICcgJykge1xuICAgICAgICB3YXJuJDIoXG4gICAgICAgICAgXCJ0ZXh0IFxcXCJcIiArIChjaGlsZHJlbltpXS50ZXh0LnRyaW0oKSkgKyBcIlxcXCIgYmV0d2VlbiB2LWlmIGFuZCB2LWVsc2UoLWlmKSBcIiArXG4gICAgICAgICAgXCJ3aWxsIGJlIGlnbm9yZWQuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnBvcCgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRJZkNvbmRpdGlvbiAoZWwsIGNvbmRpdGlvbikge1xuICBpZiAoIWVsLmlmQ29uZGl0aW9ucykge1xuICAgIGVsLmlmQ29uZGl0aW9ucyA9IFtdO1xuICB9XG4gIGVsLmlmQ29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NPbmNlIChlbCkge1xuICB2YXIgb25jZSQkMSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LW9uY2UnKTtcbiAgaWYgKG9uY2UkJDEgIT0gbnVsbCkge1xuICAgIGVsLm9uY2UgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NTbG90IChlbCkge1xuICBpZiAoZWwudGFnID09PSAnc2xvdCcpIHtcbiAgICBlbC5zbG90TmFtZSA9IGdldEJpbmRpbmdBdHRyKGVsLCAnbmFtZScpO1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBlbC5rZXkpIHtcbiAgICAgIHdhcm4kMihcbiAgICAgICAgXCJga2V5YCBkb2VzIG5vdCB3b3JrIG9uIDxzbG90PiBiZWNhdXNlIHNsb3RzIGFyZSBhYnN0cmFjdCBvdXRsZXRzIFwiICtcbiAgICAgICAgXCJhbmQgY2FuIHBvc3NpYmx5IGV4cGFuZCBpbnRvIG11bHRpcGxlIGVsZW1lbnRzLiBcIiArXG4gICAgICAgIFwiVXNlIHRoZSBrZXkgb24gYSB3cmFwcGluZyBlbGVtZW50IGluc3RlYWQuXCJcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBzbG90VGFyZ2V0ID0gZ2V0QmluZGluZ0F0dHIoZWwsICdzbG90Jyk7XG4gICAgaWYgKHNsb3RUYXJnZXQpIHtcbiAgICAgIGVsLnNsb3RUYXJnZXQgPSBzbG90VGFyZ2V0ID09PSAnXCJcIicgPyAnXCJkZWZhdWx0XCInIDogc2xvdFRhcmdldDtcbiAgICB9XG4gICAgaWYgKGVsLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgZWwuc2xvdFNjb3BlID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3Njb3BlJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDb21wb25lbnQgKGVsKSB7XG4gIHZhciBiaW5kaW5nO1xuICBpZiAoKGJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ2lzJykpKSB7XG4gICAgZWwuY29tcG9uZW50ID0gYmluZGluZztcbiAgfVxuICBpZiAoZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ2lubGluZS10ZW1wbGF0ZScpICE9IG51bGwpIHtcbiAgICBlbC5pbmxpbmVUZW1wbGF0ZSA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0F0dHJzIChlbCkge1xuICB2YXIgbGlzdCA9IGVsLmF0dHJzTGlzdDtcbiAgdmFyIGksIGwsIG5hbWUsIHJhd05hbWUsIHZhbHVlLCBtb2RpZmllcnMsIGlzUHJvcDtcbiAgZm9yIChpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgbmFtZSA9IHJhd05hbWUgPSBsaXN0W2ldLm5hbWU7XG4gICAgdmFsdWUgPSBsaXN0W2ldLnZhbHVlO1xuICAgIGlmIChkaXJSRS50ZXN0KG5hbWUpKSB7XG4gICAgICAvLyBtYXJrIGVsZW1lbnQgYXMgZHluYW1pY1xuICAgICAgZWwuaGFzQmluZGluZ3MgPSB0cnVlO1xuICAgICAgLy8gbW9kaWZpZXJzXG4gICAgICBtb2RpZmllcnMgPSBwYXJzZU1vZGlmaWVycyhuYW1lKTtcbiAgICAgIGlmIChtb2RpZmllcnMpIHtcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShtb2RpZmllclJFLCAnJyk7XG4gICAgICB9XG4gICAgICBpZiAoYmluZFJFLnRlc3QobmFtZSkpIHsgLy8gdi1iaW5kXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoYmluZFJFLCAnJyk7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGaWx0ZXJzKHZhbHVlKTtcbiAgICAgICAgaXNQcm9wID0gZmFsc2U7XG4gICAgICAgIGlmIChtb2RpZmllcnMpIHtcbiAgICAgICAgICBpZiAobW9kaWZpZXJzLnByb3ApIHtcbiAgICAgICAgICAgIGlzUHJvcCA9IHRydWU7XG4gICAgICAgICAgICBuYW1lID0gY2FtZWxpemUobmFtZSk7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2lubmVySHRtbCcpIHsgbmFtZSA9ICdpbm5lckhUTUwnOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtb2RpZmllcnMuY2FtZWwpIHtcbiAgICAgICAgICAgIG5hbWUgPSBjYW1lbGl6ZShuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1vZGlmaWVycy5zeW5jKSB7XG4gICAgICAgICAgICBhZGRIYW5kbGVyKFxuICAgICAgICAgICAgICBlbCxcbiAgICAgICAgICAgICAgKFwidXBkYXRlOlwiICsgKGNhbWVsaXplKG5hbWUpKSksXG4gICAgICAgICAgICAgIGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCBcIiRldmVudFwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvcCB8fCBwbGF0Zm9ybU11c3RVc2VQcm9wKGVsLnRhZywgZWwuYXR0cnNNYXAudHlwZSwgbmFtZSkpIHtcbiAgICAgICAgICBhZGRQcm9wKGVsLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWRkQXR0cihlbCwgbmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG9uUkUudGVzdChuYW1lKSkgeyAvLyB2LW9uXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2Uob25SRSwgJycpO1xuICAgICAgICBhZGRIYW5kbGVyKGVsLCBuYW1lLCB2YWx1ZSwgbW9kaWZpZXJzLCBmYWxzZSwgd2FybiQyKTtcbiAgICAgIH0gZWxzZSB7IC8vIG5vcm1hbCBkaXJlY3RpdmVzXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoZGlyUkUsICcnKTtcbiAgICAgICAgLy8gcGFyc2UgYXJnXG4gICAgICAgIHZhciBhcmdNYXRjaCA9IG5hbWUubWF0Y2goYXJnUkUpO1xuICAgICAgICB2YXIgYXJnID0gYXJnTWF0Y2ggJiYgYXJnTWF0Y2hbMV07XG4gICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICBuYW1lID0gbmFtZS5zbGljZSgwLCAtKGFyZy5sZW5ndGggKyAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgYWRkRGlyZWN0aXZlKGVsLCBuYW1lLCByYXdOYW1lLCB2YWx1ZSwgYXJnLCBtb2RpZmllcnMpO1xuICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgbmFtZSA9PT0gJ21vZGVsJykge1xuICAgICAgICAgIGNoZWNrRm9yQWxpYXNNb2RlbChlbCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxpdGVyYWwgYXR0cmlidXRlXG4gICAgICB7XG4gICAgICAgIHZhciBleHByZXNzaW9uID0gcGFyc2VUZXh0KHZhbHVlLCBkZWxpbWl0ZXJzKTtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICB3YXJuJDIoXG4gICAgICAgICAgICBuYW1lICsgXCI9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCI6IFwiICtcbiAgICAgICAgICAgICdJbnRlcnBvbGF0aW9uIGluc2lkZSBhdHRyaWJ1dGVzIGhhcyBiZWVuIHJlbW92ZWQuICcgK1xuICAgICAgICAgICAgJ1VzZSB2LWJpbmQgb3IgdGhlIGNvbG9uIHNob3J0aGFuZCBpbnN0ZWFkLiBGb3IgZXhhbXBsZSwgJyArXG4gICAgICAgICAgICAnaW5zdGVhZCBvZiA8ZGl2IGlkPVwie3sgdmFsIH19XCI+LCB1c2UgPGRpdiA6aWQ9XCJ2YWxcIj4uJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFkZEF0dHIoZWwsIG5hbWUsIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW5Gb3IgKGVsKSB7XG4gIHZhciBwYXJlbnQgPSBlbDtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQuZm9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIHBhcnNlTW9kaWZpZXJzIChuYW1lKSB7XG4gIHZhciBtYXRjaCA9IG5hbWUubWF0Y2gobW9kaWZpZXJSRSk7XG4gIGlmIChtYXRjaCkge1xuICAgIHZhciByZXQgPSB7fTtcbiAgICBtYXRjaC5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7IHJldFttLnNsaWNlKDEpXSA9IHRydWU7IH0pO1xuICAgIHJldHVybiByZXRcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlQXR0cnNNYXAgKGF0dHJzKSB7XG4gIHZhciBtYXAgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgICAgbWFwW2F0dHJzW2ldLm5hbWVdICYmICFpc0lFICYmICFpc0VkZ2VcbiAgICApIHtcbiAgICAgIHdhcm4kMignZHVwbGljYXRlIGF0dHJpYnV0ZTogJyArIGF0dHJzW2ldLm5hbWUpO1xuICAgIH1cbiAgICBtYXBbYXR0cnNbaV0ubmFtZV0gPSBhdHRyc1tpXS52YWx1ZTtcbiAgfVxuICByZXR1cm4gbWFwXG59XG5cbi8vIGZvciBzY3JpcHQgKGUuZy4gdHlwZT1cIngvdGVtcGxhdGVcIikgb3Igc3R5bGUsIGRvIG5vdCBkZWNvZGUgY29udGVudFxuZnVuY3Rpb24gaXNUZXh0VGFnIChlbCkge1xuICByZXR1cm4gZWwudGFnID09PSAnc2NyaXB0JyB8fCBlbC50YWcgPT09ICdzdHlsZSdcbn1cblxuZnVuY3Rpb24gaXNGb3JiaWRkZW5UYWcgKGVsKSB7XG4gIHJldHVybiAoXG4gICAgZWwudGFnID09PSAnc3R5bGUnIHx8XG4gICAgKGVsLnRhZyA9PT0gJ3NjcmlwdCcgJiYgKFxuICAgICAgIWVsLmF0dHJzTWFwLnR5cGUgfHxcbiAgICAgIGVsLmF0dHJzTWFwLnR5cGUgPT09ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgKSlcbiAgKVxufVxuXG52YXIgaWVOU0J1ZyA9IC9eeG1sbnM6TlNcXGQrLztcbnZhciBpZU5TUHJlZml4ID0gL15OU1xcZCs6LztcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIGd1YXJkSUVTVkdCdWcgKGF0dHJzKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBhdHRyID0gYXR0cnNbaV07XG4gICAgaWYgKCFpZU5TQnVnLnRlc3QoYXR0ci5uYW1lKSkge1xuICAgICAgYXR0ci5uYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoaWVOU1ByZWZpeCwgJycpO1xuICAgICAgcmVzLnB1c2goYXR0cik7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBbGlhc01vZGVsIChlbCwgdmFsdWUpIHtcbiAgdmFyIF9lbCA9IGVsO1xuICB3aGlsZSAoX2VsKSB7XG4gICAgaWYgKF9lbC5mb3IgJiYgX2VsLmFsaWFzID09PSB2YWx1ZSkge1xuICAgICAgd2FybiQyKFxuICAgICAgICBcIjxcIiArIChlbC50YWcpICsgXCIgdi1tb2RlbD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj46IFwiICtcbiAgICAgICAgXCJZb3UgYXJlIGJpbmRpbmcgdi1tb2RlbCBkaXJlY3RseSB0byBhIHYtZm9yIGl0ZXJhdGlvbiBhbGlhcy4gXCIgK1xuICAgICAgICBcIlRoaXMgd2lsbCBub3QgYmUgYWJsZSB0byBtb2RpZnkgdGhlIHYtZm9yIHNvdXJjZSBhcnJheSBiZWNhdXNlIFwiICtcbiAgICAgICAgXCJ3cml0aW5nIHRvIHRoZSBhbGlhcyBpcyBsaWtlIG1vZGlmeWluZyBhIGZ1bmN0aW9uIGxvY2FsIHZhcmlhYmxlLiBcIiArXG4gICAgICAgIFwiQ29uc2lkZXIgdXNpbmcgYW4gYXJyYXkgb2Ygb2JqZWN0cyBhbmQgdXNlIHYtbW9kZWwgb24gYW4gb2JqZWN0IHByb3BlcnR5IGluc3RlYWQuXCJcbiAgICAgICk7XG4gICAgfVxuICAgIF9lbCA9IF9lbC5wYXJlbnQ7XG4gIH1cbn1cblxuLyogICovXG5cbnZhciBpc1N0YXRpY0tleTtcbnZhciBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWc7XG5cbnZhciBnZW5TdGF0aWNLZXlzQ2FjaGVkID0gY2FjaGVkKGdlblN0YXRpY0tleXMkMSk7XG5cbi8qKlxuICogR29hbCBvZiB0aGUgb3B0aW1pemVyOiB3YWxrIHRoZSBnZW5lcmF0ZWQgdGVtcGxhdGUgQVNUIHRyZWVcbiAqIGFuZCBkZXRlY3Qgc3ViLXRyZWVzIHRoYXQgYXJlIHB1cmVseSBzdGF0aWMsIGkuZS4gcGFydHMgb2ZcbiAqIHRoZSBET00gdGhhdCBuZXZlciBuZWVkcyB0byBjaGFuZ2UuXG4gKlxuICogT25jZSB3ZSBkZXRlY3QgdGhlc2Ugc3ViLXRyZWVzLCB3ZSBjYW46XG4gKlxuICogMS4gSG9pc3QgdGhlbSBpbnRvIGNvbnN0YW50cywgc28gdGhhdCB3ZSBubyBsb25nZXIgbmVlZCB0b1xuICogICAgY3JlYXRlIGZyZXNoIG5vZGVzIGZvciB0aGVtIG9uIGVhY2ggcmUtcmVuZGVyO1xuICogMi4gQ29tcGxldGVseSBza2lwIHRoZW0gaW4gdGhlIHBhdGNoaW5nIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplIChyb290LCBvcHRpb25zKSB7XG4gIGlmICghcm9vdCkgeyByZXR1cm4gfVxuICBpc1N0YXRpY0tleSA9IGdlblN0YXRpY0tleXNDYWNoZWQob3B0aW9ucy5zdGF0aWNLZXlzIHx8ICcnKTtcbiAgaXNQbGF0Zm9ybVJlc2VydmVkVGFnID0gb3B0aW9ucy5pc1Jlc2VydmVkVGFnIHx8IG5vO1xuICAvLyBmaXJzdCBwYXNzOiBtYXJrIGFsbCBub24tc3RhdGljIG5vZGVzLlxuICBtYXJrU3RhdGljJDEocm9vdCk7XG4gIC8vIHNlY29uZCBwYXNzOiBtYXJrIHN0YXRpYyByb290cy5cbiAgbWFya1N0YXRpY1Jvb3RzKHJvb3QsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gZ2VuU3RhdGljS2V5cyQxIChrZXlzKSB7XG4gIHJldHVybiBtYWtlTWFwKFxuICAgICd0eXBlLHRhZyxhdHRyc0xpc3QsYXR0cnNNYXAscGxhaW4scGFyZW50LGNoaWxkcmVuLGF0dHJzJyArXG4gICAgKGtleXMgPyAnLCcgKyBrZXlzIDogJycpXG4gIClcbn1cblxuZnVuY3Rpb24gbWFya1N0YXRpYyQxIChub2RlKSB7XG4gIG5vZGUuc3RhdGljID0gaXNTdGF0aWMobm9kZSk7XG4gIGlmIChub2RlLnR5cGUgPT09IDEpIHtcbiAgICAvLyBkbyBub3QgbWFrZSBjb21wb25lbnQgc2xvdCBjb250ZW50IHN0YXRpYy4gdGhpcyBhdm9pZHNcbiAgICAvLyAxLiBjb21wb25lbnRzIG5vdCBhYmxlIHRvIG11dGF0ZSBzbG90IG5vZGVzXG4gICAgLy8gMi4gc3RhdGljIHNsb3QgY29udGVudCBmYWlscyBmb3IgaG90LXJlbG9hZGluZ1xuICAgIGlmIChcbiAgICAgICFpc1BsYXRmb3JtUmVzZXJ2ZWRUYWcobm9kZS50YWcpICYmXG4gICAgICBub2RlLnRhZyAhPT0gJ3Nsb3QnICYmXG4gICAgICBub2RlLmF0dHJzTWFwWydpbmxpbmUtdGVtcGxhdGUnXSA9PSBudWxsXG4gICAgKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgIG1hcmtTdGF0aWMkMShjaGlsZCk7XG4gICAgICBpZiAoIWNoaWxkLnN0YXRpYykge1xuICAgICAgICBub2RlLnN0YXRpYyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJrU3RhdGljUm9vdHMgKG5vZGUsIGlzSW5Gb3IpIHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gMSkge1xuICAgIGlmIChub2RlLnN0YXRpYyB8fCBub2RlLm9uY2UpIHtcbiAgICAgIG5vZGUuc3RhdGljSW5Gb3IgPSBpc0luRm9yO1xuICAgIH1cbiAgICAvLyBGb3IgYSBub2RlIHRvIHF1YWxpZnkgYXMgYSBzdGF0aWMgcm9vdCwgaXQgc2hvdWxkIGhhdmUgY2hpbGRyZW4gdGhhdFxuICAgIC8vIGFyZSBub3QganVzdCBzdGF0aWMgdGV4dC4gT3RoZXJ3aXNlIHRoZSBjb3N0IG9mIGhvaXN0aW5nIG91dCB3aWxsXG4gICAgLy8gb3V0d2VpZ2ggdGhlIGJlbmVmaXRzIGFuZCBpdCdzIGJldHRlciBvZmYgdG8ganVzdCBhbHdheXMgcmVuZGVyIGl0IGZyZXNoLlxuICAgIGlmIChub2RlLnN0YXRpYyAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCAmJiAhKFxuICAgICAgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDEgJiZcbiAgICAgIG5vZGUuY2hpbGRyZW5bMF0udHlwZSA9PT0gM1xuICAgICkpIHtcbiAgICAgIG5vZGUuc3RhdGljUm9vdCA9IHRydWU7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zdGF0aWNSb290ID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIG1hcmtTdGF0aWNSb290cyhub2RlLmNoaWxkcmVuW2ldLCBpc0luRm9yIHx8ICEhbm9kZS5mb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9kZS5pZkNvbmRpdGlvbnMpIHtcbiAgICAgIHdhbGtUaHJvdWdoQ29uZGl0aW9uc0Jsb2Nrcyhub2RlLmlmQ29uZGl0aW9ucywgaXNJbkZvcik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHdhbGtUaHJvdWdoQ29uZGl0aW9uc0Jsb2NrcyAoY29uZGl0aW9uQmxvY2tzLCBpc0luRm9yKSB7XG4gIGZvciAodmFyIGkgPSAxLCBsZW4gPSBjb25kaXRpb25CbG9ja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBtYXJrU3RhdGljUm9vdHMoY29uZGl0aW9uQmxvY2tzW2ldLmJsb2NrLCBpc0luRm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1N0YXRpYyAobm9kZSkge1xuICBpZiAobm9kZS50eXBlID09PSAyKSB7IC8vIGV4cHJlc3Npb25cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAobm9kZS50eXBlID09PSAzKSB7IC8vIHRleHRcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiAhIShub2RlLnByZSB8fCAoXG4gICAgIW5vZGUuaGFzQmluZGluZ3MgJiYgLy8gbm8gZHluYW1pYyBiaW5kaW5nc1xuICAgICFub2RlLmlmICYmICFub2RlLmZvciAmJiAvLyBub3Qgdi1pZiBvciB2LWZvciBvciB2LWVsc2VcbiAgICAhaXNCdWlsdEluVGFnKG5vZGUudGFnKSAmJiAvLyBub3QgYSBidWlsdC1pblxuICAgIGlzUGxhdGZvcm1SZXNlcnZlZFRhZyhub2RlLnRhZykgJiYgLy8gbm90IGEgY29tcG9uZW50XG4gICAgIWlzRGlyZWN0Q2hpbGRPZlRlbXBsYXRlRm9yKG5vZGUpICYmXG4gICAgT2JqZWN0LmtleXMobm9kZSkuZXZlcnkoaXNTdGF0aWNLZXkpXG4gICkpXG59XG5cbmZ1bmN0aW9uIGlzRGlyZWN0Q2hpbGRPZlRlbXBsYXRlRm9yIChub2RlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudDtcbiAgICBpZiAobm9kZS50YWcgIT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAobm9kZS5mb3IpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKiAgKi9cblxudmFyIGZuRXhwUkUgPSAvXlxccyooW1xcdyRfXSt8XFwoW14pXSo/XFwpKVxccyo9PnxeZnVuY3Rpb25cXHMqXFwoLztcbnZhciBzaW1wbGVQYXRoUkUgPSAvXlxccypbQS1aYS16XyRdW1xcdyRdKig/OlxcLltBLVphLXpfJF1bXFx3JF0qfFxcWycuKj8nXXxcXFtcIi4qP1wiXXxcXFtcXGQrXXxcXFtbQS1aYS16XyRdW1xcdyRdKl0pKlxccyokLztcblxuLy8ga2V5Q29kZSBhbGlhc2VzXG52YXIga2V5Q29kZXMgPSB7XG4gIGVzYzogMjcsXG4gIHRhYjogOSxcbiAgZW50ZXI6IDEzLFxuICBzcGFjZTogMzIsXG4gIHVwOiAzOCxcbiAgbGVmdDogMzcsXG4gIHJpZ2h0OiAzOSxcbiAgZG93bjogNDAsXG4gICdkZWxldGUnOiBbOCwgNDZdXG59O1xuXG4vLyAjNDg2ODogbW9kaWZpZXJzIHRoYXQgcHJldmVudCB0aGUgZXhlY3V0aW9uIG9mIHRoZSBsaXN0ZW5lclxuLy8gbmVlZCB0byBleHBsaWNpdGx5IHJldHVybiBudWxsIHNvIHRoYXQgd2UgY2FuIGRldGVybWluZSB3aGV0aGVyIHRvIHJlbW92ZVxuLy8gdGhlIGxpc3RlbmVyIGZvciAub25jZVxudmFyIGdlbkd1YXJkID0gZnVuY3Rpb24gKGNvbmRpdGlvbikgeyByZXR1cm4gKFwiaWYoXCIgKyBjb25kaXRpb24gKyBcIilyZXR1cm4gbnVsbDtcIik7IH07XG5cbnZhciBtb2RpZmllckNvZGUgPSB7XG4gIHN0b3A6ICckZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7JyxcbiAgcHJldmVudDogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpOycsXG4gIHNlbGY6IGdlbkd1YXJkKFwiJGV2ZW50LnRhcmdldCAhPT0gJGV2ZW50LmN1cnJlbnRUYXJnZXRcIiksXG4gIGN0cmw6IGdlbkd1YXJkKFwiISRldmVudC5jdHJsS2V5XCIpLFxuICBzaGlmdDogZ2VuR3VhcmQoXCIhJGV2ZW50LnNoaWZ0S2V5XCIpLFxuICBhbHQ6IGdlbkd1YXJkKFwiISRldmVudC5hbHRLZXlcIiksXG4gIG1ldGE6IGdlbkd1YXJkKFwiISRldmVudC5tZXRhS2V5XCIpLFxuICBsZWZ0OiBnZW5HdWFyZChcIididXR0b24nIGluICRldmVudCAmJiAkZXZlbnQuYnV0dG9uICE9PSAwXCIpLFxuICBtaWRkbGU6IGdlbkd1YXJkKFwiJ2J1dHRvbicgaW4gJGV2ZW50ICYmICRldmVudC5idXR0b24gIT09IDFcIiksXG4gIHJpZ2h0OiBnZW5HdWFyZChcIididXR0b24nIGluICRldmVudCAmJiAkZXZlbnQuYnV0dG9uICE9PSAyXCIpXG59O1xuXG5mdW5jdGlvbiBnZW5IYW5kbGVycyAoXG4gIGV2ZW50cyxcbiAgaXNOYXRpdmUsXG4gIHdhcm5cbikge1xuICB2YXIgcmVzID0gaXNOYXRpdmUgPyAnbmF0aXZlT246eycgOiAnb246eyc7XG4gIGZvciAodmFyIG5hbWUgaW4gZXZlbnRzKSB7XG4gICAgdmFyIGhhbmRsZXIgPSBldmVudHNbbmFtZV07XG4gICAgLy8gIzUzMzA6IHdhcm4gY2xpY2sucmlnaHQsIHNpbmNlIHJpZ2h0IGNsaWNrcyBkbyBub3QgYWN0dWFsbHkgZmlyZSBjbGljayBldmVudHMuXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICBuYW1lID09PSAnY2xpY2snICYmXG4gICAgICBoYW5kbGVyICYmIGhhbmRsZXIubW9kaWZpZXJzICYmIGhhbmRsZXIubW9kaWZpZXJzLnJpZ2h0XG4gICAgKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBcIlVzZSBcXFwiY29udGV4dG1lbnVcXFwiIGluc3RlYWQgb2YgXFxcImNsaWNrLnJpZ2h0XFxcIiBzaW5jZSByaWdodCBjbGlja3MgXCIgK1xuICAgICAgICBcImRvIG5vdCBhY3R1YWxseSBmaXJlIFxcXCJjbGlja1xcXCIgZXZlbnRzLlwiXG4gICAgICApO1xuICAgIH1cbiAgICByZXMgKz0gXCJcXFwiXCIgKyBuYW1lICsgXCJcXFwiOlwiICsgKGdlbkhhbmRsZXIobmFtZSwgaGFuZGxlcikpICsgXCIsXCI7XG4gIH1cbiAgcmV0dXJuIHJlcy5zbGljZSgwLCAtMSkgKyAnfSdcbn1cblxuZnVuY3Rpb24gZ2VuSGFuZGxlciAoXG4gIG5hbWUsXG4gIGhhbmRsZXJcbikge1xuICBpZiAoIWhhbmRsZXIpIHtcbiAgICByZXR1cm4gJ2Z1bmN0aW9uKCl7fSdcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgcmV0dXJuIChcIltcIiArIChoYW5kbGVyLm1hcChmdW5jdGlvbiAoaGFuZGxlcikgeyByZXR1cm4gZ2VuSGFuZGxlcihuYW1lLCBoYW5kbGVyKTsgfSkuam9pbignLCcpKSArIFwiXVwiKVxuICB9XG5cbiAgdmFyIGlzTWV0aG9kUGF0aCA9IHNpbXBsZVBhdGhSRS50ZXN0KGhhbmRsZXIudmFsdWUpO1xuICB2YXIgaXNGdW5jdGlvbkV4cHJlc3Npb24gPSBmbkV4cFJFLnRlc3QoaGFuZGxlci52YWx1ZSk7XG5cbiAgaWYgKCFoYW5kbGVyLm1vZGlmaWVycykge1xuICAgIHJldHVybiBpc01ldGhvZFBhdGggfHwgaXNGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgID8gaGFuZGxlci52YWx1ZVxuICAgICAgOiAoXCJmdW5jdGlvbigkZXZlbnQpe1wiICsgKGhhbmRsZXIudmFsdWUpICsgXCJ9XCIpIC8vIGlubGluZSBzdGF0ZW1lbnRcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29kZSA9ICcnO1xuICAgIHZhciBnZW5Nb2RpZmllckNvZGUgPSAnJztcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBoYW5kbGVyLm1vZGlmaWVycykge1xuICAgICAgaWYgKG1vZGlmaWVyQ29kZVtrZXldKSB7XG4gICAgICAgIGdlbk1vZGlmaWVyQ29kZSArPSBtb2RpZmllckNvZGVba2V5XTtcbiAgICAgICAgLy8gbGVmdC9yaWdodFxuICAgICAgICBpZiAoa2V5Q29kZXNba2V5XSkge1xuICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgICBjb2RlICs9IGdlbktleUZpbHRlcihrZXlzKTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIG1vZGlmaWVycyBsaWtlIHByZXZlbnQgYW5kIHN0b3AgZ2V0IGV4ZWN1dGVkIGFmdGVyIGtleSBmaWx0ZXJpbmdcbiAgICBpZiAoZ2VuTW9kaWZpZXJDb2RlKSB7XG4gICAgICBjb2RlICs9IGdlbk1vZGlmaWVyQ29kZTtcbiAgICB9XG4gICAgdmFyIGhhbmRsZXJDb2RlID0gaXNNZXRob2RQYXRoXG4gICAgICA/IGhhbmRsZXIudmFsdWUgKyAnKCRldmVudCknXG4gICAgICA6IGlzRnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgID8gKFwiKFwiICsgKGhhbmRsZXIudmFsdWUpICsgXCIpKCRldmVudClcIilcbiAgICAgICAgOiBoYW5kbGVyLnZhbHVlO1xuICAgIHJldHVybiAoXCJmdW5jdGlvbigkZXZlbnQpe1wiICsgY29kZSArIGhhbmRsZXJDb2RlICsgXCJ9XCIpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuS2V5RmlsdGVyIChrZXlzKSB7XG4gIHJldHVybiAoXCJpZighKCdidXR0b24nIGluICRldmVudCkmJlwiICsgKGtleXMubWFwKGdlbkZpbHRlckNvZGUpLmpvaW4oJyYmJykpICsgXCIpcmV0dXJuIG51bGw7XCIpXG59XG5cbmZ1bmN0aW9uIGdlbkZpbHRlckNvZGUgKGtleSkge1xuICB2YXIga2V5VmFsID0gcGFyc2VJbnQoa2V5LCAxMCk7XG4gIGlmIChrZXlWYWwpIHtcbiAgICByZXR1cm4gKFwiJGV2ZW50LmtleUNvZGUhPT1cIiArIGtleVZhbClcbiAgfVxuICB2YXIgYWxpYXMgPSBrZXlDb2Rlc1trZXldO1xuICByZXR1cm4gKFwiX2soJGV2ZW50LmtleUNvZGUsXCIgKyAoSlNPTi5zdHJpbmdpZnkoa2V5KSkgKyAoYWxpYXMgPyAnLCcgKyBKU09OLnN0cmluZ2lmeShhbGlhcykgOiAnJykgKyBcIilcIilcbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGJpbmQkMSAoZWwsIGRpcikge1xuICBlbC53cmFwRGF0YSA9IGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgcmV0dXJuIChcIl9iKFwiICsgY29kZSArIFwiLCdcIiArIChlbC50YWcpICsgXCInLFwiICsgKGRpci52YWx1ZSkgKyAoZGlyLm1vZGlmaWVycyAmJiBkaXIubW9kaWZpZXJzLnByb3AgPyAnLHRydWUnIDogJycpICsgXCIpXCIpXG4gIH07XG59XG5cbi8qICAqL1xuXG52YXIgYmFzZURpcmVjdGl2ZXMgPSB7XG4gIGJpbmQ6IGJpbmQkMSxcbiAgY2xvYWs6IG5vb3Bcbn07XG5cbi8qICAqL1xuXG4vLyBjb25maWd1cmFibGUgc3RhdGVcbnZhciB3YXJuJDM7XG52YXIgdHJhbnNmb3JtcyQxO1xudmFyIGRhdGFHZW5GbnM7XG52YXIgcGxhdGZvcm1EaXJlY3RpdmVzJDE7XG52YXIgaXNQbGF0Zm9ybVJlc2VydmVkVGFnJDE7XG52YXIgc3RhdGljUmVuZGVyRm5zO1xudmFyIG9uY2VDb3VudDtcbnZhciBjdXJyZW50T3B0aW9ucztcblxuZnVuY3Rpb24gZ2VuZXJhdGUgKFxuICBhc3QsXG4gIG9wdGlvbnNcbikge1xuICAvLyBzYXZlIHByZXZpb3VzIHN0YXRpY1JlbmRlckZucyBzbyBnZW5lcmF0ZSBjYWxscyBjYW4gYmUgbmVzdGVkXG4gIHZhciBwcmV2U3RhdGljUmVuZGVyRm5zID0gc3RhdGljUmVuZGVyRm5zO1xuICB2YXIgY3VycmVudFN0YXRpY1JlbmRlckZucyA9IHN0YXRpY1JlbmRlckZucyA9IFtdO1xuICB2YXIgcHJldk9uY2VDb3VudCA9IG9uY2VDb3VudDtcbiAgb25jZUNvdW50ID0gMDtcbiAgY3VycmVudE9wdGlvbnMgPSBvcHRpb25zO1xuICB3YXJuJDMgPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XG4gIHRyYW5zZm9ybXMkMSA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAndHJhbnNmb3JtQ29kZScpO1xuICBkYXRhR2VuRm5zID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICdnZW5EYXRhJyk7XG4gIHBsYXRmb3JtRGlyZWN0aXZlcyQxID0gb3B0aW9ucy5kaXJlY3RpdmVzIHx8IHt9O1xuICBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWckMSA9IG9wdGlvbnMuaXNSZXNlcnZlZFRhZyB8fCBubztcbiAgdmFyIGNvZGUgPSBhc3QgPyBnZW5FbGVtZW50KGFzdCkgOiAnX2MoXCJkaXZcIiknO1xuICBzdGF0aWNSZW5kZXJGbnMgPSBwcmV2U3RhdGljUmVuZGVyRm5zO1xuICBvbmNlQ291bnQgPSBwcmV2T25jZUNvdW50O1xuICByZXR1cm4ge1xuICAgIHJlbmRlcjogKFwid2l0aCh0aGlzKXtyZXR1cm4gXCIgKyBjb2RlICsgXCJ9XCIpLFxuICAgIHN0YXRpY1JlbmRlckZuczogY3VycmVudFN0YXRpY1JlbmRlckZuc1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbkVsZW1lbnQgKGVsKSB7XG4gIGlmIChlbC5zdGF0aWNSb290ICYmICFlbC5zdGF0aWNQcm9jZXNzZWQpIHtcbiAgICByZXR1cm4gZ2VuU3RhdGljKGVsKVxuICB9IGVsc2UgaWYgKGVsLm9uY2UgJiYgIWVsLm9uY2VQcm9jZXNzZWQpIHtcbiAgICByZXR1cm4gZ2VuT25jZShlbClcbiAgfSBlbHNlIGlmIChlbC5mb3IgJiYgIWVsLmZvclByb2Nlc3NlZCkge1xuICAgIHJldHVybiBnZW5Gb3IoZWwpXG4gIH0gZWxzZSBpZiAoZWwuaWYgJiYgIWVsLmlmUHJvY2Vzc2VkKSB7XG4gICAgcmV0dXJuIGdlbklmKGVsKVxuICB9IGVsc2UgaWYgKGVsLnRhZyA9PT0gJ3RlbXBsYXRlJyAmJiAhZWwuc2xvdFRhcmdldCkge1xuICAgIHJldHVybiBnZW5DaGlsZHJlbihlbCkgfHwgJ3ZvaWQgMCdcbiAgfSBlbHNlIGlmIChlbC50YWcgPT09ICdzbG90Jykge1xuICAgIHJldHVybiBnZW5TbG90KGVsKVxuICB9IGVsc2Uge1xuICAgIC8vIGNvbXBvbmVudCBvciBlbGVtZW50XG4gICAgdmFyIGNvZGU7XG4gICAgaWYgKGVsLmNvbXBvbmVudCkge1xuICAgICAgY29kZSA9IGdlbkNvbXBvbmVudChlbC5jb21wb25lbnQsIGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRhdGEgPSBlbC5wbGFpbiA/IHVuZGVmaW5lZCA6IGdlbkRhdGEoZWwpO1xuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBlbC5pbmxpbmVUZW1wbGF0ZSA/IG51bGwgOiBnZW5DaGlsZHJlbihlbCwgdHJ1ZSk7XG4gICAgICBjb2RlID0gXCJfYygnXCIgKyAoZWwudGFnKSArIFwiJ1wiICsgKGRhdGEgPyAoXCIsXCIgKyBkYXRhKSA6ICcnKSArIChjaGlsZHJlbiA/IChcIixcIiArIGNoaWxkcmVuKSA6ICcnKSArIFwiKVwiO1xuICAgIH1cbiAgICAvLyBtb2R1bGUgdHJhbnNmb3Jtc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhbnNmb3JtcyQxLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb2RlID0gdHJhbnNmb3JtcyQxW2ldKGVsLCBjb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvZGVcbiAgfVxufVxuXG4vLyBob2lzdCBzdGF0aWMgc3ViLXRyZWVzIG91dFxuZnVuY3Rpb24gZ2VuU3RhdGljIChlbCkge1xuICBlbC5zdGF0aWNQcm9jZXNzZWQgPSB0cnVlO1xuICBzdGF0aWNSZW5kZXJGbnMucHVzaCgoXCJ3aXRoKHRoaXMpe3JldHVybiBcIiArIChnZW5FbGVtZW50KGVsKSkgKyBcIn1cIikpO1xuICByZXR1cm4gKFwiX20oXCIgKyAoc3RhdGljUmVuZGVyRm5zLmxlbmd0aCAtIDEpICsgKGVsLnN0YXRpY0luRm9yID8gJyx0cnVlJyA6ICcnKSArIFwiKVwiKVxufVxuXG4vLyB2LW9uY2VcbmZ1bmN0aW9uIGdlbk9uY2UgKGVsKSB7XG4gIGVsLm9uY2VQcm9jZXNzZWQgPSB0cnVlO1xuICBpZiAoZWwuaWYgJiYgIWVsLmlmUHJvY2Vzc2VkKSB7XG4gICAgcmV0dXJuIGdlbklmKGVsKVxuICB9IGVsc2UgaWYgKGVsLnN0YXRpY0luRm9yKSB7XG4gICAgdmFyIGtleSA9ICcnO1xuICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnQ7XG4gICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgaWYgKHBhcmVudC5mb3IpIHtcbiAgICAgICAga2V5ID0gcGFyZW50LmtleTtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIGlmICgha2V5KSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuJDMoXG4gICAgICAgIFwidi1vbmNlIGNhbiBvbmx5IGJlIHVzZWQgaW5zaWRlIHYtZm9yIHRoYXQgaXMga2V5ZWQuIFwiXG4gICAgICApO1xuICAgICAgcmV0dXJuIGdlbkVsZW1lbnQoZWwpXG4gICAgfVxuICAgIHJldHVybiAoXCJfbyhcIiArIChnZW5FbGVtZW50KGVsKSkgKyBcIixcIiArIChvbmNlQ291bnQrKykgKyAoa2V5ID8gKFwiLFwiICsga2V5KSA6IFwiXCIpICsgXCIpXCIpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdlblN0YXRpYyhlbClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5JZiAoZWwpIHtcbiAgZWwuaWZQcm9jZXNzZWQgPSB0cnVlOyAvLyBhdm9pZCByZWN1cnNpb25cbiAgcmV0dXJuIGdlbklmQ29uZGl0aW9ucyhlbC5pZkNvbmRpdGlvbnMuc2xpY2UoKSlcbn1cblxuZnVuY3Rpb24gZ2VuSWZDb25kaXRpb25zIChjb25kaXRpb25zKSB7XG4gIGlmICghY29uZGl0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJ19lKCknXG4gIH1cblxuICB2YXIgY29uZGl0aW9uID0gY29uZGl0aW9ucy5zaGlmdCgpO1xuICBpZiAoY29uZGl0aW9uLmV4cCkge1xuICAgIHJldHVybiAoXCIoXCIgKyAoY29uZGl0aW9uLmV4cCkgKyBcIik/XCIgKyAoZ2VuVGVybmFyeUV4cChjb25kaXRpb24uYmxvY2spKSArIFwiOlwiICsgKGdlbklmQ29uZGl0aW9ucyhjb25kaXRpb25zKSkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChcIlwiICsgKGdlblRlcm5hcnlFeHAoY29uZGl0aW9uLmJsb2NrKSkpXG4gIH1cblxuICAvLyB2LWlmIHdpdGggdi1vbmNlIHNob3VsZCBnZW5lcmF0ZSBjb2RlIGxpa2UgKGEpP19tKDApOl9tKDEpXG4gIGZ1bmN0aW9uIGdlblRlcm5hcnlFeHAgKGVsKSB7XG4gICAgcmV0dXJuIGVsLm9uY2UgPyBnZW5PbmNlKGVsKSA6IGdlbkVsZW1lbnQoZWwpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuRm9yIChlbCkge1xuICB2YXIgZXhwID0gZWwuZm9yO1xuICB2YXIgYWxpYXMgPSBlbC5hbGlhcztcbiAgdmFyIGl0ZXJhdG9yMSA9IGVsLml0ZXJhdG9yMSA/IChcIixcIiArIChlbC5pdGVyYXRvcjEpKSA6ICcnO1xuICB2YXIgaXRlcmF0b3IyID0gZWwuaXRlcmF0b3IyID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMikpIDogJyc7XG5cbiAgaWYgKFxuICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgbWF5YmVDb21wb25lbnQoZWwpICYmIGVsLnRhZyAhPT0gJ3Nsb3QnICYmIGVsLnRhZyAhPT0gJ3RlbXBsYXRlJyAmJiAhZWwua2V5XG4gICkge1xuICAgIHdhcm4kMyhcbiAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LWZvcj1cXFwiXCIgKyBhbGlhcyArIFwiIGluIFwiICsgZXhwICsgXCJcXFwiPjogY29tcG9uZW50IGxpc3RzIHJlbmRlcmVkIHdpdGggXCIgK1xuICAgICAgXCJ2LWZvciBzaG91bGQgaGF2ZSBleHBsaWNpdCBrZXlzLiBcIiArXG4gICAgICBcIlNlZSBodHRwczovL3Z1ZWpzLm9yZy9ndWlkZS9saXN0Lmh0bWwja2V5IGZvciBtb3JlIGluZm8uXCIsXG4gICAgICB0cnVlIC8qIHRpcCAqL1xuICAgICk7XG4gIH1cblxuICBlbC5mb3JQcm9jZXNzZWQgPSB0cnVlOyAvLyBhdm9pZCByZWN1cnNpb25cbiAgcmV0dXJuIFwiX2woKFwiICsgZXhwICsgXCIpLFwiICtcbiAgICBcImZ1bmN0aW9uKFwiICsgYWxpYXMgKyBpdGVyYXRvcjEgKyBpdGVyYXRvcjIgKyBcIil7XCIgK1xuICAgICAgXCJyZXR1cm4gXCIgKyAoZ2VuRWxlbWVudChlbCkpICtcbiAgICAnfSknXG59XG5cbmZ1bmN0aW9uIGdlbkRhdGEgKGVsKSB7XG4gIHZhciBkYXRhID0gJ3snO1xuXG4gIC8vIGRpcmVjdGl2ZXMgZmlyc3QuXG4gIC8vIGRpcmVjdGl2ZXMgbWF5IG11dGF0ZSB0aGUgZWwncyBvdGhlciBwcm9wZXJ0aWVzIGJlZm9yZSB0aGV5IGFyZSBnZW5lcmF0ZWQuXG4gIHZhciBkaXJzID0gZ2VuRGlyZWN0aXZlcyhlbCk7XG4gIGlmIChkaXJzKSB7IGRhdGEgKz0gZGlycyArICcsJzsgfVxuXG4gIC8vIGtleVxuICBpZiAoZWwua2V5KSB7XG4gICAgZGF0YSArPSBcImtleTpcIiArIChlbC5rZXkpICsgXCIsXCI7XG4gIH1cbiAgLy8gcmVmXG4gIGlmIChlbC5yZWYpIHtcbiAgICBkYXRhICs9IFwicmVmOlwiICsgKGVsLnJlZikgKyBcIixcIjtcbiAgfVxuICBpZiAoZWwucmVmSW5Gb3IpIHtcbiAgICBkYXRhICs9IFwicmVmSW5Gb3I6dHJ1ZSxcIjtcbiAgfVxuICAvLyBwcmVcbiAgaWYgKGVsLnByZSkge1xuICAgIGRhdGEgKz0gXCJwcmU6dHJ1ZSxcIjtcbiAgfVxuICAvLyByZWNvcmQgb3JpZ2luYWwgdGFnIG5hbWUgZm9yIGNvbXBvbmVudHMgdXNpbmcgXCJpc1wiIGF0dHJpYnV0ZVxuICBpZiAoZWwuY29tcG9uZW50KSB7XG4gICAgZGF0YSArPSBcInRhZzpcXFwiXCIgKyAoZWwudGFnKSArIFwiXFxcIixcIjtcbiAgfVxuICAvLyBtb2R1bGUgZGF0YSBnZW5lcmF0aW9uIGZ1bmN0aW9uc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFHZW5GbnMubGVuZ3RoOyBpKyspIHtcbiAgICBkYXRhICs9IGRhdGFHZW5GbnNbaV0oZWwpO1xuICB9XG4gIC8vIGF0dHJpYnV0ZXNcbiAgaWYgKGVsLmF0dHJzKSB7XG4gICAgZGF0YSArPSBcImF0dHJzOntcIiArIChnZW5Qcm9wcyhlbC5hdHRycykpICsgXCJ9LFwiO1xuICB9XG4gIC8vIERPTSBwcm9wc1xuICBpZiAoZWwucHJvcHMpIHtcbiAgICBkYXRhICs9IFwiZG9tUHJvcHM6e1wiICsgKGdlblByb3BzKGVsLnByb3BzKSkgKyBcIn0sXCI7XG4gIH1cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgaWYgKGVsLmV2ZW50cykge1xuICAgIGRhdGEgKz0gKGdlbkhhbmRsZXJzKGVsLmV2ZW50cywgZmFsc2UsIHdhcm4kMykpICsgXCIsXCI7XG4gIH1cbiAgaWYgKGVsLm5hdGl2ZUV2ZW50cykge1xuICAgIGRhdGEgKz0gKGdlbkhhbmRsZXJzKGVsLm5hdGl2ZUV2ZW50cywgdHJ1ZSwgd2FybiQzKSkgKyBcIixcIjtcbiAgfVxuICAvLyBzbG90IHRhcmdldFxuICBpZiAoZWwuc2xvdFRhcmdldCkge1xuICAgIGRhdGEgKz0gXCJzbG90OlwiICsgKGVsLnNsb3RUYXJnZXQpICsgXCIsXCI7XG4gIH1cbiAgLy8gc2NvcGVkIHNsb3RzXG4gIGlmIChlbC5zY29wZWRTbG90cykge1xuICAgIGRhdGEgKz0gKGdlblNjb3BlZFNsb3RzKGVsLnNjb3BlZFNsb3RzKSkgKyBcIixcIjtcbiAgfVxuICAvLyBjb21wb25lbnQgdi1tb2RlbFxuICBpZiAoZWwubW9kZWwpIHtcbiAgICBkYXRhICs9IFwibW9kZWw6e3ZhbHVlOlwiICsgKGVsLm1vZGVsLnZhbHVlKSArIFwiLGNhbGxiYWNrOlwiICsgKGVsLm1vZGVsLmNhbGxiYWNrKSArIFwiLGV4cHJlc3Npb246XCIgKyAoZWwubW9kZWwuZXhwcmVzc2lvbikgKyBcIn0sXCI7XG4gIH1cbiAgLy8gaW5saW5lLXRlbXBsYXRlXG4gIGlmIChlbC5pbmxpbmVUZW1wbGF0ZSkge1xuICAgIHZhciBpbmxpbmVUZW1wbGF0ZSA9IGdlbklubGluZVRlbXBsYXRlKGVsKTtcbiAgICBpZiAoaW5saW5lVGVtcGxhdGUpIHtcbiAgICAgIGRhdGEgKz0gaW5saW5lVGVtcGxhdGUgKyBcIixcIjtcbiAgICB9XG4gIH1cbiAgZGF0YSA9IGRhdGEucmVwbGFjZSgvLCQvLCAnJykgKyAnfSc7XG4gIC8vIHYtYmluZCBkYXRhIHdyYXBcbiAgaWYgKGVsLndyYXBEYXRhKSB7XG4gICAgZGF0YSA9IGVsLndyYXBEYXRhKGRhdGEpO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbmZ1bmN0aW9uIGdlbkRpcmVjdGl2ZXMgKGVsKSB7XG4gIHZhciBkaXJzID0gZWwuZGlyZWN0aXZlcztcbiAgaWYgKCFkaXJzKSB7IHJldHVybiB9XG4gIHZhciByZXMgPSAnZGlyZWN0aXZlczpbJztcbiAgdmFyIGhhc1J1bnRpbWUgPSBmYWxzZTtcbiAgdmFyIGksIGwsIGRpciwgbmVlZFJ1bnRpbWU7XG4gIGZvciAoaSA9IDAsIGwgPSBkaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGRpciA9IGRpcnNbaV07XG4gICAgbmVlZFJ1bnRpbWUgPSB0cnVlO1xuICAgIHZhciBnZW4gPSBwbGF0Zm9ybURpcmVjdGl2ZXMkMVtkaXIubmFtZV0gfHwgYmFzZURpcmVjdGl2ZXNbZGlyLm5hbWVdO1xuICAgIGlmIChnZW4pIHtcbiAgICAgIC8vIGNvbXBpbGUtdGltZSBkaXJlY3RpdmUgdGhhdCBtYW5pcHVsYXRlcyBBU1QuXG4gICAgICAvLyByZXR1cm5zIHRydWUgaWYgaXQgYWxzbyBuZWVkcyBhIHJ1bnRpbWUgY291bnRlcnBhcnQuXG4gICAgICBuZWVkUnVudGltZSA9ICEhZ2VuKGVsLCBkaXIsIHdhcm4kMyk7XG4gICAgfVxuICAgIGlmIChuZWVkUnVudGltZSkge1xuICAgICAgaGFzUnVudGltZSA9IHRydWU7XG4gICAgICByZXMgKz0gXCJ7bmFtZTpcXFwiXCIgKyAoZGlyLm5hbWUpICsgXCJcXFwiLHJhd05hbWU6XFxcIlwiICsgKGRpci5yYXdOYW1lKSArIFwiXFxcIlwiICsgKGRpci52YWx1ZSA/IChcIix2YWx1ZTooXCIgKyAoZGlyLnZhbHVlKSArIFwiKSxleHByZXNzaW9uOlwiICsgKEpTT04uc3RyaW5naWZ5KGRpci52YWx1ZSkpKSA6ICcnKSArIChkaXIuYXJnID8gKFwiLGFyZzpcXFwiXCIgKyAoZGlyLmFyZykgKyBcIlxcXCJcIikgOiAnJykgKyAoZGlyLm1vZGlmaWVycyA/IChcIixtb2RpZmllcnM6XCIgKyAoSlNPTi5zdHJpbmdpZnkoZGlyLm1vZGlmaWVycykpKSA6ICcnKSArIFwifSxcIjtcbiAgICB9XG4gIH1cbiAgaWYgKGhhc1J1bnRpbWUpIHtcbiAgICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKSArICddJ1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbklubGluZVRlbXBsYXRlIChlbCkge1xuICB2YXIgYXN0ID0gZWwuY2hpbGRyZW5bMF07XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAoXG4gICAgZWwuY2hpbGRyZW4ubGVuZ3RoID4gMSB8fCBhc3QudHlwZSAhPT0gMVxuICApKSB7XG4gICAgd2FybiQzKCdJbmxpbmUtdGVtcGxhdGUgY29tcG9uZW50cyBtdXN0IGhhdmUgZXhhY3RseSBvbmUgY2hpbGQgZWxlbWVudC4nKTtcbiAgfVxuICBpZiAoYXN0LnR5cGUgPT09IDEpIHtcbiAgICB2YXIgaW5saW5lUmVuZGVyRm5zID0gZ2VuZXJhdGUoYXN0LCBjdXJyZW50T3B0aW9ucyk7XG4gICAgcmV0dXJuIChcImlubGluZVRlbXBsYXRlOntyZW5kZXI6ZnVuY3Rpb24oKXtcIiArIChpbmxpbmVSZW5kZXJGbnMucmVuZGVyKSArIFwifSxzdGF0aWNSZW5kZXJGbnM6W1wiICsgKGlubGluZVJlbmRlckZucy5zdGF0aWNSZW5kZXJGbnMubWFwKGZ1bmN0aW9uIChjb2RlKSB7IHJldHVybiAoXCJmdW5jdGlvbigpe1wiICsgY29kZSArIFwifVwiKTsgfSkuam9pbignLCcpKSArIFwiXX1cIilcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5TY29wZWRTbG90cyAoc2xvdHMpIHtcbiAgcmV0dXJuIChcInNjb3BlZFNsb3RzOl91KFtcIiArIChPYmplY3Qua2V5cyhzbG90cykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGdlblNjb3BlZFNsb3Qoa2V5LCBzbG90c1trZXldKTsgfSkuam9pbignLCcpKSArIFwiXSlcIilcbn1cblxuZnVuY3Rpb24gZ2VuU2NvcGVkU2xvdCAoa2V5LCBlbCkge1xuICBpZiAoZWwuZm9yICYmICFlbC5mb3JQcm9jZXNzZWQpIHtcbiAgICByZXR1cm4gZ2VuRm9yU2NvcGVkU2xvdChrZXksIGVsKVxuICB9XG4gIHJldHVybiBcIntrZXk6XCIgKyBrZXkgKyBcIixmbjpmdW5jdGlvbihcIiArIChTdHJpbmcoZWwuYXR0cnNNYXAuc2NvcGUpKSArIFwiKXtcIiArXG4gICAgXCJyZXR1cm4gXCIgKyAoZWwudGFnID09PSAndGVtcGxhdGUnXG4gICAgICA/IGdlbkNoaWxkcmVuKGVsKSB8fCAndm9pZCAwJ1xuICAgICAgOiBnZW5FbGVtZW50KGVsKSkgKyBcIn19XCJcbn1cblxuZnVuY3Rpb24gZ2VuRm9yU2NvcGVkU2xvdCAoa2V5LCBlbCkge1xuICB2YXIgZXhwID0gZWwuZm9yO1xuICB2YXIgYWxpYXMgPSBlbC5hbGlhcztcbiAgdmFyIGl0ZXJhdG9yMSA9IGVsLml0ZXJhdG9yMSA/IChcIixcIiArIChlbC5pdGVyYXRvcjEpKSA6ICcnO1xuICB2YXIgaXRlcmF0b3IyID0gZWwuaXRlcmF0b3IyID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMikpIDogJyc7XG4gIGVsLmZvclByb2Nlc3NlZCA9IHRydWU7IC8vIGF2b2lkIHJlY3Vyc2lvblxuICByZXR1cm4gXCJfbCgoXCIgKyBleHAgKyBcIiksXCIgK1xuICAgIFwiZnVuY3Rpb24oXCIgKyBhbGlhcyArIGl0ZXJhdG9yMSArIGl0ZXJhdG9yMiArIFwiKXtcIiArXG4gICAgICBcInJldHVybiBcIiArIChnZW5TY29wZWRTbG90KGtleSwgZWwpKSArXG4gICAgJ30pJ1xufVxuXG5mdW5jdGlvbiBnZW5DaGlsZHJlbiAoZWwsIGNoZWNrU2tpcCkge1xuICB2YXIgY2hpbGRyZW4gPSBlbC5jaGlsZHJlbjtcbiAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHZhciBlbCQxID0gY2hpbGRyZW5bMF07XG4gICAgLy8gb3B0aW1pemUgc2luZ2xlIHYtZm9yXG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgZWwkMS5mb3IgJiZcbiAgICAgIGVsJDEudGFnICE9PSAndGVtcGxhdGUnICYmXG4gICAgICBlbCQxLnRhZyAhPT0gJ3Nsb3QnXG4gICAgKSB7XG4gICAgICByZXR1cm4gZ2VuRWxlbWVudChlbCQxKVxuICAgIH1cbiAgICB2YXIgbm9ybWFsaXphdGlvblR5cGUgPSBjaGVja1NraXAgPyBnZXROb3JtYWxpemF0aW9uVHlwZShjaGlsZHJlbikgOiAwO1xuICAgIHJldHVybiAoXCJbXCIgKyAoY2hpbGRyZW4ubWFwKGdlbk5vZGUpLmpvaW4oJywnKSkgKyBcIl1cIiArIChub3JtYWxpemF0aW9uVHlwZSA/IChcIixcIiArIG5vcm1hbGl6YXRpb25UeXBlKSA6ICcnKSlcbiAgfVxufVxuXG4vLyBkZXRlcm1pbmUgdGhlIG5vcm1hbGl6YXRpb24gbmVlZGVkIGZvciB0aGUgY2hpbGRyZW4gYXJyYXkuXG4vLyAwOiBubyBub3JtYWxpemF0aW9uIG5lZWRlZFxuLy8gMTogc2ltcGxlIG5vcm1hbGl6YXRpb24gbmVlZGVkIChwb3NzaWJsZSAxLWxldmVsIGRlZXAgbmVzdGVkIGFycmF5KVxuLy8gMjogZnVsbCBub3JtYWxpemF0aW9uIG5lZWRlZFxuZnVuY3Rpb24gZ2V0Tm9ybWFsaXphdGlvblR5cGUgKGNoaWxkcmVuKSB7XG4gIHZhciByZXMgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVsID0gY2hpbGRyZW5baV07XG4gICAgaWYgKGVsLnR5cGUgIT09IDEpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICAgIGlmIChuZWVkc05vcm1hbGl6YXRpb24oZWwpIHx8XG4gICAgICAgIChlbC5pZkNvbmRpdGlvbnMgJiYgZWwuaWZDb25kaXRpb25zLnNvbWUoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIG5lZWRzTm9ybWFsaXphdGlvbihjLmJsb2NrKTsgfSkpKSB7XG4gICAgICByZXMgPSAyO1xuICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKG1heWJlQ29tcG9uZW50KGVsKSB8fFxuICAgICAgICAoZWwuaWZDb25kaXRpb25zICYmIGVsLmlmQ29uZGl0aW9ucy5zb21lKGZ1bmN0aW9uIChjKSB7IHJldHVybiBtYXliZUNvbXBvbmVudChjLmJsb2NrKTsgfSkpKSB7XG4gICAgICByZXMgPSAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIG5lZWRzTm9ybWFsaXphdGlvbiAoZWwpIHtcbiAgcmV0dXJuIGVsLmZvciAhPT0gdW5kZWZpbmVkIHx8IGVsLnRhZyA9PT0gJ3RlbXBsYXRlJyB8fCBlbC50YWcgPT09ICdzbG90J1xufVxuXG5mdW5jdGlvbiBtYXliZUNvbXBvbmVudCAoZWwpIHtcbiAgcmV0dXJuICFpc1BsYXRmb3JtUmVzZXJ2ZWRUYWckMShlbC50YWcpXG59XG5cbmZ1bmN0aW9uIGdlbk5vZGUgKG5vZGUpIHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gMSkge1xuICAgIHJldHVybiBnZW5FbGVtZW50KG5vZGUpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdlblRleHQobm9kZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5UZXh0ICh0ZXh0KSB7XG4gIHJldHVybiAoXCJfdihcIiArICh0ZXh0LnR5cGUgPT09IDJcbiAgICA/IHRleHQuZXhwcmVzc2lvbiAvLyBubyBuZWVkIGZvciAoKSBiZWNhdXNlIGFscmVhZHkgd3JhcHBlZCBpbiBfcygpXG4gICAgOiB0cmFuc2Zvcm1TcGVjaWFsTmV3bGluZXMoSlNPTi5zdHJpbmdpZnkodGV4dC50ZXh0KSkpICsgXCIpXCIpXG59XG5cbmZ1bmN0aW9uIGdlblNsb3QgKGVsKSB7XG4gIHZhciBzbG90TmFtZSA9IGVsLnNsb3ROYW1lIHx8ICdcImRlZmF1bHRcIic7XG4gIHZhciBjaGlsZHJlbiA9IGdlbkNoaWxkcmVuKGVsKTtcbiAgdmFyIHJlcyA9IFwiX3QoXCIgKyBzbG90TmFtZSArIChjaGlsZHJlbiA/IChcIixcIiArIGNoaWxkcmVuKSA6ICcnKTtcbiAgdmFyIGF0dHJzID0gZWwuYXR0cnMgJiYgKFwie1wiICsgKGVsLmF0dHJzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gKChjYW1lbGl6ZShhLm5hbWUpKSArIFwiOlwiICsgKGEudmFsdWUpKTsgfSkuam9pbignLCcpKSArIFwifVwiKTtcbiAgdmFyIGJpbmQkJDEgPSBlbC5hdHRyc01hcFsndi1iaW5kJ107XG4gIGlmICgoYXR0cnMgfHwgYmluZCQkMSkgJiYgIWNoaWxkcmVuKSB7XG4gICAgcmVzICs9IFwiLG51bGxcIjtcbiAgfVxuICBpZiAoYXR0cnMpIHtcbiAgICByZXMgKz0gXCIsXCIgKyBhdHRycztcbiAgfVxuICBpZiAoYmluZCQkMSkge1xuICAgIHJlcyArPSAoYXR0cnMgPyAnJyA6ICcsbnVsbCcpICsgXCIsXCIgKyBiaW5kJCQxO1xuICB9XG4gIHJldHVybiByZXMgKyAnKSdcbn1cblxuLy8gY29tcG9uZW50TmFtZSBpcyBlbC5jb21wb25lbnQsIHRha2UgaXQgYXMgYXJndW1lbnQgdG8gc2h1biBmbG93J3MgcGVzc2ltaXN0aWMgcmVmaW5lbWVudFxuZnVuY3Rpb24gZ2VuQ29tcG9uZW50IChjb21wb25lbnROYW1lLCBlbCkge1xuICB2YXIgY2hpbGRyZW4gPSBlbC5pbmxpbmVUZW1wbGF0ZSA/IG51bGwgOiBnZW5DaGlsZHJlbihlbCwgdHJ1ZSk7XG4gIHJldHVybiAoXCJfYyhcIiArIGNvbXBvbmVudE5hbWUgKyBcIixcIiArIChnZW5EYXRhKGVsKSkgKyAoY2hpbGRyZW4gPyAoXCIsXCIgKyBjaGlsZHJlbikgOiAnJykgKyBcIilcIilcbn1cblxuZnVuY3Rpb24gZ2VuUHJvcHMgKHByb3BzKSB7XG4gIHZhciByZXMgPSAnJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwcm9wID0gcHJvcHNbaV07XG4gICAgcmVzICs9IFwiXFxcIlwiICsgKHByb3AubmFtZSkgKyBcIlxcXCI6XCIgKyAodHJhbnNmb3JtU3BlY2lhbE5ld2xpbmVzKHByb3AudmFsdWUpKSArIFwiLFwiO1xuICB9XG4gIHJldHVybiByZXMuc2xpY2UoMCwgLTEpXG59XG5cbi8vICMzODk1LCAjNDI2OFxuZnVuY3Rpb24gdHJhbnNmb3JtU3BlY2lhbE5ld2xpbmVzICh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0XG4gICAgLnJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpXG4gICAgLnJlcGxhY2UoL1xcdTIwMjkvZywgJ1xcXFx1MjAyOScpXG59XG5cbi8qICAqL1xuXG4vLyB0aGVzZSBrZXl3b3JkcyBzaG91bGQgbm90IGFwcGVhciBpbnNpZGUgZXhwcmVzc2lvbnMsIGJ1dCBvcGVyYXRvcnMgbGlrZVxuLy8gdHlwZW9mLCBpbnN0YW5jZW9mIGFuZCBpbiBhcmUgYWxsb3dlZFxudmFyIHByb2hpYml0ZWRLZXl3b3JkUkUgPSBuZXcgUmVnRXhwKCdcXFxcYicgKyAoXG4gICdkbyxpZixmb3IsbGV0LG5ldyx0cnksdmFyLGNhc2UsZWxzZSx3aXRoLGF3YWl0LGJyZWFrLGNhdGNoLGNsYXNzLGNvbnN0LCcgK1xuICAnc3VwZXIsdGhyb3csd2hpbGUseWllbGQsZGVsZXRlLGV4cG9ydCxpbXBvcnQscmV0dXJuLHN3aXRjaCxkZWZhdWx0LCcgK1xuICAnZXh0ZW5kcyxmaW5hbGx5LGNvbnRpbnVlLGRlYnVnZ2VyLGZ1bmN0aW9uLGFyZ3VtZW50cydcbikuc3BsaXQoJywnKS5qb2luKCdcXFxcYnxcXFxcYicpICsgJ1xcXFxiJyk7XG5cbi8vIHRoZXNlIHVuYXJ5IG9wZXJhdG9ycyBzaG91bGQgbm90IGJlIHVzZWQgYXMgcHJvcGVydHkvbWV0aG9kIG5hbWVzXG52YXIgdW5hcnlPcGVyYXRvcnNSRSA9IG5ldyBSZWdFeHAoJ1xcXFxiJyArIChcbiAgJ2RlbGV0ZSx0eXBlb2Ysdm9pZCdcbikuc3BsaXQoJywnKS5qb2luKCdcXFxccypcXFxcKFteXFxcXCldKlxcXFwpfFxcXFxiJykgKyAnXFxcXHMqXFxcXChbXlxcXFwpXSpcXFxcKScpO1xuXG4vLyBjaGVjayB2YWxpZCBpZGVudGlmaWVyIGZvciB2LWZvclxudmFyIGlkZW50UkUgPSAvW0EtWmEtel8kXVtcXHckXSovO1xuXG4vLyBzdHJpcCBzdHJpbmdzIGluIGV4cHJlc3Npb25zXG52YXIgc3RyaXBTdHJpbmdSRSA9IC8nKD86W14nXFxcXF18XFxcXC4pKid8XCIoPzpbXlwiXFxcXF18XFxcXC4pKlwifGAoPzpbXmBcXFxcXXxcXFxcLikqXFwkXFx7fFxcfSg/OlteYFxcXFxdfFxcXFwuKSpgfGAoPzpbXmBcXFxcXXxcXFxcLikqYC9nO1xuXG4vLyBkZXRlY3QgcHJvYmxlbWF0aWMgZXhwcmVzc2lvbnMgaW4gYSB0ZW1wbGF0ZVxuZnVuY3Rpb24gZGV0ZWN0RXJyb3JzIChhc3QpIHtcbiAgdmFyIGVycm9ycyA9IFtdO1xuICBpZiAoYXN0KSB7XG4gICAgY2hlY2tOb2RlKGFzdCwgZXJyb3JzKTtcbiAgfVxuICByZXR1cm4gZXJyb3JzXG59XG5cbmZ1bmN0aW9uIGNoZWNrTm9kZSAobm9kZSwgZXJyb3JzKSB7XG4gIGlmIChub2RlLnR5cGUgPT09IDEpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIG5vZGUuYXR0cnNNYXApIHtcbiAgICAgIGlmIChkaXJSRS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG5vZGUuYXR0cnNNYXBbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIGlmIChuYW1lID09PSAndi1mb3InKSB7XG4gICAgICAgICAgICBjaGVja0Zvcihub2RlLCAoXCJ2LWZvcj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9uUkUudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgY2hlY2tFdmVudCh2YWx1ZSwgKG5hbWUgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tFeHByZXNzaW9uKHZhbHVlLCAobmFtZSArIFwiPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiXCIpLCBlcnJvcnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNoZWNrTm9kZShub2RlLmNoaWxkcmVuW2ldLCBlcnJvcnMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT09IDIpIHtcbiAgICBjaGVja0V4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLCBub2RlLnRleHQsIGVycm9ycyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tFdmVudCAoZXhwLCB0ZXh0LCBlcnJvcnMpIHtcbiAgdmFyIHN0aXBwZWQgPSBleHAucmVwbGFjZShzdHJpcFN0cmluZ1JFLCAnJyk7XG4gIHZhciBrZXl3b3JkTWF0Y2ggPSBzdGlwcGVkLm1hdGNoKHVuYXJ5T3BlcmF0b3JzUkUpO1xuICBpZiAoa2V5d29yZE1hdGNoICYmIHN0aXBwZWQuY2hhckF0KGtleXdvcmRNYXRjaC5pbmRleCAtIDEpICE9PSAnJCcpIHtcbiAgICBlcnJvcnMucHVzaChcbiAgICAgIFwiYXZvaWQgdXNpbmcgSmF2YVNjcmlwdCB1bmFyeSBvcGVyYXRvciBhcyBwcm9wZXJ0eSBuYW1lOiBcIiArXG4gICAgICBcIlxcXCJcIiArIChrZXl3b3JkTWF0Y2hbMF0pICsgXCJcXFwiIGluIGV4cHJlc3Npb24gXCIgKyAodGV4dC50cmltKCkpXG4gICAgKTtcbiAgfVxuICBjaGVja0V4cHJlc3Npb24oZXhwLCB0ZXh0LCBlcnJvcnMpO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvciAobm9kZSwgdGV4dCwgZXJyb3JzKSB7XG4gIGNoZWNrRXhwcmVzc2lvbihub2RlLmZvciB8fCAnJywgdGV4dCwgZXJyb3JzKTtcbiAgY2hlY2tJZGVudGlmaWVyKG5vZGUuYWxpYXMsICd2LWZvciBhbGlhcycsIHRleHQsIGVycm9ycyk7XG4gIGNoZWNrSWRlbnRpZmllcihub2RlLml0ZXJhdG9yMSwgJ3YtZm9yIGl0ZXJhdG9yJywgdGV4dCwgZXJyb3JzKTtcbiAgY2hlY2tJZGVudGlmaWVyKG5vZGUuaXRlcmF0b3IyLCAndi1mb3IgaXRlcmF0b3InLCB0ZXh0LCBlcnJvcnMpO1xufVxuXG5mdW5jdGlvbiBjaGVja0lkZW50aWZpZXIgKGlkZW50LCB0eXBlLCB0ZXh0LCBlcnJvcnMpIHtcbiAgaWYgKHR5cGVvZiBpZGVudCA9PT0gJ3N0cmluZycgJiYgIWlkZW50UkUudGVzdChpZGVudCkpIHtcbiAgICBlcnJvcnMucHVzaCgoXCJpbnZhbGlkIFwiICsgdHlwZSArIFwiIFxcXCJcIiArIGlkZW50ICsgXCJcXFwiIGluIGV4cHJlc3Npb246IFwiICsgKHRleHQudHJpbSgpKSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrRXhwcmVzc2lvbiAoZXhwLCB0ZXh0LCBlcnJvcnMpIHtcbiAgdHJ5IHtcbiAgICBuZXcgRnVuY3Rpb24oKFwicmV0dXJuIFwiICsgZXhwKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIga2V5d29yZE1hdGNoID0gZXhwLnJlcGxhY2Uoc3RyaXBTdHJpbmdSRSwgJycpLm1hdGNoKHByb2hpYml0ZWRLZXl3b3JkUkUpO1xuICAgIGlmIChrZXl3b3JkTWF0Y2gpIHtcbiAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICBcImF2b2lkIHVzaW5nIEphdmFTY3JpcHQga2V5d29yZCBhcyBwcm9wZXJ0eSBuYW1lOiBcIiArXG4gICAgICAgIFwiXFxcIlwiICsgKGtleXdvcmRNYXRjaFswXSkgKyBcIlxcXCIgaW4gZXhwcmVzc2lvbiBcIiArICh0ZXh0LnRyaW0oKSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9ycy5wdXNoKChcImludmFsaWQgZXhwcmVzc2lvbjogXCIgKyAodGV4dC50cmltKCkpKSk7XG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBiYXNlQ29tcGlsZSAoXG4gIHRlbXBsYXRlLFxuICBvcHRpb25zXG4pIHtcbiAgdmFyIGFzdCA9IHBhcnNlKHRlbXBsYXRlLnRyaW0oKSwgb3B0aW9ucyk7XG4gIG9wdGltaXplKGFzdCwgb3B0aW9ucyk7XG4gIHZhciBjb2RlID0gZ2VuZXJhdGUoYXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICBhc3Q6IGFzdCxcbiAgICByZW5kZXI6IGNvZGUucmVuZGVyLFxuICAgIHN0YXRpY1JlbmRlckZuczogY29kZS5zdGF0aWNSZW5kZXJGbnNcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlRnVuY3Rpb24gKGNvZGUsIGVycm9ycykge1xuICB0cnkge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oY29kZSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3JzLnB1c2goeyBlcnI6IGVyciwgY29kZTogY29kZSB9KTtcbiAgICByZXR1cm4gbm9vcFxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVyIChiYXNlT3B0aW9ucykge1xuICB2YXIgZnVuY3Rpb25Db21waWxlQ2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZ1bmN0aW9uIGNvbXBpbGUgKFxuICAgIHRlbXBsYXRlLFxuICAgIG9wdGlvbnNcbiAgKSB7XG4gICAgdmFyIGZpbmFsT3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoYmFzZU9wdGlvbnMpO1xuICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICB2YXIgdGlwcyA9IFtdO1xuICAgIGZpbmFsT3B0aW9ucy53YXJuID0gZnVuY3Rpb24gKG1zZywgdGlwJCQxKSB7XG4gICAgICAodGlwJCQxID8gdGlwcyA6IGVycm9ycykucHVzaChtc2cpO1xuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgLy8gbWVyZ2UgY3VzdG9tIG1vZHVsZXNcbiAgICAgIGlmIChvcHRpb25zLm1vZHVsZXMpIHtcbiAgICAgICAgZmluYWxPcHRpb25zLm1vZHVsZXMgPSAoYmFzZU9wdGlvbnMubW9kdWxlcyB8fCBbXSkuY29uY2F0KG9wdGlvbnMubW9kdWxlcyk7XG4gICAgICB9XG4gICAgICAvLyBtZXJnZSBjdXN0b20gZGlyZWN0aXZlc1xuICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aXZlcykge1xuICAgICAgICBmaW5hbE9wdGlvbnMuZGlyZWN0aXZlcyA9IGV4dGVuZChcbiAgICAgICAgICBPYmplY3QuY3JlYXRlKGJhc2VPcHRpb25zLmRpcmVjdGl2ZXMpLFxuICAgICAgICAgIG9wdGlvbnMuZGlyZWN0aXZlc1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gY29weSBvdGhlciBvcHRpb25zXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAoa2V5ICE9PSAnbW9kdWxlcycgJiYga2V5ICE9PSAnZGlyZWN0aXZlcycpIHtcbiAgICAgICAgICBmaW5hbE9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb21waWxlZCA9IGJhc2VDb21waWxlKHRlbXBsYXRlLCBmaW5hbE9wdGlvbnMpO1xuICAgIHtcbiAgICAgIGVycm9ycy5wdXNoLmFwcGx5KGVycm9ycywgZGV0ZWN0RXJyb3JzKGNvbXBpbGVkLmFzdCkpO1xuICAgIH1cbiAgICBjb21waWxlZC5lcnJvcnMgPSBlcnJvcnM7XG4gICAgY29tcGlsZWQudGlwcyA9IHRpcHM7XG4gICAgcmV0dXJuIGNvbXBpbGVkXG4gIH1cblxuICBmdW5jdGlvbiBjb21waWxlVG9GdW5jdGlvbnMgKFxuICAgIHRlbXBsYXRlLFxuICAgIG9wdGlvbnMsXG4gICAgdm1cbiAgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICB7XG4gICAgICAvLyBkZXRlY3QgcG9zc2libGUgQ1NQIHJlc3RyaWN0aW9uXG4gICAgICB0cnkge1xuICAgICAgICBuZXcgRnVuY3Rpb24oJ3JldHVybiAxJyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLnRvU3RyaW5nKCkubWF0Y2goL3Vuc2FmZS1ldmFsfENTUC8pKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgICdJdCBzZWVtcyB5b3UgYXJlIHVzaW5nIHRoZSBzdGFuZGFsb25lIGJ1aWxkIG9mIFZ1ZS5qcyBpbiBhbiAnICtcbiAgICAgICAgICAgICdlbnZpcm9ubWVudCB3aXRoIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IHRoYXQgcHJvaGliaXRzIHVuc2FmZS1ldmFsLiAnICtcbiAgICAgICAgICAgICdUaGUgdGVtcGxhdGUgY29tcGlsZXIgY2Fubm90IHdvcmsgaW4gdGhpcyBlbnZpcm9ubWVudC4gQ29uc2lkZXIgJyArXG4gICAgICAgICAgICAncmVsYXhpbmcgdGhlIHBvbGljeSB0byBhbGxvdyB1bnNhZmUtZXZhbCBvciBwcmUtY29tcGlsaW5nIHlvdXIgJyArXG4gICAgICAgICAgICAndGVtcGxhdGVzIGludG8gcmVuZGVyIGZ1bmN0aW9ucy4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGNhY2hlXG4gICAgdmFyIGtleSA9IG9wdGlvbnMuZGVsaW1pdGVyc1xuICAgICAgPyBTdHJpbmcob3B0aW9ucy5kZWxpbWl0ZXJzKSArIHRlbXBsYXRlXG4gICAgICA6IHRlbXBsYXRlO1xuICAgIGlmIChmdW5jdGlvbkNvbXBpbGVDYWNoZVtrZXldKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb25Db21waWxlQ2FjaGVba2V5XVxuICAgIH1cblxuICAgIC8vIGNvbXBpbGVcbiAgICB2YXIgY29tcGlsZWQgPSBjb21waWxlKHRlbXBsYXRlLCBvcHRpb25zKTtcblxuICAgIC8vIGNoZWNrIGNvbXBpbGF0aW9uIGVycm9ycy90aXBzXG4gICAge1xuICAgICAgaWYgKGNvbXBpbGVkLmVycm9ycyAmJiBjb21waWxlZC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgXCJFcnJvciBjb21waWxpbmcgdGVtcGxhdGU6XFxuXFxuXCIgKyB0ZW1wbGF0ZSArIFwiXFxuXFxuXCIgK1xuICAgICAgICAgIGNvbXBpbGVkLmVycm9ycy5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIChcIi0gXCIgKyBlKTsgfSkuam9pbignXFxuJykgKyAnXFxuJyxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbXBpbGVkLnRpcHMgJiYgY29tcGlsZWQudGlwcy5sZW5ndGgpIHtcbiAgICAgICAgY29tcGlsZWQudGlwcy5mb3JFYWNoKGZ1bmN0aW9uIChtc2cpIHsgcmV0dXJuIHRpcChtc2csIHZtKTsgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdHVybiBjb2RlIGludG8gZnVuY3Rpb25zXG4gICAgdmFyIHJlcyA9IHt9O1xuICAgIHZhciBmbkdlbkVycm9ycyA9IFtdO1xuICAgIHJlcy5yZW5kZXIgPSBtYWtlRnVuY3Rpb24oY29tcGlsZWQucmVuZGVyLCBmbkdlbkVycm9ycyk7XG4gICAgdmFyIGwgPSBjb21waWxlZC5zdGF0aWNSZW5kZXJGbnMubGVuZ3RoO1xuICAgIHJlcy5zdGF0aWNSZW5kZXJGbnMgPSBuZXcgQXJyYXkobCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHJlcy5zdGF0aWNSZW5kZXJGbnNbaV0gPSBtYWtlRnVuY3Rpb24oY29tcGlsZWQuc3RhdGljUmVuZGVyRm5zW2ldLCBmbkdlbkVycm9ycyk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgZnVuY3Rpb24gZ2VuZXJhdGlvbiBlcnJvcnMuXG4gICAgLy8gdGhpcyBzaG91bGQgb25seSBoYXBwZW4gaWYgdGhlcmUgaXMgYSBidWcgaW4gdGhlIGNvbXBpbGVyIGl0c2VsZi5cbiAgICAvLyBtb3N0bHkgZm9yIGNvZGVnZW4gZGV2ZWxvcG1lbnQgdXNlXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAge1xuICAgICAgaWYgKCghY29tcGlsZWQuZXJyb3JzIHx8ICFjb21waWxlZC5lcnJvcnMubGVuZ3RoKSAmJiBmbkdlbkVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBcIkZhaWxlZCB0byBnZW5lcmF0ZSByZW5kZXIgZnVuY3Rpb246XFxuXFxuXCIgK1xuICAgICAgICAgIGZuR2VuRXJyb3JzLm1hcChmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gcmVmLmVycjtcbiAgICAgICAgICAgIHZhciBjb2RlID0gcmVmLmNvZGU7XG5cbiAgICAgICAgICAgIHJldHVybiAoKGVyci50b1N0cmluZygpKSArIFwiIGluXFxuXFxuXCIgKyBjb2RlICsgXCJcXG5cIik7XG4gICAgICAgIH0pLmpvaW4oJ1xcbicpLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChmdW5jdGlvbkNvbXBpbGVDYWNoZVtrZXldID0gcmVzKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb21waWxlOiBjb21waWxlLFxuICAgIGNvbXBpbGVUb0Z1bmN0aW9uczogY29tcGlsZVRvRnVuY3Rpb25zXG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybU5vZGUgKGVsLCBvcHRpb25zKSB7XG4gIHZhciB3YXJuID0gb3B0aW9ucy53YXJuIHx8IGJhc2VXYXJuO1xuICB2YXIgc3RhdGljQ2xhc3MgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnY2xhc3MnKTtcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHN0YXRpY0NsYXNzKSB7XG4gICAgdmFyIGV4cHJlc3Npb24gPSBwYXJzZVRleHQoc3RhdGljQ2xhc3MsIG9wdGlvbnMuZGVsaW1pdGVycyk7XG4gICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIFwiY2xhc3M9XFxcIlwiICsgc3RhdGljQ2xhc3MgKyBcIlxcXCI6IFwiICtcbiAgICAgICAgJ0ludGVycG9sYXRpb24gaW5zaWRlIGF0dHJpYnV0ZXMgaGFzIGJlZW4gcmVtb3ZlZC4gJyArXG4gICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xuICAgICAgICAnaW5zdGVhZCBvZiA8ZGl2IGNsYXNzPVwie3sgdmFsIH19XCI+LCB1c2UgPGRpdiA6Y2xhc3M9XCJ2YWxcIj4uJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0YXRpY0NsYXNzKSB7XG4gICAgZWwuc3RhdGljQ2xhc3MgPSBKU09OLnN0cmluZ2lmeShzdGF0aWNDbGFzcyk7XG4gIH1cbiAgdmFyIGNsYXNzQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnY2xhc3MnLCBmYWxzZSAvKiBnZXRTdGF0aWMgKi8pO1xuICBpZiAoY2xhc3NCaW5kaW5nKSB7XG4gICAgZWwuY2xhc3NCaW5kaW5nID0gY2xhc3NCaW5kaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbkRhdGEkMSAoZWwpIHtcbiAgdmFyIGRhdGEgPSAnJztcbiAgaWYgKGVsLnN0YXRpY0NsYXNzKSB7XG4gICAgZGF0YSArPSBcInN0YXRpY0NsYXNzOlwiICsgKGVsLnN0YXRpY0NsYXNzKSArIFwiLFwiO1xuICB9XG4gIGlmIChlbC5jbGFzc0JpbmRpbmcpIHtcbiAgICBkYXRhICs9IFwiY2xhc3M6XCIgKyAoZWwuY2xhc3NCaW5kaW5nKSArIFwiLFwiO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbnZhciBrbGFzcyQxID0ge1xuICBzdGF0aWNLZXlzOiBbJ3N0YXRpY0NsYXNzJ10sXG4gIHRyYW5zZm9ybU5vZGU6IHRyYW5zZm9ybU5vZGUsXG4gIGdlbkRhdGE6IGdlbkRhdGEkMVxufTtcblxuLyogICovXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybU5vZGUkMSAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIHdhcm4gPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XG4gIHZhciBzdGF0aWNTdHlsZSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICdzdHlsZScpO1xuICBpZiAoc3RhdGljU3R5bGUpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICB7XG4gICAgICB2YXIgZXhwcmVzc2lvbiA9IHBhcnNlVGV4dChzdGF0aWNTdHlsZSwgb3B0aW9ucy5kZWxpbWl0ZXJzKTtcbiAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgXCJzdHlsZT1cXFwiXCIgKyBzdGF0aWNTdHlsZSArIFwiXFxcIjogXCIgK1xuICAgICAgICAgICdJbnRlcnBvbGF0aW9uIGluc2lkZSBhdHRyaWJ1dGVzIGhhcyBiZWVuIHJlbW92ZWQuICcgK1xuICAgICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xuICAgICAgICAgICdpbnN0ZWFkIG9mIDxkaXYgc3R5bGU9XCJ7eyB2YWwgfX1cIj4sIHVzZSA8ZGl2IDpzdHlsZT1cInZhbFwiPi4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsLnN0YXRpY1N0eWxlID0gSlNPTi5zdHJpbmdpZnkocGFyc2VTdHlsZVRleHQoc3RhdGljU3R5bGUpKTtcbiAgfVxuXG4gIHZhciBzdHlsZUJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ3N0eWxlJywgZmFsc2UgLyogZ2V0U3RhdGljICovKTtcbiAgaWYgKHN0eWxlQmluZGluZykge1xuICAgIGVsLnN0eWxlQmluZGluZyA9IHN0eWxlQmluZGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5EYXRhJDIgKGVsKSB7XG4gIHZhciBkYXRhID0gJyc7XG4gIGlmIChlbC5zdGF0aWNTdHlsZSkge1xuICAgIGRhdGEgKz0gXCJzdGF0aWNTdHlsZTpcIiArIChlbC5zdGF0aWNTdHlsZSkgKyBcIixcIjtcbiAgfVxuICBpZiAoZWwuc3R5bGVCaW5kaW5nKSB7XG4gICAgZGF0YSArPSBcInN0eWxlOihcIiArIChlbC5zdHlsZUJpbmRpbmcpICsgXCIpLFwiO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbnZhciBzdHlsZSQxID0ge1xuICBzdGF0aWNLZXlzOiBbJ3N0YXRpY1N0eWxlJ10sXG4gIHRyYW5zZm9ybU5vZGU6IHRyYW5zZm9ybU5vZGUkMSxcbiAgZ2VuRGF0YTogZ2VuRGF0YSQyXG59O1xuXG52YXIgbW9kdWxlcyQxID0gW1xuICBrbGFzcyQxLFxuICBzdHlsZSQxXG5dO1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gdGV4dCAoZWwsIGRpcikge1xuICBpZiAoZGlyLnZhbHVlKSB7XG4gICAgYWRkUHJvcChlbCwgJ3RleHRDb250ZW50JywgKFwiX3MoXCIgKyAoZGlyLnZhbHVlKSArIFwiKVwiKSk7XG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGh0bWwgKGVsLCBkaXIpIHtcbiAgaWYgKGRpci52YWx1ZSkge1xuICAgIGFkZFByb3AoZWwsICdpbm5lckhUTUwnLCAoXCJfcyhcIiArIChkaXIudmFsdWUpICsgXCIpXCIpKTtcbiAgfVxufVxuXG52YXIgZGlyZWN0aXZlcyQxID0ge1xuICBtb2RlbDogbW9kZWwsXG4gIHRleHQ6IHRleHQsXG4gIGh0bWw6IGh0bWxcbn07XG5cbi8qICAqL1xuXG52YXIgYmFzZU9wdGlvbnMgPSB7XG4gIGV4cGVjdEhUTUw6IHRydWUsXG4gIG1vZHVsZXM6IG1vZHVsZXMkMSxcbiAgZGlyZWN0aXZlczogZGlyZWN0aXZlcyQxLFxuICBpc1ByZVRhZzogaXNQcmVUYWcsXG4gIGlzVW5hcnlUYWc6IGlzVW5hcnlUYWcsXG4gIG11c3RVc2VQcm9wOiBtdXN0VXNlUHJvcCxcbiAgY2FuQmVMZWZ0T3BlblRhZzogY2FuQmVMZWZ0T3BlblRhZyxcbiAgaXNSZXNlcnZlZFRhZzogaXNSZXNlcnZlZFRhZyxcbiAgZ2V0VGFnTmFtZXNwYWNlOiBnZXRUYWdOYW1lc3BhY2UsXG4gIHN0YXRpY0tleXM6IGdlblN0YXRpY0tleXMobW9kdWxlcyQxKVxufTtcblxudmFyIHJlZiQxID0gY3JlYXRlQ29tcGlsZXIoYmFzZU9wdGlvbnMpO1xudmFyIGNvbXBpbGVUb0Z1bmN0aW9ucyA9IHJlZiQxLmNvbXBpbGVUb0Z1bmN0aW9ucztcblxuLyogICovXG5cbnZhciBpZFRvVGVtcGxhdGUgPSBjYWNoZWQoZnVuY3Rpb24gKGlkKSB7XG4gIHZhciBlbCA9IHF1ZXJ5KGlkKTtcbiAgcmV0dXJuIGVsICYmIGVsLmlubmVySFRNTFxufSk7XG5cbnZhciBtb3VudCA9IFZ1ZSQzLnByb3RvdHlwZS4kbW91bnQ7XG5WdWUkMy5wcm90b3R5cGUuJG1vdW50ID0gZnVuY3Rpb24gKFxuICBlbCxcbiAgaHlkcmF0aW5nXG4pIHtcbiAgZWwgPSBlbCAmJiBxdWVyeShlbCk7XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChlbCA9PT0gZG9jdW1lbnQuYm9keSB8fCBlbCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgIFwiRG8gbm90IG1vdW50IFZ1ZSB0byA8aHRtbD4gb3IgPGJvZHk+IC0gbW91bnQgdG8gbm9ybWFsIGVsZW1lbnRzIGluc3RlYWQuXCJcbiAgICApO1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnM7XG4gIC8vIHJlc29sdmUgdGVtcGxhdGUvZWwgYW5kIGNvbnZlcnQgdG8gcmVuZGVyIGZ1bmN0aW9uXG4gIGlmICghb3B0aW9ucy5yZW5kZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAgdGVtcGxhdGUgPSBpZFRvVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgIChcIlRlbXBsYXRlIGVsZW1lbnQgbm90IGZvdW5kIG9yIGlzIGVtcHR5OiBcIiArIChvcHRpb25zLnRlbXBsYXRlKSksXG4gICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAge1xuICAgICAgICAgIHdhcm4oJ2ludmFsaWQgdGVtcGxhdGUgb3B0aW9uOicgKyB0ZW1wbGF0ZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVsKSB7XG4gICAgICB0ZW1wbGF0ZSA9IGdldE91dGVySFRNTChlbCk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgY29uZmlnLnBlcmZvcm1hbmNlICYmIG1hcmspIHtcbiAgICAgICAgbWFyaygnY29tcGlsZScpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVmID0gY29tcGlsZVRvRnVuY3Rpb25zKHRlbXBsYXRlLCB7XG4gICAgICAgIHNob3VsZERlY29kZU5ld2xpbmVzOiBzaG91bGREZWNvZGVOZXdsaW5lcyxcbiAgICAgICAgZGVsaW1pdGVyczogb3B0aW9ucy5kZWxpbWl0ZXJzXG4gICAgICB9LCB0aGlzKTtcbiAgICAgIHZhciByZW5kZXIgPSByZWYucmVuZGVyO1xuICAgICAgdmFyIHN0YXRpY1JlbmRlckZucyA9IHJlZi5zdGF0aWNSZW5kZXJGbnM7XG4gICAgICBvcHRpb25zLnJlbmRlciA9IHJlbmRlcjtcbiAgICAgIG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zID0gc3RhdGljUmVuZGVyRm5zO1xuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgbWFyaykge1xuICAgICAgICBtYXJrKCdjb21waWxlIGVuZCcpO1xuICAgICAgICBtZWFzdXJlKCgodGhpcy5fbmFtZSkgKyBcIiBjb21waWxlXCIpLCAnY29tcGlsZScsICdjb21waWxlIGVuZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbW91bnQuY2FsbCh0aGlzLCBlbCwgaHlkcmF0aW5nKVxufTtcblxuLyoqXG4gKiBHZXQgb3V0ZXJIVE1MIG9mIGVsZW1lbnRzLCB0YWtpbmcgY2FyZVxuICogb2YgU1ZHIGVsZW1lbnRzIGluIElFIGFzIHdlbGwuXG4gKi9cbmZ1bmN0aW9uIGdldE91dGVySFRNTCAoZWwpIHtcbiAgaWYgKGVsLm91dGVySFRNTCkge1xuICAgIHJldHVybiBlbC5vdXRlckhUTUxcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5pbm5lckhUTUxcbiAgfVxufVxuXG5WdWUkMy5jb21waWxlID0gY29tcGlsZVRvRnVuY3Rpb25zO1xuXG5yZXR1cm4gVnVlJDM7XG5cbn0pKSk7XG4iXX0=
