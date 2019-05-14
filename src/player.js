let finesse = 0.1;

class Player {
  constructor(p, a) {
    this.pos = p;
    this.head = a;
    this.fov = 70;
    this.rays = [];
    let half_fov = floor(this.fov / 2);
    for (let i = -half_fov; i < half_fov; i += finesse) {
      this.rays.push(new Ray(this.pos, radians(i) + this.head));
    }
    this.canUP = true;
    this.canDOWN = true;
    this.canRIGHT = true;
    this.canLEFT = true;
  }

  update() {}

  setFOV(f) {
    this.fov = f;
    let half_fov = floor(this.fov / 2);
    this.rays = [];
    for (let i = -half_fov; i < half_fov; i += finesse) {
      this.rays.push(new Ray(this.pos, radians(i) + this.head));
    }
    print("rectSize",ceil(edgeSize/this.rays.length));
    print("rays.length",this.rays.length);
  }

  show() {
    push();
    fill("#f00");
    ellipse(this.pos.x, this.pos.y, 10, 10);
    pop();
  }

  look(walls) {
    for (let ray of this.rays) {
      let closest = Infinity;
      let bestPoint;
      for (let wall of walls) {
        let pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(pt, this.pos);
          if (d < closest) {
            closest = d;
            bestPoint = pt;
          }
        }
      }
      if (bestPoint) {
        push();
        stroke("#fff2");
        line(this.pos.x, this.pos.y, bestPoint.x, bestPoint.y);
        pop();
      }
    }
  }

  view3D(walls){
    for(let i=0 ; i<this.rays.length ; i++){
      let ray = this.rays[i];
      let closest = Infinity;
      let bestPoint;
      for (let wall of walls) {
        let pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(pt, this.pos);
          let a = ray.dir.heading() - this.head;
          if(!mouseIsPressed){
            d *=  cos(a);
          }
          if (d < closest) {
            closest = d;
            bestPoint = pt;
          }
        }
      }
      if (bestPoint) {
        let rectWitdh = edgeSize/this.rays.length;

        let col = map(closest,0,5*w,255,20);
        let h = map(closest,0,5*w,edgeSize,edgeSize/3);

        push();
        noStroke();
        fill(col);
        rectMode(CENTER);
        rect(rectWitdh*(i+1/2),edgeSize/2,rectWitdh,h);
        pop();
      }
    }
  }

  checkMove(walls) {
    let distances = [];
    let closestPoints = [];
    let guides = [];
    for (let i = 0; i < 360; i += 90) {
      guides.push(new Ray(this.pos, radians(i)));
    }

    for (let i = 0; i < guides.length; i++) {
      let ray = guides[i];
      let closest = Infinity;
      let bestPoint;
      for (let wall of walls) {
        let pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt);
          if (d < closest) {
            closest = d;
            bestPoint = pt;
          }
        }
      }
      if (bestPoint) {
        push();
        stroke("#0f0");
        //line(this.pos.x, this.pos.y, bestPoint.x, bestPoint.y);
        pop();
        distances.push(closest);
        closestPoints.push(bestPoint);
      }
    }

    this.canLEFT = true;
    this.canRIGHT = true;
    this.canUP = true;
    this.canDOWN = true;
    //print(distances);
    for (let i = 0; i < distances.length; i++) {
      let distance = distances[i];
      let pt = closestPoints[i];
      let dx = pt.x - this.pos.x;
      let dy = pt.y - this.pos.y;

      if (dx > 0) dx = floor(dx);
      else dx = ceil(dx);
      if (dy > 0) dy = floor(dy);
      else dy = ceil(dy);
      
      if (distance < 3) {
        print("SHORT");
        if (dx > 0 && dx <= 3) this.canRIGHT = false;
        if (dx < 0 && dx >= -3) this.canLEFT = false;
        if (dy > 0 && dy <= 3) this.canDOWN = false;
        if (dy < 0 && dy >= -3) this.canUP = false;
      }
    }
  }

  move(x, y) {
    if ((x > 0 && this.canRIGHT) || (x < 0 && this.canLEFT))
      this.pos.x += x * 3;
    if ((y < 0 && this.canUP) || (y > 0 && this.canDOWN)) this.pos.y += y * 3;
  }

  move(a) {
    let canMOVE = true;

    if(this.head < 0 && this.head > -PI){
      // print("HEADING TOP");
      if(a>0){
        canMOVE = canMOVE && this.canUP;
      }else{
        canMOVE = canMOVE && this.canDOWN;
      }
    }
    if(this.head < PI/2 && this.head > -PI/2){
      // print("HEADING RIGHT");
      if(a>0){
        canMOVE = canMOVE && this.canRIGHT;
      }else{
        canMOVE = canMOVE && this.canLEFT;
      }
    }
    if(this.head < PI && this.head > 0){
      // print("HEADING DOWN");
      if(a>0){
        canMOVE = canMOVE && this.canDOWN;
      }else{
        canMOVE = canMOVE && this.canUP;
      }
    }
    if(this.head < -PI/2 || this.head > PI/2){
      // print("HEADING LEFT");
      if(a>0){
        canMOVE = canMOVE && this.canLEFT;
      }else{
        canMOVE = canMOVE && this.canRIGHT;
      }
    }

    // print(-PI/4,-3*PI/4);
    // print(PI/4,-PI/4);
    // print(3*PI/4,PI/4);
    // print(-3*PI/4,3*PI/4);
    // print("---");
    
    if (canMOVE) {
      const vel = p5.Vector.fromAngle(this.head);
      vel.setMag(a);
      this.pos.add(vel);
    }
  }

  rotate(a) {
    if(this.head + a > PI){
      this.head = - (2*PI - (this.head + a))
    }else if(this.head + a < -PI){
      this.head =(2*PI + (this.head + a))
    }else{
      this.head = (this.head + a) % (2 * PI);
    }
    

    let i = 0;
    let half_fov = floor(this.fov / 2);
    for (let an = -half_fov; an < half_fov; an += finesse) {
      this.rays[i].setAngle(radians(an) + this.head);
      i++;
    }
  }

  pointMouse() {
    // print(mouseX);
    // print(mouseY);
    // if (mouseX * mouseY !== 0) {
    //   let dx = mouseX - this.pos.x;
    //   let dy = mouseY - this.pos.y;
    //   if (dx !== 0) dx /= abs(dx);
    //   if (dy !== 0) dy /= abs(dy);
    //   this.move(dx, dy);
    // }

    this.pos.x = mouseX;
    this.pos.y = mouseY;
  }
}
