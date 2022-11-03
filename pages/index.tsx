import styles from '../styles/Home.module.css'
import {io, Socket} from "socket.io-client";
import {useEffect} from "react";

export default function Home() {
  let socket: Socket

  useEffect(() => {
    socket = io('http://localhost:3000')

    socket.on('connect', () => {
      console.log("Connected to server")
    })
  })
  return (
    <div className={styles.container}>

    </div>
  )
}
