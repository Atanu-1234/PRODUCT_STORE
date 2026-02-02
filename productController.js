import {sql} from '../config/db.js';
export const getAllProducts = async (req, res) => {
   try 
    {
        const products = await sql`
        SELECT * FROM products
        ORDER BY create_at DESC        `;      
          console.log("fetched products:", products);
        res.status(200).json({message: 'Products retrieved successfully', data: products});
    }catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};



export const createProduct = async (req, res) => {
    const {name, price, image} = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({message: 'Name, price, and image are required'});
    }
    try {
        const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
        `;
        console.log('Created product:', newProduct);
        res.status(201).json({message: 'Product created successfully', data: newProduct[0]});
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};


export const getProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await sql`
        SELECT * FROM products
        WHERE id = ${id}
        `;
        res.json(200).json({message: 'Product retrieved successfully', data: product[0]});
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({message: 'Internal server error'});
    }

};




export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, image} = req.body;
    try {
        const updatedProduct = await sql`
        UPDATE products
        SET name = ${name}, price = ${price}, image = ${image}
        WHERE id = ${id}
        RETURNING *
        `;
    if (updatedProduct.length === 0) {
        return res.status(404).json({success: false, message: 'Product not found'});
    }
    ;
        console.log('Updated product:', updatedProduct);
        res.status(200).json({success: true, message: 'Product updated successfully', data: updatedProduct[0]});
        } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};



export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedProduct = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
        `;
    if (deletedProduct.length === 0) {
        return res.status(404).json({success: false, message: 'Product not found'});
    }
        console.log('Deleted product:', deletedProduct);
        res.status(200).json({success: true, message: 'Product deleted successfully', data: deletedProduct[0]});
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({message: 'Internal server error'});
    }

};