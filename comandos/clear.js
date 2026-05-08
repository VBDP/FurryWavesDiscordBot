const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Limpia la cola de reproducción"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player || !player.queue || player.queue.length <= 1) {
            return interaction.reply({ content: "❌ No hay canciones en espera para borrar.", ephemeral: true });
        }

        // Keep the currently playing track, clear the rest
        const current = player.queue[0];
        player.queue = [current];

        interaction.reply("🗑️ **Se ha vaciado la cola de canciones en espera.**");
    }
};
