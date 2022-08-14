<p align="center">
  <img src="https://user-images.githubusercontent.com/44450511/184550781-c8977df0-f60a-4265-bfd6-c4adbd370975.png" alt="Akane Logo" style="zoom: 25%;" />
</p>
<p align="center">
  <a href="https://github.com/Waifu-Works/akane">
      <img height="32px" alt="Home" title="Youtube" src="https://user-images.githubusercontent.com/44450511/184551323-83c90d48-a139-4442-a816-b58f674841e8.png"/>
  </a>
  &#8287;&#8287;&#8287;&#8287;&#8287;
  <a href="#">
      <img height="32px" alt="Add to server" title="Youtube" src="https://user-images.githubusercontent.com/44450511/184551322-ae238ba3-ec73-4ade-8960-399cb60283bc.png"/>
  </a>
  &#8287;&#8287;&#8287;&#8287;&#8287;
    <a href="https://github.com/Waifu-Works/akane/wiki">
      <img height="32px" alt="Wiki" title="Youtube" src="https://user-images.githubusercontent.com/44450511/184551321-8dede02b-2755-4fdc-b2dd-308c9fb8f96a.png"/>
  </a>
</p>

---

Akane is a Discord bot which pretends to be a cute anime waifu.

## Highlights

-   ✔ Voice channel speech-recognition & speech
-   ✔ Fully customizable for your server
-   ✔ Open Source
-   ✔ Good for catfishing :D

## Basic Setup

This small guide will walk you through hosting your own version of the bot.

### **Step 1**: Clone the repository to your local machine.

```console
git clone https://github.com/Waifu-Works/akane.git
cd akane
```

### **Step 2**: Setup environment variables

There are 3 environnement variables you need to set:

-   `DISCORD_TOKEN` - You discord bot's token
-   `DISCORD_CLIENT_ID` - You discord bot's client id (not user id)
-   `SPEECH_API_KEY` - You Google Speech API key, you can get it [here](https://cloud.google.com/text-to-speech)

### **Step 3**: Download modules & setup commands

```console
  # install node modules
  npm i

  # deploy commands
  npm run deployCommands

  # build output files
  npm run build
```

> 📌 It takes up to 1 hour for commands to be usable after deploying.

### **Step 4**: Run the bot

Have fun!

```console
npm run start
```
