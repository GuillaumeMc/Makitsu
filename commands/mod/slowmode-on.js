const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetChannel = interaction.options.getChannel('salon');
    const duration = interaction.options.getInteger('duree');
    const unit = interaction.options.getString('unite');

    if (!targetChannel || targetChannel.type !== 0) { // 0 corresponds to 'GUILD_TEXT'
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Le salon spécifié n'est pas valide ou n'est pas un salon textuel.")
        .setTimestamp()
        .setFooter({ text: 'Erreur de slowmode' });

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.deferReply();

    let slowmodeDuration;
    switch (unit) {
      case 'secondes':
        slowmodeDuration = duration;
        break;
      case 'minutes':
        slowmodeDuration = duration * 60;
        break;
      case 'heures':
        slowmodeDuration = duration * 60 * 60;
        break;
      case 'jours':
        slowmodeDuration = duration * 60 * 60 * 24;
        break;
      default:
        slowmodeDuration = 0;
    }

    try {
      await targetChannel.setRateLimitPerUser(slowmodeDuration);
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Slowmode défini')
        .setDescription(`Le slowmode de ${duration} ${unit} a été défini dans ${targetChannel}.`)
        .setTimestamp()
        .setFooter({ text: 'Slowmode défini' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de la définition du slowmode : ${error}`);

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Une erreur s'est produite lors de la définition du slowmode.")
        .setTimestamp()
        .setFooter({ text: 'Erreur de slowmode' });

      await interaction.editReply({ embeds: [embed] });
    }
  },

  name: 'slowmode-on',
  description: 'Définit le slowmode dans un salon spécifié.',
  options: [
    {
      name: 'salon',
      description: 'Le salon où définir le slowmode.',
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [0], // 0 corresponds to 'GUILD_TEXT'
      required: true,
    },
    {
      name: 'duree',
      description: 'La durée du slowmode.',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'unite',
      description: "L'unité de temps pour la durée.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'secondes', value: 'secondes' },
        { name: 'minutes', value: 'minutes' },
        { name: 'heures', value: 'heures' },
        { name: 'jours', value: 'jours' }
      ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
