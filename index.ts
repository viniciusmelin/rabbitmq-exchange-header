import { ConsumerAcademic } from "./src/consumer-academic.consumer";
import { ConsumerOrder } from "./src/consumer-order-generic.consumer";
import { ConsumerPosmed } from "./src/consumer-posmed.consumer";
import { Producer } from "./src/producer";

async function main() {
  const producer = new Producer();
  const consumerAcademic = new ConsumerAcademic();
  const consumerPosmed = new ConsumerPosmed();
  const consumerOrderGeneric = new ConsumerOrder();

  await consumerAcademic.startConsumer();
  await consumerPosmed.startConsumer();
  await consumerOrderGeneric.startConsumer();
  await producer.startProducer();
  // case academic
  await producer.sendMessage("teste", {
    type: "payment",
    status: "paid",
    origin: "cetrus",
  });

  // case posmed
  await producer.sendMessage("teste", {
    type: "order",
    status: "paid",
    origin: "cetrus",
  });
}

main();
