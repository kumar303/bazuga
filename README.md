# Bazuga!

It's a super fun game of chance using real money!

## Install it

You need [redis](http://redis.io/) which you can install on Mac with:

    brew install redis

Clone this repo:

    git clone https://github.com/kumar303/bazuga.git

Install the dependencies:

    cd bazuga
    npm install

Make a local copy of the settings and fix them up:

    cp settings.js-local settings.js

Start the server:

    npm start

And/or run the tests:

    npm test

To install the Bazuga app, you can use something like
[app-loader](http://app-loader.appspot.com/) and point it at
your [local-manifest](http://localhost:3000/manifest.webapp).
