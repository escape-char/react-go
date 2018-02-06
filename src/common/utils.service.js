export default class Utils{
    static isTouchScreen(){
      //check if it is a touch screen
      if (('ontouchstart' in window) || window.DocumentTouch) { 
            return true;
      }
      //if previous check failed, treat mobile/tablet devices as touch screen
      return window.matchMedia('(max-device-width: 960px)').matches;
    }
    static uuid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
