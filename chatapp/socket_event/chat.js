import { Message } from "./core.js";
import { chatHistory } from "./core.js";
  
// 投稿メッセージを送信する
export default function publishEvent(io, socket) {
    socket.on("publishEvent", (data) => {
        const massage = new Message(data.sender, data.content);
        chatHistory.push(massage);
        io.sockets.emit("publishEvent", data)
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
    socket.emit("enterEvent", serializedHistory);
  });
}