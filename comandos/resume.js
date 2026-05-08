const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Reanuda la música pausada"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No hay música reproduciéndose", ephemeral: true });

        if (!player.paused) return interaction.reply({ content: "⚠️ La música ya está sonando", ephemeral: true });

        player.setPaused(false);
        interaction.reply("▶️ Música reanudada");
    }
};