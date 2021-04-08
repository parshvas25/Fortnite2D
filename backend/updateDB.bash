#!/bin/bash

psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f db/schema.sql