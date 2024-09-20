const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector('#export-btn');
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
]


class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportBtn.onclick = function(e) {
    let csv = "";
    const userFilename = prompt(`파일 이름을 입력해주세요(확장자 제외)\n취소할 경우 임의로 파일명이 설정됩니다.`);
    const filename = userFilename ? `${userFilename}.csv` : 'spreadsheet name.csv';
    for(let i = 0; i < spreadsheet.length; i++) {
        if(i === 0) continue;
        csv += spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n"; 
    }
    console.log('csv :', csv);

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl blob:', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = filename;
    a.click();
}

initSpreadsheet();

function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            // 모든 row 첫 번째 컬럼에 숫자 넣기
            if(j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if(i === 0) {
                cellData = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            // 첫 번째 row의 컬럼은 "";
            if(!cellData) {
                cellData = "";
            } 

            const rowName = i;
            const columnName = alphabets[j - 1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    // console.log(spreadsheet);
}

function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
    
    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    // header의 하이라이팅
    clearHeaderActiveState();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    // console.log('clicked cell', columnHeaderEl, rowHeaderEl);
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;

    // 클릭된 cell의 하이라이팅을 위한 class 추가
    clearSelectedCell();
    const clickedCell = document.querySelector("#cell_" + cell.row + cell.column);

    if (clickedCell) {
        clickedCell.classList.add('selected-cell');
    }
}

function clearHeaderActiveState() {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('active');
    })
}

function clearSelectedCell() {
    const previousCell = document.querySelector('.selected-cell');
    if (previousCell) {
        previousCell.classList.remove('selected-cell');
    }
}

function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col)
}

function drawSheet() {
    for(let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}


