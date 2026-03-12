import { AppDataSource } from '../../config/database';
import { Order, OrderItem, ShippingAddress } from '../../entities/Order';
import { Product } from '../../entities/Product';

const orderRepo = () => AppDataSource.getRepository(Order);
const productRepo = () => AppDataSource.getRepository(Product);

interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  note?: string;
}

// Tạo đơn hàng
export const createOrder = async (userId: string, dto: CreateOrderDto) => {
  // Kiểm tra từng sản phẩm
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of dto.items) {
    const product = await productRepo().findOne({ where: { id: item.productId } });
    if (!product) throw { status: 404, message: `Sản phẩm không tồn tại` };
    if (product.stock < item.quantity) {
      throw { status: 400, message: `Sản phẩm "${product.name}" không đủ số lượng` };
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: item.quantity,
      imageUrl: product.imageUrl,
    });

    totalAmount += Number(product.price) * item.quantity;

    // Trừ tồn kho
    await productRepo().update(product.id, {
      stock: product.stock - item.quantity
    });
  }

  // Tạo order
  const order = orderRepo().create({
    userId,
    items: orderItems,
    shippingAddress: dto.shippingAddress,
    totalAmount,
    note: dto.note,
    status: 'pending',
  });

  return await orderRepo().save(order);
};

// Lấy đơn hàng của user
export const getMyOrders = async (userId: string) => {
  return await orderRepo().find({
    where: { userId },
    order: { createdAt: 'DESC' },
  });
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (id: string, userId: string) => {
  const order = await orderRepo().findOne({ where: { id, userId } });
  if (!order) throw { status: 404, message: 'Đơn hàng không tồn tại' };
  return order;
};

// Hủy đơn hàng
export const cancelOrder = async (id: string, userId: string) => {
  const order = await orderRepo().findOne({ where: { id, userId } });
  if (!order) throw { status: 404, message: 'Đơn hàng không tồn tại' };
  if (order.status !== 'pending') {
    throw { status: 400, message: 'Chỉ có thể hủy đơn hàng đang chờ xử lý' };
  }

  // Hoàn lại tồn kho
  for (const item of order.items) {
    const product = await productRepo().findOne({ where: { id: item.productId } });
    if (product) {
      await productRepo().update(product.id, {
        stock: product.stock + item.quantity
      });
    }
  }

  await orderRepo().update(id, { status: 'cancelled' });
  return { message: 'Hủy đơn hàng thành công' };
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (page = 1, limit = 10) => {
  const [items, total] = await orderRepo().findAndCount({
    order: { createdAt: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
    relations: ['user'],
  });
  return { items, total, page, totalPages: Math.ceil(total / limit) };
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id: string, status: string) => {
  const order = await orderRepo().findOne({ where: { id } });
  if (!order) throw { status: 404, message: 'Đơn hàng không tồn tại' };
  await orderRepo().update(id, { status: status as any });
  return { message: 'Cập nhật trạng thái thành công' };
};