export const initChatData = [
    {
        id: 0,
        title: "実装分担の相談",
        tags: ["役割", "実装", "FE/BE"],
        messages: [
            {
                id: 0,
                content: "実装分担どうしましょうか。",
                timestamp: new Date(),
                sender: "山田",
            },
            {
                id: 1,
                content: "誰か反応して〜",
                timestamp: new Date(),
                sender: "山田",
            },
            {
                id: 2,
                content: "◯◯さんはFE、残りはBEでいいんじゃない？",
                timestamp: new Date(),
                sender: "佐藤",
            },
            {
                id: 3,
                content: "じゃあ、FE担当は◯◯さんでBEは僕と△△さんでいきましょう！",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 1,
        title: "打ち上げどうする？",
        tags: ["雑談", "打ち上げ"],
        messages: [
            {
                id: 4,
                content: "そういえば、打ち上げはどうしますか？",
                timestamp: new Date(),
                sender: "村田",
            }
        ],
        type: "thread"
    },
    {
        id: 2,
        content: "履歴の実装は明日完了予定です！",
        timestamp: new Date(),
        sender: "田中",
        type: "individual",
    },
    {
        id: 3,
        content: "誰かメシ行きません？",
        timestamp: new Date(),
        sender: "鈴木",
        type: "individual",
    }
];
