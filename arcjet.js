import arcjet, { tokenbucket, shield, detectbot } from '@arcjet/nodejs';

import "dotenv/config";

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules:[
    shield({mode:"LIVE"}),
    detectbot({
        mode: "LIVE",
        allow: [
        "CATEGORY:SEARCH_ENGINE"
        ]
}),
    tokenbucket({
        mode: "LIVE",
        refillRate: 5,
        capacity: 10,
        interval: 10
    })
]
})