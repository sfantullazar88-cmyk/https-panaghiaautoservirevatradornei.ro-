"""
Email Notification Service using Resend
Sends email notifications when new orders are placed
"""
import os
import logging
from typing import Optional
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'panaghia8688@yahoo.com')
FROM_EMAIL = "comenzi@panaghia.ro"  # Will use Resend default if not verified


async def send_new_order_notification(order: dict) -> bool:
    """
    Send email notification for a new order
    
    Args:
        order: Order dictionary with items, customer info, total, etc.
    
    Returns:
        True if email sent successfully, False otherwise
    """
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured - skipping email notification")
        return False
    
    try:
        from emergentintegrations.llm.resend import send_email, ResendConfig
        
        # Configure Resend
        config = ResendConfig(api_key=RESEND_API_KEY)
        
        # Format order items for email
        items_html = ""
        for item in order.get('items', []):
            items_html += f"""
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{item['name']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item['quantity']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">{item['price'] * item['quantity']} lei</td>
            </tr>
            """
        
        customer = order.get('customer', {})
        order_type = "Livrare" if order.get('order_type') == 'delivery' else "Ridicare"
        payment_method = "Card online" if order.get('payment_method') == 'card' else "Numerar"
        
        # Create HTML email
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #D4A847; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
                .order-number {{ font-size: 24px; font-weight: bold; color: #D4A847; }}
                .info-box {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .total {{ font-size: 20px; font-weight: bold; color: #D4A847; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th {{ background: #f0f0f0; padding: 10px; text-align: left; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🍽️ Comandă Nouă!</h1>
                    <p>Panaghia Autoservire</p>
                </div>
                <div class="content">
                    <p style="text-align: center;">
                        <span class="order-number">{order.get('order_number', 'N/A')}</span>
                    </p>
                    
                    <div class="info-box">
                        <h3>📋 Detalii Client</h3>
                        <p><strong>Nume:</strong> {customer.get('name', 'N/A')}</p>
                        <p><strong>Telefon:</strong> {customer.get('phone', 'N/A')}</p>
                        {f"<p><strong>Email:</strong> {customer.get('email')}</p>" if customer.get('email') else ""}
                        {f"<p><strong>Adresă:</strong> {customer.get('address')}</p>" if customer.get('address') else ""}
                        {f"<p><strong>Observații:</strong> {customer.get('notes')}</p>" if customer.get('notes') else ""}
                    </div>
                    
                    <div class="info-box">
                        <h3>📦 Tip Comandă</h3>
                        <p><strong>Metoda:</strong> {order_type}</p>
                        <p><strong>Plată:</strong> {payment_method}</p>
                    </div>
                    
                    <div class="info-box">
                        <h3>🛒 Produse Comandate</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Produs</th>
                                    <th style="text-align: center;">Cantitate</th>
                                    <th style="text-align: right;">Preț</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items_html}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <p class="total">Total: {order.get('total', 0)} lei</p>
                    </div>
                    
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    
                    <p style="text-align: center; color: #666; font-size: 12px;">
                        Acest email a fost generat automat de sistemul Panaghia.<br>
                        {datetime.now(timezone.utc).strftime('%d.%m.%Y %H:%M')} UTC
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        text_content = f"""
        COMANDĂ NOUĂ - {order.get('order_number', 'N/A')}
        
        Client: {customer.get('name', 'N/A')}
        Telefon: {customer.get('phone', 'N/A')}
        Tip: {order_type}
        Plată: {payment_method}
        
        Produse:
        {chr(10).join([f"- {item['name']} x{item['quantity']} = {item['price'] * item['quantity']} lei" for item in order.get('items', [])])}
        
        TOTAL: {order.get('total', 0)} lei
        
        {'Adresă: ' + customer.get('address', '') if customer.get('address') else ''}
        {'Observații: ' + customer.get('notes', '') if customer.get('notes') else ''}
        """
        
        # Send email
        result = await send_email(
            config=config,
            to_email=ADMIN_EMAIL,
            subject=f"🍽️ Comandă Nouă #{order.get('order_number', 'N/A')} - {customer.get('name', 'Client')}",
            html_content=html_content,
            text_content=text_content
        )
        
        logger.info(f"Email notification sent for order {order.get('order_number')}")
        return True
        
    except ImportError:
        logger.warning("emergentintegrations not available - skipping email notification")
        return False
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")
        return False


async def send_order_status_update(order: dict, new_status: str) -> bool:
    """
    Send email notification when order status changes
    
    Args:
        order: Order dictionary
        new_status: New status of the order
    
    Returns:
        True if email sent successfully, False otherwise
    """
    if not RESEND_API_KEY:
        return False
    
    # Only send for significant status changes and if customer has email
    customer_email = order.get('customer', {}).get('email')
    if not customer_email:
        return False
    
    status_messages = {
        'confirmed': 'Comanda ta a fost confirmată și va fi pregătită în curând.',
        'preparing': 'Comanda ta este în curs de preparare.',
        'ready': 'Comanda ta este gata! Poți veni să o ridici.',
        'out_for_delivery': 'Comanda ta este în drum spre tine!',
        'delivered': 'Comanda ta a fost livrată. Poftă bună!',
        'cancelled': 'Din păcate, comanda ta a fost anulată. Te rugăm să ne contactezi pentru detalii.'
    }
    
    if new_status not in status_messages:
        return False
    
    try:
        from emergentintegrations.llm.resend import send_email, ResendConfig
        
        config = ResendConfig(api_key=RESEND_API_KEY)
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #D4A847; color: white; padding: 20px; text-align: center; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Actualizare Comandă</h2>
                    <p>{order.get('order_number', 'N/A')}</p>
                </div>
                <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px;">
                    <p>Dragă {order.get('customer', {}).get('name', 'Client')},</p>
                    <p>{status_messages[new_status]}</p>
                    <p>Dacă ai întrebări, ne poți contacta la <strong>0746 254 162</strong>.</p>
                    <p>Cu drag,<br>Echipa Panaghia</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        await send_email(
            config=config,
            to_email=customer_email,
            subject=f"Actualizare Comandă #{order.get('order_number', 'N/A')} - Panaghia",
            html_content=html_content
        )
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send status update email: {e}")
        return False
