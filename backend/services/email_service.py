"""
Email Notification Service using Resend
Sends email notifications when new orders are placed
"""
import os
import asyncio
import logging
import resend
from typing import Optional
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'panaghia8688@yahoo.com')
FROM_EMAIL = "comenzi@panaghiaautoservirevatradornei.ro"  # Verified domain

# Initialize Resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


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
        # Format order items for email
        items_html = ""
        for item in order.get('items', []):
            items_html += f"""
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{item.get('name', 'Produs')}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity', 1)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">{item.get('price', 0) * item.get('quantity', 1)} lei</td>
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
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                <tr>
                    <td style="background: #D4A847; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0;">🍽️ Comandă Nouă!</h1>
                        <p style="margin: 5px 0 0 0;">Panaghia Autoservire</p>
                    </td>
                </tr>
                <tr>
                    <td style="background: #f9f9f9; padding: 20px;">
                        <p style="text-align: center; font-size: 24px; font-weight: bold; color: #D4A847; margin: 0 0 20px 0;">
                            {order.get('order_number', 'N/A')}
                        </p>
                        
                        <table width="100%" style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <tr>
                                <td>
                                    <h3 style="margin: 0 0 10px 0;">📋 Detalii Client</h3>
                                    <p style="margin: 5px 0;"><strong>Nume:</strong> {customer.get('name', 'N/A')}</p>
                                    <p style="margin: 5px 0;"><strong>Telefon:</strong> {customer.get('phone', 'N/A')}</p>
                                    {f'<p style="margin: 5px 0;"><strong>Email:</strong> {customer.get("email")}</p>' if customer.get('email') else ''}
                                    {f'<p style="margin: 5px 0;"><strong>Adresă:</strong> {customer.get("address")}</p>' if customer.get('address') else ''}
                                    {f'<p style="margin: 5px 0;"><strong>Observații:</strong> {customer.get("notes")}</p>' if customer.get('notes') else ''}
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <tr>
                                <td>
                                    <h3 style="margin: 0 0 10px 0;">📦 Tip Comandă</h3>
                                    <p style="margin: 5px 0;"><strong>Metoda:</strong> {order_type}</p>
                                    <p style="margin: 5px 0;"><strong>Plată:</strong> {payment_method}</p>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <tr>
                                <td>
                                    <h3 style="margin: 0 0 10px 0;">🛒 Produse Comandate</h3>
                                    <table width="100%" style="border-collapse: collapse;">
                                        <thead>
                                            <tr>
                                                <th style="background: #f0f0f0; padding: 10px; text-align: left;">Produs</th>
                                                <th style="background: #f0f0f0; padding: 10px; text-align: center;">Cant.</th>
                                                <th style="background: #f0f0f0; padding: 10px; text-align: right;">Preț</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items_html}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="text-align: center; font-size: 20px; font-weight: bold; color: #D4A847; margin: 20px 0;">
                            Total: {order.get('total', 0)} lei
                        </p>
                        
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                        
                        <p style="text-align: center; color: #666; font-size: 12px; margin: 0;">
                            Acest email a fost generat automat de sistemul Panaghia.<br>
                            {datetime.now(timezone.utc).strftime('%d.%m.%Y %H:%M')} UTC
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        # Prepare email params
        params = {
            "from": FROM_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"🍽️ Comandă Nouă #{order.get('order_number', 'N/A')} - {customer.get('name', 'Client')}",
            "html": html_content
        }
        
        # Send email (run sync SDK in thread to keep FastAPI non-blocking)
        email = await asyncio.to_thread(resend.Emails.send, params)
        
        logger.info(f"Email notification sent for order {order.get('order_number')}, email_id: {email.get('id')}")
        return True
        
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
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                <tr>
                    <td style="background: #D4A847; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">Actualizare Comandă</h2>
                        <p style="margin: 5px 0 0 0;">{order.get('order_number', 'N/A')}</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; background: #f9f9f9;">
                        <p>Dragă {order.get('customer', {}).get('name', 'Client')},</p>
                        <p>{status_messages[new_status]}</p>
                        <p>Dacă ai întrebări, ne poți contacta la <strong>0746 254 162</strong>.</p>
                        <p>Cu drag,<br>Echipa Panaghia</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        params = {
            "from": FROM_EMAIL,
            "to": [customer_email],
            "subject": f"Actualizare Comandă #{order.get('order_number', 'N/A')} - Panaghia",
            "html": html_content
        }
        
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Status update email sent for order {order.get('order_number')}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send status update email: {e}")
        return False
