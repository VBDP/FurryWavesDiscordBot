const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Reproduce una canción o enlace")
        .addStringOption(option => 
            option.setName("query")
                .setDescription("La canción o enlace a reproducir")
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const query = interaction.options.getString("query");

        const voice = interaction.member.voice.channel;
        if (!voice) return interaction.editReply("❌ Entra a un canal de voz");

        let player = interaction.client.shoukaku.players.get(interaction.guild.id);
        if (!player) {
            player = await interaction.client.shoukaku.joinVoiceChannel({
                guildId: interaction.guild.id,
                channelId: voice.id,
                shardId: 0
            });

            player.on('end', (data) => {
                console.log("[DEBUG] Emitted END event:", JSON.stringify(data));
                if (data.reason === "REPLACED") return;

                if (!player.queue || player.queue.length === 0) return;
                
                const finishedTrack = player.queue[0];
                
                if (player.loop === 'track') {
                    // Do not shift the queue, play the same track again
                } else if (player.loop === 'queue') {
                    // Move the finished track to the end of the queue
                    player.queue.shift();
                    player.queue.push(finishedTrack);
                } else {
                    // Normal behavior: remove the finished track
                    player.queue.shift();
                }

                if (player.queue.length > 0) {
                    player.playTrack({ track: { encoded: player.queue[0].encoded } });
                } else {
                    console.log("[DEBUG] No hay mas musica, saliendo...");
                    interaction.client.shoukaku.leaveVoiceChannel(interaction.guild.id);
                }
            });

            player.on('closed', (data) => {
                console.log("[DEBUG] Emitted CLOSED event:", JSON.stringify(data));
            });
            player.on('error', (err) => {
                console.log("[DEBUG] Emitted ERROR event:", err);
            });
            player.on('exception', (err) => {
                console.log("[DEBUG] Emitted EXCEPTION event:", JSON.stringify(err));
            });
        }

        const res = await player.node.rest.resolve(query.includes('http') ? query : `ytsearch:${query}`);

        console.log("[DEBUG] Resultado de busqueda:", JSON.stringify(res, null, 2));

        if (!res || res.loadType === 'empty' || res.loadType === 'error') {
            return interaction.editReply("❌ No encontrado");
        }

        if (!player.queue) player.queue = [];

        if (res.loadType === 'playlist') {
            for (const t of res.data.tracks) {
                player.queue.push(t);
            }
            if (!player.track) {
                player.playTrack({ track: { encoded: player.queue[0].encoded } });
            }
            return interaction.editReply(`🎶 Lista de reproducción añadida: **${res.data.info.name}** (${res.data.tracks.length} canciones)`);
        }

        let track;
        if (res.loadType === 'track') {
            track = res.data;
        } else if (res.loadType === 'search') {
            track = res.data[0];
        }

        if (!track) return interaction.editReply("❌ No encontrado");

        player.queue.push(track);

        if (!player.track) {
            player.playTrack({ track: { encoded: track.encoded } });
        }

        interaction.editReply(`🎶 ${track.info.title}`);
    }
};