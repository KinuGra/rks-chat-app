
// メッセージを表すクラス
export class Message{
  constructor(id, content, sender) {
    const now = new Date();
    this.id = id;
    this.content = content;
    this.sender = sender;
    this.type = "individual"
    this.timestamp = now.toISOString()
  }
}

// スレッドのメッセージを表すクラス
export class Thread {
  constructor(title, tags, message) {
    this.id = message.id;
    this.title = title;
    this.tags = tags;
    this.messages = [message];
    this.type = "thread"
  }
}
// スレッドを集めたリスト
export const threads = [];
// チャット履歴を集めたリスト
export const chatHistory = [];
