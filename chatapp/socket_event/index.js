import publishEvent from './chat.js';

export default (io, socket) => {
  // 投稿メッセージを送信する
  publishEvent(io, socket);
}