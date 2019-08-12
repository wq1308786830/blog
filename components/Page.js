import Link from 'next/link';
import { useContext, useEffect } from 'react';
import {observer, useObserver} from 'mobx-react-lite';
import ClockStore from '../store/clock';
import Clock from './Clock';

function Page({ linkTo, title }) {
  const { start, clock } = useContext(ClockStore);

  useEffect(() => {
    start();
  });

  return (
    <div>
      <h1>{title}</h1>
      <Clock lastUpdate={clock.lastUpdate} light={clock.light} />
      <nav>
        <Link href={linkTo}>
          <a>Navigate</a>
        </Link>
      </nav>
    </div>
  );
}

export default observer(Page);
