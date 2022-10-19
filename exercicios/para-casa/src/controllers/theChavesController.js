const db = require("../models/db")

const obterPersonagemPorId = async(request, response) =>{
    const { id } = request.params
    const personagens = await db("the-chaves")
  
    const personagemEncontrado = personagens.find(personagem => personagem.id == id)
  
    if (!personagemEncontrado) return response.status(404).send({
      message: `Nenhum personagem encontrado para esse id ${id}`
    })
  
    response.status(200).send(personagemEncontrado)
  }
  

const obterPersonagens = async (request, response) => {

    const personagens = await db("the-chaves")
    if (personagens.length === 0) return response.status(200).send([])
 
    const parametros = request.query
    console.log(parametros) 
     // caso o usario não tenha passado parametros, retormamos tudo.
    if (Object.keys(parametros).length == 0) return response.status(200).send(personagens)
    // a gente cria a lista que será filtrada, que pelo laço receberá os persoangens filtrados
    const filtrado = []
    // ele vai passar por cada personagem presente no nosso banco
    for (const personagem of personagens) {
      const chaves = Object.keys(personagem)
      // ele vai percorrer cada chave do personagem atual do laco
      for (const chave of chaves) {
        const personagemDado = personagem[chave].toString().toLowerCase()
        // aqui construimos o dado a partir da chave e transformamos em letras minusculas
        const buscaDado = parametros[chave] && parametros[chave].toLowerCase()
        console.log(personagemDado, buscaDado)
        // validar se o dado da chave do personagem atual corresponde ao parametro que foi recebido
         if (personagemDado.includes(buscaDado)) {
           filtrado.push(personagem)
         }
      }
    }
 
    if (filtrado.length === 0) {
      return response.status(404).send({
       message: "Nenhum resultado para essa busca"
      })
    }
 
    response.status(200).send(filtrado)
 }
 


const cadastrarPersonagem = async(request, response) => {
    const personagens = await db("the-chaves")
    // nome e idade são obrigários
 
    // pega os dados que precisamos 
    const {
     nome,ator, idade, genero,moradia,bordoes, bio
    } = request.body
 
    // regras de negocio
    if (!nome || nome.trim() === "") {
      return response.status(400).send({ message: `O nome é obrigatorio` })
    }
 
    if (isNaN(idade) || idade <= 0) {
     return response.status(400).send({ message: `A idade é obrigaria` })
    }
 
    const nomeExiste = personagens.some(personagem => personagem.nome === nome)
 
    if (nomeExiste === true) {
     return response.status(409).send({ message: `O nome ${nome} já existe`})
    }
 
    // a gente construi o personagem
    const novoPersonagem = {
     id: personagens.length,
     nome,ator, idade, genero,moradia,bordoes, bio 
    }
 
    personagens.push(novoPersonagem)
 
    response.status(201).send(novoPersonagem)
 } 



 

 module.exports = {
    
    obterPersonagemPorId,
    obterPersonagens,
    cadastrarPersonagem

    
  }