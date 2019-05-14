let w = 20;
let cols, rows;
let grid;

class Maze {
  constructor(wi, he, cellSize) {
    w = cellSize;
    cols = wi;
    rows = he;
    this.grid = undefined;
  }

  generate() {
    grid = [];

    let currentCell;
    let unvisitedNeighbours = [];
    let stack = [];
    let nextCell;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid.push(new Cell(i, j));
      }
    }
    currentCell = grid[floor(random(cols * rows))];
    stack.push(currentCell);
    currentCell.visit();

    while (currentCell) {
      print("generating maze ...");
      if (stack.length > 0) {
        unvisitedNeighbours = currentCell.unvisitedNeighbours();
        if (unvisitedNeighbours.length > 0) {
          nextCell = random(unvisitedNeighbours);
          currentCell.goTo(nextCell);
          stack.push(nextCell);
          nextCell.visit();
          currentCell = nextCell;
        } else {
          currentCell = stack.pop();
        }
      } else {
        print("done");
        currentCell = undefined;
      }
    }
    this.grid = grid;
  }
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.walls = [true, true, true, true];
  }

  visit() {
    if (!this.visited) {
      this.visited = true;
    }
  }

  highlight() {
    let y = this.i * w;
    let x = this.j * w;
    push();
    fill("#f005");
    noStroke();
    rect(x, y, w, w);
    pop();
  }

  show() {
    noFill();
    stroke("#ccc");
    let y = this.i * w;
    let x = this.j * w;

    if (this.walls[0]) line(x, y, x + w, y);
    if (this.walls[1]) line(x + w, y, x + w, y + w);
    if (this.walls[2]) line(x + w, y + w, x, y + w);
    if (this.walls[3]) line(x, y + w, x, y);

    if (this.visited) {
      push();
      fill("#0f03");
      noStroke();
      rect(x, y, w, w);
      pop();
    }
  }

  unvisitedNeighbours() {
    let neigbours = [];
    for (let ii = -1; ii < 2; ii++) {
      for (let jj = -1; jj < 2; jj++) {
        let ni = this.i + ii;
        let nj = this.j + jj;
        if (
          !(ni >= rows || ni < 0 || nj >= cols || nj < 0 || abs(ii * jj) > 0)
        ) {
          let neigbour = grid[ni * rows + nj];
          if (!neigbour.visited) {
            neigbours.push(neigbour);
          }
        }
      }
    }
    return neigbours;
  }

  goTo(cell) {
    let di = cell.i - this.i;
    let dj = cell.j - this.j;
    if (di == 1) {
      //print("go down");
      this.walls[2] = false;
      cell.walls[0] = false;
    } else if (di == -1) {
      // print("go up");
      this.walls[0] = false;
      cell.walls[2] = false;
    } else if (dj == 1) {
      //print("go right");
      this.walls[1] = false;
      cell.walls[3] = false;
    } else if (dj == -1) {
      //  print("go left");
      this.walls[3] = false;
      cell.walls[1] = false;
    }
  }
}
