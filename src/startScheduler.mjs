import dotenv from 'dotenv';
import agendarAtualizacaoHistorico from './scheduler.mjs';

dotenv.config();
console.log('Iniciando o serviço de agendamento...');
agendarAtualizacaoHistorico(); 