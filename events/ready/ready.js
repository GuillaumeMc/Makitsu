const { ActivityType } = require('discord.js');

module.exports = (client) => {
    const statuses = [
        { name: 'Présent et actif sur https://discord.gg/R7zWRSmZr3', type: ActivityType.Playing }, 
        { name: `présent sur ${client.guilds.cache.size} serveurs`, type: ActivityType.Listening },
        { name: `Mon créateur`, type: ActivityType.Watching }
    ];

    let index = 0;
    setInterval(() => {
        if (index === statuses.length) index = 0;
        const status = statuses[index];
        client.user.setActivity(status.name, { type: status.type, url: status.url });
        index++;
    }, 10000);
};
