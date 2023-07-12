import transakSDK from "@transak/transak-sdk";

const initializeTransak = (params) => {
  console.log("launching transak");
  let transak = new transakSDK(params);
  return transak;
};

export const openTransak = ({ email, address }) => {
  const transakParams = {
    apiKey: "a2374be4-c59a-400e-809b-72c226c74b8f",
    environment: "STAGING",
    cryptoCurrencyCode: "USDT",
    walletAddress: address,
    fiatCurrency: "EUR",
    fiatAmount: 300,
    network: "polygon",
    paymentMethod: "credit_debit_card",
    email: email || "sandeep@transak.com",
    hideExchangeScreen: true,
    disableWalletAddressForm: true,
    isBuyOrSell: "BUY",
    widgetHeight: "750px",
    widgetWidth: "450px",
  };
  console.log(transakParams, "transakParams");

  const transakWidget = initializeTransak(transakParams);
  console.log(transakWidget, "transakWidget");

  if (transakWidget) {
    transakWidget.init();

    // This will trigger when the user marks payment is made.
    transakWidget.on(
      transakWidget.EVENTS.TRANSAK_ORDER_SUCCESSFUL,
      async (orderData: any) => {
        console.log(orderData, "orderData");

        transakWidget.close();
      }
    );
  }
};
