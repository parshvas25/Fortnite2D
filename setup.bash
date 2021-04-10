'''
    PLEASE NOTE: In /src/controller/controller.js, please change the IP address of the global variable called url and our socket variable inside initsocket()
    to your respective VM-IP.
'''

rm -rf node_modules
npm install

psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f backend/db/schema.sql