import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket | undefined = undefined;

type SocketContextProps = {
    status: SocketStatus;
    socket?: Socket;
}

enum SocketStatus {
    CONNECTED,
    DISCONNECTED,
    ERROR
}

const SocketContext = createContext<SocketContextProps>({ status: SocketStatus.DISCONNECTED });


export function SocketProvider({ children }: PropsWithChildren) {
    const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);

    useEffect(() => {
        if (!socket) {
            socket = io(process.env.NEXT_PUBLIC_BASE_URL_PROD!,
              { path: "/api/socket/io", addTrailingSlash: false },
            );

            socket.on("connect", () => {
                setStatus(SocketStatus.CONNECTED);
                console.log("Connected to WebSocket");
            });

            socket.on("connect_error", (error) => {
                setStatus(SocketStatus.ERROR);
                console.error("Connection Error:", error);
            });

            socket.on("disconnect", () => {
                setStatus(SocketStatus.DISCONNECTED);
                console.log("Disconnected from WebSocket");
            });
        }
        // Socket destructor
        return () => {
            if (!socket) return;
            socket.disconnect();
            socket = undefined;
        };

    }, []);

    return (
      <SocketContext.Provider value={{ status, socket }}>{children}</SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);