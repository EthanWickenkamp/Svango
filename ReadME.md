# database info 
well it just works for now
django handles database migrations based on models

### Volumes
mysql_vol docker volume mounted to mysql /var/lib/mysql where container's peristant files are stored

Not being used but creates a users table if it doesen't exist (it does)
./db/db-init-scripts:/docker-entrypoint-initdb.d
Can drop .sql scripts in this folder, container will initialize with them from mount


# Backend Django

## Structure
/backend
    -/api
    -/mysite

mysite is the project, utilizing urls.py and settings.py

api is an app in the project, utilizing models -> serializers -> views -> urls
going from database object to an api endpoint

### Models
create an object that will be created in the database, 
define variables and functions for the object

### Serializers
tell the api how to represent the model in json format

### Views
specify a page for the api, use the serializer or other get post operations for the view

### URLs
specify the routes for the backend to take to each view
preceded by /api from the mysite project urls.py


# Frontend Svelte

## Structure

### config
vite.config.ts   tsconfig.json   svelte.config.js

package.json   package-lock.json   node_modules


### static
save static files that are used such as icons or images

### src
lib   routes   app.d.ts   app.html

Routes is the important one, each folder represents the url path

create a +page.svelte and a +page.ts in the folder for the svelte html, css, js combo work

