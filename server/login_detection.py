import cv2
import numpy as np
import os
from pathlib import Path

faceCascade = cv2.CascadeClassifier("venv\Lib\site-packages\cv2\data\haarcascade_frontalface_default.xml")


def verify(img):

    minW = 0.1*640
    minH = 0.1*480

    if Path('face_cascade/face.yml').is_file():
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.read('face_cascade/face.yml')
    else:
        return "unknown"

    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale( 
        gray,
        scaleFactor = 1.4,
        minNeighbors = 5,
        minSize = (int(minW), int(minH)),
       )

    for(x,y,w,h) in faces:
        user_id, confidence = recognizer.predict(gray[y:y+h,x:x+w])

        # Check if confidence is less them 100 ==> "0" is perfect match 
        if (40 <= 100 - confidence):
            confidence = "  {0}%".format(round(100 - confidence))
            print(str(confidence))
            print(str(user_id))
            return user_id
        else:
            return "unknown"

    return None