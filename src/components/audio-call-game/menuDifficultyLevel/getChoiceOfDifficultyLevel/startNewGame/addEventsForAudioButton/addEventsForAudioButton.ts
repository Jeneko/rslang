import playAudio from '../playAudio/playAudio';

export default function addEventsForAudioButton(button: HTMLElement, audioPath: string) {
  button.addEventListener('click', (e: Event) => playAudio(e, audioPath));
}
