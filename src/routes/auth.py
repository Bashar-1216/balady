from flask import Blueprint, request, jsonify, session
import hashlib

auth_bp = Blueprint('auth', __name__)

# Simple user store (in production, use a proper database)
USERS = {
    'admin@balady.com': {
        'password': hashlib.sha256('admin123'.encode()).hexdigest(),
        'name': 'مدير النظام'
    }
}

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'البريد الإلكتروني وكلمة المرور مطلوبان'
            }), 400
        
        # Check credentials
        if email in USERS:
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            if USERS[email]['password'] == hashed_password:
                session['user_email'] = email
                session['user_name'] = USERS[email]['name']
                return jsonify({
                    'success': True,
                    'message': 'تم تسجيل الدخول بنجاح',
                    'user': {
                        'email': email,
                        'name': USERS[email]['name']
                    }
                })
        
        return jsonify({
            'success': False,
            'message': 'بيانات الدخول غير صحيحة'
        }), 401
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout"""
    try:
        session.clear()
        return jsonify({
            'success': True,
            'message': 'تم تسجيل الخروج بنجاح'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    try:
        if 'user_email' in session:
            return jsonify({
                'success': True,
                'authenticated': True,
                'user': {
                    'email': session['user_email'],
                    'name': session['user_name']
                }
            })
        else:
            return jsonify({
                'success': True,
                'authenticated': False
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

