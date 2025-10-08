import { Users } from "./src/generated/prisma";
import type { IAccessPayload } from "./src/utils/auth-utils";

declare global{
    namespace Express{
        interface Request{
            user ?: IAccessPayload
            file?: {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                buffer: Buffer;
            }
        }
    }
}