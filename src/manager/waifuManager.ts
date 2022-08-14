import { BaseGuildVoiceChannel, VoiceChannel } from "discord.js";
import { Guild } from "discord.js"
import { joinVoiceChannel, getVoiceConnection, VoiceConnection, createAudioPlayer, AudioPlayer, AudioResource, createAudioResource } from '@discordjs/voice'
import UserError from "../utils/UserError";
import cleverbot from "cleverbot-free";
import { client } from "..";
import getAudioBuffer from "../utils/getAudioBuffer";
import { getRandomJoinMessage, getRandomLeaveMessage } from "../utils/getRandomMessage";

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

interface IGuildWaifuInfo {
    guild: Guild;
    previousMessages: string[];
    voiceChannel: VoiceChannel | BaseGuildVoiceChannel;
    voiceConnection: VoiceConnection;
    audioPlayer: AudioPlayer;
    lastSpoke: number;
    isSpeaking: boolean;
}

namespace WaifuManager {
    const waifuGuilds = new Map<string, IGuildWaifuInfo>();

    export async function joinVc(voiceChannel: VoiceChannel | BaseGuildVoiceChannel) {
        // voice channel exists
        if (!voiceChannel) throw new UserError("Sowwy but you aren't in a voice channel	(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)");

        // voice channel type guard
        if (!voiceChannel.isVoiceBased()) throw new UserError("Sowwy but this isn't a voice channel (ᇴ‿ฺᇴ)");

        // if already in voice channel
        if (voiceChannel.guild.members.me?.voice.channel) {
            throw new UserError("I'm already in a voice channel, use /leave first pwease (・ω<)");
        }

        // make sure target voice channel ha at least 1 person
        if (voiceChannel.members.filter(member => !member.user.bot).size < 1) {
            throw new UserError("Thewe needs to be at least 1 person in this voice channel (´ ω `♡)");
        }

        // join vc
        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            // @ts-ignore
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        // create audio player
        const audioPlayer = createAudioPlayer();
        voiceConnection.subscribe(audioPlayer);

        // is speaking handler
        audioPlayer.on("stateChange", (oldState, newState) => {
            if (newState.status === 'idle') WaifuManager.setIsSpeaking(voiceChannel.guild, false);
        });

        // play join message
        await WaifuManager.playMessage(audioPlayer, getRandomJoinMessage());

        // add guild entry
        waifuGuilds.set(voiceChannel.guildId, {
            guild: voiceChannel.guild,
            previousMessages: [],
            voiceChannel: voiceChannel,
            voiceConnection: voiceConnection,
            audioPlayer: audioPlayer,
            lastSpoke: Date.now(),
            isSpeaking: false
        });
    }

    export async function leaveVc(guild: Guild, withoutByeMessage?: boolean) {
        // get guild info
        const foundInfo = waifuGuilds?.get(guild.id);

        // make sure in voice channel
        if (guild.members.me?.voice.channel) {
            // play leave message
            if (foundInfo && foundInfo.audioPlayer && !withoutByeMessage)
                await WaifuManager.playMessage(foundInfo?.audioPlayer, getRandomLeaveMessage());

            // if guild info destroy vc
            if (foundInfo?.voiceConnection)
                foundInfo.voiceConnection.destroy();
            else {
                const voiceConnection = getVoiceConnection(guild.id)

                if (voiceConnection) voiceConnection.destroy();
            }
        } else {
            // if not guild info throw error
            throw new UserError("I'm likely not in a vc :3");
        }

        return;
    }

    export async function getMessageResponse(input: string, guild: Guild) {
        // get guild by id
        const foundGuild = waifuGuilds.get(guild.id);

        if (foundGuild && foundGuild.voiceConnection) {
            // get clever bot response
            const cleverbotResponse = await cleverbot(input, foundGuild.previousMessages, "en");

            // add reply to context
            foundGuild.previousMessages.push(
                input,
                cleverbotResponse
            );

            // return clever bot response
            return cleverbotResponse;
        }
    }

    export async function playAudio(guild: Guild, audio: AudioResource) {
        // get guild by id
        const foundGuild = waifuGuilds.get(guild.id);

        if (foundGuild && foundGuild.audioPlayer) {
            // if function play audio
            foundGuild.audioPlayer.play(audio);
        }
    }

    export function isSpeaking(guild: Guild) {
        // get guild
        const foundInfo = waifuGuilds.get(guild.id);

        if (foundInfo) {
            // if found info
            return foundInfo.isSpeaking;
        }
    }

    export function setIsSpeaking(guild: Guild, value: boolean) {
        // get guild
        const foundInfo = waifuGuilds.get(guild.id);

        if (foundInfo) {
            foundInfo.isSpeaking = value;
            foundInfo.lastSpoke = Date.now();

            // if found info
            return waifuGuilds.set(guild.id, foundInfo);
        }
    }

    export async function playMessage(audioPlayer: AudioPlayer, message: string) {
        // on join vc play audio
        const getAudio = await getAudioBuffer(message);

        // iif no audio
        if (!getAudio) return;

        // play audio
        const audioResource = createAudioResource(getAudio);

        // play message
        audioPlayer.play(audioResource);

        // wait for leave message to play
        await wait(audioResource.playbackDuration + 2000);

        return;
    }
}

export default WaifuManager;
