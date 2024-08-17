import axios from 'axios';
import React, { useState } from 'react';

const Forgotpassword = () => {
    const [username, setUsername] = useState('')

    const handleSubmit = async (e)=>{
        e.preventDefault()
        console.log("working")
        const payload = {
            userName:username
        }
        try {
            const response = await axios.post('https://infinityflowbe.onrender.com/api/users/forgotPassword',payload)
            console.log(response.data)
        } catch (error) {
            console.log(error)
            
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required />
                <button type='submit'>Email</button>
            </form>
        </div>
    );
};

export default Forgotpassword;