import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'mobx-react';
import { fetchInitialStoreState, RootStore } from '../store';

class MyMobxApp extends App {
  state = {
    store: new RootStore()
  };

  // Fetching serialized(JSON) store state
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const initialStoreState = await fetchInitialStoreState();

    return {
      ...appProps,
      initialStoreState
    };
  }

  // Hydrate serialized state to store
  static getDerivedStateFromProps(props, state) {
    state.store.hydrate(props.initialStoreState);
    return state;
  }

  render() {
    const { Component, pageProps } = this.props;
    const { store } = this.state;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
export default MyMobxApp;
