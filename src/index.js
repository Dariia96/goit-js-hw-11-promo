import './css/styles.css';
import axios from 'axios';
/*import axios, * as others from 'axios';*/
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const axios = require('axios');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard')
let page = 1;

let options = {
    root: null,
    rootMargin: "400px",
    threshold: 0,
};

let observer = new IntersectionObserver(handlerPagination, options);

function handlerPagination(entries, observer) {
    console.log(entries);
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
             
            page += 1;
            
            servicePicture(page)
                    .then(pictures => {
                        gallery.insertAdjacentHTML('beforeend', createMarkup(pictures));
                        /*const lightbox = new SimpleLightbox('.gallery__link', { captionsData: "alt", captionDelay: "250" }).refresh();*/
                   const lightbox = new SimpleLightbox('.gallery__link', { captionsData: "alt", captionDelay: "250" }).refresh();
                        if (pictures.data.totalHits < pictures.data.hits.length) {
                    observer.unobserve(guard);
                    }
                    else if(pictures.data.totalHits = pictures.data.hits.length){
                        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
                        } 
                        
                })
        }
   /*form.reset()*/})
}

form.addEventListener('submit', handlerSearchForm)


function handlerSearchForm  (event) {
        
        event.preventDefault();
        servicePicture(page)
            .then((pictures) => {
                if (pictures.data.totalHits === 0) {
                    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
                }
                
                console.log(pictures)
                gallery.innerHTML = createMarkup(pictures)
                const lightbox = new SimpleLightbox('.gallery__link', { captionsData: "alt", captionDelay: "250" }).refresh();

                if (pictures.data.totalHits > pictures.data.hits.length) {
                    observer.observe(guard);
                }
            }
            //gallery.insertAdjacentHTML('beforeend', galleryImages);}
        ) 
    
            .catch(error => console.log(error));
    
            

}

async function servicePicture( page = 1) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '36867426-6bfbd52b6dcfdc96ad83106d5';

    // return fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&lang=uk`).then(resp => console.log(resp))
    let pictureName = input.value.trim();

    const params = new URLSearchParams({
        key: API_KEY,
        q: pictureName,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        page: page,
        per_page: 40
    })
    // console.log(params.toString());
    const pictures = await axios.get(`${BASE_URL}?${params}`);

    //if (!response.ok) {
       //  throw new Error(response.statusText);
    // };   
    //const pictures = await response.json();
    return pictures;
        }

function createMarkup(arr) {

    return arr.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
                `<li class="photo-card">
                <a class="gallery__link" href="${largeImageURL}">
                    <img
                    class=".gallery__image"
                    src="${webformatURL}"
                        alt="${tags}"
                        loading="lazy"
                        width = 200 />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
  </a>
</li>`
    ).join('');
           
}



