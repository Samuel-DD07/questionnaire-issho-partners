const issho = document.querySelector('.issho')
const moi = document.querySelector('.moi')
let temps = 0

function elementSelected(e){
    temps = 0
    moi.querySelectorAll('div.selection').forEach(e => moi.removeChild(e))
    createResponse('moi', e.target.textContent)
    createResponse('issho', "test")
    Cheminement[e.target.id].sousElement.map((element, indice) =>
        createResponse('moi', element.element, e.target.id+indice, true)
    )
}

function createResponse(content, reponse, id, interaction){
    const responseContent = document.createElement('div')
    responseContent.textContent = reponse

    if (interaction == true) {
        responseContent.classList.add("selection")
        responseContent.id = id
        responseContent.addEventListener('click', elementSelected)
    }
    setTimeout(() => {
        responseContent.style.display= "inline-flex"
        responseContent.style.animation = "translate 1s"
        eval(content).appendChild(responseContent)
    }, temps)
    console.log(temps)
    temps = temps + 500
}

createResponse("issho", "Bonjour !\nNous sommes issho, une communauté de dirigeants et d’entrepreneurs qui vous aide à trouver des solutions concrètes à votre développement et à la croissance de votre entreprise.")
createResponse("issho", "Qui êtes vous ?")
Cheminement.map((element, indice) =>
    createResponse('moi', element.element, indice, true)
)