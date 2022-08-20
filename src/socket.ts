import { io, Socket } from "socket.io-client"

const HOST = "https://package-scry.herokuapp.com/"

export let socket: Socket

export const setSocket = (token?: string) => {
  socket = io(HOST, {
    query: {
      token: token ?? "",
    },
  })
}
