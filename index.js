const issho = document.querySelector('.issho')
const moi = document.querySelector('.moi')

function createResponse(content, reponse, interaction){
    const responseContent = document.createElement('div')
    responseContent.textContent = reponse

    if (interaction == true) {
        responseContent.classList.add("selection")
        responseContent.addEventListener('click', function(){
            this.style.color = "red";
        })
    }
    eval(content).appendChild(responseContent)
}

createResponse("issho", "Bonjour !\nNous sommes issho, une communauté de dirigeants et d’entrepreneurs qui vous aide à trouver des solutions concrètes à votre développement et à la croissance de votre entreprise.")
createResponse("issho", "Qui êtes vous ?")
createResponse("moi", "Je suis ...")
createResponse("moi", "Un dirigeant d'entreprise", true)