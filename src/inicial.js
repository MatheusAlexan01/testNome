document.getElementById('formcadastro').addEventListener("submit", async (event)=>{
event.preventDefault()

const nome = document.getElementById("pessoa").value;
const cargo = document.getElementById("cargo").value;
const mensagem = document.getElementById("enviado");

try{
const response = await fetch('/',{
method : 'POST',
headers: {
 'Content-Type': 'application/json'

},
body : JSON.stringify({
nome : nome,
cargo: cargo    
}),

})
const data = await response.json();
 mensagem.textContent = data.message;
 mensagem.style.color = "green";
 
    
}catch(error){
    console.error("Erro ao enviar:", error);
    mensagem.textContent = "Erro ao cadastrar.";
    mensagem.style.color = "red";
    
}


})