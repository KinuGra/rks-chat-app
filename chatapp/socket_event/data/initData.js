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
    },
    {
        id: 8,
        content: "今日は天気がいいね！",
        timestamp: new Date(),
        sender: "佐藤",
        type: "individual",
    },
    {
        id: 9,
        title: "プログラミング学習",
        tags: ["JavaScript", "学習メモ"],
        messages: [
            {
                id: 10,
                content: "変数のスコープについて",
                timestamp: new Date(),
                sender: "鈴木",
            },
            {
                id: 11,
                content: "非同期処理の基本",
                timestamp: new Date(),
                sender: "田中",
            }
        ],
        type: "thread"
    },
    {
        id: 12,
        title: "旅行計画",
        tags: ["旅行", "計画"],
        messages: [
            {
                id: 13,
                content: "京都に行きたい",
                timestamp: new Date(),
                sender: "松本",
            },
            {
                id: 14,
                content: "温泉も候補に入れよう",
                timestamp: new Date(),
                sender: "斉藤",
            }
        ],
        type: "thread"
    }
]
