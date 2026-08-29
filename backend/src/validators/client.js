import { z } from 'zod';
import net from 'node:net';

const date = z.coerce.date();
const str = z.string().trim().min(1).max(180);

export const clientSchema = z.object({
  nodeName: str,
  ipAddress: z.string().trim().refine(v => net.isIP(v) !== 0, 'Invalid IPv4/IPv6 address'),
  dataCenter: str,
  billTo: str,
  serviceTo: str,
  numberOfUsers: z.coerce.number().int().min(0),
  expiryDate: date,
  billFrom: z.union([date, str]),
  ftpLink: z.union([
    z.literal(''),
    z.string().url().refine(v => /^ftps?:\/\//i.test(v), 'Must be FTP/FTPS URL')
  ]).optional()
});