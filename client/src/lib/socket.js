import { io } from "socket.io-client";
const socket = io("http://localhost:3006");

export default socket;
