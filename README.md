# herbie

it's an html5 music player app

![Herbie UI in OS X](http://f.cl.ly/items/3Z3V1o112u1v3P0c1H1w/herbie-ui.png)

This repo holds the alluring node.js code for the UI layer.

## Installation Instructions for those who dare tread the dark path

1. Install node http://nodejs.org/

2. `npm install`

3. `cp settings.js-local settings.js`

## Other parts

The Herbie UI talks to
[rockit](https://github.com/kumar303/rockit), the server to work
with audio data. Check the docs on rockit to see how to set up API
authentication. When setting up a dev environment, you'll need
[rockitlib](https://github.com/kumar303/rockitlib) to
upload your MP3s.
