import "dotenv/config";
import Discord, { Channel, VoiceChannel, GatewayIntentBits, ActivityType } from "discord.js";
import { addSpeechEvent, VoiceMessage } from "discord-speech-recognition";
import errorEmbed from "./utils/errorEmbed";
import WaifuManager from "./manager/waifuManager";
import getAudioBuffer from "./utils/getAudioBuffer";
import { createAudioResource, getVoiceConnection } from '@discordjs/voice'
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

    // TODO: fix this clusterfuck
    const updateStatus = () => {
        let numberChannelMembers = 0;

        let membersInChannels = client.channels.cache
            // @ts-ignore
            .filter((channel: VoiceChannel) =>
                channel.isVoiceBased() &&
                channel.members.find(member => member.user.id === client.user?.id)
            )
            // @ts-ignore
            .map((channel: VoiceChannel) => channel.members.filter(member => !member.user.bot).size)

        if (membersInChannels.length > 0) numberChannelMembers = membersInChannels.reduce((p, n) => p + n);

        client.user?.setActivity({
            type: ActivityType.Listening,
            name: `${numberChannelMembers} simps in ${client.guilds.cache.size} servers!`
        });
    }

    setInterval(updateStatus, 15 * 1000);
    updateStatus();
})

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

// TODO: Fix this :()
client.on('voiceStateUpdate', (oldState, newState) => {
    // otherwise, check how many people are in the channel now
    const newVoiceUsers = newState.channel?.members.filter(m => !m.user.bot);

    if (newVoiceUsers?.size == 0) {
        const possibleConnection = getVoiceConnection(newState.guild.id);

        if (possibleConnection) possibleConnection.destroy();
    }

    // otherwise, check how many people are in the channel now
    const oldVoiceUsers = oldState.channel?.members.filter(m => !m.user.bot);

    if (oldVoiceUsers?.size == 0) {
        const possibleConnection = getVoiceConnection(oldState.guild.id);

        if (possibleConnection) possibleConnection.destroy();
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