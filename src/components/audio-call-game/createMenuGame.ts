export default function createMenuGame(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'audio-call-game container';

  elem.innerHTML = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Audio-call</h1>
    <div class="buttons-level-block">
      <h2>Levels</h2>
      <p>From Easy to most Hard</p>
      <ol class="btn-wrapper level-menu">
        <li><button class="btn btn-primary btn-select-level" data-level="0">1</button></li>
        <li><button class="btn btn-primary btn-select-level" data-level="1">2</button></li>
        <li><button class="btn btn-primary btn-select-level" data-level="2">3</button></li>
        <li><button class="btn btn-primary btn-select-level" data-level="3">4</button></li>
        <li><button class="btn btn-primary btn-select-level" data-level="4">5</button></li>
        <li><button class="btn btn-primary btn-select-level" data-level="5">6</button></li>
        <li><button class="btn btn-danger btn-select-level" data-level="6">7</button></li>
      </ol>
    </div>
    <div class="game-window game-window--hidden"></div>
  </div>
  `;
  return elem;
}
