import playAudio from '../playAudio/playAudio';

export default function addEventsForAudioButton(button: HTMLElement, audioPath: string): void {
  button.addEventListener('click', () => playAudio(audioPath));
}
