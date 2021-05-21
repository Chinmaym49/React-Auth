from flask_praetorian import Praetorian
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()
guard=Praetorian()
cors=CORS()