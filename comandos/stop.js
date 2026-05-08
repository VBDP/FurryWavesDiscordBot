const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Para la música y desconecta al bot del canal"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No hay música", ephemeral: true });

        interaction.client.shoukaku.leaveVoiceChannel(interaction.guild.id);
        interaction.reply("⛔ Música parada y bot desconectado del canal");
    }
};