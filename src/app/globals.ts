const globals = {
    root_url: (process.env.NODE_ENV === "production" ? "https://rd1.anekodot.lol" : "https://d.anekodot.lol"),
    azuracast_root: "https://radio.anekodot.lol",
    azuracast_station_id: "registered_disk_1_radio",
    metadata_fetch_interval: 1000,
    song_suggest_webhook: "https://discord.com/api/webhooks/1356686567804239913/Ni-MM-udMSz3B8CUsM9L4cR8Mo1lv5k73McPzlaZQx-7V2kU-DyMmaexKdtRU23BlRjH",
    suggestions_enabled: false,
}

async function check_suggestions_enabled() {
  const response = await fetch(`https://radio.anekodot.lol/backend/suggestions_config?n=${Date.now()}`); // cache bust, yay!
  const data = (await response.text()).split('\n');
  return data.includes(globals.azuracast_station_id);
}

globals.suggestions_enabled = await check_suggestions_enabled();

export { globals };