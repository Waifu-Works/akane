"use strict";
exports.__esModule = true;
require("dotenv/config");
var rest_1 = require("@discordjs/rest");
var builders_1 = require("@discordjs/builders");
var v9_1 = require("discord-api-types/v9");
var commands = [
    new builders_1.SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins your voice channel and yes")
        .addChannelOption(function (option) {
            return option
                .setName("channel")
                .setRequired(false)
                .setDescription("The channel the bot should join");
        }),
    new builders_1.SlashCommandBuilder()
        .setName("leave")
        .setDescription("leaves your voice channel and yes"),
].map(function (command) {
    return command.toJSON();
});
var rest = new rest_1.REST({ version: "10" }).setToken(process.env["DISCORD_TOKEN"] || "");
rest.put(v9_1.Routes.applicationCommands(process.env["DISCORD_CLIENT_ID"] || ""), {
    body: commands,
})
    .then(function () {
        return console.log("Successfully registered application commands.");
    })
    ["catch"](console.error);
