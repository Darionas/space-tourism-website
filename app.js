//use strict
/* jshint esversion: 6 */

const nav = document.querySelector('.primary-navigation');
const navToggle = document.querySelector('.mobile-nav-toggle');
let tabFocus = 0;

// hamburger button
navToggle.addEventListener('click', () => {
    const visibility = nav.getAttribute('data-visible');
    if(visibility === 'false') {
        nav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else {
        nav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
});

// fetch data from JSON
document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.className;
    fetch('./data.json')
        .then((response) =>{
            if(!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            if(pageType === 'destination') {
                populatePage(data.destinations, 'destination');
            }  else if(pageType === 'crew') {
                populatePage(data.crew, 'crew') ;
            } else if(pageType === 'technology') {
                populatePage(data.technology, 'technology');
            }
        })
        .catch((error) => {
            console.log('There was a problem with the fetch operation ' + error);
       });
});

// populate the main element with data
function populatePage(data, type) {
    // get the header element
    const header = document.querySelector('.primary-header');
            
    // create the main element
    const main = document.createElement('main');
    main.setAttribute('id', 'main');
    main.setAttribute('class', `grid-container grid-container--${type} flow`); /* In destination: flow--extra*/
        
    // ceate the heading element
    const heading = document.createElement('h1');
    heading.setAttribute('class', 'numbered-title');
    heading.innerHTML = getHeadingText(type);
    main.appendChild(heading);

    // Create the tab list
    const tabList = document.createElement('div');
    if(type === 'destination') {tabList.setAttribute('class', 'tab-list underline-indicators flex');}
    else if(type === 'crew') {tabList.setAttribute('class', 'dot-indicators flex');}
    else if(type === 'technology') {tabList.setAttribute('class', 'num-indicators flex');}
    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', `${type} list`);
    
    // Add tabs and content
    data.forEach((item, index) => {
        const tabButton = createTabButton(item, index, type);
        const content = createContent(item, index, type);
        
        tabList.appendChild(tabButton);
        main.appendChild(content.article);
        main.appendChild(content.picture);
        
    });
    
    // Append the tab list to the main element
    main.appendChild(tabList);

    
    header.insertAdjacentElement('afterend', main);
    
    // add event listeners after the DOM is uploaded
    tabList.addEventListener('keydown', changeTabFocus);
    const tabs = tabList.querySelectorAll('[role="tab"]');
    tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            switchTab(e, data);
        });
    });
}

function getHeadingText(type) {
    if(type === 'destination') {
        return `<span aria-hidden="true">01</span> Pick your destination`;
    } else if(type === 'crew') {
        return `<span aria-hidden="true">02</span> Meet your crew`;
    } else if(type === 'technology') {
        return `<span aria-hidden="true">03</span> Space launch 101`;
    }
}

function createTabButton(item, index, type) {
    // create the tab button
    const tabButton = document.createElement('button');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-controls', `${item.name.toLowerCase().replace(' ', '-')}-tab`);
    tabButton.setAttribute('data-index', index);
    tabButton.setAttribute('aria-selected' , index === 0 ? 'true' : 'false');
    tabButton.setAttribute('tabIndex', index === 0 ? '0' : '-1');
    tabButton.setAttribute('class', 'uppercase text-accent letter-spacing-2 ff-sans-cond');

    if(type === 'crew') {
        tabButton.innerHTML = `<span class="sr-only">The ${item.role.toLowerCase()}</span>`;
    } else {
        tabButton.innerHTML = type === 'technology' ? index + 1 : item.name;
    }
    
    return tabButton;
}

