		
var PROJECTS = {};
var LABOREDINPROJECTS = [];


function begin (){
	workingNow();
	setInterval(workingNow, 3000);
	setInterval(function(){$("#debug").empty();}, 30000);
};

function workingNow(){
	var info = {
		ruta : "/workingNow",
		type : 'GET'
	};

	queryServer(info, function(error, users){
		if(error){
			showError(error.details);
		}
		else 
		{	
      		usersList = users;
			if(usersList){
				$("#working").empty();
				$("#working").append('<tr><td>Name</td><td>Working at</td></tr>');
				for (var i = usersList.length - 1; i >= 0; i--) {
					$("#working").append('<tr><td>'+ usersList[i].name 
						+'</td><td>' + usersList[i].state + '</td></tr>');
				};
			}
		}	
	});
};

function checkWorking(){
	var name = $("#name").val();
	for (var i = usersList.length - 1; i >= 0; i--) {
		if(usersList[i].name == name){
			if($("#labored").val() == null){
				/*$("#divLabored").append('<label class="col-md-4 control-label" for="Labored">Labored</label>'+
  				'<div class="col-md-4">' +
			    '<textarea class="form-control" id="labored" name="Labored" required=""></textarea>' +
			  	'</div>');*/
				$('#addTask').show();
				
			}
			$("#SignIn").empty();
			$("#SignIn").append("Sign out");
			$("#SignIn").val(false);
			return
		}
		else
		{				
			if($("#SignIn").val() == "false"){	
				$("#divLabored").empty();			
				$("#SignIn").empty();
				$("#SignIn").append("Sign in");
				$("#SignIn").val(true);
				$('#addTask').hide();
			}
		}
	}
};

function drawTask(){	
	alert("si entro");
		   var info = {
        	ruta : "/addTask",
        	type : 'POST',        	
        	data : {
        		"name" : $("#nameUser").val(),
        		"password" : $("#passwordUser").val(),
        		"labored" : getLabored()
        	}
        };
		queryServer(info, function(error, result){
			if(error){
				alert(error.details);
			}			
			else
			{
				//showMessage(result);
				$('#laboredSelect').empty();
				$('#contentTask').empty();
			}
		});
}

function getProjects (callback) {
	var info = {
		ruta: '/projects',
        type: 'GET'
	}

	queryServer(info, callback);
}

function drawProjectsModal (err, data){
	if(err)
		console.log("error in geting projects");
	else{
		//$("#divLabored").append('<div class = "form-group row"><label class = "col-sm-4 for = "laboredSelect">project: </label> <div class = "col-sm-5"><select class="form-control select-md" id = "laboredSelect"></div>');
		
		$('#laboredSelect').on('change', function() {
			drawProjectandButtonTask(this.value);
		})

		for(var index in data){
			$("#laboredSelect").append('<option value = "' + data[index]._id + '">' + data[index].name + '</option>');
			data[index].isDrawed = false;
			PROJECTS[data[index]._id] = data[index];
		}
	}
}

function drawProjectandButtonTask(projectId){
	if(PROJECTS[projectId].isDrawed)
		return
	
	$("#contentTask").append('<div class = "form-group row" id = "row' + PROJECTS[projectId]._id + '">');
	$('#row' + PROJECTS[projectId]._id).append('<label class = "col-sm-4 for = "labored' + PROJECTS[projectId]._id + '"> ' + PROJECTS[projectId].name + ': </label>');
	$('#row' + PROJECTS[projectId]._id).append('<div class = "col-sm-5"><input type="text" class="form-control input-sm" id = "labored'+ PROJECTS[projectId]._id +'" required autofocus></textarea></div>');
	$('#row' + PROJECTS[projectId]._id).append('<div class = "col-sm-2"><select class="form-control select-sm" id = "laboredHours'+ PROJECTS[projectId]._id +'"><option value = "1">1</option><option value = "2">2</option><option value = "3">3</option><option value = "5">5</option><option value = "8">8</option><option value = "12">12</option>');
	$('#row' + PROJECTS[projectId]._id).append('<span class="glyphicon glyphicon-remove " onclick="unDrawProjectFromLaboredView(' + PROJECTS[projectId]._id + ')"></span>');
	PROJECTS[projectId].isDrawed = true;
	
}

function unDrawProjectFromLaboredView(projectId){
	$('#row' + projectId).remove();
	PROJECTS[projectId].isDrawed = false;
}

function getLabored() {
	var LABOREDINPROJECTS = [];
	for(var index in PROJECTS){
		if(PROJECTS[index].isDrawed){
			var laboredInP = {
				projectId: PROJECTS[index]._id,
				worked: $('#labored' + PROJECTS[index]._id).val(),
				hours: $('#laboredHours' + PROJECTS[index]._id).val()
			}
			LABOREDINPROJECTS.push(laboredInP);
		}
	}
	return JSON.stringify(LABOREDINPROJECTS);
}

$(document).ready(function(){
	 $("#SignIn").click(function(){
       	var ruta ;

        if($("#SignIn").val()=="true"){
        	ruta = '/login';
        }else{    	
			ruta = '/logout';
        }

        var info = {
        	ruta : ruta,
        	type : 'POST',        	
        	data : {
        		"name" : $("#name").val(),
        		"password" : $("#password").val(),
        		"labored" : getLabored()
        	}
        };
		queryServer(info, function(error, result){
			if(error){
				showError(error.details);
			}			
			else
			{
				showMessage(result);
			}
		});
    });

	$("#addTask").click(function(){		
		 $('#modalTask').modal('show');
		   $('#nameUser').val($('#name').val());
           $('#passwordUser').val($('#password').val());
		 getProjects(drawProjectsModal);

	})

	$("#btnAddTask").click(function(){
		drawTask();
		$('#modalTask').modal('hide');

	})
	
});

function queryServer (info, callback){
	var data = (info.data)?info.data : null;
	var	dataType = (data != null)?'json' : 'jsonp';
	$.ajax(
   	{	 	
    	url: hostserv + info.ruta,
        type: info.type,
        dataType: dataType,
        data: data,
        timeout: 15000,
        success: function(result) {  
			callback(null, result);
		 },   
         error: function(jqXHR, textStatus, error) {
         		var details = (jqXHR.responseText != null )? jQuery.parseJSON(jqXHR.responseText) : {error : "No connection with the server"};	
         		error={
         			jqXHR : jqXHR, 
         			textStatus : textStatus, 
         			details : details.error	
         		};
				callback(error, null);
         }
    });
};

function showMessage(message){
	$("#debug").empty();
	if(!message.error){
		var logoutb = ($("#SignIn").val() == "true")?true:false;
		$("#debug").append('<br><legend>' + message.name + ' </legend><br>' +
			((logoutb)?'Loged: ': 'Log out: ') + new Date(message.date) + ((logoutb)?' and lobored at: ' +  message.type:''));
	}else{
		showError(message);		
	}
	clear();

};

function showError(error){
	$("#debug").empty();
	$("#debug").append('<br><legend>ERROR </legend><br>' + error);
};

function clear(){
	$("#name").val("");
	$("#password").val("");
	$("#divLabored").empty();
	$("#SignIn").empty();
	$("#SignIn").append("Sign in");
	$("#SignIn").val(true);
};




