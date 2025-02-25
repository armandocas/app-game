require('dotenv').config();
const agendarAtualizacaoHistorico = require('./scheduler');

console.log('Iniciando o serviço de agendamento...');
agendarAtualizacaoHistorico(); 