const initSortingApp = () => {
  //  Выносим "магические числа" в константы
  const SORT_INTERVAL_MS = 2000;
  const IMDB_DECIMAL_PLACES = 2;

  // Базовые данные фильмов
  const moviesData = [
    { id: 26, title: "Побег из Шоушенка", imdb: 9.3, year: 1994 },
    { id: 25, title: "Крёстный отец", imdb: 9.2, year: 1972 },
    { id: 27, title: "Крёстный отец 2", imdb: 9.0, year: 1974 },
    { id: 1047, title: "Тёмный рыцарь", imdb: 9.0, year: 2008 },
    { id: 223, title: "Криминальное чтиво", imdb: 8.9, year: 1994 },
  ];

  // Очередность сортировки по ТЗ
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
      //  Используем константу вместо числа 2
      tr.dataset.imdb = movie.imdb.toFixed(IMDB_DECIMAL_PLACES);
      tr.innerHTML = `
        <td>#${movie.id}</td>
        <td>${movie.title}</td>
        <td>(${movie.year})</td>
        <td>imdb: ${movie.imdb.toFixed(IMDB_DECIMAL_PLACES)}</td>
      `;
      // Используем append вместо appendChild
      tbodyData.append(tr);
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
      }
    }
  }

  /* ==========================================================================
     ПОДХОД 2: IN-MEMORY СОРТИРОВКА (С ПОЛНОЙ ПЕРЕСБОРКОЙ DOM)
     ========================================================================== */
  const tbodyMemory = document.querySelector(".movie-tbody-memory");
  const headersMemory = document.querySelectorAll(".memory-th");

  let memoryMovies = [...moviesData];

  function renderMemoryTable() {
    if (!tbodyMemory) return;

    tbodyMemory.innerHTML = "";

    memoryMovies.forEach((movie) => {
      const tr = document.createElement("tr");
      tr.dataset.id = movie.id;
      tr.dataset.title = movie.title;
      tr.dataset.year = movie.year;
      //  Используем константу вместо числа 2
      tr.dataset.imdb = movie.imdb.toFixed(IMDB_DECIMAL_PLACES);

      tr.innerHTML = `
        <td>#${movie.id}</td>
        <td>${movie.title}</td>
        <td>(${movie.year})</td>
        <td>imdb: ${movie.imdb.toFixed(IMDB_DECIMAL_PLACES)}</td>
      `;
      //  Используем append вместо appendChild
      tbodyMemory.append(tr);
    });
  }

  function sortInMemoryTable(key, dir) {
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

    headersMemory.forEach((th) => (th.textContent = th.dataset.sort));
    const activeHeader = Array.from(headersMemory).find(
      (th) => th.dataset.sort === key,
    );
    if (activeHeader) activeHeader.textContent += dir === "asc" ? " ↑" : " ↓";

    renderMemoryTable();
  }

  renderMemoryTable();

  /* ==========================================================================
     ОБЩИЙ ИНТЕРВАЛ ДЛЯ ОБЕИХ ТАБЛИЦ
     ========================================================================== */

  // Сохраняем интервал в переменную
  // eslint-disable-next-line no-unused-vars
  const intervalId = setInterval(() => {
    const { key, dir } = sortingSequence[currentSortStep];

    if (tbodyData) sortDataAttributesTable(key, dir);
    if (tbodyMemory) sortInMemoryTable(key, dir);

    currentSortStep = (currentSortStep + 1) % sortingSequence.length;
  }, SORT_INTERVAL_MS);
};

// Передаем именованную функцию в слушатель событий
document.addEventListener("DOMContentLoaded", initSortingApp);
