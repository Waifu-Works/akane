import { Colors, EmbedBuilder } from "discord.js";

export default function errorEmbed(message: string) {
    return new EmbedBuilder()
        .setTitle("Error ૮ ˶ᵔ ᵕ ᵔ˶ ა")
        .setDescription(message)
        .setTimestamp()
        .setColor(Colors.Red)
        .toJSON()
}