const { createApp } = Vue;

async function fetchTorrents() {
  const response = await fetch("nxdb.json");
  const json = await response.json();
  return json;
}

createApp({
  data() {
    return {
      torrents: [],
      isNx: window.nx || false,
    };
  },
  methods: {
    sendMessage(magnet) {
      if (window.nx) {
        window.nx.sendMessage(`${magnet}\0`);
      }
    },
    gb(bytes) {
      let _gb = bytes / (1024 * 1024 * 1024);
      return `${parseFloat(_gb).toFixed(2)} GB`;
    },
  },
  mounted() {
    fetchTorrents().then((torrents) => (this.torrents = torrents));
  },
}).mount("#app");
