import cv2
import numpy as np
import os
from pathlib import Path

recognizer = cv2.face.LBPHFaceRecognizer_create()

faceCascade = cv2.CascadeClassifier("venv\Lib\site-packages\cv2\data\haarcascade_frontalface_default.xml")


#iniciate id counter
id = 0

# Define min window size to be recognized as a face
minW = 0.1*640
minH = 0.1*480

def verify(img):

    if Path('face_cascade/face.yml').is_file():
        recognizer.read('face_cascade/face.yml')
    else:
        return "unknown"

    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale( 
        gray,
        scaleFactor = 1.2,
        minNeighbors = 5,
        minSize = (int(minW), int(minH)),
       )

    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
        id, confidence = recognizer.predict(gray[y:y+h,x:x+w])

        # Check if confidence is less them 100 ==> "0" is perfect match 
        if (confidence < 100):
            print(str(id))
            return id
        else:
            return "unknown"
    return None