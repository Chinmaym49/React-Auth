from extensions import db

class User(db.Model):
    __tablename__="user"
    id=db.Column(db.Integer,primary_key=True)
    handle=db.Column(db.Text,unique=True)
    pwdhash=db.Column(db.Text)

    @property
    def identity(self):
        return self.id

    @property
    def password(self):
        return self.pwdhash

    @property
    def rolenames(self):
        return []

    @classmethod
    def identify(cls,id):
        return cls.query.get(id)

    @classmethod
    def lookup(cls,name):
        return cls.query.filter_by(handle=name).one_or_none()

class Skill(db.Model):
    __tablename__="skill"
    id=db.Column(db.Integer,primary_key=True)
    skill=db.Column(db.Text)

class UserSkill(db.Model):
    __tablename__="userskill"
    id=db.Column(db.Integer,primary_key=True)
    uid=db.Column(db.Integer)
    sid=db.Column(db.Integer)