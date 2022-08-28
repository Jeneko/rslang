export default async function getStatPage() {
  const page = document.createElement('div');
  page.innerHTML = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Statistics<h1>
  `;
  return page;
}
