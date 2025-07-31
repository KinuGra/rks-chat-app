import { Message } from "./core.js";
import { chatHistory } from "./core.js";

// サーバーの全メッセージデータを返却
export function plzData(io, socket) {
    socket.on("plzData", (data) => {
        socket.emit("plzData", chatHistory);
    });
}