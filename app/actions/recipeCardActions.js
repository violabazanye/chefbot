import * as types from './types';

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