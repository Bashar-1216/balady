from flask import Blueprint, request, jsonify
from src.models.certificate import Certificate
from src.models.user import db
from datetime import datetime

certificate_bp = Blueprint('certificate', __name__)

@certificate_bp.route('/certificates', methods=['GET'])
def get_certificates():
    """Get all certificates"""
    try:
        certificates = Certificate.query.all()
        return jsonify({
            'success': True,
            'data': [cert.to_dict() for cert in certificates]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@certificate_bp.route('/certificates', methods=['POST'])
def create_certificate():
    """Create a new certificate"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['amanah', 'municipality', 'name', 'id_number', 'nationality', 'gender', 'profession']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'حقل {field} مطلوب'
                }), 400
        
        # Parse dates
        medical_issue_date = None
        medical_expiry_date = None
        educational_expiry_date = None
        
        if data.get('medical_certificate_issue_date'):
            medical_issue_date = datetime.strptime(data['medical_certificate_issue_date'], '%Y-%m-%d').date()
        
        if data.get('medical_certificate_expiry_date'):
            medical_expiry_date = datetime.strptime(data['medical_certificate_expiry_date'], '%Y-%m-%d').date()
            
        if data.get('educational_program_expiry_date'):
            educational_expiry_date = datetime.strptime(data['educational_program_expiry_date'], '%Y-%m-%d').date()
        
        # Create new certificate
        certificate = Certificate(
            amanah=data['amanah'],
            municipality=data['municipality'],
            name=data['name'],
            id_number=data['id_number'],
            nationality=data['nationality'],
            gender=data['gender'],
            profession=data['profession'],
            medical_certificate_issue_date=medical_issue_date,
            medical_certificate_expiry_date=medical_expiry_date,
            educational_program_type=data.get('educational_program_type'),
            educational_program_expiry_date=educational_expiry_date,
            license_number=data.get('license_number'),
            establishment_name=data.get('establishment_name'),
            certificate_number=data.get('certificate_number'),
            personal_photo=data.get('personal_photo')
        )
        
        db.session.add(certificate)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم إنشاء الشهادة بنجاح',
            'data': certificate.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@certificate_bp.route('/certificates/<int:certificate_id>', methods=['GET'])
def get_certificate(certificate_id):
    """Get a specific certificate"""
    try:
        certificate = Certificate.query.get_or_404(certificate_id)
        return jsonify({
            'success': True,
            'data': certificate.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@certificate_bp.route('/certificates/<int:certificate_id>', methods=['PUT'])
def update_certificate(certificate_id):
    """Update a certificate"""
    try:
        certificate = Certificate.query.get_or_404(certificate_id)
        data = request.get_json()
        
        # Update basic fields
        if 'amanah' in data:
            certificate.amanah = data['amanah']
        if 'municipality' in data:
            certificate.municipality = data['municipality']
        if 'name' in data:
            certificate.name = data['name']
        if 'id_number' in data:
            certificate.id_number = data['id_number']
        if 'nationality' in data:
            certificate.nationality = data['nationality']
        if 'gender' in data:
            certificate.gender = data['gender']
        if 'profession' in data:
            certificate.profession = data['profession']
        
        # Update new fields
        if data.get('medical_certificate_issue_date'):
            certificate.medical_certificate_issue_date = datetime.strptime(data['medical_certificate_issue_date'], '%Y-%m-%d').date()
        
        if data.get('medical_certificate_expiry_date'):
            certificate.medical_certificate_expiry_date = datetime.strptime(data['medical_certificate_expiry_date'], '%Y-%m-%d').date()
            
        if data.get('educational_program_expiry_date'):
            certificate.educational_program_expiry_date = datetime.strptime(data['educational_program_expiry_date'], '%Y-%m-%d').date()
        
        if 'educational_program_type' in data:
            certificate.educational_program_type = data['educational_program_type']
        if 'license_number' in data:
            certificate.license_number = data['license_number']
        if 'establishment_name' in data:
            certificate.establishment_name = data['establishment_name']
        if 'certificate_number' in data:
            certificate.certificate_number = data['certificate_number']
        if 'personal_photo' in data:
            certificate.personal_photo = data['personal_photo']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم تحديث الشهادة بنجاح',
            'data': certificate.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@certificate_bp.route('/certificates/<int:certificate_id>', methods=['DELETE'])
def delete_certificate(certificate_id):
    """Delete a certificate"""
    try:
        certificate = Certificate.query.get_or_404(certificate_id)
        db.session.delete(certificate)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم حذف الشهادة بنجاح'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@certificate_bp.route('/certificates/search', methods=['GET'])
def search_certificates():
    """Search certificates by name"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({
                'success': False,
                'message': 'معامل البحث مطلوب'
            }), 400
        
        certificates = Certificate.query.filter(
            Certificate.name.contains(query)
        ).all()
        
        return jsonify({
            'success': True,
            'data': [cert.to_dict() for cert in certificates]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

