import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";

const initialState = {
    dataLoaded: false,
    sheets: null,
    audioLayers: [null],
    currentLevel: 0,
    muted: false,
    pauseAudio: 0,
    content: {}
};

export const 
    ACTION_DATA_LOADED = 'action_data_loaded',
    ACTION_SET_SHEETS = 'action_set_sheets',
    ACTION_SET_LEVEL = 'action_set_level',
    ACTION_SET_MUTED = 'action_set_muted',
    ACTION_PAUSE_AUDIO = 'action_set_paused'
    ;

const setSheets = (sheets) => {
    return {
        type: ACTION_SET_SHEETS,
        payload: sheets
    };
}
const setDataLoaded = () => {
    return {
        type: ACTION_DATA_LOADED,
        payload: true
    };
}


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_SET_SHEETS:
            const content = {};
            action.payload.content.forEach(v => {
                content[v.key] = v.content;
            })
            
            return {...state, sheets: action.payload, content: content };

            break;
        case ACTION_DATA_LOADED:
            return {...state, dataLoaded: true};
        case ACTION_SET_MUTED:
            return {...state, muted: action.payload};
        case ACTION_PAUSE_AUDIO:
            return {...state, pauseAudio: action.payload};
        case ACTION_SET_LEVEL:
            let ops = [...state.audioLayers];
            if (ops.length > action.payload.level) {
                ops = ops.slice(0, action.payload.level + 1);
            }
            if (action.payload.option) ops[action.payload.level - 1] = action.payload.option;
            else if (ops.length > 1) {
                ops.pop();
            }
            // console.log('audio layers', ops, state.currentLevel, action.payload.level );
            return {...state, currentLevel: action.payload.level, audioLayers: ops};
        default:
            return state;
    }
}

export const fetchData = (url) => {
    return  (dispatch) => {
        fetch(`${url}?t=${new Date().getTime()}`)
            .then(resp=> resp.json())
            .then((d)=>{
                // console.log(d);
                dispatch(setSheets(d.sheets));
                dispatch(setDataLoaded());

            })
            // // .then(setTimeout(this.intro, 2000))
            // .then(this.intro)
            .catch(err => {
                console.log(err);
            });
        }
    
}

export default createStore(rootReducer, applyMiddleware(thunk));