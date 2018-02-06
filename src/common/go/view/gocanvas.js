import debounce  from 'lodash/debounce';
import Logger from '../../logger.js';
import {default as Factory} from './drawable/godrawablefactory.service.js';
import {default as CanvasMath} from './gocanvasmath.js';
import {default as Matrix} from './gotransformmatrix.js';
import Utils from '../../utils.service.js';
import {CanvasConstants,PlayerConstants,
  PointConstants, BoardConstants} from '../../constants.js';

export default class GoCanvas{
    constructor(canvasId, boardSize, config){
        this.logger = new Logger("GoCanvas");
        const c = config || {};
        this.boardSize = boardSize || BoardConstants.SIZE_9;
        this._RENDER_TIME = 30;
        this.canvasId = canvasId || CanvasConstants.CANVAS_ID;
        this.ptRadius = 0;

        this.bgImg = new Image;
        this.blackStoneImg = new Image;
        this.whiteStoneImg = new Image;
        this.blackStoneImgLoaded = false;
        this.whiteStoneImgLoaded = false;


        this.blackStoneImg.onload = this.onBlackStoneImgLoaded.bind(this);
        this.whiteStoneImg.onload = this.onWhiteStoneImgLoaded.bind(this);
        this.bgImg.onload = this.onBgImgLoaded.bind(this);

        this.bMatrix = new Matrix();

        this._CLICK_TIME = 200;
        this.startPoint = {x: 0, y:0};
        this.draggedPoint = null;
        this.offset = 0;
        this.borderSize = 0;
        this.offset = null;
        this.boardD = null;
        this.hitBoxes = null;
        this.movesD = null;
        this.hoverD = null;

        this.scale = 1.5;
        this.transPt = null;
        this.transformBoard = null
        this.transformHor = null;
        this.transformVer = null;

        this.isDragging = false;
        this.doubleClicked = false;
        this.clickedCount = 0;
        this.singleClickTimer = null;
        this.hitBoxTrans = null;

        this.gameLayerDirty = false;
        this.moves = [];
        this.currentPlayer=null;

        this.config = {
            background: c.background ||CanvasConstants.BACKGROUND,
            borderColor: c.borderColor || CanvasConstants.BORDER_COLOR,
            borderStrokeWith: c.borderStrokeWidth || CanvasConstants.BORDER_STROKE_WIDTH
        };
        this.onResize = this.onResize.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);


        this.onPointSelectedCallback = null;

        this.uiLayer = document.getElementById(this.canvasId)


        if(!(this.uiLayer instanceof HTMLCanvasElement)){
            this.logger.error("Invalid Id provided. Id must reference a canvas element");
            return;
        }

        this.uiLayer.className += " ui-layer";
        this.uiContext = this.uiLayer.getContext('2d');
        this._add_layers();

        this.bgImg.src=require('./images/background.png');
        this.blackStoneImg.src=require('./images/blackstone.png');
        this.whiteStoneImg.src=require('./images/whitestone.png');

        window.addEventListener('resize', this.onResize);
        this.uiLayer.addEventListener('mousedown', this.onMouseDown);
        this.uiLayer.addEventListener('mouseup', this.onMouseUp);
        this.uiLayer.addEventListener('mousemove', this.onMouseMove);
        this.uiLayer.addEventListener('mouseleave', this.onMouseLeave);

