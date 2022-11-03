const content = document.querySelector('.container-issho')
let indiceElement = {
    moi: 0,
    issho: 0,
    data: null,
    top: window.scrollY,
    clc: ["Discuter avec un expert", "Etre rappelé par un expert", "Prendre rendez-vous"],
    temps: 50
}

async function getData(){
    await fetch('./Cheminement-Formulaire-Issho.json')
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
    indiceElement.temps = 50
    createMoi()
    createResponse(`.moi.n-${indiceElement.moi-1}`, e.target.textContent)
    document.querySelector(`div.moi.n-${indiceElement.moi-2}`).outerHTML = ""

    const path = searchInObj(indiceElement.data, "title", e.target.textContent).replace("title", "topics")
    indiceElement.data = eval("indiceElement.data"+path)

    
    if (!!indiceElement.data && indiceElement.data[0]["title"] === 'Question') {
        createIssho()
        if (!!indiceElement.data[0]["topics"][0]["topics"]) {
            createResponse(`.issho.n-${indiceElement.issho-1}`, indiceElement.data[0]["topics"][0]["title"])
            indiceElement.data = indiceElement.data[0]["topics"][0]["topics"]
        } else {
            indiceElement.data[0]["topics"].map((element, indice) => {
                createResponse(`.issho.n-${indiceElement.issho-1}`, element.title)
            })
            indiceElement.data = null
        }
    } else {
        console.log("test");
        createIssho()
        createResponse(`.issho.n-${indiceElement.issho-1}`, "Vous souhaitez en savoir plus ?")
    }
    
    createMoi()
    try{
        indiceElement.data.map((element, indice) =>
        createResponse(`.moi.n-${indiceElement.moi-1}`, element.title, e.target.id+indice, true)
        )
    } catch(e){
        indiceElement.clc.map((element, indice) =>
            createResponse(`.moi.n-${indiceElement.moi-1}`, element, "", true)
        )
    }
}

function createResponse(content, reponse, id, interaction){
    let responseContent = null

    if (typeof reponse == "string" && reponse.indexOf(':') > -1){
        responseContent = document.createElement('a')
        responseContent.textContent = reponse.split('-')[0]
        responseContent.href = reponse.split('-')[1]
        interaction = false
    } else {
        responseContent = document.createElement('div')
        responseContent.textContent = reponse
    }
    if (interaction) {
        responseContent.classList.add("selection")
        responseContent.id = id
        responseContent.addEventListener('click', elementSelected)
    }
    setTimeout(() => {
        responseContent.style.display= "inline-flex"
        responseContent.style.animation = "translate 1.5s ease"
        document.querySelector(content).appendChild(responseContent)
        indiceElement.top += responseContent.offsetHeight
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