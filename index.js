//callingChain

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
class jStrip  extends EventEmitter {
  constructor() {
    super();
    this.o = [];
    this.o.dataRetrieved = false;
    this.o.contents = '';
  }

  chkData(f,d) {
    let k = `${f}(${d})`;
    if(typeof d == 'string') {
      k = `${f}("${d}")`;
    }
    this.o.push(k);
    return;
  }
  //***********************************************
  //***********************************************
  getData(data) {
 
    if(this.o.dataRetrieved == false) {
      this.chkData(this.getData,data);

      this.subscribe('event1', data => {
        console.log(`Your name is: ${data.name}`);
      });
      let t = setTimeout(() => {  //simulate http request async call
        this.emit('event1', {name: "ddddd"} );
        this.o.contents = 12;
        this.o.dataRetrieved = true;
        //emit data=received
        this.processQueue();
      },3000);
    }

    console.log('getData output ' + data);
    return this;
  }
  //***********************************************
  //***********************************************
  add(data)  {

    if(this.o.dataRetrieved == false) {
      this.chkData(this.add,data);
    } else {
      let output = (parseInt(this.o.contents) + parseInt(data));

      console.log('add output: ' + this.o.contents +' + '+data + ' = '+output);
      this.o.contents = parseInt(this.o.contents) + parseInt(data);
    }
    return this;
  }
  //***********************************************
  //***********************************************
  subtract(data)  {

    if(this.o.dataRetrieved == false) {
      this.chkData(this.subtract,data);
    } else {
      let output = (parseInt(this.o.contents) - parseInt(data));

      console.log('add output: ' + this.o.contents +' - '+data + ' = '+output);
      this.o.contents = parseInt(this.o.contents) - parseInt(data);
    }
    return this;
  }
  //***********************************************
  //***********************************************  
  show(a) {
    if(this.o.dataRetrieved == false) {
      this.chkData(this.show,a);
    } else {
      console.log(this.o.contents);
    }
    return this;
  }
  //***********************************************
  //***********************************************  
  processQueue() {
    let that = this;
    this.o.forEach(function(x, i) {
      let patt1 = /\((.*)\)$/;

      //console.log(x)

      if(patt1.test(x)) {
        let match1 = patt1.exec(x);     
    
        let match2 = /(.*)\(.*\)\s*\{/.exec(x);  //uses regex to find the function name, must be correct format!!
    
        let fn = (match2[(match2.length-1)]).trim();
        let arg = (match1[(match1.length-1)]).trim();

        //console.log(i + '. match1 = ' + fn);
        //console.log(i + '. match2 = ' + arg);
        
        if(fn == 'getData') {arg = that.o.contents;}

        that[fn](arg);
      }
    });
  }
}





let c = new jStrip();

c.getData('http://www.google.com').add(2).subtract(3).show().add(10).subtract(5).show();
c.show().add(1).show();


setInterval(()=>{console.log('non blocking');},1000);

let d = new jStrip();
d.getData('http://www.peace.com').add(1000).add(33).show().add(10).subtract(5).show();
d.show();
c.show().subtract(1).add(2).subtract(1);


