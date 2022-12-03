import {useState,useEffect} from 'react'
import {BiSearchAlt2} from 'react-icons/bi';
import axios from 'axios'
import {useRecoilState} from 'recoil'
import {currentUserState,revealMenuState,allChannelsState,searchChannelsState,channelAdminState,recordingState,
	passTabOpenState,currentChannelState,groupSelectedState,userMessageState,loaderState,loaderState2,
	loaderState3,loaderState4,loaderState5,loaderState6} from '../atoms/userAtom'
import {CgChevronUp,CgChevronDown} from 'react-icons/cg'
import {BsChevronLeft} from 'react-icons/bs'
import {
	UserCircleIcon
} from '@heroicons/react/24/solid';
import {AiOutlinePicture,AiOutlineLogout} from 'react-icons/ai'
import Divider from '@mui/material/Divider';
import {getAllChannelsRoutes,fetchUserRoom,addChannelToUser,addUserToChannel,
	findChannelRoute,changeAdminOnlyRoute} from '../utils/ApiRoutes';
import ChannelCard from './ChannelCard';
import {signOut} from 'next-auth/react';
import {socket} from '../service/socket';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


export default function Channels({session,handleClose,handleToggle,handleToggle2,handleClose2,handleToggle3,handleClose3}) {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [searchText,setSearchText] = useState('');
	const [revealState,setRevealState] = useState(false);
	const [confirmed,setConfirmed] = useState(false);
	const [revealMenu,setRevealMenu] = useRecoilState(revealMenuState)
	const [allChannels,setAllChannels] = useRecoilState(allChannelsState)
	const [currentChannel,setCurrentChannel] = useRecoilState(currentChannelState);
	const [groupSelected,setGroupSelected] = useRecoilState(groupSelectedState);
	const [searchChannels,setSearchChannels] = useRecoilState(searchChannelsState);
	const [channelAdmin,setChannelAdmin] = useRecoilState(channelAdminState);
	const [passTabOpen,setPassTabOpen] = useRecoilState(passTabOpenState);
	const [isRecording,setIsRecording] = useRecoilState(recordingState)
	const [message,setMessage] = useState(userMessageState);
	const [loader1,setLoader1] = useRecoilState(loaderState);
	const [loader2,setLoader2] = useRecoilState(loaderState2);
	const [loader3,setLoader3] = useRecoilState(loaderState3);
	const [loader4,setLoader4] = useRecoilState(loaderState4);
	const [loader5,setLoader5] = useRecoilState(loaderState5);
	const [loader6,setLoader6] = useRecoilState(loaderState6);
	 
	useEffect(()=>{
		fetch();		
		if(socket){
			socket.on('fetch',()=>{
				fetch();
			})
			socket.on('channelUpdate',(channelRef)=>{
				setCurrentChannel(channelRef);
			})
			socket.on('channelDetailsUpdate',(data)=>{
				setCurrentChannel(data);
			})
		}
	},[])

	const fetch = async() =>{
		const {data} = await axios.get(getAllChannelsRoutes)
		setAllChannels(data.data)
	} 

	useEffect(()=>{
		if(currentUser?.inChannel){
			fetchRoom(currentUser.inChannel)
		}
		const channelSide = document.getElementById('channels')
		const delta = 100;
		let startX;
		let touchst;
		channelSide.addEventListener('mousedown', function (event) {
		  startX = event.pageX;
		});

		channelSide.addEventListener('mouseup', function (event) {
		  const diffX = event.pageX - startX

		  if (diffX < delta) {
		  	setRevealMenu(false);
		  	startX = null;
		  }else{
		  	startX = null;
		  }
		});


		channelSide.addEventListener('touchstart',(event)=>{
			touchst = event.touches[0].clientX;
			document.getElementById('test2').innerHTML = touchst;
		})
		
		channelSide.addEventListener('touchmove',(event)=>{
            var X = event.touches[0].clientX;
			if(touchst-X >100){
				setRevealMenu(false);
			}
		})


	},[])

	const fetchRoom = async(name) => {
		const {data} = await axios.post(fetchUserRoom,{
			name
		})
		// console.log(data)
		if(data?.status === true){
			setGroupSelected(true);
			setCurrentChannel(data?.data);
			const channelRef = data?.data;
			socket.emit('addUserToChannel',channelRef);
			if(data?.data?.adminId === currentUser?._id){
				setChannelAdmin(true);
			}
			// console.log(data)
		}
		// console.log(data)
	}

	useEffect(()=>{setPassTabOpen(false)},[searchText])

	const handleReveal = () =>{
		setRevealState(!revealState)
		setConfirmed(false);
	}

	const removeUserFromChannel = async() => {
			if(!loader1 && !loader2 && !loader3 && !loader4 && !loader5 && !loader6 && !isRecording){
				setMessage('');
				const name = currentChannel.name;
				const data0 = await axios.post(fetchUserRoom,{
					name
				})
				const oldUsers = data0.data.data.users
				let users = []
				oldUsers.map((oldUser)=>{
					if(oldUser._id !== currentUser._id){
						users.push(oldUser);
					}
				})
				// console.log(users)
				const inChannel = "";
				const data1 = await axios.post(`${addUserToChannel}/${currentChannel._id}`,{
					users
				})		
				// console.log(data1);
				const channelRef = data1.data.obj;
				socket.emit('RemoveUserFromChannel',channelRef);
				const {data} = await axios.post(`${addChannelToUser}/${currentUser._id}`,{
					inChannel
				})
				// console.log(data.obj);
				setCurrentUser(data.obj);
				setCurrentChannel('');
				fetch();
				setChannelAdmin(false);
				setGroupSelected(false);				
			}else{
				toast('Please Wait',toastOptions)
			}
	}

	const signOutConfirm = () =>{
		if(confirmed){
			localStorage.removeItem('chat-siris-2');
			localStorage.removeItem('chat-siris-session-2');
			signOut();
		}else{
			setConfirmed(true);
		}
	}

	useEffect(()=>{
		const fetch = async()=>{
			const name = searchText
			const {data} = await axios.post(findChannelRoute,{
				name
			})
			if(data.data.length > 0){
				setSearchChannels(data.data);
			}else{
				setSearchChannels("");
			}	
		};
		fetch();
	},[searchText])


	const toastOptions={
		position:"bottom-right",
		autoClose:5000,
		pauseOnHover:true,
		draggable:true,
		theme:"light",
	}

	const handleAdminOnlyChange = async(e) => {
		const adminOnly = e.target.checked;
		const {data} = await axios.post(`${changeAdminOnlyRoute}/${currentChannel._id}`,{
			adminOnly
		})
		// console.log(data);
		setCurrentChannel(data.obj);
		socket.emit('channelUpdate',data.obj);
	}


	const Android12Switch = styled(Switch)(({ theme }) => ({
	  padding: 8,
	  '& .MuiSwitch-track': {
	    borderRadius: 22 / 2,
	    '&:before, &:after': {
	      content: '""',
	      position: 'absolute',
	      top: '50%',
	      transform: 'translateY(-50%)',
	      width: 16,
	      height: 16,
	    },
	    '&:before': {
	      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
	        theme.palette.getContrastText(theme.palette.primary.main),
	      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
	      left: 12,
	    },
	    '&:after': {
	      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
	        theme.palette.getContrastText(theme.palette.primary.main),
	      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
	      right: 12,
	    },
	  },
	  '& .MuiSwitch-thumb': {
	    boxShadow: 'none',
	    width: 16,
	    height: 16,
	    margin: 2,
	  },
	}));

	return(

		<div 
		id="channels"
		className={`overflow-hidden md:w-[22%] w-0 ${revealMenu ? "w-[80%]  transform transition-width duration-500 ease-in-out" : "w-[0%] transform transition-width duration-500 ease-in-out" } h-screen relative bg-[#120F13] relative`}>
			<header className="w-full flex  p-4 shadow-md shadow-black/50 justify-between items-center" >	
				{
					currentChannel ? 
					<div className="flex md:gap-5 gap-3 w-full" >	
						<BsChevronLeft 
						onClick={removeUserFromChannel}
						className="h-8 w-8 text-gray-800/70  hover:bg-gray-800/40 rounded-lg 
						transition duration-300 ease-out p-[3px]" />
						<p className="font-semibold text-white text-xl">All Channels</p>
					</div>
					:
					<>
						<p className="font-semibold text-white text-xl">Channels</p>
						<button 
						onClick={handleToggle}
						className="font-bold text-white text-xl bg-gray-800 rounded-xl pb-1 px-2 
						hover:scale-110 transition duration-300 ease-in-out flex text-center items-center" ><p>+</p></button>
					</>
				}

			</header>
			<main className="w-full p-5" >
				{
					currentChannel ?
						<div className="w-full p-3 flex flex-col gap-5 rounded-lg" >
							<h1 className="text-xl font-semibold text-white truncate" >{currentChannel.name} </h1>
							{
								currentChannel.adminId === currentUser._id &&
								<div>
									<div className="flex items-center" >
										<FormControlLabel
									        control={<Android12Switch defaultChecked />}
									        checked={currentChannel.adminOnly}
									        onChange={handleAdminOnlyChange}
									    />
									    <p className="text-md font-semibold text-white">Admin Only Chat</p>
								    </div>
								    {
								    	currentChannel.password ? 
								    	<h1 className="text-gray-500 text-md mt-2">Password :- {currentChannel.password}</h1>
								    	:
								    	""
								    }
								</div>
							}
							<div className="flex gap-2 w-full" >
								<h1 className="text-md text-gray-400/70 truncate">Created By :-</h1>
								<p className="text-gray-400 text-lg truncate" >{currentChannel?.admin}</p>
							</div>
							<p className="text-gray-200 text-md">{currentChannel.description}</p>
							<h1 className="mt-5 text-xl font-semibold text-white truncate">Members</h1>
							<div className="gap-3 h-screen flex-col flex mt-1 pb-[200px] scrollbar-none overflow-scroll" >
								{
									currentChannel?.users?.map((user)=>(
										<div 
										key={user._id}
										className="flex gap-4 items-center w-full cursor-pointer hover:bg-gray-900/70 transition
										border-b border-gray-800/70 duration-300 ease-out p-2 rounded-xl" >
											<img src={user.avatarImage} className="h-11 w-11 rounded-lg"/>
											{
												currentChannel.adminId === user._id ?
												<div className="flex flex-col gap-[3px]" >
													<p className="text-gray-700 text-lg font-semibold truncate">{user.username}</p>
													<p className="text-gray-800 text-sm font-semibold truncate">🟢 Admin</p>
												</div>
												:
												<p className="text-gray-700 text-lg font-semibold truncate">{user.username}</p>

											}
										</div>
									))
								}
							</div>

						</div>
					:
					<>
						<div className="w-full p-3 flex bg-gray-600/50 rounded-lg" >
							<BiSearchAlt2 className="h-7 w-7 text-white text-gray-300" />
							<input type="text" className="outline-none ml-2 w-full text-gray-400 bg-transparent "
							value={searchText}
							placeholder="Search Private Channels"
							onChange={(e)=>{setSearchText(e.target.value)}}
							/>
						</div>
						<div className="gap-3 h-screen flex flex-col mt-5 pb-[200px] scrollbar-none overflow-scroll" >
							{
								searchChannels ? 
								<h1 className="text-lg text-gray-300">Private Channels</h1>
								:
								<h1 className="text-lg text-gray-300">Public Channels</h1>
							}
							{
								searchChannels ?
								searchChannels.map((channel,i)=>(
									<ChannelCard channel={channel} key={i} />
								))
								:
								allChannels?.map((channel,i)=>(
									<ChannelCard channel={channel} key={i} />
								))
							}
						</div>
					</>
				}
			</main>
			<footer className={`w-full fixed z-20 flex items-center ${revealMenu ? "absolute" : "md:absolute "} bottom-0 bg-black/80 px-2 justify-between`}>
				<div className="flex py-3 items-center gap-3" >
					<img src={currentUser?.avatarImage} alt="" className="rounded-full h-10 w-10" />
					<p className="text-md truncate text-gray-600 truncate cursor-pointer">{currentUser?.username}</p>
				</div>
				<div>	
					<CgChevronUp onClick={handleReveal} 
					className={`w-4 h-4 ${revealState ? "rotate-180" : ""} cursor-pointer hover:scale-110 transition transform
					duration-300 ease-in-out active:scale-90 text-white mr-3`} />									
				</div>
			</footer>
			<div className={`absolute ${revealState ? "scale-100 transition-bottom duration-500 ease-in-out opacity-100" : "scale-50 transition-bottom duration-500 ease-in-out opacity-0 "} 
			 transition duration-500 right-5 ease-in-out bottom-20 z-0 p-2 flex flex-col border 
			bg-gray-800 border-gray-600 rounded-xl w-30`} >
				<div 
				onClick={handleToggle3}
				className="flex gap-2 hover:bg-gray-400/20 p-2  transition duration-200 ease-out cursor-pointer rounded-xl" >
					<UserCircleIcon className="h-5 w-5 text-gray-600 text-blue-500" />
					<p className="text-sm text-gray-400 font-semibold">Profile</p>
				</div>
				<div 
				onClick={handleToggle2}
				className="flex gap-2 mb-1 hover:bg-gray-400/20 p-2  transition duration-200 ease-out cursor-pointer rounded-xl" >
					<AiOutlinePicture className="h-5 w-5 text-green-500" />
					<p className="text-sm text-gray-400 font-semibold">Background</p>
				</div>
				<Divider className="bg-gray-500" />
				<div 
				onClick={signOutConfirm}
				className="flex gap-2 mt-1 hover:bg-gray-400/20 p-2 transition duration-200 ease-out cursor-pointer  rounded-xl" >
					<AiOutlineLogout className="h-5 w-5 text-red-500" />
					<p className={`${confirmed ? "animate-pulse" : ""} text-sm text-red-500 font-semibold`}>{confirmed ? "Confirm?":"Logout"}</p>
				</div>
			</div>			

		</div>


	)
}