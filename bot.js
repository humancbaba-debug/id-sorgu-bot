const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "!";

client.on("ready", () => {
    console.log(`${client.user.tag} aktif orospunun çocuğu`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "id" || command === "sorgula" || command === "user") {
        const id = args[0];
        if (!id) return message.reply("ID yaz amk. Örnek: `!id 123456789012345678`");
        if (!/^\d{17,19}$/.test(id)) return message.reply("Geçersiz ID attın.");

        try {
            const user = await client.users.fetch(id, { force: true });
            const embed = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle("ID Sorgu")
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .addFields(
                    { name: "Kullanıcı", value: `${user.tag}`, inline: true },
                    { name: "ID", value: `\`${user.id}\``, inline: true },
                    { name: "Bot mu?", value: user.bot ? "Evet" : "Hayır", inline: true },
                    { name: "Hesap Oluşturma", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: `Sorgulayan: ${message.author.tag}` })
                .setTimestamp();
            message.reply({ embeds: [embed] });
        } catch (err) {
            message.reply("Bu ID bulunamadı.");
        }
    }
});

client.login(process.env.TOKEN);   // ← Önemli: Artık token’ı buraya yazmıyoruz