        this.onResize();
    }
    _add_layers(){
        this.gameLayer = document.createElement('canvas');
        this.backgroundLayer = document.createElement('canvas');

        this.gameLayer.className = "go-canvas game-layer";
        this.backgroundLayer.className = "go-canvas background-layer";

        this.backgroundContext = this.backgroundLayer.getContext('2d');
        this.gameContext = this.gameLayer.getContext('2d');

        this.uiLayer.parentElement.insertBefore(this.backgroundLayer, this.uiLayer);
        this.uiLayer.parentElement.insertBefore(this.gameLayer, this.uiLayer);

    }
    _build(){
        this.logger.info("_build()");
        this.padding = Math.floor(0.08 * this.canvasSize);
        this.startPoint = {x: this.padding, y: this.padding};
        this.borderSize = CanvasMath.calcBorderSize(this.padding, this.canvasSize);
        this.offset = CanvasMath.calcPtOffset(this.borderSize, this.boardSize);


        this.ptRadius = Math.floor(this.offset / 3);

        this.logger.info("canvasSize: " + this.canvasSize);
        this.logger.info("padding: " + this.padding);
        this.logger.info("starting point: " + JSON.stringify(this.startPoint));
        this.logger.info("borderSize: " + this.borderSize);
        this.logger.info("offset: " + this.offset);

        this.boardD = Factory.createBoard({x:0, y:0}, this.canvasSize);
        if(this.bgImg.complete){
            this.boardD.setImage(this.bgImg);
        }
        this.intersectionsD = Factory.createIntersections(this.startPoint,
                                                    this.boardSize, this.offset);
        const pt = CanvasMath.posToPt('I1', this.startPoint, this.offset, this.boardSize);
        const move = CanvasMath.ptToPos(pt, this.startPoint, this.offset, this.boardSize);

        const coordHPt = {x: this.padding, y: this.padding/2};
        this.hCoords = Factory.createHorCoordinates(
                coordHPt,
                 this.canvasSize,
                this.padding,
                this.boardSize,
                this.offset);

        const coordYPt = {x: this.padding/2, y: this.padding};
        this.vCoords = Factory.createVerCoordinates(
                coordYPt,
                 this.canvasSize,
                this.padding,
                this.boardSize,
                this.offset);

        this.hitBoxes = Factory.createHitBoxes(this.startPoint, this.offset, this.boardSize);
        this.hitBoxes.debug=false;
        this.gameLayerDirty = true;

    }
    setMoves(m){
      this.moves = m;
    }
    setCurrentPlayer(p){
      this.currentPlayer = p;
    }

    onResize(e){
        this.logger.info("onResize()");
        const h = this.uiLayer.parentElement.clientHeight;
        const w = this.uiLayer.parentElement.clientWidth;
        this.canvasSize = Math.floor(h < w ? h : w);
        this.uiLayer.width = this.uiLayer.height = this.canvasSize;
        this.backgroundLayer.width = this.backgroundLayer.height = this.canvasSize;
            this.gameLayer.width = this.gameLayer.height = this.canvasSize;
        this._build();
        this.render();
    }
    _render_intersections(){
      this.boardD.draw(this.backgroundContext);
      if(this.gameLayerDirty){
          this.gameContext.clearRect(0, 0, this.uiLayer.width, this.uiLayer.height);
          this.intersectionsD.draw(this.gameContext);
          if(this.hitBoxes.debug){
              this.hitBoxes.draw(this.gameContext);
          }
          this.hCoords.draw(this.gameContext);
      }
      this.vCoords.draw(this.gameContext);

    }
    _render_dragged_point(){
      console.log("render_dragged_point");
      console.log(this.draggedPoint);
      console.log(this.currentPlayer);
      if(this.draggedPoint){
          if(this.blackStoneImgLoaded && this.whiteStoneImgLoaded){
              if(this.currentPlayer === PlayerConstants.PLAYER_BLACK){
                this.draggedPoint.setImage(this.blackStoneImg);
              }else if(this.currentPlayer === PlayerConstants.PLAYER_WHITE){
                this.draggedPoint.setImage(this.whiteStoneImg);
              }
          }

          this.draggedPoint.draw(this.uiContext);
      }

    }
    _render_moves(){
      this.moves.forEach((v)=>{
        const canvasPt = CanvasMath.posToPt(v.pos, this.startPoint, this.offset, this.boardSize);
        const drawPt = Factory.createPoint(canvasPt.x, canvasPt.y, this.ptRadius, v.pos);

        if(this.blackStoneImgLoaded && this.whiteStoneImgLoaded){
          if(v.state === PointConstants.STATE_WHITE){
            drawPt.setImage(this.whiteStoneImg);
          }
          else if(v.state === PointConstants.STATE_BLACK){
            drawPt.setImage(this.blackStoneImg);
          }
        }
        drawPt.draw(this.uiContext);
      })

    }
    _render(e){
        this.uiContext.clearRect(0, 0, this.uiLayer.width, this.uiLayer.height);
        this._render_intersections();
        this._render_dragged_point();
        this._render_moves();
    }
    render(){
        window.requestAnimationFrame(this._render.bind(this));
    }
    _transformHitBoxes(hitBoxes, matrix){
        //generate new hitboxes;
        hitBoxes.items = hitBoxes.items.map((v)=>{
            const rect = v.boundingRect.clone();
            const pts = rect.getPoints();
            const newPts = matrix.applyToArray(pts);
            rect.updateWithPoints(...newPts)
            return Factory.createHitBox(rect.b.x, rect.b.y, rect.width, v.position);
        });
    }
    _onDoubleClicked(target){
        /* TODO: Fix Zoom in functionality
        */
    }
    onMouseUp(event){
      if(this.doubleClicked){
        return;
      }
      const canvasPt= CanvasMath.eventToPt(event, this.uiLayer);
      const boardPos= CanvasMath.ptToPos(canvasPt, this.startPoint, this.offset, this.boardSize);
      if(this.onPointSelectedCallback &&
        this.onPointSelectedCallback.constructor === Function){
        this.onPointSelectedCallback(boardPos);
      }
    }
    onMouseDown(event){
        if(Utils.isTouchScreen()){
            return;
        }
        let pt = CanvasMath.eventToPt(event, this.uiLayer);
        const target = this.hitBoxes.collidedWith(pt);
        if(!target){
            return;
        }
        this.clickedCount +=1;
        if(this.clickedCount === 1){
            this.doubleClicked =false;
            this.draggedPoint = Factory.createPoint(pt.x, pt.y, this.ptRadius, target.position);
            let that = this;
            this.singleClickTimer = debounce(()=>{
                that.isDragging = false;
                that.clickedCount = 0;
            }, this._CLICK_TIME);
            this.singleClickTimer();
        }else{
            this._onDoubleClicked(target);
        }

    }
    onMouseLeave(event){
       this.logger.debug('onMouseLeave');
        this.isDragging = false;
        this.draggedPoint = null;
        this.render();
    }
    _onMouseMoveWhileZoomed(event){
    }
    onMouseMove(event){
        console.log("onMouseMove");
        const pt = CanvasMath.eventToPt(event, this.uiLayer);
        const target = this.hitBoxes.collidedWith(pt);
        console.log('target');
        console.log(target);
        if(!target){
            this.draggedPoint = null;
            this.render()
            return;
        }
        this.isDragging = true;
        const hPt = CanvasMath.posToPt(target.position, this.startPoint, this.offset, this.boardSize);
        this.draggedPoint = Factory.createPoint(hPt.x, hPt.y, this.ptRadius, target.position);
        console.log("dragged point");
        console.log(this.draggedPoint);
        this.render()
    }
    onBgImgLoaded(){
        this.logger.info("onBgImgLoaded");
        this.boardD.setImage(this.bgImg);
        this.render()
    }
    onBlackStoneImgLoaded(){
        this.blackStoneImgLoaded = true;
        this.render();

    }
    onWhiteStoneImgLoaded(){
      this.whiteStoneImgLoaded = true;
      this.render();

    }
    setPointSelectedCallback(callback){
      if(callback && callback.constructor === Function){
        this.onPointSelectedCallback = callback;
      }
    }
    destroy(){
        window.removeEventListener('resize', this.resize);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
    }




}
