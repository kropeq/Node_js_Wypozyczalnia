loadContent = function(href){
	$.get(href, function(data){
		$("#content").html(data);
	});
}

$(document).ready(function(){
	$("#header ul li a").click(function(event){
		event.preventDefault(); // zabrania wykonania domyślnej akcji przycisku
		var href = $(this).attr('href');
		loadContent(href);
	});
	loadContent("/main");
});