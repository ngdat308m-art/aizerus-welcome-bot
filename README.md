# AIZERUS Welcome Bot

A Discord.js v14 bot that generates a neon welcome image with the joining member's avatar and posts it in the configured welcome channel. It does not send DMs.

## Requirements
- Node.js 20 or newer
- A Discord application/bot
- A server channel for welcome messages

## Run on Windows
1. Install Node.js LTS from https://nodejs.org/.
2. Extract this folder.
3. Copy `.env.example` to `.env`.
4. Fill in `DISCORD_TOKEN` and `WELCOME_CHANNEL_ID` in `.env`.
5. Open Command Prompt in this folder and run:
   ```bat
   npm install
   npm start
   ```

## Discord setup
1. In https://discord.com/developers/applications, open your app > Bot.
2. Enable **Server Members Intent** under Privileged Gateway Intents.
3. Invite the bot with `bot` scope and permissions `View Channels`, `Send Messages`, `Attach Files`, and `Read Message History`.
4. Copy the ID of the `#welcome` channel (enable Developer Mode in Discord, right-click channel > Copy Channel ID).
5. Put that ID in `WELCOME_CHANNEL_ID`.

## 24/7 hosting
Use an always-on Node.js host that supports a persistent worker/process. For example, on Render choose a paid **Background Worker**, connect the repository, use build command `npm install` and start command `npm start`, and set environment variables `DISCORD_TOKEN` and `WELCOME_CHANNEL_ID` in the host dashboard. Render's free web services sleep when idle and are not suitable for guaranteed 24/7 bot uptime.

Never commit `.env` or expose the bot token. If a token leaks, reset it in the Discord Developer Portal immediately.
