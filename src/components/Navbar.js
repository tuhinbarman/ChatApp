import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";    //importing from the firebase for logout functionality 
import { updateDoc, doc } from "firebase/firestore";    //importing from the firebase for updating the isOnline feature
import { AuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";


// This is the Navbar component
const Navbar = () => {
    const navigate = useNavigate();
    // const history = useHistory();

    // destructuring the user from the AuthContext
    // i.e: grabbing user from our context
    const { user } = useContext(AuthContext);


    // logic to be executed on clicking Logout Button
    const handleSignout = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            // updates the user isOnline status as false on clicking Logout
            isOnline: false,
        });
        await signOut(auth);
        // history.replace("/login");
        // after successful logout the user will be navigated to the login page
        navigate('/login', { replace: true })

    };
    return (
        <nav>
            <h3>
                <Link to="/">Messenger</Link>
            </h3>
            <div>
                {/* making use of the ternary operator in the Javascript */}
                {user ? (
                    // if the user is loged in then show this options(i.e: profile and Logout)
                    <>
                        <Link to="/profile">Profile</Link>
                        <button className="btn" onClick={handleSignout}>
                            Logout
                        </button>
                    </>
                ) : (
                    // else show these two options(i.e: Register and Login)
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;