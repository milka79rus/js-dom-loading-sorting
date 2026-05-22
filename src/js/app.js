document.addEventListener("DOMContentLoaded", () => {

  const moviesData = [
    { id: 26, title: "Побег из Шоушенка", imdb: 9.3, year: 1994 },
    { id: 25, title: "Крёстный отец", imdb: 9.2, year: 1972 },
    { id: 27, title: "Крёстный отец 2", imdb: 9.0, year: 1974 },
    { id: 1047, title: "Тёмный рыцарь", imdb: 9.0, year: 2008 },
    { id: 223, title: "Криминальное чтиво", imdb: 8.9, year: 1994 },
  ];


  const sortingSequence = [
    { key: "id", dir: "asc" },
    { key: "id", dir: "desc" },
    { key: "title", dir: "asc" },
    { key: "title", dir: "desc" },
    { key: "year", dir: "asc" },
    { key: "year", dir: "desc" },
    { key: "imdb", dir: "asc" },
    { key: "imdb", dir: "desc" },
  ];

  let currentSortStep = 0;

  /* ==========================================================================
     ПОДХОД 1: СОРТИРОВКА ПО DATA-АТРИБУТАМ (С АЛГОРИТМОМ DIFF)
     ========================================================================== */
  const tbodyData = document.querySelector(".movie-tbody-data");
  const headersData = document.querySelectorAll(".data-th");

  if (tbodyData) {
    moviesData.forEach((movie) => {
      const tr = document.createElement("tr");
      tr.dataset.id = movie.id;
      tr.dataset.title = movie.title;
      tr.dataset.year = movie.year;
      tr.dataset.imdb = movie.imdb.toFixed(2);
      tr.innerHTML = `
        <td>#${movie.id}</td>
        <td>${movie.title}</td>
        <td>(${movie.year})</td>
        <td>imdb: ${movie.imdb.toFixed(2)}</td>
      `;
      tbodyData.appendChild(tr);
    });
  }

  function sortDataAttributesTable(key, dir) {
    const currentRowsInDOM = Array.from(tbodyData.querySelectorAll("tr"));
    const sortedRows = [...currentRowsInDOM].sort((rowA, rowB) => {
      const valA = rowA.dataset[key];
      const valB = rowB.dataset[key];
      if (key === "id" || key === "year" || key === "imdb") {
        return dir === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }
      return dir === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    headersData.forEach((th) => (th.textContent = th.dataset.sort));
    const activeHeader = Array.from(headersData).find(
      (th) => th.dataset.sort === key,
    );
    if (activeHeader) activeHeader.textContent += dir === "asc" ? " ↑" : " ↓";

    for (let i = 0; i < sortedRows.length; i++) {
      const targetRow = sortedRows[i];
      const currentRowInDOM = tbodyData.children[i];

      if (currentRowInDOM !== targetRow) {
        tbodyData.insertBefore(targetRow, currentRowInDOM);
        console.log(`[Diff] Перемещен фильм: "${targetRow.dataset.title}" на индекс ${i}`);
      }
    }
  }

  /* ==========================================================================
     ПОДХОД 2: IN-MEMORY СОРТИРОВКА (С ПОЛНОЙ ПЕРЕСБОРКОЙ DOM)
     ========================================================================== */
  const tbodyMemory = document.querySelector(".movie-tbody-memory");
  const headersMemory = document.querySelectorAll(".memory-th");

  // Храним копию массива данных прямо в памяти JS
  let memoryMovies = [...moviesData];

  // Функция рендеринга таблицы с нуля
  function renderMemoryTable() {
    if (!tbodyMemory) return;

    // Полностью очищаем дерево элементов перед сборкой
    tbodyMemory.innerHTML = "";

    memoryMovies.forEach((movie) => {
      const tr = document.createElement("tr");
      tr.dataset.id = movie.id;
      tr.dataset.title = movie.title;
      tr.dataset.year = movie.year;
      tr.dataset.imdb = movie.imdb.toFixed(2);

      tr.innerHTML = `
        <td>#${movie.id}</td>
        <td>${movie.title}</td>
        <td>(${movie.year})</td>
        <td>imdb: ${movie.imdb.toFixed(2)}</td>
      `;
      tbodyMemory.appendChild(tr);
    });
  }

  function sortInMemoryTable(key, dir) {
    // Сортируем массив ОБЪЕКТОВ в памяти, а не DOM-элементы
    memoryMovies.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (key === "id" || key === "year" || key === "imdb") {
        return dir === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }
      return dir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    // Обновляем стрелочки в шапке второй таблицы
    headersMemory.forEach((th) => (th.textContent = th.dataset.sort));
    const activeHeader = Array.from(headersMemory).find(
      (th) => th.dataset.sort === key,
    );
    if (activeHeader) activeHeader.textContent += dir === "asc" ? " ↑" : " ↓";

    // Пересобираем DOM дерево на основе отсортированного массива памяти
    renderMemoryTable();
  }

  // Первичный запуск отрисовки для In-Memory таблицы
  renderMemoryTable();

  /* ==========================================================================
     ОБЩИЙ ИНТЕРВАЛ ДЛЯ ОБЕИХ ТАБЛИЦ
     ========================================================================== */
  setInterval(() => {
    const { key, dir } = sortingSequence[currentSortStep];

    // Запускаем оба метода параллельно
    if (tbodyData) sortDataAttributesTable(key, dir);
    if (tbodyMemory) sortInMemoryTable(key, dir);

    currentSortStep = (currentSortStep + 1) % sortingSequence.length;
  }, 2000);
});
