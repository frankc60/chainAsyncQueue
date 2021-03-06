//chainingAsyncQeue
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
//const $ = require("jquery")
const prettyHtml = require('pretty');
const request = require("request");

//*******************************************************************************************
//*******************************************************************************************
//*******************************************************************************************
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
  //***********************************************
  //***********************************************
  addToQueue(f, d) {
    this.o.push([
      [f],
      [d]
    ]);
    return;
  }
  //***********************************************
  //***********************************************
  getData(data) {

    if (this.o.dataRetrieved == false) {
     // this.addToQueue(this.getData, data);

      this.on('dataReceived', d => {
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
        request(options, (error, response, body) => {
          if (error) reject(error + response && response.statusCode);
          this.emit('dataReceived', {
            data: body
          });
        });
      } else { //not a url
        this.emit('dataReceived', {
          data: data
        });
      }
    }
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
  show(a) {
    if (this.o.dataRetrieved == false) {
      this.addToQueue(this.show, a);
    } else {
      console.log(this.o.contents);
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
  pretty(bol = true) {
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
    let remove;
    let r = this.o;
    for (let [fn, arg] of r) { //.entries()
//console.log(i + "-" + farg[0])
//console.log("****" + r.indexOf(1))
    //  let fn = farg[0].toString();
      fn[0].apply(that,arg)
      //.apply(that, farg[1]);
      //console.log(i)
      //remove = this.o.splice(x,1);
    };
  }
  //***********************************************
  //***********************************************  
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
  //***********************************************
  //***********************************************  
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
  //***********************************************
  //***********************************************  
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
  //***********************************************
  //***********************************************  


}




module.exports = jStrip;