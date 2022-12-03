

export default function check() {
	// body...
	 function move(event) {
           
            var X = event.touches[0].clientX;
           
            var Y = event.touches[0].clientY;
           
            document.getElementById(
              "test").innerHTML = X + ", " + Y;
        }


return(
<div>
<head>
    <title>touchmove Event in HTML</title>
 </head>
 
<body>
 
    <h1 className = "text-green-500" >GeeksforGeeks</h1>
    <h2 className="font-bold" >touchmove Event</h2>
    <br/>
 
    <p ontouchmove={(event)=>move(event)}>
      Touch somewhere in the paragraph and then
      move the finger to trigger a function that
      will display the x and y coordinates of the touch.
  </p>
 
 
    <br/>
 
    <p id="test"></p>
 
 
 
</body>
</div>
 
	)
}