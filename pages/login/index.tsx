import {useState} from "react";

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="flex flex-col content-center justify-items-center items-center center mt-32">
            <h1 className="text-3xl mb-10 font-bold underline">
                Login to your account!
            </h1>
            <p className={"w-96 text-center"}>
                Let&apos;s using Nestian to chat!, We&apos;ll login as {username || "none"}
            </p>
            <form action="" className={"mt-10"}>
                <div className="mb-5">
                    <input type="text" name="username" className={"text-center p-3"} placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="mb-5">
                    <input type="password" name="password" className={"text-center p-3"} placeholder="Your secret" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mb-5 text-center">
                    <button type="submit" className={"px-5 py-2 border-2 hover:bg-white hover:text-black"}>Login!</button>
                </div>
            </form>
            <p>Does not have account? Come to <a href="/register" className="text-blue-500 font-bold">register now!</a></p>
        </div>
    )
}
