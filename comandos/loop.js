const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Configura el bucle de la música")
        .addStringOption(option => 
            option.setName('modo')
                .setDescription('Modo de bucle')
                .setRequired(true)
                .addChoices(
                    { name: 'Canción', value: 'track' },
                    { name: 'Cola', value: 'queue' },
                    { name: 'Desactivado', value: 'off' }
                )),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No hay música reproduciéndose.", ephemeral: true });

        const mode = interaction.options.getString('modo');

        if (mode === "track") {
            player.loop = "track";
            interaction.reply("🔁 Bucle activado: **Canción actual**.");
        } else if (mode === "queue") {
            player.loop = "queue";
            interaction.reply("🔁 Bucle activado: **Toda la cola**.");
        } else if (mode === "off") {
            player.loop = "none";
            interaction.reply("▶️ Bucle **desactivado**.");
        }
    }
};
