import {useState} from "react";
import axios, {Axios, AxiosError} from "axios";
import Link from "next/link";

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [successMessage, setSuccess] = useState(null)
    const [failedMessage, setFailed] = useState(null)

    const postRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3000/users/register', {
                username,
                password
            })

            setSuccess(response.data.message)
        } catch(e: any) {
            console.log(e.response?.data.message)
            setFailed(e.response?.data.message)
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

            {
                successMessage &&
                    <div className="mt-5 text-center p-3 bg-red-300 border-2 border-green-500 text-green-500">
                        {successMessage}
                    </div>
            }
            {
                failedMessage &&
                <div className="mt-5 text-center p-3 bg-red-300 border-2 border-red-500 text-red-500">
                    {failedMessage}
                </div>
            }
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
