module.exports = {
  name: 'set_prefix',
  description: 'Changes the prefix for this server',
  execute(message, args, prefixes) {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (!args.length) {
        return message.channel.send('You need to specify the new prefix.')
      } else if (args.length > 1) {
        return message.channel.send('The prefix cannot have spaces.')
      }

      const newPrefix = args[0]
      prefixes.set(message.guild.id, newPrefix)
      return message.channel.send(`The prefix has been changed to: ${newPrefix}`)
    } else {
      return message.channel.send('You need the administrator permission for this command.')
    }
  }
}