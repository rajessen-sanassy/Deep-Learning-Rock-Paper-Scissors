import random
import itertools

win_dict = {
    'rock' : {'scissors': 'crushes', 'lizard': 'crushes'},
    'paper': {'rock': 'covers', 'spock': 'disproves'} ,
    'scissors': {'paper': 'cuts', 'lizard': 'decapitates'},
    'lizard': {'spock': 'poisons', 'paper': 'eats'},
    'spock': {'rock': 'vaporizes', 'scissors': 'smashes'}
}

'''
string matching, markov-bayesian, maximum-likelihood, random
'''

'''
Bayesian:

P(B|A) = P(A|B) * P(B)/P(A)
Assume player played X last. Compute winning P of next move for AI.
'''

class Markov_Chain:
    def __init__(self, order, win=False, decay=1.0):
        self.order = order
        self.win = win
        self.decay = decay
        self.chain = self.markov_construct()
        self.total = 0
        self.loss_streak = 0
        self.history = None
        
    def keys_construct(self):
        #Spock is K
        options = ['R', 'P', 'S', 'L', 'K']
        keys = []

        for comb in itertools.permutations(options, self.order):
            key = ''.join(comb)
            keys.append(key)

        if self.win:
            win_keys = []
            for key in keys:
                for outcome in ['W', 'L']:
                    win_key = key + outcome
                    win_keys.append(win_key)

            return win_keys

        return keys

    def markov_construct(self) :
        def matrix_construct(keys):
            matrix = {}
            for key in keys:
                matrix[key] = {'R': 0, 'P': 0, 'S': 0, 'L': 0, 'K': 0}
            return matrix


        keys = self.keys_construct()
        matrix = matrix_construct(keys)
        return matrix

    def update(self, rec_move, history):
        # unlearn old state
        for move in self.chain[history]:
            self.chain[history][move] *= self.decay

        self.chain[history][rec_move] += 1
        self.total += 1

    def predict(self, history):
        node = self.chain[history]

        # if tie or not enough data
        if max(node.values()) == min(node.values()):
            return random.choice(['R', 'P', 'S', 'L', 'K'])

        else:
            return max(self.chain[history], key = self.chain[history].get)

    def compute(self, predictions, history):
        # R, L => [P, K], [R, S]
        beat = {'R': ['P', 'K'], 'P': ['S', 'L'], 'S':['R', 'K'], 'L':['R', 'S'], 'K':['P', 'L']}
        state = self.chain[history]
        comp = []

        for option in predictions:
            sum = 0
            for sup in beat[option]:
                sum += self.chain[history][sup]

            comp.append(sum)

        optimal = predictions[comp.index(max(comp))]        

        return optimal