const content = document.querySelector('.container-issho')
const button = document.querySelector('.button-start')

let indiceElement = {
    moi: 0,
    issho: 0,
    data: null,
    top: window.scrollY,
    clc: ["Discuter avec vous µ https://issho-partners.com/contact/"],
    temps: 50
}

async function getData() {
     await fetch('https://samuel-dd07.github.io/questionnaire-issho-partners/Cheminement-Formulaire-Issho.json')
         .then(res => res.json())
         .then(data => createConversation(data))
}

function createConversation(tab) {
    button.outerHTML = ""
    indiceElement.data = tab[0].topic.topics
    createIssho()
    createMoi()

    createResponse(`.issho.n-${0}`, "Bonjour !\n\nnous allons vous poser quelques questions pour identifier les accompagnements les plus adapté à votre situation")
    createResponse(`.issho.n-${0}`, "Qui êtes vous ?")
    indiceElement.data.map((e, i) => createResponse(`.moi.n-${0}`, e.title, i, true))
}


function createIssho() {
    const issho = document.createElement('div')
    issho.classList.add('issho', `n-${indiceElement.issho}`)
    content.appendChild(issho)
    indiceElement.issho += 1
}

function createMoi() {
    const moi = document.createElement('div')
    moi.classList.add('moi', `n-${indiceElement.moi}`)
    content.appendChild(moi)
    indiceElement.moi += 1
}

function elementSelected(e) {
    indiceElement.temps = 50
    createMoi()
    createResponse(`.moi.n-${indiceElement.moi - 1}`, e.target.textContent)
    document.querySelector(`div.moi.n-${indiceElement.moi - 2}`).outerHTML = ""

    const path = searchInObj(indiceElement.data, "title", e.target.textContent).replace("title", "topics")
    indiceElement.data = eval("indiceElement.data" + path)

    if (!!indiceElement.data && indiceElement.data[0]["title"] === 'Question') {
        createIssho()
        if (!!indiceElement.data[0]["topics"][0]["topics"]) {
            createResponse(`.issho.n-${indiceElement.issho - 1}`, indiceElement.data[0]["topics"][0]["title"])
            indiceElement.data = indiceElement.data[0]["topics"][0]["topics"]
        } else {
            indiceElement.data[0]["topics"].map((element, indice) => {
                createResponse(`.issho.n-${indiceElement.issho - 1}`, element.title)
            })
            indiceElement.data = null
        }
    } else {
        createIssho()
        createResponse(`.issho.n-${indiceElement.issho - 1}`, "Vous souhaitez en savoir plus ?")
    }

    createMoi()
    try {
        indiceElement.data.map((element, indice) =>
            createResponse(`.moi.n-${indiceElement.moi - 1}`, element.title, e.target.id + indice, true)
        )
    } catch (e) {
        indiceElement.clc.map((element, indice) =>
            createResponse(`.moi.n-${indiceElement.moi - 1}`, element, "", true)
        )
    }
}

function createResponse(content, reponse, id, interaction) {
    let responseContent = null

    if (typeof reponse == "string" && reponse.indexOf('https') > -1) {
        responseContent = document.createElement('a')
        responseContent.textContent = reponse.split('µ')[0]
        responseContent.href = reponse.split('µ')[1]
        interaction = false
    } else if (typeof reponse == "string" && reponse.indexOf('£') > -1){
        responseContent = document.createElement('div')
        responseContent.textContent = reponse.split('£')[1]
        responseContent.classList.add("list")
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
        responseContent.style.display = "inline-flex"
        responseContent.style.animation = "translate 1.5s ease"
        try {
            document.querySelector(content).appendChild(responseContent)
        } catch(e){}
        console.log(window.innerHeight*3/4, responseContent.offsetTop)
        if (window.innerHeight*2/4 < responseContent.offsetTop) {
           indiceElement.top = window.scrollY + responseContent.offsetHeight
           window.scroll({
                top: indiceElement.top,
                behavior: 'smooth'
            })
        }
         
    }, indiceElement.temps)
    indiceElement.temps = indiceElement.temps + 500
}

function searchInObj(obj, name, val, currentPath) {
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