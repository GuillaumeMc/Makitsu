const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config.json');

module.exports = async (client) => {
  const logServer = client.guilds.cache.get(config.logServerId);
  if (!logServer) {
    console.error('Log server non trouvé');
    return;
  }

  const logChannel = logServer.channels.cache.get(config.logChannelId);
  if (!logChannel) {
    console.error('Log channel non trouvé');
    return;
  }

  try {
    const serverCount = client.guilds.cache.size;
    const serverDetailsPromises = client.guilds.cache.map(async guild => {
      try {
        // Find the first text-based channel where the bot can create an invite
        const textChannel = guild.channels.cache.find(channel => 
          channel.isTextBased() && 
          channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
        );
        
        // If no such channel exists, handle the error gracefully
        if (!textChannel) {
          return `${guild.name}: Lien d'invitation non disponible (permissions manquantes)`;
        }
        
        const invite = await textChannel.createInvite({ maxAge: 0 });
        return `${guild.name}: [clique ici](${invite.url})`;
      } catch (error) {
        console.error(`Erreur lors de la création de l'invitation pour ${guild.name}: ${error}`);
        return `${guild.name}: Lien d'invitation non disponible`;
      }
    });

    const serverDetails = await Promise.all(serverDetailsPromises);
    const serverNamesAndLinks = serverDetails.join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Statut du Bot')
      .setDescription('Makina a suivi son processus de démarrage avec succès.')
      .addFields(
        { name: 'Nombre de serveurs', value: `${serverCount}`, inline: true },
        { name: 'Noms des serveurs et liens', value: serverNamesAndLinks, inline: false }
      )
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    console.log('Démarrage terminé.');
  } catch (error) {
    console.error(`Erreur d'envoi : ${error}`);
  }
};
