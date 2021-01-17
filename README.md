# Deep Learning RPS

![React](https://img.shields.io/badge/-React-000?style=flat&logo=React)
![Flask](https://img.shields.io/badge/-Flask-000?style=flat&logo=flask)
![CockroachDB](https://img.shields.io/badge/-CockroachDB-000?style=flat&logo=CockroachDB)
![Tensorflow](https://img.shields.io/badge/-Tensorflow-000?style=flat&logo=Tensorflow)

<img src="https://i.imgur.com/9XOcO4R.jpg">

> A web application game based upon the popular rock, paper, scissors, lizard, spock - made popular by the show *The Big Bang Theory*. The app leverages deep-learning and a webcam to authenticate users by their face then recognize their desired play through their hand shape. A game AI has also been implemented to promote thoughtful play. <br/> Made-by: Shrish Mohapatra ([shrish-mohapatra](https://github.com/shrish-mohapatra)), Rajessen Sanassy ([rajykins](https://github.com/Rajykins)), Yousef Yassin ([yyassin](https://github.com/Yyassin))

## Minimum Requirements:
 - Windows 7 or higher.
 - macOS 10.13 or later.
 - python 3.7.6 **or older**
 
 *note: Tensorflow is not supported on newer python versions*

## Features
- Asynchronous user registration/authentication using face detection -> all data is saved locally with *CockroachDB*
- Initial onboarding calibration process:
    - Asynchronously analyze user webcam stream by persisting images to local cockroach database.
    - Notify players of game instructions and verify knowledge of 5 hand symbols.
    - Calibrate AI with the hand symbols the user provides by updating detection model with tensorflow.
- Play RPLSS with advanced AI
    - Implemented first-order markov-chain based AI that records game states.
    - Based on previous state, calculates the users next most likely move by computing maximum probability with Bayesian theorem.A
    - For example, if the player engages in a specific strategy or plays a certain pattern/move consistently; the AI will begin to learn and win consistently.
    - Loss prevention method acheived by random selection.

## Built With

* ReactJS | context
* Flask | websockets
* CockroachDB
* SQL Alchemy
* openCV
* TensorFlow

*Multithreading enabled for asynchronous image processing*

### Running the Application

You will first need to clone the repository to your local machine:
```
git clone https://github.com/Rajykins/Deep-Learning-Rock-Paper-Scissors
```
* Install [CockroachDB](https://www.cockroachlabs.com/docs/v20.2/install-cockroachdb-windows.html/).

* Navigate to the DB directory and setup Database:
```
cd ~/cockroach
./cockroach.exe demo --empty
CREATE DATABASE dbrps
CREATE USER dbADmin WITH PASSWORD password
GRANT ALL ON DATABASE dprps to dbAdmin
```

* Navigate to the appropriate application directory from terminal:
```
cd ~/Deep-Learning-Rock-Paper-Scissors
```

* (Optional) Setup and activate a virtual environment for dependencies:
```
pip install virtualenv
virtualenv venv
venv/Scripts/activate
```

* Install required dependencies :
```
pip install -r requirements.txt
```

* Create the required directories under `/server` :
```
./server/snapshots
./server/face_images
./server/face_cascade
```

* Run the application :
```
flask run
```

* Initialize the database application by navigating to the `/createDB` endpoint [here](http://localhost:5000/createDB)

* Visit the home page to get started: [localhost:5000](http://localhost:5000/)

* Enjoy! 🎉

## Using Project

1. Users will be prompted with a *Signin* card where users can register their face to the database.
2. Users can alternatively select *Login* if their face has already been scanned.
3. There is a calibration process where users will be prompted with the various moves of the game.
4. To start playing the game, click the **Start** button and the rounds will begin.
    - A bar will indicate how much time is left for the round
    - Perform your move in the designated area each round
    - Points are awarded for wins against the AI
    - Past moves are shown in descending order