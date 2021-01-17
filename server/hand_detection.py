from keras.models import load_model
import cv2
import numpy as np

MOVE_MAP = {
    0: "rock",
    1: "paper",
    2: "scissors",
    3: "lizard",
    4: "spock",
    5: "none"
}

cap = cv2.VideoCapture(0)
cap.set(3, 720)
cap.set(4, 480)

model = load_model("detection_model.h5")

#count process for loading stages system_count = [rock, paper, scissors, lizard, spock]
system_count = [0, 0, 0, 0, 0]

#loading interval
timer = 5

def mapper(val):
    return MOVE_MAP[val]
    

def loading(move_code):
    for i in range(len(system_count)):
        if i == move_code:
            system_count[i] += 1
        else:
            system_count[i] = 0
    if(system_count[move_code] > timer):
        return mapper(move_code)
    return "loading.."


def process():
        ret, frame = cap.read()

        # rectangle for user to play
        cv2.rectangle(frame, (50, 50), (250, 250), (255, 255, 255), 2)

        # scanning region
        roi = frame[50:250, 50:250]
        img = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (227, 227))

        # scanning move made
        pred = model.predict(np.array([img]))
        move_code = np.argmax(pred[0])

        # setting move using loading comfirmation
        if(move_code != 5):
            user_move_name= loading(move_code)
        else:
            user_move_name = mapper(move_code)

        #display the information
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, user_move_name,
                    (50, 40), font, 0.8, (255, 255, 255), 1, cv2.LINE_AA)
        
        ret, buffer = cv2.imencode('.jpg', frame)

        return buffer, user_move_name, frame