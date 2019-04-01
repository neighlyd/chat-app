# Chat App

This is a chat app designed to learn websockets using the [socket.io](https://socket.io) library. Users can either create new chat rooms or join existing ones. Existing rooms display in a dropdown menu, while users can type in a new room of their choice to create one.

> Notice: Usernames are unique per room.

Once in a room, the users can chat or share their geolocation informaiton with one another in real time.

The rooms also have a linkify app running that will dynamically add link tags to urls and email addresses.

Each chatroom contains a sidebar that has the name of the chatroom and a list of the users. This information is updated dynamically as users enter and leave the room.

The chatroom can be reached at https://neighly-chat-app.herokuapp.com

## Commands

The server has built-in commands to help the users.

These commands are accessed by typing `/` and then the command before sending it to the server.

The currently available commands are:


><code>/help</code> - returns a brief description of all available commands
>
><code>/time</code> - returns the local time of the server
>
><code>/weather</code> - returns a forecast for your area. Be aware that you need to share your location with the chatroom first (this is public. TODO: make sharing location optionally private)
>
><code>/dm <user> <message></code> - sends a private message to another user in the same room.
>
><code>/pm <user> <message></code> - same as <code>/dm</code>


## Future Expansions

My goal is to integrate the chat app into other apps that I have created, such as the [Task App](https://github.com/neighlyd/node-todo-api), [Expensify App](https://github.com/neighlyd/expensify-app).

I plan to unite the three apps with a single sign-on account API, treating them each as microservices.

Ideally, users will be able to get a list of tasks and expenses from the chat app through bot-commands (e.g. `"/weather"` to return weather based on the location or `"/tasks"` to return tasks they have stored in the database)