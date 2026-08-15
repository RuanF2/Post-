const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/userModel');
const pool = require('../config/database');


async function register(req, res) {
    try{
        const {email, nome, senha} = req.body;
    const tamanho = senha;

    console.log(tamanho.length);

    if(tamanho.length < 8){
        res.status(400).json({mensagem:'A senha precisa ter no mínimo 8 caracteres'});
        return
    }

    const usuarioExistente = await userModel.buscarPorEmail(email);

    if(usuarioExistente){
        res.status(400).json({mensagem: 'O email utilizado já está cadastrado'});
        return;
    }
    if(!email.includes('@')){
        res.status(400).json({mensagem: 'Email inválido'});
        return;
    }
    console.log('E-mail recebido: ', email);
    console.log('Senha recebida: ', senha);

     const saltRounds = 10;

 const hash = await bcrypt.hash(senha, saltRounds);
 console.log(hash);

await userModel.criarUsuario(nome, email, hash);

 res.status(201).json({mensagem: 'Usuário recebido com sucesso'});

  }catch(erro){
    res.status(500).json({mensagem: 'Erro ao registrar usuário'})
  }   
}
async function login(req,res) {
    try{
        const {email,senha} = req.body;

    const usuarioExistente = await userModel.buscarPorEmail(email);

    if(!usuarioExistente){
        res.status(401).json({mensagem: 'Credenciais inválidas'});
        return;
    }
    const verificacao = await bcrypt.compare(senha, usuarioExistente.senha_hash);
    if(verificacao === false){
        res.status(401).json({mensagem: 'Senha inválida'});
        return;
    }
    const token = jwt.sign({
        id: usuarioExistente.id, email: usuarioExistente.email},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

        res.status(200).json({mensagem: 'Login realizado com sucesso', token});
    }catch(erro){
        res.status(500).json({mensagem: 'Erro ao logar'});
        return
    }
    
}