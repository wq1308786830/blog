import Link from 'next/link';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import Clock from './Clock';
import useStores from '../store';

function Page({ linkTo, title }) {
  const { start, lastUpdate, light } = useStores().store.clock;

  useEffect(() => {
    start();
  });

  return (
    <div>
      <h1>{title}</h1>
      <Clock lastUpdate={lastUpdate} light={light} />
      <nav>
        <Link href={linkTo}>
          <a>Navigate</a>
        </Link>
      </nav>
    </div>
  );
}

export default observer(Page);
