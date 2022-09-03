export default function createMenuGame(previousBookStudy: boolean): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'audio-call-game container';
  const meaningfulName1 = `
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
    <p>
      Game controls: you can play with both, mouse/touchpad and keyboard.<br>
      Use keys from 1 to 5 to answer questions and Enter key to activate 'I do not know' button and skip to the next question.<br>
      To hear the given word press Spacebar.
    <p>
  </div>
    <div class="game-window game-window--hidden"></div>
  </div>`;
  const meaningfulName2 = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Audio-call</h1>
    <div class="game-window"></div>
  `;
  elem.innerHTML = previousBookStudy ? meaningfulName2 : meaningfulName1;
  console.log(elem);
  return elem;
}
