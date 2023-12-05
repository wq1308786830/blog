import React from 'react';
import Image from 'next/image';
import css from '@/styles/Home.module.scss';

const FaceLeftPic = '/imgs/home/NDk2MDg0NjE1.jpeg';
const RussellPic = '/imgs/home/Bertrand_Russell.jpg';
const ProgramPic = '/imgs/home/language_map.png';
const FrontendPic = '/imgs/home/frontend_map.png';
function Page() {
  return (
    <main className={css.myHome}>
      <section className={css.myFace}>
        <div className={css.faceContent}>
          <div className={css.faceLeft}>
            <Image
              className={css.faceImg}
              src={FaceLeftPic}
              alt="人类首张黑洞照片"
              title="4月10日21点，人类首张黑洞照片公布"
            />
          </div>
          <div className={css.faceCenter}>
            <h1>你好，</h1>
            <h1>我是一个好奇星人。</h1>
            <h2>喜欢思考热爱知识，有一颗不安分的心！</h2>
          </div>
          <div className={css.faceRight}>
            <Image
              className={css.faceImg}
              src={RussellPic}
              alt="伯特兰.罗素油画"
              title="Bertrand Russell: Part of the children have the habit
                 of thinking, and the purpose of education is to root out
                  this kind of habit."
            />
          </div>
        </div>
      </section>
      <section className={css.knowledgeMap}>
        <div className={css.mapContainer}>
          <Image src={FrontendPic} alt="前端知识网络" />
        </div>
        <div className={css.mapContainer}>
          <Image src={ProgramPic} alt="后端知识网络" />
        </div>
      </section>
      <footer>
        <p>
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
            浙ICP备19021274号-2
          </a>
        </p>
      </footer>
    </main>
  );
}

export default Page;
