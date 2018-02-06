import Logger from '../../../logger.js';
import {GoDrawable} from './godrawable.js';
export class GoBoardBackgroundDrawable extends GoDrawable{
    constructor(x, y, canvasSize){
        super(x, y, canvasSize, canvasSize);
        this.logger = new Logger("GoBoardBackgroundDrawable");
        this.image = null
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
        const pattern = context.createPattern(this.image, 'repeat');
        context.fillStyle  = pattern;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
