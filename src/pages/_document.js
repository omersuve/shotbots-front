import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Favicon Links */}
          <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" />
          <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" href="/favicon.ico" />

          <meta
            name="description"
            content="Part bot, part sniper, all alpha!"
          />
          <meta
            property="og:title"
            content="Shotbots - Stay Ahead of the Game"
          />
          <meta
            property="og:description"
            content="Part bot, part sniper, all alpha!"
          />
          <meta property="og:image" content="/android-chrome-512x512.png" />
          <meta property="og:url" content="https://shotbots.app" />

          {/* Manifest for PWA */}
          <link rel="manifest" href="/site.webmanifest" />

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
