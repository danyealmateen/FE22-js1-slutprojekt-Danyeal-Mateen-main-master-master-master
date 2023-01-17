let divForThePictures = document.getElementById("divForThePictures");
let animeParagraph = document.getElementById("animeParagraph");
let button = document.getElementById("button");
let randomButton = document.getElementById("randomButton");
let errorContainer = document.getElementById("errorMessageContainer");
let boxContainer = document.getElementById("boxContainer");
let animeDiv = document.getElementById("animeDiv");

//Ett event som lyssnar på ett knapptryck och exekverar olika funktioner.
button.addEventListener("click", (e) => {
  errorContainer.innerHTML = "";
  clearTheDivForPictures();
  e.preventDefault();
  renderFlickrPic();
  anime();
});

function renderFlickrPic() {
  let inputText = document.getElementById("inputText").value;
  let inputNumber = document.getElementById("inputNumber").value;
  let inputSorting = document.getElementById("inputSorting").value;
  let inputSortingValue = "";

  //Radioknapparna
  let isError = false;
  let radioButtonSmall = document.getElementById("radioButtonSmall");
  let radioButtonMedium = document.getElementById("radioButtonMedium");
  let radioButtonLarge = document.getElementById("radioButtonLarge");
  let radioButtonValue = "";

  //If sats som kontrollerar om radioknapparna är ibockade och skickar rätt värde (m,z,b) som motsvarar olika storleker på bilderna till den tomma variabeln checkboxValue som ersätter värdena i URL länken nedanför.
  if (radioButtonSmall.checked) {
    console.log("small checkad");
    radioButtonValue = "m";
  } else if (radioButtonMedium.checked) {
    console.log("medium checked");
    radioButtonValue = "z";
  } else if (radioButtonLarge.checked) {
    radioButtonValue = "b";
  } else {
    //Errormeddelande för img size.
    let createCheckboxErrorMessage = document.createElement("h1");
    createCheckboxErrorMessage.innerHTML = `<li>Please choose a img size!</li>`;
    errorContainer.appendChild(createCheckboxErrorMessage);
    isError = true;
  }

  //Hanterar errormeddelanden för inputfält.
  if (inputText === "") {
    let createErrorMessage = document.createElement("h1");
    createErrorMessage.innerHTML = `<li>Please fill in the "Search..." input!</li>`;
    errorContainer.appendChild(createErrorMessage);
    isError = true;
  }

  if (inputSorting === "Date posted") {
    inputSortingValue = "date-posted-asc";
    console.log(inputSortingValue);
  } else if (inputSorting === "Interestingness") {
    inputSortingValue = "interestingness-asc";
    console.log(inputSortingValue);
  } else if (inputSorting === "Relevance") {
    inputSortingValue = "relevance";
    console.log(inputSortingValue);
  } else {
    //Errorhandling för inputsorting
    let createErrorMessage = document.createElement("h1");
    createErrorMessage.innerHTML = `<li>Please fill in the inputsorting..</li>`;
    errorContainer.appendChild(createErrorMessage);
    isError = true;
  }

  //Animationen
  animeDiv.style.visibility = "visible";
  const animation = anime({
    targets: "#animeDiv",
    color: "white",
    translateX: 5,
    translateY: 5,
    backgroundColor: "hsl(330, 100%, 71%)",
    border: "dotted 10px orange",
    duration: 1000,
    easing: "linear",
    direction: "alternate",
  });

  //Extra funktionalitet. Scrollar fram bilderna beroende på windows.height.
  function checkBoxes() {
    const boxes = document.querySelectorAll(".box");
    const triggerBottom = (window.innerHeight / 5) * 4;

    boxes.forEach((box) => {
      //Returnar information box storlek relaterat till dens position till viewporten.
      const boxTop = box.getBoundingClientRect().top;

      if (boxTop < triggerBottom) {
        box.classList.add("show");
      } else {
        box.classList.remove("show");
      }
    });
  }

  let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=53e8d7af0f521f892d0883605d2e7213&text=${inputText}&per_page=${inputNumber}&sort=${inputSortingValue}&format=json&nojsoncallback=1 `;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      animeDiv.style.visibility = "hidden";

      //Errorhandling för ogiltigt sökord.
      if (data.photos.pages === 0) {
        errorContainer.innerHTML = `OBS! Inget giltigt sökord!`;
      }
      console.log(data.photos.pages);
      let firstImg = true;

      //Scrollboxen
      data.photos.photo.forEach((obj) => {
        let scrollBoxDiv = document.createElement("img");
        if (firstImg) {
          firstImg = false;
          scrollBoxDiv.setAttribute("class", "firstBox");
        } else {
          scrollBoxDiv.setAttribute("class", "box");
        }
        scrollBoxDiv.setAttribute(
          "src",
          `https://live.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_${radioButtonValue}.jpg`
        );
        boxContainer.appendChild(scrollBoxDiv);
      });
      //Eventlistener som lyssnar på när man scrollar vertikalt
      window.addEventListener("scroll", checkBoxes);
    })

    //Fångar upp error meddelanden och loggar det i konsolen samt ett meddelande skrivs ut till DOM:en.
    .catch((error) => {
      console.log(error);
      let createErrorMessage = document.createElement("h1");
      createErrorMessage.innerHTML = `<li>Something went wrong</li>`;
      errorContainer.appendChild(createErrorMessage);
      isError = true;
    });
}
function clearTheDivForPictures() {
  //Rensar innehållet av divven.
  boxContainer.innerHTML = "";
}

let downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", (e) => {
  e.preventDefault();
  downloadURL();
});

//Extra funktionalitet som sparar ner en fil på användarens dator när de har tryckt på knappen innehållandes en text.
function downloadURL() {
  let link = document.createElement("a");
  link.download = "Thanks for using my APP!.txt";
  link.href = "data:text/html,Created by Danyeal Mateen";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}
