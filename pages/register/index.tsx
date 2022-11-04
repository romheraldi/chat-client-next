import {useState} from "react";
import axios from "axios";
import Link from "next/link";

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const postRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3000/users/register', {
                username,
                password
            })

            console.log(response.data)
        } catch(e) {
            console.error(e)
        }

    }

    return (
        <div className="flex flex-col content-center justify-items-center items-center center mt-32">
            <h1 className="text-3xl mb-10 font-bold underline">
                Register your account!
            </h1>
            <p className={"w-96 text-center"}>
                Let&apos;s using Nestian to chat!, We&apos;ll register as {username || "none"}
            </p>
            <div className={"mt-10"}>
                <div className="mb-5">
                    <input type="text" name="username" className={"text-center p-3"} placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="mb-5">
                    <input type="password" name="password" className={"text-center p-3"} placeholder="Your secret" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mb-5 text-center">
                    <button type="submit" onClick={() => postRegister()} className={"px-5 py-2 border-2 hover:bg-white hover:text-black"}>Register!</button>
                </div>
            </div>
            <p>You have registered account? Let&apos;s <Link href={'/login'}>login to your account</Link></p>
        </div>
    )
}
