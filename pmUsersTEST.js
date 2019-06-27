const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');

module.exports.run = async (bot, message, args) => {
    console.log(`\nSupport Command Running`);

    bot.users.get("438062192718249985").send(`You got a Support Ticket from
    \n**User Mention:** ${message.author}
    \n**User Username:** ${message.author.username}
    \n**User ID:** ${message.author.id}
    \nFrom Guild:
    \n**Guild Name:** ${message.guild.name}
    \n**Guild ID:** ${message.guild.id}
    \nThe support ticket contained:
    \n\`\`\`${args.join("")}\`\`\`
    \n.
    `)

    bot.users.get(message.author.id).send(`You Send a Support Ticket, Please Wait...
    \nThe support ticket contained:
    \n\`\`\`${args.join("")}\`\`\`
    \n.
    `)

    message.channel.send("Support Ticket sent!");

    console.log(`\nSupport Command Complete`);
}

module.exports.config = {
    name: 'support',
    aliases: ['supp'],
    description: 'sends a support ticket',
    usage: 'support message',
    noalias: "No Aliases"
}