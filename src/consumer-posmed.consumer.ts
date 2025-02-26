import amqp from "amqplib";
import { QUEUE_ACADEMIC, QUEUE_POSMED } from "./constants";

export class ConsumerPosmed {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connection = null!;
    this.channel = null!;
  }

  // Função para criar a conexão e o canal
  private async createConnection() {
    try {
      this.connection = await amqp.connect(
        "amqp://root:root_password@localhost:5672"
      );
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error("Erro ao criar a conexão ou canal:", error);
      throw error;
    }
  }

  // Função para criar as filas e associá-las ao exchange com cabeçalhos

  // Função para consumir as mensagens das filas
  private async consumeMessages() {
    try {
      console.log(`Aguardando mensagens na fila posmed: ${QUEUE_POSMED}`);

      // Consumir mensagens da fila 1 (Error Queue)
      this.channel.consume(QUEUE_POSMED, (msg) => {
        if (msg) {
          console.log(
            `Fila ${QUEUE_POSMED}: Mensagem recebida: ${msg.content.toString()}`
          );
          this.channel.ack(msg); // Confirma o recebimento
        }
      });
    } catch (error) {
      console.error("Erro ao consumir mensagens:", error);
      throw error;
    }
  }

  // Função principal para gerenciar o fluxo do consumidor
  public async startConsumer() {
    try {
      await this.createConnection();
      await this.consumeMessages();
    } catch (error) {
      console.error("Erro no fluxo do consumidor:", error);
    }
  }
}
