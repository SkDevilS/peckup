#!/usr/bin/env python3
"""
Simple Product Template Generator (No Dependencies)

This script creates a CSV template file for bulk product uploads.
Works without external dependencies - uses only Python standard library.

Usage:
    python simple_template_generator.py

Output:
    - product_template.csv (CSV template file)
    - template_instructions.txt (Instructions file)
"""

import csv
from datetime import datetime
import os

def create_csv_template():
    """Create CSV template for product uploads with sample data."""
    
    # Define headers and sample data
    headers = [
        'sku', 'title', 'slug', 'price', 'section_slug',
        'description', 'original_price', 'is_on_sale', 'stock',
        'sizes', 'colors', 'image_filenames', 'is_active'
    ]
    
    sample_data = [
        [
            'TSHIRT-001',
            'Premium Cotton T-Shirt',
            'premium-cotton-t-shirt',
            '29.99',
            'clothing',
            'Comfortable 100% cotton t-shirt perfect for everyday wear',
            '39.99',
            'TRUE',
            '50',
            'S, M, L, XL',
            'Black, White, Navy, Red',
            'tshirt-001-1.jpg, tshirt-001-2.jpg',
            'TRUE'
        ],
        [
            'JEANS-002',
            'Classic Blue Jeans',
            'classic-blue-jeans',
            '79.99',
            'clothing',
            'Classic fit jeans made from premium denim with stretch comfort',
            '99.99',
            'TRUE',
            '30',
            '28, 30, 32, 34, 36',
            'Blue, Black, Gray',
            'jeans-002-1.jpg, jeans-002-2.jpg, jeans-002-3.jpg',
            'TRUE'
        ],
        [
            'DRESS-003',
            'Summer Floral Dress',
            'summer-floral-dress',
            '59.99',
            'clothing',
            'Beautiful floral print dress perfect for summer occasions',
            '79.99',
            'TRUE',
            '25',
            'XS, S, M, L',
            'Floral, White, Pink',
            'dress-003-1.jpg, dress-003-2.jpg',
            'TRUE'
        ],
        [
            'SHOES-004',
            'Running Sneakers',
            'running-sneakers',
            '129.99',
            'footwear',
            'Lightweight running shoes with advanced cushioning technology',
            '159.99',
            'TRUE',
            '40',
            '7, 8, 9, 10, 11',
            'Black, White, Blue, Red',
            'shoes-004-1.jpg, shoes-004-2.jpg, shoes-004-3.jpg, shoes-004-4.jpg',
            'TRUE'
        ],
        [
            'BAG-005',
            'Leather Handbag',
            'leather-handbag',
            '199.99',
            'accessories',
            'Genuine leather handbag with multiple compartments',
            '249.99',
            'TRUE',
            '15',
            'One Size',
            'Brown, Black, Tan',
            'bag-005-1.jpg, bag-005-2.jpg',
            'TRUE'
        ]
    ]
    
    filename = 'product_template.csv'
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        writer.writerows(sample_data)
    
    print(f"✅ CSV template created: {filename}")
    return filename

