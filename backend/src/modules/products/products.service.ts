import { AppDataSource } from '../../config/database';
import { Product } from '../../entities/Product';
import { ILike } from 'typeorm';

const productRepo = () => AppDataSource.getRepository(Product);

// Lấy danh sách sản phẩm (có filter + phân trang)
export const getProducts = async (query: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, category, page = 1, limit = 12 } = query;

  const where: any = { isActive: true };
  if (search) where.name = ILike(`%${search}%`);
  if (category) where.category = category;

  const [items, total] = await productRepo().findAndCount({
    where,
    order: { createdAt: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// Lấy 1 sản phẩm theo ID
export const getProductById = async (id: string) => {
  const product = await productRepo().findOne({ where: { id } });
  if (!product) throw { status: 404, message: 'Sản phẩm không tồn tại' };
  return product;
};

// Lấy danh sách categories
export const getCategories = async () => {
  const result = await productRepo()
    .createQueryBuilder('product')
    .select('DISTINCT product.category', 'category')
    .where('product.isActive = :isActive', { isActive: true })
    .getRawMany();
  return result.map((r: any) => r.category);
};

// Tạo sản phẩm (Admin)
export const createProduct = async (dto: Partial<Product>) => {
  const product = productRepo().create(dto);
  return await productRepo().save(product);
};

// Cập nhật sản phẩm (Admin)
export const updateProduct = async (id: string, dto: Partial<Product>) => {
  await productRepo().update(id, dto);
  return getProductById(id);
};

// Xóa sản phẩm (Admin)
export const deleteProduct = async (id: string) => {
  await productRepo().update(id, { isActive: false });
  return { message: 'Xóa sản phẩm thành công' };
};