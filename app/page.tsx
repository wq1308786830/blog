import React from 'react';
import css from '@/styles/Home.module.scss';

const FaceLeftPic = '/imgs/home/NDk2MDg0NjE1.jpeg';
const RussellPic = '/imgs/home/Bertrand_Russell.jpg';
const ProgramPic = '/imgs/home/language_map.png';
const FrontendPic = '/imgs/home/frontend_map.png';
function Page() {
  return (
    <main className={css.page}>
      <section className={css.hero}>
        <div className={css.heroIntro}>
          <p className={css.kicker}>你好，我是一个好奇星人</p>
          <h1 className={css.title}>思考、写作、构建，让想法落地</h1>
          <p className={css.lead}>
            喜欢思考，热爱知识，也喜欢把灵感做成可以分享的作品。这里记录前端、后端、以及哲学与人文的思考痕迹。
          </p>
          <div className={css.ctaRow}>
            <a className={css.primaryButton} href="/category">
              浏览文章
            </a>
            <a className={css.ghostButton} href="#maps">
              知识地图
            </a>
          </div>
        </div>
        <div className={css.heroTiles}>
          <div className={css.tile}>
            <span className={css.badge}>观测</span>
            <img
              className={css.tileImg}
              src={FaceLeftPic}
              alt="人类首张黑洞照片"
              title="4月10日21点21分，人类首张黑洞照片公布"
            />
            <p className={css.caption}>把好奇心对准宇宙，也对准代码。</p>
          </div>
          <div className={css.tile}>
            <span className={css.badge}>思辨</span>
            <img
              className={css.tileImg}
              src={RussellPic}
              alt="伯特兰·罗素油画"
              title="Bertrand Russell"
            />
            <p className={css.caption}>在理性与想象之间寻找平衡。</p>
          </div>
        </div>
      </section>

      <section id="maps" className={css.mapsSection}>
        <div className={css.mapCard}>
          <div className={css.mapHead}>
            <div>
              <p className={css.kicker}>前端知识图谱</p>
              <h2 className={css.sectionTitle}>从交互到工程化</h2>
              <p className={css.sectionLead}>把零散的知识点织成体系，持续精进。</p>
            </div>
            <span className={css.pill}>前端</span>
          </div>
          <div className={css.mapBody}>
            <img src={FrontendPic} alt="前端知识网络" />
          </div>
        </div>

        <div className={css.mapCard}>
          <div className={css.mapHead}>
            <div>
              <p className={css.kicker}>编程知识图谱</p>
              <h2 className={css.sectionTitle}>语言与架构的串联</h2>
              <p className={css.sectionLead}>多语言、多范式的交叉练习，关注底层原理。</p>
            </div>
            <span className={css.pill}>后端</span>
          </div>
          <div className={css.mapBody}>
            <img src={ProgramPic} alt="后端知识网络" />
          </div>
        </div>
      </section>

      <footer className={css.footer}>
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
