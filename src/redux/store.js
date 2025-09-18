// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import accessReducer from './accessSlice';

// Redux Persist configuration
const persistConfig = {
    key: 'rootSeSsoi',       // The key in localStorage
    storage,           // Local storage as the storage solution
};

// Persisting the reducer
const persistedReducer = persistReducer(persistConfig, accessReducer);

// Create the store with the persisted reducer
const store = configureStore({
    reducer: {
        access: persistedReducer,  // Use the persisted reducer for access state
    },
});

const persistor = persistStore(store);  // Create a persistor

export { store, persistor };  // Export both the store and persistor

