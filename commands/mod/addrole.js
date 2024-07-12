const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    name: 'addrole',
    description: 'Donne un rôle à un utilisateur.',
    options: [
      {
        name: 'utilisateur',
        description: "L'utilisateur à qui donner le rôle.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'role',
        description: 'Le rôle à donner.',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
  
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('utilisateur').value;
      const roleId = interaction.options.get('role').value;
  
      await interaction.deferReply();
  
      try {
        const targetUser = await interaction.guild.members.fetch(targetUserId);
        const role = await interaction.guild.roles.fetch(roleId);
  
        if (!targetUser) {
          await interaction.editReply("Cet utilisateur n'est pas sur ce serveur.");
          return;
        }
  
        if (!role) {
          await interaction.editReply("Ce rôle n'existe pas sur ce serveur.");
          return;
        }
  
        if (role.position >= interaction.guild.members.me.roles.highest.position) {
          await interaction.editReply("Je ne peux pas attribuer un rôle plus haut ou égal au mien.");
          return;
        }
  
        await targetUser.roles.add(role);
        await interaction.editReply(`Le rôle ${role.name} a été donné à ${targetUser}.`);
      } catch (error) {
        console.error(`Une erreur s'est produite lors de l'attribution du rôle: ${error}`);
        await interaction.editReply("Une erreur s'est produite lors de l'attribution du rôle.");
      }
    },
  };
  