//chainingAsyncQeue
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
const $ = require("jquery")
const prettyHtml = require('pretty');
const request = require("request");


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

  on(eventName, fn) {
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

    this.o = []; //new Map(); //
    this.o.dataRetrieved = false;
    this.o.contents = '';
    this.o.timeout = 10000;

  }

  addToQueue(f, d) {
    this.o.push([ [f], [d] ]);
    return;
  }
  //***********************************************
  //***********************************************
  getData(data) {

    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.getData, data);

      this.on('dataReceived', d => { //on 
        //console.log(`published data: ${d.data}`);
        this.o.contents = d.data;
        this.o.dataRetrieved = true;
        this.processQueue();
      });

      var options = {
        url: data,
        timeout: this.o.timeout
      }

      let urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");


      if (urlRegex.test(data)) {
        //success

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

          this.emit('dataReceived', {
            data: htmld
          });

       
        }, 3000);

      } else {

        this.emit('dataReceived', {
          data: data
        });
      }

    }

    //console.log('getData output ' + data);
    return this;
  }
  //***********************************************
  //***********************************************
  selector(j) {

    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.selector, j);
    } else {

      // console.log("select(" + selector + ")");
      const dom = (new JSDOM(this.o.contents));


      if (typeof dom.window != "object") throw ("problem with dom")

      // console.log(this.o.contents);

      const $ = require('jquery')(dom.window);
      this.o.contents = $(j).html();
    }
    return this;
  }
  //***********************************************
  //***********************************************
  add(data) {

    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.add, data);
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
      this.addToQueue(this.subtract, data);
    } else {
      let output = (parseInt(this.o.contents) - parseInt(data));

      console.log('subtract output: ' + this.o.contents + ' - ' + data + ' = ' + output);
      this.o.contents = parseInt(this.o.contents) - parseInt(data);
    }
    return this;
  }
  //***********************************************
  //***********************************************  
  show(a) {

    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.show, a);
    } else {
      console.log("show: " + this.o.contents);
    }
    return this;

  }
  //***********************************************
  //***********************************************  
  marker(a) {

    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.marker, a);
    } else {
      //console.log("marker: " + a);
      this.emit(a, {
        data: this.o.contents
      });


    }
    return this;

  }
  //***********************************************
  //*********************************************** 
  replace(reg, wth) {
    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.replace, areg, wth);
    } else {
      //console.log("marker: " + a);
      this.o.contents = (this.o.contents).replace(reg, wth);
    }
    return this;
  }
  //***********************************************
  //***********************************************  
  pretty(bol) {
    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.pretty, bol);
    } else {
      //console.log("marker: " + a);
      if (bol === true) {
        this.o.contents = prettyHtml(this.o.contents);
      }
    }
    return this;
  };
  //***********************************************
  //***********************************************  
  processQueue() {
    let that = this;
    //console.log("size:" + this.o.length)
    for (let [f, a] of this.o) { //.entries()
      //this.o.forEach(function (x, i) {
      // console.log(x,i)
      //  console.log(f[0].toString())
      //  let patt1 = /Function\:.*(.+)/;
      //  let patt2 = /(.*)\(.*\)\s*\{/

      let arg = a;
      //  console.log(arg)
      if (f[0].toString() == 'getData') {
        arg = that.o.contents;
      }

      f[0].apply(that, arg);

    };
  }

  async jStrip_(uri, jquery) {
    try {
      const options = {
        url: uri,
        timeout: this.o.timeout
      };
      const body = await this.oldjStripGet(options);
      const data = await this.oldjStripJsdom(body[0], jquery);
      return {
        data,
        timed: body[1],
        uri,
        jquery,
        statuscode: body[2],
      };
    } catch (err) {
      throw err;
    }
  };

  async oldjStripGet(url) {
    return new Promise((resolve, reject) => {
      // console.log(`crawling ${url}`);
      const start = Date.now();
      request(url, (error, response, body) => {
        if (error) reject(error);
        resolve([body, (Date.now() - start), response && response.statusCode]);
      });
    });
  }
  async oldjStripJsdom(body, jquery) {
    const dom = await new JSDOM(body, {
      runScripts: 'outside-only'
    });
    const window = await dom.window.document.defaultView;
    const $ = await require('jquery')(window);
    const rnd = await Math.floor((Math.random() * 1000) + 1);
    await window.eval(`$('body').append('<jStrip id=\\'jStripSpecialTag${rnd}\\'>' + ${jquery}  + '</jStrip>');`);
    const rtn = await $(`jStrip#jStripSpecialTag${rnd}`).html();
    return rtn;
  }


}











//jStrip v.1 way (using Promise):
let x = new jStrip();

x.jStrip_('https://www.bing.com', "$('title').html()")
  .then((result) => {
    console.log(`promise result: ${result.data}
      time taken: ${result.timed}
      uri: ${result.uri}
      jquery: ${result.jquery}`);
  })
  .catch((e) => {
    console.log(`Error: ${e}`);
  });

console.log("some text, non blocked")

//jStrip v.2 way - chaining:

let c = new jStrip();

//c.getData('http://www.google.com').add(2).subtract(3).show().add(10).subtract(5).show();
//c.show().add(1).show();

c.getData('http://www.google.com').marker("marker1").selector("#kk").marker("marker2").selector("#choose").marker("marker3")
c.pretty(true).show()




c.on("marker1", (a) => {
  console.log("marker1: .on(data) = " + a.data);
})


c.on("marker2", (a) => {
  console.log("marker2: .on(data) = " + a.data);
})

c.on("marker3", (a) => {
  console.log("marker3: .on(data) = " + a.data);
})


setInterval(() => {
  console.log('non blocking');
}, 1000);

let d = new jStrip();

d.getData("hello     world"); //if not url, then data is used as the original contents.

d.show().replace(/hello/, "hi").show();
//c.show().subtract(1).add(2).subtract(1);
let e = new jStrip();
e.getData(55).add(5).subtract(30).show();