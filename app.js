const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {


    const prefix = '/';

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    console.log(`The bot was used by ${message.author}`)

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    const searchParams = getSearchParams(message.content.slice(prefix.length).split(' '))
    if (searchParams.length === 0 || !searchParams) {
        return message.channel.send(`You didn't provide any search parameter, ${message.author}!`);
    }

    if (command === 'search') {
        if (!args.length || searchParams.length === 0) {
            return message.channel.send(`You didn't provide any search parameter, ${message.author}!`);
        }

        axios.get(`https://forum.andronix.app/search/query.json?term=${searchParams}`).then((response) => {

            let responseFromDiscourse = response.data;
            let topics = responseFromDiscourse.topics;
            let arrayToSend = [];
            let no = 0;

            if (!topics) {
                return message.channel.send(`We didn't found any topics related to ${searchParams}, ${message.author}!`);
            }

            topics.forEach((element) => {
                let title = element.title;
                let id = element.id;


                if (!title.includes('About')) {
                    no += 1;
                    arrayToSend.push({
                        name: `Topic ${no}`,
                        value: `**${title}** \n https://https://forum.andronix.app/t/${id}`,
                    });
                }

            })

            message.channel.send({embed: createResponse(arrayToSend)});


        }).catch(error => {
            console.log(error)
        })
    }

});


function getSearchParams(argsArray) {
    let temp = '';
    argsArray.forEach((element, index) => {
        if (index !== 0)
            temp += element + " ";
    })
    return temp;
}

function createResponse(fieldArray) {

    return {
        color: '#f59042',
        title: 'Here are the topics that match your search query! 🚀',

        fields: fieldArray,
        timestamp: new Date(),
        footer: {
            text: `Made with love by the devs of Andronix. ⭐ me at git.andronix.app`,
        },
    };
}

client.login(process.env.TOKEN);




