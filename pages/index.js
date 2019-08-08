import React from 'react';
import Page from '../components/Page';
import Layout from '../components/Layout';

export default class Counter extends React.Component {
  render() {
    return (
      <Layout>
        <Page title="Index Page" linkTo="/other" />
      </Layout>
    );
  }
}
