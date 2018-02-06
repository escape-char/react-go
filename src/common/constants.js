export class AppConstants{
    static get DEBUG_ENABLED(){
        return true;
    }
}
export class PlayerConstants{
  static get PLAYER_WHITE(){
    return "white";
  }
  static get PLAYER_BLACK(){
    return "black";
  }
}
export class PointConstants{
    static get STATE_VACANT(){
        return "vacant";
    }
    static get STATE_WHITE(){
        return "white";
    }
    static get STATE_BLACK(){
        return "black";
    }
    static get VALID_STATES(){
        return ["vacant" , "black", "white"];
    }

}
export class BoardConstants{
    static get LETTERS(){
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    }
    static get SIZE_9(){
        return 9;
    }
    static get SIZE_13(){
        return 13;
    }
    static get SIZE_19(){
        return 19;
    }
    static get SUPPORTED_SIZES(){
        return [9, 13, 19];
    }
}
export class CanvasConstants{
    static get CANVAS_ID(){
        return "go-canvas";
    }
    static get SCALE_FACTOR(){
        return 2;
    }
    static get PADDING(){
        return '2%';
    }
    static get CANVAS_SIZE(){
        return '100%';
    }
    static get AXIS_LABEL_SIZE(){
        return 2.0;
    }
    static get BACKGROUND(){
        return '#DCB35C';
    }
    static get BORDER_COLOR(){
        return '#000';
    }
    static get BORDER_STROKE_WIDTH(){
        return 0.2;
    }
    static get POINT_RADIUS_DIVISOR(){
        return 3;
    }
    static get POINT_CY_OFFSET(){
        return 5;
    }
    static get POINT_STROKE_WIDTH(){
        return 3;
    }
}
