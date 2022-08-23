import { SOURCE } from 'API/index';

export default async function playAudio(fileName: string): Promise<void> {
  const url = `${SOURCE}/${fileName}`;
  const audio = new AudioContext();
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const decodedAudio = await audio.decodeAudioData(arrayBuffer);
  const audioModule = audio.createBufferSource();
  audioModule.buffer = decodedAudio;
  audioModule.connect(audio.destination);
  audioModule.start(audio.currentTime);
}
