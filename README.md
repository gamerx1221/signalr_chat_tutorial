# signalr_chat_tutorial
------------------------------------
Update: 5/11/2020

.net core 2.1 has default account and sign-in controller and views built-in into razor libraries

In order to extend or change default views, see the following url:
https://gavilan.blog/2019/07/18/accountcontroller-missing-razor-class-libraries-dotnet-cli-identity-scaffolding/

---------------------------------------------------------------------


Basic Chat application that works using SignalR and Asp.NET Core 3.1

SignalR chat application using asp.net core 3.1

Has the following features:

Group chat
Private chat

User has to authenticate using Google email in order to use chat application
Chat application link is available from homepage

Use the following steps to setup clientid and clientsecret for oauth 2.0 authentication

Use secret manager through command line to set client id, and client secret for app authorization
 
 
dotnet user-secrets set "Authentication:Google:ClientId" "<client id>" 
dotnet user-secrets set "Authentication:Google:ClientSecret" "<client secret>"
 
From <https://docs.microsoft.com/en-us/aspnet/core/security/authentication/social/google-logins?view=aspnetcore-3.1> 

When setting up clientid and clientsecret with google developer site:

For Google Authentication, use the following redirect URL:
http://<localhost :9834>/signin-google
<localhost being URL of wherever this chat application is being hosted>

Used the following to initialize and add client and secret id to user profile
 
dotnet user-secrets init --project "chat_signalr_tutorial" to initialize secrets manager
 
dotnet user-secrets set "Authentication:Google:ClientId" "*********" --project "chat_signalr_tutorial"  //see credentials.json for actual clientid and secret, hidden here
dotnet user-secrets set "Authentication:Google:ClientSecret" "**********" --project "chat_signalr_tutorial"
 ____________________________________________________
 
 
For Microsoft Authentication
 
/signin-microsoft use this for redirectUrl
 
From <https://docs.microsoft.com/en-us/aspnet/core/security/authentication/social/microsoft-logins?view=aspnetcore-3.1> 
 
dotnet user-secrets set "Authentication:Microsoft:ClientId" "*********" --project "chat_signalr_tutorial"  //see credentials.json for actual clientid and secret, hidden here
dotnet user-secrets set "Authentication:Microsoft:ClientSecret" "**********" --project "chat_signalr_tutorial"


you will need to setup clientid and client secret at respective developer sites for google and microsoft



