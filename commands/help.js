const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');

const prefix = config.prefix;

//Main loop for executing command
module.exports.run = async(client, message, args) => {
    let messagecontent = message.content;

    //if (args[0] == "help") return message.channel.send(`Try ${prefix}help instead.`);

    if (args[0]) {
        let cmd = args[0];
        if (client.commands.has(cmd)) {
            cmd = client.commands.get(cmd);
            var sendHelpEmbed = new Discord.RichEmbed()
            .setColor(colors.cyan)
            .setAuthor('TeamUp Help', message.guild.iconURL)
            // .setDescription(`The bot prefix is: ${prefix}\n\n
            //     **Command:** ${cmd.config.name}\n
            //     **Description:** ${cmd.config.description}\n
            //     **Usage:** ${cmd.config.usage || "No Usage"}\n
            //     **Aliases:** ${cmd.config.aliases}`)
            .addField("Prefix", `${prefix}`)
            .addField("Command", `${cmd.config.name}`)
            .addField("Description", `${cmd.config.description}`)
            .addField("Usage", `${cmd.config.usage || "No Usage"}`)

            .addField("Example", `${cmd.config.example}`)
            .addField("Aliases", `${cmd.config.aliases}`);
            message.channel.send(sendHelpEmbed);
        } else {
            message.channel.send("I don't recognize " + "`" + messagecontent + "`" + " as a command. Type `" + `${prefix}` + " help` for a list of commands");
        }
    }

    if (!args[0]) {
        let embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setAuthor('Help is here!', message.guild.iconURL)
        .setDescription(`The bot prefix is: **${prefix}**\n
        These are the commands I can understand!`)
        .addField('Commands', '``' + prefix + ' help`` \n ``' + prefix + ' notify`` \n ``' + prefix + ' group``');
        // .setFooter("TeamUp Bot 2019", client.user.displayAvatarURL);
        message.channel.send(embed);
    }
}

//Config for the command here
module.exports.config = {
    name: 'help',
    aliases: ['h', 'commands', 'halp', 'helpme'],
    description: 'Displays all the commands I know!',

    usage: 'help [command]',
    example: '`' + `${prefix}` + ' help group`',

    noalias: "No Aliases"
}
