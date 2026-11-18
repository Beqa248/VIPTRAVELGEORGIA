const TARGET = 40_000_000;
const LIMIT = 50_000_000;
export async function compressVideo(file, progress = () => {}) {
  if (file.size <= TARGET && file.type !== 'video/quicktime') return file;
  if (!window.MediaRecorder || !window.AudioContext || !HTMLCanvasElement.prototype.captureStream) throw Error('Automatic video compression is unavailable in this browser. Use desktop Chrome or Edge.');
  const mime = ['video/mp4;codecs=avc1.420034,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t => MediaRecorder.isTypeSupported(t));
  if (!mime) throw Error('No supported video encoder.');
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'auto'; video.playsInline = true;
  let audio, stream, recorder, timer, frame;
  try {
    await new Promise((resolve,reject) => {
      const timeout = setTimeout(() => reject(Error('Video metadata timed out.')), 20000);
      video.onloadedmetadata = () => { clearTimeout(timeout); resolve(); };
      video.onerror = () => { clearTimeout(timeout); reject(Error('Cannot decode this video. Convert it to MP4 first.')); };
      video.src = url;
    });
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0 || !video.videoWidth) throw Error('Invalid video duration or dimensions.');
    const bitrate = Math.min(5_000_000, Math.floor(TARGET * 8 * 0.88 / duration) - 96000);
    if (bitrate < 120000) throw Error('Video is too long for useful compression under 50 MB. Split it into shorter clips.');
    const canvas = document.createElement('canvas');
    const maxSide = bitrate < 500000 ? 640 : bitrate < 1200000 ? 1280 : 1920;
    const scale = Math.min(1, maxSide / Math.max(video.videoWidth,video.videoHeight));
    canvas.width = Math.max(2, Math.floor(video.videoWidth * scale / 2)*2);
    canvas.height = Math.max(2, Math.floor(video.videoHeight * scale / 2)*2);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('Canvas unavailable.');
    audio = new AudioContext();
    const source = audio.createMediaElementSource(video);
    const destination = audio.createMediaStreamDestination();
    source.connect(destination);
    stream = canvas.captureStream(30);
    destination.stream.getAudioTracks().forEach(t => stream.addTrack(t));
    await audio.resume();
    const chunks = [];
    recorder = new MediaRecorder(stream, {mimeType:mime, videoBitsPerSecond:bitrate, audioBitsPerSecond:96000});
    const output = await new Promise((resolve,reject) => {
      let bytes = 0;
      const fail = e => reject(e instanceof Error ? e : Error('Video encoding failed.'));
      recorder.ondataavailable = e => { if(e.data.size) { bytes += e.data.size; chunks.push(e.data); if(bytes > LIMIT) fail(Error('Compressed video still exceeds 50 MB. Split or compress manually.')); } };
      recorder.onerror = () => fail(Error('Video encoder failed.'));
      recorder.onstop = () => resolve(new Blob(chunks, {type:(recorder.mimeType || mime).split(';')[0]}));
      video.onerror = () => fail(Error('Video decoding failed.'));
      video.onended = () => { if(recorder.state !== 'inactive') recorder.stop(); };
      const draw = () => { try { ctx.drawImage(video,0,0,canvas.width,canvas.height); progress(Math.min(99, Math.floor(video.currentTime/duration*100))); frame = requestAnimationFrame(draw); } catch(e) { fail(e); } };
      timer = setTimeout(() => fail(Error('Compression timed out. Keep the browser tab open and active.')), (duration*2+60)*1000);
      video.play().then(() => { try { ctx.drawImage(video,0,0,canvas.width,canvas.height); recorder.start(1000); draw(); if(video.ended) recorder.stop(); } catch(e) { fail(e); } },fail);
    });
    if (!output.size || output.size > LIMIT) throw Error('Compressed video is invalid or exceeds 50 MB.');
    progress(100);
    if(file.size <= LIMIT && file.size < output.size && file.type !== 'video/quicktime') return file;
    return new File([output],file.name.replace(/\.[^.]+$/,'')+(output.type==='video/mp4'?'.mp4':'.webm'),{type:output.type});
  } finally {
    clearTimeout(timer); cancelAnimationFrame(frame); video.pause();
    if(recorder && recorder.state !== 'inactive') recorder.stop();
    stream?.getTracks().forEach(t => t.stop());
    if(audio) await audio.close().catch(()=>{});
    video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url);
  }
}
