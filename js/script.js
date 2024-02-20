
// console.log("hello")
let songs;
let currfolder;
function secondsToSongTime(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return formatted time
    return formattedMinutes + ':' + formattedSeconds;
}

// Example usage:



//decaring a global variable to play the current song
let currentSong = new Audio();

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)

    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currfolder}/`)[1])
        }
    }
    //show all songs in the playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> <img class = "invert"src="/images/music.svg" alt="">
                        <div class="info">

                        <div class="songname">${song.replaceAll("-", " ")}</div>
                        <div class="songartist">Artist</div>
                        
                        </div>
                          
                        <div class="playnow">
                            <span>Play Now</span>
                        <img id="change"class="change invert pp" src="/images/play.svg" alt="">

                        </div> </li>`     ;

    }
    //attach an event listen to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ", "-"))


        })


    })

return songs;



}

//function to play music
const playMusic = (track, pause = false) => {
    // console.log(track);
    //   let audio = new Audio("/songs/" + track)
    currentSong.src = `${currfolder}/` + track
    if (!pause) {

        currentSong.play();
        play.src = "/images/pause.svg"



    }

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = " 00:00 / 00:00 "


}

//function to display albuims

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    let cardContainer = document.querySelector(".cardContainer")
    div.innerHTML = response;
    console.log(div)
    let anchors = div.getElementsByTagName("a")
    console.log(anchors)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
     const e =array[index];
     console.log(e.href);
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-1)[0])
            //get the meta deta of the folder
            let a = await fetch(`/songs/${folder}/info.json`    )
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `
           <div data-folder="${folder}"class="card">
               
           <div>
          
           <img class="play"src="/images/gplay.svg" alt="ff">
           </div>
               <img src="/songs/${folder}/cover.jpg" alt="">
       
               
               
               <h2>${response.title}</h2>
               <p>${response.description}</p>
             
           </div>`


        }


    }
    //event listner for cards
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
play.src="/images/pause.svg"
        })
    })

}

async function main() {

    //get list of first song

    await getSongs("songs/songs1");
    playMusic(songs[0], true)

    //display all the albums on the page 
    displayAlbums()



    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToSongTime(currentSong.currentTime)} / ${secondsToSongTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })


    //add an event listner to seek bar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    //add an event listenr for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })

    //add am event listner to close 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%";
    })

    //adding event listeners to previous and next
    previous.addEventListener("click", () => {

        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }

    })

    next.addEventListener("click", () => {

       
        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0]);
        let len = (songs.length);

        if (index + 1 < len) {

            playMusic(songs[index + 1]);
        }

    })

    //attach an event listner to play next and previous  buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/images/pause.svg"


        }
        else {
            currentSong.pause();
            play.src = "/images/play.svg"



        }
    })


    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        let v = (e.target.value);
        if (v < 50 && v > 0) {
            document.getElementById("vol").src = "/images/lessvol.svg"
        }
        else if (v == 0) {
            document.getElementById("vol").src = "/images/mute.svg"

        }
        else {
            document.getElementById("vol").src = "/images/volume.svg";

        }
        currentSong.volume = parseInt(e.target.value) / 100;

    })

    //load the playlist when card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item.currentTarget)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);


        })
    })

    //adding event listner to mute the track
    document.querySelector("#vol").addEventListener("click", e=>{
        
        if(e.target.src.split("/").slice(-1) == "volume.svg")
        {
            console.log("vol")
            e.target.src = "/images/mute.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            currentSong.volume = 0;
       
        }     
        else{
            console.log("mute")

            e.target.src = "/images/volume.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
            currentSong.volume = 0.5;
        
        }
    })


}



main()

