import {ImFilePdf} from 'react-icons/im';
import {FiDownload} from 'react-icons/fi';
import {GiZipper} from 'react-icons/gi';
import {VscJson} from 'react-icons/vsc';
import {useState} from 'react';
import {AiOutlineDelete} from 'react-icons/ai'

export default function MessageCard({msg,scrollRef,tConvert,channelAdmin,deleteMessage}) {
	const [reveal,setReveal] = useState(false);


	return(
		<div ref={scrollRef} >
			<p className="text-white flex ">
				<img src={msg.byUserImage} className="h-11 w-11 rounded-xl mb-1" />
				<div className="flex gap-1 flex-col ml-[10px] md:ml-5" loading="lazy">
					<div className="flex gap-5" >	
						<p className="text-[#828282] font-semibold truncate" >{msg.byUserName}</p>
						<div className="flex gap-2" >
						{channelAdmin && <AiOutlineDelete 
						onClick={()=>{deleteMessage(msg._id)}}
						className="md:h-6 h-5 w-5 md:w-6 h-5 w-5 text-gray-300 hover:scale-110 transition cursor-pointer 
						duration-400 ease-in-out hover:text-sky-400"/> }
						<button className="text-[#828282]/80 cursor-pointer" onClick={()=>setReveal(!reveal)}>
							{tConvert(msg?.createdAt)} {reveal && <>, {msg?.createdAt?.split('T')[0]}</>} 
						</button>
						</div>
					</div>
					{
						msg.message.text.includes('https://ik.imagekit.io/d3kzbpbila') ? 
							msg.message.text.includes('https://ik.imagekit.io/d3kzbpbila/Audios') ?
								<audio src={msg.message.text} controls className="md:rounded-xl rounded-full md:border-[2px] md:border-orange-300/70 
								shadow-lg shadow-orange-500/70 bg-black/40 " loading="lazy" />
							:
							msg.message.text.includes('https://ik.imagekit.io/d3kzbpbila/Videos') ?
							<video width="305" height="240" 
							loading="lazy"
							src={msg.message.text} controls className="shadow-lg shadow-green-500/70 rounded-xl" />
							:
							msg.message.text.includes('https://ik.imagekit.io/d3kzbpbila/Pdfs') ?
							<div 
							loading="lazy"
							className="px-5 py-3 gap-12 mt-2 items-center rounded-xl bg-red-500 flex gap-5 shadow-lg shadow-yellow-500/70" >
								<div className="flex gap-2 items-center">
									<ImFilePdf className="h-8 w-8 text-white/80 hover:scale-110 
									transition duratio-300 ease-out"/>
									<h1 className="text-md text-gray-100/90 font-semibold">{msg.message.text.split('/')[5].split('_')[0]}.pdf</h1>
								</div>
								<a href={msg.message.text} target="_blank" download="Chat-Siris-2">
								<FiDownload className="rounded-full bg-black/20 active:scale-90 transition
								duratio-400 ease-out h-8 w-8 p-2" />
								</a>
							</div>
							:
							msg.message.text.includes('https://ik.imagekit.io/d3kzbpbila/Zips') ?
							<div 
							loading="lazy"
							className="rounded-xl bg-[url('https://ik.imagekit.io/d3kzbpbila/thejashari_ews_K7532')] bg-cover 
							flex gap-5 px-3 py-4  shadow-lg shadow-yellow-200/70">
								<div className="flex items-center gap-2" >
									<GiZipper className="text-gray-100 h-8 w-8 "/>
									<h1 className="text-white font-semibold text-md">{msg.message.text.split('/')[5].split('_')[0]}.zip</h1>
								</div>
								<a href={msg.message.text} target="_blank" download="Chat-Siris-2">
									<FiDownload className="rounded-full bg-black/20 active:scale-90 transition
									duratio-400 ease-out h-8 w-8 p-2" />
								</a>
							</div>
							:
							msg.message.text.includes('https://ik.imagekit.io/d3kzbpbila/Codes') ?
							<div 
							loading="lazy"
							className="rounded-xl bg-[url('https://ik.imagekit.io/d3kzbpbila/abstract-technology-binary-code-background_34629-592_rSP_zYETi.webp?ik-sdk-version=javascript-1.4.3&updatedAt=1669219844101')] bg-cover 
							shadow-lg shadow-gray-200/60">
							<div className="flex gap-5 px-3 py-4  bg-black/40">
								<div className="flex items-center gap-2" >
									<VscJson className="text-yellow-400 h-8 w-8 "/>
									<h1 className="text-white font-semibold text-md">{msg.message.text.split('/')[5].split('_')[0]}</h1>
								</div>
								<a href={msg.message.text} target="_blank" download="Chat-Siris-2">
									<FiDownload className="rounded-full bg-black/20 active:scale-90 transition
									duratio-400 ease-out h-8 w-8 p-2" />
								</a>
							</div>
							</div>
							:
								<img src={msg.message.text} 
								loading="lazy"
								className=" rounded-xl md:w-1/2 mt-3 w-3/4 shadow-xl shadow-sky-500/30"
								alt=""/>
						:
						<p className="text-white" >{msg.message.text}</p>
					}

				</div>
			</p>

		</div>
	)
}



//https://ik.imagekit.io/d3kzbpbila/thejashari_ews_K7532 


