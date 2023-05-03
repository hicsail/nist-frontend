import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/Auth';

export default function Login() {

    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const projectId = import.meta.env.VITE_PROJECT_ID;
    useEffect(() => {
        console.log('executing login');
        if (isAuthenticated) navigate('/dashboard');
        else window.location.href = `https://test-auth.sail.codes/?projectId=${projectId}`;
    }, [isAuthenticated]);

    return (
       <div>
        Hello world
       </div>
    )
}
