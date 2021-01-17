import cv2
import numpy as np
from PIL import Image
import os
import glob

face_detector = cv2.CascadeClassifier('venv/Lib/site-packages/cv2/data/haarcascade_frontalface_default.xml')
recognizer = cv2.face.LBPHFaceRecognizer_create()

inner_count = 0

def gatheringImages(img, face_id):
    global inner_count
    
    if (inner_count > 30): 
        inner_count = 0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, 1.3, 5)

    for (x,y,w,h) in faces:  
        inner_count += 1
        # Save the captured image into the datasets folder
        cv2.imwrite("face_images/User." + str(face_id) + '.' + str(inner_count) + ".jpg", gray[y:y+h,x:x+w])

    return inner_count



def createModel():
    path = 'face_images'

    faces,ids = getImagesAndLabels(path)
    recognizer.train(faces, np.array(ids))

    recognizer.save('face_cascade/face.yml')



def getImagesAndLabels(path):
    imagePaths = [os.path.join(path,f) for f in os.listdir(path)]     
    faceSamples=[]
    ids = []
    for imagePath in imagePaths:
        PIL_img = Image.open(imagePath).convert('L') # converts the image to grayscale
        img_numpy = np.array(PIL_img,'uint8')
        id = int(os.path.split(imagePath)[-1].split(".")[1])
        faces = face_detector.detectMultiScale(img_numpy)
        for (x,y,w,h) in faces:
            faceSamples.append(img_numpy[y:y+h,x:x+w])
            ids.append(id)
    return faceSamples,ids