import { combineReducers } from 'redux';
import { shoppingList, saveRecipe } from './recipeCardsReducers';

const appReducer = combineReducers({
    shoppingList,
    saveRecipe
});

export default appReducer;