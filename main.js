const dimensionButton = document.getElementById('dimension-button');//thay đổi kích thước của bàn cờ.
const statusElement = document.getElementById('status');//hiển thị trạng thái hiện tại của trò chơi (ví dụ: người chiến thắng, lượt đi tiếp theo).
const restartButton = document.getElementById('restart-btn');//khởi động lại trò chơi.
const singlePlayerToggle = document.getElementById('single-player-toggle');// Đây là nút để chuyển đổi chế độ chơi đơn người.
const boardElement = document.getElementById('board');// phần tử chứa bàn cờ.

let dimension = 10; // tạo giá trí ban đầu cho kích thước bàn cờ

dimensionButton.textContent = `${dimension}x${dimension}`; //kích thước của bàn cờ

let singlePlayerMode = false; //chế độ  chơi
let squares = Array(dimension).fill(Array(dimension).fill(null)); //tạo mảng 2 chiều để chứa các phần tử của bàn cờ có g

let xIsNext = Math.random() < 0.5; // Chọn ngẫu nhiên người chơi đi trước , nhỏ hơn 0.5, xIsNext sẽ được gán giá trị true (người chơi X đi trước)
let theWinner = null; //tìm người chiến thắng
let winningLine = []; //khởi tạo với một mảng rỗng để lưu trữ các ô thắng nếu có.

const dimensions = [10, 12, 16, 20]; //các kích thước của bàn cờ
let dimensionIndex = 0; //để lưu trữ chỉ số của kích thước hiện tại trong mảng dimensions.

//  xử lý sự kiện khi người dùng click vào nút thay đổi kích thước bàn cờ.
dimensionButton.addEventListener('click', function () {
    dimensionIndex = (dimensionIndex + 1) % dimensions.length; //Tăng giá trị của biến dimensionIndex lên 1 và sau đó lấy phần dư khi chia cho độ dài của mảng dimensions. Điều này giúp chuyển đổi giá trị của dimensionIndex sang các giá trị khác nhau trong mảng dimensions một cách lặp lại.
    dimension = dimensions[dimensionIndex]; //Gán giá trị của biến dimension bằng phần tử trong mảng dimensions tương ứng với dimensionIndex.
    dimensionButton.textContent = `${dimension}x${dimension}`;//Cập nhật nội dung của button dimensionButton bằng cách sử dụng template string để hiển thị kích thước mới.
    restartGame(); //Gọi hàm  để khởi động lại trò chơi sau khi đã thay đổi kích thước.
});
restartButton.addEventListener('click', restartGame);

singlePlayerToggle.addEventListener('click', function () {
    toggleSinglePlayerMode();// gọi hàm thay đổi chế độ chơi
    restartGame();//gọi hàm khởi động lại trò chơi
    if (singlePlayerMode && !xIsNext) {
        makeComputerMove(); //gọi hàm đánh với máy
    }
});

//tạo hàm kểm tra và gọi các giá trị
function handleClick(row, col) {
    if (theWinner || squares[row][col]) {
        return;
    }

    const newSquares = squares.map((row) => [...row]);//sẽ tạo ra một bản sao của mảng squares và gán vào biến newSquares.
    newSquares[row][col] = xIsNext ? 'X' : 'O';// Sử dụng 'X' hoặc 'O' tùy thuộc vào người chơi hiện tại
    squares = newSquares;
    squares = newSquares;
    xIsNext = !xIsNext;// Chuyển lượt đi cho người chơi tiếp theo

    const winner = calculateWinner(newSquares, row, col);
    if (winner) {
        theWinner = winner;
    }

    renderBoard();
    updateStatus();

    if (singlePlayerMode && !theWinner && !xIsNext) {
        makeComputerMove();
    }
}

//tạo hàm kiểm tra người chiến thắng
function calculateWinner(currentSquares, row, col) {
    const currentPlayer = currentSquares[row][col];

    // Check horizontally(kiểm tra chiều ngang)
    let count = 1;
    let leftCol = col - 1;
    while (leftCol >= 0 && currentSquares[row][leftCol] === currentPlayer) {
        count++;
        leftCol--;
    }
    let rightCol = col + 1;
    while (rightCol < dimension && currentSquares[row][rightCol] === currentPlayer) {
        count++;
        rightCol++;
    }
    if (count >= 5) {
        return currentPlayer;
    }

    // Check vertically(kiểm tra chiều dọc)
    count = 1;
    let topRow = row - 1;
    while (topRow >= 0 && currentSquares[topRow][col] === currentPlayer) {
        count++;
        topRow--;
    }
    let bottomRow = row + 1;
    while (bottomRow < dimension && currentSquares[bottomRow][col] === currentPlayer) {
        count++;
        bottomRow++;
    }
    if (count >= 5) {
        return currentPlayer;
    }

    // Check diagonally (top-left to bottom-right) đường chéo từ trên trái xuống dưới phải
    count = 1;
    let topLeftRow = row - 1;
    let topLeftCol = col - 1;
    while (topLeftRow >= 0 && topLeftCol >= 0 && currentSquares[topLeftRow][topLeftCol] === currentPlayer) {
        count++;
        topLeftRow--;
        topLeftCol--;
    }
    let bottomRightRow = row + 1;
    let bottomRightCol = col + 1;
    while (bottomRightRow < dimension && bottomRightCol < dimension && currentSquares[bottomRightRow][bottomRightCol] === currentPlayer) {
        count++;
        bottomRightRow++;
        bottomRightCol++;
    }
    if (count >= 5) {
        return currentPlayer;
    }

    // Check diagonally (top-right to bottom-left) đươờng chéo trên phải xuống trái dưới
    count = 1;
    let topRightRow = row - 1;
    let topRightCol = col + 1;
    while (topRightRow >= 0 && topRightCol < dimension && currentSquares[topRightRow][topRightCol] === currentPlayer) {
        count++;
        topRightRow--;
        topRightCol++;
    }
    let bottomLeftRow = row + 1;
    let bottomLeftCol = col - 1;
    while (bottomLeftRow < dimension && bottomLeftCol >= 0 && currentSquares[bottomLeftRow][bottomLeftCol] === currentPlayer) {
        count++;
        bottomLeftRow++;
        bottomLeftCol--;
    }
    if (count >= 5) {
        return currentPlayer;
    }

    return null;
}


