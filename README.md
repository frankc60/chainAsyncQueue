# chainAsyncQueue

Pass a webpage or text to jStrip. Then use jStrip's many meatures to manipulate the data. jStrip lets you create your own segmented event-handlers that fire once the data is ready, for you to use.

NOTE - jStrip has changed slightly since version 1. Please read the Migration section to keep your old code working with the current version.

## Installing

Start with installing **jStrip** from npm.

```js
> npm i -S jstrip
```

Include **jStrip** into your code.

```js
const jStrip = require('jstrip');
```

Start by creating a new instance of jStrip.
```js
let jStrip1 = new jStrip();
jStrip1.getData("http://www.google.com").selector('title').show();
```

Once the URL has been received and the jQuery executed, the **show()** method will display the output:

```
> Google
```

#Chainable Methods
The following is a growing list of chainable methods that can be used with your jStrip.


###Declaration

Start by declaring jStrip and calling it's constructor.

```
const jStrip = require("jStrip");  //at top of file
...
let jStrip1 = new jStrip(); //declare an instance of jStrip
```

###getData()

This is the initial required method, and is required for all runs (please see Migration Section for older versions)

```js
jStrip1.getData('https://www.timeanddate.com/worldclock/fullscreen.html?n=264')
```

###selector()

Use a jQuery selector to select a section of the html.

```js
.select("div#cake")  //select html from div with an id equal to 'cake'
```

