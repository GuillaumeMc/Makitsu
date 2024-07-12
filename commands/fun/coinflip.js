const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'Lance une pièce virtuelle (pile ou face).',
  options: [],
  
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });
  
    // Génère un nombre aléatoire (0 ou 1)
    const result = Math.random() < 0.5 ? 'Pile' : 'Face';
    
    await interaction.editReply(`🪙 Tu as lancé une pièce et obtenu : **${result}** !`);
  },
};
