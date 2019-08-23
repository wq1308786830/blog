import React from 'react';
import { useRouter } from 'next/router';
import Category from '../../category';

export default function CategorySub() {
  const { id } = useRouter().query;
  return (
    <Category id={id} />
  );
}
