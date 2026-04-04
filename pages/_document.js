import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head nonce={this.props.nonce}>
          {/* Prevent white flash before styled-components styles load */}
          <style>{`body { background-color: #020c1b; }`}</style>
          <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
            nonce={this.props.nonce}
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={this.props.nonce} />
        </body>
      </Html>
    )
  }
}

export default MyDocument