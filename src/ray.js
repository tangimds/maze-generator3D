class Ray {
    constructor(start,angle){
        this.pos = start;
        this.dir = p5.Vector.fromAngle(angle);
    }

    show(){
        push();
        stroke('#0f0');
        translate(this.pos.x,this.pos.y);
        line(0,0,this.dir.x*10,this.dir.y*10);
        pop();
    }

    lookAt(x,y){
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    setAngle(a){
        this.dir = p5.Vector.fromAngle(a);
    }

    cast(wall){
        const x1 = wall.start.x;
        const y1 = wall.start.y;
        const x2 = wall.end.x;
        const y2 = wall.end.y;
        const x3 = this.pos.x;
        const y3 = this.pos.y;    
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        const denom = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
        if(denom == 0){
            return;
        }
        const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4)) / denom;
        const u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3)) / denom;

        if( t<=1 && t>=0 && u>1){
            const x = x1 + t*(x2-x1);
            const y = y1 + t*(y2-y1);
            return createVector(x,y);
        } else return;

    }
}