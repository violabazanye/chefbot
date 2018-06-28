import {
    ADD_INGREDIENT,
    TOGGLE_INGREDIENT,
    SAVE_RECIPE,
    SET_SEARCHED_RECIPES
} from '../actions/types';

export function shoppingList(state = [], action) {
    switch (action.type) {
        case ADD_INGREDIENT: 
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false   
                }
            ]
        case TOGGLE_INGREDIENT:
            return state.map((ingredient, index) => {
                if(index === action.index){
                    return Object.assign({}, ingredient, {
                        completed: !ingredient.completed
                    })
                }
                return ingredient
            })
        default:
            return state
    }
}

export function saveRecipe(state = [], action) {
    switch(action.type) {
        case SAVE_RECIPE:
            return [
                ...state,
                {
                    recipeId: action.recipeId
                }
            ]
        default: 
            return state
    }
}

export function searchedRecipes(state = [], action){
    switch(action.type) {
        case SET_SEARCHED_RECIPES:
            return [
                ...state,
                {
                    recipes: action.recipes
                }
            ]
        default:
            return state
    }
}