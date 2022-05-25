const { createApp } = Vue;

async function fetchTorrents() {
  const response = await fetch("nxdb.json");
  const json = await response.json();
  return json;
}

function compareTitle(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

function compareSizeAsc(a, b) {
  return a.size_b - b.size_b;
}

function compareSizeDesc(a, b) {
  return b.size_b - a.size_b;
}

function compareDateAsc(a, b) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function compareDateDesc(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

createApp({
  data() {
    return {
      torrents: [],
      isNx: window.nx || false,
      order: "desc",
      sortField: "date",
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
  computed: {
    sortedTitles() {
      let sorted;
      let ord;
      switch (this.sortField) {
        case "title":
          if (this.order == "asc") {
            sorted = this.torrents.sort(compareTitle);
          } else {
            sorted = this.torrents.sort(compareTitle).reverse();
          }
          break;
        case "size":
          ord = this.order == "asc" ? compareSizeAsc : compareSizeDesc;
          sorted = this.torrents.sort(ord);
          break;
        case "date":
          ord = this.order == "asc" ? compareDateAsc : compareDateDesc;
          sorted = this.torrents.sort(ord);
          break;
      }
      return {
        ...sorted,
      };
    },
  },
  mounted() {
    fetchTorrents().then((torrents) => (this.torrents = torrents));
  },
}).mount("#app");
