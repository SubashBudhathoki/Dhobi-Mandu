export const vendorTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>JS Bin</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #444444;
      background-color: #f7f7f7;
      padding: 20px;
    "
  >
    <h1
      style="
        font-size: 24px;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: 20px;
      "
    >
      New Order
    </h1>
    <p style="margin-bottom: 20px">
      You have a new order from <strong><em>{email}</em></strong
      >.
    </p>
    <table
      style="
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 20px;
        background-color: #ffffff;
      "
    >
      <thead>
        <tr>
          <th
            style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
              background-color: #eeeeee;
            "
          >
            Service Name
          </th>
          <th
            style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
              background-color: #eeeeee;
            "
          >
            Service Price
          </th>
          <th
            style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
              background-color: #eeeeee;
            "
          >
            Quantity
          </th>
          <th
            style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
              background-color: #eeeeee;
            "
          >
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {orderItems}
      </tbody>
      <tfoot>
        <tr>
          <td
            style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
              font-weight: bold;
            "
            colspan="2"
          >
            Total
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
              font-weight: bold;
              border-top: 2px solid #444444;
              padding-top: 8px;
            "
          >
            {total}
          </td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>
`;

export const userTemplate = `
   <!DOCTYPE html>
 <html>
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width" />
     <title>JS Bin</title>
   </head>
   <body
     style="
       font-family: Arial, sans-serif;
       font-size: 16px;
       line-height: 1.5;
       color: #444444;
       background-color: #f7f7f7;
       padding: 20px;
     "
   >
     <h1
       style="
         font-size: 24px;
         font-weight: normal;
         margin-top: 0;
         margin-bottom: 20px;
       "
     >
       Order Status Changed
     </h1>
     <p style="margin-bottom: 20px">
       Your following order has been <strong><em>{state}</em></strong
       >.
     </p>
     <table
       style="
         border-collapse: collapse;
         width: 100%;
         margin-bottom: 20px;
         background-color: #ffffff;
       "
     >
       <thead>
         <tr>
           <th
             style="
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background-color: #eeeeee;
             "
           >
             Service Name
           </th>
           <th
             style="
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background-color: #eeeeee;
             "
           >
             Service Price
           </th>
           <th
             style="
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background-color: #eeeeee;
             "
           >
             Quantity
           </th>
           <th
             style="
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background-color: #eeeeee;
             "
           >
             Total
           </th>
         </tr>
       </thead>
       <tbody>
             {orderItems}
       </tbody>
       <tfoot>
         <tr>
           <td
             style="
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               font-weight: bold;
             "
             colspan="2"
           >
             Total
           </td>
           <td
             colspan="2"
             style="
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               font-weight: bold;
               border-top: 2px solid #444444;
               padding-top: 8px;
             "
           >
             {total}
           </td>
         </tr>
       </tfoot>
     </table>
   </body>
 </html>
`;
