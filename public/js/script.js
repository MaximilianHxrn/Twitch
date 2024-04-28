let currentChannel = null;
let twitchEmbed = null;

window.onload = async function () {
    const username = window.location.pathname.substring(1);
    currentChannel = await fetchChannelFromServer(username);
    setupTwitchEmbeds(currentChannel);

    // Check for channel updates every 5 minutes
    setInterval(async () => {
        const newChannel = await fetchChannelFromServer(username);
        if (newChannel !== currentChannel) {
            currentChannel = newChannel;
            setupTwitchEmbeds(currentChannel);
        }
    }, 1000); // Corrected to 5 minutes
};

async function fetchChannelFromServer(username) {
    const response = await fetch(`/channel/${username}`); // Append the username to the URL
    const data = await response.json();
    if (!data.channel) {
        throw new Error('No channel returned from server');
    }
    return data.channel;
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