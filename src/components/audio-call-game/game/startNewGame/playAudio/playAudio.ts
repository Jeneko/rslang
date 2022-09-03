import { SOURCE } from 'API/index';

export default async function playAudio(fileName: string): Promise<void> {
  const url = `${SOURCE}/${fileName}`;
  const audio = new Audio(url);
  audio.play();
}
