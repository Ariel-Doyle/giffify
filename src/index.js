//busi logic
import './css/styles.css';

function getGiph(search, i){
  let request = new XMLHttpRequest();
  const url = `http://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${search}&offset=${i}`;
  request.addEventListener("loadend",function(){
    const response = JSON.parse(this.responseText);
    if (this.status === 200){
      showImages(response);
    } else {
      printError(this, response);
    }
  });
  request.open('GET', url, true);
  request.send();
}

function* returnNextFourImages(response) {
  // turn this into a generator
  //let start = Math.floor(Math.random() * 45);
  let start = 1;
  while (true) {
    yield response.data.slice(start, start + 4).map(image => image.images);
    start += 4;
  }
}


//User Logic

function printError(request, response) {
  let searchInput = document.getElementById('searchInput').value;
  if (response.meta.status === 414) {
    searchInput = searchInput.slice(0, 10) + '...';
  }
  document.querySelector('#gifDisplay').innerText = `There was an error accessing the images for ${searchInput}: ${request.status} ${response.meta.msg}`;
}

function cycleImages (imageGenerator) {
  document.getElementById('gifDisplay').innerHTML = null;
  let images = imageGenerator.next().value;
  images.forEach(image => {
    const img = document.createElement('img');
    img.src = image.original.url;
    img.classList.add('result');
    document.getElementById('gifDisplay').append(img);
  });
}

function showImages(response) {  
  document.getElementById('gifDisplay').innerHTML = null;
  let searchInput = document.getElementById('searchInput').value;
  let link = "https://media.giphy.com/media/d2YWTOsVtuHgOHhC/giphy.gif"
  if (response.pagination.total_count === 0) {
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = link;    
    const caption = document.createElement('figcaption');
    caption.innerText = `Oh no! There are no images available for ${searchInput}. Looks like you should create a new gif ;)\n`;
    fig.append(caption);
    fig.append(img)
    document.getElementById('gifDisplay').append(fig);
  } else {
    const imageGen = returnNextFourImages(response);
    cycleImages(imageGen);
    document.getElementById('nextButton').classList.remove('hidden');
    document.getElementById('nextButton').addEventListener('click', function(){
      cycleImages(imageGen);    
    });
  }
}

//let i = 0;
document.getElementById('searchButton').addEventListener("click", e => {
  const searchTerm = document.getElementById('searchInput').value;
  getGiph(searchTerm, 0);
  //i += 50;
});


