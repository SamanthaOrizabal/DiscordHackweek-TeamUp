# TeamUp <img align="right" width="185" height="185" src="https://cdn.discordapp.com/attachments/591432890093404256/594266247118716928/teamup_logo.png">
![][badge-lisence]
![][badge-issues]
![][badge-pull]

### Entry to [Discord Hack Week 2019](https://blog.discordapp.com/discord-community-hack-week-build-and-create-alongside-us-6b2a7b7bba33)!

## Inspiration
We've always loved the idea of planning events right in Discord. To solve our problem, we created TeamUp: the ultimate event bot!

## What it does
Create groups based on the desired game and time, get a private message when it's time for you to play!

### Features
- Notifications: get notified by private message
- Groups: create groups based on custom events, games or gatherings
- Database: all data is stored in a database to allow our bot to run on multiple servers and keep track of events even if it goes offline
- Filters: search for groups to play with by game

## Commands
Here are the commands available. Our prefix is **tu?**

#### tu? help
Displays the help message containing all the available commands. Can also be used to find information about other commands.

#### tu? notify
Sets reminders for yourself and receive them by private message. Choose a date, time, and message.

#### tu? group
Used to create, join or manage a group. View information about a group or see a list of all the groups on your server.

## How we built it
- [Node.js](https://nodejs.org): a JavaScript runtime built on Chrome's V8 JavaScript engine
- [discord.js](https://discord.js.org): a powerful Node.js module to interact with the Discord API very easily
- [MongoDB](https://www.mongodb.com): a cross-platform document-oriented database program

## Challenges we ran into
Oh boy... Where do we even start? 😂

For many of us, this was our first time creating a Discord bot or even working with Node.js. We spent the first few days figuring out how to use the discord.js module and the rest of our time building, debugging, and testing our bot (notice how sleep isn't part of our routine 😴).

Our biggest challenge was the problem with whitespace. Particularly leading and trailing whitespace. If a group name or game were to contain leading and trailing whitespace, it would be trimmed when stored into MongoDB and would remain trimmed when reading from the database. However, to grab a group by name, we would have to type in the **exact** name, including whitespace or else the database query would fail. This is a major problem since leading and trailing whitespace are caused by typos, and can lead to frustration when our group isn't found when we seem to be typing in the correct name.

## What's next for TeamUp
- Custom prefix
- User settings
- Queue for groups

## Want to use it?
Feel free to download the bot to use for yourself. Just create a "auth.json" file that includes your secret token as a "token" property and add it to the root of the bot's directory.
```
//auth.json
{
  "token": "YOURBOTSTOEKN"
}
```
Make sure node is installed, then use 'node bot.js' to start the bot!
We may look at hosting this bot ourselves in the future if there is enough interest. 

## Contributors
- DeusIgnis#6752
- kevnl#6554
- ERGC | Xander#6773
- samvo#3883
- 🅱iderman#5200

[badge-lisence]: https://img.shields.io/github/license/SamanthaOrizabal/DiscordHackweek-TeamUp.svg?style=flat-square
[badge-issues]: https://img.shields.io/github/issues/SamanthaOrizabal/DiscordHackweek-TeamUp.svg?style=flat-square
[badge-pull]: https://img.shields.io/github/issues-pr/SamanthaOrizabal/DiscordHackweek-TeamUp.svg?style=flat-square
