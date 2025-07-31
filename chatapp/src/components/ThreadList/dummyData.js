export const initChatData = [
    {
        id: 0,
        content: "こんにちは",
        timestamp: new Date(),
        sender: "山田",
        type: "individual",
    },
    {
        id: 1,
        title: "数学",
        tags: ["タグ1", "タグ2"],
        messages: [
            {
                id: 1,
                content: "数学のメモ",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 2,
                content: "青チャート",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 3,
        title: "英語の講義",
        tags: ["進捗", "タグ2"],
        messages: [
            {
                id: 3,
                content: "メモ1",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 4,
                content: "英語メモ",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 5,
        title: "Svelteの資料",
        tags: ["情報共有", "ファイル・資料"],
        messages: [
            {
                id: 6,
                content: "Svelteの初心者向け資料",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 7,
                content: "英語メモ",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    }
]