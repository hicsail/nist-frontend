import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/Auth';

export default function Login() {

    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const projectId = import.meta.env.VITE_PROJECT_ID;
    const loginUrl = `https://test-auth.sail.codes?projectId=${projectId}&redirectUrl=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
        //`https://test-auth.sail.codes/?projectId=${projectId}`;
        else window.location.href = loginUrl;
    }, [isAuthenticated]);

    return (
       <div>
        Hello world
       </div>
    )
}
