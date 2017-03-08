$(document).ready(function(){
	setInterval(function(){notifyMe()},3600000);
	
});



// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe() {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('3DVES Control H3', {
      icon: './images/3dves.png',
      body: "Recuerda actualizar tus tareas",
    });

    notification.onclick = function () {
      window.open("http://201.244.120.10:3091/login.html");      
    };
    
  }

}