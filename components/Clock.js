import React from 'react';
import PropTypes from 'prop-types';

function Clock(props) {
  const { lastUpdate, light } = props;

  const pad = n => (n < 10 ? `0${n}` : n);
  const format = t => `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`;

  return (
    <div className={light ? 'light' : ''}>
      {format(new Date(lastUpdate))}
      <style jsx>
        {`
          div {
            padding: 15px;
            color: #82fa58;
            display: inline-block;
            font: 50px menlo, monaco, monospace;
            background-color: #000;
          }
          .light {
            background-color: #999;
          }
        `}
      </style>
    </div>
  );
}

export default Clock;

Clock.propTypes = {
  light: PropTypes.bool.isRequired,
  lastUpdate: PropTypes.number.isRequired
};
