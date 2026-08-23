import * as invoiceService from "./invoice.service.js";
import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";

export const listInvoices = asyncHandler(async (req, res) => {
  const result = await invoiceService.listInvoices(req.query, req.user);
  return ApiResponse.success(res, "Invoices retrieved successfully", result);
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const result = await invoiceService.getInvoiceById(req.params.id, req.user);
  return ApiResponse.success(res, "Invoice details retrieved successfully", result);
});
