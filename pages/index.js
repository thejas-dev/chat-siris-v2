import {useEffect,useState} from 'react'
import {useRouter} from 'next/router'
import {getSession,useSession} from 'next-auth/react'
import Head from 'next/head'
import Channels from '../components/Channels'
import Messages from '../components/Messages'
import Backdrop from '@mui/material/Backdrop';
import {createChannelRoutes,updateUser,updateBackground,updateName,updateAvatarImage} from '../utils/ApiRoutes'
import {AiOutlineDelete} from 'react-icons/ai'
import {MdEdit} from 'react-icons/md';
import {RiGalleryUploadLine} from 'react-icons/ri'
import {HiOutlineChevronUp} from 'react-icons/hi';
import axios from 'axios';
import Image from 'next/image';
import {TfiGallery} from 'react-icons/tfi'
import {useRecoilState} from 'recoil'
import {currentUserState,currentChannelState,groupSelectedState,channelAdminState} from '../atoms/userAtom'
import {socket} from '../service/socket';
import {VscCloseAll} from 'react-icons/vsc';
import ImageKit from "imagekit"
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const Home = () => {
    const router = useRouter();
    const {data:session} = useSession();
    useEffect(()=>{
        if(!session){
          router.push('/login')
      }
  },[])

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [channelName,setChannelName] = useState('')
  const [channelDescription,setChannelDescription] = useState('');
  const [password,setPassword] = useState('');
  const [linesNotEnough1,setLinesNotEnough1] = useState(false);
  const [linesNotEnough2,setLinesNotEnough2] = useState(false);
  const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
  const [currentChannel,setCurrentChannel] = useRecoilState(currentChannelState);
  const [groupSelected,setGroupSelected] = useRecoilState(groupSelectedState);
  const [channelAdmin,setChannelAdmin] = useRecoilState(channelAdminState);
  const [deleteConfirm,setDeleteConfirm] = useState(false);
  const [passTabVisible,setPassTabVisible] = useState(false);
  const [privacy,setPrivacy] = useState(false);
  const [userName,setUserName] = useState('');
  const [path7,setPath7] = useState('')
  const [path8,setPath8] = useState('');
  const [url7,setUrl7] = useState('');
  const [url8,setUrl8] = useState('');
  const [loader7,setLoader7] = useState(false);
  const [loader8,setLoader8] = useState(false);
  const [revealEdit,setRevealEdit] = useState(false)
  const [revealAvatarSettings,setRevealAvatarSettings] = useState(false);
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

  useEffect(()=>{
    if(currentUser){
      setUserName(currentUser.username)
    }
  },[])

  const url7Setter = () =>{
    
      const image_input7 = document.querySelector('#file7');
      const reader = new FileReader();

      reader.addEventListener('load',()=>{
        let uploaded_image7 = reader.result;
        setUrl7(uploaded_image7)
        // console.log(uploaded_image)
      });
      if(image_input7){
        reader.readAsDataURL(image_input7.files[0]);
      }
  }

   const url8Setter = () =>{
    
      const image_input8 = document.querySelector('#file8');
      const reader = new FileReader();

      reader.addEventListener('load',()=>{
        let uploaded_image8 = reader.result;
        setUrl8(uploaded_image8)
        // console.log(uploaded_image)
      });
      if(image_input8){
        reader.readAsDataURL(image_input8.files[0]);
      }
  }

  useEffect(()=>{
  if(url7){
    // 
      setLoader7(true);
      const uploadImage = (url7) =>{
        if(pathCheck(url7)){
          imagekit.upload({
            file : url7, //required
            fileName : "thejashari",   //required
            extensions: [
                {
                    name: "google-auto-tagging",
                    maxTags: 5,
                    minConfidence: 95
                }
            ]
          }).then(response => {
            
              // uploadBackground(response.url)
              setUrl7('');
              changeUserBackground(response.url);
          }).catch(error => {
              console.log(error);
          });
        }else{
          toast("Not an Image Format",toastOptions)
          setUrl7('')
          setLoader7(false);
        }
      }
      uploadImage(url7);
    }
  },[url7])



  useEffect(()=>{
  if(url8){
    // 
      setLoader8(true);
      const uploadImage = (url8) =>{
        if(pathCheck(url8)){
          imagekit.upload({
            file : url8, //required
            fileName : "thejashari",   //required
            extensions: [
                {
                    name: "google-auto-tagging",
                    maxTags: 5,
                    minConfidence: 95
                }
            ]
          }).then(response => {
              changeAvatarImage(response.url);
              setUrl8('');
          }).catch(error => {
              console.log(error);
          });
        }else{
          toast("Not an Image Format",toastOptions)
          setUrl8('')
          setLoader8(false);
        }
      }
      uploadImage(url8);
    }
  },[url8])



  const changeUserBackground = async(backgroundImage) => {
     const {data} = await axios.post(`${updateBackground}/${currentUser._id}`,{
        backgroundImage
      })
      setCurrentUser(data.obj);
      handleClose2();
      setLoader7(false);
  }

   const changeAvatarImage = async(avatarImage) => {
     const {data} = await axios.post(`${updateAvatarImage}/${currentUser._id}`,{
        avatarImage
      })
      setCurrentUser(data.obj);
      handleClose2();
      setLoader8(false);
  }

  const deleteAvatarImage = async() => {
      const avatarImage = "https://ik.imagekit.io/d3kzbpbila/default_user_jxSUXOAmg.webp?ik-sdk-version=javascript-1.4.3&updatedAt=1669339183865";
     const {data} = await axios.post(`${updateAvatarImage}/${currentUser._id}`,{
        avatarImage
      })
      setCurrentUser(data.obj);
      handleClose2();
      setLoader8(false);
  }

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  const handleClose2 = () => {
    setOpen2(false);
    setDeleteConfirm(false);
  };
  const handleToggle2 = () => {
    setOpen2(!open2);
  };
  const handleToggle3 = () => {
    setOpen3(!open3);
  };
  const handleClose3 = () => {
    setOpen3(false);
    setRevealEdit(false);
    setRevealAvatarSettings(false);
  }
  const clearText = () =>{
    setChannelDescription('');
    setChannelName('');
  }

  const createChannel = async() =>{
    if(channelName.length > 4){
      if(channelDescription.length > 10){
          let name = channelName;
          let description = channelDescription;
          let admin = currentUser.username;
          let adminId = currentUser._id;
          const adminOnly = false;
          let users = []
          users.push(currentUser);
          setChannelName('');setChannelDescription('');
          const {data} = await axios.post(createChannelRoutes,{
            name,description,admin,adminId,password,adminOnly,users,privacy
          })
          if(data.status === true){
            setCurrentChannel(data.group);
            const channelRef = data.group;
            socket.emit('addUserToChannel',channelRef);
          }
          const inChannel = name;
          admin = name;
          const data2 = await axios.post(`${updateUser}/${currentUser._id}`,{
            inChannel,admin
          })
          setCurrentUser(data2.data.obj);
          setGroupSelected(true);
          setChannelAdmin(true);
          socket.emit('refetchChannels');
          handleClose();
          setPassTabVisible(false);
          setPassword('');
      }else{
        setLinesNotEnough2(true);
        setTimeout(function() {setLinesNotEnough2(false)}, 2000);
      }
    }else{
      setLinesNotEnough1(true);
      setTimeout(function() {setLinesNotEnough1(false)}, 2000);
    }
  }


  const deleteBackgroundImageConfirm = async() => {
    if(deleteConfirm){
      const backgroundImage = ""
      const {data} = await axios.post(`${updateBackground}/${currentUser._id}`,{
        backgroundImage
      })
      setCurrentUser(data.obj);
      handleClose2();
    }else{
      setDeleteConfirm(true);
    }
  }

  const changeUserName = async(name) => {
    if(!currentUser.inChannel){
      const username = name;
      const {data} = await axios.post(`${updateName}/${currentUser._id}`,{
        username
      })
      setCurrentUser(data.obj)
    }else{
      toast('Please Exit From The Room to Edit your Profile',toastOptions)
    }
  }

  const toastOptions={
    position:"bottom-right",
    autoClose:5000,
    pauseOnHover:true,
    draggable:true,
    theme:"light",
  }

  function tConvert(i) {
    if(i){
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
    }

    useEffect(()=>{
      if(!passTabVisible){
        setPassword('')
      }
    },[passTabVisible])


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

  return (
    <div className="flex min-h-screen ">
      <Head>
        <title>Chat-Siris-2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open3} 
        > 
        <div className="h-full relative bg-black/50 w-full flex flex-col items-center justify-center">
        <VscCloseAll className="absolute top-10 right-5 rounded-xl border border-red-500 shadow-md 
          cursor-pointer hover:scale-110 transition duration-300 ease-in-out 
          active:scale-90 shadow-sky-500 h-10 w-10 p-2"
          onClick={handleClose3}
          />
          <div className="relative">
            <img src={currentUser?.avatarImage} alt=" " className="h-40 w-40 rounded-full shadow-lg shadow-yellow-500/80"/>
            {
              !currentUser?.inChannel ?
              revealAvatarSettings ?
              <HiOutlineChevronUp 
              onClick={()=>{setRevealAvatarSettings(!revealAvatarSettings)}}
              className="absolute z-50 h-8 w-8 p-[2px] right-5 bottom-0 rounded-full bg-green-500 cursor-pointer 
              hover:scale-110 transition duration-300 transform ease-in-out active:scale-90 border border-white" /> 
              :
              <MdEdit 
              onClick={()=>{setRevealAvatarSettings(!revealAvatarSettings)}}
              className="absolute z-50 h-8 w-8 p-[2px] right-5 bottom-0 rounded-full bg-green-500 cursor-pointer 
              hover:scale-110 transition duration-300 transform ease-in-out active:scale-90 border border-white" /> 
              :
              <></>
            }
            <input type="file" id="file8" hidden accept="image/*" value={path8}
            onChange={(e)=>{
              setPath8(e.target.value);url8Setter();
            }} />
            <label htmlFor={`${loader8 ? "" : "file8"}`} id="label_input">
              <RiGalleryUploadLine 
              className={`absolute h-8 w-8 ${currentUser?.inChannel ? "hidden" : "" } p-[4px] right-5 ${revealAvatarSettings ? "-bottom-10 scale-100" : "bottom-0 scale-50"} rounded-xl ${loader8 ? "bg-red-500 animate-pulse" : "bg-green-500/70"}  
              cursor-pointer hover:scale-110 transition-bottom duration-300 transform ease-in-out active:scale-90 `} /> 
            </label>
            <AiOutlineDelete 
            onClick={deleteAvatarImage}
            className={`absolute h-8 w-8 ${currentUser?.inChannel ? "hidden" : "" } p-[2px] right-5 ${revealAvatarSettings ? "-bottom-20 scale-100" : "bottom-0 scale-50"} rounded-xl bg-red-500/70 cursor-pointer 
            hover:scale-110 transition-bottom duration-300 transform ease-in-out active:scale-90`} /> 
          </div>
          <div className="mt-10 flex gap-20 items-center justify-center">
            <div className="items-center flex flex-col gap-10">
              <div className="flex flex-col items-center gap-2" >
                {revealEdit && 
                  <div className="p-2 border-2 border-sky-500/70 rounded-xl items-center flex shadow-lg shadow-yellow-500/50 mb-2">
                  <input className="outline-none text-center w-30 border-none bg-transparent text-gray-300" 
                  placeholder="Type Here" 
                  value={userName} onChange={(e)=>{
                    setUserName(e.target.value)
                    changeUserName(e.target.value);
                  }}/>
                </div>
                }
                <h1 className="text-md text-gray-500">Name</h1>
                <h1 className="md:text-xl text-sm text-gray-400 font-semibold flex gap-2">{currentUser?.username}<MdEdit 
                onClick={()=>setRevealEdit(!revealEdit)}
                className={`h-6 w-6 ${currentUser?.inChannel ? "hidden" : ""} hover:scale-110 hover:text-gray-300 transition
                transform duration-300 ease-in-out active:scale-90 cursor-pointer text-gray-500`}/></h1>
              </div>
              <div className="flex flex-col items-center gap-2" >
                <h1 className="text-md text-gray-500">Admin in</h1>
                <h1 className="md:text-xl text-sm text-gray-400 font-semibold">{currentUser?.admin ? currentUser.admin : "~"}</h1>
              </div>
            </div>
            <div className="flex items-center flex-col gap-10">
              <div className="flex flex-col items-center gap-2" >
                <h1 className="text-md text-gray-500">Created At</h1>
                <h1 className="md:text-xl text-sm text-gray-400 font-semibold">{
                  currentUser ? 
                  <>{currentUser?.createdAt?.split('T')[0]} , {tConvert(currentUser?.createdAt)}</>
                    :
                  "~"
                }</h1>
              </div>
              <div className="flex flex-col items-center gap-2" >
                <h1 className="text-md text-gray-500">Currently inChannel</h1>
                <h1 className="md:text-xl text-sm text-gray-400 font-semibold">{currentUser?.inChannel ? currentUser.inChannel : "~"}</h1>
              </div>
            
            </div>
          </div>
        </div>

      </Backdrop>
       <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open2}
        > 
          <div className="relative h-full w-full flex-col flex items-center justify-center bg-black/40" >
          <VscCloseAll className="absolute top-10 right-5 rounded-xl border border-red-500 shadow-md 
          cursor-pointer hover:scale-110 transition duration-300 ease-in-out 
          active:scale-90 shadow-sky-500 h-10 w-10 p-2"
          onClick={handleClose2}
          />
            <div
            id="drag-area"
            className="p-5 border-2 w-[60%] md:w-[20%] mt-7 md:mt-10 border-dashed border-sky-500 bg-blue-500/20 
            rounded-2xl flex items-center justify-center flex-col shadow-lg shadow-sky-500/70 ">  
              <Image src={currentUser?.backgroundImage ? currentUser?.backgroundImage : "https://ik.imagekit.io/d3kzbpbila/creative-mountains-sunrise-logo-design-symbol-illustration-creative-mountains-sunrise-logo-124611961-removebg-preview_qStGXj2RA.png?ik-sdk-version=javascript-1.4.3&updatedAt=1668007930493"}
              width="20000" height="10" object="cover" alt="" className="rounded-2xl"/>
            </div>
            <input type="file" id="file7" hidden accept="image/*" value={path7}
              onChange={(e)=>{
                setPath7(e.target.value);url7Setter();
              }} />
            <div className="flex mt-10 gap-10" >
              <label htmlFor={`${loader7 ? "" : "file7"}`} id="label_input">
              <div className={`px-3 py-2 gap-2 rounded-xl flex border-2 ${loader7 ? "bg-red-700/20 border-red-500 animate-pulse" : "bg-green-700/20 border-green-500"} cursor-pointer
              hover:scale-110 active:scale-90 transition duration-500 ease-in-out transform `} >
                  <TfiGallery className="h-7 w-7 text-green-500"/>
                  <h1 className="text-md text-white font-semibold">Change</h1>
              </div>
              </label>
              <div 
              onClick={deleteBackgroundImageConfirm}
              className="px-3 py-2 gap-2 rounded-xl flex border-2 bg-red-700/20 border-red-500 cursor-pointer
              hover:scale-110 active:scale-90 transition duration-500 ease-in-out transform " >
                <AiOutlineDelete className="h-7 w-7 text-red-500"/>
                <h1 className="text-md text-white font-semibold">{deleteConfirm ? "Confrm?" : "Delete"}</h1>
              </div>
            </div>
          </div>
        </Backdrop>
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        > 
        <div className="bg-[#120F13] rounded-xl md:px-10 px-5 py-5" > 
          <h1 className="text-xl text-white font-semibold" >New Channel</h1>
          <div className="flex my-5 flex-col w-[330px] md:w-[600px] gap-5">
            <input type="text"
            value={channelName}
            onChange={(e)=>setChannelName(e.target.value)} 
            className={`w-full border  ${linesNotEnough1 ? "border-red-500 " : "border-gray-800" } rounded-xl bg-gray-600/40 p-5 outline-none text-gray-200`}
            placeholder="Channel Name"
            />
            <textarea type="text"
            value={channelDescription}
            onChange={(e)=>setChannelDescription(e.target.value)}
            className={`w-full border  ${linesNotEnough2 ? "border-red-500 " : "border-gray-800" } h-40 p-5 rounded-xl bg-gray-600/40  outline-none text-gray-200`}
            placeholder="Channel Description"
            />
          </div>
          <div className="flex items-center ml-2 mb-5 gap-1" >
            <FormControlLabel
                control={<Android12Switch defaultChecked />}
                checked={privacy}
                onChange={()=>setPrivacy(!privacy)}
            />
            <h1 className="text-gray-300 text-lg font-semibold">Private Channel({privacy ? "Private":"Public"})</h1>
          </div>
          <div className="flex items-center ml-2 mb-5 gap-1" >
            <FormControlLabel
                control={<Android12Switch defaultChecked />}
                checked={passTabVisible}
                onChange={()=>setPassTabVisible(!passTabVisible)}
            />
            <h1 className="text-gray-300 text-lg font-semibold">Password ({password ? "Locked" : "No Password"})</h1>
          </div>
          {
            passTabVisible ? 
            <div>
            <div className="flex my-5 flex-col w-[330px] md:w-[600px] gap-3">
              <input type="text"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} 
              className={`w-full border border-gray-800 rounded-xl bg-gray-600/40 p-5 outline-none text-gray-200`}
              placeholder="Password"
              />
              <h1 className="text-sm text-red-500" >*Password can't be changed after creating the room</h1>
            </div>
            </div>
            : 
            ""
          }
          <div className="flex justify-end gap-5" >
            <button 
            onClick={()=>{
              clearText();
              handleClose();
            }}
            className={`text-md font-semibold py-[11px] 
            hover:scale-110 transition transform duration-300 ease-out active:scale-90
            px-5 rounded-2xl  text-red-500 bg-gray-600/40`} >
                Cancel
            </button>
            <button 
            onClick={createChannel}
            className={`text-md font-semibold py-[11px] 
            hover:scale-110 transition transform duration-300 ease-out active:scale-90
            px-5 rounded-2xl text-white bg-green-700`} >
                Submit
            </button>
          </div>

        </div>
        </Backdrop>
      <main className="flex w-full">
          <ToastContainer/>
          <Channels session={session} 
          handleToggle={handleToggle} handleClose={handleClose} 
          handleToggle2={handleToggle2} handleClose2={handleClose2} 
          handleToggle3={handleToggle3} handleClose3={handleClose3} />
          <Messages session={session} />
      </main>
    </div>
  )
}

export default Home



