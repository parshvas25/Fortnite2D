rm -rf node_modules
npm install

psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f backend/db/schema.sql