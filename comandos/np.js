const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Muestra la canción que está sonando (Now Playing)"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player || !player.queue || player.queue.length === 0) {
            return interaction.reply({ content: "❌ No hay música reproduciéndose.", ephemeral: true });
        }

        const current = player.queue[0];
        const position = player.position || 0;
        const length = current.info.length;

        // Create a simple progress bar
        const totalBlocks = 15;
        const progress = Math.round((position / length) * totalBlocks);
        
        let bar = "";
        for (let i = 0; i < totalBlocks; i++) {
            bar += i === progress ? "🔘" : "▬";
        }

        const formatTime = (ms) => {
            const minutes = Math.floor(ms / 60000);
            const seconds = ((ms % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        };

        let reply = `**🎶 Reproduciendo ahora:**\n${current.info.title}\n`;
        if (current.info.isStream) {
            reply += `\n[${bar}] 🔴 EN DIRECTO`;
        } else {
            reply += `\n[${bar}] ${formatTime(position)} / ${formatTime(length)}`;
        }

        interaction.reply(reply);
    }
};
