import React from 'react';
import Page from '../components/Page';
import Layout from '../components/Layout';

export default function Clock() {
  return (
    <Layout>
      <Page title="Index Page" linkTo="/category" />
    </Layout>
  );
}
