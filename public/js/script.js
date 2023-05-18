let currentChannel = null;
let twitchEmbed = null;
let twitchChat = null;

window.onload = async function () {
    currentChannel = await fetchChannelFromServer();
    setupTwitchEmbeds(currentChannel);

    // Check for channel updates every 5 minutes
    setInterval(async () => {
        const newChannel = await fetchChannelFromServer();
        if (newChannel !== currentChannel) {
            currentChannel = newChannel;
            setupTwitchEmbeds(currentChannel);
        }
    }, 1000); //, 5 * 60 * 1000); // 5 minutes
};

async function fetchChannelFromServer() {
    const res = await fetch('/channel');
    const data = await res.json();
    const channel = data.channel;
    if (!channel) {
        throw new Error('No channel returned from server');
    }
    return channel;
}

function setupTwitchEmbeds(channel) {
    const embedContainer = document.getElementById('twitchEmbed');
    if (embedContainer) {
        while (embedContainer.firstChild) {
            embedContainer.firstChild.remove();
        }
    } else {
        console.error('Embed container not found');
    }

    // create new embeds
    twitchEmbed = new Twitch.Embed("twitchEmbed", {
        width: "100%",
        height: "100%",
        channel: channel,
        layout: "video-with-player",
        muted: false,
        autoplay: true,
        parent: ["localhost"]
    });
}