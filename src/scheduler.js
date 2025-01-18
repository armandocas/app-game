import schedule from "node-schedule";
import coletarDadosLotoFacil from "./Config/historicoLotoFacilService";
import coletarDadosMegaSena from "./Config/historicoMegaSenaService";
import coletarDadosQuina from "./Config/historicoQuinaService";
import coletarDadosLotomania from "./Config/historicoLotomaniaService";
import coletarDadosDuplaSena from "./Config/historicoDuplaSenaService";

function agendarAtualizacaoHistorico() {
  schedule.scheduleJob("05 14 * * *", async () => {
    console.log("Executando a tarefa da LotoFácil às 20:15...");
    try {
      await coletarDadosLotoFacil();
      console.log("Atualização do histórico da LotoFácil concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico da LotoFácil:", error.message);
    }
  });

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
}

export default agendarAtualizacaoHistorico;
