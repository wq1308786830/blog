import React from 'react';
import Page from '../components/Page';
import Layout from '../components/Layout';

export default function Counter() {
  return (
    <Layout>
      <Page title="Index Page" linkTo="/other" />
    </Layout>
  );
}
