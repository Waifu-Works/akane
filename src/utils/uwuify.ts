import Chance from "chance";

const chance = new Chance();

export default function uwuify(reply: string) {

    // convert string into chunks
    const separatedText = reply.toLowerCase()
        .replace("cleverbot", "senpai")
        .replace("clever bot", "senpai")
        .split(" ");

    // for (const [index, word] of separatedText.entries()) {
    //     // get a random integer
    //     const randomInt = chance.integer({ min: 1, max: 100 });

    //     switch (true) {
    //         case (randomInt < 15 && randomInt >= 0):
    //             // repeat word (15% chance)
    //             separatedText[index] = word + " " + word;
    //             break;
    //         case (randomInt < 30 && randomInt >= 15):
    //             // repeat word and uwu (15% chance)
    //             separatedText[index] = word + " " + word + "- ooh wooh";
    //             break;
    //     }
    // }

    // add uwu to end (15% chance)
    if (chance.bool({ likelihood: 30 })) {
        switch (chance.integer({ min: 1, max: 4 })) {
            case 1:
                separatedText.push("ooh wooh");
                break;
            case 2:
                separatedText.push("奥 woah");
                break;
            case 3:
                separatedText.push("agh!");
                break;
            case 4:
                separatedText.push("daddy");
                break;
        }
    }

    return separatedText.join(" ");
}