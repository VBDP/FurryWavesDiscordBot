const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Mezcla la cola de reproducción"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player || !player.queue || player.queue.length <= 2) {
            return interaction.reply({ content: "❌ No hay suficientes canciones en la cola para mezclar.", ephemeral: true });
        }

        // We don't shuffle the first song (index 0) because it's currently playing
        const current = player.queue.shift();
        
        // Fisher-Yates shuffle for the rest of the queue
        for (let i = player.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [player.queue[i], player.queue[j]] = [player.queue[j], player.queue[i]];
        }
        
        // Put the current song back at the beginning
        player.queue.unshift(current);

        interaction.reply("🔀 **Cola mezclada aleatoriamente.**");
    }
};