function createContent(item, index, type) {
    // create the picture element
    const picture = document.createElement('picture');
    picture.setAttribute('id', `${item.name.toLowerCase().replace(' ', '-')}-image`);
    
    if(index !== 0) picture.setAttribute('hidden', true);
    if(type === 'technology') {
        picture.innerHTML = `
            <source media="(max-width: 34.999em)" srcset="${item.images.portrait}" />
            <source media="(min-width: 35em) and (max-width: 44.999em)" srcset="${item.images.landscape}" />
            <source media="(min-width: 45em)" srcset="${item.images.portrait}" />
            <img src="${item.images.portrait}" alt="The ${item.name}" />
        `;
    } else {
        picture.innerHTML = `
            <source srcset="${item.images.webp}" type="image/webp">
            <img src="${item.images.png}" alt="${item.name}">
        `;
    }
    
    // Create the content container
    const article = document.createElement('article');
    article.setAttribute('class', `${type}-details flow`);
    article.setAttribute('id', `${item.name.toLowerCase().replace(' ', '-')}-tab`);
    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'tabpanel');
    
    if(index !== 0) article.setAttribute('hidden', true);
    
    if(type === 'destination') {
        article.innerHTML = `
            <h2 class="fs-100 uppercase ff-serif">${item.name}</h2>
            <p>${item.description}</p>
            <div class="destination-meta flex">
                <div>
                    <h3 class="text-accent fs-14 uppercase">Avg. distance</h3>
                    <p class="ff-serif uppercase">${item.distance}</p>
                </div>
                <div>
                    <h3 class="text-accent fs-14 uppercase">Est. travel time</h3>
                    <p class="ff-serif uppercase">${item.travel}</p>
                </div>
            </div>
        `;
    } else if(type === 'crew') {
        article.innerHTML = `
            <header class="flow">
                <h2 class="fs-32 uppercase ff-serif">${item.role}</h2>
                <p class="fs-56 uppercase ff-serif">${item.name}</p>
            </header>
            <p>${item.bio}</p>
        `;
    } else if(type === 'technology') {
        article.innerHTML = `
            <header class="flow">
                <h2 class="fs-32 uppercase ff-serif">The terminology...</h2>
                <p class="fs-56 uppercase ff-serif">${item.name}</p>
            </header>
            <p>${item.description}</p>
        `;
    }
    
    return {picture, article};
}

function switchTab(e, data) {
    const targetTab = e.target;
    const tabList = targetTab.parentNode;
    const tabs = tabList.querySelectorAll('[role="tab"]');
    const index = + targetTab.getAttribute('data-index');
    
    // Update tab states
    tabs.forEach((tab) => {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
    });
    targetTab.setAttribute('aria-selected', 'true');
    targetTab.setAttribute('tabindex', '0');


    // Hide all pictures and articles
    const main = tabList.parentNode;
    const pictures = main.querySelectorAll('picture');
    const articles = main.querySelectorAll('[role="tabpanel"]');
    pictures.forEach((pic) => pic.setAttribute('hidden', true));
    articles.forEach((article) => article.setAttribute('hidden', true));

    // Show the selected picture and article
    const pic = main.querySelector(`#${data[index].name.toLowerCase().replace(' ', '-')}-image`);
    const article = main.querySelector(`#${data[index].name.toLowerCase().replace(' ', '-')}-tab`);
    pic.removeAttribute('hidden');
    article.removeAttribute('hidden');
}

       
function changeTabFocus(e) {
    const keyDownLeft = 37;
    const keyDownRight = 39;
    
    const tabList = e.target.parentNode;
    const tabs = tabList.querySelectorAll('[role="tab"]');
    
    //change the tabIndex of the current tab to -1
    if(e.keyCode === keyDownLeft || e.keyCode === keyDownRight) {
        tabs[tabFocus].setAttribute('tabindex', -1);
        
        // if the right key is pushed, move to the next tab on the right
        if(e.keyCode === keyDownRight) {
            tabFocus++;
            if(tabFocus >= tabs.length) {
                tabFocus = 0;
            }
        }
        // if the left key is pushed, move to the next tab on the left
        else if(e.keyCode === keyDownLeft) {
            tabFocus--;
            if(tabFocus < 0) {
                tabFocus = tabs.length - 1;
            }
        }
    
        tabs[tabFocus].setAttribute('tabindex', 0);
        tabs[tabFocus].focus();
    }
}

