const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { Shoukaku, Connectors } = require('shoukaku');
const fs = require('fs');
const { token } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔥 LAVALINK CONFIG
const nodes = [
  {
    name: "Local Node",
    url: "localhost:2333",
    auth: "youshallnotpass",
    secure: false
  },
  {
    name: "Public Node",
    url: "lavalink.jirayu.net:443",
    auth: "youshallnotpass",
    secure: true
  }
];

client.shoukaku = new Shoukaku(new Connectors.DiscordJS(client), nodes);

// 🔧 comandos
client.commands = new Collection();

// Cargar comandos
const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./comandos/${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] El comando en ${file} no tiene "data" o "execute".`);
  }
}

client.once('clientReady', async () => {
  console.log(`☕ Bot conectado como ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(client.token);
  const commandsData = client.commands.map(c => c.data.toJSON());

  try {
    console.log(`⏳ Refrescando ${commandsData.length} (/) comandos...`);
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commandsData },
    );
    console.log('✅ Comandos recargados con éxito.');
  } catch (error) {
    console.error('❌ Error al recargar comandos:', error);
  }

  console.log(`✅ Comandos cargados en cache: ${client.commands.map(c => c.data.name).join(', ')}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  console.log(`[DEBUG] Interacción recibida de ${interaction.user.username}: "/${interaction.commandName}"`);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorMsg = `❌ Error ejecutando el comando: \`${error.message}\``;
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMsg, ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: errorMsg, ephemeral: true }).catch(() => {});
    }
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  // Ignorar si el bot no está en un canal
  if (!oldState.guild.members.me.voice.channel) return;

  // Si alguien se sale de un canal o se mueve de canal
  if ((oldState.channelId && !newState.channelId) || (oldState.channelId && oldState.channelId !== newState.channelId)) {
    const channel = oldState.channel;

    // Comprobar si el bot está en el canal del que salieron
    if (channel && channel.id === oldState.guild.members.me.voice.channelId) {
      // Filtrar a los miembros que no son bots
      const nonBots = channel.members.filter(member => !member.user.bot);

      // Si no quedan usuarios que no sean bots, desconectar al bot
      if (nonBots.size === 0) {
        const player = client.shoukaku.players.get(oldState.guild.id);
        if (player) {
          client.shoukaku.leaveVoiceChannel(oldState.guild.id);
        }
      }
    }
  }
});

client.shoukaku.on('ready', (name) => console.log(`✅ Lavalink Node "${name}" está listo.`));
client.shoukaku.on('error', (name, error) => console.error(`❌ Error en el Nodo "${name}":`, error));
client.shoukaku.on('close', (name, code, reason) => console.warn(`⚠️ Conexión cerrada en el Nodo "${name}". Código: ${code}, Razón: ${reason || 'Sin razón'}`));
client.shoukaku.on('disconnect', (name, count) => console.warn(`🔄 Nodo "${name}" desconectado. Intento de reconexión #${count}`));
client.shoukaku.on('reconnect', (name) => console.log(`✅ Nodo "${name}" se ha reconectado con éxito.`));



client.login(token);

