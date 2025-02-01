import schedule from "node-schedule";
import coletarDadosMegaSena from "./Config/historicoMegaSenaService";
import coletarDadosQuina from "./Config/historicoQuinaService";
import coletarDadosLotomania from "./Config/historicoLotomaniaService";
import coletarDadosDuplaSena from "./Config/historicoDuplaSenaService";
import coletarDadosTimemania from "./Config/historicoTimemaniaService";
import coletarDadosDiaDeSorte from "./Config/historicoDiaDeSorteService";
import coletarDadosSuperSete from "./Config/historicoSuperSete";
import coletarDadosMaisMilionaria from "./Config/historicoMaisMilionaria";
import deletarRegistrosTimemania from "./Config/deleteTimemaniaRecords";
import coletarDadosLotofacilPG from "./Config/historicoLotoFacilService";
import coletarDadosMegaSenaPG from "./Config/historicoMegaSenaService";
import coletarDadosQuinaPG from "./Config/historicoQuinaService";

function agendarAtualizacaoHistorico() {

  schedule.scheduleJob("05 14 * * *", async () => {
    console.log("Executando a tarefa da Mega-Sena às 20:16...");
    try {
      await coletarDadosMegaSena();
      console.log("Atualização do histórico da Mega-Sena concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mega-Sena:", error.message);
    }
  });

  schedule.scheduleJob("05 14 * * *", async () => {
    console.log("Executando a tarefa da Quina às 20:17...");
    try {
      await coletarDadosQuina();
      console.log("Atualização do histórico da Quina concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Quina:", error.message);
    }
  });

  schedule.scheduleJob("05 14 * * *", async () => {
    console.log("Executando a tarefa da Lotomania às 20:18...");
    try {
      await coletarDadosLotomania();
      console.log("Atualização do histórico da Lotomania concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Lotomania:", error.message);
    }
  });

  schedule.scheduleJob("05 14 * * *", async () => {
    console.log("Executando a tarefa da Dupla Sena às 20:18...");
    try {
      await coletarDadosDuplaSena();
      console.log("Atualização do histórico da Dupla Sena concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Dupla Sena:", error.message);
    }
  });

  schedule.scheduleJob("54 16 * * *", async () => {
    console.log("Executando a tarefa da Timemania às 20:18...");
    try {
      await coletarDadosTimemania();
      console.log("Atualização do histórico da Timemania concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Timemania:", error.message);
    }
  });

  schedule.scheduleJob("16 17 * * *", async () => {
    console.log("Executando a tarefa do Dia de Sorte às 20:18...");
    try {
      await coletarDadosDiaDeSorte();
      console.log("Atualização do histórico do Dia de Sorte concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico do Dia de Sorte:", error.message);
    }
  });

  schedule.scheduleJob("48 17 * * *", async () => {
    console.log("Executando a tarefa do Super Sete às 20:18...");
    try {
      await coletarDadosSuperSete();
      console.log("Atualização do histórico do Super Sete concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico do Super Sete:", error.message);
    }
  });

  schedule.scheduleJob("48 17 * * *", async () => {
    console.log("Executando a tarefa da Mais Milionária às 20:18...");
    try {
      await coletarDadosMaisMilionaria();
      console.log("Atualização do histórico da Mais Milionária concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mais Milionária:", error.message);
    }
  });

  schedule.scheduleJob("15 19 * * *", async () => {
    console.log("Executando a tarefa de deletar registros da Timemania às 20:18...");
    try {
      await deletarRegistrosTimemania();
      console.log("Deletar registros da Timemania concluida com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Timemania:", error.message);
    }
  });

  schedule.scheduleJob("00 21 * * *", async () => {
    console.log("Executando a tarefa da Mega-Sena às 20:16...");
    try {
      await coletarDadosLotofacilPG();
      console.log("Atualização do histórico da Mega-Sena concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mega-Sena:", error.message);
    }
  });

  schedule.scheduleJob("00 21 * * *", async () => {
    console.log("Executando a tarefa da Mega-Sena às 20:16...");
    try {
      await coletarDadosMegaSenaPG();
      console.log("Atualização do histórico da Mega-Sena concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mega-Sena:", error.message);
    }
  });

  schedule.scheduleJob("28 22 * * *", async () => {
    console.log("Executando a tarefa da Mega-Sena às 20:16...");
    try {
      await coletarDadosQuinaPG();
      console.log("Atualização do histórico da Mega-Sena concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da Mega-Sena:", error.message);
    }
  });

}

export default agendarAtualizacaoHistorico;
