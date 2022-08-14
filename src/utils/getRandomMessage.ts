import { Chance } from "chance";

const chance = new Chance();

export function getRandomJoinMessage() {
    return chance.pickone([
        "Hey daddy",
        "Ohayo onii-chan",
        "Hey Senpai",
        "Hey ooh wooh",
        "早上好中国"
    ]);
}

export function getRandomAfkMessage() {
    return chance.pickone([
        "Are you there onii-chan?"
    ]);
}

export function getRandomLeaveMessage() {
    return chance.pickone([
        "Bai bai onii-chan",
        "Bye daddy",
        "Ciao"
    ]);
}