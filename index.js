const issho = document.querySelector('.issho')
const moi = document.querySelector('.moi')

function elementSelected(e){
    while (moi.hasChildNodes()){
            moi.removeChild(moi.lastChild)
    }
    createResponse('moi', e.target.textContent)
    Cheminement[e.target.id].sousElement.map((element, indice) =>
        createResponse('moi', element.element, indice, true)
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
    eval(content).appendChild(responseContent)
}

function intro(){
    createResponse("issho", "Bonjour !\nNous sommes issho, une communauté de dirigeants et d’entrepreneurs qui vous aide à trouver des solutions concrètes à votre développement et à la croissance de votre entreprise.")
    createResponse("issho", "Qui êtes vous ?")
}

intro()

Cheminement.map((element, indice) =>
    createResponse('moi', element.element, indice, true)
)