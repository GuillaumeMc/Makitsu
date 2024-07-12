const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const devs = require('../../config.json').devs; // Assurez-vous que votre config.json a un champ "devs" qui est un tableau d'IDs de développeurs

module.exports = {
  name: 'say',
  description: 'Envoyer un message dans un salon spécifique.',
  options: [
    {
      name: 'message',
      description: 'Le message à envoyer.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'salon',
      description: 'Le salon où envoyer le message.',
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText], // Utilise l'entier correspondant au type de canal textuel
      required: true,
    },
  ],
  botPermissions: [PermissionFlagsBits.SendMessages],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const messageContent = interaction.options.getString('message');
    const targetChannel = interaction.options.getChannel('salon');

    await interaction.deferReply({ ephemeral: true });

    if (!targetChannel || targetChannel.type !== ChannelType.GuildText) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Le salon spécifié n'est pas valide ou n'est pas un salon textuel.")
        .setTimestamp()
        .setFooter({ text: 'Say', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Vérifie si l'utilisateur est un admin ou un dev
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !devs.includes(interaction.user.id)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Vous n'avez pas la permission d'utiliser cette commande.")
        .setTimestamp()
        .setFooter({ text: 'Say', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await targetChannel.send(messageContent);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Message envoyé')
        .setDescription(`Message envoyé dans ${targetChannel}: "${messageContent}"`)
        .setTimestamp()
        .setFooter({ text: 'Say', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'envoi du message: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Une erreur s'est produite lors de l'envoi du message.")
        .setTimestamp()
        .setFooter({ text: 'Say', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
