export type LatestDreamer = {
    name: string
    description: string
    image: string
    bgimage: string
    scopevalue: number
}

const latestdreamers: Record<number, LatestDreamer> = {
    1: {
        name: "Elize Star",
        description: 'I would love to travel the world, exploring diverse places and cultures...',
        image: "./asad",
        bgimage: "asdas",
        scopevalue: 12,
    },
    2: {
        name: "Olia Tri",
        description: 'I would love to have a vacation in Greece',
        image: "./asad",
        bgimage: "asdas",
        scopevalue: 12,
    },
    3: {
        name: "Denis Ceban",
        description: 'I dream of an Ipad Pro 11 inch!',
        image: "./asad",
        bgimage: "asdas",
        scopevalue: 12,
    },
    4: {
        name: "Robert Starling",
        description: 'I would love to have a new pair of Nike Air',
        image: "./asad",
        bgimage: "asdas",
        scopevalue: 12,
    },
    5: {
        name: "Demi C",
        description: 'I dream of traveling to Bali',
        image: "./asad",
        bgimage: "asdas",
        scopevalue: 12,
    },
    6: {
        name: "Iulia R",
        description: 'I want a MacBook Air which will assist for my studies at Harvard...',
        image: "./asad",
        bgimage: "asdas",
        scopevalue: 12,
    },
}

export default latestdreamers