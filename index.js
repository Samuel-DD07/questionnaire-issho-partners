const content = document.querySelector('.container-issho')

let temps = 0
let indiceElement = {
    moi: 0,
    issho: 0,
    data: null,
    top: 100
}

async function getData(){
    await fetch('./Cheminement-Formulaire-Issho.json')
    .then(res => res.json())
    .then(data => createConversation(data))
}

function createConversation(tab){
    indiceElement.data = tab[0].topic.topics
    console.log(indiceElement.data);
    createIssho()
    createMoi()

    createResponse(`.issho.n-${0}`, "Bonjour !\nNous sommes issho, une communauté de dirigeants et d’entrepreneurs qui vous aide à trouver des solutions concrètes à votre développement et à la croissance de votre entreprise.")
    createResponse(`.issho.n-${0}`, "Qui êtes vous ?")
    indiceElement.data.map((e, i) => createResponse(`.moi.n-${0}`, e.title, i, true))
}

getData()

function createIssho(){
    const issho = document.createElement('div')
    issho.classList.add('issho', `n-${indiceElement.issho}`)
    content.appendChild(issho)
    indiceElement.issho += 1
}

function createMoi(){
    const moi = document.createElement('div')
    moi.classList.add('moi', `n-${indiceElement.moi}`)
    content.appendChild(moi)
    indiceElement.moi += 1
}

function elementSelected(e){
    temps = 0
    document.querySelector(`div.moi.n-${indiceElement.moi-1}`).outerHTML = ""
    createMoi()
    createResponse(`.moi.n-${indiceElement.moi-1}`, e.target.textContent)
    
    createIssho()
    createResponse(`.issho.n-${indiceElement.issho-1}`, "Question à poser !")
    
    createMoi()

    const test = searchInObj(indiceElement.data, "title", e.target.textContent).replace("title", "topics")
    indiceElement.data = eval("indiceElement.data"+test)

    try{
        indiceElement.data.map((element, indice) =>
        createResponse(`.moi.n-${indiceElement.moi-1}`, element.title, e.target.id+indice, true)
        )
    } catch(e){
        console.log("Fin !");
    }
}

function createResponse(content, reponse, id, interaction){
    const responseContent = document.createElement('div')
    responseContent.textContent = reponse

    if (interaction) {
        responseContent.classList.add("selection")
        responseContent.id = id
        responseContent.addEventListener('click', elementSelected)
    }
    setTimeout(() => {
        responseContent.style.display= "inline-flex"
        responseContent.style.animation = "translate 1s"
        document.querySelector(content).appendChild(responseContent)
        indiceElement.top += 100
        window.scroll({
            top: indiceElement.top,
            behavior: 'smooth'
        })
    }, temps)
    temps = temps + 500
}

function searchInObj(obj, name, val, currentPath){
    currentPath = currentPath || ''

    let matchingPath
  
    if (!obj || typeof obj !== 'object') return
  
    if (obj[name] === val) return `${currentPath}['${name}']`
  
    for (const key of Object.keys(obj)) {
      if (key === name && obj[key] === val) {
        matchingPath = currentPath
      } else {
        matchingPath = searchInObj(obj[key], name, val, `${currentPath}['${key}']`)
      }
  
      if (matchingPath) break
    }
  
    return matchingPath
}