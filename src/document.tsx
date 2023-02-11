import { Meta, Title, Links, Main, Scripts } from "ice";

export default function Document() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="ice.js 3 lite scaffold" />
        <link rel="icon" href="favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="manifest" href="./manifest.json" />
        <Meta />
        <Title />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              process.env.ICE_CORE_MODE === "development"
                ? `if ("serviceWorker" in navigator) {
              navigator.serviceWorker.ready.then((swReg) => {
                swReg.unregister((result) => {
                  result && console.log("Service Worker 注销成功");
                });
              });
            }`
                : `(function () { // 防止污染
    if (window.addEventListener) {
      window.addEventListener("load", () => {
        var script = document.createElement("script");
        script.src = "reg.sw.js?t=" + Date.now(); // 无缓存引用
        script.async = true;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        document.head.insertBefore(script, document.head.firstChild);
      });
    }
  })();`,
          }}
        ></script>
        <Main />
        <Scripts />
      </body>
    </html>
  );
}
