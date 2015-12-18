	// Sortable
	$(function() {
		$("#sortable1, sortable2, sortable3").sortable({
			connectWith: ".connectedSortable",
			dropOnEmpty: true
		}).disableSelection();
	});

	//Add user story
	$(function(){
		$("#add_btn").click(function() {
			var newStory = "<span class='remove glyphicon glyphicon-remove'></span><br>" + $("#txt_field").val();
			$("ul:first").append("<li>"+newStory+"</li>");
			$("#txt_field").val('');

			// Add .card class to every new story that isn't &nbsp;
			$("li").each(function(){
				if($(this).text() !== '\xa0'){
					($(this).addClass("card"));
				}
			});
		});
	});

	// Delete user story
	$(document).on('click', '.remove', function(){
		$(this).parent().remove();
	});

	// Save kanban board
	$(function(){
		$("#save_btn").click(function(){
			
			var projectname = $("#projectname").text();
			var username = $("#username a").text();

			var todo = [];
			var inprog = [];
			var done = [];

			$(".todolist li").each(function(index){
				if($(this).text() !== '\xa0'){
				todo.push($(this).text());
				}
			});
			$(".inprogresslist li").each(function(index){
				if($(this).text() !== '\xa0'){
				inprog.push($(this).text());
				}
			});
			$(".donelist li").each(function(index){
					if($(this).text() !== '\xa0'){
					done.push($(this).text());
				}
			});

			// Stringify now and remember to parse back.
			var todoJson = JSON.stringify(todo);
			var inprogJson = JSON.stringify(inprog);
			var doneJson = JSON.stringify(done);

			// send variables by post method
			$.ajax({
				type: "POST",
				url: "/saveproject",
				data: {projectname: projectname, owner: username, todolist: todoJson, inprogresslist: inprogJson, donelist: doneJson},
				success: function() {
					console.log("data posted successfully.");
				}
			});

		});
	});
