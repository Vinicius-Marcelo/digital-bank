const express = require(`express`);
const validar = require(`./validar`);
const controles = require(`./controle`);
const rotas = express();

rotas.get(`/contas`, validar.senhaBanco, controles.contasBancarias);
rotas.post(`/contas/`, validar.cadastrarOuAtualizarUsuario, controles.criarConta);
rotas.put(`/contas/:numeroConta/usuario`, validar.contaBancariaParamy, validar.cadastrarOuAtualizarUsuario, controles.atualizarConta);
rotas.delete(`/contas/:numeroConta`, validar.contaBancariaParamy, controles.deletarConta);
rotas.post(`/transacoes/depositar`, validar.contaBancariaBody, validar.valor, controles.deposito);
rotas.post(`/transacoes/sacar`, validar.valor, validar.infoSaque, controles.sacar);
rotas.post(`/transacoes/transferir`, validar.valor, validar.infoTransferencia, controles.transferencia);
rotas.get(`/contas/saldo`, validar.senhaConta, controles.saldoConta);
rotas.get(`/contas/extrato`, validar.senhaConta, controles.extratoConta);

module.exports = rotas;