# from flask import Flask, render_template, request, flash
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:accesstech@accesstech.cuyv9atug6pr.us-east-1.rds.amazonaws.com:5432/postgres'
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# # app.secret_key = 'secret string'

# db = SQLAlchemy(app)

# class admin_user(db.Model):
#     admin_id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), unique=True, nullable=False)
#     password = db.Column(db.String(120), unique=True, nullable=False)
#     role = db.Column(db.String(120), nullable=False)

#     def __repr__(self):
#         return '<User %r>' % self.username
    
# @app.route('/')
# def hello():
#     new_user = admin_user(name='admin1', password='password', role='master')
#     db.session.add(new_user)
#     try:
#         db.session.commit()
#         return 'User created!'
#     except Exception as e:
#         return str(e)


# from flask import Flask, render_template, request, flash
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import Column, Integer, String
# from sqlalchemy import create_engine
# engine = create_engine('postgresql://root:accesstech@accesstech.cuyv9atug6pr.us-east-1.rds.amazonaws.com:5432/postgres', echo = True)
# from sqlalchemy.ext.declarative import declarative_base
# Base = declarative_base()
# app = Flask(__name__)

# class admin_user(Base):
#     __tablename__ = 'admin_user'
#     admin_id = Column(Integer, primary_key = True)

#     name = Column(String)
#     password = Column(String)
#     role = Column(String)
# Base.metadata.create_all(engine)

# from sqlalchemy.orm import sessionmaker



# @app.route('/')
# def hello():
#     try:
#         Session = sessionmaker(bind = engine)
#         session = Session()
#         result = session.query(admin_user).all()
#         test = []
#         for row in result:
#             print ("admin_id: ", row.admin_id, "name: ", row.name, "role: ", row.role)
#             test.append(row.name)
#         return test
#     except Exception as e:
#         return str(e)