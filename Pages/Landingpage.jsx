import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SphereSpinner } from "react-spinners-kit";


const Landingpage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMessage, setErrMessage] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e)=>{
            e.preventDefault()
            setLoginLoading(true)
            const payload = {
                userName: username,
                password: password
            }
            try {
               const response = await axios.post(`https://infinityflowbe.onrender.com/api/users/login`, payload)
            //    console.log(response.data.token)
               .then((res)=>{
                console.log(res)
                localStorage.setItem('authToken', res.data.token)
                if(res.data.role==="Team Lead" || res.data.role==="Member"){
                    if(res.data.boxID !== undefined){
                        setLoginLoading(false)
                        navigate(`/box_details/${res.data.boxID}`)
                    }
                    
                }else{
                    setLoginLoading(false)
                    navigate('/box')
                }
               })
            } catch (error) {
                console.log(error)
                setLoginLoading(false)
                setErrMessage(error.response.data.message)
            }
           
         
    }
    return (
        
        <div className='page'>
            <div className="loginHalf1">
            <h1 className='loginTitle'>Login</h1>
            <form className='form loginForm' onSubmit={handleSubmit}>
                <input id='loginInput' className='input loginInput' type="text" value={username} onChange={e=>setUsername(e.target.value)} required/>
                <input className='input loginInput' type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <p className="errMessage">{errMessage? errMessage:''}</p>
                {loginLoading === false ?<><button type='submit' className="submitButton">Login</button></>:<><button
                    className=" submitButton createSubtask loadingWiText"
                    type="submit"
                    disabled={loginLoading}
                  >
                    <SphereSpinner
                      size={15}
                      color="#C2DEEB"
                      loading={loginLoading}
                    />
                    Loading
                  </button></>}
                
            </form>
            </div>
            <div className="loginHalf2">
                <p>Note</p>
                <br />
                <p>*User creation and box creation are not included in the interface, but it has its api routes</p>
                <p>*Credentials for manager - Manager2:123456</p>
                <p>*Credentials for Member - Member:123456</p>
                <p>*Credentials for Team Lead - TL6:123456</p>
                <p>This is version 1</p>
                <br />
                <br />
                <p>Future Updates</p>
                <br />
                <p>Advance Filtering of data</p>
                <p>Admin access on user and box creation</p>
                <p>Reward systems for intrinsiq motivations. Refer my portfolio for ideas</p>
                <p>Performance analytics and report geneartion</p>
                <p>Manager performance data cumulative of all box performance</p>
            </div>
        </div>
    );
};

export default Landingpage;