const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    name: 'purge',
    description: 'Supprime un nombre défini de messages dans le chat.',
    options: [
      {
        name: 'nombre',
        description: 'Le nombre de messages à supprimer (entre 1 et 100).',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
        max_value: 100,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
  
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      const numberOfMessages = interaction.options.getInteger('nombre');
  
      await interaction.deferReply({ ephemeral: true });
  
      try {
        const messages = await interaction.channel.bulkDelete(numberOfMessages, true);
  
        await interaction.editReply(`🗑️ ${messages.size} messages ont été supprimés.`);
      } catch (error) {
        console.error(`Une erreur s'est produite lors de la suppression des messages: ${error}`);
        await interaction.editReply("Une erreur s'est produite lors de la suppression des messages.");
      }
    },
  };
  