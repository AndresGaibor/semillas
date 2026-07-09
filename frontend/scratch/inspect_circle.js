const { exec } = require("child_process");

console.log("Launching Brave Browser...");
const braveProcess = exec(
  `"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless --disable-gpu --remote-debugging-port=9222 "http://localhost:6007/iframe.html?id=componentes-chips-badges-y-estados--documentacion-completa&viewMode=story"`
);

setTimeout(async () => {
  console.log("Connecting to Brave DevTools...");
  try {
    const res = await fetch("http://localhost:9222/json");
    const targets = await res.json();
    const page = targets.find(t => t.type === "page" || t.url.includes("iframe.html"));
    if (!page) {
      console.error("No active page found in Brave targets:", targets);
      braveProcess.kill();
      process.exit(1);
    }

    const wsUrl = page.webSocketDebuggerUrl;
    console.log("Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      const msg = {
        id: 1,
        method: "Runtime.evaluate",
        params: {
          expression: `(() => {
            return new Promise((resolve) => {
              let attempts = 0;
              const interval = setInterval(() => {
                attempts++;
                const track = document.querySelector(".h-2");
                if (track || attempts > 50) {
                  clearInterval(interval);
                  if (!track) {
                    resolve("Progress track not found");
                    return;
                  }
                  const rect = track.getBoundingClientRect();
                  const styles = window.getComputedStyle(track);
                  const fill = track.children[0];
                  const fillStyles = fill ? window.getComputedStyle(fill) : null;
                  
                  resolve(JSON.stringify({
                    track: {
                      outerHTML: track.outerHTML,
                      width: rect.width,
                      height: rect.height,
                      display: styles.display,
                      backgroundColor: styles.backgroundColor,
                      heightStyle: styles.height
                    },
                    fill: fill ? {
                      outerHTML: fill.outerHTML,
                      width: fill.getBoundingClientRect().width,
                      height: fill.getBoundingClientRect().height,
                      backgroundColor: fillStyles.backgroundColor
                    } : null
                  }, null, 2));
                }
              }, 100);
            });
          })()`,
          awaitPromise: true,
          returnByValue: true
        }
      };
      ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.id === 1) {
        console.log("INSPECTION RESULT:");
        if (response.result && response.result.result) {
          console.log(response.result.result.value);
        } else {
          console.log(response);
        }
        ws.close();
        braveProcess.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error("Error connecting to DevTools:", err);
    braveProcess.kill();
    process.exit(1);
  }
}, 4000);
