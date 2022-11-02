const content = document.querySelector('.container-issho')
let indiceElement = {
    moi: 0,
    issho: 0,
    data: null,
    top: window.scrollY,
    temps: 50
}
window.addEventListener('scroll', activation)

function activation(){
    if (content.getBoundingClientRect().top < 1000) {
        getData()
        window.removeEventListener('scroll', activation)
    }
}

async function getData(){
    await fetch('https://samuel-dd07.github.io/questionnaire-issho-partners/Cheminement-Formulaire-Issho.json')
    .then(res => res.json())
    
    .then(data => createConversation(data))
}

function createConversation(tab){
    indiceElement.data = tab[0].topic.topics
    createIssho()
    createMoi()

    createResponse(`.issho.n-${0}`, "Bonjour !\nNous sommes issho, une communauté de dirigeants et d’entrepreneurs qui vous aide à trouver des solutions concrètes à votre développement et à la croissance de votre entreprise.")
    createResponse(`.issho.n-${0}`, "Qui êtes vous ?")
    indiceElement.data.map((e, i) => createResponse(`.moi.n-${0}`, e.title, i, true))
}

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
    indiceElement.temps = 50
    createMoi()
    createResponse(`.moi.n-${indiceElement.moi-1}`, e.target.textContent)
    document.querySelector(`div.moi.n-${indiceElement.moi-2}`).outerHTML = ""
    
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
        createResponse(`.moi.n-${indiceElement.moi-1}`, "Call To Action")
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
        responseContent.style.animation = "translate 1s ease"
        document.querySelector(content).appendChild(responseContent)
        indiceElement.top = window.scrollY + responseContent.offsetHeight
        window.scroll({
            top: indiceElement.top,
            behavior: 'smooth'
        })
    }, indiceElement.temps)
    indiceElement.temps = indiceElement.temps + 500
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