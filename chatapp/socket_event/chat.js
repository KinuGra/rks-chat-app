import { Message } from "./core.js";
import { chatHistory } from "./core.js";
  
// 投稿メッセージを送信する
export default function publishEvent(io, socket) {
    socket.on("publishEvent", (data) => {
        const massage = new Message(data.sender, data.content);
        chatHistory.push(massage);
        io.sockets.emit("publishEvent", data)
        console.log("chatHistory", chatHistory);
    })
}