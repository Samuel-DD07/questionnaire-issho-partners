const contentQuestionnaire = document.querySelector('.container-issho')
const button = document.querySelector('.button-start')

// Tous les paramètres nécessaires pour le fonctionnement du script
let indiceElement = {
    moi: 0,
    issho: 0,
    newData: null,
    oldData: [],
    top: window.scrollY,
    clc: ["Discuter avec vous µ https://issho-partners.com/contact/"],
    temps: 50
}

// Pour récupérer les données du cheminement en format JSON
async function getData() {
    await fetch('https://samuel-dd07.github.io/questionnaire-issho-partners/Cheminement-Formulaire-Issho.json')
        .then(res => res.json())
        .then(newData => createConversation(newData))
        .catch(e => {})
}

// Pour démarer la conversion et le script via les données JSON
function createConversation(tab) {
    button.outerHTML = ""
    indiceElement.newData = tab[0].topic.topics
    createIssho()
    createMoi()
    createResponse(`.issho.n-${0}`, "Bonjour !\n\nnous allons vous poser quelques questions pour identifier les accompagnements les plus adapté à votre situation")
    createResponse(`.issho.n-${0}`, "Qui êtes vous ?")
    indiceElement.newData.map((e, i) => createResponse(`.moi.n-${0}`, e.title, i, true))
}

// Créer un block pour contenir les propos de issho
function createIssho() {
    const issho = document.createElement('div')
    issho.classList.add('issho', `n-${indiceElement.issho}`)
    contentQuestionnaire.appendChild(issho)
    indiceElement.issho += 1
}

// Créer un block pour contenir les propos de l'utilisateur
function createMoi() {
    const moi = document.createElement('div')
    moi.classList.add('moi', `n-${indiceElement.moi}`)
    contentQuestionnaire.appendChild(moi)
    indiceElement.moi += 1
}

// Pour gérer le comportement lorsqu'un block est selectionné par l'utilisateur.
function elementSelected(e) {
    indiceElement.temps = 50
    createMoi()
    createResponse(`.moi.n-${indiceElement.moi - 1}`, e.target.textContent)
    document.querySelector(`div.moi.n-${indiceElement.moi - 2}`).outerHTML = ""

    if (e.target.textContent == "Revenir à la question précedente") {
        const allMoi = document.querySelectorAll('div.moi')
        const allIssho = document.querySelectorAll('div.issho')
        allMoi[allMoi.length - 1].outerHTML = ""
        allIssho[allIssho.length - 1].outerHTML = ""
        allMoi[allMoi.length - 2].outerHTML = ""

        indiceElement.newData = indiceElement.oldData[indiceElement.oldData.length - 1]
        indiceElement.oldData.pop()
        indiceElement.moi -= 3
        indiceElement.issho -= 1
        createMoi()
        indiceElement.newData.map((element, indice) =>
            createResponse(`.moi.n-${indiceElement.moi - 1}`, element.title, e.target.id + indice, true)
        )
        if (indiceElement.oldData.length > 0) {
            createResponse(`.moi.n-${indiceElement.moi - 1}`, "Revenir à la question précedente", "précédent", true)
        }
    } else {
        const path = searchInObj(indiceElement.newData, "title", e.target.textContent).replace("title", "topics")
        indiceElement.oldData.push(indiceElement.newData)
        indiceElement.newData = eval("indiceElement.newData" + path)

        if (!!indiceElement.newData && indiceElement.newData[0]["title"] === 'Question') {
            createIssho()
            if (!!indiceElement.newData[0]["topics"][0]["topics"]) {
                createResponse(`.issho.n-${indiceElement.issho - 1}`, indiceElement.newData[0]["topics"][0]["title"])
                indiceElement.newData = indiceElement.newData[0]["topics"][0]["topics"]
            } else {
                indiceElement.newData[0]["topics"].map((element, indice) => {
                    createResponse(`.issho.n-${indiceElement.issho - 1}`, element.title)
                })
                indiceElement.newData = null
            }
        } else {
            createIssho()
            createResponse(`.issho.n-${indiceElement.issho - 1}`, "Vous souhaitez en savoir plus ?")
        }

        createMoi()
        try {
            indiceElement.newData.map((element, indice) =>
                createResponse(`.moi.n-${indiceElement.moi - 1}`, element.title, e.target.id + indice, true)
            )
            if (indiceElement.oldData.length > 0) {
                createResponse(`.moi.n-${indiceElement.moi - 1}`, "Revenir à la question précedente", "précédent", true)
            }
        } catch (e) {
            indiceElement.clc.map((element) =>
                createResponse(`.moi.n-${indiceElement.moi - 1}`, element, "", true)
            )
            createResponse(`.moi.n-${indiceElement.moi - 1}`, "Revenir à la question précedente", "précédent", true)
        }
    }
}

// Pour créer une réponse selon son texte, sa destination et son interaction
function createResponse(content, reponse, id, interaction) {
    let responseContent = null

    if (typeof reponse == "string" && reponse.indexOf('https') > -1) {
        responseContent = document.createElement('a')
        responseContent.textContent = reponse.split('µ')[0]
        responseContent.href = reponse.split('µ')[1]
        interaction = false
    } else if (typeof reponse == "string" && reponse.indexOf('£') > -1) {
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
        } catch (e) { }
        if (contentQuestionnaire.getBoundingClientRect().bottom >= window.innerHeight) {
            indiceElement.top = window.scrollY + getAbsoluteHeight(responseContent)
            window.scroll({
                top: indiceElement.top,
                behavior: 'smooth'
            })
        }
        if (contentQuestionnaire.getBoundingClientRect().bottom * 2 <= window.innerHeight) {
            indiceElement.top = window.scrollY + contentQuestionnaire.getBoundingClientRect().bottom - window.innerHeight + 20
            window.scroll({
                top: indiceElement.top,
                behavior: 'smooth'
            })
        }

    }, indiceElement.temps)
    indiceElement.temps = indiceElement.temps + 500
}

// Pour parcourir un objet ou un document json à l'aide d'une clé et une valeur données et obtenir son chemin.
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

// Pour avoir la hauteur d'un élément avec son padding, margin etc
function getAbsoluteHeight(el) {
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
        parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
}