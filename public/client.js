var socket = new io();

socket.on("server-register-fail", function() {
    alert("Fail");
});

socket.on("server-send-register-success", function(data) {
    $("#currentUser").html(data);
    $("#loginform").hide();
    $("#chatform").show();
});

socket.on("server-send-message", function(jsonData) {
    $("#listMessage").append("<div class='ms'>" +jsonData.username + ": " + jsonData.message + "</div>")
});

socket.on("server-send-listuserol", function(data) {
    $("#boxContent").html("");
    data.forEach(function(e) {
        $("#boxContent").append("<div class='userOl'>"+e+"</div>");
    }); 
});

socket.on("someone-typing", function(data){
    $("#inform").html(data);
});

socket.on("someone-not-typing", function(){
    $("#inform").html("");
});

$(document).ready(function() {
    $("#loginform").show();
    $("#chatform").hide();

    $("#btnregister").click(function() {
        socket.emit("client-send-username", $("#username").val());
    });

    $("#btnlogout").click(function() {
        socket.emit("logout");
        $("#loginform").show();
        $("#chatform").hide();
    });

    $("#txtMessage").focusin(function() {
        socket.emit("user-typing");
    });

    $("#txtMessage").focusout(function() {
        socket.emit("user-not-typing");
    });

    $("#btnsend").click(function() {
        socket.emit("user-send-message", $("#txtMessage").val());
    });
});