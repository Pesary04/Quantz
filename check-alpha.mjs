import { Jimp } from 'jimp';
const dir='client/public/';
for (const f of ['quantz-logo.png','quantz-logo-white-text.png','quantz-logo-transparent.png']) {
  const img = await Jimp.read(dir+f);
  const {width:w,height:h}=img.bitmap;
  const a=(x,y)=>{const i=(y*w+x)*4;return img.bitmap.data[i+3];};
  console.log(f, w+'x'+h, 'alpha TL/TR/BL/BR:', a(0,0),a(w-1,0),a(0,h-1),a(w-1,h-1));
}
