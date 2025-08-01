export const initChatData = [
    {
        id: 0,
        content: "そろそろ実装どう進めるか決めたいですね。",
        timestamp: new Date(),
        sender: "山田",
        type: "individual",
    },
    {
        id: 1,
        title: "実装分担",
        tags: ["チーム作業", "実装担当"],
        messages: [
            {
                id: 1,
                content: "誰か、フロントエンドやりたい人〜？",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 2,
                content: "○○さんはFEやってたし、お願いしていいかも！",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 3,
        title: "打ち上げどうする？",
        tags: ["雑談", "予定調整"],
        messages: [
            {
                id: 3,
                content: "開発終わったら打ち上げしません？",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 4,
                content: "いいね！近くでご飯でも行こう！",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 5,
        title: "役割決定",
        tags: ["FE", "BE", "分担"],
        messages: [
            {
                id: 6,
                content: "じゃあ、FEは○○さん、BEは僕と△△さんで行きましょう！",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 7,
                content: "よろしくお願いします〜！",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 8,
        content: "履歴画面、明日には完成予定です！",
        timestamp: new Date(),
        sender: "佐藤",
        type: "individual",
    },
    {
        id: 9,
        title: "データ連携",
        tags: ["API", "バックエンド"],
        messages: [
            {
                id: 10,
                content: "APIのレスポンスってどの形式にします？",
                timestamp: new Date(),
                sender: "鈴木",
            },
            {
                id: 11,
                content: "JSONで統一しとくと楽かもです！",
                timestamp: new Date(),
                sender: "田中",
            }
        ],
        type: "thread"
    },
    {
        id: 12,
        title: "打ち上げ候補地",
        tags: ["ごはん", "雑談"],
        messages: [
            {
                id: 13,
                content: "近くのイタリアンどうです？",
                timestamp: new Date(),
                sender: "松本",
            },
            {
                id: 14,
                content: "ラーメンもありかも！",
                timestamp: new Date(),
                sender: "斉藤",
            }
        ],
        type: "thread"
    }
];
