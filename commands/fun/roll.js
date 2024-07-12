const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
  } = require('discord.js');
  
  module.exports = {
    name: 'roll',
    description: 'Lance un dé virtuel (1-6).',
    options: [],
    
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      await interaction.deferReply({ ephemeral: false });
    
      // Génère un nombre aléatoire entre 1 et 6
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      
      await interaction.editReply(`🎲 Tu as lancé un dé et obtenu : **${diceRoll}** !`);
    },
  };
  