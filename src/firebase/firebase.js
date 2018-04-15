import * as App from 'firebase';

const devConfig = {
    apiKey: "AIzaSyCzMf9duUBznOozwoojPc70J-gZpjB_8hw",
    authDomain: "texthub-app.firebaseapp.com",
    databaseURL: "https://texthub-app.firebaseio.com",
    projectId: "texthub-app",
    storageBucket: "texthub-app.appspot.com",
    messagingSenderId: "470441669710"

};

//when in production, create another project with new config
//and add that here
const prodConfig = {

};

const config = process.env.NODE_ENV === 'production'
    ? prodConfig
    : devConfig;

var defaultApp = App.initializeApp(config);
console.log(defaultApp.name);

let auth = defaultApp.auth();
var defaultDatabase = defaultApp.database();

if(!App.app.length){
    App.initializeApp(config);

}

// const auth = MainContainer.auth();

export {
    auth,
};