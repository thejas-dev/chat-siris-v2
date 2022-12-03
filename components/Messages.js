import {useRecoilState} from 'recoil'
import {useState,useEffect,useRef} from 'react'
import ImageKit from "imagekit"
import {currentUserState,groupSelectedState,revealMenuState,channelAdminState,channelAdminOnlyState,
	currentChannelState,messageState,recordingState,userMessageState,loaderState,loaderState2,
	loaderState3,loaderState4,loaderState5,loaderState6} from '../atoms/userAtom'
import robot from '../assets/robot.gif';
import {IoMdMenu} from 'react-icons/io'
import {CgCloseO} from 'react-icons/cg'
import {BsCardImage} from 'react-icons/bs';
import {MdPictureAsPdf} from 'react-icons/md';
import {BiVideoPlus,BiMicrophone,BiMicrophoneOff} from 'react-icons/bi';
import {FiMusic} from 'react-icons/fi';
import {RiSendPlaneFill} from 'react-icons/ri';
import {ImFileZip} from 'react-icons/im'
import {SiJson} from 'react-icons/si';
import {sendMessageRoutes,getMessageRoutes,deleteMessageRoute,host} from '../utils/ApiRoutes';
import {socket} from '../service/socket';
import axios from 'axios'
import {ImAttachment} from 'react-icons/im'
import MessageCard from './MessageCard'
import MicRecorder from 'mic-recorder-to-mp3';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Messages({session}) {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [groupSelected,setGroupSelected] = useRecoilState(groupSelectedState)
	const [revealMenu,setRevealMenu] = useRecoilState(revealMenuState)
	const [currentChannel,setCurrentChannel] = useRecoilState(currentChannelState)
	const scrollRef = useRef();
	const [userMessage,setUserMessage] = useRecoilState(userMessageState);
	const [messages,setMessages] = useRecoilState(messageState);
	const [channelAdmin,setChannelAdmin] = useRecoilState(channelAdminState);
	const [channelAdminOnly,setChannelAdminOnly] = useRecoilState(channelAdminOnlyState)
	const [revealMedia,setRevealMedia] = useState(false)
	const [loader1,setLoader1] = useRecoilState(loaderState);
	const [loader2,setLoader2] = useRecoilState(loaderState2);
	const [loader3,setLoader3] = useRecoilState(loaderState3);
	const [loader4,setLoader4] = useRecoilState(loaderState4);
	const [loader5,setLoader5] = useRecoilState(loaderState5);
	const [loader6,setLoader6] = useRecoilState(loaderState6);
	const [path6,setPath6] = useState('');
	const [path5,setPath5] = useState('');
	const [path4,setPath4] = useState('');
	const [path3,setPath3] = useState('');
	const [path2,setPath2] = useState('');
	const [path1,setPath1] = useState('');
	const [isRecording,setIsRecording] = useRecoilState(recordingState)
	const [url6,setUrl6] = useState('')
	const [url5,setUrl5] = useState('')
	const [url4,setUrl4] = useState('')
	const [url3,setUrl3] = useState('')
	const [url2,setUrl2] = useState('')
	const [url1,setUrl1] = useState('')
	const [pdfName,setPdfName] = useState('');
	const [zipName,setZipName] = useState('');
	const [fileName,setFileName] = useState('');
	const [uploading,setUploading] = useState(false);
	const [isBlocked,setIsBlocked] = useState(true);
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	const pathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	const audioPathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:audio')){
				return true;
			}
		}
	}

	const videoPathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:video')){
				return true;
			}
		}
	}

	const sendMessage = async() =>{
		if(userMessage.length > 1){
			let group = currentChannel.name;
			let byUserName = currentUser.username;
			let byUserImage = currentUser.avatarImage;
			const message = userMessage
			setUserMessage('');
			const {data} = await axios.post(sendMessageRoutes,{
				group,message,byUserName,byUserImage
			})
			setMessages(current => [...current,data?.data]);
			const dataRef = {
				group:group,
				data:data
			}
			socket.emit('add-msg',dataRef);
		}
	} 

	const sendImage = async(msg) => {
		let group = currentChannel.name;
		let byUserName = currentUser.username;
		let byUserImage = currentUser.avatarImage;
		const message = msg;
		const {data} = await axios.post(sendMessageRoutes,{
			group,message,byUserName,byUserImage
		})
		setMessages(current => [...current,data?.data]);
		setUrl2('')
		const dataRef = {
			group,
			data
		}
		socket.emit('add-msg',dataRef);
	}


	useEffect(()=>{
		if(currentUser){
			socket.emit('add-user',currentUser._id);
		}
	},[currentUser])

	useEffect(()=>{
			socket.on('msg-recieve',(data)=>{
				if(data.data.byUserName !== currentUser.username){
					setMessages(current => [...current,data?.data]);
				}
			});
			socket.on('fetchMessages',async(group)=>{
				const {data} = await axios.post(getMessageRoutes,{
					group
				});
				setMessages(data.data)
			})
			return ()=>{
				socket.off('msg-recieve');
				socket.off('fetchMessages');
			}
	},[])


	useEffect(()=>{
		if(currentChannel !== {}){
			getChat();
			if(currentChannel?.adminOnly){
				setChannelAdminOnly(true);
				if(currentChannel?.adminId !== currentUser._id){
					setUserMessage('');
					setRevealMedia(false);
				}
			}else{
				setChannelAdminOnly(false);
			}
		}
	},[currentChannel])


	const getChat = async() =>{
		let group = currentChannel.name;
		const {data} = await axios.post(getMessageRoutes,{
			group
		});
		// console.log(data)
		setMessages(data.data)
	};

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behaviour:"smooth"});
	},[messages]);


	const deleteMessage = async(id) => {
		const {data} = await axios.post(deleteMessageRoute,{
			id
		})
		let group = currentChannel?.name;
		const dataRef = {
			group:group,
		}
		socket.emit('refetchMessages',dataRef)
	}

	const url1Setter = () =>{
		
			const image_input = document.querySelector('#file1');
			const reader = new FileReader();

			reader.addEventListener('load',()=>{
				let uploaded_image = reader.result;
				setUrl2(uploaded_image)
				// console.log(uploaded_image)
			});
			if(image_input){
				reader.readAsDataURL(image_input.files[0]);
			}
		
	}

	const url2Setter = () =>{
		const image_input2 = document.querySelector('#file3');
		const reader  = new FileReader();
		reader.addEventListener('load',()=>{
			let uploaded_image2 = reader.result;
			setUrl1(uploaded_image2);
		})
		if(image_input2){
			reader.readAsDataURL(image_input2.files[0]);
		}
	}


	const url3Setter = () =>{
		// setTimeout(function() {setLoader3(false)}, 5000);
		const image_input3 = document.querySelector('#file2');
		const reader  = new FileReader();
		reader.addEventListener('load',()=>{
			let uploaded_image3 = reader.result;
			// console.log(uploaded_image3)
			setUrl3(uploaded_image3);
		})
		if(image_input3){ 
			if(image_input3.files[0].size<=16777216){
				if(image_input3.files[0].type.split('/').includes('mp4') || image_input3.files[0].type.split('/').includes('quicktime')){
					reader.readAsDataURL(image_input3.files[0]);
				}else{
					toast('Unsupported Format',toastOptions);
					toast('Currently .mp4 .mov formats are only supported',toastOptions);
				}
			}else{
				toast('File Size should be less than 16 mb',toastOptions);
			}
		}
	}

	
	const url4Setter = () =>{
		const image_input4 = document.querySelector('#file4');
		const reader  = new FileReader();
		reader.addEventListener('load',()=>{
			let uploaded_image4 = reader.result;
			setUrl4(uploaded_image4);
		})
		if(image_input4){
			if(image_input4.files[0].type === "application/pdf"){
				reader.readAsDataURL(image_input4.files[0]);
				setPdfName(image_input4.files[0].name)
			}else{
				// console.log(image_input4.files[0].name)
				toast('Format Mismatching! Transmission Failed');
			}
		}
	}		

	const url5Setter = () =>{
		const image_input5 = document.querySelector('#file5');
		const reader  = new FileReader();
		reader.addEventListener('load',()=>{
			let uploaded_image5 = reader.result;
			setUrl5(uploaded_image5);
		})
		if(image_input5){
			if(image_input5.files[0].type === "application/zip"){
				reader.readAsDataURL(image_input5.files[0]);
				setZipName(image_input5.files[0].name)
			}else{
				// console.log(image_input5.files[0].type)
				toast('Not an ZIP file');
			}
		}
	}


	const url6Setter = () => {
		const image_input6 = document.querySelector('#file6');
		const reader  = new FileReader();
		reader.addEventListener('load',()=>{
			let uploaded_image6 = reader.result;
			setUrl6(uploaded_image6);
		})
		if(image_input6){
			const type= image_input6.files[0].type;
			const name= image_input6.files[0].name;
			if(type === "application/x-javascript" || type === "application/json" || type === "text/css" || type === "text/html" || 
				type === "text/xml" || type === "text/plain" || type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
				type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
				type === "video/vnd.dlna.mpeg-tts" || type === "application/msword" || 
				type === "application/vnd.ms-powerpoint" || name.includes('.php')){
				reader.readAsDataURL(image_input6.files[0]);
				const ext = image_input6.files[0].name.split('.')
				const withExtension = name + "." + ext[ext.length - 1];
				setFileName(withExtension);
			}else{
				// console.log(image_input6.files[0])
				toast('Unsupported Format',toastOptions);
			}
		}
	}

	useEffect(()=>{
		if(url1){
			setLoader2(true)
			const uploadImage = (url1) =>{
				if(audioPathCheck(url1)){
					imagekit.upload({
				    file : url1, //required
				    folder:"Audios",
				    fileName : "thejashari",   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
					   	sendImage(response.url);
					   	setUploading(false)
					   	setUrl1('')
					    setLoader2(false)
					}).catch(error => {
					    console.log(error);
					});

				}else{
					toast("Please Select an Audio File",toastOptions)
					setUrl1('')
					setLoader2(false)
				}
			}
			uploadImage(url1);
		}
	},[url1])


	useEffect(()=>{
	if(url2){
		// 
			setLoader1(true);
			const uploadImage = (url2) =>{
				if(pathCheck(url2)){
					imagekit.upload({
				    file : url2, //required
				    fileName : "thejashari",   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
						setLoader1(false)
					    // uploadBackground(response.url)
					    setUrl2('');
					    sendImage(response.url);
					}).catch(error => {
					    console.log(error);
					});
				}else{
					toast("Not an Image Format",toastOptions)
					setUrl2('')
					setLoader1(false);
				}
			}
			uploadImage(url2);
		}
	},[url2])

	useEffect(()=>{
	if(url3){
			setLoader3(true);
			const uploadImage = (url3) =>{
				if(videoPathCheck(url3)){
					imagekit.upload({
				    file : url3,
				    folder:"Videos", //required
				    fileName : "thejashari",   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
					    sendImage(response.url);
					    setUrl3('')
					    setLoader3(false)
					}).catch(error => {
					    console.log(error);
					});
				}else{
					toast("Audio/Image Format Detected!",toastOptions)
					setUrl3('')
					setLoader3(false);
				}
			}
			uploadImage(url3);
		}
	},[url3])


	useEffect(()=>{
	if(url4){
			setLoader4(true);
			const uploadImage = (url4) =>{
					imagekit.upload({
				    file : url4,
				    folder:"Pdfs", //required
				    fileName : pdfName,   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
					    sendImage(response.url);
					    setUrl4('');
					    setPdfName('');
					    setLoader4(false)
					}).catch(error => {
					    console.log(error);
					});	
			}
			uploadImage(url4);
		}
	},[url4])

	useEffect(()=>{
	if(url5){
			setLoader5(true);
			const uploadImage = (url5) =>{
					imagekit.upload({
				    file : url5,
				    folder:"Zips", //required
				    fileName : zipName,   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
					    sendImage(response.url);
					    setUrl5('');
					    setZipName('');
					    setLoader5(false)
					}).catch(error => {
					    console.log(error);
					});	
			}
			uploadImage(url5);
		}
	},[url5])

	useEffect(()=>{
	if(url6){
			const uploadImage = (url6) =>{
					setLoader6(true);
					imagekit.upload({
				    file : url6,
				    folder: "Codes", //required
				    fileName : fileName,   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
					    sendImage(response.url);
					    setUrl6('');
					    setFileName('');
					    setLoader6(false)
					}).catch(error => {
					    console.log(error);
					});	
			}
			uploadImage(url6);
		}
	},[url6])


	const start = async() => {
		if(!channelAdminOnly || channelAdmin){
			if(!uploading){
			  	await navigator.mediaDevices.getUserMedia({ audio: true }).then(()=>{
			  		setIsBlocked(false)
			    	record();
			  	}).catch((err)=>{
			  		toast('Microphone Permission Denied',toastOptions);
			  		setIsBlocked(true);
			  	})			
			}
		}
  };


  const record = () =>{
      Mp3Recorder
        .start()
        .then(() => {
          setIsRecording(true)
        }).catch((e) => console.error(e));
  }
  	

     const stop = () => {
     	navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
     		let tracks = stream.getTracks()
     		tracks.map((track)=>{
     			track.stop();
     		})
     	}).catch((err)=>{
     		console.log(err)
     	})
     	Mp3Recorder
	      .stop()
	      .getMp3()
	      .then(([buffer, blob]) => {
	        blobToBase64(blob)
	        setIsRecording(false);
      	}).catch((e) => console.log(e));
  };


  	const blobToBase64 = (blobURL) =>{
		var reader = new FileReader();
		reader.onload = function() {
			let dataurl = reader.result;
			setUrl1(dataurl)
			setUploading(true)
		}
		reader.readAsDataURL(blobURL);
	}

  	

	function tConvert(i) {
  let split = i.split('T');
  const date = split[0];
  let time = split[1].split('.')[0]
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value


      time[2] = Number(time[2]) + 30;

      if(Number(time[2])>60){
        time[2] = Number(time[2]) -60
        if(time[2]<10){
          time[2] = 0+ time[2].toString()
        }
        time[0] = Number(time[0]) + 1
      }

      time[0] = Number(time[0]) + 5;
      time[5] = +time[0] < 12 || time[0] === 24 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      
      time.splice(3,1)
      
    }
    return time.join(''); // return adjusted time or original string
    }

	const toastOptions={
		position:"bottom-right",
		autoClose:5000,
		pauseOnHover:true,
		draggable:true,
		theme:"light",
	}

	return(
		<div className={`md:w-[78%] overflow-hidden ${revealMenu ? "w-[20%]  transform transition-width duration-500 ease-in-out" : "w-[100%] transform transition-width duration-500 ease-in-out" } h-screen relative bg-[#333333]`} >
			<header className="w-full flex p-[10px] shadow-md shadow-black/50 gap-4 z-50 items-center " >	
				{
					revealMenu ? 
					<CgCloseO
					onClick={()=>{setRevealMenu(!revealMenu)}}
					className="h-7 md:hidden font-bold w-7 text-red-500 animate-pulse cursor-pointer" />
					:
					<IoMdMenu 
					onClick={()=>{setRevealMenu(!revealMenu)}}
					className="h-7 md:hidden  w-7 text-white/80 cursor-pointer" />					
				}
				<img src={currentUser?.avatarImage} className={`h-11 md:ml-7 w-11 ${revealMenu ? "hidden" : ""} rounded-full`}/>
				<p className={`text-xl ${revealMenu ? "hidden" : ""} text-white font-semibold md:ml-1  truncate`}>{ groupSelected ? currentChannel?.name : currentUser?.username}</p>
			</header>

			{	
				groupSelected ? 
				<div className={`w-full md:h-[90%] h-[92%] relative`} >
				{currentUser?.backgroundImage && <img src={currentUser?.backgroundImage ? currentUser?.backgroundImage : "sir" } alt=" " className="h-full w-full absolute opacity-40 z-0"/>}
				<div className={`w-full h-full ${currentUser?.backgroundImage ? "bg-black z-40" : "" } `} > 
				<div className=" relative md:px-[70px] px-[10px] flex flex-col w-full h-full relative " >
					<div className="flex flex-grow flex-col md:py-10 py-3 md:gap-8 gap-7 overflow-x-hidden
					 scrollbar-none overflow-scroll">
						{
							messages?.map((msg)=>(
								<MessageCard msg={msg} scrollRef={scrollRef} key={msg._id} tConvert={tConvert} 
								deleteMessage={deleteMessage} channelAdmin={channelAdmin} />
							))
						}
					</div>
					<div className={`w-full p-5 gap-2 mb-5 rounded-xl ${currentUser.backgroundImage ? "bg-[#3C393F]/70" : "bg-[#3C393F]"} `}>
					<form className="flex items-center" onSubmit={(e)=>{e.preventDefault();sendMessage()}} >	
						<ImAttachment 
						onClick={()=>{
							if(!channelAdminOnly || channelAdmin){
								setRevealMedia(!revealMedia);
							}
						}}
						className="h-5 w-5 text-[#FFFFFF]/80 hover:scale-110 hover:text-sky-500 transform
						transition duration-300 ease-out cursor-pointer" />
						<input type="text"
						onChange={(e)=>{
							if(!isRecording){
								if(!channelAdminOnly || channelAdmin){
									setUserMessage(e.target.value);
								}
							}
						}}
						value={userMessage} 
						className="outline-none text-[#E0E0E0]/90 ml-[6px] md:ml-2 w-full bg-transparent"
						placeholder={!channelAdminOnly || channelAdmin ? "Type a message here":"Admin Only Chat"}
						/>
						{
							userMessage ? 
								<RiSendPlaneFill 
								onClick={sendMessage}
								className="h-6 w-6 text-[#FFFFFF] hover:scale-110 hover:text-sky-500 transform
								transition duration-300 ease-in-out cursor-pointer" />							
							:
							isBlocked ? 
								<BiMicrophoneOff 
								id="mic"
								onClick={start}
								className="h-6 p-1 w-6 bg-red-500 rounded-full text-[#FFFFFF] hover:scale-[110%] active:scale-[115%] transform
								transition duration-300 ease-in-out cursor-pointer" />
							:
								<BiMicrophone 
								id="mic"
								onClick={()=>{
									if(isRecording){
										stop();
									}else{
										start();
									}
								}}
								className={`h-6 p-1 w-6 bg-green-500 rounded-full text-[#FFFFFF] hover:scale-[110%] active:scale-[115%] transform
								${isRecording ? "animate-pulse bg-green-800 transition duration-300 ease-out" : ""} 
								${uploading ? "animate-pulse bg-red-800 transition duration-300 ease-out" : ""}
								transition duration-300 ease-in-out cursor-pointer`} />
						}
					</form>
					<div className={`p-5 ${revealMedia ? "bottom-24 transition-bottom duration-300 ease-in-out scale-100" : 
					"bottom-0 scale-0 transition-bottom duration-300 ease-in-out" } 
					absolute  border gap-4 flex flex-col
					bg-gray-800/90 border-gray-600 rounded-xl`} >
						<div className="flex md:gap-10 gap-8 items-center" >
						<input type="file" id="file1" hidden accept="image/*" value={path2} onChange={(e)=>{
							setPath2(e.target.value);url1Setter();
						}} />
						<label htmlFor={`${loader1 ? "" : "file1"}`}>
							<BsCardImage className={`h-7 w-7 ${loader1 ? "text-red-500 animate-pulse" : "text-sky-500"}  hover:scale-[1.2]  transition-scale duration-500 
							ease-out cursor-pointer`} />
						</label>
						<input type="file" id="file2" hidden accept=".mp4,.mov" value={path3} onChange={(e)=>{
							setPath3(e.target.value);url3Setter();
						}} />
						<label htmlFor={`${loader3 ? "" : "file2"}`}>
							<BiVideoPlus className={`h-7 w-7 ${loader3 ? "text-red-500 animate-pulse" : "text-green-500"}  hover:scale-[1.2]  transition-scale duration-500 
							ease-out cursor-pointer`} />
						</label>
						<input type="file" id="file3" hidden accept="audio/*" value={path1}
						onChange={(e)=>{
							setPath1(e.target.value);url2Setter();
					
						}} />
						<label htmlFor={`${loader2 ? "" : "file3"}`} id="label_input">
							<FiMusic className={`h-7 w-7 ${loader2 ? "text-red-500 animate-pulse" : "text-orange-500"}  hover:scale-[1.2]  transition-scale duration-500 
							ease-out cursor-pointer`} />
						</label>
						</div>
						<div className="flex md:gap-10 gap-8 items-center">
							<input type="file" id="file4" hidden accept=".pdf" value={path4}
							onChange={(e)=>{
								setPath4(e.target.value);url4Setter();
							}} />
							<label htmlFor={`${loader4 ? "" : "file4"}`} id="label_input">
								<MdPictureAsPdf className={`h-7 w-7 ${loader4 ? "text-red-500 animate-pulse" : "text-yellow-500"}  hover:scale-[1.2]  transition-scale duration-500 
								ease-out cursor-pointer`} />
							</label>
							<input type="file" id="file5" hidden accept=".zip" value={path5}
							onChange={(e)=>{
								setPath5(e.target.value);url5Setter();
							}} />
							<label htmlFor={`${loader5 ? "" : "file5"}`} id="label_input">
								<ImFileZip className={`h-7 w-7 ${loader5 ? "text-red-500 animate-pulse" : "text-amber-200"}  hover:scale-[1.2]  transition-scale duration-500 
								ease-out cursor-pointer`} />
							</label>
							<input type="file" id="file6" hidden accept=".js,.json,.ts,.css,.txt,.php,.doc,.docx,.ppt,.pptx,.html,.xml" 
							value={path6}
							onChange={(e)=>{
								setPath6(e.target.value);url6Setter();
							}} />
							<label htmlFor={`${loader6 ? "" : "file6"}`} id="label_input">
								<SiJson className={`h-7 w-7 ${loader6 ? "text-red-500 animate-pulse" : "text-gray-300"}  hover:scale-[1.2]  transition-scale duration-500 
								ease-out cursor-pointer`} />
							</label>
						</div>
					</div>
					</div>
				</div>
				</div>
				</div>
				:

				<div className="flex relative justify-center flex-col items-center " > 
					<img src={robot.src} alt="" />
					<h1 className={`text-2xl m-2 ${revealMenu ? "text-xs" : ""} text-center flex-wrap font-semibold text-white`}>Welcome <span className="
					text-rose-500" >{currentUser?.username}</span> Join Any Channel to Start Texting</h1>
				</div>


			}
		</div>

	)
}



