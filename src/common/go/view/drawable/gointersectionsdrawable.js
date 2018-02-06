import Logger from '../../../logger.js';
import {GoDrawable} from './godrawable.js';
//draws the border and interstions
export class GoIntersectionsDrawable extends GoDrawable{
    constructor(x, y, boardSize, offset){
        super(x, y, boardSize*offset, boardSize*offset)
        this.logger = new Logger("GoIntersectionsDrawable");
        this.boardSize = boardSize;
        this.borderSize = (boardSize-1)*offset;
        this.offset = offset;
    }
    draw(context){
        super.draw(context);
        context.save()
        context.strokeStyle = this.strokeColor;
        context.rect(this.x, this.y, this.borderSize, this.borderSize);
        context.clip();
        if(this.transform){
            context.transform(...this.transform);
        }
        
        context.strokeStyle = this.strokeColor;
        for(let i = 0; i< this.boardSize; i+=1){
            //draw horizontal line 
            const horX = this.x;
            const horY = this.y + (i*this.offset); 
            context.moveTo(horX, horY);
            const horXTo = this.x + (this.offset* (this.boardSize - 1));
            context.lineTo(horXTo, horY);

            //draw  vertical line
            const verX = this.x + (i*this.offset);
            const verY = this.y; 
            context.moveTo(verX, verY);
            const verYTo = this.y + (this.offset* (this.boardSize - 1));
            context.lineTo(verX,verYTo);
        }
        context.stroke();
        context.restore();
    }
}

