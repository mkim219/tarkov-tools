import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

export const fetchTarkovTrackerProgress = createAsyncThunk('settings/fetchTarkovTrackerProgress', async (apiKey) => {
    if(!apiKey){
        return {
            quests: {},
            hideout: {},
        };
    }

    const response = await fetch('https://tarkovtracker.io/api/v1/progress', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
    });

    const progressData = await response.json();

    return progressData;
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        progressStatus: 'idle',
        hasFlea: JSON.parse(localStorage.getItem('useFlea')) || true,
        tarkovTrackerAPIKey: JSON.parse(localStorage.getItem('tarkovTrackerAPIKey')) || '',
        prapor: JSON.parse(localStorage.getItem('prapor')) || 4,
        therapist: JSON.parse(localStorage.getItem('therapist')) || 4,
        fence: JSON.parse(localStorage.getItem('fence')) || 0,
        skier: JSON.parse(localStorage.getItem('skier')) || 4,
        peacekeeper: JSON.parse(localStorage.getItem('peacekeeper')) || 4,
        mechanic: JSON.parse(localStorage.getItem('mechanic')) || 4,
        ragman: JSON.parse(localStorage.getItem('ragman')) || 4,
        jaeger: Number.isInteger(JSON.parse(localStorage.getItem('jaeger'))) ? JSON.parse(localStorage.getItem('jaeger')) : 4,
        'booze-generator': JSON.parse(localStorage.getItem('booze-generator')) || 1,
        'intelligence-center': JSON.parse(localStorage.getItem('intelligence-center')) || 3,
        lavatory: JSON.parse(localStorage.getItem('lavatory')) || 3,
        medstation: JSON.parse(localStorage.getItem('medstation')) || 3,
        'nutrition-unit': JSON.parse(localStorage.getItem('nutrition-unit')) || 3,
        'water-collector': JSON.parse(localStorage.getItem('water-collector')) || 3,
        workbench: JSON.parse(localStorage.getItem('workbench')) || 3,
        crafting: JSON.parse(localStorage.getItem('crafting')) || 0,
        'hideout-managment': JSON.parse(localStorage.getItem('hideout-managment')) || 0,
        completedQuests: [],
        useTarkovTracker: JSON.parse(localStorage.getItem('useTarkovTracker')) || false,
        tarkovTrackerModules: [],
    },
    reducers: {
        setTarkovTrackerAPIKey: (state, action) => {
            state.tarkovTrackerAPIKey = action.payload;
            localStorage.setItem('tarkovTrackerAPIKey', JSON.stringify(action.payload));
        },
        toggleFlea: (state, action) => {
            state.hasFlea = action.payload;
            localStorage.setItem('useFlea', JSON.stringify(action.payload));
        },
        setStationOrTraderLevel: (state, action) => {
            state[action.payload.target] = action.payload.value;
            localStorage.setItem(action.payload.target, JSON.stringify(action.payload.value));
        },
        toggleTarkovTracker: (state, action) => {
            state.useTarkovTracker = action.payload;
            localStorage.setItem('useTarkovTracker', JSON.stringify(action.payload));
        },
    },
    extraReducers: {
        [fetchTarkovTrackerProgress.pending]: (state, action) => {
            state.progressStatus = 'loading';
        },
        [fetchTarkovTrackerProgress.fulfilled]: (state, action) => {
            state.progressStatus = 'succeeded';
            state.completedQuests = state.completedQuests.concat(Object.keys(action.payload.quests));
            state.hasFlea = action.payload.level > 15 ? true : false;
            state.tarkovTrackerModules = Object.keys(action.payload.hideout).map(Number);
        },
        [fetchTarkovTrackerProgress.rejected]: (state, action) => {
            state.progressStatus = 'failed';
            state.error = action.payload;
        },
    },
});

export const selectAllTraders = (state) => {
    return {
        prapor: state.settings.prapor,
        therapist: state.settings.therapist,
        fence: state.settings.fence,
        skier: state.settings.skier,
        peacekeeper: state.settings.peacekeeper,
        mechanic: state.settings.mechanic,
        ragman: state.settings.ragman,
        jaeger: state.settings.jaeger,
    };
};

export const selectAllStations = (state) => {
    return {
        'booze-generator': state.settings['booze-generator'],
        'intelligence-center': state.settings['intelligence-center'],
        lavatory: state.settings.lavatory,
        medstation: state.settings.medstation,
        'nutrition-unit': state.settings['nutrition-unit'],
        'water-collector': state.settings['water-collector'],
        workbench: state.settings.workbench,
    };
};

export const selectAllSkills = (state) => {
    return {
        crafting: state.settings.crafting,
        'hideout-managment': state.settings['hideout-managment']
    }
}

export const selectCompletedQuests = (state) => {
    return state.settings.completedQuests;
};

export const {
    setTarkovTrackerAPIKey,
    toggleFlea,
    setStationOrTraderLevel,
    toggleTarkovTracker,
} = settingsSlice.actions;

export default settingsSlice.reducer;
