const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('cible').value;
    const reason =
      interaction.options.get('raison')?.value || 'Aucune raison définis';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("Cette utilisateur n'est pas sur se serveur.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Vous ne pouvez pas expulser le propriétaire."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Vous ne pouvez pas expulser une personne avec des droits plus hauts/égaux aux vôtres."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Je ne peut pas expulser une personne avec des droits plus hauts/égaux aux miens."
      );
      return;
    }

    try {
      await targetUser.kick({ reason });
      await interaction.editReply(
        `${targetUser} as été expulser pour: ${reason}`
      );
    } catch (error) {
      console.log(`Une erreur s'est produite lors de l'expulsiion: ${error}`);
    }
  },

  name: 'expulser',
  description: 'Expulse du serveur la perssonne souhaiter.',
  options: [
    {
      name: 'cible',
      description: 'La perssonne cible de l\'expulsion.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'raison',
      description: 'La raison de l\'expulsion.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};
