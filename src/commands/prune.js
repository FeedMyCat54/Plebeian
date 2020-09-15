module.exports = {
  name: 'prune',
  description: 'deletes a number of messages ignoring the pinned ones',
  execute(message, args) {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (!args.length) {
        return message.channel.send('You need to specify the number of messages to delete.')
      } else if (isNaN(args[0])) {
        return message.channel.send('Please insert a valid number.')
      } else if (args[0] <= 1 || args[0] > 100) {
        return message.channel.send('Please enter a number between 1 and 150.')
      }
      message.channel.messages.fetch({limit: args[0]})
        .then(fetchedMessages => {
          const messagesToPrune = fetchedMessages.filter(msg => !msg.pinned)
          return message.channel.bulkDelete(messagesToPrune, true)
        })
        .then(prunedMessages => {
          message.channel.send(`Deleted ${prunedMessages.size} message${prunedMessages.size !== 1 ? 's' : ''}.`)
        })
        .catch(console.error)

    } else {
      return message.channel.send('You need the administrator permission for this command.')
    }
  }
}