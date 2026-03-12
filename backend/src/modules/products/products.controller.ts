import { Request, Response } from 'express';
import * as productsService from './products.service';

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, page, limit } = req.query;
    const result = await productsService.getProducts({
      search: search as string,
      category: category as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// GET /api/products/categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await productsService.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productsService.getProductById(req.params['id'] as string);
    res.json(product);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// POST /api/products (Admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// PUT /api/products/:id (Admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productsService.updateProduct(req.params['id'] as string, req.body);
    res.json(product);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// DELETE /api/products/:id (Admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productsService.deleteProduct(req.params['id'] as string);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};