const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bassboost")
        .setDescription("Activa o desactiva el efecto de bajos")
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
            interaction.reply("🔊 **Bassboost desactivado.**");
        } else {
            await player.setFilters({
                equalizer: [
                    { band: 0, gain: 0.6 },
                    { band: 1, gain: 0.67 },
                    { band: 2, gain: 0.67 },
                    { band: 3, gain: 0.2 },
                    { band: 4, gain: -0.1 },
                ]
            });
            interaction.reply("🎸 **Bassboost activado.**");
        }
    }
};
