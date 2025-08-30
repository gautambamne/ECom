import {ZodError} from "zod"

export function zodErrorFormatter(error: ZodError): Record<string, string>{
    const formattedErrors: Record<string, string> = {};

    for (const issue of error.issues){
        const path = issue.path.join('.');
        formattedErrors[path] = issue.message;
    }
    return formattedErrors;
}