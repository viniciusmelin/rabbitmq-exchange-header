export const EXCHANGE = "payment_events";
export const ROUTING_KEY = ""; // Não será usada, pois usaremos cabeçalhos para roteamento
export const QUEUE_HEALTHPLUS = "healthplusQueue";
export const QUEUE_MEDIX = "medixQueue";
export const QUEUE_ORDER_GENERIC = "orderGenericQueue";
export interface HeaderProperties {
  type: "order" | "payment" | "error";
  event: "created" | "updated" | "deleted";
  status: "paid" | "pending" | "canceled";
  origin: "medix" | "healthplus" | "carehub";
  "x-match": "any" | "all";
}
