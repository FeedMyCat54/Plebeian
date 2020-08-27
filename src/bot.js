require('dotenv').config()

const { Client } = require('discord.js')

const client = new Client()

client.on('ready', () => {
  console.log('Plebeian is ready!')
})

client.login(process.env.PLEBEIAN_BOT_TOKEN)
