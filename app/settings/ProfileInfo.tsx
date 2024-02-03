import React, {useContext, useRef, useState} from "react";
import {UserContext} from "@/app/components/misc/UserContext";
import Image from "next/image";
import '../globals.css'
import {cn} from "@/lib/utils";
import {AvatarButton} from "@/app/components/ui/avatar";
import {upload_profile_image} from "@/lib/misc_requests";
import {request_client} from "@/lib/authentication";
import {getCookie} from "cookies-next";

export function ProfileInfo() {
    let user = useContext(UserContext)
    const [changesMade, setChangesMade] = useState(false);
    const [nameIsHovered, setNameIsHovered] = useState(false);
    const [nameIsClicked, setNameIsClicked] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const nameHover = () => {
        setNameIsHovered(true);
    }
    const nameNotHover = () => {
        setNameIsHovered(false);
    }
    const nameClick = () => {
        if (firstName == '') {
            setFirstName(user.first_name)
        }
        if (lastName == '') {
            setLastName(user.last_name)
        }
        setNameIsClicked(!nameIsClicked);
    }
    const handleNameSubmit = (e) => {
        if (e.key === 'Enter') {
            nameClick();
            checkChanges();
        }
    }

    const [fNameIsHovered, setfNameIsHovered] = useState(false);
    const fNameHover = () => {
        setfNameIsHovered(true);
    }
    const fNameNotHover = () => {
        setfNameIsHovered(false);
    }

    const [lNameIsHovered, setlNameIsHovered] = useState(false);
    const lNameHover = () => {
        setlNameIsHovered(true);
    }
    const lNameNotHover = () => {
        setlNameIsHovered(false);
    }

    const [emailIsHovered, setEmailIsHovered] = useState(false);
    const [emailIsClicked, setEmailIsClicked] = useState(false);
    const [email, setEmail] = useState('');
    const emailHover = () => {
        setEmailIsHovered(true);
    }
    const emailNotHover = () => {
        setEmailIsHovered(false);
    }
    const emailClick = () => {
        if (email == '') {
            setEmail(user.email);
        }
        setEmailIsClicked(!emailIsClicked);
    }
    const handleEmailSubmit = (e) => {
        if (e.key === 'Enter') {
            emailClick();
            checkChanges();

        }
    }

    const checkChanges = () => {
        if (email != '' && email != user.email && !changesMade) {
            setChangesMade(true);
        }
        if ((firstName != '' && firstName != user.first_name || lastName != '' && lastName != user.last_name) && !changesMade) {
            setChangesMade(true);
        }
        if (email == user.email && firstName == user.first_name && lastName == user.last_name) {
            setChangesMade(false)
        }
    }

    const [newImageUrl, setNewImageUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [showReload, setShowReload] = useState(false);
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const result = await upload_profile_image(file)
            if (result.image_url) {
                setNewImageUrl(result.image_url);
            }

        }
        setUploading(false);
        setShowReload(true);
    };

    const handleDivClick = () => {
        // Trigger the click event of the hidden file input
        fileInputRef.current.click();
    };

    return (

        <div className="w-full flex flex-col items-start justify-start gap-4 ">
            <div className="w-full flex flex-row items-center justify-start gap-3">
                <div className="border border-gray-700 px-2 rounded-full">
                    <p className="c3 text-xs">Functionality disabled</p>
                </div>
            </div>

            {user ? (
                <div className="flex flex-col items-start justify-start border border-gray-700 rounded-lg mb-6 gap-10">
                    <div
                        className="flex flex-row items-start justify-start px-4 py-2 gap-10">
                        <div className="flex flex-col items-start justify-start ">

                            {nameIsClicked ? (
                                <div
                                    className="flex flex-row items-start justify-start py-4 rounded-lg">
                                    <p className="w-[150px] left font-medium c0">Name</p>
                                    <input
                                        className="c0 h-7 w-40 px-2 border-[2px] border-gray-700 outline-none rounded-lg"
                                        type="text"
                                        name="First Name"
                                        value={firstName}
                                        required={true}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onMouseEnter={fNameHover}
                                        onMouseLeave={fNameNotHover}
                                        onKeyPress={handleNameSubmit}
                                    />
                                    <div className="w-2"/>
                                    <input
                                        className="c0 h-7 w-40 px-2 border-[2px] border-gray-700 outline-none rounded-lg"
                                        type="text"
                                        name="Last Name"
                                        value={lastName}
                                        required={true}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onMouseEnter={lNameHover}
                                        onMouseLeave={lNameNotHover}
                                        onKeyPress={handleNameSubmit}
                                    />
                                </div>
                            ) : (
                                <div onMouseEnter={nameHover} onMouseLeave={nameNotHover}
                                     className="flex flex-row items-start justify-start py-4 rounded-lg">
                                    <p className="w-[150px] left font-medium c0">Name</p>
                                    <p className="w-[200px] left px-4 c0">{firstName == '' ? user.first_name : firstName} {lastName == '' ? user.last_name : lastName}</p>
                                    <button onClick={nameClick}
                                            className={cn(nameIsHovered ? "text-xs italic c3 hover:underline cursor-not-allowed bgneg" : "text-xs italic text-transparent select-none pointer-events-none bgneg")}
                                            disabled={true}
                                    >
                                        <p>Edit</p>
                                    </button>

                                </div>
                            )}
                            {emailIsClicked ? (
                                <div
                                    className="flex flex-row items-start justify-start py-4 rounded-lg">
                                    <p className="w-[150px] left font-medium c0">Email</p>
                                    <input
                                        className="c0 h-7 w-40 px-2 border-[2px] border-gray-700 outline-none rounded-lg"
                                        type="email"
                                        name="Email"
                                        value={email}
                                        required={true}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onMouseEnter={emailHover}
                                        onMouseLeave={emailNotHover}
                                        onKeyPress={handleEmailSubmit}
                                    />
                                </div>
                            ) : (
                                <div onMouseEnter={emailHover} onMouseLeave={emailNotHover}
                                     className="flex flex-row items-start justify-start py-4 rounded-lg">
                                    <p className="w-[150px] left font-medium c0">Email</p>
                                    <p className="w-[200px] left px-4 c0">{email == '' ? user.email : email}</p>
                                    <button onClick={emailClick}
                                            className={cn(emailIsHovered ? "text-xs italic c3 hover:underline cursor-not-allowed bgneg" : "text-xs italic text-transparent select-none pointer-events-none bgneg")}
                                            disabled={true}
                                    >
                                        <p>Edit</p>
                                    </button>
                                </div>
                            )}

                            {user.user_type == "company" && (
                                <div className="flex flex-row items-start justify-between py-4 rounded-lg">
                                    <p className="w-[150px] left font-medium c0">Company</p>
                                    <p className="w-[300px] left px-4 c0">@MUSS NOCH WEG</p>
                                </div>
                            )}

                            {changesMade && (
                                <button
                                    className="my-4 px-4 py-1 border-[2px] border-embloy-purple-light hover:border-embloy-purple-lighter text-embloy-purple-light hover:text-embloy-purple-lighter rounded-full cursor-pointer"
                                >
                                    Update
                                </button>
                            )}
                        </div>

                        <div onClick={handleDivClick} className="relative inline-block">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                            />
                            <AvatarButton updated_image={newImageUrl} user={user} w={160} h={160}
                                          styles="w-40 h-40 rounded-full bg-transparent hover:bg-transparent"
                                          loading={uploading}/>
                        </div>


                    </div>
                    <div className="flex flex-row items-start justify-start px-4 py-2 gap-4">
                        <a href={"https://about.embloy.com/"} className="rounded-full c2-5 hover:underline text-xs bgneg">
                            <p>Learn more</p>
                        </a>
                        {showReload && (
                            <a href={window.location.href}
                               className="rounded-full c2-5 hover:underline text-xs bgneg">
                                <p>Reload</p>
                            </a>)}

                    </div>
                </div>
            ) : (
                <button>Sign in</button>
            )}

        </div>
    )
}