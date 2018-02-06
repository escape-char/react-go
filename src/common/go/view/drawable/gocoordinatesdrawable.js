import {GoDrawable} from './godrawable.js';
import {BoardConstants} from '../../../constants.js';
export class GoHorCoordinatesDrawable extends GoDrawable{
    constructor(x, y, width, height, boardSize, offset){
        super(x,y, width, height);
        this.boardSize = boardSize;
        this.offset = offset;
    }
    draw(context){
        super.draw(context);
        if(this.transform){
            context.setTransform(...this.transform);
        }
        context.beginPath();
        context.strokeStyle = this.strokeColor
        for(let i=0; i<this.boardSize; i+=1){
            let letter = BoardConstants.LETTERS[i];
            const x = this.x + (i*this.offset);
            context.fillText(letter, x, this.y);
        }
        if(this.transform){
            context.setTransform(1, 0, 0, 1, 0, 0);
        }

    }
}
export class GoVerCoordinatesDrawable extends GoDrawable{
    constructor(x, y, width, height, boardSize, offset){
        super(x,y, width, height);
        this.boardSize = boardSize;
        this.offset=offset;
    }
    draw(context){
        super.draw(context);
        if(this.transform){
            context.setTransform(...this.transform);
        }
        context.beginPath();
        context.strokeStyle = this.strokeColor
        for(let i=0; i<this.boardSize; i+=1){
            const y = this.y + (i*this.offset);
            context.fillText(this.boardSize - i, this.x, y);
        }
        if(this.transform){
            context.setTransform(1, 0, 0, 1, 0, 0);
        }


        
    }
}
