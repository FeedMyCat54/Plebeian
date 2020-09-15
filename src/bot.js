require('dotenv').config()
const fs = require('fs')

const {Client, Collection} = require('discord.js')

const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
client.commands = new Collection()
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`../src/commands/${file}`)
  client.commands.set(command.name, command)
}

const PREFIX = '$'

client.on('ready', () => {
  console.log('Plebeian is ready!')
})

client.on('message', (message) => {
  if (message.author.bot) return

  if (message.content.trim().startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content.trim()
      .substring(PREFIX.length)
      .split(/\s+/)

    if (!client.commands.has(CMD_NAME)) return

    const command = client.commands.get(CMD_NAME);

    try {
      command.execute(message, args)
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  }
})

client.on('guildCreate', async guildData => {
  await db.collection('guilds').doc(guildData.id).set({
    'guildId': guildData.id,
    'guildName': guildData.name,
    'prefix': PREFIX
  })
})

client.login(process.env.PLEBEIAN_BOT_TOKEN)
