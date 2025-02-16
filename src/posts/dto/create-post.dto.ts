import {IsString , IsEnum , IsNotEmpty , IsNumber} from "class-validator"

export class CreatePostDto {


    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsString()
    @IsNotEmpty()
    title: string


    @IsString()
    @IsNotEmpty()
    content: string

}
