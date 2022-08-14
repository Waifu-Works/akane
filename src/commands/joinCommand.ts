import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import WaifuManager from "../manager/waifuManager";

export default async function joinCommand(interaction: CommandInteraction) {
    // @ts-ignore
    const voiceChannel: VoiceChannel = interaction.options.getChannel("channel") || interaction.member.voice.channel;

    // make bot join vc
    await WaifuManager.joinVc(voiceChannel);

    // create success embed
    const successEmbed = new EmbedBuilder()
        .setTitle(`Joined ^_^`)
        .setDescription(`I just joined <#${voiceChannel.id}>, come to talk to me in vc OwO`)
        .setColor(Colors.Green)
        .setTimestamp();

    // defer reply
    await interaction.reply({
        embeds: [successEmbed]
    });

    return;
}