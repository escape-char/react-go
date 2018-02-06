import {BoardConstants} from '../../constants.js';
export default class GoPoint{
    //useful if you want to do calculations
    static toXy(pos){
      return {
        x: BoardConstants.LETTERS.indexOf(pos[0]),
        y: parseInt(pos.slice(1, pos.length)) - 1
      };
    }
    static toPos(x, y){
        return {
            x: BoardConstants.LETTERS[x],
            y: y + 1,
        };
    }
    constructor(pos, state){
        this.pos = pos;
        this.state = state;
        const pt = GoPoint.toXy(pos);
        this.x = pt.x;
        this.y = pt.y;

    }
    getPt(){
        return {x:this.x, y:this.y};
    }
}
