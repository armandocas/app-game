import schedule from "node-schedule";
import coletarDadosLotoFacil from "./Config/historicoLotoFacilService";

function agendarAtualizacaoHistorico() {
  // Agenda a execução para todos os dias às 03:00 AM
  schedule.scheduleJob("10 20 * * *", async () => {
    console.log("Executando a tarefa às 21:05...");
    try {
      await coletarDadosLotoFacil();
      console.log("Atualização do histórico concluída com sucesso!");
    } catch (error) {
      console.error("Erro durante a atualização do histórico:", error.message);
    }
  });
}

export default agendarAtualizacaoHistorico;
