import { getData } from './index.js'
const content = document.querySelector('.container-issho')

window.addEventListener('scroll', activation)

function activation(){
    if (content.getBoundingClientRect().top < 1000) {
        getData()
        window.removeEventListener('scroll', activation)
    }
}