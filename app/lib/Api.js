export default class Api {
    static headers() {
        return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
        }
    }

    static get(route) {
        return this.xhr(route, null, 'GET');
    }

    static xhr(route, params, verb) {
        const host = 'https://api.edamam.com'
        const url = `${host}${route}`
        let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null );
        options.headers = Api.headers()
        return fetch(url, options).then((response) => 
            response.json()).then((responseJson) => {
                return responseJson
            }).catch((error) => {
                console.error(error)
            });
    }
}
