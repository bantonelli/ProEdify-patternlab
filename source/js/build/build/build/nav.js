//Navigation toggle
var navActive = false,
    navOpen = document.querySelector('.nav-toggle-menu'),
    navListOpen = document.querySelector('.c-primary-nav');

navOpen.addEventListener("click", function (event) {
	event.preventDefault();

	if (navActive === false) {
		navActive = true;
		navListOpen.classList.add("c-primary-nav--is-active");
	} else {
		navActive = false;
		navListOpen.classList.remove("c-primary-nav--is-active");
	}
});

//Search form toggle
var searchActive = false,
    searchOpen = document.querySelector('.nav-toggle-search'),
    searchFormOpen = document.querySelector('.c-search-form');

searchOpen.addEventListener("click", function (event) {
	event.preventDefault();

	if (searchActive === false) {
		searchActive = true;
		searchFormOpen.classList.add("c-search-form--is-active");
	} else {
		searchActive = false;
		searchFormOpen.classList.remove("c-search-form--is-active");
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdi5qcyJdLCJuYW1lcyI6WyJuYXZBY3RpdmUiLCJuYXZPcGVuIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibmF2TGlzdE9wZW4iLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInNlYXJjaEFjdGl2ZSIsInNlYXJjaE9wZW4iLCJzZWFyY2hGb3JtT3BlbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxJQUFJLFlBQUosQUFBZ0I7SUFDWixVQUFVLFNBQUEsQUFBUyxjQUR2QixBQUNjLEFBQXVCO0lBQ2pDLGNBQWMsU0FBQSxBQUFTLGNBRjNCLEFBRWtCLEFBQXVCOztBQUV6QyxRQUFBLEFBQVEsaUJBQVIsQUFBeUIsU0FBUyxVQUFBLEFBQVMsT0FBTSxBQUNoRDtPQUFBLEFBQU0sQUFFSDs7S0FBSSxjQUFKLEFBQWtCLE9BQU8sQUFDeEI7Y0FBQSxBQUFZLEFBQ1o7Y0FBQSxBQUFZLFVBQVosQUFBc0IsSUFBdEIsQUFBMEIsQUFDN0IsQUFIRTtRQUlFLEFBQ0g7Y0FBQSxBQUFZLEFBQ1o7Y0FBQSxBQUFZLFVBQVosQUFBc0IsT0FBdEIsQUFBNkIsQUFDOUIsQUFDRDtBQVhEOzs7QUFhQTtBQUNBLElBQUksZUFBSixBQUFtQjtJQUNmLGFBQWEsU0FBQSxBQUFTLGNBRDFCLEFBQ2lCLEFBQXVCO0lBQ3BDLGlCQUFpQixTQUFBLEFBQVMsY0FGOUIsQUFFcUIsQUFBdUI7O0FBRXhDLFdBQUEsQUFBVyxpQkFBWCxBQUE0QixTQUFTLFVBQUEsQUFBUyxPQUFNLEFBQ3ZEO09BQUEsQUFBTSxBQUVIOztLQUFJLGlCQUFKLEFBQXFCLE9BQU8sQUFDM0I7aUJBQUEsQUFBZSxBQUNmO2lCQUFBLEFBQWUsVUFBZixBQUF5QixJQUF6QixBQUE2QixBQUNoQyxBQUhFO1FBSUUsQUFDSDtpQkFBQSxBQUFlLEFBQ2Y7aUJBQUEsQUFBZSxVQUFmLEFBQXlCLE9BQXpCLEFBQWdDLEFBQ2pDLEFBQ0Q7QUFYRyIsImZpbGUiOiJidWlsZC9idWlsZC9uYXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL05hdmlnYXRpb24gdG9nZ2xlXHJcbnZhciBuYXZBY3RpdmUgPSBmYWxzZSxcclxuICAgIG5hdk9wZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LXRvZ2dsZS1tZW51JyksXHJcbiAgICBuYXZMaXN0T3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jLXByaW1hcnktbmF2Jyk7XHJcblxyXG5uYXZPcGVuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCl7XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAobmF2QWN0aXZlID09PSBmYWxzZSkge1xyXG5cdCAgICBuYXZBY3RpdmUgPSB0cnVlO1xyXG5cdCAgICBuYXZMaXN0T3Blbi5jbGFzc0xpc3QuYWRkKFwiYy1wcmltYXJ5LW5hdi0taXMtYWN0aXZlXCIpO1xyXG5cdH0gXHJcblx0ZWxzZSB7XHJcblx0XHQgbmF2QWN0aXZlID0gZmFsc2U7XHJcblx0XHQgbmF2TGlzdE9wZW4uY2xhc3NMaXN0LnJlbW92ZShcImMtcHJpbWFyeS1uYXYtLWlzLWFjdGl2ZVwiKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy9TZWFyY2ggZm9ybSB0b2dnbGVcclxudmFyIHNlYXJjaEFjdGl2ZSA9IGZhbHNlLFxyXG4gICAgc2VhcmNoT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtdG9nZ2xlLXNlYXJjaCcpLFxyXG4gICAgc2VhcmNoRm9ybU9wZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYy1zZWFyY2gtZm9ybScpO1xyXG4gICAgXHJcbiAgICBzZWFyY2hPcGVuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCl7XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAoc2VhcmNoQWN0aXZlID09PSBmYWxzZSkge1xyXG5cdCAgICBzZWFyY2hBY3RpdmUgPSB0cnVlO1xyXG5cdCAgICBzZWFyY2hGb3JtT3Blbi5jbGFzc0xpc3QuYWRkKFwiYy1zZWFyY2gtZm9ybS0taXMtYWN0aXZlXCIpO1xyXG5cdH0gXHJcblx0ZWxzZSB7XHJcblx0XHQgc2VhcmNoQWN0aXZlID0gZmFsc2U7XHJcblx0XHQgc2VhcmNoRm9ybU9wZW4uY2xhc3NMaXN0LnJlbW92ZShcImMtc2VhcmNoLWZvcm0tLWlzLWFjdGl2ZVwiKTtcclxuXHR9XHJcbn0pOyJdfQ==
