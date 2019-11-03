import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BlogServices from '../../services/BlogServices';

export default function Article() {
  const { id } = useRouter().query;
  const [detail, setDetail] = useState({});

  const getArticle = useCallback(async () => {
    const articleResp = await BlogServices.getArticleDetail(id);
    setDetail(articleResp.data);
  }, [id]);

  useEffect(() => {
    getArticle();
  }, [getArticle]);

  return <div>{detail.content}</div>;
}
