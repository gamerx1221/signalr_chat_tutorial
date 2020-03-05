//Name: Navjot Sandhu
//Date:  3/4/2020
//AppDescription:  SignalR chat application for Cazton Interview
//File: ChatHub.cs
//File Description: SignalR functionality for ChatHub chatHub; used for group chat and p2p chat functionality;  additional functionality includes connecting, disconnecting, and keeping track of users that are currently connected, and removing users when they disconnect
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace chat_signalr_tutorial
{
    public class ChatHub : Hub
    {
        protected static Dictionary<String, String> user_ids = new Dictionary<string, string>(); //used as lookup table for connection ID using username
        protected static List<String> UserList = new List<String>(); //stores all usernames currently connected to server
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);  //sends a group message to all recipients including sender
        }
        public async Task SendUserID(string user)
        {
            AddUser(user);
            await Clients.All.SendAsync("UpdateUserList", UserList); //sends new list to all clients including newly connected user
        }
        public async Task RemoveUserID(string user)
        {
            RemoveUser(user);
            await Clients.All.SendAsync("UpdateUserList", UserList);//sends new list to all clients including newly connected user
        }
        public async Task P2PChatRelay(string sender, string user, string message)
        {
            string userID;
            user_ids.TryGetValue(user, out userID); //gets user ConnectionID from Dictionary
            string userMsg = "<<" + sender + ">>" + message;
            await Clients.Client(userID).SendAsync("PrivateMessage", userMsg); //sends a msg from one user to another using a connection ID
        }

        private void AddUser(string userID)
        {
            UserList.Add(userID);
            user_ids.Add(userID, Context.ConnectionId);   //adds userID to List for storing usernames; adds userID and connectionID to Dictionary for connectionID lookup table using username as key
            Console.WriteLine(userID + " added to dictionary");   
        }
        private void RemoveUser(string userID) {  //removes user id and connection id from data structures used for storing username and username, connectionID datasets
            UserList.Remove(userID);
            user_ids.Remove(userID);
            Console.WriteLine(userID + " removed from dictionary");
        }
        //send whenever a new user is added
        public async Task UpdateUserListServ()  //updates all users when a user connects or disconnects
        {
            await Clients.All.SendAsync("UpdateUserList",UserList);  
        }
        //send when user first connects
        public async Task UpdateUserListServSingle(String userID) //currently unused
        {
            await Clients.Client(userID).SendAsync("UpdateUserList", UserList);
        }
    }
}