// const url2Setter = () =>{
		
	// 		const image_input = document.querySelector('#file2');
	// 		const reader = new FileReader();

	// 		reader.addEventListener('load',()=>{
	// 			let uploaded_image = reader.result;
	// 			setUrl1(uploaded_image)
	// 			console.log(uploaded_image)
	// 		});
	// 		if(image_input){
	// 			reader.readAsDataURL(image_input.files[0]);
	// 		}
	// }
	// useEffect(()=>{
	// 	const image_input = document.querySelector('#file3');
	// 	if(image_input){
	// 		image_input.addEventListener('change',()=>{
	// 			const reader = new FileReader();
				
	// 			reader.addEventListener('load',()=>{
	// 				let uploaded_image = reader.result;
	// 				setUrl1(uploaded_image)
	// 				console.log(uploaded_image)
	// 			});
	// 			reader.readAsDataURL(image_input.files[0]);
	// 		})			
	// 	}
	// },[path1])


	//
	//
	//video/vnd.dlna.mpeg-tts
	//
	//

	// useEffect(()=>{
  	// 	if(loader1){
  	// 		let ele = document.getElementById('file1').readOnly = true;
  	// 	}else{
  	// 		let ele = document.getElementById('file1').readOnly = false;
  	// 	}	
  	// 	if(loader2){
  	// 		let ele = document.getElementById('file3').readOnly = true;
  	// 	}else{
  	// 		let ele = document.getElementById('file3').readOnly = false;
  	// 	}
  	// 	if(loader3){
  	// 		let ele = document.getElementById('file2').readOnly = true;
  	// 	}else{
  	// 		let ele = document.getElementById('file2').readOnly = false;
  	// 	}

  	// },[loader1,loader2,loader3])

	// useEffect(()=>{
	// 	setLoader2(!loader2);
	// },[url1])

	// useEffect(()=>{
	// 	setLoader1(!loader1);
	// },[url2])

	// useEffect(()=>{
	// 	setLoader3(!loader3);
	// },[url3])