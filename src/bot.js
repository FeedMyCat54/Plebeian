require('dotenv').config()

const {Client} = require('discord.js')

const firebase = require('firebase/app')
const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const client = new Client()
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

    switch (CMD_NAME) {
      case 'info':
        return message.channel.send('I like completing tasks against my will and long walks by the beach. ' +
          '\nIf you want to learn more about me visit: https://github.com/FeedMyCat54/Plebeian')
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
