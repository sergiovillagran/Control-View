var app= angular.module("Control-H3",[]);

app.controller("signUpController",function signUpController($scope){     
    $scope.message_title="";
    $scope.message_content="";
    $scope.newUser={
        name: "",
        pass: ""
    };    
    $scope.signUp= function(){               
        if($scope.newUser.name != ""  && $scope.newUser.pass!=""){
            var info = {
                ruta : "/user",
                type : 'POST',
                data : {
                    "name" : $scope.newUser.name,
                    "password" : $scope.newUser.pass                
                }           
            };            
            queryServer(info, function(error, user){                
                if(error){     
                    $scope.message_title="Error";               
                    $scope.message_content= error.details;
                }           
                else{    
                    $scope.message_title= "Message";                
                    $scope.message_content= "User created successfully. Welcome! Your ID is: "+ user._id;
                    //Se envia la informacion del empleado a otra vista 
                }
                $scope.$apply();
            });
        }
        else{
            $scope.message_title="Error";
            $scope.message_content="Any field may be empty";
        }       
    };
});

app.controller("passwordChangeController",function changePasswordController($scope){    
    $scope.message_title="";
    $scope.message_content="";
    $scope.user= {
        name: "",
        pass1: "",
        pass2:"",
        newPass: ""
    };
    $scope.changePass= function(){
        if($scope.user.name != ""  && $scope.user.pass1!="" && $scope.user.pass2!="" && $scope.user.newPass!=""){
            if($scope.user.pass1 === $scope.user.pass2){
                var info = {
                    ruta : "/passwordChange",
                    type : 'POST',
                    data : {
                       "name" : $scope.user.name,
                       "password" : $scope.user.pass1,
                       "newPassword": $scope.user.newPass                
                    }           
                };            
                queryServer(info, function(error, usuario){                                                  
                    if(error){
                        $scope.message_title="Error";
                        $scope.message_content= error.details;                        
                    }           
                    else{   
                        $scope.message_title= "Message";                 
                        $scope.message_content= "Password changed successfully";
                        //Se envia la informacion del empleado a otra vista 
                    }
                    $scope.$apply();
                });
            }else{
                $scope.message_title="Error";
                $scope.message_content= "Old password's don't match";                
            }
        }
        else{
            $scope.message_title="Error";
            $scope.message_content= "Any field may be empty";
        }
    };
});

function queryServer (info, callback){
    var data = (info.data)?info.data : null;
    var dataType = (data != null)?'json' : 'jsonp';
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