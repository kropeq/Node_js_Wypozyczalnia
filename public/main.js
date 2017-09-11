loadContent = function(href,element){
	$.get(href, function(data){
		element.html(data);
	});
}

$(document).ready(function(){
	$("#header li").first().find('a').click(function(event){
		event.preventDefault(); // zabrania wykonania domyślnej akcji przycisku
		var href = $(this).attr('href');
		loadContent(href,$('#tresc'));
	});
	$("#header > li").find('a').click(function(event){
		event.preventDefault(); // zabrania wykonania domyślnej akcji przycisku
		var href = $(this).attr('href');
		loadContent(href,$('#tresc'));
	});
	loadContent("/main",$('#content'));
});