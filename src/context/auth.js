import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Loading from "../components/Loading";

// initializing the createContext and then exporting it as AuthContext(just a random name)
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    // creating a user state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //Runs only on the first render
        // listening for auth state change
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, []);
    if (loading) {
        // return "Loading";
        return <Loading />;
    }
    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;