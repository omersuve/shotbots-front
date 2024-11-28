import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* App Title */}
          <title>Shotbots - Stay Ahead of the Game</title>

          {/* Open Graph Metadata */}
          <meta property="og:title" content="Shotbots - Stay Ahead of the Game" />
          <meta property="og:description" content="Part bot, part sniper, all alpha!" />
          <meta property="og:image" content="/apple-touch-icon.png" />
          <meta property="og:url" content="https://shotbots.app" />
      
          {/* Primary Favicon Links for Modern Browsers */}
          <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />

          {/* Optional Apple Touch Icon for better support */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* Legacy Favicon for Older Browsers */}
          <link rel="icon" href="/favicon.ico" />

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
