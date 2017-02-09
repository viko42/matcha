export function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
	document.getElementById("main").style.marginLeft = "250px";
	document.getElementById("App-header-hbgr").style.display = "none";
	document.getElementById("App-header-search").style.display = "none";
}
export function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.getElementById("main").style.marginLeft= "0";
	document.getElementById("App-header-hbgr").style.display = "inline-block";
	document.getElementById("App-header-search").style.display = "inherit"
}

export function openSearchBar() {
	let show = document.getElementById("search-bar").style.display

	if (show !== "inherit") {
		document.getElementById("search-bar").style.display = "inherit"
		document.getElementById("menu-bar").style.display = "none"
		document.getElementById("App-header-bar").style.overflow = "inherit"
		document.getElementById("img-icon-search").src = "/img/cancel.svg"
	}
	else {
		document.getElementById("search-bar").style.display = "none"
		document.getElementById("menu-bar").style.display = "inherit"
		document.getElementById("img-icon-search").src = "/img/searchIcon.png"
		document.getElementById("App-header-bar").style.overflow = "hidden"
	}
}
