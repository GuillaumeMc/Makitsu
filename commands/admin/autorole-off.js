const { Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('AutoRole désactivé')
          .setDescription('AutoRole est actuellement désactivé sur ce serveur. Utilisez `/autorole-config` pour le paramétrer.')
          .setTimestamp()
          .setFooter({ text: 'Commande AutoRole Off', iconURL: 'https://example.com/icon.png' });

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('AutoRole désactivé')
        .setDescription('AutoRole a été désactivé avec succès pour ce serveur. Utilisez `/autorole-config` pour le paramétrer de nouveau.')
        .setTimestamp()
        .setFooter({ text: 'Commande AutoRole Off', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Erreur')
        .setDescription("Une erreur s'est produite lors de la désactivation de l'AutoRole.")
        .setTimestamp()
        .setFooter({ text: 'Commande AutoRole Off', iconURL: 'https://example.com/icon.png' });

      await interaction.editReply({ embeds: [embed] });
    }
  },

  name: 'autorole-off',
  description: 'Désactive AutoRole pour ce serveur.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
