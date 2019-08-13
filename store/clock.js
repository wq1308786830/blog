import { action, observable } from 'mobx';
import { useStaticRendering } from 'mobx-react';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

export default class Clock {
  @observable lastUpdate = 0;

  @observable light = false;

  @action
  start = () => {
    this.timer = setInterval(() => {
      this.lastUpdate = Date.now();
      this.light = true;
    }, 1000);
  };

  @action
  stop = () => clearInterval(this.timer);
}
