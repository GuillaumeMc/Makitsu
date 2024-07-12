const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('Vous ne pouvez faire cela que dans un serveur.');
      return;
    }

    const targetRoleId = interaction.options.get('role').value;

    try {
      await interaction.deferReply();

      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        if (autoRole.roleId === targetRoleId) {
          const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Configuration AutoRole')
            .setDescription('AutoRole a déjà été configuré pour ce rôle. Pour désactiver, faites `/autorole-off`.')
            .setTimestamp()
            .setFooter({ text: 'AutoRole Configuration', iconURL: 'https://example.com/icon.png' });

          await interaction.editReply({ embeds: [embed] });
          return;
        }

        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        });
      }

      await autoRole.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Configuration AutoRole')
        .setDescription('AutoRole est à présent configuré. Pour désactiver, faites `/autorole-off`.')
        .setTimestamp()
        .setFooter({ text: 'AutoRole Configuration', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription('Une erreur s\'est produite lors de la configuration de l\'AutoRole.')
        .setTimestamp()
        .setFooter({ text: 'AutoRole Configuration', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
    }
  },

  name: 'autorole-config',
  description: 'Configurer un AutoRole pour ce serveur.',
  options: [
    {
      name: 'role',
      description: 'Le rôle sélectionné.',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
