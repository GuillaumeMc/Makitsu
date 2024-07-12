const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');

// Fonction pour convertir une durée en secondes
function convertToSeconds(duration, unit) {
  switch (unit.toLowerCase()) {
    case 'secondes':
    case 'seconde':
      return duration;
    case 'minutes':
    case 'minute':
      return duration * 60;
    case 'heures':
    case 'heure':
      return duration * 60 * 60;
    case 'jours':
    case 'jour':
      return duration * 60 * 60 * 24;
    default:
      return 0;
  }
}

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser('cible');
    const duration = interaction.options.getInteger('duree');
    const unit = interaction.options.getString('unite').toLowerCase(); // Option pour l'unité de la durée
    const reason = interaction.options.getString('raison') || 'Aucune raison définie';

    await interaction.deferReply();

    const targetMember = await interaction.guild.members.fetch(targetUser.id);

    if (!targetMember) {
      await interaction.editReply("Cet utilisateur n'est pas sur ce serveur.");
      return;
    }

    if (targetMember.id === interaction.guild.ownerId) {
      await interaction.editReply("Vous ne pouvez pas mute le propriétaire du serveur.");
      return;
    }

    let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole) {
      try {
        muteRole = await interaction.guild.roles.create({
          name: 'Muted',
          permissions: []
        });

        interaction.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.create(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SPEAK: false
          });
        });
      } catch (error) {
        console.error(`Une erreur s'est produite lors de la création du rôle de mute: ${error}`);
        await interaction.editReply("Une erreur s'est produite lors de la création du rôle de mute.");
        return;
      }
    }

    const muteDuration = convertToSeconds(duration, unit);

    try {
      await targetMember.roles.add(muteRole.id, reason);
      await interaction.editReply(`${targetMember} a été muté pour: ${reason}`);

      // Désactivation automatique du mute après la durée spécifiée
      setTimeout(async () => {
        if (targetMember.roles.cache.has(muteRole.id)) {
          await targetMember.roles.remove(muteRole.id);
          await interaction.followUp(`Le mute de ${targetMember} a expiré.`);
        }
      }, muteDuration * 1000); // Convertir en millisecondes pour setTimeout
    } catch (error) {
      console.error(`Une erreur s'est produite lors du mute de l'utilisateur: ${error}`);
      await interaction.editReply("Une erreur s'est produite lors du mute de l'utilisateur.");
    }
  },

  name: 'mute',
  description: 'Mute un membre du serveur.',
  options: [
    {
      name: 'cible',
      description: 'La personne cible du mute.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'duree',
      description: 'La durée du mute.',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'unite',
      description: "L'unité de la durée (secondes, minutes, heures, jours).",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'secondes',
          value: 'secondes',
        },
        {
          name: 'minutes',
          value: 'minutes',
        },
        {
          name: 'heures',
          value: 'heures',
        },
        {
          name: 'jours',
          value: 'jours',
        },
      ],
      required: true,
    },
    {
      name: 'raison',
      description: 'La raison du mute.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels],
};
