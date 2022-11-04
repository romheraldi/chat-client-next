import {useEffect, useState} from "react";
import {NextResponse} from "next/server";
import ButtonLink from "../../components/button/buttonLink";
import {useRouter} from "next/router";
import axios from "axios";
import {deleteCookie, getCookie} from "cookies-next";

export default function Dash() {
	const router = useRouter()
	const [user, setUser] = useState({username: ''})
	useEffect( () => {
		const nekot = getCookie('nekot')
		if (!nekot) {
			router.push('/login')
		}

		checkUser()
	})

	const checkUser = async () => {
		try {
			const response = await axios.get('http://localhost:3000/users/me', {
				headers: {
					'x-auth': getCookie('nekot')
				}
			})

			console.log(response.data)
			setUser(response.data.data)
		} catch(e: any) {
			console.log(e.response?.data.message)
		}
	}

	const logout = () => {
		deleteCookie('nekot')
		router.push('/login')
	}
	return (
		<div className="flex flex-col content-center justify-items-center items-center center mt-32">
			<h1 className="text-3xl mb-10 font-bold underline">
				Welcome back to Nestian, {user.username}!
			</h1>
			<p className={"w-96 text-center"}>
				Please select one of usernames below or add your friend!
			</p>
			<div>

			</div>
			<div className="mt-10">
				<button onClick={() => logout()} className={"px-5 py-2 border-2 hover:bg-white hover:text-black"}>Logout</button>
			</div>
		</div>
	)
}
