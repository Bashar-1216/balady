from src.models.user import db
from datetime import datetime

class Certificate(db.Model):
    __tablename__ = 'certificates'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Information
    amanah = db.Column(db.String(100), nullable=False)
    municipality = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    id_number = db.Column(db.String(20), nullable=False)
    nationality = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    profession = db.Column(db.String(100), nullable=False)
    
    # New Fields
    medical_certificate_issue_date = db.Column(db.Date, nullable=True)
    medical_certificate_expiry_date = db.Column(db.Date, nullable=True)
    educational_program_type = db.Column(db.String(100), nullable=True)
    educational_program_expiry_date = db.Column(db.Date, nullable=True)
    license_number = db.Column(db.String(50), nullable=True)
    establishment_name = db.Column(db.String(200), nullable=True)
    certificate_number = db.Column(db.String(50), nullable=True)
    personal_photo = db.Column(db.Text, nullable=True)  # Base64 encoded image
    
    # System Fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'amanah': self.amanah,
            'municipality': self.municipality,
            'name': self.name,
            'id_number': self.id_number,
            'nationality': self.nationality,
            'gender': self.gender,
            'profession': self.profession,
            'medical_certificate_issue_date': self.medical_certificate_issue_date.strftime('%Y-%m-%d') if self.medical_certificate_issue_date else None,
            'medical_certificate_expiry_date': self.medical_certificate_expiry_date.strftime('%Y-%m-%d') if self.medical_certificate_expiry_date else None,
            'educational_program_type': self.educational_program_type,
            'educational_program_expiry_date': self.educational_program_expiry_date.strftime('%Y-%m-%d') if self.educational_program_expiry_date else None,
            'license_number': self.license_number,
            'establishment_name': self.establishment_name,
            'certificate_number': self.certificate_number,
            'personal_photo': self.personal_photo,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

