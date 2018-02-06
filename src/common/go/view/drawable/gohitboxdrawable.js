import {GoDrawable, GoDrawableList} from './godrawable.js';
import Logger from '../../../logger.js';
export class GoHitBoxDrawable extends GoDrawable{
    constructor(x, y, size, p){
        super(x,y, size, size);
        this.position = p;
        this.debug = false;
    }

    draw(context){
        super.draw(context);
        //enable debug to draw hitboxes and debug any collision issues
        if(this.debug){
            context.beginPath;
            context.strokeStyle="red";
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
//holds list of drawable hitboxes
export class GoHitBoxesDrawable extends GoDrawableList{
    constructor(hitboxes){
        super(hitboxes);
        this.logger = new Logger("HitBoxesDrawable()");
        this.debug=false;
    }
    draw(context){
        super.draw(context);
        for(const i of  this.items){
            i.debug = this.debug;
            i.draw(context);
        }
    }
}
