import controlGameWindow from '../../controlGameWindow/controlGameWindow';

export default function getLevel(event: Event): string | null {
  const { target } = event;
  if ((target as HTMLElement).classList.contains('btn-check')) {
    console.log((target as HTMLElement).dataset.level);
    controlGameWindow(true);
    return <string>(target as HTMLElement).dataset.level;
  }
  return null;
}
