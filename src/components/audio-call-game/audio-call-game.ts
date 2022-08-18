import './audio-call-game.css';

import choiceOfDifficultyLevel from './menuDifficultyLevel/choiceOfDifficultyLevel/choiceOfDifficultyLevel';

export default async function getAudioCallGame(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'audio-call-game';

  elem.innerHTML = `
    <div class="wrapper">
      <h2>Audio-call mini-game</h2>
      <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
        <label class="btn btn-outline-primary" for="btnradio1">1</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio2">2</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio3">3</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio4">4</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio5" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio5">5</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio6" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio6">6</label>
      </div>
      <div class="container text-center game-window">
        <div class="row">
          <div class="col current-word">
            current word
          </div>
        </div>
        <div class="row">
        <div class="col">
          <button type="button" class="btn btn-light">Word</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-light">Word</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-light">Word</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-light">Word</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-light">Word</button>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-lg button-text-round">Next</button>
    </div>

  </div>
  `;
  choiceOfDifficultyLevel();
  return elem;
}
