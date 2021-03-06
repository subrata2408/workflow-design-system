export const metadata = {
  entities: {
    Customer: {
      entityType: {
        name: "entityType",
        type: "text",
        label: "Entity Type",
        value: "Customer",
        disabled: true,
      },
      customerId: {
        name: "customerId",
        type: "text",
        label: "Customer Id",
        value: "",
        required: true,
      },
      customerName: {
        name: "customerName",
        type: "text",
        label: "Name",
        value: "",
        required: true,
      },
      customerEmail: {
        name: "customerEmail",
        type: "text",
        label: "Email",
        value: "",
        required: true,
      },
      customerBankCode: {
        name: "customerBankCode",
        type: "text",
        label: "Bank Code",
        value: "",
        required: true,
      },
    },
    "Payment Mode": {
      entityType: {
        name: "entityType",
        type: "text",
        label: "Entity Type",
        value: "Payment Mode",
        disabled: true,
      },
      paymentModeId: {
        name: "paymentModeId",
        type: "text",
        label: "Payment Mode Id",
        value: "",
        required: true,
      },
      paymentMode: {
        name: "paymentMode",
        type: "text",
        label: "Payment Mode",
        value: "",
        required: true,
      },
      issuer: {
        name: "issuer",
        type: "text",
        label: "Issuer",
        value: "",
        required: true,
      },
      last4DigitsAccNo: {
        name: "last4DigitsAccNo",
        type: "number",
        label: "Last 4 Digits of Account Number",
        value: "",
        required: true,
        lengthRequired: 4,
      },
      payeeCode: {
        name: "payeeCode",
        type: "text",
        label: "Payee Code",
        value: "",
        required: true,
      },
    },
    Merchant: {
      entityType: {
        name: "Merchant",
        type: "text",
        label: "Entity Type",
        value: "Merchant",
        disabled: true,
      },
      merchantId: {
        name: "merchantId",
        type: "text",
        label: "Merchant Id",
        value: "",
        required: true,
      },
      merchantName: {
        name: "merchantName",
        type: "text",
        label: "Name",
        value: "",
        required: true,
      },
      merchantCode: {
        name: "merchantCode",
        type: "text",
        label: "Code",
        value: "",
        required: true,
      },
      merchantBankCode: {
        name: "merchantBankCode",
        type: "text",
        label: "Bank Code",
        value: "",
        required: true,
      },
    },
    // "Merchant",
    // "Payment Mode",
    // "Payment Service Providers",
    // "Network Provider",
    // "Issuer",
    // "Acquirer",
    // "Financial Institution/Banks",
  },
  miscellaneous: {
    saveField: {
      workflowName: {
        name: "workflowName",
        type: "text",
        label: "Entity Workflow Name",
        value: "",
      },
    },
    exportField: {
      fileName: {
        name: "fileName",
        type: "text",
        label: "Entity File Name",
        value: "",
      },
    },
  },
};
