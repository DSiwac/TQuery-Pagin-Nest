import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/configurations/prisma.service';
import { Prisma, Products } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO } from './DTO/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDTO) {
    return await this.prisma.products.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        price: dto.price,
        discountPercentage: dto.discountPercentage ?? 0,
        images: dto.images ?? [],
      },
    });
  }

  async getAllProducts(query: {
    page?: number;
    limit?: number;
    sortField?: keyof Products;
    sortOrder?: 'asc' | 'desc';
    filterField?: keyof Products;
    filterValue?: string | number;
  }) {
    try {
      const {
        page = 1,
        limit = 8,
        sortField,
        sortOrder,
        filterField,
        filterValue,
      } = query;

      const parsedLimit = parseInt(String(limit), 10); 

      if (page <= 0 || parsedLimit <= 0) {
        throw new BadRequestException(
          'Page and limit must be positive numbers',
        );
      }

      const where: Prisma.ProductsWhereInput =
        filterField && filterValue
          ? { [filterField]: { equals: filterValue } }
          : {};

      const orderBy = sortField ? { [sortField]: sortOrder } : undefined;

      const products = await this.prisma.products.findMany({
        where,
        orderBy,
        skip: (page - 1) * parsedLimit, 
        take: parsedLimit, 
      });

      const total = await this.prisma.products.count({ where });

      return {
        products,
        total,
        page,
        limit: parsedLimit,
      };
    } catch (error) {
      console.error('Error getting all products:', error);
      throw new InternalServerErrorException('Failed to retrieve products');
    }
  }

  async updateProduct(id: number, dto: UpdateProductDTO) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    return await this.prisma.products.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description ?? '',
        price: dto.price,
        discountPercentage: dto.discountPercentage ?? 0,
        images: dto.images ?? [],
      },
    });
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.products.delete({
      where: { id },
    });
    return product;
  }
}
