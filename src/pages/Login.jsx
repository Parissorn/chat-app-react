import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";


export const Login = () => {

    const navigate = useNavigate();
    const [err, setErr] = useState(false);
    const [errMes, setErrMes] = useState(null)

    const handleSubmit = async (e) => {

        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;


        try {
            // Authentication for creating user (ได้ค่า user ตรงนี้)
            await signInWithEmailAndPassword(auth, email, password)
            setErrMes(null)
            navigate('/')

        } catch (error) {

            let errorMessage = error.code.replace('auth/', '')

            setErr(true);
            setErrMes(errorMessage)

            console.log('Error code:', error.code);
            console.log('Error message:', error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-content">
            <div className="w-full max-w-md p-8 space-y-3 bg-base-200 rounded-lg shadow">

                <h1 className="text-2xl font-bold text-center tracking-wide"> Login</h1>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="form-control">
                        <label className="label" htmlFor="email">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="input input-bordered w-full focus:outline-none"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label" htmlFor="password">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input input-bordered w-full focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="btn btn-active btn-accent w-full">
                            Sign In
                        </button>
                    </div>
                    {err && (
                        <div role="alert" className="alert alert-warning">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 shrink-0 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Warning: {errMes} </span>
                        </div>
                    )}
                    <div>
                        <p className='text-xs'>
                            You don't have an account?  <span className="link link-error text-[13px]"><Link to='/register'>Register</Link></span>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    )
}
