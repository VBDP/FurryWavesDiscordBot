const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Muestra la lista de comandos disponibles"),

    async execute(interaction) {
        const comandos = `
**🎵 COMANDOS DE MÚSICA DE FURRYWAVES 🎵**

**Reproducción:**
▶️ \`/play <canción/link>\` - Reproduce música
⏸️ \`/pause\` - Pausa la música actual
▶️ \`/resume\` - Reanuda la música pausada
⏭️ \`/skip\` - Salta a la siguiente canción
⏹️ \`/stop\` - Detiene la música y desconecta al bot

**Cola y Control:**
📜 \`/queue\` - Muestra la lista de canciones en espera
📻 \`/np\` - Muestra la canción que está sonando ahora
🔊 \`/volume <0-100>\` - Cambia el volumen
🔁 \`/loop <track/queue/off>\` - Repite una canción o la cola entera
🔀 \`/shuffle\` - Mezcla la cola aleatoriamente
🗑️ \`/clear\` - Limpia todas las canciones en espera

**Filtros de Audio (Efectos):**
🎸 \`/bassboost\` - Aumenta los bajos
🌙 \`/nightcore\` - Acelera y sube el tono (efecto anime)
🌆 \`/vaporwave\` - Ralentiza y baja el tono (efecto retro)
`;
        await interaction.reply({ content: comandos, ephemeral: true });
    }
};
