import * as types from './types';
import Api from '../lib/api';

let nextShoppingListItem = 0;

export function toggleParentScroll(isEnabled) {
    return { type: types.TOGGLE_PARENT_SCROLL, isEnabled }
}

export function addIngredient(text) {
    return { type: types.ADD_INGREDIENT, id: nextShoppingListItem++, text}
}

export function toggleIngredient(index) {
    return { type: types.TOGGLE_INGREDIENT, index }
}

export function saveRecipes(recipeId) {
    return { type: types.SAVE_RECIPE, recipeId }
}

export function setSearchedRecipes({ recipes }) {
  return { type: types.SET_SEARCHED_RECIPES, recipes }
}

export function fetchRecipes(ingredients) {
    return (dispatch, getState) => {
        const params = [
            'app_id=2b4a2a13',
            'app_key=07040ebc53dc66be4711f352a7f2b3f8',
            `q=${encodeURIComponent(ingredients)}` 
        ].join('&')
        return Api.get(`/search?${params}`).then(response => {
            dispatch(setSearchedRecipes({recipes: response.hits}));    
        }).catch( (ex) => {
            console.log(ex);
        });
    }
}