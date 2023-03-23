var numSelected = null;
var tileSelected = null;

var errors = 0;
// JS program to implement the approach
class Sudoku {

	// Constructor
	constructor(N, K) {
		this.N = N;
		this.K = K;

		// Compute square root of N
		const SRNd = Math.sqrt(N);
		this.SRN = Math.floor(SRNd);

		// Initialize all entries as false to indicate
		// that there are no edges initially
		this.mat = Array.from({
			length: N
		}, () => Array.from({
			length: N
		}, () => 0));
	}

	// Sudoku Generator
	fillValues() {
		// Fill the diagonal of SRN x SRN matrices
		this.fillDiagonal();

		// Fill remaining blocks
		this.fillRemaining(0, this.SRN);

		// Remove Randomly K digits to make game
		//this.removeKDigits();
	}

	// Fill the diagonal SRN number of SRN x SRN matrices
	fillDiagonal() {
		for (let i = 0; i < this.N; i += this.SRN) {
			// for diagonal box, start coordinates->i==j
			this.fillBox(i, i);
		}
	}

	// Returns false if given 3 x 3 block contains num.
	unUsedInBox(rowStart, colStart, num) {
		for (let i = 0; i < this.SRN; i++) {
			for (let j = 0; j < this.SRN; j++) {
				if (this.mat[rowStart + i][colStart + j] === num) {
					return false;
				}
			}
		}
		return true;
	}

	// Fill a 3 x 3 matrix.
	fillBox(row, col) {
		let num = 0;
		for (let i = 0; i < this.SRN; i++) {
			for (let j = 0; j < this.SRN; j++) {
				while (true) {
					num = this.randomGenerator(this.N);
					if (this.unUsedInBox(row, col, num)) {
						break;
					}
				}
				this.mat[row + i][col + j] = num;
			}
		}
	}

	// Random generator
	randomGenerator(num) {
		return Math.floor(Math.random() * num + 1);
	}

	// Check if safe to put in cell
	checkIfSafe(i, j, num) {
		return (
			this.unUsedInRow(i, num) &&
			this.unUsedInCol(j, num) &&
			this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
		);
	}

	// check in the row for existence
	unUsedInRow(i, num) {
		for (let j = 0; j < this.N; j++) {
			if (this.mat[i][j] === num) {
				return false;
			}
		}
		return true;
	}

	// check in the row for existence
	unUsedInCol(j, num) {
		for (let i = 0; i < this.N; i++) {
			if (this.mat[i][j] === num) {
				return false;
			}
		}
		return true;
	}

	// A recursive function to fill remaining
	// matrix
	fillRemaining(i, j) {
		// Check if we have reached the end of the matrix
		if (i === this.N - 1 && j === this.N) {
			return true;
		}

		// Move to the next row if we have reached the end of the current row
		if (j === this.N) {
			i += 1;
			j = 0;
		}


		// Skip cells that are already filled
		if (this.mat[i][j] !== 0) {
			return this.fillRemaining(i, j + 1);
		}

		// Try filling the current cell with a valid value
		for (let num = 1; num <= this.N; num++) {
			if (this.checkIfSafe(i, j, num)) {
				this.mat[i][j] = num;
				if (this.fillRemaining(i, j + 1)) {
					return true;
				}
				this.mat[i][j] = 0;
			}
		}

		// No valid value was found, so backtrack
		return false;
	}

	// Print sudoku
	printSudoku() {
		for (let i = 0; i < this.N; i++) {
				console.log(this.mat[i].join(" "))
		}
	}

	// Remove the K no. of digits to
	// complete game
	removeKDigits() {
		let count = this.K;

		while (count !== 0) {
			// extract coordinates i and j
			let i = Math.floor(Math.random() * this.N);
			let j = Math.floor(Math.random() * this.N);
			if (this.mat[i][j] !== 0) {
				count--;
				this.mat[i][j] = 0;
			}
		}

		return;
	}
}


// Driver code
let N = 9
let K = 20
let sudoku = new Sudoku(N, K)
sudoku.fillValues()
var board = sudoku.mat

var solution = JSON.parse(JSON.stringify(board))
sudoku.removeKDigits()
// console.log("Solution\n")
// console.log(solution)
// console.log("Board\n")
// console.log(board)

window.onload = function(){
    setGame()
}

function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber)
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    //Board 9x9
    for(let r=0; r<9; r++){
        for(let c=0; c<9; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if(board[r][c] != "0"){
                tile.innerText = board[r][c];
                tile.classList.add("tile-start")
            }
            if(r==2 || r ==5){
                tile.classList.add("horizontal-line")
            }
            if(c==2 || c==5){
                tile.classList.add("vertical-line")
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber(){
    //Checking if the number has the class if it does removes the class.
    if (numSelected != null){
        numSelected.classList.remove("number-selected")
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile(){
    if (numSelected){
        if (this.innerText != ""){
            return
        }
        //0-0, 0-1, 0,2 ...etc (row,col)
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id){
            this.innerText = numSelected.id;
        }
        else{
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}