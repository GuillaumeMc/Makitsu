const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Obtiens des informations sur un utilisateur.',
  options: [
    {
      name: 'utilisateur',
      description: "L'utilisateur dont vous souhaitez obtenir des informations.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissionsRequired: [],
  botPermissions: [PermissionFlagsBits.SendMessages],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('utilisateur').value;

    await interaction.deferReply();

    try {
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
        await interaction.editReply("Cet utilisateur n'est pas sur ce serveur.");
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Informations sur ${targetUser.user.username}`)
        .setThumbnail(targetUser.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Nom d\'utilisateur', value: targetUser.user.username, inline: true },
          { name: 'ID de l\'utilisateur', value: targetUser.id, inline: true },
          { name: 'Date de création du compte', value: targetUser.user.createdAt.toDateString(), inline: true },
          { name: 'Date d\'adhésion au serveur', value: targetUser.joinedAt.toDateString(), inline: true },
          { name: 'Rôles', value: targetUser.roles.cache.map(role => role.name).join(', ') || 'Aucun rôle', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Informations de l\'utilisateur' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de la récupération des informations de l'utilisateur: ${error}`);
      await interaction.editReply("Une erreur s'est produite lors de la récupération des informations de l'utilisateur.");
    }
  },
};
