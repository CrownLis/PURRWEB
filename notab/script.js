
const cookie = document.querySelector('.cookie')
document.querySelector('.cookie__button').addEventListener('click', closeCookie)

function closeCookie () {
    cookie.style.display = 'none'
}

function translateCookie () {
    cookie.style.bottom = 100 + 'px'
    cookie.style.transform = 'translateY(100px)'
    cookie.style.transitionDuration = 1 +'s'
}



translateCookie()