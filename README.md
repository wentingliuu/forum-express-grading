# Restaurant Forum API
A restaurant forum website built with [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/), and [MySQL](https://www.mysql.com/). Create your own account to CRUD restaurants info, leave comments to restaurants, follow or unfollow other forum users and so on. 🍣 🍔 🍲


🌟 This project is deployed on **[HEROKU](https://floating-dusk-15723.herokuapp.com/)** as well !!!
🌟 Please use the following **[dummy data]** to login, or register your own account.

| Email             | Password | Role                                       |
| ------------------| ---------| ------------------------------------------ |
| user1@example.com | 12345678 | User (access to front-stage)               |
| root@example.com  | 12345678 | Admin (access to front-stage & back-stage) |


## Features

| Feature                        | Detail                                          | API ROUT                       |
| -------------------------------| ------------------------------------------------| ------------------------------ |
| REGISTER                       | sign up an account with name, email, password   | POST /signup                   | 
| LOGIN                          | sign in to browse the website                   | POST /signin                   |
| LOGOUT                         | sign out the account                            | GET /logout                    |
| BROWSE ALL RESTAURANTS         | users could browse all restaurants' info        | GET /restaurants               |
| FILTER RESTAURANTS BY CATEGORY | users could filter the restaurants by category  | GET /restaurants?categoryId=id |
| BROWSE SPECIFIC RESTAURANT     | users could browse sepcific restaurant          | GET /restaurants/:id           |
| LEAVE COMMENTS                 | users could leave commets to restaurant         | POST /restaurants/:id          |
| ADD TO FAVORITE                | users could add a restuarant to favorite list   | POST /favorite/:restaurantId   |
| REMOVE FROM FAVORITE           | users could remove a restuarant to favorite list| DELETE /favorite/:restaurantId |
| LATEST FEEDS                   | a page to show latest restaurants and comments  | GET /restaurants/feeds         |
| TOP 10 RESTAURANTS             | a page to show top 10 favorited restaurants     | GET /restaurants/top           |
| TOP USERS                      | a page to show users ranking by followed counts | GET /users/top                 |               
| BROWSE SPECIFIC USER           | users could read specific user's profile        | GET /users/:id                 |
| EDIT USER PROFILE              | users could edit profile & upload profile photo | PUT /users/:id                 |
| FOLLOW A USER                  | users could follow others                       | POST /following/:userId        |
| UNFLLOW A USER                 | users could unfollow others                     | DELETE /following/:userId      |
| (Admin) READ ALL RESTAURANTS   | admin could view full restaurants list at back-stage | GET /admin/restaurants    |
| (Admin) READ A RESTAURANT      | admin could view a restaurant info at back-stage  | GET /admin/restaurants/:id   |
| (Admin) CREATE A RESTAURANT    | admin could create a new restaurant at back-stage | POST /admin/restaurants      |
| (Admin) UPDATE A RESTAURANT    | admin could update a restaurant info at back-stage| PUT /admin/restaurants/:id   |
| (Admin) DELETE A RESTAURANT    | admin could delete a restaurant at back-stage     | DELETE /admin/restaurants/:id|
| (Admin) READ ALL USERS         | admin could view full users list at back-stage    | GET /admin/users             |
| (Admin) EDIT USER ROLE         | admin could change user's role at back-stage      | POST /admin/users/:id        |


## Installation and Execution
1.  Clone the files to your computer
```
git clone https://github.com/wentingliuu/restaurant-forum-api.git
```
2. Init: install the npm packages
```
cd restaurant-forum-api
```
```
npm install
```
3. Create .env file and store API Key in the file
```
touch .env
```
- Please see [.env.example](https://github.com/wentingliuu/restaurant-forum-api/blob/main/.env.example) for reference.
- Please get your own IMGUR_CLIENT_ID from [Imgur](https://api.imgur.com/oauth2/addclient).
4. Direct to ./config/config.json, and modify "username" & "password" in "development" section to map your local Sequelize setting.
5. Setup local database at SQL Workbench
```
drop database if exists forum;
create database forum;
```
6. Create data in locl database
```
npx sequelize db:migrate
```
```
npx sequelize db:seed:all
```
7. Run the project
```
npm run dev
```
- While the terminal returns `Express is listening on localhost:3000`, please visit http://localhost:3000 on your browser.


## Skills & Tools
*  [Node.js](https://nodejs.org/en/) & [npm](https://www.npmjs.com/) - JavaScript runtime environment
*  [Express.js](https://expressjs.com/) - web application framework
*  [Express-Handlebars](https://www.npmjs.com/package/express-handlebars) - template engine
*  [MySQL](https://www.mongodb.com/) - relational database management system
*  [Sequelize](https://mongoosejs.com/) - a Node.js ORM tool for MySQL
*  [body-parser](https://www.npmjs.com/package/body-parser) - middleware
*  [method-override](https://www.npmjs.com/package/method-override) - middleware
*  [express-session](https://www.npmjs.com/package/express-session) - middleware
*  [passport-jwt](http://www.passportjs.org/) - authentication middleware for Node.js
*  [bcrypt.js](https://www.npmjs.com/package/bcryptjs) - middleware for hashing a password
*  [multer](https://www.npmjs.com/package/multer) - middleware for uploading files
*  [imgur](https://www.npmjs.com/package/imgur-node-api) - middleware for uploading images to imgur

