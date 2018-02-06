export default class GoBoundingRect{
    constructor(x, y, width, height){
        this._build(x, y, width, height);
    }
    _build(x,y,width,height){
        /*  a---------c
            |         |
            b---------d
        */
       
        this.a = {x: x, y:y};
        this.b = {x: x, y: y + height};
        this.c = {x: x+width, y: y + height};
        this.d = {x: x+width, y: y};

        this.y = y || this.y || 0;
        this.width = width || this.width || 0;
        this.height = height || this.height || 0;

        this.top = y;
        this.left = x;
        this.bottom = y + height; 
        this.right = x + width;
    }
    update(x,y,width,height){
       this. _build(x,y,width,height);
    }
    updateWithPoints(p1, p2, p3, p4){
        const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
        const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
        const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
        const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

        this.a = {x:minX, y: maxY}; 
        this.b = {x:minX, y: minY}; 
        this.c = {x:maxX, y: maxY}; 
        this.d = {x:maxX, y: minY}; 

        this.width =this.d.x - this.a.x;
        this.height = this.a.y - this.b.y;
        this.top = this.a.y;
        this.bottom = this.b.y
        this.left = this.a.x;
        this.right = this.a.x + this.width;
    }
    getPoints(){
        return [this.a, this.b, this.c, this.d];
     }
    getRect(){
        return {
            top: this.top,
            left: this.left,
            right: this.right,
            bottom: this.bottom
        };
    }
    contains(x, y){
        return (
            (x >= this.left && x <= this.right) &&
            (y <= this.bottom && y >= this.top)
        );
    }
    intersectsWith(rect){
        if (this.right < rect.left) return false;
        if (this.left > rect.right) return false;
        if (this.top < rect.bottom) return false;
        if (this.bottom > rect.top) return false;
        return true; 
    }
    clone(){
        return new GoBoundingRect(this.a.x, this.a.y, this.width, this.height);
    }
}
