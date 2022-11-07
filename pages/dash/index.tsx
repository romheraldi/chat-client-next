import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {deleteCookie, getCookie} from "cookies-next";
import {io} from "socket.io-client";
import Link from "next/link";

type Room = {
    id: number
    socket: string
    user: User
    another_user: User
}

type User = {
    id: number
    username: string
}

export default function Dash() {
    const router = useRouter()
    const [user, setUser] = useState({id: null, username: ''})
    const [rooms, setRooms] = useState<Room[]>([])
    const [newRoom, setNewRoom] = useState('')
    const [failed, setFailed] = useState('')
    let socket = io('http://localhost:3000')

    useEffect(() => {

        socket.on('connect', () => {
            console.log("Connected to socket server")
        })

        const nekot = getCookie('nekot')
        if (!nekot) {
            router.push('/login')
        }

        const data = async () => {
            try {
                const result = await axios.get('http://localhost:3000/users/me', {
                    headers: {
                        'x-auth': getCookie('nekot')
                    }
                })

                await setUser(result.data.data)
            } catch (e: any) {
                console.error(e.response.data)
            }
        }

        data()
    }, [])

    useEffect(() => {
        const getRooms = async () => {
            try {
                console.log("Getting room")
                const result = await axios.get('http://localhost:3000/users/my-rooms', {
                    headers: {
                        'x-auth': getCookie('nekot')
                    }
                })
                await setRooms(result.data.data)
            } catch (e: any) {
                console.error(e.response.data)
            }
        }

        getRooms()
        if (user.id) {
            socket.emit('join', `member-${user.id}`)
            socket.emit('fetchRooms', {id: user.id})
        }

        socket.on('inRoom', async (msg) => {
            console.log("hai")
            
            await router.push('/dash/'+msg)
        })

        socket.on('joinRoom', (msg) => {
            setRooms(oldRooms => [...oldRooms, msg])
        })
    }, [])

    const logout = () => {
        deleteCookie('nekot')
        socket.disconnect()
        router.push('/login')
    }

    const sendInvitation = async () => {
        if (newRoom) {
            try {
                const result = await axios.get(`http://localhost:3000/users/username/${newRoom}`, {
                    headers: {
                        'x-auth': getCookie('nekot')
                    }
                })

                console.log("Sending room")
                socket.emit('createRoom', {
                    user_id: user.id,
                    another_user_id: result.data.data.id
                })

                setNewRoom("")
            } catch (e: any) {
                setFailed(e.response?.data?.message)
            }
        }
    }
    return (
        <div className="flex flex-col content-center justify-items-center items-center center mt-32">
            <h1 className="text-3xl mb-10 font-bold underline">
                Welcome back to Nestian, {user.username}!
            </h1>
            <p className={"w-96 text-center mb-5"}>
                Please select one of usernames below or add your friend!
            </p>
            <div className="mt-5">
                {
                    rooms.length > 0 ? rooms.map((room) => {
                        console.log(room.user?.id === user.id)
                        if (room.user?.id === user.id) {
                            return <Link href={`/dash/${room.socket}`}
                                         className="mt-5 border-2 p-3 hover:bg-white hover:text-black">{room.another_user?.username}</Link>
                        } else {
                            return <Link href={`/dash/${room.socket}`}
                                         className="mt-5 border-2 p-3 hover:bg-white hover:text-black">{room.user?.username}</Link>
                        }
                    }) : "No data here"
                }
            </div>
            <div className="mt-10 text-center">
                <input
                    type="text"
                    name="password"
                    className={"text-center p-3"}
                    placeholder="Your friend ID"
                    value={newRoom}
                    onKeyDown={(e) => e.key === "Enter" && sendInvitation()}
                    onChange={(e) => setNewRoom(e.target.value)}/>
                {
                    failed &&
                    <div className="mt-5 text-center p-3 bg-red-300 border-2 border-red-500 text-red-500">
                        {failed}
                    </div>
                }
            </div>
            <div className="mt-10">
                <button onClick={() => logout()}
                        className={"px-5 py-2 border-2 hover:bg-white hover:text-black"}>Logout
                </button>
            </div>
        </div>
    )
}
