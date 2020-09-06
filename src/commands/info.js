module.exports = {
  name: 'info',
  description: 'Information about the bot',
  execute(message) {
    message.channel.send(
      'I like completing tasks against my will and long walks by the beach. ' +
      '\nIf you want to learn more about me visit: https://github.com/FeedMyCat54/Plebeian')
  }
}
