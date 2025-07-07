import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Fonts Comfortaa */}
        <link href="https://fonts.googleapis.com/css?family=Comfortaa:400,700&display=swap" rel="stylesheet" />
        {/* Bootstrap Icons CDN */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
