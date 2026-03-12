import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepo = () => AppDataSource.getRepository(User);

// --- Interfaces ---
interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

// --- Generate Tokens ---
const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn:  '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// --- Register ---
export const register = async (dto: RegisterDto) => {
  // Kiểm tra email đã tồn tại chưa
  const existing = await userRepo().findOne({ where: { email: dto.email } });
  if (existing) throw { status: 400, message: 'Email đã được sử dụng' };

  // Hash password
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  // Tạo user mới
  const user = userRepo().create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
  });

  await userRepo().save(user);

  // Tạo tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Lưu refreshToken vào DB
  await userRepo().update(user.id, { refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  };
};

// --- Login ---
export const login = async (dto: LoginDto) => {
  // Tìm user theo email
  const user = await userRepo().findOne({ where: { email: dto.email } });
  if (!user) throw { status: 401, message: 'Email hoặc mật khẩu không đúng' };

  // Kiểm tra password
  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) throw { status: 401, message: 'Email hoặc mật khẩu không đúng' };

  // Tạo tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Lưu refreshToken vào DB
  await userRepo().update(user.id, { refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  };
};

// --- Refresh Token ---
export const refreshToken = async (token: string) => {
  // Verify refresh token
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

  // Tìm user và kiểm tra refresh token khớp không
  const user = await userRepo().findOne({ where: { id: decoded.id } });
  if (!user || user.refreshToken !== token) {
    throw { status: 401, message: 'Refresh token không hợp lệ' };
  }

  // Tạo tokens mới
  const tokens = generateTokens(user);
  await userRepo().update(user.id, { refreshToken: tokens.refreshToken });

  return tokens;
};

// --- Logout ---
export const logout = async (userId: string) => {
  await userRepo().update(userId, { refreshToken: '' });
  return { message: 'Đăng xuất thành công' };
};