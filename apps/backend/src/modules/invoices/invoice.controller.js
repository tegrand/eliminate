import * as invoiceService from "./invoice.service.js";
import { catchAsync } from "../../shared/utils/catch-async.js";

export const listInvoices = catchAsync(async (req, res) => {
  const result = await invoiceService.listInvoices(req.query, req.user);
  res.status(200).json({
    status: "success",
    data: result
  });
});

export const getInvoiceById = catchAsync(async (req, res) => {
  const result = await invoiceService.getInvoiceById(req.params.id, req.user);
  res.status(200).json({
    status: "success",
    data: result
  });
});
