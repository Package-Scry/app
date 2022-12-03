import { io, Socket } from "socket.io-client"

const HOST = "https://0auth-production.up.railway.app/"

export let socket: Socket

export const setSocket = (token?: string) => {
  socket = io(HOST, {
    query: {
      token: token ?? "",
    },
  })
}
