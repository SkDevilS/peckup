#!/usr/bin/env python3
"""
Product Template Generator for Peckup E-commerce Platform

This script creates an Excel template file for bulk product uploads.
The template includes all required and optional columns with sample data
and validation rules to help users understand the expected format.

Usage:
    python create_product_template.py

Output:
    - product_upload_template.xlsx (Excel template file)
    - README_template_guide.txt (Instructions file)
"""

import pandas as pd
from datetime import datetime
import os

def create_product_template():
    """Create Excel template for product uploads with sample data and instructions."""
    
    # Define the template structure with sample data
    template_data = {
        # Required columns
        'sku': [
            'TSHIRT-001',
            'JEANS-002', 
            'DRESS-003',
            'SHOES-004',
            'BAG-005'
        ],
        'title': [
            'Premium Cotton T-Shirt',
            'Classic Blue Jeans',
            'Summer Floral Dress',
            'Running Sneakers',
            'Leather Handbag'
        ],
        'slug': [
            'premium-cotton-t-shirt',
            'classic-blue-jeans',
            'summer-floral-dress',
            'running-sneakers',
            'leather-handbag'
        ],
        'price': [
            29.99,
            79.99,
            59.99,
            129.99,
            199.99
        ],
        'section_slug': [
            'clothing',
            'clothing',
            'clothing',
            'footwear',
            'accessories'
        ],
        
        # Optional columns
        'description': [
            'Comfortable 100% cotton t-shirt perfect for everyday wear',
            'Classic fit jeans made from premium denim with stretch comfort',
            'Beautiful floral print dress perfect for summer occasions',
            'Lightweight running shoes with advanced cushioning technology',
            'Genuine leather handbag with multiple compartments'
        ],
        'original_price': [
            39.99,
            99.99,
            79.99,
            159.99,
            249.99
        ],
        'is_on_sale': [
            'TRUE',
            'TRUE',
            'TRUE',
            'TRUE',
            'TRUE'
        ],
        'stock': [
            50,
            30,
            25,
            40,
            15
        ],
        'sizes': [
            'S, M, L, XL',
            '28, 30, 32, 34, 36',
            'XS, S, M, L',
            '7, 8, 9, 10, 11',
            'One Size'
        ],
        'colors': [
            'Black, White, Navy, Red',
            'Blue, Black, Gray',
            'Floral, White, Pink',
            'Black, White, Blue, Red',
            'Brown, Black, Tan'
        ],
        'image_filenames': [
            'tshirt-001-1.jpg, tshirt-001-2.jpg',
            'jeans-002-1.jpg, jeans-002-2.jpg, jeans-002-3.jpg',
            'dress-003-1.jpg, dress-003-2.jpg',
            'shoes-004-1.jpg, shoes-004-2.jpg, shoes-004-3.jpg, shoes-004-4.jpg',
            'bag-005-1.jpg, bag-005-2.jpg'
        ],
        'is_active': [
            'TRUE',
            'TRUE',
            'TRUE',
            'TRUE',
            'TRUE'
        ]
    }
    
    # Create DataFrame
    df = pd.DataFrame(template_data)
    
    # Create Excel file with formatting
    filename = 'product_upload_template.xlsx'
    
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        # Write the main template
        df.to_excel(writer, sheet_name='Product Template', index=False)
        
        # Create instructions sheet
        instructions_data = {
            'Column Name': [
                'sku', 'title', 'slug', 'price', 'section_slug',
                'description', 'original_price', 'is_on_sale', 'stock',
                'sizes', 'colors', 'image_filenames', 'is_active'
            ],
            'Required': [
                'YES', 'YES', 'YES', 'YES', 'YES',
                'NO', 'NO', 'NO', 'NO',
                'NO', 'NO', 'NO', 'NO'
            ],
            'Data Type': [
                'Text', 'Text', 'Text', 'Number', 'Text',
                'Text', 'Number', 'Boolean', 'Number',
                'Text', 'Text', 'Text', 'Boolean'
            ],
            'Description': [
                'Unique product identifier (e.g., TSHIRT-001)',
                'Product name/title',
                'URL-friendly version of title (lowercase, hyphens)',
                'Current selling price (decimal number)',
                'Section/category slug (must match existing sections)',
                'Detailed product description',
                'Original price before discount (optional)',
                'TRUE/FALSE - whether product is on sale',
                'Available quantity in stock',
                'Comma-separated sizes (e.g., S, M, L, XL)',
                'Comma-separated colors (e.g., Red, Blue, Green)',
                'Comma-separated image filenames (upload images first)',
                'TRUE/FALSE - whether product is active/visible'
            ],
            'Example': [
                'TSHIRT-001',
                'Premium Cotton T-Shirt',
                'premium-cotton-t-shirt',
                '29.99',
                'clothing',
                'Comfortable 100% cotton t-shirt...',
                '39.99',
                'TRUE',
                '50',
                'S, M, L, XL',
                'Black, White, Navy',
                'tshirt-001-1.jpg, tshirt-001-2.jpg',
                'TRUE'
            ]
        }
        
        instructions_df = pd.DataFrame(instructions_data)
        instructions_df.to_excel(writer, sheet_name='Instructions', index=False)
        
        # Create sections reference sheet
        sections_data = {
            'Section Slug': [
                'clothing',
                'footwear',
                'accessories',
                'electronics',
                'home-decor',
                'sports',
                'beauty',
                'books'
            ],
            'Section Name': [
                'Clothing',
                'Footwear',
                'Accessories',
                'Electronics',
                'Home Decor',
                'Sports & Fitness',
                'Beauty & Personal Care',
                'Books & Media'
            ],
            'Description': [
                'Shirts, pants, dresses, jackets, etc.',
                'Shoes, boots, sandals, sneakers, etc.',
                'Bags, jewelry, watches, belts, etc.',
                'Phones, laptops, headphones, etc.',
                'Furniture, decorations, lighting, etc.',
                'Exercise equipment, sportswear, etc.',
                'Cosmetics, skincare, fragrances, etc.',
                'Books, magazines, digital media, etc.'
            ]
        }
        
        sections_df = pd.DataFrame(sections_data)
        sections_df.to_excel(writer, sheet_name='Available Sections', index=False)
        
        # Format the worksheets
        workbook = writer.book
        
        # Format Product Template sheet
        template_sheet = writer.sheets['Product Template']
        
        # Auto-adjust column widths
        for column in template_sheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            template_sheet.column_dimensions[column_letter].width = adjusted_width
        
        # Format Instructions sheet
        instructions_sheet = writer.sheets['Instructions']
        for column in instructions_sheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 60)
            instructions_sheet.column_dimensions[column_letter].width = adjusted_width
        
        # Format Sections sheet
        sections_sheet = writer.sheets['Available Sections']
        for column in sections_sheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 40)
            sections_sheet.column_dimensions[column_letter].width = adjusted_width
    
    print(f"✅ Excel template created: {filename}")
    return filename

