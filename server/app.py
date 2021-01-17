import cv2
from datetime import datetime
from queue import Queue
from base64 import b64encode

from flask import Flask, Response, jsonify, url_for, redirect, request
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy.orm
from cockroachdb.sqlalchemy import run_transaction

from hand_detection import process
from signup_training import gatheringImages, createModel
from login_detection import verify

# from multiprocessing.pool import ThreadPool
# pool = ThreadPool(processes=1)
from threading import Thread
import time
import os

app = Flask(
    __name__,
    static_folder='./client/build',
    static_url_path='/'
)

app.config.from_pyfile('app.cfg')
db = SQLAlchemy(app)
sessionmaker = sqlalchemy.orm.sessionmaker(db.engine)

q = Queue()

def worker():
    while True:
        item = q.get()
        item()
        q.task_done()
        
Thread(target=worker, daemon=True).start()

# Data models -------------
class Snapshot(db.Model):
    __tablename__ = 'snapshots'
    id = db.Column(db.Integer, primary_key=True)
    move = db.Column(db.String(60))
    timestamp = db.Column(db.Time)

    def __init__(self, move):
        self.move = move
        self.timestamp = datetime.now().time()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    loginID = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name
        self.loginID = 0


def generateFrames(face_detect=False):
    while True:
        buffer, user_move, img = process()
        q.put(lambda : helper(user_move, img))
        frame = buffer.tobytes()
        yield(b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Routes -------
@app.route('/createDB')
def createDB():
    db.create_all()
    return "Created"

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/stream')
def stream():
    return Response(
        generateFrames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/testCreate')
def testCreate():
    buffer, user_move, img = process()
    createSnapshot(user_move, img)
    time.sleep(0.5)
    return redirect(url_for('getSnapshots'))

@app.route('/testDelete')
def testDelete():
    deleteSnapshots()
    return redirect(url_for('getSnapshots'))

@app.route('/getMove')
def getMove():
    def callback(session):
        snapshots = session.query(Snapshot).order_by(Snapshot.timestamp.desc()).all()
        output = ""
        for snapshot in snapshots:
            output += f'id:{snapshot.id}, snapshot: {snapshot.move}, {snapshot.timestamp}\n'

        return f'{snapshots[0].move}'
    return run_transaction(sessionmaker, callback)

@app.route('/getSnapshots')
def getSnapshots():
    def callback(session):
        snapshots = session.query(Snapshot).order_by(Snapshot.timestamp.desc()).all()
        output = ""
        for snapshot in snapshots:
            output += f'id:{snapshot.id}, snapshot: {snapshot.move}, {snapshot.timestamp}\n'

        return f'{snapshots[0].id}'
    return run_transaction(sessionmaker, callback)

@app.route('/login')
def login():

    result = None

    # verifyImage() => return either: 'SOME_SQL_ID, None'

    while result == None:
        snapID = getSnapshots()
        
        if os.path.exists(f'snapshots/{snapID}.jpg'):
            image = cv2.imread(f'snapshots/{snapID}.jpg')

            print(image.size)

            result = verify(image)
        else:
            print(snapID)
            print("does not exist")
        
    if(result == "unknown"): return f'Your id: is unknown '

    user = db.session.query(User).filter_by(loginID = result).one()
    print(user)

    return f'Your id:{user.name}' #name or unknown

@app.route('/signup', methods=['POST'])
def signup():
    """
    what is the process for creating a new face profile (cascade)
        - from db get a unique id for the new user, pass to gather
        - gather images until you have 
        30 with a face in them
        - then call the thing that makes the cascade

        image = cv2.imread("studytonight.png")
    """

    user = createUser(request.form['name'])
    user.loginID = int(str(user.id)[-6:])
    db.session.commit()

    print(user.loginID)

    count = 1

    while count < 30:
        snapID = getSnapshots()
        if os.path.exists(f'snapshots/{snapID}.jpg'):
            image = cv2.imread(f'snapshots/{snapID}.jpg')
            count = gatheringImages(image, user.loginID)
    
    createModel()

    return "model created"

# Helper Database functions
def createUser(name):
    def callback(session):
        user = User(name)
        db.session.add(user)
        db.session.commit()
        return user

    return run_transaction(sessionmaker, callback)

def helper(move, img):
    snapshot = createSnapshot(move)
    cv2.imwrite(f'snapshots/{snapshot.id}.jpg', img)
    
    deleteSnapshots()
    return

def getSnapshot():
    def callback(session):
        snapshots = session.query(Snapshot).order_by(Snapshot.timestamp.desc()).all()
        output = ""
        for snapshot in snapshots:
            output += f'id:{snapshot.id}, snapshot: {snapshot.move}, {snapshot.timestamp}\n'

        print(output)

        return snapshots[0]
    
    return run_transaction(sessionmaker, callback)

def createSnapshot(move):
    def callback(session):
        snapshot = Snapshot(move)
        db.session.add(snapshot)
        db.session.commit()
        return snapshot

    return run_transaction(sessionmaker, callback)

def deleteSnapshots():
    def callback(session):
        snapshots = Snapshot.query.order_by(Snapshot.timestamp.desc()).all()

        for i in range(len(snapshots)):
            if(i == 0): continue
            db.session.delete(snapshots[i])

            path = f'snapshots/{snapshots[i].id}.jpg'
            if os.path.exists(path):
                try:
                    os.remove(path)
                except:
                    None

        db.session.commit()
    
    run_transaction(sessionmaker, callback)

    