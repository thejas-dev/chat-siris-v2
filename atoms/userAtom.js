import { atom } from 'recoil';


export const currentUserState = atom({
	key:"currentUserState",
	default:null,
})


export const revealMenuState = atom({
	key:'revealMenuState',
	default:false
})


export const groupSelectedState = atom({
	key:"groupSelectedState",
	default:false,
})


export const allChannelsState = atom({
	key:"allChannelsState",
	default:[],
})

export const messageState = atom({
	key:"messageState",
	default:[]
})

export const currentChannelState = atom({
	key:"currentChannelState",
	default:""
})

export const passTabOpenState = atom({
	key:"passTabOpenState",
	default:''
})


export const loaderState = atom({
	key:"loaderState",
	default:false
})

export const loaderState2 = atom({
	key:"loaderState2",
	default:false
})

export const loaderState3 = atom({
	key:"loaderState3",
	default:false
})

export const loaderState4 = atom({
	key:"loaderState4",
	default:false
})

export const loaderState5 = atom({
	key:"loaderState5",
	default:false
})

export const loaderState6 = atom({
	key:"loaderState6",
	default:false
})

export const userMessageState = atom({
	key:"userMessageState",
	default:""
})

export const searchChannelsState = atom({
	key:"searchChannelsState",
	default:""
})

export const channelAdminState = atom({
	key:"channelAdminState",
	default:false
})

export const channelAdminOnlyState = atom({
	key:"channelAdminOnlyState",
	default:false
})

export const entryPassState = atom({
	key:"entryPassState",
	default:''
})