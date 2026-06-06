import { z } from "zod";

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Alamat pengiriman wajib diisi"),
  phone: z.string().min(8, "Nomor handphone wajib diisi"),
  paymentMethod: z.string().min(1, "Metode pembayaran wajib dipilih"),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
