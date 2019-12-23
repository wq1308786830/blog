import App from 'next/app';
import React from 'react';
import Layout from '../components/Layout';

class MyMobxApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyMobxApp;
