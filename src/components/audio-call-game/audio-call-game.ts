import getChoiceOfDifficultyLevel from './menuDifficultyLevel/getChoiceOfDifficultyLevel/getChoiceOfDifficultyLevel';

export default async function getAudioCallGame(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'audio-call-game';

  elem.innerHTML = `
    <div class="wrapper">
      <h2>Audio-call mini-game</h2>
      <div class="btn-group level-menu" role="group" aria-label="Basic radio toggle button group">
        <input data-level="0" type="radio" class="btn-check" name="btnradio" id="btnradio0" autocomplete="off" checked>
        <label class="btn btn-outline-primary" for="btnradio0">0</label>

        <input data-level="1" type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio1">1</label>

        <input data-level="2" type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio2">2</label>

        <input data-level="3" type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio3">3</label>

        <input data-level="4" type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio4">4</label>

        <input data-level="5" type="radio" class="btn-check" name="btnradio" id="btnradio5" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio5">5</label>

        <input data-level="6" type="radio" class="btn-check" name="btnradio" id="btnradio6" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio6">HARD</label>
      </div>
      <div class="container text-center game-window game-window--hidden">
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
  getChoiceOfDifficultyLevel();
  return elem;
}
