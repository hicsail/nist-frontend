import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/Auth';

export default function Login() {

    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    console.log('executing login');
    useEffect(() => {
        console.log('executing login');
        if (isAuthenticated) navigate('/dashboard');
        else window.location.href = 'https://test-auth.sail.codes/?projectId=c0392e2e-cfab-4ef4-b6ad-9cd3b1d59ea7';
    }, [isAuthenticated]);

    return (
       <div>
        Hello world
       </div>
    )
}
