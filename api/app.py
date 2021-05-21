from flask import Flask,request,jsonify
from flask_praetorian import auth_required,current_user
from extensions import db,guard,cors
from models import User,Skill,UserSkill

app=Flask(__name__)
app.config["SECRET_KEY"]="helloworld"
app.config["JWT_ACCESS_LIFESPAN"]={"minutes": 30}
app.config["JWT_REFRESH_LIFESPAN"]={"months": 1}
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///data.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

guard.init_app(app,User)
db.init_app(app)
cors.init_app(app)

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error":"NoPageError","message":"Page not found","status_code":404}),404

@app.route("/api/",methods=["GET"])
def index():
    return jsonify({"message":"hello world"}),200

@app.route("/api/login",methods=["POST"])
def login():
    data=request.get_json()
    user=guard.authenticate(data.get("handle",""),data.get("password",""))
    return jsonify({"token":guard.encode_jwt_token(user)}),200

@app.route("/api/register",methods=["POST"])
def register():
    data=request.get_json()
    if data["handle"]=="" or data["password"]=="":
        return jsonify({"error":"InvalidError","message":"Fill all fields!","status_code":400}),400
    if User.query.filter_by(handle=data["handle"]).one_or_none():
        return jsonify({"error":"DuplicateError","message":"This handle already exists!","status_code":400}),400
    user=User(handle=data["handle"],pwdhash=guard.hash_password(data["password"]))
    db.session.add(user)
    db.session.commit()
    for i in range(3):
        if data["skills"][i]:
            db.session.add(UserSkill(uid=user.id,sid=i+1))
            db.session.commit()
    return jsonify({"message":"Registration successful!"}),200

@app.route("/api/protected",methods=["GET"])
@auth_required
def protected():
    user=current_user()
    return jsonify({"message":"You,{} are allowed!".format(user.handle)}),200

@app.route("/api/user",methods=["GET"])
@auth_required
def user():
    user=current_user()
    data=dict()
    data["id"]=user.id
    data["handle"]=user.handle
    data["skills"]=[]
    sids=UserSkill.query.filter_by(uid=user.id).all()
    for obj in sids:
        data["skills"].append(Skill.query.filter_by(id=obj.sid).one().skill)
    return jsonify(data),200

@app.route("/api/refresh",methods=["POST"])
def refresh():
    old=request.get_json()
    new=guard.refresh_jwt_token(old["token"])
    return jsonify({"token":new}),200

if __name__=="__main__":

    # with app.app_context():
    #     db.create_all()
    #     db.session.add(Skill(skill="python"))
    #     db.session.add(Skill(skill="c++"))
    #     db.session.add(Skill(skill="js"))
        
    #     db.session.add(User(handle="abc",pwdhash=guard.hash_password("abc")))
    #     db.session.add(User(handle="pqr",pwdhash=guard.hash_password("pqr")))
    #     db.session.add(User(handle="xyz",pwdhash=guard.hash_password("xyz")))

    #     db.session.add(UserSkill(uid=1,sid=1))
    #     db.session.add(UserSkill(uid=1,sid=3))
    #     db.session.add(UserSkill(uid=2,sid=2))
    #     db.session.add(UserSkill(uid=3,sid=1))
    #     db.session.add(UserSkill(uid=3,sid=3))
        
    #     db.session.commit()
        
    app.run(debug=True,host="0.0.0.0")