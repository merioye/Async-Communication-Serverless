import { IsString } from "class-validator";

export class PutEventDto {
  @IsString()
  vehicleNo: string;

  @IsString()
  nic: string;
}