def create_instructions():
    """Create detailed instructions file."""
    
    instructions = """
# Product Upload Template Instructions

## File Format
- Use CSV format (Comma Separated Values)
- Keep the header row as the first line
- Replace sample data with your actual products
- Save as UTF-8 encoding to support special characters

## Required Columns (Must be filled for every product)

1. **sku** (Text)
   - Unique product identifier
   - Example: TSHIRT-001, PROD-123
   - Must be unique across all products

2. **title** (Text)
   - Product name/title
   - Example: Premium Cotton T-Shirt

3. **slug** (Text)
   - URL-friendly version of title
   - Use lowercase letters, numbers, and hyphens only
   - Example: premium-cotton-t-shirt

4. **price** (Number)
   - Current selling price
   - Use decimal format: 29.99 (not $29.99)
   - Example: 29.99

5. **section_slug** (Text)
   - Product category/section
   - Must match existing sections in your system
   - Common values: clothing, footwear, accessories, electronics

## Optional Columns (Can be left empty)

6. **description** (Text)
   - Detailed product description
   - Can include multiple sentences
   - Example: Comfortable 100% cotton t-shirt perfect for everyday wear

7. **original_price** (Number)
   - Price before discount
   - Use decimal format: 39.99
   - Leave empty if no discount

8. **is_on_sale** (Boolean)
   - Whether product is on sale
   - Use: TRUE or FALSE (not 1/0 or yes/no)
   - Default: FALSE if empty

9. **stock** (Number)
   - Available quantity
   - Use whole numbers: 50
   - Leave empty for unlimited stock

10. **sizes** (Text)
    - Available sizes, separated by commas
    - Example: S, M, L, XL
    - Example: 28, 30, 32, 34, 36

11. **colors** (Text)
    - Available colors, separated by commas
    - Example: Black, White, Navy, Red

12. **image_filenames** (Text)
    - Image files, separated by commas
    - Upload images first, then reference filenames
    - Example: product-001-1.jpg, product-001-2.jpg

13. **is_active** (Boolean)
    - Whether product is visible to customers
    - Use: TRUE or FALSE
    - Default: TRUE if empty

## Available Sections
Make sure your section_slug matches one of these:
- clothing (Clothing & Apparel)
- footwear (Shoes & Footwear)
- accessories (Bags, Jewelry, etc.)
- electronics (Phones, Laptops, etc.)
- home-decor (Furniture, Decorations)
- sports (Sports & Fitness)
- beauty (Beauty & Personal Care)
- books (Books & Media)

## Data Format Rules

### Text Fields
- Enclose in quotes if containing commas: "Red, White, and Blue Shirt"
- Use UTF-8 encoding for special characters

### Number Fields
- Use decimal point (not comma): 29.99
- Don't include currency symbols: 29.99 (not $29.99)

### Boolean Fields
- Use exactly: TRUE or FALSE
- Case sensitive (not true/false or 1/0)

### Comma-Separated Fields
- Use commas with spaces: "S, M, L, XL"
- Don't use semicolons or other separators

## Step-by-Step Process

### 1. Prepare Your Data
- Gather all product information
- Prepare product images (optional)
- Ensure you have unique SKUs for each product

### 2. Fill the Template
- Open product_template.csv in Excel or text editor
- Keep the header row unchanged
- Replace sample data with your products
- Follow the format shown in examples

### 3. Upload Images (Optional)
- If you have product images, upload them first
- Note the uploaded filenames
- Reference them in the image_filenames column

### 4. Validate Your Data
- Check all required fields are filled
- Verify SKUs are unique
- Ensure section_slug values are valid
- Confirm price format is correct

### 5. Upload the File
- Save your completed CSV file
- Go to Admin Panel > Product Management
- Click "Bulk Upload" button
- Follow the upload process

## Common Errors and Solutions

### "Duplicate SKU" Error
- Each SKU must be unique
- Check for repeated values in the sku column

### "Invalid Section" Error
- section_slug must match available sections
- Check the Available Sections list above

### "Invalid Price Format" Error
- Use decimal numbers: 29.99
- Don't include currency symbols or commas

### "Boolean Format Error" Error
- Use exactly TRUE or FALSE
- Check is_on_sale and is_active columns

### "Missing Required Field" Error
- Fill all required columns: sku, title, slug, price, section_slug

## Tips for Success

1. **Start Small**: Test with 2-3 products first
2. **Use Examples**: Follow the sample data format exactly
3. **Validate Data**: Double-check before uploading
4. **Backup**: Keep a copy of your original data
5. **Test Upload**: Try a small batch before bulk upload

## Excel Users
If using Microsoft Excel:
1. Open the CSV file in Excel
2. Edit your data
3. Save as "CSV UTF-8 (Comma delimited)" format
4. This preserves special characters and formatting

---
Generated: {timestamp}
Version: 1.0
"""
    
    filename = 'template_instructions.txt'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(instructions.format(timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    
    print(f"✅ Instructions created: {filename}")
    return filename

def main():
    """Main function to create template files."""
    
    print("🚀 Creating Product Upload Template (Simple Version)")
    print("=" * 60)
    print("📝 This version creates CSV files and works without external dependencies")
    print()
    
    # Create files
    template_file = create_csv_template()
    instructions_file = create_instructions()
    
    print("\n" + "=" * 60)
    print("✅ Template creation completed!")
    print(f"\n📁 Files created:")
    print(f"   📄 {template_file} - Main template file")
    print(f"   📋 {instructions_file} - Detailed instructions")
    
    print(f"\n📋 Next steps:")
    print("1. Open the CSV template in Excel or text editor")
    print("2. Read the instructions file for detailed guidance")
    print("3. Replace sample data with your actual products")
    print("4. Save the file and upload via Admin Panel")
    
    print(f"\n💡 Tips:")
    print("- Keep the header row unchanged")
    print("- Follow the exact format shown in examples")
    print("- Test with a few products first")
    print("- Make sure SKUs are unique")

if __name__ == "__main__":
    main()