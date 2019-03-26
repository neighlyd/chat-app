# Chat App

This is a chat app designed to learn websockets using the [socket.io](https://socket.io) library. Users can either create new chat rooms or join existing ones. Existing rooms display in a dropdown menu, while users can type in a new room of their choice to create one.

> Notice: Usernames are unique per room.

Once in a room, the users can chat or share their geolocation informaiton with one another in real time.

The rooms also have a linkify app running that will dynamically add link tags to urls and email addresses.

Each chatroom contains a sidebar that has the name of the chatroom and a list of the users. This information is updated dynamically as users enter and leave the room.

## Future Expansions

My goal is to integrate the chat app into other apps that I have created, such as the [Task App](https://github.com/neighlyd/node-todo-api), [Expensify App](https://github.com/neighlyd/expensify-app), and a Weather App.

I plan to unite the three apps with a single sign-on account API, treating them each as microservices.

Ideally, users will be able to get a list of tasks and expenses from the chat app through bot-commands (e.g. `":weather"` to return weather based on the location or `":tasks"` to return tasks they have stored in the database)