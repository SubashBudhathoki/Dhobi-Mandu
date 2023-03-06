import { Order, OrderItem, ORDER_STATE, Service } from "@prisma/client";
import path from "path";
import { vendorTemplate, userTemplate } from "../mail/template";
type _OrderItem = OrderItem & {
  Service: Service;
};
type _Order = Order & {
  OrderItems: _OrderItem[];
};

function _getOrderTableRow(items: _OrderItem[]) {
  return items
    .map((orderItem) => {
      return `
            <tr>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                ${orderItem.Service.name}
            </td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                Nrs. ${orderItem.Service.price}
            </td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                x${orderItem.quantity}
            </td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                Nrs. ${orderItem.Service.price}
            </td>
            </tr>
            `;
    })
    .join("");
}

export default {
  parseVendorHtml: function (order: _Order, userEmail: string) {
    let template = vendorTemplate;

    const variables = [
      { key: "{email}", value: userEmail },
      { key: "{total}", value: `Nrs. ${order.total}` },
      { key: "{orderItems}", value: _getOrderTableRow(order.OrderItems) },
    ];
    variables.forEach((txtVariable) => {
      template = template.replace(txtVariable.key, txtVariable.value);
    });
    return template;
  },
  parseUserHtml: function (order: _Order, state: ORDER_STATE) {
    let stateName = "";
    switch (state) {
      case ORDER_STATE.RECEIVED:
        stateName = "Received";
        break;
      case ORDER_STATE.WASHING:
        stateName = "Sent for Washing";
        break;
      case ORDER_STATE.COMPLETED:
        stateName = "Completed";
        break;
      case ORDER_STATE.CANCELLED:
        stateName = "Cancelled";
        break;
      case ORDER_STATE.SHIPPING:
        stateName = "Shipped";
        break;
    }
    let template = userTemplate;

    const variables = [
      { key: "{state}", value: stateName },
      { key: "{total}", value: `Nrs. ${order.total}` },
      { key: "{orderItems}", value: _getOrderTableRow(order.OrderItems) },
    ];
    variables.forEach((txtVariable) => {
      template = template.replace(txtVariable.key, txtVariable.value);
    });
    return template;
  },
};
