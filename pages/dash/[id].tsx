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

type Message = {
    id: number
    message: string
    sender: User
    room: Room
}

export default function Dash() {
    const router = useRouter()
    const {id} = router.query
    const [user, setUser] = useState<User>({} as User)
    const [room, setRoom] = useState<Room>({} as Room)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    let socket = io('http://localhost:3000')
    useEffect(() => {
        if (router.isReady) {
            // Code using query
            const data = async () => {
                console.log(`http://localhost:3000/rooms/${id}`)
                try {
                    const result = await axios.get(`http://localhost:3000/rooms/${id}`, {
                        headers: {
                            'x-auth': getCookie('nekot')
                        }
                    })
                    await setRoom(result.data.data)

                } catch (e: any) {
                    console.error(e.response.data)
                }
            }

            data()
        }
    }, [router.isReady]);

    useEffect(() => {

        socket.on('connect', () => {
            console.log("Connected to socket server")
        })

        const nekot = getCookie('nekot')
        if (!nekot) {
            router.push('/login')
        }

        const userData = async () => {
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

        userData()
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [room])

    const fetchMessages = async () => {
        socket.emit("fetchRoomMessages", room.socket)

        socket.on('roomMessages', msg => setMessages(msg))

        socket.on('message', (msg) => {
            setMessages(oldMessages => [...oldMessages, msg])
        })
    }

    const sendMessage = async () => {
        if (newMessage) {
            console.log("Sending")
            socket.emit('createMessage', {
                room_id: room.id,
                message: newMessage,
                sender_id: user.id
            })

            setNewMessage("")
        }
    }

    return (
        <div className="flex flex-col content-center justify-items-center items-center center mt-32">
            <h1 className="text-3xl mb-10 font-bold underline">
                Let&apos;s chat with Nestian
            </h1>
            <div className="mt-5">
                {
                    messages.length > 0 ? messages.map((message) => {
                        return <div><span
                            className={"text-blue-500 font-bold"}>({message.sender.username})</span> {message.message}
                        </div>
                    }) : "No message here"
                }
            </div>
            <div className="mt-32">
                <input
                    type="text"
                    name="password"
                    className={"text-center p-3"}
                    placeholder="Your secret"
                    value={newMessage}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    onChange={(e) => setNewMessage(e.target.value)}/>
            </div>
        </div>
    )
}
