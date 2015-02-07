# appdirect
AppDirect Demo App

Fetch content from Twitter API and display it in Widgets

Notes:
brew is a package manager available on OSX (http://brew.sh)

1/ Create an Application on Twitter (https://apps.twitter.com), get Access Tokens, add them to node/twitter.js file

2/ Setup the Node.js Proxy with NPM dependencies and run the script

```
brew install node
npm install cors express underscore twitter
node twitter.js
```

You should now see this output in the console:
```
Server started: http://0.0.0.0:8080
```

3/ Move the folder "demo" to your web server (Nginx, Apache) public folder and access the files from your browser ..

Here is a screenshot of the page: http://i59.tinypic.com/10qbd5h.jpg
