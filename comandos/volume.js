const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Ajusta el volumen de la música")
        .addIntegerOption(option => 
            option.setName('nivel')
                .setDescription('Nivel de volumen (0-1000)')
                .setRequired(true)),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No hay música reproduciéndose.", ephemeral: true });

        const vol = interaction.options.getInteger('nivel');
        if (vol < 0 || vol > 1000) {
            return interaction.reply({ content: "⚠️ Debes proporcionar un volumen válido entre 0 y 1000 (100 es normal).", ephemeral: true });
        }

        player.setGlobalVolume(vol);
        interaction.reply(`🔊 Volumen ajustado al **${vol}%**`);
    }
};
