import "dotenv/config";
import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v9";


const commands = [
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Need help? Then this is the perfect command for you!"),
    new SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins your voice channel and yes")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setRequired(false)
                .setDescription("The channel the bot should join")
        ),
    new SlashCommandBuilder()
        .setName("leave")
        .setDescription("leaves your voice channel and yes"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env["DISCORD_TOKEN"] || "");

rest.put(Routes.applicationCommands(process.env["DISCORD_CLIENT_ID"] || ""), {
    body: commands,
})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
