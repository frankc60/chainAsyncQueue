//chainingAsyncQeue
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
//const prettyHtml = require('pretty');
//const request = require("request");


class EventEmitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.forEach(fn => {
        fn.call(null, data);
      });
    }
  }

  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);
    return () => {
      this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
    }
  }
}
//*******************************************************************************************
//*******************************************************************************************
//*******************************************************************************************
class jStrip extends EventEmitter {
  constructor() {
    super();
    this.o = [];
    this.o.dataRetrieved = false;
    this.o.contents = '';
    this.o.timeout = 10000;
  }

  chkData(f, d) {
    let k = `${f}(${d})`;
    if (typeof d == 'string') {
      k = `${f}("${d}")`;
    }
    this.o.push(k);
    return;
  }
  //***********************************************
  //***********************************************
  getData(data) {


    if (this.o.dataRetrieved == false) {
      this.chkData(this.getData, data);

      this.subscribe('event1', d => {   //subscribe 
        console.log(`published data: ${d.data}`);
        this.o.contents = d.data;
        this.o.dataRetrieved = true;
        this.processQueue();
      });

      var options = {
        url: data,
        timeout: this.o.timeout
      }

       /* request(url, function (error, response, body) {
      if (error) throw (error + response);
      this.emit('event1', {
        name: htmld
      });
      this.o.contents = body;
     
      //emit data=received
      
    });*/

      let t = setTimeout(() => { //simulate http request async call
        let htmld = `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Title</title>
          <link rel="stylesheet" href="css/style.css?v=1.0">
        </head>
        <body>
        
        <h1>Welcome to My Homepage</h1>
        <p class="intro">My name is Mickey.</p>
        <p>I live in Duckburg.</p>
        <p>My best friend is Mini.</p>
        
        <div id="kk">
        Who is your favourite: hello there
        <ul id="choose">
            <li>Goofy</li>
        <li>Mickey</li>
          <li>Pluto</li>
            <li>Mini</li>
          
        </ul>
        </div>
          <script type="text/javascript" src="js/script.js"></script>
        </body>
        </html>`;

        this.emit('event1', {
          data: 12
        });
        
        //this.o.dataRetrieved = true;
        //emit data=received
       // this.processQueue();
      }, 3000);
    }

    console.log('getData output ' + data);
    return this;
  }
  //***********************************************
  //***********************************************
  select(selector) {


    if (this.o.dataRetrieved == false) {
      this.chkData(this.select, selector);
    } else {
      const dom = (new JSDOM(this.o.contents));


      if (typeof dom.window != "object") throw ("problem with dom")
  
      console.log(this.o.contents);

      const $ = require('jquery')(dom.window);
      this.o.contents = $(selector).html();
    }
    return this;
  }
  //***********************************************
  //***********************************************
  add(data) {

    if (this.o.dataRetrieved == false) {
      this.chkData(this.add, data);
    } else {
      let output = (parseInt(this.o.contents) + parseInt(data));

      console.log('add output: ' + this.o.contents + ' + ' + data + ' = ' + output);
      this.o.contents = parseInt(this.o.contents) + parseInt(data);
    }
    return this;
  }
  //***********************************************
  //***********************************************
  subtract(data) {

    if (this.o.dataRetrieved == false) {
      this.chkData(this.subtract, data);
    } else {
      let output = (parseInt(this.o.contents) - parseInt(data));

      console.log('add output: ' + this.o.contents + ' - ' + data + ' = ' + output);
      this.o.contents = parseInt(this.o.contents) - parseInt(data);
    }
    return this;
  }
  //***********************************************
  //***********************************************  
  show(a) {
    if (this.o.dataRetrieved == false) {
      this.chkData(this.show, a);
    } else {
      console.log(this.o.contents);
    }
    return this;
  }
  //***********************************************
  //***********************************************  
  processQueue() {
    let that = this;
    this.o.forEach(function (x, i) {
      let patt1 = /\((.*)\)$/;
      let patt2 = /(.*)\(.*\)\s*\{/
      //console.log(x)

      if (patt1.test(x) && patt2.test(x)) { //just check it is working first

        let match1 = patt1.exec(x);
        let match2 = patt2.exec(x); //uses regex to find the function name, must be correct format!!

        let fn = (match2[(match2.length - 1)]).trim();
        let arg = (match1[(match1.length - 1)]).trim();

        //console.log(i + '. match1 = ' + fn);
        //console.log(i + '. match2 = ' + arg);

        if (fn == 'getData') {
          arg = that.o.contents;
        }

        that[fn](arg);
      }
    });
  }
}





let c = new jStrip();

c.getData('http://www.google.com').add(2).subtract(3).show().add(10).subtract(5).show();
c.show().add(1).show();


setInterval(() => {
  console.log('non blocking');
}, 1000);

let d = new jStrip();
//d.getData('http://www.peace.com').select("*").add(1000).add(33).show().add(10).subtract(5).show();
d.show();
c.show().subtract(1).add(2).subtract(1);