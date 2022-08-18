import { getWords } from 'API/index';

// Dummy function content (to be replaced)
export default async function getAudioCallGame(): Promise<HTMLElement> {
  const words = await getWords(0, 0);
  const elem = document.createElement('div');
  elem.className = 'audio-call-game';

  elem.innerHTML = `
    <h2>Audio-call mini-game</h2>
    <pre>
      ${JSON.stringify(words, null, 2)}
    </pre>
  `;

  return elem;
}
