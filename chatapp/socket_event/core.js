
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
  constructor(id, title, tag, messages = []) {
    this.id = id;
    this.title = title;
    this.tag = tag;
    this.messages = messages;
    this.type = "thread"
  }
}
// スレッドを集めたリスト
export const threads = [];
// チャット履歴を集めたリスト
export const chatHistory = [];
