import {BoardConstants} from '../../constants.js';
export default class  GoCanvasMath{
    //calulate the distance between nearest point of a bounding rectangle to a given point
    static distanceRect(rect, p){
      const  dx = Math.max(rect.left - p.x, 0, p.x - rect.right);
      const  dy = Math.max(rect.bottom -p.y, 0, p.y - rect.top);
      return Math.sqrt(dx*dx + dy*dy);
    }
    //calulate distance between two points
   static distancePt(p1, p2){
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
   //sort an array of points by closest distance to point pt
   static sortPt(ptArray, pt){
       ptArray.sort((a, b)=>{
           const d1 = GoCanvasMath.distancePt(pt, a);
           const d2 = GoCanvasMath.distancePt(pt, b);
           if(d1 < d2){
               return -1;
            }
           else if(d1 > d2){
               return 1;
            }
           return 0;
        });
  }

   //sort array of drawables such that the bounding rect is
   //closest to point pt
   static sortDrawables(dArray, pt){
       dArray.sort((a, b)=>{
           const d1 = GoCanvasMath.distanceRect(a.boundingRect, pt);
           const d2 = GoCanvasMath.distanceRect(b.boundingRect, pt);
           if(d1 < d2){
               return -1;
            }
           else if(d1 > d2){
               return 1;
            }
           return 0;
        });
   }
   //convert board position to point on canvas
   static posToPt(pos,startPt, offset, boardSize){
       let num1 = BoardConstants.LETTERS.indexOf(pos[0]);
       const x = startPt.x + (offset*num1);

       const num2 = parseInt(pos.slice(1, pos.length));
       const y = startPt.y + (offset*(boardSize - num2))

       return {x: Math.floor(x), y: Math.floor(y)}
    }
   //convert point on canvas to board position
   static ptToPos(pt, startPt, offset, boardSize){
       const letterIndex = Math.round((pt.x-startPt.x) / offset);
       const letter =  BoardConstants.LETTERS[letterIndex];
       const num = Math.round(boardSize - ((pt.y - startPt.y)/offset));
       return letter + num;;
    }
   //convert event to point on canvas
   static eventToPt(e, canvas){
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor(e.clientX - rect. left),
            y: Math.floor(e.clientY - rect.top)
        }
    }
   //given border size  on the canvas and board size type,
   //calculate the offset between points
  static calcPtOffset(borderSize, boardSize){
       return Math.floor((borderSize / (boardSize-1)));
  }
  //given the padding and size of canvas, calculate size of the border
  static calcBorderSize(padding, canvasSize){
        return Math.floor(canvasSize - (2*padding));
   }
   static calcHitBoxPos(pt, offset){
       return{
              x: Math.floor(pt.x - (offset/2)),
              y: Math.floor(pt.y - (offset/2))
       };
  }
  //when zooming in, the hitboxes can be partially off the screen,
   //find ouf if hitbox is playable by if a threshold percentage of the
   //hitboxes is visible
  static isHitBoxPlayable(hitbox, startPoint, borderSize){
        const bRect = hitbox.boundingRect;
        const end = startPoint.x + borderSize;
        const threshold = 0.4;

        const left = bRect.left - startPoint.x;
        const right = end - bRect.right;
        const top = bRect.top - startPoint.y;
        const bottom = end - bRect.bottom;

        let leftP = threshold;
        let rightP = threshold;;
        let topP = threshold;
        let bottomP =threshold;

        if(left < 0){
            leftP =  1 - Math.abs(left/bRect.width);
        }
        else if(right < 0){
            rightP = 1 - Math.abs(right/ bRect.width);
        }
        if(top < 0){
            topP =  1-Math.abs(top/bRect.height);
        }
        else if(bottom < 0){
          bottomP = 1 - Math.abs(bottom/bRect.height);
        }
        return (
            leftP > 0 && leftP >= threshold &&
            rightP > 0 && rightP >= threshold &&
            topP > 0 && topP >= threshold &&
            bottomP > 0 && bottomP >= threshold
        );
  }
  static round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

}
