# 🚀 RabbitMQ - Headers Exchange com TypeScript

Este projeto demonstra como usar **Headers Exchange** no RabbitMQ utilizando **TypeScript** e a biblioteca `amqplib`. O `Headers Exchange` permite o roteamento de mensagens com base nos **headers** (metadados) anexados à mensagem.

## 📌 Conceitos

### 🔹 O que é um Headers Exchange?

Diferente dos exchanges `direct` e `topic`, o **headers exchange** não utiliza `routingKey`, mas sim **cabeçalhos personalizados** para decidir para quais filas a mensagem será enviada.

### 🔹 Filtros e Correspondência (`x-match`)

Ao vincular uma fila ao exchange, definimos a regra de correspondência:

- `x-match: all` → A mensagem **precisa ter todos** os cabeçalhos definidos para ser entregue à fila.
- `x-match: any` → A mensagem será roteada se **qualquer** cabeçalho corresponder.

Exemplo:

```json
{
  "type": "payment",
  "status": "paid",
  "origin": "healthplus",
  "x-match": "all"
}
```

A fila só receberá mensagens que contenham **type = 'payment'**, **status = 'paid'** e **origin = 'healthplus'**.

---

## 🛠️ Configuração do Projeto

### 1️⃣ **Instalar dependências**

```sh
npm install
```

### 2️⃣ **Executar o RabbitMQ** (via Docker)

```sh
docker compose -f docker-compose up -d
```

- Acesse a interface do RabbitMQ: [http://localhost:15672](http://localhost:15672)
- Usuário: `root` | Senha: `root_password`

### 3️⃣ **Iniciar**

```sh
npm run dev
```

---

## 📜 Fluxo do Código

### **1️⃣ Consumer**

- Cria um `Headers Exchange` chamado `payments_events`.
- Declara filas (`queue_healthplus`, `queue_medix`, `queue_order_generic`).
- Associa as filas ao exchange com filtros baseados em **headers**.
- Escuta mensagens e processa conforme a fila.

### **2️⃣ Producer**

- Conecta ao exchange `payments_events`.
- Publica mensagens com diferentes cabeçalhos para testar o roteamento.

---

## 🚀 Testando o Roteamento

1️⃣ Inicie o **Consumer**. 2️⃣ Envie mensagens com o **Producer**. 3️⃣ Observe a entrega nas filas conforme os cabeçalhos das mensagens.

📌 **Exemplo de mensagens publicadas:**

```ts
await producer.sendMessage("Pagamento confirmado!", {
  type: "payment",
  status: "paid",
  origin: "medix",
});
await producer.sendMessage("Novo pedido recebido!", {
  type: "order",
  status: "paid",
});
```

🎯 **Resultado esperado:**

- A mensagem "Pagamento confirmado!" será entregue à `queue_academic`.
- A mensagem "Novo pedido recebido!" será entregue à `queue_posmed` e `queue_order_generic`.

---

## 📌 Conclusão

O **Headers Exchange** no RabbitMQ permite um roteamento flexível baseado em metadados, dispensando `routingKey`. Isso é útil para cenários onde as **propriedades da mensagem** determinam seu destino.

✅ Agora seu sistema está pronto para utilizar **Headers Exchange** com eficiência! 🚀
