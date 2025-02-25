import schedule from "node-schedule";
import coletarDadosMegaSenaPG from "./Config/historicoMegaSenaService.js";
import coletarDadosQuinaPG from "./Config/historicoQuinaService.js";
import coletarDadosLotomaniaPG from "./Config/historicoLotomaniaService.js";
import coletarDadosDuplaSenaPG from "./Config/historicoDuplaSenaService.js";
import coletarDadosTimemaniaPG from "./Config/historicoTimemaniaService.js";
import coletarDadosDiaDeSortePG from "./Config/historicoDiaDeSorteService.js";
import coletarDadosSuperSetePG from "./Config/historicoSuperSete.js";
import coletarDadosMaisMilionariaPG from "./Config/historicoMaisMilionaria.js";
import deletarRegistrosTimemania from "./Config/deleteTimemaniaRecords.js";
import coletarDadosLotofacilPG from "./Config/historicoLotoFacilService.js";

function agendarAtualizacaoHistorico() {
  console.log('Serviço de agendamento iniciado com sucesso');
  console.log('Próximas execuções agendadas:');
  
  const jobs = [
    {time: "05 14 * * *", name: "Mega-Sena"},
    {time: "25 15 * * *", name: "Lotofácil"},
    // ... outros jobs ...
  ];

  jobs.forEach(job => {
    const nextInvocation = schedule.scheduleJob(job.time, () => {}).nextInvocation();
    console.log(`${job.name}: próxima execução em ${nextInvocation}`);
  });

  // Agendamentos
  schedule.scheduleJob("05 21 * * *", async () => {
    console.log("🤠 Executando a tarefa da Mega-Sena...");
    try {
      await coletarDadosMegaSenaPG();
      console.log("🤠 Atualização do histórico da Mega-Sena concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mega-Sena:", error.message);
    }
  });

  schedule.scheduleJob("28 22 * * *", async () => {
    console.log("Executando a tarefa da Quina...");
    try {
      await coletarDadosQuinaPG();
      console.log("Atualização do histórico da Quina concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Quina:", error.message);
    }
  });

  schedule.scheduleJob("55 19 * * *", async () => {
    console.log("Executando a tarefa da Lotomania...");
    try {
      await coletarDadosLotomaniaPG();
      console.log("Atualização do histórico da Lotomania concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Lotomania:", error.message);
    }
  });

  schedule.scheduleJob("05 02 * * *", async () => {
    console.log("🚨 Executando a tarefa da Lotofácil...");
    try {
      await coletarDadosLotofacilPG();
      console.log("🚨 Atualização do histórico da Lotofácil concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Lotofácil:", error.message);
    }
  });

  schedule.scheduleJob("16 19 * * *", async () => {
    console.log("Executando a tarefa da Dupla Sena...");
    try {
      await coletarDadosDuplaSenaPG();
      console.log("Atualização do histórico da Dupla Sena concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Dupla Sena:", error.message);
    }
  });

  schedule.scheduleJob("39 22 * * *", async () => {
    console.log("Executando a tarefa da Timemania...");
    try {
      await coletarDadosTimemaniaPG();
      console.log("Atualização do histórico da Timemania concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Timemania:", error.message);
    }
  });

  schedule.scheduleJob("26 20 * * *", async () => {
    console.log("Executando a tarefa do Dia de Sorte...");
    try {
      await coletarDadosDiaDeSortePG();
      console.log("Atualização do histórico do Dia de Sorte concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico do Dia de Sorte:", error.message);
    }
  });

  schedule.scheduleJob("05 22 * * *", async () => {
    console.log("Executando a tarefa do Super Sete...");
    try {
      await coletarDadosSuperSetePG();
      console.log("Atualização do histórico do Super Sete concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico do Super Sete:", error.message);
    }
  });

  schedule.scheduleJob("10 23 * * *", async () => {
    console.log("Executando a tarefa da Mais Milionária...");
    try {
      await coletarDadosMaisMilionariaPG();
      console.log("Atualização do histórico da Mais Milionária concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mais Milionária:", error.message);
    }
  });

  schedule.scheduleJob("15 19 * * *", async () => {
    console.log("Executando a tarefa de deletar registros da Timemania...");
    try {
      await deletarRegistrosTimemania();
      console.log("Deletar registros da Timemania concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Timemania:", error.message);
    }
  });
}

export default agendarAtualizacaoHistorico; 