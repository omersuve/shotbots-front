import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Favicon Links */}
          <link
            rel="icon"
            href="/android-launchericon-72-72.png"
            sizes="72x72"
          />
          <link rel="apple-touch-icon" href="/144.png" />

          <meta
            name="description"
            content="Part bot, part sniper, all alpha!"
          />
          <meta
            property="og:title"
            content="Shotbots - Stay Ahead of the Game"
          />

          <meta property="og:image:alt" content="Shotbots" />
          <meta property="og:site_name" content="Shotbots" />
          <meta property="og:type" content="website" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="192" />
          <meta property="og:image:height" content="192" />
          <meta
            property="og:description"
            content="Part bot, part sniper, all alpha!"
          />
          <meta
            property="og:image"
            content="https://shotbots.app/android-chrome-192x192.png"
          />
          <meta property="og:url" content="https://shotbots.app" />

          {/* Manifest for PWA */}
          <link
            rel="manifest"
            href="/manifest.json"
            crossOrigin="use-credentials"
          />

          {/* FontAwesome (if needed globally) */}
          <link
            href="https://use.fontawesome.com/releases/v5.4.1/css/all.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
