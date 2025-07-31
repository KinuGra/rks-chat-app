import { Message } from "./core.js";
import { chatHistory } from "./core.js";
import { threads } from "./core.js";
  
// 投稿メッセージを送信する
export default function publishEvent(io, socket) {
    socket.on("publishEvent", (data) => {
        const massage = new Message(data.sender, data.content);
        chatHistory.push(massage);
        io.sockets.emit("publishEvent", data)
        console.log("chatHistory", chatHistory);
    })
}

// 新規追加されたスレッドを送信する
export function createThread(io, socket) {
  socket.on("createThread", (data) => {
    // title, messageId
    const message = chatHistory[data.messageId];
    const newThread = new threads(title, "", message);
    threads.push(newThread);
    console.log("thread", threads);
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