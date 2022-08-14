import "dotenv/config";
import Discord, { Channel, VoiceChannel, GatewayIntentBits } from "discord.js";
import { addSpeechEvent, VoiceMessage } from "discord-speech-recognition";
import errorEmbed from "./utils/errorEmbed";
import WaifuManager from "./manager/waifuManager";
import getAudioBuffer from "./utils/getAudioBuffer";
import { createAudioResource } from '@discordjs/voice'
import uwuify from "./utils/uwuify";
import joinCommand from "./commands/joinCommand";
import { leaveCommand } from "./commands/leaveCommand";


// create a new discord client
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds
    ],
});

addSpeechEvent(client, {
    lang: "en"
}); // add speech parsing to client

client.on("ready", async () => {
    console.log(`Ready as ${client.user?.tag}`);
    // client.application?.commands.fetch('1005661081789804604') // id of your command
    //     .then((command) => {
    //         console.log(`Fetched command ${command.name}`)
    //         // further delete it like so:
    //         command.delete()
    //         console.log(`Deleted command ${command.name}`)
    //     }).catch(console.error);
});

client.on("speech", async (message: VoiceMessage) => {
    try {
        // make sure message has content
        if (!message.content) return;

        // make sure not speaking
        if (WaifuManager.isSpeaking(message.guild)) return;

        // set is speaking
        WaifuManager.setIsSpeaking(message.guild, true);

        // get clever bot response
        const guildResponse = await WaifuManager.getMessageResponse(message.content, message.guild);

        // make sure valid guild response
        if (!guildResponse) return;

        // log bot 
        console.log(
            `=== [${message.guild.name}] === \n` +
            `${message.author.tag}: ${message.content} \n` +
            `bot: ${guildResponse}`
        );

        // generate audio
        const getAudio = await getAudioBuffer(uwuify(guildResponse));

        // iif no audio
        if (!getAudio) return;

        // play audio
        const audioResource = createAudioResource(getAudio);

        // play the audio
        WaifuManager.playAudio(message.guild, audioResource);
    } catch (err) {
        WaifuManager.setIsSpeaking(message.guild, false);
        // console.log(err);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        switch (interaction.commandName) {
            case "join":
                await joinCommand(interaction);
                break;
            case "leave":
                await leaveCommand(interaction);
                break;
        }
    } catch (err: any) {
        // if error tell user
        if (err.name === "UserError") {
            interaction.reply({ ephemeral: true, embeds: [errorEmbed(err.message)] });
        }
    }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    // get users in vc who arent bots
    const usersInVoiceChat = newState.channel?.members.filter(m => !m.user.bot)

    if (!usersInVoiceChat) {
        // @ts-ignore
        if (oldState && oldState.guild) return await WaifuManager.leaveVc(newState.guild, true);
    }
});

process.on("uncaughtException", (e) => { console.log(e) });
process.on("SIGINT", function () {
    console.log("Caught interrupt signal");
    client.destroy();

    process.exit();
});

client.login(process.env["DISCORD_TOKEN"]); // login to discord 

export { client };   