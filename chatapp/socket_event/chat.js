import { Message } from "./core.js";
import { chatHistory } from "./core.js";
  
// 投稿メッセージを送信する
export default function publishEvent(io, socket) {
    socket.on("publishEvent", (data) => {
        const massage = new Message(data.content, data.sender);
        chatHistory.push(massage);
        io.sockets.emit("publishEvent", chatHistory)
    })
}

// サーバーの全メッセージデータを返却
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
