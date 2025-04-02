const globals = {
    root_url: (process.env.NODE_ENV === "production" ? "https://rd1.anekodot.lol" : "https://d.anekodot.lol"),
    azuracast_root: "https://radio.anekodot.lol",
    azuracast_station_id: "registered_disk_1_radio",
    metadata_fetch_interval: 1000,
    backend_url: (process.env.NODE_ENV === "production" ? "https://rd1.anekodot.lol/backend" : "http://localhost:9094"),
    suggestions_enabled: false,
    star_count: 400,
    star_shooting_interval: 5000,
    navbar_links: [
      {
        name: "Home",
        href: "/",
      },
      {
        name: "About",
        href: "/about",
      },
    ],
}

async function check_suggestions_enabled() {
  const response = await fetch(`${globals.backend_url}/config?n=${Date.now()}`); // cache bust, yay!
  const data = await response.json();

  globals.suggestions_enabled = data.suggestions_enabled.includes(globals.azuracast_station_id);

  return globals.suggestions_enabled;
}

await check_suggestions_enabled();

export { globals, check_suggestions_enabled };