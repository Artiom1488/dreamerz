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
        image: "/landingUsers/elizeStarCover.jpg",
        bgimage: "/landingUsers/elizeStarBackground.jpg",
        scopevalue: 67,
    },
    2: {
        name: "Olia Tri",
        description: 'I would love to have a vacation in Greece',
        image: "/landingUsers/oliaTriCover.jpg",
        bgimage: "/landingUsers/oliaTriBackground.jpg",
        scopevalue: 38,
    },
    3: {
        name: "Denis Ceban",
        description: 'I dream of an Ipad Pro 11 inch!',
        image: "/landingUsers/denisCebanCover.jpg",
        bgimage: "/landingUsers/denisCebanBackground.jpg",
        scopevalue: 33,
    },
    4: {
        name: "Robert Starling",
        description: 'I would love to have a new pair of Nike Air',
        image: "/landingUsers/robertStarlingCover.jpg",
        bgimage: "/landingUsers/robertStarlingBackground.jpg",
        scopevalue: 56,
    },
    5: {
        name: "Demi C",
        description: 'I dream of traveling to Bali',
        image: "/landingUsers/demiCCover.jpg",
        bgimage: "/landingUsers/demiCBackground.jpg",
        scopevalue: 41,
    },
    6: {
        name: "Iulia R",
        description: 'I want a MacBook Air which will assist for my studies at Harvard...',
        image: "/landingUsers/iuliaRCover.png",
        bgimage: "/landingUsers/iuliaRBackground.png",
        scopevalue: 22,
    },
}

export default latestdreamers