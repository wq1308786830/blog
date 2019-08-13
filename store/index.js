import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import UserStore from './user';
import ClockStore from './clock';

export default function useStores() {
  return React.useContext(MobXProviderContext);
}

export class RootStore {
  constructor() {
    this.user = new UserStore();
    this.clock = new ClockStore();
  }

  hydrate({ clock, user }) {
    this.clock.lastUpdate = clock.lastUpdate != null ? clock.lastUpdate : Date.now();
    this.clock.light = !!clock.light;

    this.user = user;
  }
}

export async function fetchInitialStoreState() {
  // You can do anything to fetch initial store state
  return { clock: {}, user: {} };
}
