import {GoBoardBackgroundDrawable as Background} from './goboardbackgrounddrawable.js';
import {GoHorCoordinatesDrawable as HorCoordinates,
        GoVerCoordinatesDrawable as VerCoordinates} from './gocoordinatesdrawable.js';
import {GoHitBoxDrawable as HitBox, GoHitBoxesDrawable as HitBoxes} from './gohitboxdrawable.js';
import {GoIntersectionsDrawable as Intersections} from './gointersectionsdrawable.js';
import{GoPointDrawable as Point, GoPointsDrawable as Points} from './gopointdrawable.js'; 
import {default as CanvasMath} from '../gocanvasmath.js';

export default class GoDrawableFactory{
    static createPoint(cx, cy, r, pos){
        return new Point(cx,cy,r, pos);
    }
    static createIntersections(pt, boardSize, offset){
        return new Intersections(pt.x, pt.y, boardSize, offset);
    }
    static createBoard(pt, canvasSize){
        return new Background(pt.x, pt.y, canvasSize);
    }
    static createHitBox(x, y, size, pos){
       return new HitBox(x, y, size, pos);
    }
    static createHitBoxes(startPt,  size, boardSize){
        const h = [];
        for(let i =0; i< boardSize; i+=1){
            const x = startPt.x + (i* size);
            for(let j=0; j<boardSize; j+=1){
                const y = startPt.y + (j*size);
                const pt = {x: x, y:y};
                const pos = CanvasMath.ptToPos(pt, startPt, size, boardSize);
                const pt2 = CanvasMath.calcHitBoxPos(pt, size);
                h.push(new HitBox(pt2.x, pt2.y, size, pos));
            }
        }
        return new HitBoxes(h);
   }
    static createHorCoordinates(pt, w, h, boardSize, offset){
        return new HorCoordinates(pt.x, pt.y, w, h, boardSize, offset);
    }
    static createVerCoordinates(pt, w, h, boardSize, offset){
        return new VerCoordinates(pt.x, pt.y, w, h, boardSize, offset);
    }
    static createPoints(points, startPt, offset, radius, boardSize){
        const pList = [];
        for(let i=0; i<points.length; i+=1){
            const p = points[i];
            const pt = CanvasMath.posToPt(p.position, offset, boardSize);
            const pos = CanvasMath.ptToPos(pt, startPt, offset, boardSize);
            pList.push(new Point(pt.x, pt.y, radius, pos));
        }
        return pList;
    }




}
