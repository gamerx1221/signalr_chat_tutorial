//Name: Navjot Sandhu
//Date:  3/4/2020
//AppDescription:  SignalR chat application for Cazton Interview
//Filename: chat.js file
//File Description: used for async functionality when communicating with signalR server on asp.net web application using .net core 3.1

"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();  //creates connection to /chatHub hub using signalR library

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message;
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);  //updates message area with group broadcast message
});

connection.on("PrivateMessage", function (message) { //updates message area with private message
   
    var li = document.createElement("li");
    li.textContent = message;
    document.getElementById("messagesList").appendChild(li);

});

connection.on("UpdateUserList", function (userids) {
    var selectList = document.getElementById("chatroomlist");
 
    var length = selectList.options.length; //removes all usernames from list
    while (length > 0) {
        selectList.remove(0);
        length--;
    }
    for (var i = 0; i < userids.length; i++) {   //creates fresh list
        var option = document.createElement("option");
        option.text = userids[i];
        selectList.add(option);
    }
    var userid_array = userids;
});
var userIDString;


async function connect() { //connects to signalR chatroom

    var user = document.getElementById("userInput").value;
    
    if (user !== "") {
        await connection.start();
      
            userIDString = user;
            connection.invoke("SendUserID", user).catch(function (err) {
                return console.error(err.toString());
            });
            document.getElementById("sendButton").disabled = false; //sendbutton is enabled when connected to server, in order to send group messages
            document.getElementById("sendPrivateMsgButton").disabled = false; //sendPrivateMsgButton is enabled when connected to server, in order to send private messages
            document.getElementById("disconnectButton").disabled = false; //disconnect button is enabled when connected to server, in order to disconnect from server
            document.getElementById("connectButton").disabled = true; //connect button is disabled when successfully connected with server
            document.getElementById("userInput").disabled = true;   //username field is disabled when successfully connected with server
        
    
    } else { alert("please enter a username");} //tells user to enter username if field is blank
};
async function disconnect() {
    //sends message to server, notifying it to remove userID because the user has disconnected

    connection.invoke("RemoveUserID", userIDString).catch(function (err) {
        return console.error(err.toString());
    });
    connection.stop();
    return;
};
document.getElementById("connectButton").addEventListener("click", function (event) {
    connect();
});
document.getElementById("disconnectButton").addEventListener("click", function (event) {
    async function disconnection() {
        await disconnect();

        document.getElementById("sendButton").disabled = true;          //sendbutton is disabled when disconnected to server
        document.getElementById("sendPrivateMsgButton").disabled = true;    //sendPrivateMsgButton is disabled when disconnected to server
        document.getElementById("disconnectButton").disabled = true;   //disconnect button is disabled when disconnected to server
        document.getElementById("connectButton").disabled = false;   //connect button is enabled when disconnected with server, in order to connect to server
        document.getElementById("userInput").disabled = false;     //username field is enabled when disconnected with server, in order to provide username
    };
    disconnection();
});
//group chat send button function
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").value = "";
    event.preventDefault();
});

//functionality for p2p messaging
document.getElementById("sendPrivateMsgButton").addEventListener("click", function (event) {
    var userList = document.getElementById("chatroomlist");
    var receiver= userList.options[userList.selectedIndex]; //userid of recipient; if chat window doesn't exist create new one
    var sender = userIDString; //current user id, i.e 
    var message = document.getElementById("messageInput").value;
    if (userList.selectedIndex !== -1) {
        connection.invoke("P2PChatRelay", sender, receiver.text, message).catch(function (err) {
            return console.error(err.toString());
        });
        var li = document.createElement("li");
        li.textContent = "<<" + sender + " says to " + receiver.text + ">> " + message;
        document.getElementById("messagesList").appendChild(li);
        document.getElementById("messageInput").value = "";
        event.preventDefault();
    } else {
        alert("Please select a user to msg");
    }
});