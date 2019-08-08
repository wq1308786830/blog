import App, { Container } from 'next/app';
import React from 'react';

class MyMobxApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ...ctx });
    }

    return {
      pageProps
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
export default MyMobxApp;
