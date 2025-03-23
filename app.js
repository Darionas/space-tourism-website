
// when someone clicks the hamburger button
// if the nav is closed, open it
// if the nav is open, close it

const nav = document.querySelector('.primary-navigation');
const navToggle = document.querySelector('.mobile-nav-toggle');

navToggle.addEventListener('click', () => {
    const visibility = nav.getAttribute('data-visible');
    if(visibility === 'false') {
        nav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else {
        nav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
    
   /*  console.log(navToggle.getAttribute('aria-expanded')); */
})


const tabList = document.querySelector('[role="tabList"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

tabList.addEventListener('keydown', changeTabFocus);

tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabPanel);
})

let tabFocus = 0;
function changeTabFocus(e) {
    const keyDownLeft = 37;
    const keyDownRight = 39;
    
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

function changeTabPanel(e) {
    const targetTab = e.target;
    /* console.log(targetTab); */
    const targetPanel = targetTab.getAttribute('aria-controls');
    const targetImage = targetTab.getAttribute('data-image');
    const tabContainer = targetTab.parentNode;
    const mainContainer = tabContainer.parentNode;
    
    hideContent(mainContainer, '[role="tabpanel"]');
   /*  mainContainer.querySelectorAll('[role="tabpanel"]')
        .forEach((panel) => {
            panel.setAttribute('hidden', true);
        }) */
    
    showContent(mainContainer, [`#${targetPanel}`]);
    /* mainContainer.querySelector([`#${targetPanel}`])
        .removeAttribute('hidden'); */
    
    hideContent(mainContainer, 'picture');
    /* mainContainer.querySelectorAll('picture')
        .forEach((pic) => {
            pic.setAttribute('hidden', true);
        }) */
    
    showContent(mainContainer, [`#${targetImage}`])
    /* mainContainer.querySelector([`#${targetImage}`])
        .removeAttribute('hidden'); */
    
    tabContainer.querySelector('[aria-selected="true"]')
        .setAttribute('aria-selected', false);
        
    targetTab.setAttribute('aria-selected', 'true');
}

function hideContent(parent, content) {
    parent.querySelectorAll(content)
    .forEach((item) => {
        item.setAttribute('hidden', true);
    })
}

function showContent(parent, content) {
    parent.querySelector(content)
        .removeAttribute('hidden'); 
}

