
# InstaLunchline #
---


Table of Contents
-----------------

1. [About](#about)
2. [Added Features](#added-features)
3. [Demo](#demo)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Structure](#structure)
7. [Troubleshooting](#troubleshooting)
8. [Team](#team)


About
--------

InstaLunchline is a fork of the [Lunchline app](https://github.com/teamwolverine/lunchline), completely refactored into Ionic for a mobile-first experience.  

InstaLunchline is a crowdsourced, hybrid web/mobile app that lets users quickly search for restaurants around them and see what the wait times are to get their favorite food.

This app is built on Angular and Ionic with Firebase authentication and a Express backend with a Mongo/Mongoose DB.

Added Features
---------

* Complete refactor into Ionic
* User accounts and authentication
* Ability to add favorite restaurants
* Ability to search for favorite food
* Ability to search for food in a different location
* Ability to see last updated check in time
* Faster backend algorithm
* Time decay algorithm
* Deployed on Digital Ocean with NGINX routing and SSL certification

Demo
---------
Check out the hybrid web app at [https://instalunchline.com](https://instalunchline.com).

Getting Started
---------------
```
 npm install
 npm start
 cd lunchline
 sudo npm install -g cordova
 sudo npm install -g ionic
 npm install
 bower install
```
**Warning** Comment out SSL/HTTPSserver for app to run without SSL certificates.

Then visit http://localhost:8080.

Usage
-----
#### `npm start`
Runs the server (by default found at `localhost:8080`).

Structure
---------
```
.
├── lunchline             # Client-facing source code
│   └── www               
│        ├── js           # Ionic/Angular client facing code
│        ├── templates    # Html views for app
│        └── index.html   # Client-facing deployment html
├── server                # Server-side source code
|   ├── config            # Config requirements for api and database keys
|   ├── controllers       # Server controllers that interact with client side actions
|   ├── models            # Mongoose schema
|   ├── util              # General helper functions
|   ├── routes            # Routing for server side interaction
|   └── server.js         # Server bootstrap
└── index.js              # Starts the Express server
```

Troubleshooting
---------------

Having an issue? Please let us know! Report it, and we'll get to it as soon as possible.


Team
-----

This project was created by the InstaRoomie Dev Team:
* [Bobby Chong](https://github.com/bobbychong) - Software Engineer
* [Daniel Kim](https://github.com/DeeHKim) - Software Engineer
* [Daniel Rizko](https://github.com/drizko) - Software Engineer
* [Ethaniel Rubio](https://github.com/ethanrubio) - Software Engineer

With many thanks to the original Lunchline team for the great idea and structure.


