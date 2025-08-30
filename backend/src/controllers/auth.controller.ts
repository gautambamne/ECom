import { ApiError } from "../advices/ApiError";
import { ApiResponse } from "../advices/ApiResponse";
import { RegistrationSchema } from "../schema/auth.schema"
import asyncHandler from "../utils/asyncHandler"
import { zodErrorFormatter } from "../utils/format-validation-error";

export const RegisterController = asyncHandler(async (req, res)=>{
  const result = RegistrationSchema.safeParse(req.body)
  if(!result.success){
        throw new ApiError(400, "validation Error", zodErrorFormatter(result.error))
  }

  return res.json(
    new ApiResponse(result.data)
  )
})