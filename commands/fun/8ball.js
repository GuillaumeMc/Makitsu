const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  // Réponses possibles de la 8ball
  const responses = [
    "C'est certain.",
    "C'est décidément ainsi.",
    "Sans aucun doute.",
    "Oui, absolument.",
    "Vous pouvez compter dessus.",
    "Je pense que oui.",
    "Probablement.",
    "Les perspectives sont bonnes.",
    "Oui, tout à fait.",
    "Peut-être.",
    "Demandez à nouveau plus tard.",
    "Mieux vaut ne pas vous le dire maintenant.",
    "Je ne peux pas prédire maintenant.",
    "Concentrez-vous et demandez à nouveau.",
    "Ne comptez pas dessus.",
    "Ma réponse est non.",
    "Mes sources disent non.",
    "Les perspectives ne sont pas si bonnes.",
    "Très douteux.",
    "Non."
  ];
  
  module.exports = {
    name: '8ball',
    description: 'Posez une question à la Magic 8-ball.',
    options: [
      {
        name: 'question',
        description: 'La question à poser à la 8-ball.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      const question = interaction.options.getString('question');
  
      await interaction.deferReply({ ephemeral: false });
  
      // Sélection aléatoire d'une réponse de la liste
      const randomIndex = Math.floor(Math.random() * responses.length);
      const response = responses[randomIndex];
  
      await interaction.editReply(response);
    },
  };
  