var progress = document.querySelectorAll(".c-progress");

[].forEach.call(progress, function (el) {
	el.classList.add("start");
	setTimeout(function () {
		el.classList.remove("start");el.classList.add("anim");
	}, 10);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2dyZXNzLmpzIl0sIm5hbWVzIjpbInByb2dyZXNzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImNhbGwiLCJlbCIsImNsYXNzTGlzdCIsImFkZCIsInNldFRpbWVvdXQiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksV0FBVyxTQUFBLEFBQVMsaUJBQXhCLEFBQWUsQUFBMEI7O0FBRXpDLEdBQUEsQUFBRyxRQUFILEFBQVcsS0FBWCxBQUFnQixVQUFVLFVBQUEsQUFBUyxJQUFJLEFBQ3RDO0lBQUEsQUFBRyxVQUFILEFBQWEsSUFBYixBQUFpQixBQUNqQjtZQUFXLFlBQVcsQUFBRTtLQUFBLEFBQUcsVUFBSCxBQUFhLE9BQWIsQUFBb0IsU0FBVSxHQUFBLEFBQUcsVUFBSCxBQUFhLElBQW5FLEFBQXNELEFBQWlCLEFBQVU7SUFGbEYsQUFFQyxBQUFtRixBQUNuRiIsImZpbGUiOiJidWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9idWlsZC9wcm9ncmVzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBwcm9ncmVzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYy1wcm9ncmVzc1wiKTtcclxuXHJcbltdLmZvckVhY2guY2FsbChwcm9ncmVzcywgZnVuY3Rpb24oZWwpIHtcclxuXHRlbC5jbGFzc0xpc3QuYWRkKFwic3RhcnRcIik7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHsgZWwuY2xhc3NMaXN0LnJlbW92ZShcInN0YXJ0XCIpOyBlbC5jbGFzc0xpc3QuYWRkKFwiYW5pbVwiKSAgfSwgMTApO1xyXG59KTtcclxuIl19