def create_readme_guide():
    """Create a README file with detailed instructions."""
    
    readme_content = """
# Product Upload Template Guide

## Overview
This guide explains how to use the product upload template for bulk product imports.

## File Structure
- **product_upload_template.xlsx**: The main template file with sample data
- **README_template_guide.txt**: This instruction file

## Excel Sheets Explanation

### 1. Product Template Sheet
This is the main sheet where you'll enter your product data. It contains sample products that you should replace with your actual products.

### 2. Instructions Sheet
Detailed explanation of each column, including:
- Whether the column is required or optional
- Data type expected
- Description of what the column contains
- Example values

### 3. Available Sections Sheet
Lists the available product sections/categories. Make sure your `section_slug` values match one of these.

## Step-by-Step Usage

### Step 1: Prepare Your Data
1. Open the template file
2. Review the sample data in the "Product Template" sheet
3. Check the "Instructions" sheet for column requirements
4. Verify available sections in the "Available Sections" sheet

### Step 2: Replace Sample Data
1. Delete the sample rows (keep the header row)
2. Enter your product data following the format shown
3. Ensure all required columns are filled
4. Use proper data types (numbers for prices, TRUE/FALSE for booleans)

### Step 3: Image Preparation (Optional)
1. If you have product images, upload them first using the bulk image upload
2. Note down the uploaded filenames
3. Enter the filenames in the `image_filenames` column (comma-separated)

### Step 4: Data Validation
Before uploading, verify:
- All SKUs are unique
- All required fields are filled
- Prices are valid numbers
- Section slugs match available sections
- Boolean fields use TRUE/FALSE (not 1/0 or yes/no)
- Comma-separated fields (sizes, colors, images) are properly formatted

### Step 5: Upload
1. Save your completed template
2. Go to Admin Panel > Product Management
3. Click "Bulk Upload"
4. Follow the upload wizard steps

## Column Details

### Required Columns
- **sku**: Unique identifier (e.g., PROD-001)
- **title**: Product name
- **slug**: URL-friendly name (lowercase, hyphens only)
- **price**: Current selling price (decimal number)
- **section_slug**: Must match an existing section

### Optional Columns
- **description**: Detailed product description
- **original_price**: Price before discount
- **is_on_sale**: TRUE if product is on sale
- **stock**: Available quantity
- **sizes**: Comma-separated (e.g., "S, M, L, XL")
- **colors**: Comma-separated (e.g., "Red, Blue, Green")
- **image_filenames**: Comma-separated uploaded image files
- **is_active**: TRUE to make product visible

## Common Mistakes to Avoid

1. **Duplicate SKUs**: Each SKU must be unique
2. **Invalid section_slug**: Must match exactly with available sections
3. **Wrong boolean format**: Use TRUE/FALSE, not 1/0 or yes/no
4. **Missing required fields**: All required columns must have values
5. **Invalid price format**: Use decimal numbers (29.99, not $29.99)
6. **Incorrect slug format**: Use lowercase letters, numbers, and hyphens only

## Tips for Success

1. **Start Small**: Test with a few products first
2. **Backup Data**: Keep a copy of your original data
3. **Validate Sections**: Ensure all your section_slug values exist
4. **Check Images**: Upload and verify image files before referencing them
5. **Review Sample Data**: Use the provided examples as a reference

## Troubleshooting

### Upload Fails
- Check for duplicate SKUs
- Verify all required fields are filled
- Ensure section_slug values are valid
- Check data format (especially booleans and numbers)

### Images Not Showing
- Verify image files were uploaded successfully
- Check filename spelling in the template
- Ensure image filenames don't contain special characters

### Products Not Visible
- Check if `is_active` is set to TRUE
- Verify the section is active
- Check if stock is greater than 0 (if stock tracking is enabled)

## Support
If you encounter issues:
1. Review this guide carefully
2. Check the sample data format
3. Verify your data against the instructions sheet
4. Contact technical support with specific error messages

---
Generated on: {timestamp}
Template Version: 1.0
"""
    
    filename = 'README_template_guide.txt'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(readme_content.format(timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    
    print(f"✅ README guide created: {filename}")
    return filename

def main():
    """Main function to create template and guide files."""
    
    print("🚀 Creating Product Upload Template...")
    print("=" * 50)
    
    try:
        # Check if pandas and openpyxl are available
        import pandas as pd
        import openpyxl
    except ImportError as e:
        print("❌ Required libraries not found!")
        print("Please install required dependencies:")
        print("pip install pandas openpyxl")
        return
    
    # Create template and guide
    template_file = create_product_template()
    readme_file = create_readme_guide()
    
    print("\n" + "=" * 50)
    print("✅ Template creation completed!")
    print(f"📁 Files created:")
    print(f"   - {template_file}")
    print(f"   - {readme_file}")
    print("\n📋 Next steps:")
    print("1. Open the Excel template file")
    print("2. Read the README guide for detailed instructions")
    print("3. Replace sample data with your products")
    print("4. Upload the completed template via Admin Panel")
    print("\n💡 Tip: Start with a few test products to verify the process!")

if __name__ == "__main__":
    main()