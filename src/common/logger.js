import {AppConstants} from './constants.js';
import {sprintf} from 'sprintf-js';
import moment from 'moment';

export default class Logger{
    constructor(entityName){
        this.debugEnabled = AppConstants.DEBUG_ENABLED;
        this.name = entityName;
    }
    _displayMessage(m, level){
        let time = moment().format("MM/DD/YYYY HH:mm:ss:SSS A");
        let msg = sprintf("%s %s [%s]: %s", time, this.name, level, m)
        console[level](msg);
    }
    info(m){
        if(!this.debugEnabled){return;}
        this._displayMessage(m, 'info');
    }
    debug(m){
        if(!this.debugEnabled){return;}
        this._displayMessage(m, 'debug');
    }
    warn(m){
        this._displayMessage(m, 'warn');
    }
    error(m){
        this._displayMessage(m, 'error');
    }
}
