export default async function getStudyBookPage(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'study-book-page';

  elem.innerHTML = `
    <h1>RSLang - Study Book Page</h1>
  `;

  return elem;
}
