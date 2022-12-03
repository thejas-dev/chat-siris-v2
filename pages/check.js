import {useEffect,useState} from 'react'

export default function check() {
	// body...
	const [reveal,setReveal] = useState(false)

	 function move(event) {
           
            var X = event.touches[0].clientX;
           
            var Y = event.touches[0].clientY;
           
            document.getElementById(
              "test").innerHTML = X + ", " + Y;
        }

		useEffect(()=>{
			const para = document.getElementById('para');
			const delta2 = 120;
			let touchst ;
			para.addEventListener('touchmove',(event)=>{
				console.log(event)
	            var X = event.touches[0].clientX;
				if(touchst-X >100){
					setReveal(true);
				}
	           
	            document.getElementById(
	              "test").innerHTML = X ;
			})

			para.addEventListener('touchstart',(event)=>{
				console.log(event)
				touchst = event.touches[0].clientX;
				setReveal(false);
				document.getElementById('test2').innerHTML = touchst;
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
    {
		reveal && <h1 className="text-black text-md mx-auto">Hello</h1>
	}
 
 
</body>
</div>
 
	)
}