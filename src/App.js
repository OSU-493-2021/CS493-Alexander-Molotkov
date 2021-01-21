import './App.css';
import firebase from 'firebase'
import "firebase/auth"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqnGaaGSXXWMqp52_-rYHzF-jsZyBWp7c",
  authDomain: "cs493-61d21.firebaseapp.com",
  projectId: "cs493-61d21",
  storageBucket: "cs493-61d21.appspot.com",
  messagingSenderId: "886745233222",
  appId: "1:886745233222:web:6335f5346ab968263c9747",
  measurementId: "G-9K0WS6KBXF"
};

firebase.initializeApp(firebaseConfig)
var provider = new firebase.auth.GoogleAuthProvider();

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <div id="usernameBackground" style={{display: "none"}} >
          <div id="usernameDisplay"></div>
          <br></br>
          <button id="signOut" onClick = { function() {window.location.reload(false)}} style={{display: "none"}}>Sign out</button>
        </div>


        <form>
          <input id="email" placeholder="Email">
          </input>
          <br></br>
          <input type ="password" id="password" placeholder="Password">
          </input>
        </form>

        <br></br>

        <div id="buttons">

          <button id="signUp" onClick={async function () {

            // Create user
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;

            const user = await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password).then((user) => {
                // User created and signed in
                showUserInfo(user.user.email);
              })
              .catch((error) => {
                //Error with creating users
                var errorCode = error.code;
                var errorMessage = error.message;
                document.getElementById("error").innerText = "Error: " + errorCode + " " + errorMessage;
              })
          }} > Sign up</button>

        <button id="logIn" onClick= {async function (){

          var email = document.getElementById("email").value;
          var password = document.getElementById("password").value;

          // Sign in user
          const user = await firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
            //Signed in
            showUserInfo(user.user.email);
          })
          .catch((error) => {
            //Error with logging in
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("error").innerText = "Error: " + errorCode + " " + errorMessage
          })
        }}> Sign in </button>
        </div>

        <br></br>

        <button id="logInGoogle" onClick= {async function (){

          //Sign in user
          firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            //Signed in

            showUserInfo(result.user.email);
          })
          .catch((error) => {
            //Error with logging in
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("error").innerText = "Error: " + errorCode + " " + errorMessage
          })
        }}> Sign in with Google</button>

        <br></br>

        <div id="error"></div>

      </header>
    </div>
  );
}

function showUserInfo(userEmail){

  document.getElementById("signUp").style = "display: none;";
  document.getElementById("logIn").style = "display: none;";
  document.getElementById("logInGoogle").style = "display: none;";
  document.getElementById("email").style = "display: none;";
  document.getElementById("password").style = "display: none;";
  document.getElementById("error").style = "display: none;";

  document.getElementById("usernameBackground").style = "display: inline-block;";
  document.getElementById("usernameDisplay").innerHTML = userEmail;
  document.getElementById("signOut").style = "display: inline-block;";
}

export default App;
