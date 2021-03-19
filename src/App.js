import './App.css';
import firebase from 'firebase'
import "firebase/auth"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

const AWS = require('aws-sdk')
const sts = new AWS.STS()

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

export default function Controller(){
  return(
    <Router>
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/main">
        <MainPage />
      </Route>
      <Route path = "/artist/:artist/:album" children ={<AlbumPage />}>
      </Route>
      <Route path = "/artist/:artist" children ={<ArtistPage />}>
      </Route>
      <Route path = "/401" children={<FourohonePage />}>
      </Route>
    </Switch>
    </Router>
  )
}

function Login() {
  return (
    <div className="Login">
      <header className="App-header">

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

            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password).then((user) => {
                // User created and signed in
                localStorage.setItem("auth", true)
                window.location.href = "/main"
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
          await firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
            //Signed in
            
            localStorage.setItem("auth", true)
            window.location.href = "/main"
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
            
            localStorage.setItem("auth", true)
            window.location.href = "/main"
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

function MainPage(){


  window.addEventListener('load', function(){


    console.log(localStorage.getItem("auth"))
    if(localStorage.getItem("auth") === "false"){
      window.location.href = "/401"
    }

    var response = fetch('https://oaysqwb5t8.execute-api.us-east-1.amazonaws.com/dev/artists').then(response => response.json()).then((data) =>{ console.log(data)

    var artists = data.Artists
    var artistList  = document.getElementById("artists");

    for (var i = 0; i < artists.length; i++){

      let li = document.createElement("li")
      let button = document.createElement("button")
      button.className = "artistName"
      button.innerHTML = artists[i];
      li.appendChild(button)
      button.setAttribute('onClick', "{window.location.href= ('/artist/' + this.innerHTML)};")
      artistList.appendChild(li);
    }
  })
  });

  return(
    <div className="MainPage">

      <div className="header"> Artists 
          <button id="signOut" onClick = { function() {window.location.href = "/"; localStorage.setItem("auth", false)}}>Log Out</button>
      </div>
      <div className="bodyBox">
        <ul className = "artists" id="artists">

        </ul>
      </div>
    </div>
  )
}

function ArtistPage(){

    console.log(localStorage.getItem("auth"))
    if(localStorage.getItem("auth") === "false"){
      window.location.href = "/401"
    }

  let { artist } = useParams()

  console.log("artistPage")

  window.addEventListener('load', function(){

    var header = document.getElementById("header").innerText.split(' ')
    var artist = header[1] + " " + header[2]
    var response = fetch('https://oaysqwb5t8.execute-api.us-east-1.amazonaws.com/dev/albums/for/artist?artist=' + artist ).then(response => response.json()).then((data) =>{ 
      
      console.log(data)

      var albums = data.Albums

      var artistlist = document.getElementById("albums")

      for (var i = 0; i < albums.length; i++){

        let li = document.createElement("li")
        let button = document.createElement("button")
        button.className = "albumName"
        button.innerText = albums[i];

        button.setAttribute('onClick', "{window.location.href= ('/artist/' + '" + artist + "' + '/' + this.innerHTML)};")
        artistlist.appendChild(li);
        li.appendChild(button);
      }
    })
  })

  return(

    <div className = "ArtistPage">
      <div className="header" id="header"> 
          <button id="back" onClick = { function() {window.location.href = "/main"}}>Back</button>
          Artist {artist} :
          <button id="signOut" onClick = { function() {window.location.href = "/"; localStorage.setItem("auth", false)}}>Log Out</button>
      </div>

        <div className="artistBodyBox">
          <div className="albums">
            <ul id="albums">
              <li>
              </li>
            </ul>
          </div>
          <div className="songs" id="songs">
            <ul id="songs">
            </ul>

          </div>
        </div>

    <script>


    </script>
    </div>
  )
}

function AlbumPage(){

    console.log(localStorage.getItem("auth"))
    if(localStorage.getItem("auth") === "false"){
      window.location.href = "/401"
    }

  let { artist, album } = useParams()

  window.addEventListener('load', function(){

    var header = document.getElementById("header").innerText.split(' ')
    var response = fetch('https://oaysqwb5t8.execute-api.us-east-1.amazonaws.com/dev/albums/for/artist?artist=' + artist ).then(response => response.json()).then((data) =>{ 
      
      console.log(data)

      var albums = data.Albums

      var artistlist = document.getElementById("albums")

      for (var i = 0; i < albums.length; i++){

        let li = document.createElement("li")
        let button = document.createElement("button")
        button.className = "albumName"
        button.innerText = albums[i];

        button.setAttribute('onClick', "{window.location.href= ('/artist/' + '" + artist + "' + '/' + this.innerHTML)};")
        artistlist.appendChild(li);
        li.appendChild(button);
      }
    })

    var response = fetch('https://oaysqwb5t8.execute-api.us-east-1.amazonaws.com/dev/songs/for/album?album=' + album).then(response => response.json()).then((data) =>{ 
      
      console.log(data)

      var audio = new Audio()

      var songs = data.Songs

      var songlist = document.getElementById("songs")

      for (var i = 0; i < songs.length; i++){

        let li = document.createElement("li")
        let button = document.createElement("button")
        button.className = "songName"
        button.innerText = songs[i];

        // eslint-disable-next-line no-loop-func
        button.addEventListener("click", function(){

          console.log(this.innerText)
          var response = fetch('https://oaysqwb5t8.execute-api.us-east-1.amazonaws.com/dev/song?song=' + button.innerText).then(response => response.json()).then((data) =>{ 

            audio.pause()
            audio = new Audio(data.SongURL)
            audio.play()
          })

          var url = "https://oaysqwb5t8.execute-api.us-east-1.amazonaws.com/dev/play";

          fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Song: button.innerText,
              Album: album,
              Artist: artist
            })
          })
        });

        songlist.appendChild(li);
        li.appendChild(button);


      }
    })
  })

  return(

    <div className = "ArtistPage">
      <div className="header" id ="header"> 
          <button id="back" onClick = { function() {window.location.href = "/main"}}>Back</button>
          Album {album} :
          <button id="signOut" onClick = { function() {window.location.href = "/"; localStorage.setItem("auth", false)}}>Log Out</button>
      </div>

        <div className="artistBodyBox">
          <div className="albums">
            <ul id="albums">
              <li>
              </li>
            </ul>
          </div>
          <div className="songs" id="songs">
            <ul id="songs">
            </ul>
          </div>
        </div>
    <script>
    </script>
    </div>
  )
}

function FourohonePage(){
  return(
    <div className = "401Page">
      <h1> Access Denied </h1>

          <button onClick={function () { window.location.href="./" }}>Log In</button>

    </div>
  )
}