import publishEvent from './chat.js';
import { enterEvent } from './chat.js';


export default (io, socket) => {
  // 投稿メッセージを送信する
  publishEvent(io, socket);
  // 入室イベントを受け取る
  enterEvent(io, socket);
}