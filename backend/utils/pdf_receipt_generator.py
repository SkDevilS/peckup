"""
PDF Receipt Generator for Peckup E-commerce Platform
Generates professional PDF receipts with company branding
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from io import BytesIO
from datetime import datetime


class ReceiptPDFGenerator:
    """Generate professional PDF receipts for orders"""
    
    def __init__(self, order):
        self.order = order
        self.buffer = BytesIO()
        self.width, self.height = letter
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Company name style
        self.styles.add(ParagraphStyle(
            name='CompanyName',
            parent=self.styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#FF6B35'),
            spaceAfter=4,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Receipt title style
        self.styles.add(ParagraphStyle(
            name='ReceiptTitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#333333'),
            spaceAfter=8,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading3'],
            fontSize=10,
            textColor=colors.HexColor('#FF6B35'),
            spaceAfter=4,
            spaceBefore=8,
            fontName='Helvetica-Bold'
        ))
        
        # Info text style
        self.styles.add(ParagraphStyle(
            name='InfoText',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#333333'),
            spaceAfter=2
        ))
        
        # Small text style
        self.styles.add(ParagraphStyle(
            name='SmallText',
            parent=self.styles['Normal'],
            fontSize=7,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER
        ))
    
    def _draw_header(self, canvas_obj, doc):
        """Draw header on each page"""
        canvas_obj.saveState()
        
        # Draw orange header bar
        canvas_obj.setFillColor(colors.HexColor('#FF6B35'))
        canvas_obj.rect(0, self.height - 1*inch, self.width, 1*inch, fill=True, stroke=False)
        
        # Company name
        canvas_obj.setFillColor(colors.white)
        canvas_obj.setFont('Helvetica-Bold', 18)
        canvas_obj.drawCentredString(self.width/2, self.height - 0.5*inch, 
                                     "PECKUP PRIVATE LIMITED")
        
        # Tagline
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.drawCentredString(self.width/2, self.height - 0.68*inch, 
                                     "Your Trusted Shopping Partner")
        
        # Support email
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.drawCentredString(self.width/2, self.height - 0.82*inch, 
                                     "support@peckup.in")
        
        canvas_obj.restoreState()
    
    def _draw_footer(self, canvas_obj, doc):
        """Draw footer on each page"""
        canvas_obj.saveState()
        
        # Footer line
        canvas_obj.setStrokeColor(colors.HexColor('#CCCCCC'))
        canvas_obj.setLineWidth(0.5)
        canvas_obj.line(0.75*inch, 0.6*inch, self.width - 0.75*inch, 0.6*inch)
        
        # Footer text
        canvas_obj.setFont('Helvetica', 7)
        canvas_obj.setFillColor(colors.HexColor('#666666'))
        canvas_obj.drawCentredString(self.width/2, 0.45*inch, 
                                     "Thank you for shopping with Peckup!")
        canvas_obj.drawCentredString(self.width/2, 0.3*inch, 
                                     "For queries, contact: support@peckup.in")
        
        canvas_obj.restoreState()
    
    def _create_order_info_table(self):
        """Create order information table"""
        data = [
            ['Order Number:', self.order.order_number, 
             'Receipt Number:', self.order.receipt_number],
            ['Order Date:', self.order.created_at.strftime('%B %d, %Y %I:%M %p'), 
             'Payment Method:', self.order.payment_method.upper()]
        ]
        
        table = Table(data, colWidths=[1.3*inch, 2.2*inch, 1.3*inch, 2.2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8F9FA')),
            ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#F8F9FA')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTNAME', (3, 0), (3, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E0E0E0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        return table
    
    def _create_customer_info_section(self):
        """Create customer information section"""
        elements = []
        
        # Section header
        elements.append(Paragraph("Customer & Shipping Information", self.styles['SectionHeader']))
        
        # Combine customer and shipping info in one table
        if self.order.user and self.order.address:
            combined_data = [
                ['Customer:', self.order.user.name or 'N/A', 
                 'Ship To:', self.order.address.full_name],
                ['Email:', self.order.user.email or 'N/A',
                 'Phone:', self.order.address.phone],
                ['', '',
                 'Address:', f"{self.order.address.address_line1}, {self.order.address.city}, {self.order.address.state} - {self.order.address.pincode}"]
            ]
            
            combined_table = Table(combined_data, colWidths=[1*inch, 2.5*inch, 1*inch, 2.5*inch])
            combined_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8F9FA')),
                ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#F8F9FA')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
                ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
                ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTNAME', (3, 0), (3, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E0E0E0')),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ]))
            
            elements.append(combined_table)
        
        return elements
    
    def _create_shipping_address_section(self):
        """Create shipping address section - now integrated with customer info"""
        # This is now handled in _create_customer_info_section
        return []
    
    def _create_items_table(self):
        """Create order items table"""
        # Table header
        data = [['Item', 'SKU', 'Qty', 'Price', 'Total']]
        
        # Add items
        for item in self.order.order_items:
            product_name = 'Unknown Product'
            sku = 'N/A'
            
            if item.product:
                product_name = item.product.title
                sku = item.product.sku if hasattr(item.product, 'sku') and item.product.sku else 'N/A'
            
            # Add size/color info if available
            if item.size or item.color:
                details = []
                if item.size:
                    details.append(f"Size: {item.size}")
                if item.color:
                    details.append(f"Color: {item.color}")
                product_name += f"<br/><font size=7 color='#666666'>{', '.join(details)}</font>"
            
            data.append([
                Paragraph(product_name, self.styles['InfoText']),
                sku,
                str(item.quantity),
                f"Rs {item.price:.2f}",
                f"Rs {(item.price * item.quantity):.2f}"
            ])
        
        # Create table
        table = Table(data, colWidths=[2.8*inch, 1*inch, 0.6*inch, 1*inch, 1.1*inch])
        
        # Style the table
        table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FF6B35')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            
            # Data rows
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#333333')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('ALIGN', (1, 1), (1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (2, -1), 'CENTER'),
            ('ALIGN', (3, 1), (3, -1), 'RIGHT'),
            ('ALIGN', (4, 1), (4, -1), 'RIGHT'),
            
            # Grid
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E0E0E0')),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#FF6B35')),
            
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            
            # Alternating row colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8F9FA')]),
        ]))
        
        return table
    
    def _create_totals_table(self):
        """Create order totals table"""
        subtotal = sum(item.price * item.quantity for item in self.order.order_items)
        shipping = 0.00  # Free shipping
        
        data = [
            ['Subtotal:', f"Rs {subtotal:.2f}"],
            ['Shipping & Handling:', f"Rs {shipping:.2f}"],
            ['', ''],  # Spacer row
            ['Total Amount:', f"Rs {self.order.total_amount:.2f}"]
        ]
        
        table = Table(data, colWidths=[5.5*inch, 1.5*inch])
        table.setStyle(TableStyle([
            # Subtotal and shipping
            ('ALIGN', (0, 0), (0, 1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, 1), 'RIGHT'),
            ('FONTNAME', (0, 0), (0, 1), 'Helvetica'),
            ('FONTNAME', (1, 0), (1, 1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, 1), 10),
            ('TEXTCOLOR', (0, 0), (-1, 1), colors.HexColor('#666666')),
            
            # Total row
            ('ALIGN', (0, 3), (-1, 3), 'RIGHT'),
            ('FONTNAME', (0, 3), (-1, 3), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 3), (-1, 3), 12),
            ('TEXTCOLOR', (0, 3), (-1, 3), colors.HexColor('#FF6B35')),
            ('LINEABOVE', (0, 3), (-1, 3), 2, colors.HexColor('#FF6B35')),
            
            # Padding
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        return table
    
    def generate(self):
        """Generate the PDF receipt"""
        # Create document with smaller margins
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=letter,
            rightMargin=0.6*inch,
            leftMargin=0.6*inch,
            topMargin=1.2*inch,
            bottomMargin=0.8*inch
        )
        
        # Build content
        story = []
        
        # Receipt title
        story.append(Paragraph("ORDER RECEIPT", self.styles['ReceiptTitle']))
        story.append(Spacer(1, 0.1*inch))
        
        # Order information
        story.append(self._create_order_info_table())
        story.append(Spacer(1, 0.1*inch))
        
        # Customer and shipping information (combined)
        story.extend(self._create_customer_info_section())
        story.append(Spacer(1, 0.1*inch))
        
        # Order items
        story.append(Paragraph("Order Items", self.styles['SectionHeader']))
        story.append(self._create_items_table())
        story.append(Spacer(1, 0.1*inch))
        
        # Totals
        story.append(self._create_totals_table())
        story.append(Spacer(1, 0.15*inch))
        
        # Payment status box
        if self.order.payment_method == 'cod':
            payment_text = "Payment Method: Cash on Delivery (COD) - Payment will be collected upon delivery."
        else:
            payment_text = f"Payment Method: {self.order.payment_method.upper()} - Payment Status: {self.order.payment_status.capitalize()}"
        
        payment_para = Paragraph(payment_text, self.styles['InfoText'])
        payment_data = [[payment_para]]
        payment_table = Table(payment_data, colWidths=[6.5*inch])
        payment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E8F5E8')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#155724')),
            ('GRID', (0, 0), (-1, -1), 1.5, colors.HexColor('#28A745')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(payment_table)
        
        # Build PDF with header and footer
        doc.build(story, onFirstPage=self._draw_header, onLaterPages=self._draw_header)
        
        # Get PDF data
        self.buffer.seek(0)
        return self.buffer


def generate_receipt_pdf(order):
    """
    Generate PDF receipt for an order
    
    Args:
        order: Order object with all related data
        
    Returns:
        BytesIO buffer containing the PDF
    """
    generator = ReceiptPDFGenerator(order)
    return generator.generate()
