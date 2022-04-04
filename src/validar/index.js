const banco = require(`../bancoDeDados`);
let conta;

const senhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;
    try {
        if (!senha_banco || senha_banco !== `Cubos123Bank`) {
            return res.status(401).json({ mensagem: `Senha invalida` });
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
};

const senhaConta = (req, res, next) => {
    const { numero_conta, senha } = req.query;
    try {
        const conta = banco.contas.find(conta => {
            return conta.numero === numero_conta;
        });
        if (!numero_conta || !senha || !conta || senha !== conta.usuario.senha) {
            return res.status(401).json({ mensagem: `O número da conta ou senha invalido` });
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
};

const contaBancariaParamy = (req, res, next) => {
    const { numeroConta } = req.params;
    try {
        conta = banco.contas.find(conta => {
            return conta.numero === numeroConta;
        })
        if (!Number(numeroConta) || !conta) {
            return res.status(404).json({ mensagem: `Conta não encontrada!` })
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
};

const cadastrarOuAtualizarUsuario = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    try {
        if (!(nome.trim()) ||
            !(cpf.trim()) || !Number(cpf) || cpf.length != 11 ||
            !(data_nascimento.trim()) || Number(data_nascimento) ||
            !(telefone.trim()) || !Number(telefone) || telefone.length != 9 ||
            !(email.trim() || !(senha.trim()))) {
            return res.status(400).json({ mensagem: `Todas os campos são obrigatórais` });
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
};

const contaBancariaBody = (req, res, next) => {
    const { numero_conta } = req.body;
    try {
        conta = banco.contas.find(conta => {
            return conta.numero === numero_conta;
        })
        if (!(numero_conta.trim()) || !conta) {
            return res.status(404).json({ mensagem: `Informações invalidas.` })
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
};

const valor = (req, res, next) => {
    const { valor } = req.body;
    try {
        if (!Number(valor) || valor <= 0) {
            return res.status(400).json({ mensagem: `Informações invalidas.` });
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
}

const infoSaque = (req, res, next) => {
    const { numero_conta, senha } = req.body;
    try {
        conta = banco.contas.find(conta => {
            return conta.numero === numero_conta;
        })
        if (senha !== conta.usuario.senha) {
            return res.status(401).json({ mensagem: `Informações invalidas.` })
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
}

const infoTransferencia = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, senha } = req.body;
    try {
        let contaOrigem = banco.contas.find(conta => {
            return conta.numero === numero_conta_origem;
        })
        let contaDestino = banco.contas.find(conta => {
            return conta.numero === numero_conta_destino;
        })
        if (!(numero_conta_origem.trim()) || !contaOrigem ||
            !(numero_conta_destino.trim()) || !contaDestino ||
            contaOrigem === contaDestino ||
            !(senha.trim()) || senha !== contaOrigem.usuario.senha) {
            return res.status(401).json({ mensagem: `Informações invalidas.` })
        }
    } catch (error) {
        return res.status(500).json(`Erro: ${error.message}`);
    }
    next();
}

module.exports = {
    senhaBanco, senhaConta, contaBancariaParamy, cadastrarOuAtualizarUsuario, contaBancariaBody, valor, infoSaque, infoTransferencia
};