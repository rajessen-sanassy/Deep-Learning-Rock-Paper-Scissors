import cv2
import random
from datetime import datetime
from queue import Queue
from base64 import b64encode

from flask import Flask, Response, jsonify, url_for, redirect, request
from flask_cors import CORS, cross_origin

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

from ai_algorithm import Markov_Chain

markov = Markov_Chain(1, True, 0.7)
history = None

app = Flask(
    __name__,
    static_folder='../client/build',
    static_url_path='/'
)

CORS(app)

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
@app.route('/playMove')
def playMove():
    # get moves
    moveMap = {
        'rock': 'R',
        'scissors': 'S',
        'paper': 'P',
        'lizard': 'L',
        'spock': 'K',
        'loading..': False,
        'none': False
    }

    playerMove = moveMap[getMove()]
    if playerMove == False:
        return "retry"

    beat = {'R': ['P', 'K'], 'P': ['S', 'L'], 'S':['R', 'K'], 'L':['R', 'S'], 'K':['P', 'L']}

    if markov.loss_streak > 2:
        pc_move = random.choice(['R', 'P', 'S', 'L', 'K'])
    elif markov.history:
        pc_move = markov.compute(beat[markov.predict(markov.history)], markov.history)
    else:
        pc_move = 'P'
    
    # compute who won
    result = ""
    
    if (pc_move == playerMove):
        outcome = 'L'
        result = 'tie'
    elif pc_move in beat[playerMove]:
        outcome = 'L'
        result = 'loss'
        markov.loss_streak = 0
    else:
        outcome = 'W'
        result = 'win'
        markov.loss_streak += 1
    
    # update history
    if markov.history:
        markov.update(playerMove, markov.history)
    markov.history = playerMove + outcome

    return jsonify(
        player_move=playerMove,
        pc_move=pc_move,
        result=result
    )

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

@app.route('/getUserCount')
def getUserCount():
    def callback(session):
        users = session.query(User).all()
        return len(users)
    return run_transaction(sessionmaker, callback)

@app.route('/login')
def login():
    print("\n\n\n\n\n\n")
    print("scanning")
    print("\n\n\n\n\n\n")

    result = None

    # verifyImage() => return either: 'SOME_SQL_ID, None'

    while result == None:
        snapID = getSnapshots()
        
        if os.path.exists(f'snapshots/{snapID}.jpg'):
            image = cv2.imread(f'snapshots/{snapID}.jpg')
            result = verify(image)
        else:
            print(snapID)
            print("does not exist")
        
    if(result == "unknown"): return f'unknown'

    user = db.session.query(User).filter_by(loginID = result).one()
    print(user)

    return user.name

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

    print(request.form)

    user = createUser(request.form['name'])
    user.loginID = getUserCount() + 1
    db.session.commit()

    print("user login ID:", user.loginID)

    count = 1

    while count != 0:
        snapID = getSnapshots()
        print(snapID)
        if os.path.exists(f'snapshots/{snapID}.jpg'):
            print("Gathering photos")
            print(count)
            image = cv2.imread(f'snapshots/{snapID}.jpg')
            count = gatheringImages(image, user.loginID)
            print(count)
    
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
            if(i < 5): continue
            db.session.delete(snapshots[i])

            path = f'snapshots/{snapshots[i].id}.jpg'
            if os.path.exists(path):
                try:
                    os.remove(path)
                except:
                    None

        db.session.commit()
    
    run_transaction(sessionmaker, callback)

