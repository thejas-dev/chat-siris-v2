import Image from 'next/image'
import {useEffect,useState} from 'react'
import {useRouter} from 'next/router'
import {signIn,useSession,getProviders,getSession} from 'next-auth/react'
import axios from 'axios';
import {loginRoutes,registerRoutes} from '../utils/ApiRoutes'
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'

export default function Login({providers}) {
	// body...
	const router = useRouter();
	const [ready,setReady] = useState(false)
	const {data:session} = useSession();
	const id = Object.values(providers).map((provider)=>provider.id)
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	
	useEffect(()=>{
		if(session){
			if(!ready){
				setReady(true)
			}
			localStorage.setItem('chat-siris-session-2',JSON.stringify(session.user.name))
			handleValidation()
		}
	},[session])

	const handleValidation = async() =>{
		let username = session?.user.name
		let email = session?.user.email
		let avatarImage = "https://ik.imagekit.io/d3kzbpbila/default_user_jxSUXOAmg.webp?ik-sdk-version=javascript-1.4.3&updatedAt=1669339183865";
		let isAvatarImageSet = true
		const {data} = await axios.post(loginRoutes,{
			email,
		});
		if(data.status === false){
			const {data} = await axios.post(registerRoutes,{
				username,
				email,
				avatarImage,
				isAvatarImageSet,
			})
			if(!localStorage.getItem('chat-siris-2')){
				localStorage.setItem('chat-siris-2',JSON.stringify(data?.user?.username));
			}
			setCurrentUser(data?.user);
			router.push('/');
		}else{
			if(!localStorage.getItem('chat-siris-2')){
				localStorage.setItem('chat-siris-2',JSON.stringify(data?.user?.username));
			}
			setCurrentUser(data?.user);
			router.push('/');
		}
	}


	return(
	<>
		<div className="bg-cover h-screen w-full flex bg-center relative
		bg-[url('https://ik.imagekit.io/d3kzbpbila/bg_1sOh-7j7e.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1662823467165')]" >
			<div className="bg-black/60 min-h-screen w-full flex flex-col gap-5 items-center justify-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/logo_T6jFQJSSC.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662823468334" alt="" 
					className="w-[180px] md:w-[250px]"
					/>
					<button
					onClick={()=>{ 
						if(!ready){
							signIn(id)
						}
					}} 
					 className={`rounded-full ${ready ? "animate-pulse" : ""} font-semibold md:font-bold 
					hover:scale-110 transition transform duration-400 ease-in-out
					active:scale-90 p-5 bg-sky-600 border-2 border-white text-white`} >
						{
							ready ?  
							<p>Fetching Your Data</p>
							 : 
							<p>Login With {Object.values(providers).map((provider)=>provider.name)}</p>
						}
					</button>
			</div>  


			<div className="absolute w-full bottom-5 text-center items-center">
				<p className="text-md text-white font-semibold">Made with ❤️ by <a href="https://www.instagram.com/nuthejashari/" className="text-sky-400" >Thejas hari</a></p>
			</div>
		</div>
	</>

	)
}

export async function getServerSideProps(context){
	const providers = await getProviders();
	// const session = await getSession(context);
	return{
		props: {
			providers,
		}
	}

}