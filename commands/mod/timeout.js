const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('cible').value;
    const duration = interaction.options.get('durée').value;
    const reason = interaction.options.get('raison')?.value || 'Aucune raison définis';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("Cette utilisateur n'est pas sur se serveur.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("Je ne peux Timeout un Bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply('Veuillez donner une raison à ce Timeout.');
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply('La durée ne peut ètre moin de 5 secondes ou plus que 28 jours.');
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("Vous ne pouvez pas Timeout une personne avec des droits plus hauts/égaux aux vôtres.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("Je ne peut pas Timeout une personne avec des droits plus hauts/égaux aux miens.");
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`Le timeout de ${targetUser} as été mis à jour sur ${prettyMs(msDuration, { verbose: true })}\nRaison: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`${targetUser} as été Timeout ${prettyMs(msDuration, { verbose: true })}.\nRaison: ${reason}`);
    } catch (error) {
      console.log(`Une erreur s'est produite lors du Timeout: ${error}`);
    }
  },

  name: 'timeout',
  description: 'Timeout sur une perssonne .',
  options: [
    {
      name: 'cible',
      description: 'La perssonne cible du Timeout.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'durée',
      description: 'Durée du Timeout(30m, 1h, 1 day).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'raison',
      description: 'La raison du Timeout.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
