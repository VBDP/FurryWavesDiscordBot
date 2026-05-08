const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Salta la canción actual"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No hay música", ephemeral: true });

        player.stopTrack();
        interaction.reply("⏭️ Saltado");
    }
};