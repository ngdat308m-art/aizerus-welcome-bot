require('dotenv').config();
const { Client, GatewayIntentBits, AttachmentBuilder, Events } = require('discord.js');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

const token = process.env.DISCORD_TOKEN;
const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
if (!token || !welcomeChannelId) {
  console.error('Missing DISCORD_TOKEN or WELCOME_CHANNEL_ID. Copy .env.example to .env and fill them in.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

async function createWelcomeCard(member) {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Dark neon background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#080b18');
  bg.addColorStop(0.55, '#171044');
  bg.addColorStop(1, '#071c2b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Decorative neon rings and lines
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(1050, 90, 90 + i * 28, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 520); ctx.lineTo(430, 630); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(800, 0); ctx.lineTo(1200, 180); ctx.stroke();
  ctx.restore();

  // Border
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 5;
  ctx.roundRect(18, 18, width - 36, height - 36, 30);
  ctx.stroke();

  // Avatar image with circular clip and neon outline
  const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 256 });
  const avatar = await loadImage(avatarUrl);
  const cx = width / 2;
  const cy = 205;
  const radius = 92;
  ctx.save();
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 28;
  ctx.beginPath(); ctx.arc(cx, cy, radius + 7, 0, Math.PI * 2);
  ctx.fillStyle = '#22d3ee'; ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(avatar, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  // Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px sans-serif';
  ctx.fillText('WELCOME TO AIZERUS', cx, 365);

  ctx.fillStyle = '#a5f3fc';
  ctx.font = 'bold 34px sans-serif';
  const displayName = member.user.globalName || member.user.username;
  const safeName = displayName.length > 28 ? displayName.slice(0, 25) + '...' : displayName;
  ctx.fillText(safeName, cx, 425);

  ctx.fillStyle = '#d1d5db';
  ctx.font = '26px sans-serif';
  ctx.fillText('You are member #' + member.guild.memberCount, cx, 475);

  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ENJOY YOUR STAY  •  RESPECT EVERYONE', cx, 555);

  return canvas.toBuffer('image/png');
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`AIZERUS welcome bot online as ${readyClient.user.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const channel = await member.guild.channels.fetch(welcomeChannelId).catch(() => null);
    if (!channel || !channel.isTextBased() || !channel.send) {
      console.error('Welcome channel not found or is not a text channel. Check WELCOME_CHANNEL_ID.');
      return;
    }
    const imageBuffer = await createWelcomeCard(member);
    const attachment = new AttachmentBuilder(imageBuffer, { name: 'aizerus-welcome.png' });
    await channel.send({
      content: `👋 Chào mừng ${member} đến với **AIZERUS**! Hãy đọc nội quy và cùng mọi người vui vẻ nhé.`,
      files: [attachment],
      allowedMentions: { users: [member.id] },
    });
  } catch (error) {
    console.error('Failed to send welcome message:', error);
  }
});

client.login(token).catch((error) => {
  console.error('Discord login failed. Check DISCORD_TOKEN:', error.message);
  process.exit(1);
});
