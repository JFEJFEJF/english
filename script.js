document.getElementById('word-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const englishWord = document.getElementById('english-word').value;
    const arabicMeaning = document.getElementById('arabic-meaning').value;
    const note = document.getElementById('note').value;

    if (validateInput(englishWord, arabicMeaning) && !isDuplicate(englishWord)) {
        addWordToTable(englishWord, arabicMeaning, note);
        saveData();
        updateProgress();
        document.getElementById('duplicate-error').textContent = '';
    } else {
        document.getElementById('duplicate-error').textContent = 'الكلمة موجودة بالفعل.';
    }
});

function validateInput(englishWord, arabicMeaning) {
    let isValid = true;

    if (/[^a-zA-Z\s]/.test(englishWord)) {
        document.getElementById('english-error').textContent = 'غير مقبول. يرجى إدخال أحرف إنجليزية فقط.';
        isValid = false;
    } else {
        document.getElementById('english-error').textContent = '';
    }

    if (/[a-zA-Z0-9]/.test(arabicMeaning)) {
        document.getElementById('arabic-error').textContent = 'غير مقبول. يرجى إدخال أحرف عربية فقط.';
        isValid = false;
    } else {
        document.getElementById('arabic-error').textContent = '';
    }

    return isValid;
}

function isDuplicate(englishWord) {
    const table = document.getElementById('words-table').querySelector('tbody');
    const rows = Array.from(table.rows);
    return rows.some(row => row.cells[0].textContent === englishWord);
}

function addWordToTable(englishWord, arabicMeaning, note) {
    const table = document.getElementById('words-table').querySelector('tbody');
    const row = table.insertRow();

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);

    cell1.textContent = englishWord;
    cell2.textContent = arabicMeaning;
    cell3.textContent = note;

    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkbox-container');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', updateProgress);
    checkboxContainer.appendChild(checkbox);
    cell4.appendChild(checkboxContainer);

    const editIcon = document.createElement('span');
    editIcon.classList.add('icon', 'edit-icon');
    editIcon.addEventListener('click', () => editRow(row));
    cell5.appendChild(editIcon);

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('icon', 'delete-icon');
    deleteIcon.addEventListener('click', () => deleteRow(row));
    cell6.appendChild(deleteIcon);

    document.getElementById('english-word').value = '';
    document.getElementById('arabic-meaning').value = '';
    document.getElementById('note').value = '';
}

function saveData() {
    const table = document.getElementById('words-table').querySelector('tbody');
    const rows = Array.from(table.rows).map(row => {
        return {
            englishWord: row.cells[0].textContent,
            arabicMeaning: row.cells[1].textContent,
            note: row.cells[2].textContent,
            saved: row.cells[3].querySelector('input').checked
        };
    });
    localStorage.setItem('words', JSON.stringify(rows));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('words')) || [];
    data.forEach(word => {
        addWordToTable(word.englishWord, word.arabicMeaning, word.note);
        const table = document.getElementById('words-table').querySelector('tbody');
        const row = table.rows[table.rows.length - 1];
        row.cells[3].querySelector('input').checked = word.saved;
    });
    updateProgress();
}

function updateProgress() {
    const table = document.getElementById('words-table').querySelector('tbody');
    const rows = Array.from(table.rows);
    const totalWords = rows.length;
    const savedWords = rows.filter(row => row.cells[3].querySelector('input').checked).length;
    const progress = totalWords === 0 ? 0 : Math.round((savedWords / totalWords) * 100);
    document.querySelector('.circle').style.strokeDasharray = `${progress}, 100`;
    document.querySelector('.percentage').textContent = `${progress}%`;
}

function editRow(row) {
    const englishWord = row.cells[0].textContent;
    const arabicMeaning = row.cells[1].textContent;
    const note = row.cells[2].textContent;

    document.getElementById('english-word').value = englishWord;
    document.getElementById('arabic-meaning').value = arabicMeaning;
    document.getElementById('note').value = note;

    deleteRow(row);
}

function deleteRow(row) {
    row.remove();
    saveData();
    updateProgress();
}

loadData();
