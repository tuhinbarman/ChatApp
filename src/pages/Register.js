import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // helps to navigate the users from one page to another



const Register = () => {

    // useState Hook is used to keep track of strings, numbers, booleans, arrays, objects, and any combination of these
    // initializing the useState
    // here data is our current state and setData is the function that is used to update our state
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
    });

    // const history = useHistory();
    // initializing the navigate 
    const navigate = useNavigate();

    // destructuring the properties of useState
    const { name, email, password, error, loading } = data;

    // setData will update the data
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        try {
            // creating the user
            // imported createUserWithEmailAndPassword from firebase auth
            const result = await createUserWithEmailAndPassword(
                // FirebaseAuth is the gateway to the Firebase authentication API. With it, you can reference Firebase.Auth.FirebaseAuth objects to manage user accounts and credentials
                auth,
                email,
                password
            );
            // console.log(result.user);
            // storing the user information to the firestore
            // it takes the doc reference(i.e doc), inside it takes firestore reference(db) ,then collection name("users") and then the document id(result.user.uid)
            await setDoc(doc(db, "users", result.user.uid), {
                // this is the data that we store in the firestore
                uid: result.user.uid,
                name,
                email,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: true, // we will set it to false when the user logs out
            });

            // after setting the document we will clear the field in the register form
            setData({
                name: "",
                email: "",
                password: "",
                error: null,
                loading: false,
            });
            // history.replace("/");
            // after successful registration of the user it will navigate the user to the home page(i.e to our chat screen)
            navigate('/', { replace: true })
            // navigate('/home');
        } catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    };


    return (
        <section>
            <h3>Create An Account</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    {/* <button className="btn">Register</button> */}
                    <button className="btn" disabled={loading}>
                        {loading ? "Creating ..." : "Register"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Register;