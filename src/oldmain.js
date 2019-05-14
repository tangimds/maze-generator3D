let walls = [];
let player;
let r;

let maze;
let applyMaze;

let edgeSize = 400

function setup() {  
  createCanvas(3*edgeSize, edgeSize);
  // for (let i = 0; i < 5; i++) {
  //   let ax = random(edgeSize);
  //   let ay = random(height);
  //   let bx = random(edgeSize);
  //   let by = random(height);
  //   walls[i] = new Wall(createVector(ax, ay), createVector(bx, by));
  // }

  walls.push(new Wall(createVector(0, 0), createVector(edgeSize, 0)));
  walls.push(new Wall(createVector(edgeSize, 0), createVector(edgeSize, edgeSize)));
  walls.push(new Wall(createVector(edgeSize, edgeSize), createVector(0, edgeSize)));
  walls.push(new Wall(createVector(0, edgeSize), createVector(0, 0)));

  r = new Ray(createVector(50, 200));
  maze = new Maze(20, 20, w);
  maze.generate();
  applyMaze = false;

  let positionPlayer = createVector(w / 2, w / 2);
  player = new Player(positionPlayer, PI/2);

  sliderFOV = createSlider(0,360,70);
  sliderFOV.input(changeFOV);

  checkBoxWalls = createCheckbox('show walls', false);
  checkBoxWalls.changed(showWalls);
}

function changeFOV(){
  let fov = sliderFOV.value();
  player.setFOV(fov);
}

function showWalls(){
  print("change");
  let show = checkBoxWalls.checked();
  print(show);
  for(let wall of walls){
    if(show){
      wall.setColor('#f00');
    }else{
      wall.setColor('#f000');
    }
  }
}

function draw() {


  if (keyIsPressed) {
    if (keyIsDown(UP_ARROW)) {
      player.move(1);
    } else if (keyIsDown(DOWN_ARROW)) {
      player.move(-1);
    }if (keyIsDown(RIGHT_ARROW)) {
      player.rotate(0.1);
    } else if (keyIsDown(LEFT_ARROW)) {
      player.rotate(-0.1);
    }
  }

  background(50);
  text(sliderFOV.value(), 400, 800);

  for (let wall of walls) {
    wall.show();
  }

  player.look(walls);
  player.checkMove(walls);

  if (maze && maze.grid && !applyMaze) {
    for (let i = 0; i < grid.length; i++) {
      let cell = grid[i];
      if (!applyMaze) {
        let y = cell.i * w;
        let x = cell.j * w;
        // if (cell.walls[0])
        //   walls.push(new Wall(createVector(x, y), createVector(x + w, y)));
        if (cell.walls[1])
          walls.push(
            new Wall(createVector(x + w, y), createVector(x + w, y + w))
          );
        if (cell.walls[2])
          walls.push(
            new Wall(createVector(x + w, y + w), createVector(x, y + w))
          );
        // if (cell.walls[3])
        //   walls.push(new Wall(createVector(x, y + w), createVector(x, y)));
      }
    }
    applyMaze = true;
  }


  push();
  stroke('#555');
  line(edgeSize,0,edgeSize,edgeSize);
  pop();

  translate(edgeSize,0);


  player.view3D(walls);
}
