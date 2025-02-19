import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class CreateProductDTO {
  
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string = "";

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number = 0;

  @IsArray()
  @IsString({ each: true })
  images: string[] = [];
}
export class UpdateProductDTO extends CreateProductDTO {}
