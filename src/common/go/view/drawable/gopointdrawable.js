import {GoDrawable, GoDrawableList} from './godrawable.js';
import Logger from '../../../logger.js';
export class GoPointDrawable extends GoDrawable{
    constructor(cx, cy, r, p){
        super((cx-r), (cy-r), 2*r, 2*r)
        this.r = r;
        this.cx = cx;
        this.cy = cy;
        this.position = p;
        this.image = null;
    }
    setImage(img){
        this.image = img;
    }
    draw(context){
        super.draw(context);
        if(this.transform){
            context.setTransform(...this.transform);
        }
        if(!this.image){
            return;
        }
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
//holds list of drawable points
export class GoPointsDrawable extends GoDrawableList{
    constructor(points){
        super(points);
        this.logger = new Logger("PointsDrawable()");
        this.items = points || [];
    }
    draw(context){
        super.draw(context);
    }
}
