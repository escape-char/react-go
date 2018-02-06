import uniqueId from 'lodash/uniqueId';
import Logger from '../../../logger.js';
import GoBoundingRect from '../goboundingrect.js';
import {default as CanvasMath} from '../gocanvasmath.js';

export class GoDrawable{
    constructor(x, y, width, height){
        this.id = uniqueId('go-drawable')
        this.logger = new Logger('GoDrawable');
        this._x = x || 0;
        this._y = y || 0;
        this._width = width ||0;
        this._height= height || 0;
        this.boundingRect = new GoBoundingRect(this._x, this._y, this._width, this._height);
        this.strokeColor = "#000";
        this.fillColor = "#000";
        this.transform = null;
    }
    _updateBoundingRect(){
        this.boundingRect.update(this._x, this._y, this._width, this._height);
    }
    set x(xPos){
        this._x = xPos;
        this._updateBoundingRect();
    }
    get x(){
        return this._x;
    }
    set y(yPos){
        this._y = yPos;
        this._updateBoundingRect();
    }
    get y(){
        return this._y;
    }
    set width(w){
        this._width = w;
        this._updateBoundingRect();
    }
    get width(){
        return this._width;
    }
    set height(h){
        this._height = h;
        this._updateBoundingRect();
    }
    get height(){
        return this._height;
    }
    draw(context){
        if(!(context instanceof CanvasRenderingContext2D)){
            this.logger.error("Invalid context provided. Unable to continue drawing");
            return;
        }
    }
    contains(x, y){
        return this.boundingRect.contains(x,y);
    }
    transf(dx, dy, scale){
        const pt = CanvasMath.transformPt({x: this._x, y:this._y}, 
                dx, dy, scale);
        this._x = pt.x;
        this._y = pt.y;
        this._updateBoundingRect();
    }
    collidedWith(drawable){
        if(!(drawable instanceof GoDrawable)){
            this.logger.error("Invalid object provided. Object must be instance of GoDrawable to detect collision.");
            return;
        }
        return this.boundingRect.intersectsWith(drawable.boundingRect);
    }
}
export class GoDrawableList {
    constructor(items){
        this.id = uniqueId('go-drawable')
        if(items && !Array.isArray(items)){
            this.logger.error("Items for GoDrawableList must be an array");
            return;
        }
        this.items = items || [];
    }
    _indexOf(id){
        const ids = this.items.map((v) =>{
            return v.id;
        });
        return ids.indexOf(id);
    }
    draw(context){

    }
    getItem(id){
        const index = this._indexOf(id);
        if(index === -1){
            this.logger.error("No drawable exists with the provided id");
            return;
        }
        return this.items[index];

    }
    transf(dx, dy, scale){
        for(let i of this.items){
            i.transf(dx,dy,scale);
        }
    }
    //remove  by id
    remove(id){
        const index = this._indexOf(id);
        if(index === -1){
            this.logger.error("No drawable exists with the provided id");
            return;
        }
        const removed = this.items[index];
        this.items.splice(removed, 1);
        return removed;
    }
    collidedWith(pt){
        const h = [].concat(this.items);
        CanvasMath.sortDrawables(h, pt);
        const found = h.filter((v)=>{
            return v.contains(pt.x, pt.y);
        });
        return found.length > 0 ? found[0] : null;
    }
    append(item){
       if(!(item instanceof GoDrawable)){
            this.logger.error("Object must be instance of GoDrawable to append");
            return;
        }
       this.items.push(item);
    }
}
