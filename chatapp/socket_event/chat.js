import { Message } from "./core.js";
import { Thread } from "./core.js";
import { chatHistory } from "./core.js";
import { threads } from "./core.js";
  
// 投稿メッセージを送信する
export default (io, socket) =>  {
  socket.on("publishEvent", (data) => {
      console.log("publishEvent")
        const massage = new Message(data.content, data.sender);
        chatHistory.push(massage);
        io.sockets.emit("publishEvent", chatHistory)
    })
  
  // 新規追加されたスレッドを送信する
  socket.on("createThread", (data) => {
    const message = chatHistory.find(message => message.id === data.messageId);
    const index = chatHistory.findIndex(message => message.id === data.messageId);
    if (index !== -1) {
      chatHistory.splice(index, 1);
    } else {
      console.log("createThread: message not found");
    }
    const newThread = new Thread(data.title, "", message);
    chatHistory.push(newThread);
  })
  /*
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
  */
}

export function createThread(io, socket) {
  socket.on("createThread", (data) => {
    // title, messageId
    console.log("createThread");
    const message = chatHistory[data.messageId];
    const newThread = new threads(title, "", message);
    threads.push(newThread);
    console.log("thread", threads);
  })
}

export function enterEvent(io, socket) {
  socket.on("enterEvent", (data) => {
    socket.emit("enterEvent", chatHistory);
  });
}

// export function enterEvent(io, socket) {
//   socket.on("enterEvent", (data) => {
//     const serializedHistory = chatHistory.map((msg) => ({
//       id: msg.id,
//       content: msg.content,
//       sender: msg.sender,
//       type: msg.type,
//       timestamp: msg.timestamp,
//     }));
//     socket.emit("enterEvent", serializedHistory);
//   });
// }

// export function enterEvent(io, socket) {
//   socket.on("enterEvent", (data) => {
//     // chatHistoryの各要素が Message または Thread のインスタンスと想定
//     const serializedHistory = chatHistory.map((item) => {
//       if (item.type === "individual") {
//         // 個別メッセージのJSON形式
//         return {
//           id: item.id,
//           content: item.content,
//           sender: item.sender,
//           type: item.type,
//           timestamp: item.timestamp,
//         };
//       } else if (item.type === "thread") {
//         // スレッド形式のJSON形式
//         return {
//           id: item.id,
//           title: item.title,
//           tags: item.tags,
//           messages: item.messages.map((msg) => ({
//             id: msg.id,
//             content: msg.content,
//             sender: msg.sender,
//             type: msg.type,
//             timestamp: msg.timestamp,
//           })),
//           type: item.type,
//         };
//       }
//     });
//     socket.emit("enterEvent", serializedHistory);
//   });
// }
