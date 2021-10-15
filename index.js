import Websocket from "https://cdn.skypack.dev/reconnecting-websocket";

const socket = new Websocket("wss://ws.elektron.art");

const params = new URLSearchParams(window.location.search);

const renderTable = (messages) => {
  const header = Object.keys(messages[0]);
  const rows = messages
    .map((m) =>
      Object.values(m)
        .map((m) => (m && m === Object(m) ? JSON.stringify(m) : m))
        .join("\t")
    )
    .join("\n");
  return [header.join("\t"), rows].join("\n");
};

let messages = [];
let filteredMessages = [];

socket.addEventListener("message", ({ data }) => {
  const message = safeJsonParse(data);
  messages.push(message);

  const channel = params.get("channel");
  const type = params.get("type");

  filteredMessages = messages.filter((m) => {
    let pass = false;
    if (channel || type) {
      if (channel === m.channel) {
        pass = true;
      }
      if (type && type === m.type) {
        pass = true;
      }
    } else {
      pass = true;
    }
    return pass;
  });

  document.getElementById("log").innerHTML = renderTable(filteredMessages);
  //}
});

document.querySelector("#copy").addEventListener("click", () => {
  const text = document.getElementById("log");
  text.select();
  document.execCommand("copy");
});

// Helper function to parse string and binaries into JSON

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};
