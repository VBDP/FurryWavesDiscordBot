const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Muestra la cola de canciones actual"),

    async execute(interaction) {
        const player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player || !player.queue || player.queue.length === 0) {
            return interaction.reply({ content: "❌ No hay canciones en la cola.", ephemeral: true });
        }

        const queue = player.queue;
        const current = queue[0];
        
        let reply = `**🎶 Reproduciendo ahora:**\n${current.info.title}\n\n`;
        
        if (queue.length > 1) {
            reply += `**⏳ Próximas canciones:**\n`;
            const max = Math.min(queue.length, 11);
            for (let i = 1; i < max; i++) {
                reply += `${i}. ${queue[i].info.title}\n`;
            }
            if (queue.length > 11) {
                reply += `\n*...y ${queue.length - 11} canciones más.*`;
            }
        } else {
            reply += `*No hay más canciones en la cola.*`;
        }

        interaction.reply(reply);
    }
};
