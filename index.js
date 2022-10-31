const issho = document.querySelector('.issho')
const moi = document.querySelector('.moi')

function elementSelected(e){
    console.log(Cheminement[e.target.id][e.target.textContent]);
}

function createResponse(content, reponse, id, interaction){
    const responseContent = document.createElement('div')
    responseContent.textContent = reponse

    if (interaction == true) {
        responseContent.classList.add("selection")
        responseContent.id = id
        responseContent.addEventListener('click', function(e){
            elementSelected(e)
        })
    }
    eval(content).appendChild(responseContent)
}

createResponse("issho", "Bonjour !\nNous sommes issho, une communauté de dirigeants et d’entrepreneurs qui vous aide à trouver des solutions concrètes à votre développement et à la croissance de votre entreprise.")
createResponse("issho", "Qui êtes vous ?")
Cheminement.map((e, i) => 
    createResponse("moi", Object.keys(e)[0], i, true)
)