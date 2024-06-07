// ********RoostGPT********
/*
Application Test generated by RoostGPT for test NodeJS-application using AI Type Open AI and AI Model gpt-4o


*/

// ********RoostGPT********
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import the app and the models
const app = require('../src/app');
const ProductModel = require('../src/model/product');

// Mock Mongoose methods to avoid database calls during testing
jest.mock('../src/model/product');

describe('API Routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/products', () => {
    it('should fetch all products successfully', async () => {
      // Set up the mock
      const mockProducts = [{ title: 'Product1', description: 'A test product', price: 100 }];
      ProductModel.find.mockImplementationOnce((cb) => cb(null, mockProducts));

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.products).toEqual(mockProducts);
    });

    it('should handle database errors gracefully', async () => {
      // Set up the mock
      ProductModel.find.mockImplementationOnce((cb) => cb(new Error('Database error'), null));

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.errorDesc).toBe('Failed get data from DB.');
    });
  });

  describe('POST /api/products', () => {
    it('should insert a new product successfully', async () => {
      // Set up the mock
      const mockProduct = { title: 'New Product', description: 'A new test product', price: 200 };
      ProductModel.prototype.save.mockImplementationOnce((cb) => cb(null));

      const response = await request(app)
        .post('/api/products')
        .send(mockProduct);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.product.title).toBe(mockProduct.title);
    });

    it('should return an error if title is missing', async () => {
      // Set up the mock
      const mockProduct = { description: 'A product without title', price: 200 };

      const response = await request(app)
        .post('/api/products')
        .send(mockProduct);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.errorDesc).toBe('Title product is null or empty.');
    });

    it('should handle save errors', async () => {
      // Set up the mock
      const mockProduct = { title: 'Error Product', description: 'A product with error', price: 200 };
      ProductModel.prototype.save.mockImplementationOnce((cb) => cb(new Error('Save error')));

      const response = await request(app)
        .post('/api/products')
        .send(mockProduct);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.errorDesc).toBe('Save error');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should fetch a product by ID successfully', async () => {
      // Set up the mock
      const mockProduct = { _id: '1', title: 'Product1', description: 'A test product', price: 100 };
      ProductModel.findById.mockImplementationOnce((id, cb) => cb(null, mockProduct));

      const response = await request(app).get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.product).toEqual(mockProduct);
    });

    it('should handle errors when fetching by ID', async () => {
      // Set up the mock
      ProductModel.findById.mockImplementationOnce((id, cb) => cb(new Error('Fetch error'), null));

      const response = await request(app).get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.errorDesc).toBe('error when get product 1');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product successfully', async () => {
      // Set up the mock
      const mockProduct = { _id: '1', title: 'Updated Product', description: 'An updated product', price: 150 };
      ProductModel.findById.mockImplementationOnce((id, cb) => {
        cb(null, mockProduct);
        return {
          save: jest.fn().mockImplementationOnce((cb) => cb(null)),
        };
      });

      const response = await request(app)
        .put('/api/products/1')
        .send({ title: 'Updated Product', description: 'An updated product', price: 150 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.product.title).toBe('Updated Product');
    });

    it('should handle update errors', async () => {
      // Set up the mock
      const mockProduct = { _id: '1', title: 'Product with Error', description: 'An updated product', price: 150 };
      ProductModel.findById.mockImplementationOnce((id, cb) => {
        cb(null, mockProduct);
        return {
          save: jest.fn().mockImplementationOnce((cb) => cb(new Error('Update error'))),
        };
      });

      const response = await request(app)
        .put('/api/products/1')
        .send({ title: 'Product with Error', description: 'An updated product', price: 150 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.errorDesc).toBe('error when update product 1');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product successfully', async () => {
      // Set up the mock
      const mockProduct = { _id: '1', title: 'Product to delete', description: 'A product to be deleted', price: 100 };
      ProductModel.findById.mockImplementationOnce((id, cb) => {
        cb(null, mockProduct);
        return {
          remove: jest.fn().mockImplementationOnce((cb) => cb(null)),
        };
      });

      const response = await request(app).delete('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.message).toBe('product 1 has been removed');
    });

    it('should handle delete errors', async () => {
      // Set up the mock
      const mockProduct = { _id: '1', title: 'Product with Error', description: 'A product with delete error', price: 100 };
      ProductModel.findById.mockImplementationOnce((id, cb) => {
        cb(null, mockProduct);
        return {
          remove: jest.fn().mockImplementationOnce((cb) => cb(new Error('Delete error'))),
        };
      });

      const response = await request(app).delete('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.errorDesc).toBe('error when remove product 1');
    });
  });
});

