const banco = require(`../bancoDeDados`);
const { format } = require(`date-fns`);
let conta;
let numero = 1;

const contasBancarias = (req, res) => {
    try {
        return res.status(200).json(banco.contas);
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    try {
        for (let i = 0; i < banco.contas.length; i++) {
            if (banco.contas[i].usuario.email === email || banco.contas[i].usuario.cpf === cpf) {
                return res.status(403).json({ mensagem: `Já existe uma conta com o cpf ou e-mail informado!` });
            }
        }
        banco.contas.push({
            numero: `${numero++}`,
            saldo: 0,
            usuario: { nome, cpf, data_nascimento, telefone, email, senha }
        })
        return res.status(200).json({ mensagem: `Conta criada.` })
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const atualizarConta = (req, res) => {
    const { params: { numeroConta }, body: { nome, cpf, data_nascimento, telefone, email, senha } } = req;
    try {
        conta = banco.contas.find(conta => {
            return conta.numero === numeroConta;
        })
        for (let i = 0; i < banco.contas.length; i++) {
            if ((banco.contas[i].usuario.email === email || banco.contas[i].usuario.cpf === cpf) && banco.contas[i].numero !== numeroConta) {
                return res.status(403).json({ mensagem: `Conta não encontrada ou cpf/email informados já foram cadastrados.` });
            }
        }
        conta.usuario.nome = nome;
        conta.usuario.cpf = cpf;
        conta.usuario.data_nascimento = data_nascimento;
        conta.usuario.telefone = telefone;
        conta.usuario.email = email;
        conta.usuario.senha = senha;
        return res.status(200).json({ mensagem: `Conta atualizada.` });
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;
    try {
        conta = banco.contas.find((numero) => {
            return numero.numero === numeroConta;
        })
        if (conta.saldo > 0) {
            return res.status(404).json({ mensagem: `Conta com saldo acima de zero não pode ser excluida.` });
        }
        banco.contas = banco.contas.filter((conta) => {
            return conta.numero !== numeroConta;
        })
        return res.status(200).json({ mensagem: `Conta excluida com sucesso.` });
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const deposito = (req, res) => {
    const { numero_conta, valor } = req.body;
    try {
        conta = banco.contas.find((conta) => {
            return conta.numero === numero_conta;
        })
        conta.saldo += valor;
        banco.depositos.push({
            data: format(new Date(), `yyyy-MM-dd kk:mm:ss`),
            numero_conta,
            valor
        })
        return res.status(200).json({ mensagem: `Deposito efetuado com sucesso.` });
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;
    try {
        conta = banco.contas.find((conta) => {
            return conta.numero === numero_conta;
        })
        if (valor > conta.saldo) {
            return res.status(404).json({ mensagem: `Saldo insuficiente` });
        }
        conta.saldo -= valor;
        banco.saques.push({
            data: format(new Date(), `yyyy-MM-dd kk:mm:ss`),
            numero_conta,
            valor
        })
        return res.status(200).json({ mensagem: `Saque aprovado` });
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const transferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;
    try {
        let contaOrigem = banco.contas.find(conta => {
            return conta.numero === numero_conta_origem;
        })
        let contaDestino = banco.contas.find(conta => {
            return conta.numero === numero_conta_destino;
        })
        if (valor > contaOrigem.saldo) {
            return res.status(404).json({ mensagem: `Saldo insuficiente` });
        }
        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;
        banco.transferencias.push({
            data: format(new Date(), `yyyy-MM-dd kk:mm:ss`),
            numero_conta_origem,
            numero_conta_destino,
            valor
        })
        return res.status(200).json(banco.transferencias);
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const saldoConta = (req, res) => {
    const { numero_conta } = req.query;
    try {
        conta = banco.contas.find(conta => {
            return conta.numero === numero_conta;
        })
        return res.status(200).json(conta.saldo);
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
};

const extratoConta = (req, res) => {
    const { numero_conta } = req.query;
    try {
        const depositos = banco.depositos.filter(deposito => {
            return deposito.numero_conta === numero_conta;
        })
        const saques = banco.saques.filter(saque => {
            return saque.numero_conta === numero_conta;
        })
        const transferenciasEnviadas = banco.transferencias.filter(transferencia => {
            return transferencia.numero_conta_origem === numero_conta;
        })
        let contaExtrato = {
            depositos,
            saques,
            transferenciasEnviadas
        }
        return res.status(200).json(contaExtrato);
    }
    catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
}

module.exports = { contasBancarias, criarConta, atualizarConta, deletarConta, deposito, sacar, transferencia, saldoConta, extratoConta };