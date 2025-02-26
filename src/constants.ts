export const EXCHANGE = "payment_events";
export const ROUTING_KEY = ""; // Não será usada, pois usaremos cabeçalhos para roteamento
export const QUEUE_ACADEMIC = "academicQueue";
export const QUEUE_POSMED = "posmedQueue";
export const QUEUE_ORDER_GENERIC = "orderGenericQueue";
export interface HeaderProperties {
  type: "order" | "payment" | "error";
  event: "created" | "updated" | "deleted";
  status: "paid" | "pending" | "canceled";
  origin: "cetrus" | "posmed" | "flix";
  "x-match": "any" | "all";
}
