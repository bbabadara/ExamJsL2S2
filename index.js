// alert ("ok");
const WEBURL="http://localhost:8100/"
let articles=[]
let clients = [];
 const tBody1=document.querySelector("#tBody1")
 const tBody2=document.querySelector("#tBody2")
 const searchArticle=document.querySelector("#searchArticle")
 const inputTel = document.getElementById('inputTel');
 const btnTel = document.getElementById('btnTel');
 const infoClient = document.getElementById('infoClient');
// Recuperation de donnees  
fetchDatas("clients").then(data => {
  clients = data;
})
fetchDatas("articles").then(data => {
    // console.log(data);
    
  articles = data;
})

document.addEventListener("DOMContentLoaded", async (event) => {
     await fetchDatas("articles");
    
// console.log(articles);
// console.log(clients);

tBody1.innerHTML=generateTr1(articles);


searchArticle.addEventListener("input",function(){
    if (searchArticle.value.trim()!="") {
        let recherche=this.value.toLowerCase();
    let resultat=articles.filter(a=>a.libelle.toLowerCase().includes(recherche));
    tBody1.innerHTML=generateTr1(resultat);
    }else{
        tBody1.innerHTML=generateTr1(articles);
    }
    
})

btnTel.addEventListener('click', function() {
    const telephone = inputTel.value;
    if (telephone.trim()!="") {
        const client =findClientBytelephone(telephone)
        if (client) {
            infoClient.innerHTML=generateInfoClient(client)
        }else{
            infoClient.innerHTML="Aucun client trouvé avec ce numéro de téléphone!";
        }
    } else {
        alert("Veuillez saisir un numéro de téléphone!");
    }

});









})



async function fetchDatas(element){
    let response= await fetch(WEBURL+element);
    const datas=await response.json(WEBURL+element);
    return datas;
}  

function generateTr1(data){
    return data.map(d=> `<tr>
                        <td class="p-2 text-center">
                            <input type="checkbox" data-id="${d.id}" class="coche" onclick="selectArticle(this)" class="form-checkbox h-4 w-4 text-blue-600">
                        </td>
                        <td class="p-2">${d.reference}</td>
                        <td class="p-2">${d.libelle}</td>
                        <td class="p-2">${d.prixunitaire}</td>
                        <td class="p-2">${d.qteStock}</td>
                    </tr>`).join("")
  }
function generateTr2(d){
    return ` <tr>
                            <td class="p-2">${d.reference}</td>
                            <td class="p-2">${d.libelle}</td>
                            <td class="p-2">${d.prixunitaire}</td>
                            <td class="p-2">
                                <div class="flex items-center justify-center">
                                    <button class="px-2 py-1 bg-gray-200 rounded-l" onclick="moinsQte(${d.id})">-</button>
                                    <input type="text" value="1" id="qte${d.id}"  class="w-12 text-center border-t border-b">
                                    <button class="px-2 py-1 bg-gray-200 rounded-r" onclick="plusQte(${d.id})">+</button>
                                </div>
                            </td>
                            <td class="p-2">20.000</td>
                            <td><button class="text-red-500">
                                    <i class="fas fa-trash"></i> Supprimer
                                </button>
                            </td>
                        </tr>`
  }

  function plusQte(id){
    let qteInput=document.querySelector(`#qte${id}`)
    let qte=parseInt(qteInput.value)
    qte++;
    qteInput.value=qte;
  }
  function moinsQte(id){
    let qteInput=document.querySelector(`#qte${id}`)
    let qte=parseInt(qteInput.value)
    if (qte>1) {
        qte--;
        qteInput.value=qte;
    }
  }

  function selectArticle(element) {
    console.log(element.dataset.id);
    tBody2.innerHTML+=generateTr2(findArticleById(element.dataset.id))
    
  }

  function findArticleById(id){
    return articles.find(a=>a.id==id);
  }

  function findArticlesByInputSearch(input){
    return articles.filter(a=>a.libelle.toLowerCase().includes(input.toLowerCase()))
  }

  function findClientBytelephone(telephone) {
    return clients.find(c=>c.telephone==telephone)
  }

  function generateInfoClient(client){
    const montantTotal = client.dette.reduce((acc, item) => acc + item.montant, 0);
    const montantVerse = client.dette.reduce((acc, item) => acc + item.verse, 0);
    const montantRestant = montantTotal - montantVerse;
return   `
    <div class="flex items-center justify-around rounded bg-white shadow-xl p-3">
        <img src="${client.photo}" class="rounded-full w-24 h-24" alt="Photo de ${client.prenom} ${client.nom}">
        <div class="leading-loose space-y-2">
            <h3 class="text-2xl font-semibold">Prénom : ${client.prenom}</h3>
            <h3 class="text-2xl font-semibold">Nom : ${client.nom}</h3>
            <h3 class="text-2xl font-semibold">Tel : ${client.telephone}</h3>
        </div>
    </div>
    <div class="rounded bg-white shadow-xl p-3">
        <h3 class="text-3xl font-bold">Montant Total : ${montantTotal} Fcfa</h3>
        <h3 class="text-3xl font-bold mt-5 mb-5">Montant Versé : ${montantVerse} Fcfa</h3>
        <h3 class="text-3xl font-bold">Montant Restant : ${montantRestant} Fcfa</h3>
    </div>
`
  }
