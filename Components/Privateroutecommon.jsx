import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Privateroutecommon = () => {
    const token = localStorage.getItem('authToken')
    if(!token){
       return <Navigate to='/'/>
    }

    // decode token
    try {
        const decode = jwtDecode(token)
        
        if(decode.role){
            
           return <Outlet/>
        }
        else{
           return <Navigate to='/'/>
        }
    } catch (error) {
        console.log(error)
    }
    
};

export default Privateroutecommon;