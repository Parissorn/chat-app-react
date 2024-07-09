import React, { useState } from 'react';
import { auth, storage, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';


export const Register = () => {

    const navigate = useNavigate();

    const [err, setErr] = useState(false);
    const [errMes, setErrMes] = useState(null)

    const handleSubmit = async (e) => {
        // ไม่ให้ direct ไปที่อื่น
        e.preventDefault();

        // ไม้ใช้ useState เพราะไม่ต้องการให้เกิดการ re-render ทุกครั้งที่เราใช้ onChange บน input
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            // Firebase Authentication for Email, Password (ได้ค่า user ตรงนี้)
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // Firebase upload an image
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Progress function can be added here if needed
                },
                (error) => {
                    // Handle unsuccessful uploads
                    setErr(true);
                },
                async () => {
                    // Handle successful uploads on complete
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    // update user
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL,
                    });

                    // Update user to Firebase Database
                    await setDoc(doc(db, 'users', res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL,
                    });
                    //สร้าง userChats ซึ่งจะ contain คนที่เราคุยด้วยว่ามีใครบ้าง
                    await setDoc(doc(db, 'userChats', res.user.uid), {});

                    setErr(false);

                    //direct to chat app
                    navigate('/')


                }
            );
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

                {/* Header Section */}
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="form-control">
                        <label className="label" htmlFor="displayName">
                            <span className="label-text font-semibold">Display Name</span>
                        </label>
                        <input
                            type="text"
                            id="displayName"

                            className="input input-bordered input-md w-full focus:outline-none"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label" htmlFor="email">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="email"
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
                    <hr />
                    <input
                        type="file"
                        className="file-input file-input-accent file-input-bordered file-input-sm w-full max-w-xs"
                    />
                    <hr />
                    <div className="mt-6">
                        <button type="submit" className="btn btn-active btn-accent w-full">
                            Sign Up
                        </button>
                    </div>

                    {/* Handle Error Message Section */}
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

                    {/* Button */}
                    <div>
                        <p className='text-xs'>
                            Already have an account?  <span className="link link-error text-[13px]"><Link to='/login'>Login</Link></span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
