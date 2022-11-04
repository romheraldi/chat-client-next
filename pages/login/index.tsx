import {useEffect, useState} from "react";
import Link from "next/link";
import axios from "axios";
import {NextResponse} from "next/server";
import {useRouter} from "next/router";

export default function Login() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [successMessage, setSuccess] = useState(null)
    const [failedMessage, setFailed] = useState(null)

    useEffect(() => {
        const nekot = sessionStorage.getItem('nekot')
        if (nekot) {
            router.push('/dash')
        }
    })

    const postLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/users/login', {
                username,
                password
            })

            sessionStorage.setItem('nekot', response.data.data.access_token)

            router.push('/dash')
        } catch(e: any) {
            console.log(e.response?.data.message)
            setFailed(e.response?.data.message)
        }
    }

    const checkLogin = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users/me', {
                headers: {
                    'x-auth': sessionStorage.getItem('nekot')
                }
            })

            console.log(response.data)
        } catch(e: any) {
            console.log(e.response?.data.message)
            setFailed(e.response?.data.message)
        }
    }

    return (
        <div className="flex flex-col content-center justify-items-center items-center center mt-32">
            <h1 className="text-3xl mb-10 font-bold underline">
                Login to your account!
            </h1>
            <p className={"w-96 text-center"}>
                Let&apos;s using Nestian to chat!, We&apos;ll login as {username || "none"}
            </p>
            {
                successMessage &&
                <div className="mt-5 text-center p-3 bg-green-300 border-2 border-green-500 text-green-500">
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
                    <button type="submit" onClick={() => postLogin()} className={"px-5 py-2 border-2 hover:bg-white hover:text-black"}>Login!</button>
                    <button type="submit" onClick={() => checkLogin()} className={"px-5 py-2 border-2 hover:bg-white hover:text-black"}>Check Login!</button>
                </div>
            </div>
            <p>Does not have account? Come to <Link href={'/register'}>register new account</Link></p>
        </div>
    )
}
