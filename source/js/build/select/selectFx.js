define(['exports', './classie'], function (exports, _classie) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _classie2 = _interopRequireDefault(_classie);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	/**
  * based on from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
  */
	function hasParent(e, p) {
		if (!e) return false;
		var el = e.target || e.srcElement || e || false;
		while (el && el != p) {
			el = el.parentNode || false;
		}
		// Return true if el does not equal false 
		// AKA it did find p in the parent lineage
		// Else it will return false 
		// AKA p was not a parent 
		return el !== false;
	} /**
    * selectFx.js v1.0.0
    * http://www.codrops.com
    *
    * Licensed under the MIT license.
    * http://www.opensource.org/licenses/mit-license.php
    * 
    * Copyright 2014, Codrops
    * http://www.codrops.com
    */
	;
	// Checks if 'e' has parent 'p' 

	/**
  * extend obj function
  */
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	// Extends 'a' with properties that are only in 'b' (not b's inherited props)

	/**
  * SelectFx function
  */
	function SelectFx(el, options) {
		this.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}
	// Constructor 
	// Sets first parameter as the element to be the select box 
	// Second param is options 
	// Extend an empty object with the options object's properties 
	// Makes sure to not mutate original options 


	/**
  * SelectFx options
  */
	SelectFx.prototype.options = {
		// if true all the links will open in a new tab.
		// if we want to be redirected when we click an option, we need to define a data-link attr on the option of the native select element
		newTab: true,
		// when opening the select element, the default placeholder (if any) is shown
		stickyPlaceholder: true,
		// callback when changing the value
		onChange: function onChange(val) {
			return false;
		}
	};

	/**
  * init function
  * initialize and cache some vars
  */
	SelectFx.prototype._init = function () {
		// check if we are using a placeholder for the native select box
		// we assume the placeholder is disabled and selected by default
		var selectedOpt = this.el.querySelector('option[selected]');
		this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

		// get selected option (either the first option with attr selected or just the first option)
		this.selectedOpt = selectedOpt || this.el.querySelector('option');

		// create structure
		this._createSelectEl();

		// all options
		this.selOpts = [].slice.call(this.selEl.querySelectorAll('li[data-option]'));

		// total options
		this.selOptsCount = this.selOpts.length;

		// current index
		this.current = this.selOpts.indexOf(this.selEl.querySelector('li.cs-selected')) || -1;

		// placeholder elem
		this.selPlaceholder = this.selEl.querySelector('span.cs-placeholder');

		// init events
		this._initEvents();
	};

	/**
  * creates the structure for the select element
  */
	SelectFx.prototype._createSelectEl = function () {
		var self = this,
		    options = '',
		    createOptionHTML = function createOptionHTML(el) {
			var optclass = '',
			    classes = '',
			    link = '';

			if (el.selectedOpt && !this.foundSelected && !this.hasDefaultPlaceholder) {
				classes += 'cs-selected ';
				this.foundSelected = true;
			}
			// extra classes
			if (el.getAttribute('data-class')) {
				classes += el.getAttribute('data-class');
			}
			// link options
			if (el.getAttribute('data-link')) {
				link = 'data-link=' + el.getAttribute('data-link');
			}

			if (classes !== '') {
				optclass = 'class="' + classes + '" ';
			}

			return '<li ' + optclass + link + ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
		};

		[].slice.call(this.el.children).forEach(function (el) {
			if (el.disabled) {
				return;
			}

			var tag = el.tagName.toLowerCase();

			if (tag === 'option') {
				options += createOptionHTML(el);
			} else if (tag === 'optgroup') {
				options += '<li class="cs-optgroup"><span>' + el.label + '</span><ul>';
				[].slice.call(el.children).forEach(function (opt) {
					options += createOptionHTML(opt);
				});
				options += '</ul></li>';
			}
		});

		var opts_el = '<div class="cs-options"><ul>' + options + '</ul></div>';
		this.selEl = document.createElement('div');
		this.selEl.className = this.el.className;
		this.selEl.tabIndex = this.el.tabIndex;
		this.selEl.innerHTML = '<span class="cs-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
		this.el.parentNode.appendChild(this.selEl);
		this.selEl.appendChild(this.el);
	};

	/**
  * initialize the events
  */
	SelectFx.prototype._initEvents = function () {
		var self = this;

		// open/close select
		this.selPlaceholder.addEventListener('click', function () {
			self._toggleSelect();
		});

		// clicking the options
		this.selOpts.forEach(function (opt, idx) {
			opt.addEventListener('click', function () {
				self.current = idx;
				self._changeOption();
				// close select elem
				self._toggleSelect();
			});
		});

		// close the select element if the target it´s not the select element or one of its descendants..
		document.addEventListener('click', function (ev) {
			var target = ev.target;
			if (self._isOpen() && target !== self.selEl && !hasParent(target, self.selEl)) {
				self._toggleSelect();
			}
		});

		// keyboard navigation events
		this.selEl.addEventListener('keydown', function (ev) {
			var keyCode = ev.keyCode || ev.which;

			switch (keyCode) {
				// up key
				case 38:
					ev.preventDefault();
					self._navigateOpts('prev');
					break;
				// down key
				case 40:
					ev.preventDefault();
					self._navigateOpts('next');
					break;
				// space key
				case 32:
					ev.preventDefault();
					if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
						self._changeOption();
					}
					self._toggleSelect();
					break;
				// enter key
				case 13:
					ev.preventDefault();
					if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
						self._changeOption();
						self._toggleSelect();
					}
					break;
				// esc key
				case 27:
					ev.preventDefault();
					if (self._isOpen()) {
						self._toggleSelect();
					}
					break;
			}
		});
	};

	/**
  * navigate with up/dpwn keys
  */
	SelectFx.prototype._navigateOpts = function (dir) {
		if (!this._isOpen()) {
			this._toggleSelect();
		}

		var tmpcurrent = typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ? this.preSelCurrent : this.current;

		if (dir === 'prev' && tmpcurrent > 0 || dir === 'next' && tmpcurrent < this.selOptsCount - 1) {
			// save pre selected current - if we click on option, or press enter, or press space this is going to be the index of the current option
			this.preSelCurrent = dir === 'next' ? tmpcurrent + 1 : tmpcurrent - 1;
			// remove focus class if any..
			this._removeFocus();
			// add class focus - track which option we are navigating
			_classie2.default.add(this.selOpts[this.preSelCurrent], 'cs-focus');
		}
	};

	/**
  * open/close select
  * when opened show the default placeholder if any
  */
	SelectFx.prototype._toggleSelect = function () {
		// remove focus class if any..
		this._removeFocus();

		if (this._isOpen()) {
			if (this.current !== -1) {
				// update placeholder text
				this.selPlaceholder.textContent = this.selOpts[this.current].textContent;
			}
			_classie2.default.remove(this.selEl, 'cs-active');
		} else {
			if (this.hasDefaultPlaceholder && this.options.stickyPlaceholder) {
				// everytime we open we wanna see the default placeholder text
				this.selPlaceholder.textContent = this.selectedOpt.textContent;
			}
			_classie2.default.add(this.selEl, 'cs-active');
		}
	};

	/**
  * change option - the new value is set
  */
	SelectFx.prototype._changeOption = function () {
		// if pre selected current (if we navigate with the keyboard)...
		if (typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1) {
			this.current = this.preSelCurrent;
			this.preSelCurrent = -1;
		}

		// current option
		var opt = this.selOpts[this.current];

		// update current selected value
		this.selPlaceholder.textContent = opt.textContent;

		// change native select element´s value
		this.el.value = opt.getAttribute('data-value');

		// remove class cs-selected from old selected option and add it to current selected option
		var oldOpt = this.selEl.querySelector('li.cs-selected');
		if (oldOpt) {
			_classie2.default.remove(oldOpt, 'cs-selected');
		}
		_classie2.default.add(opt, 'cs-selected');

		// if there´s a link defined
		if (opt.getAttribute('data-link')) {
			// open in new tab?
			if (this.options.newTab) {
				window.open(opt.getAttribute('data-link'), '_blank');
			} else {
				window.location = opt.getAttribute('data-link');
			}
		}

		// callback
		this.options.onChange(this.el.value);
	};

	/**
  * returns true if select element is opened
  */
	SelectFx.prototype._isOpen = function (opt) {
		return _classie2.default.has(this.selEl, 'cs-active');
	};

	/**
  * removes the focus class from the option
  */
	SelectFx.prototype._removeFocus = function (opt) {
		var focusEl = this.selEl.querySelector('li.cs-focus');
		if (focusEl) {
			_classie2.default.remove(focusEl, 'cs-focus');
		}
	};

	exports.default = SelectFx;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdC9zZWxlY3RGeC5qcyJdLCJuYW1lcyI6WyJoYXNQYXJlbnQiLCJlIiwicCIsImVsIiwidGFyZ2V0Iiwic3JjRWxlbWVudCIsInBhcmVudE5vZGUiLCJleHRlbmQiLCJhIiwiYiIsImtleSIsImhhc093blByb3BlcnR5IiwiU2VsZWN0RngiLCJvcHRpb25zIiwiX2luaXQiLCJwcm90b3R5cGUiLCJuZXdUYWIiLCJzdGlja3lQbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwidmFsIiwic2VsZWN0ZWRPcHQiLCJxdWVyeVNlbGVjdG9yIiwiaGFzRGVmYXVsdFBsYWNlaG9sZGVyIiwiZGlzYWJsZWQiLCJfY3JlYXRlU2VsZWN0RWwiLCJzZWxPcHRzIiwic2xpY2UiLCJjYWxsIiwic2VsRWwiLCJxdWVyeVNlbGVjdG9yQWxsIiwic2VsT3B0c0NvdW50IiwibGVuZ3RoIiwiY3VycmVudCIsImluZGV4T2YiLCJzZWxQbGFjZWhvbGRlciIsIl9pbml0RXZlbnRzIiwic2VsZiIsImNyZWF0ZU9wdGlvbkhUTUwiLCJvcHRjbGFzcyIsImNsYXNzZXMiLCJsaW5rIiwiZm91bmRTZWxlY3RlZCIsImdldEF0dHJpYnV0ZSIsInZhbHVlIiwidGV4dENvbnRlbnQiLCJjaGlsZHJlbiIsImZvckVhY2giLCJ0YWciLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJsYWJlbCIsIm9wdCIsIm9wdHNfZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJ0YWJJbmRleCIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl90b2dnbGVTZWxlY3QiLCJpZHgiLCJfY2hhbmdlT3B0aW9uIiwiZXYiLCJfaXNPcGVuIiwia2V5Q29kZSIsIndoaWNoIiwicHJldmVudERlZmF1bHQiLCJfbmF2aWdhdGVPcHRzIiwicHJlU2VsQ3VycmVudCIsImRpciIsInRtcGN1cnJlbnQiLCJfcmVtb3ZlRm9jdXMiLCJhZGQiLCJyZW1vdmUiLCJvbGRPcHQiLCJ3aW5kb3ciLCJvcGVuIiwibG9jYXRpb24iLCJoYXMiLCJmb2N1c0VsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFXQzs7O0FBR0EsVUFBU0EsU0FBVCxDQUFvQkMsQ0FBcEIsRUFBdUJDLENBQXZCLEVBQTJCO0FBQzFCLE1BQUksQ0FBQ0QsQ0FBTCxFQUFRLE9BQU8sS0FBUDtBQUNSLE1BQUlFLEtBQUtGLEVBQUVHLE1BQUYsSUFBVUgsRUFBRUksVUFBWixJQUF3QkosQ0FBeEIsSUFBMkIsS0FBcEM7QUFDQSxTQUFPRSxNQUFNQSxNQUFNRCxDQUFuQixFQUFzQjtBQUNyQkMsUUFBS0EsR0FBR0csVUFBSCxJQUFlLEtBQXBCO0FBQ0E7QUFDRDtBQUNDO0FBQ0Q7QUFDQztBQUNELFNBQVFILE9BQUssS0FBYjtBQUNBLEUsQ0F6QkY7Ozs7Ozs7Ozs7QUF5QkU7QUFDRDs7QUFFQTs7O0FBR0EsVUFBU0ksTUFBVCxDQUFpQkMsQ0FBakIsRUFBb0JDLENBQXBCLEVBQXdCO0FBQ3ZCLE9BQUssSUFBSUMsR0FBVCxJQUFnQkQsQ0FBaEIsRUFBb0I7QUFDbkIsT0FBSUEsRUFBRUUsY0FBRixDQUFrQkQsR0FBbEIsQ0FBSixFQUE4QjtBQUM3QkYsTUFBRUUsR0FBRixJQUFTRCxFQUFFQyxHQUFGLENBQVQ7QUFDQTtBQUNEO0FBQ0QsU0FBT0YsQ0FBUDtBQUNBO0FBQ0Q7O0FBRUE7OztBQUdBLFVBQVNJLFFBQVQsQ0FBbUJULEVBQW5CLEVBQXVCVSxPQUF2QixFQUFpQztBQUNoQyxPQUFLVixFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLVSxPQUFMLEdBQWVOLE9BQVEsRUFBUixFQUFZLEtBQUtNLE9BQWpCLENBQWY7QUFDQU4sU0FBUSxLQUFLTSxPQUFiLEVBQXNCQSxPQUF0QjtBQUNBLE9BQUtDLEtBQUw7QUFDQTtBQUNEO0FBQ0E7QUFDQTtBQUNDO0FBQ0E7OztBQUdEOzs7QUFHQUYsVUFBU0csU0FBVCxDQUFtQkYsT0FBbkIsR0FBNkI7QUFDNUI7QUFDQTtBQUNBRyxVQUFTLElBSG1CO0FBSTVCO0FBQ0FDLHFCQUFvQixJQUxRO0FBTTVCO0FBQ0FDLFlBQVcsa0JBQVVDLEdBQVYsRUFBZ0I7QUFBRSxVQUFPLEtBQVA7QUFBZTtBQVBoQixFQUE3Qjs7QUFVQTs7OztBQUlBUCxVQUFTRyxTQUFULENBQW1CRCxLQUFuQixHQUEyQixZQUFXO0FBQ3JDO0FBQ0E7QUFDQSxNQUFJTSxjQUFjLEtBQUtqQixFQUFMLENBQVFrQixhQUFSLENBQXVCLGtCQUF2QixDQUFsQjtBQUNBLE9BQUtDLHFCQUFMLEdBQTZCRixlQUFlQSxZQUFZRyxRQUF4RDs7QUFFQTtBQUNBLE9BQUtILFdBQUwsR0FBbUJBLGVBQWUsS0FBS2pCLEVBQUwsQ0FBUWtCLGFBQVIsQ0FBdUIsUUFBdkIsQ0FBbEM7O0FBRUE7QUFDQSxPQUFLRyxlQUFMOztBQUVBO0FBQ0EsT0FBS0MsT0FBTCxHQUFlLEdBQUdDLEtBQUgsQ0FBU0MsSUFBVCxDQUFlLEtBQUtDLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNkIsaUJBQTdCLENBQWYsQ0FBZjs7QUFFQTtBQUNBLE9BQUtDLFlBQUwsR0FBb0IsS0FBS0wsT0FBTCxDQUFhTSxNQUFqQzs7QUFFQTtBQUNBLE9BQUtDLE9BQUwsR0FBZSxLQUFLUCxPQUFMLENBQWFRLE9BQWIsQ0FBc0IsS0FBS0wsS0FBTCxDQUFXUCxhQUFYLENBQTBCLGdCQUExQixDQUF0QixLQUF3RSxDQUFDLENBQXhGOztBQUVBO0FBQ0EsT0FBS2EsY0FBTCxHQUFzQixLQUFLTixLQUFMLENBQVdQLGFBQVgsQ0FBMEIscUJBQTFCLENBQXRCOztBQUVBO0FBQ0EsT0FBS2MsV0FBTDtBQUNBLEVBMUJEOztBQTRCQTs7O0FBR0F2QixVQUFTRyxTQUFULENBQW1CUyxlQUFuQixHQUFxQyxZQUFXO0FBQy9DLE1BQUlZLE9BQU8sSUFBWDtBQUFBLE1BQWlCdkIsVUFBVSxFQUEzQjtBQUFBLE1BQStCd0IsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBU2xDLEVBQVQsRUFBYTtBQUM5RCxPQUFJbUMsV0FBVyxFQUFmO0FBQUEsT0FBbUJDLFVBQVUsRUFBN0I7QUFBQSxPQUFpQ0MsT0FBTyxFQUF4Qzs7QUFFQSxPQUFJckMsR0FBR2lCLFdBQUgsSUFBa0IsQ0FBQyxLQUFLcUIsYUFBeEIsSUFBeUMsQ0FBQyxLQUFLbkIscUJBQW5ELEVBQTJFO0FBQzFFaUIsZUFBVyxjQUFYO0FBQ0EsU0FBS0UsYUFBTCxHQUFxQixJQUFyQjtBQUNBO0FBQ0Q7QUFDQSxPQUFJdEMsR0FBR3VDLFlBQUgsQ0FBaUIsWUFBakIsQ0FBSixFQUFzQztBQUNyQ0gsZUFBV3BDLEdBQUd1QyxZQUFILENBQWlCLFlBQWpCLENBQVg7QUFDQTtBQUNEO0FBQ0EsT0FBSXZDLEdBQUd1QyxZQUFILENBQWlCLFdBQWpCLENBQUosRUFBcUM7QUFDcENGLFdBQU8sZUFBZXJDLEdBQUd1QyxZQUFILENBQWlCLFdBQWpCLENBQXRCO0FBQ0E7O0FBRUQsT0FBSUgsWUFBWSxFQUFoQixFQUFxQjtBQUNwQkQsZUFBVyxZQUFZQyxPQUFaLEdBQXNCLElBQWpDO0FBQ0E7O0FBRUQsVUFBTyxTQUFTRCxRQUFULEdBQW9CRSxJQUFwQixHQUEyQiwyQkFBM0IsR0FBeURyQyxHQUFHd0MsS0FBNUQsR0FBb0UsVUFBcEUsR0FBaUZ4QyxHQUFHeUMsV0FBcEYsR0FBa0csY0FBekc7QUFDQSxHQXJCRDs7QUF1QkEsS0FBR2xCLEtBQUgsQ0FBU0MsSUFBVCxDQUFlLEtBQUt4QixFQUFMLENBQVEwQyxRQUF2QixFQUFrQ0MsT0FBbEMsQ0FBMkMsVUFBUzNDLEVBQVQsRUFBYTtBQUN2RCxPQUFJQSxHQUFHb0IsUUFBUCxFQUFrQjtBQUFFO0FBQVM7O0FBRTdCLE9BQUl3QixNQUFNNUMsR0FBRzZDLE9BQUgsQ0FBV0MsV0FBWCxFQUFWOztBQUVBLE9BQUlGLFFBQVEsUUFBWixFQUF1QjtBQUN0QmxDLGVBQVd3QixpQkFBaUJsQyxFQUFqQixDQUFYO0FBQ0EsSUFGRCxNQUdLLElBQUk0QyxRQUFRLFVBQVosRUFBeUI7QUFDN0JsQyxlQUFXLG1DQUFtQ1YsR0FBRytDLEtBQXRDLEdBQThDLGFBQXpEO0FBQ0EsT0FBR3hCLEtBQUgsQ0FBU0MsSUFBVCxDQUFleEIsR0FBRzBDLFFBQWxCLEVBQTZCQyxPQUE3QixDQUFzQyxVQUFTSyxHQUFULEVBQWM7QUFDbkR0QyxnQkFBV3dCLGlCQUFpQmMsR0FBakIsQ0FBWDtBQUNBLEtBRkQ7QUFHQXRDLGVBQVcsWUFBWDtBQUNBO0FBQ0QsR0FmRDs7QUFpQkEsTUFBSXVDLFVBQVUsaUNBQWlDdkMsT0FBakMsR0FBMkMsYUFBekQ7QUFDQSxPQUFLZSxLQUFMLEdBQWF5QixTQUFTQyxhQUFULENBQXdCLEtBQXhCLENBQWI7QUFDQSxPQUFLMUIsS0FBTCxDQUFXMkIsU0FBWCxHQUF1QixLQUFLcEQsRUFBTCxDQUFRb0QsU0FBL0I7QUFDQSxPQUFLM0IsS0FBTCxDQUFXNEIsUUFBWCxHQUFzQixLQUFLckQsRUFBTCxDQUFRcUQsUUFBOUI7QUFDQSxPQUFLNUIsS0FBTCxDQUFXNkIsU0FBWCxHQUF1QixrQ0FBa0MsS0FBS3JDLFdBQUwsQ0FBaUJ3QixXQUFuRCxHQUFpRSxTQUFqRSxHQUE2RVEsT0FBcEc7QUFDQSxPQUFLakQsRUFBTCxDQUFRRyxVQUFSLENBQW1Cb0QsV0FBbkIsQ0FBZ0MsS0FBSzlCLEtBQXJDO0FBQ0EsT0FBS0EsS0FBTCxDQUFXOEIsV0FBWCxDQUF3QixLQUFLdkQsRUFBN0I7QUFDQSxFQWhERDs7QUFrREE7OztBQUdBUyxVQUFTRyxTQUFULENBQW1Cb0IsV0FBbkIsR0FBaUMsWUFBVztBQUMzQyxNQUFJQyxPQUFPLElBQVg7O0FBRUE7QUFDQSxPQUFLRixjQUFMLENBQW9CeUIsZ0JBQXBCLENBQXNDLE9BQXRDLEVBQStDLFlBQVc7QUFDekR2QixRQUFLd0IsYUFBTDtBQUNBLEdBRkQ7O0FBSUE7QUFDQSxPQUFLbkMsT0FBTCxDQUFhcUIsT0FBYixDQUFzQixVQUFTSyxHQUFULEVBQWNVLEdBQWQsRUFBbUI7QUFDeENWLE9BQUlRLGdCQUFKLENBQXNCLE9BQXRCLEVBQStCLFlBQVc7QUFDekN2QixTQUFLSixPQUFMLEdBQWU2QixHQUFmO0FBQ0F6QixTQUFLMEIsYUFBTDtBQUNBO0FBQ0ExQixTQUFLd0IsYUFBTDtBQUNBLElBTEQ7QUFNQSxHQVBEOztBQVNBO0FBQ0FQLFdBQVNNLGdCQUFULENBQTJCLE9BQTNCLEVBQW9DLFVBQVNJLEVBQVQsRUFBYTtBQUNoRCxPQUFJM0QsU0FBUzJELEdBQUczRCxNQUFoQjtBQUNBLE9BQUlnQyxLQUFLNEIsT0FBTCxNQUFrQjVELFdBQVdnQyxLQUFLUixLQUFsQyxJQUEyQyxDQUFDNUIsVUFBV0ksTUFBWCxFQUFtQmdDLEtBQUtSLEtBQXhCLENBQWhELEVBQWtGO0FBQ2pGUSxTQUFLd0IsYUFBTDtBQUNBO0FBQ0QsR0FMRDs7QUFPQTtBQUNBLE9BQUtoQyxLQUFMLENBQVcrQixnQkFBWCxDQUE2QixTQUE3QixFQUF3QyxVQUFVSSxFQUFWLEVBQWU7QUFDdEQsT0FBSUUsVUFBVUYsR0FBR0UsT0FBSCxJQUFjRixHQUFHRyxLQUEvQjs7QUFFQSxXQUFRRCxPQUFSO0FBQ0M7QUFDQSxTQUFLLEVBQUw7QUFDQ0YsUUFBR0ksY0FBSDtBQUNBL0IsVUFBS2dDLGFBQUwsQ0FBbUIsTUFBbkI7QUFDQTtBQUNEO0FBQ0EsU0FBSyxFQUFMO0FBQ0NMLFFBQUdJLGNBQUg7QUFDQS9CLFVBQUtnQyxhQUFMLENBQW1CLE1BQW5CO0FBQ0E7QUFDRDtBQUNBLFNBQUssRUFBTDtBQUNDTCxRQUFHSSxjQUFIO0FBQ0EsU0FBSS9CLEtBQUs0QixPQUFMLE1BQWtCLE9BQU81QixLQUFLaUMsYUFBWixJQUE2QixXQUEvQyxJQUE4RGpDLEtBQUtpQyxhQUFMLEtBQXVCLENBQUMsQ0FBMUYsRUFBOEY7QUFDN0ZqQyxXQUFLMEIsYUFBTDtBQUNBO0FBQ0QxQixVQUFLd0IsYUFBTDtBQUNBO0FBQ0Q7QUFDQSxTQUFLLEVBQUw7QUFDQ0csUUFBR0ksY0FBSDtBQUNBLFNBQUkvQixLQUFLNEIsT0FBTCxNQUFrQixPQUFPNUIsS0FBS2lDLGFBQVosSUFBNkIsV0FBL0MsSUFBOERqQyxLQUFLaUMsYUFBTCxLQUF1QixDQUFDLENBQTFGLEVBQThGO0FBQzdGakMsV0FBSzBCLGFBQUw7QUFDQTFCLFdBQUt3QixhQUFMO0FBQ0E7QUFDRDtBQUNEO0FBQ0EsU0FBSyxFQUFMO0FBQ0NHLFFBQUdJLGNBQUg7QUFDQSxTQUFJL0IsS0FBSzRCLE9BQUwsRUFBSixFQUFxQjtBQUNwQjVCLFdBQUt3QixhQUFMO0FBQ0E7QUFDRDtBQWpDRjtBQW1DQSxHQXRDRDtBQXVDQSxFQWxFRDs7QUFvRUE7OztBQUdBaEQsVUFBU0csU0FBVCxDQUFtQnFELGFBQW5CLEdBQW1DLFVBQVNFLEdBQVQsRUFBYztBQUNoRCxNQUFJLENBQUMsS0FBS04sT0FBTCxFQUFMLEVBQXNCO0FBQ3JCLFFBQUtKLGFBQUw7QUFDQTs7QUFFRCxNQUFJVyxhQUFhLE9BQU8sS0FBS0YsYUFBWixJQUE2QixXQUE3QixJQUE0QyxLQUFLQSxhQUFMLEtBQXVCLENBQUMsQ0FBcEUsR0FBd0UsS0FBS0EsYUFBN0UsR0FBNkYsS0FBS3JDLE9BQW5IOztBQUVBLE1BQUlzQyxRQUFRLE1BQVIsSUFBa0JDLGFBQWEsQ0FBL0IsSUFBb0NELFFBQVEsTUFBUixJQUFrQkMsYUFBYSxLQUFLekMsWUFBTCxHQUFvQixDQUEzRixFQUErRjtBQUM5RjtBQUNBLFFBQUt1QyxhQUFMLEdBQXFCQyxRQUFRLE1BQVIsR0FBaUJDLGFBQWEsQ0FBOUIsR0FBa0NBLGFBQWEsQ0FBcEU7QUFDQTtBQUNBLFFBQUtDLFlBQUw7QUFDQTtBQUNBLHFCQUFRQyxHQUFSLENBQWEsS0FBS2hELE9BQUwsQ0FBYSxLQUFLNEMsYUFBbEIsQ0FBYixFQUErQyxVQUEvQztBQUNBO0FBQ0QsRUFmRDs7QUFpQkE7Ozs7QUFJQXpELFVBQVNHLFNBQVQsQ0FBbUI2QyxhQUFuQixHQUFtQyxZQUFXO0FBQzdDO0FBQ0EsT0FBS1ksWUFBTDs7QUFFQSxNQUFJLEtBQUtSLE9BQUwsRUFBSixFQUFxQjtBQUNwQixPQUFJLEtBQUtoQyxPQUFMLEtBQWlCLENBQUMsQ0FBdEIsRUFBMEI7QUFDekI7QUFDQSxTQUFLRSxjQUFMLENBQW9CVSxXQUFwQixHQUFrQyxLQUFLbkIsT0FBTCxDQUFjLEtBQUtPLE9BQW5CLEVBQTZCWSxXQUEvRDtBQUNBO0FBQ0QscUJBQVE4QixNQUFSLENBQWdCLEtBQUs5QyxLQUFyQixFQUE0QixXQUE1QjtBQUNBLEdBTkQsTUFPSztBQUNKLE9BQUksS0FBS04scUJBQUwsSUFBOEIsS0FBS1QsT0FBTCxDQUFhSSxpQkFBL0MsRUFBbUU7QUFDbEU7QUFDQSxTQUFLaUIsY0FBTCxDQUFvQlUsV0FBcEIsR0FBa0MsS0FBS3hCLFdBQUwsQ0FBaUJ3QixXQUFuRDtBQUNBO0FBQ0QscUJBQVE2QixHQUFSLENBQWEsS0FBSzdDLEtBQWxCLEVBQXlCLFdBQXpCO0FBQ0E7QUFDRCxFQWxCRDs7QUFvQkE7OztBQUdBaEIsVUFBU0csU0FBVCxDQUFtQitDLGFBQW5CLEdBQW1DLFlBQVc7QUFDN0M7QUFDQSxNQUFJLE9BQU8sS0FBS08sYUFBWixJQUE2QixXQUE3QixJQUE0QyxLQUFLQSxhQUFMLEtBQXVCLENBQUMsQ0FBeEUsRUFBNEU7QUFDM0UsUUFBS3JDLE9BQUwsR0FBZSxLQUFLcUMsYUFBcEI7QUFDQSxRQUFLQSxhQUFMLEdBQXFCLENBQUMsQ0FBdEI7QUFDQTs7QUFFRDtBQUNBLE1BQUlsQixNQUFNLEtBQUsxQixPQUFMLENBQWMsS0FBS08sT0FBbkIsQ0FBVjs7QUFFQTtBQUNBLE9BQUtFLGNBQUwsQ0FBb0JVLFdBQXBCLEdBQWtDTyxJQUFJUCxXQUF0Qzs7QUFFQTtBQUNBLE9BQUt6QyxFQUFMLENBQVF3QyxLQUFSLEdBQWdCUSxJQUFJVCxZQUFKLENBQWtCLFlBQWxCLENBQWhCOztBQUVBO0FBQ0EsTUFBSWlDLFNBQVMsS0FBSy9DLEtBQUwsQ0FBV1AsYUFBWCxDQUEwQixnQkFBMUIsQ0FBYjtBQUNBLE1BQUlzRCxNQUFKLEVBQWE7QUFDWixxQkFBUUQsTUFBUixDQUFnQkMsTUFBaEIsRUFBd0IsYUFBeEI7QUFDQTtBQUNELG9CQUFRRixHQUFSLENBQWF0QixHQUFiLEVBQWtCLGFBQWxCOztBQUVBO0FBQ0EsTUFBSUEsSUFBSVQsWUFBSixDQUFrQixXQUFsQixDQUFKLEVBQXNDO0FBQ3JDO0FBQ0EsT0FBSSxLQUFLN0IsT0FBTCxDQUFhRyxNQUFqQixFQUEwQjtBQUN6QjRELFdBQU9DLElBQVAsQ0FBYTFCLElBQUlULFlBQUosQ0FBa0IsV0FBbEIsQ0FBYixFQUE4QyxRQUE5QztBQUNBLElBRkQsTUFHSztBQUNKa0MsV0FBT0UsUUFBUCxHQUFrQjNCLElBQUlULFlBQUosQ0FBa0IsV0FBbEIsQ0FBbEI7QUFDQTtBQUNEOztBQUVEO0FBQ0EsT0FBSzdCLE9BQUwsQ0FBYUssUUFBYixDQUF1QixLQUFLZixFQUFMLENBQVF3QyxLQUEvQjtBQUNBLEVBcENEOztBQXNDQTs7O0FBR0EvQixVQUFTRyxTQUFULENBQW1CaUQsT0FBbkIsR0FBNkIsVUFBU2IsR0FBVCxFQUFjO0FBQzFDLFNBQU8sa0JBQVE0QixHQUFSLENBQWEsS0FBS25ELEtBQWxCLEVBQXlCLFdBQXpCLENBQVA7QUFDQSxFQUZEOztBQUlBOzs7QUFHQWhCLFVBQVNHLFNBQVQsQ0FBbUJ5RCxZQUFuQixHQUFrQyxVQUFTckIsR0FBVCxFQUFjO0FBQy9DLE1BQUk2QixVQUFVLEtBQUtwRCxLQUFMLENBQVdQLGFBQVgsQ0FBMEIsYUFBMUIsQ0FBZDtBQUNBLE1BQUkyRCxPQUFKLEVBQWM7QUFDYixxQkFBUU4sTUFBUixDQUFnQk0sT0FBaEIsRUFBeUIsVUFBekI7QUFDQTtBQUNELEVBTEQ7O21CQU9jcEUsUSIsImZpbGUiOiJzZWxlY3Qvc2VsZWN0RnguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIHNlbGVjdEZ4LmpzIHYxLjAuMFxuICogaHR0cDovL3d3dy5jb2Ryb3BzLmNvbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKiBcbiAqIENvcHlyaWdodCAyMDE0LCBDb2Ryb3BzXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKi9cbmltcG9ydCBjbGFzc2llIGZyb20gJy4vY2xhc3NpZSc7XG5cdC8qKlxuXHQgKiBiYXNlZCBvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnV5YWtzYS9qcXVlcnkubmljZXNjcm9sbC9ibG9iL21hc3Rlci9qcXVlcnkubmljZXNjcm9sbC5qc1xuXHQgKi9cblx0ZnVuY3Rpb24gaGFzUGFyZW50KCBlLCBwICkge1xuXHRcdGlmICghZSkgcmV0dXJuIGZhbHNlO1xuXHRcdHZhciBlbCA9IGUudGFyZ2V0fHxlLnNyY0VsZW1lbnR8fGV8fGZhbHNlO1xuXHRcdHdoaWxlIChlbCAmJiBlbCAhPSBwKSB7XG5cdFx0XHRlbCA9IGVsLnBhcmVudE5vZGV8fGZhbHNlO1xuXHRcdH1cblx0XHQvLyBSZXR1cm4gdHJ1ZSBpZiBlbCBkb2VzIG5vdCBlcXVhbCBmYWxzZSBcblx0XHRcdC8vIEFLQSBpdCBkaWQgZmluZCBwIGluIHRoZSBwYXJlbnQgbGluZWFnZVxuXHRcdC8vIEVsc2UgaXQgd2lsbCByZXR1cm4gZmFsc2UgXG5cdFx0XHQvLyBBS0EgcCB3YXMgbm90IGEgcGFyZW50IFxuXHRcdHJldHVybiAoZWwhPT1mYWxzZSk7XG5cdH07XG5cdC8vIENoZWNrcyBpZiAnZScgaGFzIHBhcmVudCAncCcgXG5cdFxuXHQvKipcblx0ICogZXh0ZW5kIG9iaiBmdW5jdGlvblxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0ZW5kKCBhLCBiICkge1xuXHRcdGZvciggdmFyIGtleSBpbiBiICkgeyBcblx0XHRcdGlmKCBiLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcblx0XHRcdFx0YVtrZXldID0gYltrZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYTtcblx0fVxuXHQvLyBFeHRlbmRzICdhJyB3aXRoIHByb3BlcnRpZXMgdGhhdCBhcmUgb25seSBpbiAnYicgKG5vdCBiJ3MgaW5oZXJpdGVkIHByb3BzKVxuXG5cdC8qKlxuXHQgKiBTZWxlY3RGeCBmdW5jdGlvblxuXHQgKi9cblx0ZnVuY3Rpb24gU2VsZWN0RngoIGVsLCBvcHRpb25zICkge1x0XG5cdFx0dGhpcy5lbCA9IGVsO1xuXHRcdHRoaXMub3B0aW9ucyA9IGV4dGVuZCgge30sIHRoaXMub3B0aW9ucyApO1xuXHRcdGV4dGVuZCggdGhpcy5vcHRpb25zLCBvcHRpb25zICk7XG5cdFx0dGhpcy5faW5pdCgpO1xuXHR9XG5cdC8vIENvbnN0cnVjdG9yIFxuXHQvLyBTZXRzIGZpcnN0IHBhcmFtZXRlciBhcyB0aGUgZWxlbWVudCB0byBiZSB0aGUgc2VsZWN0IGJveCBcblx0Ly8gU2Vjb25kIHBhcmFtIGlzIG9wdGlvbnMgXG5cdFx0Ly8gRXh0ZW5kIGFuIGVtcHR5IG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIG9iamVjdCdzIHByb3BlcnRpZXMgXG5cdFx0Ly8gTWFrZXMgc3VyZSB0byBub3QgbXV0YXRlIG9yaWdpbmFsIG9wdGlvbnMgXG5cdFx0XG5cblx0LyoqXG5cdCAqIFNlbGVjdEZ4IG9wdGlvbnNcblx0ICovXG5cdFNlbGVjdEZ4LnByb3RvdHlwZS5vcHRpb25zID0ge1xuXHRcdC8vIGlmIHRydWUgYWxsIHRoZSBsaW5rcyB3aWxsIG9wZW4gaW4gYSBuZXcgdGFiLlxuXHRcdC8vIGlmIHdlIHdhbnQgdG8gYmUgcmVkaXJlY3RlZCB3aGVuIHdlIGNsaWNrIGFuIG9wdGlvbiwgd2UgbmVlZCB0byBkZWZpbmUgYSBkYXRhLWxpbmsgYXR0ciBvbiB0aGUgb3B0aW9uIG9mIHRoZSBuYXRpdmUgc2VsZWN0IGVsZW1lbnRcblx0XHRuZXdUYWIgOiB0cnVlLFxuXHRcdC8vIHdoZW4gb3BlbmluZyB0aGUgc2VsZWN0IGVsZW1lbnQsIHRoZSBkZWZhdWx0IHBsYWNlaG9sZGVyIChpZiBhbnkpIGlzIHNob3duXG5cdFx0c3RpY2t5UGxhY2Vob2xkZXIgOiB0cnVlLFxuXHRcdC8vIGNhbGxiYWNrIHdoZW4gY2hhbmdpbmcgdGhlIHZhbHVlXG5cdFx0b25DaGFuZ2UgOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gZmFsc2U7IH1cblx0fVxuXG5cdC8qKlxuXHQgKiBpbml0IGZ1bmN0aW9uXG5cdCAqIGluaXRpYWxpemUgYW5kIGNhY2hlIHNvbWUgdmFyc1xuXHQgKi9cblx0U2VsZWN0RngucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gY2hlY2sgaWYgd2UgYXJlIHVzaW5nIGEgcGxhY2Vob2xkZXIgZm9yIHRoZSBuYXRpdmUgc2VsZWN0IGJveFxuXHRcdC8vIHdlIGFzc3VtZSB0aGUgcGxhY2Vob2xkZXIgaXMgZGlzYWJsZWQgYW5kIHNlbGVjdGVkIGJ5IGRlZmF1bHRcblx0XHR2YXIgc2VsZWN0ZWRPcHQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoICdvcHRpb25bc2VsZWN0ZWRdJyApO1xuXHRcdHRoaXMuaGFzRGVmYXVsdFBsYWNlaG9sZGVyID0gc2VsZWN0ZWRPcHQgJiYgc2VsZWN0ZWRPcHQuZGlzYWJsZWQ7XG5cblx0XHQvLyBnZXQgc2VsZWN0ZWQgb3B0aW9uIChlaXRoZXIgdGhlIGZpcnN0IG9wdGlvbiB3aXRoIGF0dHIgc2VsZWN0ZWQgb3IganVzdCB0aGUgZmlyc3Qgb3B0aW9uKVxuXHRcdHRoaXMuc2VsZWN0ZWRPcHQgPSBzZWxlY3RlZE9wdCB8fCB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoICdvcHRpb24nICk7XG5cblx0XHQvLyBjcmVhdGUgc3RydWN0dXJlXG5cdFx0dGhpcy5fY3JlYXRlU2VsZWN0RWwoKTtcblxuXHRcdC8vIGFsbCBvcHRpb25zXG5cdFx0dGhpcy5zZWxPcHRzID0gW10uc2xpY2UuY2FsbCggdGhpcy5zZWxFbC5xdWVyeVNlbGVjdG9yQWxsKCAnbGlbZGF0YS1vcHRpb25dJyApICk7XG5cdFx0XG5cdFx0Ly8gdG90YWwgb3B0aW9uc1xuXHRcdHRoaXMuc2VsT3B0c0NvdW50ID0gdGhpcy5zZWxPcHRzLmxlbmd0aDtcblx0XHRcblx0XHQvLyBjdXJyZW50IGluZGV4XG5cdFx0dGhpcy5jdXJyZW50ID0gdGhpcy5zZWxPcHRzLmluZGV4T2YoIHRoaXMuc2VsRWwucXVlcnlTZWxlY3RvciggJ2xpLmNzLXNlbGVjdGVkJyApICkgfHwgLTE7XG5cdFx0XG5cdFx0Ly8gcGxhY2Vob2xkZXIgZWxlbVxuXHRcdHRoaXMuc2VsUGxhY2Vob2xkZXIgPSB0aGlzLnNlbEVsLnF1ZXJ5U2VsZWN0b3IoICdzcGFuLmNzLXBsYWNlaG9sZGVyJyApO1xuXG5cdFx0Ly8gaW5pdCBldmVudHNcblx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogY3JlYXRlcyB0aGUgc3RydWN0dXJlIGZvciB0aGUgc2VsZWN0IGVsZW1lbnRcblx0ICovXG5cdFNlbGVjdEZ4LnByb3RvdHlwZS5fY3JlYXRlU2VsZWN0RWwgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsIG9wdGlvbnMgPSAnJywgY3JlYXRlT3B0aW9uSFRNTCA9IGZ1bmN0aW9uKGVsKSB7XG5cdFx0XHR2YXIgb3B0Y2xhc3MgPSAnJywgY2xhc3NlcyA9ICcnLCBsaW5rID0gJyc7XG5cblx0XHRcdGlmKCBlbC5zZWxlY3RlZE9wdCAmJiAhdGhpcy5mb3VuZFNlbGVjdGVkICYmICF0aGlzLmhhc0RlZmF1bHRQbGFjZWhvbGRlciApIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnY3Mtc2VsZWN0ZWQgJztcblx0XHRcdFx0dGhpcy5mb3VuZFNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdC8vIGV4dHJhIGNsYXNzZXNcblx0XHRcdGlmKCBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWNsYXNzJyApICkge1xuXHRcdFx0XHRjbGFzc2VzICs9IGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtY2xhc3MnICk7XG5cdFx0XHR9XG5cdFx0XHQvLyBsaW5rIG9wdGlvbnNcblx0XHRcdGlmKCBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWxpbmsnICkgKSB7XG5cdFx0XHRcdGxpbmsgPSAnZGF0YS1saW5rPScgKyBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLWxpbmsnICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBjbGFzc2VzICE9PSAnJyApIHtcblx0XHRcdFx0b3B0Y2xhc3MgPSAnY2xhc3M9XCInICsgY2xhc3NlcyArICdcIiAnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gJzxsaSAnICsgb3B0Y2xhc3MgKyBsaW5rICsgJyBkYXRhLW9wdGlvbiBkYXRhLXZhbHVlPVwiJyArIGVsLnZhbHVlICsgJ1wiPjxzcGFuPicgKyBlbC50ZXh0Q29udGVudCArICc8L3NwYW4+PC9saT4nO1xuXHRcdH07XG5cblx0XHRbXS5zbGljZS5jYWxsKCB0aGlzLmVsLmNoaWxkcmVuICkuZm9yRWFjaCggZnVuY3Rpb24oZWwpIHtcblx0XHRcdGlmKCBlbC5kaXNhYmxlZCApIHsgcmV0dXJuOyB9XG5cblx0XHRcdHZhciB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdGlmKCB0YWcgPT09ICdvcHRpb24nICkge1xuXHRcdFx0XHRvcHRpb25zICs9IGNyZWF0ZU9wdGlvbkhUTUwoZWwpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggdGFnID09PSAnb3B0Z3JvdXAnICkge1xuXHRcdFx0XHRvcHRpb25zICs9ICc8bGkgY2xhc3M9XCJjcy1vcHRncm91cFwiPjxzcGFuPicgKyBlbC5sYWJlbCArICc8L3NwYW4+PHVsPic7XG5cdFx0XHRcdFtdLnNsaWNlLmNhbGwoIGVsLmNoaWxkcmVuICkuZm9yRWFjaCggZnVuY3Rpb24ob3B0KSB7XG5cdFx0XHRcdFx0b3B0aW9ucyArPSBjcmVhdGVPcHRpb25IVE1MKG9wdCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0b3B0aW9ucyArPSAnPC91bD48L2xpPic7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0dmFyIG9wdHNfZWwgPSAnPGRpdiBjbGFzcz1cImNzLW9wdGlvbnNcIj48dWw+JyArIG9wdGlvbnMgKyAnPC91bD48L2Rpdj4nO1xuXHRcdHRoaXMuc2VsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdHRoaXMuc2VsRWwuY2xhc3NOYW1lID0gdGhpcy5lbC5jbGFzc05hbWU7XG5cdFx0dGhpcy5zZWxFbC50YWJJbmRleCA9IHRoaXMuZWwudGFiSW5kZXg7XG5cdFx0dGhpcy5zZWxFbC5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJjcy1wbGFjZWhvbGRlclwiPicgKyB0aGlzLnNlbGVjdGVkT3B0LnRleHRDb250ZW50ICsgJzwvc3Bhbj4nICsgb3B0c19lbDtcblx0XHR0aGlzLmVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHRoaXMuc2VsRWwgKTtcblx0XHR0aGlzLnNlbEVsLmFwcGVuZENoaWxkKCB0aGlzLmVsICk7XG5cdH1cblxuXHQvKipcblx0ICogaW5pdGlhbGl6ZSB0aGUgZXZlbnRzXG5cdCAqL1xuXHRTZWxlY3RGeC5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBvcGVuL2Nsb3NlIHNlbGVjdFxuXHRcdHRoaXMuc2VsUGxhY2Vob2xkZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRzZWxmLl90b2dnbGVTZWxlY3QoKTtcblx0XHR9ICk7XG5cblx0XHQvLyBjbGlja2luZyB0aGUgb3B0aW9uc1xuXHRcdHRoaXMuc2VsT3B0cy5mb3JFYWNoKCBmdW5jdGlvbihvcHQsIGlkeCkge1xuXHRcdFx0b3B0LmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmN1cnJlbnQgPSBpZHg7XG5cdFx0XHRcdHNlbGYuX2NoYW5nZU9wdGlvbigpO1xuXHRcdFx0XHQvLyBjbG9zZSBzZWxlY3QgZWxlbVxuXHRcdFx0XHRzZWxmLl90b2dnbGVTZWxlY3QoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBjbG9zZSB0aGUgc2VsZWN0IGVsZW1lbnQgaWYgdGhlIHRhcmdldCBpdMK0cyBub3QgdGhlIHNlbGVjdCBlbGVtZW50IG9yIG9uZSBvZiBpdHMgZGVzY2VuZGFudHMuLlxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gZXYudGFyZ2V0O1xuXHRcdFx0aWYoIHNlbGYuX2lzT3BlbigpICYmIHRhcmdldCAhPT0gc2VsZi5zZWxFbCAmJiAhaGFzUGFyZW50KCB0YXJnZXQsIHNlbGYuc2VsRWwgKSApIHtcblx0XHRcdFx0c2VsZi5fdG9nZ2xlU2VsZWN0KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8ga2V5Ym9hcmQgbmF2aWdhdGlvbiBldmVudHNcblx0XHR0aGlzLnNlbEVsLmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0dmFyIGtleUNvZGUgPSBldi5rZXlDb2RlIHx8IGV2LndoaWNoO1xuXG5cdFx0XHRzd2l0Y2ggKGtleUNvZGUpIHtcblx0XHRcdFx0Ly8gdXAga2V5XG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRzZWxmLl9uYXZpZ2F0ZU9wdHMoJ3ByZXYnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Ly8gZG93biBrZXlcblx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHNlbGYuX25hdmlnYXRlT3B0cygnbmV4dCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHQvLyBzcGFjZSBrZXlcblx0XHRcdFx0Y2FzZSAzMjpcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGlmKCBzZWxmLl9pc09wZW4oKSAmJiB0eXBlb2Ygc2VsZi5wcmVTZWxDdXJyZW50ICE9ICd1bmRlZmluZWQnICYmIHNlbGYucHJlU2VsQ3VycmVudCAhPT0gLTEgKSB7XG5cdFx0XHRcdFx0XHRzZWxmLl9jaGFuZ2VPcHRpb24oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2VsZi5fdG9nZ2xlU2VsZWN0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdC8vIGVudGVyIGtleVxuXHRcdFx0XHRjYXNlIDEzOlxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aWYoIHNlbGYuX2lzT3BlbigpICYmIHR5cGVvZiBzZWxmLnByZVNlbEN1cnJlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5wcmVTZWxDdXJyZW50ICE9PSAtMSApIHtcblx0XHRcdFx0XHRcdHNlbGYuX2NoYW5nZU9wdGlvbigpO1xuXHRcdFx0XHRcdFx0c2VsZi5fdG9nZ2xlU2VsZWN0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHQvLyBlc2Mga2V5XG5cdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRpZiggc2VsZi5faXNPcGVuKCkgKSB7XG5cdFx0XHRcdFx0XHRzZWxmLl90b2dnbGVTZWxlY3QoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIG5hdmlnYXRlIHdpdGggdXAvZHB3biBrZXlzXG5cdCAqL1xuXHRTZWxlY3RGeC5wcm90b3R5cGUuX25hdmlnYXRlT3B0cyA9IGZ1bmN0aW9uKGRpcikge1xuXHRcdGlmKCAhdGhpcy5faXNPcGVuKCkgKSB7XG5cdFx0XHR0aGlzLl90b2dnbGVTZWxlY3QoKTtcblx0XHR9XG5cblx0XHR2YXIgdG1wY3VycmVudCA9IHR5cGVvZiB0aGlzLnByZVNlbEN1cnJlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5wcmVTZWxDdXJyZW50ICE9PSAtMSA/IHRoaXMucHJlU2VsQ3VycmVudCA6IHRoaXMuY3VycmVudDtcblx0XHRcblx0XHRpZiggZGlyID09PSAncHJldicgJiYgdG1wY3VycmVudCA+IDAgfHwgZGlyID09PSAnbmV4dCcgJiYgdG1wY3VycmVudCA8IHRoaXMuc2VsT3B0c0NvdW50IC0gMSApIHtcblx0XHRcdC8vIHNhdmUgcHJlIHNlbGVjdGVkIGN1cnJlbnQgLSBpZiB3ZSBjbGljayBvbiBvcHRpb24sIG9yIHByZXNzIGVudGVyLCBvciBwcmVzcyBzcGFjZSB0aGlzIGlzIGdvaW5nIHRvIGJlIHRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBvcHRpb25cblx0XHRcdHRoaXMucHJlU2VsQ3VycmVudCA9IGRpciA9PT0gJ25leHQnID8gdG1wY3VycmVudCArIDEgOiB0bXBjdXJyZW50IC0gMTtcblx0XHRcdC8vIHJlbW92ZSBmb2N1cyBjbGFzcyBpZiBhbnkuLlxuXHRcdFx0dGhpcy5fcmVtb3ZlRm9jdXMoKTtcblx0XHRcdC8vIGFkZCBjbGFzcyBmb2N1cyAtIHRyYWNrIHdoaWNoIG9wdGlvbiB3ZSBhcmUgbmF2aWdhdGluZ1xuXHRcdFx0Y2xhc3NpZS5hZGQoIHRoaXMuc2VsT3B0c1t0aGlzLnByZVNlbEN1cnJlbnRdLCAnY3MtZm9jdXMnICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIG9wZW4vY2xvc2Ugc2VsZWN0XG5cdCAqIHdoZW4gb3BlbmVkIHNob3cgdGhlIGRlZmF1bHQgcGxhY2Vob2xkZXIgaWYgYW55XG5cdCAqL1xuXHRTZWxlY3RGeC5wcm90b3R5cGUuX3RvZ2dsZVNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIHJlbW92ZSBmb2N1cyBjbGFzcyBpZiBhbnkuLlxuXHRcdHRoaXMuX3JlbW92ZUZvY3VzKCk7XG5cdFx0XG5cdFx0aWYoIHRoaXMuX2lzT3BlbigpICkge1xuXHRcdFx0aWYoIHRoaXMuY3VycmVudCAhPT0gLTEgKSB7XG5cdFx0XHRcdC8vIHVwZGF0ZSBwbGFjZWhvbGRlciB0ZXh0XG5cdFx0XHRcdHRoaXMuc2VsUGxhY2Vob2xkZXIudGV4dENvbnRlbnQgPSB0aGlzLnNlbE9wdHNbIHRoaXMuY3VycmVudCBdLnRleHRDb250ZW50O1xuXHRcdFx0fVxuXHRcdFx0Y2xhc3NpZS5yZW1vdmUoIHRoaXMuc2VsRWwsICdjcy1hY3RpdmUnICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYoIHRoaXMuaGFzRGVmYXVsdFBsYWNlaG9sZGVyICYmIHRoaXMub3B0aW9ucy5zdGlja3lQbGFjZWhvbGRlciApIHtcblx0XHRcdFx0Ly8gZXZlcnl0aW1lIHdlIG9wZW4gd2Ugd2FubmEgc2VlIHRoZSBkZWZhdWx0IHBsYWNlaG9sZGVyIHRleHRcblx0XHRcdFx0dGhpcy5zZWxQbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IHRoaXMuc2VsZWN0ZWRPcHQudGV4dENvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHRjbGFzc2llLmFkZCggdGhpcy5zZWxFbCwgJ2NzLWFjdGl2ZScgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogY2hhbmdlIG9wdGlvbiAtIHRoZSBuZXcgdmFsdWUgaXMgc2V0XG5cdCAqL1xuXHRTZWxlY3RGeC5wcm90b3R5cGUuX2NoYW5nZU9wdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIGlmIHByZSBzZWxlY3RlZCBjdXJyZW50IChpZiB3ZSBuYXZpZ2F0ZSB3aXRoIHRoZSBrZXlib2FyZCkuLi5cblx0XHRpZiggdHlwZW9mIHRoaXMucHJlU2VsQ3VycmVudCAhPSAndW5kZWZpbmVkJyAmJiB0aGlzLnByZVNlbEN1cnJlbnQgIT09IC0xICkge1xuXHRcdFx0dGhpcy5jdXJyZW50ID0gdGhpcy5wcmVTZWxDdXJyZW50O1xuXHRcdFx0dGhpcy5wcmVTZWxDdXJyZW50ID0gLTE7XG5cdFx0fVxuXG5cdFx0Ly8gY3VycmVudCBvcHRpb25cblx0XHR2YXIgb3B0ID0gdGhpcy5zZWxPcHRzWyB0aGlzLmN1cnJlbnQgXTtcblxuXHRcdC8vIHVwZGF0ZSBjdXJyZW50IHNlbGVjdGVkIHZhbHVlXG5cdFx0dGhpcy5zZWxQbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IG9wdC50ZXh0Q29udGVudDtcblx0XHRcblx0XHQvLyBjaGFuZ2UgbmF0aXZlIHNlbGVjdCBlbGVtZW50wrRzIHZhbHVlXG5cdFx0dGhpcy5lbC52YWx1ZSA9IG9wdC5nZXRBdHRyaWJ1dGUoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0Ly8gcmVtb3ZlIGNsYXNzIGNzLXNlbGVjdGVkIGZyb20gb2xkIHNlbGVjdGVkIG9wdGlvbiBhbmQgYWRkIGl0IHRvIGN1cnJlbnQgc2VsZWN0ZWQgb3B0aW9uXG5cdFx0dmFyIG9sZE9wdCA9IHRoaXMuc2VsRWwucXVlcnlTZWxlY3RvciggJ2xpLmNzLXNlbGVjdGVkJyApO1xuXHRcdGlmKCBvbGRPcHQgKSB7XG5cdFx0XHRjbGFzc2llLnJlbW92ZSggb2xkT3B0LCAnY3Mtc2VsZWN0ZWQnICk7XG5cdFx0fVxuXHRcdGNsYXNzaWUuYWRkKCBvcHQsICdjcy1zZWxlY3RlZCcgKTtcblxuXHRcdC8vIGlmIHRoZXJlwrRzIGEgbGluayBkZWZpbmVkXG5cdFx0aWYoIG9wdC5nZXRBdHRyaWJ1dGUoICdkYXRhLWxpbmsnICkgKSB7XG5cdFx0XHQvLyBvcGVuIGluIG5ldyB0YWI/XG5cdFx0XHRpZiggdGhpcy5vcHRpb25zLm5ld1RhYiApIHtcblx0XHRcdFx0d2luZG93Lm9wZW4oIG9wdC5nZXRBdHRyaWJ1dGUoICdkYXRhLWxpbmsnICksICdfYmxhbmsnICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uID0gb3B0LmdldEF0dHJpYnV0ZSggJ2RhdGEtbGluaycgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBjYWxsYmFja1xuXHRcdHRoaXMub3B0aW9ucy5vbkNoYW5nZSggdGhpcy5lbC52YWx1ZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgdHJ1ZSBpZiBzZWxlY3QgZWxlbWVudCBpcyBvcGVuZWRcblx0ICovXG5cdFNlbGVjdEZ4LnByb3RvdHlwZS5faXNPcGVuID0gZnVuY3Rpb24ob3B0KSB7XG5cdFx0cmV0dXJuIGNsYXNzaWUuaGFzKCB0aGlzLnNlbEVsLCAnY3MtYWN0aXZlJyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJlbW92ZXMgdGhlIGZvY3VzIGNsYXNzIGZyb20gdGhlIG9wdGlvblxuXHQgKi9cblx0U2VsZWN0RngucHJvdG90eXBlLl9yZW1vdmVGb2N1cyA9IGZ1bmN0aW9uKG9wdCkge1xuXHRcdHZhciBmb2N1c0VsID0gdGhpcy5zZWxFbC5xdWVyeVNlbGVjdG9yKCAnbGkuY3MtZm9jdXMnIClcblx0XHRpZiggZm9jdXNFbCApIHtcblx0XHRcdGNsYXNzaWUucmVtb3ZlKCBmb2N1c0VsLCAnY3MtZm9jdXMnICk7XG5cdFx0fVxuXHR9XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdEZ4OyJdfQ==
