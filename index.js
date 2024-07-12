const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const config = require('./config.json');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
  ],
});
(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongo);
    console.log('Connexion à MongoDB réussie.');

    eventHandler(client);

    client.login(config.token);
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
})();
