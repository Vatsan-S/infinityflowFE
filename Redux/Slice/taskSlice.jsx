import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name:"taskdata",
    initialState:{
        taskDetails:[],
        isOpen:false,
        forceRerender:true ,
        boxDetails:{}
    },
    reducers:{
        toggleSidebar:(state,action)=>{
            
            state.isOpen = action.payload
           
            
        },
        setTaskDetails:(state,action)=>{
            state.taskDetails = action.payload
        },

        setForceRerender:(state)=>{
            state.forceRerender = !state.forceRerender
        },
        setBoxDetails:(state,action)=>{
            state.boxDetails = action.payload
        }
    }
})

export const {toggleSidebar, setTaskDetails, setForceRerender, setBoxDetails} = taskSlice.actions
export default taskSlice.reducer