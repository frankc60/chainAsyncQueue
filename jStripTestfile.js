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

console.log("some random text, non blocked");

//jStrip v.2 way - chaining0:

let c = new jStrip();

c.getData('https://www.timeanddate.com/worldclock/fullscreen.html?n=264').selector("div#rs1").marker("marker2").selector("#i_time").marker("marker3")
c.pretty(true).show();


c.on("marker2", (a) => {
  console.log("marker2a: .on(data) = " + a.data);
})


c.on("marker2", (a) => {
  console.log("marker2b: .on(data) = " + a.data);
})

c.on("marker3", (a) => {
  console.log("time in NZ:" + a.data);
})


setInterval(() => {
  console.log('non blocking');
}, 1000);


let htmlSample = `
<html>
  <head>
    <title>Enter a title, displayed at the top of the window.</title>
  </head>
  <body>
    <h1>Enter the main heading, usually the same as the title.</h1>
    <p>Be <b>bold</b> in stating your key points. Put them in a list: </p>
  
    <ul>
      <li>The first item in your list</li>
      <li>The second item; <i>italicize</i> key words</li>
    </ul>
  
    <p>Improve your image by including an image. </p>
    <p><img src="http://www.mygifs.com/CoverImage.gif" alt="A Great HTML Resource"></p>
    <p>Add a link to your favorite <a href="http://www.dummies.com/">Web site</a>.
    Break up your page with a horizontal rule or two. </p>
    <hr>
    <p>Finally, link to <a href="page2.html">another page</a> in your own Web site.</p>
    <p>&#169; Wiley Publishing, 2011</p>
  </body>
</html>
`;

let d = new jStrip();

d.getData("hello     world"); //if not url, then data is used as the original contents.

d.show().replace(/hello/, "hi").show(); 
d.pretty(true).show();

d.getData("next one here").show()  //ignoreed, as getData already executed.

let e = new jStrip();
e.getData(htmlSample).selector("li").show();

let f = new jStrip();

// if using a marker for instint data, need to put the on() before getting the data and marking! 
f.on("mark99", (a) => {
  console.log("need to define before setting the marker, otherwise may have already been called**limm: " + a.data);
});

f.getData(htmlSample).selector("li").marker("mark99").show();