//tạo hàm thêm màu sắc cho x và o
function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < dimension; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'board-row';

        for (let col = 0; col < dimension; col++) {
            const value = squares[row][col];

            const squareButton = document.createElement('button');
            squareButton.className = 'square';

            squareButton.style.color = value === 'X' ? 'blue' : 'red';
            // squareButton.style.fontWeight = isWinningSquare ? 'bold' : 'normal';
            squareButton.textContent = value;
            squareButton.addEventListener('click', () => {
                if (!singlePlayerMode || (singlePlayerMode && xIsNext)) {
                    handleClick(row, col);
                }
            });

            rowElement.appendChild(squareButton);
        }

        boardElement.appendChild(rowElement);
    }
}


//Khi tìm được người chiến thắng mình sẽ hiển thị thông tin người thắng cuộc
function updateStatus() {
    if (theWinner) {
       alert('chiến thắng: ' + theWinner);
    } else {
        statusElement.textContent = `người chơi:  ${xIsNext ? 'X' : 'O'}`;
    }
}


//hàm trả lại ban dầu
function restartGame() {
    squares = Array(dimension).fill(Array(dimension).fill(null));
    xIsNext = true;
    theWinner = null;
    winningLine = [];
    renderBoard();
    updateStatus();
}

//tạo hàm người chơi là máy
function makeComputerMove() {
    if (!singlePlayerMode || theWinner) {
        return;
    }

    const availableMoves = [];  //  lưu trữ tọa độ của các ô trống trên bàn cờ.
    const humanPlayer = xIsNext ? 'X' : 'O';
    const computerPlayer = xIsNext ? 'O' : 'X';

    // lặp qua từng hàng và cột của mảng squares. Nếu ô đó không có giá trị (null),
    //tọa độ của ô đó sẽ được thêm vào mảng availableMoves.
    squares.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (!squares[rowIndex][colIndex]) {
                availableMoves.push([rowIndex, colIndex]);
            }
        });
    });

    if (availableMoves.length > 0) {
        // Check if the computer can win in the next move(Kiểm tra xem máy tính có thể giành chiến thắng ở nước đi tiếp theo không)
        for (let i = 0; i < availableMoves.length; i++) {
            const [row, col] = availableMoves[i];
            const newSquares = squares.map((row) => [...row]);
            newSquares[row][col] = computerPlayer;

            if (calculateWinner(newSquares, row, col) === computerPlayer) {
                handleClick(row, col);
                return;
            }
        }

        // Check if the human player can win in the next move(Kiểm tra xem người chơi có thể giành chiến thắng ở nước đi tiếp theo không)
        for (let i = 0; i < availableMoves.length; i++) {
            const [row, col] = availableMoves[i];
            const newSquares = squares.map((row) => [...row]);
            newSquares[row][col] = humanPlayer;

            if (calculateWinner(newSquares, row, col) === humanPlayer) {
                handleClick(row, col);
                return;
            }
        }

        // Random move for normal difficulty(Di chuyển ngẫu nhiên cho độ khó bình thường)
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const [row, col] = availableMoves[randomIndex];

        // Choose a winning move for hard difficulty
        if (availableMoves.length >= 3) {
            for (let i = 0; i < availableMoves.length; i++) {
                const [row, col] = availableMoves[i];
                const newSquares = squares.map((row) => [...row]);
                newSquares[row][col] = computerPlayer;

                if (isWinningMove(newSquares, computerPlayer)) {
                    handleClick(row, col);
                    return;
                }
            }
        }

        handleClick(row, col);
    }
}


//Hàm isWinningMove được sử dụng trong phần điều kiện của hàm makeComputerMove để chọn một nước đi chiến thắng nếu có .
function isWinningMove(currentSquares, player) {
    for (let row = 0; row < dimension; row++) {
        for (let col = 0; col < dimension; col++) {
            if (!currentSquares[row][col]) {
                const newSquares = currentSquares.map((row) => [...row]);
                newSquares[row][col] = player;
                if (calculateWinner(newSquares, row, col) === player) {
                    return true;
                }
            }
        }
    }
    return false;
}


//hàm thay đổi chế độ chơi
function toggleSinglePlayerMode() {
    singlePlayerMode = !singlePlayerMode;
    if (singlePlayerMode) {
        singlePlayerToggle.innerHTML = '&#x1F4F2;';//Emoji chart-objects
    } else {
        singlePlayerToggle.innerHTML = '&#x1F477;';//Emoji chart-objects
    }
}
renderBoard();
updateStatus();