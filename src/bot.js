require('dotenv').config()
const fs = require('fs')

const {Client, Collection} = require('discord.js')

const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccount.json')

const NodeCache = require('node-cache')

const prefixes = new NodeCache()

prefixes.on('set', async (key, value) => {
  await db.collection('guilds').doc(key).update({
    prefix: value
  })
  await db.collection('prefixes').doc(key).update({
    prefix: value
  })
})

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

const DEFAULT_PREFIX = '$'

client.on('ready', async () => {
  // Cache the prefixes
  const snapshot = await db.collection('prefixes').get()
  snapshot.forEach(doc => {
    prefixes.set(doc.id, doc.get('prefix'))
  })
  console.log('Plebeian is ready!')
})

client.on('message', (message) => {
  if (message.author.bot) return

  const serverPrefix  = prefixes.get(message.guild.id).toString()
  if (message.content.trim().startsWith(serverPrefix)) {
    const [CMD_NAME, ...args] = message.content.trim()
      .substring(serverPrefix.length)
      .split(/\s+/)

    if (!client.commands.has(CMD_NAME)) return

    const command = client.commands.get(CMD_NAME);

    try {
      command.execute(message, args, prefixes)
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
    'prefix': DEFAULT_PREFIX
  })
  await db.collection('prefixes').doc(guildData.id).set({
    prefix: DEFAULT_PREFIX
  })
  prefixes.set(guildData.id, DEFAULT_PREFIX)
})

client.on('guildDelete', async guildData => {
  await db.collection('guilds').doc(guildData.id).delete()
  await db.collection('prefixes').doc(guildData.id).delete()
  prefixes.del(guildData.id)
})

client.login(process.env.PLEBEIAN_BOT_TOKEN)
