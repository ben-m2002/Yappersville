# Yappersville

## Elevator Pitch
Do you and your buddies want a place to talk after school, and don't know where to go? Group messaging isn't as fun especially when you guys have different phones, and let's be honest within group messaging you don't have the freedom to make the groups and circles of friends you really want. That's why we are here to introduce Yapperville. A full-fledged chat application where you can create groups, join groups and chat with a host of people both publicly and privately.

## Design

![Design Image 1](images/YLogin-1.jpg)
![Design Image 2](images/YGroup-2.jpg)
![Design Image 3](images/YChatPage-3.jpg)
![Design Image 4](images/YPrivate-4.jpg)

## Key features

- Secure login over HTTPS
- Ability to chat in real time with friends
- Ability to create groups with codes to chat with your friends
- Ability to private message people

## Technologies

### I am going to use the required technologies in the following ways:

#### HTML
- Uses correct HTML structure for the application. One page to handle logins. One page to join a group via a code, or join an existing group. Another page to chat within the groups. Lastly, a page to private message people.

#### CSS
- Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.

#### JavaScript
- Provides login, will provide the functionality to actually be able to type and chat. Allow for interactions between the user and UI for instance clicking on someone to private message them. Allow for interaction between pages.

#### Service
- Backend service with endpoints for:
  - login
  - retrieving chats
  - putting a new chat in
  - creating a new group

#### DB
- Store users, store chats, and store groups

#### Login
- Register and login users. Credentials securely stored in the database. Can't interact with our application without login. So no chatting or group joining.

#### WebSocket
- Instant update of chats when people are talking in groups or private message.

#### React
- Application ported to use the React web framework.

## HTML Deliverable

### For this deliverable I built out the structure of my application using HTML
- HTML pages : 4 HTML Pages for main page, groups, chat, and private message
- Links : There are proper links connected pages together
- Text : There is text to join groups, and text that show how the chat works
- 3rd Party : There is a joke button, that will use a 3rd party service to tell a joke
- Images : There are images associated with each group
- Login : Input and password box to login
- Database : There is a database to hold login info and holds chats according to groups, and also private messages
- Websocket : There is real time chatting in the groups and private and messaging

## CSS Deliverable

### This deliverable just illustrates my knowledge of css and the principles that apply to styling a page
-Header, footer, and main content body
-Navigation elements - Made a really cool nav bar
-Responsive to window resizing - My app looks great on all window sizes and devices
-Application elements - Used good contrast and whitespace
-Application text content - Consistent fonts
-Application images - I have images in the groups page

## JavaScript Deliverable

### This deliverable will show my knowledge of java script
- I have java script login support
- I have java script support for databases via group creation. Also chats for groups save
- I have java script web socket support that will be used in the chat page
- The application has the full java script interactions.

## React Deliverable

### This deliverable will show my knowledge of React
-Bundled using WebPack and Babel as generated from using create-react-app
-Created multiple react components, for login, groups, chat, private, members, messages
-Routed html requests properly
-Used react states for proper react components


Link to notes : https://github.com/ben-m2002/startup/blob/main/notes.md
