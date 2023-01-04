import { Socket } from "bun";

let callbackForSendCommand: (command: string) => void;

// @ts-expect-error
let socket: Socket = null;

const connect = async () => {
    socket = (await Bun.connect({
        hostname: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        socket: {
            open(socket) {
                console.log("Socket opened.");
            },
            data(socket, buffer) {
                callbackForSendCommand(new TextDecoder().decode(buffer));
            },
            close(socket) {
                console.log("Socket closed.");
                connect();
            },
        },
    })) as unknown as Socket;
};
await connect();

export const sendCommand = (command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        callbackForSendCommand = (output: string) => {
            resolve(output.trim());
        };

        socket.write(`${command}\r\n`);
    });
};

export const auth = async () => {
    return sendCommand(
        `AUTH ${process.env.REDIS_USERNAME} ${process.env.REDIS_PASSWORD}`
    );
};

export const setex = async (key: string, seconds: number, value: string) => {
    return sendCommand(`SETEX ${key} ${seconds} "${value}"`);
};

export const get = async (key: string) => {
    const value = await sendCommand(`GET ${key}`);
    return value.split("\n")[1];
};

export const ping = async () => {
    return sendCommand(`PING`);
};
