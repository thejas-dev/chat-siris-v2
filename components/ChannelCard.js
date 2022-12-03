import {BsChevronRight} from 'react-icons/bs';
import {AiOutlineLock} from 'react-icons/ai';
import {VscCloseAll} from 'react-icons/vsc';
import {RiSendPlaneFill} from 'react-icons/ri';
import {IoMdClose} from 'react-icons/io';
import {currentChannelState,groupSelectedState,revealMenuState,passTabOpenState,
	currentUserState,channelAdminState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil';
import {useState,useEffect} from 'react';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import {addUserToChannel,addChannelToUser,fetchUserRoom} from '../utils/ApiRoutes';
import {socket} from '../service/socket';
import {toast} from 'react-toastify';


export default function ChannelCard({channel}) {
	// body...
	const [currentChannel,setCurrentChannel] = useRecoilState(currentChannelState);
	const [groupSelected,setGroupSelected] = useRecoilState(groupSelectedState);
	const [revealMenu,setRevealMenu] = useRecoilState(revealMenuState);
	const [markChannel,setMarkChannel] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [channelAdmin,setChannelAdmin] = useRecoilState(channelAdminState);
	const [entryPass,setEntryPass] = useState('');
	const [passTabOpen,setPassTabOpen] = useRecoilState(passTabOpenState);

	const addUserToChannelFun = async() =>{
		let name = channel.name;
		let needToUpdate = true;
		const data1 = await axios.post(fetchUserRoom,{
			name
		})
		let users2 =  data1.data.data.users;
		users2.map((user2)=>{
			if(user2._id === currentUser._id){
				needToUpdate = false
			}	
		})
		if(needToUpdate){
			const users=[...users2,currentUser]
			const inChannel = channel.name
			let {data} = await axios.post(`${addUserToChannel}/${channel._id}`,{
				users
			})		
			setCurrentChannel(data.obj)
			const channelRef = data.obj;
			socket.emit('addUserToChannel',channelRef);
			let data2 = await axios.post(`${addChannelToUser}/${currentUser._id}`,{
				inChannel
			})
			setCurrentUser(data2.data.obj);
			if(channel.adminId===currentUser._id){
				setChannelAdmin(true);
			}			
		}
	}


	const joinChannel = () =>{
		if(!channel.password){
			setCurrentChannel(channel);
			setGroupSelected(true);
			addUserToChannelFun();
			setRevealMenu(false);						
		}else{
			if(!passTabOpen || !markChannel){
				setPassTabOpen(true);
				setMarkChannel(true);
			}
		}
	}

	const passCheck = () =>{
		if(entryPass === channel.password){
			setEntryPass('');
			setPassTabOpen(false);
			setMarkChannel(false);
			setCurrentChannel(channel);
			setGroupSelected(true);
			addUserToChannelFun();
			setRevealMenu(false);
		}else{
			toast('Password Wrong',toastOptions)
		}
	}

	const toastOptions={
    	position:"bottom-right",
	    autoClose:5000,
	    pauseOnHover:true,
	    draggable:true,
	    theme:"light",
	  }

	  useEffect(()=>{
	  	if(!passTabOpen){
	  		setMarkChannel(false);
	  	}
	  },[passTabOpen])

	return(
		<div 
		onClick={()=>{if(currentUser){joinChannel()}}}
		className="flex w-full cursor-pointer ease-out transition duration-300
		hover:bg-gray-700 p-2 py-4 rounded-xl justify-between items-center z-10" >	
			<div className="flex gap-2 items-center " >
				{
					passTabOpen && markChannel ? 
					""
					:
					<button className="px-3 py-2 rounded-xl text-white
					font-semibold bg-gray-700">{channel?.name.toString().split(/\s/).reduce((response,word)=>response+=word.slice(0,1),'')}</button>					
				}
				{
					passTabOpen && markChannel ?
					<form onSubmit={(e)=>{e.preventDefault();passCheck()}} >
						<input type="password" value={entryPass}
						onChange={(e)=>setEntryPass(e.target.value)}
						className="outline-none bg-gray-600/30 text-white p-2 z-50 rounded-xl w-full " 
						autofocus
						/>
					</form>
					:
					<button className="text-md font-semibold text-white/80">{channel?.name}</button>
				}
			</div>
			<div>
				{
					channel.password ? 
						passTabOpen && markChannel ? 
							entryPass ? 
								<RiSendPlaneFill 
								onClick={passCheck}
								className="h-5 w-5 text-white/60"/>
							:
								<IoMdClose onClick={()=>{setPassTabOpen(false);setMarkChannel(false)}}
								className="h-5 w-5 text-red-500 z-40"/>
							:
							<AiOutlineLock className="h-5 w-5 text-white/60" />
						:
							<BsChevronRight className="h-5 w-5 text-white/60" />
				}
			</div>
		</div>
	)
}
		