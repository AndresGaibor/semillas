const { exec } = require("child_process");

console.log("Launching Brave Browser...");
const braveProcess = exec(
  `"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless --disable-gpu --remote-debugging-port=9222 "http://localhost:6006/iframe.html?id=componentes-chips-badges-y-estados--documentacion-completa&viewMode=story"`
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
                const chip = document.querySelector(".rounded-full.border");
                if (chip || attempts > 50) {
                  clearInterval(interval);
                  if (!chip) {
                    resolve("Chip not found");
                    return;
                  }
                  const chipRect = chip.getBoundingClientRect();
                  const iconSpan = chip.children[0];
                  const textSpan = chip.children[1];
                  const iconRect = iconSpan ? iconSpan.getBoundingClientRect() : null;
                  const textRect = textSpan ? textSpan.getBoundingClientRect() : null;
                  
                  resolve(JSON.stringify({
                    chip: {
                      classes: chip.className,
                      width: chipRect.width,
                      height: chipRect.height,
                      computedStyle: {
                        display: window.getComputedStyle(chip).display,
                        flexDirection: window.getComputedStyle(chip).flexDirection,
                        alignItems: window.getComputedStyle(chip).alignItems,
                        justifyContent: window.getComputedStyle(chip).justifyContent,
                        boxSizing: window.getComputedStyle(chip).boxSizing,
                        padding: window.getComputedStyle(chip).padding,
                        margin: window.getComputedStyle(chip).margin,
                        border: window.getComputedStyle(chip).border,
                        overflow: window.getComputedStyle(chip).overflow
                      }
                    },
                    iconSpan: iconSpan ? {
                      width: iconRect.width,
                      height: iconRect.height,
                      computedStyle: {
                        display: window.getComputedStyle(iconSpan).display,
                        position: window.getComputedStyle(iconSpan).position,
                        float: window.getComputedStyle(iconSpan).float,
                        width: window.getComputedStyle(iconSpan).width,
                        height: window.getComputedStyle(iconSpan).height,
                        backgroundColor: window.getComputedStyle(iconSpan).backgroundColor
                      }
                    } : null,
                    textSpan: textSpan ? {
                      width: textRect.width,
                      height: textRect.height,
                      text: textSpan.innerText,
                      computedStyle: {
                        display: window.getComputedStyle(textSpan).display,
                        position: window.getComputedStyle(textSpan).position,
                        float: window.getComputedStyle(textSpan).float,
                        width: window.getComputedStyle(textSpan).width,
                        height: window.getComputedStyle(textSpan).height,
                        whiteSpace: window.getComputedStyle(textSpan).whiteSpace,
                        overflow: window.getComputedStyle(textSpan).overflow
                      }
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
