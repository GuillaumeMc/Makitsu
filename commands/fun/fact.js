const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

const facts = [
  "Le miel ne se gâte jamais. Vous pouvez conserver le miel pendant des milliers d'années.",
  "Les chats ont cinq doigts à chaque patte avant, mais seulement quatre à chaque patte arrière.",
  "Le cerveau humain est plus actif pendant la nuit que pendant la journée.",
];

module.exports = {
  name: 'fact',
  description: 'Affiche un fait aléatoire.',
  options: [],
  
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });
  
    // Sélection aléatoire d'un fait
    const randomIndex = Math.floor(Math.random() * facts.length);
    const fact = facts[randomIndex];
    
    await interaction.editReply(`🧠 Voici un fait intéressant : \n${fact}`);
  },
};
