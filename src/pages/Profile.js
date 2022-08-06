import React, { useState, useEffect } from 'react';
import Camera from '../components/svg/Camera';
import Img from '../image.png'
import { storage, db, auth } from "../firebase";
import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Delete from "../components/svg/Delete";
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



const Profile = () => {
    // for changing the image
    const [img, setImg] = useState("");
    // grabbing the user for adding the image link in the firestore
    const [user, setUser] = useState();
    // const history = useHistory("");
    const navigate = useNavigate();


    useEffect(() => {

        // grabbing the user for adding the image link in the firestore
        getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
                setUser(docSnap.data());
            }
        });

        if (img) {
            const uploadImg = async () => {
                // creating image reference
                // it will require the storage and the path in which we will store the image in firebase storage
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                );
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath));
                    }

                    // here we are uploading the image
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        // storing the actual image url and path to the url
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                    });
                    console.log(url);

                    setImg("");
                } catch (err) {
                    console.log(err.message);
                }

            };
            // calling the uploadImage function
            uploadImg();
        }
    }, [img]);

    const deleteImage = async () => {
        try {
            const confirm = window.confirm("Delete avatar?");
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath));

                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    avatar: "",
                    avatarPath: "",
                });
                // history.replace("/");
                navigate('/', { replace: true })
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return user ? (
        <section>
            <div className="profile_container">
                <div className="img_container">
                    <img src={user.avatar || Img} alt="avatar" />

                    {/* this part is for the camera icon */}
                    <div className="overlay">
                        <div>
                            <label htmlFor="photo">
                                {/* for the camera icon in the profile */}
                                <Camera />
                            </label>
                            {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
                            <input type="file"
                                accept='image/*'
                                style={{ display: "none" }}  // this let's the user to only see the camera icon
                                id='photo'
                                onChange={(e) => setImg(e.target.files[0])} />
                        </div>
                    </div>
                </div>
                <div className="text container">

                    {/* displays the user name and email-id */}
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <hr />
                    {/* displays the date on which the user joined(registered itself) */}
                    <small>Joined on:  {user.createdAt.toDate().toDateString()}</small>
                </div>
            </div>
        </section>
    ) : null;
}

export default Profile;