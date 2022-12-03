import {useEffect} from 'react'

export default function check() {
	// body...
	 function move(event) {
           
            var X = event.touches[0].clientX;
           
            var Y = event.touches[0].clientY;
           
            document.getElementById(
              "test").innerHTML = X + ", " + Y;
        }

		useEffect(()=>{
			const para = document.getElementById('para');
			const delta2 = 50;
			para.addEventListener('touchmove',(event)=>{
				console.log(event)
	            var X = event.touches[0].clientX;
	           
	           
	            document.getElementById(
	              "test").innerHTML = X ;
			})

			para.addEventListener('touchstart',(event)=>{
				console.log(event)
				var X = event.touches[0].clientX;
				document.getElementById('test2').innerHTML = X
			})
		},[])

return(
<div className="flex flex-col items-center justify-center" >
<head>
    <title>touchmove Event in HTML</title>
 </head>
 
<body id="para" >
 
    <h1 className = "text-green-500" >GeeksforGeeks</h1>
    <h2 className="font-bold" >touchmove Event</h2>
    <br/>
 
    <p>
      Touch somewhere in the paragraph and then
      move the finger to trigger a function that
      will display the x and y coordinates of the touch.
  </p>
 
 
    <br/>
 
    <p id="test" className="text-md text-black" ></p>
    <p id="test2" className="text-md text-black mt-5" ></p>
 
 
 
</body>
</div>
 
	)
}