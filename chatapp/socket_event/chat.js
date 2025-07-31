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

export function enterEvent(io, socket) {
  socket.on("enterEvent", (data) => {
    const serializedHistory = chatHistory.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      type: msg.type,
      timestamp: msg.timestamp,
    }));
    console.log(serializedHistory);

    socket.emit("enterEvent", serializedHistory);
  });
}