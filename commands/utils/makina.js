const { version, EmbedBuilder } = require('discord.js');
const os = require('os');
const config = require('../../config.json');

module.exports = {
  name: 'makitsu',
  description: 'Affiche les informations de makina',

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const uptime = process.uptime();
    const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usedMemoryMB = (usedMemory / 1024 / 1024).toFixed(2);
    const totalMemoryMB = (totalMemory / 1024 / 1024).toFixed(2);

    const loadAverage = os.loadavg()[0].toFixed(2); // 1-minute load average

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Statut de Makitsu')
      .addFields(
        { name: 'Temps de fonctionnement', value: uptimeString, inline: false },
        { name: 'Ping', value: `${client.ws.ping}ms`, inline: false },
        { name: 'Dernier redémarrage', value: new Date(Date.now() - uptime * 1000).toLocaleString(), inline: false },
        { name: 'Version de Discord.js', value: version, inline: false },
        { name: 'ID du développeur', value: config.devs, inline: false },
        { name: 'Utilisation de la mémoire', value: `${usedMemoryMB}MB / ${totalMemoryMB}MB`, inline: false },
        { name: 'Charge CPU (1m)', value: `${loadAverage}`, inline: false },
        { name: 'Inviter Makitsu?', value: '[clique ici](https://discord.com/oauth2/authorize?client_id=1250009377654702090&scope=bot&permissions=8)', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: 'Makitsu 2024', iconURL: client.user.displayAvatarURL() });

    await interaction.editReply({ embeds: [embed] });
  },
};
