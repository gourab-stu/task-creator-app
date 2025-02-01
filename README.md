# A simple Task Creator and Manager app
This is a web application, using which you can
<ol>
  <li>create tasks</li>
  <li>view tasks</li>
  <li>edit tasks</li>
  <li>delete tasks</li>
</ol>
in the web browser

## Requirement softwares
<ol>
  <li>Node js runtime</li>
  <li>MongoDB database server</li>
</ol>

## Steps to run this app
### Step 1 : 
Clone this repository using Git by running the following line in cmd / terminal

```sh
git clone https://github.com/gourab-stu/task-creator-app.git
```

### Step 2 : 
Create a file named <b>production.env</b> and fill in the following variables
```ini
PORT=""
MONGODB_URI=""
MONGODB_DBNAME=""
```

### Step 3 : 
Open the cloned folder in cmd / terminal and install all dependencies by running the following command
```sh
npm install
```

### Step 4 :
Ensure the MongoDB database server is running and  create a Collection named `tasks`

### Step 5 :
Open the cloned folder in cmd / terminal and run the following command to start the application server
```bash
npm run start
```
#### NOTE: If the <b>PORT</b> variable is not given, application server will automatically run on PORT 2025

## Screenshots
Index page:
![image loading failed](https://res.cloudinary.com/dvkmi9cmw/image/upload/v1738417899/task-creator-app-db/sis5l6smm2zkgtiqpymj.png)
View page
![image loading failed](https://res.cloudinary.com/dvkmi9cmw/image/upload/v1738417999/task-creator-app-db/ipltwjmy47qmegpqb0ee.png)
Edit page
![image loading failed](https://res.cloudinary.com/dvkmi9cmw/image/upload/v1738418166/task-creator-app-db/ijkcwepbmtvbf0o7c4ne.png)