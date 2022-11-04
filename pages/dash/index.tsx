import {useEffect} from "react";
import {NextResponse} from "next/server";
import ButtonLink from "../../components/button/buttonLink";
import {useRouter} from "next/router";

export default function Dash() {
	const router = useRouter()
	useEffect(() => {
		const nekot = sessionStorage.getItem('nekot')
		if (!nekot) {
			router.push('/login')
		}
	})
	return (
		<div className="flex flex-col content-center justify-items-center items-center center mt-32">
			<h1 className="text-3xl mb-10 font-bold underline">
				Welcome back to Nestian!
			</h1>
			<p className={"w-96 text-center"}>
				Nestian is chat application built in NestJS as a server and NextJS as a client side. With this application your are be able to chat with another user whose registered to the app.
			</p>
			<h2 className={"mt-5 text-2xl"}>Let's invite them to the chat!</h2>
			<div className="mt-10">
				<ButtonLink text={"Register"} link={"/register"} className={""}/>
				<ButtonLink text={"Login"} link={"/login"} className={"mx-2"}/>
			</div>
		</div>
	)
}
