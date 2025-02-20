import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ProductsService } from './products.service';
import { CreateProductDTO, UpdateProductDTO } from './DTO/create-product.dto';
import { Products } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDTO,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      const imagesPaths = images ? images.map((image) => image.path) : [];
      return await this.productService.createProduct({
        ...dto,
        images: imagesPaths,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new HttpException(
        'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortField') sortField: keyof Products,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('filterField') filterField: keyof Products,
    @Query('filterValue') filterValue: string,
  ) {
    return this.productService.getAllProducts({
      page,
      limit,
      sortField,
      sortOrder,
      filterField,
      filterValue,
    });
  }

  @Get(':id') 
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<Products> {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDTO,
  ) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
