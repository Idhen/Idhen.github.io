const langElements = document.getElementsByClassName('language-option')

const strings = {
    'text-no': [
        "Jeg heter Andreas Eidhammer, og jeg er en 20 år gammel norsk utvikler med stor lidenskap for programmering og webutvikling.",
        "For tiden er jeg student, men jeg ser etter spennende muligheter til å utvikle mine ferdigheter i et profesjonelt miljø. På denne nettsiden finner du en oversikt over mine milepæler og de største prosjektene jeg har jobbet med de siste årene.",
        "For kontakt: andr.eidhammer@gmail.com"
    ],
    'text-en': [
        "My name is Andreas Eidhammer, and I am a 20 year old Norwegian developer with a great passion for programming and web development.",
        "I am currently a student, but I am looking for exciting opportunities to develop my skills in a professional environment. On this website you will find an overview of my milestones and the biggest projects I have worked on in recent years.",
        "For contact: andr.eidhammer@gmail.com"
    ]
}

function refreshLanguage () {
    for (let element of langElements) {
        if (element.id == 'lang-' + document.documentElement.lang) {
            element.classList.add('selected')
        }
        else {
            element.classList.remove('selected')
        }
    }


    fetchData();
    modifyTextElements();
}

refreshLanguage();

function changeLanguage (inputLanguage) {
    document.documentElement.lang = inputLanguage;
    refreshLanguage();
}

function modifyTextElements() {
    for (let i = 0; i < strings['text-' + document.documentElement.lang].length; i++) {
        document.getElementById('intro-line-' + (i + 1)).textContent = strings['text-' + document.documentElement.lang][i]
    }

    document.getElementById('button-intro').textContent = document.documentElement.lang == 'no' ? 'Introduksjon' : "Introduction"
    document.getElementById('button-demo').textContent = document.documentElement.lang == 'no' ? 'Mine prosjekter og erfaring' : "My projects and experience"
}

let currentView = 'intro'

function changeView(newView) {
    document.getElementById('button-' + currentView).classList.remove('selected');
    document.getElementById('button-' + newView).classList.add('selected');

    if (newView == 'demo') {
        document.getElementById('content-container').style.transform = 'translateX(-50%)';
        document.getElementById('demo-container').style.transform = 'translateX(50%)';

    } else {
        document.getElementById('content-container').style.transform = 'translateX(0px)';
        document.getElementById('demo-container').style.transform = 'translateX(0px)';

    }
    currentView = newView;

}
function getRandomColor() {
    const randomValue = () => Math.floor(Math.random() * 200); // Restrict to darker shades
    const red = randomValue();
    const green = randomValue();
    const blue = randomValue();
    
    return `#${[red, green, blue].map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

let experienceData = []

async function fetchData () {
    try {
        const response = await fetch('./experience-' + document.documentElement.lang + '.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        experienceData = await response.json();

        document.getElementById('scroll-area').innerHTML = ''

        for (let i = 0; i < experienceData.length; i++) {
            let randColor = getRandomColor();

            // Savner Vue/React her. Bruk av .join for å forhindre rendring av kommaer i array
            let htmlContent = `
                <div class="showcase-entry-container" style="background-color:${randColor}">
                    <div class="showcase-content-container">
                    <div class="showcase-entry-textbox">
                        <h2 class="showcase-entry-title">${experienceData[i].title}</h2>
                        <p class="showcase-entry-description">${experienceData[i].description}</p>
                    </div>
                    <div class="showcase-entry-images">
                        ${experienceData[i].images.map(image => {
                            safeObject = encodeURIComponent(JSON.stringify(image)) // Objekt til streng, så enkodet for å unngå problemer med "" i HTML
                            return `<div class="showcase-entry-imagebox">
                                        <img class="showcase-entry-image" onclick="zoomImage('${safeObject}')" src="${image.url}"/>
                                    </div>`
                        }).join('')}
                    </div>
                    </div>
                </div>
            `;
            document.getElementById('scroll-area').innerHTML += htmlContent;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function zoomImage(image) {
    const decodedImageObject = JSON.parse(decodeURIComponent(image)) // Dekodet, streng overført til objekt
    let imagePane = document.createElement('div');
    imagePane.id = 'fullscreen-image';
    imagePane.classList.add('fullscreen-image-container');
    imagePane.onclick = closeImage;
    
    imagePane.innerHTML = `
        <img class="fullscreen-image-pane" src="${decodedImageObject.url}" />
        <p class="description-text">${decodedImageObject.description}</p>
    `;

    document.body.appendChild(imagePane);
}

function closeImage() {
    document.getElementById('fullscreen-image').remove();
}