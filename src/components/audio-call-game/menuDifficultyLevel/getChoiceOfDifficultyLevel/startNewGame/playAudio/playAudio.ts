const SOURCE = 'https://team51-learnwords.herokuapp.com';

export default async function playAudio(e: Event | null, fileName: string) {
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
