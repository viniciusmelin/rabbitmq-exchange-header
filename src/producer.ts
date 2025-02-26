// src/producer.ts
import amqp from "amqplib";
import {
  EXCHANGE,
  HeaderProperties,
  QUEUE_ACADEMIC,
  QUEUE_ORDER_GENERIC,
  QUEUE_POSMED,
  ROUTING_KEY,
} from "./constants";

const BINDING_HEADERS_ACADEMIC: Partial<HeaderProperties> = {
  type: "payment", // Tipo de evento
  status: "paid", // Status do baseado no type
  origin: "cetrus", // Origem do pedido
  "x-match": "all",
};

const BINDING_HEADERS_POSMED: Partial<HeaderProperties> = {
  type: "order", // Tipo de evento
  status: "paid", // Status do baseado no type
  origin: "cetrus", // Origem do pedido
  "x-match": "all", // Define que todos os cabeçalhos devem ser iguais
};

const BINDING_HEADERS_GENERIC_ORDER: Partial<HeaderProperties> = {
  type: "order", // Tipo de evento
  status: "paid", // Status do baseado no type
  "x-match": "any", // Define que pelo menos um cabeçalho deve ser igual
};

export class Producer {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connection = null!;
    this.channel = null!;
  }

  // Função para criar o exchange
  private async createExchange() {
    await this.channel.assertExchange(EXCHANGE, "headers", { durable: false });
    console.log(`Exchange '${EXCHANGE}' criado.`);
  }

  private async createQueues(): Promise<void> {
    // Criar filas
    await this.channel.assertQueue(QUEUE_ACADEMIC, { durable: false });
    await this.channel.assertQueue(QUEUE_POSMED, { durable: false });
    await this.channel.assertQueue(QUEUE_ORDER_GENERIC, { durable: false });

    // Vincular as filas com filtros de cabeçalhos
    await this.channel.bindQueue(
      QUEUE_ACADEMIC,
      EXCHANGE,
      "",
      BINDING_HEADERS_ACADEMIC
    );
    await this.channel.bindQueue(
      QUEUE_POSMED,
      EXCHANGE,
      "",
      BINDING_HEADERS_POSMED
    );
    await this.channel.bindQueue(
      QUEUE_ORDER_GENERIC,
      EXCHANGE,
      "",
      BINDING_HEADERS_GENERIC_ORDER
    );
  }

  // Função para enviar a mensagem
  async sendMessage(message: string, headers: Partial<HeaderProperties>) {
    // Publicar a mensagem com os cabeçalhos
    this.channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(message), {
      headers,
    });
    console.log(`Mensagem enviada com cabeçalhos: ${JSON.stringify(headers)}`);
  }

  // Função para iniciar o produtor e enviar uma mensagem
  public async startProducer() {
    try {
      this.connection = await amqp.connect(
        "amqp://root:root_password@localhost:5672"
      );
      this.channel = await this.connection.createChannel();

      // Criar o exchange
      await this.createExchange();
      await this.createQueues();
      // Fechar o canal e a conexão
      //   await this.channel.close();
      //   await this.connection.close();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }
}
