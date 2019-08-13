import React from 'react';
import { useRouter } from 'next/router';

export default function Category() {
  const { id } = useRouter().query;
  return (
    <div>{id}</div>
  );
}
