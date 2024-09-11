import { writable } from "svelte/store";

export const count = writable(0)

import ioClient from 'socket.io-client'

const ENDPOINT = 'http://localhost:5173'
const socket = ioClient(ENDPOINT)

export const io = socket