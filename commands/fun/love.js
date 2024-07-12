const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  name: 'love',
  description: "Détermine le pourcentage d'amour aléatoire entre deux personnes.",
  options: [
    {
      name: 'personne_a',
      description: 'La première personne.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'personne_b',
      description: 'La deuxième personne.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const userA = interaction.options.getUser('personne_a');
    const userB = interaction.options.getUser('personne_b');

    if (!userA || !userB) {
      await interaction.reply('Les deux personnes doivent être spécifiées.');
      return;
    }

    const lovePercentage = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setTitle('💖 Test d\'amour 💖')
      .setDescription(`Le pourcentage d'amour entre **${userA.username}** et **${userB.username}** est de **${lovePercentage}%** !`)
      .setTimestamp()
      .setFooter({ text: 'Test d\'amour', iconURL: 'https://example.com/heart-icon.png' });

    await interaction.reply({ embeds: [embed] });
  },
};
