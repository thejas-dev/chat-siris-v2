import {BsChevronRight} from 'react-icons/bs'
import {currentChannelState,groupSelectedState,revealMenuState,
	currentUserState,channelAdminState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil';
import axios from 'axios';
import {addUserToChannel,addChannelToUser,fetchUserRoom} from '../utils/ApiRoutes';
import {socket} from '../service/socket';

export default function ChannelCard({channel}) {
	// body...
	const [currentChannel,setCurrentChannel] = useRecoilState(currentChannelState);
	const [groupSelected,setGroupSelected] = useRecoilState(groupSelectedState);
	const [revealMenu,setRevealMenu] = useRecoilState(revealMenuState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [channelAdmin,setChannelAdmin] = useRecoilState(channelAdminState);

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


	return(
		<div 
		onClick={()=>{setCurrentChannel(channel);setGroupSelected(true);setRevealMenu(false);addUserToChannelFun();}}
		className="flex w-full cursor-pointer ease-out transition duration-300
		hover:bg-gray-700 p-2 py-4 rounded-xl justify-between items-center" >	
			<div className="flex gap-2 items-center " >
				<button className="px-3 py-2 rounded-xl text-white
				font-semibold bg-gray-700">{channel?.name.toString().split(/\s/).reduce((response,word)=>response+=word.slice(0,1),'')}</button>
				<button className="text-md font-semibold text-white/80">{channel?.name}</button>
			</div>
			<div>
				<BsChevronRight className="h-5 w-5 text-white/60" />
			</div>
		</div>
	)
}
		