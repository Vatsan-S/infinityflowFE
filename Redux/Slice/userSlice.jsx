import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"userdata",
    initialState:{
        allusers:[],
        
    },
    reducers:{
        setUsers:(state,action)=>{
            state.allusers = action.payload
            
            
        },
    }
})

export const {setUsers} = userSlice.actions
export default userSlice.reducer;