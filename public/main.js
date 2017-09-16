loadContent = function(href){
	$.get(href, function(data){
		$('#content').slideUp(500);
		setTimeout(function(){$('#content').html(data).slideDown(500);},500);
	});
}

$(document).ready(function(){
	$("#header li").find('a').click(function(event){
		event.preventDefault(); // zabrania wykonania domyślnej akcji przycisku
		var href = $(this).attr('href');
		loadContent(href);
	});
	$("#headerlogin").click(function(event){
		event.preventDefault();
		var href = $(this).attr('href');
		loadContent(href);
	})
	loadContent("/main");
});