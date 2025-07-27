from flask import Blueprint, request, jsonify, send_file
from src.models.certificate import Certificate
from src.models.user import db
import qrcode
import io
import base64
from datetime import datetime
import os

certificate_view_bp = Blueprint('certificate_view', __name__)

@certificate_view_bp.route('/certificates/<int:certificate_id>/view', methods=['GET'])
def view_certificate(certificate_id):
    """Get certificate data for viewing"""
    try:
        certificate = Certificate.query.get_or_404(certificate_id)
        
        # Generate QR code
        qr_data = f"Certificate ID: {certificate.id}\nName: {certificate.name}\nID Number: {certificate.id_number}\nIssued: {certificate.created_at.strftime('%Y/%m/%d')}"
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # Create QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        img_buffer = io.BytesIO()
        qr_img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        qr_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        
        # Prepare certificate data
        certificate_data = certificate.to_dict()
        certificate_data['qr_code'] = qr_base64
        certificate_data['issue_date'] = certificate.created_at.strftime('%Y/%m/%d')
        certificate_data['issue_date_hijri'] = '1448/02/08'  # This should be calculated properly
        certificate_data['expiry_date'] = '1449/02/19'  # This should be calculated properly
        certificate_data['program_type'] = 'برنامج التسجيل'
        
        return jsonify({
            'success': True,
            'data': certificate_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@certificate_view_bp.route('/certificates/<int:certificate_id>/qr', methods=['GET'])
def get_qr_code(certificate_id):
    """Generate and return QR code image"""
    try:
        certificate = Certificate.query.get_or_404(certificate_id)
        
        # Generate QR code data
        qr_data = f"https://balady.gov.sa/verify/{certificate.id}"
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # Create QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to buffer
        img_buffer = io.BytesIO()
        qr_img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return send_file(img_buffer, mimetype='image/png')
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

