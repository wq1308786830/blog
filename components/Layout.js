import React from 'react';
import PropTypes from 'prop-types';
import './base.module.scss';

export default function Layout({ children }) {
  return <>{children}</>;
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
