import cv2

from flask import Flask

app = Flask(__name)

@app.route('/')
def index():
    return "Hello world."
