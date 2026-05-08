const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nightcore")
        .setDescription("Activa o desactiva el efecto Nightcore")
        .addStringOption(option =>
            option.setName("modo")
                .setDescription("Encender o apagar")
                .addChoices(
                    { name: 'On', value: 'on' },
                    { name: 'Off', value: 'off' }
                )),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No hay música reproduciéndose.", ephemeral: true });

        const mode = interaction.options.getString("modo") || "on";

        if (mode === "off") {
            await player.setFilters({});
            interaction.reply("🔊 **Nightcore desactivado.**");
        } else {
            await player.setFilters({
                timescale: { speed: 1.2, pitch: 1.2, rate: 1.0 }
            });
            interaction.reply("🌙 **Nightcore activado.**");
        }
    }
};
