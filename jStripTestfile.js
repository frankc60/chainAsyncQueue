//sample
const jStrip = require("./index");



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

c.getData('https://www.timeanddate.com/worldclock/fullscreen.html?n=264').selector("div#rs1").marker("marker2").selector("#i_time").marker("marker3")
c.pretty(true).show();


c.on("marker1", (a) => {
  console.log("marker1: .on(data) = " + a.data);
})


c.on("marker2", (a) => {
  console.log("marker2: .on(data) = " + a.data);
})

c.on("marker3", (a) => {
  console.log("time in NZ:" + a.data);
})


setInterval(() => {
  console.log('non blocking');
}, 1000);


let d = new jStrip();

d.getData("hello     world"); //if not url, then data is used as the original contents.

d.show().replace(/hello/, "hi").show(); 
d.pretty(true).show();

d.getData("next one here").show()
