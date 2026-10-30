import { useRef } from 'react';
import { DEMO_COVER, useHeroBackground } from '../../hooks/useHeroBackground';
import { Icon } from './Icon';

type Props = ReturnType<typeof useHeroBackground>;

export function BackgroundPanel({ cover, update, error, backgrounds }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="st-cover-trigger" onClick={() => dialog.current?.showModal()}><Icon name="image" /> 首页背景</button>
    <dialog ref={dialog} className="st-cover-dialog" aria-labelledby="cover-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="st-cover-panel">
        <div className="st-cover-panel-heading"><div><p className="st-eyebrow">MAKE IT YOURS</p><h2 id="cover-title">给灵感，换个风景。</h2></div><button className="st-icon-button" aria-label="关闭背景设置" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div>
        <p className="st-cover-intro">把喜欢的照片放在首页。工具箱依然清爽，风景留给第一眼。</p>
        <div className="st-cover-options" role="group" aria-label="背景样式">
          <button aria-pressed={!cover.image} onClick={() => update({ image: '', overlay: 35, blur: 0 })}><span className="st-cover-swatch st-cover-swatch-paper">✳</span>默认画布</button>
          <button aria-pressed={cover.image === DEMO_COVER} onClick={() => update({ image: DEMO_COVER, overlay: 35, blur: 0 })}><span className="st-cover-swatch st-cover-swatch-photo" />山间日出</button>
          {backgrounds.map((background, index) => <button key={background.key} aria-pressed={cover.objectKey === background.key} onClick={() => update({ ...cover, image: background.url, cloudImage: background.url, objectKey: background.key })}><span className="st-cover-swatch" style={{ backgroundImage: `url(${background.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />我的背景 {index + 1}</button>)}
        </div>
        <p className="st-cover-file-hint">在 <a href="https://api.oscarstudio.cn/settings.html">UI 设置</a> 上传照片，这里只选择背景。</p>
        <label className="st-cover-slider">遮罩深度 <output>{cover.overlay}%</output><input type="range" min="0" max="70" value={cover.overlay} disabled={!cover.image} onChange={event => update({ ...cover, overlay: Number(event.target.value) })} /></label>
        <label className="st-cover-slider">背景模糊 <output>{cover.blur}px</output><input type="range" min="0" max="16" value={cover.blur} disabled={!cover.image} onChange={event => update({ ...cover, blur: Number(event.target.value) })} /></label>
        {error && <p className="st-cover-error" role="alert">{error}</p>}
        <div className="st-cover-panel-footer"><span>优先使用本地缓存，登录后同步账户设置</span><button className="st-button" onClick={() => dialog.current?.close()}>看看效果 <Icon name="arrow" /></button></div>
      </div>
    </dialog>
  </>;
}
