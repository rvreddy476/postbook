#!/bin/bash

export ASPNETCORE_ENVIRONMENT=Development
export ASPNETCORE_URLS="http://0.0.0.0:5001"

if [ -n "$DATABASE_URL" ]; then
  export ConnectionStrings__DefaultConnection="$DATABASE_URL"
fi

cd src/Services/Auth/PostBook.Auth.API
dotnet run
