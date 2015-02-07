# appdirect
AppDirect Demo App

Fetch content from Twitter API and display it in Widgets

Notes:
brew is a package manager available on OSX (http://brew.sh)

1/ Setup the Node.js Proxy with NPM dependencies and run the script

```
brew install node
npm install cors express underscore twitter
node node/twitter.js
```

You should now see this output in the console:
```
Server started: http://0.0.0.0:8080
```

2/ Move the folder demo to your web server (Nginx, Apache) public folder and access the files from your browser ..
