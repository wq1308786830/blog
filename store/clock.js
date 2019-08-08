import { action, decorate, observable } from 'mobx';
import { useStaticRendering } from 'mobx-react-lite';
import { createContext } from 'react';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

class Clock {
  timerInterval = null;
  clock = { lastUpdate: Date.now(), light: true };

  start = () => {
    this.timerInterval = setInterval(() => {
      this.clock.lastUpdate = Date.now();
      this.clock.light = true;
    }, 1000);
  };

  stop = () => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  };
}

decorate(Clock, {
  start: action.bound,
  stop: action.bound,
  clock: observable
});

export default createContext(new Clock());
