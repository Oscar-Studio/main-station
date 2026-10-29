import { useRef, type ChangeEvent } from 'react';
import { DEMO_COVER, useHeroBackground } from '../../hooks/useHeroBackground';
import { Icon } from './Icon';

type Props = ReturnType<typeof useHeroBackground>;

export function BackgroundPanel({ cover, update, error, setError, upload, uploading }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      setError('请选择不超过 3 MB 的 JPG、PNG 或 WebP 图片。');
      return;
    }
    await upload(file);
  }

  return <>
    <button className="st-cover-trigger" onClick={() => dialog.current?.showModal()}><Icon name="image" /> 首页背景</button>
    <dialog ref={dialog} className="st-cover-dialog" aria-labelledby="cover-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="st-cover-panel">
        <div className="st-cover-panel-heading"><div><p className="st-eyebrow">MAKE IT YOURS</p><h2 id="cover-title">给灵感，换个风景。</h2></div><button className="st-icon-button" aria-label="关闭背景设置" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div>
        <p className="st-cover-intro">把喜欢的照片放在首页。工具箱依然清爽，风景留给第一眼。</p>
        <div className="st-cover-options" role="group" aria-label="背景样式">
          <button disabled={uploading} aria-pressed={!cover.image} onClick={() => update({ image: '', overlay: 35, blur: 0 })}><span className="st-cover-swatch st-cover-swatch-paper">✳</span>默认画布</button>
          <button disabled={uploading} aria-pressed={cover.image === DEMO_COVER} onClick={() => update({ image: DEMO_COVER, overlay: 35, blur: 0 })}><span className="st-cover-swatch st-cover-swatch-photo" />山间日出</button>
          <button disabled={uploading} aria-pressed={!!cover.image && cover.image !== DEMO_COVER} onClick={() => input.current?.click()}><span className="st-cover-swatch st-cover-swatch-upload"><Icon name="image" /></span>选择我的照片</button>
        </div>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={selectImage} />
        <p className="st-cover-file-hint">支持 JPG、PNG、WebP，最大 3 MB。横向照片效果更好。</p>
        <label className="st-cover-slider">遮罩深度 <output>{cover.overlay}%</output><input type="range" min="0" max="70" value={cover.overlay} disabled={uploading || !cover.image} onChange={event => update({ ...cover, overlay: Number(event.target.value) })} /></label>
        <label className="st-cover-slider">背景模糊 <output>{cover.blur}px</output><input type="range" min="0" max="16" value={cover.blur} disabled={uploading || !cover.image} onChange={event => update({ ...cover, blur: Number(event.target.value) })} /></label>
        {uploading && <p role="status">正在上传背景…</p>}
        {error && <p className="st-cover-error" role="alert">{error}</p>}
        <div className="st-cover-panel-footer"><span>登录后照片和调整保存到云端</span><button className="st-button" onClick={() => dialog.current?.close()}>看看效果 <Icon name="arrow" /></button></div>
      </div>
    </dialog>
  </>;
}
