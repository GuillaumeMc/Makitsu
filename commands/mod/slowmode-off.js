const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetChannel = interaction.options.getChannel('salon');

    if (!targetChannel || targetChannel.type !== ChannelType.GuildText) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription('Veuillez spécifier un salon texte valide.');

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      return;
    }

    await interaction.deferReply();

    try {
      await targetChannel.setRateLimitPerUser(0);

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Slowmode Désactivé')
        .setDescription(`Le slowmode a été désactivé pour le salon ${targetChannel}.`);

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de la désactivation du slowmode : ${error}`);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Une erreur s'est produite lors de la désactivation du slowmode.");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },

  name: 'slowmode-off',
  description: 'Désactive le slowmode dans un salon spécifique.',
  options: [
    {
      name: 'salon',
      description: 'Le salon où désactiver le slowmode.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channelTypes: [ChannelType.GuildText],
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
