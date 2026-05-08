const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vaporwave")
        .setDescription("Activa o desactiva el efecto Vaporwave")
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
            interaction.reply("🔊 **Vaporwave desactivado.**");
        } else {
            await player.setFilters({
                timescale: { speed: 0.8, pitch: 0.8, rate: 1.0 }
            });
            interaction.reply("🌆 **Vaporwave activado.**");
        }
    }
};
