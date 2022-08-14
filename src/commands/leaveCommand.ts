import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import WaifuManager from "../manager/waifuManager";

export async function leaveCommand(interaction: CommandInteraction) {
    if (!interaction.guild) return;

    // defer reply
    await interaction.deferReply();

    // make bot leave vc
    await WaifuManager.leaveVc(interaction.guild);

    // create success embed 
    const successEmbed = new EmbedBuilder()
        .setTitle("Left :^")
        .setDescription(`I just left the voice channel ( 〃▽〃)`)
        .setColor(Colors.Green)
        .setTimestamp();

    // defer reply
    await interaction.reply({
        embeds: [successEmbed]
    });
}