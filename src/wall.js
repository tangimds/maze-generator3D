class Wall {
  constructor(a,b){
    this.start = a;
    this.end = b;
    this.col = '#f000';
  }

  show(){
    push();
    stroke(this.col);
    line(this.start.x,this.start.y,this.end.x,this.end.y)
    pop();
  }

  setColor(col){
    this.col = col;
  }
}
